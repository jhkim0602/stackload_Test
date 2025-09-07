"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TECHS, COMPANIES } from "@/lib/data";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KR_BLOGS, KR_JOBS, KR_NEWS } from "@/lib/insights-data";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

type Job = { id: string; company: string; title: string; techs: string[] };

const CATEGORY_CHIPS = ["언어", "프론트엔드", "백엔드", "모바일", "데이터", "데브옵스", "테스팅툴", "데이터베이스", "협업툴"] as const;
type CategoryLabel = typeof CATEGORY_CHIPS[number];
const categoryLabelToKey: Record<CategoryLabel, string> = {
  언어: "language",
  프론트엔드: "frontend",
  백엔드: "backend",
  모바일: "mobile",
  데이터: "data",
  데브옵스: "devops",
  테스팅툴: "testing",
  데이터베이스: "database",
  협업툴: "collaboration",
};

const SAMPLE_JOBS: Job[] = [
  { id: "u-transfer-backend", company: "유트랜스퍼", title: "Java 주니어 개발자 (Back-end)", techs: ["spring", "kafka", "mysql"] },
  { id: "bungae-backend", company: "번개장터", title: "Backend Software Engineer", techs: ["kotlin", "spring", "kafka"] },
  { id: "codit-frontend", company: "코딧", title: "프론트엔드 개발자 (React 2년이상)", techs: ["react", "nextjs", "tailwind"] },
  { id: "elice-python", company: "엘리스", title: "백엔드 엔지니어 (Python)", techs: ["python", "django", "postgres"] },
];

