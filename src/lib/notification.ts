import { prisma } from '@/lib/prisma'
import { NotificationType } from '@prisma/client'

interface CreateNotificationParams {
  recipientId: string
  type: NotificationType
  title: string
  message: string
  relatedPostId?: number
  relatedCommentId?: number
  relatedUserId?: string
}

export async function createNotification({
  recipientId,
  type,
  title,
  message,
  relatedPostId,
  relatedCommentId,
  relatedUserId
}: CreateNotificationParams) {
  try {
    if (recipientId === relatedUserId) {
      return null
    }

    const notification = await prisma.notification.create({
      data: {
        recipientId,
        type,
        title,
        message,
        relatedPostId,
        relatedCommentId,
        relatedUserId
      }
    })

    return notification
  } catch (error) {
    console.error('알람 생성 오류:', error)
    return null
  }
}

export async function createPostLikeNotification(postId: number, likerId: string, postTitle: string, postAuthorId: string) {
  return createNotification({
    recipientId: postAuthorId,
    type: 'POST_LIKE',
    title: '새로운 좋아요',
    message: `"${postTitle}" 글에 좋아요를 받았습니다.`,
    relatedPostId: postId,
    relatedUserId: likerId
  })
}

export async function createCommentNotification(postId: number, commenterId: string, postTitle: string, postAuthorId: string, commentId: number) {
  return createNotification({
    recipientId: postAuthorId,
    type: 'COMMENT',
    title: '새로운 댓글',
    message: `"${postTitle}" 글에 새로운 댓글이 달렸습니다.`,
    relatedPostId: postId,
    relatedCommentId: commentId,
    relatedUserId: commenterId
  })
}

export async function createCommentReplyNotification(postId: number, replierUserId: string, parentCommentAuthorId: string, postTitle: string, commentId: number) {
  return createNotification({
    recipientId: parentCommentAuthorId,
    type: 'COMMENT_REPLY',
    title: '새로운 답글',
    message: `"${postTitle}" 글에서 댓글에 답글이 달렸습니다.`,
    relatedPostId: postId,
    relatedCommentId: commentId,
    relatedUserId: replierUserId
  })
}

export async function createCommentLikeNotification(commentId: number, likerId: string, commentAuthorId: string, postTitle: string) {
  return createNotification({
    recipientId: commentAuthorId,
    type: 'COMMENT_LIKE',
    title: '댓글 좋아요',
    message: `"${postTitle}" 글의 댓글에 좋아요를 받았습니다.`,
    relatedCommentId: commentId,
    relatedUserId: likerId
  })
}