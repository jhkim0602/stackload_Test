import { NextResponse } from "next/server";
import data from "@/../public/data/paths.json";

type PathItem = {
  slug: string;
  title: string;
  steps: { label: string; items: string[] }[];
  references?: { title: string; url: string }[];
  sourceName?: string;
};

export async function GET() {
  const raw = data as unknown as PathItem[];
  const withSource: PathItem[] = raw.map((p) => ({ ...p, sourceName: "public/data/paths.json" }));
  return NextResponse.json(withSource);
}


