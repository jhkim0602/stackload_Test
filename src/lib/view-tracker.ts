import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

interface ViewedPost {
  postId: number;
  viewedAt: number;
}

const VIEW_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24시간 (밀리초)

/**
 * 세션 기반으로 조회수를 안전하게 증가시킵니다
 * 같은 세션에서 24시간 내에 재방문 시 조회수가 증가하지 않습니다
 */
export async function incrementViewCount(request: NextRequest, postId: number): Promise<boolean> {
  try {
    const viewedPosts = getViewedPostsFromRequest(request);
    const now = Date.now();
    
    // 만료된 조회 기록 제거
    const validViewedPosts = viewedPosts.filter(viewed => 
      (now - viewed.viewedAt) < VIEW_EXPIRY_TIME
    );

    // 이미 조회한 게시글인지 확인
    const alreadyViewed = validViewedPosts.some(viewed => 
      viewed.postId === postId
    );

    if (!alreadyViewed) {
      // 조회수 증가
      await prisma.post.update({
        where: { id: postId },
        data: { viewsCount: { increment: 1 } },
      });

      return true; // 조회수가 증가됨
    }

    return false; // 이미 조회한 게시글
  } catch (error) {
    console.error('조회수 증가 오류:', error);
    // 오류 발생 시 조회수 증가 (기존 동작 유지)
    try {
      await prisma.post.update({
        where: { id: postId },
        data: { viewsCount: { increment: 1 } },
      });
      return true;
    } catch (dbError) {
      console.error('데이터베이스 조회수 증가 오류:', dbError);
      return false;
    }
  }
}

/**
 * 업데이트된 조회 기록을 쿠키로 설정하기 위한 헤더값을 생성합니다
 */
export function createViewedPostsCookie(viewedPosts: ViewedPost[]): string {
  const now = Date.now();
  
  // 만료된 기록 제거 및 최대 100개 제한
  const filteredPosts = viewedPosts
    .filter(viewed => (now - viewed.viewedAt) < VIEW_EXPIRY_TIME)
    .slice(-100); // 최신 100개만 유지

  return encodeURIComponent(JSON.stringify(filteredPosts));
}

/**
 * 현재 요청에서 조회 기록을 가져옵니다
 */
export function getViewedPostsFromRequest(request: NextRequest): ViewedPost[] {
  const viewedPostsCookie = request.cookies.get('viewed_posts')?.value;
  
  if (!viewedPostsCookie) {
    return [];
  }

  try {
    const viewedPosts = JSON.parse(decodeURIComponent(viewedPostsCookie));
    return Array.isArray(viewedPosts) ? viewedPosts : [];
  } catch (error) {
    console.warn('조회 기록 쿠키 파싱 오류:', error);
    return [];
  }
}