# 🗃️ Supabase 클라우드 데이터베이스 설정 가이드

## 1. Supabase 프로젝트 생성

### 1.1 Supabase 회원가입 및 프로젝트 생성
```bash
1. https://supabase.com 방문
2. GitHub/Google 계정으로 로그인
3. "New project" 클릭
4. 프로젝트 정보 입력:
   - Name: stackload-preview (미리보기용)
   - Database Password: 강력한 비밀번호 생성
   - Region: Northeast Asia (ap-northeast-1) - 한국과 가까운 서버
   - Pricing plan: Free tier 선택
```

### 1.2 데이터베이스 연결 정보 확인
```bash
프로젝트 대시보드 → Settings → Database에서 확인:
- Host: db.[project-ref].supabase.co
- Database name: postgres
- Port: 5432
- User: postgres
- Password: [생성시 설정한 비밀번호]
```

## 2. 환경 변수 설정

### 2.1 Preview 환경 (.env.preview)
```bash
# Supabase 연결 정보로 교체
POSTGRES_PRISMA_URL="postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"
POSTGRES_URL_NON_POOLING="postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"
DATABASE_URL="postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"

# Supabase API 설정
SUPABASE_URL="https://[project-ref].supabase.co"
SUPABASE_ANON_KEY="[supabase-anon-key]"
SUPABASE_SERVICE_ROLE_KEY="[supabase-service-role-key]"
```

### 2.2 Production 환경 (.env.production)
```bash
# 별도의 Production 프로젝트 생성 후 동일하게 설정
# 더 많은 연결과 리소스를 위해 connection_limit을 증가
POSTGRES_PRISMA_URL="postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres?pgbouncer=true&connection_limit=10"
```

## 3. 데이터베이스 마이그레이션

### 3.1 스키마 적용
```bash
# Preview 환경
npm run db:migrate:preview

# Production 환경  
npm run db:migrate:production
```

### 3.2 시드 데이터 생성
```bash
# Preview 환경
npm run db:seed:preview

# Production 환경 (선택사항)
npm run db:seed:production
```

## 4. Vercel 환경 변수 설정

### 4.1 Preview 환경
```bash
# Vercel 대시보드에서 설정
Environment: Preview
Variables:
- ENVIRONMENT=preview
- DATABASE_URL=[supabase-connection-string]
- SUPABASE_URL=[supabase-url]
- SUPABASE_ANON_KEY=[supabase-anon-key]
- NEXTAUTH_URL=https://[preview-domain].vercel.app
- NEXTAUTH_SECRET=[secure-random-string]
```

### 4.2 Production 환경
```bash
Environment: Production
Variables:
- ENVIRONMENT=production
- DATABASE_URL=[production-supabase-connection-string]
- SUPABASE_URL=[production-supabase-url]
- SUPABASE_ANON_KEY=[production-supabase-anon-key]
- NEXTAUTH_URL=https://stackload.kr
- NEXTAUTH_SECRET=[production-secure-random-string]
```

## 5. 연결 테스트

### 5.1 로컬에서 테스트
```bash
# 환경 변수 검증
npm run env:check

# 데이터베이스 연결 테스트
npm run db:health
```

### 5.2 배포 후 테스트
```bash
# Preview 배포
npm run deploy:preview

# Production 배포
npm run deploy:production
```

## 6. 모니터링 및 관리

### 6.1 Supabase 대시보드
- SQL Editor: 직접 쿼리 실행
- Table Editor: 데이터 확인 및 수정
- API: 실시간 API 문서
- Logs: 데이터베이스 로그 확인

### 6.2 성능 모니터링
```bash
# 연결 상태 확인
SELECT * FROM pg_stat_activity;

# 데이터베이스 크기 확인
SELECT pg_size_pretty(pg_database_size('postgres'));
```

## 7. 백업 및 보안

### 7.1 자동 백업 (Supabase Pro 이상)
- 일일 자동 백업
- Point-in-time recovery

### 7.2 보안 설정
- Row Level Security (RLS) 활성화
- API 키 보안 관리
- SSL 연결 강제

## 8. 비용 관리

### 8.1 무료 플랜 제한
- 데이터베이스: 500MB
- 월간 전송량: 5GB
- API 요청: 50만 건/월

### 8.2 사용량 모니터링
- Supabase 대시보드에서 사용량 확인
- 알림 설정으로 한계치 근접시 알림

## 9. 문제 해결

### 9.1 연결 오류
```bash
# SSL 인증서 문제
sslmode=require 파라미터 추가

# 연결 풀 설정
pgbouncer=true&connection_limit=1
```

### 9.2 마이그레이션 오류
```bash
# 스키마 리셋 (개발환경만)
npx prisma migrate reset

# 수동 마이그레이션
npx prisma db push
```