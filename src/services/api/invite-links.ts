import { api } from './helper';

export type Profile = {
  avatar: string;
  name: string;
};

export interface IInviteLink {
  id: number;
  code: string;
  invites: number;
  limit: string; // "2021-05-24T13:04:17.000000Z"
  created_at: string;
  updated_at: string;
  user_id: number;
  expired: boolean;
}

export const getCurrentLink = async (): Promise<IInviteLink> => {
  const response = await api().get<{ data: IInviteLink }>('/invite_links/current');
  return response.data.data;
};

export const generateLink = async (organizationId): Promise<IInviteLink> => {
  const response = await api().post<{ data: IInviteLink }>('/invite_link', { organization: organizationId });
  return response.data.data;
};

export const getInviteLinks = async (): Promise<IInviteLink[]> => {
  const response = await api().get<{
    data: IInviteLink[];
  }>('/invite_links');
  return response.data.data;
};
