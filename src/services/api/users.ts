import qs from 'qs';
import { SortDirection } from '../../types';
import { api } from './helper';
import { FilterType, Sex } from './types';
import { transformFiltersToString, transformQueries, transformSortBy } from './utils';

export type User = {
  id: number;
  avatar?: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  birthday: Date | null;
  comment?: string;
  permissions: number;
  address: string | null;
  member_description: string | null;
  phone: string | null;
  country: string;
  activityScope: number;
  workPlace: string;
  workPosition: string;
  created_at: Date;
  lastUsed: Date;
  sex: Sex | null;
  about: string;
  position_id: number;
  position_name: string;
  helpOffers: number[];
  points: number;
  joined_at: string;
  referal?: {
    id: number;
    public_avatar: string;
    public_family: string;
    public_name: string;
  };
  canConversation?: boolean;
};

type GetMembersResponse = {
  data: [
    {
      id: number;
      public_family: string;
      public_name: string;
      public_avatar: string | null;
      created_at: string;
      updated_at: string;
      last_used_at: string;
      family: string | null;
      name: string | null;
      patronymic: string | null;
      sex: number;
      birthday: string | null;
      comment: string | null;
      country: string;
      worktype: number;
      scope: number;
      work_place: string;
      work_position: string;
      address: string | null;
      phone: string | null;
      about: string;
      country_name: string;
      scope_name: string;
      position_id: number;
      position_name: string;
      permissions: number;
      help_offers: string[];
      points: number;
      referal?: {
        id: number;
        public_avatar: string;
        public_family: string;
        public_name: string;
      };
    }
  ];
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
};

export interface IFetchUsersProps {
  organizationId: number;
  page?: number;
  limit?: number;
  filters?: {
    mainSearch?: FilterType;
    activityScope?: FilterType;
    position_id?: FilterType;
    position_name?: FilterType;
    helpOffers?: FilterType;
    id?: FilterType;
    comment?: FilterType;
    birthday?: FilterType<[string, string]>;
    created_at?: FilterType<[string, string]>;
    lastUsed?: FilterType<[string, string]>;
  };
  sortBy?: {
    field: string;
    direction: SortDirection;
  };
}

export const transformUser = (userResponse): User => ({
  id: userResponse.id,
  avatar: userResponse.public_avatar,
  firstName: userResponse.name || userResponse.public_name,
  lastName: userResponse.family || userResponse.public_family,
  middleName: userResponse.patronymic,
  birthday: userResponse.birthday ? new Date(userResponse.birthday) : null,
  comment: userResponse.comment,
  address: userResponse.address,
  phone: userResponse.phone,
  country: userResponse.country,
  member_description: userResponse.member_description,
  permissions: userResponse.permissions,
  activityScope: userResponse.scope,
  workPlace: userResponse.work_place,
  workPosition: userResponse.work_position,
  created_at: new Date(userResponse.created_at),
  lastUsed: new Date(userResponse.last_used_at),
  sex: Number.isInteger(userResponse.sex) ? (userResponse.sex === 0 ? Sex.MAN : Sex.WOMAN) : null,
  about: userResponse.about,
  position_id: userResponse.position_id,
  position_name: userResponse.position_name,
  helpOffers: userResponse.help_offers,
  points: userResponse.points,
  joined_at: userResponse.joined_at,
  referal: userResponse.referal,
  canConversation: userResponse.can_conversion,
});

export const listUsers = ({
  organizationId,
  page,
  limit,
  filters,
  sortBy,
}: IFetchUsersProps): Promise<{ data: User[]; totalCount: number }> => {
  // Map and transform filters to match the TradeUnion API format
  const transformDateBetween = (value: [string, string]): [string, string] => {
      return [new Date(value[0]).toISOString().split('T')[0], new Date(value[1]).toISOString().split('T')[0]];
    },
    preparedFilters = transformFiltersToString({
      fullname: filters?.mainSearch,
      scope: filters?.activityScope,
      position_id: filters?.position_id,
      position_name: filters?.position_name,
      id: filters?.id,
      help_offers: filters?.helpOffers,
      comment: filters?.comment,
      birthday: !filters?.birthday
        ? undefined
        : {
            ...filters.birthday,
            value:
              filters.birthday.value[0] && filters.birthday.value[1]
                ? transformDateBetween(filters.birthday.value)
                : ['', ''],
          },
      last_used_at: !filters?.lastUsed
        ? undefined
        : {
            ...filters.lastUsed,
            value:
              filters.lastUsed.value[0] && filters.lastUsed.value[1]
                ? transformDateBetween(filters.lastUsed.value)
                : ['', ''],
          },
      created_at: !filters?.created_at
        ? undefined
        : {
            ...filters.created_at,
            value:
              filters.created_at.value[0] && filters.created_at.value[1]
                ? transformDateBetween(filters.created_at.value)
                : ['', ''],
          },
    }),
    filtersQuery = transformQueries({ page, limit, filters: preparedFilters }),
    sortByQuery = sortBy ? `&${qs.stringify(transformSortBy(sortBy))}` : '';

  return api()
    .get<GetMembersResponse>(`/admin_org/${organizationId}/members?${filtersQuery}${sortByQuery}`)
    .then((response) => {
      const data = response.data.data.map(transformUser);

      return { data, totalCount: response.data.meta?.total };
    });
};

export interface IGetUser {
  organizationId: number;
  userId: number;
}

export const getUser = ({ organizationId, userId }: IGetUser): Promise<{ data: User }> => {
  return api()
    .get<{ data: GetMembersResponse['data']['0'] }>(`/admin_org/${organizationId}/members/${userId}`)
    .then((response) => {
      return { data: transformUser(response.data.data) };
    });
};

export interface IEditUser {
  organizationId: number;
  userId: number;
  comment?: string;
  member_description?: string;
  position_id?: number;
  position_name?: string;
  permissions?: number;
}

export const editUser = ({
  organizationId,
  userId,
  comment,
  member_description,
  position_id,
  position_name,
  permissions,
  ...rest
}: IEditUser): Promise<any> => {
  return api<any>({
    url: `/admin_org/${organizationId}/members/${userId}?${qs.stringify({
      comment,
      position_id,
      position_name,
      description: member_description,
      permissions: permissions || 0,
      ...rest,
    })}`,
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
    .then(() => {
      return Promise.resolve();
    })
    .catch((error) => {
      return Promise.reject(error.response.data.errors?.[0]);
    });
};

export interface IDeleteUser {
  organizationId: number;
  userId: number;
  comment: string;
}

export const deleteUser = ({ organizationId, userId, comment }: IDeleteUser): Promise<any> => {
  return api()
    .delete<any>(`/admin_org/${organizationId}/members/${userId}`, { data: { comment: comment } })
    .then(() => {
      return Promise.resolve();
    })
    .catch((error) => {
      return Promise.reject(error.response.data.errors?.[0]);
    });
};
