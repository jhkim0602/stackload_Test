"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft,
  Code2,
  BookOpen,
  MessageSquare,
  Users,
  Calendar,
  MapPin,
  Clock,
  Tag,
  Plus,
  X,
  AlertCircle,
  CheckCircle,
  Upload,
  Link as LinkIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


// 카테고리 옵션
const postTypes = [
  {
    id: "project",
    name: "프로젝트",
    icon: Code2,
    color: "bg-blue-100 text-blue-700 border-blue-200",
    description: "함께 개발할 팀원을 모집하세요"
  },
  {
    id: "study",
    name: "스터디",
    icon: BookOpen,
    color: "bg-green-100 text-green-700 border-green-200",
    description: "같이 공부할 동료를 찾아보세요"
  },
  {
    id: "mentoring",
    name: "멘토링",
    icon: MessageSquare,
    color: "bg-purple-100 text-purple-700 border-purple-200",
    description: "멘토가 되거나 멘티를 구해보세요"
  }
];

// 기술 태그 예시
const popularTechs = [
  "React", "Next.js", "TypeScript", "JavaScript", "Node.js", "Python", 
  "Java", "Spring", "Vue.js", "Angular", "Express", "Django", 
  "PostgreSQL", "MongoDB", "MySQL", "Redis", "Docker", "AWS",
  "TailwindCSS", "Figma", "Git", "GraphQL", "REST API", "Socket.io"
];

// 위치 옵션
const locations = [
  "온라인", "서울", "부산", "대구", "인천", "광주", "대전", "울산", 
  "세종", "경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"
];

interface FormData {
  type: string;
  title: string;
  description: string;
  location: string;
  duration: string;
  schedule: string;
  maxMembers: string;
  techTags: string[];
  requirements: string[];
  benefits: string[];
  contact: string;
}

