import * as Yup from 'yup';

import { useEffect, useState } from 'react';
import { useFormik } from 'formik';

import { Box, Link, Switch, TextField, Typography } from '@material-ui/core';
import { Button } from 'shared/components/common/Button/Button';

import { ApiPaymentType, ApiPayments } from 'shared/interfaces/finance';
import { validatorsTextTemplates } from 'shared/components/common/Validator/ValidatorsTextTemplates';

import styles from './ApiPayment.module.scss';
import { addApiPayment, getApiPayment, updateApiPayment } from 'services/api/finance';
import { useLocation } from 'react-router';
import { toast } from 'react-toastify';
import formatServerError from 'shared/utils/formatServerError';
import { Spinner } from 'shared/components/common/Spinner/Spinner';

const validationSchema = Yup.object().shape({
  credentials: Yup.object().shape({
    publish_key: Yup.string().trim().required(validatorsTextTemplates.required('publish_key')),
    secret_key: Yup.string().trim().required(validatorsTextTemplates.required('secret_key')),
  }),
  enable: Yup.boolean(),
});

const validationSchemaDisabled = Yup.object().shape({
  credentials: Yup.object().shape({
    publish_key: Yup.string().trim(),
    secret_key: Yup.string().trim(),
  }),
  enable: Yup.boolean(),
});

const ApiPayment = ({ type }: { type: ApiPayments }) => {
  const location = useLocation();
  const organizationId = +location.pathname.split('/')[1];
  const [apiCredentianls, setApiCredentials] = useState<ApiPaymentType>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      try {
        const apiCredentianls = await getApiPayment(organizationId, type);
        setApiCredentials(apiCredentianls);
      } catch (e) {
        toast.error(formatServerError(e));
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [organizationId, type]);

  const [enable, setEnable] = useState<boolean>(false);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      payment_system: type,
      credentials: {
        publish_key: apiCredentianls?.credentials?.publish_key || '',
        secret_key: apiCredentianls?.credentials?.secret_key || '',
      },
      active: apiCredentianls?.active || false,
    },
    validationSchema: enable ? validationSchema : validationSchemaDisabled,
    onSubmit: (values) => {
      (async () => {
        try {
          if (!!apiCredentianls?.payment_system) {
            await updateApiPayment(organizationId, values, type);
            toast.success(`API ${type} успешно обновлено!`);
          } else {
            await addApiPayment(organizationId, values);
            toast.success(`API ${type} успешно добавлено!`);
          }
        } catch (e) {
          toast.error(e);
          console.log(e);
        }
      })();
    },
  });

  const apiTasksList = [
    <Box display="flex" alignItems="center">
      <Link href="https://dashboard.stripe.com/register" target="_blank" mr={0.5}>
        Создайте аккаунт
      </Link>
      <Typography>в Stripe</Typography>
    </Box>,
    'Заполните данные о компании, об исполнителе',
    'Подтвердите e-mail, номер телефона',
    'Добавьте счет IBAN, на который будут зачисляться средства',
    <Box display="flex" alignItems="center">
      <Typography>Перейдите на страницу</Typography>
      <Link href="https://dashboard.stripe.com/account/apikeys" target="_blank" ml={0.5}>
        Ключи API
      </Link>
    </Box>,
    'Скопируйте и вставьте в текстовое поле Publishable и Secret ключи',
    'Нажмите кнопку “Сохранить”',
    'Если вам по каким-либо причинам нужно приостановить действие передачи данных STRIPE- воспользуйтесь функцией вкл/выкл',
    <Box display="flex" alignItems="center">
      <Typography mr={2} sx={!formik.values.active ? { color: 'gray' } : {}}>
        Publish key:
      </Typography>
      <TextField
        disabled={!formik.values.active}
        sx={{ width: '70%' }}
        name="publish_key"
        placeholder="pk_****"
        value={formik.values.credentials.publish_key}
        onChange={(e) => formik.setFieldValue('credentials.publish_key', e.target.value)}
        error={Boolean(formik.touched.credentials?.publish_key && formik.errors.credentials?.publish_key)}
        helperText={formik.touched.credentials?.publish_key && formik.errors.credentials?.publish_key}
      />
    </Box>,
    <Box display="flex" alignItems="center">
      <Typography mr={3} sx={!formik.values.active ? { color: 'gray' } : {}}>
        Secret key:
      </Typography>
      <TextField
        disabled={!formik.values.active}
        sx={{ width: '70%' }}
        name="secret_key"
        placeholder="sk_****"
        value={formik.values.credentials.secret_key}
        onChange={(e) => formik.setFieldValue('credentials.secret_key', e.target.value)}
        error={Boolean(formik.touched.credentials?.secret_key && formik.errors.credentials?.secret_key)}
        helperText={formik.touched.credentials?.secret_key && formik.errors.credentials?.secret_key}
      />
    </Box>,
  ];

  return (
    <form onSubmit={formik.handleSubmit}>
      {!!isLoading ? (
        <div className={styles.wrapperSpinner}>
          <Spinner size={100} borderWidth="8px" color="purple" />
        </div>
      ) : (
        <>
          <Box display="flex" mt={5} alignItems="center">
            <Typography
              variant="h5"
              sx={
                !formik.values.active
                  ? { textTransform: 'uppercase', mr: 4, color: 'gray' }
                  : { textTransform: 'uppercase', mr: 4 }
              }
            >
              {type}
            </Typography>
            <Box display="flex" alignItems="center">
              <Typography>ВЫКЛ</Typography>{' '}
              <Switch
                size="medium"
                checked={formik.values.active}
                onChange={() => {
                  formik.setFieldValue('active', !formik.values.active);
                  setEnable(!enable);
                }}
              />
              <Typography>ВКЛ</Typography>
            </Box>
          </Box>
          <Typography mt={3} mb={3}>
            Stripe – международная система для защищенных интернет-платежей с помощью пластиковых карт. Stripe отвечает
            международным стандартам безопасности с сертификацией PCI первого уровня- это высший уровень сертификации,
            доступный в индустрии платежей.
          </Typography>
          <Typography mt={3} mb={3}>
            Для подключения API Stripe:
          </Typography>

          <ol>
            {apiTasksList.map((task, index) => (
              <li className={styles.li} key={index}>
                {task}
              </li>
            ))}
          </ol>
          <Box
            sx={{
              mt: 2,
              display: 'flex',
              justifyContent: 'flex-start',
              gap: 2,
            }}
          >
            <Button type="submit">СОХРАНИТЬ</Button>
          </Box>
        </>
      )}
    </form>
  );
};

export default ApiPayment;
