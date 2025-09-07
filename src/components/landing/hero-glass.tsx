"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, Sparkles } from "lucide-react";
import { HeroSearch } from "@/components/landing/hero-search";

export function HeroGlass() {
  return (
    <section id="hero" className="relative overflow-hidden py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-70 bg-[radial-gradient(1200px_600px_at_50%_-10%,oklch(0.95_0.06_260)_0%,transparent_60%)]" />
        <div className="absolute -inset-1 blur-3xl opacity-60 animate-[gradientMove_8s_ease-in-out_infinite]" style={{
          background: "conic-gradient(from 0deg, oklch(0.95 0.08 260), oklch(0.96 0.06 300), oklch(0.95 0.08 260))"
        }} />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="backdrop-blur-md bg-white/40 border shadow-sm rounded-2xl p-8 md:p-12">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">길을 제시하는 스택 로드맵</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">개발자 기술 스택, 방향을 제시합니다</h1>
          <p className="mt-3 text-muted-foreground text-base md:text-lg">탐색 → 비교 → 수집/학습. 기술 의사결정의 모든 흐름을 한 곳에서.</p>
          <div className="mt-6 flex flex-col gap-3">
            <HeroSearch />
            <div className="flex gap-3">
              <Button asChild><Link href="/search"><Search className="size-4 mr-2" />전체 검색으로 이동</Link></Button>
              <Button asChild variant="outline"><Link href="/guides"><Sparkles className="size-4 mr-2" />가이드 보기</Link></Button>
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes gradientMove {
          0% { transform: translateY(-10%) rotate(0deg); }
          50% { transform: translateY(0%) rotate(180deg); }
          100% { transform: translateY(-10%) rotate(360deg); }
        }
      `}</style>
    </section>
  );
}


