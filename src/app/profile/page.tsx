"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
  MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// 임시 사용자 데이터
const mockUser = {
  name: "김개발자",
  email: "developer@example.com",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  location: "서울, 대한민국",
  joinedDate: "2023년 3월",
  bio: "3년차 풀스택 개발자입니다. React와 Node.js를 주로 사용하며, 새로운 기술에 관심이 많습니다. 함께 성장할 수 있는 프로젝트와 스터디를 찾고 있어요!",
  level: "Mid-Level",
  
  // 통계
  stats: {
    posts: 8,
    likes: 156,
    comments: 89,
    projects: 5,
    studies: 3,
    mentoring: 2
  },

  // 기술 스택 (단순한 태그 리스트)
  techStack: [
    "React", "TypeScript", "JavaScript", "Next.js", "TailwindCSS", 
    "Node.js", "Python", "Express", "Django", 
    "PostgreSQL", "MongoDB", "Redis", 
    "Git", "Docker", "AWS", "Figma"
  ],

  // 관심 분야
  interests: ["웹 개발", "AI/ML", "클라우드", "오픈소스"],

  // 소셜 링크
  social: {
    github: "https://github.com/developer",
    discord: "developer#1234",
    email: "developer@example.com"
  },

  // 배지
  badges: [
    { name: "Early Adopter", icon: "🚀", description: "초기 가입자" },
    { name: "Community Helper", icon: "🤝", description: "커뮤니티 도우미" },
    { name: "Project Leader", icon: "👑", description: "프로젝트 리더" },
    { name: "Mentor", icon: "🎓", description: "멘토" }
  ]
};

