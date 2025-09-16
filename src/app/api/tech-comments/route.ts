import { NextRequest } from 'next/server'
import { getAuthSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, createPagination } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const techId = searchParams.get('techId')
    const parentId = searchParams.get('parentId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    
    if (!techId) {
      return errorResponse('기술 ID가 필요합니다.', 400)
    }

    const skip = (page - 1) * limit

    let where: any = {
      techId: parseInt(techId)
    }

    // 부모 댓글 ID가 있으면 대댓글 조회, 없으면 루트 댓글만 조회
    if (parentId) {
      where.parentId = parseInt(parentId)
    } else {
      where.parentId = null
    }

    const [comments, total] = await Promise.all([
      prisma.techComment.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
              avatarUrl: true,
              level: true,
            }
          },
          likes: true,
          _count: {
            select: { replies: true }
          }
        }
      }),
      prisma.techComment.count({ where })
    ])

    const formattedComments = comments.map(comment => ({
      ...comment,
      id: comment.id.toString(),
      techId: comment.techId.toString(),
      author: {
        ...comment.author,
        id: comment.author.id.toString()
      },
      repliesCount: comment._count.replies,
      likes: comment.likes.map(like => ({
        ...like,
        id: like.id.toString(),
        userId: like.userId,
        commentId: like.commentId.toString()
      }))
    }))

    const pagination = createPagination(page, limit, total)

    return successResponse(formattedComments, 200, pagination)
  } catch (error) {
    console.error('기술 댓글 조회 오류:', error)
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
      } else {
        // 세션 ID가 데이터베이스에 없으면 이메일로 조회
        if (session.user.email) {
          const user = await prisma.user.findUnique({
            where: { email: session.user.email }
          })
          
          if (user) {
            userId = user.id
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
      }
    } else {
      return errorResponse('사용자 정보를 찾을 수 없습니다.', 401)
    }

    const body = await request.json()
    const { techId, content, parentId } = body

    if (!techId || !content) {
      return errorResponse('기술 ID와 댓글 내용이 필요합니다.', 400)
    }

    // 기술이 존재하는지 확인
    const techExists = await prisma.tech.findUnique({
      where: { id: parseInt(techId) }
    })

    if (!techExists) {
      return errorResponse('존재하지 않는 기술입니다.', 404)
    }

    // 부모 댓글이 있는 경우 존재하는지 확인
    if (parentId) {
      const parentExists = await prisma.techComment.findUnique({
        where: { id: parseInt(parentId) }
      })

      if (!parentExists) {
        return errorResponse('존재하지 않는 부모 댓글입니다.', 404)
      }
    }

    const comment = await prisma.techComment.create({
      data: {
        techId: parseInt(techId),
        authorId: userId,
        content,
        parentId: parentId ? parseInt(parentId) : null,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            avatarUrl: true,
            level: true,
          }
        },
        likes: true,
        _count: {
          select: { replies: true }
        }
      }
    })

    // 부모 댓글이 있는 경우 대댓글 수 업데이트
    if (parentId) {
      await prisma.techComment.update({
        where: { id: parseInt(parentId) },
        data: {
          repliesCount: {
            increment: 1
          }
        }
      })
    }

    const formattedComment = {
      ...comment,
      id: comment.id.toString(),
      techId: comment.techId.toString(),
      author: {
        ...comment.author,
        id: comment.author.id.toString()
      },
      repliesCount: comment._count.replies,
      likes: comment.likes.map(like => ({
        ...like,
        id: like.id.toString(),
        userId: like.userId,
        commentId: like.commentId.toString()
      }))
    }

    return successResponse(formattedComment, 201)
  } catch (error) {
    console.error('기술 댓글 생성 오류:', error)
    return errorResponse('서버 오류가 발생했습니다.', 500)
  }
}