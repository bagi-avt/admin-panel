import { addAuthor, editAuthor, fetchAuthorDetail, fetchAuthors, removeAuthor } from '@shared/api/authors'
import { mapNotFoundToNull } from '@shared/lib/api'
import { withAccessTokenRetry } from '@entities/session'

import type { AuthorDto, AuthorsUpsertRequest } from '@shared/api/authors'

import type { Author, AuthorUpsertPayload } from './types'

const toAuthor = (dto: AuthorDto): Author => ({
  id: dto.id,
  name: dto.name,
  lastName: dto.lastName,
  secondName: dto.secondName,
  shortDescription: dto.shortDescription ?? '',
  description: dto.description ?? '',
  avatar: dto.avatar,
  updatedAt: dto.updatedAt,
  createdAt: dto.createdAt,
})

const toUpsertRequest = (payload: AuthorUpsertPayload): AuthorsUpsertRequest => ({
  name: payload.name,
  lastName: payload.lastName,
  secondName: payload.secondName,
  shortDescription: payload.shortDescription,
  description: payload.description,
  avatarFile: payload.avatarFile,
  removeAvatar: payload.removeAvatar,
})

export const getAuthors = async (): Promise<Author[]> => {
  const authors = await withAccessTokenRetry((accessToken) => fetchAuthors(accessToken))
  return authors.map(toAuthor)
}

export const getAuthorById = async (id: number): Promise<Author | null> =>
  mapNotFoundToNull(async () => {
    const author = await withAccessTokenRetry((accessToken) => fetchAuthorDetail(accessToken, id))
    return toAuthor(author)
  })

export const createAuthor = async (payload: AuthorUpsertPayload): Promise<boolean> =>
  withAccessTokenRetry((accessToken) => addAuthor(accessToken, toUpsertRequest(payload)))

export const updateAuthor = async (id: number, payload: AuthorUpsertPayload): Promise<boolean> =>
  withAccessTokenRetry((accessToken) => editAuthor(accessToken, id, toUpsertRequest(payload)))

export const deleteAuthor = async (id: number): Promise<boolean> =>
  withAccessTokenRetry((accessToken) => removeAuthor(accessToken, id))
