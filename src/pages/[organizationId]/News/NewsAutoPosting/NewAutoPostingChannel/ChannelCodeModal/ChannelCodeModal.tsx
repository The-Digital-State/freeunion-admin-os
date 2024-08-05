import { Box, Link, TextField, Typography } from '@material-ui/core';
import { toast } from 'react-toastify';
import { Button } from 'shared/components/common/Button/Button';

const ChannelCodeModal = ({ verifyCode }: { verifyCode: string }) => {
  return (
    <Box sx={{ maxWidth: '700px' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Скопируйте код ниже!
      </Typography>
      <Typography sx={{ mb: 2 }}>
        После отправьте команду верификации <strong>"/verify скопированный_код"</strong> в личном сообщении боту{' '}
        <Link href="https://t.me/freeunion_post_bot" target="_blank">
          @freeunion_post_bot
        </Link>{' '}
        от имени создателя канала, либо администратора с правом публикации сообщений.
      </Typography>
      <TextField value={verifyCode} fullWidth sx={{ mt: 1 }} />

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mt: 3,
        }}
      >
        <Button
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(verifyCode);
            } catch (e) {
              toast.error('Не получилось скопировать текст!');
            }
            toast('Код скопирован!');
          }}
        >
          Скопировать
        </Button>
      </Box>
    </Box>
  );
};
export default ChannelCodeModal;
