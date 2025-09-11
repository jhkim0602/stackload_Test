"use client";

import { useState, useEffect } from "react";
import { Clock, Plus, Zap, GitBranch, Star, Building2 } from "lucide-react";

interface UpdateItem {
  id: string;
  type: "tech_added" | "company_added" | "version_update" | "trending";
  title: string;
  description: string;
  timestamp: string;
  relatedTech?: string;
  relatedCompany?: string;
  logoUrl?: string;
  metadata?: {
    version?: string;
    change?: number;
    category?: string;
  };
}

export function RecentUpdates() {
  const [updates, setUpdates] = useState<UpdateItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 모의 데이터
  useEffect(() => {
    const mockUpdates: UpdateItem[] = [
      {
        id: "1",
        type: "version_update",
        title: "Next.js 15.5.2 출시",
        description: "Turbopack 성능 개선 및 새로운 App Router 기능이 추가되었습니다.",
        timestamp: "2시간 전",
        relatedTech: "Next.js",
        logoUrl: "https://cdn.simpleicons.org/nextdotjs",
        metadata: { version: "15.5.2" }
      },
      {
        id: "2",
        type: "company_added",
        title: "토스 기술스택 업데이트",
        description: "React Query, Zustand 등 최신 프론트엔드 기술스택이 추가되었습니다.",
        timestamp: "5시간 전",
        relatedCompany: "토스",
        logoUrl: "https://static.toss.im/logos/png/4x/logo-toss-blue.png"
      },
      {
        id: "3",
        type: "trending",
        title: "TypeScript 인기 급상승",
        description: "지난 주 대비 15% 증가하며 개발자들 사이에서 인기가 높아지고 있습니다.",
        timestamp: "1일 전",
        relatedTech: "TypeScript",
        logoUrl: "https://cdn.simpleicons.org/typescript",
        metadata: { change: 15 }
      },
      {
        id: "4",
        type: "tech_added",
        title: "Bun 1.0 정식 출시",
        description: "JavaScript 런타임 Bun이 정식 버전 1.0을 출시했습니다.",
        timestamp: "2일 전",
        relatedTech: "Bun",
        logoUrl: "https://cdn.simpleicons.org/bun"
      },
      {
        id: "5",
        type: "company_added",
        title: "네이버 기술스택 업데이트",
        description: "Kubernetes, Kafka 등 인프라 기술이 추가되었습니다.",
        timestamp: "3일 전",
        relatedCompany: "네이버",
        logoUrl: "https://static.naver.net/www/mobile/edit/2016/0705/mobile_212852414260.png"
      },
      {
        id: "6",
        type: "trending",
        title: "Tailwind CSS 채택률 증가",
        description: "프론트엔드 개발자들 사이에서 CSS 프레임워크 채택률이 증가하고 있습니다.",
        timestamp: "4일 전",
        relatedTech: "Tailwind CSS",
        logoUrl: "https://cdn.simpleicons.org/tailwindcss",
        metadata: { change: 8 }
      }
    ];

    setTimeout(() => {
      setUpdates(mockUpdates);
      setLoading(false);
    }, 600);
  }, []);

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case "tech_added":
        return <Plus className="w-4 h-4 text-green-600" />;
      case "company_added":
        return <Building2 className="w-4 h-4 text-blue-600" />;
      case "version_update":
        return <GitBranch className="w-4 h-4 text-purple-600" />;
      case "trending":
        return <Zap className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getUpdateBgColor = (type: string) => {
    switch (type) {
      case "tech_added":
        return "bg-green-50 border-green-200";
      case "company_added":
        return "bg-blue-50 border-blue-200";
      case "version_update":
        return "bg-purple-50 border-purple-200";
      case "trending":
        return "bg-yellow-50 border-yellow-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "tech_added":
        return "신규 기술";
      case "company_added":
        return "기업 업데이트";
      case "version_update":
        return "버전 업데이트";
      case "trending":
        return "트렌딩";
      default:
        return "업데이트";
    }
  };

  if (loading) {
    return (
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg animate-pulse" />
          <h3 className="text-xl font-bold text-gray-800">최근 업데이트</h3>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4 p-3 rounded-xl">
              <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-3 bg-gray-100 rounded animate-pulse mb-1" />
                <div className="h-3 bg-gray-100 rounded animate-pulse" style={{ width: "60%" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
          <Clock className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-800">최근 업데이트</h3>
        <span className="ml-auto text-sm text-gray-500">실시간</span>
      </div>

      <div className="space-y-3">
        {updates.map((update, index) => (
          <div
            key={update.id}
            className={`group relative flex gap-4 p-4 rounded-xl border transition-all duration-200 hover:shadow-md cursor-pointer ${getUpdateBgColor(update.type)}`}
          >
            {/* 왼쪽: 아이콘 + 로고 */}
            <div className="flex-shrink-0 relative">
              <div className="w-10 h-10 flex items-center justify-center">
                {update.logoUrl ? (
                  <img
                    src={update.logoUrl}
                    alt={update.relatedTech || update.relatedCompany || ""}
                    className="w-8 h-8 object-contain"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                    {getUpdateIcon(update.type)}
                  </div>
                )}
              </div>
              
              {/* 타임라인 연결선 (마지막 항목 제외) */}
              {index < updates.length - 1 && (
                <div className="absolute top-12 left-1/2 w-0.5 h-6 bg-gray-200 transform -translate-x-1/2" />
              )}
            </div>

            {/* 오른쪽: 내용 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-white/60 text-gray-700">
                  {getUpdateIcon(update.type)}
                  {getTypeLabel(update.type)}
                </span>
                <span className="text-sm text-gray-500">{update.timestamp}</span>
              </div>

              <h4 className="font-semibold text-gray-800 mb-1 group-hover:text-gray-900">
                {update.title}
              </h4>
              
              <p className="text-sm text-gray-600 leading-relaxed">
                {update.description}
              </p>

              {/* 메타데이터 */}
              {update.metadata && (
                <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                  {update.metadata.version && (
                    <span className="flex items-center gap-1">
                      <GitBranch className="w-3 h-3" />
                      v{update.metadata.version}
                    </span>
                  )}
                  {update.metadata.change && (
                    <span className="flex items-center gap-1 text-green-600">
                      <Star className="w-3 h-3" />
                      +{update.metadata.change}%
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 더 보기 버튼 */}
      <div className="mt-6 text-center">
        <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
          모든 업데이트 보기 →
        </button>
      </div>
    </div>
  );
}