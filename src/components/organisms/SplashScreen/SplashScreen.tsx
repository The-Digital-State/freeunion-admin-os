import { useCallback, useEffect, useState } from 'react';
import Head from 'react-helmet';
import { useHistory, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Container, Typography } from '@material-ui/core';
import { useDispatch, useSelector } from '../../../redux';
import { getProfile } from '../../../redux/slices/profile';
import { getDictionaries } from '../../../redux/slices/dictionaries';
import { getOrganizations } from '../../../redux/slices/organizations';
import useAuth from '../../../hooks/useAuth';

const SplashScreenComponent = () => (
  <>
    <Head>
      <title>Загрузка</title>
    </Head>
    <Box
      sx={{
        alignItems: 'center',
        backgroundColor: 'background.paper',
        display: 'flex',
        minHeight: '100%',
        px: 3,
        py: '80px',
      }}
    >
      <Container maxWidth="lg">
        <Typography align="center" color="textPrimary" variant={'h1'}>
          Загрузка
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 6,
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    </Box>
  </>
);

const SplashScreen = (props) => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile);
  const dictionaries = useSelector((state) => state.dictionaries);
  const organizations = useSelector((state) => state.organizations);

  const { isAuthenticated, isInitializing } = useAuth();

  const [isFirstLoadDataPreFetching, setIsFirstLoadDataPreFetching] = useState(false);
  const [isFirstLoadDataPreFetched, setIsFirstLoadDataPreFetched] = useState(false);

  const firstLoadDataPreFetch = useCallback(() => {
    setIsFirstLoadDataPreFetched(false);
    setIsFirstLoadDataPreFetching(true);
    dispatch(getProfile());
    dispatch(getDictionaries());
    dispatch(getOrganizations());
  }, []);

  useEffect(() => {
    if (isFirstLoadDataPreFetching && !isFirstLoadDataPreFetched) {
      if (!profile.isLoading && !dictionaries.isLoading && !organizations.isLoading) {
        setIsFirstLoadDataPreFetching(false);
        setIsFirstLoadDataPreFetched(true);

        if (location.pathname === '/signin' || location.pathname === '/') {
          const urlSearchParams = new URLSearchParams(window.location.search);
          const redirectPath = urlSearchParams.get('redirect');
          const defaultPath = '/';
          history.push(redirectPath ?? defaultPath);
        }
      }
    }
  }, [
    isFirstLoadDataPreFetching,
    isFirstLoadDataPreFetched,
    profile.isLoading,
    dictionaries.isLoading,
    organizations.isLoading,
    organizations.adminOrganizations,
    history,
    location.pathname,
  ]);

  useEffect(() => {
    if (location.pathname !== '/signin') {
      if (!isAuthenticated && !isInitializing) {
        const redirect = window.location.pathname + window.location.search;
        history.replace(`/signin?redirect=${redirect}`);
      }
    }
  }, [isAuthenticated, isInitializing, location.pathname, history]);

  useEffect(() => {
    if (!isFirstLoadDataPreFetching && !isFirstLoadDataPreFetched) {
      if (isAuthenticated) {
        firstLoadDataPreFetch();
      }
    }
  }, [
    isAuthenticated,
    isInitializing,
    isFirstLoadDataPreFetching,
    isFirstLoadDataPreFetched,
    location.pathname,
    history,
    dispatch,
    firstLoadDataPreFetch,
  ]);

  const showSplashScreen =
    (isFirstLoadDataPreFetching || !isFirstLoadDataPreFetched) && location.pathname !== '/signin';

  if (showSplashScreen) {
    return <SplashScreenComponent />;
  }

  return <>{props.children}</>;
};

export default SplashScreen;
