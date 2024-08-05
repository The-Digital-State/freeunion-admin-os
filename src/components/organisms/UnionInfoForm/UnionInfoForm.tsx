// @ts-nocheck
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { Formik } from 'formik';

import {
  Box,
  Grid,
  TextField,
  Autocomplete,
  Divider,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@material-ui/core';

import ImageDropzone from '../../molecules/ImageDropzone';
import { RegistrationTypesEnum, RegistrationTypesNamesEnum } from 'shared/interfaces/organization';
import { Button } from 'shared/components/common/Button/Button';
import { validatorsTextTemplates } from 'shared/components/common/Validator/ValidatorsTextTemplates';
import formatServerError from 'shared/utils/formatServerError';

const registrationOptions = [
  { value: RegistrationTypesEnum.NotRegistered, text: RegistrationTypesNamesEnum.NotRegistered },
  { value: RegistrationTypesEnum.Registered, text: RegistrationTypesNamesEnum.Registered },
  { value: RegistrationTypesEnum.InProcess, text: RegistrationTypesNamesEnum.InProcess },
];

const UnionInfoForm = ({ organization, update, dictionaries }) => {
  return (
    <Formik
      enableReinitialize
      initialValues={{
        avatar: organization.avatar || '',
        status: organization.status || '',
        scopes: organization?.scopes || [],
        interests: organization?.interests?.map((interest) => ({ id: interest.id, name: interest.name })) || [],
        description: organization.description || '',
        name: organization.name || '',
        site: organization.site || '',
        address: organization.address || '',
        email: organization.email || '',
        short_name: organization.short_name || '',
        phone: organization.phone || '',
        submit: null,
        type_name: organization.type_name || '',
        registration: organization.registration,
      }}
      validationSchema={Yup.object().shape({
        avatar: Yup.string(),
        interests: Yup.array(),
        scopes: Yup.array(),
        description: Yup.string()
          .trim()
          .max(500, validatorsTextTemplates.maxLength_500('описание'))
          .required('Поле обязательно для заполнения'),
        type_name: Yup.string().trim().required('Поле обязательно для заполнения'),
        name: Yup.string().max(200, validatorsTextTemplates.maxLength_200('полное название')),
        site: Yup.string().url('Неправильный формат сайта'),
        address: Yup.string().max(200, validatorsTextTemplates.maxLength_200('адрес')),
        status: Yup.string().max(200, validatorsTextTemplates.maxLength_200('статус')),
        email: Yup.string().email('Неправильный формат email').max(200, validatorsTextTemplates.maxLength_200('почта')),
        short_name: Yup.string()
          .trim()
          .max(50, validatorsTextTemplates.maxLength_50('короткое название'))
          .required('Поле обязательно для заполнения'),
        phone: Yup.string().matches(
          /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/,
          'Неправильный формат номера телефона'
        ),
      })}
      onSubmit={async (values, { resetForm, setErrors, setStatus, setSubmitting }): Promise<void> => {
        try {
          const { scopes, interests, avatar, type_name, ...formValues } = values;
          const type = dictionaries.organizationTypes.find((organizationType) => organizationType.name === type_name);
          const hasProfessional = interests.some((interest) => interest.id === 1);
          await update({
            body: { ...formValues, type_id: type?.id },
            interests: interests.map((interest) => interest.id),
            scopes: hasProfessional ? scopes.map((scope) => scope.id) : [],
            avatar,
          });
          resetForm();
          setStatus({ success: true });
          setSubmitting(false);
          toast.success('Информация обновлена!');
        } catch (err) {
          console.error(err);
          toast.error(formatServerError(err));
          setStatus({ success: false });
          setErrors({ submit: err.message });
          setSubmitting(false);
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        touched,
        values,
        dirty,
        handleReset,
        setFieldValue,
        validateForm,
        submitForm,
      }): JSX.Element => (
        <form onSubmit={handleSubmit}>
          <Divider />
          <Box sx={{ pt: 3 }}>
            <Grid container spacing={3} mb={1}>
              <Grid item md={6} xs={12} gap={3} display="flex" flexDirection="column">
                <TextField
                  error={Boolean(touched.short_name && errors.short_name)}
                  fullWidth
                  helperText={touched.short_name && errors.short_name}
                  label="Короткое название"
                  name="short_name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.short_name}
                  variant="outlined"
                />
                <TextField
                  multiline
                  rows={2}
                  error={Boolean(touched.name && errors.name)}
                  fullWidth
                  helperText={touched.name && errors.name}
                  label="Полное название"
                  name="name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.name}
                  variant="outlined"
                />
                <Autocomplete
                  multiple
                  limitTags={1}
                  getOptionLabel={(option): string => option.name}
                  onBlur={handleBlur}
                  onChange={(e, options) => {
                    setFieldValue('interests', options);
                  }}
                  options={dictionaries.interestScopes}
                  value={values.interests}
                  renderInput={(params): JSX.Element => (
                    <TextField
                      error={Boolean(touched.interests && errors.interests)}
                      fullWidth
                      helperText={touched.interests && errors.interests}
                      label="Сферы интересов"
                      name="interests"
                      variant="outlined"
                      {...params}
                    />
                  )}
                />
                {values.interests.some((interest) => interest.id === 1) ? (
                  <Autocomplete
                    multiple
                    limitTags={1}
                    getOptionLabel={(option): string => option.name}
                    onBlur={handleBlur}
                    onChange={(e, options) => {
                      setFieldValue('scopes', options);
                    }}
                    options={dictionaries.activityScopes}
                    value={values.scopes}
                    renderInput={(params): JSX.Element => (
                      <TextField
                        error={Boolean(touched.scopes && errors.scopes)}
                        fullWidth
                        helperText={touched.scopes && errors.scopes}
                        label="Сфера деятельности"
                        name="scopes"
                        variant="outlined"
                        {...params}
                      />
                    )}
                  />
                ) : null}

                <Autocomplete
                  getOptionLabel={(option): string => option.name || option}
                  onBlur={handleBlur}
                  onChange={(e, option) => {
                    setFieldValue('type_name', option?.name || '');
                  }}
                  options={dictionaries.organizationTypes}
                  value={values.type_name}
                  renderInput={(params): JSX.Element => (
                    <TextField
                      error={Boolean(touched.type_name && errors.type_name)}
                      fullWidth
                      helperText={touched.type_name && errors.type_name}
                      label="Форма объединения"
                      name="type_name"
                      variant="outlined"
                      {...params}
                    />
                  )}
                />
                <ImageDropzone
                  value={values.avatar}
                  onDrop={(acceptedFiles) => {
                    acceptedFiles.forEach((file) => {
                      const reader = new FileReader();
                      reader.readAsDataURL(file);
                      reader.onload = () => {
                        setFieldValue('avatar', reader.result);
                      };
                    });
                  }}
                  label="Логотип"
                  dropzoneInfo={`Выберите изображение размером 200 | 200 px с хророшим содержанием, 
                  чтобы не попасть в блокировку платформы.`}
                />
              </Grid>
              <Grid item md={6} xs={12} gap={3} display="flex" flexDirection="column">
                <TextField
                  error={Boolean(touched.site && errors.site)}
                  fullWidth
                  helperText={touched.site && errors.site}
                  label="Cайт"
                  name="site"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.site}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.address && errors.address)}
                  fullWidth
                  helperText={touched.address && errors.address}
                  label="Адрес"
                  name="address"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.address}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.phone && errors.phone)}
                  fullWidth
                  helperText={touched.phone && errors.phone}
                  label="Телефон"
                  name="phone"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.phone}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.email && errors.email)}
                  fullWidth
                  helperText={touched.email && errors.email}
                  label="Email"
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  variant="outlined"
                />
                <TextField
                  multiline
                  rows={5}
                  inputProps={{ sx: { height: 100 } }}
                  error={Boolean(touched.description && errors.description)}
                  fullWidth
                  helperText={touched.description && errors.description}
                  label="Фокус работы"
                  name="description"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.description}
                  variant="outlined"
                />
                <Box>
                  <FormControl>
                    <InputLabel>Статус объединения</InputLabel>
                    <Select
                      error={Boolean(touched.status && errors.status)}
                      fullWidth
                      // helperText={touched.status && errors.status}
                      label="Статус регистрации"
                      name="registration"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.registration}
                      variant="outlined"
                    >
                      {registrationOptions.map(({ value, text }) => {
                        return (
                          <MenuItem key={value} value={value}>
                            {text}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  {/* <Box sx={{ ml: 2 }}>
                    <p>{registrationOptions[organization.registration].text}</p>
                  </Box> */}
                </Box>
              </Grid>
            </Grid>
            <Divider />
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button color="light" disabled={!dirty} onClick={handleReset}>
                ОТМЕНИТЬ
              </Button>
              <Button
                onClick={async () => {
                  await validateForm();
                  submitForm();
                }}
              >
                СОХРАНИТЬ ИЗМЕНЕНИЯ
              </Button>
            </Box>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default UnionInfoForm;
