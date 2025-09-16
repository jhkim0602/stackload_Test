import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://stackload.vercel.app";
  const pages = ["/", "/search", "/community"];
  
  // 빌드 시 데이터베이스 연결 문제를 피하기 위해 정적 페이지만 포함
  const routes: MetadataRoute.Sitemap = [
    ...pages.map((p) => ({ 
      url: base + p, 
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7 
    })),
  ];
  
  return routes;
}


