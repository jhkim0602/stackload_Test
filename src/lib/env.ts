// 환경 변수 관리 유틸리티
export const env = {
  // 환경 정보
  NODE_ENV: process.env.NODE_ENV || 'development',
  ENVIRONMENT: process.env.ENVIRONMENT || 'development',
  
  // 환경 체크 함수
  isDevelopment: () => process.env.NODE_ENV === 'development' || (!process.env.NODE_ENV && !process.env.ENVIRONMENT),
  isPreview: () => process.env.ENVIRONMENT === 'preview',
  isProduction: () => process.env.NODE_ENV === 'production' && process.env.ENVIRONMENT === 'production',
  
  // 데이터베이스 설정
  database: {
    url: process.env.DATABASE_URL!,
    prismaUrl: process.env.POSTGRES_PRISMA_URL!,
    nonPoolingUrl: process.env.POSTGRES_URL_NON_POOLING!,
  },
  
  // Supabase 설정 (클라우드 환경에서만)
  supabase: {
    url: process.env.SUPABASE_URL,
    anonKey: process.env.SUPABASE_ANON_KEY,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },
  
  // 인증 설정
  auth: {
    nextauthUrl: process.env.NEXTAUTH_URL!,
    nextauthSecret: process.env.NEXTAUTH_SECRET!,
    github: {
      id: process.env.AUTH_GITHUB_ID!,
      secret: process.env.AUTH_GITHUB_SECRET!,
    },
    google: {
      id: process.env.AUTH_GOOGLE_ID!,
      secret: process.env.AUTH_GOOGLE_SECRET!,
    },
    kakao: {
      id: process.env.AUTH_KAKAO_ID!,
      secret: process.env.AUTH_KAKAO_SECRET!,
    },
    naver: {
      id: process.env.AUTH_NAVER_ID!,
      secret: process.env.AUTH_NAVER_SECRET!,
    },
  },
  
  // 파일 스토리지
  storage: {
    blobToken: process.env.BLOB_READ_WRITE_TOKEN,
  },
  
  // 이메일 서비스
  email: {
    resendApiKey: process.env.RESEND_API_KEY,
  },
  
  // 모니터링 및 분석
  monitoring: {
    sentryDsn: process.env.SENTRY_DSN,
    googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID,
    vercelAnalytics: process.env.VERCEL_ANALYTICS === 'true',
  },
  
  // 개발 도구 설정
  debug: {
    enabled: process.env.DEBUG === 'true',
    logLevel: process.env.LOG_LEVEL || 'info',
    prismaStudio: process.env.ENABLE_PRISMA_STUDIO === 'true',
  },
  
  // 성능 설정
  performance: {
    redisUrl: process.env.REDIS_URL,
    cdnUrl: process.env.CDN_URL,
    cacheTtl: parseInt(process.env.CACHE_TTL || '3600'),
  },
  
  // 보안 설정
  security: {
    rateLimitEnabled: process.env.RATE_LIMIT_ENABLED === 'true',
    corsEnabled: process.env.CORS_ENABLED === 'true',
  },
};

// 환경별 설정 검증
export function validateEnv() {
  const requiredVars = {
    development: [
      'DATABASE_URL',
      'NEXTAUTH_URL', 
      'NEXTAUTH_SECRET'
    ],
    preview: [
      'DATABASE_URL',
      'SUPABASE_URL',
      'SUPABASE_ANON_KEY',
      'NEXTAUTH_URL',
      'NEXTAUTH_SECRET'
    ],
    production: [
      'DATABASE_URL',
      'SUPABASE_URL', 
      'SUPABASE_ANON_KEY',
      'NEXTAUTH_URL',
      'NEXTAUTH_SECRET'
    ]
  };

  const currentEnv = env.ENVIRONMENT as keyof typeof requiredVars;
  const required = requiredVars[currentEnv] || requiredVars.development;
  
  const missing = required.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables for ${currentEnv}: ${missing.join(', ')}`
    );
  }
  
  console.log(`✅ Environment validation passed for ${currentEnv}`);
}

// 환경 정보 로그
export function logEnvironmentInfo() {
  console.log('🔧 Environment Info:', {
    NODE_ENV: env.NODE_ENV,
    ENVIRONMENT: env.ENVIRONMENT,
    isDevelopment: env.isDevelopment(),
    isPreview: env.isPreview(),
    isProduction: env.isProduction(),
    database: env.isDevelopment() ? 'Local PostgreSQL' : 'Supabase',
  });
}