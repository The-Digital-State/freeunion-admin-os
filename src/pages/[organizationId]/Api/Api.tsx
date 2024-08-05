import Head from 'react-helmet';

import { Box, Typography } from '@material-ui/core';

import { ApiPayments } from 'shared/interfaces/finance';

import ApiPayment from './ApiPayment/ApiPayment';

const apiPageLayout = {
  backgroundColor: 'background.default',
  p: 3,
  pt: 5,
  minHeight: '100vh',
  maxWidth: '1000px',
  display: 'block',
  justifyContent: 'none',
  alignItems: 'none',
};

const Api = () => {
  return (
    <>
      <Head>
        <title>API</title>
      </Head>

      <Box sx={apiPageLayout}>
        <Typography variant="h3">Что такое API?</Typography>

        <Typography sx={{ textTransform: 'uppercase', fontSize: '20px', mt: 2, mb: 5 }}>
          это совокупность инструментов и функций в виде интерфейса для создания новых приложений, благодаря которому
          одна программа будет взаимодействовать с другой.
        </Typography>

        <Typography variant="h3" sx={{ textTransform: 'uppercase' }}>
          api платёжных сервисов
        </Typography>

        <ApiPayment type={ApiPayments.stripe} />

        {/* <ApiPayment type={ApiPayments.paypal} /> */}
      </Box>
    </>
  );
};

export default Api;
