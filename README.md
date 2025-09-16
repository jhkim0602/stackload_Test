# 🚀 StackLoad - 개발자 기술스택 가이드 & 커뮤니티

개발자가 기술을 탐색하고 학습하며, 커뮤니티를 통해 협업할 수 있는 종합 플랫폼입니다.

![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![React](https://img.shields.io/badge/React-19.1.0-61DAFB) ![Tailwind](https://img.shields.io/badge/Tailwind-4-38B2AC) ![Prisma](https://img.shields.io/badge/Prisma-6.16.1-2D3748) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-336791) ![NextAuth](https://img.shields.io/badge/NextAuth-4.24.11-green) ![Zustand](https://img.shields.io/badge/Zustand-5.0.8-orange)

## ✨ 주요 기능

### 🔍 기술 탐색 & 학습
- **AI 기반 기술 가이드**: 12개 핵심 기술 스택에 대한 상세한 AI 설명 제공
- **기업별 기술 스택**: 네이버, 카카오, 삼성전자 등 주요 기업의 실제 사용 기술
- **학습 리소스**: 각 기술별 공식 문서, 튜토리얼, 홈페이지 링크
- **기술 댓글 시스템**: 개발자들의 실제 경험과 의견 공유

### 👥 커뮤니티 & 협업
- **프로젝트 모집**: 팀 프로젝트 멤버 모집 및 참여
- **스터디 그룹**: 함께 학습할 스터디 그룹 생성 및 참가
- **정보공유/멘토링**: 개발 경험 공유 및 멘토링 기회 제공
- **실시간 상호작용**: 댓글, 좋아요, 조회수 기반 활발한 커뮤니티

### 👤 개인 프로필 관리
- **완전한 프로필 편집**: 자기소개, 위치, 경험 레벨, 소셜 링크 관리
- **기술 스택 숙련도**: 보유 기술과 숙련도 레벨 설정 및 관리
- **활동 통계**: 작성한 글, 받은 좋아요, 댓글 수 등 활동 기록
- **소셜 링크 연동**: GitHub, Discord, LinkedIn 등 다양한 플랫폼 연결

## 🛠 기술 스택

### Frontend
- **Next.js 15.5.2** - App Router, Turbopack 사용
- **React 19.1.0** - 최신 React 기능 활용
- **TypeScript 5** - 완전한 타입 안전성
- **Tailwind CSS 4** - 유틸리티 우선 스타일링
- **shadcn/ui** - 모던하고 접근성이 좋은 UI 컴포넌트
- **Zustand 5.0.8** - 간단하고 효율적인 상태 관리

### Backend & Database
- **Next.js API Routes** - 서버리스 풀스택 아키텍처
- **Prisma 6.16.1** - 타입 안전한 데이터베이스 ORM
- **PostgreSQL** - Supabase 클라우드 호스팅
- **NextAuth.js 4.24.11** - Google OAuth 소셜 로그인
- **AI 콘텐츠 시스템** - 12개 기술에 대한 상세한 AI 설명

### DevTools & Infrastructure
- **ESLint 9** - 코드 품질 및 일관성 관리
- **Vercel** - 자동 배포 및 호스팅
- **Environment-based Deployment** - Preview/Production 환경 분리

## 🚀 빠른 시작

### 1. 프로젝트 설정

```bash
# 저장소 클론
git clone <repository-url>
cd stackload_Test-main

# 의존성 설치
npm install
```

### 2. 환경 변수 설정

`.env` 파일을 생성하고 다음 정보를 입력하세요:

```bash
# 데이터베이스 (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres.username:password@host:port/postgres"

# NextAuth.js 설정
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secure-nextauth-secret"

# Google OAuth (소셜 로그인)
AUTH_GOOGLE_ID="your-google-oauth-client-id"
AUTH_GOOGLE_SECRET="your-google-oauth-client-secret"

# Supabase (선택사항 - 추가 기능용)
SUPABASE_URL="your-supabase-project-url"
SUPABASE_ANON_KEY="your-supabase-anon-key"
```

### 3. 데이터베이스 설정

```bash
# 데이터베이스 스키마 적용
npx prisma db push

# 시드 데이터 생성 (12개 기술, 3개 회사, AI 설명 포함)
npm run db:seed

# Prisma Studio 실행 (선택사항)
npm run db:studio
```

### 4. 개발 서버 실행

```bash
# Turbopack으로 개발 서버 실행
npm run dev
# http://localhost:3000에서 접속
```

## 📁 프로젝트 구조

```
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/                 # API Routes
│   │   │   ├── auth/           # NextAuth.js 인증
│   │   │   ├── users/          # 사용자 관리 (프로필 편집 포함)
│   │   │   ├── posts/          # 커뮤니티 게시글
│   │   │   ├── techs/          # 기술 스택 정보
│   │   │   └── companies/      # 기업 정보
│   │   ├── profile/             # 사용자 프로필 페이지
│   │   ├── community/           # 커뮤니티 페이지
│   │   ├── tech/[slug]/         # 기술 상세 페이지
│   │   └── companies/           # 기업 목록 페이지
│   ├── components/              # React 컴포넌트
│   │   ├── ui/                 # shadcn/ui 기본 컴포넌트
│   │   ├── profile/            # 프로필 관련 컴포넌트
│   │   │   ├── profile-edit-form.tsx
│   │   │   ├── social-links-manager.tsx
│   │   │   └── tech-stack-manager.tsx
│   │   ├── community/          # 커뮤니티 컴포넌트
│   │   └── auth/               # 인증 관련 컴포넌트
│   ├── lib/                     # 유틸리티 및 설정
│   │   ├── auth.ts             # NextAuth 설정
│   │   ├── prisma.ts           # Prisma 클라이언트
│   │   └── api-response.ts     # API 응답 헬퍼
│   ├── contexts/                # React Context
│   │   └── auth-context.tsx    # 인증 컨텍스트
│   └── hooks/                   # 커스텀 훅
├── prisma/
│   ├── schema.prisma           # 정규화된 데이터베이스 스키마
│   └── seed.ts                # AI 설명 포함 시드 데이터
└── public/                     # 정적 파일
```

## 📊 데이터베이스 스키마 (정규화 완료)

### 핵심 테이블 (13개)
- **User**: 사용자 정보, 통계, 프로필 정보
- **Tech**: 기술 스택 정보 (AI 설명, 카테고리, 링크 포함)
- **Company**: 기업 정보 (로고, 설명 포함)
- **Post**: 커뮤니티 게시글 (프로젝트/스터디/정보공유)
- **Comment**: 댓글 및 대댓글 시스템
- **TechComment**: 기술별 전용 댓글 시스템
- **UserTech**: 사용자-기술 관계 (숙련도 레벨 포함)
- **PostTag**: 게시글-기술 태그 연결
- **CompanyTech**: 기업-기술 스택 연결
- **Like/CommentLike/TechCommentLike**: 좋아요 시스템
- **Account/Session**: NextAuth.js 인증
- **Notification**: 알림 시스템

### 주요 개선사항
- **외래키 정규화**: UserTech에서 techName → techId로 변경
- **불필요한 테이블 제거**: PostApplication, VerificationToken 삭제
- **AI 콘텐츠 강화**: 모든 기술에 대한 상세한 AI 설명 추가

## 🎯 주요 명령어

```bash
# 개발
npm run dev                    # Turbopack 개발 서버
npm run build                  # 프로덕션 빌드
npm start                      # 프로덕션 서버

# 환경별 빌드
npm run build:preview          # 프리뷰 환경 빌드
npm run build:production       # 프로덕션 환경 빌드

# 데이터베이스
npm run db:seed               # 시드 데이터 생성
npm run db:studio             # Prisma Studio 실행
npm run db:reset              # 데이터베이스 초기화 후 시드
npm run db:migrate            # 스키마 마이그레이션

# 코드 품질
npm run lint                  # ESLint 검사
npm run type-check           # TypeScript 타입 검사

# 유틸리티
npm run env:check            # 환경 변수 검증
npm run db:health            # 데이터베이스 상태 확인
npm run db:validate          # 시드 데이터 검증
```

## 🔧 개발 환경 설정

### VSCode 추천 확장
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "ms-vscode.vscode-typescript-next",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-json"
  ]
}
```

### 환경별 설정
- **Development**: 로컬 개발 환경 (Turbopack 활성화)
- **Preview**: 스테이징 환경 (Vercel Preview)
- **Production**: 프로덕션 환경 (최적화된 빌드)

## 🏗 아키텍처 특징

### Frontend
- **App Router**: Next.js 15.5.2의 최신 라우팅 시스템
- **Server Components**: 서버 사이드 렌더링 최적화
- **Client Components**: 인터랙션이 필요한 부분만 클라이언트 렌더링

### Backend
- **API Routes**: RESTful API 설계
- **Middleware**: 인증 및 권한 검사
- **Type Safety**: Prisma를 통한 end-to-end 타입 안전성

### 데이터베이스
- **정규화된 스키마**: 성능과 데이터 무결성 최적화
- **관계형 설계**: 효율적인 조인 및 쿼리
- **인덱싱**: 검색 및 정렬 성능 최적화

## 🚀 배포

### Vercel (권장)
```bash
# 프리뷰 배포
npm run deploy:preview

