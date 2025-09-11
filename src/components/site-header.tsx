"use client";

import Link from "next/link";
import { Command, Layers3, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Layers3 className="size-5" />
          <span>stackload</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6 ml-6">
          <Link href="/search" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            탐색
          </Link>
          <Link href="/insights" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            인사이트
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2">
            <form action="/search" className="flex items-center gap-2">
              <Input name="q" placeholder="기술 검색 (예: Next.js, Kafka)" className="w-64" />
              <Button type="submit" variant="secondary">
                <Command className="size-4 mr-1" />검색
              </Button>
            </form>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="outline" aria-label="Open user menu">
                <User className="size-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="md:hidden">
                <DropdownMenuLabel>메뉴</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link href="/search">탐색</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/insights">인사이트</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </div>
              <DropdownMenuLabel>내 계정</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/collections">내 컬렉션</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/companies">회사 스택</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/guides">가이드</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}


