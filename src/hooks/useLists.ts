import { useCallback, useState } from 'react';
import {
  ICreateList,
  createList as createListApi,
  IGetListLists,
  addMembers as addMembersApi,
  IAddMembers,
  listLists as listListsApi,
  List,
  IGetListDetails,
  getListDetails as getListDetailsApi,
  ListDetails,
  getListMembers as getListMembersApi,
  IGetListMembers,
  editList as editListApi,
  IEditList,
  deleteList as deleteListApi,
  IDeleteList,
} from '../services/api/lists';
import { User } from '../services/api/users';

const useLists = () => {
  const [grandTotalCount, setGrandTotalCount] = useState(null);

  const [list, setList] = useState<{
    loading: boolean;
    totalCount: number;
    data: List[];
  }>({
    loading: false,
    totalCount: 0,
    data: [],
  });

  const [listMembers, setListMembers] = useState<{
    loading: boolean;
    totalCount: number;
    data: User[];
  }>({
    loading: false,
    totalCount: 0,
    data: null,
  });

  const [listDetails, setListDetails] = useState<{
    loading: boolean;
    totalCount: number;
    data: ListDetails;
  }>({
    loading: false,
    totalCount: 0,
    data: null,
  });

  const [createDynamic, setCreateDynamic] = useState({
    loading: false,
  });

  const [createStatic, setCreateStatic] = useState({
    loading: false,
  });

  const [addMembers, setAddMembers] = useState({
    loading: false,
  });

  const [edit, setEdit] = useState({
    loading: false,
  });

  const [del, setDel] = useState({
    loading: false,
  });

  const fetchGrandTotalCount = useCallback((organizationId: IGetListLists['organizationId']) => {
    setGrandTotalCount(null);

    return listListsApi({ organizationId, page: 1, limit: 1 })
      .then(({ totalCount }) => {
        setGrandTotalCount(totalCount);
      })
      .catch((e) => {
        setGrandTotalCount(null);

        throw e;
      });
  }, []);

  const fetchLists = useCallback((props: IGetListLists) => {
    setList({ ...list, loading: true });

    return listListsApi(props)
      .then(({ data, totalCount }) => {
        setList({ ...list, loading: false, data, totalCount });
      })
      .catch((e) => {
        setList({ ...list, loading: false });

        throw e;
      });
  }, []);

  const fetchListDetails = useCallback((props: IGetListDetails) => {
    setListDetails({ ...listDetails, loading: true });

    return getListDetailsApi(props)
      .then(({ data }) => {
        setListDetails({ ...listDetails, loading: false, data });
      })
      .catch((e) => {
        setListDetails({ ...listDetails, loading: false });

        throw e;
      });
  }, []);

  const fetchListMembers = useCallback((props: IGetListMembers) => {
    setListMembers({ ...listMembers, loading: true });

    return getListMembersApi(props)
      .then(({ data, totalCount }) => {
        setListMembers({ ...listMembers, loading: false, data, totalCount });
      })
      .catch((e) => {
        setListMembers({ ...listMembers, loading: false });

        throw e;
      });
  }, []);

  const createDynamicList = useCallback((props: ICreateList) => {
    setCreateDynamic({ ...createDynamic, loading: true });

    return createListApi(props)
      .then(() => {
        setCreateDynamic({ ...createDynamic, loading: false });
      })
      .catch((e) => {
        setCreateDynamic({ ...createDynamic, loading: false });

        throw e;
      });
  }, []);

  const createStaticList = useCallback(async (props: ICreateList & Pick<IAddMembers, 'members'>) => {
    setCreateStatic({ ...createStatic, loading: true });
    try {
      const { listId } = await createListApi(props);
      await addMembersApi({ ...props, listId });
      setCreateStatic({ ...createStatic, loading: false });
      return listId;
    } catch (e) {
      setCreateStatic({ ...createStatic, loading: false });

      throw e;
    }
  }, []);

  const addMembersToList = useCallback(async (props: IAddMembers) => {
    setAddMembers({ ...addMembers, loading: true });

    try {
      await addMembersApi(props);
      setAddMembers({ ...addMembers, loading: false });
    } catch (e) {
      setAddMembers({ ...addMembers, loading: false });

      throw e;
    }
  }, []);

  const editList = useCallback((props: IEditList) => {
    setEdit({ ...edit, loading: true });

    return editListApi(props)
      .then(() => {
        setEdit({ ...edit, loading: false });
      })
      .catch((e) => {
        setEdit({ ...edit, loading: false });

        throw e;
      });
  }, []);

  const deleteList = useCallback((props: IDeleteList) => {
    setDel({ ...del, loading: true });

    return deleteListApi(props)
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
    list: {
      ...list,
      fetch: fetchLists,
    },
    listMembers: {
      ...listMembers,
      fetch: fetchListMembers,
    },
    listDetails: {
      ...listDetails,
      fetch: fetchListDetails,
    },
    createDynamic: {
      ...createDynamic,
      fetch: createDynamicList,
    },
    createStatic: {
      ...createStatic,
      fetch: createStaticList,
    },
    addMembers: {
      ...addMembers,
      fetch: addMembersToList,
    },
    edit: {
      ...edit,
      fetch: editList,
    },
    del: {
      ...del,
      fetch: deleteList,
    },
  };
};

export default useLists;
