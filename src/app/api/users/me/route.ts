import { NextRequest } from 'next/server'
import { getAuthSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession()

    if (!session?.user?.id) {
      return errorResponse('인증이 필요합니다.', 401)
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
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
            createdAt: true,
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
        posts: {
          select: {
            id: true,
            title: true,
            type: true,
            status: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 5,
        },
        createdAt: true,
        updatedAt: true,
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
    console.error('현재 사용자 조회 오류:', error)
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
    const { bio, level, location, github, discord, contactEmail, twitter, linkedin, instagram, website, techStack } = body

    // Build socialLinks object from individual fields
    const socialLinks: Record<string, string> = {}
    if (github) socialLinks.github = github
    if (discord) socialLinks.discord = discord
    if (contactEmail) socialLinks.email = contactEmail
    if (twitter) socialLinks.twitter = twitter
    if (linkedin) socialLinks.linkedin = linkedin
    if (instagram) socialLinks.instagram = instagram
    if (website) socialLinks.website = website

    // Map and validate level enum
    const levelMapping: Record<string, string> = {
      'Beginner': 'Beginner',
      'Junior': 'Junior', 
      'Mid-Level': 'MidLevel',
      'MidLevel': 'MidLevel',
      'Senior': 'Senior',
      'Expert': 'Expert',
      'Student': 'Student'
    }
    
    const updateData: any = {}
    
    if (bio !== undefined) updateData.bio = bio
    if (location !== undefined) updateData.location = location
    if (level && levelMapping[level]) updateData.level = levelMapping[level]
    if (Object.keys(socialLinks).length > 0) {
      updateData.socialLinks = JSON.stringify(socialLinks)
    }

    // Handle tech stack updates
    if (techStack && Array.isArray(techStack)) {
      // First, delete existing user techs
      await prisma.userTech.deleteMany({
        where: { userId: session.user.id }
      })

      // Then create new user techs
      if (techStack.length > 0) {
        for (const tech of techStack) {
          // Find tech by name
          const techRecord = await prisma.tech.findFirst({
            where: { name: tech.name }
          })

          if (techRecord) {
            await prisma.userTech.create({
              data: {
                userId: session.user.id,
                techId: techRecord.id,
                proficiencyLevel: tech.level || 3
              }
            })
          }
        }
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
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
            createdAt: true,
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
    console.error('사용자 정보 업데이트 오류:', error)
    return errorResponse('서버 오류가 발생했습니다.', 500)
  }
}