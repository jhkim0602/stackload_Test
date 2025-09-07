import Link from "next/link";
import { ArrowRight } from "lucide-react";

const STEPS = [
  { title: "탐색", desc: "기술 카탈로그를 둘러보고 태그/카테고리로 찾기", href: "/search" },
  { title: "인사이트", desc: "국내 기업의 실제 사례/블로그/채용 인사이트", href: "/insights" },
  { title: "로드맵", desc: "역할/목표별 단계형 길 제시(초급→중급→고급)", href: "/paths" },
];

export function Steps() {
  return (
    <section className="py-16 border-t">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8">
        {STEPS.map((s) => (
          <div key={s.title} className="rounded-2xl border p-6 bg-white/60 backdrop-blur">
            <h3 className="text-xl font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            <Link href={s.href} className="mt-3 inline-flex items-center gap-1 text-sm underline">
              바로가기 <ArrowRight className="size-4" />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}


