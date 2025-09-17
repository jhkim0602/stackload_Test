import { NextRequest } from 'next/server'
import { getAuthSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, createPagination } from '@/lib/api-response'

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get a list of posts
 *     description: Retrieves a paginated list of posts, with options for filtering and sorting.
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number to retrieve.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of posts to retrieve per page.
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [project, study, mentoring]
 *         description: Filter posts by type.
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [recruiting, inProgress, completed, closed]
 *         description: Filter posts by status.
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         description: Comma-separated list of tech slugs to filter by (e.g., "react,nodejs").
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [latest, popular]
 *           default: latest
 *         description: The sorting order for the posts.
 *     responses:
 *       200:
 *         description: A successful response, returning a list of posts and pagination details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       500:
 *         description: Internal server error.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const countOnly = searchParams.get('countOnly') === 'true'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const type = searchParams.get('type') // project, study, mentoring
    const status = searchParams.get('status') // recruiting, inProgress, completed, closed
    const search = searchParams.get('search')
    const tags = searchParams.get('tags') // comma-separated tag slugs: "react,nodejs,typescript"
    const authorId = searchParams.get('authorId') // filter by author
    const sortBy = searchParams.get('sortBy') || 'latest' // latest, popular

    const skip = (page - 1) * limit

    let where: any = {}
    
    if (type) {
      where.type = type
    }
    
    if (status) {
      where.status = status
    }

    if (authorId) {
      where.authorId = authorId
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    // 태그 기반 필터링
    if (tags) {
      const tagSlugs = tags.split(',').map(tag => tag.trim())
      where.tags = {
        some: {
          tech: {
            slug: {
              in: tagSlugs
            }
          }
        }
      }
    }


    if (countOnly) {
      const count = await prisma.post.count({ where })
      return successResponse({ count }, 200)
    }

    let orderBy: any = {}
    switch (sortBy) {
      case 'popular':
        orderBy = { likesCount: 'desc' }
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

    if (!session?.user) {
      return errorResponse('로그인이 필요합니다.', 401)
    }

    let userId: string;

    // 실제 세션이 있는 경우
    if (session.user.id) {
      const userExists = await prisma.user.findUnique({
        where: { id: session.user.id }
      })
      
      if (userExists) {
        userId = session.user.id
        console.log('Using session user ID:', userId)
      } else {
        // 세션 ID가 데이터베이스에 없으면 이메일로 조회
        if (session.user.email) {
          const user = await prisma.user.findUnique({
            where: { email: session.user.email }
          })
          
          if (user) {
            userId = user.id
            console.log('Found user by email:', userId)
          } else {
            // 새 사용자 생성
            const newUser = await prisma.user.create({
              data: {
                email: session.user.email,
                name: session.user.name || 'Anonymous',
                image: session.user.image,
              }
            })
            userId = newUser.id
            console.log('Created new user:', userId)
          }
        } else {
          return errorResponse('사용자 정보를 찾을 수 없습니다.', 401)
        }
      }
    } else if (session.user.email) {
      // 세션에 ID가 없으면 이메일로 조회하거나 생성
      const user = await prisma.user.findUnique({
        where: { email: session.user.email }
      })

      if (user) {
        userId = user.id
        console.log('Found user by email:', userId)
      } else {
        // 새 사용자 생성
        const newUser = await prisma.user.create({
          data: {
            email: session.user.email,
            name: session.user.name || 'Anonymous',
            image: session.user.image,
          }
        })
        userId = newUser.id
        console.log('Created new user:', userId)
      }
    } else {
      return errorResponse('사용자 정보를 찾을 수 없습니다.', 401)
    }

    const body = await request.json()
    const {
      title,
      description,
      type,
      techIds
    } = body

    if (!title || !description || !type) {
      return errorResponse('필수 필드가 누락되었습니다.', 400)
    }

    const post = await prisma.post.create({
      data: {
        title,
        description,
        type,
        authorId: userId,
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
              },
            },
          },
        },
      },
    })

    const formattedPost = {
      ...post,
      id: post.id.toString(),
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