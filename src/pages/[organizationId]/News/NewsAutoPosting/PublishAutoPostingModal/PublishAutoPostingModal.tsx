import { Box, Checkbox, FormControlLabel, Typography } from '@material-ui/core';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { publishAutoPostingNews } from 'services/api/news';
import { Button } from 'shared/components/common/Button/Button';
import formatServerError from 'shared/utils/formatServerError';
import { LightweightNews, NewsAutoPost } from 'types/news';
import { useSelector } from '../../../../../redux';

const PublishAutoPostingModal = ({
  organizationId,
  newsId,
  onClose,
}: {
  organizationId: string;
  newsId?: number;
  onClose: () => void;
}) => {
  const [channelsId, setChannelsId] = useState<number[]>([]);
  const allNews: LightweightNews[] = useSelector(({ news }) =>
    news.data?.filter(({ published_at }: LightweightNews) => published_at)
  );
  const autoPostingTelegrams: NewsAutoPost[] = useSelector(({ news }) => news.autoPostingTelegrams);

  const publishNewsInTelegrams = async () => {
    try {
      await publishAutoPostingNews(organizationId, newsId || allNews[0].id, channelsId);
      onClose();
      toast('Новость успешно опубликована!');
    } catch (e) {
      toast.error(formatServerError(e));
    }
  };

  return (
    <Box p={1}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Если вы хотите продублировать новость в телеграмм канале выберите их!
      </Typography>
      {autoPostingTelegrams.map((channel) => {
        return (
          <FormControlLabel
            control={<Checkbox />}
            sx={{ whiteSpace: 'nowrap' }}
            name={channel.name + channel.id}
            key={channel.id}
            checked={channelsId.includes(channel.id)}
            onChange={() => {
              if (channelsId.includes(channel.id)) {
                const filterChannelsId = channelsId.filter((id) => id !== channel.id);
                setChannelsId(filterChannelsId);
              } else {
                const copyChannelsId = [...channelsId];
                copyChannelsId.push(channel.id);
                setChannelsId(copyChannelsId);
              }
            }}
            label={channel.name}
          />
        );
      })}
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        <Button onClick={publishNewsInTelegrams} disabled={!channelsId.length}>
          Опубликовать
        </Button>
      </Box>
    </Box>
  );
};

export default PublishAutoPostingModal;
