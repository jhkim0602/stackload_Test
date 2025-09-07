import { NextResponse } from "next/server";
import techs from "@/../public/data/techs.json";

export async function GET() {
  return NextResponse.json(techs);
}


