import { NextRequest } from 'next/server'
import { getAuthSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, createPagination } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const type = searchParams.get('type') // project, study, mentoring
    const status = searchParams.get('status') // recruiting, inProgress, completed, closed
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'latest' // latest, popular, deadline

    const skip = (page - 1) * limit

    let where: any = {}
    
    if (type) {
      where.type = type
    }
    
    if (status) {
      where.status = status
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    let orderBy: any = {}
    switch (sortBy) {
      case 'popular':
        orderBy = { likesCount: 'desc' }
        break
      case 'deadline':
        orderBy = { createdAt: 'asc' }
        break
      default:
        orderBy = { createdAt: 'desc' }
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
          location: true,
          duration: true,
          schedule: true,
          currentMembers: true,
          maxMembers: true,
          requirements: true,
          benefits: true,
          likesCount: true,
          commentsCount: true,
          viewsCount: true,
          applicationsCount: true,
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
                  color: true,
                },
              },
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
      requirements: typeof post.requirements === 'string' 
        ? JSON.parse(post.requirements as string) 
        : post.requirements,
      benefits: typeof post.benefits === 'string'
        ? JSON.parse(post.benefits as string)
        : post.benefits,
      tags: post.tags.map(tag => ({
        ...tag.tech,
        id: tag.tech.id.toString()
      })),
      author: {
        ...post.author,
        id: post.author.id.toString()
      }
    }))

    const pagination = createPagination(page, limit, total)

    return successResponse(formattedPosts, 200, pagination)
  } catch (error) {
    console.error('포스트 목록 조회 오류:', error)
    return errorResponse('서버 오류가 발생했습니다.', 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession()

    if (!session?.user?.id) {
      return errorResponse('인증이 필요합니다.', 401)
    }

    const body = await request.json()
    const {
      title,
      description,
      type,
      location,
      duration,
      schedule,
      maxMembers,
      requirements,
      benefits,
      techIds
    } = body

    if (!title || !description || !type || !maxMembers) {
      return errorResponse('필수 필드가 누락되었습니다.', 400)
    }

    const post = await prisma.post.create({
      data: {
        title,
        description,
        type,
        location: location || '온라인',
        duration,
        schedule,
        maxMembers,
        requirements: requirements ? JSON.stringify(requirements) : JSON.stringify([]),
        benefits: benefits ? JSON.stringify(benefits) : JSON.stringify([]),
        authorId: session.user.id,
        tags: techIds ? {
          create: techIds.map((techId: number) => ({
            techId,
          }))
        } : undefined,
      },
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
        tags: {
          include: {
            tech: {
              select: {
                id: true,
                name: true,
                slug: true,
                color: true,
              },
            },
          },
        },
      },
    })

    const formattedPost = {
      ...post,
      id: post.id.toString(),
      requirements: typeof post.requirements === 'string' 
        ? JSON.parse(post.requirements as string) 
        : post.requirements,
      benefits: typeof post.benefits === 'string'
        ? JSON.parse(post.benefits as string)
        : post.benefits,
      tags: post.tags.map(tag => ({
        ...tag.tech,
        id: tag.tech.id.toString()
      })),
      author: {
        ...post.author,
        id: post.author.id.toString()
      }
    }

    return successResponse(formattedPost, 201)
  } catch (error) {
    console.error('포스트 생성 오류:', error)
    return errorResponse('서버 오류가 발생했습니다.', 500)
  }
}