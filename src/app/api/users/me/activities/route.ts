import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { successResponse, errorResponse } from '@/lib/api-response';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return errorResponse('인증이 필요합니다', 401);
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return errorResponse('사용자를 찾을 수 없습니다', 404);
    }

    // 사용자의 활동 내역을 조회 (게시글, 댓글 등)
    // 현재는 빈 배열을 반환하지만, 실제로는 Post, Comment 등의 테이블에서 조회해야 함
    const activities: Array<{
      id: string;
      type: 'post' | 'comment' | 'like' | 'study' | 'project';
      title: string;
      action: string;
      createdAt: string;
      likes?: number;
      comments?: number;
    }> = [];

    // TODO: 실제 활동 데이터 조회 로직 구현
    // const posts = await prisma.post.findMany({
    //   where: { authorId: user.id },
    //   orderBy: { createdAt: 'desc' },
    //   take: 10
    // });
    
    // const comments = await prisma.comment.findMany({
    //   where: { authorId: user.id },
    //   orderBy: { createdAt: 'desc' },
    //   take: 10,
    //   include: { post: true }
    // });

    return successResponse(activities);
  } catch (error) {
    console.error('활동 내역 조회 오류:', error);
    return errorResponse('활동 내역을 조회할 수 없습니다', 500);
  }
}