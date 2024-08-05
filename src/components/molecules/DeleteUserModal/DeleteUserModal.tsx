import { Box, TextField, Typography } from '@material-ui/core';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { IDeleteUser } from 'services/api/users';
import { Button } from 'shared/components/common/Button/Button';
import formatServerError from 'shared/utils/formatServerError';

interface IDeleteUserModal {
  userName: string;
  userId: number;
  close: () => void;
  updateData: () => void;
  deleteFetch: (props: IDeleteUser) => Promise<void>;
  organizationId: string;
}

const DeleteUserModal = ({ userName, userId, deleteFetch, close, updateData, organizationId }: IDeleteUserModal) => {
  const [comment, setComment] = useState<string>('');

  const deleteUser = async () => {
    try {
      deleteFetch({
        organizationId: +organizationId,
        userId: userId,
        comment: comment,
      });
      updateData();
      close();
      toast(`Пользователь ${userName} успешно удален`);
    } catch (e) {
      toast.error(formatServerError(e));
    }
  };

  return (
    <Box sx={{ maxWidth: '767px' }}>
      <Typography mb={3}>
        Вы действительно хотите удалить из объединения участника <strong>{userName}?</strong>
      </Typography>
      <Typography mb={1}>
        Опишите причины удаления участника. <strong>Поле обязательно для заполнения</strong>
      </Typography>
      <TextField multiline rows={3} fullWidth value={comment} onChange={(e) => setComment(e.target.value)} />
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Button onClick={deleteUser} disabled={comment.length < 1}>
          Удалить
        </Button>
      </Box>
    </Box>
  );
};

export default DeleteUserModal;
