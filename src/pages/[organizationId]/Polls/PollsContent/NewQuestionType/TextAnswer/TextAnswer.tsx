import * as Yup from 'yup';

import { Box, Divider } from '@material-ui/core';
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

const validationSchema = Yup.object().shape({
  question: Yup.string()
    .trim()
    .max(200, validatorsTextTemplates.maxLength_200('Вопрос'))
    .required('Поле обязательно для заполнения'),
});

const TextAnswer = ({
  question,
  setUpdateState,
}: {
  question?: PollQuestionType;
  setUpdateState: (e: boolean) => void;
}) => {
  const { organizationId, pollId } = useParams<{ organizationId?: string; pollId?: string }>();
  const dispatch = useDispatch();
  const history = useHistory();
  return (
    <Formik
      enableReinitialize
      initialValues={{
        question: question?.question || '',
        image: question?.image || null,
      }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting, setStatus, resetForm }): Promise<void> => {
        try {
          if (!!question?.id) {
            let sendValues: any = {
              question: values.question,
              image: values.image?.uuid,
            };
            await dispatch(updateQuestionAction(sendValues, +organizationId, +pollId, question.id));
            setUpdateState(true);
            toast('Вопрос обновлен!');
            resetForm({});
          } else {
            let sendValues: any = {
              question: values.question,
              image: values.image?.uuid,
              type: 2,
            };
            const newQuestionId = await dispatch(createQuestionAction(sendValues, +organizationId, +pollId));

            history.push(
              routes.polls.getCreatingQuestion(+organizationId, newQuestionId, +pollId, QuestionsType.textAnswer)
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
            questionType={'Текстовый ответ'}
            url={values.image?.url}
          />
          <Box>
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

export default TextAnswer;
