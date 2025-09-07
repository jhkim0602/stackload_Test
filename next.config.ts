import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.simpleicons.org" },
      { protocol: "https", hostname: "github.com" },
      { protocol: "https", hostname: "raw.githubusercontent.com" },
      { protocol: "https", hostname: "assets.vercel.com" },
    ],
  },
};

export default nextConfig;
