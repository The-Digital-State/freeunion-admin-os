export enum ApiFilterOperationType {
  eq = 'eq',
  neq = 'neq',
  lt = 'lt',
  lte = 'lte',
  gt = 'gt',
  gte = 'gte',
  in = 'in',
  nin = 'nin',
  bw = 'bw',
  nbw = 'nbw',
  lk = 'lk',
  nlk = 'nlk',
}

export enum FilterOperationType {
  EQ = 'EQ',
  NEQ = 'NEQ',
  LT = 'LT',
  LTE = 'LTE',
  GT = 'GT',
  GTE = 'GTE',
  IN = 'IN',
  NIN = 'NIN',
  BW = 'BW',
  NBW = 'NBW',
  LK = 'LK',
  NLK = 'NLK',
  VAL = 'VAL'
}

export type FiltersType<T = string> = {
  [key: string]: FilterType<T>;
};

export type FilterType<T = string> = {
  operation: FilterOperationType;
  value: T | any;
  or?: FilterType<T>;
  and?: FilterType<T>;
};

export type Option = {
  id: number;
  name: string;
};

export enum Sex {
  MAN = 0,
  WOMAN = 1,
}

export enum Country {
  BY = 'BY',
}

export type ApiSortBy = {
  sortBy: string;
  sortDirection: 'asc' | 'desc';
};
