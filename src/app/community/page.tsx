"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Users, 
  Code2, 
  BookOpen, 
  MessageSquare, 
  TrendingUp,
  Filter,
  Search,
  Plus,
  User,
  Calendar,
  MapPin,
  Tag,
  Heart,
  MessageCircle,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

// 임시 데이터
const mockPosts = [
  {
    id: 1,
    type: "project",
    title: "Next.js 13 실시간 채팅 앱 프로젝트 팀원 모집",
    description: "App Router와 WebSocket을 활용한 실시간 채팅 애플리케이션을 함께 개발할 팀원을 찾습니다. 백엔드는 Node.js + Express로 구현 예정입니다.",
    author: {
      name: "김개발",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
      level: "Mid-Level"
    },
    techTags: ["nextjs", "typescript", "nodejs", "websocket", "tailwindcss"],
    location: "온라인",
    duration: "3개월",
    currentMembers: 2,
    maxMembers: 4,
    likes: 24,
    comments: 8,
    views: 156,
    createdAt: "2시간 전",
    status: "recruiting"
  },
  {
    id: 2,
    type: "study",
    title: "React 심화 스터디 - 성능 최적화 중심",
    description: "React의 렌더링 최적화, 메모이제이션, 코드 스플리팅 등을 깊이 있게 공부할 스터디원을 모집합니다.",
    author: {
      name: "박스터디",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b8ad?w=32&h=32&fit=crop&crop=face",
      level: "Senior"
    },
    techTags: ["react", "javascript", "performance"],
    location: "서울 강남",
    duration: "2개월",
    currentMembers: 3,
    maxMembers: 6,
    likes: 31,
    comments: 12,
    views: 234,
    createdAt: "4시간 전",
    status: "recruiting"
  },
  {
    id: 3,
    type: "mentoring",
    title: "신입 개발자를 위한 포트폴리오 멘토링",
    description: "3년차 풀스택 개발자가 신입 개발자들의 포트폴리오 제작과 취업 준비를 도와드립니다.",
    author: {
      name: "이멘토",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
      level: "Senior"
    },
    techTags: ["react", "nodejs", "career"],
    location: "온라인",
    duration: "1개월",
    currentMembers: 1,
    maxMembers: 3,
    likes: 18,
    comments: 5,
    views: 89,
    createdAt: "6시간 전",
    status: "open"
  },
  {
    id: 4,
    type: "project",
    title: "AI 이미지 생성 서비스 사이드 프로젝트",
    description: "OpenAI API를 활용한 이미지 생성 서비스를 만들어볼 프론트엔드/백엔드 개발자를 찾습니다.",
    author: {
      name: "최혁신",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face",
      level: "Mid-Level"
    },
    techTags: ["python", "fastapi", "react", "ai", "openai"],
    location: "온라인",
    duration: "4개월",
    currentMembers: 1,
    maxMembers: 3,
    likes: 42,
    comments: 15,
    views: 312,
    createdAt: "1일 전",
    status: "recruiting"
  }
];

const categories = [
  { id: "all", name: "전체", icon: Users, count: 45 },
  { id: "project", name: "프로젝트", icon: Code2, count: 18 },
  { id: "study", name: "스터디", icon: BookOpen, count: 22 },
  { id: "mentoring", name: "멘토링", icon: MessageSquare, count: 5 }
];

const trendingTags = [
  { name: "react", count: 28 },
  { name: "nextjs", count: 15 },
  { name: "typescript", count: 24 },
  { name: "nodejs", count: 19 },
  { name: "python", count: 12 },
  { name: "ai", count: 8 }
];

export default function CommunityPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredPosts = mockPosts.filter(post => 
    activeCategory === "all" || post.type === activeCategory
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                개발자 커뮤니티 🚀
              </h1>
              <p className="text-gray-600">
                함께 성장할 동료들과 프로젝트, 스터디, 멘토링을 시작해보세요
              </p>
            </div>
            <Link href="/community/create">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                글 작성하기
              </Button>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="프로젝트, 스터디, 기술 스택으로 검색해보세요..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl border-0 bg-white/80 backdrop-blur-sm shadow-lg focus:shadow-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Categories */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                카테고리
              </h3>
              <div className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
                        activeCategory === category.id
                          ? "bg-blue-100 text-blue-700 shadow-md"
                          : "hover:bg-gray-100 text-gray-600"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <Badge variant="secondary" className="bg-gray-100">
                        {category.count}
                      </Badge>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Trending Tags */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                인기 태그
              </h3>
              <div className="flex flex-wrap gap-2">
                {trendingTags.map((tag) => (
                  <button
                    key={tag.name}
                    className="px-3 py-2 text-sm bg-gradient-to-r from-gray-100 to-gray-200 hover:from-blue-100 hover:to-purple-100 text-gray-700 hover:text-gray-900 rounded-lg border transition-all duration-200 hover:shadow-md"
                  >
                    #{tag.name}
                    <span className="ml-1 text-xs text-gray-500">{tag.count}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {filteredPosts.map((post, index) => (
              <div
                key={post.id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 p-6 group animate-in fade-in-50 slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  {/* Author Avatar */}
                  <div className="flex-shrink-0">
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      width={48}
                      height={48}
                      className="rounded-full ring-2 ring-white shadow-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `<div class="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">${post.author.name.charAt(0)}</div>`;
                        }
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className={getTypeColor(post.type)}>
                        {getTypeLabel(post.type)}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {post.author.name} • {post.author.level} • {post.createdAt}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {post.description}
                    </p>

                    {/* Tech Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.techTags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-700 rounded-md transition-colors cursor-pointer"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Info Row */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{post.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{post.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{post.currentMembers}/{post.maxMembers}명</span>
                        </div>
                      </div>
                      
                      <Badge 
                        className={
                          post.status === "recruiting" 
                            ? "bg-green-100 text-green-700" 
                            : "bg-blue-100 text-blue-700"
                        }
                      >
                        {post.status === "recruiting" ? "모집중" : "진행중"}
                      </Badge>
                    </div>

                    {/* Action Row */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors group">
                          <Heart className="w-4 h-4 group-hover:fill-current" />
                          <span className="text-sm">{post.likes}</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-sm">{post.comments}</span>
                        </button>
                        <div className="flex items-center gap-2 text-gray-400">
                          <Eye className="w-4 h-4" />
                          <span className="text-sm">{post.views}</span>
                        </div>
                      </div>

                      <Link href={`/community/${post.id}`}>
                        <Button 
                          size="sm" 
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                          참여하기
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Load More */}
            <div className="text-center pt-8">
              <Button 
                variant="outline" 
                className="bg-white/80 backdrop-blur-sm border-white/20 hover:bg-white/90"
              >
                더 많은 글 보기
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}