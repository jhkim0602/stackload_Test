"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Heart, Reply, Send, User, Edit, Trash2 } from "lucide-react";

interface TechComment {
  id: string;
  content: string;
  likesCount: number;
  repliesCount: number;
  createdAt: string;
  parentId?: string;
  author: {
    id: string;
    name: string;
    image?: string;
    avatarUrl?: string;
    level: string;
  };
  likes: Array<{
    id: string;
    userId: string;
  }>;
}

interface TechCommentsProps {
  techId: string;
  techName: string;
}

const levelColors = {
  Beginner: "bg-green-100 text-green-700 border-green-200",
  Junior: "bg-blue-100 text-blue-700 border-blue-200", 
  "Mid-Level": "bg-purple-100 text-purple-700 border-purple-200",
  Senior: "bg-orange-100 text-orange-700 border-orange-200",
  Expert: "bg-red-100 text-red-700 border-red-200",
  Student: "bg-gray-100 text-gray-700 border-gray-200"
};

const levelLabels = {
  Beginner: "초급",
  Junior: "주니어",
  "Mid-Level": "중급",
  Senior: "시니어", 
  Expert: "전문가",
  Student: "학생"
};

export function TechComments({ techId, techName }: TechCommentsProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<TechComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [replies, setReplies] = useState<{ [key: string]: TechComment[] }>({});
  const [showReplies, setShowReplies] = useState<{ [key: string]: boolean }>({});
  const [submitting, setSubmitting] = useState(false);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  // 댓글 목록 불러오기
  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/tech-comments?techId=${techId}`);
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setComments(result.data);
        }
      }
    } catch (error) {
      console.error("댓글 불러오기 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // 대댓글 불러오기
  const fetchReplies = async (parentId: string) => {
    try {
      const response = await fetch(`/api/tech-comments?techId=${techId}&parentId=${parentId}`);
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setReplies(prev => ({ ...prev, [parentId]: result.data }));
          setShowReplies(prev => ({ ...prev, [parentId]: true }));
        }
      }
    } catch (error) {
      console.error("대댓글 불러오기 실패:", error);
    }
  };

  // 댓글 작성
  const handleSubmitComment = async () => {
    if (!newComment.trim() || !session) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/tech-comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          techId: parseInt(techId),
          content: newComment.trim(),
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setComments(prev => [result.data, ...prev]);
          setNewComment("");
        }
      }
    } catch (error) {
      console.error("댓글 작성 실패:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // 대댓글 작성
  const handleSubmitReply = async (parentId: string) => {
    if (!replyContent.trim() || !session) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/tech-comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          techId: parseInt(techId),
          content: replyContent.trim(),
          parentId: parseInt(parentId),
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // 대댓글 목록에 추가
          setReplies(prev => ({
            ...prev,
            [parentId]: [result.data, ...(prev[parentId] || [])]
          }));
          // 부모 댓글의 대댓글 수 증가
          setComments(prev => prev.map(comment => 
            comment.id === parentId 
              ? { ...comment, repliesCount: comment.repliesCount + 1 }
              : comment
          ));
          setReplyContent("");
          setReplyingTo(null);
          setShowReplies(prev => ({ ...prev, [parentId]: true }));
        }
      }
    } catch (error) {
      console.error("대댓글 작성 실패:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // 댓글 수정
  const handleEditComment = async (commentId: string, isReply = false, parentId?: string) => {
    if (!editContent.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/tech-comments/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: editContent.trim(),
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          if (isReply && parentId) {
            // 대댓글 수정
            setReplies(prev => ({
              ...prev,
              [parentId]: prev[parentId]?.map(reply =>
                reply.id === commentId ? result.data : reply
              ) || []
            }));
          } else {
            // 일반 댓글 수정
            setComments(prev => prev.map(comment =>
              comment.id === commentId ? result.data : comment
            ));
          }
          setEditingComment(null);
          setEditContent("");
        }
      }
    } catch (error) {
      console.error("댓글 수정 실패:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId: string, isReply = false, parentId?: string) => {
    if (!confirm("댓글을 삭제하시겠습니까?")) return;

    try {
      const response = await fetch(`/api/tech-comments/${commentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          if (isReply && parentId) {
            // 대댓글 삭제
            setReplies(prev => ({
              ...prev,
              [parentId]: prev[parentId]?.filter(reply => reply.id !== commentId) || []
            }));
            // 부모 댓글의 대댓글 수 감소
            setComments(prev => prev.map(comment => 
              comment.id === parentId 
                ? { ...comment, repliesCount: Math.max(0, comment.repliesCount - 1) }
                : comment
            ));
          } else {
            // 일반 댓글 삭제
            setComments(prev => prev.filter(comment => comment.id !== commentId));
          }
        }
      }
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
    }
  };

  // 좋아요 토글
  const handleLikeToggle = async (commentId: string, isReply = false, parentId?: string) => {
    if (!session) return;

    try {
      const response = await fetch(`/api/tech-comments/${commentId}/like`, {
        method: "POST",
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          if (isReply && parentId) {
            // 대댓글 좋아요 업데이트
            setReplies(prev => ({
              ...prev,
              [parentId]: prev[parentId]?.map(reply =>
                reply.id === commentId
                  ? { 
                      ...reply, 
                      likesCount: result.data.likesCount,
                      likes: result.data.liked 
                        ? [...reply.likes, { id: 'temp', userId: session.user?.id || '' }]
                        : reply.likes.filter(like => like.userId !== session.user?.id)
                    }
                  : reply
              ) || []
            }));
          } else {
            // 일반 댓글 좋아요 업데이트
            setComments(prev => prev.map(comment =>
              comment.id === commentId
                ? { 
                    ...comment, 
                    likesCount: result.data.likesCount,
                    likes: result.data.liked 
                      ? [...comment.likes, { id: 'temp', userId: session.user?.id || '' }]
                      : comment.likes.filter(like => like.userId !== session.user?.id)
                  }
                : comment
            ));
          }
        }
      }
    } catch (error) {
      console.error("좋아요 처리 실패:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [techId]);

  if (loading) {
    return (
      <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            댓글
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderComment = (comment: TechComment, isReply = false, parentId?: string) => {
    const isLiked = comment.likes.some(like => like.userId === session?.user?.id);

    return (
      <div key={comment.id} className={`${isReply ? 'ml-12' : ''} p-4 bg-white/40 rounded-lg border border-white/30`}>
        <div className="flex gap-3">
          {/* 작성자 아바타 */}
          <div className="flex-shrink-0">
            {comment.author.image || comment.author.avatarUrl ? (
              <Image
                src={comment.author.image || comment.author.avatarUrl || ''}
                alt={comment.author.name}
                width={40}
                height={40}
                className="rounded-full ring-2 ring-white shadow-md"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `<div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md ring-2 ring-white">${comment.author.name.charAt(0)}</div>`;
                  }
                }}
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md ring-2 ring-white">
                {comment.author.name.charAt(0)}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            {/* 작성자 정보 */}
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-gray-900">{comment.author.name}</span>
              <Badge className={`text-xs ${levelColors[comment.author.level as keyof typeof levelColors] || levelColors.Student}`}>
                {levelLabels[comment.author.level as keyof typeof levelLabels] || comment.author.level}
              </Badge>
              <span className="text-xs text-gray-500">
                {new Date(comment.createdAt).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>

            {/* 댓글 내용 */}
            {editingComment === comment.id ? (
              <div className="mb-3">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="min-h-[80px] bg-white/80 border-white/30"
                />
                <div className="flex gap-2 mt-2">
                  <Button
                    onClick={() => handleEditComment(comment.id, isReply, parentId)}
                    disabled={!editContent.trim() || submitting}
                    size="sm"
                  >
                    <Send className="w-4 h-4 mr-1" />
                    {submitting ? '수정 중...' : '수정 완료'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingComment(null);
                      setEditContent('');
                    }}
                  >
                    취소
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-gray-800 mb-3 whitespace-pre-wrap">
                {comment.content}
              </div>
            )}

            {/* 액션 버튼들 */}
            <div className="flex items-center gap-4 text-sm">
              <button
                onClick={() => handleLikeToggle(comment.id, isReply, parentId)}
                disabled={!session}
                className={`flex items-center gap-1 px-3 py-1 rounded-full transition-colors ${
                  isLiked 
                    ? 'text-red-600 bg-red-50 hover:bg-red-100' 
                    : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                } ${!session ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                {comment.likesCount}
              </button>

              {!isReply && session && (
                <button
                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                  className="flex items-center gap-1 px-3 py-1 rounded-full text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <Reply className="w-4 h-4" />
                  답글
                </button>
              )}

              {!isReply && comment.repliesCount > 0 && (
                <button
                  onClick={() => {
                    if (showReplies[comment.id]) {
                      setShowReplies(prev => ({ ...prev, [comment.id]: false }));
                    } else {
                      fetchReplies(comment.id);
                    }
                  }}
                  className="flex items-center gap-1 px-3 py-1 rounded-full text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  답글 {comment.repliesCount}개 {showReplies[comment.id] ? '숨기기' : '보기'}
                </button>
              )}

              {/* 수정/삭제 버튼 (작성자만 볼 수 있음) */}
              {session && session.user?.id === comment.author.id && editingComment !== comment.id && (
                <>
                  <button
                    onClick={() => {
                      setEditingComment(comment.id);
                      setEditContent(comment.content);
                    }}
                    className="flex items-center gap-1 px-3 py-1 rounded-full text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    수정
                  </button>
                  <button
                    onClick={() => handleDeleteComment(comment.id, isReply, parentId)}
                    className="flex items-center gap-1 px-3 py-1 rounded-full text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    삭제
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 대댓글 작성 폼 */}
        {replyingTo === comment.id && session && (
          <div className="mt-4 ml-12">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <Textarea
                  placeholder="답글을 작성해주세요..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="min-h-[80px] bg-white/80 border-white/30"
                />
                <div className="flex gap-2 mt-2">
                  <Button 
                    onClick={() => handleSubmitReply(comment.id)}
                    disabled={!replyContent.trim() || submitting}
                    size="sm"
                  >
                    <Send className="w-4 h-4 mr-1" />
                    {submitting ? '작성 중...' : '답글 작성'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyContent('');
                    }}
                  >
                    취소
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 대댓글 목록 */}
        {showReplies[comment.id] && replies[comment.id] && (
          <div className="mt-4 space-y-3">
            {replies[comment.id].map(reply => renderComment(reply, true, comment.id))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          {techName} 댓글 ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 댓글 작성 폼 */}
        {session ? (
          <div className="p-4 bg-white/40 rounded-lg border border-white/30">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <Textarea
                  placeholder="이 기술에 대한 의견이나 경험을 공유해주세요..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[100px] bg-white/80 border-white/30"
                />
                <div className="flex justify-end mt-3">
                  <Button 
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim() || submitting}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {submitting ? '작성 중...' : '댓글 작성'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center bg-white/40 rounded-lg border border-white/30">
            <p className="text-gray-600 mb-3">댓글을 작성하려면 로그인이 필요합니다.</p>
            <Link href="/auth/signin">
              <Button variant="outline">로그인하기</Button>
            </Link>
          </div>
        )}

        {/* 댓글 목록 */}
        <div className="space-y-4">
          {comments.length > 0 ? (
            comments.map(comment => renderComment(comment))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>아직 댓글이 없습니다.</p>
              <p className="text-sm mt-1">첫 번째 댓글을 작성해보세요!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}