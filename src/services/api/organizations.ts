import { ExternalChat } from 'shared/interfaces/externalChats';
import { api } from './helper';

export type AdminOrganization = {
  id: number;
  name: string;
  avatar: string | null;
};

type GetListAdminOrganizationsResponse = {
  data: {
    id: number;
    owner_id: number;
    owner: {
      id: number;
      public_family: string;
      public_name: string;
      public_avatar: string;
    };
    type_id: number;
    type_name: string;
    name: string;
    short_name: string;
    avatar: string;
    description: string;
    created_at: string;
    updated_at: string;
  }[];
};

export interface IGetOrganization {
  organizationId: number;
}

export interface IUpdateOrganization {
  organizationId: number;
  body: IOrganization;
  interests?: number[];
  scopes?: number[];
  avatar?: string;
}

export interface IOrganizationInterest {
  id: number;
  name: string;
  pivot?: {
    organization_id: number;
    interest_scope_id: number;
  };
}

export interface IOrganizationScope {
  id: number;
  name: string;
  pivot: {
    organization_id: number;
    activity_scope_id: number;
  };
}

enum RegistrationTypes {
  NotRegistered,
  Registered,
  InProcess,
}

enum RequestTypes {
  Immediately,
  ConfirmationRequired,
  ApplicationRequired,
  ApplicationAndMailingRequired,
}

export interface IOrganization {
  errors: string[];
  id: number;
  address: string;
  avatar: string;
  children: number[];
  description: string;
  email: string;
  interests: IOrganizationInterest[];
  members_count: number;
  members_new_count: number;
  name: string;
  owner_id: number;
  owner: {
    id: number;
    public_avatar: string;
    public_family: string;
    public_name: string;
  };
  parents: number[];
  phone: string;
  registration: RegistrationTypes;
  request_type: RequestTypes;
  scopes: IOrganizationScope[];
  short_name: string;
  site: string;
  status: string;
  type_id: number;
  type_name: string;
  updated_at: string;
  created_at: string;
  is_public: number;
  hiddens: string[];
}

export const getOrganization = ({ organizationId }: IGetOrganization): Promise<IOrganization> => {
  return api()
    .get<{ data: IOrganization }>(`/admin_org/${organizationId}`)
    .then((response) => {
      return response.data.data;
    });
};

export const updateOrganization = ({ organizationId, body }: IUpdateOrganization): Promise<IOrganization> => {
  return api()
    .put<{ data: IOrganization }>(`/admin_org/${organizationId}`, body)
    .then((response) => {
      return response.data.data;
    });
};

export const removeOrganization = ({ organizationId }: IGetOrganization): Promise<boolean> => {
  return api().delete(`/admin_org/${organizationId}`);
};

export const listAdminOrganizations = (): Promise<AdminOrganization[]> => {
  return api()
    .get<GetListAdminOrganizationsResponse>('/admin_org')
    .then((response) => response.data.data.map(({ id, name, avatar }) => ({ id, name, avatar })));
};

export const updateOrganizationInterests = (organizationId: number, interests: number[]): Promise<IOrganization> => {
  return api()
    .post<{ data: IOrganization }>(`/admin_org/${organizationId}/interests`, {
      scopes: interests,
    })
    .then((response) => response.data.data);
};

export const updateOrganizationScopes = (organizationId: number, scopes: number[]): Promise<IOrganization> => {
  return api()
    .post<{ data: IOrganization }>(`/admin_org/${organizationId}/scopes`, {
      scopes,
    })
    .then((response) => response.data.data);
};

export const updateOrganizationAvatar = (organizationId: number, avatar: string): Promise<IOrganization> => {
  return api()
    .post<{ data: IOrganization }>(`/admin_org/${organizationId}/update_avatar`, {
      image: avatar,
    })
    .then((response) => response.data.data);
};

export interface IBanner {
  id?: number;
  index?: number;
  enabled?: boolean;
  large?: string;
  small?: string;
  organization_id?: number;
  updated_at?: string;
}

export const getOrganizationBanners = (organizationId: number): Promise<IBanner[]> => {
  return api()
    .get<{ data: IBanner[] }>(`/admin_org/${organizationId}/banners`)
    .then((response) => response.data.data);
};

export const createOrganizationBanner = (organizationId: number, banners: IBanner): Promise<IBanner> => {
  return api()
    .post<{ data: IBanner }>(`/admin_org/${organizationId}/banners`, banners)
    .then((response) => response.data.data);
};

export const removeOrganizationBanner = (organizationId: number, index: number): Promise<boolean> => {
  return api()
    .delete<{ ok: boolean }>(`/admin_org/${organizationId}/banners/${index}`)
    .then((response) => {
      return true;
      // not works
      // return response.data.ok;
    });
};

export const updateLargeOrganizationBanner = (
  organizationId: number,
  index: number,
  large: string
): Promise<IBanner> => {
  return api()
    .post<{ data: IBanner }>(`/admin_org/${organizationId}/banners/${index}/large`, { large })
    .then((response) => response.data.data);
};

export const updateSmallOrganizationBanner = (
  organizationId: number,
  index: number,
  small: string
): Promise<IBanner> => {
  return api()
    .post<{ data: IBanner }>(`/admin_org/${organizationId}/banners/${index}/small`, { small })
    .then((response) => response.data.data);
};

export const updateOrganizationBannerVisibility = (
  organizationId: number,
  index: number,
  enabled: boolean
): Promise<IBanner> => {
  return api()
    .put<{ data: IBanner }>(`/admin_org/${organizationId}/banners/${index}`, { enabled })
    .then((response) => response.data.data);
};

export function getExternalChat(id, chatId): Promise<{ link?: string }> {
  return api()
    .get(`/organizations/${id}/get_chat/${chatId}`)
    .then((response) => response.data);
}

export function createExternalChat(
  { type, value, name }: Pick<ExternalChat, 'type' | 'name' | 'value'>,
  orgId: number
): Promise<any> {
  return api()
    .post(`/admin_org/${orgId}/organization_chats`, {
      value,
      type,
      name,
      data: [],
    })
    .then((response) => response.data);
}

export function getExternalChats(id: number): Promise<ExternalChat[]> {
  return api()
    .get(`admin_org/${id}/organization_chats`)
    .then((response) => response.data.data);
}

export function deleteExternalChat(idChat: number, idOrganization: number): Promise<any> {
  return api()
    .delete(`/admin_org/${idOrganization}/organization_chats/${idChat}`)
    .then((response) => response.data.data);
}

export function updateExternalChat(
  { name, value }: Pick<ExternalChat, 'name' | 'value'>,
  id: number,
  orgId: number
): Promise<any> {
  return api()
    .put(`/admin_org/${orgId}/organization_chats/${id}`, {
      name,
      value,
    })
    .then((response) => response.data);
}
