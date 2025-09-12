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
        const responseData = await r.json();
        
        // API 응답 구조에 따라 데이터 추출
        const data: Item[] = responseData.data || responseData || [];
        setItems(Array.isArray(data) ? data.slice(0, 24) : []);
      } catch {
        setItems([]);
      }
    })();
  }, []);

  return (
    <section className="border-t py-16 w-full overflow-hidden space-y-8">
      {/* 첫 번째 줄 - 왼쪽으로 이동 */}
      <div
        className="flex animate-[ticker_30s_linear_infinite] gap-16 will-change-transform"
        style={{
          maskImage:
            "linear-gradient(90deg, transparent, black 5%, black 95%, transparent)",
        }}
      >
        {[...items, ...items, ...items].map((t, idx) => (
          <div
            key={`row1-${t.slug}-${idx}`}
            className="shrink-0 flex items-center justify-center"
          >
            {t.logoUrl ? (
              <Image
                src={t.logoUrl}
                alt={t.name}
                width={64}
                height={64}
                className="opacity-70 hover:opacity-100 transition-opacity duration-300 drop-shadow-lg"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white/70 text-xs font-medium">
                {t.name.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 두 번째 줄 - 오른쪽으로 이동 */}
      <div
        className="flex animate-[ticker-reverse_30s_linear_infinite] gap-16 will-change-transform"
        style={{
          maskImage:
            "linear-gradient(90deg, transparent, black 5%, black 95%, transparent)",
        }}
      >
        {[
          ...items.slice().reverse(),
          ...items.slice().reverse(),
          ...items.slice().reverse(),
        ].map((t, idx) => (
          <div
            key={`row2-${t.slug}-${idx}`}
            className="shrink-0 flex items-center justify-center"
          >
            {t.logoUrl ? (
              <Image
                src={t.logoUrl}
                alt={t.name}
                width={64}
                height={64}
                className="opacity-70 hover:opacity-100 transition-opacity duration-300 drop-shadow-lg"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white/70 text-xs font-medium">
                {t.name.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes ticker {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-33.333%);
          }
        }
        @keyframes ticker-reverse {
          from {
            transform: translateX(-33.333%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </section>
  );
}
