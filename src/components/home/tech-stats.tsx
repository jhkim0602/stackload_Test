"use client";

import { useState, useEffect } from "react";
import { BarChart3, Code, Database, Layers, Server } from "lucide-react";

interface TechStat {
  category: string;
  count: number;
  icon: any;
  color: string;
}

interface TechStatsProps {
  className?: string;
}

export function TechStats({ className = "" }: TechStatsProps) {
  const [stats, setStats] = useState<TechStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await fetch('/api/techs');
        const techsData = await response.json();
        
        // API 응답 구조에 따라 데이터 추출
        const techs = techsData.data || techsData;
        
        // 카테고리별 통계 계산
        const categoryCount = techs.reduce((acc: Record<string, number>, tech: any) => {
          acc[tech.category] = (acc[tech.category] || 0) + 1;
          return acc;
        }, {});

        const statsData: TechStat[] = [
          {
            category: "Frontend",
            count: categoryCount.frontend || 0,
            icon: Code,
            color: "bg-blue-100 text-blue-700 border-blue-200"
          },
          {
            category: "Backend", 
            count: categoryCount.backend || 0,
            icon: Server,
            color: "bg-green-100 text-green-700 border-green-200"
          },
          {
            category: "Database",
            count: categoryCount.database || 0,
            icon: Database,
            color: "bg-purple-100 text-purple-700 border-purple-200"
          },
          {
            category: "DevOps",
            count: categoryCount.devops || 0,
            icon: Layers,
            color: "bg-orange-100 text-orange-700 border-orange-200"
          }
        ];

        setStats(statsData);
      } catch (error) {
        console.error('Failed to load tech stats:', error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className={`bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6 ${className}`}>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-6 h-6 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-6 bg-gray-200 rounded animate-pulse w-32" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="text-center p-4 bg-gray-100 rounded-xl animate-pulse">
              <div className="w-8 h-8 bg-gray-200 rounded-lg mx-auto mb-2" />
              <div className="h-6 bg-gray-200 rounded mb-1" />
              <div className="h-4 bg-gray-200 rounded w-16 mx-auto" />
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
          <BarChart3 className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-800">기술 카테고리 현황</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <div key={stat.category} className={`text-center p-4 rounded-xl border ${stat.color} hover:shadow-md transition-all duration-200`}>
              <div className="flex justify-center mb-2">
                <IconComponent className="w-8 h-8" />
              </div>
              <div className="text-2xl font-bold mb-1">{stat.count}</div>
              <div className="text-sm font-medium">{stat.category}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-center">
        <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
          전체 기술 탐색하기 →
        </button>
      </div>
    </div>
  );
}