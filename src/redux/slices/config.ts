import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppThunk } from '..';
import sockets from 'shared/modules/sockets';

type ConfigState = {
  isAuthenticated: boolean;
};

const initialState: ConfigState = {
  isAuthenticated: false,
};

const slice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setAuthenticated(state: ConfigState, action: PayloadAction<boolean>): void {
      state.isAuthenticated = action.payload;
    },
  },
});

export const { reducer } = slice;

export const setAuthenticated = (state: boolean): AppThunk => (dispatch, getState): void => {
  const notificationToken = localStorage.getItem('notificationToken');

  if (state && getState().config.isAuthenticated !== state && notificationToken) {
    sockets.init(notificationToken);
  }

  dispatch(slice.actions.setAuthenticated(state));
};

export default slice;
