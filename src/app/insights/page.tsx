import type { Metadata } from "next";
import { TechStackInsights } from "@/components/insights/tech-stack-insights";

export const metadata: Metadata = {
  title: "기술 스택 인사이트 | stackload",
  description: "국내 기업들이 사용하는 기술 스택을 한눈에 살펴보세요",
};

export default function InsightsPage() {
  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "conic-gradient(from 0deg, oklch(0.95 0.08 260), oklch(0.96 0.06 300), oklch(0.95 0.08 260))",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            기술 스택별 기업
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            총 251개 기술 스택
          </p>
        </div>

        {/* 기술 스택 인사이트 컴포넌트 */}
        <TechStackInsights />
      </div>
    </div>
  );
}


