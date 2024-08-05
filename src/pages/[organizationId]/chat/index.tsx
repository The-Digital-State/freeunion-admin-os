import Chat from 'shared/Chat/Chat';
import { useContext, useEffect } from 'react';
import { ModalContext } from 'context/Modal';
import { getUser } from 'services/api/auth';
import { listUsers } from 'services/api/users';
import { useParams } from 'react-router';
import { setOrganizationId, setThreads, setMessages } from 'shared/slices/chat';
import { useDispatch, useSelector } from '../../../redux';

export const routes = {
  lists: {},
};

function ChatWrapper() {
  const { openModal, closeModal } = useContext(ModalContext);
  const dispatch = useDispatch();
  const params = useParams<{ organizationId?: string }>();
  const { organizationId } = params;
  const orgId = useSelector((state) => state.chat.organizationId);

  useEffect(() => {
    if (organizationId) {
      dispatch(setOrganizationId(organizationId));
    }
    return () => {
      dispatch(setOrganizationId(null));
      dispatch(setThreads([]));
      dispatch(setMessages([]));
    };
  }, [organizationId, dispatch]);

  if (!orgId) return null;
  return (
    <Chat
      openModal={openModal}
      closeModal={closeModal}
      getUserData={getUser}
      getOrganizationUsers={listUsers}
      orgId={orgId}
    />
  );
}

export default ChatWrapper;
