import { useContext, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Head from 'react-helmet';
import { Box, Typography, Divider, TextField } from '@material-ui/core';
import usePagination from 'hooks/usePagination';
import useLists from 'hooks/useLists';
import useFilters from 'hooks/useFilters';
import useUsers from 'hooks/useUsers';
import useUsersFiltersHumanReadable from 'hooks/useUsersFiltersHumanReadable';
import useSortBy from 'hooks/useSortBy';
import { useSelector } from '../../../../../redux';
import UsersPageTabLayout from 'components/layout/UsersPageTabLayout/UsersPageTabLayout';
import { ModalContext } from 'context/Modal';
import UsersTable from '../../all/UsersTable/UsersTable';
import { toast } from 'react-toastify';
import Modal from 'components/molecules/Modal';
import formatServerError from 'shared/utils/formatServerError';

const CloseIcon = require('lib/material-kit/icons/X').default;

export default function ListDetails() {
  const { listDetails, listMembers, createStatic, addMembers, edit: listEdit, del: listDelete } = useLists();
  const { list, edit, del, details, grandTotalCount } = useUsers();
  const pagination = usePagination();
  const sortBy = useSortBy();
  const params = useParams<{ organizationId: string; listId: string }>();
  const dictionaries = useSelector((state) => state.dictionaries);
  const filterStrings = useUsersFiltersHumanReadable(listDetails.data?.filters);
  const filters = useFilters();
  const modalContext = useContext(ModalContext);
  const history = useHistory();

  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [renameListId, setRenameListId] = useState<number>();
  const [deleteListId, setDeleteListId] = useState<number>();
  const [listName, setListName] = useState('');

  const { organizationId, listId } = params;
  const [users, setUsers] = useState([]);

  const handleDeleteList = () => {
    listDelete
      .fetch({ organizationId: +organizationId, listId: deleteListId })
      .then(() => {
        toast.success('Удалено');
        history.push('../lists');
        setDeleteModalOpen(false);
      })
      .catch((e) => {
        toast.error(formatServerError(e));
      });
  };

  const handleRenameClick = () => {
    setRenameListId(+listDetails.data.id);
    setListName(listDetails.data.name);
    setRenameModalOpen(true);
  };

  const handleDeleteClick = () => {
    setDeleteListId(+listDetails.data.id);
    setDeleteModalOpen(true);
  };

  const handleEditList = () => {
    listEdit
      .fetch({
        organizationId: +organizationId,
        listId: renameListId,
        name: listName,
      })
      .then(() => {
        toast.success('Сохранено');
        load();
        setRenameModalOpen(false);
      })
      .catch((e) => {
        toast.error(formatServerError(e));
      });
  };

  function load() {
    listDetails.fetch({
      organizationId: +organizationId,
      listId: +listId,
      filters: filters.values,
      sortBy,
    } as any);
  }

  useEffect(() => {
    load();
  }, [organizationId, listId, filters.values, sortBy.direction, sortBy.field]);

  useEffect(() => {
    listMembers.fetch({
      organizationId: +organizationId,
      listId: +listId,
      sortBy,
    });
  }, [organizationId, listId, pagination.page, pagination.perPage, sortBy.direction, sortBy.field]);

  useEffect(() => {
    setUsers(listMembers.data);
  }, [listMembers.data]);

  return (
    <>
      <Head>
        <title>{listDetails.data?.name || 'Загрузка...'}</title>
      </Head>
      <UsersPageTabLayout title="Работа со списком" isSingle>
        <Box
          sx={{
            m: 2,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography color="textPrimary" variant="h4">
            {listDetails.data?.name}
          </Typography>
          <Link to={`/${organizationId}/users/lists`}>
            <Typography color="textSecondary" variant="subtitle2" sx={{ cursor: 'pointer' }}>
              <CloseIcon />
            </Typography>
          </Link>
        </Box>
        <Divider />
        {!listMembers.loading && listMembers.data && (
          <UsersTable
            customData={users}
            menuActions={[
              {
                label: 'Переименовать',
                onClick: () => {
                  handleRenameClick();
                },
              },
              {
                label: 'Удалить',
                onClick: () => {
                  handleDeleteClick();
                },
              },
            ]}
            actions={[
              {
                label: 'Сохранить',
                notDisabled: true,
                onClick: () => {
                  addMembers
                    .fetch({
                      listId: listDetails.data.id,
                      organizationId: Number(organizationId),
                      members: users.map((user) => user.id),
                    })
                    .then(() => {
                      toast.success('Сохранено');
                      history.push('../lists');
                    })
                    .catch((e) => {
                      toast.error(formatServerError(e));
                    });
                },
              },
              {
                label: 'Добавить',
                onClick: () => {
                  modalContext.openModal(
                    <UsersTable
                      actions={[
                        {
                          label: 'Добавить',
                          onClick: (_, data) => {
                            const newUsersUnique = data.filter(newUser => users.findIndex(user => user.id == newUser.id) == -1);
                            setUsers([...users, ...newUsersUnique]);
                            modalContext.closeModal();
                          },
                        },
                      ]}
                    />
                  );
                },
              },
            ]}
          />
        )}

        {listDetails.data && (
          <>
            <Modal
              title={listDetails.data.name}
              submitLabel="Сохранить"
              open={renameModalOpen}
              onClose={() => setRenameModalOpen(false)}
              onSubmit={handleEditList}
              submitting={edit.loading}
              // disabled={!listName || list.data.find((x) => x.id === renameListId)?.name === listName}
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
              title={listDetails.data.name}
              submitLabel="Удалить"
              open={deleteModalOpen}
              onClose={() => setDeleteModalOpen(false)}
              onSubmit={handleDeleteList}
              submitting={del.loading}
            >
              <Box sx={{ minWidth: 500 }}>
                <Typography>
                  Вы действительно хотите удалить список &quot;
                  {listDetails.data.name}&quot;?
                </Typography>
              </Box>
            </Modal>
          </>
        )}
      </UsersPageTabLayout>
    </>
  );
}
