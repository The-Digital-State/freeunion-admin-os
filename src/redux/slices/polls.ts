import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppThunk } from '..';
import { PollType, PollQuestionType, PollsTypes } from 'shared/interfaces/polls';
import {
  closePoll,
  createPoll,
  createQuestion,
  deletePoll,
  deleteQuestion,
  getPolls,
  getQuestions,
  publishPoll,
  updatePoll,
  updateQuestion,
} from 'services/api/polls';
import { cloneDeep } from 'lodash';

export type PollsState = {
  polls: PollType[];
  questions: { pollId: number; questions: PollQuestionType[] }[];
  isLoading: boolean;
  isLoadingQuestions: number;
  totalPolls: { total: number; page: number };
  pollsTypes: PollsTypes;
};

const initialState: PollsState = {
  polls: [],
  totalPolls: { total: 0, page: 1 },
  questions: [],
  isLoading: false,
  isLoadingQuestions: null,
  pollsTypes: PollsTypes.creating,
};

const slice = createSlice({
  name: 'polls',
  initialState,
  reducers: {
    //POLLS REDUCERS-----------------------------------------------------------------
    setPollsTypesReducer(state: PollsState, { payload }: PayloadAction<PollsTypes>): PollsState {
      return {
        ...state,
        pollsTypes: payload,
      };
    },
    setFirstPollsReducer(state: PollsState, { payload }: PayloadAction<PollType[]>): PollsState {
      return {
        ...state,
        polls: payload,
      };
    },
    setTotalCreatingPollsReducer(
      state: PollsState,
      { payload }: PayloadAction<{ total: number; page: number }>
    ): PollsState {
      return {
        ...state,
        totalPolls: payload,
      };
    },
    setPollsReducer(state: PollsState, { payload }: PayloadAction<PollType[]>): PollsState {
      return {
        ...state,
        polls: [...state.polls, ...payload],
      };
    },
    addPollReducer(state: PollsState, { payload }: PayloadAction<PollType>): PollsState {
      return {
        ...state,
        polls: [payload, ...state.polls],
      };
    },
    updatePollReducer(state: PollsState, { payload }: PayloadAction<PollType>): PollsState {
      return {
        ...state,
        polls: state.polls.map((poll) => ({
          ...poll,
          ...(poll?.id === payload.id && payload),
        })),
      };
    },
    setPublishPollReducer(state: PollsState, { payload }: PayloadAction<number>): PollsState {
      return {
        ...state,
        polls: state.polls.map((poll) => ({
          ...poll,
          ...(poll?.id === payload && { published: true }),
        })),
      };
    },
    setClosePollReducer(state: PollsState, { payload }: PayloadAction<number>): PollsState {
      return {
        ...state,
        polls: state.polls.map((poll) => ({
          ...poll,
          ...(poll?.id === payload && { published: false }),
        })),
      };
    },
    deletePollReducer(state: PollsState, { payload }: PayloadAction<number>): PollsState {
      return {
        ...state,
        polls: state.polls.filter((poll) => poll.id !== payload),
      };
    },
    //QUESTIONS REDUCERS--------------------------------------------------------------

    setQuestionsReducer(
      state: PollsState,
      { payload }: PayloadAction<{ pollId: number; questions: PollQuestionType[] }>
    ): PollsState {
      let cloneQuestions = cloneDeep(state.questions);
      if (!!cloneQuestions.find((question) => question.pollId === payload.pollId)) {
        let pollQuestions = cloneQuestions.find((question) => question.pollId === payload.pollId);
        pollQuestions.questions = payload.questions;
        const newQuesions = cloneQuestions.map((question) => {
          if (question.pollId === payload.pollId) {
            return pollQuestions;
          }
          return question;
        });
        return {
          ...state,
          questions: newQuesions,
        };
      } else {
        return {
          ...state,
          questions: [...state.questions, payload],
        };
      }
    },
    addQuestionReducer(
      state: PollsState,
      { payload }: PayloadAction<{ pollId: number; question: PollQuestionType }>
    ): PollsState {
      let cloneQuestions = cloneDeep(state.questions);
      let pollQuestions = cloneQuestions.find((question) => question.pollId === payload.pollId);
      pollQuestions.questions = [...pollQuestions.questions, payload.question];
      const newQuesions = cloneQuestions.map((question) => {
        if (question.pollId === payload.pollId) {
          return pollQuestions;
        }
        return question;
      });
      return {
        ...state,
        questions: newQuesions,
      };
    },
    updateQuestionReducer(
      state: PollsState,
      { payload }: PayloadAction<{ pollId: number; question: PollQuestionType }>
    ): PollsState {
      let cloneQuestions = cloneDeep(state.questions);
      let pollQuestions = cloneQuestions.find((question) => question.pollId === payload.pollId);
      let updatePollQuestionsCopy = cloneDeep(pollQuestions);
      updatePollQuestionsCopy.questions = updatePollQuestionsCopy.questions.map((question) => {
        if (question.id === payload.question.id) {
          return payload.question;
        }
        return question;
      });
      const updatedQuesions = cloneQuestions.map((question) => {
        if (question.pollId === payload.pollId) {
          return updatePollQuestionsCopy;
        }
        return question;
      });
      return {
        ...state,
        questions: updatedQuesions,
      };
    },
    deleteQuestionReducer(
      state: PollsState,
      { payload }: PayloadAction<{ pollId: number; questionId: number }>
    ): PollsState {
      let cloneQuestions = cloneDeep(state.questions);
      let pollQuestions = cloneQuestions.find((question) => question.pollId === payload.pollId);
      pollQuestions.questions = pollQuestions.questions.filter((question) => question.id !== payload.questionId);
      const newQuesions = cloneQuestions.map((question) => {
        if (question.pollId === payload.pollId) {
          return pollQuestions;
        }
        return question;
      });
      return {
        ...state,
        questions: newQuesions,
      };
    },

    startLoading(state: PollsState, { payload }: PayloadAction<number>): PollsState {
      if (!payload) {
        return {
          ...state,
          isLoading: true,
        };
      } else {
        return {
          ...state,
          isLoadingQuestions: payload,
        };
      }
    },
    finishLoading(state: PollsState, { payload }: PayloadAction<number>): PollsState {
      if (!payload) {
        return {
          ...state,
          isLoading: false,
        };
      } else {
        return {
          ...state,
          isLoadingQuestions: null,
        };
      }
    },
  },
});

