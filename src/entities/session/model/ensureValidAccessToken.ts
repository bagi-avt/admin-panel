import { refreshTokens } from '@shared/api/auth'

import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  isAccessTokenExpired,
  isRefreshTokenExpired,
  saveTokens,
} from './tokenStorage'

export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken()
  if (!refreshToken || isRefreshTokenExpired()) {
    clearTokens()
    return null
  }

  try {
    const tokens = await refreshTokens(refreshToken)
    saveTokens(tokens)
    return tokens.access_token
  } catch {
    clearTokens()
    return null
  }
}

export const ensureValidAccessToken = async (): Promise<string | null> => {
  const accessToken = getAccessToken()

  if (accessToken && !isAccessTokenExpired()) {
    return accessToken
  }

  return refreshAccessToken()
}
