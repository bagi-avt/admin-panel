const parseCookieValue = (value: string): string => {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

export const getCookie = (key: string): string | null => {
  if (typeof document === 'undefined') {
    return null
  }

  const chunks = document.cookie ? document.cookie.split('; ') : []
  const pair = chunks.find((item) => item.startsWith(`${key}=`))

  if (!pair) {
    return null
  }

  const [, rawValue = ''] = pair.split('=')
  return parseCookieValue(rawValue)
}

interface SetCookieOptions {
  expiresAt?: number
}

export const setCookie = (key: string, value: string, options?: SetCookieOptions) => {
  if (typeof document === 'undefined') {
    return
  }

  const expiresPart = options?.expiresAt
    ? `; expires=${new Date(options.expiresAt * 1000).toUTCString()}`
    : ''

  document.cookie = `${key}=${encodeURIComponent(value)}; path=/${expiresPart}; samesite=lax`
}

export const removeCookie = (key: string) => {
  if (typeof document === 'undefined') {
    return
  }

  document.cookie = `${key}=; path=/; max-age=0; samesite=lax`
}
