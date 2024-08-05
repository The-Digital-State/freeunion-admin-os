import Head from 'react-helmet';
import { useTheme } from '@material-ui/core/styles';
import { Card, Divider, Tabs, Tab, Typography, Box, makeStyles } from '@material-ui/core';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { routes } from 'Routes';

const useStyle = makeStyles({
  indicator: {
    top: '0px',
  },
});

const PollsTabLayot = ({ children }: React.PropsWithChildren<{}>) => {
  const { organizationId } = useParams<{ organizationId?: string }>();
  const theme = useTheme();
  const classes = useStyle();

  const tabs: { label: string; href: string }[] = [
    {
      label: 'Создать',
      href: routes.polls.getCreatingPolls(organizationId),
    },
    {
      label: 'Активные',
      href: routes.polls.getActivePolls(organizationId),
    },
    {
      label: 'Завершенные',
      href: routes.polls.getCompletedPolls(organizationId),
    },
  ];

  const value = tabs
    .map((tab, index) => (window.location.pathname.includes(tab.href) ? index : null))
    .filter((item) => item !== null)[0];

  return (
    <>
      <Head>
        <title>Опросы</title>
      </Head>
      <Box
        sx={{
          backgroundColor: 'background.default',
          padding: '5px 24px',
          minHeight: '100vh',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography
            color="inherit"
            variant="h3"
            sx={{
              textTransform: 'uppercase',
              m: 2,
            }}
          >
            Опросы
          </Typography>
        </Box>
        <Card>
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
                  }}
                />
              </Link>
            ))}
          </Tabs>

          <Divider />
          {children}
        </Card>
      </Box>
    </>
  );
};

export default PollsTabLayot;
