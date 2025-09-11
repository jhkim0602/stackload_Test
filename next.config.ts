import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // true로 하면 ESLint 에러가 있어도 빌드 계속 진행
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.simpleicons.org" },
      { protocol: "https", hostname: "github.com" },
      { protocol: "https", hostname: "raw.githubusercontent.com" },
      { protocol: "https", hostname: "assets.vercel.com" },
      // 기업 로고 호스트들
      { protocol: "https", hostname: "ssl.pstatic.net" }, // 네이버
      { protocol: "https", hostname: "t1.kakaocdn.net" }, // 카카오
      { protocol: "https", hostname: "obs.line-scdn.net" }, // 라인
      { protocol: "https", hostname: "static.coupangcdn.com" }, // 쿠팡
      { protocol: "https", hostname: "static.woowahan.com" }, // 우아한형제들
      { protocol: "https", hostname: "static.toss.im" }, // 토스
      { protocol: "https", hostname: "www.sktelecom.com" }, // SK텔레콤
      { protocol: "https", hostname: "babytalk.kr" }, // 바비톡
      { protocol: "https", hostname: "assets.ably.live" }, // 에이블리
      { protocol: "https", hostname: "www.jobplanet.co.kr" }, // 잡플래닛
      { protocol: "https", hostname: "ic.zigbang.com" }, // 직방
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
