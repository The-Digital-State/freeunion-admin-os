import { useParams, useHistory, useLocation } from 'react-router-dom';
import { useSelector } from '../../../redux';
import { Avatar, Box, Drawer, IconButton, Tooltip } from '@material-ui/core';
import LogoutIcon from '../../../lib/material-kit/icons/Logout';
import BellIcon from '../../../lib/material-kit/icons/Bell';
import useAuth from '../../../hooks/useAuth';
// import NotificationsPopover from './NotificationsPopover';

const Triangle = ({ shiftEnd }) => {
  if (shiftEnd === -1) {
    return <></>;
  }

  return (
    <Box
      sx={{
        width: '32px',
        height: '32px',
        background: ' #FFFFFF',
        transform: 'rotate(-45deg)',
        marginLeft: '-29px',
        marginBottom: '37px',
        zIndex: -1,
        position: 'fixed',
        borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
        borderTop: '1px solid rgba(0, 0, 0, 0.12)',
        borderRadius: '6px 0 0 0',
        bottom: `${(shiftEnd - 1) * 58}px`, //42px icon size + 8 margin top + 8 margin bottom
        transition: 'bottom 0.325s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    />
  );
};

const NavigationSidebarRight = () => {
  const params = useParams<{ organizationId?: string }>();
  const history = useHistory();
  const location = useLocation();

  const { logout } = useAuth();
  const { adminOrganizations, isLoading } = useSelector((state) => state.organizations);

  const { organizationId } = params;

  const shiftEnd =
    adminOrganizations?.findIndex((x) => x.id + '' === organizationId) > -1 &&
    adminOrganizations.length - adminOrganizations.findIndex((x) => x.id + '' === organizationId);

  const handleOrganizationClick = (id) => {
    const { pathname } = location;

    const [, , page, queryPage] = pathname.split('/');
    history.push(`/${id}/${page}${!!queryPage ? `/${queryPage}` : ''}`);
  };

  if (isLoading) {
    return null;
  }

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '100%',
        width: '100%',
      }}
    >
      <Box
        sx={{
          p: 2,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <IconButton color="inherit" onClick={logout} sx={{ marginBottom: 1 }}>
          <LogoutIcon fontSize="medium" />
        </IconButton>
        {/* <IconButton href="http://localhost:3000/1/notification/createnotification/" color="secondary" sx={{ marginBottom: 1 }} >
         <BellIcon fontSize="medium" />
        </IconButton> */}
        {/* <NotificationsPopover /> */}
      </Box>
      <Box
        sx={{
          marginBottom: 3,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {adminOrganizations?.map((organization) => (
          <Box key={organization.id}>
            <Triangle shiftEnd={shiftEnd} />
            <Box key={organization.id} sx={{ p: 1 }}>
              <Tooltip key={organization.id} title={organization.name} enterDelay={1500}>
                <Avatar
                  key={organization.id}
                  src={organization?.avatar}
                  onClick={() => handleOrganizationClick(organization.id)}
                  sx={{
                    cursor: 'pointer',
                    height: 42,
                    width: 42,
                  }}
                />
              </Tooltip>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );

  return (
    <Drawer
      anchor="right"
      open
      PaperProps={{
        sx: {
          backgroundColor: 'background.paper',
          width: 82,
        },
      }}
      variant="permanent"
    >
      {content}
    </Drawer>
  );
};

export default NavigationSidebarRight;
