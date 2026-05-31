import { authFetch, createApiErrorClass, parseJsonResponse } from '@shared/lib/api'

const TAGS_BASE_URL = '/backend-manage/tags'

export const TagsApiError = createApiErrorClass('TagsApiError')

export interface TagDto {
  id: number
  name: string
  code: string
  sort: number
  updatedAt: string
  createdAt: string
}

export interface TagsUpsertRequest {
  code: string
  name: string
  sort: number
}

const buildUpsertFormData = (payload: TagsUpsertRequest): FormData => {
  const formData = new FormData()

  formData.append('code', payload.code)
  formData.append('name', payload.name)
  formData.append('sort', String(payload.sort))

  return formData
}

export const fetchTags = async (accessToken: string): Promise<TagDto[]> => {
  const response = await authFetch(accessToken, TAGS_BASE_URL, { method: 'GET' }, TagsApiError)

  const payload = await parseJsonResponse(response)
  return Array.isArray(payload) ? (payload as TagDto[]) : []
}

export const addTag = async (accessToken: string, payload: TagsUpsertRequest): Promise<boolean> => {
  const response = await authFetch(
    accessToken,
    `${TAGS_BASE_URL}/add`,
    { method: 'POST', body: buildUpsertFormData(payload) },
    TagsApiError,
  )

  return Boolean(await parseJsonResponse(response))
}

export const editTag = async (accessToken: string, id: number, payload: TagsUpsertRequest): Promise<boolean> => {
  const response = await authFetch(
    accessToken,
    `${TAGS_BASE_URL}/edit?id=${id}`,
    { method: 'POST', body: buildUpsertFormData(payload) },
    TagsApiError,
  )

  return Boolean(await parseJsonResponse(response))
}

export const removeTag = async (accessToken: string, id: number): Promise<boolean> => {
  const response = await authFetch(
    accessToken,
    `${TAGS_BASE_URL}/remove?id=${id}`,
    { method: 'DELETE' },
    TagsApiError,
  )

  return Boolean(await parseJsonResponse(response))
}
