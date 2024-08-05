import { useState } from 'react';
import { Box, TextField, Typography } from '@material-ui/core';
import Modal from '../../molecules/Modal';

export interface IAllUsersCreateListFromFiltersModal {
  open: boolean;
  setOpen: (value: boolean) => void;
  onSubmit: (name: string) => void;
  submitting: boolean;
  disabled?: boolean;
  filterStrings: string[];
}

const AllUsersCreateListFromFiltersModal = ({
  open,
  setOpen,
  onSubmit,
  submitting,
  disabled,
  filterStrings,
}: IAllUsersCreateListFromFiltersModal) => {
  const [listName, setListName] = useState('');

  const _disabled = !listName;

  return (
    <Modal
      title="Новый Список"
      submitLabel="Создать"
      open={open}
      onClose={() => setOpen(false)}
      onSubmit={() => onSubmit(listName)}
      submitting={submitting}
      disabled={disabled || _disabled}
    >
      <Box sx={{ minWidth: 500, display: 'flex', flexDirection: 'column' }}>
        {filterStrings.map((filterString) => (
          <Box key={filterString} sx={{ m: 1 }}>
            <Typography color="textPrimary" variant="subtitle2">
              {filterString}
            </Typography>
          </Box>
        ))}
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
      </Box>
    </Modal>
  );
};

export default AllUsersCreateListFromFiltersModal;
