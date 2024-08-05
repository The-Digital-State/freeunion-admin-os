import cloneDeep from 'lodash/cloneDeep';
import { AppThunk } from './../index';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { getApplications, IApplication } from 'services/api/applications';
import { RequestStatusesCodesEnum } from 'services/api/dictionaries';

type RequestsState = {
  applications: IApplication[];
  totalCount?: number;

  newCount: number;
};

const initialState: RequestsState = {
  applications: [],
  totalCount: null,

  newCount: 0,
};

const slice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    getRequestsReducer(state: RequestsState, action: PayloadAction<IApplication[]>): void {
      state.applications = action.payload;
      state.newCount = action.payload.filter((request) => request.status === RequestStatusesCodesEnum.wait).length;
    },
    updateRequestsReducer(
      state: RequestsState,
      { payload }: PayloadAction<{ statusRequests: RequestStatusesCodesEnum; requestId: number }>
    ): RequestsState {
      const newState: IApplication[] = cloneDeep(state.applications);
      const request = newState.find((request) => request.id === payload.requestId);
      if (!request) {
        return state;
      }
      request.status = payload.statusRequests;
      return { ...state, applications: newState, newCount: state.newCount - 1 };
    },
  },
});

export const { reducer } = slice;

export const getRequests = (orgId): AppThunk => async (dispatch): Promise<void> => {
  const applications = await getApplications({ organizationId: orgId });

  dispatch(slice.actions.getRequestsReducer(applications.applications));
};

export const updateRequestsThunk = (statusRequests: RequestStatusesCodesEnum, requestId: number): AppThunk => async (
  dispatch
): Promise<void> => {
  dispatch(slice.actions.updateRequestsReducer({ statusRequests, requestId }));
};

export default slice;
