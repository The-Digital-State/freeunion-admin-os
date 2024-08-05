// @ts-nocheck
import * as Yup from 'yup';

import { Formik } from 'formik';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router';
import { updatePaymentsThunk } from 'redux/slices/finance';
import { addPaymentFundraising, uploadFundraisingImage } from 'services/api/finance';
import PaymentApiCheckboxes from 'components/organisms/PaymentApiCheckboxes/PaymentApiCheckboxes';
import ruLocale from 'date-fns/locale/ru';

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
import { DatePicker, LocalizationProvider } from '@material-ui/lab';
import ImageDropzone from 'components/molecules/ImageDropzone';

import { Button } from 'shared/components/common/Button/Button';
import { CurrenciesType, PaymentType } from 'shared/interfaces/finance';
import { validatorsTextTemplates } from 'shared/components/common/Validator/ValidatorsTextTemplates';

import { currencies } from '../PaymentCreation';
import { FinanceTabConfig } from '../../Finances';
import { useDispatch, useSelector } from '../../../../../redux';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import formatServerError from 'shared/utils/formatServerError';

const PaymentPromotion = ({
  id,
  close,
  setTabType,
}: {
  id?: number;
  close?: () => void;
  setTabType?: (type: any) => void;
}) => {
  const isNew = !id;
  const location = useLocation();
  const organizationId = +location.pathname.split('/')[1];
  const dispatch = useDispatch();

  const promotionData = useSelector(({ finance }) => finance.payments.filter((payment) => payment?.id === id)[0]);
  const activeApi = useSelector(({ finance }) => finance.api);

  let paymentDateEnd;
  if (!!promotionData?.date_end) {
    paymentDateEnd = new Date(promotionData.date_end);
    paymentDateEnd.setDate(new Date(promotionData.date_end).getDate() + 1);
  }
  const todayDate = new Date();

  return (
    <Formik
      enableReinitialize
      initialValues={{
        title: promotionData?.title || '',
        description: promotionData?.description || '',
        ammount: promotionData?.ammount || '',
        currency: promotionData?.currency || CurrenciesType.EUR,
        image: promotionData?.image || '',
        auto_payments: (id && promotionData?.auto_payments) || [],
        date_end: promotionData?.date_end || null,
      }}
      validationSchema={Yup.object().shape({
        title: Yup.string()
          .trim()
          .max(40, 'Заголовок не должен быть больше 40 символов')
          .required(validatorsTextTemplates.required('заголовок')),
        ammount: Yup.number().required(validatorsTextTemplates.required('цена подписки')),
        auto_payments: Yup.array().of(Yup.string()).required().min(1),
        description: Yup.string().required(validatorsTextTemplates.required('описание')),
        image: Yup.string(),
      })}
      onSubmit={async (values, { resetForm, setErrors, setStatus, setSubmitting }): Promise<void> => {
        try {
          const filteredValues = { ...values, ammount: +values.ammount };

          if (!isNew && organizationId) {
            (async () => {
              try {
                await dispatch(updatePaymentsThunk(+organizationId, id, filteredValues, PaymentType.promotional));
                toast.success('Акционный сбор обновлен!');
                setStatus({ success: true });
                resetForm();
                close();
              } catch (e) {
                console.log(e);
                toast.error(formatServerError(e));
              }
            })();
          } else {
            (async () => {
              try {
                await addPaymentFundraising(+organizationId, filteredValues);
                toast.success('Акционный сбор создан!');
                resetForm();
                setStatus({ success: true });
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
        handleReset,
        setFieldValue,
        validateForm,
        values,
      }): JSX.Element => (
        <form onSubmit={handleSubmit}>
          <Box sx={{ pb: 3 }}>
            {!isNew && !promotionData?.auto_payments?.length && (
              <Typography sx={{ color: 'red', mt: 2 }}>Ошибка: не выбраны данные для оплаты</Typography>
            )}
            {!!promotionData?.date_end && todayDate > paymentDateEnd && (
              <Typography sx={{ color: 'gray', mt: 2 }}>Неактивен: Дата сбора закончилась</Typography>
            )}
            <Grid container spacing={3} mb={1} mt={1}>
              <Grid item md={6} xs={12} gap={3} display="flex" flexDirection="column">
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
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <TextField
                    error={Boolean(touched.ammount && errors.ammount)}
                    helperText={touched.ammount && errors.ammount}
                    label="Сумма сбора"
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
                </Box>
              </Grid>
              <Grid item md={6} xs={12} gap={3} display="flex" flexDirection="column">
                <ImageDropzone
                  value={values.image}
                  onDrop={(acceptedFiles) => {
                    acceptedFiles.forEach((file) => {
                      const reader = new FileReader();
                      reader.readAsDataURL(file);
                      reader.onload = () => {
                        (async () => {
                          const response = await uploadFundraisingImage(+organizationId, reader.result);
                          setFieldValue('image', response);
                        })();
                      };
                    });
                  }}
                  label="Изображение"
                  dropzoneInfo="Выберите фото с соотношением сторон 16:9"
                />
              </Grid>
              <Grid item md={12} xs={12} mb={3} display="flex" flexDirection="column">
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  error={Boolean(touched.description && errors.description)}
                  helperText={touched.description && errors.description}
                  label="Описание"
                  name="description"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.description}
                  variant="outlined"
                  placeholder="Описание акционного сбора..."
                />
              </Grid>
              <Box display="flex" flexDirection="row" alignItems="center" width="100%" sx={{ p: 3 }}>
                <LocalizationProvider dateAdapter={AdapterDateFns} locale={ruLocale}>
                  <DatePicker
                    // minDate={new Date()}
                    mask="__.__.____"
                    label="Дата окончания акции"
                    onChange={(date) => setFieldValue('date_end', date)}
                    value={values.date_end}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
                <Typography variant="caption" sx={{ ml: 2, mb: 3 }}>
                  Опционально*
                </Typography>
              </Box>
            </Grid>
            <Divider />
            <Typography variant="h5" mt={3}>
              Платежная система (только API)
            </Typography>

            <PaymentApiCheckboxes
              organizationId={+organizationId}
              activeApi={activeApi}
              auto_payments={promotionData?.auto_payments}
              auto_payments_values={values.auto_payments}
              validateForm={validateForm}
              setFieldValue={setFieldValue}
              is_promotion
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
            <Button disabled={!dirty} onClick={handleReset} color="light">
              ОТМЕНИТЬ
            </Button>
            <Button disabled={isSubmitting || !isValid || !dirty} type="submit">
              {id ? 'СОХРАНИТЬ ИЗМЕНЕНИЯ' : 'СОЗДАТЬ'}
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default PaymentPromotion;
