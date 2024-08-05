import { Fragment, useContext, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import Head from 'react-helmet';
import { Box, TextField, Typography } from '@material-ui/core';
import { toast } from 'react-toastify';

import UserDetails from '../../../../components/organisms/UserDetails';
import AllUsersCreateListFromSelectedModal from '../../../../components/organisms/AllUsersCreateListFromSelectedModal';
import Modal from '../../../../components/molecules/Modal';
import { FilterType, FilterListItem } from '../../../../components/molecules/FiltersList/FiltersList';
import DetailsModal from '../../../../components/molecules/DetailsModal';

import useUsers from '../../../../hooks/useUsers';
import usePagination from '../../../../hooks/usePagination';
import useFilters from '../../../../hooks/useFilters';
import useLists from '../../../../hooks/useLists';
import useUsersFiltersHumanReadable from '../../../../hooks/useUsersFiltersHumanReadable';
import useSelection from '../../../../hooks/useSelection';
import useSortBy from '../../../../hooks/useSortBy';
import stringifyUser from '../../../../helpers/stringifyUser';
import { FilterOperationType } from '../../../../services/api/types';
import { IFetchUsersProps, User } from '../../../../services/api/users';
import { useSelector } from '../../../../redux';
import AllUsersCreateListFromFiltersModal from '../../../../components/organisms/AllUsersCreateListFromFiltersModal';
import AllUsersAddSelectedToListModal from '../../../../components/organisms/AllUsersAddSelectedToListModal';
import UsersPageTabLayout from 'components/layout/UsersPageTabLayout';
import NumberHighlight from 'components/atoms/NumberHighlight';
import UsersTable from './UsersTable/UsersTable';
import { ModalContext } from 'context/Modal';
import useApplication from 'hooks/useApplications';
import formatServerError from 'shared/utils/formatServerError';

export default function AllUsers({ fromModal = false }) {
  const { list, edit, del, details, currentUser, grandTotalCount } = useUsers();
  const { createStatic, createDynamic, addMembers } = useLists();
  const params = useParams<{ organizationId?: string }>();
  const { organizationId } = params;

  const pagination = usePagination();
  const filters = useFilters();
  const filterStrings = useUsersFiltersHumanReadable();
  const selection = useSelection([]);
  const sortBy = useSortBy();
  const modalContext = useContext(ModalContext);
  const history = useHistory();

  useEffect(() => {
    grandTotalCount.fetch(Number(organizationId));
  }, [organizationId]);

  return (
    <Fragment>
      <Head>
        <title>Участники</title>
      </Head>

      <UsersPageTabLayout
        title="Участники"
        actions={[
          <Box key="all" sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ marginRight: 1 }}>ВСЕГО: </Typography>
            <NumberHighlight>{grandTotalCount.value || 0}</NumberHighlight>
          </Box>,
        ]}
      >
        <UsersTable
          actions={[
            {
              label: 'Создать список',
              onClick: (selection, users) => {
                const selectedIds = selection.isAllSelected ? users.map((user) => user.id) : selection.selected;
                modalContext.openModal(
                  <AllUsersCreateListFromSelectedModal
                    onSubmit={(name) => {
                      createStatic
                        .fetch({
                          organizationId: Number(organizationId),
                          name: name,
                          members: selectedIds,
                        })
                        .then((id) => {
                          toast.success('Сохранено');
                          modalContext.closeModal();
                          history.push('./lists/' + id);
                        })
                        .catch((e) => {
                          toast.error(formatServerError(e));
                        });
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
        />
        {/* <AllUsersCreateListFromFiltersModal
          open={createListFromFiltersModalOpen}
          setOpen={setCreateListFromFiltersModalOpen}
          onSubmit={handleCreateDynamicList}
          submitting={createDynamic.loading}
          filterStrings={filterStrings}
        />

     
        */}
      </UsersPageTabLayout>
    </Fragment>
  );
}
