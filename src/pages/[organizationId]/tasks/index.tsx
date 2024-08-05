import { Box, TextField, Typography } from '@material-ui/core';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import KanbanContainer from 'shared/components/Kanban/KanbanContainer';
import { getUserData } from 'services/api/auth';
import UsersSelect from './UsersSelect';
import { useDispatch, useSelector } from '../../../redux';
import { setSearchQuery } from 'shared/slices/tasks';
import { ModalContext } from 'context/Modal';
import { listUsers } from 'services/api/users';
import Head from 'react-helmet';

export default function Tasks() {
  const { openModal, closeModal } = useContext(ModalContext);

  const { organizationId } = useParams<{ organizationId?: string }>();
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();
  const searchQuery = useSelector((state) => state.tasks.searchQuery);

  useEffect(() => {
    (async () => {
      const userData = await getUserData();
      if (userData) {
        setUser(userData);
      }
    })();
  }, []);
  return (
    <>
      <Head>
        <title>Задачи</title>
      </Head>
      <Box sx={{ overflowX: 'hidden' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            variant="h3"
            sx={{
              textTransform: 'uppercase',
              ml: 1,
            }}
          >
            Задачи объединения
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              fullWidth
              value={searchQuery}
              label="Поиск"
              variant="outlined"
              onChange={(event) => {
                dispatch(setSearchQuery(event.target.value));
              }}
            />
            <UsersSelect getOrganizationUsers={listUsers} orgId={organizationId} />
          </Box>
        </Box>

        <KanbanContainer
          orgId={organizationId}
          profile={user}
          isAdminApp
          closeModal={closeModal}
          openModal={openModal}
          getOrganizationUsers={listUsers}
          userInOrganization={false}
          isOnlyMyCards={false}
        />
      </Box>
    </>
  );
}
