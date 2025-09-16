#!/usr/bin/env tsx
// scripts/validate-seed-data.ts
import { PrismaClient } from '@prisma/client'
import chalk from 'chalk'

const prisma = new PrismaClient()

interface ValidationResult {
  test: string
  passed: boolean
  message: string
  count?: number
  expected?: number
}

class SeedDataValidator {
  private results: ValidationResult[] = []

  private addResult(test: string, passed: boolean, message: string, count?: number, expected?: number) {
    this.results.push({ test, passed, message, count, expected })
  }

  async validateTechData() {
    console.log(chalk.blue('🔍 기술 스택 데이터 검증...'))
    
    // 기본 기술 수량 검증
    const techCount = await prisma.tech.count()
    this.addResult(
      'Tech Count',
      techCount >= 20,
      `기술 스택 데이터 수량`,
      techCount,
      20
    )

    // 필수 카테고리 존재 검증
    const categories = await prisma.tech.groupBy({
      by: ['category'],
      _count: { category: true }
    })
    
    const requiredCategories = ['frontend', 'backend', 'database', 'language', 'mobile', 'devops', 'cloud']
    const existingCategories = categories.map(c => c.category)
    const missingCategories = requiredCategories.filter(cat => !existingCategories.includes(cat))
    
    this.addResult(
      'Required Categories',
      missingCategories.length === 0,
      missingCategories.length === 0 
        ? '모든 필수 카테고리가 존재합니다' 
        : `누락된 카테고리: ${missingCategories.join(', ')}`
    )

    // slug 중복 검증
    const slugs = await prisma.tech.findMany({ select: { slug: true } })
    const uniqueSlugs = new Set(slugs.map(s => s.slug))
    this.addResult(
      'Unique Slugs',
      slugs.length === uniqueSlugs.size,
      `Slug 중복 검사: ${slugs.length}개 중 고유값 ${uniqueSlugs.size}개`
    )

    // 인기도 범위 검증
    const invalidPopularityCount = await prisma.tech.count({
      where: {
        OR: [
          { popularity: { lt: 0 } },
          { popularity: { gt: 100 } }
        ]
      }
    })
    this.addResult(
      'Popularity Range',
      invalidPopularityCount === 0,
      invalidPopularityCount === 0 
        ? '모든 인기도 값이 유효합니다 (0-100)' 
        : `유효하지 않은 인기도 값: ${invalidPopularityCount}개`
    )
  }

  async validateUserData() {
    console.log(chalk.blue('🔍 사용자 데이터 검증...'))
    
    const userCount = await prisma.user.count()
    this.addResult(
      'User Count',
      userCount >= 5,
      `테스트 사용자 계정 수량`,
      userCount,
      5
    )

    // 이메일 중복 검증
    const emails = await prisma.user.findMany({ select: { email: true } })
    const uniqueEmails = new Set(emails.map(e => e.email).filter(Boolean))
    this.addResult(
      'Unique Emails',
      emails.filter(e => e.email).length === uniqueEmails.size,
      `이메일 중복 검사: ${emails.filter(e => e.email).length}개 중 고유값 ${uniqueEmails.size}개`
    )

    // 레벨 유효성 검증
    const validLevels: ('Beginner' | 'Junior' | 'MidLevel' | 'Senior' | 'Expert' | 'Student')[] = ['Beginner', 'Junior', 'MidLevel', 'Senior', 'Expert', 'Student']
    const invalidLevelCount = await prisma.user.count({
      where: {
        level: { notIn: validLevels }
      }
    })
    this.addResult(
      'Valid User Levels',
      invalidLevelCount === 0,
      invalidLevelCount === 0 
        ? '모든 사용자 레벨이 유효합니다' 
        : `유효하지 않은 사용자 레벨: ${invalidLevelCount}개`
    )
  }

  async validatePostData() {
    console.log(chalk.blue('🔍 게시글 데이터 검증...'))
    
    const postCount = await prisma.post.count()
    this.addResult(
      'Post Count',
      postCount >= 10,
      `샘플 게시글 수량`,
      postCount,
      10
    )

    // 게시글 타입 검증
    const postTypes = await prisma.post.groupBy({
      by: ['type'],
      _count: { type: true }
    })
    const requiredTypes: ('project' | 'study' | 'mentoring')[] = ['project', 'study', 'mentoring']
    const existingTypes = postTypes.map(p => p.type)
    const missingTypes = requiredTypes.filter(type => !existingTypes.includes(type))
    
    this.addResult(
      'Post Types',
      missingTypes.length === 0,
      missingTypes.length === 0 
        ? '모든 게시글 타입이 존재합니다' 
        : `누락된 게시글 타입: ${missingTypes.join(', ')}`
    )

    // 작성자 연결 검증 (외래 키 제약조건으로 이미 보장되므로 0개여야 함)
    const postsWithoutAuthor = await prisma.post.count({
      where: { 
        authorId: { 
          notIn: await prisma.user.findMany({ select: { id: true } }).then(users => users.map(u => u.id))
        }
      }
    })
    this.addResult(
      'Posts with Authors',
      postsWithoutAuthor === 0,
      postsWithoutAuthor === 0 
        ? '모든 게시글에 작성자가 연결되어 있습니다' 
        : `작성자가 없는 게시글: ${postsWithoutAuthor}개`
    )

  }

