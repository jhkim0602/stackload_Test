"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft, Code2, BookOpen, Info, Tag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// 마크다운 에디터를 동적 import로 로드 (SSR 이슈 방지)
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);

// 카테고리 옵션
const postTypes = [
  {
    id: "project",
    name: "프로젝트",
    icon: Code2,
    color: "bg-blue-100 text-blue-700 border-blue-200",
    description: "프로젝트 관련 정보를 공유하세요",
  },
  {
    id: "study",
    name: "스터디",
    icon: BookOpen,
    color: "bg-green-100 text-green-700 border-green-200",
    description: "스터디 관련 정보를 공유하세요",
  },
  {
    id: "mentoring",
    name: "정보공유",
    icon: Info,
    color: "bg-purple-100 text-purple-700 border-purple-200",
    description: "유용한 정보와 지식을 공유하세요",
  },
];

export default function CreatePostPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    type: "project",
    title: "",
    description: "",
    techIds: [] as number[],
  });

  const [techs, setTechs] = useState<any[]>([]);
  const [techSearchQuery, setTechSearchQuery] = useState("");
  const [isLoadingTechs, setIsLoadingTechs] = useState(false);
  const [showTechDropdown, setShowTechDropdown] = useState(false);

  // 기술 목록 가져오기
  useEffect(() => {
    const fetchTechs = async () => {
      setIsLoadingTechs(true);
      try {
        const response = await fetch("/api/techs?limit=100&sortBy=popularity");
        if (response.ok) {
          const result = await response.json();
          setTechs(result.data || []);
        }
      } catch (error) {
        console.error("기술 목록 가져오기 실패:", error);
      } finally {
        setIsLoadingTechs(false);
      }
    };

    fetchTechs();
  }, []);

  // 드롭다운 바깥 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".tech-dropdown-container")) {
        setShowTechDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 로그인하지 않은 사용자 리다이렉트
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        로딩 중...
      </div>
    );
  }

  if (!session) {
    router.push("/auth/signin?callbackUrl=/community/create");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          techIds: formData.techIds.length > 0 ? formData.techIds : undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "게시글 작성에 실패했습니다.");
      }

      const result = await response.json();
      console.log("게시글 작성 성공:", result);

      // 성공 시 커뮤니티 목록으로 이동
      router.push("/community");
    } catch (error) {
      console.error("게시글 작성 오류:", error);
      alert("게시글 작성 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | number[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTechAdd = (tech: any) => {
    const techId = parseInt(tech.id);
    if (!formData.techIds.includes(techId)) {
      handleInputChange("techIds", [...formData.techIds, techId]);
    }
    setTechSearchQuery("");
    setShowTechDropdown(false);
  };

  const handleTechRemove = (techId: number) => {
    handleInputChange(
      "techIds",
      formData.techIds.filter((id) => id !== techId)
    );
  };

  const filteredTechs = techs
    .filter(
      (tech) =>
        tech.name.toLowerCase().includes(techSearchQuery.toLowerCase()) &&
        !formData.techIds.includes(parseInt(tech.id))
    )
    .slice(0, 10);

  const selectedType = postTypes.find((type) => type.id === formData.type);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <Link
            href="/community"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            커뮤니티로 돌아가기
          </Link>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              새 글 작성
            </h1>
            <p className="text-lg text-gray-600">
              프로젝트, 스터디, 정보공유 글을 작성해보세요.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="w-full">
          <div className="space-y-8">
            {/* 카테고리 선택 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Code2 className="w-5 h-5 mr-2 text-blue-600" />
                  카테고리 선택
                </CardTitle>
                <CardDescription>
                  게시글의 카테고리를 선택하세요
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {postTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => handleInputChange("type", type.id)}
                        className={`flex items-center w-full p-6 rounded-xl border-2 transition-all text-left hover:shadow-md ${
                          formData.type === type.id
                            ? type.color + " shadow-md"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Icon className="w-5 h-5 mr-3" />
                        <div>
                          <div className="font-medium">{type.name}</div>
                          <div className="text-sm text-gray-500">
                            {type.description}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* 기술 태그 선택 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Tag className="w-5 h-5 mr-2 text-blue-600" />
                  사용 기술 태그
                </CardTitle>
                <CardDescription>
                  프로젝트나 스터디에서 사용하는 기술을 선택하세요 (선택사항)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 검색 입력 */}
                <div className="relative tech-dropdown-container">
                  <Input
                    value={techSearchQuery}
                    onChange={(e) => {
                      setTechSearchQuery(e.target.value);
                      setShowTechDropdown(e.target.value.length > 0);
                    }}
                    onFocus={() =>
                      setShowTechDropdown(techSearchQuery.length > 0)
                    }
                    placeholder="기술명을 검색하세요... (예: React, Node.js, Python)"
                    className="w-full"
                  />

                  {showTechDropdown && filteredTechs.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto z-10">
                      {filteredTechs.map((tech) => (
                        <button
                          key={tech.id}
                          type="button"
                          onClick={() => handleTechAdd(tech)}
                          className="w-full flex items-center px-4 py-3 hover:bg-gray-50 text-left border-b last:border-b-0"
                        >
                          {tech.logoUrl && (
                            <img
                              src={tech.logoUrl}
                              alt={tech.name}
                              className="w-6 h-6 mr-3 rounded"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          )}
                          <div>
                            <div className="font-medium text-gray-900">
                              {tech.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {tech.category}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 인기 기술 카드들 */}
                {!isLoadingTechs && techs.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">인기 기술들</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {techs.slice(0, 24).map((tech) => {
                        const isSelected = formData.techIds.includes(parseInt(tech.id));
                        return (
                          <button
                            key={tech.id}
                            type="button"
                            onClick={() => handleTechAdd(tech)}
                            disabled={isSelected}
                            className={`relative flex flex-col items-center p-3 rounded-lg border-2 transition-all duration-200 ${
                              isSelected
                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                            }`}
                          >
                            {tech.logoUrl && (
                              <img
                                src={tech.logoUrl}
                                alt={tech.name}
                                className="w-8 h-8 mb-2 rounded"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            )}
                            <span className="text-xs font-medium text-center leading-tight mb-1">
                              {tech.name}
                            </span>
                            <span className="text-xs text-gray-500 text-center leading-tight">
                              {tech.category}
                            </span>
                            {isSelected && (
                              <div className="absolute top-1 right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 선택된 기술 태그들 */}
                {formData.techIds.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">선택된 기술 ({formData.techIds.length}개)</h4>
                    <div className="flex flex-wrap gap-2">
                      {formData.techIds.map((techId) => {
                        const tech = techs.find((t) => parseInt(t.id) === techId);
                        if (!tech) return null;

                        return (
                          <div
                            key={techId}
                            className="flex items-center bg-blue-100 text-blue-800 px-3 py-2 rounded-full text-sm"
                          >
                            {tech.logoUrl && (
                              <img
                                src={tech.logoUrl}
                                alt={tech.name}
                                className="w-4 h-4 mr-2 rounded"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            )}
                            <span className="mr-2">{tech.name}</span>
                            <button
                              type="button"
                              onClick={() => handleTechRemove(techId)}
                              className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 기본 정보 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  {selectedType && (
                    <selectedType.icon className="w-5 h-5 mr-2 text-blue-600" />
                  )}
                  기본 정보
                </CardTitle>
                <CardDescription>
                  게시글의 제목과 내용을 입력하세요
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label
                    htmlFor="title"
                    className="text-sm font-medium text-gray-700 mb-2 block"
                  >
                    제목 *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="게시글 제목을 입력하세요"
                    className="w-full text-lg py-3"
                    required
                  />
                </div>

                <div>
                  <Label
                    htmlFor="description"
                    className="text-sm font-medium text-gray-700 mb-2 block"
                  >
                    내용 *
                  </Label>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <MDEditor
                      value={formData.description}
                      onChange={(value) =>
                        handleInputChange("description", value || "")
                      }
                      preview="edit"
                      hideToolbar={false}
                      textareaProps={{
                        placeholder: "게시글 내용을 마크다운으로 작성하세요...",
                        style: {
                          fontSize: 15,
                          lineHeight: 1.6,
                          minHeight: "400px",
                        },
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 제출 버튼 */}
            <div className="flex justify-center space-x-6 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
                size="lg"
                className="px-8"
              >
                취소
              </Button>
              <Button
                type="submit"
                disabled={
                  isSubmitting ||
                  !formData.title.trim() ||
                  !formData.description.trim()
                }
                className="bg-blue-600 hover:bg-blue-700 px-8"
                size="lg"
              >
                {isSubmitting ? "게시 중..." : "게시글 작성"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
