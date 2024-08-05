import { FC, ReactNode } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  IconButton,
  Box,
} from '@material-ui/core';
import { Button } from 'shared/components/common/Button/Button';

const CloseIcon = require('../../../lib/material-kit/icons/X').default;

interface IModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  children: ReactNode;
  submitting?: boolean;
  disabled?: boolean;
  title?: string;
  cancelLabel?: string;
  submitLabel?: string;
  classes?: any;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
}

const Modal: FC<IModalProps> = (props) => {
  const {
    open,
    onClose,
    onSubmit,
    children,
    submitting = false,
    disabled = false,
    title = '',
    cancelLabel = 'Отмена',
    submitLabel = 'ОК',
    classes,
    maxWidth,
  } = props;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="form-dialog-title"
      classes={classes}
      maxWidth={maxWidth || false}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {title && <DialogTitle id="form-dialog-title"> {title} </DialogTitle>}
      </Box>
      <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', top: '0px', right: '20px' }}>
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ padding: '40px 20px 20px 20px' }}>{children}</DialogContent>
      {onSubmit && (
        <DialogActions sx={{ m: 1, display: 'flex', alignItems: 'stretch' }}>
          <Button onClick={onClose}>{cancelLabel}</Button>
          {submitting ? (
            <Button color="light">
              <CircularProgress size="16px" />
            </Button>
          ) : (
            <Button onClick={onSubmit} disabled={disabled}>
              {submitLabel}
            </Button>
          )}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default Modal;
