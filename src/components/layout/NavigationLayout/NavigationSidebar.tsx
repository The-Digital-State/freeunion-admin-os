import { useParams } from 'react-router-dom';
import { useSelector } from '../../../redux';
import { Avatar, Box, Divider, Drawer, Typography } from '@material-ui/core';
// import ChartSquareBarIcon from '../../../lib/material-kit/icons/ChartSquareBar';
// import CheckCircleIcon from '../../../lib/material-kit/icons/CheckCircle';
// import TemplateIcon from '../../../lib/material-kit/icons/Template';
import NavSection from '../../../lib/material-kit/components/NavSection';
import Scrollbar from '../../../lib/material-kit/components/Scrollbar';
import { useEffect, useState } from 'react';
import InviteParticipantModal from '../../organisms/InviteParticipantModal/InviteParticipantModal';
import { getExternalChats, getExternalChat } from 'services/api/organizations';
import { toast } from 'react-toastify';
import { Icon } from 'shared/components/common/Icon/Icon';
import { ExternalChat } from 'shared/interfaces/externalChats';
import { Button } from 'shared/components/common/Button/Button';

const NavigationSidebar = () => {
  const params = useParams<{ organizationId?: string }>();
  const { profile, requestsNewCount } = useSelector(({ profile, requests }) => {
    return {
      profile: profile.data,
      requestsNewCount: requests.newCount,
    };
  }) as any;
  const [chats, setChats] = useState<ExternalChat[]>([]);

  const { organizationId } = params;

  const openParticipantModal = () => {
    setInviteParticipantModalOpen(true);
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await getExternalChats(+organizationId);
        setChats(response);
      } catch (error) {
        throw error;
      }
    })();
  }, [organizationId]);

  const sections = [
    // {
    //   title: 'Главное',
    //   items: [
    // {
    //   title: 'Обзор',
    //   path: `/${organizationId}/dashboard`,
    //   icon: <ChartSquareBarIcon fontSize="small" />,
    // },
    // {
    //   title: 'Задачи',
    //   path: `/${organizationId}/tasks`,
    //   icon: <CheckCircleIcon fontSize="small" />,
    // },
    //   ],
    // },
    {
      title: 'Управление',
      items: [
        {
          title: 'Объединение',
          path: `/${organizationId}/union`,
          icon: <Icon iconName="unions" width={24} height={24} />,
        },
        {
          title: 'Участники',
          path: `/${organizationId}/users/all`,
          pathname: `/${organizationId}/users`,
          icon: <Icon iconName="user" width={24} height={24} />,
          count: requestsNewCount,
          // info: '2345 / 45',
        },
        {
          title: 'Уведомления',
          path: `/${organizationId}/notifications/new`,
          icon: <Icon iconName="bell" width={24} height={24} />,
        },
        {
          title: 'Задачи',
          path: `/${organizationId}/tasks`,
          icon: <Icon iconName="presentionChart" width={24} height={24} />,
        },
        {
          title: 'Новости',
          path: `/${organizationId}/news/draft`,
          pathname: `/${organizationId}/news`,
          icon: <Icon iconName="searchNews" width={24} height={24} />,
        },
        {
          title: 'Финансы',
          path: `/${organizationId}/finances`,
          icon: <Icon iconName="finance" width={24} height={24} />,
        },
        {
          title: 'API',
          path: `/${organizationId}/api`,
          icon: <Icon iconName="setting" width={24} height={24} />,
        },
        {
          title: 'Чат',
          path: `/${organizationId}/chat`,
          icon: <Icon iconName="chat" width={24} height={24} />,
        },
        {
          title: 'Важно знать',
          path: `/${organizationId}/kbase/sections`,
          pathname: `/${organizationId}/kbase`,
          icon: <Icon iconName="teacher" width={24} height={24} />,
        },
        {
          title: 'Опросы',
          path: `/${organizationId}/polls/create`,
          pathname: `/${organizationId}/polls`,
          icon: <Icon iconName="polls" width={24} height={24} />,
        },

        // {
        //     title: 'Сайт',
        //     path: `/${organizationId}/constructor`,
        //     icon: <TemplateIcon fontSize="small"/>,
        // },
      ],
    },
  ];

  const [inviteParticipantModalOpen, setInviteParticipantModalOpen] = useState(false);
  const content = (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <Scrollbar options={{ suppressScrollX: true }}>
          <Box sx={{ p: 2 }}>
            <Box
              sx={{
                alignItems: 'center',
                backgroundColor: 'background.default',
                borderRadius: 1,
                display: 'flex',
                overflow: 'hidden',
                p: 2,
              }}
            >
              <Avatar
                src={profile.avatar}
                sx={{
                  cursor: 'pointer',
                  height: 48,
                  width: 48,
                }}
              />
              <Box sx={{ ml: 2 }}>
                <Typography color="textPrimary" variant="subtitle2">
                  {profile.public_name} {profile.public_family}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Divider />
          <Box sx={{ p: 2 }}>
            {sections.map((section) => (
              <NavSection
                key={section.title}
                pathname={window.location.pathname.replace(/\[/g, ':').replace(/\]/g, '') as string}
                sx={{
                  '& + &': {
                    mt: 3,
                  },
                }}
                {...section}
              />
            ))}
          </Box>
          <Divider />
          <Box sx={{ padding: '0 8px', textAlign: 'center' }}>
            <Button onClick={openParticipantModal} size="small" maxWidth type="button">
              Пригласить участника
            </Button>
          </Box>
          {!!chats?.length && (
            <Box sx={{ padding: '0 8px', textAlign: 'center' }}>
              <Button
                color="light"
                onClick={async () => {
                  if (!chats[0].need_get) {
                    window.open(chats[0].value, '_blank');
                    return;
                  }
                  try {
                    const chatData = await getExternalChat(organizationId, chats[0].id);

                    if (chatData.link) {
                      window.open(chatData.link, '_blank');
                    } else {
                      toast.error('Ссылка не получена');
                    }
                  } catch (error) {
                    toast.error(error);
                  }
                }}
                size="small"
                maxWidth
                type="button"
              >
                Чат
              </Button>
            </Box>
          )}

          <Box sx={{ padding: '0 8px', textAlign: 'center' }}>
            {/* @ts-ignore */}
            <Button
              size="small"
              maxWidth
              target="freeunion-app"
              to={process.env.REACT_APP_CLIENT_APP_URL + '/union/' + organizationId}
            >
              Вернуться в сервис
            </Button>
          </Box>
        </Scrollbar>
      </Box>

      <InviteParticipantModal open={inviteParticipantModalOpen} setOpen={setInviteParticipantModalOpen} />
    </>
  );

  return (
    <Drawer
      anchor="left"
      open
      PaperProps={{
        sx: {
          backgroundColor: 'background.paper',
          // height: 'calc(100% - 64px) !important',
          // top: '64px !Important',
          width: 280,
        },
      }}
      variant="permanent"
    >
      {content}
    </Drawer>
  );
};

export default NavigationSidebar;
