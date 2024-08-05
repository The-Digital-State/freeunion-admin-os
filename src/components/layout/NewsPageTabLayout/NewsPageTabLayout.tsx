import Head from 'react-helmet';
import { useTheme } from '@material-ui/core/styles';
import { Card, Divider, Tabs, Tab, Typography, Box, makeStyles } from '@material-ui/core';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { Button } from 'shared/components/common/Button/Button';

const useStyle = makeStyles({
  indicator: {
    top: '0px',
  },
});

const NewsPageTabLayout = ({ children }: React.PropsWithChildren<{}>) => {
  const { organizationId } = useParams<{ organizationId?: string }>();
  const theme = useTheme();
  const classes = useStyle();

  const tabs: { label: string; href: string }[] = [
    {
      label: 'Черновики',
      href: `/${organizationId}/news/draft`,
    },
    {
      label: 'Все новости',
      href: `/${organizationId}/news/all`,
    },
    {
      label: 'Жалобы',
      href: `/${organizationId}/news/abuse`,
    },
    {
      label: 'Авто-постинг новостей',
      href: `/${organizationId}/news/auto-posting`,
    },
  ];

  const value = tabs
    .map((tab, index) => (window.location.pathname.includes(tab.href) ? index : null))
    .filter((item) => item !== null)[0];

  return (
    <>
      <Head>
        <title>Новости</title>
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
              m: 1,
            }}
          >
            новости
          </Typography>
          <Button to="./editor">Создать новость</Button>
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

export default NewsPageTabLayout;
