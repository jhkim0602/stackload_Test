"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import type { Session } from 'next-auth'

interface User {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  avatarUrl?: string | null
  location?: string | null
  level?: string | null
  bio?: string | null
}

interface AuthContextType {
  user: User | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const isLoading = status === 'loading'
  const isAuthenticated = !!session?.user && (!!session.user.email || !!session.user.id)

  useEffect(() => {
    if (session?.user) {
      // 세션에서 사용자 정보 설정
      setUser({
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      })

      // 추가 사용자 정보 가져오기
      if (session.user.id) {
        fetchUserProfile(session.user.id)
      }
    } else {
      setUser(null)
    }
  }, [session])

  const fetchUserProfile = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`)
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setUser(prev => ({
            ...prev,
            ...result.data,
          }))
        }
      }
    } catch (error) {
      console.error('사용자 프로필 가져오기 실패:', error)
    }
  }

  const updateUser = (userData: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...userData } : null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAuthenticated,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// 특정 권한이 필요한 훅
export function useRequireAuth() {
  const auth = useAuth()
  
  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      window.location.href = '/auth/signin'
    }
  }, [auth.isLoading, auth.isAuthenticated])

  return auth
}