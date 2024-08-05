import { Fragment } from 'react';
import Head from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import Logo from '../../lib/material-kit/components/Logo';
import LoginForm from '../../components/organisms/LoginForm/LoginForm';

export default function SignIn() {
  return (
    <Fragment>
      <Head>
        <title>Авторизация</title>
      </Head>
      <Box
        sx={{
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <Container maxWidth="sm" sx={{ py: '80px' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 8,
            }}
          >
            {/* <a href="/">
              <Logo
                sx={{
                  height: 40,
                  width: 40,
                }}
              />
            </a> */}
          </Box>
          <LoginForm />
        </Container>
      </Box>
    </Fragment>
  );
}
