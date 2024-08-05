// @ts-nocheck
import * as Yup from 'yup';

import { Formik } from 'formik';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { useLocation } from 'react-router';
import { updatePaymentsThunk } from 'redux/slices/finance';

import { addPaymentSubscription } from 'services/api/finance';
import PaymentApiCheckboxes from 'components/organisms/PaymentApiCheckboxes/PaymentApiCheckboxes';
import PaymentLinkInputs from 'components/organisms/PaymentLinkInputs/PaymentLinkInputs';

import {
  Box,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@material-ui/core';
import QuillEditor from 'lib/material-kit/components/QuillEditor';

import { Button } from 'shared/components/common/Button/Button';
import { CurrenciesType, Payment, PaymentSystems, PaymentType } from 'shared/interfaces/finance';
import { validatorsTextTemplates } from 'shared/components/common/Validator/ValidatorsTextTemplates';

import { currencies } from '../PaymentCreation';
import { FinanceTabConfig } from '../../Finances';
import { useDispatch, useSelector } from '../../../../../redux';
import formatServerError from 'shared/utils/formatServerError';

const PaymentSubscribtion = ({
  id,
  close,
  setTabType,
}: {
  id?: number;
  close?: () => void;
  setTabType?: (type: any) => void;
}) => {
  const location = useLocation();
  const organizationId = +location.pathname.split('/')[1];

  const isNew = !id;

  const dispatch = useDispatch();
  const fundrasingData = useSelector(({ finance }) => finance.payments.filter((payment) => payment?.id === id)[0]);
  const activeApi = useSelector(({ finance }) => finance.api);

  const [checkedApi, setCheckedApi] = useState<boolean>(!!fundrasingData?.auto_payments?.length || false);
  const [checkedLink, setCheckedLink] = useState<boolean>(!!fundrasingData?.manual_payments?.length || false);

  return (
    <Formik
      enableReinitialize
      initialValues={{
        title: fundrasingData?.title || '',
        description: fundrasingData?.description || '',
        ammount: fundrasingData?.ammount || '',
        manual_payments: (id && fundrasingData?.manual_payments) || [],
        auto_payments: (id && fundrasingData?.auto_payments) || [],
        currency: fundrasingData?.currency || CurrenciesType.EUR,
      }}
      validationSchema={Yup.object().shape({
        title: Yup.string()
          .trim()
          .max(40, 'Заголовок не должен быть больше 40 символов')
          .required(validatorsTextTemplates.required('заголовок')),
        ammount: Yup.number().required(validatorsTextTemplates.required('цена подписки')),
        description: Yup.string().required(validatorsTextTemplates.required('описание')),
        auto_payments: checkedApi ? Yup.array().of(Yup.string()).required().min(1) : Yup.array().of(Yup.string()),
        manual_payments: Yup.array().of(
          Yup.object().shape({
            payment_link: Yup.number().when('payment_system', (payment_system) => {
              if (
                payment_system === PaymentSystems.litecoin ||
                payment_system === PaymentSystems.bitcoin ||
                payment_system === PaymentSystems.ERC20
              ) {
                return Yup.string().trim().required(validatorsTextTemplates.required('кошелек'));
              } else {
                return Yup.string()
                  .trim()
                  .required(validatorsTextTemplates.required('ссылка на систему оплаты'))
                  .url('Неправильная ссылка');
              }
            }),
            payment_system: Yup.string(),
          })
        ),
      })}
      onSubmit={async (values, { resetForm, setStatus, setSubmitting }): Promise<void> => {
        try {
          const filteredValues = { ...values, ammount: +values.ammount };
          const updateResetForm = () => {
            resetForm();
            setCheckedApi(false);
            setCheckedLink(false);
            setStatus({ success: true });
          };
          if (!isNew && organizationId) {
            (async () => {
              try {
                await dispatch(
                  updatePaymentsThunk(+organizationId, id, filteredValues as Payment, PaymentType.subscription)
                );
                toast.success('Подписка обновлена!');
                updateResetForm();
                close();
              } catch (e) {
                toast.error(formatServerError(e));
              }
            })();
          } else {
            (async () => {
              try {
                await addPaymentSubscription(+organizationId, filteredValues as Payment);
                toast.success('Подписка создана!');
                updateResetForm();
                setTabType(FinanceTabConfig.payments);
              } catch (e) {
                toast.error(formatServerError(e));
              }
            })();
          }
        } catch (err) {
          console.error(err);
          toast.error(formatServerError(err));
          setStatus({ success: false });
        }
        setSubmitting(false);
      }}
    >
      {({
        handleSubmit,
        handleBlur,
        handleChange,
        isSubmitting,
        touched,
        errors,
        isValid,
        dirty,
        setFieldValue,
        handleReset,
        validateForm,
        values,
      }): JSX.Element => (
        <form onSubmit={handleSubmit}>
          <Box sx={{ pb: 3 }}>
            {!isNew && !fundrasingData?.auto_payments?.length && !fundrasingData?.manual_payments?.length && (
              <Typography sx={{ color: 'red', mt: 2 }}>Ошибка: не выбраны данные для оплаты</Typography>
            )}
            <Grid container spacing={3} mb={1} mt={1}>
              <Grid item md={12} xs={12} gap={3} display="flex" flexDirection="row">
                <TextField
                  error={Boolean(touched.title && errors.title)}
                  fullWidth
                  helperText={touched.title && errors.title}
                  label="Заголовок"
                  name="title"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.title}
                  variant="outlined"
                />

                <TextField
                  error={Boolean(touched.ammount && errors.ammount)}
                  helperText={touched.ammount && errors.ammount}
                  label="Цена подписки"
                  name="ammount"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.ammount}
                  variant="outlined"
                  sx={{ width: '72%' }}
                />
                <FormControl sx={{ width: '22%', mr: 2 }}>
                  <InputLabel>Валюта</InputLabel>
                  <Select
                    error={Boolean(touched.currency && errors.currency)}
                    label="Валюта"
                    name="currency"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.currency}
                    variant="outlined"
                  >
                    {currencies.map((option) => {
                      return (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12} mb={3} display="flex" flexDirection="column">
                <QuillEditor
                  fullWidth={true}
                  variant="outlined"
                  multiline
                  onChange={(e) => {
                    setFieldValue('description', e);
                  }}
                  value={values.description}
                />
              </Grid>
            </Grid>
            <Typography variant="h5">Платежная система</Typography>
            <PaymentApiCheckboxes
              organizationId={organizationId}
              checkedApi={checkedApi}
              setCheckedApi={(e) => setCheckedApi(e)}
              activeApi={activeApi}
              auto_payments={fundrasingData?.auto_payments}
              auto_payments_values={values.auto_payments}
              validateForm={validateForm}
              setFieldValue={setFieldValue}
            />
            <PaymentLinkInputs
              touched={touched}
              errors={errors}
              checkedLink={checkedLink}
              setCheckedLink={(e) => setCheckedLink(e)}
              setFieldValue={setFieldValue}
              handleBlur={handleBlur}
              handleChange={handleChange}
              manual_payments_value={values.manual_payments}
            />
          </Box>
          <Divider />
          <Box
            sx={{
              mt: 2,
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
            }}
          >
            <Button
              disabled={!dirty}
              color="light"
              onClick={() => {
                handleReset();
                setCheckedApi(!!fundrasingData?.auto_payments?.length || false);
                setCheckedLink(!!fundrasingData?.manual_payments?.length || false);
              }}
            >
              ОТМЕНИТЬ
            </Button>
            <Button disabled={isSubmitting || !isValid || !dirty || (!checkedLink && !checkedApi)} type="submit">
              {isNew ? 'СОЗДАТЬ' : 'СОХРАНИТЬ ИЗМЕНЕНИЯ'}
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default PaymentSubscribtion;
