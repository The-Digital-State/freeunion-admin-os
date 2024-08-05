import * as Yup from 'yup';
import { Autocomplete, Box, Divider, TextField } from '@material-ui/core';
import { Form, Formik } from 'formik';
import { Button } from 'shared/components/common/Button/Button';
import { toast } from 'react-toastify';
import formatServerError from 'shared/utils/formatServerError';

import { PollQuestionType, QuestionsType } from 'shared/interfaces/polls';
import { useHistory, useParams } from 'react-router';
import { useDispatch } from '../../../../../../redux';
import { createQuestionAction, updateQuestionAction } from 'redux/slices/polls';
import { routes } from 'Routes';
import QuestionsDescription from '../QuestionsDescription/QuestionsDescription';
import { validatorsTextTemplates } from 'shared/components/common/Validator/ValidatorsTextTemplates';

const minValueOptions = ['0', '1'];
const maxValueOptions = ['2', '3', '4', '5', '6', '7', '8', '9', '10'];

const ScaleAnswer = ({
  question,
  setUpdateState,
}: {
  question?: PollQuestionType;
  setUpdateState: (e: boolean) => void;
}) => {
  const { organizationId, pollId } = useParams<{ organizationId?: string; pollId?: string }>();
  const dispatch = useDispatch();
  const history = useHistory();

  const validationSchema = Yup.object().shape({
    question: Yup.string()
      .trim()
      .max(200, validatorsTextTemplates.maxLength_200('Вопрос'))
      .required('Поле обязательно для заполнения'),
    min_name: Yup.string().trim().max(200, validatorsTextTemplates.maxLength_200('Подпись мин. значения')),
    max_name: Yup.string().trim().max(200, validatorsTextTemplates.maxLength_200('Подпись макс. значения')),
  });

  return (
    <Formik
      enableReinitialize
      initialValues={{
        question: question?.question || '',
        image: question?.image || null,
        min_value: question?.settings?.min_value || '0',
        max_value: question?.settings?.max_value || '10',
        min_name: question?.settings?.min_name || '',
        max_name: question?.settings?.max_name || '',
      }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting, setStatus, resetForm }): Promise<void> => {
        try {
          if (!!question?.id) {
            let sendValues: any = {
              question: values.question,
              image: values.image?.uuid,

              settings: {
                min_value: values.min_value,
                max_value: values.max_value,
                min_name: values.min_name,
                max_name: values.max_name,
              },
            };
            if (!values.min_name) {
              delete sendValues.settings['min_name'];
            }
            if (!values.max_name) {
              delete sendValues.settings['max_name'];
            }
            await dispatch(updateQuestionAction(sendValues, +organizationId, +pollId, question.id));
            setUpdateState(true);
            toast('Вопрос обновлен!');
            resetForm({});
          } else {
            let sendValues: any = {
              question: values.question,
              image: values.image?.uuid,
              type: 3,
              settings: {
                min_value: values.min_value,
                max_value: values.max_value,
                min_name: values.min_name,
                max_name: values.max_name,
              },
            };
            if (!values.min_name) {
              delete sendValues.settings['min_name'];
            }
            if (!values.max_name) {
              delete sendValues.settings['max_name'];
            }
            const newQuestionId = await dispatch(createQuestionAction(sendValues, +organizationId, +pollId));

            history.push(
              routes.polls.getCreatingQuestion(+organizationId, newQuestionId, +pollId, QuestionsType.scale)
            );
            toast('Вопрос создан!');
          }

          setStatus({ success: true });
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
        setFieldValue,
        isValid,
        dirty,
        handleReset,
        values,
      }): JSX.Element => (
        <Form onSubmit={handleSubmit}>
          <QuestionsDescription
            handleBlur={handleBlur}
            handleChange={handleChange}
            setFieldValue={setFieldValue}
            touched={touched}
            errors={errors}
            question={values.question}
            questionId={question?.id}
            questionType={'Шкала'}
            url={values.image?.url}
          />

          <Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: '10px',
                marginTop: '30px',
              }}
            >
              <Autocomplete
                sx={{
                  width: '200px',
                }}
                getOptionLabel={(option) => option}
                onBlur={handleBlur}
                onChange={(e, option) => {
                  setFieldValue('min_value', option || '');
                }}
                options={minValueOptions}
                disableClearable
                value={values.min_value}
                renderInput={(params): JSX.Element => (
                  <TextField
                    error={Boolean(touched.min_value && errors.min_value)}
                    helperText={touched.min_value && errors.min_value}
                    label="Минимальное значение"
                    name="min_value"
                    variant="outlined"
                    {...params}
                  />
                )}
              />
              <Autocomplete
                sx={{
                  width: '200px',
                }}
                getOptionLabel={(option) => option}
                onBlur={handleBlur}
                onChange={(e, option) => {
                  setFieldValue('max_value', option || '');
                }}
                options={maxValueOptions}
                disableClearable
                value={values.max_value}
                renderInput={(params): JSX.Element => (
                  <TextField
                    error={Boolean(touched.max_value && errors.max_value)}
                    helperText={touched.max_value && errors.max_value}
                    label="Максимальное значение"
                    name="max_value"
                    variant="outlined"
                    {...params}
                  />
                )}
              />
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                mt: '20px',
              }}
            >
              <TextField
                label="Подпись мин. значения (необязательно)"
                name={'min_name'}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.min_name}
                variant="outlined"
                placeholder="Подпись"
                sx={{
                  maxWidth: '350px',
                  width: '100%',
                }}
                error={Boolean(touched.min_name && errors.min_name)}
                helperText={touched.min_name && errors.min_name}
              />

              <TextField
                label="Подпись макс. значения (необязательно)"
                name={'max_name'}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.max_name}
                variant="outlined"
                placeholder="Подпись"
                sx={{
                  maxWidth: '350px',
                  width: '100%',
                  mt: 3,
                }}
                error={Boolean(touched.max_name && errors.max_name)}
                helperText={touched.max_name && errors.max_name}
              />
            </Box>

            <Divider
              sx={{
                mt: 3,
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button color="light" disabled={!dirty} onClick={handleReset}>
                ОТМЕНИТЬ
              </Button>
              <Button disabled={isSubmitting || !isValid || !dirty} type="submit">
                {!!question?.id ? 'Обновить вопрос' : 'Добавить вопрос'}
              </Button>
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default ScaleAnswer;
