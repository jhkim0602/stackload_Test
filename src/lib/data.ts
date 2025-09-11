import type { Tech, Collection, Guide } from "@/lib/types";

export const TECHS: Tech[] = [
  // frontend
  { slug: "nextjs", name: "Next.js", category: "frontend", description: "React 기반 풀스택 웹 프레임워크", tags: ["react", "ssr", "edge"], homepage: "https://nextjs.org", docs: "https://nextjs.org/docs", repo: "https://github.com/vercel/next.js", license: "MIT", version: "15", logoUrl: "https://cdn.simpleicons.org/nextdotjs", resources: [
    { title: "Next.js 공식 문서", url: "https://nextjs.org/docs" },
    { title: "App Router 가이드", url: "https://nextjs.org/docs/app" },
    { title: "Vercel 튜토리얼", url: "https://vercel.com/docs" }
  ] },
  { slug: "react", name: "React", category: "frontend", description: "컴포넌트 기반 UI 라이브러리", tags: ["ui", "library"], homepage: "https://react.dev", docs: "https://react.dev/learn", repo: "https://github.com/facebook/react", license: "MIT", version: "19", logoUrl: "https://cdn.simpleicons.org/react", resources: [
    { title: "React 공식 튜토리얼", url: "https://react.dev/learn" },
    { title: "Hooks 소개", url: "https://react.dev/reference/react" }
  ] },
  { slug: "tailwind", name: "Tailwind CSS", category: "frontend", description: "유틸리티 퍼스트 CSS 프레임워크", tags: ["css", "utility"], homepage: "https://tailwindcss.com", docs: "https://tailwindcss.com/docs", repo: "https://github.com/tailwindlabs/tailwindcss", license: "MIT", version: "4", logoUrl: "https://cdn.simpleicons.org/tailwindcss", resources: [
    { title: "공식 문서", url: "https://tailwindcss.com/docs" },
    { title: "플러그인 에코시스템", url: "https://tailwindcss.com/docs/plugins" }
  ] },
  { slug: "vue", name: "Vue.js", category: "frontend", description: "진입장벽이 낮은 프론트엔드 프레임워크", tags: ["spa", "progressive"], homepage: "https://vuejs.org", license: "MIT", logoUrl: "https://cdn.simpleicons.org/vuedotjs" },
  { slug: "svelte", name: "Svelte", category: "frontend", description: "컴파일 기반 프론트엔드 프레임워크", tags: ["compiler", "spa"], homepage: "https://svelte.dev", license: "MIT", logoUrl: "https://cdn.simpleicons.org/svelte" },

  // backend
  { slug: "spring", name: "Spring", category: "backend", description: "Java 애플리케이션 프레임워크", tags: ["java", "framework"], homepage: "https://spring.io", license: "Apache-2.0", logoUrl: "https://cdn.simpleicons.org/spring" },
  { slug: "nest", name: "NestJS", category: "backend", description: "Node.js 백엔드 프레임워크", tags: ["node", "typescript"], homepage: "https://nestjs.com", license: "MIT", logoUrl: "https://cdn.simpleicons.org/nestjs" },
  { slug: "express", name: "Express", category: "backend", description: "경량 Node.js 웹 프레임워크", tags: ["node", "minimal"], homepage: "https://expressjs.com", license: "MIT", logoUrl: "https://cdn.simpleicons.org/express" },
  { slug: "django", name: "Django", category: "backend", description: "배터리 포함 Python 웹 프레임워크", tags: ["python", "orm"], homepage: "https://www.djangoproject.com", license: "BSD-3-Clause", logoUrl: "https://cdn.simpleicons.org/django" },
  { slug: "rails", name: "Ruby on Rails", category: "backend", description: "컨벤션 중심 Ruby 웹 프레임워크", tags: ["ruby", "mvc"], homepage: "https://rubyonrails.org", license: "MIT", logoUrl: "https://cdn.simpleicons.org/rubyonrails" },
  { slug: "postgres", name: "PostgreSQL", category: "backend", description: "오픈소스 RDBMS", tags: ["db", "sql"], homepage: "https://postgresql.org", license: "PostgreSQL", logoUrl: "https://cdn.simpleicons.org/postgresql" },
  { slug: "mysql", name: "MySQL", category: "backend", description: "대중적인 오픈소스 RDBMS", tags: ["db", "sql"], homepage: "https://www.mysql.com", license: "GPL-2.0", logoUrl: "https://cdn.simpleicons.org/mysql" },
  { slug: "mongodb", name: "MongoDB", category: "backend", description: "문서지향 NoSQL 데이터베이스", tags: ["db", "nosql"], homepage: "https://www.mongodb.com", license: "SSPL", logoUrl: "https://cdn.simpleicons.org/mongodb" },

  // data
  { slug: "kafka", name: "Apache Kafka", category: "data", description: "분산 스트리밍 플랫폼", tags: ["stream", "mq"], homepage: "https://kafka.apache.org", license: "Apache-2.0", logoUrl: "https://cdn.simpleicons.org/apachekafka" },
  { slug: "spark", name: "Apache Spark", category: "data", description: "대규모 데이터 처리 엔진", tags: ["etl", "batch"], homepage: "https://spark.apache.org", license: "Apache-2.0", logoUrl: "https://cdn.simpleicons.org/apachespark" },
  { slug: "airflow", name: "Apache Airflow", category: "data", description: "워크플로 오케스트레이션", tags: ["scheduler", "etl"], homepage: "https://airflow.apache.org", license: "Apache-2.0", logoUrl: "https://cdn.simpleicons.org/apacheairflow" },

  // devops
  { slug: "docker", name: "Docker", category: "devops", description: "컨테이너 런타임/이미지", tags: ["container", "runtime"], homepage: "https://www.docker.com", license: "Apache-2.0", logoUrl: "https://cdn.simpleicons.org/docker" },
  { slug: "kubernetes", name: "Kubernetes", category: "devops", description: "컨테이너 오케스트레이션", tags: ["orchestrator", "cncf"], homepage: "https://kubernetes.io", license: "Apache-2.0", logoUrl: "https://cdn.simpleicons.org/kubernetes" },
  { slug: "terraform", name: "Terraform", category: "devops", description: "IaC 도구", tags: ["iac", "hashicorp"], homepage: "https://www.terraform.io", license: "MPL-2.0", logoUrl: "https://cdn.simpleicons.org/terraform" },
  { slug: "prometheus", name: "Prometheus", category: "devops", description: "모니터링/시계열 DB", tags: ["monitoring", "metrics"], homepage: "https://prometheus.io", license: "Apache-2.0", logoUrl: "https://cdn.simpleicons.org/prometheus" },
  { slug: "grafana", name: "Grafana", category: "devops", description: "데이터 시각화 대시보드", tags: ["visualization"], homepage: "https://grafana.com", license: "AGPL-3.0", logoUrl: "https://cdn.simpleicons.org/grafana" },

  // mobile
  { slug: "reactnative", name: "React Native", category: "mobile", description: "React 기반 크로스플랫폼 모바일", tags: ["react", "mobile"], homepage: "https://reactnative.dev", license: "MIT", logoUrl: "https://cdn.simpleicons.org/react" },
  { slug: "flutter", name: "Flutter", category: "mobile", description: "Dart 기반 UI 툴킷", tags: ["dart", "mobile"], homepage: "https://flutter.dev", license: "BSD-3-Clause", logoUrl: "https://cdn.simpleicons.org/flutter" },
  { slug: "android", name: "Android", category: "mobile", description: "모바일 OS 및 SDK", tags: ["sdk"], homepage: "https://developer.android.com", license: "Apache-2.0", logoUrl: "https://cdn.simpleicons.org/android" },
  { slug: "swift", name: "Swift", category: "mobile", description: "Apple의 모던 언어", tags: ["ios"], homepage: "https://swift.org", license: "Apache-2.0", logoUrl: "https://cdn.simpleicons.org/swift" },
  { slug: "kotlin", name: "Kotlin", category: "mobile", description: "JVM 기반 현대적 언어", tags: ["android"], homepage: "https://kotlinlang.org", license: "Apache-2.0", logoUrl: "https://cdn.simpleicons.org/kotlin" },

  // testing
  { slug: "jest", name: "Jest", category: "testing", description: "JavaScript 테스트 러너", tags: ["unit", "js"], homepage: "https://jestjs.io", license: "MIT", logoUrl: "https://cdn.simpleicons.org/jest" },
  { slug: "playwright", name: "Playwright", category: "testing", description: "E2E 테스트 프레임워크", tags: ["e2e", "browser"], homepage: "https://playwright.dev", license: "Apache-2.0", logoUrl: "https://cdn.simpleicons.org/microsoftplaywright" },

  // collaboration
  { slug: "slack", name: "Slack", category: "collaboration", description: "팀 커뮤니케이션", tags: ["chat", "team"], homepage: "https://slack.com", logoUrl: "https://cdn.simpleicons.org/slack" },
  { slug: "asana", name: "Asana", category: "collaboration", description: "프로젝트/태스크 관리", tags: ["pm"], homepage: "https://asana.com", logoUrl: "https://cdn.simpleicons.org/asana" },
  { slug: "notion", name: "Notion", category: "collaboration", description: "문서/위키/DB", tags: ["notes", "wiki"], homepage: "https://www.notion.so", logoUrl: "https://cdn.simpleicons.org/notion" },

  // database (category separate for filters)
  { slug: "redis", name: "Redis", category: "database", description: "인메모리 키-값 저장소", tags: ["cache"], homepage: "https://redis.io", license: "RSL", logoUrl: "https://cdn.simpleicons.org/redis" },
  { slug: "clickhouse", name: "ClickHouse", category: "database", description: "OLAP 컬럼 지향 DB", tags: ["olap"], homepage: "https://clickhouse.com", license: "Apache-2.0", logoUrl: "https://cdn.simpleicons.org/clickhouse" },
  { slug: "elasticsearch", name: "Elasticsearch", category: "database", description: "검색/분석 엔진", tags: ["search", "lucene"], homepage: "https://www.elastic.co/elasticsearch", logoUrl: "https://cdn.simpleicons.org/elasticsearch" },

  // language
  { slug: "typescript", name: "TypeScript", category: "language", description: "타입이 있는 JavaScript", tags: ["js", "types"], homepage: "https://www.typescriptlang.org", license: "Apache-2.0", logoUrl: "https://cdn.simpleicons.org/typescript" },
  { slug: "go", name: "Go", category: "language", description: "구글의 시스템 프로그래밍 언어", tags: ["concurrency"], homepage: "https://go.dev", license: "BSD-3-Clause", logoUrl: "https://cdn.simpleicons.org/go" },
  { slug: "python", name: "Python", category: "language", description: "범용 프로그래밍 언어", tags: ["general"], homepage: "https://www.python.org", license: "PSF", logoUrl: "https://cdn.simpleicons.org/python" },
];

