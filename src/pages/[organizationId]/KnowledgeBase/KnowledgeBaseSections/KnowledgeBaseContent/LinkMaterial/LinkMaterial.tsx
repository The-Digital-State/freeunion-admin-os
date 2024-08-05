import { Box, FormControlLabel, Radio, RadioGroup, TextField, Typography } from '@material-ui/core';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { validatorsTextTemplates } from 'shared/components/common/Validator/ValidatorsTextTemplates';
import { toast } from 'react-toastify';
import formatServerError from 'shared/utils/formatServerError';
import { Button } from 'shared/components/common/Button/Button';
import { useHistory, useParams } from 'react-router';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import ImageDropzone from 'components/molecules/ImageDropzone';
// import { routes } from 'Routes';
import { useQuery } from 'helpers/useQuery';
import { createMaterialAction, updateMaterialAction } from 'redux/slices/articles';
import { routes } from 'Routes';
import { getMaterial, uploadImageMaterial } from 'services/api/kbase';
import { TagsInput } from 'pages/[organizationId]/Editor/PublicationSettings/TagsInput/TagsInput';

enum Visibility {
  all = 'ALL',
  users = 'USERS',
  organization = 'ORGANIZATION',
  admin = 'ADMIN',
}

const visibalityText = {
  [Visibility.all]: 'Видно всем',
  [Visibility.users]: 'Только пользователям платформы',
  [Visibility.organization]: 'Только участникам объединения',
  [Visibility.admin]: 'Видно только из админки',
};

const LinkMaterial = () => {
  const dispatch = useDispatch();

  const history = useHistory();

  const { organizationId, sectionId } = useParams<{ organizationId?: string; sectionId?: string }>();
  let query = useQuery();

  const materialId = query.get('materialId') || '';

  const [linkMaterial, setLinkMaterial] = useState<any>({
    title: '',
    excerpt: '',
    content: '',
    image: '',
    visible: 0,
    tags: [],
    id: null,
  });

  useEffect(() => {
    if (!!materialId) {
      (async () => {
        try {
          const material = await getMaterial(+organizationId, +materialId);
          setLinkMaterial(material);
        } catch (e) {
          toast.error(formatServerError(e));
        }
      })();
    }
  }, [materialId, organizationId]);

  return (
    <Formik
      enableReinitialize
      validationSchema={Yup.object().shape({
        title: Yup.string()
          .max(200, validatorsTextTemplates.maxLength_200('Названия'))
          .required('Поле обязательно для заполнения'),
        excerpt: Yup.string().max(255, 'Максимальное количество символов в этом поле 255').nullable(true),
        content: Yup.string().url('Неправильный формат ссылки на чат').required('Поле обязательно для заполнения'),
      })}
      initialValues={{
        title: linkMaterial.title as string,
        excerpt: linkMaterial.excerpt as string,
        content: linkMaterial.content as string,
        preview: linkMaterial.image,
        visible: linkMaterial.visible as number,
        tags: linkMaterial.tags as string[],
        type: 'link',
        section: +sectionId,
      }}
      onSubmit={async (values, { resetForm }) => {
        try {
          if (linkMaterial.id) {
            await dispatch(updateMaterialAction(+organizationId, linkMaterial.id, values as any, true));
            toast('Материал обновлен!');
            resetForm();
          } else {
            let copyValues = Object.assign({}, values);

            if (!values.preview) {
              delete copyValues.preview;
            }
            await dispatch(createMaterialAction(+organizationId, values as any, true));

            toast('Материал создан!');
          }
          history.push(routes.kbase.getLinkMaterials(organizationId));
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
        submitForm,
        setFieldValue,
      }): JSX.Element => (
        <Form onSubmit={handleSubmit}>
          <Box>
            <Typography variant="h5">{!linkMaterial.id ? 'Создание' : 'Изменение'} материала-ссылки</Typography>
            <Box mt={2} mb={2}>
              <TextField
                error={Boolean(touched.title && errors.title)}
                fullWidth
                helperText={touched.title && errors.title}
                label="Название"
                name="title"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.title}
                variant="outlined"
                sx={{
                  margin: '10px 0',
                }}
              />
              <TextField
                error={Boolean(touched.excerpt && errors.excerpt)}
                fullWidth
                multiline
                rows={2}
                helperText={touched.excerpt && errors.excerpt}
                label="Описание"
                name="excerpt"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.excerpt}
                variant="outlined"
                sx={{
                  margin: '10px 0 10px 0',
                }}
              />
              <TextField
                error={Boolean(touched.content && errors.content)}
                fullWidth
                helperText={touched.content && errors.content}
                label="Ссылка"
                name="content"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.content}
                variant="outlined"
                sx={{
                  margin: '10px 0 0 0',
                }}
              />
              <Box margin="15px 0">
                <Typography style={{ fontWeight: 500, fontSize: '14px', lineHeight: '25px', marginRight: '15px' }}>
                  Видимость:
                </Typography>
                <RadioGroup
                  value={values.visible}
                  onChange={(e) => setFieldValue('visible', +e.target.value)}
                  name="visible"
                >
                  {(Object.keys(Visibility) as Array<keyof typeof Visibility>).map((key, index) => {
                    return (
                      <FormControlLabel
                        value={index}
                        control={<Radio />}
                        label={visibalityText[Visibility[key]]}
                        labelPlacement="end"
                      />
                    );
                  })}
                </RadioGroup>
              </Box>
              <Box margin="15px 0 30px 0">
                <TagsInput tags={values.tags} onChange={(tags) => setFieldValue('tags', tags)} isMaterial />
              </Box>
              <ImageDropzone
                value={values.preview}
                onDrop={(acceptedFiles) => {
                  acceptedFiles.forEach((file) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = async () => {
                      try {
                        const {
                          data: { url },
                        } = await uploadImageMaterial(organizationId, reader.result);
                        setFieldValue('preview', url);
                      } catch (error) {
                        toast.error(formatServerError(error));
                        console.error(error);
                      }
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
              <Button disabled={isSubmitting || !isValid || !dirty} onClick={submitForm}>
                {!linkMaterial.id ? 'Создать' : 'Сохранить'}
              </Button>
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default LinkMaterial;
