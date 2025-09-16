"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  ArrowLeft,
  Code2,
  BookOpen,
  Info,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

// 마크다운 에디터를 동적 import로 로드 (SSR 이슈 방지)
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

// 카테고리 옵션
const postTypes = [
  {
    id: "project",
    name: "프로젝트",
    icon: Code2,
    color: "bg-blue-100 text-blue-700 border-blue-200",
    description: "프로젝트 관련 정보를 공유하세요"
  },
  {
    id: "study",
    name: "스터디",
    icon: BookOpen,
    color: "bg-green-100 text-green-700 border-green-200",
    description: "스터디 관련 정보를 공유하세요"
  },
  {
    id: "mentoring",
    name: "정보공유",
    icon: Info,
    color: "bg-purple-100 text-purple-700 border-purple-200",
    description: "유용한 정보와 지식을 공유하세요"
  }
];

interface PostData {
  id: number;
  title: string;
  description: string;
  type: string;
  authorId: string;
}

export default function EditPostPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPost, setIsLoadingPost] = useState(true);
  const [postData, setPostData] = useState<PostData | null>(null);

  // 인증 상태 확인
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }
  }, [status, router]);

  // 기존 게시글 데이터 로드
  useEffect(() => {
    if (!postId || status !== "authenticated") return;

    const fetchPost = async () => {
      try {
        setIsLoadingPost(true);
        const response = await fetch(`/api/posts/${postId}`);
        
        if (!response.ok) {
          throw new Error("게시글을 불러올 수 없습니다.");
        }

        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.error?.message || "게시글을 불러올 수 없습니다.");
        }

        const post = result.data;
        
        // 작성자 본인인지 확인
        if (post.author.id !== session?.user?.id) {
          toast.error("본인이 작성한 글만 수정할 수 있습니다.");
          router.push(`/community/${postId}`);
          return;
        }

        setPostData(post);
        setTitle(post.title);
        setDescription(post.description);
        setSelectedType(post.type);
        
      } catch (error) {
        console.error("게시글 로드 실패:", error);
        toast.error(error instanceof Error ? error.message : "게시글을 불러올 수 없습니다.");
        router.push("/community");
      } finally {
        setIsLoadingPost(false);
      }
    };

    fetchPost();
  }, [postId, status, session, router]);

  // 폼 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("제목을 입력해주세요.");
      return;
    }

    if (!description.trim()) {
      toast.error("내용을 입력해주세요.");
      return;
    }

    if (!selectedType) {
      toast.error("카테고리를 선택해주세요.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(`/api/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          type: selectedType,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || "글 수정에 실패했습니다.");
      }

      toast.success("글이 성공적으로 수정되었습니다!");
      router.push(`/community/${postId}`);
      
    } catch (error) {
      console.error("글 수정 실패:", error);
      toast.error(error instanceof Error ? error.message : "글 수정에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 로딩 상태
  if (status === "loading" || isLoadingPost) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2 text-lg">
          <Loader2 className="w-5 h-5 animate-spin" />
          글을 불러오는 중...
        </div>
      </div>
    );
  }

  // 인증되지 않은 경우
  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <Link
            href={`/community/${postId}`}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            뒤로 가기
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">글 수정하기</h1>
          <p className="text-gray-600 mt-2">
            커뮤니티에서 공유하고 싶은 내용을 수정해보세요.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 카테고리 선택 */}
          <Card>
            <CardHeader>
              <CardTitle>카테고리 선택</CardTitle>
              <CardDescription>
                글의 성격에 맞는 카테고리를 선택해주세요.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {postTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = selectedType === type.id;
                  
                  return (
                    <div
                      key={type.id}
                      className={`
                        relative cursor-pointer rounded-lg border-2 p-4 transition-all
                        ${isSelected 
                          ? `${type.color} border-current` 
                          : 'border-gray-200 bg-white hover:border-gray-300'
                        }
                      `}
                      onClick={() => setSelectedType(type.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <div>
                          <h3 className="font-semibold">{type.name}</h3>
                          <p className={`text-sm ${isSelected ? 'text-current' : 'text-gray-600'}`}>
                            {type.description}
                          </p>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2">
                          <div className="w-2 h-2 bg-current rounded-full"></div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* 제목 입력 */}
          <Card>
            <CardHeader>
              <CardTitle>제목</CardTitle>
              <CardDescription>
                명확하고 간결한 제목을 작성해주세요.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: React 18 새로운 기능을 활용한 프로젝트 팀원 모집"
                maxLength={100}
                className="text-lg"
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm text-gray-500">
                  검색하기 쉽고 이해하기 쉬운 제목을 작성해주세요.
                </p>
                <p className="text-sm text-gray-500">
                  {title.length}/100
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 내용 입력 */}
          <Card>
            <CardHeader>
              <CardTitle>내용</CardTitle>
              <CardDescription>
                마크다운 문법을 사용하여 내용을 작성할 수 있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="min-h-[400px]">
                <MDEditor
                  value={description}
                  onChange={(val) => setDescription(val || "")}
                  preview="edit"
                  hideToolbar={false}
                  data-color-mode="light"
                />
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  **굵게**, *기울임*, `코드`, ## 제목, - 리스트 등의 마크다운 문법을 사용할 수 있습니다.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 제출 버튼 */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/community/${postId}`)}
              disabled={isLoading}
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !title.trim() || !description.trim() || !selectedType}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  수정 중...
                </>
              ) : (
                "글 수정하기"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}