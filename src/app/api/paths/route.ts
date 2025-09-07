import { NextResponse } from "next/server";
import data from "@/../public/data/paths.json";

export async function GET() {
  const withSource = (data as any[]).map((p) => ({ ...p, sourceName: "public/data/paths.json" }));
  return NextResponse.json(withSource);
}


