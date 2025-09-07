"use client";

import { useEffect, useMemo, useState } from "react";
import Fuse from "fuse.js";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

type Item = { slug: string; name: string; category?: string };

export function HeroSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/techs");
        const extra: Item[] = r.ok ? await r.json() : [];
        setItems(extra);
      } catch {}
    })();
  }, []);

  const fuse = useMemo(() => new Fuse(items, { keys: ["name", "slug", "category"], threshold: 0.3 }), [items]);
  const results = useMemo(() => (query ? fuse.search(query).map((r) => r.item).slice(0, 8) : items.slice(0, 8)), [query, fuse, items]);

  return (
    <div className="relative w-full max-w-xl">
      <Input placeholder="기술 검색 (예: Next.js, Kafka)" value={query} onChange={(e) => { setQuery(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)} />
      {open && (
        <div className="absolute z-20 mt-2 w-full">
          <Command className="rounded-xl border bg-white/70 backdrop-blur">
            <CommandInput placeholder="검색어 입력" value={query} onValueChange={setQuery} />
            <CommandList>
              <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
              <CommandGroup heading="기술">
                {results.map((t) => (
                  <CommandItem key={t.slug} value={t.name} onSelect={() => router.push(`/tech/${t.slug}`)}>
                    {t.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
}


