import { useRef, useState } from 'react';
import type { FC } from 'react';
import { Button, Menu, MenuItem } from '@material-ui/core';
import ChevronDownIcon from '../../../lib/material-kit/icons/ChevronDown';

export type FilterOption = {
  id: any;
  name: string;
};

interface SelectProps {
  label: string;
  onChange?: (id: any) => void;
  // options: [{ id: any; name: string }];
  options: FilterOption[];
  value: any;
}

const Select: FC<SelectProps> = (props) => {
  const { label, onChange, options, value, ...other } = props;
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const [openMenu, setOpenMenu] = useState<boolean>(false);

  const selected = options.find((x) => x.id === value)?.name;

  const handleMenuOpen = (): void => {
    setOpenMenu(true);
  };

  const handleMenuClose = (): void => {
    setOpenMenu(false);
  };

  const handleClick = (id) => {
    setOpenMenu(false);
    onChange(id);
  };

  return (
    <>
      <Button
        color="inherit"
        endIcon={<ChevronDownIcon fontSize="small" />}
        onClick={handleMenuOpen}
        ref={anchorRef}
        variant="text"
        {...other}
      >
        {selected || label}
      </Button>
      <Menu anchorEl={anchorRef.current} elevation={1} onClose={handleMenuClose} open={openMenu}>
        {options.map((option) => (
          <MenuItem key={option.id} value={option.id} onClick={() => handleClick(option.id)}>
            {option.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default Select;