export const COLLECTIONS: Collection[] = [
  { slug: "frontend", title: "웹 프론트엔드", description: "웹 UI/SSR용 대표 스택", techSlugs: ["react", "nextjs", "tailwind"] },
  { slug: "backend", title: "백엔드", description: "API/서비스 운영", techSlugs: ["spring", "nest", "postgres"] },
  { slug: "data", title: "데이터/인프라", description: "스트리밍/ETL/오케스트레이션", techSlugs: ["kafka", "spark", "airflow"] },
];

export const GUIDES: Guide[] = [
  {
    slug: "frontend-starter",
    title: "프론트엔드 스타터: Next.js + shadcn/ui",
    summary: "Next.js와 shadcn/ui로 생산성 있게 시작하기",
    techSlugs: ["nextjs", "react", "tailwind"],
    content: `# Next.js + shadcn/ui

추천 구성요소: App Router, Tailwind v4, Radix 기반 UI 컴포넌트.

- 프로젝트 초기화
- 디자인 시스템 설정
- 라우팅/상태 관리
`,
  },
  {
    slug: "data-pipeline-basics",
    title: "데이터 파이프라인 기초: Kafka/Spark",
    summary: "스트리밍과 배치 처리의 기본 개념",
    techSlugs: ["kafka", "spark", "airflow"],
    content: `# 데이터 파이프라인

Kafka로 이벤트 스트림을 수집하고, Spark로 처리하며, Airflow로 스케줄링합니다.
`,
  },
  {
    slug: "backend-rest-best",
    title: "REST 백엔드 베스트 프랙티스",
    summary: "리소스 중심 API 설계",
    techSlugs: ["spring", "nest", "postgres"],
    content: `# REST 백엔드

리소스 명명, 버저닝, 오류 표준화, 보안 고려사항을 다룹니다.
`,
  },
];

export function getTechBySlug(slug: string) {
  return TECHS.find((t) => t.slug === slug) ?? null;
}

export function getCollectionBySlug(slug: string) {
  return COLLECTIONS.find((c) => c.slug === slug) ?? null;
}

export function getGuideBySlug(slug: string) {
  return GUIDES.find((g) => g.slug === slug) ?? null;
}

// 회사 데이터는 이제 JSON 파일에서 관리됩니다
// public/data/companies.json 파일을 참조하세요



