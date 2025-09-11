# 🚀 stackload - 개발자 기술스택 가이드 플랫폼

> 개발자들이 기술을 탐색, 비교, 학습할 수 있는 한국형 레퍼런스 플랫폼

![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![React](https://img.shields.io/badge/React-19.1.0-61DAFB)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38B2AC)

## 📖 목차

- [🚀 빠른 시작](#-빠른-시작)
- [📁 프로젝트 구조](#-프로젝트-구조)
- [💾 데이터 구조 및 관리](#-데이터-구조-및-관리)
- [🛠 개발 환경 설정](#-개발-환경-설정)
- [🎯 주요 기능](#-주요-기능)
- [🗃 데이터베이스 연동 가이드](#-데이터베이스-연동-가이드)
- [📋 개발 워크플로우](#-개발-워크플로우)
- [🚀 배포 가이드](#-배포-가이드)
- [🤝 기여하기](#-기여하기)

## 🚀 빠른 시작

### 필요한 도구
- Node.js 18+ 
- npm 또는 yarn
- Git

### 설치 및 실행
```bash
# 1. 저장소 클론
git clone <repository-url>
cd stackload_Test

# 2. 의존성 설치
npm install

# 3. 개발 서버 실행
npm run dev

# 4. 브라우저에서 확인
# http://localhost:3000
```

### 주요 명령어
```bash
npm run dev          # 개발 서버 실행 (Turbopack 사용)
npm run build        # 프로덕션 빌드
npm start            # 프로덕션 서버 실행
npm run lint         # ESLint 검사
```

## 📁 프로젝트 구조

```
stackload_Test/
├── 📁 src/
│   ├── 📁 app/                    # Next.js App Router 페이지
│   │   ├── 📁 api/               # API 라우트
│   │   │   ├── techs/           # 기술 데이터 API
│   │   │   ├── companies/       # 기업 데이터 API
│   │   │   └── paths/           # 로드맵 데이터 API
│   │   ├── 📁 search/           # 검색 페이지
│   │   ├── 📁 tech/[slug]/      # 기술 상세 페이지
│   │   ├── 📁 companies/        # 기업 목록 페이지
│   │   ├── 📁 paths/            # 로드맵 페이지
│   │   ├── 📁 insights/         # 인사이트 페이지
│   │   ├── 📁 collections/      # 컬렉션 페이지
│   │   ├── 📁 guides/           # 가이드 페이지
│   │   ├── layout.tsx           # 루트 레이아웃
│   │   ├── page.tsx             # 홈페이지
│   │   ├── globals.css          # 글로벌 스타일
│   │   └── not-found.tsx        # 404 페이지
│   ├── 📁 components/            # React 컴포넌트
│   │   ├── 📁 ui/               # shadcn/ui 기본 컴포넌트
│   │   ├── 📁 landing/          # 랜딩 페이지 컴포넌트
│   │   ├── site-header.tsx      # 헤더 컴포넌트
│   │   ├── site-footer.tsx      # 푸터 컴포넌트
│   │   └── command-palette.tsx  # 검색 팔레트
│   ├── 📁 lib/                   # 유틸리티 및 데이터
│   │   ├── types.ts             # TypeScript 타입 정의
│   │   ├── data.ts              # 정적 데이터 (우선순위 높음)
│   │   ├── insights-data.ts     # 인사이트 링크 데이터
│   │   └── utils.ts             # 헬퍼 함수
│   └── 📁 store/                 # Zustand 상태 관리
├── 📁 public/
│   ├── 📁 data/                  # JSON 데이터 파일 (메인 데이터 소스)
│   │   ├── techs.json           # 기술/도구 목록
│   │   ├── companies.json       # 기업 정보
│   │   └── paths.json           # 학습 로드맵
│   ├── next.svg                 # Next.js 로고
│   └── vercel.svg               # Vercel 로고
├── package.json                  # 의존성 및 스크립트
├── next.config.ts               # Next.js 설정
├── tailwind.config.js           # Tailwind CSS 설정
├── tsconfig.json                # TypeScript 설정
└── README.md                    # 이 파일
```

### 핵심 디렉토리 설명

#### 🎯 `src/app/` - 페이지 라우팅
- **Next.js App Router** 사용
- 각 폴더가 URL 경로가 됨
- `layout.tsx`: 공통 레이아웃
- `page.tsx`: 해당 경로의 페이지 컴포넌트

#### 🔌 `src/app/api/` - API 엔드포인트
- 서버사이드 API 라우트
- JSON 데이터를 읽어서 API로 제공
- `sourceName` 필드로 데이터 출처 추적

#### 🧩 `src/components/` - 재사용 가능한 컴포넌트
- **shadcn/ui** 기반 디자인 시스템
- 컴포넌트별로 파일 분리
- Props 타입 정의 필수

#### 📚 `src/lib/` - 비즈니스 로직 및 데이터
- `types.ts`: 모든 TypeScript 타입 정의
- `data.ts`: 우선순위가 높은 정적 데이터
- `utils.ts`: 공통 유틸리티 함수

#### 💾 `public/data/` - 메인 데이터 소스
- JSON 파일 형태로 데이터 저장
- **외부 DB 없이 즉시 운영 가능**
- 파일 수정 후 새로고침만으로 반영

## 💾 데이터 구조 및 관리

### 데이터 소스 우선순위

1. **`src/lib/data.ts`** - 정밀한 메타데이터 (최우선)
2. **`public/data/*.json`** - 대량 데이터 (기본)
3. **`src/lib/insights-data.ts`** - 인사이트 링크 (보조)

### 주요 데이터 타입

#### 🛠 Tech (기술/도구)
```typescript
type Tech = {
  slug: string;           // 고유 식별자 (예: "nextjs", "react")
  name: string;           // 기술명 (예: "Next.js", "React")
  category: TechCategory; // 카테고리 (아래 참조)
  description: string;    // 간단한 설명
  tags: string[];        // 검색용 태그
  homepage?: string;     // 공식 홈페이지
  docs?: string;         // 공식 문서
  repo?: string;         // GitHub 저장소
  logoUrl?: string;      // 로고 이미지 URL
  resources?: {          // 추가 학습 자료
    title: string;
    url: string;
  }[];
}

// 지원하는 카테고리
type TechCategory = 
  | "frontend"      // 프론트엔드
  | "backend"       // 백엔드
  | "mobile"        // 모바일
  | "data"          // 데이터
  | "devops"        // 데브옵스
  | "testing"       // 테스팅
  | "database"      // 데이터베이스
  | "collaboration" // 협업도구
  | "language";     // 프로그래밍 언어
```

#### 🏢 Company (기업)
```typescript
type Company = {
  name: string;              // 기업명
  category: CompanyCategory; // 업종 (아래 참조)
  region?: string;           // 지역 (예: "서울특별시 강남구")
  logoUrl?: string;          // 기업 로고 URL
  techSlugs: string[];       // 사용하는 기술들의 slug 배열
}

// 지원하는 업종
type CompanyCategory = 
  | "ecommerce"    // 이커머스
  | "finance"      // 핀테크
  | "media"        // 미디어
  | "foodtech"     // 푸드테크
  | "healthcare"   // 헬스케어
  | "ai"           // AI
  | "education"    // 에듀테크
  | "work"         // 업무도구
  | "others";      // 기타
```

#### 🛤 Path (학습 로드맵)
```typescript
type Path = {
  slug: string;    // 고유 식별자
  title: string;   // 로드맵 제목
  steps: {         // 학습 단계
    label: string;   // 단계명 (예: "기초", "심화")
    items: string[]; // 해당 단계의 학습 항목들
  }[];
  references?: {   // 참고 자료
    title: string;
    url: string;
  }[];
}
```

### 데이터 추가/수정 방법

#### 방법 1: JSON 파일 직접 수정 (추천)
```bash
# 1. 해당 JSON 파일 편집
vi public/data/techs.json

# 2. 파일 저장 후 브라우저 새로고침
# 자동으로 반영됨!
```

#### 방법 2: 정적 데이터 수정 (우선순위 조정용)
```bash
# 노출 우선순위나 상세 정보 수정
vi src/lib/data.ts

# 인사이트 링크 추가
vi src/lib/insights-data.ts
```

### 데이터 플로우

```
JSON 파일 → API 라우트 → React 컴포넌트 → UI
    ↓
소스 추적을 위한 sourceName 필드 자동 추가
```

## 🛠 개발 환경 설정

### VS Code 추천 확장

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",    // Tailwind CSS 지원
    "esbenp.prettier-vscode",       // 코드 포매팅
    "ms-vscode.vscode-typescript-next", // TypeScript 지원
    "ms-vscode.vscode-eslint"       // ESLint 지원
  ]
}
```

### 환경 변수 설정

개발용 환경 변수 파일 생성:
```bash
# .env.local 파일 생성
touch .env.local
```

```env
# .env.local
# 현재는 환경 변수가 필요 없지만, 향후 DB 연동시 사용
# NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 개발 도구

#### 1. Hot Reload
- Turbopack 사용으로 빠른 개발 경험
- 파일 변경시 자동 새로고침

#### 2. TypeScript 검사
```bash
# 타입 에러 검사
npx tsc --noEmit
```

#### 3. 코드 품질 도구
```bash
# ESLint 실행
npm run lint

# Prettier 포매팅 (VS Code에서 자동)
npx prettier --write .
```

## 🎯 주요 기능

### 🔍 검색 기능
- **Fuse.js** 기반 퍼지 검색
- 기술명, 설명, 태그 검색 지원
- 실시간 검색 결과 표시

### 🏢 기업별 기술스택
- 국내 주요 IT 기업들의 기술스택 정보
- 기업 → 기술, 기술 → 기업 양방향 탐색

### 🛤 학습 로드맵
- 단계별 학습 가이드
- 개발 분야별 추천 학습 경로

### 📊 인사이트
- 국내 기술 블로그 링크 모음
- 채용 정보 및 기술 트렌드

### ⌨️ 명령 팔레트
- `Cmd+K` (Mac) 또는 `Ctrl+K` (Windows)
- 빠른 검색 및 네비게이션

## 🗃 데이터베이스 연동 가이드

### Supabase 연동 (추천)

#### 1. Supabase 프로젝트 생성
```bash
# Supabase 계정 생성 후 새 프로젝트 생성
# https://supabase.com
```

#### 2. 환경 변수 설정
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

#### 3. Supabase 클라이언트 설치
```bash
npm install @supabase/supabase-js
```

#### 4. 클라이언트 설정
```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)
```

#### 5. 테이블 스키마 생성
```sql
-- Techs 테이블
CREATE TABLE techs (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'frontend', 'backend', 'mobile', 'data', 'devops', 
    'testing', 'database', 'collaboration', 'language'
  )),
  description TEXT,
  tags TEXT[],
  homepage TEXT,
  docs TEXT,
  repo TEXT,
  logo_url TEXT,
  resources JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Companies 테이블
CREATE TABLE companies (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  region TEXT,
  logo_url TEXT,
  tech_slugs TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Paths 테이블
CREATE TABLE paths (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  steps JSONB NOT NULL,
  references JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security 활성화
ALTER TABLE techs ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE paths ENABLE ROW LEVEL SECURITY;

-- 읽기 권한 정책
CREATE POLICY "Allow public read access" ON techs FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON companies FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON paths FOR SELECT USING (true);
```

#### 6. API 라우트 수정
```typescript
// src/app/api/techs/route.ts
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase
    .from('techs')
    .select('*')
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  const withSource = data.map(tech => ({
    ...tech,
    logoUrl: tech.logo_url, // 필드명 변환
    sourceName: 'supabase:techs'
  }))
  
  return NextResponse.json(withSource)
}

// POST 엔드포인트 추가 (관리자용)
export async function POST(request: Request) {
  const body = await request.json()
  
  const { data, error } = await supabase
    .from('techs')
    .insert(body)
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json(data)
}
```

### 점진적 마이그레이션 전략

1. **1단계**: JSON 파일과 DB 병행 운영
2. **2단계**: 읽기는 DB, 쓰기는 관리 페이지
3. **3단계**: 완전 DB 전환 + JSON 백업

### 기타 DB 옵션

#### PostgreSQL + Prisma
```bash
npm install prisma @prisma/client
npx prisma init
```

#### MongoDB + Mongoose
```bash
npm install mongoose
```

## 📋 개발 워크플로우

### Git 컨벤션

#### 브랜치 전략
```bash
main          # 프로덕션 배포용
develop       # 개발 통합 브랜치
feature/*     # 새 기능 개발
bugfix/*      # 버그 수정
hotfix/*      # 긴급 수정
```

#### 커밋 메시지 규칙
```bash
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포매팅 (기능 변경 없음)
refactor: 코드 리팩토링
test: 테스트 추가/수정
chore: 빌드 프로세스/도구 설정

# 예시
feat: 기술 검색 기능 추가
fix: 기업 목록 로딩 에러 수정
docs: API 문서 업데이트
```

### 코드 스타일 가이드

#### TypeScript
```typescript
// ✅ 좋은 예
interface TechCardProps {
  tech: Tech
  onSelect?: (tech: Tech) => void
}

export function TechCard({ tech, onSelect }: TechCardProps) {
  // 구현
}

// ❌ 나쁜 예
function TechCard(props: any) {
  // any 타입 사용 금지
}
```

#### React 컴포넌트
```typescript
// ✅ 함수형 컴포넌트 사용
export function ComponentName() {
  return <div>...</div>
}

// ✅ Props 타입 정의
interface Props {
  title: string
  isVisible?: boolean
}

// ✅ 기본값 설정
export function Modal({ title, isVisible = false }: Props) {
  // 구현
}
```

#### CSS/Tailwind
```typescript
// ✅ Tailwind 클래스 정리
const buttonClasses = cn(
  "px-4 py-2 rounded-md font-medium",
  "bg-blue-500 hover:bg-blue-600",
  "text-white transition-colors",
  isDisabled && "opacity-50 cursor-not-allowed"
)

// ✅ 컴포넌트별 스타일 분리
<div className="space-y-4">
  <Header />
  <Main className="container mx-auto px-4" />
  <Footer />
</div>
```

### 테스트 작성 가이드

#### 컴포넌트 테스트 (향후 추가 예정)
```typescript
// __tests__/components/TechCard.test.tsx
import { render, screen } from '@testing-library/react'
import { TechCard } from '@/components/TechCard'

const mockTech = {
  slug: 'react',
  name: 'React',
  category: 'frontend' as const,
  description: 'UI 라이브러리',
  tags: ['ui', 'library']
}

test('기술 정보를 올바르게 렌더링한다', () => {
  render(<TechCard tech={mockTech} />)
  
  expect(screen.getByText('React')).toBeInTheDocument()
  expect(screen.getByText('UI 라이브러리')).toBeInTheDocument()
})
```

### 성능 최적화 체크리스트

- [ ] `next/image` 사용으로 이미지 최적화
- [ ] 동적 import로 코드 스플리팅
- [ ] React.memo로 불필요한 리렌더링 방지
- [ ] useMemo/useCallback으로 연산 최적화
- [ ] Lighthouse 점수 90+ 유지

## 🚀 배포 가이드

### Vercel 배포 (추천)

#### 1. Vercel 계정 연동
```bash
# Vercel CLI 설치
npm install -g vercel

# 프로젝트 배포
vercel
```

#### 2. 자동 배포 설정
- GitHub 저장소와 Vercel 연동
- `main` 브랜치 푸시시 자동 배포
- 프리뷰 배포로 변경사항 미리 확인

#### 3. 환경 변수 설정
Vercel 대시보드에서 환경 변수 추가:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### 배포 전 체크리스트

```bash
# 1. 빌드 테스트
npm run build

# 2. 타입 검사
npx tsc --noEmit

# 3. 린트 검사
npm run lint

# 4. 로컬에서 프로덕션 테스트
npm start
```

### 도메인 및 SEO 설정

#### sitemap.xml 자동 생성
```typescript
// src/app/sitemap.ts
export default function sitemap() {
  return [
    {
      url: 'https://stackload.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    // 동적으로 기술/기업 페이지 추가
  ]
}
```

#### robots.txt 설정
```typescript
// src/app/robots.ts
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://stackload.com/sitemap.xml',
  }
}
```

## 🤝 기여하기

### 이슈 리포팅
1. **버그 발견시**: 재현 단계와 함께 이슈 등록
2. **기능 제안**: 사용 사례와 함께 제안
3. **문서 개선**: 불명확한 부분 피드백

### 풀 리퀘스트 가이드
1. Fork 저장소 생성
2. 기능 브랜치 생성 (`feature/amazing-feature`)
3. 변경사항 커밋
4. 브랜치에 푸시
5. Pull Request 생성

### 개발 참여 전 확인사항
- [ ] 이슈 확인 및 논의
- [ ] 코딩 컨벤션 준수
- [ ] 타입 안정성 보장
- [ ] 테스트 작성 (해당시)
- [ ] 문서 업데이트

## 📞 지원 및 문의

- **이슈 트래커**: GitHub Issues
- **문서**: 이 README.md 파일
- **개발자 가이드**: `/docs` 폴더 (향후 추가 예정)

---

## 📝 변경 이력

### v0.1.0 (현재)
- ✅ 기본 프로젝트 구조 완성
- ✅ JSON 기반 데이터 관리
- ✅ 기술/기업/로드맵 페이지
- ✅ 검색 기능
- ✅ 반응형 디자인

### 향후 계획
- [ ] 데이터베이스 연동
- [ ] 관리자 페이지
- [ ] 사용자 인증
- [ ] 즐겨찾기 기능
- [ ] API 확장

---

**💡 팁**: 주니어 개발자라면 `src/components/ui/` 폴더의 간단한 컴포넌트부터 시작해보세요!