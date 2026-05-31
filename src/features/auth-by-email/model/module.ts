import type { ISagaModule } from 'redux-dynamic-modules-saga'

import { authReducer, AUTH_MODULE_ID, type AuthState } from './state'
import { authSaga } from './sagas'

export interface AuthModuleState {
  auth: AuthState
}

export const getAuthModule = (): ISagaModule<AuthModuleState> => ({
  id: AUTH_MODULE_ID,
  reducerMap: {
    auth: authReducer,
  },
  sagas: [authSaga],
})
