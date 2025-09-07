import { NextResponse } from "next/server";
import companies from "@/../public/data/companies.json";
import type { Company } from "@/lib/types";

type CompanyWithOptional = Company & { slug?: string; sourceName?: string };

export async function GET() {
  const raw = companies as unknown as CompanyWithOptional[];
  const withSource: CompanyWithOptional[] = raw.map((c) => ({ ...c, sourceName: "public/data/companies.json" }));
  return NextResponse.json(withSource satisfies CompanyWithOptional[]);
}


