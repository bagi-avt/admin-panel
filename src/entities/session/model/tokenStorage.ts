import type { TokensResponse } from '@shared/api/auth'
import { getCookie, removeCookie, setCookie } from '@shared/lib/cookie'

const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const ACCESS_EXPIRES_AT_KEY = 'access_expired_at'
const REFRESH_EXPIRES_AT_KEY = 'refresh_expired_at'

const toNumber = (value: string | null): number | null => {
  if (!value) {
    return null
  }

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

export const saveTokens = (tokens: TokensResponse) => {
  setCookie(ACCESS_TOKEN_KEY, tokens.access_token, { expiresAt: tokens.access_expired_at })
  setCookie(REFRESH_TOKEN_KEY, tokens.refresh_token, { expiresAt: tokens.refresh_expired_at })
  setCookie(ACCESS_EXPIRES_AT_KEY, String(tokens.access_expired_at), {
    expiresAt: tokens.access_expired_at,
  })
  setCookie(REFRESH_EXPIRES_AT_KEY, String(tokens.refresh_expired_at), {
    expiresAt: tokens.refresh_expired_at,
  })
}

export const clearTokens = () => {
  removeCookie(ACCESS_TOKEN_KEY)
  removeCookie(REFRESH_TOKEN_KEY)
  removeCookie(ACCESS_EXPIRES_AT_KEY)
  removeCookie(REFRESH_EXPIRES_AT_KEY)
}

export const getAccessToken = (): string | null => getCookie(ACCESS_TOKEN_KEY)
export const getRefreshToken = (): string | null => getCookie(REFRESH_TOKEN_KEY)
export const getAccessTokenExpiresAt = (): number | null =>
  toNumber(getCookie(ACCESS_EXPIRES_AT_KEY))

export const getRefreshTokenExpiresAt = (): number | null =>
  toNumber(getCookie(REFRESH_EXPIRES_AT_KEY))

export const isAccessTokenExpired = () => {
  const expiresAt = getAccessTokenExpiresAt()
  if (!expiresAt) {
    return true
  }

  return Date.now() >= expiresAt * 1000
}

export const isRefreshTokenExpired = () => {
  const expiresAt = getRefreshTokenExpiresAt()
  if (!expiresAt) {
    return true
  }

  return Date.now() >= expiresAt * 1000
}
