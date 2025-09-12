import { NextRequest } from 'next/server'
import { getAuthSession } from '@/lib/auth'
import { errorResponse } from '@/lib/api-response'

export interface AuthenticatedRequest extends NextRequest {
  user: {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export async function withAuth<T extends any[]>(
  handler: (request: AuthenticatedRequest, ...args: T) => Promise<Response>
) {
  return async (request: NextRequest, ...args: T): Promise<Response> => {
    try {
      const session = await getAuthSession()

      if (!session?.user?.id) {
        return errorResponse('인증이 필요합니다.', 401)
      }

      // request에 사용자 정보 추가
      const authenticatedRequest = Object.assign(request, {
        user: session.user
      }) as AuthenticatedRequest

      return handler(authenticatedRequest, ...args)
    } catch (error) {
      console.error('인증 미들웨어 오류:', error)
      return errorResponse('인증 처리 중 오류가 발생했습니다.', 500)
    }
  }
}

export async function withOptionalAuth<T extends any[]>(
  handler: (request: NextRequest & { user?: any }, ...args: T) => Promise<Response>
) {
  return async (request: NextRequest, ...args: T): Promise<Response> => {
    try {
      const session = await getAuthSession()

      // 선택적 인증이므로 세션이 없어도 진행
      const requestWithOptionalUser = Object.assign(request, {
        user: session?.user || null
      })

      return handler(requestWithOptionalUser, ...args)
    } catch (error) {
      console.error('선택적 인증 미들웨어 오류:', error)
      return errorResponse('인증 처리 중 오류가 발생했습니다.', 500)
    }
  }
}

export function withRateLimit<T extends any[]>(
  handler: (request: NextRequest, ...args: T) => Promise<Response>,
  options: {
    windowMs?: number // 시간 윈도우 (기본: 15분)
    max?: number // 최대 요청 수 (기본: 100)
  } = {}
) {
  const windowMs = options.windowMs || 15 * 60 * 1000 // 15분
  const max = options.max || 100

  // 간단한 메모리 기반 레이트 리미터 (프로덕션에서는 Redis 사용 권장)
  const requests = new Map<string, { count: number; resetTime: number }>()

  return async (request: NextRequest, ...args: T): Promise<Response> => {
    try {
      const clientIp = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown'
      
      const now = Date.now()
      const clientData = requests.get(clientIp)

      if (!clientData || now > clientData.resetTime) {
        // 새로운 윈도우 시작
        requests.set(clientIp, {
          count: 1,
          resetTime: now + windowMs
        })
      } else if (clientData.count >= max) {
        // 레이트 리미트 초과
        return errorResponse(
          '요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.',
          429,
          'RATE_LIMIT_EXCEEDED',
          {
            limit: max,
            windowMs,
            resetTime: new Date(clientData.resetTime).toISOString()
          }
        )
      } else {
        // 요청 카운트 증가
        clientData.count += 1
      }

      return handler(request, ...args)
    } catch (error) {
      console.error('레이트 리미터 오류:', error)
      return handler(request, ...args) // 에러 발생 시 요청 통과
    }
  }
}

export function withValidation<T extends any[]>(
  handler: (request: NextRequest, ...args: T) => Promise<Response>,
  validator: (body: any) => { isValid: boolean; errors?: string[] }
) {
  return async (request: NextRequest, ...args: T): Promise<Response> => {
    try {
      if (request.method === 'POST' || request.method === 'PUT' || request.method === 'PATCH') {
        const body = await request.json()
        const validation = validator(body)

        if (!validation.isValid) {
          return errorResponse(
            '입력 데이터가 올바르지 않습니다.',
            400,
            'VALIDATION_ERROR',
            { errors: validation.errors }
          )
        }

        // 검증된 body를 request에 추가
        Object.assign(request, { validatedBody: body })
      }

      return handler(request, ...args)
    } catch (error) {
      if (error instanceof SyntaxError) {
        return errorResponse('잘못된 JSON 형식입니다.', 400, 'INVALID_JSON')
      }
      console.error('검증 미들웨어 오류:', error)
      return errorResponse('요청 검증 중 오류가 발생했습니다.', 500)
    }
  }
}

// 미들웨어 체이닝 유틸리티
export function chain<T extends any[]>(
  ...middlewares: Array<
    (handler: (request: NextRequest, ...args: T) => Promise<Response>) => 
    (request: NextRequest, ...args: T) => Promise<Response>
  >
) {
  return (handler: (request: NextRequest, ...args: T) => Promise<Response>) => {
    return middlewares.reduceRight((acc, middleware) => middleware(acc), handler)
  }
}