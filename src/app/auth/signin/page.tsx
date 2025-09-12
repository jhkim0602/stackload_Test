"use client"

import { signIn, getProviders, useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Github, Mail } from "lucide-react"
import { getCallbackUrl } from "@/lib/auth-redirect"

interface Provider {
  id: string
  name: string
  type: string
}

const providerIcons: { [key: string]: React.ReactNode } = {
  github: <Github className="w-4 h-4" />,
  google: <Mail className="w-4 h-4" />,
  kakao: (
    <div className="w-4 h-4 bg-[#FEE500] rounded-full flex items-center justify-center">
      <span className="text-[10px] font-bold text-black">K</span>
    </div>
  ),
  naver: (
    <div className="w-4 h-4 bg-[#03C75A] rounded-full flex items-center justify-center">
      <span className="text-[10px] font-bold text-white">N</span>
    </div>
  ),
}

export default function SignIn() {
  const [providers, setProviders] = useState<Record<string, Provider> | null>(null)
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    async function loadProviders() {
      const res = await getProviders()
      setProviders(res)
    }
    loadProviders()
  }, [])

  // 이미 로그인된 사용자는 리다이렉트
  useEffect(() => {
    if (status === 'authenticated' && session) {
      const callbackUrl = getCallbackUrl('/')
      router.push(callbackUrl)
    }
  }, [status, session, router])

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">로그인</CardTitle>
          <CardDescription className="text-center">
            소셜 계정으로 로그인하세요
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {providers &&
            Object.values(providers).map((provider) => (
              <Button
                key={provider.name}
                variant="outline"
                className="w-full"
                onClick={() => signIn(provider.id, { callbackUrl: getCallbackUrl('/') })}
              >
                {providerIcons[provider.id]}
                <span className="ml-2">
                  {provider.id === 'kakao' ? '카카오' : 
                   provider.id === 'naver' ? '네이버' : 
                   provider.name}로 로그인
                </span>
              </Button>
            ))}
        </CardContent>
      </Card>
    </div>
  )
}