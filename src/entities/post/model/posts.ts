import { addPost, editPost, fetchPostDetail, fetchPosts, removePost } from '@shared/api/posts'
import { mapNotFoundToNull } from '@shared/lib/api'
import { withAccessTokenRetry } from '@entities/session'

import type { PostDetailDto, PostListDto, PostsUpsertRequest } from '@shared/api/posts'
import type { Post, PostDetail, PostUpsertPayload } from './types'

const toPost = (dto: PostListDto): Post => ({
  id: dto.id,
  title: dto.title,
  code: dto.code,
  authorName: dto.authorName,
  previewPicture: dto.previewPicture,
  tagNames: Array.isArray(dto.tagNames) ? dto.tagNames : [],
  updatedAt: dto.updatedAt,
  createdAt: dto.createdAt,
})

const toPostDetail = (dto: PostDetailDto): PostDetail => ({
  id: dto.id,
  title: dto.title,
  code: dto.code,
  text: dto.text ?? '',
  previewPicture: dto.previewPicture,
  author: dto.author,
  tags: Array.isArray(dto.tags) ? dto.tags : [],
  updatedAt: dto.updatedAt,
  createdAt: dto.createdAt,
})

const toUpsertRequest = (payload: PostUpsertPayload): PostsUpsertRequest => ({
  code: payload.code,
  title: payload.title,
  authorId: payload.authorId,
  tagIds: payload.tagIds,
  text: payload.text,
  previewPictureFile: payload.previewPictureFile,
})

export const getPosts = async (page?: number): Promise<Post[]> => {
  const posts = await withAccessTokenRetry((accessToken) => fetchPosts(accessToken, page))
  return posts.map(toPost)
}

export const getPostById = async (id: number): Promise<PostDetail | null> =>
  mapNotFoundToNull(async () => {
    const post = await withAccessTokenRetry((accessToken) => fetchPostDetail(accessToken, id))
    return toPostDetail(post)
  })

export const createPost = async (payload: PostUpsertPayload): Promise<boolean> =>
  withAccessTokenRetry((accessToken) => addPost(accessToken, toUpsertRequest(payload)))

export const updatePost = async (id: number, payload: PostUpsertPayload): Promise<boolean> =>
  withAccessTokenRetry((accessToken) => editPost(accessToken, id, toUpsertRequest(payload)))

export const deletePost = async (id: number): Promise<boolean> =>
  withAccessTokenRetry((accessToken) => removePost(accessToken, id))
