import { NextResponse } from 'next/server'

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    message: string
    code?: string
    details?: any
  }
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export function successResponse<T>(
  data: T,
  status: number = 200,
  pagination?: ApiResponse['pagination']
): NextResponse<ApiResponse<T>> {
  const response: ApiResponse<T> = {
    success: true,
    data,
  }

  if (pagination) {
    response.pagination = pagination
  }

  return NextResponse.json(response, { status })
}

export function errorResponse(
  message: string,
  status: number = 400,
  code?: string,
  details?: any
): NextResponse<ApiResponse> {
  const response: ApiResponse = {
    success: false,
    error: {
      message,
      code,
      details,
    },
  }

  return NextResponse.json(response, { status })
}

export function createPagination(
  page: number,
  limit: number,
  total: number
): ApiResponse['pagination'] {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  }
}