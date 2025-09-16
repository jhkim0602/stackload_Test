import { NextRequest } from 'next/server'
import { getAuthSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, createPagination } from '@/lib/api-response'
import type { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession()

    if (!session?.user?.id) {
      return errorResponse('인증이 필요합니다.', 401)
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const unreadOnly = searchParams.get('unreadOnly') === 'true'

    const skip = (page - 1) * limit

    const where: Prisma.NotificationWhereInput = {
      recipientId: session.user.id
    }

    if (unreadOnly) {
      where.isRead = false
    }

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          relatedPost: {
            select: {
              id: true,
              title: true,
            }
          }
        }
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({
        where: {
          recipientId: session.user.id,
          isRead: false
        }
      })
    ])

    const formattedNotifications = notifications.map(notification => ({
      ...notification,
      id: notification.id.toString(),
      relatedPostId: notification.relatedPostId?.toString(),
      relatedCommentId: notification.relatedCommentId?.toString()
    }))

    const pagination = createPagination(page, limit, total)

    return successResponse({
      notifications: formattedNotifications,
      unreadCount,
      pagination
    })
  } catch (error) {
    console.error('알람 목록 조회 오류:', error)
    return errorResponse('서버 오류가 발생했습니다.', 500)
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getAuthSession()

    if (!session?.user?.id) {
      return errorResponse('인증이 필요합니다.', 401)
    }

    const body = await request.json()
    const { notificationIds, markAllAsRead } = body

    if (markAllAsRead) {
      await prisma.notification.updateMany({
        where: {
          recipientId: session.user.id,
          isRead: false
        },
        data: {
          isRead: true,
          readAt: new Date()
        }
      })

      return successResponse({ message: '모든 알람을 읽음으로 처리했습니다.' })
    }

    if (!notificationIds || !Array.isArray(notificationIds)) {
      return errorResponse('알람 ID 목록이 필요합니다.', 400)
    }

    const numericIds = notificationIds.map(id => parseInt(id))

    await prisma.notification.updateMany({
      where: {
        id: { in: numericIds },
        recipientId: session.user.id
      },
      data: {
        isRead: true,
        readAt: new Date()
      }
    })

    return successResponse({ message: '알람을 읽음으로 처리했습니다.' })
  } catch (error) {
    console.error('알람 읽음 처리 오류:', error)
    return errorResponse('서버 오류가 발생했습니다.', 500)
  }
}