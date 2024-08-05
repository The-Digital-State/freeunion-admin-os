import * as Yup from 'yup';

import {
  Box,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@material-ui/core';
import { FieldArray, Form, Formik } from 'formik';
import { Button } from 'shared/components/common/Button/Button';
import { CurrenciesType } from 'shared/interfaces/finance';
import { currencies } from '../PaymentCreation/PaymentCreation';

import TrashIcon from '../../../../lib/material-kit/icons/Trash';
import AddIcon from '../../../../lib/material-kit/icons/Plus';
import { useLocation } from 'react-router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getCosts, updateCosts } from 'services/api/finance';
import formatServerError from 'shared/utils/formatServerError';
import Tooltip from 'shared/components/common/Tooltip/Tooltip';

const validationSchema = Yup.object().shape({
  costs: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().trim().required('Поле обязательно для заполнения'),
      amount: Yup.number().typeError('Доступны только цифры').required('Поле обязательно для заполнения'),
    })
  ),
});

const PaymentsCosts = () => {
  const location = useLocation();
  const organizationId = +location.pathname.split('/')[1];

  const [costs, setCosts] = useState<any[]>([
    {
      name: '',
      amount: '',
      currency: CurrenciesType.EUR,
    },
  ]);

  useEffect(() => {
    (async () => {
      try {
        const response = await getCosts(+organizationId);
        if (!response?.length) {
          return;
        }
        setCosts(response);
      } catch (e) {
        toast.error(formatServerError(e));
        console.log('Ошибка', e);
      }
    })();
  }, [organizationId]);

  return (
    <Box sx={{ padding: '20px 40px 20px 40px' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ textTransform: 'uppercase' }}>
          статьи расходов
        </Typography>
        <Typography variant="subtitle1" sx={{ width: '60%' }}>
          Укажите основные статьи расходов из которых состоит ваш ежемесячный бюджет. Это повысит доверие к объединению
          среди ваших участников и они более охотно будут жертвовать вам деньги
        </Typography>
      </Box>

      <Formik
        enableReinitialize
        initialValues={{
          costs: costs,
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, setStatus }): Promise<void> => {
          try {
            await updateCosts(organizationId, values.costs);
            toast('Данные обновлены!');
            setStatus({ success: true });
            setCosts(values.costs);
          } catch (e) {
            toast.error(formatServerError(e));
            console.log('Ошибка', e);
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
          values,
        }): JSX.Element => (
          <Form onSubmit={handleSubmit}>
            <Divider />
            <Box sx={{ pt: 3 }}>
              <Grid container spacing={3} mb={5}>
                <FieldArray name="costs">
                  {({ push, remove }) => (
                    <Grid item md={12} xs={12} gap={4} display="flex" flexDirection="column">
                      {values.costs.map((cost, index) => {
                        return (
                          <Box
                            key={index}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                          >
                            <TextField
                              sx={{ width: '40%' }}
                              error={Boolean(
                                touched &&
                                  touched.costs &&
                                  touched.costs[index] &&
                                  touched.costs[index]?.name &&
                                  errors &&
                                  errors.costs &&
                                  //@ts-ignore
                                  errors.costs[index]?.name
                              )}
                              helperText={
                                touched &&
                                touched.costs &&
                                touched.costs[index] &&
                                touched.costs[index]?.name &&
                                errors &&
                                errors.costs &&
                                //@ts-ignore
                                errors.costs[index]?.name
                              }
                              label="Название расхода"
                              name={`costs.${index}.name`}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={cost.name}
                              variant="outlined"
                              placeholder="Название"
                            />
                            <TextField
                              sx={{ width: '25%' }}
                              error={Boolean(
                                touched &&
                                  touched.costs &&
                                  touched.costs[index] &&
                                  touched.costs[index]?.amount &&
                                  errors &&
                                  errors.costs &&
                                  //@ts-ignore
                                  errors.costs[index]?.amount
                              )}
                              helperText={
                                touched &&
                                touched.costs &&
                                touched.costs[index] &&
                                touched.costs[index]?.amount &&
                                errors &&
                                errors.costs &&
                                //@ts-ignore
                                errors.costs[index]?.amount
                              }
                              label="Сумма"
                              name={`costs.${index}.amount`}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={cost.amount}
                              variant="outlined"
                              placeholder="Сумма"
                            />
                            <FormControl sx={{ width: '20%', mr: 2 }}>
                              <InputLabel>Валюта</InputLabel>
                              <Select
                                label="Валюта"
                                name={`costs.${index}.currency`}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={cost.currency}
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
                            <Box
                              sx={{
                                width: '10%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                              }}
                            >
                              <>
                                <IconButton
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    remove(index);
                                  }}
                                  data-tip
                                  data-for={`deleteCosts`}
                                >
                                  <TrashIcon fontSize="small" />
                                </IconButton>

                                <Tooltip title="Удалить расходы" id="deleteCosts" />
                              </>
                              {index === values.costs.length - 1 && (
                                <>
                                  <IconButton
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      push({ name: '', amount: '', currency: CurrenciesType.EUR });
                                    }}
                                    data-tip
                                    data-for={`addCosts`}
                                  >
                                    <AddIcon fontSize="medium" />
                                  </IconButton>
                                  <Tooltip id="addCosts" title="Добавить расходы" />
                                </>
                              )}
                            </Box>
                          </Box>
                        );
                      })}
                      {!values.costs.length && (
                        <Button onClick={() => push({ name: '', amount: '', currency: CurrenciesType.EUR })}>
                          Добавить первый расход
                        </Button>
                      )}
                    </Grid>
                  )}
                </FieldArray>
              </Grid>
              <Divider />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button color="light" disabled={!dirty} onClick={handleReset}>
                  ОТМЕНИТЬ
                </Button>
                <Button disabled={isSubmitting || !isValid || !dirty} type="submit">
                  СОХРАНИТЬ ИЗМЕНЕНИЯ
                </Button>
              </Box>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default PaymentsCosts;
