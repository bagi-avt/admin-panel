import { call, put, takeLatest } from 'redux-saga/effects'

import { getErrorMessage } from '@shared/lib/error'

import { ensureValidAccessToken, loginByEmail, logout } from './authGateway'
import {
  AUTH_CHECK_FAILURE,
  AUTH_CHECK_REQUEST,
  AUTH_CHECK_SUCCESS,
  AUTH_LOGIN_FAILURE,
  AUTH_LOGIN_REQUEST,
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGOUT_REQUEST,
  type AuthAction,
} from './state'

function* checkAuthWorker() {
  try {
    const token: string | null = yield call(ensureValidAccessToken)
    yield put<AuthAction>({
      type: AUTH_CHECK_SUCCESS,
      payload: { isAuthenticated: Boolean(token) },
    })
  } catch {
    yield put<AuthAction>({ type: AUTH_CHECK_FAILURE })
  }
}

function* loginByEmailWorker(action: Extract<AuthAction, { type: typeof AUTH_LOGIN_REQUEST }>) {
  try {
    yield call(loginByEmail, action.payload.email, action.payload.password)
    yield put<AuthAction>({ type: AUTH_LOGIN_SUCCESS })
  } catch (error) {
    yield put<AuthAction>({
      type: AUTH_LOGIN_FAILURE,
      payload: { message: getErrorMessage(error, 'Не удалось выполнить вход') },
    })
  }
}

function* logoutWorker() {
  yield call(logout)
}

export function* authSaga() {
  yield takeLatest(AUTH_CHECK_REQUEST, checkAuthWorker)
  yield takeLatest(AUTH_LOGIN_REQUEST, loginByEmailWorker)
  yield takeLatest(AUTH_LOGOUT_REQUEST, logoutWorker)
}
