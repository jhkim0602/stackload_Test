import { NextRequest } from 'next/server'
import { getAuthSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'

type Props = { params: Promise<{ id: string }> }

export async function POST(request: NextRequest, { params }: Props) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return errorResponse('로그인이 필요합니다.', 401)
    }

    const { id } = await params
    const commentId = parseInt(id)

    if (isNaN(commentId)) {
      return errorResponse('유효하지 않은 댓글 ID입니다.', 400)
    }

    let userId: string;

    // 사용자 ID 확인 또는 생성 로직 (기존과 동일)
    if (session.user.id) {
      const userExists = await prisma.user.findUnique({
        where: { id: session.user.id }
      })
      
      if (userExists) {
        userId = session.user.id
      } else {
        if (session.user.email) {
          const user = await prisma.user.findUnique({
            where: { email: session.user.email }
          })
          
          if (user) {
            userId = user.id
          } else {
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
      const user = await prisma.user.findUnique({
        where: { email: session.user.email }
      })

      if (user) {
        userId = user.id
      } else {
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

    // 댓글이 존재하는지 확인
    const comment = await prisma.techComment.findUnique({
      where: { id: commentId }
    })

    if (!comment) {
      return errorResponse('존재하지 않는 댓글입니다.', 404)
    }

    // 이미 좋아요를 눌렀는지 확인
    const existingLike = await prisma.techCommentLike.findUnique({
      where: {
        userId_commentId: {
          userId,
          commentId
        }
      }
    })

    if (existingLike) {
      // 좋아요 취소
      await prisma.$transaction([
        prisma.techCommentLike.delete({
          where: { id: existingLike.id }
        }),
        prisma.techComment.update({
          where: { id: commentId },
          data: {
            likesCount: {
              decrement: 1
            }
          }
        })
      ])

      return successResponse({ 
        message: '좋아요를 취소했습니다.', 
        liked: false,
        likesCount: comment.likesCount - 1
      })
    } else {
      // 좋아요 추가
      await prisma.$transaction([
        prisma.techCommentLike.create({
          data: {
            userId,
            commentId
          }
        }),
        prisma.techComment.update({
          where: { id: commentId },
          data: {
            likesCount: {
              increment: 1
            }
          }
        })
      ])

      return successResponse({ 
        message: '좋아요를 눌렀습니다.', 
        liked: true,
        likesCount: comment.likesCount + 1
      })
    }
  } catch (error) {
    console.error('기술 댓글 좋아요 오류:', error)
    return errorResponse('서버 오류가 발생했습니다.', 500)
  }
}