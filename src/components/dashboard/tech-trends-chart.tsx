"use client";

import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface TechTrend {
  name: string;
  popularity: number;
  change: number; // 변화율 (양수: 상승, 음수: 하락)
  category: string;
  logoUrl?: string;
}

export function TechTrendsChart() {
  const [trends, setTrends] = useState<TechTrend[]>([]);
  const [loading, setLoading] = useState(true);

  // 모의 데이터 (실제로는 API에서 가져올 데이터)
  useEffect(() => {
    const mockTrends: TechTrend[] = [
      { name: "Next.js", popularity: 95, change: 12, category: "Frontend", logoUrl: "https://cdn.simpleicons.org/nextdotjs" },
      { name: "React", popularity: 92, change: 5, category: "Frontend", logoUrl: "https://cdn.simpleicons.org/react" },
      { name: "TypeScript", popularity: 88, change: 15, category: "Language", logoUrl: "https://cdn.simpleicons.org/typescript" },
      { name: "Tailwind CSS", popularity: 85, change: 8, category: "Frontend", logoUrl: "https://cdn.simpleicons.org/tailwindcss" },
      { name: "Node.js", popularity: 82, change: -2, category: "Backend", logoUrl: "https://cdn.simpleicons.org/nodedotjs" },
      { name: "Docker", popularity: 78, change: 3, category: "DevOps", logoUrl: "https://cdn.simpleicons.org/docker" },
      { name: "PostgreSQL", popularity: 75, change: 7, category: "Database", logoUrl: "https://cdn.simpleicons.org/postgresql" },
      { name: "Kubernetes", popularity: 70, change: -5, category: "DevOps", logoUrl: "https://cdn.simpleicons.org/kubernetes" },
    ];

    setTimeout(() => {
      setTrends(mockTrends);
      setLoading(false);
    }, 1000);
  }, []);

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getTrendColor = (change: number) => {
    if (change > 0) return "text-green-600";
    if (change < 0) return "text-red-600";
    return "text-gray-500";
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      Frontend: "bg-blue-100 text-blue-700",
      Backend: "bg-green-100 text-green-700",
      Language: "bg-purple-100 text-purple-700",
      DevOps: "bg-orange-100 text-orange-700",
      Database: "bg-indigo-100 text-indigo-700",
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-700";
  };

  if (loading) {
    return (
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg animate-pulse" />
          <h3 className="text-xl font-bold text-gray-800">기술 트렌드</h3>
        </div>
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-xl">
              <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" style={{ width: `${60 + i * 10}%` }} />
                <div className="h-3 bg-gray-100 rounded animate-pulse" style={{ width: `${40 + i * 8}%` }} />
              </div>
              <div className="w-16 h-6 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-800">기술 트렌드</h3>
        <span className="ml-auto text-sm text-gray-500">지난 30일</span>
      </div>

      <div className="space-y-3">
        {trends.map((tech, index) => (
          <div
            key={tech.name}
            className="group flex items-center gap-4 p-3 rounded-xl hover:bg-white/40 hover:shadow-md transition-all duration-200"
          >
            {/* 순위 */}
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 text-sm font-bold text-purple-700">
              {index + 1}
            </div>

            {/* 로고 */}
            <div className="w-10 h-10 flex items-center justify-center">
              {tech.logoUrl ? (
                <img
                  src={tech.logoUrl}
                  alt={tech.name}
                  className="w-8 h-8 object-contain"
                />
              ) : (
                <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center text-sm font-bold text-gray-600">
                  {tech.name.charAt(0)}
                </div>
              )}
            </div>

            {/* 기술 정보 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-gray-800 truncate">{tech.name}</h4>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(tech.category)}`}>
                  {tech.category}
                </span>
              </div>
              
              {/* 인기도 바 */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                <div
                  className="h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${tech.popularity}%` }}
                />
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>인기도 {tech.popularity}%</span>
                <div className="flex items-center gap-1">
                  {getTrendIcon(tech.change)}
                  <span className={getTrendColor(tech.change)}>
                    {Math.abs(tech.change)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 더 보기 버튼 */}
      <div className="mt-6 text-center">
        <button className="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors">
          전체 트렌드 보기 →
        </button>
      </div>
    </div>
  );
}