import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CommandPalette } from "@/components/command-palette";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://stackload.example"),
  title: {
    default: "stackload – 개발자 기술스택 가이드",
    template: "%s | stackload",
  },
  description: "개발자가 기술을 탐색/비교/학습할 수 있는 레퍼런스 플랫폼",
  openGraph: {
    title: "stackload – 개발자 기술스택 가이드",
    description: "기술 탐색/비교/학습을 위한 UI/UX",
    url: "https://stackload.example",
    siteName: "stackload",
    locale: "ko_KR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <Providers>
          <SiteHeader />
          <div className="flex-1">
            {children}
          </div>
          <SiteFooter />
          <CommandPalette />
        </Providers>
      </body>
    </html>
  );
}
