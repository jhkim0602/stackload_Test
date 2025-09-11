"use client";

import { useState, useEffect } from "react";
import { BookOpen, Clock, Star, Target, Lightbulb, ArrowRight, CheckCircle2 } from "lucide-react";

interface LearningPath {
  level: "Beginner" | "Intermediate" | "Advanced";
  title: string;
  description: string;
  estimatedTime: string;
  prerequisites: string[];
  topics: string[];
  resources: {
    title: string;
    type: "course" | "tutorial" | "documentation" | "practice";
    url: string;
    difficulty: 1 | 2 | 3 | 4 | 5;
    duration: string;
  }[];
}

interface RelatedTech {
  slug: string;
  name: string;
  relationship: "prerequisite" | "complementary" | "alternative" | "next-step";
  logoUrl?: string;
  description: string;
  learningPriority: 1 | 2 | 3 | 4 | 5;
}

interface LearningGuideProps {
  techSlug: string;
  techName: string;
}

export function LearningGuide({ techSlug, techName }: LearningGuideProps) {
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [relatedTechs, setRelatedTechs] = useState<RelatedTech[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string>("Beginner");
  const [loading, setLoading] = useState(true);

  const levels = ["Beginner", "Intermediate", "Advanced"];

  // 모의 데이터
  useEffect(() => {
    const mockLearningPaths: LearningPath[] = [
      {
        level: "Beginner",
        title: `${techName} 기초 학습`,
        description: "기본 개념부터 첫 번째 프로젝트까지",
        estimatedTime: "2-4주",
        prerequisites: ["HTML", "CSS", "JavaScript 기초"],
        topics: [
          "컴포넌트 개념 이해",
          "JSX 문법",
          "Props와 State",
          "이벤트 핸들링",
          "조건부 렌더링",
          "리스트 렌더링"
        ],
        resources: [
          {
            title: "공식 튜토리얼",
            type: "tutorial",
            url: "#",
            difficulty: 2,
            duration: "4시간"
          },
          {
            title: "입문자를 위한 강의",
            type: "course",
            url: "#",
            difficulty: 1,
            duration: "12시간"
          },
          {
            title: "실습 프로젝트",
            type: "practice",
            url: "#",
            difficulty: 2,
            duration: "8시간"
          }
        ]
      },
      {
        level: "Intermediate",
        title: `${techName} 중급 활용`,
        description: "실무에서 사용하는 고급 패턴과 도구들",
        estimatedTime: "4-8주",
        prerequisites: [`${techName} 기초`, "ES6+ JavaScript", "API 개념"],
        topics: [
          "Hooks 심화",
          "Context API",
          "커스텀 훅 개발",
          "성능 최적화",
          "테스팅",
          "상태 관리"
        ],
        resources: [
          {
            title: "고급 패턴 가이드",
            type: "documentation",
            url: "#",
            difficulty: 3,
            duration: "6시간"
          },
          {
            title: "실무 프로젝트 과정",
            type: "course",
            url: "#",
            difficulty: 4,
            duration: "20시간"
          }
        ]
      },
      {
        level: "Advanced",
        title: `${techName} 전문가 과정`,
        description: "대규모 애플리케이션 아키텍처와 최적화",
        estimatedTime: "8-12주",
        prerequisites: [`${techName} 중급`, "TypeScript", "빌드 도구"],
        topics: [
          "아키텍처 설계",
          "마이크로 프론트엔드",
          "SSR/SSG 최적화",
          "번들 최적화",
          "접근성",
          "국제화"
        ],
        resources: [
          {
            title: "아키텍처 패턴",
            type: "documentation",
            url: "#",
            difficulty: 5,
            duration: "10시간"
          },
          {
            title: "대규모 앱 개발",
            type: "course",
            url: "#",
            difficulty: 5,
            duration: "30시간"
          }
        ]
      }
    ];

    const mockRelatedTechs: RelatedTech[] = [
      {
        slug: "javascript",
        name: "JavaScript",
        relationship: "prerequisite",
        logoUrl: "https://cdn.simpleicons.org/javascript",
        description: "React 학습의 필수 기반 언어",
        learningPriority: 5
      },
      {
        slug: "typescript",
        name: "TypeScript",
        relationship: "complementary",
        logoUrl: "https://cdn.simpleicons.org/typescript",
        description: "타입 안정성을 위한 필수 도구",
        learningPriority: 4
      },
      {
        slug: "nextjs",
        name: "Next.js",
        relationship: "next-step",
        logoUrl: "https://cdn.simpleicons.org/nextdotjs",
        description: "React 기반 풀스택 프레임워크",
        learningPriority: 4
      },
      {
        slug: "vue",
        name: "Vue.js",
        relationship: "alternative",
        logoUrl: "https://cdn.simpleicons.org/vuedotjs",
        description: "React의 대안이 되는 프론트엔드 프레임워크",
        learningPriority: 3
      },
      {
        slug: "redux",
        name: "Redux",
        relationship: "complementary",
        logoUrl: "https://cdn.simpleicons.org/redux",
        description: "상태 관리를 위한 라이브러리",
        learningPriority: 3
      },
      {
        slug: "tailwind",
        name: "Tailwind CSS",
        relationship: "complementary",
        logoUrl: "https://cdn.simpleicons.org/tailwindcss",
        description: "유틸리티 우선 CSS 프레임워크",
        learningPriority: 3
      }
    ];

    setTimeout(() => {
      setLearningPaths(mockLearningPaths);
      setRelatedTechs(mockRelatedTechs);
      setLoading(false);
    }, 800);
  }, [techSlug, techName]);

  const currentPath = learningPaths.find(path => path.level === selectedLevel);

  const getRelationshipColor = (relationship: string) => {
    switch (relationship) {
      case "prerequisite":
        return "bg-red-100 text-red-700 border-red-200";
      case "complementary":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "next-step":
        return "bg-green-100 text-green-700 border-green-200";
      case "alternative":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getRelationshipLabel = (relationship: string) => {
    switch (relationship) {
      case "prerequisite":
        return "필수 선행";
      case "complementary":
        return "함께 학습";
      case "next-step":
        return "다음 단계";
      case "alternative":
        return "대안 기술";
      default:
        return "관련 기술";
    }
  };

  const getDifficultyStars = (difficulty: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < difficulty ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const getResourceTypeColor = (type: string) => {
    switch (type) {
      case "course":
        return "bg-purple-100 text-purple-700";
      case "tutorial":
        return "bg-blue-100 text-blue-700";
      case "documentation":
        return "bg-green-100 text-green-700";
      case "practice":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        {/* 학습 가이드 로딩 */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6">
          <div className="h-6 bg-gray-200 rounded animate-pulse mb-6" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
        
        {/* 관련 기술 로딩 */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6">
          <div className="h-6 bg-gray-200 rounded animate-pulse mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 학습 난이도 및 경로 */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">{techName} 학습 가이드</h3>
        </div>

        {/* 난이도 선택 */}
        <div className="flex flex-wrap gap-2 mb-8">
          {levels.map((level) => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                selectedLevel === level
                  ? "bg-purple-500 text-white shadow-md"
                  : "bg-white/40 text-gray-600 hover:bg-white/60 hover:text-gray-800"
              }`}
            >
              {level}
            </button>
          ))}
        </div>

        {/* 선택된 레벨의 학습 경로 */}
        {currentPath && (
          <div className="space-y-6">
            {/* 경로 헤더 */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
              <h4 className="text-xl font-bold text-gray-800 mb-2">{currentPath.title}</h4>
              <p className="text-gray-600 mb-4">{currentPath.description}</p>
              
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1 text-purple-600">
                  <Clock className="w-4 h-4" />
                  <span>예상 기간: {currentPath.estimatedTime}</span>
                </div>
                <div className="flex items-center gap-1 text-purple-600">
                  <Target className="w-4 h-4" />
                  <span>주제 {currentPath.topics.length}개</span>
                </div>
              </div>
            </div>

            {/* 선행 조건 */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <h5 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                선행 조건
              </h5>
              <div className="flex flex-wrap gap-2">
                {currentPath.prerequisites.map((prereq, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-700 rounded-full border border-blue-200"
                  >
                    {prereq}
                  </span>
                ))}
              </div>
            </div>

            {/* 학습 주제 */}
            <div>
              <h5 className="font-semibold text-gray-800 mb-4">주요 학습 주제</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentPath.topics.map((topic, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-white/40 rounded-lg border border-white/30"
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{topic}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 학습 자료 */}
            <div>
              <h5 className="font-semibold text-gray-800 mb-4">추천 학습 자료</h5>
              <div className="space-y-3">
                {currentPath.resources.map((resource, index) => (
                  <div
                    key={index}
                    className="group flex items-center gap-4 p-4 bg-white/40 hover:bg-white/60 rounded-xl border border-white/30 hover:border-white/50 transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h6 className="font-medium text-gray-800">{resource.title}</h6>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getResourceTypeColor(resource.type)}`}>
                          {resource.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{resource.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>난이도:</span>
                          <div className="flex gap-0.5">
                            {getDifficultyStars(resource.difficulty)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 관련 기술 추천 */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
            <Target className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">관련 기술 추천</h3>
          <span className="ml-auto text-sm text-gray-500">학습 우선순위 기준</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {relatedTechs
            .sort((a, b) => b.learningPriority - a.learningPriority)
            .map((tech) => (
              <div
                key={tech.slug}
                className="group relative p-4 bg-white/40 hover:bg-white/60 rounded-xl border border-white/30 hover:border-white/50 transition-all duration-200 cursor-pointer"
              >
                {/* 우선순위 표시 */}
                <div className="absolute top-3 right-3">
                  <div className="flex gap-0.5">
                    {[...Array(tech.learningPriority)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>

                {/* 기술 정보 */}
                <div className="flex items-center gap-3 mb-3">
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
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-800 truncate">{tech.name}</h4>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full border ${getRelationshipColor(tech.relationship)}`}>
                      {getRelationshipLabel(tech.relationship)}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed">{tech.description}</p>

                {/* 호버 시 화살표 */}
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <ArrowRight className="w-4 h-4 text-blue-500" />
                </div>
              </div>
            ))}
        </div>

        {/* 더 보기 버튼 */}
        <div className="mt-6 text-center">
          <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
            모든 관련 기술 보기 →
          </button>
        </div>
      </div>
    </div>
  );
}