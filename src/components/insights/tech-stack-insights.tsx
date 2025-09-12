"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Grid, List, ExternalLink, Building2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface TechStack {
  slug: string;
  name: string;
  category: string;
  description: string;
  logoUrl?: string;
  usageCount: number;
  companyLogos: {
    name: string;
    logoUrl?: string;
  }[];
  additionalCount: number; // 표시되지 않은 추가 기업 수
}

interface TechStackInsightsProps {
  className?: string;
}

export function TechStackInsights({ className = "" }: TechStackInsightsProps) {
  const [techStacks, setTechStacks] = useState<TechStack[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    async function loadTechStacks() {
      try {
        const [techsResponse, companiesResponse] = await Promise.all([
          fetch('/api/techs'),
          fetch('/api/companies')
        ]);
        
        if (!techsResponse.ok || !companiesResponse.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const techsData = await techsResponse.json();
        const companiesData = await companiesResponse.json();
        
        // API 응답에서 data 속성 추출
        const techs = Array.isArray(techsData.data) ? techsData.data : Array.isArray(techsData) ? techsData : [];
        const companies = Array.isArray(companiesData.data) ? companiesData.data : Array.isArray(companiesData) ? companiesData : [];

        // 각 기술별로 사용하는 기업들 계산
        const techStacksData = techs.map((tech: any) => {
          const usingCompanies = companies.filter((company: any) => 
            Array.isArray(company.techSlugs) && company.techSlugs.includes(tech.slug)
          );

          // 표시할 기업 로고 (최대 6개)
          const companyLogos = usingCompanies.slice(0, 6).map((company: any) => ({
            name: company.name || 'Unknown',
            logoUrl: company.logoUrl
          }));

          return {
            slug: tech.slug || '',
            name: tech.name || 'Unknown',
            category: tech.category || 'other',
            description: tech.description || '',
            logoUrl: tech.logoUrl,
            usageCount: usingCompanies.length,
            companyLogos,
            additionalCount: Math.max(0, usingCompanies.length - 6)
          };
        }).filter((tech: any) => tech.slug); // 유효한 slug가 있는 것만 필터링

        // 사용 기업 수로 정렬
        techStacksData.sort((a: TechStack, b: TechStack) => b.usageCount - a.usageCount);
        
        setTechStacks(techStacksData);
      } catch (error) {
        console.error('Failed to load tech stacks:', error);
        setTechStacks([]); // 오류 시 빈 배열로 설정
      } finally {
        setLoading(false);
      }
    }

    loadTechStacks();
  }, []);

  const categories = ["All", "frontend", "backend", "language", "devops", "database", "mobile"];
  
  const filteredTechStacks = techStacks.filter(tech => {
    const matchesSearch = searchQuery === "" || 
      tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "All" || tech.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryDisplayName = (category: string) => {
    const names = {
      frontend: "프론트엔드",
      backend: "백엔드",
      language: "언어",
      devops: "데브옵스",
      database: "데이터베이스",
      mobile: "모바일"
    };
    return names[category as keyof typeof names] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      frontend: "bg-blue-100 text-blue-700 border-blue-200",
      backend: "bg-green-100 text-green-700 border-green-200",
      language: "bg-purple-100 text-purple-700 border-purple-200",
      devops: "bg-orange-100 text-orange-700 border-orange-200",
      database: "bg-indigo-100 text-indigo-700 border-indigo-200",
      mobile: "bg-pink-100 text-pink-700 border-pink-200"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  if (loading) {
    return (
      <div className={`space-y-8 ${className}`}>
        {/* 검색 및 필터 스켈레톤 */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6">
          <div className="h-10 bg-gray-200 rounded-lg animate-pulse mb-4" />
          <div className="flex gap-2 mb-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded-full animate-pulse w-20" />
            ))}
          </div>
        </div>
        
        {/* 기술 스택 카드 스켈레톤 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-xl" />
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
                <div className="w-6 h-6 bg-gray-200 rounded" />
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded" />
                <div className="flex gap-2">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="w-8 h-8 bg-gray-200 rounded-lg" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* 검색 및 필터 */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6">
        {/* 검색바 */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="기술 스택을 검색해주세요..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/40 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* 카테고리 필터 */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 flex-shrink-0 ${
                  selectedCategory === category
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-white/40 text-gray-600 hover:bg-white/60 hover:text-gray-800"
                }`}
              >
                {category === "All" ? "전체" : getCategoryDisplayName(category)}
                {category !== "All" && (
                  <span className="ml-1 text-xs opacity-75">
                    ({techStacks.filter(t => t.category === category).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 검색 결과 요약 */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>총 {filteredTechStacks.length}개 기술 스택</span>
          {searchQuery && (
            <span>"{searchQuery}" 검색 결과</span>
          )}
        </div>
      </div>

      {/* 기술 스택 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTechStacks.map((techStack) => (
          <Link
            key={techStack.slug}
            href={`/tech/${techStack.slug}`}
            className="group p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
          >
            {/* 기술 스택 헤더 */}
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 flex items-center justify-center bg-white/60 rounded-xl border border-white/30">
                {techStack.logoUrl ? (
                  <Image
                    src={techStack.logoUrl}
                    alt={techStack.name}
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center text-lg font-bold text-gray-600">
                    {techStack.name.charAt(0)}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-700 transition-colors truncate">
                  {techStack.name}
                </h3>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(techStack.category)}`}>
                  {getCategoryDisplayName(techStack.category)}
                </span>
              </div>

              <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
            </div>

            {/* 사용 기업 수 */}
            <div className="mb-4">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Building2 className="w-4 h-4" />
                <span>총 {techStack.usageCount}개의 기업에서 사용 중</span>
              </div>
            </div>

            {/* 기업 로고들 */}
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {techStack.companyLogos.map((company, index) => (
                  <div
                    key={index}
                    className="w-8 h-8 flex items-center justify-center bg-white/60 rounded-lg border border-white/30"
                    title={company.name}
                  >
                    {company.logoUrl ? (
                      <Image
                        src={company.logoUrl}
                        alt={company.name}
                        width={24}
                        height={24}
                        className="object-contain"
                      />
                    ) : (
                      <div className="w-6 h-6 bg-gradient-to-br from-gray-200 to-gray-300 rounded flex items-center justify-center text-xs font-bold text-gray-600">
                        {company.name.charAt(0)}
                      </div>
                    )}
                  </div>
                ))}
                {techStack.additionalCount > 0 && (
                  <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg border border-gray-200 text-xs font-medium text-gray-600">
                    +{techStack.additionalCount}
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 검색 결과 없음 */}
      {filteredTechStacks.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">검색 결과가 없습니다</h3>
          <p className="text-gray-500">다른 검색어나 필터를 시도해보세요</p>
        </div>
      )}
    </div>
  );
}