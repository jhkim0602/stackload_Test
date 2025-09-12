import { NextRequest } from 'next/server'
import { getAuthSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const postId = BigInt(id)

    // 조회수 증가
    await prisma.post.update({
      where: { id: postId },
      data: { viewsCount: { increment: 1 } },
    })

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            image: true,
            level: true,
            location: true,
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
                category: true,
              },
            },
          },
        },
        comments: {
          select: {
            id: true,
            content: true,
            author: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
                image: true,
              },
            },
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 5,
        },
        _count: {
          select: {
            likes: true,
            comments: true,
            applications: true,
          },
        },
      },
    })

    if (!post) {
      return errorResponse('포스트를 찾을 수 없습니다.', 404)
    }

    const formattedPost = {
      ...post,
      id: post.id.toString(),
      requirements: typeof post.requirements === 'string' 
        ? JSON.parse(post.requirements as string) 
        : post.requirements,
      benefits: typeof post.benefits === 'string'
        ? JSON.parse(post.benefits as string)
        : post.benefits,
      tags: post.tags.map(tag => tag.tech),
      likesCount: post._count.likes,
      commentsCount: post._count.comments,
      applicationsCount: post._count.applications,
      comments: post.comments.map(comment => ({
        ...comment,
        id: comment.id.toString(),
      })),
    }

    return successResponse(formattedPost)
  } catch (error) {
    console.error('포스트 조회 오류:', error)
    return errorResponse('서버 오류가 발생했습니다.', 500)
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthSession()

    if (!session?.user?.id) {
      return errorResponse('인증이 필요합니다.', 401)
    }

    const { id } = await params

    const postId = BigInt(id)
    const body = await request.json()

    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    })

    if (!existingPost) {
      return errorResponse('포스트를 찾을 수 없습니다.', 404)
    }

    if (existingPost.authorId !== session.user.id) {
      return errorResponse('수정 권한이 없습니다.', 403)
    }

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
      status,
      techIds
    } = body

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(type && { type }),
        ...(location !== undefined && { location }),
        ...(duration !== undefined && { duration }),
        ...(schedule !== undefined && { schedule }),
        ...(maxMembers && { maxMembers }),
        ...(requirements && { requirements: JSON.stringify(requirements) }),
        ...(benefits && { benefits: JSON.stringify(benefits) }),
        ...(status && { status }),
        ...(techIds && {
          tags: {
            deleteMany: {},
            create: techIds.map((techId: number) => ({ techId }))
          }
        }),
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
      ...updatedPost,
      id: updatedPost.id.toString(),
      requirements: typeof updatedPost.requirements === 'string' 
        ? JSON.parse(updatedPost.requirements as string) 
        : updatedPost.requirements,
      benefits: typeof updatedPost.benefits === 'string'
        ? JSON.parse(updatedPost.benefits as string)
        : updatedPost.benefits,
      tags: updatedPost.tags.map(tag => tag.tech),
    }

    return successResponse(formattedPost)
  } catch (error) {
    console.error('포스트 수정 오류:', error)
    return errorResponse('서버 오류가 발생했습니다.', 500)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthSession()

    if (!session?.user?.id) {
      return errorResponse('인증이 필요합니다.', 401)
    }

    const { id } = await params

    const postId = BigInt(id)

    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    })

    if (!existingPost) {
      return errorResponse('포스트를 찾을 수 없습니다.', 404)
    }

    if (existingPost.authorId !== session.user.id) {
      return errorResponse('삭제 권한이 없습니다.', 403)
    }

    await prisma.post.delete({
      where: { id: postId },
    })

    return successResponse({ message: '포스트가 삭제되었습니다.' })
  } catch (error) {
    console.error('포스트 삭제 오류:', error)
    return errorResponse('서버 오류가 발생했습니다.', 500)
  }
}