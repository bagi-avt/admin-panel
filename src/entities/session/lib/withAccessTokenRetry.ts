import { ensureValidAccessToken, refreshAccessToken } from '../model'

const SESSION_EXPIRED_MESSAGE = 'Сессия истекла. Выполните вход снова.'

const getRequiredAccessToken = async (): Promise<string> => {
  const accessToken = await ensureValidAccessToken()
  if (!accessToken) {
    throw new Error(SESSION_EXPIRED_MESSAGE)
  }

  return accessToken
}

export const withAccessTokenRetry = async <T>(
  request: (accessToken: string) => Promise<T>,
): Promise<T> => {
  const accessToken = await getRequiredAccessToken()

  try {
    return await request(accessToken)
  } catch (error) {
    if (!(error instanceof Error) || !('status' in error) || error.status !== 401) {
      throw error
    }

    const refreshedAccessToken = await refreshAccessToken()
    if (!refreshedAccessToken) {
      throw new Error(SESSION_EXPIRED_MESSAGE, { cause: error })
    }

    return request(refreshedAccessToken)
  }
}
