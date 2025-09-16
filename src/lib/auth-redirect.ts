export function getCallbackUrl(defaultUrl: string = '/'): string {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search)
    return params.get('callbackUrl') || defaultUrl
  }
  return defaultUrl
}

export function createSignInUrl(currentPath?: string): string {
  const callbackUrl = currentPath || (typeof window !== 'undefined' ? window.location.pathname : '/')
  return `/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`
}

export function redirectToSignIn(currentPath?: string): void {
  if (typeof window !== 'undefined') {
    window.location.href = createSignInUrl(currentPath)
  }
}

export function redirectAfterSignIn(defaultUrl: string = '/'): void {
  if (typeof window !== 'undefined') {
    const redirectUrl = getCallbackUrl(defaultUrl)
    window.location.href = redirectUrl
  }
}

// 서버 사이드에서 사용할 수 있는 리다이렉트 헬퍼
export function createAuthRedirect(callbackUrl?: string) {
  const encodedCallbackUrl = callbackUrl ? encodeURIComponent(callbackUrl) : ''
  return `/auth/signin${encodedCallbackUrl ? `?callbackUrl=${encodedCallbackUrl}` : ''}`
}