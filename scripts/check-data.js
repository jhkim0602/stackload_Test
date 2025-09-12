// scripts/check-data.js
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkDatabase() {
  console.log('🔍 데이터베이스 상태 확인...\n')
  
  try {
    // 각 테이블의 데이터 개수 확인
    const counts = await Promise.all([
      prisma.user.count(),
      prisma.post.count(), 
      prisma.tech.count(),
      prisma.comment.count(),
      prisma.userTech.count()
    ])
    
    console.log('📊 데이터 현황:')
    console.log(`👤 사용자: ${counts[0]}명`)
    console.log(`📝 게시글: ${counts[1]}개`)
    console.log(`🛠️  기술스택: ${counts[2]}개`)
    console.log(`💬 댓글: ${counts[3]}개`)
    console.log(`👨‍💻 사용자-기술: ${counts[4]}개`)
    
    // 실제 데이터 샘플 확인
    console.log('\n📋 데이터 샘플:')
    
    const sampleUser = await prisma.user.findFirst()
    if (sampleUser) {
      console.log(`✅ 사용자 예시: ${sampleUser.name} (${sampleUser.email})`)
    }
    
    const samplePost = await prisma.post.findFirst({
      include: { author: true }
    })
    if (samplePost) {
      console.log(`✅ 게시글 예시: "${samplePost.title}" by ${samplePost.author.name}`)
    }
    
    const sampleTech = await prisma.tech.findFirst()
    if (sampleTech) {
      console.log(`✅ 기술 예시: ${sampleTech.name} (${sampleTech.category})`)
    }
    
    console.log('\n🎉 데이터베이스가 정상적으로 설정되었습니다!')
    
  } catch (error) {
    console.error('❌ 확인 중 오류:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabase()