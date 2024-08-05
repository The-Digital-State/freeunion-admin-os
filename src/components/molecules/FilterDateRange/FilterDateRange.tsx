import { useState, FC } from 'react';
import { Box, TextField } from '@material-ui/core';
import MobileDateRangePicker from '@material-ui/lab/MobileDateRangePicker';

interface FilterDateRangeProps {
  value: any;
  onChange: (value: any) => void;
  label: string;
  title: string;
  startText?: string;
  endText?: string;
}

const FilterDateRange: FC<FilterDateRangeProps> = (props) => {
  const { value = [null, null], onChange, label, title, startText, endText } = props;
  const [dayPickerOpen, setDayPickerOpen] = useState(false);

  const getLabel = () => {
    if (!!value[0] && !!value[1]) {
      return `${new Date(value[0]).toLocaleDateString()} - ${new Date(value[1]).toLocaleDateString()}`;
    }

    return 'Все';
  };

  return (
    <>
      <TextField label={label} value={getLabel()} variant="outlined" onClick={() => setDayPickerOpen(true)} />

      <Box sx={{ zIndex: -1, position: 'relative', height: '0px', width: '0px' }}>
        <MobileDateRangePicker
          startText={startText || 'Начало'}
          endText={endText || 'Конец'}
          toolbarTitle={title || 'Выберите промежуток'}
          open={dayPickerOpen}
          onClose={() => setDayPickerOpen(false)}
          value={value}
          okText="Подтвердить"
          cancelText="Отменить"
          onChange={onChange}
          mask="__/__/____"
          renderInput={(startProps, endProps) => (
            <>
              <TextField {...startProps} />
              <Box sx={{ mx: 2 }}> - </Box>
              <TextField {...endProps} />
            </>
          )}
        />
      </Box>
    </>
  );
};

export default FilterDateRange;
