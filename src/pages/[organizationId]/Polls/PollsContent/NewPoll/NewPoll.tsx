import { Box, TextField, Typography } from '@material-ui/core';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { validatorsTextTemplates } from 'shared/components/common/Validator/ValidatorsTextTemplates';
import { toast } from 'react-toastify';
import formatServerError from 'shared/utils/formatServerError';
import { Button } from 'shared/components/common/Button/Button';
import { useRef } from 'react';
import styles from './NewPoll.module.scss';
import { allowedSizeFiles, toLargeFileSize } from 'shared/constants/allowedFileSize';
import cloneDeep from 'lodash/cloneDeep';
import { ReactComponent as AddIcon } from '../../../../../shared/icons/add-circle.svg';
import { useHistory, useParams } from 'react-router';
import { useDispatch, useSelector } from '../../../../../redux';
import { createPollAction, updatePollAction } from 'redux/slices/polls';
import { PollType } from 'shared/interfaces/polls';
import { routes } from 'Routes';
import { addGeneralImage } from 'services/api/genereal';

const NewPoll = () => {
  const history = useHistory();
  const { organizationId, pollId } = useParams<{ organizationId?: string; pollId?: string }>();
  const imageInput = useRef(null);
  const dispatch = useDispatch();
  const poll: PollType | null = useSelector(({ polls }) =>
    pollId ? polls?.polls.find((poll) => poll?.id === +pollId) : null
  );

  const handleImageInput = async (e, setFieldValue, images) => {
    if (e.target.files[0].size > allowedSizeFiles) {
      toast.error(toLargeFileSize);
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);

    reader.onload = async () => {
      try {
        const copyValuesImages = cloneDeep(images);
        const image = await addGeneralImage(reader.result);
        copyValuesImages.push({ uuid: image[0].uuid, url: reader.result });
        setFieldValue('images', copyValuesImages);
        toast('Фото успешно добавлено');
      } catch (error) {
        toast.error(formatServerError(error));
        console.error(error);
      }
    };
  };

  const handleClick = () => {
    imageInput.current.click();
  };

  return (
    <Formik
      enableReinitialize
      validationSchema={Yup.object().shape({
        name: Yup.string()
          .max(200, validatorsTextTemplates.maxLength_200('Название'))
          .required('Поле обязательно для заполнения'),
        description: Yup.string()
          .max(1000, 'Максимальное количество символов в этом поле 1000')
          .required('Поле обязательно для заполнения'),
        images: Yup.array(),
      })}
      initialValues={
        {
          name: poll?.name || '',
          description: poll?.description || '',
          images: poll?.images || [],
          type: 0,
        } as PollType
      }
      onSubmit={async (values, { resetForm }) => {
        try {
          let copyPoll = cloneDeep(values);
          copyPoll = { ...values, images: values.images.map((img) => img.uuid) };
          if (!pollId) {
            const idPoll = await dispatch(createPollAction(copyPoll, +organizationId));
            toast('Опрос создан!');
            history.push(routes.polls.getNewQuestionPage(organizationId, idPoll));
          } else {
            await dispatch(updatePollAction(copyPoll, +organizationId, +pollId));
            toast('Опрос обновлен!');
            history.push(routes.polls.getCreatingPoll(organizationId, pollId));
          }

          resetForm();
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
            <Typography variant="h5">Опрос:</Typography>
            <Typography variant="subtitle1" sx={{ width: '600px', margin: '20px 0' }}>
              Используя функционал опроса вы можете создать голосование в вашем объединении, сбор общественного мнения,
              измерить уровень знаний, создать тест, шкалу лояльности и многое другое. Создавать опрос и видеть его
              результаты может только админ объединения. Участники видят только описание опроса, сами вопросы и отвечают
              на них.
            </Typography>
            <Box mt={2} mb={2}>
              <TextField
                error={Boolean(touched.name && errors.name)}
                fullWidth
                helperText={touched.name && errors.name}
                label="Заголовок"
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
              <div>
                <input
                  type="file"
                  ref={imageInput}
                  onChange={(e) => {
                    e.preventDefault();
                    handleImageInput(e, setFieldValue, values.images);
                  }}
                  accept="image/png, image/jpeg, image/jpg"
                  style={{ display: 'none' }}
                />
                <div className={styles.imageInputsWrapper}>
                  {values?.images.length < 10 && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleClick();
                      }}
                      className={styles.addImageButton}
                    >
                      <AddIcon />
                      <p>Добавить изображение</p>
                    </button>
                  )}

                  {!!values.images.length &&
                    values.images.map((item) => {
                      return (
                        <div className={styles.imageWrapper}>
                          <img src={item.url} alt="" className={styles.image} />
                          <button
                            className={styles.icon}
                            onClick={() => {
                              const copyImagesValues = cloneDeep(values.images);
                              const filterImages = copyImagesValues.filter((image) => image.uuid !== item.uuid);
                              setFieldValue('images', filterImages);
                              toast('Фото удалено!');
                            }}
                          >
                            <AddIcon />
                          </button>
                        </div>
                      );
                    })}
                </div>
              </div>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button color="light" disabled={!dirty} onClick={handleReset}>
                Отмена
              </Button>
              <Button disabled={isSubmitting || !isValid || !dirty} type="submit">
                {!pollId ? 'Создать' : 'Сохранить'}
              </Button>
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default NewPoll;
