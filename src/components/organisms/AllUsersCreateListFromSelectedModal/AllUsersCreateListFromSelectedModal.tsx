import { useState } from 'react';
import { Box, TextField, Typography } from '@material-ui/core';
import { Button } from 'shared/components/common/Button/Button';

export interface IAllUsersCreateListFromSelectedModal {
  onSubmit: (name: string) => void;
  submitting: boolean;
  disabled?: boolean;
  selection: any;
}

const AllUsersCreateListFromSelectedModal = ({
  onSubmit,
  submitting,
  disabled,
  selection,
}: IAllUsersCreateListFromSelectedModal) => {
  const [listName, setListName] = useState('');

  const _disabled = !listName;

  const { selected, isAllSelected } = selection;

  return (
    // <Modal
    //   title="Новый Список"
    //   submitLabel="Создать"
    //   open={open}
    //   onClose={() => setOpen(false)}
    //   onSubmit={() => onSubmit(listName)}
    //   submitting={submitting}
    //   disabled={disabled || _disabled}
    // >
    <Box sx={{ minWidth: 500, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ m: 1 }}>
        <Typography color="textPrimary" variant="subtitle2">
          Создать список из выбранных пользователей ({isAllSelected ? 'все' : selected.length})
        </Typography>
      </Box>
      <Box sx={{ m: 1 }}>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Название списка"
          fullWidth
          value={listName}
          onChange={(e) => setListName(e.target.value)}
        />
      </Box>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Button onClick={() => onSubmit(listName)} disabled={_disabled}>
          Создать список
        </Button>
      </Box>
    </Box>
    // </Modal>
  );
};

export default AllUsersCreateListFromSelectedModal;
