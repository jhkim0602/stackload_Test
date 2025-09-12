import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  // TODO: 향후 데이터베이스에 컬렉션 모델을 추가할 예정
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: "컬렉션 | stackload",
    description: "기술 스택 컬렉션",
  };
}

export default function CollectionPage({ params }: Props) {
  // TODO: 향후 데이터베이스에 컬렉션 모델을 추가할 예정
  // 현재는 404 반환
  return notFound();
}