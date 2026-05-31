import { addTag, editTag, fetchTags, removeTag } from '@shared/api/tags'
import { withAccessTokenRetry } from '@entities/session'

import type { TagDto, TagsUpsertRequest } from '@shared/api/tags'
import type { Tag, TagUpsertPayload } from './types'

const toTag = (dto: TagDto): Tag => ({
  id: dto.id,
  name: dto.name,
  code: dto.code,
  sort: dto.sort,
  updatedAt: dto.updatedAt,
  createdAt: dto.createdAt,
})

const toUpsertRequest = (payload: TagUpsertPayload): TagsUpsertRequest => ({
  code: payload.code,
  name: payload.name,
  sort: payload.sort,
})

export const getTags = async (): Promise<Tag[]> => {
  const tags = await withAccessTokenRetry((accessToken) => fetchTags(accessToken))
  return tags.map(toTag)
}

export const getTagById = async (id: number): Promise<Tag | null> => {
  const tags = await getTags()
  return tags.find((item) => item.id === id) ?? null
}

export const createTag = async (payload: TagUpsertPayload): Promise<boolean> =>
  withAccessTokenRetry((accessToken) => addTag(accessToken, toUpsertRequest(payload)))

export const updateTag = async (id: number, payload: TagUpsertPayload): Promise<boolean> =>
  withAccessTokenRetry((accessToken) => editTag(accessToken, id, toUpsertRequest(payload)))

export const deleteTag = async (id: number): Promise<boolean> =>
  withAccessTokenRetry((accessToken) => removeTag(accessToken, id))
