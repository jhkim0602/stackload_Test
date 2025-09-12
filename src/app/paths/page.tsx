import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Path = { 
  slug: string; 
  title: string; 
  steps: { label: string; items: string[] }[]; 
  references?: { title: string; url: string }[]; 
  sourceName?: string 
};

export default async function PathsPage() {
  let data: Path[] = [];
  
  try {
    // API에서 학습 경로 데이터 가져오기
    const response = await fetch(process.env.NODE_ENV === 'production' 
      ? 'https://your-domain.com/api/paths' 
      : 'http://localhost:3000/api/paths'
    );
    
    if (response.ok) {
      const result = await response.json();
      data = result.data || result || [];
    }
  } catch (error) {
    console.error('Failed to load paths:', error);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <section className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">로드맵</h1>
        <p className="text-sm text-muted-foreground">
          역할/목표별 단계형 길 제시. 각 단계의 핵심 키워드만 제시해 방향성에 집중합니다.
        </p>
        {data.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
            <p className="text-sm text-yellow-800">
              🚧 학습 로드맵 기능은 현재 개발 중입니다. 곧 업데이트될 예정입니다.
            </p>
          </div>
        )}
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
              {p.sourceName ? (
                <div className="text-[10px] text-muted-foreground mt-2">source: {p.sourceName}</div>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}


