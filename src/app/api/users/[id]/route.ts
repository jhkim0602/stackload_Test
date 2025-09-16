import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return errorResponse('사용자 ID가 필요합니다.', 400)
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        avatarUrl: true,
        location: true,
        level: true,
        bio: true,
        socialLinks: true,
        interests: true,
        postsCount: true,
        likesReceivedCount: true,
        commentsCount: true,
        userTechs: {
          select: {
            techId: true,
            proficiencyLevel: true,
            tech: {
              select: {
                id: true,
                name: true,
                category: true,
                slug: true,
              }
            }
          },
        },
        createdAt: true,
      },
    })

    if (!user) {
      return errorResponse('사용자를 찾을 수 없습니다.', 404)
    }

    return successResponse({
      ...user,
      socialLinks: typeof user.socialLinks === 'string' 
        ? JSON.parse(user.socialLinks as string) 
        : user.socialLinks,
      interests: typeof user.interests === 'string'
        ? JSON.parse(user.interests as string)
        : user.interests,
    })
  } catch (error) {
    console.error('사용자 조회 오류:', error)
    return errorResponse('서버 오류가 발생했습니다.', 500)
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    if (!id) {
      return errorResponse('사용자 ID가 필요합니다.', 400)
    }

    const { name, location, level, bio, socialLinks, interests, avatarUrl } = body

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(location !== undefined && { location }),
        ...(level && { level }),
        ...(bio !== undefined && { bio }),
        ...(socialLinks && { socialLinks: JSON.stringify(socialLinks) }),
        ...(interests && { interests: JSON.stringify(interests) }),
        ...(avatarUrl !== undefined && { avatarUrl }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        avatarUrl: true,
        location: true,
        level: true,
        bio: true,
        socialLinks: true,
        interests: true,
        postsCount: true,
        likesReceivedCount: true,
        commentsCount: true,
        updatedAt: true,
      },
    })

    return successResponse({
      ...updatedUser,
      socialLinks: typeof updatedUser.socialLinks === 'string' 
        ? JSON.parse(updatedUser.socialLinks as string) 
        : updatedUser.socialLinks,
      interests: typeof updatedUser.interests === 'string'
        ? JSON.parse(updatedUser.interests as string)
        : updatedUser.interests,
    })
  } catch (error) {
    console.error('사용자 업데이트 오류:', error)
    return errorResponse('서버 오류가 발생했습니다.', 500)
  }
}