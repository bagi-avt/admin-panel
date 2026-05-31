export interface TokensResponse {
  access_token: string
  refresh_token: string
  access_expired_at: number
  refresh_expired_at: number
}

export interface ApiErrorPayload {
  name?: string
  message?: string
  code?: number
  status?: number
  type?: string
}

export interface ValidationErrorItem {
  field?: string
  message?: string
}
