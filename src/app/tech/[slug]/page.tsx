import type { Metadata } from "next";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTechBySlug, TECHS } from "@/lib/data";
import { notFound } from "next/navigation";
import { FavoriteButton } from "@/components/tech/favorite-button";
import { ExternalLink, Github, Star, Building2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = { params: Promise<{ slug: string }> };

// 프로젝트 적합도를 반환하는 함수
function getProjectSuitability(category: string, techName: string): string[] {
  const suitabilityMap: Record<string, string[]> = {
    "프론트엔드": [
      "사용자 인터페이스가 중요한 웹 애플리케이션",
      "반응형 웹사이트 및 SPA 개발",
      "실시간 데이터 업데이트가 필요한 대시보드"
    ],
    "백엔드": [
      "확장 가능한 API 서버 구축",
      "대용량 데이터 처리 시스템",
      "마이크로서비스 아키텍처"
    ],
    "데이터베이스": [
      "대규모 데이터 저장 및 관리",
      "고성능 쿼리 처리가 필요한 시스템",
      "데이터 무결성이 중요한 애플리케이션"
    ],
    "모바일": [
      "크로스 플랫폼 모바일 앱",
      "네이티브 성능이 필요한 앱",
      "실시간 알림 및 푸시 서비스"
    ],
    "DevOps": [
      "컨테이너 기반 배포 환경",
      "CI/CD 파이프라인 구축",
      "클라우드 인프라 관리"
    ]
  };

  return suitabilityMap[category] || [
    "다양한 규모의 프로젝트에 적용 가능",
    "커뮤니티 지원이 활발한 프로젝트",
    "장기적 유지보수가 필요한 시스템"
  ];
}

// 학습 난이도를 반환하는 함수
function getDifficultyLevel(category: string, techName: string) {
  const difficultyMap: Record<string, { stars: boolean[], label: string, description: string }> = {
    "HTML": { stars: [true, false, false, false, false], label: "초급", description: "웹 개발의 기초로, 누구나 쉽게 시작할 수 있습니다." },
    "CSS": { stars: [true, false, false, false, false], label: "초급", description: "HTML과 함께 웹 디자인의 기본을 배울 수 있습니다." },
    "JavaScript": { stars: [true, true, false, false, false], label: "초중급", description: "프로그래밍 기초가 있다면 빠르게 익힐 수 있습니다." },
    "TypeScript": { stars: [true, true, true, false, false], label: "중급", description: "JavaScript 경험이 필요하며, 타입 시스템 이해가 중요합니다." },
    "React": { stars: [true, true, true, false, false], label: "중급", description: "JavaScript와 컴포넌트 개념 이해가 선행되어야 합니다." },
    "Vue.js": { stars: [true, true, false, false, false], label: "초중급", description: "직관적인 문법으로 프레임워크 입문자에게 적합합니다." },
    "Angular": { stars: [true, true, true, true, false], label: "고급", description: "TypeScript와 복잡한 아키텍처 패턴 이해가 필요합니다." },
    "Node.js": { stars: [true, true, true, false, false], label: "중급", description: "JavaScript 기초와 서버 개발 개념 이해가 필요합니다." },
    "Python": { stars: [true, true, false, false, false], label: "초중급", description: "읽기 쉬운 문법으로 프로그래밍 입문자에게 좋습니다." },
    "Java": { stars: [true, true, true, false, false], label: "중급", description: "객체지향 프로그래밍 개념 이해가 중요합니다." },
    "Docker": { stars: [true, true, true, false, false], label: "중급", description: "컨테이너 개념과 리눅스 기초 지식이 도움됩니다." },
    "Kubernetes": { stars: [true, true, true, true, true], label: "고급", description: "컨테이너 오케스트레이션의 복잡한 개념을 다룹니다." }
  };

  return difficultyMap[techName] || {
    stars: [true, true, true, false, false],
    label: "중급",
    description: "기본적인 개발 경험과 해당 분야 지식이 필요합니다."
  };
}

export async function generateStaticParams() {
  return TECHS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const t = getTechBySlug(slug);
  return {
    title: t ? `${t.name} | stackload` : "기술 | stackload",
    description: t?.description,
  };
}

export default async function TechDetailPage({ params }: Props) {
  const { slug } = await params;
  const t = getTechBySlug(slug);
  if (!t) return notFound();

  // 핵심 지표 계산
  const companiesResponse = await fetch('http://localhost:3000/api/companies');
  const companies = await companiesResponse.json();
  const usingCompanies = companies.filter((company: any) => 
    company.techSlugs.includes(t.slug)
  );
  
  // 카테고리 내 순위 계산 (사용 기업 수 기준)
  const sameCategoryTechs = TECHS.filter(tech => tech.category === t.category);
  const techWithUsage = sameCategoryTechs.map(tech => ({
    ...tech,
    usageCount: companies.filter((company: any) => company.techSlugs.includes(tech.slug)).length
  }));
  techWithUsage.sort((a, b) => b.usageCount - a.usageCount);
  const categoryRank = techWithUsage.findIndex(tech => tech.slug === t.slug) + 1;

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "conic-gradient(from 0deg, oklch(0.95 0.08 260), oklch(0.96 0.06 300), oklch(0.95 0.08 260))",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-6 py-16">
          <div className="flex justify-center items-center gap-4 mb-4">
            {t.logoUrl ? (
              <div className="w-16 h-16 flex items-center justify-center">
                <Image src={t.logoUrl} alt={`${t.name} logo`} width={64} height={64} className="object-contain" />
              </div>
            ) : null}
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-800">
              {t.name}
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t.description}
          </p>

          {/* 핵심 지표 */}
          <div className="flex justify-center gap-6 flex-wrap my-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/60 rounded-full border border-white/30">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-gray-800">{usingCompanies.length}개 기업에서 사용</span>
            </div>
            
            <div className="flex items-center gap-2 px-4 py-2 bg-white/60 rounded-full border border-white/30">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="font-semibold text-gray-800">{t.category} 카테고리 {categoryRank}위</span>
            </div>

            {t.repo && (
              <div className="flex items-center gap-2 px-4 py-2 bg-white/60 rounded-full border border-white/30">
                <Star className="w-4 h-4 text-yellow-600" />
                <span className="font-semibold text-gray-800">GitHub 프로젝트</span>
              </div>
            )}
          </div>

          <div className="flex justify-center gap-2 flex-wrap mb-6">
            <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200">
              {t.category}
            </Badge>
            {t.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="bg-white/40 hover:bg-white/60">
                #{tag}
              </Badge>
            ))}
          </div>

          {/* 액션 버튼들 */}
          <div className="flex justify-center gap-4 flex-wrap">
            {t.homepage && (
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <a href={t.homepage} target="_blank" rel="noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  공식 사이트
                </a>
              </Button>
            )}
            
            {t.repo ? (
              <Button asChild variant="outline">
                <a href={t.repo} target="_blank" rel="noreferrer">
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </a>
              </Button>
            ) : (
              <Button variant="outline" disabled>
                <Github className="w-4 h-4 mr-2" />
                GitHub 링크가 없습니다
              </Button>
            )}

            <Button variant="secondary">
              <TrendingUp className="w-4 h-4 mr-2" />
              유사 기술 비교
            </Button>
          </div>

          <div className="flex justify-center mt-6">
            <FavoriteButton slug={t.slug} />
          </div>
        </div>

        {/* 실무 활용도 섹션 */}
        <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              💡 개발자를 위한 실무 가이드
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 프로젝트 적합도 */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">어떤 프로젝트에 적합한가요?</h4>
                <div className="space-y-2">
                  {getProjectSuitability(t.category, t.name).map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 학습 난이도 */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">학습 난이도</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-600 min-w-[60px]">난이도:</span>
                    <div className="flex items-center gap-2">
                      {getDifficultyLevel(t.category, t.name).stars.map((filled, index) => (
                        <Star key={index} className={`w-4 h-4 ${filled ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
                      ))}
                      <span className="text-sm font-medium">{getDifficultyLevel(t.category, t.name).label}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {getDifficultyLevel(t.category, t.name).description}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 사용 기업 섹션 */}
        <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🏢 실제 사용 기업 현황
            </CardTitle>
          </CardHeader>
          <CardContent>
            {usingCompanies.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {usingCompanies.slice(0, 6).map((company: any) => (
                  <div key={company.name} className="flex items-center gap-3 p-4 bg-white/40 rounded-lg border border-white/30">
                    <div className="w-10 h-10 flex items-center justify-center">
                      {company.logoUrl ? (
                        <Image
                          src={company.logoUrl}
                          alt={company.name}
                          width={32}
                          height={32}
                          className="object-contain"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center text-xs font-bold text-gray-600">
                          {company.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">{company.name}</div>
                      <div className="text-sm text-gray-600">{company.category}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">아직 등록된 사용 기업이 없습니다.</p>
            )}
            
            {usingCompanies.length > 6 && (
              <div className="text-center mt-6">
                <p className="text-sm text-gray-600">
                  총 {usingCompanies.length}개 기업에서 사용 중 (상위 6개 표시)
                </p>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}



