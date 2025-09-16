import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    if (!slug) {
      return errorResponse('기술 스택 슬러그가 필요합니다.', 400)
    }

    const tech = await prisma.tech.findUnique({
      where: { slug },
      include: {
        postTags: {
          select: {
            post: {
              select: {
                id: true,
                title: true,
                type: true,
                status: true,
                author: {
                  select: {
                    id: true,
                    name: true,
                    avatarUrl: true,
                    image: true,
                  },
                },
                likesCount: true,
                commentsCount: true,
                createdAt: true,
              },
            },
          },
          orderBy: {
            post: {
              createdAt: 'desc',
            },
          },
          take: 10,
        },
        _count: {
          select: {
            postTags: true,
          },
        },
      },
    })

    if (!tech) {
      return errorResponse('기술 스택을 찾을 수 없습니다.', 404)
    }

    // 인기도 업데이트 (간단한 조회수 기반)
    await prisma.tech.update({
      where: { slug },
      data: { popularity: { increment: 1 } },
    })

    const formattedTech = {
      ...tech,
      id: tech.id.toString(),
      learningResources: typeof tech.learningResources === 'string' 
        ? JSON.parse(tech.learningResources as string) 
        : tech.learningResources,
      postCount: tech._count.postTags,
      recentPosts: tech.postTags.map(tag => ({
        ...tag.post,
        id: tag.post.id.toString(),
      })),
    }

    // postTags와 _count는 응답에서 제거
    const { postTags, _count, ...result } = formattedTech

    return successResponse(result)
  } catch (error) {
    console.error('기술 상세 조회 오류:', error)
    return errorResponse('서버 오류가 발생했습니다.', 500)
  }
}