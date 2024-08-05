import { useQuery } from 'helpers/useQuery';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { PollQuestionType, QuestionsType } from 'shared/interfaces/polls';
import { getQuestion } from 'services/api/polls';
import { toast } from 'react-toastify';
import formatServerError from 'shared/utils/formatServerError';
import { Spinner } from 'shared/components/common/Spinner/Spinner';
import styles from './CreatedQuestionType.module.scss';
import OneAnswerStat from './OneAnswerStat/OneAnswerStat';
import MultiplyAnswerStat from './MultiplyAnswerStat/MultiplyAnswerStat';
import TextAnswerStat from './TextAnswerStat/TextAnswerStat';
import ScaleAnswerStat from './ScaleAnswerStat/ScaleAnswerStat';

const CreatedQuestionType = () => {
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
      return <OneAnswerStat question={question} setUpdateState={setUpdateState} />;
    case QuestionsType.multiplyAnswers:
      return <MultiplyAnswerStat question={question} setUpdateState={setUpdateState} />;
    case QuestionsType.textAnswer:
      return <TextAnswerStat question={question} setUpdateState={setUpdateState} />;
    case QuestionsType.scale:
      return <ScaleAnswerStat question={question} setUpdateState={setUpdateState} />;
    default:
      return <p>Ошибка, вернитесь назад</p>;
  }
};

export default CreatedQuestionType;
