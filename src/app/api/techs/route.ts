import { NextResponse } from "next/server";
import techs from "@/../public/data/techs.json";
import type { Tech } from "@/lib/types";

export async function GET() {
  const raw = techs as unknown as Tech[];
  const withSource = raw.map((t) => ({ ...t, sourceName: "public/data/techs.json" }));
  return NextResponse.json(withSource);
}


