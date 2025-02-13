import { useEffect } from 'react';
import type { FC, ReactNode } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Box, Drawer } from '@material-ui/core';
import type { Theme } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Logo from '../Logo';
import NavSection from '../NavSection';

interface DocsSidebarProps {
  onMobileClose: () => void;
  openMobile: boolean;
}

interface Item {
  title: string;
  path?: string;
  icon?: ReactNode;
  info?: ReactNode;
  items?: Item[];
}

interface Section {
  title: string;
  items: Item[];
}

const sections: Section[] = [
  {
    title: 'Overview',
    items: [
      {
        title: 'Welcome',
        path: '/docs/overview/welcome',
      },
      {
        title: 'Getting Started',
        path: '/docs/overview/getting-started',
      },
      {
        title: 'Dependencies',
        path: '/docs/overview/dependencies',
      },
      {
        title: 'Environment Variables',
        path: '/docs/overview/environment-variables',
      },
      {
        title: 'Theming',
        path: '/docs/overview/theming',
      },
      {
        title: 'Redux',
        path: '/docs/overview/redux',
      },
      {
        title: 'Server Calls',
        path: '/docs/overview/server-calls',
      },
      {
        title: 'Settings',
        path: '/docs/overview/settings',
      },
      {
        title: 'RTL',
        path: '/docs/overview/rtl',
      },
      {
        title: 'Internationalization',
        path: '/docs/overview/internationalization',
      },
      {
        title: 'Deployment',
        path: '/docs/overview/deployment',
      },
      {
        title: 'Migrating to Next.js',
        path: '/docs/overview/migrating-to-nextjs',
      },
    ],
  },
  {
    title: 'Routing',
    items: [
      {
        title: 'Implementation',
        path: '/docs/routing/implementation',
      },
      {
        title: 'Code Splitting',
        path: '/docs/routing/code-splitting',
      },
    ],
  },
  {
    title: 'Authentication',
    items: [
      {
        title: 'Amplify',
        path: '/docs/authentication/amplify',
      },
      {
        title: 'Auth0',
        path: '/docs/authentication/auth0',
      },
      {
        title: 'Firebase',
        path: '/docs/authentication/firebase',
      },
      {
        title: 'JWT',
        path: '/docs/authentication/jwt',
      },
    ],
  },
  {
    title: 'Guards',
    items: [
      {
        title: 'Guest Guard',
        path: '/docs/guards/guest-guard',
      },
      {
        title: 'Auth Guard',
        path: '/docs/guards/auth-guard',
      },
      {
        title: 'Role Based Guard',
        path: '/docs/guards/role-based-guard',
      },
    ],
  },
  {
    title: 'Analytics',
    items: [
      {
        title: 'Introduction',
        path: '/docs/analytics/introduction',
      },
      {
        title: 'Configuration',
        path: '/docs/analytics/configuration',
      },
      {
        title: 'Event Tracking',
        path: '/docs/analytics/event-tracking',
      },
    ],
  },
  {
    title: 'Support',
    items: [
      {
        title: 'Changelog',
        path: '/docs/support/changelog',
      },
      {
        title: 'Contact',
        path: '/docs/support/contact',
      },
      {
        title: 'Further Support',
        path: '/docs/support/further-support',
      },
    ],
  },
];

const DocsSidebar: FC<DocsSidebarProps> = (props) => {
  const { onMobileClose, openMobile } = props;
  const location = useLocation();
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
  }, [location.pathname]);

  const content = (
    <Box height="100%" display="flex" flexDirection="column">
      <Box
        sx={{
          display: {
            lg: 'none',
          },
          p: 2,
        }}
      >
        <RouterLink to="/">
          <Logo />
        </RouterLink>
      </Box>
      <Box p={2}>
        {sections.map((section) => (
          <NavSection
            key={section.title}
            pathname={location.pathname}
            sx={{
              '& + &': {
                mt: 3,
              },
            }}
            {...section}
          />
        ))}
      </Box>
    </Box>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        variant="permanent"
        PaperProps={{
          sx: {
            backgroundColor: 'background.paper',
            height: 'calc(100% - 64px) !important',
            top: '64px !important',
            width: 256,
          },
        }}
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onMobileClose}
      open={openMobile}
      variant="temporary"
      PaperProps={{
        sx: {
          backgroundColor: 'background.default',
          width: 256,
        },
      }}
    >
      {content}
    </Drawer>
  );
};

DocsSidebar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool,
};

export default DocsSidebar;
