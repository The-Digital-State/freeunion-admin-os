// @ts-nocheck
import Head from 'react-helmet';
// import EyeIcon from 'lib/material-kit/icons/Eye';
import { useParams } from 'react-router-dom';
// import NavigationLayout from '../../../../components/layout/NavigationLayout/NavigationLayout';
import { Box, Typography, TextField } from '@material-ui/core';
import NotificationPageTabLayout from '../../../../components/layout/NotificationPageTabLayout/NotificationPageTabLayout';
// import NumberHighlight from '../../../../components/atoms/NumberHighlight';
import { useContext, useEffect, useState } from 'react';
import MUICancel from '@material-ui/icons/Cancel';
import { toast } from 'react-toastify';
import { sendNotification } from '../../../../services/api/notification';
import { addTemplateToSettings, getUserData } from 'services/api/auth';
import TemplateModal from 'components/molecules/TemplateModal/TemplateModal';
import QuillEditor from 'lib/material-kit/components/QuillEditor';
import { ModalContext } from 'context/Modal';
import UsersTable from 'pages/[organizationId]/users/all/UsersTable/UsersTable';
import ListsTable from 'pages/[organizationId]/users/lists/ListsTable/ListsTable';
import ChipButtonAdd from 'components/atoms/ChipButtonAdd';
import { Button } from 'shared/components/common/Button/Button';
import formatServerError from 'shared/utils/formatServerError';

const INITIAL_STATE = {
  title: '',
  message: '',
  users: [] as Recipient[],
  lists: [] as Recipient[],
};

type Recipient = {
  id: number;
  label: string;
};

