import { Box, Divider, FormControlLabel, Radio, RadioGroup, Typography } from '@material-ui/core';
import { useState } from 'react';
import { Button } from 'shared/components/common/Button/Button';
import { routes } from 'Routes';
import { useParams } from 'react-router';

const createTypeArticles: { name: string; rotate?: number; text: string }[] = [
  {
    name: 'Статья',
    text: 'Выбрав статью, вы можете добавить любые материалы: текст, фото, ссылку на видео, аудио, встренные ссылки на открытые источники. Для вашего удобства мы добавили  встроенные проигрыватели для YouTube и TikTok. Статья может быть видна всему Интернету, если в настройках публикации вы укажете "Видно всем".',
  },
  {
    name: 'Ссылка',
    rotate: 135,
    text: 'Вы можете добавить ссылку на любой сторонний сервис для быстрого доступа пользователей к материалам или ресурсам.',
  },
];

const Material = () => {
  const { organizationId, sectionId } = useParams<{ organizationId?: string; sectionId?: string }>();
  const [textHover, setTextHover] = useState(createTypeArticles[0]);
  const [chooseArticleType, setChooseArticleType] = useState(0);

  const hoverEffect = (index: number) => {
    setTextHover(createTypeArticles[index]);
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
            Создание публикации
          </Typography>
          <Divider />
          <Box>
            <Typography variant="h6" mb={1} mt={3}>
              Тип публикации:
            </Typography>
            <RadioGroup name="articleType" sx={{ flexDirection: 'row', width: '100%', mb: 1 }}>
              {createTypeArticles.map((typeArticle, index) => {
                return (
                  <FormControlLabel
                    control={<Radio color="primary" sx={{ ml: 1 }} />}
                    checked={chooseArticleType === index}
                    key={index}
                    onMouseOver={() => hoverEffect(index)}
                    onMouseOut={() => hoverEffect(chooseArticleType)}
                    onChange={() => {
                      setChooseArticleType(index);
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

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <Button
              to={
                !!chooseArticleType
                  ? routes.kbase.getMaterialLink({ organizationId: organizationId, sectionId: sectionId })
                  : routes.kbase.getLinkEditorMaterials({ organizationId: organizationId, sectionId: sectionId })
              }
            >
              Создать
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Material;
