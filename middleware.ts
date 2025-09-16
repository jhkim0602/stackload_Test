import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(request) {
    const { pathname } = request.nextUrl
    const token = request.nextauth.token

    // 인증이 필요한 페이지들만 체크
    const protectedPaths = [
      "/profile",
      "/settings", 
      "/admin",
      "/community/create"
    ]

    // 현재 경로가 보호된 페이지인지 확인
    const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))
    
    if (isProtectedPath && !token) {
      const signInUrl = new URL("/auth/signin", request.url)
      signInUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(signInUrl)
    }

    // 관리자 페이지는 추가 권한 체크
    if (pathname.startsWith("/admin") && token && token.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url))
    }

    // API 요청에 대한 rate limiting 헤더 추가 (기본적인 보안 강화)
    const response = NextResponse.next()
    
    if (pathname.startsWith("/api/")) {
      response.headers.set("X-Content-Type-Options", "nosniff")
      response.headers.set("X-Frame-Options", "DENY")
    }

    return response
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // NextAuth.js API 라우트는 항상 허용
        if (pathname.startsWith("/api/auth")) {
          return true
        }

        // 정적 파일과 공개 경로는 항상 허용
        if (pathname.startsWith("/_next") || 
            pathname.startsWith("/favicon") || 
            pathname === "/" ||
            pathname.startsWith("/tech") ||
            pathname.startsWith("/community")) {
          return true
        }

        // API 라우트 보호 로직
        if (pathname.startsWith("/api/")) {
          const method = req.method
          
          // 읽기 작업은 대부분 공개
          if (method === "GET") {
            // 사용자별 데이터만 보호
            if (pathname.includes("/api/users/") || 
                pathname.includes("/api/profile")) {
              return !!token
            }
            return true
          }
          
          // 쓰기 작업은 인증 필요
          if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
            return !!token
          }
        }

        // 보호된 페이지 체크
        const protectedPages = ["/profile", "/settings", "/admin", "/community/create"]
        const isProtectedPage = protectedPages.some(page => pathname.startsWith(page))
        
        if (isProtectedPage) {
          return !!token
        }

        return true
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth.js API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
}