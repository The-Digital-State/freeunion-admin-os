import { FC, ReactNode } from 'react';
import { Dialog, DialogActions, DialogContent, Box, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

interface IModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  actions?: ReactNode;
}

const Modal: FC<IModalProps> = ({ open, onClose, children, actions }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="form-dialog-title"
      maxWidth="lg"
      PaperProps={{ style: { overflowY: 'visible' } }}
    >
      <DialogContent dividers={true}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            zIndex: 110,
            position: 'absolute',
            top: '-25px',
            right: '-25px',
            color: '#000',
            '&:hover': {
              backgroundColor: '#fff',
            },
            backgroundColor: '#fff',
          }}
        >
          <CloseIcon />
        </IconButton>
        <Box
          sx={{
            color: 'red',
            display: 'flex',
            flexDirection: 'column',
            p: 3,
            width: '744px',
            background: 'rgb(245, 246, 250)',
          }}
        >
          {children}
        </Box>
      </DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
};

export default Modal;