// 활동 내역
const mockActivities = [
  {
    id: 1,
    type: "project",
    title: "React 채팅 앱 프로젝트 팀원 모집",
    action: "게시글 작성",
    date: "2시간 전",
    likes: 24,
    comments: 8
  },
  {
    id: 2,
    type: "comment",
    title: "Next.js 13 성능 최적화 질문",
    action: "댓글 작성",
    date: "5시간 전",
    likes: 12
  },
  {
    id: 3,
    type: "like",
    title: "TypeScript 고급 타입 스터디",
    action: "좋아요",
    date: "1일 전"
  },
  {
    id: 4,
    type: "study",
    title: "알고리즘 문제 해결 스터디",
    action: "스터디 참여",
    date: "3일 전"
  }
];

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
  const [isEditing, setIsEditing] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(mockUser.level);
  const [socialLinks, setSocialLinks] = useState({
    github: mockUser.social.github,
    discord: mockUser.social.discord,
    email: mockUser.social.email
  });

  const getSkillColor = (level: number) => {
    if (level >= 4) return "bg-green-500";
    if (level >= 3) return "bg-blue-500";
    if (level >= 2) return "bg-yellow-500";
    return "bg-gray-400";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Profile Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-8 mb-8">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <Image
                src={mockUser.avatar}
                alt={mockUser.name}
                width={120}
                height={120}
                className="rounded-2xl ring-4 ring-white shadow-xl"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `<div class="w-30 h-30 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-xl ring-4 ring-white">${mockUser.name.charAt(0)}</div>`;
                  }
                }}
              />
            </div>

            {/* Profile Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{mockUser.name}</h1>
                  <div className="flex items-center gap-4 text-gray-600 mb-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {mockUser.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {mockUser.joinedDate} 가입
                    </span>
                    {isEditing ? (
                      <div className="relative">
                        <select
                          value={selectedLevel}
                          onChange={(e) => setSelectedLevel(e.target.value)}
                          className="px-3 py-1 text-xs font-medium rounded-lg border-2 border-blue-300 bg-white text-blue-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {levelOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <Badge className={levelOptions.find(opt => opt.value === selectedLevel)?.color || "bg-blue-100 text-blue-700"}>
                        {levelOptions.find(opt => opt.value === selectedLevel)?.label || selectedLevel}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button 
                        onClick={() => {
                          // 실제로는 API 호출해서 저장
                          console.log('Saving:', { selectedLevel, socialLinks });
                          setIsEditing(false);
                        }} 
                        variant="default"
                        size="sm"
                      >
                        저장
                      </Button>
                      <Button 
                        onClick={() => {
                          setIsEditing(false);
                          setSelectedLevel(mockUser.level);
                          setSocialLinks({
                            github: mockUser.social.github,
                            discord: mockUser.social.discord,
                            email: mockUser.social.email
                          });
                        }} 
                        variant="outline"
                        size="sm"
                      >
                        취소
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)} variant="outline">
                      <Edit className="w-4 h-4 mr-2" />
                      프로필 수정
                    </Button>
                  )}
                </div>
              </div>

              <p className="text-gray-700 mb-4 leading-relaxed">{mockUser.bio}</p>

              {/* Level Selection Help */}
              {isEditing && (
                <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">레벨 선택 가이드</h4>
                  <div className="space-y-2">
                    {levelOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSelectedLevel(option.value)}
                        className={`w-full text-left p-3 rounded-lg text-sm transition-all duration-200 hover:shadow-md ${
                          selectedLevel === option.value 
                            ? 'bg-blue-100 border-2 border-blue-400 shadow-md transform scale-[1.02]' 
                            : 'bg-white hover:bg-gray-50 border border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-semibold text-gray-900">{option.label}</span>
                            <span className="text-gray-600 ml-2">- {option.description}</span>
                          </div>
                          <div className={`w-3 h-3 rounded-full border-2 ${
                            selectedLevel === option.value
                              ? 'bg-blue-500 border-blue-500'
                              : 'border-gray-300'
                          }`}>
                            {selectedLevel === option.value && (
                              <div className="w-full h-full rounded-full bg-white transform scale-50"></div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-blue-700 mt-3">
                    💡 위 옵션을 클릭하여 본인의 경험 수준에 맞는 레벨을 선택하세요. 이는 다른 개발자들이 참여할 프로젝트나 스터디 수준을 판단하는 데 도움이 됩니다.
                  </p>
                </div>
              )}

              {/* Social Links */}
              {isEditing ? (
                <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-800">소셜 링크 설정</h4>
                  <div className="grid gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        GitHub
                      </label>
                      <div className="flex items-center gap-2">
                        <Github className="w-4 h-4 text-gray-500" />
                        <input
                          type="url"
                          value={socialLinks.github}
                          onChange={(e) => setSocialLinks({...socialLinks, github: e.target.value})}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="https://github.com/username"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Discord
                      </label>
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-gray-500" />
                        <input
                          type="text"
                          value={socialLinks.discord}
                          onChange={(e) => setSocialLinks({...socialLinks, discord: e.target.value})}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="username#1234"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        이메일
                      </label>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <input
                          type="email"
                          value={socialLinks.email}
                          onChange={(e) => setSocialLinks({...socialLinks, email: e.target.value})}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  {socialLinks.github && (
                    <a 
                      href={socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      <span className="text-sm">GitHub</span>
                    </a>
                  )}
                  {socialLinks.discord && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-purple-100 rounded-lg">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">Discord: {socialLinks.discord}</span>
                    </div>
                  )}
                  {socialLinks.email && (
                    <a 
                      href={`mailto:${socialLinks.email}`} 
                      className="flex items-center gap-2 px-3 py-2 bg-green-100 hover:bg-green-200 rounded-lg transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">이메일</span>
                    </a>
                  )}
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{mockUser.stats.posts}</div>
                  <div className="text-sm text-gray-600">작성글</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500 mb-1">{mockUser.stats.likes}</div>
                  <div className="text-sm text-gray-600">받은 좋아요</div>
                </div>
              </div>
            </div>
          </div>
        </div>

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
                    <span className="font-medium">{mockUser.stats.projects}개</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">스터디</span>
                    <span className="font-medium">{mockUser.stats.studies}개</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">멘토링</span>
                    <span className="font-medium">{mockUser.stats.mentoring}개</span>
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
                  {mockUser.interests.map((interest, index) => (
                    <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-700">
                      {interest}
                    </Badge>
                  ))}
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
                {mockActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      {activity.type === 'project' && <Code2 className="w-4 h-4 text-blue-600" />}
                      {activity.type === 'comment' && <MessageSquare className="w-4 h-4 text-green-600" />}
                      {activity.type === 'like' && <Star className="w-4 h-4 text-red-600" />}
                      {activity.type === 'study' && <BookOpen className="w-4 h-4 text-purple-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{activity.action}</span> - {activity.title}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>{activity.date}</span>
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
                ))}
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
                {isEditing && (
                  <div className="text-xs text-gray-500">
                    태그를 클릭하여 편집하거나 새 기술을 추가하세요
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap gap-3">
                {mockUser.techStack.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 text-sm font-medium rounded-lg border border-blue-200 transition-colors cursor-pointer"
                  >
                    {tech}
                  </span>
                ))}
                
                {isEditing && (
                  <button className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-medium rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors flex items-center gap-1">
                    <span className="text-lg">+</span>
                    기술 추가
                  </button>
                )}
              </div>

              {isEditing && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-3">인기 기술 스택</h4>
                  <div className="flex flex-wrap gap-2">
                    {["Vue.js", "Angular", "Svelte", "Spring Boot", "FastAPI", "GraphQL", "Redis", "Elasticsearch", "Kubernetes", "Jenkins"].map((tech, index) => (
                      <button
                        key={index}
                        className="px-2 py-1 text-xs bg-white hover:bg-blue-50 text-gray-600 hover:text-blue-700 border border-gray-200 hover:border-blue-300 rounded-md transition-colors"
                        onClick={() => {
                          // 실제로는 techStack에 추가하는 로직
                          console.log(`${tech} 추가`);
                        }}
                      >
                        + {tech}
                      </button>
                    ))}
                  </div>
                </div>
              )}
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
                {mockUser.badges.map((badge, index) => (
                  <div key={index} className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                    <div className="text-3xl mb-2">{badge.icon}</div>
                    <h4 className="font-medium text-gray-900 mb-1">{badge.name}</h4>
                    <p className="text-xs text-gray-600">{badge.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}