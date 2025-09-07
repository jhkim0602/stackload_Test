import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GUIDES = [
  { slug: "frontend-starter", title: "프론트엔드 스타터: Next.js + shadcn/ui" },
  { slug: "data-pipeline-basics", title: "데이터 파이프라인 기초: Kafka/Spark" },
  { slug: "backend-rest-best", title: "REST 백엔드 베스트 프랙티스" },
];

export default function GuidesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 grid gap-4">
      {GUIDES.map((g) => (
        <Card key={g.slug}>
          <CardHeader>
            <CardTitle>
              <Link className="hover:underline" href={`/guides/${g.slug}`}>{g.title}</Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            개요와 링크로 구성된 가이드 문서
          </CardContent>
        </Card>
      ))}
    </div>
  );
}


