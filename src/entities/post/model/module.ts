import type { ISagaModule } from 'redux-dynamic-modules-saga'

import { postsReducer, POSTS_MODULE_ID, type PostsState } from './state'
import { postsSaga } from './sagas'

export interface PostsModuleState {
  posts: PostsState
}

export const getPostsModule = (): ISagaModule<PostsModuleState> => ({
  id: POSTS_MODULE_ID,
  reducerMap: {
    posts: postsReducer,
  },
  sagas: [postsSaga],
})
