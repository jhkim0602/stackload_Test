import type { Metadata } from "next";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";
import { FavoriteButton } from "@/components/tech/favorite-button";
import { ExternalLink, Github, Star, Building2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/ui/safe-image";
import { prisma } from "@/lib/prisma";

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
  try {
    // 개발 환경에서는 빈 배열 반환 (ISR 사용)
    if (process.env.NODE_ENV === 'development') {
      return [];
    }
    
    // 프로덕션에서는 데이터베이스에서 직접 가져오기
    const techs = await prisma.tech.findMany({
      select: { slug: true }
    });
    
    return techs.map(tech => ({ slug: tech.slug }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    // 데이터베이스에서 기술 정보 직접 가져오기
    const tech = await prisma.tech.findUnique({
      where: { slug },
      select: { name: true, description: true }
    });
    
    return {
      title: tech ? `${tech.name} | stackload` : "기술 | stackload",
      description: tech?.description || "기술 스택 정보",
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: "기술 | stackload",
      description: "기술 스택 정보",
    };
  }
}

export default async function TechDetailPage({ params }: Props) {
  const { slug } = await params;
  
  let tech: any = null;
  let usingCompanies: any[] = [];
  let categoryRank = 1;
  
  try {
    // 데이터베이스에서 직접 기술 정보 가져오기
    const [techData, companiesData] = await Promise.all([
      // 기술 상세 정보
      prisma.tech.findUnique({
        where: { slug },
        include: {
          postTags: {
            include: {
              post: {
                include: {
                  author: true
                }
              }
            },
            take: 5,
            orderBy: {
              post: {
                createdAt: 'desc'
              }
            }
          },
          _count: {
            select: { postTags: true }
          }
        }
      }),
      
      // 해당 기술을 사용하는 회사들
      prisma.company.findMany({
        where: {
          companyTechs: {
            some: {
              tech: {
                slug: slug
              }
            }
          }
        },
        include: {
          companyTechs: {
            include: {
              tech: true
            }
          }
        },
        take: 20
      })
    ]);

    if (!techData) {
      return notFound();
    }

    // 데이터 변환
    tech = {
      ...techData,
      id: techData.id.toString(),
      postCount: techData._count.postTags,
      recentPosts: techData.postTags.map(pt => ({
        ...pt.post,
        id: pt.post.id,
        likesCount: pt.post.likesCount,
        commentsCount: pt.post.commentsCount,
        author: {
          ...pt.post.author,
          id: pt.post.author.id
        }
      }))
    };

    // 회사 데이터 변환 (BigInt 처리)
    usingCompanies = companiesData.map(company => ({
      ...company,
      id: company.id.toString(),
      techSlugs: company.companyTechs.map(ct => ct.tech.slug),
      techs: company.companyTechs.map(ct => ({
        ...ct.tech,
        id: ct.tech.id.toString()
      }))
    }));

    // 카테고리 내 순위 계산 (임시로 1로 설정, 향후 개선 필요)
    categoryRank = 1;
    
  } catch (error) {
    console.error('Error fetching tech data:', error);
    return notFound();
  }

  if (!tech) return notFound();

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
            {tech.logoUrl ? (
              <div className="w-16 h-16 flex items-center justify-center">
                <SafeImage 
                  src={tech.logoUrl} 
                  alt={`${tech.name} logo`} 
                  width={64} 
                  height={64} 
                  className="object-contain" 
                  fallbackText={tech.name.charAt(0)}
                  fallbackColor="bg-gray-200 text-gray-600"
                />
              </div>
            ) : (
              <div className="w-16 h-16 flex items-center justify-center bg-gray-200 rounded-lg text-gray-600 text-2xl font-bold">
                {tech.name.charAt(0)}
              </div>
            )}
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-800">
              {tech.name}
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {tech.description}
          </p>

          {/* 핵심 지표 */}
          <div className="flex justify-center gap-6 flex-wrap my-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/60 rounded-full border border-white/30">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-gray-800">{usingCompanies.length}개 기업에서 사용</span>
            </div>
            
            <div className="flex items-center gap-2 px-4 py-2 bg-white/60 rounded-full border border-white/30">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="font-semibold text-gray-800">{tech.category} 카테고리 {categoryRank}위</span>
            </div>

            {tech.repo && (
              <div className="flex items-center gap-2 px-4 py-2 bg-white/60 rounded-full border border-white/30">
                <Star className="w-4 h-4 text-yellow-600" />
                <span className="font-semibold text-gray-800">GitHub 프로젝트</span>
              </div>
            )}
          </div>

          <div className="flex justify-center gap-2 flex-wrap mb-6">
            <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200">
              {tech.category}
            </Badge>
            {/* tags는 현재 API에서 제공되지 않으므로 임시 제거 */}
          </div>

          {/* 액션 버튼들 */}
          <div className="flex justify-center gap-4 flex-wrap">
            {tech.homepage && (
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <a href={tech.homepage} target="_blank" rel="noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  공식 사이트
                </a>
              </Button>
            )}
            
            {tech.repo ? (
              <Button asChild variant="outline">
                <a href={tech.repo} target="_blank" rel="noreferrer">
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
            <FavoriteButton slug={tech.slug} />
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
                  {getProjectSuitability(tech.category, tech.name).map((item, index) => (
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
                      {getDifficultyLevel(tech.category, tech.name).stars.map((filled, index) => (
                        <Star key={index} className={`w-4 h-4 ${filled ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
                      ))}
                      <span className="text-sm font-medium">{getDifficultyLevel(tech.category, tech.name).label}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {getDifficultyLevel(tech.category, tech.name).description}
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



