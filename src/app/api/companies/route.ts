import { NextResponse } from "next/server";
import companies from "@/../public/data/companies.json";

export async function GET() {
  const withSource = (companies as any[]).map((c) => ({ ...c, sourceName: "public/data/companies.json" }));
  return NextResponse.json(withSource);
}


