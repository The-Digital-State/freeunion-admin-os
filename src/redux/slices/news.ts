import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  createNews,
  deleteAbuse,
  deleteAutoPostingChannel,
  deleteNews,
  getAbuses,
  getAutoPostingTelegrams,
  getNews,
  publishNews,
  updateNews,
} from '../../services/api/news';
import type { AppThunk } from '..';
import { NewsAbuses, LightweightNews, NewsData, NewsAutoPost, NewsMeta } from 'types/news';

export type NewsState = {
  data: (LightweightNews | NewsData)[];
  newsAbuses: NewsAbuses[];
  currentMeta: NewsMeta;
  autoPostingTelegrams: NewsAutoPost[];
  isLoading: boolean;
};

const initialState: NewsState = {
  data: [],
  currentMeta: null,
  newsAbuses: [],
  autoPostingTelegrams: [],
  isLoading: false,
};

const slice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    setNewsAction(state: NewsState, { payload }: PayloadAction<LightweightNews[]>): NewsState {
      return {
        ...state,
        data: payload,
      };
    },
    setNewsCurrentAction(
      state: NewsState,
      { payload }: PayloadAction<{ data: LightweightNews[]; meta: NewsMeta }>
    ): NewsState {
      return {
        ...state,
        data: payload.data,
        currentMeta: payload.meta,
      };
    },
    addNewsAction(state: NewsState, { payload }: PayloadAction<NewsData>): NewsState {
      return {
        ...state,
        data: [...state.data, payload],
      };
    },
    deleteNewsAction(state: NewsState, { payload }: PayloadAction<number>): NewsState {
      return {
        ...state,
        data: state.data.filter((news) => news?.id !== payload),
      };
    },
    delteAutoPostingTelegramsAction(state: NewsState, { payload }: PayloadAction<number>): NewsState {
      return {
        ...state,
        autoPostingTelegrams: state.autoPostingTelegrams.filter((channel) => channel?.id !== payload),
      };
    },
    setPublishAction(state: NewsState, { payload }: PayloadAction<number>): NewsState {
      return {
        ...state,
        data: state.data.map((news) => ({
          ...news,
          ...(news?.id === payload && { published: true }),
        })),
      };
    },
    setNewsAbusesAction(state: NewsState, { payload }: PayloadAction<NewsAbuses[]>): NewsState {
      return {
        ...state,
        newsAbuses: payload,
      };
    },
    setAutoPostingTelegramsAction(state: NewsState, { payload }: PayloadAction<NewsAutoPost[]>): NewsState {
      return {
        ...state,
        autoPostingTelegrams: payload,
      };
    },
    deleteNewsAbuseAction(state: NewsState, { payload }: PayloadAction<number>): NewsState {
      return {
        ...state,
        newsAbuses: state.newsAbuses.filter((abuse) => abuse?.id !== payload),
      };
    },

    startLoading(state: NewsState): NewsState {
      return {
        ...state,
        isLoading: true,
      };
    },
    finishLoading(state: NewsState): NewsState {
      return {
        ...state,
        isLoading: false,
      };
    },
  },
});

export const { reducer } = slice;
export const {
  actions: {
    setNewsAction,
    deleteNewsAction,
    startLoading,
    finishLoading,
    addNewsAction,
    setPublishAction,
    setNewsAbusesAction,
    deleteNewsAbuseAction,
    setAutoPostingTelegramsAction,
    delteAutoPostingTelegramsAction,
    setNewsCurrentAction,
  },
} = slice;

export const getNewsThunk =
  (orgId: string, limit?: number, page?: number, published?: string): AppThunk =>
  async (dispatch): Promise<void> => {
    dispatch(startLoading());
    const news = await getNews({ orgId: orgId, limit: limit, page: page, published: published });
    dispatch(setNewsCurrentAction(news));

    dispatch(finishLoading());
  };

export const updateNewsThunk =
  (orgId: string, newsId: number, data: Partial<NewsData>, publish: boolean): AppThunk =>
  async (dispatch): Promise<void> => {
    dispatch(startLoading());
    await updateNews(orgId, newsId, data);

    if (publish) {
      await publishNews(orgId, newsId);
      dispatch(setPublishAction(newsId));
    }
    dispatch(finishLoading());
  };

export const createNewsThunk =
  (orgId: string, data: Partial<NewsData>, publish: boolean): AppThunk =>
  async (dispatch): Promise<void> => {
    dispatch(startLoading());
    const createdNews = await createNews(orgId, data);

    window.dataLayer.push({
      event: 'event',
      eventProps: {
        category: 'news',
        action: 'create',
      },
    });

    dispatch(addNewsAction(createdNews));
    if (publish) {
      await publishNews(orgId, createdNews.id);
      dispatch(setPublishAction(createdNews.id));
    }
    dispatch(finishLoading());
  };

export const deleteNewsThunk =
  (orgId: string, newsId: number): AppThunk =>
  async (dispatch): Promise<void> => {
    dispatch(startLoading());
    await deleteNews(orgId, newsId);
    dispatch(deleteNewsAction(newsId));
    dispatch(finishLoading());
  };

export const getNewsAbusesThunk =
  (orgId: string): AppThunk =>
  async (dispatch): Promise<void> => {
    dispatch(startLoading());
    const newsAbuses = await getAbuses(orgId);
    dispatch(setNewsAbusesAction(newsAbuses));

    dispatch(finishLoading());
  };

export const deleteNewsAbusesThunk =
  (orgId: string, abuseId: number): AppThunk =>
  async (dispatch): Promise<void> => {
    dispatch(startLoading());
    await deleteAbuse(orgId, abuseId);
    dispatch(deleteNewsAbuseAction(abuseId));
    dispatch(finishLoading());
  };

export const changeNewsThunk =
  (newsData: LightweightNews[]): AppThunk =>
  async (dispatch): Promise<void> => {
    dispatch(startLoading());

    dispatch(setNewsAction(newsData));
    dispatch(finishLoading());
  };

export const getAutoPostingTelegramsThunk =
  (orgId: string): AppThunk =>
  async (dispatch): Promise<void> => {
    dispatch(startLoading());
    const autoPostingTelegrams = await getAutoPostingTelegrams(orgId);
    dispatch(setAutoPostingTelegramsAction(autoPostingTelegrams));
    dispatch(finishLoading());
  };

export const deleteAutoPostingChannelThunk =
  (orgId: string, channelId: number): AppThunk =>
  async (dispatch): Promise<void> => {
    dispatch(startLoading());
    await deleteAutoPostingChannel(orgId, channelId);
    dispatch(delteAutoPostingTelegramsAction(channelId));
    dispatch(finishLoading());
  };

export default slice;
