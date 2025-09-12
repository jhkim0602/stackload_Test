"use client";

import { useState, useEffect } from "react";
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
  Eye,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface Post {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  location: string;
  duration: string;
  currentMembers: number;
  maxMembers: number;
  requirements: string[];
  benefits: string[];
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  applicationsCount: number;
  author: {
    id: string;
    name: string;
    avatarUrl: string | null;
    image: string | null;
    level: string;
  };
  tags: {
    id: string;
    name: string;
    slug: string;
    color: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

const getCategoriesWithCounts = (posts: Post[]) => [
  { id: "all", name: "전체", icon: Users, count: posts.length },
  { id: "project", name: "프로젝트", icon: Code2, count: posts.filter(p => p.type === "project").length },
  { id: "study", name: "스터디", icon: BookOpen, count: posts.filter(p => p.type === "study").length },
  { id: "mentoring", name: "멘토링", icon: MessageSquare, count: posts.filter(p => p.type === "mentoring").length }
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
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("latest");

  useEffect(() => {
    setCurrentPage(1); // 카테고리 변경 시 첫 페이지로 리셋
    fetchPosts();
  }, [activeCategory]);

  useEffect(() => {
    setCurrentPage(1); // 검색어 변경 시 첫 페이지로 리셋
    const timer = setTimeout(() => {
      fetchPosts();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchPosts();
  }, [currentPage, sortBy]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (activeCategory !== "all") params.append("type", activeCategory);
      if (searchQuery) params.append("search", searchQuery);
      params.append("page", currentPage.toString());
      params.append("limit", "10");
      params.append("sortBy", sortBy);
      
      const response = await fetch(`/api/posts?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      
      const result = await response.json();
      setPosts(result.data || []);
      if (result.pagination) {
        setTotalPages(result.pagination.totalPages);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
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

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return '방금 전';
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}일 전`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">커뮤니티 글을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">오류가 발생했습니다: {error}</p>
          <Button onClick={fetchPosts}>다시 시도</Button>
        </div>
      </div>
    );
  }

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

          {/* Sort Options */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">정렬:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="latest">최신순</option>
                <option value="popular">인기순 (좋아요)</option>
                <option value="deadline">마감임박순</option>
              </select>
            </div>
            
            <div className="text-sm text-gray-500">
              {totalPages > 0 && (
                <span>
                  페이지 {currentPage} / {totalPages}
                </span>
              )}
            </div>
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
                {getCategoriesWithCounts(posts).map((category) => {
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
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">아직 등록된 글이 없습니다.</p>
                <Link href="/community/create">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    첫 번째 글 작성하기
                  </Button>
                </Link>
              </div>
            ) : (
              posts.map((post, index) => (
              <div
                key={post.id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 p-6 group animate-in fade-in-50 slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  {/* Author Avatar */}
                  <div className="flex-shrink-0">
                    {post.author.avatarUrl || post.author.image ? (
                      <Image
                        src={post.author.avatarUrl || post.author.image || ''}
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
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                        {post.author.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className={getTypeColor(post.type)}>
                        {getTypeLabel(post.type)}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {post.author.name} • {post.author.level} • {formatTimeAgo(post.createdAt)}
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
                      {post.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="px-2 py-1 text-xs bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-700 rounded-md transition-colors cursor-pointer"
                          style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
                        >
                          #{tag.name.toLowerCase()}
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
                            : post.status === "inProgress"
                            ? "bg-blue-100 text-blue-700"
                            : post.status === "completed"
                            ? "bg-gray-100 text-gray-700"
                            : post.status === "closed"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }
                      >
                        {post.status === "recruiting" ? "모집중" 
                          : post.status === "inProgress" ? "진행중"
                          : post.status === "completed" ? "완료"
                          : post.status === "closed" ? "마감"
                          : post.status}
                      </Badge>
                    </div>

                    {/* Action Row */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors group">
                          <Heart className="w-4 h-4 group-hover:fill-current" />
                          <span className="text-sm">{post.likesCount}</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-sm">{post.commentsCount}</span>
                        </button>
                        <div className="flex items-center gap-2 text-gray-400">
                          <Eye className="w-4 h-4" />
                          <span className="text-sm">{post.viewsCount}</span>
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
              ))
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="bg-white/80 backdrop-blur-sm border-white/20 hover:bg-white/90"
                >
                  <ChevronLeft className="w-4 h-4" />
                  이전
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = currentPage <= 3 
                      ? i + 1 
                      : currentPage >= totalPages - 2 
                      ? totalPages - 4 + i 
                      : currentPage - 2 + i;
                    
                    if (pageNum < 1 || pageNum > totalPages) return null;
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className={
                          currentPage === pageNum
                            ? "bg-blue-600 text-white"
                            : "bg-white/80 backdrop-blur-sm border-white/20 hover:bg-white/90"
                        }
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="bg-white/80 backdrop-blur-sm border-white/20 hover:bg-white/90"
                >
                  다음
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}