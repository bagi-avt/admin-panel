import type { ApiErrorPayload, ValidationErrorItem } from '@shared/api/auth'

export const parseErrorMessage = (status: number, payload: unknown): string => {
  if (Array.isArray(payload)) {
    const validationMessages = payload
      .map((item) => {
        if (!item || typeof item !== 'object') {
          return ''
        }
        const field = 'field' in item && typeof item.field === 'string' ? item.field : ''
        const message = 'message' in item && typeof item.message === 'string' ? item.message : ''
        return field && message ? `${field}: ${message}` : message
      })
      .filter(Boolean)

    if (validationMessages.length > 0) {
      return validationMessages.join(', ')
    }
  }

  if (payload && typeof payload === 'object' && 'message' in payload) {
    const message = payload.message
    if (typeof message === 'string' && message.trim().length > 0) {
      return message
    }
  }

  return `Запрос завершился с ошибкой (${status})`
}

export const getAuthHeaders = (accessToken: string): HeadersInit => ({
  Authorization: `Bearer ${accessToken}`,
})

export const parseJsonResponse = async (response: Response): Promise<unknown> => {
  const contentType = response.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) {
    return null
  }

  return response.json()
}

export type ApiErrorConstructor = new (
  message: string,
  status: number,
  payload?: ApiErrorPayload | ValidationErrorItem[] | unknown,
) => Error & { status: number }

export const createApiErrorClass = (name: string): ApiErrorConstructor => {
  class ApiError extends Error {
    readonly status: number
    readonly payload?: ApiErrorPayload | ValidationErrorItem[] | unknown

    constructor(
      message: string,
      status: number,
      payload?: ApiErrorPayload | ValidationErrorItem[] | unknown,
    ) {
      super(message)
      this.name = name
      this.status = status
      this.payload = payload
    }
  }

  return ApiError as ApiErrorConstructor
}

export const ensureOkResponse = async (
  response: Response,
  ApiError: ApiErrorConstructor,
): Promise<void> => {
  if (response.ok) {
    return
  }

  const payload = await parseJsonResponse(response)
  throw new ApiError(parseErrorMessage(response.status, payload), response.status, payload)
}

export const authFetch = async (
  accessToken: string,
  url: string,
  init: RequestInit,
  ApiError: ApiErrorConstructor,
): Promise<Response> => {
  const response = await fetch(url, {
    ...init,
    headers: {
      ...getAuthHeaders(accessToken),
      ...init.headers,
    },
  })

  await ensureOkResponse(response, ApiError)
  return response
}

export const mapNotFoundToNull = async <T>(request: () => Promise<T>): Promise<T | null> => {
  try {
    return await request()
  } catch (error) {
    if (error instanceof Error && 'status' in error && error.status === 404) {
      return null
    }
    throw error
  }
}
