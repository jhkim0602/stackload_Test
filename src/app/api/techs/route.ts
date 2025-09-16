import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, createPagination } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'popularity' // name, popularity, latest
    const countOnly = searchParams.get('countOnly') === 'true'

    const skip = (page - 1) * limit

    let where: any = {}
    
    if (category) {
      where.category = { contains: category, mode: 'insensitive' }
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    let orderBy: any = {}
    switch (sortBy) {
      case 'name':
        orderBy = { name: 'asc' }
        break
      case 'latest':
        orderBy = { createdAt: 'desc' }
        break
      default:
        orderBy = { popularity: 'desc' }
    }

    // countOnly 파라미터가 있으면 카운트만 반환
    if (countOnly) {
      const total = await prisma.tech.count({ where })
      return successResponse({ count: total })
    }

    const [techs, total] = await Promise.all([
      prisma.tech.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
          category: true,
          description: true,
          logoUrl: true,
          popularity: true,
          learningResources: true,
          _count: {
            select: {
              postTags: true,
            },
          },
          createdAt: true,
        },
      }),
      prisma.tech.count({ where }),
    ])

    const formattedTechs = techs.map(tech => ({
      ...tech,
      id: tech.id.toString(),
      learningResources: typeof tech.learningResources === 'string' 
        ? JSON.parse(tech.learningResources as string) 
        : tech.learningResources,
      postCount: tech._count.postTags,
    }))

    const pagination = createPagination(page, limit, total)

    return successResponse(formattedTechs, 200, pagination)
  } catch (error) {
    console.error('기술 목록 조회 오류:', error)
    return errorResponse('서버 오류가 발생했습니다.', 500)
  }
}


