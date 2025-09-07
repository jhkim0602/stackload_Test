import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 text-sm text-muted-foreground flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} stackload. All rights reserved.</p>
        <nav className="flex gap-4">
          <Link href="/guides">가이드</Link>
          <Link href="/companies">회사 스택</Link>
          <Link href="/collections">컬렉션</Link>
        </nav>
      </div>
    </footer>
  );
}


