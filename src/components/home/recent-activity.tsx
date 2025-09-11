"use client";

import { useState, useEffect } from "react";
import { Clock, Plus, Building, Code2, TrendingUp } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface ActivityItem {
  id: string;
  type: "tech_added" | "company_added" | "tech_updated" | "trending";
  title: string;
  description: string;
  timestamp: string;
  data: {
    slug?: string;
    category?: string;
    logoUrl?: string;
    changeType?: string;
  };
}

interface RecentActivityProps {
  className?: string;
}

export function RecentActivity({ className = "" }: RecentActivityProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecentActivity() {
      try {
        const [techsResponse, companiesResponse] = await Promise.all([
          fetch('/api/techs'),
          fetch('/api/companies')
        ]);
        
        const techs = await techsResponse.json();
        const companies = await companiesResponse.json();

        // 실제 환경에서는 활동 로그 API에서 가져올 데이터
        // 현재는 기존 데이터를 기반으로 가상의 최근 활동 생성
        const mockActivities: ActivityItem[] = [
          {
            id: "1",
            type: "tech_added",
            title: "TypeScript 기술 정보 업데이트",
            description: "타입이 있는 JavaScript - 최신 버전 정보 및 학습 리소스 추가",
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2시간 전
            data: {
              slug: "typescript",
              category: "language",
              logoUrl: "https://cdn.simpleicons.org/typescript"
            }
          },
          {
            id: "2", 
            type: "company_added",
            title: "새로운 기업 추가",
            description: "Initech - 금융 분야에서 NestJS, MySQL 등을 활용",
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4시간 전
            data: {
              category: "finance"
            }
          },
          {
            id: "3",
            type: "tech_updated", 
            title: "Next.js 버전 업데이트",
            description: "v15 버전 정보 및 새로운 기능 문서 업데이트",
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6시간 전
            data: {
              slug: "nextjs",
              category: "frontend",
              logoUrl: "https://cdn.simpleicons.org/nextdotjs",
              changeType: "version"
            }
          },
          {
            id: "4",
            type: "trending",
            title: "React 인기도 상승",
            description: "더 많은 기업에서 React를 주력 기술로 채택",
            timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8시간 전
            data: {
              slug: "react",
              category: "frontend",
              logoUrl: "https://cdn.simpleicons.org/react"
            }
          },
          {
            id: "5",
            type: "tech_added",
            title: "Kubernetes 학습 가이드 추가",
            description: "컨테이너 오케스트레이션 - 실무 활용 예제 및 모범 사례",
            timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12시간 전
            data: {
              slug: "kubernetes",
              category: "devops",
              logoUrl: "https://cdn.simpleicons.org/kubernetes"
            }
          },
          {
            id: "6",
            type: "company_added",
            title: "Soylent 정보 업데이트",
            description: "푸드테크 기업 - Django, Redis, ClickHouse 기술 스택 정보",
            timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), // 18시간 전
            data: {
              category: "foodtech"
            }
          }
        ];

        setActivities(mockActivities);
      } catch (error) {
        console.error('Failed to load recent activity:', error);
      } finally {
        setLoading(false);
      }
    }

    loadRecentActivity();
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "tech_added":
      case "tech_updated":
        return <Code2 className="w-4 h-4" />;
      case "company_added":
        return <Building className="w-4 h-4" />;
      case "trending":
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Plus className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "tech_added":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "tech_updated":
        return "bg-green-100 text-green-700 border-green-200";
      case "company_added":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "trending":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getActivityTypeText = (type: string) => {
    switch (type) {
      case "tech_added":
        return "기술 추가";
      case "tech_updated":
        return "기술 업데이트";
      case "company_added":
        return "기업 추가";
      case "trending":
        return "트렌딩";
      default:
        return "활동";
    }
  };

  const formatRelativeTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffHours > 0) {
      return `${diffHours}시간 전`;
    } else if (diffMins > 0) {
      return `${diffMins}분 전`;
    } else {
      return "방금 전";
    }
  };

  if (loading) {
    return (
      <div className={`bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6 ${className}`}>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-6 h-6 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-6 bg-gray-200 rounded animate-pulse w-32" />
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-start gap-3 p-3 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-lg" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-1" />
                <div className="h-3 bg-gray-200 rounded w-1/4" />
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
        <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-cyan-500 rounded-lg flex items-center justify-center">
          <Clock className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-800">최근 활동</h3>
        <span className="ml-auto text-sm text-gray-500">업데이트 히스토리</span>
      </div>

      <div className="space-y-3">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="group flex items-start gap-3 p-3 bg-white/40 hover:bg-white/60 rounded-xl border border-white/30 hover:border-white/50 transition-all duration-200"
          >
            {/* 활동 타입 아이콘 */}
            <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${getActivityColor(activity.type)}`}>
              {getActivityIcon(activity.type)}
            </div>

            {/* 로고 (있는 경우) */}
            {activity.data.logoUrl && (
              <div className="w-8 h-8 flex items-center justify-center">
                <Image
                  src={activity.data.logoUrl}
                  alt=""
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>
            )}

            {/* 활동 내용 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-gray-800 truncate group-hover:text-blue-700 transition-colors">
                  {activity.title}
                </h4>
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getActivityColor(activity.type)}`}>
                  {getActivityTypeText(activity.type)}
                </span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                {activity.description}
              </p>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatRelativeTime(activity.timestamp)}
                </span>
                {activity.data.category && (
                  <span className="px-2 py-1 bg-gray-100 rounded-full">
                    {activity.data.category}
                  </span>
                )}
              </div>
            </div>

            {/* 링크 화살표 (기술의 경우) */}
            {activity.data.slug && (
              <Link
                href={`/tech/${activity.data.slug}`}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center w-8 h-8 rounded-lg hover:bg-blue-50 hover:text-blue-600"
              >
                →
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* 더 보기 버튼 */}
      <div className="mt-6 text-center">
        <button className="px-4 py-2 text-sm font-medium text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors">
          전체 활동 로그 보기 →
        </button>
      </div>
    </div>
  );
}