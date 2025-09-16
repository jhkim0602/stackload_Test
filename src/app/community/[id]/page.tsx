"use client";

import { useState, use, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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
  Info,
  User,
  CheckCircle,
  AlertCircle,
  Send,
  Heart,
  Award,
  Github,
  Linkedin,
  Loader2,
  Eye,
  Edit,
  Trash2,
  MoreVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CommentSection from "@/components/community/CommentSection";

// 데이터베이스에서 가져올 Post 타입 정의
interface Post {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  author: {
    id: string;
    name: string;
    avatarUrl: string | null;
    image: string | null;
    level: string;
    bio: string | null;
    location: string | null;
  };
  tags: {
    id: string;
    name: string;
    slug: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

// 데이터 로딩 상태 관리

interface CommunityDetailProps {
  params: Promise<{ id: string }>;
}

export default function CommunityDetailPage({ params }: CommunityDetailProps) {
  const { id } = use(params);
  const { data: session } = useSession();
  
  // 게시물 데이터 상태
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 기능 상태
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  // 게시물 데이터 가져오기
  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/posts/${id}`);
      
      if (!response.ok) {
        throw new Error('게시물을 찾을 수 없습니다.');
      }
      
      const result = await response.json();
      if (result.success) {
        setPost(result.data);
        setLikesCount(result.data.likesCount);
      } else {
        throw new Error(result.message || '게시물을 불러올 수 없습니다.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      toast.error('게시물을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "project": return <Code2 className="w-5 h-5" />;
      case "study": return <BookOpen className="w-5 h-5" />;
      case "mentoring": return <Info className="w-5 h-5" />;
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
      case "mentoring": return "정보공유";
      default: return type;
    }
  };


  // 좋아요 상태 확인
  const checkLikeStatus = async () => {
    try {
      const response = await fetch(`/api/posts/${id}/like`);
      const data = await response.json();
      if (data.success) {
        setIsLiked(data.data.isLiked);
      }
    } catch (error) {
      console.error('좋아요 상태 확인 오류:', error);
    }
  };

  // 좋아요 토글
  const handleToggleLike = async () => {
    if (isLikeLoading) return;
    
    setIsLikeLoading(true);
    try {
      const response = await fetch(`/api/posts/${id}/like`, {
        method: 'POST',
      });
      const data = await response.json();
      
      if (data.success) {
        setIsLiked(data.data.isLiked);
        setLikesCount(data.data.likesCount);
        toast.success(data.data.message);
      } else {
        toast.error('좋아요 처리에 실패했습니다.');
      }
    } catch (error) {
      console.error('좋아요 토글 오류:', error);
      toast.error('좋아요 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLikeLoading(false);
    }
  };


  // 게시글 작성자 권한 확인
  const isPostAuthor = (): boolean => {
    if (!session?.user?.id || !post) return false;
    return post.author.id === session.user.id;
  };

  // 게시글 삭제
  const handleDeletePost = async () => {
    if (!post || !isPostAuthor()) {
      toast.error('삭제 권한이 없습니다.');
      return;
    }

    if (!confirm('정말로 이 게시글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return;
    }

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '게시글 삭제에 실패했습니다.');
      }

      toast.success('게시글이 삭제되었습니다.');
      // 커뮤니티 목록으로 이동
      window.location.href = '/community';
    } catch (error) {
      console.error('게시글 삭제 오류:', error);
      toast.error('게시글 삭제 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    fetchPost();
    checkLikeStatus();
  }, [id]);

  // 로딩 상태
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">게시물을 불러오는 중...</span>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-8">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">게시물을 찾을 수 없습니다</h2>
          <p className="text-gray-600 mb-6">{error || '요청하신 게시물이 존재하지 않습니다.'}</p>
          <Link href="/community">
            <Button className="w-full">커뮤니티로 돌아가기</Button>
          </Link>
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Post Header */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6">
              <div className="flex items-start gap-4 mb-6">
                {post.author.avatarUrl || post.author.image ? (
                  <Image
                    src={post.author.avatarUrl || post.author.image || ''}
                    alt={post.author.name}
                    width={56}
                    height={56}
                    className="rounded-full ring-2 ring-white shadow-lg"
                  />
                ) : (
                  <div className="w-14 h-14 bg-gray-200 rounded-full ring-2 ring-white shadow-lg flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-500" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge className={getTypeColor(post.type)}>
                      <span className="mr-1">{getTypeIcon(post.type)}</span>
                      {getTypeLabel(post.type)}
                    </Badge>
                    <Badge className={post.status === "recruiting" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}>
                      {post.status === "recruiting" ? "모집중" : "진행중"}
                    </Badge>
                  </div>
                  <div className="flex items-start justify-between mb-2">
                    <h1 className="text-xl font-bold text-gray-900 flex-1 leading-tight">{post.title}</h1>
                    {isPostAuthor() && (
                      <div className="flex items-center gap-2 ml-4">
                        <Link href={`/community/edit/${post.id}`}>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4 mr-1" />
                            수정
                          </Button>
                        </Link>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={handleDeletePost}
                          className="text-red-600 hover:text-red-700 hover:border-red-300"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          삭제
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{post.author.name}</span>
                    <span>•</span>
                    <span>{new Date(post.createdAt).toLocaleDateString('ko-KR')}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {post.viewsCount}
                    </span>
                  </div>
                </div>
              </div>


              {/* Tech Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full transition-colors cursor-pointer"
                    >
                      #{tag.slug}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={handleToggleLike}
                    disabled={isLikeLoading}
                    className={`flex items-center gap-2 transition-colors ${
                      isLiked 
                        ? 'text-red-500 hover:text-red-600' 
                        : 'text-gray-500 hover:text-red-500'
                    } ${isLikeLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                    <span>{likesCount}</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span>{post.commentsCount}</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-500 hover:text-green-500 transition-colors">
                    <Share2 className="w-5 h-5" />
                    <span>공유</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">상세 설명</h2>
              <div className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-white">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    // 커스텀 컴포넌트 스타일링
                    h1: ({children}) => <h1 className="text-2xl font-bold text-gray-900 mb-4 mt-6">{children}</h1>,
                    h2: ({children}) => <h2 className="text-xl font-bold text-gray-900 mb-3 mt-5">{children}</h2>,
                    h3: ({children}) => <h3 className="text-lg font-semibold text-gray-900 mb-2 mt-4">{children}</h3>,
                    p: ({children}) => <p className="text-gray-700 leading-relaxed mb-4">{children}</p>,
                    code: ({children, className}) => {
                      if (className?.includes('language-')) {
                        return <code className="block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">{children}</code>
                      }
                      return <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>
                    },
                    ul: ({children}) => <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>,
                    ol: ({children}) => <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>,
                    li: ({children}) => <li className="text-gray-700">{children}</li>,
                    blockquote: ({children}) => <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 bg-blue-50 py-2 my-4">{children}</blockquote>,
                    a: ({children, href}) => <a href={href} className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">{children}</a>,
                  }}
                >
                  {post.description}
                </ReactMarkdown>
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                댓글 ({post.commentsCount})
              </h2>
              <CommentSection postId={id} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            
            {/* Post Stats Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-4">
              <h3 className="text-base font-semibold text-gray-900 mb-3">게시물 정보</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">좋아요</span>
                  </div>
                  <span className="font-medium">{likesCount}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm">댓글</span>
                  </div>
                  <span className="font-medium">{post.commentsCount}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">조회수</span>
                  </div>
                  <span className="font-medium">{post.viewsCount}</span>
                </div>
                
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">작성일</span>
                  </div>
                  <div className="text-sm text-gray-900 mt-1">
                    {new Date(post.createdAt).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Author Info */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                {post.author.avatarUrl || post.author.image ? (
                  <Image
                    src={post.author.avatarUrl || post.author.image || ''}
                    alt={post.author.name}
                    width={48}
                    height={48}
                    className="rounded-full ring-2 ring-white shadow"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded-full ring-2 ring-white shadow flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-500" />
                  </div>
                )}
                <div>
                  <h4 className="font-medium text-gray-900">{post.author.name}</h4>
                  <p className="text-sm text-gray-600">{post.author.level}</p>
                </div>
              </div>
              
              {post.author.bio && (
                <p className="text-sm text-gray-700 mb-3">{post.author.bio}</p>
              )}

              {post.author.location && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{post.author.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}