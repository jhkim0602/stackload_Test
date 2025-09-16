import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, createPagination } from '@/lib/api-response'

// GET /api/posts/search - 고급 검색 및 필터링
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const query = searchParams.get('q') // 검색 키워드
    const type = searchParams.get('type') // project, study, mentoring
    const status = searchParams.get('status') // recruiting, inProgress, completed, closed
    const tags = searchParams.get('tags') // comma-separated tag slugs
    const location = searchParams.get('location')
    const sortBy = searchParams.get('sortBy') || 'relevance' // relevance, latest, popular, deadline
    const minMembers = parseInt(searchParams.get('minMembers') || '0')

    const skip = (page - 1) * limit

    let where: any = {}
    
    // 타입 필터
    if (type) {
      where.type = type
    }
    
    // 상태 필터
    if (status) {
      where.status = status
    }
    
    // 키워드 검색 (제목, 설명, 요구사항, 혜택에서 검색)
    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ]
    }

    // 태그 기반 필터링 (정확히 일치하는 태그들)
    if (tags) {
      const tagSlugs = tags.split(',').map(tag => tag.trim()).filter(Boolean)
      if (tagSlugs.length > 0) {
        where.tags = {
          some: {
            tech: {
              slug: { in: tagSlugs }
            }
          }
        }
      }
    }

    // 위치 기반 필터링 (현재는 Post 모델에 location 필드가 없으므로 주석 처리)
    // if (location) {
    //   where.location = { contains: location, mode: 'insensitive' }
    // }

    // 정렬 옵션
    let orderBy: any = {}
    switch (sortBy) {
      case 'latest':
        orderBy = { createdAt: 'desc' }
        break
      case 'popular':
        orderBy = [
          { likesCount: 'desc' },
          { commentsCount: 'desc' },
          { viewsCount: 'desc' }
        ]
        break
      case 'deadline':
        orderBy = { createdAt: 'asc' }
        break
      case 'relevance':
      default:
        // 관련성 기반 정렬: 좋아요 + 댓글 + 조회수 종합
        orderBy = [
          { likesCount: 'desc' },
          { commentsCount: 'desc' },
          { createdAt: 'desc' }
        ]
        break
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          description: true,
          type: true,
          status: true,
          likesCount: true,
          commentsCount: true,
          viewsCount: true,
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
            select: {
              tech: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.post.count({ where }),
    ])

    const formattedPosts = posts.map(post => ({
      ...post,
      id: post.id.toString(),
      tags: post.tags.map(tag => ({
        ...tag.tech,
        id: tag.tech.id.toString()
      })),
      author: {
        ...post.author,
        id: post.author.id.toString()
      },
      stats: {
        likes: post._count.likes,
        comments: post._count.comments,
      },
      // relevanceScore 계산 (검색 결과 랭킹용)
      relevanceScore: post.likesCount * 3 + post.commentsCount * 2 + post.viewsCount * 1
    }))

    // relevance 정렬일 때 relevanceScore로 재정렬
    if (sortBy === 'relevance' && query) {
      formattedPosts.sort((a, b) => b.relevanceScore - a.relevanceScore)
    }

    const pagination = createPagination(page, limit, total)

    return successResponse({
      posts: formattedPosts,
      filters: {
        query,
        type,
        status,
        tags: tags?.split(',').map(t => t.trim()).filter(Boolean) || [],
        location,
        sortBy,
        minMembers
      },
      aggregations: {
        totalPosts: total,
        // 태그별 게시글 수 집계는 필요시 추가 구현
      }
    }, 200, pagination)
  } catch (error) {
    console.error('고급 검색 오류:', error)
    return errorResponse('서버 오류가 발생했습니다.', 500)
  }
}