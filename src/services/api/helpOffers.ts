import { api } from './helper';

export type HelpOffer = {
  id: number;
  text: string;
  enabled: boolean;
};

export const getOrganizationHelpOffers = async (orgId: number) => {
  const response = await api().get(`/admin_org/${orgId}/help_offers`);
  return response.data.data;
};

export const createHelpOffer = async (orgId: number, text: string) => {
  const response = await api().post(`/admin_org/${orgId}/help_offers`, {
    text: text,
  });
  return response.data.data;
};

export const saveChangeOffers = async (orgId: number, helpOffersArray: HelpOffer[]) => {
  const response = await api().put(`/admin_org/${orgId}/help_offers`, {
    ...helpOffersArray,
  });
  return response.data.data;
};
