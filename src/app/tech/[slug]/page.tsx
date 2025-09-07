import type { Metadata } from "next";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTechBySlug, TECHS } from "@/lib/data";
import { notFound } from "next/navigation";
import { FavoriteButton } from "@/components/tech/favorite-button";
import { COMPANIES } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return TECHS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const t = getTechBySlug(slug);
  return {
    title: t ? `${t.name} | stackload` : "기술 | stackload",
    description: t?.description,
  };
}

export default async function TechDetailPage({ params }: Props) {
  const { slug } = await params;
  const t = getTechBySlug(slug);
  if (!t) return notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
        {t.logoUrl ? <Image src={t.logoUrl} alt={`${t.name} logo`} width={28} height={28} /> : null}
        {t.name}
      </h1>
      <p className="text-muted-foreground">{t.description}</p>

      <div className="flex gap-2 flex-wrap">
        {t.tags.map((tag) => (
          <Badge key={tag} variant="outline">#{tag}</Badge>
        ))}
      </div>

      <div className="flex gap-2"><FavoriteButton slug={t.slug} /></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>메타 정보</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-1">
            {t.version && <p>버전: v{t.version}</p>}
            {t.license && <p>라이선스: {t.license}</p>}
            {t.homepage && (<p>홈페이지: <a className="underline" href={t.homepage} target="_blank" rel="noreferrer">{t.homepage}</a></p>)}
            {t.docs && (<p>문서: <a className="underline" href={t.docs} target="_blank" rel="noreferrer">{t.docs}</a></p>)}
            {t.repo && (<p>Repo: <a className="underline" href={t.repo} target="_blank" rel="noreferrer">{t.repo}</a></p>)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>리소스</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-1">
              {(t.resources ?? []).map((r) => (
                <li key={r.url}><a className="underline" href={r.url} target="_blank" rel="noreferrer">{r.title}</a></li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>이 기술을 쓰는 기업</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {COMPANIES.filter((c) => c.techSlugs.includes(t.slug)).map((c) => (
              <span key={c.name} className="inline-flex items-center gap-2 rounded-md border px-2 py-1 text-xs">
                {c.logoUrl ? <Image src={c.logoUrl} alt={`${c.name} logo`} width={14} height={14} /> : null}
                {c.name}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}



