export interface Tag {
  id: number
  name: string
  code: string
  sort: number
  updatedAt: string
  createdAt: string
}

export interface TagUpsertPayload {
  code: string
  name: string
  sort: number
}
