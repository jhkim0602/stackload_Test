"use client";

import { useState, useEffect } from "react";
import { Star, Users, Building2, Crown } from "lucide-react";

interface TechStack {
  id: string;
  name: string;
  technologies: string[];
  companies: number;
  popularity: number;
  description: string;
  logoUrls: string[];
  category: "Frontend" | "Backend" | "Full Stack" | "Mobile" | "DevOps";
}

export function PopularStacks() {
  const [stacks, setStacks] = useState<TechStack[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Frontend", "Backend", "Full Stack", "Mobile", "DevOps"];

  // 모의 데이터
  useEffect(() => {
    const mockStacks: TechStack[] = [
      {
        id: "1",
        name: "Modern React Stack",
        technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
        companies: 245,
        popularity: 94,
        description: "현대적인 React 생태계를 활용한 프론트엔드 스택",
        logoUrls: [
          "https://cdn.simpleicons.org/react",
          "https://cdn.simpleicons.org/nextdotjs",
          "https://cdn.simpleicons.org/typescript",
          "https://cdn.simpleicons.org/tailwindcss"
        ],
        category: "Frontend"
      },
      {
        id: "2",
        name: "Node.js Backend",
        technologies: ["Node.js", "Express", "PostgreSQL", "Docker"],
        companies: 189,
        popularity: 88,
        description: "확장 가능한 Node.js 백엔드 스택",
        logoUrls: [
          "https://cdn.simpleicons.org/nodedotjs",
          "https://cdn.simpleicons.org/express",
          "https://cdn.simpleicons.org/postgresql",
          "https://cdn.simpleicons.org/docker"
        ],
        category: "Backend"
      },
      {
        id: "3",
        name: "Full Stack MERN",
        technologies: ["MongoDB", "Express", "React", "Node.js"],
        companies: 156,
        popularity: 82,
        description: "JavaScript 기반 풀스택 개발 스택",
        logoUrls: [
          "https://cdn.simpleicons.org/mongodb",
          "https://cdn.simpleicons.org/express",
          "https://cdn.simpleicons.org/react",
          "https://cdn.simpleicons.org/nodedotjs"
        ],
        category: "Full Stack"
      },
      {
        id: "4",
        name: "Spring Boot Enterprise",
        technologies: ["Spring Boot", "Java", "PostgreSQL", "Kubernetes"],
        companies: 134,
        popularity: 79,
        description: "엔터프라이즈급 Java 백엔드 스택",
        logoUrls: [
          "https://cdn.simpleicons.org/spring",
          "https://cdn.simpleicons.org/openjdk",
          "https://cdn.simpleicons.org/postgresql",
          "https://cdn.simpleicons.org/kubernetes"
        ],
        category: "Backend"
      },
      {
        id: "5",
        name: "React Native Mobile",
        technologies: ["React Native", "TypeScript", "Expo", "Firebase"],
        companies: 98,
        popularity: 75,
        description: "크로스플랫폼 모바일 개발 스택",
        logoUrls: [
          "https://cdn.simpleicons.org/react",
          "https://cdn.simpleicons.org/typescript",
          "https://cdn.simpleicons.org/expo",
          "https://cdn.simpleicons.org/firebase"
        ],
        category: "Mobile"
      },
      {
        id: "6",
        name: "DevOps Pipeline",
        technologies: ["Docker", "Kubernetes", "Jenkins", "AWS"],
        companies: 87,
        popularity: 72,
        description: "현대적인 DevOps 파이프라인 스택",
        logoUrls: [
          "https://cdn.simpleicons.org/docker",
          "https://cdn.simpleicons.org/kubernetes",
          "https://cdn.simpleicons.org/jenkins",
          "https://cdn.simpleicons.org/amazonaws"
        ],
        category: "DevOps"
      }
    ];

    setTimeout(() => {
      setStacks(mockStacks);
      setLoading(false);
    }, 800);
  }, []);

  const filteredStacks = selectedCategory === "All" 
    ? stacks 
    : stacks.filter(stack => stack.category === selectedCategory);

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (index === 1) return <Star className="w-5 h-5 text-gray-400" />;
    if (index === 2) return <Star className="w-5 h-5 text-amber-600" />;
    return null;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      Frontend: "bg-blue-100 text-blue-700 border-blue-200",
      Backend: "bg-green-100 text-green-700 border-green-200",
      "Full Stack": "bg-purple-100 text-purple-700 border-purple-200",
      Mobile: "bg-pink-100 text-pink-700 border-pink-200",
      DevOps: "bg-orange-100 text-orange-700 border-orange-200",
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  if (loading) {
    return (
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg animate-pulse" />
          <h3 className="text-xl font-bold text-gray-800">인기 기술 스택</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-4 border border-gray-200 rounded-xl">
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-3" />
              <div className="h-3 bg-gray-100 rounded animate-pulse mb-2" />
              <div className="flex gap-2">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
                ))}
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
        <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <Star className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-800">인기 기술 스택</h3>
        <span className="ml-auto text-sm text-gray-500">기업 사용률 기준</span>
      </div>

      {/* 카테고리 필터 */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1 text-sm font-medium rounded-full transition-all duration-200 ${
              selectedCategory === category
                ? "bg-purple-500 text-white shadow-md"
                : "bg-white/40 text-gray-600 hover:bg-white/60 hover:text-gray-800"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* 스택 목록 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredStacks.map((stack, index) => (
          <div
            key={stack.id}
            className="group relative p-4 border border-white/30 rounded-xl hover:bg-white/40 hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            {/* 순위 표시 */}
            <div className="absolute top-3 right-3 flex items-center gap-1">
              {getRankIcon(index)}
              <span className="text-sm font-bold text-gray-600">#{index + 1}</span>
            </div>

            {/* 스택 정보 */}
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-bold text-gray-800 text-lg">{stack.name}</h4>
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(stack.category)}`}>
                  {stack.category}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{stack.description}</p>
            </div>

            {/* 기술 로고들 */}
            <div className="flex items-center gap-2 mb-3">
              {stack.logoUrls.map((url, idx) => (
                <div key={idx} className="w-8 h-8 flex items-center justify-center">
                  <img
                    src={url}
                    alt={stack.technologies[idx]}
                    className="w-6 h-6 object-contain"
                    title={stack.technologies[idx]}
                  />
                </div>
              ))}
              {stack.technologies.length > 4 && (
                <span className="text-xs text-gray-500 font-medium">
                  +{stack.technologies.length - 4}
                </span>
              )}
            </div>

            {/* 통계 */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-gray-600">
                  <Building2 className="w-4 h-4" />
                  <span>{stack.companies}개 기업</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{stack.popularity}%</span>
                </div>
              </div>
            </div>

            {/* 인기도 바 */}
            <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${stack.popularity}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* 더 보기 버튼 */}
      <div className="mt-6 text-center">
        <button className="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors">
          모든 기술 스택 보기 →
        </button>
      </div>
    </div>
  );
}