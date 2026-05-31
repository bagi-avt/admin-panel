import { call, put, takeLatest } from 'redux-saga/effects'

import { getErrorMessage } from '@shared/lib/error'

import { deletePost, getPostById, getPosts } from './posts'
import {
  POSTS_DELETE_FAILURE,
  POSTS_DELETE_REQUEST,
  POSTS_DELETE_SUCCESS,
  POSTS_FETCH_DETAILS_FAILURE,
  POSTS_FETCH_DETAILS_REQUEST,
  POSTS_FETCH_DETAILS_SUCCESS,
  POSTS_FETCH_LIST_FAILURE,
  POSTS_FETCH_LIST_REQUEST,
  POSTS_FETCH_LIST_SUCCESS,
  type PostsAction,
} from './state'
import type { Post, PostDetail } from './types'

function* fetchPostsListWorker() {
  try {
    const posts: Post[] = yield call(getPosts)
    yield put<PostsAction>({
      type: POSTS_FETCH_LIST_SUCCESS,
      payload: { posts },
    })
  } catch (error) {
    yield put<PostsAction>({
      type: POSTS_FETCH_LIST_FAILURE,
      payload: { message: getErrorMessage(error, 'Не удалось загрузить список постов') },
    })
  }
}

function* fetchPostDetailsWorker(action: Extract<PostsAction, { type: typeof POSTS_FETCH_DETAILS_REQUEST }>) {
  try {
    const post: PostDetail | null = yield call(getPostById, action.payload.postId)
    yield put<PostsAction>({
      type: POSTS_FETCH_DETAILS_SUCCESS,
      payload: { post },
    })
  } catch (error) {
    yield put<PostsAction>({
      type: POSTS_FETCH_DETAILS_FAILURE,
      payload: { message: getErrorMessage(error, 'Не удалось загрузить пост') },
    })
  }
}

function* deletePostWorker(action: Extract<PostsAction, { type: typeof POSTS_DELETE_REQUEST }>) {
  try {
    const deleted: boolean = yield call(deletePost, action.payload.postId)
    if (!deleted) {
      return
    }

    yield put<PostsAction>({
      type: POSTS_DELETE_SUCCESS,
      payload: { postId: action.payload.postId },
    })
  } catch (error) {
    yield put<PostsAction>({
      type: POSTS_DELETE_FAILURE,
      payload: { message: getErrorMessage(error, 'Не удалось удалить пост') },
    })
  }
}

export function* postsSaga() {
  yield takeLatest(POSTS_FETCH_LIST_REQUEST, fetchPostsListWorker)
  yield takeLatest(POSTS_FETCH_DETAILS_REQUEST, fetchPostDetailsWorker)
  yield takeLatest(POSTS_DELETE_REQUEST, deletePostWorker)
}
