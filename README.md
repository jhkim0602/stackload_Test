# Stackload - 개발자 커뮤니티 플랫폼

## 🚀 프로젝트 개요

Stackload는 개발자들을 위한 통합 커뮤니티 플랫폼입니다. 기술 스택 정보 제공, 프로젝트 팀원 모집, 스터디 그룹 매칭, 멘토링 연결 등의 기능을 제공합니다.

### ✨ 주요 기능
- 📊 기술 스택별 정보 및 트렌드 제공
- 🤝 프로젝트 팀원 모집 및 매칭
- 📚 스터디 그룹 생성 및 참여
- 👨‍🏫 멘토링 연결 서비스
- 👤 개발자 프로필 및 포트폴리오 관리
- 💬 실시간 커뮤니티 상호작용

## 🛠️ 현재 기술 스택 (프론트엔드)

![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![React](https://img.shields.io/badge/React-19.1.0-61DAFB)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38B2AC)

### Frontend
- **Next.js 15.5.2** - App Router 사용
- **React 19.1.0** - 최신 React 기능 활용
- **TypeScript 5** - 타입 안정성
- **TailwindCSS 4** - 유틸리티 기반 스타일링
- **shadcn/ui** - 컴포넌트 시스템
- **Lucide React** - 아이콘 라이브러리

### 개발 도구
- **Turbopack** - 빠른 개발 서버
- **ESLint** - 코드 품질 관리
- **TypeScript** - 타입 체킹

## 🔧 백엔드 기술 스택 선택 및 비교

### 📊 백엔드 프레임워크 비교

#### 1. **Next.js API Routes + Vercel** (최종 선택)
✅ **선택 이유:**
- 프론트엔드와 동일한 기술 스택으로 개발 효율성 극대화
- Vercel 배포 시 서버리스 자동 최적화 및 무료 호스팅
- TypeScript 공유로 타입 안정성 및 코드 일관성
- ISR, SSG 등 Next.js 최적화 기능 활용
- Edge Runtime으로 전 세계 빠른 응답 속도
- 스타트업에 적합한 비용 효율성

❌ **단점:**
- 서버리스 환경의 콜드 스타트 (10초 제한)
- 대규모 백엔드 로직에는 제약

#### 2. **Node.js + Express + Railway/Render**
✅ **장점:**
- JavaScript 생태계 활용으로 학습 곡선 낮음
- 풍부한 미들웨어와 라이브러리
- WebSocket 등 실시간 기능 구현 용이
- 서버 상태 유지 가능

❌ **단점:**
- 별도 서버 관리 및 모니터링 필요
- 배포 복잡성 증가 및 추가 비용
- 서버 다운타임 위험

#### 3. **Python + FastAPI + Heroku/DigitalOcean**
✅ **장점:**
- 매우 빠른 성능 (async/await 지원)
- 자동 API 문서화 (Swagger)
- 타입 힌팅으로 안정성
- AI/ML 연동 시 유리

❌ **단점:**
- 언어 분리로 인한 개발 복잡성
- 초기 학습 곡선 및 생태계 차이
- 추가 서버 비용

### 💾 데이터베이스 선택 및 비교

#### **PostgreSQL + Vercel Postgres** (최종 선택)
✅ **선택 이유:**
- 관계형 데이터의 복잡한 쿼리 지원 (사용자-프로젝트-댓글 관계)
- JSON 컬럼으로 NoSQL 기능도 제공 (기술 스택, 설정 등)
- 강력한 인덱싱과 성능 최적화
- Vercel Postgres로 쉬운 배포 및 관리
- ACID 트랜잭션으로 데이터 무결성 보장
- 무료 티어로 초기 운영 가능

#### **대안 검토:**

##### **MongoDB + MongoDB Atlas**
✅ **장점:**
- 스키마 유연성으로 빠른 프로토타이핑
- JSON 문서 저장으로 복잡한 객체 처리 용이
- 수평 확장성

❌ **단점:**
- 관계형 쿼리에 제약 (JOIN 등)
- 트랜잭션 처리 복잡
- 중복 데이터 문제

##### **MySQL + PlanetScale**
✅ **장점:**
- 널리 알려진 SQL
- 안정성과 성능

❌ **단점:**
- PostgreSQL 대비 JSON 지원 부족
- 고급 기능 제한

##### **SQLite + Turso**
✅ **장점:**
- 설정 간단
- 빠른 읽기 성능

❌ **단점:**
- 동시 쓰기 제한
- 확장성 부족

### 🔐 인증 시스템 선택

#### **NextAuth.js (Auth.js) v5** (최종 선택)
✅ **선택 이유:**
- Next.js와 완벽 통합 및 App Router 지원
- 다양한 OAuth 제공자 지원 (GitHub, Google, Discord)
- 보안 모범 사례 내장 (CSRF, JWT, 암호화)
- TypeScript 완벽 지원
- 세션 관리 자동화
- 무료 사용 가능

#### **대안 검토:**
- **Supabase Auth**: PostgreSQL과 통합되지만 vendor lock-in
- **Firebase Auth**: Google 생태계에 종속
- **Auth0**: 유료 서비스로 비용 부담

### 📁 파일 저장 시스템

#### **Vercel Blob Storage** (최종 선택)
✅ **선택 이유:**
- Vercel 생태계와 완벽 통합
- 자동 CDN 및 이미지 최적화
- 간단한 API 사용법
- 무료 티어 제공

#### **대안:**
- **AWS S3**: 복잡한 설정
- **Cloudinary**: 이미지 전용

### 🔔 실시간 기능 구현

#### **Vercel에서의 실시간 기능 해결 방안:**
1. **Server-Sent Events (SSE)**: 단방향 실시간 업데이트
2. **Polling**: 주기적 API 호출로 데이터 갱신
3. **외부 서비스**: Pusher, Ably 등 WebSocket 서비스
4. **향후 확장**: 별도 WebSocket 서버 (Railway/Render)

## 🗂️ 현재 임시 데이터 구조 분석

### 사용자 프로필
```typescript
// src/app/profile/page.tsx - mockUser 참고
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  location: string;
  joinedDate: string;
  bio: string;
  level: 'Beginner' | 'Junior' | 'Mid-Level' | 'Senior' | 'Expert' | 'Student';
  techStack: string[];  // 단순 문자열 배열로 관리
  interests: string[];
  social: {
    github?: string;
    discord?: string;
    email: string;
  };
  badges: Array<{
    name: string;
    icon: string;
    description: string;
  }>;
  stats: {
    posts: number;
    likes: number;
    comments: number;
    projects: number;
    studies: number;
    mentoring: number;
  };
}
```

### 커뮤니티 포스트
```typescript
// src/app/community/[id]/page.tsx - mockPost 참고
interface CommunityPost {
  id: number;
  type: 'project' | 'study' | 'mentoring';
  title: string;
  description: string;  // 마크다운 지원 예정
  author: User;
  techTags: string[];  // 기술 스택 태그
  location: string;    // '온라인' 또는 지역명
  duration: string;    // '3개월', '장기' 등
  schedule?: string;   // 정기 미팅 일정
  currentMembers: number;
  maxMembers: number;
  likes: number;
  comments: number;
  views: number;
  createdAt: string;
  updatedAt: string;
  status: 'recruiting' | 'in_progress' | 'completed' | 'closed';
  requirements: string[];  // 지원 요구사항
  benefits: string[];      // 참여 혜택
}
```

### 기술 스택 데이터
```typescript
// src/lib/data.ts - TECHS 참고
interface Tech {
  id: number;
  name: string;
  slug: string;
  category: string;
  description: string;
  logo: string;
  color: string;
  popularity: number;
  companies: string[];  // 사용하는 회사들
  learningResources: Array<{
    title: string;
    url: string;
    type: 'tutorial' | 'documentation' | 'course' | 'blog';
  }>;
}
```

### 댓글 시스템
```typescript
interface Comment {
  id: number;
  postId: number;
  author: {
    id: string;
    name: string;
    avatar?: string;
    level: string;
  };
  content: string;
  createdAt: string;
  likes: number;
  replies: number;
  parentId?: number;  // 대댓글용
}
```

## 🚧 프로젝트 완성 로드맵

### Phase 1: 백엔드 기반 구축 (2주)

#### Week 1: 환경 설정 및 데이터베이스
- [ ] **Vercel 프로젝트 설정**
  - Vercel 계정 생성 및 GitHub 연동
  - 환경 변수 설정
  - 도메인 연결 (선택사항)

- [ ] **PostgreSQL 데이터베이스 설계**
  - Vercel Postgres 인스턴스 생성
  - `datamodels.md`에 따른 테이블 스키마 작성
  - 인덱스 및 관계 설정

- [ ] **Prisma ORM 설정**
  ```bash
  npm install prisma @prisma/client
  npx prisma init
  ```
  - 스키마 파일 작성
  - 마이그레이션 실행
  - 시드 데이터 준비

#### Week 2: 인증 및 기본 API
- [ ] **NextAuth.js 설정**
  ```bash
  npm install next-auth @auth/prisma-adapter
  ```
  - GitHub, Google, Discord OAuth 설정
  - 세션 관리 구현
  - 프로바이더 설정

- [ ] **기본 API 엔드포인트 작성**
  - `/api/auth/[...nextauth]` - 인증 처리
  - `/api/users` - 사용자 CRUD
  - `/api/posts` - 커뮤니티 포스트 CRUD
  - `/api/techs` - 기술 스택 정보

### Phase 2: 사용자 시스템 구현 (2주)

#### Week 3: 인증 및 프로필
- [ ] **사용자 인증 구현**
  - 로그인/로그아웃 UI 컴포넌트
  - 보호된 라우트 구현
  - 세션 상태 관리 (Zustand 또는 Context)

- [ ] **프로필 관리 기능**
  - 프로필 편집 폼 (현재 mock 데이터 → DB 연동)
  - 아바타 이미지 업로드 (Vercel Blob)
  - 소셜 링크 관리
  - 기술 스택 선택/편집

#### Week 4: 파일 업로드 및 개선
- [ ] **파일 시스템 구현**
  ```bash
  npm install @vercel/blob
  ```
  - 이미지 업로드 API
  - 이미지 최적화 및 리사이징
  - 파일 타입 검증

- [ ] **사용자 경험 개선**
  - 로딩 상태 처리
  - 에러 처리 및 토스트 알림
  - 폼 유효성 검사

### Phase 3: 커뮤니티 기능 구현 (3주)

#### Week 5-6: 게시글 시스템
- [ ] **포스트 CRUD 기능**
  - 게시글 작성/수정/삭제 API
  - 마크다운 에디터 통합
  - 이미지 첨부 기능
  - 태그 시스템

- [ ] **댓글 시스템**
  - 댓글 CRUD API
  - 대댓글 (중첩 댓글) 구현
  - 실시간 댓글 업데이트 (SSE 또는 Polling)

#### Week 7: 상호작용 기능
- [ ] **좋아요/북마크 시스템**
  - 좋아요 API 및 UI
  - 북마크 기능
  - 사용자별 활동 이력

- [ ] **검색 및 필터링**
  - PostgreSQL 전체 텍스트 검색
  - 기술 스택별 필터
  - 지역별/타입별 필터
  - 검색 결과 페이지네이션

### Phase 4: 매칭 및 알림 시스템 (3주)

#### Week 8-9: 매칭 시스템
- [ ] **프로젝트 참여 시스템**
  - 참여 신청/승인 워크플로우
  - 팀원 상태 관리 (대기/승인/거절)
  - 알림 시스템 연동

- [ ] **팀 관리 기능**
  - 팀장 권한 시스템
  - 팀원 초대 기능
  - 프로젝트 상태 관리

#### Week 10: 알림 및 이메일
- [ ] **실시간 알림 시스템**
  - 인앱 알림 (헤더 벨 아이콘)
  - 푸시 알림 (PWA)
  - 알림 읽음/안읽음 상태

- [ ] **이메일 알림 시스템**
  ```bash
  npm install @vercel/email resend
  ```
  - 가입 환영 이메일
  - 프로젝트 매칭 알림
  - 주간 요약 뉴스레터

### Phase 5: 고도화 기능 (3주)

#### Week 11-12: 실시간 기능
- [ ] **채팅 시스템 (선택사항)**
  - 외부 서비스 연동 (Pusher 또는 Ably)
  - 프로젝트별 채팅방
  - 1:1 다이렉트 메시지

- [ ] **통계 및 대시보드**
  - 사용자 활동 통계
  - 프로젝트 성공률 분석
  - 기술 트렌드 분석

#### Week 13: PWA 및 최적화
- [ ] **PWA 기능**
  - 서비스 워커 설정
  - 오프라인 지원
  - 앱 설치 프롬프트

- [ ] **성능 최적화**
  - 이미지 최적화
  - 코드 스플리팅
  - 캐싱 전략
  - Lighthouse 점수 90+ 달성

### Phase 6: 배포 및 운영 (1주)

#### Week 14: 프로덕션 배포
- [ ] **배포 환경 구성**
  - 프로덕션 환경 변수 설정
  - 도메인 및 SSL 인증서
  - CDN 설정

- [ ] **모니터링 설정**
  - Vercel Analytics
  - 에러 트래킹 (Sentry)
  - 성능 모니터링

- [ ] **SEO 최적화**
  - 메타 태그 최적화
  - 구조화 데이터 (JSON-LD)
  - 사이트맵 자동 생성
  - 검색 엔진 등록

## 🏗️ 개발 환경 설정

### 필수 계정 및 서비스
1. **GitHub**: 코드 관리 및 OAuth
2. **Vercel**: 배포, 데이터베이스, Blob 스토리지
3. **Google Cloud**: Google 소셜 로그인
4. **Discord Developer Portal**: Discord OAuth

### 환경 변수 설정
```bash
# .env.local
# NextAuth
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000

# Database (Vercel Postgres)
POSTGRES_PRISMA_URL=your-postgres-connection-string
POSTGRES_URL_NON_POOLING=your-postgres-direct-connection

# OAuth Providers
GITHUB_CLIENT_ID=your-github-oauth-id
GITHUB_CLIENT_SECRET=your-github-oauth-secret

GOOGLE_CLIENT_ID=your-google-oauth-id
GOOGLE_CLIENT_SECRET=your-google-oauth-secret

DISCORD_CLIENT_ID=your-discord-oauth-id
DISCORD_CLIENT_SECRET=your-discord-oauth-secret

# File Storage (Vercel Blob)
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token

# Email (Resend)
RESEND_API_KEY=your-resend-api-key
```

### 개발 도구 설치
```bash
# 프로젝트 의존성
npm install

# 데이터베이스 도구
npm install prisma @prisma/client

# 인증
npm install next-auth @auth/prisma-adapter

# 파일 업로드
npm install @vercel/blob

# 이메일
npm install resend

# 실시간 기능 (선택)
npm install pusher pusher-js
```

## 📊 예상 비용 분석 (월간)

### 무료 티어로 시작 가능
- **Vercel**: 무료 (Pro: $20/월)
- **Vercel Postgres**: 무료 0.5GB (Pro: $20/월)
- **Vercel Blob**: 무료 1GB (추가: $0.15/GB)
- **GitHub**: 무료 (Private 저장소 포함)
- **Resend**: 무료 3,000통/월 (추가: $1/1,000통)

### 확장 시 예상 비용 (사용자 1,000명 기준)
- **Vercel Pro**: $20/월
- **Database**: $20-40/월
- **Blob Storage**: $5-15/월
- **이메일**: $10-20/월
- **총 예상**: $55-95/월

## 🎨 디자인 시스템

### 색상 팔레트
```css
/* Primary Colors */
--blue-600: #2563eb;
--blue-700: #1d4ed8;
--purple-600: #9333ea;
--purple-700: #7c3aed;

/* Status Colors */
--green-500: #10b981;   /* Success */
--yellow-500: #f59e0b;  /* Warning */
--red-500: #ef4444;     /* Error */

/* Neutral Colors */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-600: #4b5563;
--gray-900: #111827;
```

### 컴포넌트 스타일
```css
/* Glassmorphism Effect */
.glass {
  @apply bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg;
}

/* Gradient Backgrounds */
.gradient-primary {
  @apply bg-gradient-to-r from-blue-600 to-purple-600;
}

/* Rounded Corners */
.card-rounded {
  @apply rounded-2xl;
}

.button-rounded {
  @apply rounded-lg;
}
```

## 🔒 보안 고려사항

### 인증 및 권한
- JWT 토큰 보안 설정
- CSRF 토큰 사용
- Rate Limiting 적용
- 입력 데이터 검증 및 Sanitization

### 데이터 보호
- 민감한 정보 암호화
- HTTPS 강제 사용
- SQL Injection 방지 (Prisma ORM)
- XSS 방지

### API 보안
- 인증이 필요한 엔드포인트 보호
- API Rate Limiting
- 에러 메시지에서 민감한 정보 제외

## 📱 반응형 디자인

### 브레이크포인트
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px
- **Wide**: > 1400px

### 모바일 우선 접근
- 모바일에서 먼저 디자인하고 데스크탑으로 확장
- 터치 친화적 인터페이스
- 가독성 우선 타이포그래피

## 🔄 API 설계 원칙

### RESTful API 구조
```
GET    /api/posts           # 게시글 목록 조회
POST   /api/posts           # 게시글 생성
GET    /api/posts/[id]      # 특정 게시글 조회
PUT    /api/posts/[id]      # 게시글 수정
DELETE /api/posts/[id]      # 게시글 삭제

GET    /api/posts/[id]/comments    # 댓글 목록
POST   /api/posts/[id]/comments    # 댓글 작성

POST   /api/posts/[id]/like        # 좋아요
DELETE /api/posts/[id]/like        # 좋아요 취소
```

### 응답 형식 표준화
```typescript
// 성공 응답
{
  success: true,
  data: T,
  message?: string
}

// 에러 응답
{
  success: false,
  error: {
    code: string,
    message: string,
    details?: any
  }
}
```

## 🚀 배포 및 DevOps

### CI/CD 파이프라인
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run build
      - run: npm run test
      - uses: amondnet/vercel-action@v20
```

### 배포 환경 관리
- **Development**: 개발 브랜치 자동 배포
- **Staging**: `staging` 브랜치로 테스트 환경
- **Production**: `main` 브랜치로 프로덕션 배포

## 📈 성능 최적화 목표

### Core Web Vitals 목표
- **LCP (Largest Contentful Paint)**: < 2.5초
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### 최적화 전략
- Next.js Image Optimization 활용
- 코드 스플리팅으로 번들 크기 최소화
- 서버 컴포넌트 활용으로 클라이언트 JavaScript 감소
- 적절한 캐싱 전략 구현

---

## 🚀 빠른 시작

```bash
# 1. 저장소 클론
git clone <repository-url>
cd stackload_Test

# 2. 의존성 설치
npm install

# 3. 환경 변수 설정
cp .env.example .env.local
# .env.local 파일 편집

# 4. 데이터베이스 설정 (Phase 1 이후)
npx prisma generate
npx prisma db push
npx prisma db seed

# 5. 개발 서버 실행
npm run dev
```

**개발 서버**: http://localhost:3000

---

**개발 시작일**: 현재
**예상 완료일**: 14주 후
**팀 구성**: 1-3명 (프론트엔드, 백엔드, 디자인)
**예상 초기 비용**: $0/월 (무료 티어)
**확장 후 비용**: $55-95/월