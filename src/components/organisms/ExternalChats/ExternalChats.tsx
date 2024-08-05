import { useEffect, useState } from 'react';
import { getExternalChats } from 'services/api/organizations';
import { Box } from '@material-ui/core';
import NewExternalChat from './NewExternalChat/NewExternalChat';
import ExternalChatsList from './ExternalChatsList/ExternalChatsList';
import { toast } from 'react-toastify';
import formatServerError from 'shared/utils/formatServerError';
import { ExternalChat } from 'shared/interfaces/externalChats';

const ExternalChats = ({ organizationId }: { organizationId: number }): JSX.Element => {
  const [chatsData, setChatsData] = useState<ExternalChat[]>([]);
  const [showAddNewChat, setShowAddNewChat] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        const response = await getExternalChats(organizationId);
        setChatsData(response);
      } catch (error) {
        toast.error(formatServerError(error));
        throw error;
      }
    })();
  }, [organizationId]);

  const addNewChat = (chat: ExternalChat) => {
    const copyChatsData = [...chatsData];
    copyChatsData.push(chat);
    setChatsData(copyChatsData);
  };

  const updateChat = (chat: ExternalChat) => {
    const updatedChats = chatsData.map((dataChat) =>
      dataChat.id === chat.id ? { ...dataChat, value: chat.value, name: chat.name } : dataChat
    );
    setChatsData(updatedChats);
  };

  const deleteChat = (chatId: number) => {
    setChatsData(chatsData.filter((chat) => chat.id !== chatId));
  };

  return (
    <Box>
      {!!chatsData.length && (
        <ExternalChatsList
          organizationId={organizationId}
          chatsData={chatsData}
          updateChat={updateChat}
          deleteChat={deleteChat}
          setShowAddNewChat={setShowAddNewChat}
        />
      )}

      {(!chatsData.length || showAddNewChat) && (
        <NewExternalChat
          addNewChat={addNewChat}
          setShowAddNewChat={setShowAddNewChat}
          organizationId={organizationId}
          firstChat={!!chatsData.length}
        />
      )}
    </Box>
  );
};

export default ExternalChats;
