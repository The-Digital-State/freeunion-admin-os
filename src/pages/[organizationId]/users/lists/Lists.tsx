import dynamic from 'helpers/dynamic';
import { useContext, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import Head from 'react-helmet';
import { toast } from 'react-toastify';
import { TextField, Box, Typography, modalClasses } from '@material-ui/core';
import { FilterType, FiltersListProps } from '../../../../components/molecules/FiltersList/FiltersList';
import UsersPageTabLayout from '../../../../components/layout/UsersPageTabLayout/UsersPageTabLayout';
import Modal from '../../../../components/molecules/Modal';
import useSelection from '../../../../hooks/useSelection';
import useFilters from '../../../../hooks/useFilters';
import Table from '../../../../components/molecules/Table';
import TableFooter from '../../../../components/molecules/TableFooter';
import NumberHighlight from '../../../../components/atoms/NumberHighlight';
import DateTableCell from '../../../../components/atoms/DateTableCell';
import usePagination from '../../../../hooks/usePagination';
import useLists from '../../../../hooks/useLists';
import useSortBy from '../../../../hooks/useSortBy';
import { FilterOperationType } from '../../../../services/api/types';
import AllUsersCreateListFromSelectedModal from '../../../../components/organisms/AllUsersCreateListFromSelectedModal';
import useUsersFiltersHumanReadable from '../../../../hooks/useUsersFiltersHumanReadable';
import { getListMembers } from '../../../../services/api/lists';
import { ModalContext } from 'context/Modal';
import UsersTable from '../all/UsersTable/UsersTable';
import ListsTable from './ListsTable/ListsTable';
import formatServerError from 'shared/utils/formatServerError';

export default function Lists() {
  const selection = useSelection([]);

  const { list, edit, del, grandTotalCount, createStatic, createDynamic, addMembers } = useLists();
  const pagination = usePagination();
  const sortBy = useSortBy();
  const params = useParams<{ organizationId?: string }>();

  const filterStrings = useUsersFiltersHumanReadable();

  const { organizationId } = params;

  const { openModal, closeModal } = useContext(ModalContext);

  const filters = useFilters();

  useEffect(() => {
    grandTotalCount.fetch(Number(organizationId));
  }, [organizationId]);

  useEffect(() => {
    return () => {
      filters.resetFilters();
    };
  }, []);

  return (
    <>
      <Head>
        <title>Участники</title>
      </Head>
      <UsersPageTabLayout
        title="Участники"
        actions={
          Number.isInteger(grandTotalCount.value)
            ? [
                <Box key="all" sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ marginRight: 1 }}>ВСЕГО: </Typography>
                  <NumberHighlight>{grandTotalCount.value}</NumberHighlight>
                </Box>,
              ]
            : []
        }
      >
        <ListsTable
          actions={[
            {
              label: 'Добавить новый список',
              notDisabled: true,
              onClick: () => {
                openModal(
                  <UsersTable
                    actions={[
                      {
                        label: 'Добавить в список',
                        // add types
                        onClick: (selection, selectedUsers) => {
                          openModal(
                            <AllUsersCreateListFromSelectedModal
                              onSubmit={async (name) => {
                                try {
                                  const ids = selection.isAllSelected 
                                    ? selectedUsers.map(user => user.id)
                                    : selection.selected;
                                  await createStatic.fetch({
                                    organizationId: Number(organizationId),
                                    name,
                                    members: ids,
                                  });
                                  toast.success('Сохранено');
                                  closeModal();
                                  window.location.reload();
                                } catch (error) {
                                  toast.error(formatServerError(error));
                                }
                              }}
                              submitting={createStatic.loading}
                              selection={selection}
                            />,
                            {
                              title: 'Новый список',
                            }
                          );
                        },
                      },
                    ]}
                    rowsPerPage={5}
                  />,
                  {
                    maxWidth: false,
                    title: 'Создать новый список',
                  }
                );
                // setCreateListFromFiltersModalOpen(true);
              },
              // disabled: !(list.data?.length && (selection.isAllSelected || list.totalCount === selection.selected.length || !filters.isEmpty())),
            },
          ]}
        />
      </UsersPageTabLayout>
    </>
  );
}
