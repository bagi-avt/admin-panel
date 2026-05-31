import type { ISagaModule } from 'redux-dynamic-modules-saga'

import { tagsReducer, TAGS_MODULE_ID, type TagsState } from './state'
import { tagsSaga } from './sagas'

export interface TagsModuleState {
  tags: TagsState
}

export const getTagsModule = (): ISagaModule<TagsModuleState> => ({
  id: TAGS_MODULE_ID,
  reducerMap: {
    tags: tagsReducer,
  },
  sagas: [tagsSaga],
})
