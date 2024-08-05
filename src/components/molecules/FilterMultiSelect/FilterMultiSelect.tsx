import { ChangeEvent, useRef, useState, FC } from 'react';
import { Checkbox, FormControlLabel, Menu, MenuItem, TextField, Tooltip } from '@material-ui/core';

export type FilterOption = {
  id: number;
  name: string;
};

interface MultiSelectProps {
  label: string;
  onChange?: (id: number[]) => void;
  options: FilterOption[];
  value: number[];
  labelWidth?: number;
}

const MultiSelect: FC<MultiSelectProps> = (props) => {
  const { label, onChange, options, value = [], labelWidth = 20 } = props;
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const [openMenu, setOpenMenu] = useState<boolean>(false);

  const selected = options.filter((x) => value.includes(x.id)).map(({ name }) => name);

  const handleMenuOpen = (): void => {
    setOpenMenu(true);
  };

  const handleMenuClose = (): void => {
    setOpenMenu(false);
  };

  const handleOptionToggle = (event: ChangeEvent<HTMLInputElement>): void => {
    let newValue = [...value];

    if (event.target.checked) {
      newValue.push(Number(event.target.value));
    } else {
      newValue = newValue.filter((item) => item !== Number(event.target.value));
    }

    if (onChange) {
      onChange(newValue);
    }
  };

  const formatLabel = (selected) => {
    const result = selected[0] ? [selected[0]] : [];

    for (let i = 1; i < selected.length; i++) {
      if (result.join('').length < labelWidth) {
        result.push(selected[i]);
      }
    }

    return result.length === selected.length
      ? result.join(', ')
      : result.join(', ') + ` и ещё ${selected.length - result.length}`;
  };

  return (
    <>
      <Tooltip title={selected.join('\n')}>
        <TextField
          label={label}
          value={formatLabel(selected) ? formatLabel(selected) : 'Все'}
          variant="outlined"
          onClick={handleMenuOpen}
          ref={anchorRef}
        />
      </Tooltip>
      <Menu anchorEl={anchorRef.current} elevation={1} onClose={handleMenuClose} open={openMenu}>
        {options.map((option) => (
          <MenuItem key={option.id}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={value.indexOf(option.id) > -1}
                  color="primary"
                  onChange={handleOptionToggle}
                  value={option.id}
                />
              }
              label={option.name}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default MultiSelect;
