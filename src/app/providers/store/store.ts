import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createStore } from 'redux-dynamic-modules';
import { getSagaExtension } from 'redux-dynamic-modules-saga';
import { compose } from 'redux'
import type { RouterState } from 'connected-react-router'

import { history } from '../router/history'
import type { AuthModuleState } from '@features/auth-by-email/model/module'
import { getAuthModule } from '@features/auth-by-email/model/module'
import type { PostsModuleState } from '@entities/post/model/module'
import { getPostsModule } from '@entities/post/model/module'
import type { TagsModuleState } from '@entities/tag'
import { getTagsModule } from '@entities/tag'
import type { AuthorsModuleState } from '@entities/author/model/module'
import { getAuthorsModule } from '@entities/author/model/module'

export interface StaticState {
  router: RouterState
}

export type RootState = StaticState &
  Partial<AuthModuleState> &
  Partial<PostsModuleState> &
  Partial<TagsModuleState> &
  Partial<AuthorsModuleState>

export const store = createStore<RootState>(
  {
    advancedComposeEnhancers: compose,
    extensions: [getSagaExtension()],
  },
  {
    id: 'core',
    reducerMap: {
      router: connectRouter(history),
    },
    middlewares: [routerMiddleware(history)],
    initialActions: [],
  },
  getAuthModule(),
  getPostsModule(),
  getTagsModule(),
  getAuthorsModule(),
)

export type AppStore = typeof store
export type AppDispatch = AppStore['dispatch']
