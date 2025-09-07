import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COLLECTIONS = [
  { slug: "frontend", title: "웹 프론트엔드", items: ["Next.js", "React", "Tailwind"] },
  { slug: "backend", title: "백엔드", items: ["Spring", "NestJS", "PostgreSQL"] },
  { slug: "data", title: "데이터/인프라", items: ["Kafka", "Spark", "Airflow"] },
];

export default function CollectionsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {COLLECTIONS.map((c) => (
        <Card key={c.slug}>
          <CardHeader>
            <CardTitle>
              <Link className="hover:underline" href={`/collections/${c.slug}`}>{c.title}</Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {c.items.join(", ")}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}


