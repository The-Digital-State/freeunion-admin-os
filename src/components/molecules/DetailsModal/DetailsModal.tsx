import { FC, ReactNode } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Box, CircularProgress } from '@material-ui/core';

const CloseIcon = require('../../../lib/material-kit/icons/X').default;

interface IDetailsModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  loading?: boolean;
  title?: string;
}

const DetailsModal: FC<IDetailsModalProps> = (props) => {
  const { open, onClose, children, loading = false, title = '' } = props;

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <DialogTitle id="form-dialog-title"> {title} </DialogTitle>
        <IconButton aria-label="close" onClick={onClose} sx={{ m: 1 }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent sx={{ p: 0 }}>
        {loading ? (
          <Box sx={{ p: 8, textAlign: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          children
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DetailsModal;
