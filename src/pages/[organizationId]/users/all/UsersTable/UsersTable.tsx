import React, { useContext, useEffect, useState } from 'react';
import CommentTableCell from 'components/atoms/CommentTableCell';
import { TableColumn, TableColumnSettings } from 'components/molecules/Table/Table';
import DateTableCell from 'components/atoms/DateTableCell';

import Table from 'components/molecules/Table';
import TableFooter from 'components/molecules/TableFooter';
import UserTableCell from 'components/atoms/UserTableCell';
import ListTableCell from 'components/atoms/ListTableCell';
import dynamic from 'helpers/dynamic';
import useUsers from 'hooks/useUsers';
import useFilters from 'hooks/useFilters';
import useSelection from 'hooks/useSelection';
import { useHistory, useLocation } from 'react-router-dom';

import useUsersFiltersHumanReadable from 'hooks/useUsersFiltersHumanReadable';
import usePagination from 'hooks/usePagination';
import useSortBy from 'hooks/useSortBy';
import { FilterListItem, FilterType } from 'components/molecules/FiltersList/FiltersList';
import { FilterOperationType } from 'services/api/types';
import { useSelector } from '../../../../../redux';
import { IFetchUsersProps, User } from 'services/api/users';
import stringifyUser from 'helpers/stringifyUser';
import { ModalContext } from 'context/Modal';
import UserDetails from 'components/organisms/UserDetails';
import Modal from 'components/molecules/Modal';
import { Box, Typography } from '@material-ui/core';
import useLists from 'hooks/useLists';
import { toast } from 'react-toastify';
import AllUsersAddSelectedToListModal from 'components/organisms/AllUsersAddSelectedToListModal';
import { HelpOffer } from 'services/api/helpOffers';
import { ReactComponent as ChatIcon } from '../../../../../shared/icons/messages.svg';
import formatServerError from 'shared/utils/formatServerError';
import DeleteUserModal from 'components/molecules/DeleteUserModal/DeleteUserModal';
import LookupTableCell from 'components/atoms/LookupTableCell';

const FiltersList = dynamic(require('components/molecules/FiltersList/FiltersList'), { ssr: false });
const TrashIcon = dynamic(require('lib/material-kit/icons/Trash'), {
  ssr: false,
});
const PencilAltIcon = dynamic(require('lib/material-kit/icons/PencilAlt'), {
  ssr: false,
});
const MessageIcon = dynamic(require('lib/material-kit/icons/Message'), { ssr: false });
const PlusIcon = dynamic(require('lib/material-kit/icons/Plus'), {
  ssr: false,
});
const PlaylistAddIcon = dynamic(require('@material-ui/icons/PlaylistAdd'), {
  ssr: false,
});
const AddAlertIcon = dynamic(require('@material-ui/icons/AddAlert'), {
  ssr: false,
});
const ForumIcon = dynamic(require('@material-ui/icons/Forum'), { ssr: false });

type Action = {
  label?: string;
  onClick(ids, data?): void;
  notDisabled?: boolean;
};

interface Props {
  rowsPerPage?: number;
  actions: Action[];
  customData?: any[];
  menuActions?: Action[];
}

