import { ApiPaymentType, ApiPayments, Payment, PaymentCreated, PaymentCosts } from 'shared/interfaces/finance';
import { api } from './helper';

//COMMON------------------------------------------------------------------

export const getPayments = async (orgId: number): Promise<PaymentCreated[]> => {
  const response = await api().get(`/admin_org/${orgId}/finance`);
  return response.data.data;
};

//FUNDRAISING------------------------------------------------------------------

const getFundraisingsUrl = (orgId: number): string => `/admin_org/${orgId}/fundraisings`;

export const getPaymentFundraising = async (orgId: number, paymentId: number): Promise<PaymentCreated> => {
  const response = await api().get(`${getFundraisingsUrl(orgId)}/${paymentId}`);
  return response.data.data;
};

export const addPaymentFundraising = async (orgId: number, data: Partial<Payment>) => {
  const response = await api().post(`${getFundraisingsUrl(orgId)}`, data);
  return response.data.data;
};

export const deletePaymentFundraising = async (orgId: number, paymentId: number) => {
  const response = await api().delete(`${getFundraisingsUrl(orgId)}/${paymentId}`);
  return response.data.data;
};

export const updatePaymentFundraising = async (
  orgId: number,
  paymentId: number,
  data: Partial<Payment>
): Promise<PaymentCreated> => {
  const response = await api().put(`${getFundraisingsUrl(orgId)}/${paymentId}`, data);
  return response.data.data;
};

export const uploadFundraisingImage = async (orgId: number, image: string | ArrayBuffer) => {
  const response = await api().post(`${getFundraisingsUrl(orgId)}/upload`, {
    image,
  });
  return response.data.url;
};

//SUBSCRIPTIONS------------------------------------------------------------------

const getSuscriptionUrl = (orgId: number): string => `/admin_org/${orgId}/subscriptions`;

export const getPaymentSubscription = async (orgId: number, paymentId: number): Promise<PaymentCreated> => {
  const response = await api().get(`${getSuscriptionUrl(orgId)}/${paymentId}`);
  return response.data.data;
};

export const addPaymentSubscription = async (orgId: number, data: Partial<Payment>) => {
  const response = await api().post(`${getSuscriptionUrl(orgId)}`, data);
  return response.data.data;
};

export const deletePaymentSubscription = async (orgId: number, paymentId: number) => {
  const response = await api().delete(`${getSuscriptionUrl(orgId)}/${paymentId}`);
  return response.data.data;
};

export const updatePaymentSubscription = async (
  orgId: number,
  paymentId: number,
  data: Partial<Payment>
): Promise<PaymentCreated> => {
  const response = await api().put(`${getSuscriptionUrl(orgId)}/${paymentId}`, data);
  return response.data.data;
};

//API --------------------------------------------------------------

export const getApiPayment = async (orgId: number, type: ApiPayments) => {
  const response = await api().get(`/admin_org/${orgId}/payment_systems/${type}`);
  return response.data.data;
};

export const addApiPayment = async (orgId: number, data: Partial<ApiPaymentType>) => {
  const response = await api().post(`/admin_org/${orgId}/payment_systems`, data);
  return response.data.data;
};

export const updateApiPayment = async (orgId: number, data: Partial<ApiPaymentType>, apiType: ApiPayments) => {
  const response = await api().put(`/admin_org/${orgId}/payment_systems/${apiType}`, data);
  return response.data.data;
};

export const getActiveApi = async (orgId: number): Promise<ApiPayments[]> => {
  const response = await api().get(`/admin_org/${orgId}/fundraisings/payments`);
  return response.data[0];
};

// export const deleteApi = async (orgId: number, apiType: ApiPayments) => {
//   const response = await api().delete(`/admin_org/${orgId}/payment_systems/4`);
//   return response.data.data;
// };

// COSTS -----------------------------------------

export const getCosts = async (orgId: number): Promise<PaymentCosts[]> => {
  const response = await api().get(`/admin_org/${orgId}/expenses`);
  return response.data.data;
};

export const updateCosts = async (orgId: number, body: PaymentCosts[]): Promise<PaymentCosts[]> => {
  const response = await api().post(`/admin_org/${orgId}/expenses`, body);
  return response.data.data;
};
