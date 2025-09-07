import { NextRequest, NextResponse } from "next/server";

// Placeholder for Firecrawl integration. Replace with actual client calls.
type FirecrawlRequestBody = { urls: string[] };

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as FirecrawlRequestBody;
    // const res = await firecrawl.crawl({ urls: body.urls, country: 'KR' })
    // return NextResponse.json(res)
    return NextResponse.json({ ok: true, received: body });
  } catch (e) {
    const message = (e as Error)?.message ?? "unknown";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}