export default function CreateNotification() {
  const openTemplateModal = () => {
    setNotificationTemplateModalOpen(true);
  };
  const params = useParams<{ organizationId?: string }>();
  const { organizationId } = params;

  const [form, setForm] = useState(INITIAL_STATE);

  const [notificationTemplateModalOpen, setNotificationTemplateModalOpen] = useState(false);
  const [templatesArray, setTemplatesArray] = useState<any>();
  const [templateId, setTemplateId] = useState<number>(null);
  const [addedNewTemplate, setAddedNewTemplate] = useState<boolean>(false);

  const modalContext = useContext(ModalContext);

  const updateTemplateId = (id: number) => {
    setTemplateId(id);
  };

  const saveTemplate = () => {
    templatesArray.push({ title: form.title, message: form.message });
    (async () => {
      await addTemplateToSettings(templatesArray);
    })();
    setAddedNewTemplate(!addedNewTemplate);
    toast.success('Шаблон сохранен!');
  };

  useEffect(() => {
    const savedNotification = JSON.parse(sessionStorage.getItem('oldNotification'));

    if (savedNotification) {
      setForm(savedNotification);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('oldNotification', JSON.stringify(form));
  }, [form]);

  useEffect(() => {
    (async () => {
      const userData = await getUserData();
      if (userData) {
        if (userData.settings.templates) {
          setTemplatesArray(userData.settings.templates);
        } else {
          setTemplatesArray([]);
        }
      }
    })();
  }, [notificationTemplateModalOpen]);

  useEffect(() => {
    if (templateId === null) {
      return;
    }

    const { title, message } = templatesArray[templateId];

    setForm((state) => {
      return {
        ...state,
        title,
        message,
      };
    });
  }, [templateId, templatesArray]);

  const allUsersSelected = form.users[0]?.id === 0;

  const handleSubmit = async () => {
    try {
      const { title, message, users, lists } = form;

      await sendNotification(+organizationId, {
        title,
        message,
        lists: allUsersSelected ? undefined : lists.map((list) => list.id),
        members: allUsersSelected ? undefined : users.map((user) => user.id),
      });
      setForm(INITIAL_STATE);
      toast.success('Уведомления отправлены!');
    } catch (error) {
      console.log(error);
      toast.error(formatServerError(error));
    }
  };

  return (
    <>
      <Head>
        <title>Уведомления</title>
      </Head>
      <NotificationPageTabLayout
        title="Уведомления объединения"
        // actions={[
        //   <Box key="create" sx={{ display: 'flex', alignItems: 'center' }}>
        //     <Typography sx={{ marginRight: 1, marginTop: 1.5, color: 'rgba(37, 56, 88, 1)' }}>
        //       Предпросмотр
        //     </Typography>
        //     <Box sx={{ marginRight: 1, marginTop: 1.5 }}>
        //       <EyeIcon sx={{ marginTop: 1.1, color: 'rgba(66, 82, 110, 0.86)' }} />
        //     </Box>
        //   </Box>,
        // ]}
      >
        <form style={{ padding: '20px 20px 0 20px' }}>
          <Box>
            <Typography
              sx={{
                mt: 3,
                ml: 4,
                mb: 0,
                fontSize: '13px',
                fontWeight: '500',
                lineHeight: '20px',
                color: 'rgba(66, 82, 110, 0.86)',
              }}
            >
              Заголовок
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
              }}
            >
              <Box
                sx={{
                  m: 1.5,
                  mr: 2,
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  flex: '1 1 0 ',
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                  }}
                >
                  <TextField
                    fullWidth={true}
                    variant="outlined"
                    onChange={(e) => {
                      setForm({
                        ...form,
                        title: e.target.value,
                      });
                    }}
                    value={form.title}
                  />
                </Box>
              </Box>
              <Button
                onClick={() => {
                  openTemplateModal();
                  setTemplateId(null);
                }}
              >
                Выбрать шаблон
              </Button>
            </Box>
            {notificationTemplateModalOpen && (
              <TemplateModal
                open={notificationTemplateModalOpen}
                setOpen={setNotificationTemplateModalOpen}
                updateTemplateId={updateTemplateId}
                addedNewTemplate={addedNewTemplate}
              />
            )}
          </Box>
          <Box>
            <Typography
              sx={{
                mt: 0,
                ml: 4,
                mb: 0,
                fontSize: '13px',
                fontWeight: '500',
                lineHeight: '20px',
                color: 'rgba(66, 82, 110, 0.86)',
              }}
            >
              Сообщение
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
              }}
            >
              <Box
                sx={{
                  m: 1.5,
                  mr: 2,
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  flex: '1 1 0 ',
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                  }}
                >
                  <QuillEditor
                    fullWidth={true}
                    variant="outlined"
                    multiline
                    rows={2}
                    onChange={(e) => {
                      // don't delete function, library issue
                      setForm((state) => {
                        return {
                          ...state,
                          message: e,
                        };
                      });
                    }}
                    value={form.message}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              minHeight: 52,
              marginBottom: 2,
              paddingLeft: 2,
            }}
          >
            {/* <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      alignItems: 'center',
                      marginRight: 2.3,
                      left: 520,
                    }}
                  >
                    <Box>
                      <Typography sx={{ marginRight: 2, fontWeight: 500, fontSize: 16, textTransform: 'uppercase' }}>
                        Выбрано участников:{' '}
                      </Typography>
                    </Box>
                    <Box>
                      <NumberHighlight isCircle={true}>{403}</NumberHighlight>
                    </Box>
                  </Box>*/}

            {[
              {
                title: 'Участники',
                type: 'users',
                Component: UsersTable,
              },
              {
                title: 'Списки',
                type: 'lists',
                Component: ListsTable,
              },
            ]
              .filter((entity) => {
                if (entity.type === 'lists' && allUsersSelected) {
                  return false;
                }
                return true;
              })
              .map((entity) => {
                const { type, title, Component } = entity;

                return (
                  <Box
                    sx={{
                      width: '50%',
                    }}
                  >
                    <Typography
                      sx={{
                        mt: 2,
                        mb: 1,
                        fontSize: '13px',
                        fontWeight: '500',
                        lineHeight: '20px',
                        color: 'rgba(66, 82, 110, 0.86)',
                      }}
                    >
                      {title}
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                      }}
                    >
                      {form[type].map(({ id, label }) => {
                        return (
                          <ChipButtonAdd
                            sx={{ marginRight: 1 }}
                            label={label}
                            customIcon={<MUICancel />}
                            onClick={() => {
                              const newRecipients = form[type].filter((item) => item.id !== id);

                              setForm({
                                ...form,
                                [type]: newRecipients,
                              });
                            }}
                          />
                        );
                      })}

                      {!(type === 'users' && allUsersSelected) && (
                        <ChipButtonAdd
                          label="Добавить"
                          onClick={() => {
                            modalContext.openModal(
                              <Component
                                actions={[
                                  {
                                    label: 'Добавить',
                                    onClick: (selection, _tempData) => {
                                      modalContext.closeModal();

                                      let data = _tempData.map((data) => {
                                        let label = '';
                                        if (type === 'users') {
                                          label = `${data.firstName} ${data.lastName}`;
                                        } else if (type === 'lists') {
                                          label = data.name;
                                        }
                                        return {
                                          id: data.id,
                                          label,
                                        };
                                      });

                                      if (type === 'users' && selection.isAllSelected) {
                                        data = [
                                          {
                                            label: 'Все',
                                            id: 0,
                                          },
                                        ];
                                      }

                                      setForm({
                                        ...form,

                                        [type]: data,
                                      });
                                    },
                                  },
                                ]}
                              />,
                              { maxWidth: false }
                            );
                          }}
                        >
                          Добавить
                        </ChipButtonAdd>
                      )}
                    </Box>
                  </Box>
                );
              })}
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
              marginBottom: 2,
              paddingLeft: 2,
              gap: 2,
            }}
          >
            <Button
              color="light"
              disabled={form.title && form.message.replace(/(<([^>]+)>)/gi, '') ? false : true}
              onClick={() => saveTemplate()}
            >
              Сохранить шаблон
            </Button>
            <Button
              onClick={() => handleSubmit()}
              disabled={
                (form.lists.length !== 0 || form.users.length !== 0) &&
                form.title &&
                form.message.replace(/(<([^>]+)>)/gi, '')
                  ? false
                  : true
              }
            >
              Отправить
            </Button>
          </Box>
        </form>
      </NotificationPageTabLayout>
    </>
  );
}
