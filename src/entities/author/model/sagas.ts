import { call, put, takeLatest } from 'redux-saga/effects'

import { getErrorMessage } from '@shared/lib/error'

import { deleteAuthor, getAuthors } from './authors'
import {
  AUTHORS_DELETE_FAILURE,
  AUTHORS_DELETE_REQUEST,
  AUTHORS_DELETE_SUCCESS,
  AUTHORS_FETCH_LIST_FAILURE,
  AUTHORS_FETCH_LIST_REQUEST,
  AUTHORS_FETCH_LIST_SUCCESS,
  type AuthorsAction,
} from './state'
import type { Author } from './types'

function* fetchAuthorsWorker() {
  try {
    const authors: Author[] = yield call(getAuthors)
    yield put<AuthorsAction>({ type: AUTHORS_FETCH_LIST_SUCCESS, payload: { authors } })
  } catch (error) {
    yield put<AuthorsAction>({
      type: AUTHORS_FETCH_LIST_FAILURE,
      payload: { message: getErrorMessage(error, 'Не удалось загрузить список авторов') },
    })
  }
}

function* deleteAuthorWorker(action: Extract<AuthorsAction, { type: typeof AUTHORS_DELETE_REQUEST }>) {
  try {
    const deleted: boolean = yield call(deleteAuthor, action.payload.authorId)
    if (!deleted) {
      return
    }
    yield put<AuthorsAction>({
      type: AUTHORS_DELETE_SUCCESS,
      payload: { authorId: action.payload.authorId },
    })
  } catch (error) {
    yield put<AuthorsAction>({
      type: AUTHORS_DELETE_FAILURE,
      payload: { message: getErrorMessage(error, 'Не удалось удалить автора') },
    })
  }
}

export function* authorsSaga() {
  yield takeLatest(AUTHORS_FETCH_LIST_REQUEST, fetchAuthorsWorker)
  yield takeLatest(AUTHORS_DELETE_REQUEST, deleteAuthorWorker)
}
