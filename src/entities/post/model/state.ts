import type { Post, PostDetail } from './types'

export interface PostsState {
  list: Post[]
  details: PostDetail | null
  isLoadingList: boolean
  isLoadingDetails: boolean
  errorMessage: string | null
}

export const POSTS_MODULE_ID = 'posts'

export const POSTS_FETCH_LIST_REQUEST = 'posts/FETCH_LIST_REQUEST'
export const POSTS_FETCH_LIST_SUCCESS = 'posts/FETCH_LIST_SUCCESS'
export const POSTS_FETCH_LIST_FAILURE = 'posts/FETCH_LIST_FAILURE'

export const POSTS_FETCH_DETAILS_REQUEST = 'posts/FETCH_DETAILS_REQUEST'
export const POSTS_FETCH_DETAILS_SUCCESS = 'posts/FETCH_DETAILS_SUCCESS'
export const POSTS_FETCH_DETAILS_FAILURE = 'posts/FETCH_DETAILS_FAILURE'

export const POSTS_DELETE_REQUEST = 'posts/DELETE_REQUEST'
export const POSTS_DELETE_SUCCESS = 'posts/DELETE_SUCCESS'
export const POSTS_DELETE_FAILURE = 'posts/DELETE_FAILURE'

interface FetchPostsRequestAction {
  type: typeof POSTS_FETCH_LIST_REQUEST
}

interface FetchPostsSuccessAction {
  type: typeof POSTS_FETCH_LIST_SUCCESS
  payload: {
    posts: Post[]
  }
}

interface FetchPostsFailureAction {
  type: typeof POSTS_FETCH_LIST_FAILURE
  payload: {
    message: string
  }
}

interface FetchPostDetailsRequestAction {
  type: typeof POSTS_FETCH_DETAILS_REQUEST
  payload: {
    postId: number
  }
}

interface FetchPostDetailsSuccessAction {
  type: typeof POSTS_FETCH_DETAILS_SUCCESS
  payload: {
    post: PostDetail | null
  }
}

interface FetchPostDetailsFailureAction {
  type: typeof POSTS_FETCH_DETAILS_FAILURE
  payload: {
    message: string
  }
}

interface DeletePostRequestAction {
  type: typeof POSTS_DELETE_REQUEST
  payload: {
    postId: number
  }
}

interface DeletePostSuccessAction {
  type: typeof POSTS_DELETE_SUCCESS
  payload: {
    postId: number
  }
}

interface DeletePostFailureAction {
  type: typeof POSTS_DELETE_FAILURE
  payload: {
    message: string
  }
}

export type PostsAction =
  | FetchPostsRequestAction
  | FetchPostsSuccessAction
  | FetchPostsFailureAction
  | FetchPostDetailsRequestAction
  | FetchPostDetailsSuccessAction
  | FetchPostDetailsFailureAction
  | DeletePostRequestAction
  | DeletePostSuccessAction
  | DeletePostFailureAction

const initialState: PostsState = {
  list: [],
  details: null,
  isLoadingList: false,
  isLoadingDetails: false,
  errorMessage: null,
}

export const postsReducer = (state: PostsState = initialState, action: PostsAction): PostsState => {
  switch (action.type) {
    case POSTS_FETCH_LIST_REQUEST:
      return { ...state, isLoadingList: true, errorMessage: null }
    case POSTS_FETCH_LIST_SUCCESS:
      return { ...state, isLoadingList: false, list: action.payload.posts, errorMessage: null }
    case POSTS_FETCH_LIST_FAILURE:
      return { ...state, isLoadingList: false, errorMessage: action.payload.message }
    case POSTS_FETCH_DETAILS_REQUEST:
      return { ...state, isLoadingDetails: true, errorMessage: null, details: null }
    case POSTS_FETCH_DETAILS_SUCCESS:
      return { ...state, isLoadingDetails: false, details: action.payload.post, errorMessage: null }
    case POSTS_FETCH_DETAILS_FAILURE:
      return { ...state, isLoadingDetails: false, errorMessage: action.payload.message }
    case POSTS_DELETE_REQUEST:
      return { ...state, errorMessage: null }
    case POSTS_DELETE_SUCCESS:
      return {
        ...state,
        list: state.list.filter((post) => post.id !== action.payload.postId),
      }
    case POSTS_DELETE_FAILURE:
      return { ...state, errorMessage: action.payload.message }
    default:
      return state
  }
}

export const requestPostsList = (): FetchPostsRequestAction => ({
  type: POSTS_FETCH_LIST_REQUEST,
})

export const requestPostDetails = (postId: number): FetchPostDetailsRequestAction => ({
  type: POSTS_FETCH_DETAILS_REQUEST,
  payload: { postId },
})

export const requestDeletePost = (postId: number): DeletePostRequestAction => ({
  type: POSTS_DELETE_REQUEST,
  payload: { postId },
})
