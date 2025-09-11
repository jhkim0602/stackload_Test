"use client";

import { useState, useEffect } from "react";
import { MapPin, Building2, Users, TrendingUp } from "lucide-react";

interface CompanyLocation {
  id: string;
  name: string;
  region: string;
  coordinates: { lat: number; lng: number };
  category: string;
  employeeCount?: string;
  logoUrl?: string;
  techUsage: {
    primary: boolean; // 주력 기술인지
    since: string; // 사용 시작 시기
    team: string; // 사용 팀
  };
}

interface CompanyMapProps {
  techSlug: string;
  techName: string;
}

export function CompanyMap({ techSlug, techName }: CompanyMapProps) {
  const [companies, setCompanies] = useState<CompanyLocation[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [loading, setLoading] = useState(true);

  // 지역별 그룹핑
  const regions = ["All", "서울특별시", "경기도", "부산광역시", "기타"];

  // 모의 데이터 (실제로는 props.techSlug 기반으로 API 호출)
  useEffect(() => {
    const mockCompanies: CompanyLocation[] = [
      {
        id: "1",
        name: "토스",
        region: "서울특별시 강남구",
        coordinates: { lat: 37.5172, lng: 127.0471 },
        category: "핀테크",
        employeeCount: "1000+",
        logoUrl: "https://static.toss.im/logos/png/4x/logo-toss-blue.png",
        techUsage: {
          primary: true,
          since: "2021년",
          team: "프론트엔드팀"
        }
      },
      {
        id: "2",
        name: "네이버",
        region: "경기도 성남시",
        coordinates: { lat: 37.3595, lng: 127.1052 },
        category: "테크",
        employeeCount: "5000+",
        logoUrl: "https://static.naver.net/www/mobile/edit/2016/0705/mobile_212852414260.png",
        techUsage: {
          primary: true,
          since: "2020년",
          team: "플랫폼팀"
        }
      },
      {
        id: "3",
        name: "카카오",
        region: "경기도 성남시",
        coordinates: { lat: 37.3946, lng: 127.1101 },
        category: "테크",
        employeeCount: "3000+",
        logoUrl: "https://t1.kakaocdn.net/kakaocorp/corp_thumbnail/Kakao.png",
        techUsage: {
          primary: false,
          since: "2022년",
          team: "웹플랫폼팀"
        }
      },
      {
        id: "4",
        name: "쿠팡",
        region: "서울특별시 송파구",
        coordinates: { lat: 37.5131, lng: 127.1026 },
        category: "이커머스",
        employeeCount: "2000+",
        logoUrl: "https://static.coupangcdn.com/logos/coupang-logo.png",
        techUsage: {
          primary: true,
          since: "2021년",
          team: "고객플랫폼팀"
        }
      },
      {
        id: "5",
        name: "우아한형제들",
        region: "서울특별시 송파구",
        coordinates: { lat: 37.5044, lng: 127.1042 },
        category: "푸드테크",
        employeeCount: "1500+",
        logoUrl: "https://static.woowahan.com/logos/woowahan-logo.png",
        techUsage: {
          primary: true,
          since: "2020년",
          team: "프론트엔드개발팀"
        }
      },
      {
        id: "6",
        name: "라인",
        region: "경기도 성남시",
        coordinates: { lat: 37.4021, lng: 127.1080 },
        category: "테크",
        employeeCount: "2500+",
        logoUrl: "https://static.line-scdn.net/line_logo.png",
        techUsage: {
          primary: false,
          since: "2022년",
          team: "웹서비스개발팀"
        }
      }
    ];

    setTimeout(() => {
      setCompanies(mockCompanies);
      setLoading(false);
    }, 1000);
  }, [techSlug]);

  const filteredCompanies = selectedRegion === "All" 
    ? companies 
    : companies.filter(company => {
        if (selectedRegion === "기타") {
          return !["서울특별시", "경기도", "부산광역시"].some(region => 
            company.region.includes(region)
          );
        }
        return company.region.includes(selectedRegion);
      });

  const getRegionStats = () => {
    const stats = regions.slice(1).map(region => {
      const count = companies.filter(company => {
        if (region === "기타") {
          return !["서울특별시", "경기도", "부산광역시"].some(r => 
            company.region.includes(r)
          );
        }
        return company.region.includes(region);
      }).length;
      return { region, count };
    });
    return stats.sort((a, b) => b.count - a.count);
  };

  const primaryUsers = companies.filter(c => c.techUsage.primary).length;
  const secondaryUsers = companies.length - primaryUsers;

  if (loading) {
    return (
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg animate-pulse" />
          <h3 className="text-xl font-bold text-gray-800">{techName} 사용 기업 분포</h3>
        </div>
        <div className="animate-pulse">
          <div className="h-48 bg-gray-200 rounded-xl mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
          <MapPin className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-800">{techName} 사용 기업 분포</h3>
        <span className="ml-auto text-sm text-gray-500">{companies.length}개 기업</span>
      </div>

      {/* 통계 요약 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/40 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">{companies.length}</div>
          <div className="text-sm text-gray-600">총 기업 수</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-700">{primaryUsers}</div>
          <div className="text-sm text-green-600">주력 사용</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-700">{secondaryUsers}</div>
          <div className="text-sm text-blue-600">보조 사용</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-700">{getRegionStats()[0]?.count || 0}</div>
          <div className="text-sm text-purple-600">최다 지역</div>
        </div>
      </div>

      {/* 지역 필터 */}
      <div className="flex flex-wrap gap-2 mb-6">
        {regions.map((region) => (
          <button
            key={region}
            onClick={() => setSelectedRegion(region)}
            className={`px-3 py-1 text-sm font-medium rounded-full transition-all duration-200 ${
              selectedRegion === region
                ? "bg-green-500 text-white shadow-md"
                : "bg-white/40 text-gray-600 hover:bg-white/60 hover:text-gray-800"
            }`}
          >
            {region}
            {region !== "All" && (
              <span className="ml-1 text-xs opacity-75">
                ({region === "기타" 
                  ? companies.filter(c => !["서울특별시", "경기도", "부산광역시"].some(r => c.region.includes(r))).length
                  : companies.filter(c => c.region.includes(region)).length
                })
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 한국 지도 시각화 (간단한 SVG) */}
      <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-6 mb-6">
        <div className="text-center mb-4">
          <h4 className="text-lg font-semibold text-gray-700">지역별 분포</h4>
          <p className="text-sm text-gray-500">기업 위치 기반 시각화</p>
        </div>
        
        {/* 지역별 막대 차트 */}
        <div className="space-y-3">
          {getRegionStats().map((stat, index) => (
            <div key={stat.region} className="flex items-center gap-3">
              <div className="w-20 text-sm font-medium text-gray-700">{stat.region}</div>
              <div className="flex-1 bg-gray-200 rounded-full h-3 relative overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${(stat.count / companies.length) * 100}%` }}
                />
              </div>
              <div className="w-12 text-sm font-bold text-gray-600">{stat.count}개</div>
            </div>
          ))}
        </div>
      </div>

      {/* 기업 목록 */}
      <div className="space-y-3">
        <h4 className="text-lg font-semibold text-gray-700 mb-4">
          기업 상세 정보 
          <span className="text-sm font-normal text-gray-500 ml-2">
            ({filteredCompanies.length}개 기업)
          </span>
        </h4>
        
        {filteredCompanies.map((company) => (
          <div
            key={company.id}
            className="group flex items-center gap-4 p-4 bg-white/40 hover:bg-white/60 rounded-xl border border-white/30 hover:border-white/50 transition-all duration-200"
          >
            {/* 기업 로고 */}
            <div className="w-12 h-12 flex items-center justify-center">
              {company.logoUrl ? (
                <img
                  src={company.logoUrl}
                  alt={company.name}
                  className="w-10 h-10 object-contain"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-sm font-bold text-gray-600">
                  {company.name.charAt(0)}
                </div>
              )}
            </div>

            {/* 기업 정보 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h5 className="font-semibold text-gray-800">{company.name}</h5>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                  {company.category}
                </span>
                {company.techUsage.primary && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 border border-green-200">
                    주력 사용
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {company.region}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {company.employeeCount}
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {company.techUsage.since} 도입
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                사용 팀: {company.techUsage.team}
              </div>
            </div>

            {/* 위치 아이콘 */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Building2 className="w-5 h-5 text-green-500" />
            </div>
          </div>
        ))}
      </div>

      {/* 더 보기 버튼 */}
      <div className="mt-6 text-center">
        <button className="px-4 py-2 text-sm font-medium text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors">
          전체 기업 목록 보기 →
        </button>
      </div>
    </div>
  );
}