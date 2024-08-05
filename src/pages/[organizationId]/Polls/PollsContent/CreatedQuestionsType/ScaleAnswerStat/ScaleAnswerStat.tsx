import { Box, Typography } from '@material-ui/core';
import sanitizeHtml from 'sanitize-html';
import { allowedTagsSynitizer } from 'shared/constants/allowedTagsSynitizer';
import styles from './../CreatedQuestionType.module.scss';
import { Icon } from 'shared/components/common/Icon/Icon';

const ScaleAnswerStat = ({ question, setUpdateState }: { question?: any; setUpdateState: (e: boolean) => void }) => {
  if (!question) {
    return null;
  }

  return (
    <Box>
      <Typography variant="h5">Вопрос - {question.question}</Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mt: 1,
          mb: 3,
        }}
      >
        <Icon iconName="infoCircle" />
        <Typography variant="caption" sx={{ ml: 1 }}>
          Тип вопроса - Шкала
        </Typography>
      </Box>
      {(!!question.description || !!question.image?.url) && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '20px',
            mb: 3,
          }}
        >
          {!!question.description && (
            <Typography
              mb={3}
              dangerouslySetInnerHTML={{
                __html:
                  sanitizeHtml(question.description, {
                    allowedTags: allowedTagsSynitizer,
                  }) ||
                  sanitizeHtml('<p>Описания пока нет</p>', {
                    allowedTags: allowedTagsSynitizer,
                  }),
              }}
            />
          )}

          {!!question.image?.url && (
            <Box
              component="img"
              sx={{
                maxWidth: '440px',
                maxHeight: '230px',
                objectFit: 'cover',
                width: '100%',
                borderRadius: '15px',
              }}
              alt={question.question}
              src={question.image?.url}
            />
          )}
        </Box>
      )}

      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '20px',
          mb: 2,

          maxWidth: '700px',
          width: '100%',
        }}
      >
        <Typography variant="h6">Варианты ответов:</Typography>
        <Typography variant="h6">Голосов:</Typography>
      </Box>
      {!!Object.values(question.answers).length &&
        Object.values(question.answers).map((answer: number, index) => {
          return (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '20px',
                mb: 2,
                mt: 2,
                maxWidth: '700px',
                width: '100%',
                paddingRight: '20px',
              }}
            >
              <Typography variant="subtitle1">{`${index + Number(question.settings?.min_value)}`}</Typography>
              <div className={styles.countAnswerWrapper}>
                <span className={styles.countAnswer}>{answer}</span>
              </div>
            </Box>
          );
        })}
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
        <Typography variant="h6">Всего человек ответило: </Typography>
        <div className={styles.countAnswerWrapper}>
          <span className={styles.countAnswer}>{question.users_answered || 0}</span>
        </div>
      </Box>
    </Box>
  );
};

export default ScaleAnswerStat;
