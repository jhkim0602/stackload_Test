"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useRealtimeProfile } from "@/hooks/use-realtime-profile";
import { 
  User, 
  MapPin, 
  Calendar, 
  Github, 
  Mail, 
  Edit,
  Award,
  Code2,
  Users,
  BookOpen,
  MessageSquare,
  Star,
  TrendingUp,
  Activity,
  Target,
  Coffee,
  MessageCircle,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileEditForm } from "@/components/profile/profile-edit-form";
import { SocialLinksManager } from "@/components/profile/social-links-manager";
import { TechStackManager } from "@/components/profile/tech-stack-manager";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  bio?: string;
  level?: string;
  location?: string;
  github?: string;
  discord?: string;
  contactEmail?: string;
  socialLinks?: Record<string, string>;
  techStack: Array<{ name: string; category?: string; level?: number; }>;
  interests?: string[];
  badges?: Array<{ name: string; icon: string; description: string; }>;
  stats?: {
    posts: number;
    likes: number;
    comments: number;
    projects: number;
    studies: number;
    mentoring: number;
  };
  joinedAt: string;
}

interface Activity {
  id: string;
  type: 'post' | 'comment' | 'like' | 'study' | 'project';
  title: string;
  action: string;
  createdAt: string;
  likes?: number;
  comments?: number;
}

// 레벨 옵션들
const levelOptions = [
  { value: "Beginner", label: "초급자", color: "bg-gray-100 text-gray-700", description: "개발을 시작한 지 1년 미만" },
  { value: "Junior", label: "주니어", color: "bg-blue-100 text-blue-700", description: "1-3년차 개발자" },
  { value: "Mid-Level", label: "중급자", color: "bg-green-100 text-green-700", description: "3-7년차 개발자" },
  { value: "Senior", label: "시니어", color: "bg-purple-100 text-purple-700", description: "7년 이상 경력" },
  { value: "Expert", label: "전문가", color: "bg-orange-100 text-orange-700", description: "특정 분야 전문가" },
  { value: "Student", label: "학생", color: "bg-pink-100 text-pink-700", description: "현재 학습 중" }
];

