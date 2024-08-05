import { FC } from 'react';
import MUIChip, { ChipProps } from '@material-ui/core/Chip';

const defaultSx = {
  minWidth: 140,
  height: 50,
  borderRadius: 50,
  justifyContent: 'space-between',
  fontSize: '1rem',
  lineHeight: '1.5rem',
  p: '.5rem',
};

const Chip: FC<ChipProps> = ({ sx, ...rest }) => <MUIChip sx={{ ...defaultSx, ...sx }} {...rest} />;

export default Chip;