# 프로덕션 배포
npm run deploy:production
```

### 환경 변수 설정
- Vercel Dashboard에서 환경 변수 설정
- Preview/Production 환경별 분리 관리

## 📝 기여 방법

1. **Fork**: 프로젝트 포크
2. **Branch**: 기능 브랜치 생성 (`git checkout -b feature/AmazingFeature`)
3. **Commit**: 변경사항 커밋 (`git commit -m 'Add some AmazingFeature'`)
4. **Push**: 브랜치에 푸시 (`git push origin feature/AmazingFeature`)
5. **Pull Request**: PR 생성

### 개발 가이드라인
- TypeScript 타입 안전성 유지
- ESLint 규칙 준수
- Prisma 스키마 변경 시 마이그레이션 생성
- 컴포넌트는 shadcn/ui 디자인 시스템 활용

## 🔍 주요 기능 상세

### 프로필 편집 시스템
- 실시간 프로필 정보 수정
- 소셜 링크 관리 (GitHub, Discord, LinkedIn 등)
- 기술 스택 숙련도 관리
- 경험 레벨 설정 (초급자~전문가)

### AI 기반 기술 가이드
- 12개 핵심 기술에 대한 상세한 설명
- 실제 사용 사례 및 학습 방향 제시
- 관련 리소스 및 문서 링크 제공

### 커뮤니티 시스템
- 프로젝트 모집, 스터디 그룹, 정보공유
- 실시간 댓글 및 좋아요 시스템
- 태그 기반 검색 및 필터링

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 🤝 지원 및 문의

- **Issues**: GitHub Issues를 통한 버그 리포트 및 기능 요청
- **Discussions**: 개발 관련 토론 및 질문
- **Wiki**: 상세한 개발 문서 및 가이드

---

**Made with ❤️ by StackLoad Team**

> 개발자를 위한, 개발자에 의한 플랫폼 - StackLoad는 모든 개발자의 성장을 지원합니다.