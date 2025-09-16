import { NextRequest } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { createCommentLikeNotification } from "@/lib/notification";

// POST /api/comments/[id]/like - 댓글 좋아요 토글
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthSession();
    const userId = session?.user?.id || "temp-user-id";

    const { id } = await params;
    const commentId = parseInt(id);

    // 댓글 존재 확인
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { 
        id: true, 
        authorId: true,
        post: {
          select: {
            title: true
          }
        }
      },
    });

    if (!comment) {
      return errorResponse("댓글을 찾을 수 없습니다.", 404);
    }

    // 기존 좋아요 확인
    const existingLike = await prisma.commentLike.findUnique({
      where: {
        userId_commentId: {
          userId,
          commentId,
        },
      },
    });

    if (existingLike) {
      // 좋아요 취소
      await prisma.$transaction([
        prisma.commentLike.delete({
          where: { id: existingLike.id },
        }),
        prisma.comment.update({
          where: { id: commentId },
          data: { likesCount: { decrement: 1 } },
        }),
      ]);

      return successResponse({
        liked: false,
        message: "좋아요를 취소했습니다.",
      });
    } else {
      // 좋아요 추가
      await prisma.$transaction([
        prisma.commentLike.create({
          data: {
            userId,
            commentId,
          },
        }),
        prisma.comment.update({
          where: { id: commentId },
          data: { likesCount: { increment: 1 } },
        }),
      ]);

      // 자신의 댓글이 아닌 경우에만 알람 생성
      if (comment.authorId !== userId) {
        await createCommentLikeNotification(
          commentId,
          userId,
          comment.authorId,
          comment.post.title
        );
      }

      return successResponse({
        liked: true,
        message: "좋아요를 추가했습니다.",
      });
    }
  } catch (error) {
    console.error("댓글 좋아요 토글 오류:", error);
    return errorResponse("서버 오류가 발생했습니다.", 500);
  }
}

// GET /api/comments/[id]/like - 사용자의 댓글 좋아요 상태 확인
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthSession();
    const userId = session?.user?.id || "temp-user-id";

    const { id } = await params;
    const commentId = parseInt(id);

    const like = await prisma.commentLike.findUnique({
      where: {
        userId_commentId: {
          userId,
          commentId,
        },
      },
    });

    return successResponse({
      liked: !!like,
      likedAt: like?.createdAt || null,
    });
  } catch (error) {
    console.error("댓글 좋아요 상태 확인 오류:", error);
    return errorResponse("서버 오류가 발생했습니다.", 500);
  }
}
