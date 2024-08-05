import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Card, Box, Divider, Tabs, Tab, Typography, experimentalStyled, makeStyles } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import NotificationCount from 'components/atoms/NotificationCount';

const Title = experimentalStyled(Typography)({ textTransform: 'uppercase' });

const useStyle = makeStyles({
  indicator: {
    top: '0px',
  },
});

const UsersPageTabLayout = ({ children, title, actions = [], isSingle = false }) => {
  const params = useParams<{ organizationId?: string }>();

  const classes = useStyle();
  const theme = useTheme();

  const { requestsNewCount } = useSelector((state) => {
    return {
      // @ts-ignore
      requestsNewCount: state.requests.newCount,
    };
  }) as any;

  const { organizationId } = params;

  const tabs: { label: string; href: string; count?: number }[] = [
    {
      label: 'Участники',
      href: `/${organizationId}/users/all`,
    },
    {
      label: 'Списки',
      href: `/${organizationId}/users/lists`,
    },
    {
      label: 'Заявки',
      href: `/${organizationId}/users/applications`,
      count: requestsNewCount,
    },
  ];

  const value = tabs
    .map((tab, index) => (window.location.pathname.includes(tab.href) ? index : null))
    .filter((item) => item !== null)[0];

  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        p: 3,
        minHeight: '100vh',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 2,
        }}
      >
        <Title variant="h4">{title}</Title>
        <Box sx={{ display: 'flex' }}>
          {actions.map((action, i) => (
            <Box key={i} sx={{ marginRight: 1 }}>
              {action}
            </Box>
          ))}
        </Box>
      </Box>
      <Card>
        {!isSingle && (
          <Tabs
            classes={{ indicator: classes.indicator }}
            indicatorColor="primary"
            scrollButtons="auto"
            textColor="primary"
            value={value}
            variant="scrollable"
          >
            {tabs.map((tab, index) => (
              <Link key={index} to={tab.href}>
                <Tab
                  label={
                    <>
                      {!!tab.count && <NotificationCount count={requestsNewCount} right="30px" top="3px" />} {tab.label}
                    </>
                  }
                  value={tab.href.split('/').slice(-1)}
                  sx={{
                    color: value === index && theme.palette.primary.main,
                    fontWeight: 'bold',
                  }}
                />
              </Link>
            ))}
          </Tabs>
        )}
        <Divider />
        {children}
      </Card>
    </Box>
  );
};

export default UsersPageTabLayout;
