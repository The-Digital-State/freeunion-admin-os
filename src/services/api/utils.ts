import { SortDirection } from '../../types';
import { FilterOperationType, FiltersType, ApiFilterOperationType, FilterType, ApiSortBy } from './types';

const transformOperationToApiMap = {
  [FilterOperationType.IN]: (value: string[]) => `in,${value.join(',')}`,
  [FilterOperationType.BW]: (value: [string, string]) => `bw,${value[0]},${value[1]}`,
  [FilterOperationType.LK]: (value: string) => `lk,${value}`,
  [FilterOperationType.EQ]: (value: string) => `eq,${value}`,
  [FilterOperationType.VAL]: (value: string) => `${value}`,
};

const transformOperationFromApiMap = {
  [ApiFilterOperationType.in]: (value: string): FilterType<string[]> => ({
    operation: FilterOperationType.IN,
    value: value.split(','),
  }),
  [ApiFilterOperationType.bw]: (value: string): FilterType<[string, string]> => ({
    operation: FilterOperationType.BW,
    value: [value.split(',')[0], value.split(',')[1]],
  }),
};

export const transformFiltersToString = (filters: FiltersType<[string, string] | string>): string => {
  const transformedFilters = transformFilters(filters);

  return Object.keys(transformedFilters)
    .map((key) => `${key}=${transformedFilters[key]}`)
    .join('&');
};

export const transformFilters = (filters: FiltersType<[string, string] | string>): { [key: string]: string } => {
  return Object.keys(filters).reduce((acc, currKey) => {
    const transformedOperation = transformOperationToApiMap[filters[currKey]?.operation]?.(filters[currKey].value);

    if (transformedOperation) {
      return { ...acc, [currKey]: transformedOperation };
    }

    return acc;
  }, {});
};

export const transformApiFilters = (filters: { [key: string]: string }): FiltersType => {
  return Object.keys(filters).reduce((acc, currKey) => {
    const currentFilter = filters[currKey];

    const operation = currentFilter?.split(',')?.[0] as ApiFilterOperationType;
    const value = currentFilter?.split(`${operation},`)?.[1];

    if (currentFilter && operation && value) {
      const transformedOperation = transformOperationFromApiMap[operation]?.(value);

      if (transformedOperation) {
        return { ...acc, [currKey]: transformedOperation };
      }
    }

    return acc;
  }, {});
};

export const transformQueries = ({
  page,
  limit,
  filters,
}: {
  page?: number;
  limit?: number;
  filters?: string;
}): string => {
  const queries = [];

  if (page) {
    queries.push(`page=${page}`);
  }

  if (limit) {
    queries.push(`limit=${limit}`);
  }

  if (filters) {
    queries.push(filters);
  }

  return queries.join('&');
};

export const transformDateBetween = (value: [string, string]): [string, string] => {
  return [new Date(value[0]).toISOString().split('T')[0], new Date(value[1]).toISOString().split('T')[0]];
};

export const transformSortDirection = (direction: SortDirection): string => {
  return {
    [SortDirection.ASC]: 'asc',
    [SortDirection.DESC]: 'desc',
  }[direction];
};

export const transformSortBy = ({ direction, field }: { direction: SortDirection; field: string }): ApiSortBy => ({
  sortDirection: transformSortDirection(direction) as any,
  sortBy: field,
});
