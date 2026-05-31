import { authFetch, createApiErrorClass, parseJsonResponse } from '@shared/lib/api'

const AUTHORS_BASE_URL = '/backend-manage/authors'

export const AuthorsApiError = createApiErrorClass('AuthorsApiError')

export interface AuthorDto {
  id: number
  name: string
  lastName: string
  secondName: string
  shortDescription?: string
  description?: string
  avatar: {
    id: number
    name: string
    url: string
  } | null
  updatedAt: string
  createdAt: string
}

export interface AuthorsUpsertRequest {
  name: string
  lastName: string
  secondName: string
  shortDescription: string
  description: string
  avatarFile?: File | null
  removeAvatar?: boolean
}

const buildUpsertFormData = (payload: AuthorsUpsertRequest): FormData => {
  const formData = new FormData()

  formData.append('name', payload.name)
  formData.append('lastName', payload.lastName)
  formData.append('secondName', payload.secondName)
  formData.append('shortDescription', payload.shortDescription)
  formData.append('description', payload.description)

  if (payload.avatarFile) {
    formData.append('avatar', payload.avatarFile)
  }

  if (typeof payload.removeAvatar === 'boolean') {
    formData.append('removeAvatar', payload.removeAvatar ? '1' : '0')
  }

  return formData
}

export const fetchAuthors = async (accessToken: string): Promise<AuthorDto[]> => {
  const response = await authFetch(accessToken, AUTHORS_BASE_URL, { method: 'GET' }, AuthorsApiError)

  const payload = await parseJsonResponse(response)
  return Array.isArray(payload) ? (payload as AuthorDto[]) : []
}

export const fetchAuthorDetail = async (accessToken: string, id: number): Promise<AuthorDto> => {
  const response = await authFetch(
    accessToken,
    `${AUTHORS_BASE_URL}/detail?id=${id}`,
    { method: 'GET' },
    AuthorsApiError,
  )

  const payload = await parseJsonResponse(response)
  return payload as AuthorDto
}

export const addAuthor = async (accessToken: string, payload: AuthorsUpsertRequest): Promise<boolean> => {
  const response = await authFetch(
    accessToken,
    `${AUTHORS_BASE_URL}/add`,
    { method: 'POST', body: buildUpsertFormData(payload) },
    AuthorsApiError,
  )

  return Boolean(await parseJsonResponse(response))
}

export const editAuthor = async (
  accessToken: string,
  id: number,
  payload: AuthorsUpsertRequest,
): Promise<boolean> => {
  const response = await authFetch(
    accessToken,
    `${AUTHORS_BASE_URL}/edit?id=${id}`,
    { method: 'POST', body: buildUpsertFormData(payload) },
    AuthorsApiError,
  )

  return Boolean(await parseJsonResponse(response))
}

export const removeAuthor = async (accessToken: string, id: number): Promise<boolean> => {
  const response = await authFetch(
    accessToken,
    `${AUTHORS_BASE_URL}/remove?id=${id}`,
    { method: 'DELETE' },
    AuthorsApiError,
  )

  return Boolean(await parseJsonResponse(response))
}