function InsightsInner() {
  const [query, setQuery] = useState("");
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [tab, setTab] = useState("jobs");
  const [techCategory, setTechCategory] = useState<CategoryLabel>("언어");
  const techChips = useMemo(() => TECHS.filter((t) => t.category === categoryLabelToKey[techCategory]).slice(0, 30), [techCategory]);

  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  useEffect(() => {
    const q = sp.get("q") ?? "";
    const catLabel = (sp.get("category") as CategoryLabel) ?? undefined;
    const techsRaw = sp.get("techstacks") ?? "";
    const tabParam = sp.get("tab") ?? undefined;
    if (q) setQuery(q);
    if (catLabel && (CATEGORY_CHIPS as readonly string[]).includes(catLabel)) setTechCategory(catLabel);
    if (techsRaw) setSelectedTechs(techsRaw.split(",").filter(Boolean));
    if (tabParam) setTab(tabParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(sp.toString());
    if (query) params.set("q", query); else params.delete("q");
    params.set("category", techCategory);
    if (selectedTechs.length > 0) params.set("techstacks", selectedTechs.join(",")); else params.delete("techstacks");
    params.set("tab", tab);
    router.replace(`${pathname}?${params.toString()}`);
  }, [query, techCategory, selectedTechs, tab, pathname, router, sp]);

  const toggleTech = (slug: string) => {
    setSelectedTechs((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  };

  const jobsByFilter = useMemo(() => {
    const q = query.toLowerCase();
    return SAMPLE_JOBS.filter((j) => {
      const qOk = !q || j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q) || j.techs.some((t) => t.includes(q));
      const techOk = selectedTechs.length === 0 || selectedTechs.every((t) => j.techs.includes(t));
      return qOk && techOk;
    });
  }, [query, selectedTechs]);

  const categories = useMemo(() => ["all", ...Array.from(new Set(COMPANIES.map((c) => c.category)))], []);
  const [companyCategory, setCompanyCategory] = useState<string>("all");
  const companiesByFilter = useMemo(() => {
    const q = query.toLowerCase();
    return COMPANIES.filter((c) => {
      const qOk = !q || c.name.toLowerCase().includes(q);
      const catOk = companyCategory === "all" || c.category === companyCategory;
      const techOk = selectedTechs.length === 0 || selectedTechs.every((t) => c.techSlugs.includes(t));
      return qOk && catOk && techOk;
    });
  }, [query, companyCategory, selectedTechs]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Search */}
      <section className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">기업/사례 인사이트</h1>
        <Input placeholder="검색 조건을 입력해주세요" value={query} onChange={(e) => setQuery(e.target.value)} />
        {/* Category chips (top) */}
        <div className="flex flex-wrap gap-2">
          {CATEGORY_CHIPS.map((c) => (
            <button key={c} onClick={() => setTechCategory(c)} className={`inline-flex items-center rounded-full border px-3 py-1 text-xs ${techCategory === c ? "bg-primary text-white border-primary" : "bg-white/60"}`}>{c}</button>
          ))}
        </div>
        {/* Filter chips (tech stacks) */}
        <div className="flex flex-wrap gap-2">
          {techChips.map((t) => (
            <button key={t.slug} onClick={() => toggleTech(t.slug)} className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm ${selectedTechs.includes(t.slug) ? "bg-primary text-white border-primary" : "bg-white/60"}`}>
              {t.logoUrl ? <Image src={t.logoUrl} alt="logo" width={16} height={16} /> : null}
              {t.name}
            </button>
          ))}
          {selectedTechs.length > 0 && (
            <Button variant="ghost" onClick={() => setSelectedTechs([])} className="px-2 text-xs">필터 초기화</Button>
          )}
        </div>
        {/* Category selector for companies */}
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button key={c} onClick={() => setCompanyCategory(c)} className={`inline-flex items-center rounded-full border px-3 py-1 text-xs ${companyCategory === c ? "bg-primary text-white border-primary" : "bg-white/60"}`}>{c}</button>
          ))}
        </div>
      </section>

      {/* Tabs: Jobs | Companies | Sources */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="jobs">포지션</TabsTrigger>
          <TabsTrigger value="companies">기업</TabsTrigger>
          <TabsTrigger value="sources">소스</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs">
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">내 기술 스택과 맞는 포지션</div>
              <Button variant="ghost" className="px-0">테이블로 보기</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobsByFilter.map((j) => (
                <Card key={j.id}>
                  <CardHeader><CardTitle className="text-base">{j.company}</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm">{j.title}</div>
                    <div className="flex flex-wrap gap-2">
                      {j.techs.map((s) => {
                        const t = TECHS.find((x) => x.slug === s);
                        return (
                          <span key={s} className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs">
                            {t?.logoUrl ? <Image src={t.logoUrl} alt="logo" width={14} height={14} /> : null}
                            {t?.name ?? s}
                          </span>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </TabsContent>

        <TabsContent value="companies">
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companiesByFilter.map((c) => (
              <Card key={c.name}>
                <CardHeader><CardTitle className="text-base flex items-center gap-2">{c.logoUrl ? <Image src={c.logoUrl} alt="logo" width={18} height={18} /> : null}{c.name}</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-xs text-muted-foreground">{c.region ?? "대한민국"} · {c.category}</div>
                  <div className="flex flex-wrap gap-2">
                    {c.techSlugs.slice(0, 6).map((s) => {
                      const t = TECHS.find((x) => x.slug === s);
                      return <Badge key={s} variant="secondary">{t?.name ?? s}</Badge>;
                    })}
                    {c.techSlugs.length > 6 ? <span className="text-[10px] text-muted-foreground">+{c.techSlugs.length - 6}개</span> : null}
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>
        </TabsContent>

        <TabsContent value="sources">
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader><CardTitle>국내 기술 블로그</CardTitle></CardHeader>
              <CardContent className="grid gap-2 text-sm">
                {KR_BLOGS.map((b) => (
                  <a key={b.url} className="underline" href={b.url} target="_blank" rel="noreferrer">{b.source} — {b.title}</a>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>채용</CardTitle></CardHeader>
              <CardContent className="grid gap-2 text-sm">
                {KR_JOBS.map((j) => (
                  <a key={j.url} className="underline" href={j.url} target="_blank" rel="noreferrer">{j.source} — {j.title}</a>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>뉴스/레퍼런스</CardTitle></CardHeader>
              <CardContent className="grid gap-2 text-sm">
                {KR_NEWS.map((n) => (
                  <a key={n.url} className="underline" href={n.url} target="_blank" rel="noreferrer">{n.source} — {n.title}</a>
                ))}
              </CardContent>
            </Card>
          </section>
        </TabsContent>
      </Tabs>

      {/* Snapshot & KR feeds */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>국내 기업 사례(예시)</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 gap-3">
            {COMPANIES.map((c) => (
              <div key={c.name} className="rounded-md border p-3 flex items-center gap-3">
                {c.logoUrl ? <Image src={c.logoUrl} alt="logo" width={20} height={20} /> : null}
                <div className="flex-1">
                  <p className="text-sm font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.techSlugs.join(" • ")}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>뉴스/채용/블로그</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-xs text-muted-foreground mb-2">기술 블로그</div>
              {KR_BLOGS.map((b) => (
                <a key={b.url} className="block underline" href={b.url} target="_blank" rel="noreferrer">{b.source} — {b.title}</a>
              ))}
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-2">채용/뉴스</div>
              {[...KR_JOBS, ...KR_NEWS].map((x) => (
                <a key={x.url} className="block underline" href={x.url} target="_blank" rel="noreferrer">{x.source} — {x.title}</a>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

export default function InsightsPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">로딩 중…</div>}>
      <InsightsInner />
    </Suspense>
  );
}


