import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { getGuideBySlug, GUIDES } from "@/lib/data";
import { notFound } from "next/navigation";

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = getGuideBySlug(params.slug);
  return {
    title: guide ? `${guide.title} | stackload` : "가이드 | stackload",
    description: guide?.summary,
  };
}

export default function GuidePage({ params }: Props) {
  const guide = getGuideBySlug(params.slug);
  if (!guide) return notFound();
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">{guide.title}</h1>
      <p className="text-muted-foreground">{guide.summary}</p>
      <div className="flex gap-2 text-sm">
        {guide.techSlugs.map((s) => (
          <Link key={s} href={`/tech/${s}`} className="underline">#{s}</Link>
        ))}
      </div>
      <article className="prose dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{guide.content}</ReactMarkdown>
      </article>
    </div>
  );
}


