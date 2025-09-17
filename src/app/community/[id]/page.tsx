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
    socialLinks: any;
    postsCount: number;
    likesReceivedCount: number;
    commentsCount: number;
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
  const [isSharing, setIsSharing] = useState(false);

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

  // 공유 기능
  const handleShare = async () => {
    if (isSharing) return;
    
    setIsSharing(true);
    const shareData = {
      title: post?.title || '',
      text: post?.description ? post.description.substring(0, 100) + '...' : '',
      url: window.location.href,
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast.success('공유되었습니다!');
      } else {
        // Fallback: 클립보드에 복사
        await navigator.clipboard.writeText(window.location.href);
        toast.success('링크가 클립보드에 복사되었습니다!');
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('공유 오류:', error);
        // Fallback: 클립보드에 복사
        try {
          await navigator.clipboard.writeText(window.location.href);
          toast.success('링크가 클립보드에 복사되었습니다!');
        } catch (clipboardError) {
          console.error('클립보드 복사 오류:', clipboardError);
          toast.error('공유 중 오류가 발생했습니다.');
        }
      }
    } finally {
      setIsSharing(false);
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
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        
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
          <div className="lg:col-span-2 space-y-8">
            
            {/* Post Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-start gap-6 mb-8">
                <Link href={`/profile/${post.author.id}`} className="flex-shrink-0">
                  {post.author.avatarUrl || post.author.image ? (
                    <Image
                      src={post.author.avatarUrl || post.author.image || ''}
                      alt={post.author.name}
                      width={64}
                      height={64}
                      className="rounded-full ring-4 ring-white shadow-lg hover:ring-blue-100 transition-all duration-200"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full ring-4 ring-white shadow-lg flex items-center justify-center hover:ring-blue-100 transition-all duration-200">
                      <span className="text-white font-bold text-xl">{post.author.name.charAt(0)}</span>
                    </div>
                  )}
                </Link>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge className={getTypeColor(post.type)}>
                      <span className="mr-1">{getTypeIcon(post.type)}</span>
                      {getTypeLabel(post.type)}
                    </Badge>
                    <Badge className={post.status === "recruiting" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}>
                      {post.status === "recruiting" ? "모집중" : "진행중"}
                    </Badge>
                  </div>
                  <div className="flex items-start justify-between mb-4">
                    <h1 className="text-2xl font-bold text-gray-900 flex-1 leading-tight">{post.title}</h1>
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
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <Link href={`/profile/${post.author.id}`} className="hover:text-blue-600 transition-colors font-medium">
                      {post.author.name}
                    </Link>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(post.createdAt).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{post.viewsCount.toLocaleString()}회</span>
                    </div>
                  </div>
                </div>
              </div>


              {/* Tech Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-8">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag.id}
                      href={`/tech/${tag.slug}`}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg border border-blue-200 transition-all duration-200 hover:shadow-sm"
                    >
                      <span className="mr-1">#</span>
                      {tag.name}
                    </Link>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                <div className="flex items-center gap-6">
                  <button 
                    onClick={handleToggleLike}
                    disabled={isLikeLoading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      isLiked 
                        ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                        : 'text-gray-600 hover:bg-red-50 hover:text-red-600'
                    } ${isLikeLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                    <span className="font-medium">{likesCount.toLocaleString()}</span>
                  </button>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MessageCircle className="w-5 h-5" />
                    <span className="font-medium">{post.commentsCount.toLocaleString()}</span>
                  </div>
                  <button 
                    onClick={handleShare}
                    disabled={isSharing}
                    className={`flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-green-50 hover:text-green-600 rounded-lg transition-all duration-200 ${isSharing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Share2 className="w-5 h-5" />
                    <span className="font-medium">{isSharing ? '공유 중...' : '공유'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">상세 내용</h2>
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <MessageCircle className="w-6 h-6" />
                댓글 ({post.commentsCount.toLocaleString()})
              </h2>
              <CommentSection postId={id} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Author Profile Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="text-center">
                <Link href={`/profile/${post.author.id}`} className="inline-block">
                  {post.author.avatarUrl || post.author.image ? (
                    <Image
                      src={post.author.avatarUrl || post.author.image || ''}
                      alt={post.author.name}
                      width={80}
                      height={80}
                      className="rounded-full mx-auto ring-4 ring-white shadow-lg hover:ring-blue-100 transition-all duration-200"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto ring-4 ring-white shadow-lg flex items-center justify-center hover:ring-blue-100 transition-all duration-200">
                      <span className="text-white font-bold text-2xl">{post.author.name.charAt(0)}</span>
                    </div>
                  )}
                </Link>
                
                <div className="mt-4">
                  <Link href={`/profile/${post.author.id}`} className="block">
                    <h3 className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors">{post.author.name}</h3>
                  </Link>
                  <p className="text-sm text-gray-600 mt-1">{post.author.level}</p>
                  
                  {post.author.bio && (
                    <p className="text-sm text-gray-700 mt-3 leading-relaxed">{post.author.bio}</p>
                  )}
                  
                  {post.author.location && (
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mt-3">
                      <MapPin className="w-4 h-4" />
                      <span>{post.author.location}</span>
                    </div>
                  )}
                </div>
                
                {/* Author Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{post.author.postsCount || 0}</div>
                    <div className="text-xs text-gray-600">게시글</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{post.author.likesReceivedCount || 0}</div>
                    <div className="text-xs text-gray-600">받은 좋아요</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{post.author.commentsCount || 0}</div>
                    <div className="text-xs text-gray-600">댓글</div>
                  </div>
                </div>
                
                {/* Social Links */}
                {post.author.socialLinks && Object.keys(post.author.socialLinks).length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">소셜 링크</h4>
                    <div className="flex justify-center gap-3">
                      {post.author.socialLinks.github && (
                        <a 
                          href={post.author.socialLinks.github} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <Github className="w-4 h-4 text-gray-700" />
                        </a>
                      )}
                      {post.author.socialLinks.linkedin && (
                        <a 
                          href={post.author.socialLinks.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                        >
                          <Linkedin className="w-4 h-4 text-blue-700" />
                        </a>
                      )}
                      {post.author.socialLinks.website && (
                        <a 
                          href={post.author.socialLinks.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 bg-green-100 hover:bg-green-200 rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                )}
                
                <Link href={`/profile/${post.author.id}`}>
                  <Button className="w-full mt-6" variant="outline">
                    프로필 보기
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Post Stats Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">게시물 통계</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="p-2 bg-red-50 rounded-lg">
                      <Heart className="w-4 h-4 text-red-600" />
                    </div>
                    <span className="font-medium">좋아요</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{likesCount.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <MessageCircle className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="font-medium">댓글</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{post.commentsCount.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <Eye className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="font-medium">조회수</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{post.viewsCount.toLocaleString()}</span>
                </div>
                
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3 text-gray-600 mb-2">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <Calendar className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="font-medium">작성일</span>
                  </div>
                  <div className="text-sm text-gray-900 ml-11">
                    {new Date(post.createdAt).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      weekday: 'long'
                    })}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}