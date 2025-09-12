import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://stackload.example";
  const pages = ["/", "/search", "/insights", "/paths", "/collections", "/companies"];
  
  try {
    // 데이터베이스에서 기술 목록 가져오기
    const techs = await prisma.tech.findMany({
      select: { slug: true }
    });

    const routes: MetadataRoute.Sitemap = [
      ...pages.map((p) => ({ url: base + p, priority: 0.7 })),
      ...techs.map((t) => ({ url: `${base}/tech/${t.slug}`, priority: 0.6 })),
      // Collections는 추후 데이터베이스에 추가할 예정
    ];
    
    return routes;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // 오류 시 기본 페이지만 반환
    return pages.map((p) => ({ url: base + p, priority: 0.7 }));
  }
}


