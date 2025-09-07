import type { MetadataRoute } from "next";
import { COLLECTIONS, GUIDES, TECHS } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://stackload.example";
  const pages = ["/", "/search", "/compare", "/collections", "/companies", "/guides"];
  const routes: MetadataRoute.Sitemap = [
    ...pages.map((p) => ({ url: base + p, priority: 0.7 })),
    ...TECHS.map((t) => ({ url: `${base}/tech/${t.slug}`, priority: 0.6 })),
    ...COLLECTIONS.map((c) => ({ url: `${base}/collections/${c.slug}`, priority: 0.6 })),
    ...GUIDES.map((g) => ({ url: `${base}/guides/${g.slug}`, priority: 0.5 })),
  ];
  return routes;
}


