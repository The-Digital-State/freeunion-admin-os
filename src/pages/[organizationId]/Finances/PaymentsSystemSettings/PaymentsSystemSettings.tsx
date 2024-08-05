import { Box, Divider, Grid, Typography } from '@material-ui/core';
import { useParams } from 'react-router';
import { Button } from 'shared/components/common/Button/Button';

const PaymentsSystemSettings = () => {
  const { organizationId } = useParams<{ organizationId?: string }>();
  return (
    <Box>
      <Divider />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 3,
          pt: 3,
        }}
      >
        <Grid item md={5} sm={6} xs={12} display="flex" flexDirection="column" justifyContent="space-between">
          <Typography mb={2}>Если настроить API, ваши ссылки легче присоединятся к нашему сервису</Typography>
          <Box width={'220px'}>
            <Button to={`/${organizationId}/api`}>Настроить API</Button>
          </Box>
        </Grid>
        <Grid item md={6} sm={6} xs={12}>
          <Typography variant="caption">
            API (Application Programming Interface — программный интерфейс приложения, или интерфейс программирования
            приложений) — специальный протокол для взаимодействия компьютерных программ, который позволяет использовать
            функции одного приложения внутри другого. API- инструмент разработчиков, с его помощью программы общаются
            между собой, обмениваются необходимыми данными. <br /> Для работы финансового блока, вам необходимо передать
            API-ключи, чтобы настроить передачу данных из Freeunion.online в ту платежную систему, через которую вы
            планируете принимать платежи от пользователей. В платежную систему автоматически будет передаваться
            информация о платеже- сумма, валюта, периодичность оплаты. Из платежной системы будет приходить
            подтверждение оплаты. Все данные о плательщике и получателе остаются в платежной системе и защищены
            протоколом безопасности системы.
          </Typography>
        </Grid>
      </Box>
      <Divider />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 3,
          pt: 3,
        }}
      >
        <Grid item md={4} sm={6} xs={12}></Grid>
        <Grid item md={4} sm={6} xs={12}></Grid>
      </Box>
    </Box>
  );
};

export default PaymentsSystemSettings;
