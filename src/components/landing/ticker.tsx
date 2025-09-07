"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Item = { slug: string; name: string; logoUrl?: string; category?: string };

export function Ticker() {
  const [items, setItems] = useState<Item[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/techs");
        if (!r.ok) return;
        const data: Item[] = await r.json();
        setItems(data.slice(0, 18));
      } catch {}
    })();
  }, []);

  return (
    <section className="border-t py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="flex animate-[ticker_30s_linear_infinite] gap-6 will-change-transform" style={{ maskImage: "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)" }}>
          {[...items, ...items].map((t, idx) => (
            <div key={t.slug + idx} className="shrink-0 rounded-xl border bg-white/60 backdrop-blur px-4 py-2 flex items-center gap-2">
              {t.logoUrl ? <Image src={t.logoUrl} alt="logo" width={16} height={16} /> : null}
              <span className="text-sm">{t.name}</span>
            </div>
          ))}
        </div>
      </div>
      <style jsx global>{`
        @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      `}</style>
    </section>
  );
}


