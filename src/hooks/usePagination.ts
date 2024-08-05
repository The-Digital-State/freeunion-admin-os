import { useState } from 'react';

const usePagination = ({ perPage } = { perPage: 25 }) => {
  const [state, setState] = useState({ page: 1, perPage });

  const setPage = (page) => {
    setState({
      ...state,
      page: page,
    })
  };

  const setPageCount = (newPageCount) => {
    if (newPageCount < state.page) {
      setPage(1);
    }
  }

  const filter = (items: any[]) => {
    const begin = (state.page-1) * state.perPage;
    const end = begin + state.perPage;
    return items.slice(begin, end); 
  }

  return {
    page: state.page,
    setPage,
    perPage: state.perPage,
    setPerPage: (perPage) => {
      setState({ page: 1, perPage: perPage });
    },
    hasPrev: state.page > 1,
    next: () => setPage(state.page + 1),
    prev: () => setPage(state.page - 1),
    setPageCount,
    filter,
  };
};

export default usePagination;
