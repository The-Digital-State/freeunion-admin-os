import { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import { Box, Typography } from '@material-ui/core';
import { Button } from 'shared/components/common/Button/Button';

import { getAbuse } from 'services/api/news';
import { NewsAbuses } from 'types/news';

import { abuseTypeText } from '../NewsAbusesTable/NewsAbusesTable';
import { toast } from 'react-toastify';
import formatServerError from 'shared/utils/formatServerError';

function NewsAbuse() {
  const { organizationId, abuseId } = useParams<{ organizationId?: string; abuseId?: string }>();
  const [abuse, setAbuse] = useState<NewsAbuses>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const history = useHistory();

  useEffect(() => {
    if (organizationId && abuseId) {
      (async () => {
        try {
          setIsLoading(true);
          const response = await getAbuse(organizationId, abuseId);
          setAbuse(response);
        } catch (e) {
          toast.error(formatServerError(e));
          console.log(e);
        }
        setIsLoading(false);
      })();
    }
  }, [organizationId, abuseId]);

  if (!abuse && !isLoading) {
    return (
      <Box
        sx={{
          background: '#FFFFFF',
          position: 'relative',
          minHeight: '100vh',

          pt: 10,
        }}
      >
        <Typography variant="h5" sx={{ mb: 5, textAlign: 'center' }}>
          Произошла ошибка загрузки сообщения
        </Typography>
        <Box sx={{ margin: '0 auto', width: 'fit-content', mt: 3 }}>
          <Button to={`/${organizationId}/news/abuse`}>Назад</Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        background: '#FFFFFF',
        position: 'relative',
        minHeight: '100vh',
        pt: 10,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          maxWidth: '1000px',
          margin: '0 auto',
          padding: '0 40px',
        }}
      >
        <Typography variant="h5" sx={{ mb: 5, textAlign: 'center' }}>
          {abuseTypeText[abuse?.type_id - 1]}
        </Typography>
        <Typography variant="subtitle1" sx={{ fontSize: 20, textAlign: 'left' }}>
          {abuse?.message}
        </Typography>
        <Box sx={{ width: '100%', mt: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Button onClick={() => history.push(`/${organizationId}/news/abuse`)}>Назад</Button>
          <Button onClick={() => history.push(`/${organizationId}/news/editor/${abuse?.news.id}`)}>К новости</Button>
        </Box>
      </Box>
    </Box>
  );
}

export default NewsAbuse;
