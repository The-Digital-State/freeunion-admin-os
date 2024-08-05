import { Box, Container, Typography } from '@material-ui/core';

const ToBeDesigned = () => {
  return (
    <>
      <Box
        sx={{
          alignItems: 'center',
          backgroundColor: 'background.paper',
          display: 'flex',
          minHeight: '100vh',
          px: 3,
          py: '80px',
        }}
      >
        <Container maxWidth="lg">
          <Typography align="center" color="textPrimary" variant={'h1'}>
            Страница в разработке
          </Typography>
          <Typography align="center" color="textSecondary" sx={{ mt: 0.5 }} variant="subtitle2">
            К сожалению, данная страница находится в разработке, мы делаем всё возможное, чтобы Вы могли увидеть её как
            можно скорее.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 6,
            }}
          >
            <Box
              alt="Under development"
              component="img"
              src={'/static/error/error401_light.svg'}
              sx={{
                height: 'auto',
                maxWidth: '100%',
                width: 400,
              }}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default ToBeDesigned;
