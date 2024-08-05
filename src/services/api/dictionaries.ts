import { api } from './helper';

export type ActivityScope = {
  id: number;
  name: string;
};

type GetActivityScopesResponse = {
  id: number;
  name: string;
}[];

export interface IFetchUsersProps {
  organizationId: number;
}

export interface IOrganizationTypes {
  id: string;
  name: string;
}

export interface IInterestScopes {
  id: string;
  name: string;
}

export const getActivityScopes = (): Promise<ActivityScope[]> => {
  return api()
    .get<GetActivityScopesResponse>('/dictionaries/activity_scopes')
    .then((response) => response.data);
};

export const getOrganizationTypes = (): Promise<IOrganizationTypes[]> => {
  return api()
    .get<IOrganizationTypes[]>('/dictionaries/organization_types')
    .then((response) => response.data);
};

export const getInterestScopes = (): Promise<IInterestScopes[]> => {
  return api()
    .get<IInterestScopes[]>('/dictionaries/interest_scopes')
    .then((response) => response.data);
};

export type IPosition = {
  id: number;
  name: string;
};

export const getPositions = (): Promise<IPosition[]> => {
  return api()
    .get<IPosition[]>('/dictionaries/positions')
    .then((response) => response.data);
};

export enum RequestStatusesCodesEnum {
  wait = 0,
  active = 10,
  declined = 20,
  left = 21,
}

export enum RequestStatusesEnum {
  wait = 'Ждёт подтверждения',
  active = 'Активный участник',
  declined = 'Заявка отклонена',
  left = 'Вышел из объединения',
}

export const RequestStatusesHash = {
  0: 'Ждёт подтверждения',
  10: 'Активный участник',
  20: 'Заявка отклонена',
  21: 'Вышел из объединения',
};

export type IRequestStatuses = {
  [key in keyof typeof RequestStatusesHash]: typeof RequestStatusesHash[keyof typeof RequestStatusesHash];
};

export const getRequestStatuses = (): Promise<IRequestStatuses> => {
  return api()
    .get<IRequestStatuses>('/dictionaries/request_statuses')
    .then((response) => response.data);
};
