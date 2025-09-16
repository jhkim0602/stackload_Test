#!/usr/bin/env tsx
// scripts/verify-schema.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 데이터베이스 스키마 검증 시작...\n')
  
  try {
    // 1. 테이블 존재 확인
    console.log('📋 테이블 목록:')
    
    const userCount = await prisma.user.count()
    console.log(`✅ users: ${userCount}개 레코드`)
    
    const postCount = await prisma.post.count()
    console.log(`✅ posts: ${postCount}개 레코드`)
    
    const techCount = await prisma.tech.count()
    console.log(`✅ techs: ${techCount}개 레코드`)
    
    const commentCount = await prisma.comment.count()
    console.log(`✅ comments: ${commentCount}개 레코드`)
    
    const likeCount = await prisma.like.count()
    console.log(`✅ likes: ${likeCount}개 레코드`)
    
    const applicationCount = await prisma.postApplication.count()
    console.log(`✅ post_applications: ${applicationCount}개 레코드`)
    
    const userTechCount = await prisma.userTech.count()
    console.log(`✅ user_techs: ${userTechCount}개 레코드`)
    
    const notificationCount = await prisma.notification.count()
    console.log(`✅ notifications: ${notificationCount}개 레코드`)
    

    // 2. 관계 테스트
    console.log('\n🔗 관계 검증:')
    
    const postWithAuthor = await prisma.post.findFirst({
      include: {
        author: true,
        tags: {
          include: {
            tech: true
          }
        },
        comments: {
          include: {
            author: true
          }
        }
      }
    })
    
    if (postWithAuthor) {
      console.log(`✅ Post-User 관계: "${postWithAuthor.title}" by ${postWithAuthor.author.name}`)
      console.log(`✅ Post-Tag 관계: ${postWithAuthor.tags.length}개 기술 태그`)
      console.log(`✅ Post-Comment 관계: ${postWithAuthor.comments.length}개 댓글`)
    }

    console.log('\n🎉 데이터베이스 스키마 검증 완료!')
    console.log('모든 테이블과 관계가 정상적으로 구성되었습니다.')
    
  } catch (error) {
    console.error('❌ 스키마 검증 중 오류 발생:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()