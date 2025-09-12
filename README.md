# 🚀 StackLoad — 개발자 기술스택 가이드 & 커뮤니티

개발자가 기술을 탐색/비교/학습하고, 커뮤니티로 협업할 수 있는 플랫폼

![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![React](https://img.shields.io/badge/React-19.1.0-61DAFB) ![Tailwind](https://img.shields.io/badge/Tailwind-4-38B2AC)

## ✨ 제공 기능

- 기술 탐색/검색 (퍼지검색)
- 기술 상세(리소스/사용 기업)
- 기업별 기술 스택 보기
- 커뮤니티(프로젝트/스터디/멘토링)
- 프로필(보유 기술, 활동)

## ⚡ 빠른 시작

```bash
git clone <repo-url>
cd stackload_Test
npm install
npm run dev
# http://localhost:3000
```

주요 스크립트:

```bash
npm run build   # 프로덕션 빌드
npm start       # 프로덕션 실행
npm run lint    # ESLint 검사
```

## 🧱 폴더 구조(요약)

```
src/
  app/            # 페이지(App Router)
    api/          # API(techs, companies, posts 등)
    community/    # 커뮤니티 목록/작성/상세
    tech/[slug]/  # 기술 상세
    companies/    # 기업 목록
    profile/      # 사용자 프로필
  components/     # 재사용 컴포넌트(shadcn/ui)
  lib/            # 타입/유틸/정적 데이터
  store/          # Zustand 전역 상태
public/data/      # JSON 데이터(초기/백업)
prisma/           # DB 스키마 & 시드
```

## 💾 데이터 & DB

- 현재: `public/data/*.json` 기반(시연/초기용)
- DB: `prisma/schema.prisma`에 User/Post/Comment/Like/Bookmark/Tag/Notification 등 11개 모델 정의
- 로컬 시각화(Prisma Studio):

```bash
npx prisma studio --port 5555
# http://localhost:5555
```

## 🔐 환경 변수(예시)

`.env`

```
POSTGRES_PRISMA_URL=postgresql://user:pass@host:5432/db?schema=public
POSTGRES_URL_NON_POOLING=postgresql://user:pass@host:5432/db
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
```

## 🧭 개발 가이드(요약)

- 컴포넌트: `src/components/ui/*`로 일관된 UI
- 데이터: 서버 컴포넌트/서버 액션 우선, 전역 상태 최소화(Zustand)
- 성능: 이미지 최적화, 코드 스플리팅, InView 지연 렌더링
- 접근성: ARIA 기본, 모바일 우선

## 🚀 배포(Vercel 권장)

- GitHub 연동 → 브랜치별 프리뷰 자동 생성
- Dev/Preview/Prod 환경변수 분리 관리

## 📌 현재 진행상황

- 랜딩/검색/기술상세/기업/커뮤니티/프로필 페이지 기본 UI 완료
- JSON → DB 전환 위한 Prisma 스키마/시드 준비
- 커뮤니티 좋아요/댓글/신청/태그 모델 설계 완료
- 브랜치 `feature/community-functions` 작업 푸시(PR 예정)

자세한 로드맵은 `project-phases.md`를 참고하세요.

## 🤝 기여

1. 이슈 등록 → 2) 기능 브랜치 생성 → 3) 커밋/푸시 → 4) PR 생성

- 커밋 프리픽스: `feat|fix|docs|refactor|chore`
- PR에 스크린샷/영상 첨부 권장

---

Copyright © StackLoad

## 📂 파일/디렉터리 상세 구조

