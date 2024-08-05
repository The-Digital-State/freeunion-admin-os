import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { useState } from 'react';
import { Formik } from 'formik';

import { Box, Grid, Divider, FormControlLabel, Typography, Radio, RadioGroup } from '@material-ui/core';
import { Button } from 'shared/components/common/Button/Button';
import formatServerError from 'shared/utils/formatServerError';

const introductionsMethods = [
  {
    label: 'По клику',
    value: 'click',
    text: 'Это самый простой способ вступления в объединение. Пользователь просто нажмет на кнопку "Вступить" и станет участником объединения.',
  },
  {
    label: 'По запросу',
    value: 'request',
    text: 'Для того, чтобы стать членом объединения, пользователь должен подать заявку на вступление, а админ может ее одобрить или отказать с указанием причины отказа',
  },
];

const WayToEntryForm = ({ organization, update }) => {
  const [textHover, setTextHover] = useState(introductionsMethods[organization.request_type].text);
  const checkboxHandle = (checked: boolean, setFieldValue, type: number) => {
    if (!checked) {
      setFieldValue('request_type', type);
    } else {
      setFieldValue('request_type', null);
    }
  };

  const hoverEffect = (index: number) => {
    setTextHover(introductionsMethods[index].text);
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        request_type: organization.request_type,
        submit: null,
      }}
      validationSchema={Yup.object().shape({
        request_type: Yup.number().required('Поле обязательно для заполнения'),
      })}
      onSubmit={async (values, { resetForm, setErrors, setStatus, setSubmitting }): Promise<void> => {
        try {
          const { request_type } = values;
          await update({
            body: { request_type },
          });
          resetForm();
          setStatus({ success: true });
          toast.success('Способ вступления обновлен!');
        } catch (err) {
          console.error(err);
          toast.error(formatServerError(err));
          setStatus({ success: false });
          setErrors({ submit: err.message });
        }
        setSubmitting(false);
      }}
    >
      {({ handleSubmit, isSubmitting, isValid, dirty, handleReset, setFieldValue, values }): JSX.Element => (
        <form onSubmit={handleSubmit}>
          <Divider />
          <Box
            sx={{
              pt: 4,
              pb: 4,
              pr: 15,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Grid item md={4} sm={6} xs={12}>
              <RadioGroup name="paymentMethod" sx={{ flexDirection: 'column' }}>
                {introductionsMethods.map((introductionMethods, index) => (
                  <FormControlLabel
                    control={<Radio color="primary" sx={{ ml: 1 }} />}
                    checked={values.request_type == index}
                    key={introductionMethods.value}
                    onMouseOver={() => hoverEffect(index)}
                    onMouseOut={() => hoverEffect(values.request_type)}
                    onChange={(event, checked) => checkboxHandle(checked, setFieldValue, index)}
                    label={
                      <Typography color="textPrimary" variant="body1">
                        {introductionMethods.label}
                      </Typography>
                    }
                    value={introductionMethods.value}
                  />
                ))}
              </RadioGroup>
            </Grid>

            <Grid item md={5} sm={7} xs={12}>
              {textHover}
            </Grid>
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
            <Button color="light" disabled={!dirty} onClick={handleReset}>
              ОТМЕНИТЬ
            </Button>
            <Button disabled={isSubmitting || !isValid || !dirty} type="submit">
              СОХРАНИТЬ ИЗМЕНЕНИЯ
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default WayToEntryForm;
