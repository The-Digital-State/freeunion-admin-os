import { AppThunk } from './../index';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createHelpOffer, getOrganizationHelpOffers, saveChangeOffers } from './../../services/api/helpOffers';
import { HelpOffer } from './../../services/api/helpOffers';

type HelpOffersState = {
  data: HelpOffer[] | [];
};

const initialState: HelpOffersState = {
  data: [],
};

const slice = createSlice({
  name: 'helpOffers',
  initialState,
  reducers: {
    getHelpOffersReducer(state: any, action: PayloadAction<HelpOffer[]>): void {
      state.data = action.payload;
    },
    addHelpOfferReducer(state: HelpOffersState, action: PayloadAction<HelpOffer>): void {
      state.data = [...state.data, action.payload];
    },
  },
});

export const { reducer } = slice;

export const getHelpOffers = (orgId): AppThunk => async (dispatch): Promise<void> => {
  const helpOffers = await getOrganizationHelpOffers(orgId);

  dispatch(slice.actions.getHelpOffersReducer(helpOffers));
};

export const addHelpOffer = (orgId, text): AppThunk => async (dispatch): Promise<void> => {
  const helpOffer = await createHelpOffer(orgId, text);

  dispatch(slice.actions.addHelpOfferReducer(helpOffer));
};

export const updateHelpOffers = (orgId: number, helpOffersArray: HelpOffer[]): AppThunk => async (dispatch) => {
  const helpOffers = await saveChangeOffers(orgId, helpOffersArray);

  dispatch(slice.actions.getHelpOffersReducer(helpOffers));
};

export default slice;
