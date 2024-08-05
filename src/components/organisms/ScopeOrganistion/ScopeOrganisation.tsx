import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { Formik } from 'formik';

import { Box, Grid, Divider, FormControlLabel, Checkbox, Typography, Radio, RadioGroup } from '@material-ui/core';
import { useState } from 'react';
import { Button } from 'shared/components/common/Button/Button';
import formatServerError from 'shared/utils/formatServerError';

const scopes = [
  {
    id: 0,
    label: 'Открытое объединение',
    text: 'Вся информация об объединении видна всем пользователям платформы',
  },
  {
    label: 'Закрытое объединение',
    text: 'Данные объединения не видны никому, кроме его участников',
    id: 1,
  },
  {
    label: 'Открытое объединение, скрытые некоторые данные',
    text: 'Блоки, которые вы отметили, будут скрыты для всех пользователей платформы и доступны только участникам вашего объединения',
    id: 2,
  },
];

const hiddenData = [
  {
    name: 'members',
    text: 'Участники',
  },
  {
    name: 'admins',
    text: 'Актив',
  },
  {
    name: 'tasks',
    text: 'Задачи',
  },
  // {
  //   name: 'events',
  //   text: 'Мероприятия',
  // },
  // {
  //   name: 'finance',
  //   text: 'Финансы',
  // },
];

const ScopeOrganisation = ({ organization, update }) => {
  const [partially, setPartially] = useState(organization.public_status === 2);
  const [text, setText] = useState(organization.public_status);

  const radioHandle = (checked: boolean, setFieldValue, type: number) => {
    if (!checked) {
      setText(type);

      type === 2 ? setPartially(true) : setPartially(false);
      setFieldValue('public_status', type);
      setFieldValue('hiddens', []);
    } else {
      setFieldValue('public_status', organization.public_status);
    }
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        public_status: organization.public_status,
        hiddens: organization.hiddens || [],
        submit: null,
      }}
      validationSchema={Yup.object().shape({
        public_status: Yup.number(),
        hiddens: Yup.array(),
      })}
      onSubmit={async (values, { resetForm, setErrors, setStatus, setSubmitting }): Promise<void> => {
        try {
          const { public_status, hiddens } = values;
          await update({
            body: { public_status, hiddens },
          });
          resetForm();
          setStatus({ success: true });
          toast.success('Видимость объединения сохранена');
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
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Grid item md={4} sm={6} xs={12}>
              <RadioGroup sx={{ flexDirection: 'column' }}>
                {scopes.map((scopeData) => {
                  return (
                    <FormControlLabel
                      control={<Radio color="primary" sx={{ ml: 1 }} />}
                      checked={values.public_status === scopeData.id}
                      value={scopeData.id}
                      key={scopeData.id}
                      onChange={(event, checked) => radioHandle(checked, setFieldValue, scopeData.id)}
                      label={
                        <Typography color="textPrimary" variant="body1">
                          {scopeData.label}
                        </Typography>
                      }
                    />
                  );
                })}
              </RadioGroup>
            </Grid>

            {partially ? (
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                {hiddenData.map((item) => {
                  return (
                    <FormControlLabel
                      key={item.name}
                      checked={values.hiddens.length > 0 && values.hiddens.includes(item.name)}
                      onChange={({ target: { checked } }: any) => {
                        if (checked) {
                          if (item.name === 'members') {
                            setFieldValue('hiddens', [...values.hiddens, 'members', 'admins']);
                          } else {
                            setFieldValue('hiddens', [...values.hiddens, item.name]);
                          }
                        } else {
                          setFieldValue('hiddens', [...values.hiddens.filter((hidden) => hidden !== item.name)]);
                        }
                      }}
                      control={<Checkbox />}
                      label={item.text}
                    />
                  );
                })}
              </Box>
            ) : undefined}
            <Grid item md={3} sm={6} xs={12}>
              {scopes.map((i) => {
                if (i.id !== text) {
                  return null;
                }
                return i.text;
              })}
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
            <Button disabled={!dirty} color="light" onClick={handleReset}>
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

export default ScopeOrganisation;
