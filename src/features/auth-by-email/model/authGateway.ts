import { generateTokens } from '@shared/api/auth'
import {
  clearTokens,
  ensureValidAccessToken as ensureSessionValidAccessToken,
  saveTokens,
} from '@entities/session'

export const loginByEmail = async (email: string, password: string) => {
  const tokens = await generateTokens(email, password)
  saveTokens(tokens)
}

export const logout = () => {
  clearTokens()
}

export const ensureValidAccessToken = ensureSessionValidAccessToken
