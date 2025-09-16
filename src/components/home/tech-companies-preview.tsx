"use client";

import { useState, useEffect } from "react";
import { Code2, ArrowRight, Building2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface TechWithCompanies {
  slug: string;
  name: string;
  category: string;
  description: string;
  logoUrl?: string;
  usingCompanies: {
    name: string;
    logoUrl?: string;
    category: string;
  }[];
  companyCount: number;
}

interface TechCompaniesPreviewProps {
  className?: string;
}

export function TechCompaniesPreview({ className = "" }: TechCompaniesPreviewProps) {
  const [techsWithCompanies, setTechsWithCompanies] = useState<TechWithCompanies[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTechCompaniesPreview() {
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

        // 각 기술별로 사용하는 기업들을 매칭
        const techsWithCompaniesData = techs.map((tech: any) => {
          const usingCompanies = companies.filter((company: any) => 
            company.techSlugs.includes(tech.slug)
          ).map((company: any) => ({
            name: company.name,
            logoUrl: company.logoUrl,
            category: company.industry || company.category
          }));

          return {
            slug: tech.slug,
            name: tech.name,
            category: tech.category,
            description: tech.description,
            logoUrl: tech.logoUrl,
            usingCompanies: usingCompanies.slice(0, 4), // 최대 4개 기업만 표시
            companyCount: usingCompanies.length
          };
        })
        .filter((tech: TechWithCompanies) => tech.companyCount > 0) // 사용 기업이 있는 기술만
        .sort((a: TechWithCompanies, b: TechWithCompanies) => b.companyCount - a.companyCount) // 사용 기업 수로 정렬
        .slice(0, 6); // 상위 6개만 표시

        setTechsWithCompanies(techsWithCompaniesData);
      } catch (error) {
        console.error('Failed to load tech-companies preview:', error);
        // 임시 데이터로 대체
        setTechsWithCompanies([
          { 
            slug: "react", 
            name: "React", 
            category: "frontend",
            description: "UI 라이브러리",
            logoUrl: "https://cdn.simpleicons.org/react",
            usingCompanies: [
              { name: "임시 기업 1", logoUrl: undefined, category: "tech" },
              { name: "임시 기업 2", logoUrl: undefined, category: "tech" }
            ], 
            companyCount: 2 
          }
        ]);
      } finally {
        setLoading(false);
      }
    }

    loadTechCompaniesPreview();
  }, []);

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
          <div className="h-6 bg-gray-200 rounded animate-pulse w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-6 bg-gray-100 rounded-xl animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex gap-2">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="w-8 h-8 bg-gray-200 rounded-full" />
                  ))}
                </div>
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6 hover:shadow-xl transition-all duration-300 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
            <Code2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">스택별 사용 기업을 한눈에!</h3>
          </div>
        </div>
        <Link 
          href="/search"
          className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors border border-purple-200 hover:border-purple-300"
        >
          전체보기
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 기술별 기업 카드 그리드 (3x2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {techsWithCompanies.map((tech) => (
          <Link
            key={tech.slug}
            href={`/tech/${tech.slug}`}
            className="group p-6 bg-white/40 hover:bg-white/60 rounded-xl border border-white/30 hover:border-white/50 transition-all duration-200 hover:shadow-md hover:-translate-y-1"
          >
            {/* 기술 헤더 */}
            <div className="flex items-center gap-3 mb-4">
              {/* 기술 로고 */}
              <div className="w-12 h-12 flex items-center justify-center">
                {tech.logoUrl ? (
                  <Image
                    src={tech.logoUrl}
                    alt={tech.name}
                    width={40}
                    height={40}
                    className="object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `<div class="w-10 h-10 bg-gradient-to-br from-purple-200 to-blue-300 rounded-lg flex items-center justify-center text-sm font-bold text-purple-700">${tech.name.charAt(0)}</div>`;
                      }
                    }}
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-200 to-blue-300 rounded-lg flex items-center justify-center text-sm font-bold text-purple-700">
                    {tech.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* 기술 정보 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-gray-800 group-hover:text-purple-700 transition-colors truncate">
                    {tech.name}
                  </h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(tech.category)}`}>
                    {tech.category}
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate">{tech.description}</p>
              </div>
            </div>

            {/* 사용 기업들 */}
            <div className="space-y-3">
              {/* 기업 로고들 */}
              <div className="flex items-center gap-2 overflow-hidden">
                {tech.usingCompanies.slice(0, 3).map((company, index) => (
                  <div key={index} className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                    {company.logoUrl ? (
                      <Image
                        src={company.logoUrl}
                        alt={company.name}
                        width={24}
                        height={24}
                        className="object-contain rounded-full"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `<div class="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">${company.name.charAt(0)}</div>`;
                          }
                        }}
                      />
                    ) : (
                      <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                        {company.name.charAt(0)}
                      </div>
                    )}
                  </div>
                ))}
                {tech.companyCount > 3 && (
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-500">
                    +{tech.companyCount - 3}
                  </div>
                )}
              </div>

              {/* 사용 기업 수 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Building2 className="w-4 h-4" />
                  <span className="font-medium">{tech.companyCount}개 기업에서 사용</span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="text-xs text-purple-600 font-medium">상세보기</span>
                  <ArrowRight className="w-3 h-3 text-purple-600" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}