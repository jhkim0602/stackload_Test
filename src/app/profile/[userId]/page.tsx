"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  User, 
  MapPin, 
  Calendar, 
  Mail, 
  Star,
  MessageSquare,
  Heart,
  ArrowLeft,
  ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

interface UserProfile {
  id: string
  name: string
  email: string
  image?: string
  avatarUrl?: string
  bio?: string
  level?: string
  location?: string
  socialLinks?: Record<string, string>
  interests?: string[]
  postsCount?: number
  commentsCount?: number
  likesReceivedCount?: number
  userTechs?: Array<{
    techId: number
    proficiencyLevel: number
    tech?: {
      id: number
      name: string
      category: string
      slug: string
    }
  }>
  createdAt: string
}

const levelOptions = [
  { value: "Beginner", label: "초급자", color: "bg-gray-100 text-gray-700" },
  { value: "Junior", label: "주니어", color: "bg-blue-100 text-blue-700" },
  { value: "Mid-Level", label: "중급자", color: "bg-green-100 text-green-700" },
  { value: "Senior", label: "시니어", color: "bg-purple-100 text-purple-700" },
  { value: "Expert", label: "전문가", color: "bg-orange-100 text-orange-700" },
  { value: "Student", label: "학생", color: "bg-pink-100 text-pink-700" }
]

export default function UserProfilePage() {
  const params = useParams()
  const userId = params.userId as string
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (userId) {
      fetchUserProfile()
    }
  }, [userId])

  const fetchUserProfile = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/users/${userId}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('사용자를 찾을 수 없습니다.')
        }
        throw new Error('프로필을 불러오는데 실패했습니다.')
      }

      const result = await response.json()
      if (result.success) {
        setUserProfile(result.data)
      } else {
        throw new Error(result.message || '프로필을 불러오는데 실패했습니다.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">프로필을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error || !userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">프로필을 불러올 수 없습니다</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="space-x-2">
              <Button onClick={fetchUserProfile} variant="outline">다시 시도</Button>
              <Button asChild>
                <Link href="/community">커뮤니티로 돌아가기</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const socialLinks = typeof userProfile.socialLinks === 'string' 
    ? JSON.parse(userProfile.socialLinks) 
    : userProfile.socialLinks || {}

  const interests = typeof userProfile.interests === 'string'
    ? JSON.parse(userProfile.interests)
    : userProfile.interests || []

  const levelInfo = levelOptions.find(opt => opt.value === userProfile.level)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        
        {/* 뒤로가기 버튼 */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/community" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              커뮤니티로 돌아가기
            </Link>
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* 메인 프로필 카드 */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg">
              <CardHeader className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {userProfile.image || userProfile.avatarUrl ? (
                    <Image
                      src={userProfile.image || userProfile.avatarUrl || ''}
                      alt={userProfile.name}
                      width={96}
                      height={96}
                      className="rounded-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        if (target.parentElement) {
                          target.parentElement.textContent = userProfile.name[0]?.toUpperCase() || 'U'
                        }
                      }}
                    />
                  ) : (
                    userProfile.name[0]?.toUpperCase() || 'U'
                  )}
                </div>

                <h1 className="text-2xl font-bold text-gray-900">{userProfile.name}</h1>
                <p className="text-gray-600">{userProfile.email}</p>

                <div className="flex items-center justify-center gap-4 mt-4">
                  {levelInfo && (
                    <Badge className={levelInfo.color}>
                      {levelInfo.label}
                    </Badge>
                  )}
                  {userProfile.location && (
                    <div className="flex items-center gap-1 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{userProfile.location}</span>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* 소개 */}
                {userProfile.bio && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">소개</h3>
                    <p className="text-gray-700">{userProfile.bio}</p>
                  </div>
                )}

                {/* 관심사 */}
                {interests.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">관심사</h3>
                    <div className="flex flex-wrap gap-2">
                      {interests.map((interest: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* 소셜 링크 */}
                {Object.keys(socialLinks).length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">링크</h3>
                    <div className="flex gap-2">
                      {socialLinks.github && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={socialLinks.github} target="_blank" rel="noopener noreferrer">
                            GitHub <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        </Button>
                      )}
                      {socialLinks.linkedin && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                            LinkedIn <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        </Button>
                      )}
                      {socialLinks.website && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={socialLinks.website} target="_blank" rel="noopener noreferrer">
                            웹사이트 <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 사이드바 */}
          <div className="space-y-6">
            
            {/* 통계 카드 */}
            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">활동 통계</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-600">작성한 글</span>
                  </div>
                  <span className="font-semibold">{userProfile.postsCount || 0}</span>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-600">댓글</span>
                  </div>
                  <span className="font-semibold">{userProfile.commentsCount || 0}</span>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-gray-600">받은 좋아요</span>
                  </div>
                  <span className="font-semibold">{userProfile.likesReceivedCount || 0}</span>
                </div>
              </CardContent>
            </Card>

            {/* 가입 정보 */}
            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">가입 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {new Date(userProfile.createdAt).toLocaleDateString('ko-KR')}부터 함께함
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {userProfile.email}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* 기술 스택 */}
            {userProfile.userTechs && userProfile.userTechs.length > 0 && (
              <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">기술 스택</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {userProfile.userTechs.map((tech, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{tech.tech?.name || 'Unknown Tech'}</span>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < tech.proficiencyLevel 
                                  ? 'fill-yellow-400 text-yellow-400' 
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}