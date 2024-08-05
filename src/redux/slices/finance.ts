import {
  getPayments,
  updatePaymentFundraising,
  deletePaymentFundraising,
  updatePaymentSubscription,
  deletePaymentSubscription,
  getActiveApi,
} from 'services/api/finance';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppThunk } from '..';
import { ApiPayments, Payment, PaymentCreated, PaymentType } from 'shared/interfaces/finance';

export type FundraisingState = {
  payments: PaymentCreated[];
  api: ApiPayments[];
  isLoading: boolean;
};

const initialState: FundraisingState = {
  payments: [],
  api: [],
  isLoading: false,
};

const slice = createSlice({
  name: 'finance',
  initialState,
  reducers: {
    setPaymentsAction(state: FundraisingState, { payload }: PayloadAction<PaymentCreated[]>): FundraisingState {
      return {
        ...state,
        payments: payload,
      };
    },
    deletePaymentAction(state: FundraisingState, { payload }: PayloadAction<number>): FundraisingState {
      return {
        ...state,
        payments: state.payments.filter((news) => news?.id !== payload),
      };
    },
    getActiveApiAction(state: FundraisingState, { payload }: PayloadAction<ApiPayments[]>): FundraisingState {
      return {
        ...state,
        api: payload,
      };
    },
    updatePaymentAction(state: FundraisingState, { payload }: PayloadAction<PaymentCreated>): FundraisingState {
      return {
        ...state,
        payments: state.payments.map((payment) => ({
          ...payment,
          ...(payment?.id === payload.id && payload),
        })),
      };
    },
    startLoading(state: FundraisingState): FundraisingState {
      return {
        ...state,
        isLoading: true,
      };
    },
    finishLoading(state: FundraisingState): FundraisingState {
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
    setPaymentsAction,
    updatePaymentAction,
    deletePaymentAction,
    getActiveApiAction,
    startLoading,
    finishLoading,
  },
} = slice;

export const getPaymentsThunk = (orgId: string): AppThunk => async (dispatch): Promise<void> => {
  dispatch(startLoading());

  const paymentsFundraising = await getPayments(+orgId);

  dispatch(setPaymentsAction(paymentsFundraising.reverse()));
  dispatch(finishLoading());
};

export const updatePaymentsThunk = (
  orgId: number,
  fundraisingId: number,
  filteredValues: Payment,
  paymentType: PaymentType
): AppThunk => async (dispatch): Promise<void> => {
  dispatch(startLoading());

  switch (paymentType) {
    case PaymentType.fundraising:
      const paymentFundraising = await updatePaymentFundraising(orgId, fundraisingId, filteredValues);
      dispatch(updatePaymentAction(paymentFundraising));
      break;
    case PaymentType.promotional:
      const paymentPromotion = await updatePaymentFundraising(orgId, fundraisingId, filteredValues);
      dispatch(updatePaymentAction(paymentPromotion));
      break;
    case PaymentType.subscription:
      const paymentSubscription = await updatePaymentSubscription(orgId, fundraisingId, filteredValues);
      dispatch(updatePaymentAction(paymentSubscription));
  }

  dispatch(finishLoading());
};

export const deletePaymentsThunk = (orgId: number, fundraisingId: number, paymentType: PaymentType): AppThunk => async (
  dispatch
): Promise<void> => {
  dispatch(startLoading());
  switch (paymentType) {
    case PaymentType.fundraising:
      await deletePaymentFundraising(orgId, fundraisingId);
      break;
    case PaymentType.promotional:
      await deletePaymentFundraising(orgId, fundraisingId);
      break;
    case PaymentType.subscription:
      await deletePaymentSubscription(orgId, fundraisingId);
  }
  dispatch(deletePaymentAction(fundraisingId));
  dispatch(finishLoading());
};

export const getActiveApiPaymentsThunk = (orgId: number): AppThunk => async (dispatch): Promise<void> => {
  dispatch(startLoading());

  const activeApi = await getActiveApi(orgId);
  //@ts-ignore
  dispatch(getActiveApiAction([activeApi]));

  dispatch(finishLoading());
};

export default slice;
