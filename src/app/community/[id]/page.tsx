"use client";

import { useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Clock,
  Star,
  MessageCircle,
  Share2,
  BookOpen,
  Code2,
  MessageSquare,
  User,
  CheckCircle,
  AlertCircle,
  Send,
  Heart,
  Award,
  Github,
  Linkedin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

// 임시 데이터
const mockPost = {
  id: 1,
  type: "project",
  title: "Next.js 13 실시간 채팅 앱 프로젝트 팀원 모집",
  description: `App Router와 WebSocket을 활용한 실시간 채팅 애플리케이션을 함께 개발할 팀원을 찾습니다. 

**프로젝트 개요:**
- 실시간 채팅 기능 (Socket.io 사용)
- 사용자 인증 및 권한 관리
- 파일 전송 기능
- 모바일 반응형 UI

**기술 스택:**
- Frontend: Next.js 13, TypeScript, TailwindCSS
- Backend: Node.js, Express, Socket.io
- Database: PostgreSQL, Redis
- Deployment: Vercel, Railway

**모집 현황:**
현재 백엔드 개발자 1명, 디자이너 1명이 확정되었습니다. 프론트엔드 개발자 1명을 추가로 모집합니다.

**예상 기간:** 3개월 (주 15-20시간 투자)
**진행 방식:** 온라인 (매주 화요일 저녁 9시 정기 미팅)`,
  author: {
    id: 1,
    name: "김개발",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    level: "Mid-Level",
    badge: "Project Leader",
    experience: "3년차 풀스택 개발자",
    completedProjects: 12,
    rating: 4.8,
    bio: "사용자 경험을 중시하는 개발자입니다. 함께 성장할 수 있는 프로젝트를 만들어가요!",
    skills: ["React", "Node.js", "TypeScript", "PostgreSQL"],
    social: {
      github: "https://github.com/developer",
      linkedin: "https://linkedin.com/in/developer"
    }
  },
  techTags: ["nextjs", "typescript", "nodejs", "websocket", "tailwindcss", "postgresql"],
  location: "온라인",
  duration: "3개월",
  schedule: "매주 화요일 저녁 9시",
  currentMembers: 2,
  maxMembers: 4,
  likes: 24,
  comments: 8,
  views: 156,
  createdAt: "2024-01-15",
  updatedAt: "2024-01-16",
  status: "recruiting",
  requirements: [
    "React/Next.js 실무 경험 6개월 이상",
    "TypeScript 사용 가능",
    "팀 프로젝트 경험",
    "매주 정기 미팅 참석 가능"
  ],
  benefits: [
    "포트폴리오 제작 지원",
    "코드 리뷰 및 멘토링",
    "실무 경험 쌓기",
    "네트워킹 기회"
  ]
};

const mockMembers = [
  {
    id: 1,
    name: "김개발",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
    role: "팀장 (백엔드)",
    skills: ["Node.js", "PostgreSQL", "Socket.io"],
    joinedAt: "2024-01-10"
  },
  {
    id: 2,
    name: "박디자인",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b8ad?w=50&h=50&fit=crop&crop=face",
    role: "UI/UX 디자이너",
    skills: ["Figma", "React", "Design System"],
    joinedAt: "2024-01-12"
  }
];

const mockComments = [
  {
    id: 1,
    author: {
      name: "이개발자",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      level: "Junior"
    },
    content: "Next.js 13 경험은 있지만 Socket.io는 처음입니다. 함께 배우면서 참여해도 될까요?",
    createdAt: "1시간 전",
    likes: 3,
    replies: 1
  },
  {
    id: 2,
    author: {
      name: "최프론트",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
      level: "Mid-Level"
    },
    content: "프로젝트 진행 일정과 예상 작업량이 궁금합니다. 현재 다른 프로젝트도 진행 중이라서요.",
    createdAt: "3시간 전",
    likes: 2,
    replies: 0
  }
];

interface CommunityDetailProps {
  params: Promise<{ id: string }>;
}

export default function CommunityDetailPage({ params }: CommunityDetailProps) {
  const { id } = use(params);
  const [isJoining, setIsJoining] = useState(false);
  const [joinStep, setJoinStep] = useState<"info" | "application" | "success">("info");
  const [applicationData, setApplicationData] = useState({
    motivation: "",
    experience: "",
    availability: "",
    portfolio: ""
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "project": return <Code2 className="w-5 h-5" />;
      case "study": return <BookOpen className="w-5 h-5" />;
      case "mentoring": return <MessageSquare className="w-5 h-5" />;
      default: return <Users className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "project": return "bg-blue-100 text-blue-700 border-blue-200";
      case "study": return "bg-green-100 text-green-700 border-green-200";
      case "mentoring": return "bg-purple-100 text-purple-700 border-purple-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "project": return "프로젝트";
      case "study": return "스터디";
      case "mentoring": return "멘토링";
      default: return type;
    }
  };

  const handleJoinApplication = () => {
    setIsJoining(true);
    setJoinStep("application");
  };

  const handleSubmitApplication = async () => {
    // 실제로는 API 호출
    await new Promise(resolve => setTimeout(resolve, 1000));
    setJoinStep("success");
  };

  if (joinStep === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">참여 신청 완료!</h2>
          <p className="text-gray-600 mb-6">
            팀장이 검토 후 24시간 내에 연락드릴 예정입니다.
          </p>
          <div className="space-y-3">
            <Link href="/community">
              <Button className="w-full">커뮤니티 돌아가기</Button>
            </Link>
            <Link href="/profile">
              <Button variant="outline" className="w-full">내 프로필 확인</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (joinStep === "application") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <button 
              onClick={() => setJoinStep("info")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              뒤로 가기
            </button>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">프로젝트 참여 신청</h1>
              <p className="text-gray-600">{mockPost.title}</p>
            </div>

            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  참여 동기 *
                </label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="이 프로젝트에 참여하고 싶은 이유를 알려주세요..."
                  value={applicationData.motivation}
                  onChange={(e) => setApplicationData({...applicationData, motivation: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  관련 경험 및 기술 스택 *
                </label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="관련 기술 경험이나 유사한 프로젝트 경험을 알려주세요..."
                  value={applicationData.experience}
                  onChange={(e) => setApplicationData({...applicationData, experience: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  참여 가능 시간 *
                </label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="주당 투자 가능한 시간과 정기 미팅 참석 가능 여부를 알려주세요..."
                  value={applicationData.availability}
                  onChange={(e) => setApplicationData({...applicationData, availability: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  포트폴리오/GitHub 링크
                </label>
                <input
                  type="url"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://github.com/username 또는 포트폴리오 URL"
                  value={applicationData.portfolio}
                  onChange={(e) => setApplicationData({...applicationData, portfolio: e.target.value})}
                />
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">신청 전 확인사항</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• 프로젝트 기간 동안 꾸준히 참여할 수 있나요?</li>
                      <li>• 팀 미팅에 정기적으로 참석 가능한가요?</li>
                      <li>• 협업과 소통을 중시하는 팀 문화에 동의하시나요?</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => setJoinStep("info")}
                  className="flex-1"
                >
                  취소
                </Button>
                <Button 
                  type="button"
                  onClick={handleSubmitApplication}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  신청하기
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            href="/community"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            커뮤니티로 돌아가기
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Post Header */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-8">
              <div className="flex items-start gap-4 mb-6">
                <Image
                  src={mockPost.author.avatar}
                  alt={mockPost.author.name}
                  width={56}
                  height={56}
                  className="rounded-full ring-2 ring-white shadow-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `<div class="w-14 h-14 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg ring-2 ring-white">${mockPost.author.name.charAt(0)}</div>`;
                    }
                  }}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge className={getTypeColor(mockPost.type)}>
                      <span className="mr-1">{getTypeIcon(mockPost.type)}</span>
                      {getTypeLabel(mockPost.type)}
                    </Badge>
                    <Badge className={mockPost.status === "recruiting" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}>
                      {mockPost.status === "recruiting" ? "모집중" : "진행중"}
                    </Badge>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{mockPost.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{mockPost.author.name}</span>
                    <span>•</span>
                    <span>{mockPost.createdAt}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {mockPost.views}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                <div className="text-center">
                  <MapPin className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                  <div className="text-sm font-medium text-gray-900">{mockPost.location}</div>
                  <div className="text-xs text-gray-500">장소</div>
                </div>
                <div className="text-center">
                  <Calendar className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                  <div className="text-sm font-medium text-gray-900">{mockPost.duration}</div>
                  <div className="text-xs text-gray-500">기간</div>
                </div>
                <div className="text-center">
                  <Users className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                  <div className="text-sm font-medium text-gray-900">{mockPost.currentMembers}/{mockPost.maxMembers}명</div>
                  <div className="text-xs text-gray-500">인원</div>
                </div>
                <div className="text-center">
                  <Clock className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                  <div className="text-sm font-medium text-gray-900">화 21:00</div>
                  <div className="text-xs text-gray-500">정기미팅</div>
                </div>
              </div>

              {/* Tech Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {mockPost.techTags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors">
                    <Heart className="w-5 h-5" />
                    <span>{mockPost.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span>{mockPost.comments}</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-500 hover:text-green-500 transition-colors">
                    <Share2 className="w-5 h-5" />
                    <span>공유</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Content Tabs */}
            <Tabs defaultValue="description" className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg">
              <TabsList className="w-full">
                <TabsTrigger value="description" className="flex-1">상세 설명</TabsTrigger>
                <TabsTrigger value="comments" className="flex-1">댓글 ({mockPost.comments})</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="p-6">
                <div className="prose prose-gray max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {mockPost.description}
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6 mt-8">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        지원 요구사항
                      </h4>
                      <ul className="space-y-2">
                        {mockPost.requirements.map((req, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        참여 혜택
                      </h4>
                      <ul className="space-y-2">
                        {mockPost.benefits.map((benefit, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>


              <TabsContent value="comments" className="p-6">
                <div className="space-y-6">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      U
                    </div>
                    <div className="flex-1">
                      <textarea
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows={3}
                        placeholder="댓글을 작성해보세요..."
                      />
                      <div className="flex justify-end mt-2">
                        <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600">
                          <Send className="w-4 h-4 mr-1" />
                          댓글 작성
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    {mockComments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <Image
                          src={comment.author.avatar}
                          alt={comment.author.name}
                          width={32}
                          height={32}
                          className="rounded-full"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `<div class="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">${comment.author.name.charAt(0)}</div>`;
                            }
                          }}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">{comment.author.name}</span>
                            <Badge variant="secondary" className="text-xs">{comment.author.level}</Badge>
                            <span className="text-xs text-gray-500">{comment.createdAt}</span>
                          </div>
                          <p className="text-gray-700 mb-2">{comment.content}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <button className="hover:text-red-500 transition-colors">
                              좋아요 {comment.likes}
                            </button>
                            <button className="hover:text-blue-500 transition-colors">
                              답글 {comment.replies}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Join Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">프로젝트 참여하기</h3>
                <div className="text-sm text-gray-600 mb-4">
                  {mockPost.maxMembers - mockPost.currentMembers}자리 남음
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(mockPost.currentMembers / mockPost.maxMembers) * 100}%` }}
                  />
                </div>
              </div>
              
              <Button 
                onClick={handleJoinApplication}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 mb-4"
                disabled={mockPost.currentMembers >= mockPost.maxMembers}
              >
                {mockPost.currentMembers >= mockPost.maxMembers ? "모집 마감" : "참여 신청하기"}
              </Button>
              
              <div className="text-xs text-gray-500 text-center">
                신청 후 팀장 승인을 받으시면 참여 가능합니다
              </div>
            </div>

            {/* Author Info */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src={mockPost.author.avatar}
                  alt={mockPost.author.name}
                  width={48}
                  height={48}
                  className="rounded-full ring-2 ring-white shadow"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `<div class="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow ring-2 ring-white">${mockPost.author.name.charAt(0)}</div>`;
                    }
                  }}
                />
                <div>
                  <h4 className="font-medium text-gray-900">{mockPost.author.name}</h4>
                  <p className="text-sm text-gray-600">{mockPost.author.level}</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">평점</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{mockPost.author.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">완료 프로젝트</span>
                  <span className="font-medium">{mockPost.author.completedProjects}개</span>
                </div>
              </div>

              <p className="text-sm text-gray-700 mb-4">{mockPost.author.bio}</p>

              <div className="flex flex-wrap gap-1 mb-4">
                {mockPost.author.skills.map((skill, index) => (
                  <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <a 
                  href={mockPost.author.social.github}
                  className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <Github className="w-4 h-4 text-gray-600" />
                </a>
                <a 
                  href={mockPost.author.social.linkedin}
                  className="flex items-center justify-center w-10 h-10 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                >
                  <Linkedin className="w-4 h-4 text-blue-600" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}