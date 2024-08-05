import { useState } from 'react';
import { Box, TextField } from '@material-ui/core';
import Modal from '../../molecules/Modal';

export interface IRejectApplicationModal {
  open: boolean;
  setOpen: (value: boolean) => void;
  onSubmit: (request: number, comment: string) => void;
  submitting: boolean;
  disabled?: boolean;
  request: number;
}

const RejectApplicationModal = ({
  open,
  setOpen,
  onSubmit,
  request,
  submitting,
  disabled,
}: IRejectApplicationModal) => {
  const [comment, setComment] = useState<string>('');

  const _disabled = comment.trim().length < 30;

  return (
    <Modal
      title="Укажите причину отказа от сотрудничества"
      submitLabel="Отклонить"
      open={open}
      onClose={() => setOpen(false)}
      onSubmit={() => onSubmit(request, comment)}
      submitting={submitting}
      disabled={disabled || _disabled}
    >
      <Box sx={{ minWidth: 500, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ m: 1 }}>
          <TextField
            autoFocus
            multiline
            minRows="5"
            maxRows="10"
            margin="dense"
            id="name"
            label="Причина"
            fullWidth
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Не менее 30 символов"
          />
        </Box>
      </Box>
    </Modal>
  );
};

export default RejectApplicationModal;
