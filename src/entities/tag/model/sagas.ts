import { call, put, takeLatest } from 'redux-saga/effects'

import { getErrorMessage } from '@shared/lib/error'

import { deleteTag, getTags } from './tags'
import {
  TAGS_DELETE_FAILURE,
  TAGS_DELETE_REQUEST,
  TAGS_DELETE_SUCCESS,
  TAGS_FETCH_LIST_FAILURE,
  TAGS_FETCH_LIST_REQUEST,
  TAGS_FETCH_LIST_SUCCESS,
  type TagsAction,
} from './state'
import type { Tag } from './types'

function* fetchTagsWorker() {
  try {
    const tags: Tag[] = yield call(getTags)
    yield put<TagsAction>({ type: TAGS_FETCH_LIST_SUCCESS, payload: { tags } })
  } catch (error) {
    yield put<TagsAction>({
      type: TAGS_FETCH_LIST_FAILURE,
      payload: { message: getErrorMessage(error, 'Не удалось загрузить список тегов') },
    })
  }
}

function* deleteTagWorker(action: Extract<TagsAction, { type: typeof TAGS_DELETE_REQUEST }>) {
  try {
    const deleted: boolean = yield call(deleteTag, action.payload.tagId)
    if (!deleted) {
      return
    }
    yield put<TagsAction>({
      type: TAGS_DELETE_SUCCESS,
      payload: { tagId: action.payload.tagId },
    })
  } catch (error) {
    yield put<TagsAction>({
      type: TAGS_DELETE_FAILURE,
      payload: { message: getErrorMessage(error, 'Не удалось удалить тег') },
    })
  }
}

export function* tagsSaga() {
  yield takeLatest(TAGS_FETCH_LIST_REQUEST, fetchTagsWorker)
  yield takeLatest(TAGS_DELETE_REQUEST, deleteTagWorker)
}
