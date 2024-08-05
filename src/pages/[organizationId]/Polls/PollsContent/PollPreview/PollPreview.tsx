import { Box, Typography } from '@material-ui/core';
import { useHistory, useParams } from 'react-router';
import { Button } from 'shared/components/common/Button/Button';
import { useDispatch, useSelector } from '../../../../../redux';
import sanitizeHtml from 'sanitize-html';
import { allowedTagsSynitizer } from 'shared/constants/allowedTagsSynitizer';
import { PollType } from 'shared/interfaces/polls';
import { format } from 'date-fns';
import ru from 'date-fns/locale/ru';
import { useContext, useEffect, useState } from 'react';
import { ModalContext } from 'context/Modal';
import PollPublishSettings from '../PollPublishSettings/PollPublishSettings';
import { routes } from 'Routes';
import { toast } from 'react-toastify';
import formatServerError from 'shared/utils/formatServerError';
import { getPoll } from 'services/api/polls';
import { closePollAction } from 'redux/slices/polls';
import styles from './../CreatedQuestionsType/CreatedQuestionType.module.scss';

const PollPreview = () => {
  const { organizationId, pollId } = useParams<{ organizationId?: string; pollId?: string }>();
  const pollState: PollType = useSelector(({ polls }) => polls?.polls.find((poll) => poll?.id === +pollId));
  const isHaveQuestions: boolean = useSelector(
    (state) => !!state.polls.questions?.find((questionData) => questionData?.pollId === +pollId)?.questions?.length
  );
  const dispatch = useDispatch();
  const modalContext = useContext(ModalContext);
  const history = useHistory();
  const [poll, setPoll] = useState(null);

  useEffect(() => {
    if (!pollState?.published && !pollState?.is_active) {
      setPoll(pollState);
    } else {
      (async () => {
        try {
          const response = await getPoll(+organizationId, +pollId);
          setPoll(response);
        } catch (e) {
          toast.error(formatServerError(e));
        }
      })();
    }
  }, [pollState, organizationId, pollId]);

  const publishClick = (id) => {
    modalContext.openModal(
      <PollPublishSettings
        close={() => {
          modalContext.closeModal();
        }}
        organizationId={+organizationId}
        pollId={+pollId}
      />
    );
  };

  const endPoll = async () => {
    try {
      await dispatch(closePollAction(+organizationId, +pollId));
      toast('Опрос завершен!');
      history.push(routes.polls.getCompletedPoll(organizationId, pollId));
    } catch (e) {
      toast.error(formatServerError(e));
    }
  };

  if (!poll) {
    return null;
  }

  return (
    <Box
      sx={{
        minHeight: '300px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Box>
        <Typography variant="h5" mb={2}>
          Опрос - {poll.name}
        </Typography>
        {(!!poll.date_start || !!poll.date_end) && (
          <Box
            mb={2}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              fontSize: '14px',
              gap: '10px',
              color: 'blue',
            }}
          >
            {!!poll.date_start && (
              <>
                <span>от</span>
                <time>{`${format(new Date(poll.date_start), 'dd MMM, yyyy', {
                  locale: ru,
                })}`}</time>
              </>
            )}
            {!!poll.date_end && !!poll.date_start && <> - </>}

            {!!poll.date_end && (
              <>
                <span>до</span>
                <time>{`${format(new Date(poll.date_end), 'dd MMM, yyyy', {
                  locale: ru,
                })}`}</time>
              </>
            )}
          </Box>
        )}

        <Typography
          mb={3}
          dangerouslySetInnerHTML={{
            __html:
              sanitizeHtml(poll.description, {
                allowedTags: allowedTagsSynitizer,
              }) ||
              sanitizeHtml('<p>Описания пока нет</p>', {
                allowedTags: allowedTagsSynitizer,
              }),
          }}
        ></Typography>
        {!!poll.images.length && (
          <Box
            component="img"
            sx={{
              maxWidth: '440px',
              maxHeight: '230px',
              objectFit: 'cover',
              width: '100%',
              borderRadius: '15px',
              mb: 2,
            }}
            alt="The house from the offer."
            src={poll.images[0]?.url}
          />
        )}
      </Box>
      {!!poll.published && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '20px',
            mb: 2,
            mt: 5,
            maxWidth: '700px',
            width: '100%',
            paddingRight: '20px',
          }}
        >
          <Typography variant="h6">Всего человек завершило опрос: </Typography>
          <div className={styles.countAnswerWrapper}>
            <span className={styles.countAnswer}>{poll.users_ended || 0}</span>
          </div>
        </Box>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        {!poll.published && !!isHaveQuestions && <Button onClick={publishClick}>Опубликовать</Button>}
        {!poll.published && !isHaveQuestions && (
          <Button
            onClick={() => {
              history.push(routes.polls.getNewQuestionPage(organizationId, pollId));
            }}
          >
            Добавить вопрос
          </Button>
        )}
        {!!poll.published && !!poll.is_active && <Button onClick={endPoll}>Завершить</Button>}
      </Box>
    </Box>
  );
};

export default PollPreview;
