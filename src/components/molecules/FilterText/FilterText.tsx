import { FC, useState } from 'react';
import { TextField } from '@material-ui/core';

interface TextProps {
  label: string;
  onChange?: (value: any) => void;
  value: string;
  labelWidth?: number;
}

const FilterText: FC<TextProps> = (props) => {
  const { label, onChange, value = '', labelWidth = 20 } = props;
  const [localValue, setLocalValue] = useState<string>(value);

  return (
    <TextField
      placeholder="Все"
      label={label}
      value={localValue}
      variant="outlined"
      onChange={(event) => {
        const value = event.target.value;
        setLocalValue(value);
        onChange(value);
      }}
    />
  );
};

export default FilterText;
