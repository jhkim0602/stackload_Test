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
import type { TechItem } from "@/store/tech-store";

type TechWithSource = {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  logoUrl?: string;
  color?: string;
  sourceName?: string;
  tags?: string[];
};

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
  const [techs, setTechs] = useState<TechWithSource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/techs");
        if (res.ok) {
          const data = await res.json();
          const techsArray = data.data || data || [];
          const techsWithSource: TechWithSource[] = Array.isArray(techsArray) 
            ? techsArray.map((t: any) => ({ ...t, sourceName: "database", tags: [] }))
            : [];
          setTechs(techsWithSource);
          
          const toTechItems = (arr: TechWithSource[]): TechItem[] =>
            arr.map((t) => ({ 
              slug: t.slug, 
              name: t.name, 
              category: t.category, 
              tags: [], // API에서 tags는 별도 처리 필요
              description: t.description || "", 
              logoUrl: t.logoUrl 
            }));
          setItems(toTechItems(techsWithSource));
        }
      } catch (error) {
        console.error('Failed to load techs:', error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [setItems]);

  const fuse = useMemo(
    () =>
      new Fuse(techs, {
        keys: ["name", "description"],
        threshold: 0.3,
      }),
    [techs]
  );

  const categories = useMemo(() => {
    const all = Array.from(new Set(techs.map((t) => t.category)));
    return ["all", ...all];
  }, [techs]);

  const results = useMemo(() => {
    const byCategory = category === "all" ? techs : techs.filter((t) => t.category === category);
    if (!query) return byCategory;
    return fuse.search(query).map((r) => r.item);
  }, [query, fuse, category, techs]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center py-20">
          <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">기술 스택 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">기술 스택 검색</h1>
        <p className="text-gray-600">원하는 기술 스택을 검색하고 상세 정보를 확인해보세요</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="기술명, 태그, 설명으로 검색" />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="카테고리" /></SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>{c === "all" ? "전체 카테고리" : c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button asChild variant="outline" className="sm:ml-auto"><Link href="/insights">인사이트 보기</Link></Button>
      </div>

      {/* 검색 결과 카운트 */}
      <div className="flex items-center justify-between border-b pb-4">
        <p className="text-sm text-gray-600">
          총 <span className="font-semibold text-blue-600">{results.length}</span>개의 기술 스택을 찾았습니다
          {query && <span className="ml-2">(검색어: "{query}")</span>}
          {category !== "all" && <span className="ml-2">(카테고리: {category})</span>}
        </p>
      </div>

      {results.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">검색 결과가 없습니다</h3>
          <p className="text-gray-600 mb-6">
            {query ? `"${query}" 에 대한 검색 결과가 없습니다.` : `"${category}" 카테고리에 등록된 기술이 없습니다.`}
          </p>
          <Button onClick={() => {setQuery(""); setCategory("all");}}>
            전체 기술 스택 보기
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((t) => (
            <Card key={t.slug} className="hover:shadow-lg transition-shadow duration-200">
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
                {t.tags && t.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {t.tags.map((tag) => (
                      <Badge key={tag} variant="outline">#{tag}</Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
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


