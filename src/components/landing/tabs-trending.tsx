"use client";

import { useEffect, useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Item = { slug: string; name: string; logoUrl?: string; category?: string };

export function TabsTrending() {
  const [items, setItems] = useState<Item[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/techs");
        const data: Item[] = r.ok ? await r.json() : [];
        setItems(data);
      } catch {}
    })();
  }, []);

  const trending = useMemo(() => items.slice(0, 6), [items]);
  const top = useMemo(() => items.slice(6, 12), [items]);
  const newest = useMemo(() => items.slice(12, 18), [items]);

  const render = (arr: Item[]) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {arr.map((t) => (
        <Card key={t.slug}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {t.logoUrl ? <Image src={t.logoUrl} alt="logo" width={18} height={18} /> : null}
              {t.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">{t.category}</CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <section className="py-16 border-t">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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


