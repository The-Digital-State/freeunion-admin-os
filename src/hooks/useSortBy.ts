import { useState } from 'react';
import { SortDirection } from '../types';

const useSortBy = () => {
  const [value, setValue] = useState<{
    field: string | null;
    direction: SortDirection | null;
  }>({
    field: null,
    direction: null,
  });

  const sort = (list, type: 'number' | 'string' | 'date') => {
    switch (type) {
      case 'number': {
        list.sort(numberComparator.bind(list, value.field, value.direction));
        break;
      }
      case 'string': {
        list.sort(stringComparator.bind(list, value.field, value.direction));
        break;
      }
      case 'date': {
        list.sort(dateComparator.bind(list, value.field, value.direction));
        break;
      }
    }
    return list;
  };

  return {
    field: value.field,
    direction: value.direction,
    setSortBy: (field: string | null, direction: SortDirection | null) => setValue({ field, direction }),
    sort,
  };
};

export default useSortBy;

function numberComparator(field: string, direction: SortDirection, a, b) {
  if (!a[field] || !b[field]) return 0;
  if (direction === SortDirection.ASC) return a[field] - b[field];
  return b[field] - a[field];
}

function stringComparator(field: string, direction: SortDirection, a, b) {
  if (field === 'user_id') {
    field = 'user';
    a.user = `${a.user_id.public_name} ${a.user_id.public_family}`;
    b.user = `${b.user_id.public_name} ${b.user_id.public_family}`;
  }
  if (!a[field] || !b[field]) return 0;

  const stringA = a[field].toLowerCase();
  const stringB = b[field].toLowerCase();
  if (direction === SortDirection.ASC) return stringA.localeCompare(stringB);
  return stringB.localeCompare(stringA);
}

function dateComparator(field: string, direction: SortDirection, a, b) {
  if (!a[field] || !b[field]) return 0;

  const dateA = new Date(a[field]).getTime();
  const dateB = new Date(b[field]).getTime();
  if (direction === SortDirection.ASC) return dateA - dateB;
  return dateB - dateA;
}
