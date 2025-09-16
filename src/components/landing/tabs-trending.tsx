"use client";

import { useEffect, useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Item = { slug: string; name: string; logoUrl?: string; category?: string };

export function TabsTrending() {
  const [items, setItems] = useState<Item[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/techs");
        const responseData = r.ok ? await r.json() : {};
        
        // API 응답 구조에 따라 데이터 추출
        const data: Item[] = responseData.data || responseData || [];
        setItems(Array.isArray(data) ? data : []);
      } catch {
        setItems([]);
      }
    })();
  }, []);

  const trending = useMemo(() => {
    if (!Array.isArray(items)) return [];
    return items.slice(0, 6);
  }, [items]);
  
  const top = useMemo(() => {
    if (!Array.isArray(items)) return [];
    return items.slice(6, 12);
  }, [items]);
  
  const newest = useMemo(() => {
    if (!Array.isArray(items)) return [];
    return items.slice(12, 18);
  }, [items]);

  const render = (arr: Item[]) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {arr.map((t) => (
        <Link
          key={t.slug}
          href={`/tech/${t.slug}`}
          className="group relative overflow-hidden bg-white/30 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/50 transition-all duration-300 hover:scale-105 cursor-pointer block"
        >
          {/* 로고를 오른쪽 배경으로 배치 */}
          {t.logoUrl && (
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
              <Image
                src={t.logoUrl}
                alt="logo"
                width={128}
                height={128}
                className="object-contain w-full h-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* 그라데이션 오버레이 */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="relative z-10">
            {/* 왼쪽 상단 로고 (작은 크기) */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/60 backdrop-blur-sm flex items-center justify-center shadow-sm">
                {t.logoUrl ? (
                  <Image
                    src={t.logoUrl}
                    alt="logo"
                    width={24}
                    height={24}
                    className="object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `<span class="text-sm font-bold text-purple-700">${t.name.slice(0, 2).toUpperCase()}</span>`;
                        parent.className = "w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm flex items-center justify-center";
                      }
                    }}
                  />
                ) : (
                  <span className="text-sm font-bold text-purple-700">
                    {t.name.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
                  {t.name}
                </h3>
                <p className="text-sm text-gray-500">{t.category}</p>
              </div>
            </div>

            {/* 하단 정보 */}
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-blue-400"></div>
                <span className="text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
                  {t.category}
                </span>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                <span className="text-xs text-gray-500 group-hover:text-purple-500 transition-colors">
                  자세히 보기
                </span>
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 flex items-center justify-center group-hover:from-purple-500/30 group-hover:to-blue-500/30 transition-all duration-300">
                  <ArrowRight className="w-3 h-3 text-purple-600 group-hover:text-purple-700 transition-colors" />
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );

  return (
    <section className="py-20 border-t">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            인기 기술 스택
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-2">
            개발자들이 가장 많이 사용하는 기술들을 확인해보세요
          </p>
        </div>
        <Tabs defaultValue="trending">
          <TabsList>
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="top">Top</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
          </TabsList>
          <TabsContent value="trending">{render(trending)}</TabsContent>
          <TabsContent value="top">{render(top)}</TabsContent>
          <TabsContent value="new">{render(newest)}</TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
