import { useEffect, useState, useCallback } from 'react';
import { useParams, useLocation, useHistory } from 'react-router-dom';
import { FilterOperationType, FiltersType } from '../services/api/types';
import { objectDeepValue } from '../helpers/objectDeepValue';

// use lodash
const empty = (val: unknown) => {
  if (Array.isArray(val)) {
    return !val.length;
  }

  if (val) {
    if (typeof val === 'object') {
      return !Object.keys(val).length;
    }

    if (typeof val === 'string') {
      try {
        const parsedObject = JSON.parse(val as string);
        if (parsedObject === 'object') {
          return !Object.keys(val).length;
        }
      } catch {}
    }
  }

  if (val === '' || val === 0 || val === false) {
    return false;
  }

  return !val;
};

interface IUseFilters {
  getFilterKeys(values): string[];

  setValue: (key: string, operation: FilterOperationType, value: unknown) => unknown;
  resetFilters: () => void;
  isEmpty: () => boolean;
  isValueEmpty: (key: string) => boolean;
  values: FiltersType;
  filter: (props: { items: any[]; filteredFields?: string[]; mainSearchFields?: string[] }) => any[];
}

// TODO: fix router query
const useFilters = (): IUseFilters => {
  const [values, setValues] = useState<FiltersType>({});
  const location = useLocation();
  const history = useHistory();

  const searchParams = new URLSearchParams(decodeURIComponent(location.search));
  const search = Object.fromEntries(searchParams);

  const setValue = (key: string, operation: FilterOperationType, value: any) => {
    const queryFilters = JSON.parse(search.filters || '{}');

    queryFilters[key] = {
      operation,
      value,
    };
    const newFilters = Object.keys(queryFilters).reduce((acc, currKey) => {
      if (empty(queryFilters[currKey]?.value)) {
        return acc;
      }
      return { ...acc, [currKey]: queryFilters[currKey] };
    }, {});
    
    if (Object.keys(newFilters).length) {
      history.push({ search: new URLSearchParams({ ...search, filters: JSON.stringify(newFilters) }).toString() });
    } else {
      const { filters, ...rest } = search;
      history.push({ search: new URLSearchParams(rest).toString() });
    }
  };

  const resetFilters = () => {
    const { filters, ...query } = search;

    if (filters) {
      history.push({ search: new URLSearchParams(query).toString() });
    }
  };

  const getFilterKeys = (filters) => {
    return filters.values;
  };

  useEffect(() => {
    try {
      const queryFilters = JSON.parse(search.filters || '{}');

      // TODO: uncomment
      setValues(queryFilters);
    } catch (e) {
      const { filters, ...query } = search;
      history.push({ search: new URLSearchParams(query).toString() });
    }
  }, [search.filters]);

  const filter = useCallback(
    ({
      items,
      filteredFields = [],
      mainSearchFields,
    }: {
      items: unknown[];
      filteredFields: string[];
      mainSearchFields?: string[];
    }) => {
      return items.filter((item) => {
        return (filteredFields.length ? filteredFields : Object.keys(values)).every((key) => {
          if (!values[key]) {
            return true;
          }

          switch (values[key]?.operation) {
            case FilterOperationType.LK:
            case FilterOperationType.VAL: {
              if (key === 'mainSearch') {
                if (values[key].value.length < 3) {
                  return true;
                }

                const string = mainSearchFields
                  .map((field) => objectDeepValue(item, field) || '')
                  .join(' ')
                  .toLowerCase();
                return string.includes(values[key].value.toLowerCase());
              }

              return item[key]?.toLowerCase().includes(values[key]?.value?.toLowerCase());
            }
            case FilterOperationType.BW: {
              return item[key] >= values[key].value[0] && item[key] <= values[key].value[1];
            }
          }
        });
      });
    },
    [values]
  );

  return {
    setValue,
    resetFilters,
    getFilterKeys,
    isEmpty: () => empty(search.filters),
    // isEmpty: () => empty(false),
    isValueEmpty: (key: string) => empty(values[key].value),
    values,
    filter,
  };
};

export default useFilters;
