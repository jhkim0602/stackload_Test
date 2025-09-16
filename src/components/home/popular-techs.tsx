"use client";

import { useState, useEffect } from "react";
import { Star, Building2, TrendingUp } from "lucide-react";
import Link from "next/link";
import { SafeImage } from "@/components/ui/safe-image";

interface PopularTech {
  slug: string;
  name: string;
  category: string;
  description: string;
  logoUrl?: string;
  stats: {
    usageCount: number;
    trendScore: number;
  };
}

interface PopularTechsProps {
  className?: string;
}

export function PopularTechs({ className = "" }: PopularTechsProps) {
  const [techs, setTechs] = useState<PopularTech[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    async function loadPopularTechs() {
      try {
        const [techsResponse, companiesResponse] = await Promise.all([
          fetch('/api/techs'),
          fetch('/api/companies')
        ]);
        
        const techsData = await techsResponse.json();
        const companiesData = await companiesResponse.json();
        
        // API 응답 구조에 따라 데이터 추출
        const techs = techsData.data || techsData;
        const companies = companiesData.data || companiesData;

        // 기술별 사용 회사 수 계산
        const techUsage = techs.map((tech: any) => {
          const usageCount = companies.filter((company: any) => 
            company.techSlugs.includes(tech.slug)
          ).length;
          
          // 간단한 트렌드 점수 계산 (카테고리별 가중치 적용)
          const categoryWeight = {
            frontend: 1.2,
            backend: 1.1,
            language: 1.3,
            devops: 1.0,
            database: 1.0,
            mobile: 0.9,
            testing: 0.8,
            collaboration: 0.7,
            data: 1.0
          };
          
          const trendScore = usageCount * (categoryWeight[tech.category as keyof typeof categoryWeight] || 1.0);
          
          return {
            slug: tech.slug,
            name: tech.name,
            category: tech.category,
            description: tech.description,
            logoUrl: tech.logoUrl,
            stats: {
              usageCount,
              trendScore: Math.round(trendScore * 10) / 10
            }
          };
        });

        // 트렌드 점수 순으로 정렬
        techUsage.sort((a: PopularTech, b: PopularTech) => b.stats.trendScore - a.stats.trendScore);
        
        setTechs(techUsage);
      } catch (error) {
        console.error('Failed to load popular techs:', error);
      } finally {
        setLoading(false);
      }
    }

    loadPopularTechs();
  }, []);

  const categories = ["All", "frontend", "backend", "language", "devops", "database", "mobile"];
  
  const filteredTechs = selectedCategory === "All" 
    ? techs 
    : techs.filter(tech => tech.category === selectedCategory);

  const topTechs = filteredTechs.slice(0, 8);

  const getCategoryColor = (category: string) => {
    const colors = {
      frontend: "bg-blue-100 text-blue-700 border-blue-200",
      backend: "bg-green-100 text-green-700 border-green-200",
      language: "bg-purple-100 text-purple-700 border-purple-200",
      devops: "bg-orange-100 text-orange-700 border-orange-200",
      database: "bg-indigo-100 text-indigo-700 border-indigo-200",
      mobile: "bg-pink-100 text-pink-700 border-pink-200",
      testing: "bg-yellow-100 text-yellow-700 border-yellow-200",
      collaboration: "bg-gray-100 text-gray-700 border-gray-200",
      data: "bg-cyan-100 text-cyan-700 border-cyan-200"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  if (loading) {
    return (
      <div className={`bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6 ${className}`}>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-6 h-6 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-6 bg-gray-200 rounded animate-pulse w-48" />
        </div>
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-8 bg-gray-200 rounded-full animate-pulse w-20 flex-shrink-0" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-4 bg-gray-100 rounded-xl animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-lg" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-3 bg-gray-200 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6 hover:shadow-xl transition-all duration-300 ${className}`}>
      <div className="flex items-center gap-2 mb-6">
        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
          <Star className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-800">인기 기술 스택</h3>
        <span className="ml-auto text-sm text-gray-500">기업 사용률 기준</span>
      </div>

      {/* 카테고리 필터 */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1 text-sm font-medium rounded-full transition-all duration-200 flex-shrink-0 ${
              selectedCategory === category
                ? "bg-blue-500 text-white shadow-md"
                : "bg-white/40 text-gray-600 hover:bg-white/60 hover:text-gray-800"
            }`}
          >
            {category === "All" ? "전체" : category}
          </button>
        ))}
      </div>

      {/* 인기 기술 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {topTechs.map((tech, index) => (
          <Link
            key={tech.slug}
            href={`/tech/${tech.slug}`}
            className="group flex items-center gap-3 p-4 bg-white/40 hover:bg-white/60 rounded-xl border border-white/30 hover:border-white/50 transition-all duration-200 hover:shadow-md"
          >
            {/* 순위 */}
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-sm font-bold text-blue-700 group-hover:from-blue-200 group-hover:to-purple-200 transition-all duration-200">
              {index + 1}
            </div>

            {/* 로고 */}
            <div className="w-10 h-10 flex items-center justify-center">
              <SafeImage
                src={tech.logoUrl}
                alt={tech.name}
                width={32}
                height={32}
                className="object-contain rounded-lg"
                fallbackText={tech.name.charAt(0)}
                fallbackColor="bg-gray-200 text-gray-600"
              />
            </div>

            {/* 기술 정보 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-gray-800 truncate group-hover:text-blue-700 transition-colors">
                  {tech.name}
                </h4>
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(tech.category)}`}>
                  {tech.category}
                </span>
              </div>
              <p className="text-sm text-gray-600 truncate mb-2">{tech.description}</p>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3 h-3" />
                  {tech.stats.usageCount}개 기업
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {tech.stats.trendScore}점
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 더 보기 버튼 */}
      <div className="mt-6 text-center">
        <Link 
          href="/tech"
          className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
        >
          전체 기술 스택 보기 →
        </Link>
      </div>
    </div>
  );
}