// scripts/simple-check.js - 간단한 데이터베이스 확인
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function simpleCheck() {
  console.log('🔍 데이터베이스 확인 중...\n')
  
  try {
    // 간단한 카운트 확인
    const userCount = await prisma.user.count()
    const techCount = await prisma.tech.count() 
    const postCount = await prisma.post.count()
    
    console.log('📊 데이터 현황:')
    console.log(`👤 사용자: ${userCount}명`)
    console.log(`🛠️  기술스택: ${techCount}개`)
    console.log(`📝 게시글: ${postCount}개`)
    
    // 샘플 데이터 하나씩 확인
    const user = await prisma.user.findFirst()
    const tech = await prisma.tech.findFirst()
    const post = await prisma.post.findFirst()
    
    console.log('\n📋 샘플 데이터:')
    if (user) console.log(`✅ 첫 번째 사용자: ${user.name}`)
    if (tech) console.log(`✅ 첫 번째 기술: ${tech.name}`)  
    if (post) console.log(`✅ 첫 번째 게시글: ${post.title}`)
    
    console.log('\n🎉 데이터베이스가 정상 작동합니다!')
    
  } catch (error) {
    console.error('❌ 오류:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

simpleCheck()