export const { reducer } = slice;
export const {
  actions: {
    setPollsTypesReducer,
    setFirstPollsReducer,
    setPollsReducer,
    setTotalCreatingPollsReducer,
    addPollReducer,
    updatePollReducer,
    setPublishPollReducer,
    setClosePollReducer,
    deletePollReducer,
    setQuestionsReducer,
    addQuestionReducer,
    updateQuestionReducer,
    deleteQuestionReducer,
    startLoading,
    finishLoading,
  },
} = slice;

//POLLS ACTIONS------------------------------------------------------------------------------------------

export const setPollsTypesAction =
  (pollsType: PollsTypes): AppThunk =>
  async (dispatch): Promise<void> => {
    dispatch(setPollsTypesReducer(pollsType));
  };

export const getPollsAction =
  (orgId: number, page: number, limit: number, isFirstTime?: boolean): AppThunk =>
  async (dispatch, getState): Promise<void> => {
    const {
      polls: { pollsTypes },
    } = getState();
    if (!!isFirstTime) {
      dispatch(startLoading());
    }

    const { data, meta } = await getPolls({
      orgId,
      page,
      limit,
      published: pollsTypes === PollsTypes.creating ? 0 : undefined,
      is_closed: pollsTypes === PollsTypes.closed ? 1 : pollsTypes === PollsTypes.active ? 0 : undefined,
    });
    if (!!isFirstTime) {
      dispatch(setFirstPollsReducer(data));
    } else {
      dispatch(setPollsReducer(data));
    }
    dispatch(setTotalCreatingPollsReducer({ total: meta.total, page: meta.current_page }));
    if (!!isFirstTime) {
      dispatch(finishLoading());
    }
  };