export default function CreatePostPage() {
  const [currentStep, setCurrentStep] = useState<"draft" | "preview" | "success">("draft");

  const [formData, setFormData] = useState<FormData>({
    type: "",
    title: "",
    description: "",
    location: "온라인",
    duration: "",
    schedule: "",
    maxMembers: "4",
    techTags: [],
    requirements: [],
    benefits: [],
    contact: ""
  });

  const [newTag, setNewTag] = useState("");
  const [newRequirement, setNewRequirement] = useState("");
  const [newBenefit, setNewBenefit] = useState("");

  const getTypeIcon = (type: string) => {
    const typeConfig = postTypes.find(t => t.id === type);
    return typeConfig ? typeConfig.icon : Code2;
  };

  const getTypeColor = (type: string) => {
    const typeConfig = postTypes.find(t => t.id === type);
    return typeConfig ? typeConfig.color : "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getTypeLabel = (type: string) => {
    const typeConfig = postTypes.find(t => t.id === type);
    return typeConfig ? typeConfig.name : type;
  };

  const addTechTag = (tag: string) => {
    if (tag && !formData.techTags.includes(tag)) {
      setFormData({
        ...formData,
        techTags: [...formData.techTags, tag]
      });
    }
    setNewTag("");
  };

  const removeTechTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      techTags: formData.techTags.filter(tag => tag !== tagToRemove)
    });
  };

  const addRequirement = () => {
    if (newRequirement && !formData.requirements.includes(newRequirement)) {
      setFormData({
        ...formData,
        requirements: [...formData.requirements, newRequirement]
      });
    }
    setNewRequirement("");
  };

  const removeRequirement = (reqToRemove: string) => {
    setFormData({
      ...formData,
      requirements: formData.requirements.filter(req => req !== reqToRemove)
    });
  };

  const addBenefit = () => {
    if (newBenefit && !formData.benefits.includes(newBenefit)) {
      setFormData({
        ...formData,
        benefits: [...formData.benefits, newBenefit]
      });
    }
    setNewBenefit("");
  };

  const removeBenefit = (benefitToRemove: string) => {
    setFormData({
      ...formData,
      benefits: formData.benefits.filter(benefit => benefit !== benefitToRemove)
    });
  };

  const handleSubmit = async () => {
    // 실제로는 API 호출
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCurrentStep("success");
  };

  if (currentStep === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">게시글 작성 완료!</h2>
          <p className="text-gray-600 mb-6">
            게시글이 성공적으로 등록되었습니다. 곧 팀원들의 지원을 받아보실 수 있어요!
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

  if (currentStep === "preview") {
    const TypeIcon = getTypeIcon(formData.type);
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <button 
              onClick={() => setCurrentStep("draft")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              뒤로 가기
            </button>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">게시글 미리보기</h1>
              <p className="text-gray-600">게시글이 어떻게 보일지 확인해보세요</p>
            </div>

            {/* Preview Content */}
            <div className="border rounded-2xl p-6 bg-gray-50 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Badge className={getTypeColor(formData.type)}>
                  <span className="mr-1"><TypeIcon className="w-4 h-4" /></span>
                  {getTypeLabel(formData.type)}
                </Badge>
                <Badge className="bg-green-100 text-green-700">모집중</Badge>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-4">{formData.title}</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-white rounded-xl">
                <div className="text-center">
                  <MapPin className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                  <div className="text-sm font-medium text-gray-900">{formData.location}</div>
                  <div className="text-xs text-gray-500">장소</div>
                </div>
                <div className="text-center">
                  <Calendar className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                  <div className="text-sm font-medium text-gray-900">{formData.duration}</div>
                  <div className="text-xs text-gray-500">기간</div>
                </div>
                <div className="text-center">
                  <Users className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                  <div className="text-sm font-medium text-gray-900">1/{formData.maxMembers}명</div>
                  <div className="text-xs text-gray-500">인원</div>
                </div>
                <div className="text-center">
                  <Clock className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                  <div className="text-sm font-medium text-gray-900">{formData.schedule}</div>
                  <div className="text-xs text-gray-500">일정</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {formData.techTags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="prose prose-gray max-w-none mb-6">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {formData.description || '내용이 입력되지 않았습니다.'}
                </div>
              </div>

                {(formData.requirements.length > 0 || formData.benefits.length > 0) && (
                  <div className="grid md:grid-cols-2 gap-6">
                    {formData.requirements.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          지원 요구사항
                        </h4>
                        <ul className="space-y-2">
                          {formData.requirements.map((req, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                              <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {formData.benefits.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-yellow-500" />
                          참여 혜택
                        </h4>
                        <ul className="space-y-2">
                          {formData.benefits.map((benefit, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                              <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep("draft")}
                className="flex-1"
              >
                수정하기
              </Button>
              <Button 
                onClick={handleSubmit}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                게시글 등록
              </Button>
            </div>
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

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">새 게시글 작성</h1>
            <p className="text-gray-600">팀원을 모집하거나 함께 성장할 동료를 찾아보세요</p>
          </div>

          <form className="space-y-8">
            
            {/* Step 1: 카테고리 선택 */}
            <div className="space-y-4">
              <label className="block text-lg font-semibold text-gray-900">
                1. 카테고리 선택 *
              </label>
              <div className="grid md:grid-cols-3 gap-4">
                {postTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setFormData({...formData, type: type.id})}
                      className={`p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
                        formData.type === type.id
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Icon className={`w-8 h-8 mx-auto mb-3 ${
                        formData.type === type.id ? "text-blue-600" : "text-gray-400"
                      }`} />
                      <h3 className={`font-semibold mb-2 ${
                        formData.type === type.id ? "text-blue-900" : "text-gray-900"
                      }`}>
                        {type.name}
                      </h3>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {formData.type && (
              <>
                {/* Step 2: 기본 정보 */}
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-900">2. 기본 정보</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      제목 *
                    </label>
                    <input
                      type="text"
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="예: Next.js 13으로 실시간 채팅 앱 만들 팀원 모집"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      상세 설명 * (마크다운 지원)
                    </label>
                    <textarea
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={8}
                      placeholder="프로젝트/스터디에 대한 자세한 설명을 작성해주세요.
• 목표와 방향성
• 진행 방식
• 기대 효과
• 기타 특이사항"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      마크다운 문법을 사용하여 풍부한 텍스트를 작성할 수 있습니다. (예: **굵게**, *기울임*, `코드`, - 목록)
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        진행 장소 *
                      </label>
                      <select
                        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                      >
                        {locations.map((location) => (
                          <option key={location} value={location}>{location}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        예상 기간 *
                      </label>
                      <input
                        type="text"
                        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="예: 3개월, 6주, 상시"
                        value={formData.duration}
                        onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        정기 일정
                      </label>
                      <input
                        type="text"
                        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="예: 매주 화요일 저녁 9시"
                        value={formData.schedule}
                        onChange={(e) => setFormData({...formData, schedule: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        모집 인원 *
                      </label>
                      <select
                        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.maxMembers}
                        onChange={(e) => setFormData({...formData, maxMembers: e.target.value})}
                      >
                        {[2,3,4,5,6,7,8,9,10].map((num) => (
                          <option key={num} value={num.toString()}>{num}명</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Step 3: 기술 스택 */}
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-900">3. 기술 스택</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      사용 기술 태그
                    </label>
                    
                    {/* 선택된 태그들 */}
                    {formData.techTags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4 p-4 bg-gray-50 rounded-lg">
                        {formData.techTags.map((tag, index) => (
                          <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                            #{tag}
                            <button
                              type="button"
                              onClick={() => removeTechTag(tag)}
                              className="hover:bg-blue-200 rounded-full p-0.5"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* 태그 입력 */}
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="기술 태그 입력 (예: React, Node.js)"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechTag(newTag))}
                      />
                      <Button
                        type="button"
                        onClick={() => addTechTag(newTag)}
                        size="sm"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* 인기 태그들 */}
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">인기 기술 태그:</p>
                      <div className="flex flex-wrap gap-2">
                        {popularTechs.map((tech) => (
                          <button
                            key={tech}
                            type="button"
                            onClick={() => addTechTag(tech)}
                            className="px-3 py-1 text-sm bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-700 rounded-md transition-colors"
                            disabled={formData.techTags.includes(tech)}
                          >
                            {tech}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 4: 상세 요구사항 (선택사항) */}
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-900">4. 상세 정보 (선택사항)</h2>
                  
                  <Tabs defaultValue="requirements">
                    <TabsList className="w-full">
                      <TabsTrigger value="requirements" className="flex-1">지원 요구사항</TabsTrigger>
                      <TabsTrigger value="benefits" className="flex-1">참여 혜택</TabsTrigger>
                    </TabsList>

                    <TabsContent value="requirements" className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          지원자가 갖춰야 할 조건들
                        </label>
                        
                        {formData.requirements.length > 0 && (
                          <ul className="space-y-2 mb-4 p-4 bg-gray-50 rounded-lg">
                            {formData.requirements.map((req, index) => (
                              <li key={index} className="flex items-start justify-between gap-2">
                                <span className="text-sm text-gray-700">• {req}</span>
                                <button
                                  type="button"
                                  onClick={() => removeRequirement(req)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}

                        <div className="flex gap-2">
                          <input
                            type="text"
                            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="예: React 실무 경험 6개월 이상"
                            value={newRequirement}
                            onChange={(e) => setNewRequirement(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                          />
                          <Button
                            type="button"
                            onClick={addRequirement}
                            size="sm"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="benefits" className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          참여했을 때의 혜택들
                        </label>
                        
                        {formData.benefits.length > 0 && (
                          <ul className="space-y-2 mb-4 p-4 bg-gray-50 rounded-lg">
                            {formData.benefits.map((benefit, index) => (
                              <li key={index} className="flex items-start justify-between gap-2">
                                <span className="text-sm text-gray-700">• {benefit}</span>
                                <button
                                  type="button"
                                  onClick={() => removeBenefit(benefit)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}

                        <div className="flex gap-2">
                          <input
                            type="text"
                            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="예: 포트폴리오 제작 지원"
                            value={newBenefit}
                            onChange={(e) => setNewBenefit(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
                          />
                          <Button
                            type="button"
                            onClick={addBenefit}
                            size="sm"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Step 5: 연락 방법 */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900">5. 연락 방법</h2>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      연락처 정보 (선택사항)
                    </label>
                    <input
                      type="text"
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="이메일, 디스코드, 카카오톡 오픈채팅 등"
                      value={formData.contact}
                      onChange={(e) => setFormData({...formData, contact: e.target.value})}
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      비워두시면 기본적으로 플랫폼 내 메시지로 연락을 받게 됩니다.
                    </p>
                  </div>
                </div>

                {/* 유의사항 */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 mb-1">게시글 작성 전 확인사항</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• 프로젝트/스터디 목표를 구체적으로 작성해주세요</li>
                        <li>• 정확한 기술 스택과 요구사항을 명시해주세요</li>
                        <li>• 예상 일정과 시간 투자량을 현실적으로 설정해주세요</li>
                        <li>• 연락이 가능한 방법을 최소 하나는 남겨주세요</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 제출 버튼들 */}
                <div className="flex gap-4 pt-6 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                  >
                    임시저장
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setCurrentStep("preview")}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={!formData.type || !formData.title || !formData.description}
                  >
                    미리보기
                  </Button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}