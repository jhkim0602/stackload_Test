"use client";

import { useState, useEffect } from "react";
import { Building2, ArrowRight, Code2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface CompanyPreview {
  name: string;
  category: string;
  region: string;
  logoUrl?: string;
  techSlugs: string[];
  techCount: number;
}

interface CompanyPreviewProps {
  className?: string;
}

export function CompanyPreview({ className = "" }: CompanyPreviewProps) {
  const [companies, setCompanies] = useState<CompanyPreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCompanyPreview() {
      try {
        const response = await fetch('/api/companies');
        const companiesData = await response.json();
        
        // API 응답 구조에 따라 데이터 추출
        const companies = companiesData.data || companiesData;

        // 처음 6개 기업만 미리보기로 표시
        const previewData = companies.slice(0, 6).map((company: any) => ({
          name: company.name,
          category: company.industry || company.category,
          region: company.location || company.region,
          logoUrl: company.logoUrl,
          techSlugs: company.techSlugs || [],
          techCount: (company.techSlugs || []).length
        }));

        setCompanies(previewData);
      } catch (error) {
        console.error('Failed to load company preview:', error);
        // 임시 데이터로 대체
        setCompanies([
          { name: "임시 데이터", category: "tech", region: "서울", logoUrl: undefined, techSlugs: ["react", "node"], techCount: 2 }
        ]);
      } finally {
        setLoading(false);
      }
    }

    loadCompanyPreview();
  }, []);

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

  if (loading) {
    return (
      <div className={`bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6 ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-6 bg-gray-200 rounded animate-pulse w-48" />
          </div>
          <div className="h-8 bg-gray-200 rounded animate-pulse w-24" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-6 bg-gray-100 rounded-xl animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-3/4" />
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
          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
            <Building2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">기업별 사용 스택을 한눈에!</h3>
            <p className="text-xs text-gray-500 mt-1">※ 현재 표시된 데이터는 임시 데이터입니다</p>
          </div>
        </div>
        <Link 
          href="/companies"
          className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200 hover:border-blue-300"
        >
          전체보기
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 기업 카드 그리드 (3x2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => (
          <div
            key={company.name}
            className="group p-6 bg-white/40 hover:bg-white/60 rounded-xl border border-white/30 hover:border-white/50 transition-all duration-200 hover:shadow-md hover:-translate-y-1"
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
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `<div class="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center text-sm font-bold text-gray-600">${company.name.charAt(0)}</div>`;
                      }
                    }}
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center text-sm font-bold text-gray-600">
                    {company.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* 기업 정보 */}
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-800 group-hover:text-blue-700 transition-colors truncate">
                  {company.name}
                </h4>
                <p className="text-sm text-gray-600 truncate">{company.region}</p>
              </div>
            </div>

            {/* 카테고리 및 기술 정보 */}
            <div className="space-y-3">
              <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getCategoryColor(company.category)}`}>
                {getCategoryDisplayName(company.category)}
              </span>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Code2 className="w-4 h-4" />
                <span>{company.techCount}개 기술 스택 사용</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 하단 설명 */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600 mb-4">
          국내 주요 기업들의 기술 스택 정보를 확인하고, 트렌드를 파악해보세요
        </p>
        <Link 
          href="/companies"
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Building2 className="w-4 h-4" />
          상세 인사이트 보기
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}