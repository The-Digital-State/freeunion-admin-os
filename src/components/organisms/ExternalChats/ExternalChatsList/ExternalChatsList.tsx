import { Box, IconButton, TextField, Typography } from '@material-ui/core';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { deleteExternalChat, updateExternalChat } from 'services/api/organizations';
import { FieldArray, Formik } from 'formik';
import * as Yup from 'yup';
import CheckCircle from '@material-ui/icons/CheckCircle';
import CancelSharp from '@material-ui/icons/CancelSharp';
import TrashIcon from '../../../../lib/material-kit/icons/Trash';
import PencilAltIcon from '../../../../lib/material-kit/icons/PencilAlt';
import AddIcon from '../../../../lib/material-kit/icons/Plus';
import formatServerError from 'shared/utils/formatServerError';
import { ExternalChat } from 'shared/interfaces/externalChats';
import Tooltip from 'shared/components/common/Tooltip/Tooltip';

type ExternalChatsListType = {
  organizationId: number;
  chatsData: ExternalChat[];
  updateChat: (chat: ExternalChat) => void;
  deleteChat: (chatId: number) => void;
  setShowAddNewChat: (addNewChat: boolean) => void;
};

const ExternalChatsList = ({
  organizationId,
  chatsData,
  updateChat,
  deleteChat,
  setShowAddNewChat,
}: ExternalChatsListType) => {
  const [edit, setEdit] = useState<number[]>([]);

  const saveChanges = async (chat: ExternalChat, id: number) => {
    try {
      await updateExternalChat({ name: chat.name, value: chat.value }, id, organizationId);
      updateChat(chat);
      toast.success('Чат успешно обновлен!');
      setEdit([]);
    } catch (e) {
      toast.error(formatServerError(e));
    }
  };

  const deleteChatClick = async (id: number) => {
    try {
      const isDelete = window.confirm('Вы действительно хотите удалить этот чат?');
      if (isDelete) {
        await deleteExternalChat(id, organizationId);
        deleteChat(id);
        toast.success('Чат успешно удален!');
      }
    } catch (e) {
      toast.error(formatServerError(e));
    }
  };
  return (
    <Formik
      enableReinitialize
      initialValues={{
        chats: chatsData as ExternalChat[],
      }}
      validationSchema={() => {
        return Yup.lazy((values) => {
          return Yup.object().shape({
            chats: Yup.array().of(
              Yup.object().shape({
                type: Yup.number().required(),
                name: Yup.string().trim().required('Поле обязательно для заполнения'),
                value:
                  !!edit.length &&
                  (!+values.chats[edit[0]].type
                    ? Yup.string().url('Неправильный формат ссылки на чат').required('Поле обязательно для заполнения')
                    : Yup.string()
                        .min(4, 'Мало символов')
                        .matches(/@[a-zA-Z0-9]/, 'Неправильный формат')
                        .required('Поле обязательно для заполнения')),
              })
            ),
          });
        });
      }}
      onSubmit={() => {}}
    >
      {({ handleSubmit, handleBlur, values, errors }): JSX.Element => {
        const { chats } = values;
        return (
          <form onSubmit={handleSubmit}>
            <FieldArray
              name="chats"
              render={(arrayHelpers) => (
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                  {values.chats.map((chat, index) => {
                    return (
                      <>
                        <Typography sx={{ m: 0, mb: 2 }}>{!chat.type ? 'Обычный чат' : 'Инкогнио чат'}</Typography>
                        <Box
                          sx={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            mb: 4,
                          }}
                        >
                          <TextField
                            label="Ссылка на чат"
                            onBlur={handleBlur}
                            disabled={!edit.includes(index)}
                            name={`values.chats.${index}.value`}
                            onChange={(e) => {
                              const copyChats = Object.assign({}, chats[index]);
                              copyChats.value = e.target.value;
                              arrayHelpers.replace(index, copyChats);
                            }}
                            value={chat.value}
                            variant="outlined"
                            sx={{ height: 50, width: '50%', mr: 5 }}
                            error={Boolean(
                              //@ts-ignore
                              edit[0] === index && errors?.chats && errors.chats[index] && errors.chats[index].value
                            )}
                            //@ts-ignore
                            helperText={edit[0] === index && errors?.chats && errors.chats[index]?.value}
                          />
                          <TextField
                            label="Название чата"
                            onBlur={handleBlur}
                            disabled={!edit.includes(index)}
                            name={`values.chats.${index}.name`}
                            onChange={(e) => {
                              const copyChats = Object.assign({}, chats[index]);
                              copyChats.name = e.target.value;
                              arrayHelpers.replace(index, copyChats);
                            }}
                            value={chat.name}
                            variant="outlined"
                            sx={{ height: 50, width: '30%' }}
                            error={Boolean(
                              //@ts-ignore
                              edit[0] === index && errors?.chats && errors.chats[index] && errors.chats[index].name
                            )}
                            //@ts-ignore
                            helperText={edit[0] === index && errors?.chats && errors.chats[index]?.name}
                          />
                          {!edit.includes(index) ? (
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                              <>
                                <IconButton
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteChatClick(chat.id);
                                  }}
                                  data-tip
                                  data-for={`deleteExternalChatLinkTooltip${index}`}
                                >
                                  <TrashIcon fontSize="small" />
                                </IconButton>
                                <Tooltip id={`deleteExternalChatLinkTooltip${index}`} title="Удалить чат" />
                              </>
                              <Box>
                                <IconButton
                                  disabled={!!edit.length}
                                  onClick={() => {
                                    const addEdit = [...edit, index];
                                    setEdit(addEdit);
                                  }}
                                  data-tip
                                  data-for={`changeExternalChatLinkTooltip${index}`}
                                >
                                  <PencilAltIcon fontSize="small" />
                                </IconButton>
                                <Tooltip id={`changeExternalChatLinkTooltip${index}`} title="Поменять ссылку" />
                              </Box>
                              {index === chats.length - 1 && (
                                <>
                                  <IconButton
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setShowAddNewChat(true);
                                    }}
                                    data-tip
                                    data-for={`addExternalChatLinkTooltip${index}`}
                                  >
                                    <AddIcon fontSize="small" />
                                  </IconButton>
                                  <Tooltip id={`addExternalChatLinkTooltip${index}`} title="Добавить чат" />
                                </>
                              )}
                            </Box>
                          ) : (
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                              <Box>
                                <IconButton
                                  disabled={
                                    //@ts-ignore
                                    (!!errors.chats && !!errors.chats[index] && !!errors.chats[index].name) ||
                                    //@ts-ignore
                                    (!!errors.chats && !!errors.chats[index] && !!errors.chats[index].value)
                                  }
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    saveChanges(values.chats[index], chat.id);
                                  }}
                                  data-tip
                                  data-for={`saveExternalChatLinkTooltip${index}`}
                                >
                                  <CheckCircle fontSize="small" />
                                </IconButton>
                                <Tooltip id={`saveExternalChatLinkTooltip${index}`} title="Сохранить" />
                              </Box>
                              <Box>
                                <IconButton
                                  onClick={() => {
                                    const filterEdit = edit.filter((i) => i !== index);
                                    setEdit(filterEdit);
                                    const copyChats = Object.assign({}, chats[index]);
                                    let rejectChat = chatsData.find((i) => i.id === copyChats.id);
                                    copyChats.value = rejectChat.value;
                                    copyChats.name = rejectChat.name;
                                    arrayHelpers.replace(index, copyChats);
                                  }}
                                  data-tip
                                  data-for={`cancelExternalChatLinkTooltip${index}`}
                                >
                                  <CancelSharp fontSize="small" />
                                </IconButton>
                                <Tooltip id={`cancelExternalChatLinkTooltip${index}`} title="Отменить" />
                              </Box>
                            </Box>
                          )}
                        </Box>
                      </>
                    );
                  })}
                </Box>
              )}
            />
          </form>
        );
      }}
    </Formik>
  );
};

export default ExternalChatsList;
