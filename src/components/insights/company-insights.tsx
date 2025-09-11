"use client";

import { useState, useEffect } from "react";
import { Building2, Search, Filter, Grid, List, Eye, Code2, MapPin, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface CompanyDetail {
  name: string;
  region: string;
  category: string;
  logoUrl?: string;
  techSlugs: string[];
  techDetails: {
    slug: string;
    name: string;
    category: string;
    logoUrl?: string;
  }[];
}

interface CompanyInsightsProps {
  className?: string;
}

export function CompanyInsights({ className = "" }: CompanyInsightsProps) {
  const [companies, setCompanies] = useState<CompanyDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    async function loadCompanies() {
      try {
        const [companiesResponse, techsResponse] = await Promise.all([
          fetch('/api/companies'),
          fetch('/api/techs')
        ]);
        
        const companies = await companiesResponse.json();
        const techs = await techsResponse.json();

        // 기업별로 기술 상세 정보 매핑
        const companiesWithDetails = companies.map((company: any) => {
          const techDetails = company.techSlugs.map((slug: string) => {
            const tech = techs.find((t: any) => t.slug === slug);
            return tech ? {
              slug: tech.slug,
              name: tech.name,
              category: tech.category,
              logoUrl: tech.logoUrl
            } : null;
          }).filter(Boolean);

          return {
            ...company,
            techDetails
          };
        });

        setCompanies(companiesWithDetails);
      } catch (error) {
        console.error('Failed to load companies:', error);
      } finally {
        setLoading(false);
      }
    }

    loadCompanies();
  }, []);

  const categories = ["All", "ecommerce", "mobility", "foodtech", "finance", "tech"];
  
  const filteredCompanies = companies.filter(company => {
    const matchesSearch = searchQuery === "" || 
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.techDetails.some(tech => tech.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "All" || company.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryDisplayName = (category: string) => {
    const names = {
      ecommerce: "이커머스",
      mobility: "모빌리티",
      foodtech: "푸드테크", 
      finance: "핀테크",
      tech: "테크"
    };
    return names[category as keyof typeof names] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      ecommerce: "bg-blue-100 text-blue-700 border-blue-200",
      mobility: "bg-green-100 text-green-700 border-green-200",
      foodtech: "bg-orange-100 text-orange-700 border-orange-200",
      finance: "bg-purple-100 text-purple-700 border-purple-200",
      tech: "bg-indigo-100 text-indigo-700 border-indigo-200"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getTechCategoryColor = (category: string) => {
    const colors = {
      frontend: "bg-blue-50 text-blue-600 border-blue-100",
      backend: "bg-green-50 text-green-600 border-green-100",
      language: "bg-purple-50 text-purple-600 border-purple-100",
      devops: "bg-orange-50 text-orange-600 border-orange-100",
      database: "bg-indigo-50 text-indigo-600 border-indigo-100",
      mobile: "bg-pink-50 text-pink-600 border-pink-100"
    };
    return colors[category as keyof typeof colors] || "bg-gray-50 text-gray-600 border-gray-100";
  };

  if (loading) {
    return (
      <div className={`space-y-8 ${className}`}>
        {/* 검색 및 필터 스켈레톤 */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6">
          <div className="h-10 bg-gray-200 rounded-lg animate-pulse mb-4" />
          <div className="flex gap-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded-full animate-pulse w-20" />
            ))}
          </div>
        </div>
        
        {/* 기업 카드 스켈레톤 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-xl" />
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded" />
                <div className="flex flex-wrap gap-2">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="h-6 bg-gray-200 rounded w-16" />
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
            placeholder="기업명, 카테고리, 기술 스택으로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/40 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* 카테고리 필터 및 보기 모드 */}
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
                    ({companies.filter(c => c.category === category).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* 보기 모드 토글 */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">보기:</span>
            <div className="flex bg-white/40 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "grid" ? "bg-white shadow-sm" : "hover:bg-white/50"
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "list" ? "bg-white shadow-sm" : "hover:bg-white/50"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 검색 결과 요약 */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>총 {filteredCompanies.length}개 기업</span>
          {searchQuery && (
            <span>"{searchQuery}" 검색 결과</span>
          )}
        </div>
      </div>

      {/* 기업 목록 */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <div
              key={company.name}
              className="group p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              onClick={() => {
                // 기업 상세 페이지로 이동 (향후 구현)
                console.log(`Navigate to company detail: ${company.name}`);
              }}
            >
              {/* 기업 헤더 */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 flex items-center justify-center bg-white/60 rounded-xl border border-white/30">
                  {company.logoUrl ? (
                    <Image
                      src={company.logoUrl}
                      alt={company.name}
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center text-lg font-bold text-gray-600">
                      {company.name.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-700 transition-colors truncate">
                    {company.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(company.category)}`}>
                      {getCategoryDisplayName(company.category)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600 mt-2">
                    <MapPin className="w-3 h-3" />
                    {company.region}
                  </div>
                </div>
              </div>


              {/* 기술 스택 */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Code2 className="w-4 h-4" />
                  <span>기술 스택</span>
                  <span className="text-xs text-gray-500">({company.techDetails.length}개)</span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {company.techDetails.slice(0, 6).map((tech) => (
                    <Link
                      key={tech.slug}
                      href={`/tech/${tech.slug}`}
                      className={`group/tech flex items-center gap-2 px-2 py-1 text-xs font-medium rounded-lg border transition-all duration-200 hover:shadow-sm ${getTechCategoryColor(tech.category)}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {tech.logoUrl && (
                        <Image
                          src={tech.logoUrl}
                          alt={tech.name}
                          width={14}
                          height={14}
                          className="object-contain"
                        />
                      )}
                      <span className="group-hover/tech:text-blue-700 transition-colors">
                        {tech.name}
                      </span>
                    </Link>
                  ))}
                  {company.techDetails.length > 6 && (
                    <span className="px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded-lg">
                      +{company.techDetails.length - 6}개 더
                    </span>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCompanies.map((company) => (
            <div
              key={company.name}
              className="group p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => {
                // 기업 상세 페이지로 이동 (향후 구현)
                console.log(`Navigate to company detail: ${company.name}`);
              }}
            >
              <div className="flex items-start gap-6">
                {/* 기업 로고 */}
                <div className="w-20 h-20 flex items-center justify-center bg-white/60 rounded-xl border border-white/30 flex-shrink-0">
                  {company.logoUrl ? (
                    <Image
                      src={company.logoUrl}
                      alt={company.name}
                      width={56}
                      height={56}
                      className="object-contain"
                    />
                  ) : (
                    <div className="w-14 h-14 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center text-xl font-bold text-gray-600">
                      {company.name.charAt(0)}
                    </div>
                  )}
                </div>

                {/* 기업 정보 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-xl text-gray-800 group-hover:text-blue-700 transition-colors">
                        {company.name}
                      </h3>
                      <div className="flex items-center gap-3 mt-2">
                        <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getCategoryColor(company.category)}`}>
                          {getCategoryDisplayName(company.category)}
                        </span>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          {company.region}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 group-hover:text-blue-700 transition-all duration-200">
                      <Eye className="w-4 h-4" />
                      <span>클릭하여 상세보기</span>
                    </div>
                  </div>


                  {/* 기술 스택 */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Code2 className="w-4 h-4" />
                      <span>사용 기술 스택 ({company.techDetails.length}개)</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {company.techDetails.map((tech) => (
                        <Link
                          key={tech.slug}
                          href={`/tech/${tech.slug}`}
                          className={`group/tech flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-lg border transition-all duration-200 hover:shadow-sm ${getTechCategoryColor(tech.category)}`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {tech.logoUrl && (
                            <Image
                              src={tech.logoUrl}
                              alt={tech.name}
                              width={16}
                              height={16}
                              className="object-contain"
                            />
                          )}
                          <span className="group-hover/tech:text-blue-700 transition-colors">
                            {tech.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 검색 결과 없음 */}
      {filteredCompanies.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">검색 결과가 없습니다</h3>
          <p className="text-gray-500">다른 검색어나 필터를 시도해보세요</p>
        </div>
      )}
    </div>
  );
}