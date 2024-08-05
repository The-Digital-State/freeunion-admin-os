import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import {
  ActivityScope,
  getActivityScopes,
  getPositions,
  getRequestStatuses,
  IPosition,
  IRequestStatuses,
} from '../../services/api/dictionaries';
import type { AppThunk } from '..';

export type DictionariesState = {
  activityScopes: ActivityScope[] | null;
  positions: IPosition[] | null;
  permissions: any[];
  requestStatuses: IRequestStatuses | null;
  isLoading: boolean;
};

const permissions = [
  {
    title: 'Администратор',
    permission: 9223372036854775807,
  },
  // {
  //   title: 'Органайзер/проектный менеджер',
  //   permission: 4186116,
  // },
  // {
  //   title: 'Редактор',
  //   permission: 130023424,
  // },
  // {
  //   title: 'Финансовый менеджер',
  //   permission: 402653184,
  // },
  {
    title: 'Ревизор',
    permission: 138690564,
  },
];

const initialState: DictionariesState = {
  activityScopes: null,
  positions: null,
  requestStatuses: null,
  isLoading: false,
  permissions,
};

const slice = createSlice({
  name: 'dictionaries',
  initialState,
  reducers: {
    setDictionaries(state: DictionariesState, action: PayloadAction<Partial<DictionariesState>>): void {
      state.activityScopes = action.payload.activityScopes;
      state.positions = action.payload.positions;
      state.requestStatuses = action.payload.requestStatuses;
      state.isLoading = false;
    },
    fetchDictionariesStart(state: DictionariesState): void {
      state.isLoading = true;
    },
  },
});

export const { reducer } = slice;

export const getDictionaries = (): AppThunk => async (dispatch): Promise<void> => {
  dispatch(slice.actions.fetchDictionariesStart());

  const [activityScopes, positions, requestStatuses] = await Promise.all([
    await getActivityScopes(),
    await getPositions(),
    await getRequestStatuses(),
  ]);

  dispatch(slice.actions.setDictionaries({ activityScopes, positions, requestStatuses }));
};

export default slice;
