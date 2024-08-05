import { FC, JSXElementConstructor, ReactElement } from 'react';
import Chip from '../Chip';
import MUICancel from '@material-ui/icons/Cancel';
import { SxProps } from '@material-ui/system';
import { SvgIconTypeMap, Theme } from '@material-ui/core';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';

interface IChipButtonAdd {
  label: string;
  onClick: () => void;
  customIcon?: ReactElement;
  sx?: SxProps<Theme>;
}

const addButtonIcon = (
  <MUICancel
    sx={{
      transform: 'rotate(45deg)',
    }}
    color="primary"
  />
);

const ChipButtonAdd: FC<IChipButtonAdd> = ({ label, onClick, customIcon = addButtonIcon, sx }) => (
  <Chip label={label} variant="outlined" onClick={onClick} onDelete={onClick} deleteIcon={customIcon} sx={sx} />
);

export default ChipButtonAdd;
