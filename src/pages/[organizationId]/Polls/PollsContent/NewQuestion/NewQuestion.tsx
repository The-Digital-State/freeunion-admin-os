import { Box, Divider, FormControlLabel, Radio, RadioGroup, Typography } from '@material-ui/core';
import { useState } from 'react';
import { Button } from 'shared/components/common/Button/Button';
import { routes } from 'Routes';
import { useHistory, useParams } from 'react-router';
import { QuestionsType } from 'shared/interfaces/polls';

const createTypeQuestion: { name: string; type: QuestionsType; text: string }[] = [
  {
    name: 'Один вариант ответа',
    type: QuestionsType.oneAnswer,
    text: 'Из множества ответов, созданных вами, отвечающий может выбрать лишь один вариант',
  },
  {
    name: 'Несколько вариантов',
    type: QuestionsType.multiplyAnswers,
    text: 'Из множества ответов, созданных вами, отвечающий может выбрать несколько вариантов',
  },
  {
    name: 'Текстовый ответ',
    type: QuestionsType.textAnswer,
    text: 'Отвечающий должен сам ввести ответ на ваш вопрос в виде текста',
  },
  {
    name: 'Шкала',
    type: QuestionsType.scale,
    text: 'На настраиваемой вами шкале, отвечающий может поставить оценку от минимального до максимального значения',
  },
  // {
  //   name: 'Проценты',
  //   type: QuestionsType.percent,
  //   text: 'Вы можете добавить ссылку на любой сторонний сервис для быстрого доступа пользователей к материалам или ресурсам.',
  // },
];

const NewQuestion = () => {
  const { organizationId, pollId } = useParams<{ organizationId?: string; pollId?: string }>();
  const history = useHistory();
  const [textHover, setTextHover] = useState(createTypeQuestion[0]);
  const [chooseQuestionType, setChooseQuestionType] = useState(0);

  const hoverEffect = (index: number) => {
    setTextHover(createTypeQuestion[index]);
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
          }}
        >
          <Typography variant="h4" mb={3}>
            Добавление вопроса
          </Typography>
          <Divider />
          <Box>
            <Typography variant="h6" mb={1} mt={3}>
              Тип вопроса:
            </Typography>
            <RadioGroup name="articleType" sx={{ flexDirection: 'row', width: '100%', mb: 1 }}>
              {createTypeQuestion.map((typeArticle, index) => {
                return (
                  <FormControlLabel
                    control={<Radio color="primary" sx={{ ml: 1 }} />}
                    checked={chooseQuestionType === index}
                    key={index}
                    onMouseOver={() => hoverEffect(index)}
                    onMouseOut={() => hoverEffect(chooseQuestionType)}
                    onChange={() => {
                      setChooseQuestionType(index);
                    }}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography color="textPrimary" variant="body1" mr={1}>
                          {typeArticle.name}
                        </Typography>
                      </Box>
                    }
                    value={index}
                  />
                );
              })}
            </RadioGroup>
          </Box>
          <Box width="100%" mb={3}>
            <Typography>{textHover.text}</Typography>
          </Box>
          <Divider />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              color="light"
              onClick={() => {
                history.push(routes.polls.getCreatingPoll(organizationId, pollId));
              }}
            >
              Отмена
            </Button>
            <Button
              onClick={() => {
                history.push(
                  routes.polls.getNewQuestionType(organizationId, pollId, createTypeQuestion[chooseQuestionType].type)
                );
              }}
            >
              Далее
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default NewQuestion;
