import qs from 'qs';
import { SortDirection } from '../../types';
import { api } from './helper';
import { FiltersType, FilterType } from './types';
import { transformUser, User } from './users';
import {
  transformFilters,
  transformDateBetween,
  transformQueries,
  transformApiFilters,
  transformSortBy,
  transformFiltersToString,
} from './utils';

export type List = {
  id: number;
  name: string;
  filters: FiltersType;
  fixed: number;
  created_at: Date;
};

export type ListDetails = {
  id: number;
  name: string;
  filters: FiltersType;
};

type GetListsListResponse = {
  data: [
    {
      id: number;
      name: string;
      created_at: string;
      updated_at: string;
      fixed: number;
      filter: {
        scope: string;
        birthday: string;
        [key: string]: string;
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

type GetListDetailsResponse = {
  data: GetListsListResponse['data']['0'];
};

type GetListMembersResponse = {
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
      position: string;
      permissions: number;
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

export interface ICreateList {
  organizationId: number;
  name: string;
  filters?: {
    activityScope: FilterType;
    birthday: FilterType<[string, string]>;
  };
  users?: [] | Record<string, any>;
}

export const createList = ({ organizationId, name, filters }: ICreateList): Promise<{ listId: number }> => {
  // Map and transform filters to match the TradeUnion API format
  const preparedFilters = transformFilters({
    scope: filters?.activityScope,
    birthday: !filters?.birthday
      ? undefined
      : {
          ...filters.birthday,
          value:
            filters.birthday.value[0] && filters.birthday.value[1]
              ? transformDateBetween(filters.birthday.value)
              : ['', ''],
        },
  });

  const data = new FormData();

  data.append('name', name);
  Object.keys(preparedFilters).map((key) => data.append(`filter[${key}]`, preparedFilters[key]));

  return api<{ data: { id: number } }>({
    url: `/admin_org/${organizationId}/member_lists`,
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
    data,
  })
    .then((response) => {
      return Promise.resolve({ listId: response.data.data.id });
    })
    .catch((error) => {
      return Promise.reject(error.response.data.errors?.[0]);
    });
};

export interface IAddMembers {
  organizationId: number;
  listId: number;
  members: string[];
}

export const addMembers = ({ organizationId, listId, members }: IAddMembers): Promise<any> => {
  const data = qs.stringify(
    members.reduce((acc, curr, i) => {
      return { ...acc, [`id[${i}]`]: curr };
    }, {})
  );

  return api<any>({
    url: `/admin_org/${organizationId}/member_lists/${listId}/members`,
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data,
  })
    .then(() => {
      return Promise.resolve();
    })
    .catch((error) => {
      return Promise.reject(error.response.data.errors?.[0]);
    });
};

export interface IGetListLists {
  organizationId: number;
  page?: number;
  limit?: number;
  filters?: {
    mainSearch?: FilterType;
    activityScope: FilterType;
    created_at: FilterType<[string, string]>;
  };
  sortBy?: {
    field: string;
    direction: SortDirection;
  };
}

export const listLists = async ({
  organizationId,
  page,
  limit,
  filters,
  sortBy,
}: IGetListLists): Promise<{ data: List[]; totalCount: number }> => {
  // Map and transform filters to match the TradeUnion API format
  const transformDateBetween = (value: [string, string]): [string, string] => {
      return [new Date(value[0]).toISOString().split('T')[0], new Date(value[1]).toISOString().split('T')[0]];
    },
    preparedFilters = transformFiltersToString({
      name: filters?.mainSearch,
      scope: filters?.activityScope,
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
    sortByQuery = sortBy ? `&${qs.stringify(transformSortBy(sortBy))}` : '',
    response = await api().get<GetListsListResponse>(
      `/admin_org/${organizationId}/member_lists?${filtersQuery}${sortByQuery}`
    ),
    data: List[] = [];

  for (const listResponse of response.data.data) {
    const preparedFilters = transformApiFilters({
      activityScope: listResponse.filter.scope,
      created_at: listResponse.filter.created_at,
    });

    const list: List = {
      id: listResponse.id,
      name: listResponse.name,
      filters: preparedFilters,
      fixed: listResponse.fixed,
      created_at: new Date(listResponse.created_at),
    };

    data.push(list);
  }

  return { data, totalCount: response.data.meta?.total };
};

export interface IGetListDetails {
  organizationId: number;
  listId: number;
  page?: number;
  limit?: number;
  filters?: {
    activityScope: FilterType;
    birthday: FilterType<[string, string]>;
  };
  sortBy?: {
    field: string;
    direction: SortDirection;
  };
}

export const getListDetails = ({
  organizationId,
  page,
  limit,
  listId,
  filters,
  sortBy,
}: IGetListDetails): Promise<{ data: ListDetails }> => {
  const transformDateBetween = (value: [string, string]): [string, string] => {
    return [new Date(value[0]).toISOString().split('T')[0], new Date(value[1]).toISOString().split('T')[0]];
  };

  const preparedFilters = transformFiltersToString({
    scope: filters?.activityScope,
    birthday: !filters?.birthday
      ? undefined
      : {
          ...filters.birthday,
          value:
            filters.birthday.value[0] && filters.birthday.value[1]
              ? transformDateBetween(filters.birthday.value)
              : ['', ''],
        },
  });

  const filtersQuery = transformQueries({ page, limit, filters: preparedFilters });
  const sortByQuery = sortBy ? `&${qs.stringify(transformSortBy(sortBy))}` : '';

  return api()
    .get<GetListDetailsResponse>(`/admin_org/${organizationId}/member_lists/${listId}?${filtersQuery}${sortByQuery}`)
    .then(async (response) => {
      const preparedFilters = transformApiFilters({
        activityScope: response.data.data.filter.scope,
        birthday: response.data.data.filter.birthday,
      });

      const data: ListDetails = {
        id: response.data.data.id,
        name: response.data.data.name,
        filters: preparedFilters,
      };

      return {
        data,
      };
    });
};

export interface IGetListMembers {
  organizationId: number | string | string[];
  listId: number;
  page?: number;
  limit?: number;
  sortBy?: {
    field: string;
    direction: SortDirection;
  };
}

export const getListMembers = ({
  organizationId,
  listId,
  page,
  limit,
  sortBy,
}: IGetListMembers): Promise<{ data: User[]; totalCount: number }> => {
  const sortByQuery = sortBy ? `&${qs.stringify(transformSortBy(sortBy))}` : '';

  return api()
    .get<GetListMembersResponse>(
      `/admin_org/${organizationId}/member_lists/${listId}/members?${transformQueries({
        page,
        limit,
      })}${sortByQuery}`
    )
    .then(async (response) => {
      const users = response.data.data.map(transformUser);

      return {
        data: users,
        totalCount: response.data.meta?.total,
      };
    });
};

export interface IEditList {
  organizationId: number;
  listId: number;
  name: string;
}

export const editList = ({ organizationId, listId, name }: IEditList): Promise<any> => {
  return api<any>({
    url: `/admin_org/${organizationId}/member_lists/${listId}?name=${name}`,
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

export interface IDeleteList {
  organizationId: number;
  listId: number;
}

export const deleteList = ({ organizationId, listId }: IDeleteList): Promise<any> => {
  return api<any>({
    url: `/admin_org/${organizationId}/member_lists/${listId}`,
    method: 'DELETE',
  })
    .then(() => {
      return Promise.resolve();
    })
    .catch((error) => {
      return Promise.reject(error.response.data.errors?.[0]);
    });
};
