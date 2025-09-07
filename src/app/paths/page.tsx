import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Path = { slug: string; title: string; steps: { label: string; items: string[] }[]; references?: { title: string; url: string }[]; sourceName?: string };

export default async function PathsPage() {
  const json = (await import("@/../public/data/paths.json")) as unknown as { default: Path[] };
  const data = (json.default || []).map((p) => ({ ...p, sourceName: "public/data/paths.json" })) as Path[];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <section className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">로드맵</h1>
        <p className="text-sm text-muted-foreground">역할/목표별 단계형 길 제시. 각 단계의 핵심 키워드만 제시해 방향성에 집중합니다.</p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.map((p) => (
          <Card key={p.slug}>
            <CardHeader><CardTitle>{p.title}</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {p.steps.map((s) => (
                <div key={s.label} className="rounded-md border p-3">
                  <div className="text-sm font-medium">{s.label}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{s.items.join(" · ")}</div>
                </div>
              ))}
              {p.sourceName ? <div className="text-[10px] text-muted-foreground mt-2">source: {p.sourceName}</div> : null}
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}


