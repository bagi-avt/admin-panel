import { authFetch, createApiErrorClass, parseJsonResponse } from '@shared/lib/api'

const POSTS_BASE_URL = '/backend-manage/posts'

export const PostsApiError = createApiErrorClass('PostsApiError')

interface PostMediaDto {
  id: number
  name: string
  url: string
}

export interface PostListDto {
  id: number
  title: string
  code: string
  authorName: string
  previewPicture: PostMediaDto | null
  tagNames: string[]
  updatedAt: string
  createdAt: string
}

export interface PostDetailDto {
  id: number
  title: string
  code: string
  text: string
  previewPicture: PostMediaDto | null
  author: {
    id: number
    fullName: string
    avatar: PostMediaDto | null
  }
  tags: Array<{
    id: number
    name: string
    code: string
  }>
  updatedAt: string
  createdAt: string
}

export interface PostsUpsertRequest {
  code: string
  title: string
  authorId: number
  tagIds: number[]
  text: string
  previewPictureFile?: File | null
}

const buildUpsertFormData = (payload: PostsUpsertRequest): FormData => {
  const formData = new FormData()

  formData.append('code', payload.code)
  formData.append('title', payload.title)
  formData.append('authorId', String(payload.authorId))
  formData.append('text', payload.text)

  payload.tagIds.forEach((tagId) => {
    formData.append('tagIds[]', String(tagId))
  })

  if (payload.previewPictureFile) {
    formData.append('previewPicture', payload.previewPictureFile)
  }

  return formData
}

export const fetchPosts = async (accessToken: string, page?: number): Promise<PostListDto[]> => {
  const params = new URLSearchParams()
  if (typeof page === 'number') {
    params.set('page', String(page))
  }

  const query = params.toString()
  const response = await authFetch(
    accessToken,
    `${POSTS_BASE_URL}${query ? `?${query}` : ''}`,
    { method: 'GET' },
    PostsApiError,
  )

  const payload = await parseJsonResponse(response)
  return Array.isArray(payload) ? (payload as PostListDto[]) : []
}

export const fetchPostDetail = async (accessToken: string, id: number): Promise<PostDetailDto> => {
  const response = await authFetch(
    accessToken,
    `${POSTS_BASE_URL}/detail?id=${id}`,
    { method: 'GET' },
    PostsApiError,
  )

  const payload = await parseJsonResponse(response)
  return payload as PostDetailDto
}

export const addPost = async (accessToken: string, payload: PostsUpsertRequest): Promise<boolean> => {
  const response = await authFetch(
    accessToken,
    `${POSTS_BASE_URL}/add`,
    { method: 'POST', body: buildUpsertFormData(payload) },
    PostsApiError,
  )

  return Boolean(await parseJsonResponse(response))
}

export const editPost = async (
  accessToken: string,
  id: number,
  payload: PostsUpsertRequest,
): Promise<boolean> => {
  const response = await authFetch(
    accessToken,
    `${POSTS_BASE_URL}/edit?id=${id}`,
    { method: 'POST', body: buildUpsertFormData(payload) },
    PostsApiError,
  )

  return Boolean(await parseJsonResponse(response))
}

export const removePost = async (accessToken: string, id: number): Promise<boolean> => {
  const response = await authFetch(
    accessToken,
    `${POSTS_BASE_URL}/remove?id=${id}`,
    { method: 'DELETE' },
    PostsApiError,
  )

  return Boolean(await parseJsonResponse(response))
}
