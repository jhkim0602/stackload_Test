import { NextResponse } from "next/server";
import techs from "@/../public/data/techs.json";

export async function GET() {
  const withSource = (techs as any[]).map((t) => ({ ...t, sourceName: "public/data/techs.json" }));
  return NextResponse.json(withSource);
}


