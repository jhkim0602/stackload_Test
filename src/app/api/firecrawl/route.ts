import { NextRequest, NextResponse } from "next/server";

// Placeholder for Firecrawl integration. Replace with actual client calls.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // const res = await firecrawl.crawl({ urls: body.urls, country: 'KR' })
    // return NextResponse.json(res)
    return NextResponse.json({ ok: true, received: body });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "unknown" }, { status: 500 });
  }
}