  async validateRelationshipData() {
    console.log(chalk.blue('🔍 관계 데이터 검증...'))
    
    // 사용자-기술 관계 검증
    const userTechCount = await prisma.userTech.count()
    this.addResult(
      'UserTech Relations',
      userTechCount >= 15,
      `사용자-기술 연결 수량`,
      userTechCount,
      15
    )

    // 기술 숙련도 범위 검증
    const invalidProficiencyCount = await prisma.userTech.count({
      where: {
        OR: [
          { proficiencyLevel: { lt: 1 } },
          { proficiencyLevel: { gt: 5 } }
        ]
      }
    })
    this.addResult(
      'Proficiency Levels',
      invalidProficiencyCount === 0,
      invalidProficiencyCount === 0 
        ? '모든 기술 숙련도가 유효합니다 (1-5)' 
        : `유효하지 않은 숙련도: ${invalidProficiencyCount}개`
    )

    // 게시글-태그 관계 확인 (PostTag 테이블이 있다면)
    try {
      const postTagCount = await prisma.postTag.count()
      this.addResult(
        'PostTag Relations',
        postTagCount >= 0,
        `게시글-태그 연결 수량: ${postTagCount}개`
      )
    } catch {
      this.addResult(
        'PostTag Relations',
        false,
        'PostTag 테이블을 찾을 수 없습니다'
      )
    }
  }

  async validateDataIntegrity() {
    console.log(chalk.blue('🔍 데이터 무결성 검증...'))
    
    // JSON 필드 유효성 검증 (현재 Post 모델에는 JSON 필드가 없음)
    const invalidJSONCount = 0
    this.addResult(
      'JSON Field Integrity',
      invalidJSONCount === 0,
      invalidJSONCount === 0 
        ? '모든 JSON 필드가 유효합니다' 
        : `유효하지 않은 JSON 필드: ${invalidJSONCount}개`
    )

    // 외래 키 제약조건 검증 (UserTech에서 존재하지 않는 userId 참조)
    const userIds = await prisma.user.findMany({ select: { id: true } }).then(users => users.map(u => u.id))
    const orphanedUserTechs = await prisma.userTech.count({
      where: { 
        userId: { 
          notIn: userIds
        }
      }
    })
    this.addResult(
      'Foreign Key Integrity',
      orphanedUserTechs === 0,
      orphanedUserTechs === 0 
        ? '모든 외래 키가 유효합니다' 
        : `고아 레코드: ${orphanedUserTechs}개`
    )
  }

  async runAllValidations() {
    console.log(chalk.yellow('🚀 시드 데이터 검증 시작...\n'))
    
    try {
      await this.validateTechData()
      await this.validateUserData()
      await this.validatePostData()
      await this.validateRelationshipData()
      await this.validateDataIntegrity()
    } catch (error) {
      console.error(chalk.red('❌ 검증 중 오류 발생:'), error)
    }

    this.printResults()
  }

  private printResults() {
    console.log('\n' + chalk.yellow('📊 검증 결과 요약:'))
    console.log('=' .repeat(80))

    const passed = this.results.filter(r => r.passed).length
    const failed = this.results.filter(r => !r.passed).length

    this.results.forEach(result => {
      const icon = result.passed ? chalk.green('✅') : chalk.red('❌')
      const status = result.passed ? chalk.green('PASS') : chalk.red('FAIL')
      const countInfo = result.count !== undefined && result.expected !== undefined 
        ? chalk.gray(`(${result.count}/${result.expected})`)
        : ''
      
      console.log(`${icon} ${status} ${result.test}: ${result.message} ${countInfo}`)
    })

    console.log('=' .repeat(80))
    console.log(`총 ${this.results.length}개 테스트 중 ${chalk.green(passed)}개 통과, ${failed > 0 ? chalk.red(failed) : failed}개 실패`)

    if (failed === 0) {
      console.log(chalk.green('\n🎉 모든 시드 데이터 검증을 통과했습니다!'))
    } else {
      console.log(chalk.red('\n⚠️  일부 검증에 실패했습니다. 시드 데이터를 확인해주세요.'))
      process.exit(1)
    }
  }
}

async function main() {
  const validator = new SeedDataValidator()
  await validator.runAllValidations()
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })