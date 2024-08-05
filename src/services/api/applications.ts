/* Mocks */
import qs from 'qs';
import { api } from './helper';
import { transformFiltersToString, transformQueries, transformSortBy } from './utils';
import { FilterType } from './types';
import { SortDirection } from '../../types';
// import { transformUser, User } from './users';
import { addDays, format } from 'date-fns';

export interface IGetApplications {
  organizationId: number;
  page?: number;
  limit?: number;
  filters?: {    
    mainSearch?: FilterType;
    created_at?: FilterType<[string, string]>;
  };
  sortBy?: {
    field: string;
    direction: SortDirection;
  };
}

export interface GetApplicationResponse {
  data: IApplication[];
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface IApplication {
  id: number;
  comment: string;
  created_at: string;
  response: any;
  status: number;
  _statusText?: string;
  updated_at: string;
  user_id: {
    id: number;
    public_avatar: string;
    public_family: string;
    public_name: string;
    avatar?: string;
    firstName?: string;
    lastName?: string;
    middleName?: string;
  };
}

export const transformApplication = (applicationResponse: IApplication): IApplication => ({
  ...applicationResponse,
  created_at: format(new Date(applicationResponse.created_at), 'yyyy/MM/dd HH:mm:ss'),
  user_id: {
    ...applicationResponse.user_id,
    id: applicationResponse.user_id.id,
    avatar: applicationResponse.user_id.public_avatar,
    firstName: applicationResponse.user_id.public_name,
    lastName: applicationResponse.user_id.public_family,
  },
});

export const getApplications = ({ 
  organizationId,
  limit,
  page,
  filters,
  sortBy,
}: IGetApplications): Promise<any> => {
  const transformDateBetween = (value: [string, string]): [string, string] => {
    return [
      addDays(new Date(value[0]), 1).toISOString().split('T')[0], 
      addDays(new Date(value[1]), 2).toISOString().split('T')[0],
    ];
  };
  const preparedFilters = transformFiltersToString({      
    fullname: filters?.mainSearch,
    created_at: !filters?.created_at
        ? undefined
        : {
            ...filters.created_at,
            value:
              filters.created_at.value[0] && filters.created_at.value[1]
                ? transformDateBetween(filters.created_at.value)
                : ['', ''],
          },
  });
  const filtersQuery = transformQueries({ page, limit, filters: preparedFilters });
  const sortByQuery = sortBy ? `&${qs.stringify(transformSortBy(sortBy))}` : '';

  return api()
    .get<GetApplicationResponse>(`/admin_org/${organizationId}/requests?${filtersQuery}${sortByQuery}`)
    .then((response) => {
      const applications = response.data.data.map(transformApplication);
      // return response.data.data;
      //@ts-ignore
      return { applications, totalCount: response.data.meta?.total };
    })
    .catch((error) => {
      return Promise.reject(error.response.data?.errors?.[0]);
    });
};

export const getApplication = ({ organizationId, requestId }): Promise<any> => {
  return api()
    .get<{ data: IApplication[] }>(`/admin_org/${organizationId}/requests/${requestId}`)
    .then((response) => {
      // return response.data.data;
      return response.data.data;
    })
    .catch((error) => {
      return Promise.reject(error.response.data.errors?.[0]);
    });
};

export interface IApplyApplication {
  organizationId: number;
  request: number;
}

export const applyApplication = ({ organizationId, request }: IApplyApplication) => {
  return api()
    .post<{ data: IApplication }>(`/admin_org/${organizationId}/requests/${request}/apply`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return Promise.reject(error.response.data.errors?.[0]);
    });
};

export interface IRejectApplication {
  organizationId: number;
  request: number;
  comment?: string;
}

export const rejectApplication = ({ organizationId, request, comment }: IRejectApplication) => {
  return api()
    .post<{ data: IApplication }>(`/admin_org/${organizationId}/requests/${request}/reject`, {
      comment,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return Promise.reject(error.response.data.errors?.[0]);
    });
};
