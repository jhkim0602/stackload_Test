import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { COLLECTIONS, getCollectionBySlug, TECHS } from "@/lib/data";
import { notFound } from "next/navigation";

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = getCollectionBySlug(params.slug);
  return {
    title: c ? `${c.title} | stackload` : "컬렉션 | stackload",
    description: c?.description,
  };
}

export default function CollectionPage({ params }: Props) {
  const c = getCollectionBySlug(params.slug);
  if (!c) return notFound();

  const items = TECHS.filter((t) => c.techSlugs.includes(t.slug));

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">{c.title}</h1>
      <p className="text-muted-foreground">{c.description}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((t) => (
          <Card key={t.slug}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-3">
                <Link href={`/tech/${t.slug}`} className="hover:underline flex items-center gap-2">
                  {t.logoUrl ? (
                    <img src={t.logoUrl} alt={`${t.name} logo`} width={18} height={18} />
                  ) : null}
                  {t.name}
                </Link>
                <Badge variant="secondary">{t.category}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{t.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}


