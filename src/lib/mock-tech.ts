import type { TechItem } from "@/store/tech-store";

export const MOCK_TECHS: TechItem[] = [
  { slug: "nextjs", name: "Next.js", category: "frontend", tags: ["react", "ssr", "app-router"], description: "React 기반 풀스택 프레임워크" },
  { slug: "react", name: "React", category: "frontend", tags: ["library", "ui"], description: "UI 라이브러리" },
  { slug: "tailwind", name: "Tailwind CSS", category: "frontend", tags: ["css", "utility"], description: "유틸리티 퍼스트 CSS" },
  { slug: "kafka", name: "Apache Kafka", category: "data", tags: ["stream", "mq"], description: "분산 스트리밍 플랫폼" },
  { slug: "postgres", name: "PostgreSQL", category: "backend", tags: ["db", "sql"], description: "오픈소스 RDBMS" },
  { slug: "spring", name: "Spring", category: "backend", tags: ["java", "framework"], description: "Java 애플리케이션 프레임워크" },
];


