"use client";

import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Users, Code } from "lucide-react";

interface StackOverview {
  totalCompanies: number;
  totalTechs: number;
  popularCategories: {
    category: string;
    count: number;
    percentage: number;
  }[];
  topTechsByUsage: {
    name: string;
    slug: string;
    usageCount: number;
    category: string;
  }[];
}

interface StackOverviewProps {
  className?: string;
}

export function StackOverview({ className = "" }: StackOverviewProps) {
  const [overview, setOverview] = useState<StackOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStackOverview() {
      try {
        const [companiesResponse, techsResponse] = await Promise.all([
          fetch('/api/companies'),
          fetch('/api/techs')
        ]);
        
        const companies = await companiesResponse.json();
        const techs = await techsResponse.json();

        // 카테고리별 기술 수 계산
        const categoryCount = techs.reduce((acc: Record<string, number>, tech: any) => {
          acc[tech.category] = (acc[tech.category] || 0) + 1;
          return acc;
        }, {});

        const popularCategories = Object.entries(categoryCount)
          .map(([category, count]) => ({
            category,
            count: count as number,
            percentage: Math.round((count as number / techs.length) * 100)
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 4);

        // 기술별 사용 기업 수 계산
        const techUsageCount = techs.map((tech: any) => {
          const usageCount = companies.filter((company: any) => 
            company.techSlugs.includes(tech.slug)
          ).length;
          
          return {
            name: tech.name,
            slug: tech.slug,
            usageCount,
            category: tech.category
          };
        });

        const topTechsByUsage = techUsageCount
          .sort((a: any, b: any) => b.usageCount - a.usageCount)
          .slice(0, 6);

        setOverview({
          totalCompanies: companies.length,
          totalTechs: techs.length,
          popularCategories,
          topTechsByUsage
        });
      } catch (error) {
        console.error('Failed to load stack overview:', error);
      } finally {
        setLoading(false);
      }
    }

    loadStackOverview();
  }, []);

  const getCategoryDisplayName = (category: string) => {
    const names = {
      frontend: "프론트엔드",
      backend: "백엔드", 
      language: "언어",
      devops: "데브옵스",
      database: "데이터베이스",
      mobile: "모바일",
      testing: "테스팅",
      collaboration: "협업도구",
      data: "데이터"
    };
    return names[category as keyof typeof names] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      frontend: "from-blue-500 to-blue-600",
      backend: "from-green-500 to-green-600",
      language: "from-purple-500 to-purple-600",
      devops: "from-orange-500 to-orange-600",
      database: "from-indigo-500 to-indigo-600",
      mobile: "from-pink-500 to-pink-600"
    };
    return colors[category as keyof typeof colors] || "from-gray-500 to-gray-600";
  };

  if (loading) {
    return (
      <div className={`bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6 ${className}`}>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-6 h-6 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-6 bg-gray-200 rounded animate-pulse w-32" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="text-center p-4 bg-gray-100 rounded-xl animate-pulse">
              <div className="w-8 h-8 bg-gray-200 rounded-lg mx-auto mb-2" />
              <div className="h-6 bg-gray-200 rounded mb-1" />
              <div className="h-4 bg-gray-200 rounded w-16 mx-auto" />
            </div>
          ))}
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-16 h-4 bg-gray-200 rounded" />
              <div className="flex-1 h-3 bg-gray-200 rounded" />
              <div className="w-8 h-4 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!overview) return null;

  return (
    <div className={`bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6 hover:shadow-xl transition-all duration-300 ${className}`}>
      <div className="flex items-center gap-2 mb-6">
        <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
          <BarChart3 className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-800">스택 현황 요약</h3>
      </div>

      {/* 전체 통계 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
            <Users className="w-4 h-4 text-white" />
          </div>
          <div className="text-2xl font-bold text-blue-700">{overview.totalCompanies}</div>
          <div className="text-sm text-blue-600">등록 기업</div>
        </div>

        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
            <Code className="w-4 h-4 text-white" />
          </div>
          <div className="text-2xl font-bold text-green-700">{overview.totalTechs}</div>
          <div className="text-sm text-green-600">등록 기술</div>
        </div>

        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <div className="text-2xl font-bold text-purple-700">{overview.popularCategories[0]?.count || 0}</div>
          <div className="text-sm text-purple-600">인기 카테고리</div>
        </div>

        <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-white" />
          </div>
          <div className="text-2xl font-bold text-orange-700">{overview.topTechsByUsage[0]?.usageCount || 0}</div>
          <div className="text-sm text-orange-600">최고 사용률</div>
        </div>
      </div>

      {/* 카테고리별 분포 */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-700 mb-4">카테고리별 기술 분포</h4>
        <div className="space-y-3">
          {overview.popularCategories.map((category) => (
            <div key={category.category} className="flex items-center gap-3">
              <div className="w-20 text-sm font-medium text-gray-700 text-right">
                {getCategoryDisplayName(category.category)}
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-3 relative overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${getCategoryColor(category.category)} rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: `${category.percentage}%` }}
                />
              </div>
              <div className="w-12 text-sm font-bold text-gray-600 text-right">
                {category.count}개
              </div>
              <div className="w-10 text-xs text-gray-500 text-right">
                {category.percentage}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 인기 기술 TOP 6 */}
      <div>
        <h4 className="text-lg font-semibold text-gray-700 mb-4">기업 사용률 TOP 6</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {overview.topTechsByUsage.map((tech, index) => (
            <div key={tech.slug} className="flex items-center gap-2 p-3 bg-white/40 rounded-lg border border-white/30">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 text-xs font-bold text-indigo-700">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-800 text-sm truncate">{tech.name}</div>
                <div className="text-xs text-gray-500">{tech.usageCount}개 기업</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}