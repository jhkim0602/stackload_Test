import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";

// 댓글 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getAuthSession();
    
    if (!session?.user?.id) {
      return errorResponse("로그인이 필요합니다", 401);
    }

    const { content } = await request.json();
    
    if (!content || content.trim().length === 0) {
      return errorResponse("댓글 내용이 필요합니다", 400);
    }

    // 댓글 조회 및 권한 확인
    const existingComment = await prisma.techComment.findUnique({
      where: { id: parseInt(id) },
      include: {
        author: true
      }
    });

    if (!existingComment) {
      return errorResponse("댓글을 찾을 수 없습니다", 404);
    }

    if (existingComment.authorId !== session.user.id) {
      return errorResponse("댓글을 수정할 권한이 없습니다", 403);
    }

    // 댓글 수정
    const updatedComment = await prisma.techComment.update({
      where: { id: parseInt(id) },
      data: {
        content: content.trim(),
        updatedAt: new Date()
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            level: true
          }
        },
        likes: {
          select: {
            id: true,
            userId: true
          }
        }
      }
    });

    return successResponse({
      ...updatedComment,
      id: updatedComment.id.toString(),
      techId: updatedComment.techId.toString(),
      parentId: updatedComment.parentId?.toString() || null,
      author: {
        ...updatedComment.author,
        id: updatedComment.author.id.toString()
      }
    });

  } catch (error) {
    console.error("댓글 수정 오류:", error);
    return errorResponse("댓글 수정 중 오류가 발생했습니다", 500);
  }
}

// 댓글 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getAuthSession();
    
    if (!session?.user?.id) {
      return errorResponse("로그인이 필요합니다", 401);
    }

    // 댓글 조회 및 권한 확인
    const existingComment = await prisma.techComment.findUnique({
      where: { id: parseInt(id) },
      include: {
        author: true
      }
    });

    if (!existingComment) {
      return errorResponse("댓글을 찾을 수 없습니다", 404);
    }

    if (existingComment.authorId !== session.user.id) {
      return errorResponse("댓글을 삭제할 권한이 없습니다", 403);
    }

    // 트랜잭션으로 댓글과 관련 데이터 삭제
    await prisma.$transaction(async (tx) => {
      // 좋아요 삭제
      await tx.techCommentLike.deleteMany({
        where: { commentId: parseInt(id) }
      });

      // 대댓글이 있다면 대댓글도 삭제
      if (!existingComment.parentId) {
        const replies = await tx.techComment.findMany({
          where: { parentId: parseInt(id) }
        });

        for (const reply of replies) {
          // 대댓글의 좋아요도 삭제
          await tx.techCommentLike.deleteMany({
            where: { commentId: reply.id }
          });
        }

        // 대댓글들 삭제
        await tx.techComment.deleteMany({
          where: { parentId: parseInt(id) }
        });
      }

      // 댓글 삭제
      await tx.techComment.delete({
        where: { id: parseInt(id) }
      });
    });

    return successResponse({ message: "댓글이 삭제되었습니다" });

  } catch (error) {
    console.error("댓글 삭제 오류:", error);
    return errorResponse("댓글 삭제 중 오류가 발생했습니다", 500);
  }
}