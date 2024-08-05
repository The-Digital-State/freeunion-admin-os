import { Box, Divider, Link, List, ListItem, Typography } from '@material-ui/core';
import NewsPageTabLayout from 'components/layout/NewsPageTabLayout';
import { useState } from 'react';
import { useParams } from 'react-router';
import { Button } from 'shared/components/common/Button/Button';
import ChannelsAutoPosting from './ChannelsAutoPosting/ChannelsAutoPosting';
import NewAutoPostingChannel from './NewAutoPostingChannel/NewAutoPostingChannel';

const instructionsText = [
  <Typography variant="inherit">
    1. Зайдите в свой телеграм канал и перейдите в <strong>“Настройки управления каналом”.</strong>
  </Typography>,
  <Typography variant="inherit">
    2. Выберите <strong>“Администраторы”</strong> и нажмите <strong>“Добавить администратора”.</strong>
  </Typography>,
  <Typography variant="inherit">
    3. Добавьте <strong>@freeunion_post_bot</strong> в администраторы канала.
  </Typography>,
  <Typography variant="inherit">
    4. Обязательно разрешить боту <strong>«post messenges».</strong>
  </Typography>,
  <Typography variant="inherit">
    5. В <strong>“Правах администратора”</strong> установите разрешение <strong>“Публикация сообщений”</strong>. Нажмите{' '}
    <strong>“Сохранить”.</strong>
  </Typography>,
  '6. Добавьте ссылку на тг канал и дайте название своему каналу в полях снизу.',
  <Typography variant="inherit">
    7. Нажмите конопку <strong>“Добавить канал”.</strong>
  </Typography>,
  '8. Получите код подтверждения в модальном окне и скопируйте его.',
  <Typography variant="inherit">
    9. Отправьте команду верификации <strong>"/verify полученный_код"</strong> в личном сообщении боту{' '}
    <Link href="https://t.me/freeunion_post_bot" target="_blank">
      @freeunion_post_bot
    </Link>{' '}
    от имени создателя канала, либо администратора с правом публикации сообщений.
  </Typography>,
];

const NewsAutoPosting = () => {
  const { organizationId } = useParams<{ organizationId?: string }>();
  const [addNewChannel, setAddNewChannel] = useState<boolean>(false);

  return (
    <NewsPageTabLayout>
      <Box sx={{ p: 3 }}>
        <Typography sx={{ mb: 2 }}>
          При создании новости в нашем редакторе, вы можете продублировать её во всех телеграм каналах вашего
          объединения.
        </Typography>
        <Typography variant="h6">Добавление телеграмм канала:</Typography>
        <List sx={{ mb: 2 }}>
          {instructionsText.map((instruction, index) => {
            return <ListItem>{instruction}</ListItem>;
          })}
        </List>
      </Box>
      <ChannelsAutoPosting organizationId={organizationId} />
      {addNewChannel && <NewAutoPostingChannel organizationId={organizationId} setAddNewChannel={setAddNewChannel} />}

      <Divider />
      <Box display="flex" alignItems="center" justifyContent="flex-end" padding="10px 30px 10px 30px" gap={3}>
        {addNewChannel && (
          <Button onClick={() => setAddNewChannel(false)} color="light">
            Отмена
          </Button>
        )}
        <Button onClick={() => setAddNewChannel(true)} disabled={addNewChannel}>
          Добавить канал
        </Button>
      </Box>
    </NewsPageTabLayout>
  );
};

export default NewsAutoPosting;
