// @ts-ignore
import { combineReducers } from '@reduxjs/toolkit';
import { reducer as profileReducer } from './slices/profile';
import { reducer as dictionariesReducer } from './slices/dictionaries';
import { reducer as organizationsReducer } from './slices/organizations';
import { reducer as configReducer } from './slices/config';
import { reducer as tasksReducer } from 'shared/slices/tasks';
import { reducer as commentsReducer } from 'shared/slices/comments';
import { reducer as newsReducer } from './slices/news';
import { reducer as requestsReducer } from './slices/requests';
import { reducer as financeReducer } from './slices/finance';
import { reducer as helpOffersReducer } from './slices/unionHelpOffers';
import { reducer as chatReducer } from '../shared/slices/chat';
import { reducer as articlesReducer } from './slices/articles';
import { reducer as pollsReducer } from './slices/polls';

const rootReducer = combineReducers({
  profile: profileReducer,
  dictionaries: dictionariesReducer,
  organizations: organizationsReducer,
  helpOffers: helpOffersReducer,
  config: configReducer,
  tasks: tasksReducer,
  comments: commentsReducer,
  news: newsReducer,
  finance: financeReducer,
  chat: chatReducer,
  requests: requestsReducer,
  articles: articlesReducer,
  polls: pollsReducer,
});

export default rootReducer;
