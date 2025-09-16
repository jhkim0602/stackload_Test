import { NextRequest } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";

// GET /api/comments/[id] - 특정 댓글 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const commentId = parseInt(id);

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
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
        replies: {
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
            _count: {
              select: {
                commentLikes: true,
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
        _count: {
          select: {
            replies: true,
            commentLikes: true,
          },
        },
      },
    });

    if (!comment) {
      return errorResponse("댓글을 찾을 수 없습니다.", 404);
    }

    const formattedComment = {
      ...comment,
      id: comment.id.toString(),
      postId: comment.postId.toString(),
      parentId: comment.parentId?.toString() || null,
      repliesCount: comment._count.replies,
      likesCount: comment._count.commentLikes,
      replies: comment.replies.map((reply) => ({
        ...reply,
        id: reply.id.toString(),
        postId: reply.postId.toString(),
        parentId: reply.parentId?.toString() || null,
        likesCount: reply._count.commentLikes,
      })),
    };

    return successResponse(formattedComment);
  } catch (error) {
    console.error("댓글 조회 오류:", error);
    return errorResponse("서버 오류가 발생했습니다.", 500);
  }
}

// PUT /api/comments/[id] - 댓글 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthSession();

    if (!session?.user?.id) {
      return errorResponse("로그인이 필요합니다.", 401);
    }

    const userId = session.user.id;
    const { id } = await params;
    const commentId = parseInt(id);
    const body = await request.json();
    const { content } = body;

    if (!content) {
      return errorResponse("내용이 필요합니다.", 400);
    }

    const existingComment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { authorId: true },
    });

    if (!existingComment) {
      return errorResponse("댓글을 찾을 수 없습니다.", 404);
    }

    if (existingComment.authorId !== userId) {
      return errorResponse("수정 권한이 없습니다.", 403);
    }

    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: { content },
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
        _count: {
          select: {
            replies: true,
            commentLikes: true,
          },
        },
      },
    });

    const formattedComment = {
      ...updatedComment,
      id: updatedComment.id.toString(),
      postId: updatedComment.postId.toString(),
      parentId: updatedComment.parentId?.toString() || null,
      repliesCount: updatedComment._count.replies,
      likesCount: updatedComment._count.commentLikes,
    };

    return successResponse(formattedComment);
  } catch (error) {
    console.error("댓글 수정 오류:", error);
    return errorResponse("서버 오류가 발생했습니다.", 500);
  }
}

// DELETE /api/comments/[id] - 댓글 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthSession();

    if (!session?.user?.id) {
      return errorResponse("로그인이 필요합니다.", 401);
    }

    const userId = session.user.id;
    const { id } = await params;
    const commentId = parseInt(id);

    const existingComment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: {
        authorId: true,
        postId: true,
        parentId: true,
        _count: {
          select: {
            replies: true,
          },
        },
      },
    });

    if (!existingComment) {
      return errorResponse("댓글을 찾을 수 없습니다.", 404);
    }

    if (existingComment.authorId !== userId) {
      return errorResponse("삭제 권한이 없습니다.", 403);
    }

    // 대댓글이 있는 경우 삭제하지 않고 내용만 비움
    if (existingComment._count.replies > 0) {
      await prisma.comment.update({
        where: { id: commentId },
        data: {
          content: "삭제된 댓글입니다.",
          // authorId는 그대로 유지 (삭제된 댓글임을 표시하기 위해)
        },
      });
    } else {
      // 대댓글이 없는 경우 완전 삭제
      await prisma.comment.delete({
        where: { id: commentId },
      });

      // 게시글의 댓글 수 감소
      await prisma.post.update({
        where: { id: existingComment.postId },
        data: { commentsCount: { decrement: 1 } },
      });

      // 대댓글인 경우 부모 댓글의 대댓글 수 감소
      if (existingComment.parentId) {
        await prisma.comment.update({
          where: { id: existingComment.parentId },
          data: { repliesCount: { decrement: 1 } },
        });
      }
    }

    return successResponse({ message: "댓글이 삭제되었습니다." });
  } catch (error) {
    console.error("댓글 삭제 오류:", error);
    return errorResponse("서버 오류가 발생했습니다.", 500);
  }
}
