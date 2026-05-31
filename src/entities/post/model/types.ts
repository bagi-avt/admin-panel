export interface Post {
  id: number
  title: string
  code: string
  authorName: string
  previewPicture: {
    id: number
    name: string
    url: string
  } | null
  tagNames: string[]
  updatedAt: string
  createdAt: string
}

export interface PostDetail {
  id: number
  title: string
  code: string
  text: string
  previewPicture: {
    id: number
    name: string
    url: string
  } | null
  author: {
    id: number
    fullName: string
    avatar: {
      id: number
      name: string
      url: string
    } | null
  }
  tags: Array<{
    id: number
    name: string
    code: string
  }>
  updatedAt: string
  createdAt: string
}

export interface PostUpsertPayload {
  code: string
  title: string
  authorId: number
  tagIds: number[]
  text: string
  previewPictureFile?: File | null
}
