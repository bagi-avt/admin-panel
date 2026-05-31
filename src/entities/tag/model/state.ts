import type { Tag } from './types'

export interface TagsState {
  list: Tag[]
  isLoading: boolean
  errorMessage: string | null
}

export const TAGS_MODULE_ID = 'tags'

export const TAGS_FETCH_LIST_REQUEST = 'tags/FETCH_LIST_REQUEST'
export const TAGS_FETCH_LIST_SUCCESS = 'tags/FETCH_LIST_SUCCESS'
export const TAGS_FETCH_LIST_FAILURE = 'tags/FETCH_LIST_FAILURE'
export const TAGS_DELETE_REQUEST = 'tags/DELETE_REQUEST'
export const TAGS_DELETE_SUCCESS = 'tags/DELETE_SUCCESS'
export const TAGS_DELETE_FAILURE = 'tags/DELETE_FAILURE'

interface FetchTagsRequestAction {
  type: typeof TAGS_FETCH_LIST_REQUEST
}

interface FetchTagsSuccessAction {
  type: typeof TAGS_FETCH_LIST_SUCCESS
  payload: {
    tags: Tag[]
  }
}

interface FetchTagsFailureAction {
  type: typeof TAGS_FETCH_LIST_FAILURE
  payload: {
    message: string
  }
}

interface DeleteTagRequestAction {
  type: typeof TAGS_DELETE_REQUEST
  payload: {
    tagId: number
  }
}

interface DeleteTagSuccessAction {
  type: typeof TAGS_DELETE_SUCCESS
  payload: {
    tagId: number
  }
}

interface DeleteTagFailureAction {
  type: typeof TAGS_DELETE_FAILURE
  payload: {
    message: string
  }
}

export type TagsAction =
  | FetchTagsRequestAction
  | FetchTagsSuccessAction
  | FetchTagsFailureAction
  | DeleteTagRequestAction
  | DeleteTagSuccessAction
  | DeleteTagFailureAction

const initialState: TagsState = {
  list: [],
  isLoading: false,
  errorMessage: null,
}

export const tagsReducer = (state: TagsState = initialState, action: TagsAction): TagsState => {
  switch (action.type) {
    case TAGS_FETCH_LIST_REQUEST:
      return { ...state, isLoading: true, errorMessage: null }
    case TAGS_FETCH_LIST_SUCCESS:
      return { ...state, isLoading: false, list: action.payload.tags, errorMessage: null }
    case TAGS_FETCH_LIST_FAILURE:
      return { ...state, isLoading: false, errorMessage: action.payload.message }
    case TAGS_DELETE_REQUEST:
      return { ...state, errorMessage: null }
    case TAGS_DELETE_SUCCESS:
      return { ...state, list: state.list.filter((tag) => tag.id !== action.payload.tagId) }
    case TAGS_DELETE_FAILURE:
      return { ...state, errorMessage: action.payload.message }
    default:
      return state
  }
}

export const requestTagsList = (): FetchTagsRequestAction => ({
  type: TAGS_FETCH_LIST_REQUEST,
})

export const requestDeleteTag = (tagId: number): DeleteTagRequestAction => ({
  type: TAGS_DELETE_REQUEST,
  payload: { tagId },
})
