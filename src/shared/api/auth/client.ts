import { createApiErrorClass, parseErrorMessage } from '@shared/lib/api'

import type { TokensResponse } from './types'

const AUTH_BASE_URL = '/backend-auth'

export const ApiRequestError = createApiErrorClass('ApiRequestError')

const buildFormData = (data: Record<string, string>) => {
  const body = new FormData()
  Object.entries(data).forEach(([key, value]) => {
    body.append(key, value)
  })
  return body
}

const requestTokens = async (path: string, data: Record<string, string>): Promise<TokensResponse> => {
  const response = await fetch(`${AUTH_BASE_URL}${path}`, {
    method: 'POST',
    body: buildFormData(data),
  })

  const payload = (await response.json()) as unknown

  if (!response.ok) {
    throw new ApiRequestError(parseErrorMessage(response.status, payload), response.status, payload)
  }

  return payload as TokensResponse
}

export const generateTokens = (email: string, password: string): Promise<TokensResponse> =>
  requestTokens('/token-generate', { email, password })

export const refreshTokens = (refreshToken: string): Promise<TokensResponse> =>
  requestTokens('/token-refresh', { refresh_token: refreshToken })
