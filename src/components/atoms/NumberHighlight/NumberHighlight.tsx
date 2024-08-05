import { FC } from 'react';
import Typography, { TypographyProps } from '@material-ui/core/Typography';

const defaultSx = {
  backgroundColor: 'primary.main',
  color: 'primary.contrastText',
  p: 0.5,
  minWidth: '2rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '15%',
};

const NumberHighlight: FC<TypographyProps> = ({ children, sx, ...rest }) => {
  defaultSx.borderRadius = String(children).length < 3 ? '50%' : '15%';

  const adjustedSx = { ...defaultSx, ...sx };

  return (
    <Typography variant="body1" sx={adjustedSx} {...rest}>
      {children}
    </Typography>
  );
};

export default NumberHighlight;