export const createPollAction =
  (poll: Omit<PollType, 'id'>, orgId: number): AppThunk =>
  async (dispatch, getState): Promise<number> => {
    const {
      polls: { pollsTypes },
    } = getState();
    dispatch(startLoading());
    const newPoll = await createPoll(poll, orgId);
    const { data, meta } = await getPolls({
      orgId,
      page: 1,
      limit: 10,
      published: pollsTypes === PollsTypes.creating ? 0 : undefined,
      is_active: pollsTypes === PollsTypes.active ? 1 : undefined,
      is_closed: pollsTypes === PollsTypes.closed ? 1 : undefined,
    });
    dispatch(setFirstPollsReducer(data));

    dispatch(setTotalCreatingPollsReducer({ total: meta.total, page: meta.current_page }));

    dispatch(finishLoading());
    return newPoll.id;
  };

export const updatePollAction =
  (poll: PollType, orgId: number, pollId: number): AppThunk =>
  async (dispatch): Promise<void> => {
    dispatch(startLoading());
    const updatedPoll = await updatePoll(poll, orgId, pollId);
    dispatch(updatePollReducer(updatedPoll));

    dispatch(finishLoading());
  };

export const publishPollAction =
  (orgId: number, pollId: number, poll: PollType): AppThunk =>
  async (dispatch): Promise<void> => {
    dispatch(startLoading());
    await publishPoll(orgId, pollId, poll);
    dispatch(setPublishPollReducer(pollId));

    dispatch(finishLoading());
  };

export const closePollAction =
  (orgId: number, pollId: number): AppThunk =>
  async (dispatch): Promise<void> => {
    dispatch(startLoading());
    await closePoll(orgId, pollId);
    dispatch(setClosePollReducer(pollId));

    dispatch(finishLoading());
  };

export const deletePollAction =
  (orgId: number, pollId: number): AppThunk =>
  async (dispatch, getState): Promise<void> => {
    const {
      polls: { pollsTypes },
    } = getState();
    dispatch(startLoading());
    await deletePoll(orgId, pollId);
    const { data, meta } = await getPolls({
      orgId,
      page: 1,
      limit: 10,
      published: pollsTypes === PollsTypes.creating ? 0 : undefined,
      is_active: pollsTypes === PollsTypes.active ? 1 : undefined,
      is_closed: pollsTypes === PollsTypes.closed ? 1 : undefined,
    });
    dispatch(setFirstPollsReducer(data));

    dispatch(setTotalCreatingPollsReducer({ total: meta.total, page: meta.current_page }));

    dispatch(finishLoading());
  };

//QUESTIONS ACTIONS------------------------------------------------------------------------------------------

export const getQuestionsAction =
  (orgId: number, pollId?: number, page?: number, limit?: number, isFirstTime?: boolean): AppThunk =>
  async (dispatch): Promise<void> => {
    dispatch(startLoading(pollId));
    const questions = await getQuestions({ orgId, pollId });

    dispatch(setQuestionsReducer({ pollId: pollId, questions: questions }));
    setTimeout(() => {
      dispatch(finishLoading(pollId));
    }, 100);
  };

export const createQuestionAction =
  (question: Omit<PollQuestionType, 'id'>, orgId: number, pollId: number): AppThunk =>
  async (dispatch): Promise<number> => {
    const newQuestion = await createQuestion(question, pollId, orgId);

    dispatch(addQuestionReducer({ pollId: pollId, question: newQuestion }));

    return newQuestion.id;
  };

export const updateQuestionAction =
  (question: PollQuestionType, orgId: number, pollId: number, questionId: number): AppThunk =>
  async (dispatch): Promise<void> => {
    const updatedQuestion = await updateQuestion(question, orgId, pollId, questionId);
    dispatch(updateQuestionReducer({ pollId: pollId, question: updatedQuestion }));
  };

export const deleteQuestionAction =
  (orgId: number, pollId: number, questionId: number): AppThunk =>
  async (dispatch): Promise<void> => {
    await deleteQuestion(orgId, pollId, questionId);
    dispatch(deleteQuestionReducer({ pollId: pollId, questionId: questionId }));
  };

export const updateLoadingAction =
  (finish?: boolean, pollId?: number): AppThunk =>
  async (dispatch): Promise<void> => {
    if (!finish) {
      dispatch(startLoading(pollId));
    } else {
      dispatch(finishLoading(pollId));
    }
  };

export default slice;
