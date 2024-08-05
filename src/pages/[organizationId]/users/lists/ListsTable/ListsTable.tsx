import DateTableCell from 'components/atoms/DateTableCell';
import FiltersList from 'components/molecules/FiltersList';
import { FilterType } from 'components/molecules/FiltersList/FiltersList';
import Table from 'components/molecules/Table';
import useFilters from 'hooks/useFilters';
import useLists from 'hooks/useLists';
import { useLocation } from 'react-router-dom';
import dynamic from 'helpers/dynamic';

import useSelection from 'hooks/useSelection';
import React, { useContext, useEffect, useState } from 'react';
import { FilterOperationType } from 'services/api/types';
import { useParams, useHistory } from 'react-router-dom';
import useSortBy from 'hooks/useSortBy';
import TableFooter from 'components/molecules/TableFooter';
import usePagination from 'hooks/usePagination';
import stringifyUser from '../../../../../helpers/stringifyUser';
import { ModalContext } from 'context/Modal';
import Modal from 'components/molecules/Modal';
import { Box, TextField, Typography } from '@material-ui/core';
import { toast } from 'react-toastify';
import formatServerError from 'shared/utils/formatServerError';

const TrashIcon = dynamic(require('lib/material-kit/icons/Trash'), {
  ssr: false,
});
const PencilAltIcon = dynamic(require('lib/material-kit/icons/PencilAlt'), {
  ssr: false,
});

interface Props {
  rowsPerPage?: number;
  actions: {
    label?: string;
    notDisabled?: boolean;
    onClick(ids, data?): void;
  }[];
}

function ListsTable({ actions }: Props) {
  const filters = useFilters();
  const selection = useSelection([]);
  const { list, edit, del, grandTotalCount, createStatic, createDynamic, addMembers } = useLists();

  const params = useParams<{ organizationId?: string }>();
  const history = useHistory();
  const pagination = usePagination();

  const [createListFromFiltersModalOpen, setCreateListFromFiltersModalOpen] = useState(false);
  const [createListFromSelectedModalOpen, setCreateListFromSelectedModalOpen] = useState(false);
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [renameListId, setRenameListId] = useState<number>();
  const [deleteListId, setDeleteListId] = useState<number>();
  const [listName, setListName] = useState('');

  const location = useLocation();

  // const { organizationId } = params;
  const organizationId = location.pathname.split('/')[1];

  const modalContext = useContext(ModalContext);

  const sortBy = useSortBy();

  const handleRowClick = (id) => {
    // getListMembers({ organizationId, listId: id, page: 1, limit: 1 });
    history.push(`/${organizationId}/users/lists/${id}`);

    modalContext.closeModal();
  };

  const handleRenameClick = (id) => {
    setRenameListId(+id);
    setListName(list.data.find((x) => x.id === id).name);
    setRenameModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteListId(+id);
    setDeleteModalOpen(true);
  };

  const handleEditList = () => {
    edit
      .fetch({
        organizationId: +organizationId,
        listId: renameListId,
        name: listName,
      })
      .then(() => {
        toast.success('Сохранено');
        list.fetch({ organizationId: +organizationId, page: 0, limit: 0 });
        setRenameModalOpen(false);
      })
      .catch((e) => {
        toast.error(formatServerError(e));
      });
  };

  const handleDeleteList = async (): Promise<void> => {
    const newPage = list.data.length > 1 ? pagination.page : pagination.page > 1 ? pagination.page - 1 : 1;
    try {
      await del.fetch({ organizationId: +organizationId, listId: deleteListId });
      toast.success('Удалено');
      setDeleteModalOpen(false);
      return list.fetch({ organizationId: +organizationId, page: newPage, limit: pagination.perPage });
    } catch (error) {
      toast.error(formatServerError(error));
    }
  };

  function load() {
    list.fetch({
      organizationId: +organizationId,
      page: pagination.page,
      limit: pagination.perPage,
      filters: filters.values,
      sortBy,
    } as any);
  }

  useEffect(() => {
    load();
  }, [organizationId, pagination.page, pagination.perPage, filters.values, sortBy.direction, sortBy.field]);

  useEffect(() => {
    if (list?.loading) return;
    pagination.setPageCount(Math.ceil(list.totalCount / pagination.perPage));
  }, [list.totalCount, pagination.perPage]);

  return (
    <>
      <FiltersList
        // @ts-ignore
        availableKeys={['created_at']}
        values={[
          {
            key: 'mainSearch',
            label: 'Название',
            type: FilterType.STRING,
            operation: FilterOperationType.LK,
            value: filters.values['mainSearch']?.value,
          },
          {
            key: 'created_at',
            label: 'Дата создания',
            toolbarTitle: 'Дата создания',
            type: FilterType.DATE_RANGE,
            operation: FilterOperationType.BW,
            value: filters.values['created_at']?.value,
          },
        ]}
        onChange={filters.setValue}
        resetFilters={filters.resetFilters}
        isEmpty={filters.isEmpty()}
      />
      <Table
        columns={[
          {
            id: '',
            Header: '',
            sort: false,
          },
          {
            id: 'name',
            Header: 'Название',
            sort: true,
          },
          {
            id: 'fixed',
            Header: 'Количество участников',
            sort: true,
          },
          {
            id: 'created_at',
            Header: 'Дата создания',
            sort: true,
            Component: DateTableCell,
          },
        ]}
        data={filters.filter({
          items: list.data,
          mainSearchFields: ['name'],
          filteredFields: ['mainSearch'],
        })}
        onClickRow={handleRowClick}
        actions={[
          {
            id: 'comment',
            title: 'Переименовать',
            onClick: handleRenameClick,
            Icon: PencilAltIcon,
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
        hideSelectAll
        hasFooter
        {...selection}
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
            label: actions[0].label || 'Выбрать',
            onClick: () => {
              // need to use global state
              const _tempData = list.data.filter((list) => selection.selected.includes(list.id));

              actions[0].onClick(selection.selected, _tempData);
            },
            disabled: actions[0].notDisabled ? false : selection.isAllSelected || !selection.selected.length,
          },
        ]}
      />

      <Modal
        title={list.data.find((x) => x.id === renameListId)?.name}
        submitLabel="Сохранить"
        open={renameModalOpen}
        onClose={() => setRenameModalOpen(false)}
        onSubmit={handleEditList}
        submitting={edit.loading}
        disabled={!listName || list.data.find((x) => x.id === renameListId)?.name === listName}
      >
        <Box sx={{ minWidth: 500 }}>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Название списка"
            fullWidth
            value={listName}
            onChange={(e) => setListName(e.target.value)}
          />
        </Box>
      </Modal>
      <Modal
        title={list.data.find((x) => x.id === deleteListId)?.name}
        submitLabel="Удалить"
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onSubmit={handleDeleteList}
        submitting={del.loading}
      >
        <Box sx={{ minWidth: 500 }}>
          <Typography>
            Вы действительно хотите удалить список &quot;
            {list.data.find((x) => x.id === deleteListId)?.name}&quot;?
          </Typography>
        </Box>
      </Modal>
    </>
  );
}

export default ListsTable;
