import {
  Avatar,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
  GridSize,
} from '@material-ui/core';
import { toast } from 'react-toastify';
import stringifyUser from '../../../helpers/stringifyUser';
import { useSelector } from '../../../redux';
import { editUser, transformUser, User } from '../../../services/api/users';
import { useLocation } from 'react-router-dom';
import { ReactElement, useEffect, useState } from 'react';
import useUsers from 'hooks/useUsers';
import { getApplication } from 'services/api/applications';
import { RequestStatusesCodesEnum } from 'services/api/dictionaries';
import { HelpOffer } from 'services/api/helpOffers';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import StarOutlineIcon from '@material-ui/icons/StarOutline';
import { Button } from 'shared/components/common/Button/Button';

interface IUserDetails {
  isAdmin?: boolean;
  userId?: number;
  requestId?: number;
  close: () => void;
  handleReferralClick: (id: any) => void;
  open?: boolean;
}

const getUserFullName = (user: User) =>
  `${user?.lastName || ''} ${user?.firstName || ''} ${user?.middleName || ''}`.trim();

const getReferalUserFullName = (user: User['referal']) =>
  `${user?.public_family || ''} ${user?.public_name || ''}`.trim();

function useUser({ userId, requestId, organizationId }) {
  const [user, setUser] = useState(null);
  const [application, setApplication] = useState(null);
  const { details } = useUsers();

  const { dictionaries, helpOffers } = useSelector((state) => {
    return { helpOffers: state.helpOffers.data as HelpOffer[], dictionaries: state.dictionaries };
  });

  function loadUser(userId) {
    details.fetch({ organizationId: +organizationId, userId: +userId });
  }

  useEffect(() => {
    (async () => {
      if (userId) {
        loadUser(userId);
      } else if (requestId) {
        const request = await getApplication({ organizationId, requestId });

        setApplication(request);

        if (request.status !== RequestStatusesCodesEnum.wait) {
          loadUser(request.user_id.id);
          return;
        }
        const user = stringifyUser(transformUser(request.user_id), dictionaries, helpOffers);
        setUser(user);
      }
    })();
  }, [organizationId, userId, requestId, dictionaries]);

  useEffect(() => {
    if (details.data) {
      const user = stringifyUser(details.data, dictionaries, helpOffers);
      setUser(user);
    }
  }, [details.data, dictionaries]);

  return { user, application };
}

