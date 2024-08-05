import { ChangeEvent, FC, useRef, useState } from 'react';
import dynamic from 'helpers/dynamic';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
} from '@material-ui/core';
import { FilterOperationType, Option } from '../../../services/api/types';

// TODO: Disable SSR for the whole APP
const FilterText = dynamic(require('../FilterText'), { ssr: false });
const FilterMultiSelect = dynamic(require('../FilterMultiSelect'), {
  ssr: false,
});
const FilterDateRange = dynamic(require('../FilterDateRange'), {
  ssr: false,
});
const SearchIcon = dynamic(require('../../../lib/material-kit/icons/Search'), {
  ssr: false,
});
const CloseIcon = dynamic(require('../../../lib/material-kit/icons/X'), { ssr: false });

export enum FilterType {
  DATE_RANGE = 'DATE_RANGE',
  SELECT = 'SELECT',
  STRING = 'STRING',
}

const filterTypeMap = {
  [FilterType.STRING]: FilterText,
  [FilterType.SELECT]: FilterMultiSelect,
  [FilterType.DATE_RANGE]: FilterDateRange,
};

export type FilterListItem = {
  key: string;
  operation: FilterOperationType;
  type?: FilterType;
  value: any;
  options?: Option[];
  label: string;
  selectByDefault?: boolean;
  [key: string]: any;
};

export interface FiltersListProps {
  values: Array<FilterListItem>;
  onChange: (key: string, operation: FilterOperationType, value: any) => void;
  availableKeys: string[];
  resetFilters: () => void;
  isEmpty: boolean;
  hideFilterButton?: boolean;
  selectedFiltersChanged?: (selectedKeys: string[]) => void;
}

const FiltersList: FC<FiltersListProps> = (props) => {
  const { values, availableKeys, onChange, resetFilters, selectedFiltersChanged, hideFilterButton } = props;
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [selectedKeys, setSelectedKeys] = useState<string[]>(
    values.filter((x) => x.value || x.selectByDefault).map((x) => x.key)
  );

  const isSelected = (key) => selectedKeys.findIndex((x) => x === key) > -1;
  const isAllSelected = selectedKeys.length === availableKeys.length;

  const mainSearchRef = useRef();
  const mainSearchOperation = values.find((filter) => filter.key === 'mainSearch')?.operation;

  const handleResetFilters = () => {
    setOpenMenu(false);
    resetFilters();
    setSelectedKeys([]);
    selectedFiltersChanged && selectedFiltersChanged([]);
  };

  const handleResetFilter = (key, operation) => {
    const keys = selectedKeys.filter((x) => x !== key);
    setSelectedKeys(keys);
    selectedFiltersChanged && selectedFiltersChanged(keys);
    onChange(key, operation, null);
  };

  const handleOptionToggle = (event: ChangeEvent<HTMLInputElement>): void => {
    let newSelectedKeys = [...selectedKeys];

    if (event.target.checked) {
      newSelectedKeys.push(event.target.value);
    } else {
      newSelectedKeys = newSelectedKeys.filter((item) => item !== event.target.value);
      onChange(event.target.value, null, null);
    }

    selectedFiltersChanged && selectedFiltersChanged(newSelectedKeys);
    setSelectedKeys(newSelectedKeys);
  };

  const handleMenuOpen = (): void => {
    setOpenMenu(true);
  };

  const handleMenuClose = (): void => {
    setOpenMenu(false);
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          m: -1,
          p: 2,
          paddingBottom: 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Box
            sx={{
              m: 1,
              maxWidth: '100%',
            }}
          >
            <TextField
              label="Имя"
              fullWidth
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="start">
                    <IconButton
                      onClick={() => {
                        onChange('mainSearch', mainSearchOperation, '');
                        if (mainSearchRef.current) {
                          const inputEls = (mainSearchRef.current as HTMLDivElement).getElementsByTagName('input');
                          if (inputEls.length) {
                            inputEls[0].value = '';
                          }
                        }
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              placeholder="Поиск"
              variant="outlined"
              onChange={(event) => {
                onChange('mainSearch', mainSearchOperation, event.target.value);
              }}
              value={values.find((filter) => filter.key === 'mainSearch')?.value || ''}
              ref={mainSearchRef}
            />
          </Box>
          {selectedKeys.map((selectedKey) => {
            const { type, key, operation, ...filter } = values.find((x) => x.key === selectedKey);
            if (key === 'mainSearch') return false;

            const Component = filterTypeMap[type];

            return (
              <Box key={key + type} sx={{ m: 1, display: 'flex', alignItems: 'center' }}>
                <Component {...(filter as any)} onChange={(value) => onChange(key, operation, value)} />
                <IconButton sx={{ marginLeft: 0.5 }} onClick={() => handleResetFilter(key, operation)}>
                  <CloseIcon />
                </IconButton>
              </Box>
            );
          })}
        </Box>
        {!hideFilterButton && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                flexWrap: 'wrap',
                // m: -1,
                paddingLeft: 1,
              }}
            >
              {selectedKeys.length > 0 && (
                <Box sx={{ m: 1 }}>
                  <Button sx={{ color: 'black' }} variant="outlined" size="medium" onClick={handleResetFilters}>
                    Очистить параметры
                  </Button>
                </Box>
              )}
              {!isAllSelected && (
                <Box sx={{ m: 1 }}>
                  <Button
                    sx={{ color: 'black' }}
                    variant="outlined"
                    size="medium"
                    ref={anchorRef}
                    onClick={handleMenuOpen}
                  >
                    Фильтры
                  </Button>
                  <Menu anchorEl={anchorRef.current} elevation={1} onClose={handleMenuClose} open={openMenu}>
                    {values.map(
                      (option) =>
                        option.key !== 'mainSearch' && (
                          <MenuItem key={option.key + option.type}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={isSelected(option.key)}
                                  color="primary"
                                  onChange={handleOptionToggle}
                                  value={option.key}
                                />
                              }
                              label={option.label}
                            />
                          </MenuItem>
                        )
                    )}
                  </Menu>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};

export default FiltersList;
