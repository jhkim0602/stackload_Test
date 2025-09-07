"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Image from "next/image";
import Fuse from "fuse.js";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTechStore } from "@/store/tech-store";
import { TECHS } from "@/lib/data";
import type { Tech } from "@/lib/types";
import type { TechItem } from "@/store/tech-store";

type TechWithSource = Tech & { sourceName?: string };

const TECHS_LOCAL: TechWithSource[] = TECHS as unknown as TechWithSource[];

type SearchPageProps = {
  searchParams?: {
    q?: string;
    category?: string;
  };
};

function SearchInner(_props: SearchPageProps) {
  const sp = useSearchParams();
  const [query, setQuery] = useState(sp.get("q") ?? "");
  const [category, setCategory] = useState(sp.get("category") ?? "all");
  const setItems = useTechStore((s) => s.setItems);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/techs");
        if (res.ok) {
          const extra: TechWithSource[] = await res.json();
          const toTechItems = (arr: TechWithSource[]): TechItem[] =>
            arr.map((t) => ({ slug: t.slug, name: t.name, category: t.category, tags: t.tags, description: t.description, logoUrl: t.logoUrl }));
          setItems(toTechItems([...TECHS_LOCAL, ...extra]));
          return;
        }
      } catch {}
      const toTechItems = (arr: TechWithSource[]): TechItem[] =>
        arr.map((t) => ({ slug: t.slug, name: t.name, category: t.category, tags: t.tags, description: t.description, logoUrl: t.logoUrl }));
      setItems(toTechItems(TECHS_LOCAL));
    }
    load();
  }, [setItems]);

  const fuse = useMemo(
    () =>
      new Fuse(TECHS_LOCAL, {
        keys: ["name", "tags", "description"],
        threshold: 0.3,
      }),
    []
  );

  const categories = useMemo(() => {
    const all = Array.from(new Set(TECHS_LOCAL.map((t) => t.category)));
    return ["all", ...all];
  }, []);

  const results = useMemo(() => {
    const byCategory = category === "all" ? TECHS_LOCAL : TECHS_LOCAL.filter((t) => t.category === category);
    if (!query) return byCategory;
    return fuse.search(query).map((r) => r.item).filter((t) => byCategory.some((b) => b.slug === t.slug));
  }, [query, fuse, category]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="기술명, 태그, 설명으로 검색" />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="카테고리" /></SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button asChild variant="outline" className="sm:ml-auto"><Link href="/insights">인사이트 보기</Link></Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((t) => (
          <Card key={t.slug}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-3">
                <Link href={`/tech/${t.slug}`} className="hover:underline flex items-center gap-2">
                  {t.logoUrl ? (
                    <Image src={t.logoUrl} alt={`${t.name} logo`} width={18} height={18} />
                  ) : null}
                  {t.name}
                </Link>
                <Badge variant="secondary">{t.category}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{t.description}</p>
              {t.sourceName ? (
                <p className="text-xs text-muted-foreground">source: {t.sourceName}</p>
              ) : null}
              <div className="flex flex-wrap gap-2">
                {t.tags.map((tag) => (
                  <Badge key={tag} variant="outline">#{tag}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function SearchPage(props: SearchPageProps) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">로딩 중…</div>}>
      <SearchInner {...props} />
    </Suspense>
  );
}


