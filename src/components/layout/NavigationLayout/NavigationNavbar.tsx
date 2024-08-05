import { Link } from 'react-router-dom';
import dynamic from 'helpers/dynamic';
import { AppBar, Box, IconButton, Toolbar } from '@material-ui/core';
import { experimentalStyled } from '@material-ui/core/styles';
import type { AppBarProps } from '@material-ui/core';
import MenuIcon from '../../../lib/material-kit/icons/Menu';
import Logo from '../../../lib/material-kit/components/Logo';
// import AccountPopover from './AccountPopover';
// import LanguagePopover from './LanguagePopover';
// import NotificationsPopover from './NotificationsPopover';

// const AccountPopover = require('./AccountPopover'), { ssr: false });

interface DashboardNavbarProps extends AppBarProps {
  onSidebarMobileOpen?: () => void;
}

const DashboardNavbarRoot = experimentalStyled(AppBar)(({ theme }) => ({
  ...(theme.palette.mode === 'light' && {
    backgroundColor: theme.palette.primary.main,
    boxShadow: 'none',
    color: theme.palette.primary.contrastText,
  }),
  ...(theme.palette.mode === 'dark' && {
    backgroundColor: theme.palette.background.paper,
    borderBottom: `1px solid ${theme.palette.divider}`,
    boxShadow: 'none',
  }),
  zIndex: theme.zIndex.drawer + 100,
}));

const DashboardNavbar = (props) => {
  const { onSidebarMobileOpen, ...other } = props;

  return (
    <DashboardNavbarRoot {...other}>
      <Toolbar sx={{ minHeight: 64 }}>
        <IconButton
          color="inherit"
          onClick={onSidebarMobileOpen}
          sx={{
            display: {
              lg: 'none',
            },
          }}
        >
          {/* <MenuIcon fontSize="small" /> */}
        </IconButton>
        <Link to="/">
          <Logo
            sx={{
              display: {
                lg: 'inline',
                xs: 'none',
              },
              height: 40,
              width: 40,
            }}
          />
        </Link>
        <Box
          sx={{
            flexGrow: 1,
            ml: 2,
          }}
        />
        {/* <LanguagePopover /> */}
        <Box sx={{ ml: 1 }}>{/* <NotificationsPopover /> */}</Box>
        <Box sx={{ ml: 2 }}>{/* <AccountPopover /> */}</Box>
      </Toolbar>
    </DashboardNavbarRoot>
  );
};

export default DashboardNavbar;
