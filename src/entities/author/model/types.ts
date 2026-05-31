export interface Author {
  id: number
  name: string
  lastName: string
  secondName: string
  shortDescription: string
  description: string
  avatar: {
    id: number
    name: string
    url: string
  } | null
  updatedAt: string
  createdAt: string
}

export interface AuthorUpsertPayload {
  name: string
  lastName: string
  secondName: string
  shortDescription: string
  description: string
  avatarFile?: File | null
  removeAvatar?: boolean
}
