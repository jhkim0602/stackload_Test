// 환경별 데이터베이스 설정
import { PrismaClient } from '@prisma/client';
import { env } from './env';

declare global {
  var __prisma: PrismaClient | undefined;
}

// 개발환경에서 Hot Reload시 연결 재사용을 위한 글로벌 변수
export const prisma = globalThis.__prisma || new PrismaClient({
  log: env.isDevelopment() 
    ? ['query', 'info', 'warn', 'error'] 
    : ['warn', 'error'],
  
  datasources: {
    db: {
      url: env.database.url,
    },
  },
});

if (env.isDevelopment()) {
  globalThis.__prisma = prisma;
}

// 데이터베이스 연결 상태 확인
export async function checkDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log(`✅ Database connected successfully (${env.ENVIRONMENT})`);
    
    // 환경별 추가 설정
    if (env.isDevelopment()) {
      console.log('🔧 Development mode: Query logging enabled');
    }
    
    if (env.isProduction()) {
      console.log('🚀 Production mode: Optimized for performance');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

// 데이터베이스 연결 해제
export async function disconnectDatabase() {
  await prisma.$disconnect();
  console.log('📡 Database disconnected');
}

// 환경별 데이터베이스 설정 정보
export function getDatabaseInfo() {
  return {
    environment: env.ENVIRONMENT,
    url: env.database.url.replace(/:[^:@]+@/, ':****@'), // 비밀번호 마스킹
    isLocal: env.isDevelopment(),
    isSupabase: !env.isDevelopment(),
    logLevel: env.isDevelopment() ? 'debug' : 'error',
  };
}