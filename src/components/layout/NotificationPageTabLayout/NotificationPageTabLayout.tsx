import { Link, useParams } from 'react-router-dom';
import { Card, Box, Tab, Divider, Tabs, Typography, experimentalStyled, makeStyles } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';

const Title = experimentalStyled(Typography)({ textTransform: 'uppercase' });

const useStyle = makeStyles({
  indicator: {
    top: '0px',
  },
});

const NotificationPageTabLayout = ({ children, title, actions = [], isSingle = false }) => {
  const { organizationId } = useParams<{ organizationId?: string }>();

  const theme = useTheme();

  const classes = useStyle();

  const tabs: { label: string; href: string }[] = [
    {
      label: 'Создать уведомление',
      href: `/${organizationId}/notifications/new`,
    },
    // {
    //   label: 'Все уведомления',
    //   href: `/${organizationId}/notifications`,
    // },
  ];

  const value = tabs
    .map((tab, index) => (window.location.href.includes(tab.href) ? index : null))
    .filter((item) => item !== null)[0];

  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100vh',
        p: 3,
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
      </Box>
      <Card>
        {!isSingle && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 2,
            }}
          >
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
                    label={tab.label}
                    value={tab.href.split('/').slice(-1)}
                    sx={{
                      color: value === index && theme.palette.primary.main,
                      fontWeight: 'bold',
                      ml: 3,
                    }}
                  />
                </Link>
              ))}
            </Tabs>
            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
              {actions.map((action, i) => (
                <Box key={i} sx={{ marginRight: 1 }}>
                  {action}
                </Box>
              ))}
            </Box>
          </Box>
        )}
        <Divider />
        {children}
      </Card>
    </Box>
  );
};

export default NotificationPageTabLayout;
