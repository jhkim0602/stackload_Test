"use client";

import { useState, useEffect } from "react";
import { Building2, Users, Code2, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface CompanyStack {
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

interface CompanyStacksProps {
  className?: string;
}

export function CompanyStacks({ className = "" }: CompanyStacksProps) {
  const [companies, setCompanies] = useState<CompanyStack[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    async function loadCompanyStacks() {
      try {
        const [companiesResponse, techsResponse] = await Promise.all([
          fetch('/api/companies'),
          fetch('/api/techs')
        ]);
        
        const companies = await companiesResponse.json();
        const techs = await techsResponse.json();

        // 기업별로 기술 상세 정보 매핑
        const companiesWithTechDetails = companies.map((company: any) => {
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

        setCompanies(companiesWithTechDetails);
      } catch (error) {
        console.error('Failed to load company stacks:', error);
      } finally {
        setLoading(false);
      }
    }

    loadCompanyStacks();
  }, []);

  const categories = ["All", "ecommerce", "mobility", "foodtech", "finance", "tech"];
  
  const filteredCompanies = selectedCategory === "All" 
    ? companies 
    : companies.filter(company => company.category === selectedCategory);

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
      <div className={`bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6 ${className}`}>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-6 h-6 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-6 bg-gray-200 rounded animate-pulse w-48" />
        </div>
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-8 bg-gray-200 rounded-full animate-pulse w-20 flex-shrink-0" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-6 bg-gray-100 rounded-xl animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="h-6 bg-gray-200 rounded w-16" />
                ))}
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
        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
          <Building2 className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-800">기업별 사용 스택을 한눈에!</h3>
        <span className="ml-auto text-sm text-gray-500">{companies.length}개 기업</span>
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
            {category === "All" ? "전체" : getCategoryDisplayName(category)}
            {category !== "All" && (
              <span className="ml-1 text-xs opacity-75">
                ({companies.filter(c => c.category === category).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 기업 스택 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCompanies.map((company) => (
          <div
            key={company.name}
            className="group p-6 bg-white/40 hover:bg-white/60 rounded-xl border border-white/30 hover:border-white/50 transition-all duration-200 hover:shadow-lg"
          >
            {/* 기업 헤더 */}
            <div className="flex items-center gap-3 mb-4">
              {/* 기업 로고 */}
              <div className="w-12 h-12 flex items-center justify-center">
                {company.logoUrl ? (
                  <Image
                    src={company.logoUrl}
                    alt={company.name}
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center text-sm font-bold text-gray-600">
                    {company.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* 기업 정보 */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-gray-800 group-hover:text-blue-700 transition-colors">
                    {company.name}
                  </h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(company.category)}`}>
                    {getCategoryDisplayName(company.category)}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Users className="w-3 h-3" />
                  {company.region}
                </div>
              </div>
            </div>

            {/* 기술 스택 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Code2 className="w-4 h-4" />
                <span>사용 기술 스택</span>
                <span className="text-xs text-gray-500">({company.techDetails.length}개)</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {company.techDetails.map((tech) => (
                  <Link
                    key={tech.slug}
                    href={`/tech/${tech.slug}`}
                    className={`group/tech flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg border transition-all duration-200 hover:shadow-sm ${getTechCategoryColor(tech.category)}`}
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

            {/* 상세 보기 버튼 */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium group-hover:translate-x-1 transition-all duration-200">
                <Eye className="w-4 h-4" />
                기업 상세 정보 보기
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 더 보기 버튼 */}
      <div className="mt-8 text-center">
        <Link 
          href="/companies"
          className="px-6 py-3 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200 hover:border-blue-300"
        >
          전체 기업 목록 보기 →
        </Link>
      </div>
    </div>
  );
}