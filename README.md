stackload – 개발자 기술스택 가이드 플랫폼

이 문서는 코드를 몰라도 운영/유지보수할 수 있도록 설계되었습니다. 아래만 따라 하면 됩니다.

실행

```bash
npm install
npm run dev
```

폴더 구조(핵심만)

- src/app: 라우트(페이지). App Router 사용
- src/components: UI 컴포넌트(shadcn/ui 기반)
- src/lib: 타입/정적 데이터/헬퍼
- public/data: 운영 데이터(JSON). 외부 DB 없이도 즉시 서비스 가능

데이터 원천과 표시 위치

- public/data/techs.json → 기술 목록. 검색(/search), 상세(/tech/[slug])에 사용
- public/data/companies.json → 기업 목록. 기업(/companies), 인사이트(/insights)에 사용
- public/data/paths.json → 로드맵. /paths에 사용
- src/lib/data.ts → 선별된 핵심 카탈로그(정밀 메타/링크 보정)
- src/lib/insights-data.ts → 국내 블로그/채용/뉴스 링크 묶음

JSON 스키마(권장)

- Tech
  - slug: string (고유)
  - name: string
  - category: "frontend" | "backend" | "mobile" | "data" | "devops" | "testing" | "database" | "collaboration" | "language"
  - description?: string
  - tags?: string[]
  - homepage?: string
  - docs?: string
  - repo?: string
  - logoUrl?: string
  - resources?: { title: string; url: string }[]

- Company
  - slug: string (고유)
  - name: string
  - category: string (예: ecommerce, finance, media, ai, healthcare, work, others 등)
  - region?: string (예: 대한민국/도시)
  - logoUrl?: string
  - techSlugs: string[] (Tech.slug 배열)

- Path(로드맵)
  - slug: string (고유)
  - title: string
  - steps: { label: string; items: string[] }[]
  - references?: { title: string; url: string }[]

데이터 유지보수 방법(가장 쉬운 절차)

1) 대량 추가/수정: public/data/*.json 수정 → 저장 → 브라우저 새로고침
   - API 라우트가 자동으로 JSON을 읽고 응답하며, 응답에 `sourceName`이 추가됩니다.
2) 노출 우선순위/설명 강화: src/lib/data.ts의 TECHS/COMPANIES/COLLECTIONS/GUIDES에서 정밀 보정
3) 인사이트 소스 확장: src/lib/insights-data.ts에 KR_BLOGS/KR_JOBS/KR_NEWS 추가

이미지 최적화(next/image)

- 외부 아이콘/로고를 위해 `next.config.ts`에 remotePatterns가 설정되어 있습니다.
- 컴포넌트는 `next/image`로 교체되어 LCP 개선 및 자동 최적화가 적용됩니다.

배포 체크리스트

- npm run build가 통과되는지 확인
- any 금지, 서버/클라이언트 경계(use client) 준수
- 누락된 동적 라우트의 notFound 처리 확인
- sitemap.ts/robots.ts 최신 라우트 반영 확인

Supabase 연동 가이드(선택)

개요

- 현재는 public/data/*.json을 API가 읽어 반환합니다. 같은 스키마를 Supabase 테이블로 옮기면 외부 DB로 운영할 수 있습니다.

1) Supabase 프로젝트 생성

- https://supabase.com 에서 프로젝트 생성
- .env.local에 키 추가

```bash
NEXT_PUBLIC_SUPABASE_URL=...your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=...your-anon-key
```

2) 테이블 스키마(SQL)

Techs

```sql
create table if not exists techs (
  slug text primary key,
  name text not null,
  category text not null check (category in ('frontend','backend','mobile','data','devops','testing','database','collaboration','language')),
  description text,
  tags text[],
  homepage text,
  docs text,
  repo text,
  logo_url text,
  resources jsonb
);
```

Companies

```sql
create table if not exists companies (
  slug text primary key,
  name text not null,
  category text not null,
  region text,
  logo_url text,
  tech_slugs text[] not null
);
```

Paths

```sql
create table if not exists paths (
  slug text primary key,
  title text not null,
  steps jsonb not null,
  references jsonb
);
```

3) Next.js에서 클라이언트 초기화

```ts
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

4) API 라우트로 대체/혼합 운영

- 기존 `/api/techs` 등에서 JSON 대신 Supabase를 조회하도록 전환할 수 있습니다.

```ts
// 예: src/app/api/techs/route.ts
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase
    .from('techs')
    .select('slug,name,category,description,tags,homepage,docs,repo,logo_url,resources')
  if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 500 })
  const withSource = (data ?? []).map((t) => ({
    ...t,
    logoUrl: t.logo_url,
    sourceName: 'supabase:techs'
  }))
  return NextResponse.json(withSource)
}
```

5) 점진적 마이그레이션 전략

- 읽기: 우선 Supabase를 1순위, 실패 시 public/data/*.json 폴백
- 쓰기: 관리용 페이지(어드민)에서 Supabase만 수정 → 정기적으로 JSON으로 덤프해 백업

6) 보안/권한

- RLS(Row Level Security)를 켜고, 읽기 전용 정책을 설정하세요.
- 쓰기 작업은 서비스 키(서버 전용)를 별도 API 라우트에서 사용하세요.

운영 팁

- 데이터 소스 이름(sourceName)을 UI에 표기해 출처를 추적합니다.
- 외부 아이콘은 Simple Icons 도메인을 사용하고, 가능하면 사내 CDN으로 이관하세요.
- 변경이 잦은 데이터는 JSON으로, 기준 데이터는 Supabase로 분리하면 운영이 쉬워집니다.
