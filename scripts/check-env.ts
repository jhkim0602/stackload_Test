#!/usr/bin/env tsx
// 환경 변수 검증 스크립트

// .env 파일 로드
import { config } from 'dotenv';
config();

import { validateEnv, logEnvironmentInfo, env } from '../src/lib/env';
import chalk from 'chalk';

console.log(chalk.blue('🔧 Stackload 환경 변수 검증 시작\n'));

try {
  // 환경 정보 출력
  logEnvironmentInfo();
  console.log();
  
  // 환경 변수 검증
  validateEnv();
  console.log();
  
  // 데이터베이스 설정 확인
  console.log(chalk.yellow('📊 데이터베이스 설정:'));
  if (env.isDevelopment()) {
    const dbUrl = env.database.url || 'NOT SET';
    console.log(`  - 로컬 PostgreSQL: ${dbUrl === 'NOT SET' ? dbUrl : dbUrl.replace(/:[^:@]+@/, ':****@')}`);
  } else {
    console.log(`  - Supabase: ${env.supabase.url || 'NOT SET'}`);
    const dbUrl = env.database.url || 'NOT SET';
    console.log(`  - Database URL: ${dbUrl === 'NOT SET' ? dbUrl : dbUrl.replace(/:[^:@]+@/, ':****@')}`);
  }
  console.log();
  
  // 인증 설정 확인
  console.log(chalk.yellow('🔐 인증 설정:'));
  console.log(`  - NextAuth URL: ${env.auth.nextauthUrl}`);
  console.log(`  - GitHub OAuth: ${env.auth.github.id ? '✅' : '❌'}`);
  console.log(`  - Google OAuth: ${env.auth.google.id ? '✅' : '❌'}`);
  console.log(`  - Kakao OAuth: ${env.auth.kakao.id ? '✅' : '❌'}`);
  console.log(`  - Naver OAuth: ${env.auth.naver.id ? '✅' : '❌'}`);
  console.log();
  
  // 추가 서비스 확인 (Preview/Production 환경)
  if (!env.isDevelopment()) {
    console.log(chalk.yellow('🚀 추가 서비스:'));
    console.log(`  - Vercel Blob Storage: ${env.storage.blobToken ? '✅' : '❌'}`);
    console.log(`  - Resend Email: ${env.email.resendApiKey ? '✅' : '❌'}`);
    console.log(`  - Vercel Analytics: ${env.monitoring.vercelAnalytics ? '✅' : '❌'}`);
    console.log();
  }
  
  // 개발 도구 확인 (Development 환경)
  if (env.isDevelopment()) {
    console.log(chalk.yellow('🛠 개발 도구:'));
    console.log(`  - Debug Mode: ${env.debug.enabled ? '✅' : '❌'}`);
    console.log(`  - Log Level: ${env.debug.logLevel}`);
    console.log(`  - Prisma Studio: ${env.debug.prismaStudio ? '✅' : '❌'}`);
    console.log();
  }
  
  console.log(chalk.green('✅ 환경 변수 검증 완료!'));
  
} catch (error) {
  console.error(chalk.red('❌ 환경 변수 검증 실패:'));
  console.error(chalk.red(error instanceof Error ? error.message : String(error)));
  console.log();
  
  console.log(chalk.yellow('📝 해결 방법:'));
  console.log('1. 해당 환경의 .env 파일을 확인하세요');
  console.log('2. 누락된 환경 변수를 추가하세요');
  console.log('3. Vercel 대시보드에서 Environment Variables를 설정하세요');
  
  process.exit(1);
}