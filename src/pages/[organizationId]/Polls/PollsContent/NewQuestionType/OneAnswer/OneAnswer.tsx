import * as Yup from 'yup';
import { useState } from 'react';

import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@material-ui/core';
import { FieldArray, Form, Formik } from 'formik';
import { Button } from 'shared/components/common/Button/Button';
import { toast } from 'react-toastify';
import formatServerError from 'shared/utils/formatServerError';
import Tooltip from 'shared/components/common/Tooltip/Tooltip';
import { Icon } from 'shared/components/common/Icon/Icon';
import { useHistory, useParams } from 'react-router';
import { createQuestionAction, updateQuestionAction } from 'redux/slices/polls';
import { routes } from 'Routes';
import { PollQuestionType, QuestionsType } from 'shared/interfaces/polls';

import { useDispatch } from '../../../../../../redux';
import TrashIcon from '../../../../../../lib/material-kit/icons/Trash';
import QuestionsDescription from '../QuestionsDescription/QuestionsDescription';
import { validatorsTextTemplates } from 'shared/components/common/Validator/ValidatorsTextTemplates';

const validationSchema = Yup.object().shape({
  question: Yup.string()
    .trim()
    .required('Поле обязательно для заполнения')
    .max(200, validatorsTextTemplates.maxLength_200('Вопрос')),
  answers: Yup.array()
    .min(1)
    .of(
      Yup.object().shape({
        answer: Yup.string()
          .trim()
          .max(200, validatorsTextTemplates.maxLength_200('Вариант ответа'))
          .required('Поле обязательно для заполнения'),
      })
    )
    .required(),
  rightAnswer: Yup.number().nullable(),
});

const OneAnswer = ({
  question,
  setUpdateState,
}: {
  question?: PollQuestionType;
  setUpdateState: (e: boolean) => void;
}) => {
  const { organizationId, pollId } = useParams<{ organizationId?: string; pollId?: string }>();
  const dispatch = useDispatch();
  const history = useHistory();

  const [quiz, setQuiz] = useState<boolean>(
    !!question?.settings?.right_answer || question?.settings?.right_answer === 0 || false
  );

  return (
    <Formik
      enableReinitialize
      initialValues={{
        question: question?.question || '',
        answers: question?.settings?.answers?.map((answer) => {
          return { answer: answer };
        }) || [{ answer: '' }, { answer: '' }],
        rightAnswer: question?.settings?.right_answer ?? null,
        image: question?.image || null,
      }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting, setStatus, resetForm }): Promise<void> => {
        try {
          if (!!question?.id) {
            let sendValues: any = {
              question: values.question,
              image: values.image?.uuid,

              settings: {
                answers: values.answers.map((answer) => answer.answer),
                right_answer: values.rightAnswer,
              },
            };
            await dispatch(updateQuestionAction(sendValues, +organizationId, +pollId, question.id));
            setUpdateState(true);
            toast('Вопрос обновлен!');
            resetForm({});
          } else {
            let sendValues: any = {
              question: values.question,
              image: values.image?.uuid,
              type: 0,
              settings: {
                answers: values.answers.map((answer) => answer.answer),
                right_answer: values.rightAnswer,
              },
            };
            const newQuestionId = await dispatch(createQuestionAction(sendValues, +organizationId, +pollId));

            history.push(
              routes.polls.getCreatingQuestion(+organizationId, newQuestionId, +pollId, QuestionsType.oneAnswer)
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
            questionType={'Один вариант ответа'}
            url={values.image?.url}
          />

          <Typography variant="h5" mb={2} mt={5} sx={{ textTransform: 'uppercase' }}>
            Варианты ответов:
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={quiz}
                  onChange={(e) => {
                    if (!e.target.checked) {
                      setFieldValue('rightAnswer', null);
                    } else {
                      setFieldValue('rightAnswer', 0);
                    }
                    setQuiz(!quiz);
                  }}
                />
              }
              label="Режим викторины"
            />
          </FormGroup>
          {quiz && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mt: 3,
              }}
            >
              <Icon iconName="infoCircle" />
              <Typography variant="caption" sx={{ ml: 1 }}>
                Поставьте галочку напротив правильного варианта ответа
              </Typography>
            </Box>
          )}

          <Box sx={{ pt: 3 }}>
            <Grid container spacing={3} mb={5}>
              <FieldArray name="answers">
                {({ push, remove }) => (
                  <Grid item md={12} xs={12} gap={4} display="flex" flexDirection="column">
                    {values.answers.map((answer, index) => {
                      return (
                        <Box>
                          <Box
                            key={index}
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                            }}
                          >
                            {quiz && (
                              <FormGroup sx={{ mt: 1 }}>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={index === values.rightAnswer}
                                      onChange={(e) => {
                                        setFieldValue('rightAnswer', index);
                                      }}
                                    />
                                  }
                                  label=""
                                />
                              </FormGroup>
                            )}
                            <TextField
                              sx={{ maxWidth: '750px', width: '100%', mr: 3 }}
                              error={Boolean(
                                touched &&
                                  touched.answers &&
                                  touched.answers[index] &&
                                  touched.answers[index]?.answer &&
                                  errors &&
                                  errors.answers &&
                                  //@ts-ignore
                                  errors.answers[index]?.answer
                              )}
                              helperText={
                                touched &&
                                touched.answers &&
                                touched.answers[index] &&
                                touched.answers[index]?.answer &&
                                errors &&
                                errors.answers &&
                                //@ts-ignore
                                errors.answers[index]?.answer
                              }
                              label={`Вариант ${index + 1}`}
                              name={`answers.${index}.answer`}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={answer.answer}
                              variant="outlined"
                              placeholder="Вариант ответа"
                            />
                            <Box
                              sx={{
                                width: '10%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                mt: 1,
                              }}
                            >
                              <>
                                <IconButton
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    remove(index);
                                  }}
                                  data-tip
                                  data-for={`deleteAnswer`}
                                  disabled={values.answers.length < 2}
                                >
                                  <TrashIcon fontSize="small" />
                                </IconButton>

                                <Tooltip title="Удалить вариант" id="deleteAnswer" />
                              </>
                            </Box>
                          </Box>
                          {index === values.answers.length - 1 && values.answers.length < 10 && (
                            <Button size="small" onClick={() => push({ answer: '' })}>
                              Добавить вариант
                            </Button>
                          )}
                          {index === values.answers.length - 1 && values.answers.length >= 10 && (
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mt: 3,
                              }}
                            >
                              <Icon iconName="infoCircle" />
                              <Typography variant="caption" sx={{ ml: 1 }}>
                                Максимум 10 вариантов ответа
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      );
                    })}
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
                {!!question?.id ? 'Обновить вопрос' : 'Добавить вопрос'}
              </Button>
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default OneAnswer;
