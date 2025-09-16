import { NextRequest } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { createPostLikeNotification } from "@/lib/notification";

// POST /api/posts/[id]/like - 게시글 좋아요 토글
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthSession();

    console.log("Session data:", session);

    let userId: string;

    // 실제 세션이 있는 경우
    if (session?.user) {
      // 세션에 ID가 있으면 사용하되, 데이터베이스에 실제 존재하는지 확인
      if (session.user.id) {
        const userExists = await prisma.user.findUnique({
          where: { id: session.user.id },
        });

        if (userExists) {
          userId = session.user.id;
          console.log("Using session user ID:", userId);
        } else {
          // 세션 ID가 데이터베이스에 없으면 이메일로 조회
          if (session.user.email) {
            const user = await prisma.user.findUnique({
              where: { email: session.user.email },
            });

            if (user) {
              userId = user.id;
              console.log("Found user by email:", userId);
            } else {
              // 새 사용자 생성
              const newUser = await prisma.user.create({
                data: {
                  email: session.user.email,
                  name: session.user.name || "Anonymous",
                  image: session.user.image,
                },
              });
              userId = newUser.id;
              console.log("Created new user:", userId);
            }
          } else {
            return errorResponse("사용자 정보를 찾을 수 없습니다.", 401);
          }
        }
      } else if (session.user.email) {
        // 세션에 ID가 없으면 이메일로 조회하거나 생성
        const user = await prisma.user.findUnique({
          where: { email: session.user.email },
        });

        if (user) {
          userId = user.id;
          console.log("Found user by email:", userId);
        } else {
          // 새 사용자 생성
          const newUser = await prisma.user.create({
            data: {
              email: session.user.email,
              name: session.user.name || "Anonymous",
              image: session.user.image,
            },
          });
          userId = newUser.id;
          console.log("Created new user:", userId);
        }
      } else {
        return errorResponse("사용자 정보를 찾을 수 없습니다.", 401);
      }
    } else {
      // 테스트용 임시 사용자 (실제 운영 시에는 제거)
      userId = "test-user-1";
      console.log("Using test user ID for development:", userId);
    }

    const { id } = await params;
    const postId = parseInt(id);

    console.log("Like request - userId:", userId, "postId:", postId);

    // 게시글 존재 확인
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { 
        id: true, 
        authorId: true, 
        title: true 
      },
    });

    if (!post) {
      return errorResponse("게시글을 찾을 수 없습니다.", 404);
    }

    // 사용자 존재 확인 (세션 사용자의 경우)
    if (session?.user?.id) {
      const userExists = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true },
      });

      if (!userExists) {
        return errorResponse("사용자 정보를 찾을 수 없습니다.", 404);
      }
    }

    // 기존 좋아요 확인
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    let updatedPost;

    if (existingLike) {
      // 좋아요 취소
      const [, post] = await prisma.$transaction([
        prisma.like.delete({
          where: { id: existingLike.id },
        }),
        prisma.post.update({
          where: { id: postId },
          data: { likesCount: { decrement: 1 } },
          select: { likesCount: true },
        }),
      ]);
      updatedPost = post;

      return successResponse({
        isLiked: false,
        likesCount: updatedPost.likesCount,
        message: "좋아요를 취소했습니다.",
      });
    } else {
      // 좋아요 추가
      const [, updatedPostResult] = await prisma.$transaction([
        prisma.like.create({
          data: {
            userId,
            postId,
          },
        }),
        prisma.post.update({
          where: { id: postId },
          data: { likesCount: { increment: 1 } },
          select: { likesCount: true },
        }),
      ]);
      updatedPost = updatedPostResult;

      // 자신의 글이 아닌 경우에만 알람 생성
      if (post.authorId !== userId) {
        await createPostLikeNotification(
          postId,
          userId,
          post.title,
          post.authorId
        );
      }

      return successResponse({
        isLiked: true,
        likesCount: updatedPost.likesCount,
        message: "좋아요를 추가했습니다.",
      });
    }
  } catch (error) {
    console.error("좋아요 토글 오류:", error);
    return errorResponse("서버 오류가 발생했습니다.", 500);
  }
}

// GET /api/posts/[id]/like - 사용자의 좋아요 상태 확인
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthSession();

    let userId: string;

    // 실제 세션이 있는 경우
    if (session?.user) {
      // 세션에 ID가 있으면 사용하되, 데이터베이스에 실제 존재하는지 확인
      if (session.user.id) {
        const userExists = await prisma.user.findUnique({
          where: { id: session.user.id },
        });

        if (userExists) {
          userId = session.user.id;
        } else if (session.user.email) {
          const user = await prisma.user.findUnique({
            where: { email: session.user.email },
          });

          if (user) {
            userId = user.id;
          } else {
            return successResponse({
              isLiked: false,
              likedAt: null,
            });
          }
        } else {
          return successResponse({
            isLiked: false,
            likedAt: null,
          });
        }
      } else if (session.user.email) {
        const user = await prisma.user.findUnique({
          where: { email: session.user.email },
        });

        if (user) {
          userId = user.id;
        } else {
          return successResponse({
            isLiked: false,
            likedAt: null,
          });
        }
      } else {
        return successResponse({
          isLiked: false,
          likedAt: null,
        });
      }
    } else {
      // 테스트용 임시 사용자 (실제 운영 시에는 제거)
      userId = "test-user-1";
    }

    const { id } = await params;
    const postId = parseInt(id);

    const like = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    return successResponse({
      isLiked: !!like,
      likedAt: like?.createdAt || null,
    });
  } catch (error) {
    console.error("좋아요 상태 확인 오류:", error);
    return errorResponse("서버 오류가 발생했습니다.", 500);
  }
}