export default function ProfilePage() {
  const { user: authUser } = useAuth();
  const { userProfile, isLoading, error, lastUpdated, updateProfile, refreshProfile } = useRealtimeProfile();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const fetchUserActivities = async () => {
    if (!authUser) return;
    
    try {
      const response = await fetch('/api/users/me/activities');
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setActivities(data.data || []);
        }
      }
    } catch (error) {
      console.error('활동 내역 조회 실패:', error);
    }
  };

  const handleProfileUpdate = async (updateData: {
    bio: string;
    level: string;
    location: string;
    github: string;
    discord: string;
    contactEmail: string;
    twitter: string;
    linkedin: string;
    instagram: string;
    website: string;
  }) => {
    try {
      await updateProfile(updateData);
      setIsEditing(false);
    } catch (error) {
      console.error('프로필 업데이트 실패:', error);
      throw error;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long'
    });
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}분 전`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}시간 전`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}일 전`;
    }
  };

  useEffect(() => {
    if (authUser) {
      fetchUserActivities();
    }
  }, [authUser]);

  const getSkillColor = (level: number) => {
    if (level >= 4) return "bg-green-500";
    if (level >= 3) return "bg-blue-500";
    if (level >= 2) return "bg-yellow-500";
    return "bg-gray-400";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-center">프로필을 불러오고 있습니다...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-8">
          <p className="text-red-600 text-center mb-4">프로필을 불러올 수 없습니다: {error}</p>
          <div className="text-center">
            <Button onClick={refreshProfile} variant="outline">
              다시 시도
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-8">
          <p className="text-gray-600 text-center">프로필을 불러올 수 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        
        {isEditing ? (
          /* Edit Mode - Show ProfileEditForm */
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">프로필 편집</h2>
            <ProfileEditForm
              userProfile={userProfile}
              onSave={handleProfileUpdate}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        ) : (
          /* View Mode - Show Profile Header */
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-8 mb-8">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {userProfile.image ? (
                  <Image
                    src={userProfile.image}
                    alt={userProfile.name}
                    width={120}
                    height={120}
                    className="rounded-2xl ring-4 ring-white shadow-xl"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `<div class="w-30 h-30 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-xl ring-4 ring-white">${userProfile.name.charAt(0)}</div>`;
                      }
                    }}
                  />
                ) : (
                  <div className="w-30 h-30 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-xl ring-4 ring-white">
                    {userProfile.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{userProfile.name}</h1>
                    <div className="flex items-center gap-4 text-gray-600 mb-2">
                      {userProfile.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {userProfile.location}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(userProfile.joinedAt)} 가입
                      </span>
                      <Badge className={levelOptions.find(opt => opt.value === userProfile.level)?.color || "bg-blue-100 text-blue-700"}>
                        {levelOptions.find(opt => opt.value === userProfile.level)?.label || userProfile.level || '초급자'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex gap-2">
                      <Button 
                        onClick={refreshProfile} 
                        variant="ghost" 
                        size="sm"
                        title="프로필 새로고침"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                      <Button onClick={() => setIsEditing(true)} variant="outline">
                        <Edit className="w-4 h-4 mr-2" />
                        프로필 수정
                      </Button>
                    </div>
                    {lastUpdated && (
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Activity className="w-3 h-3" />
                        마지막 업데이트: {lastUpdated.toLocaleTimeString('ko-KR')}
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-gray-700 mb-4 leading-relaxed">
                  {userProfile.bio || '아직 소개가 작성되지 않았습니다.'}
                </p>

                {/* Social Links */}
                <div className="mb-6">
                  <SocialLinksManager
                    initialLinks={typeof userProfile.socialLinks === 'object' ? userProfile.socialLinks : {
                      github: userProfile.github || '',
                      discord: userProfile.discord || '',
                      email: userProfile.contactEmail || ''
                    }}
                    onLinksChange={() => {}}
                    isEditing={false}
                  />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">{userProfile.stats?.posts || 0}</div>
                    <div className="text-sm text-gray-600">작성글</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-500 mb-1">{userProfile.stats?.likes || 0}</div>
                    <div className="text-sm text-gray-600">받은 좋아요</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white/80 backdrop-blur-sm border border-white/20">
            <TabsTrigger value="overview">개요</TabsTrigger>
            <TabsTrigger value="activity">활동</TabsTrigger>
            <TabsTrigger value="skills">기술 스택</TabsTrigger>
            <TabsTrigger value="badges">배지</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Activity Summary */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  활동 요약
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">프로젝트</span>
                    <span className="font-medium">{userProfile.stats?.projects || 0}개</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">스터디</span>
                    <span className="font-medium">{userProfile.stats?.studies || 0}개</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">멘토링</span>
                    <span className="font-medium">{userProfile.stats?.mentoring || 0}개</span>
                  </div>
                </div>
              </div>

              {/* Interests */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  관심 분야
                </h3>
                <div className="flex flex-wrap gap-2">
                  {userProfile.interests && userProfile.interests.length > 0 ? (
                    userProfile.interests.map((interest, index) => (
                      <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-700">
                        {interest}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">아직 관심 분야가 설정되지 않았습니다.</p>
                  )}
                </div>
              </div>

              {/* Recent Achievement */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  최근 성과
                </h3>
                <div className="text-center py-4">
                  <div className="text-2xl mb-2">🎉</div>
                  <div className="text-sm text-gray-600">이번 달 프로젝트 3개 완료!</div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                최근 활동
              </h3>
              <div className="space-y-4">
                {activities.length > 0 ? (
                  activities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        {activity.type === 'project' && <Code2 className="w-4 h-4 text-blue-600" />}
                        {activity.type === 'post' && <Code2 className="w-4 h-4 text-blue-600" />}
                        {activity.type === 'comment' && <MessageSquare className="w-4 h-4 text-green-600" />}
                        {activity.type === 'like' && <Star className="w-4 h-4 text-red-600" />}
                        {activity.type === 'study' && <BookOpen className="w-4 h-4 text-purple-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">{activity.action}</span> - {activity.title}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>{getTimeAgo(activity.createdAt)}</span>
                          {activity.likes && (
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3" />
                              {activity.likes}
                            </span>
                          )}
                          {activity.comments && (
                            <span className="flex items-center gap-1">
                              <MessageSquare className="w-3 h-3" />
                              {activity.comments}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">아직 활동 내역이 없습니다.</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Code2 className="w-4 h-4" />
                  기술 스택
                </h3>
              </div>
              
              <TechStackManager
                userTechStack={userProfile.techStack || []}
                onTechStackChange={() => {
                  // This is view mode, no changes needed
                }}
                isEditing={false}
              />
            </div>
          </TabsContent>

          {/* Badges Tab */}
          <TabsContent value="badges">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Award className="w-4 h-4" />
                획득 배지
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {userProfile.badges && userProfile.badges.length > 0 ? (
                  userProfile.badges.map((badge, index) => (
                    <div key={index} className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                      <div className="text-3xl mb-2">{badge.icon}</div>
                      <h4 className="font-medium text-gray-900 mb-1">{badge.name}</h4>
                      <p className="text-xs text-gray-600">{badge.description}</p>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">아직 획득한 배지가 없습니다.</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
}