import { useQuery } from 'helpers/useQuery';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { PollQuestionType, QuestionsType } from 'shared/interfaces/polls';
import MultipleAnswers from './MultipleAnswers/MultipleAnswers';
import OneAnswer from './OneAnswer/OneAnswer';
import TextAnswer from './TextAnswer/TextAnswer';
import { getQuestion } from 'services/api/polls';
import { toast } from 'react-toastify';
import formatServerError from 'shared/utils/formatServerError';
import { Spinner } from 'shared/components/common/Spinner/Spinner';
import styles from './NewQuestionType.module.scss';
import ScaleAnswer from './ScaleAnswer/ScaleAnswer';

const NewQuestionType = () => {
  let query = useQuery();
  const questionType = query.get('questionType');
  const { organizationId, pollId, quiestionId } =
    useParams<{ organizationId?: string; pollId?: string; quiestionId?: string }>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [question, setQuestion] = useState<PollQuestionType>(null);
  const [updateState, setUpdateState] = useState<boolean>(false);

  useEffect(() => {
    if (!!quiestionId) {
      setQuestion(null);
      (async () => {
        try {
          setIsLoading(true);
          const getingQuestion = await getQuestion(+organizationId, +pollId, +quiestionId);
          setQuestion(getingQuestion);
        } catch (e) {
          toast.error(formatServerError(e));
        } finally {
          setIsLoading(false);
          setUpdateState(false);
        }
      })();
    }
  }, [quiestionId, organizationId, pollId, updateState]);

  if (!!isLoading) {
    return (
      <div className={styles.wrapperSpinner}>
        <Spinner size={35} />
      </div>
    );
  }

  switch (questionType) {
    case QuestionsType.oneAnswer:
      return <OneAnswer question={question} setUpdateState={setUpdateState} />;
    case QuestionsType.multiplyAnswers:
      return <MultipleAnswers question={question} setUpdateState={setUpdateState} />;
    case QuestionsType.textAnswer:
      return <TextAnswer question={question} setUpdateState={setUpdateState} />;
    case QuestionsType.scale:
      return <ScaleAnswer question={question} setUpdateState={setUpdateState} />;
    default:
      return <p>Ошибка, вернитесь назад</p>;
  }
};

export default NewQuestionType;
