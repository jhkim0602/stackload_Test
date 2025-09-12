import { NextResponse } from "next/server";
import { successResponse } from '@/lib/api-response';

type PathItem = {
  slug: string;
  title: string;
  steps: { label: string; items: string[] }[];
  references?: { title: string; url: string }[];
  sourceName?: string;
};

export async function GET() {
  // TODO: 향후 데이터베이스에 학습 경로 모델을 추가할 예정
  // 현재는 빈 배열 반환
  const paths: PathItem[] = [];
  
  return successResponse(paths);
}


