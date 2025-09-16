import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, createPagination } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const countOnly = searchParams.get('countOnly') === 'true'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')
    
    const skip = (page - 1) * limit

    let where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (countOnly) {
      const count = await prisma.user.count({ where })
      return successResponse({ count }, 200)
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          avatarUrl: true,
          level: true,
          createdAt: true,
        },
      }),
      prisma.user.count({ where }),
    ])

    const formattedUsers = users.map(user => ({
      ...user,
      id: user.id.toString()
    }))

    const pagination = createPagination(page, limit, total)

    return successResponse(formattedUsers, 200, pagination)
  } catch (error) {
    console.error('사용자 목록 조회 오류:', error)
    return errorResponse('서버 오류가 발생했습니다.', 500)
  }
}