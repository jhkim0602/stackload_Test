"use client";

import { useState, useEffect } from "react";
import { Users, ArrowRight, MessageSquare, Code2, BookOpen, TrendingUp, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// 임시 커뮤니티 데이터
const mockCommunityPosts = [
  {
    id: 1,
    type: "project",
    title: "Next.js 실시간 채팅앱 팀원 모집",
    description: "Socket.io를 활용한 실시간 채팅 애플리케이션 개발",
    author: {
      name: "김개발",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
    },
    techTags: ["nextjs", "socket.io", "typescript"],
    likes: 24,
    comments: 8,
    members: "2/4",
    timeAgo: "2시간 전",
    isHot: true
  },
  {
    id: 2,
    type: "study",
    title: "알고리즘 문제 해결 스터디",
    description: "매주 화요일 저녁 온라인으로 진행하는 코딩테스트 스터디",
    author: {
      name: "박알고",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b8ad?w=32&h=32&fit=crop&crop=face"
    },
    techTags: ["algorithm", "python", "java"],
    likes: 31,
    comments: 12,
    members: "4/6",
    timeAgo: "4시간 전",
    isHot: false
  },
  {
    id: 3,
    type: "mentoring",
    title: "신입 개발자 포트폴리오 멘토링",
    description: "3년차 개발자가 신입들의 포트폴리오와 이력서를 도와드려요",
    author: {
      name: "이멘토",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face"
    },
    techTags: ["career", "portfolio"],
    likes: 18,
    comments: 5,
    members: "1/3",
    timeAgo: "6시간 전",
    isHot: false
  }
];

const communityStats = {
  totalMembers: 1247,
  activeProjects: 23,
  ongoingStudies: 15,
  totalMentors: 38
};

interface CommunityPreviewProps {
  className?: string;
}

export function CommunityPreview({ className = "" }: CommunityPreviewProps) {
  const [posts, setPosts] = useState(mockCommunityPosts);
  const [loading, setLoading] = useState(false);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "project": return <Code2 className="w-4 h-4" />;
      case "study": return <BookOpen className="w-4 h-4" />;
      case "mentoring": return <MessageSquare className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
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

  return (
    <div className={`bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-8 hover:shadow-xl transition-all duration-300 ${className}`}>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">활발한 커뮤니티 🔥</h3>
            <p className="text-sm text-gray-600 mt-1">함께 성장하는 개발자들의 공간</p>
          </div>
        </div>
        <Link 
          href="/community"
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          커뮤니티 참여
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30">
          <div className="text-2xl font-bold text-purple-600 mb-1">{communityStats.totalMembers.toLocaleString()}</div>
          <div className="text-xs text-gray-600">총 회원수</div>
        </div>
        <div className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30">
          <div className="text-2xl font-bold text-blue-600 mb-1">{communityStats.activeProjects}</div>
          <div className="text-xs text-gray-600">진행 중인 프로젝트</div>
        </div>
        <div className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30">
          <div className="text-2xl font-bold text-green-600 mb-1">{communityStats.ongoingStudies}</div>
          <div className="text-xs text-gray-600">활성 스터디</div>
        </div>
        <div className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30">
          <div className="text-2xl font-bold text-pink-600 mb-1">{communityStats.totalMentors}</div>
          <div className="text-xs text-gray-600">멘토 수</div>
        </div>
      </div>

      {/* Hot Posts */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-orange-500" />
          <span className="font-semibold text-gray-800">인기 글</span>
        </div>

        {posts.map((post, index) => (
          <div
            key={post.id}
            className={`group p-5 bg-white/40 hover:bg-white/70 rounded-xl border border-white/30 hover:border-white/50 transition-all duration-200 hover:shadow-md transform hover:-translate-y-1 animate-in fade-in-50 slide-in-from-left-4`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start gap-4">
              {/* Author Avatar */}
              <div className="flex-shrink-0">
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={36}
                  height={36}
                  className="rounded-full ring-2 ring-white shadow-md"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `<div class="w-9 h-9 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md ring-2 ring-white">${post.author.name.charAt(0)}</div>`;
                    }
                  }}
                />
              </div>

              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={`${getTypeColor(post.type)} text-xs`}>
                    <span className="mr-1">{getTypeIcon(post.type)}</span>
                    {getTypeLabel(post.type)}
                  </Badge>
                  {post.isHot && (
                    <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-xs">
                      🔥 HOT
                    </Badge>
                  )}
                  <span className="text-xs text-gray-500">{post.timeAgo}</span>
                </div>

                {/* Content */}
                <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
                  {post.title}
                </h4>
                <p className="text-sm text-gray-600 mb-3 line-clamp-1">
                  {post.description}
                </p>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {post.techTags.slice(0, 3).map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 text-xs bg-gray-100 hover:bg-purple-100 text-gray-600 hover:text-purple-700 rounded-md transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                  {post.techTags.length > 3 && (
                    <span className="px-2 py-1 text-xs text-gray-400">
                      +{post.techTags.length - 3}
                    </span>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      {post.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {post.comments}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {post.members}
                    </span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-purple-600 hover:text-purple-700 hover:bg-purple-50 text-xs px-3 py-1"
                  >
                    참여하기
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="mt-8 text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
        <h4 className="font-semibold text-gray-800 mb-2">
          아직 커뮤니티에 참여하지 않으셨나요?
        </h4>
        <p className="text-sm text-gray-600 mb-4">
          동료들과 함께 프로젝트를 만들고, 스터디를 진행하며 성장해보세요!
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/community">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              커뮤니티 둘러보기
            </Button>
          </Link>
          <Link href="/profile">
            <Button variant="outline">
              프로필 만들기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}