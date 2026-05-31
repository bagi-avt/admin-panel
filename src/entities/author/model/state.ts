import type { Author } from './types'

export interface AuthorsState {
  list: Author[]
  isLoading: boolean
  errorMessage: string | null
}

export const AUTHORS_MODULE_ID = 'authors'

export const AUTHORS_FETCH_LIST_REQUEST = 'authors/FETCH_LIST_REQUEST'
export const AUTHORS_FETCH_LIST_SUCCESS = 'authors/FETCH_LIST_SUCCESS'
export const AUTHORS_FETCH_LIST_FAILURE = 'authors/FETCH_LIST_FAILURE'
export const AUTHORS_DELETE_REQUEST = 'authors/DELETE_REQUEST'
export const AUTHORS_DELETE_SUCCESS = 'authors/DELETE_SUCCESS'
export const AUTHORS_DELETE_FAILURE = 'authors/DELETE_FAILURE'

interface FetchAuthorsRequestAction {
  type: typeof AUTHORS_FETCH_LIST_REQUEST
}

interface FetchAuthorsSuccessAction {
  type: typeof AUTHORS_FETCH_LIST_SUCCESS
  payload: {
    authors: Author[]
  }
}

interface FetchAuthorsFailureAction {
  type: typeof AUTHORS_FETCH_LIST_FAILURE
  payload: {
    message: string
  }
}

interface DeleteAuthorRequestAction {
  type: typeof AUTHORS_DELETE_REQUEST
  payload: {
    authorId: number
  }
}

interface DeleteAuthorSuccessAction {
  type: typeof AUTHORS_DELETE_SUCCESS
  payload: {
    authorId: number
  }
}

interface DeleteAuthorFailureAction {
  type: typeof AUTHORS_DELETE_FAILURE
  payload: {
    message: string
  }
}

export type AuthorsAction =
  | FetchAuthorsRequestAction
  | FetchAuthorsSuccessAction
  | FetchAuthorsFailureAction
  | DeleteAuthorRequestAction
  | DeleteAuthorSuccessAction
  | DeleteAuthorFailureAction

const initialState: AuthorsState = {
  list: [],
  isLoading: false,
  errorMessage: null,
}

export const authorsReducer = (state: AuthorsState = initialState, action: AuthorsAction): AuthorsState => {
  switch (action.type) {
    case AUTHORS_FETCH_LIST_REQUEST:
      return { ...state, isLoading: true, errorMessage: null }
    case AUTHORS_FETCH_LIST_SUCCESS:
      return { ...state, isLoading: false, list: action.payload.authors, errorMessage: null }
    case AUTHORS_FETCH_LIST_FAILURE:
      return { ...state, isLoading: false, errorMessage: action.payload.message }
    case AUTHORS_DELETE_REQUEST:
      return { ...state, errorMessage: null }
    case AUTHORS_DELETE_SUCCESS:
      return { ...state, list: state.list.filter((author) => author.id !== action.payload.authorId) }
    case AUTHORS_DELETE_FAILURE:
      return { ...state, errorMessage: action.payload.message }
    default:
      return state
  }
}

export const requestAuthorsList = (): FetchAuthorsRequestAction => ({
  type: AUTHORS_FETCH_LIST_REQUEST,
})

export const requestDeleteAuthor = (authorId: number): DeleteAuthorRequestAction => ({
  type: AUTHORS_DELETE_REQUEST,
  payload: { authorId },
})
