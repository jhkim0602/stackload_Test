"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

type C = { slug: string; name: string; category: string; region?: string; logoUrl?: string; techSlugs: string[]; sourceName?: string };
type Tech = { slug: string; name: string; category: string; };

export default function CompaniesPage() {
  const [data, setData] = useState<C[]>([]);
  const [techs, setTechs] = useState<Tech[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const [companiesRes, techsRes] = await Promise.all([
          fetch("/api/companies", { 
            next: { revalidate: 300 } // 5분 캐시
          }),
          fetch("/api/techs", { 
            next: { revalidate: 600 } // 10분 캐시 (기술 데이터는 더 오래 캐시)
          })
        ]);
        
        if (companiesRes.ok) {
          const companiesData = await companiesRes.json();
          setData(companiesData.data || companiesData || []);
        }
        
        if (techsRes.ok) {
          const techsData = await techsRes.json();
          setTechs(techsData.data || techsData || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const categories = useMemo(() => ["all", ...Array.from(new Set(data.map((c) => c.category)))], [data]);
  const [category, setCategory] = useState<string>("all");
  const filtered = useMemo(() => (category === "all" ? data : data.filter((c) => c.category === category)), [category, data]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-[220px] h-10 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-5 w-14 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex items-center gap-3">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[220px]"><SelectValue placeholder="카테고리" /></SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((c) => (
          <Card key={c.name}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {c.logoUrl ? (
                  <Image 
                    src={c.logoUrl} 
                    alt={`${c.name} logo`} 
                    width={20} 
                    height={20}
                    loading="lazy"
                    className="object-contain"
                  />
                ) : null}
                {c.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {c.techSlugs.map((s) => {
                const t = techs.find((x) => x.slug === s);
                return <Badge key={s} variant="secondary">{t?.name ?? s}</Badge>;
              })}
              {c.sourceName ? <div className="text-[10px] text-muted-foreground basis-full mt-1">source: {c.sourceName}</div> : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}