function UsersTable({ actions, rowsPerPage = 25, customData, menuActions }: Props) {
  const { list, edit, del, details, grandTotalCount, currentUser } = useUsers();
  const pagination = usePagination({ perPage: rowsPerPage });
  const filters = useFilters();
  const filterStrings = useUsersFiltersHumanReadable();
  const selection = useSelection([]);
  const sortBy = useSortBy();
  const modalContext = useContext(ModalContext);
  const location = useLocation();

  if (customData) {
    // @ts-ignore
    list.data = customData;

    list.totalCount = customData.length;
    list.loading = false;
  }

  // const { organizationId } = params;
  const organizationId = location.pathname.split('/')[1];

  const [createListFromFiltersModalOpen, setCreateListFromFiltersModalOpen] = useState(false);
  const [createListFromSelectedModalOpen, setCreateListFromSelectedModalOpen] = useState(false);
  const [addSelectedToListModalOpen, setAddSelectedToListModalOpen] = useState(false);

  const { createStatic, createDynamic, addMembers } = useLists();
  const history = useHistory();

  const [open, setOpen] = useState<boolean>(false);
  const [userId, setUserId] = useState<number>();

  useEffect(() => {
    if (customData) {
      return;
    }

    loadData();
  }, [organizationId, pagination.page, pagination.perPage, filters.values, sortBy.direction, sortBy.field]);

  useEffect(() => {
    if (list?.loading) return;
    pagination.setPageCount(Math.ceil(list.totalCount / pagination.perPage));
  }, [list.totalCount, pagination.perPage]);

  const getFiltetingParameters = (): IFetchUsersProps => {
    return {
      organizationId: +organizationId,
      page: pagination.page,
      limit: pagination.perPage,
      filters: filters.values,
      sortBy,
    };
  };

  function loadData() {
    const filteringParams = getFiltetingParameters();
    list.fetch(filteringParams);
  }

  const onSelectAll = () => {
    if (!selection.isAllSelected) {
      const filteringParams = getFiltetingParameters();
      list.fetchUsersNoPagination(filteringParams);
    }
    selection.onSelectAll();
  };

  useEffect(() => {
    grandTotalCount.fetch(Number(organizationId));
  }, [organizationId]);

  useEffect(() => {
    return () => {
      filters.resetFilters();
    };
  }, []);

  const { dictionaries, profile, helpOffers } = useSelector((state) => {
    return {
      helpOffers: state.helpOffers.data as HelpOffer[],
      dictionaries: state.dictionaries,
      profile: state.profile,
    };
  });

  const [selectedFilters, selectedFiltersChanged] = useState<string[]>([]);
  const isAdmin = currentUser.data?.permissions > 0;

  useEffect(() => {
    currentUser.fetch({
      organizationId: +organizationId,
      filters: {
        id: {
          value: profile.data.id,
          operation: FilterOperationType.EQ,
        },
      },
    });
  }, [profile.data]);

  const handleDeleteClick = (id) => {
    modalContext.openModal(
      <DeleteUserModal
        userName={getUserFullName(list.data.find((x) => x.id === id))}
        userId={id}
        close={modalContext.closeModal}
        updateData={updateData}
        deleteFetch={del.fetch}
        organizationId={organizationId}
      />
    );
  };

  const handleClose = () => {
    if (!customData) {
      loadData();
    }
    setOpen(false);
  };

  const updateData = async () => {
    try {
      list.fetch({
        organizationId: +organizationId,
        page: pagination.page,
        limit: pagination.perPage,
        filters: filters.values,
      } as IFetchUsersProps);
    } catch (e) {
      toast.error(formatServerError(e));
    }
  };

  const handleRowClick = (id) => {
    modalContext.openModal(
      <UserDetails
        userId={id}
        isAdmin={isAdmin}
        handleReferralClick={handleRowClick}
        close={() => {
          if (!customData) {
            loadData();
          }
          modalContext.closeModal();
        }}
      />
    );
  };

  //   const handleCreateNewList = (listName: string) => {
  //     createDynamic
  //       .fetch({
  //         organizationId: Number(organizationId),
  //         name: listName,
  //         users: selection.selected.length ? selection.selected : [],
  //       })
  //       .then(() => {
  //         toast.success('Сохранено');
  //         setCreateListFromFiltersModalOpen(false);
  //       })
  //       .catch((e) => {
  //         toast.error(formatServerError(e));
  //       });
  //   };

  const getUserFullName = (user: User) =>
    `${user?.lastName || ''} ${user?.firstName || ''} ${user?.middleName || ''}`.trim();

  const filterValues: Array<FilterListItem> = [
    {
      key: 'mainSearch',
      label: 'Имя',
      type: FilterType.STRING,
      operation: FilterOperationType.VAL,
      value: filters.values['mainSearch']?.value,
    },
    {
      key: 'helpOffers',
      label: 'Что готов делать',
      type: FilterType.SELECT,
      operation: FilterOperationType.IN,
      options: helpOffers
        .filter((offer) => offer.enabled)
        .map((offer) => {
          return {
            name: offer.text,
            id: offer.id,
          };
        }),
      value: filters.values['helpOffers']?.value,
    },
    {
      key: 'comment',
      label: 'Комментарий',
      type: FilterType.STRING,
      operation: FilterOperationType.LK,
      value: filters.values['comment']?.value,
    },
    {
      key: 'activityScope',
      label: 'Сфера Деятельности',
      type: FilterType.SELECT,
      operation: FilterOperationType.IN,
      options: dictionaries.activityScopes,
      value: filters.values['activityScope']?.value,
    },
    {
      key: 'position_id',
      label: 'Роль',
      type: FilterType.SELECT,
      operation: FilterOperationType.IN,
      options: dictionaries.positions,
      value: filters.values['position_id']?.value,
    },
    {
      key: 'position_name',
      label: 'Должность',
      type: FilterType.STRING,
      operation: FilterOperationType.LK,
      value: filters.values['position_name']?.value,
    },
    {
      key: 'created_at',
      label: 'Дата регистрации',
      toolbarTitle: 'Дата регистрации',
      type: FilterType.DATE_RANGE,
      operation: FilterOperationType.BW,
      value: filters.values['created_at']?.value,
    },
    {
      key: 'lastUsed',
      label: 'Дата последнего логина',
      toolbarTitle: 'Дата последнего логина',
      type: FilterType.DATE_RANGE,
      operation: FilterOperationType.BW,
      value: filters.values['lastUsed']?.value,
    },
  ];

  const tableColumnsConfig: TableColumn[] = [
    {
      id: 'user',
      Header: 'Пользователь',
      Component: UserTableCell,
    },
    {
      id: 'id',
      Header: 'ID',
    },
    {
      id: 'points',
      Header: 'Баллы активности',
      sort: true,
    },
    {
      id: 'helpOffers',
      Header: 'Что готов делать',
      sort: false,
      Component: ListTableCell,
    },
    {
      id: 'comment',
      Header: 'Комментарий',
      sort: true,
      Component: CommentTableCell,
      //   componentProps: { handleAddComment: handleCommentClick },
    },
    {
      id: 'permission_name',
      Header: 'Права доступа',
      sort: true,
    },
    {
      id: 'position_id',
      Header: 'Роль',
      sort: true,
      Component: LookupTableCell,
      componentProps: {
        lookup: dictionaries.positions.map((position) => {
          return {
            key: position.id,
            value: position.name,
          };
        }),
      },
    },
    {
      id: 'position_name',
      Header: 'Должность',
      sort: true,
    },
    {
      id: 'member_description',
      Header: 'Описание роли',
      sort: false,
    },
    {
      id: 'created_at',
      Header: 'Дата регистрации',
      sort: true,
      Component: DateTableCell,
    },
    {
      id: 'lastUsed',
      Header: 'Дата последнего логина',
      sort: true,
      Component: DateTableCell,
    },
  ];

  const handleCreateDynamicList = (listName: string) => {
    createDynamic
      .fetch({
        organizationId: Number(organizationId),
        name: listName,
        filters: filters.values as any,
      })
      .then(() => {
        toast.success('Сохранено');
        setCreateListFromFiltersModalOpen(false);
      })
      .catch((e) => {
        toast.error(formatServerError(e));
      });
  };

  const handleAddSelectedToList = (listId: number) => {
    addMembers
      .fetch({
        organizationId: Number(organizationId),
        listId,
        members: selection.selected.map((el) => String(el)),
      })
      .then(() => {
        toast.success('Сохранено');
        setAddSelectedToListModalOpen(false);
      })
      .catch((e) => {
        toast.error(formatServerError(e));
      });
  };

  const tableColumnsSettings: TableColumnSettings[] = [
    {
      id: 'mainSearch',
      hide: true,
    },
    {
      id: 'position_name',
      hide: () => !isAdmin && !selectedFilters?.includes('position_name'),
    },
    {
      id: 'created_at',
      hide: () => !selectedFilters?.includes('created_at'),
    },
    {
      id: 'lastUsed',
      hide: () => !selectedFilters?.includes('lastUsed'),
    },
    {
      id: 'permission_name',
      hide: () => !isAdmin,
    },
  ];

  const filterKeys = () => {
    return filterValues.map((item) => item.key);
  };

  const formattedActions = actions.map((action) => {
    return {
      ...action,
      onClick: () => {
        if (selection.isAllSelected) {
          action.onClick(selection, list.dataNoPagination);
        } else {
          const selectedUserData = list.data.filter((user) => selection.selected.includes(user.id));
          action.onClick(selection, selectedUserData);
        }
      },
    };
  });

  const [firstMainAction, ...mainActions] = formattedActions;

  const getTableData = () => {
    const filteredData = filters.filter({
      items: list.data.map((user) => stringifyUser(user, dictionaries, helpOffers)),
      mainSearchFields: ['user.firstName', 'user.lastName'],
      filteredFields: ['mainSearch'],
    });
    return customData
      ? pagination.filter(filteredData) // apply client-side pagination
      : filteredData;
  };

  return (
    <div>
      <FiltersList
        availableKeys={filterKeys()}
        values={filterValues}
        onChange={filters.setValue}
        resetFilters={filters.resetFilters}
        isEmpty={filters.isEmpty()}
        selectedFiltersChanged={selectedFiltersChanged}
      />
      <Table
        columns={tableColumnsConfig}
        settings={{ columns: tableColumnsSettings }}
        data={getTableData()}
        onClickRow={handleRowClick}
        actions={[
          {
            id: 'message',
            title: 'Отправить уведомление',
            onClick: () => {
              history.push('../notifications/new');
            },
            Icon: MessageIcon,
          },
          {
            id: 'chat',
            title: 'Чат',
            onClick: (id) => {
              history.push(`/${organizationId}/chat?id=${id}&type=user`);
            },
            Icon: ChatIcon,
          },
          {
            id: 'delete',
            title: 'Удалить',
            onClick: handleDeleteClick,
            Icon: TrashIcon,
          },
        ]}
        loading={list.loading}
        sortBy={sortBy}
        {...selection}
        onSelectAll={onSelectAll}
        hasFooter
      />
      <TableFooter
        count={list.totalCount}
        onPageChange={(value) => pagination.setPage(value + 1)}
        onRowsPerPageChange={(value) => pagination.setPerPage(value)}
        page={pagination.page - 1}
        rowsPerPage={pagination.perPage}
        rowsPerPageOptions={[10, 25, 50]}
        selected={selection.selected?.length}
        isAllSelected={selection.isAllSelected}
        mainAction={[
          {
            label: firstMainAction.label || 'Выбрать',
            onClick: firstMainAction.onClick,
            disabled: firstMainAction.notDisabled ? false : !(selection.isAllSelected || selection.selected.length),
          },
          ...mainActions,
        ]}
        actions={menuActions}
      />

      <AllUsersAddSelectedToListModal
        open={addSelectedToListModalOpen}
        setOpen={setAddSelectedToListModalOpen}
        onSubmit={handleAddSelectedToList}
        submitting={addMembers.loading}
        selected={selection.selected.length}
      />
    </div>
  );
}

export default UsersTable;
