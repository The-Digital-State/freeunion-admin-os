import type { FC } from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import type { DropzoneOptions } from 'react-dropzone';
import { Box, Typography } from '@material-ui/core';
import { toast } from 'react-toastify';
import { allowedSizeFiles } from 'shared/constants/allowedFileSize';

interface ImageDropzoneProps extends DropzoneOptions {
  value?: string;
  label?: string;
  dropzoneInfo: string;
  accept?: string;
  fullWidthImg?: boolean;
  width?: number;
  height?: number;
}

const ImageDropzone: FC<ImageDropzoneProps> = ({
  value,
  width,
  height,
  label,
  onDrop,
  dropzoneInfo,
  accept,
  fullWidthImg,
}) => {
  const validation = <T extends File>(file: T) => {
    if (allowedSizeFiles < file.size) {
      toast.error(allowedSizeFiles);
      return { message: 'Ошибка', code: '404' };
    } else {
      return;
    }
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: ['.jpeg', '.png', '.jpg'],
    maxFiles: 1,
    validator: validation,
    onDrop,
  });

  return (
    <Box
      sx={{
        position: 'relative',
        alignItems: 'center',
        border: 1,
        borderRadius: 2,
        borderColor: 'rgba(0, 0, 0, 0.23)',
        justifyContent: 'center',
        outline: 'none',
        p: fullWidthImg && value ? 0 : 3,
        ...(isDragActive && {
          backgroundColor: 'action.active',
          opacity: 0.5,
        }),
        '&:hover': {
          borderColor: 'text.primary',
          cursor: 'pointer',
        },
      }}
      {...getRootProps()}
    >
      <Box
        sx={{
          backgroundColor: '#fff',
          color: 'action.active',
          fontWeight: 400,
          fontSize: '1rem',
          lineHeight: '1.4375em',
          p: '0 4px',
          transformOrigin: 'top left',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: 'calc(133% - 24px)',
          position: 'absolute',
          left: 0,
          top: 0,
          transform: 'translate(14px, -9px) scale(0.75)',
          transition: `color 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms,
          transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms,
          max-width 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms`,
          zIndex: 1,
          pointerEvents: 'none',
        }}
      >
        {label}
      </Box>
      {onDrop && <input {...getInputProps()} />}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 3,
          justifyContent: 'flex-start',
          height: height,
          width: width,
        }}
      >
        {fullWidthImg && value ? (
          <img src={value} style={{ borderRadius: 32, height, width }} alt="" />
        ) : (
          <>
            <Box
              sx={{
                minWidth: 120,
                minHeight: 120,
                border: '2px dashed',
                borderRadius: 2,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {value ? (
                <img src={value} style={{ width: 118, height: 118, borderRadius: 32 }} alt="" />
              ) : (
                <Typography sx={{ opacity: 0.2 }} variant="h5">
                  +
                </Typography>
              )}
            </Box>
            <Box>
              <Typography color="#000" variant="h6">
                Изображение
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Typography color="textPrimary" variant="body1">
                  {dropzoneInfo}
                </Typography>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

ImageDropzone.propTypes = {
  fullWidthImg: PropTypes.bool,
  accept: PropTypes.string,
  value: PropTypes.string,
  label: PropTypes.string,
  dropzoneInfo: PropTypes.string,
  onDrop: PropTypes.func,
};

export default ImageDropzone;
