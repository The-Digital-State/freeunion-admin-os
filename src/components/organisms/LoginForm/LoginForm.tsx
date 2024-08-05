import * as Yup from 'yup';
import { Formik } from 'formik';
import { Box, Card, CardContent, Typography, FormHelperText, TextField } from '@material-ui/core';
import { useState } from 'react';
import useAuth from 'hooks/useAuth';
import { Button, ButtonColors } from 'shared/components/common/Button/Button';
import styles from './LoginForm.module.scss';

const validationSchema = Yup.object().shape({
  username: Yup.string().max(255, 'Достигнута максимальная длинна').required('Не может быть пустым'),
  password: Yup.string().max(255, 'Достигнута максимальная длинна').required('Не может быть пустым'),
});

const LoginForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [twoFa, setTwoFa] = useState(null);

  const { login } = useAuth();

  const submit = async (username, password, code) => {
    setIsSubmitting(true);

    try {
      const response = await login(username, password, code);

      if (response?.need_2fa) {
        setTwoFa(true);
      }
    } catch (error) {
      setErrorMessage(error?.message || 'Ошибка');
    }

    setIsSubmitting(false);
  };

  return (
    <Card>
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          p: 4,
        }}
      >
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-between',
            mb: 3,
          }}
        >
          <div>
            <Typography color="textPrimary" gutterBottom variant="h4">
              Авторизация
            </Typography>
            <Typography color="textSecondary" variant="body2">
              Введите данные для входа в систему
            </Typography>
          </div>
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            mt: 3,
          }}
        >
          <Formik
            initialValues={{
              username: '',
              password: '',
              code: '',
              submit: null,
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => submit(values.username, values.password, values.code)}
          >
            {({ errors, handleBlur, handleChange, handleSubmit, touched, values }): JSX.Element => (
              <form noValidate onSubmit={handleSubmit}>
                <TextField
                  autoFocus
                  error={Boolean(touched.username && errors.username)}
                  fullWidth
                  helperText={touched.username && errors.username}
                  label="Имя пользователя или Email"
                  margin="normal"
                  name="username"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.username}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.password && errors.password)}
                  fullWidth
                  helperText={touched.password && errors.password}
                  label="Пароль"
                  margin="normal"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  value={values.password}
                  variant="outlined"
                />

                {twoFa && (
                  <TextField
                    error={Boolean(touched.password && errors.password)}
                    fullWidth
                    helperText={touched.code && errors.code}
                    label="2FA код"
                    margin="normal"
                    name="code"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.code}
                    variant="outlined"
                  />
                )}
                {errorMessage && (
                  <Box sx={{ mt: 3 }}>
                    <FormHelperText error>{errorMessage}</FormHelperText>
                  </Box>
                )}
                <Box sx={{ mt: 2 }}>
                  <Button color={ButtonColors.primary} disabled={isSubmitting} type="submit" className={styles.button}>
                    Войти
                  </Button>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Button
                    className={styles.button}
                    onClick={() => window.open(process.env.REACT_APP_CLIENT_APP_URL + '/forget-password')}
                  >
                    Забыли пароль?
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
        </Box>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
