import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { listAdminOrganizations, AdminOrganization } from '../../services/api/organizations';
import type { AppThunk } from '..';

type OrganizationsState = {
  adminOrganizations: AdminOrganization[] | null;
  isLoading: boolean;
};

const initialState: OrganizationsState = {
  adminOrganizations: null,
  isLoading: false,
};

const slice = createSlice({
  name: 'organizations',
  initialState,
  reducers: {
    getAdminOrganizations(state: OrganizationsState, action: PayloadAction<AdminOrganization[]>): void {
      state.adminOrganizations = action.payload;
      state.isLoading = false;
    },
    fetchDictionariesStart(state: OrganizationsState): void {
      state.isLoading = true;
    },
  },
});

export const { reducer } = slice;

export const getOrganizations = (): AppThunk => async (dispatch): Promise<void> => {
  dispatch(slice.actions.fetchDictionariesStart());

  const adminOrganizations = await listAdminOrganizations();

  dispatch(slice.actions.getAdminOrganizations(adminOrganizations));
};

export default slice;
