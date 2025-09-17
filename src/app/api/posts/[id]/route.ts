import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { incrementViewCount, getViewedPostsFromRequest, createViewedPostsCookie } from "@/lib/view-tracker";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const postId = parseInt(id);

    // 세션 기반 조회수 증가 (중복 방지)
    const viewIncremented = await incrementViewCount(request, postId);
    let viewedPosts = getViewedPostsFromRequest(request);
    
    // 조회수가 증가된 경우 현재 게시글 추가
    if (viewIncremented) {
      const now = Date.now();
      // 만료된 기록 제거 및 현재 게시글 추가
      viewedPosts = viewedPosts.filter(viewed => 
        (now - viewed.viewedAt) < 24 * 60 * 60 * 1000
      );
      viewedPosts.push({
        postId,
        viewedAt: now
      });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            image: true,
            level: true,
            bio: true,
            location: true,
            socialLinks: true,
            postsCount: true,
            likesReceivedCount: true,
            commentsCount: true,
          },
        },
        tags: {
          include: {
            tech: {
              select: {
                id: true,
                name: true,
                slug: true,
                category: true,
              },
            },
          },
        },
        comments: {
          select: {
            id: true,
            content: true,
            author: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
                image: true,
              },
            },
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    if (!post) {
      return errorResponse("포스트를 찾을 수 없습니다.", 404);
    }

    const formattedPost = {
      ...post,
      id: post.id.toString(),
      tags: post.tags.map((tag) => tag.tech),
      likesCount: post._count.likes,
      commentsCount: post._count.comments,
      comments: post.comments.map((comment) => ({
        ...comment,
        id: comment.id.toString(),
      })),
    };

    // 응답에 업데이트된 조회 기록 쿠키 설정
    const response = NextResponse.json(
      {
        success: true,
        data: formattedPost
      },
      { status: 200 }
    );

    // 쿠키 업데이트
    const cookieValue = createViewedPostsCookie(viewedPosts);
    response.cookies.set('viewed_posts', cookieValue, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24시간
      path: '/'
    });

    return response;
  } catch (error) {
    console.error("포스트 조회 오류:", error);
    return errorResponse("서버 오류가 발생했습니다.", 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthSession();

    if (!session?.user?.id) {
      return errorResponse("인증이 필요합니다.", 401);
    }

    const { id } = await params;

    const postId = parseInt(id);
    const body = await request.json();

    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!existingPost) {
      return errorResponse("포스트를 찾을 수 없습니다.", 404);
    }

    if (existingPost.authorId !== session.user.id) {
      return errorResponse("수정 권한이 없습니다.", 403);
    }

    const { title, description, type, status, techIds } = body;

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(type && { type }),
        ...(status && { status }),
        ...(techIds && {
          tags: {
            deleteMany: {},
            create: techIds.map((techId: number) => ({ techId })),
          },
        }),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            image: true,
            level: true,
          },
        },
        tags: {
          include: {
            tech: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    const formattedPost = {
      ...updatedPost,
      id: updatedPost.id.toString(),
      tags: updatedPost.tags.map((tag) => tag.tech),
    };

    return successResponse(formattedPost);
  } catch (error) {
    console.error("포스트 수정 오류:", error);
    return errorResponse("서버 오류가 발생했습니다.", 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthSession();

    if (!session?.user?.id) {
      return errorResponse("인증이 필요합니다.", 401);
    }

    const { id } = await params;

    const postId = parseInt(id);

    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!existingPost) {
      return errorResponse("포스트를 찾을 수 없습니다.", 404);
    }

    if (existingPost.authorId !== session.user.id) {
      return errorResponse("삭제 권한이 없습니다.", 403);
    }

    await prisma.post.delete({
      where: { id: postId },
    });

    return successResponse({ message: "포스트가 삭제되었습니다." });
  } catch (error) {
    console.error("포스트 삭제 오류:", error);
    return errorResponse("서버 오류가 발생했습니다.", 500);
  }
}
