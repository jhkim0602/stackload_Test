import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Layers3, Search, Sparkles } from "lucide-react";
import { InViewFade } from "@/components/inview";

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Section 1: Problem */}
      <InViewFade>
      <section className="py-20 grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">왜 stackload인가</p>
          <h1 className="text-4xl font-bold tracking-tight">기술 탐색과 비교, 흩어진 정보를 하나로</h1>
          <p className="text-muted-foreground">
            기술 스택 정보는 흩어져 있고 최신성도 제각각입니다. stackload는 신뢰할 수 있는 카탈로그와 비교 도구로 의사결정을 돕습니다.
          </p>
          <div className="flex gap-3">
            <Button asChild><Link href="/search"><Search className="size-4 mr-2" />검색/비교 시작</Link></Button>
            <Button asChild variant="outline"><Link href="/guides"><Sparkles className="size-4 mr-2" />가이드 보기</Link></Button>
          </div>
        </div>
        <div className="rounded-xl border p-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><Layers3 className="size-4" /> 기술 스택 카탈로그</div>
          <div className="mt-4 space-y-2 text-sm">
            <p>• 프론트엔드/백엔드/데이터/DevOps/모바일/테스팅/협업/DB/언어</p>
            <p>• Fuse 기반 즉시 검색, 비교 테이블</p>
          </div>
        </div>
      </section>
      </InViewFade>

      {/* Section 2: How it works */}
      <InViewFade>
      <section className="py-20 border-t">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "탐색", desc: "분야/태그로 빠르게 기술을 찾아보세요.", href: "/search" },
            { title: "비교", desc: "두 기술을 나란히 놓고 핵심 메타를 비교하세요.", href: "/compare" },
            { title: "학습", desc: "가이드와 레퍼런스로 학습을 이어가세요.", href: "/guides" },
          ].map((s) => (
            <div key={s.title} className="space-y-2">
              <h3 className="text-xl font-semibold">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
              <Button asChild variant="ghost" className="px-0"><Link href={s.href}>자세히 보기 <ArrowRight className="size-4 ml-2" /></Link></Button>
            </div>
          ))}
        </div>
      </section>
      </InViewFade>

      {/* Section 3: Social proof / categories */}
      <InViewFade>
      <section className="py-20 border-t">
        <p className="text-sm text-muted-foreground">카테고리 스냅샷</p>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-sm">
          {["frontend","backend","data","devops","mobile","testing","collaboration","database","language"].map((c) => (
            <Link key={c} href={`/search?category=${c}`} className="rounded-md border px-3 py-2 hover:bg-accent">
              {c}
            </Link>
          ))}
        </div>
      </section>
      </InViewFade>
    </div>
  );
}
