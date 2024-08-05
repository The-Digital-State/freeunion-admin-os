import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { getUser, Profile } from '../../services/api/auth';
import type { AppThunk } from '..';
import sockets from 'shared/modules/sockets';
import { getUrl } from 'modules/notifications';

type ProfileState = {
  data: Profile | null;
  isLoading: boolean;
};

const initialState: ProfileState = {
  data: null,
  isLoading: false,
};

const slice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    getProfile(state: ProfileState, action: PayloadAction<Profile>): void {
      state.data = action.payload;
      state.isLoading = false;
    },
    fetchProfileStart(state: ProfileState): void {
      state.isLoading = true;
    },
  },
});

export const { reducer } = slice;

export const getProfile = (): AppThunk => async (dispatch, getState): Promise<void> => {
  dispatch(slice.actions.fetchProfileStart());

  const profile = await getUser();

  if (!getState().profile.data) {
    sockets.subscribe(profile.id, dispatch, getUrl);
  }

  dispatch(slice.actions.getProfile(profile));
};

export default slice;
