import { useEffect, useState } from 'react';
import { useSelector } from '../redux';
import { FiltersType } from '../services/api/types';
import useFilters from './useFilters';

const useUsersFiltersHumanReadable = (filters?: FiltersType): string[] => {
  const [data, setData] = useState<string[]>([]);
  const { activityScopes } = useSelector((state) => state.dictionaries);

  const filtersHookValues = useFilters().values;

  const _filters = filters || filtersHookValues;

  useEffect(() => {
    const result: string[] = [];

    if (_filters.activityScope?.value.length && activityScopes?.length) {
      const plural = _filters.activityScope.value.length > 1;

      const activityScopeValues = activityScopes
        .filter((x) => _filters.activityScope.value.map((x) => +x).includes(x.id))
        .map(({ name }) => name)
        .join(', ');

      result.push(`${plural ? 'Сферы' : 'Сфера'} деятельности "${activityScopeValues}"`);
    }

    if (_filters.birthday?.value?.[0] && _filters.birthday?.value?.[1]) {
      result.push(
        `Дата рождения с ${new Date(_filters.birthday?.value?.[0])?.toLocaleDateString()} до ${new Date(
          _filters.birthday?.value?.[1]
        )?.toLocaleDateString()}`
      );
    }

    setData(result);
  }, [_filters, activityScopes, activityScopes]);

  return data;
};

export default useUsersFiltersHumanReadable;