```
stackload_Test/
├── package.json                # 스크립트/의존성
├── next.config.ts              # Next.js 설정
├── tsconfig.json               # TypeScript 설정
├── postcss.config.mjs          # PostCSS/Tailwind 설정
├── eslint.config.mjs           # ESLint 설정
├── README.md                   # 이 문서
├── project-phases.md           # 진행 현황/로드맵
├── datamodels.md               # 데이터베이스 모델 설명서
├── prisma/
│   ├── schema.prisma           # Prisma 스키마(11개 모델)
│   ├── seed.ts                 # 초기 시드 데이터
│   └── migrations/             # 마이그레이션 파일들
├── public/
│   ├── data/
│   │   ├── techs.json          # 기술 데이터(초기/데모)
│   │   ├── companies.json      # 기업 데이터(초기/데모)
│   │   └── paths.json          # 학습 로드맵(초기/데모)
│   ├── next.svg
│   └── vercel.svg
├── scripts/
│   ├── check-data.js           # JSON 간단 검사 스크립트
│   ├── verify-schema.ts        # 스키마 일치 여부 검증
│   └── simple-check.js         # 경량 체크
└── src/
    ├── app/                    # 페이지(App Router)
    │   ├── layout.tsx          # 전역 레이아웃(헤더/푸터/프로바이더)
    │   ├── globals.css         # 전역 스타일
    │   ├── page.tsx            # 홈 페이지
    │   ├── not-found.tsx       # 404 페이지
    │   ├── robots.ts           # robots.txt 생성기
    │   ├── sitemap.ts          # sitemap 생성기
    │   ├── api/                # 서버 API 라우트
    │   │   ├── techs/route.ts      # 기술 목록/상세 API
    │   │   ├── companies/route.ts  # 기업 목록 API
    │   │   ├── paths/route.ts      # 학습 로드맵 API (학습로드맵은 사용 안함)
    │   │   └── firecrawl/route.ts  # 외부 수집(삭제예정)
    │   ├── search/
    │   │   ├── page.tsx        # 검색 페이지(UI)
    │   │   ├── loading.tsx     # 로딩 스켈레톤
    │   │   └── error.tsx       # 에러 UI
    │   ├── tech/
    │   │   └── [slug]/page.tsx # 기술 상세 페이지
    │   ├── companies/
    │   │   └── page.tsx        # 기업 목록 페이지
    │   ├── collections/
    │   │   ├── page.tsx        # 컬렉션 인덱스
    │   │   └── [slug]/page.tsx # 컬렉션 상세(데모)
    │   ├── paths/
    │   │   └── page.tsx        # 학습 로드맵 페이지
    │   ├── insights/
    │   │   └── page.tsx        # 인사이트/링크 모음
    │   ├── community/          # 커뮤니티(프로젝트/스터디/멘토링)
    │   │   ├── page.tsx        # 목록/필터/정렬(현재 Mock)
    │   │   ├── create/page.tsx # 작성 폼(UI만, 단계별 입력)
    │   │   └── [id]/page.tsx   # 상세(레이아웃/요약/메타)
    │   └── profile/
    │       └── page.tsx        # 사용자 프로필(현재 Mock)
    ├── components/             # 재사용 컴포넌트
    │   ├── providers.tsx       # 전역 Provider(Zustand 등)
    │   ├── site-header.tsx     # 헤더(네비/검색)
    │   ├── site-footer.tsx     # 푸터
    │   ├── command-palette.tsx # Cmd/Ctrl+K 명령 팔레트
    │   ├── inview.tsx          # 스크롤 인뷰 애니메이션 래퍼
    │   ├── landing/            # 랜딩 섹션 UI
    │   │   ├── hero-glass.tsx
    │   │   ├── hero-search.tsx
    │   │   ├── tabs-trending.tsx
    │   │   └── ticker.tsx
    │   ├── home/               # 홈 전용 위젯
    │   │   ├── community-preview.tsx
    │   │   ├── company-preview.tsx
    │   │   ├── tech-companies-preview.tsx
    │   │   ├── popular-techs.tsx
    │   │   ├── recent-activity.tsx
    │   │   └── stack-overview.tsx
    │   ├── insights/
    │   │   ├── company-insights.tsx
    │   │   └── tech-stack-insights.tsx
    │   ├── tech-detail/
    │   │   ├── learning-guide.tsx
    │   │   └── company-map.tsx
    │   ├── tech/
    │   │   └── favorite-button.tsx
    │   └── ui/                 # shadcn/ui 래핑/유틸 컴포넌트
    │       ├── button.tsx, card.tsx, input.tsx, dialog.tsx ...
    │       ├── accordion.tsx, tabs.tsx, table.tsx, sheet.tsx ...
    │       └── skeleton.tsx, empty-state.tsx 등 공통 UI
    ├── lib/
    │   ├── types.ts            # 타입 정의(Tech/Company 등)
    │   ├── data.ts             # 정적 우선 데이터(하이라이트용)
    │   ├── insights-data.ts    # 인사이트 링크 데이터
    │   └── utils.ts            # 공통 유틸 함수
    └── store/
        ├── tech-store.ts       # 기술 관련 전역 상태(Zustand)
        └── favorites-store.ts  # 즐겨찾기 전역 상태(Zustand)
```

### 🔎 디렉터리별 핵심 설명

- `src/app/`: URL 경로 = 폴더 구조. 서버/클라이언트 컴포넌트 혼용 가능. `api/*`는 서버 라우트.
- `src/components/ui/`: shadcn/ui 기반 공통 컴포넌트. 일관된 디자인/동작 보장.
- `src/components/home/*`: 홈 전용 섹션 위젯. 데이터 연결 지점 분리.
- `src/lib/types.ts`: 전역 타입. API/DB/컴포넌트 간 계약 일치에 중요.
- `prisma/schema.prisma`: DB 모델의 단일 소스. 마이그레이션/클라이언트 생성 근거.
- `public/data/*.json`: 초기/데모 데이터. 점진적 DB 전환 전까지 UI 구동 용도.
- `scripts/*`: 데이터/스키마 검증 자동화 스크립트. CI 단계에 연결 권장.

### 🧪 로컬 개발 팁

```bash
# 타입/린트/빌드 빠른 점검
npx tsc --noEmit && npm run lint && npm run build

# Prisma
npx prisma generate && npx prisma db push && npx prisma studio
```
