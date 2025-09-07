"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TECHS } from "@/lib/data";

type C = { slug: string; name: string; category: string; region?: string; logoUrl?: string; techSlugs: string[]; sourceName?: string };

export default function CompaniesPage() {
  const [data, setData] = useState<C[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/companies", { cache: "no-store" });
        const res: C[] = r.ok ? await r.json() : [];
        setData(res);
      } catch {}
    })();
  }, []);

  const categories = useMemo(() => ["all", ...Array.from(new Set(data.map((c) => c.category)))], [data]);
  const [category, setCategory] = useState<string>("all");
  const filtered = useMemo(() => (category === "all" ? data : data.filter((c) => c.category === category)), [category, data]);

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
                {c.logoUrl ? <img src={c.logoUrl} alt={`${c.name} logo`} width={20} height={20} /> : null}
                {c.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {c.techSlugs.map((s) => {
                const t = TECHS.find((x) => x.slug === s);
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