const UserDetails = ({ userId, isAdmin, close, handleReferralClick, requestId, open }: IUserDetails) => {
  const location = useLocation();

  const organizationId = location.pathname.split('/')[1];
  const dictionaries = useSelector((state) => state.dictionaries);

  const { user } = useUser({
    userId,
    requestId,
    organizationId,
  });

  const [userData, setUserData] = useState({
    position_id: 0,
    position_name: '',
    comment: '',
    permissions: 0,
    member_description: '',
  });

  const [showUserData, setShowUserData] = useState<boolean>(false);

  function onChange(event) {
    const { name, value } = event.target;

    setUserData({
      ...userData,
      [name]: value,
    });
  }

  useEffect(() => {
    if (!user) {
      return;
    }

    const { comment, permissions, position_id, position_name, member_description } = user;
    setUserData({
      comment,
      permissions,
      position_id,
      position_name,
      member_description,
    });
  }, [user]);

  if (!user) {
    return null;
  }

  async function onSave() {
    const { position_id, position_name, comment, permissions, member_description } = userData;

    try {
      await editUser({
        organizationId: +organizationId,
        userId: user.id,
        member_description: member_description,
        permissions: permissions,
        position_id: position_id,
        position_name: position_name,
        comment,
      });

      toast.success('Пользователь обновлен');
      close();
    } catch (error) {
      toast.error(JSON.stringify(error.message));
    }
  }

  interface MainBlockInterface {
    component: ReactElement;
    gridWidth: GridSize;
  }

  const mainBlock: MainBlockInterface[][] = [
    [
      {
        component: <h4>Пригласил:</h4>,
        gridWidth: 1,
      },
      {
        component: (
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              height: '100%',
              cursor: user.referal?.id ? 'pointer' : 'default',
            }}
            onClick={() => user.referal?.id && handleReferralClick(user.referal.id)}
          >
            <Avatar
              src={user?.referal?.public_avatar}
              sx={{
                height: 42,
                width: 42,
              }}
            />
            <Box sx={{ ml: 1 }}>
              <Typography color="textSecondary" variant="body2">
                {getReferalUserFullName(user.referal as any)}
              </Typography>
            </Box>
          </Box>
        ),
        gridWidth: 3,
      },
    ],
    [
      {
        component: <h4>О себе:</h4>,
        gridWidth: 1,
      },
      {
        component: (
          <Typography
            variant="body1"
            sx={{
              display: 'flex',
              height: '100%',
              alignItems: 'center',
            }}
          >
            {user.about}
          </Typography>
        ),
        gridWidth: 3,
      },
    ],
    [
      {
        component: (
          <TextField
            multiline
            name="comment"
            rows={1}
            label="Комментарий"
            placeholder="Например “участник БРСМ”"
            sx={{ width: '100%' }}
            value={userData.comment || ''}
            onChange={onChange}
          />
        ),
        gridWidth: 4,
      },
    ],
    [
      {
        component: (
          <FormControl sx={{ width: '100%' }}>
            <InputLabel>Роль</InputLabel>
            <Select label="Роль" value={userData.position_id} onChange={onChange} name="position_id">
              <MenuItem value="">
                <em>Не выбрано</em>
              </MenuItem>
              {dictionaries.positions.map(({ id, name }) => {
                return (
                  <MenuItem key={id} value={id}>
                    {name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        ),
        gridWidth: 2,
      },
      {
        component: (
          <Typography
            variant="body1"
            sx={{
              display: 'flex',
              height: '100%',
              alignItems: 'center',
            }}
          >
            Роль - это ряд обязанностей, которые участники выполняют в рамках данного объединения
          </Typography>
        ),
        gridWidth: 2,
      },
    ],
    [
      {
        component: (
          <FormControl sx={{ width: '100%' }}>
            <TextField
              name="position_name"
              label="Должность"
              placeholder="Консультант по блокчейн технологиям"
              //@ts-ignore
              value={userData.position_name || ''}
              onChange={onChange}
              sx={{ width: '100%' }}
            />
          </FormControl>
        ),
        gridWidth: 2,
      },
      {
        component: (
          <Typography
            variant="body1"
            sx={{
              display: 'flex',
              height: '100%',
              alignItems: 'center',
            }}
          >
            Должность - это название роли внутри объединения 
          </Typography>
        ),
        gridWidth: 2,
      },
    ],
    [
      {
        component: (
          <TextField
            multiline
            name="member_description"
            label="Описание"
            placeholder="Например “ставить задачи перед участниками объединения…”"
            //@ts-ignore
            value={userData?.member_description || ''}
            onChange={onChange}
            sx={{ width: '100%' }}
            rows={3}
          />
        ),
        gridWidth: 4,
      },
    ],
    [
      {
        component: (
          <FormControl sx={{ width: '100%' }}>
            <InputLabel>Право доступа</InputLabel>
            <Select label="Право доступа" value={userData.permissions} onChange={onChange} name="permissions">
              <MenuItem value="">
                <em>Не выбрано</em>
              </MenuItem>

              {dictionaries.permissions.map(({ permission, title }) => {
                return (
                  <MenuItem key={permission} value={permission}>
                    {title}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        ),
        gridWidth: 2 as GridSize,
      },
      {
        component: (
          <Typography
            variant="body1"
            sx={{
              display: 'flex',
              height: '100%',
              alignItems: 'center',
            }}
          >
            Право доступа - это доступ к редактированию отдельных блоков в администрантивной панели управления
          </Typography>
        ),
        gridWidth: 2 as GridSize,
      },
    ],
  ];

  const userPrivateInformationBlock = [
    {
      title: 'ФИО:',
      text: getUserFullName(user as any),
    },
    {
      title: 'Дата рождения:',
      text: user?.birthday,
    },
    {
      title: 'Адрес:',
      text: user?.address,
    },
    {
      title: 'Телефон:',
      text: user?.phone,
    },
    {
      title: 'Страна:',
      text: user?.country,
    },
    {
      title: 'Пол:',
      text: user?.sex,
    },
  ];

  const userWorkInformationBlock = [
    {
      title: 'Место работы:',
      text: user?.workPlace,
    },
    {
      title: 'Должность:',
      text: user?.position_name,
    },
    {
      title: 'Cфера деятельности:',
      text: user?.activityScope,
    },
  ];

  return (
    <Box sx={{ width: '767px' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          pb: 3,
          borderBottom: '3px solid #FAFAFA',
          mb: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            src={user?.avatar}
            sx={{
              height: 42,
              width: 42,
            }}
          />
          <Typography variant="subtitle1" sx={{ ml: 1.5 }}>
            {getUserFullName(user as any)}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="subtitle1" sx={{ mr: 1.5 }}>
            {user.points}
          </Typography>
          <StarOutlineIcon sx={{ mt: 0.3 }} />
        </Box>
      </Box>
      {mainBlock.map((children) => {
        return (
          <Grid container columns={4} gap={2} sx={{ mb: 2, flexWrap: 'nowrap' }}>
            {children.map((i) => {
              return (
                <Grid item xs={i.gridWidth} justifyContent="center">
                  {i.component}
                </Grid>
              );
            })}
          </Grid>
        );
      })}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          mb: 3,
          cursor: 'pointer',
          width: 'fit-content',
        }}
        onClick={() => setShowUserData(!showUserData)}
      >
        <Typography variant="h6" sx={{ mr: 1 }}>
          ЛИЧНЫЕ ДАННЫЕ УЧАСТНИКА
        </Typography>
        <KeyboardArrowDownIcon
          sx={
            showUserData ? { transform: 'rotate(-180deg)', transition: 'all .3s ease' } : { transition: 'all .3s ease' }
          }
        />
      </Box>
      {showUserData && (
        <>
          {userPrivateInformationBlock.map((children) => {
            return (
              <Grid
                container
                columns={4}
                gap={2}
                sx={{ mb: 1.5, pb: 1.5, flexWrap: 'nowrap', borderBottom: '3px solid #FAFAFA' }}
              >
                {[...Array(2)].map((i, index) => {
                  return (
                    <Grid item xs={2} justifyContent="center">
                      <Typography color="textPrimary" variant="subtitle2">
                        {!index ? children.title : !children.text ? 'Данных нет' : children.text}
                      </Typography>
                    </Grid>
                  );
                })}
              </Grid>
            );
          })}
          <Typography variant="h6" sx={{ mb: 3, mt: 1, textTransform: 'uppercase' }}>
            Профессиональные данные
          </Typography>
          <Box>
            {userWorkInformationBlock.map((children) => {
              return (
                <Grid
                  container
                  columns={4}
                  gap={2}
                  sx={{
                    mb: 1.5,
                    pb: 1.5,
                    flexWrap: 'nowrap',
                    borderBottom: '3px solid #FAFAFA',
                    ':last-child': { borderBottom: 'none', pb: 0 },
                  }}
                >
                  {[...Array(2)].map((i, index) => {
                    return (
                      <Grid item xs={2} justifyContent="center">
                        <Typography color="textPrimary" variant="subtitle2">
                          {!index ? children.title : !children.text ? 'Данных нет' : children.text}
                        </Typography>
                      </Grid>
                    );
                  })}
                </Grid>
              );
            })}
          </Box>
        </>
      )}

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          pt: 1,
          pb: 1,
          borderTop: '3px solid #FAFAFA',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="subtitle2" sx={{ mr: 1.5 }}>
            Был:
          </Typography>
          <Typography variant="body2">{user?.lastUsed}</Typography>
        </Box>
        <Button onClick={onSave}>Сохранить</Button>
      </Box>
    </Box>
  );
};

export default UserDetails;
