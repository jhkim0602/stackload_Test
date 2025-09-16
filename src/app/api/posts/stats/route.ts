import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'

// GET /api/posts/stats - 게시글 통계 및 인기 태그 정보
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 특정 타입의 통계만 보기

    let whereCondition: any = {}
    if (type) {
      whereCondition.type = type
    }

    // 전체 게시글 통계
    const [totalPosts, activeRecruitingPosts, completedProjects] = await Promise.all([
      prisma.post.count({ where: whereCondition }),
      prisma.post.count({ 
        where: { 
          ...whereCondition, 
          status: 'recruiting' 
        } 
      }),
      prisma.post.count({ 
        where: { 
          ...whereCondition, 
          status: 'completed' 
        } 
      })
    ])

    // 타입별 게시글 수
    const postsByType = await prisma.post.groupBy({
      by: ['type'],
      _count: {
        id: true
      },
      where: whereCondition
    })

    // 상태별 게시글 수
    const postsByStatus = await prisma.post.groupBy({
      by: ['status'],
      _count: {
        id: true
      },
      where: whereCondition
    })

    // 위치별 게시글 수는 현재 Post 모델에 location 필드가 없으므로 빈 배열로 대체
    const postsByLocation: any[] = []

    // 인기 태그 (게시글 수 기준 상위 20개)
    const popularTags = await prisma.postTag.groupBy({
      by: ['techId'],
      _count: {
        postId: true
      },
      where: type ? {
        post: {
          type: type as any
        }
      } : undefined,
      orderBy: {
        _count: {
          postId: 'desc'
        }
      },
      take: 20
    })

    // 태그 세부 정보 가져오기
    const tagDetails = await prisma.tech.findMany({
      where: {
        id: {
          in: popularTags.map(tag => tag.techId)
        }
      },
      select: {
        id: true,
        name: true,
        slug: true,
        category: true
      }
    })

    // 태그와 게시글 수를 합쳐서 정렬
    const tagsWithCount = popularTags.map(tag => {
      const tagInfo = tagDetails.find(detail => detail.id === tag.techId)
      return {
        ...tagInfo,
        id: tagInfo?.id.toString(),
        postCount: tag._count.postId
      }
    }).filter(tag => tag.name) // 태그 정보가 있는 것만

    // 월별 게시글 생성 추이 (최근 6개월)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    let monthlyPosts: Array<{ month: Date, count: bigint }>
    
    if (type) {
      monthlyPosts = await prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('month', "created_at") as month,
          COUNT(*) as count
        FROM posts
        WHERE "created_at" >= ${sixMonthsAgo}
          AND "type" = ${type}
        GROUP BY DATE_TRUNC('month', "created_at")
        ORDER BY month DESC
        LIMIT 6
      `
    } else {
      monthlyPosts = await prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('month', "created_at") as month,
          COUNT(*) as count
        FROM posts
        WHERE "created_at" >= ${sixMonthsAgo}
        GROUP BY DATE_TRUNC('month', "created_at")
        ORDER BY month DESC
        LIMIT 6
      `
    }

    const formattedMonthlyPosts = monthlyPosts.map(item => ({
      month: item.month.toISOString().slice(0, 7), // YYYY-MM 형태
      count: Number(item.count)
    }))

    // 활발한 사용자 (게시글 작성자 기준 상위 10명)
    const activeAuthors = await prisma.post.groupBy({
      by: ['authorId'],
      _count: {
        id: true
      },
      where: whereCondition,
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: 10
    })

    const authorDetails = await prisma.user.findMany({
      where: {
        id: {
          in: activeAuthors.map(author => author.authorId)
        }
      },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        image: true,
        level: true
      }
    })

    const authorsWithPostCount = activeAuthors.map(author => {
      const authorInfo = authorDetails.find(detail => detail.id === author.authorId)
      return {
        ...authorInfo,
        postCount: author._count.id
      }
    }).filter(author => author.name)

    return successResponse({
      overview: {
        totalPosts,
        activeRecruitingPosts,
        completedProjects,
        successRate: totalPosts > 0 ? Math.round((completedProjects / totalPosts) * 100) : 0
      },
      breakdown: {
        byType: postsByType.map(item => ({
          type: item.type,
          count: item._count.id
        })),
        byStatus: postsByStatus.map(item => ({
          status: item.status,
          count: item._count.id
        })),
        byLocation: []
      },
      popularTags: tagsWithCount,
      trends: {
        monthly: formattedMonthlyPosts
      },
      activeUsers: authorsWithPostCount
    })
  } catch (error) {
    console.error('게시글 통계 조회 오류:', error)
    return errorResponse('서버 오류가 발생했습니다.', 500)
  }
}