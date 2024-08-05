// @ts-nocheck
import * as Yup from 'yup';

import { Formik } from 'formik';

import { useState } from 'react';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router';
import { updatePaymentsThunk } from 'redux/slices/finance';

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

import ImageDropzone from 'components/molecules/ImageDropzone';
import { Button } from 'shared/components/common/Button/Button';

import { CurrenciesType, PaymentSystems, PaymentType } from 'shared/interfaces/finance';
import { validatorsTextTemplates } from 'shared/components/common/Validator/ValidatorsTextTemplates';
import { addPaymentFundraising, uploadFundraisingImage } from 'services/api/finance';
import PaymentApiCheckboxes from 'components/organisms/PaymentApiCheckboxes/PaymentApiCheckboxes';
import PaymentLinkInputs from 'components/organisms/PaymentLinkInputs/PaymentLinkInputs';
import { FinanceTabConfig } from '../../Finances';
import { useDispatch, useSelector } from '../../../../../redux';
import { currencies } from '../PaymentCreation';
import formatServerError from 'shared/utils/formatServerError';

const PaymentFundrasing = ({
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
        image: fundrasingData?.image || '',
        description: fundrasingData?.description || '',
        manual_payments: (id && fundrasingData?.manual_payments) || [],
        auto_payments: (id && fundrasingData?.auto_payments) || [],
        currency: fundrasingData?.currency || CurrenciesType.EUR,
      }}
      validationSchema={Yup.object().shape({
        title: Yup.string().trim().max(40).required(validatorsTextTemplates.required('заголовок')),
        auto_payments: checkedApi ? Yup.array().of(Yup.string()).required().min(1) : Yup.array().of(Yup.string()),
        manual_payments: Yup.array().of(
          Yup.object().shape({
            payment_system: Yup.string(),
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
          })
        ),
        description: Yup.string().trim().required(validatorsTextTemplates.required('описание')),
        image: Yup.string(),
      })}
      onSubmit={async (values, { resetForm, setStatus, setSubmitting }): Promise<void> => {
        const updateResetForm = () => {
          resetForm();
          setCheckedApi(false);
          setCheckedLink(false);
          setStatus({ success: true });
        };
        try {
          if (!isNew && organizationId) {
            (async () => {
              try {
                await dispatch(updatePaymentsThunk(+organizationId, id, values, PaymentType.fundraising));
                toast.success('Добровольный сбор обновлен!');
                updateResetForm();
                close();
              } catch (e) {
                toast.error(formatServerError(e));
              }
            })();
          } else {
            (async () => {
              try {
                await addPaymentFundraising(+organizationId, values);
                toast.success('Добровольный сбор создан!');
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
        validateForm,
        touched,
        errors,
        isValid,
        dirty,
        setFieldValue,
        handleReset,
        values,
      }): JSX.Element => (
        <form onSubmit={handleSubmit}>
          <Box sx={{ pb: 3 }}>
            {!isNew && !fundrasingData?.auto_payments?.length && !fundrasingData?.manual_payments?.length && (
              <Typography sx={{ color: 'red', mt: 2 }}>Ошибка: не выбраны данные для оплаты</Typography>
            )}
            <Grid container spacing={3} mb={1} mt={1}>
              <Grid item md={6} xs={12} gap={3} display="flex" flexDirection="column">
                <TextField
                  error={Boolean(touched.title && errors.title)}
                  helperText={touched.title && errors.title}
                  fullWidth
                  multiline
                  rows={2}
                  label="Заголовок"
                  name="title"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.title}
                  variant="outlined"
                />
                <FormControl sx={{ width: '100%' }}>
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
              <Grid item md={6} xs={12} gap={3} display="flex" flexDirection="column">
                <ImageDropzone
                  value={values.image}
                  onDrop={(acceptedFiles) => {
                    acceptedFiles.forEach((file) => {
                      const reader = new FileReader();
                      reader.readAsDataURL(file);
                      reader.onload = () => {
                        (async () => {
                          const response = await uploadFundraisingImage(organizationId, reader.result);
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
                  placeholder="Описание сбора..."
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
              color="light"
              disabled={!dirty}
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

export default PaymentFundrasing;
