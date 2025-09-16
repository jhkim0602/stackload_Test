"use client"

import { useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: ReactNode
  fallback?: ReactNode
  redirectTo?: string
}

export function ProtectedRoute({ 
  children, 
  fallback,
  redirectTo = '/auth/signin'
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const currentPath = window.location.pathname
      const callbackUrl = encodeURIComponent(currentPath)
      router.push(`${redirectTo}?callbackUrl=${callbackUrl}`)
    }
  }, [isLoading, isAuthenticated, router, redirectTo])

  if (isLoading) {
    return fallback || <LoadingFallback />
  }

  if (!isAuthenticated) {
    return fallback || <LoadingFallback />
  }

  return <>{children}</>
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
          <p className="text-sm text-gray-600">인증 정보를 확인하고 있습니다...</p>
        </CardContent>
      </Card>
    </div>
  )
}

// HOC 버전
export function withAuth<T extends object>(
  Component: React.ComponentType<T>,
  options?: {
    fallback?: ReactNode
    redirectTo?: string
  }
) {
  const AuthenticatedComponent = (props: T) => {
    return (
      <ProtectedRoute 
        fallback={options?.fallback} 
        redirectTo={options?.redirectTo}
      >
        <Component {...props} />
      </ProtectedRoute>
    )
  }

  AuthenticatedComponent.displayName = `withAuth(${Component.displayName || Component.name})`
  
  return AuthenticatedComponent
}