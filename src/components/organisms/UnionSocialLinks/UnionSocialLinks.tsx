import { IconButton, Box, Divider, TextField, Grid } from '@material-ui/core';
import { toast } from 'react-toastify';
import { Form, Formik, FieldArray, Field } from 'formik';
import * as Yup from 'yup';
import AddNewSocial from './AddNewSocial';
import { Button } from 'shared/components/common/Button/Button';
import { Socials } from 'shared/interfaces/organization';
import TrashIcon from '../../../lib/material-kit/icons/Trash';
import formatServerError from 'shared/utils/formatServerError';
import Tooltip from 'shared/components/common/Tooltip/Tooltip';

interface ISocials {
  type: Socials;
  value: string | null;
  title: string;
}

const validationSchema = Yup.object().shape({
  social: Yup.array().of(
    Yup.object().shape({
      value: Yup.string().url('Неправильный формат ссылки на соц. сеть').nullable(true),
    })
  ),
});

const UnionSocialLinks = ({ organization, update }): JSX.Element => {
  return (
    <>
      <Formik
        enableReinitialize
        initialValues={{
          social: organization.social as ISocials[],
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm, setStatus, setSubmitting }): Promise<void> => {
          try {
            const { social } = values;
            setStatus({ success: true });
            await update({
              body: { social },
            });
            toast.success('Информация обновлена!');
            resetForm();
          } catch (err) {
            console.error(err);
            toast.error(formatServerError(err));
          }
          setSubmitting(false);
        }}
      >
        {({
          handleSubmit,
          handleBlur,
          isSubmitting,
          isValid,
          dirty,
          values,
          handleReset,
          errors,
          setFieldValue,
        }): JSX.Element => (
          <Form onSubmit={handleSubmit}>
            <Divider />
            <Box sx={{ pt: 3 }}>
              <Grid container spacing={3} mb={5}>
                <FieldArray name="social">
                  {({ replace }) => (
                    <Grid item md={12} xs={12} gap={4} display="flex" flexDirection="column">
                      {values.social.map((item, index) => {
                        return (
                          <Box
                            key={item.type}
                            style={{
                              display: 'flex',
                            }}
                          >
                            <Field
                              style={{ textTransform: 'capitalize' }}
                              component={TextField}
                              key={index}
                              fullWidth
                              label={item.title}
                              onBlur={handleBlur}
                              placeholder={'https://...'}
                              name={`values.social.${index}.value`}
                              value={item.value === null ? '' : item.value}
                              onChange={(e) => {
                                const copySocialLinks = Object.assign({}, values.social[index]);
                                copySocialLinks.value = e.target.value;
                                replace(index, copySocialLinks);
                              }}
                              variant="outlined"
                              sx={{ height: 50 }}
                              error={errors?.social && errors.social[index]}
                              //@ts-ignore
                              helperText={errors?.social && errors.social[index]?.value}
                            />

                            <IconButton
                              onClick={() => {
                                const filteredSocial = [...values.social].filter(
                                  (social) => social.type !== values.social[index].type
                                );
                                setFieldValue('social', filteredSocial);
                              }}
                              data-tip
                              data-for={`deleteUnionSocilLinkTooltip`}
                            >
                              <TrashIcon />
                            </IconButton>
                            <Tooltip id="deleteUnionSocilLinkTooltip" title="Удалить" />
                          </Box>
                        );
                      })}
                    </Grid>
                  )}
                </FieldArray>
              </Grid>
              <Divider />
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                <AddNewSocial currentSocials={values.social} setCurrentSocials={setFieldValue} />

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button color="light" disabled={!dirty} onClick={handleReset}>
                    ОТМЕНИТЬ
                  </Button>
                  <Button disabled={isSubmitting || !isValid || !dirty} type="submit">
                    СОХРАНИТЬ ИЗМЕНЕНИЯ
                  </Button>
                </Box>
              </Box>
            </Box>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default UnionSocialLinks;
