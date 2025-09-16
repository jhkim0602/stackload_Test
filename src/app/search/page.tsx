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
import type { TechCategory } from "@/lib/types";
import { Search, Filter, Code2, Database, Layers, Smartphone, Server, Globe, TestTube, Users, ChevronDown } from "lucide-react";

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
              category: t.category as TechCategory, 
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

  const getCategoryIcon = (categoryName: string) => {
    const iconMap = {
      'frontend': <Code2 className="w-4 h-4" />,
      'backend': <Server className="w-4 h-4" />,
      'database': <Database className="w-4 h-4" />,
      'mobile': <Smartphone className="w-4 h-4" />,
      'devops': <Globe className="w-4 h-4" />,
      'language': <Layers className="w-4 h-4" />,
      'testing': <TestTube className="w-4 h-4" />,
      'all': <Users className="w-4 h-4" />
    };
    return iconMap[categoryName as keyof typeof iconMap] || <Code2 className="w-4 h-4" />;
  };

  const getCategoryLabel = (categoryName: string) => {
    const labelMap = {
      'frontend': '프론트엔드',
      'backend': '백엔드', 
      'database': '데이터베이스',
      'mobile': '모바일',
      'devops': 'DevOps',
      'language': '프로그래밍 언어',
      'testing': '테스팅',
      'all': '전체 카테고리'
    };
    return labelMap[categoryName as keyof typeof labelMap] || categoryName;
  };

  const getCategoryColor = (categoryName: string) => {
    const colorMap = {
      'frontend': 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200',
      'backend': 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200',
      'database': 'bg-indigo-100 text-indigo-700 border-indigo-200 hover:bg-indigo-200',
      'mobile': 'bg-pink-100 text-pink-700 border-pink-200 hover:bg-pink-200',
      'devops': 'bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200',
      'language': 'bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200',
      'testing': 'bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200',
      'all': 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
    };
    return colorMap[categoryName as keyof typeof colorMap] || 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200';
  };

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-center py-20">
            <div className="relative mb-8">
              <div className="animate-spin w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Search className="w-6 h-6 text-blue-600 animate-pulse" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">기술 스택 데이터를 불러오는 중...</h2>
            <p className="text-gray-600 max-w-md mx-auto">잠시만 기다려주세요. 최신 기술 스택 정보를 가져오고 있습니다.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* 헤더 섹션 */}
        <div className="text-center space-y-4 mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
              <Search className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              기술 스택 검색
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            다양한 기술 스택을 검색하고 비교해보세요. 카테고리별로 분류된 최신 기술 정보를 확인할 수 있습니다.
          </p>
        </div>

        {/* 검색 섹션 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20 shadow-2xl p-8 space-y-6">
          {/* 검색바 */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input 
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
              placeholder="기술명, 설명으로 검색해보세요 (예: React, TypeScript, Docker...)" 
              className="pl-12 py-4 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-2xl bg-white/50 backdrop-blur-sm"
            />
          </div>

          {/* 카테고리 필터 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-800">카테고리별 검색</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`
                    flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-300 font-medium
                    ${category === c 
                      ? `${getCategoryColor(c)} shadow-lg transform scale-105` 
                      : 'bg-white/60 text-gray-600 border-gray-200 hover:bg-white/80 hover:border-gray-300 hover:shadow-md'
                    }
                  `}
                >
                  {getCategoryIcon(c)}
                  <span>{getCategoryLabel(c)}</span>
                  {category === c && (
                    <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 추가 옵션 */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => {setQuery(""); setCategory("all");}} 
                variant="outline" 
                className="rounded-xl"
              >
                필터 초기화
              </Button>
            </div>
          </div>
        </div>

        {/* 검색 결과 카운트 */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Search className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-800">
                  총 <span className="text-2xl font-bold text-blue-600">{results.length}</span>개의 기술 스택
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  {query && (
                    <span className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      검색어: "{query}"
                    </span>
                  )}
                  {category !== "all" && (
                    <span className="flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                      카테고리: {getCategoryLabel(category)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {results.length === 0 ? (
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-white/20 shadow-lg p-12 text-center">
            <div className="text-8xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">검색 결과가 없습니다</h3>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              {query ? `"${query}" 에 대한 검색 결과가 없습니다.` : `"${getCategoryLabel(category)}" 카테고리에 등록된 기술이 없습니다.`}
            </p>
            <div className="space-y-4">
              <p className="text-sm text-gray-500">다음을 시도해보세요:</p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button 
                  onClick={() => {setQuery(""); setCategory("all");}} 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl"
                >
                  전체 기술 스택 보기
                </Button>
                <Button 
                  onClick={() => setQuery("")} 
                  variant="outline" 
                  className="rounded-xl"
                >
                  검색어 초기화
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((t) => (
              <Card key={t.slug} className="group bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-2xl hover:bg-white/90 transition-all duration-300 rounded-2xl overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between gap-3">
                    <Link href={`/tech/${t.slug}`} className="hover:text-blue-600 flex items-center gap-3 transition-colors">
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center group-hover:from-blue-100 group-hover:to-purple-100 transition-all duration-300">
                        {t.logoUrl ? (
                          <Image src={t.logoUrl} alt={`${t.name} logo`} width={24} height={24} className="object-contain" />
                        ) : (
                          <Code2 className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
                        )}
                      </div>
                      <span className="font-semibold text-lg">{t.name}</span>
                    </Link>
                    <Badge className={`${getCategoryColor(t.category)} border-none`}>
                      {getCategoryLabel(t.category)}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 leading-relaxed line-clamp-3">{t.description}</p>
                  {t.tags && t.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {t.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs bg-white/50">#{tag}</Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
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


