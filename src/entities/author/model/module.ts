import type { ISagaModule } from 'redux-dynamic-modules-saga'

import { authorsReducer, AUTHORS_MODULE_ID, type AuthorsState } from './state'
import { authorsSaga } from './sagas'

export interface AuthorsModuleState {
  authors: AuthorsState
}

export const getAuthorsModule = (): ISagaModule<AuthorsModuleState> => ({
  id: AUTHORS_MODULE_ID,
  reducerMap: {
    authors: authorsReducer,
  },
  sagas: [authorsSaga],
})
