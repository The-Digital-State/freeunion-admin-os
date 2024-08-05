import debounce from 'debounce';
import { useCallback, useRef, useState } from 'react';
import {
  listUsers,
  IFetchUsersProps,
  User,
  editUser as editUserApi,
  IEditUser,
  deleteUser as deleteUserApi,
  IDeleteUser,
  getUser as getUserApi,
  IGetUser,
} from '../services/api/users';

const useUsers = () => {
  const debouncedList = useRef(null);
  const [grandTotalCount, setGrandTotalCount] = useState(null);
  const [list, setList] = useState<{
    loading: boolean;
    totalCount: number;
    data: User[];
    dataNoPagination: User[];
  }>({
    loading: false,
    totalCount: 0,
    data: [],
    dataNoPagination: [],
  });

  const [currentUser, setCurrentUser] = useState(null);

  const [details, setDetails] = useState<{
    loading: boolean;
    data: User;
  }>({
    loading: false,
    data: null,
  });

  const [edit, setEdit] = useState({
    loading: false,
  });

  const [del, setDel] = useState({
    loading: false,
  });

  const fetchGrandTotalCount = useCallback((organizationId: IFetchUsersProps['organizationId']) => {
    setGrandTotalCount(null);

    return listUsers({ organizationId, page: 1, limit: 1 })
      .then(({ totalCount }) => {
        setGrandTotalCount(totalCount);
      })
      .catch((e) => {
        setGrandTotalCount(null);

        throw e;
      });
  }, []);

  const fetchUsers = (props: IFetchUsersProps) =>
      new Promise((resolve, reject) => {
        setList({ ...list, loading: true });

        debouncedList.current?.clear();

        const debounced = debounce(() => {
          debouncedList.current?.clear();
          listUsers(props)
            .then(({ data, totalCount }) => {
              setList({ ...list, loading: false, data, totalCount });
              resolve({ data, totalCount });
            })
            .catch((e) => {
              setList({ ...list, loading: false });

              reject(e);
            });
        }, 500);

        debouncedList.current = debounced;
        debounced();
      });

  const fetchUsersNoPagination = (props: IFetchUsersProps) => {
    const noPaginationParams = {...props, page: undefined, limit: undefined};
    listUsers(noPaginationParams)
      .then(({data}) => {
        setList({ ...list, loading: false, dataNoPagination: data });
      })
      .catch(() => {
        setList({ ...list, loading: false});
      });
  };

  const fetchCurrentUser = useCallback(async (props: IFetchUsersProps) => {
    const user = await listUsers(props);

    if (user.data[0]) {
      setCurrentUser(user.data[0]);
    }
  }, []);

  const fetchUserDetails = useCallback((props: IGetUser) => {
    setDetails({ ...details, loading: true });

    return getUserApi(props)
      .then(({ data }) => {
        setDetails({ ...details, loading: false, data });
      })
      .catch((e) => {
        setDetails({ ...details, loading: false });

        throw e;
      });
  }, []);

  const editUser = useCallback((props: IEditUser) => {
    setEdit({ ...edit, loading: true });

    return editUserApi(props)
      .then(() => {
        setEdit({ ...edit, loading: false });
      })
      .catch((e) => {
        setEdit({ ...edit, loading: false });

        throw e;
      });
  }, []);

  const deleteUser = useCallback((props: IDeleteUser) => {
    setDel({ ...del, loading: true });

    return deleteUserApi(props)
      .then(() => {
        setDel({ ...del, loading: false });
      })
      .catch((e) => {
        setDel({ ...del, loading: false });

        throw e;
      });
  }, []);

  return {
    grandTotalCount: {
      value: grandTotalCount,
      fetch: fetchGrandTotalCount,
    },
    currentUser: {
      data: currentUser,
      fetch: fetchCurrentUser,
    },
    list: {
      ...list,
      fetch: fetchUsers,
      fetchUsersNoPagination: fetchUsersNoPagination,
    },
    details: {
      ...details,
      fetch: fetchUserDetails,
    },
    edit: {
      ...edit,
      fetch: editUser,
    },
    del: {
      ...del,
      fetch: deleteUser,
    },
  };
};

export default useUsers;
