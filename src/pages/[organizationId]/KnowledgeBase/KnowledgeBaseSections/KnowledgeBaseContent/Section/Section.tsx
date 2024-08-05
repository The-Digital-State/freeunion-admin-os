import { Box, TextField, Typography } from '@material-ui/core';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { validatorsTextTemplates } from 'shared/components/common/Validator/ValidatorsTextTemplates';
import { toast } from 'react-toastify';
import formatServerError from 'shared/utils/formatServerError';
import { Button } from 'shared/components/common/Button/Button';
import { useHistory, useParams } from 'react-router';
import { useDispatch } from 'react-redux';
import { createSectionAction, updateSectionAction } from 'redux/slices/articles';
import { useLayoutEffect, useState } from 'react';
import ImageDropzone from 'components/molecules/ImageDropzone';
import { routes } from 'Routes';
import { useQuery } from 'helpers/useQuery';
import { useSelector } from '../../../../../../redux';
import { KbaseSectionLight } from 'shared/interfaces/kbase';

const Section = () => {
  const dispatch = useDispatch();

  const history = useHistory();
  const { organizationId } = useParams<{ organizationId?: string }>();
  let query = useQuery();

  const sectionId = query.get('sectionId') || '';

  const sections: KbaseSectionLight[] = useSelector(({ articles }) => articles?.sections);

  const [section, setSection] = useState<KbaseSectionLight>({
    name: '',
    description: '',
    cover: '',
    id: null,
  });

  useLayoutEffect(() => {
    if (!!sectionId && sections.length) {
      setSection(sections.find((section) => section.id === +sectionId));
    }
  }, [sectionId, sections]);

  return (
    <Formik
      enableReinitialize
      validationSchema={Yup.object().shape({
        name: Yup.string()
          .max(200, validatorsTextTemplates.maxLength_200('Названия'))
          .required('Поле обязательно для заполнения'),
        description: Yup.string().max(255, 'Максимальное количество символов в этом поле 255'),
      })}
      initialValues={{
        name: section.name,
        description: section.description,
        cover: section.cover,
      }}
      onSubmit={async (values, { resetForm }) => {
        try {
          let copyValues = Object.assign({}, values);
          if (!section.id) {
            if (!values.cover) {
              delete copyValues.cover;
            }
            const createdSectionId = await dispatch(createSectionAction(copyValues, +organizationId));
            history.push(`${routes.kbase.getLinkCreateKbase(organizationId)}/${createdSectionId}`);

            toast('Раздел создан!');
            resetForm();
          } else {
            if (!values.cover) {
              delete copyValues.cover;
            }
            await dispatch(updateSectionAction({ ...copyValues, id: section.id }, +organizationId, section.id));
            history.push(`${routes.kbase.getLinkCreateKbase(organizationId)}/${sectionId}`);

            toast('Раздел обновлен!');
          }
        } catch (e) {
          toast.error(formatServerError(e));
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values,
        isValid,
        dirty,
        handleReset,
        setFieldValue,
      }): JSX.Element => (
        <Form onSubmit={handleSubmit}>
          <Box>
            <Typography variant="h5">{!section.id ? 'Создание' : 'Изменение'} раздела</Typography>
            <Box mt={2} mb={2}>
              <TextField
                error={Boolean(touched.name && errors.name)}
                fullWidth
                helperText={touched.name && errors.name}
                label="Название раздела"
                name="name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                variant="outlined"
                sx={{
                  margin: '10px 0',
                }}
              />
              <TextField
                error={Boolean(touched.description && errors.description)}
                fullWidth
                multiline
                rows={3}
                helperText={touched.description && errors.description}
                label="Описание"
                name="description"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.description}
                variant="outlined"
                sx={{
                  margin: '10px 0 30px 0',
                }}
              />
              <ImageDropzone
                value={values.cover}
                onDrop={(acceptedFiles) => {
                  acceptedFiles.forEach((file) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => {
                      setFieldValue('cover', reader.result);
                    };
                  });
                }}
                label="Изображение"
                dropzoneInfo="Выберите фото с соотношением сторон 16:9"
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button color="light" disabled={!dirty} onClick={handleReset}>
                Отмена
              </Button>
              <Button disabled={isSubmitting || !isValid || !dirty} type="submit">
                {!section.id ? 'Создать' : 'Сохранить'}
              </Button>
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default Section;
