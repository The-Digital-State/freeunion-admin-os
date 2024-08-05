// Almost everything has been taken from the MaterialUI internal sources
// Should be refactored
import React, { Fragment } from 'react';
import {
  Box,
  experimentalStyled,
  generateUtilityClasses,
  IconButton,
  InputBase,
  MenuItem,
  Select,
  TableCell,
  Toolbar,
  Button,
  Menu,
} from '@material-ui/core';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import NumberHighlight from '../../atoms/NumberHighlight';

const tablePaginationClasses = generateUtilityClasses('MuiTablePagination', [
  'root',
  'toolbar',
  'spacer',
  'selectLabel',
  'selectRoot',
  'select',
  'selectIcon',
  'input',
  'menuItem',
  'displayedRows',
  'actions',
]);

const TablePaginationRoot = experimentalStyled(
  TableCell,
  {},
  {
    name: 'MuiTablePagination',
    slot: 'Root',
    overridesResolver: (props, styles) => styles.root,
  }
)(({ theme }) => ({
  overflow: 'auto',
  color: theme.palette.text.primary,
  fontSize: theme.typography.pxToRem(14),
  // Increase the specificity to override TableCell.
  '&:last-child': {
    padding: 0,
  },
}));

const TablePaginationToolbar = experimentalStyled(
  Toolbar,
  {},
  {
    name: 'MuiTablePagination',
    slot: 'Toolbar',
    overridesResolver: (props, styles) => ({
      [`& .${tablePaginationClasses.actions}`]: styles.actions,
      ...styles.toolbar,
    }),
  }
)(({ theme }) => ({
  minHeight: 52,
  paddingRight: 2,
  [`${theme.breakpoints.up('xs')} and (orientation: landscape)`]: {
    minHeight: 52,
  },
  [theme.breakpoints.up('sm')]: {
    minHeight: 52,
    paddingRight: 2,
  },
  [`& .${tablePaginationClasses.actions}`]: {
    flexShrink: 0,
    marginLeft: 20,
  },
}));

const TablePaginationSelectLabel = experimentalStyled(
  'p',
  {},
  {
    name: 'MuiTablePagination',
    slot: 'SelectLabel',
    overridesResolver: (props, styles) => styles.selectLabel,
  }
)(({ theme }) => ({
  ...theme.typography.body2,
  flexShrink: 0,
}));

const TablePaginationSelect = experimentalStyled(
  Select,
  {},
  {
    name: 'MuiTablePagination',
    slot: 'Select',
    overridesResolver: (props, styles) => ({
      [`& .${tablePaginationClasses.selectIcon}`]: styles.selectIcon,
      [`& .${tablePaginationClasses.select}`]: styles.select,
      ...styles.input,
      ...styles.selectRoot,
    }),
  }
)(({ theme }) => ({
  color: 'inherit',
  fontSize: 'inherit',
  flexShrink: 0,
  marginRight: 32,
  marginLeft: 8,
  [`& .${tablePaginationClasses.input}`]: {
    paddingLeft: 8,
    paddingRight: 24,
    textAlign: 'right',
    textAlignLast: 'right', // Align <select> on Chrome.
    fontSize: 'inherit',
  },
}));

const TablePaginationMenuItem = experimentalStyled(
  MenuItem,
  {},
  {
    name: 'MuiTablePagination',
    slot: 'MenuItem',
    overridesResolver: (props, styles) => styles.menuItem,
  }
)();

const TablePaginationDisplayedRows = experimentalStyled(
  'p',
  {},
  {
    name: 'MuiTablePagination',
    slot: 'DisplayedRows',
    overridesResolver: (props, styles) => styles.displayedRows,
  }
)(({ theme }) => ({
  ...theme.typography.body2,
  flexShrink: 0,
}));

const TablePaginationSpacer = experimentalStyled(
  'div',
  {},
  {
    name: 'MuiTablePagination',
    slot: 'Spacer',
    overridesResolver: (props, styles) => styles.spacer,
  }
)({
  flex: '1 1 100%',
});

const TablePaginationActions = React.forwardRef(function TablePaginationActions(props: any, ref) {
  const {
    backIconButtonProps,
    count,
    getItemAriaLabel,
    nextIconButtonProps,
    onPageChange,
    page,
    rowsPerPage,
    showFirstButton,
    showLastButton,
    ...other
  } = props as any;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box ref={ref} {...other}>
      {showFirstButton && (
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label={getItemAriaLabel('first', page)}
          title={getItemAriaLabel('first', page)}
        >
          <FirstPageIcon />
        </IconButton>
      )}
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        color="inherit"
        aria-label={getItemAriaLabel('previous', page)}
        title={getItemAriaLabel('previous', page)}
        {...backIconButtonProps}
      >
        <KeyboardArrowLeftIcon />
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={count !== -1 ? page >= Math.ceil(count / rowsPerPage) - 1 : false}
        color="inherit"
        aria-label={getItemAriaLabel('next', page)}
        title={getItemAriaLabel('next', page)}
        {...nextIconButtonProps}
      >
        <KeyboardArrowRightIcon />
      </IconButton>
      {showLastButton && (
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label={getItemAriaLabel('last', page)}
          title={getItemAriaLabel('last', page)}
        >
          <LastPageIcon />
        </IconButton>
      )}
    </Box>
  );
});

const TableSelected = ({ selected, available, isAllSelected }) => {
  if (!available) {
    return null;
  }

  if (isAllSelected || selected === available) {
    return (
      <>
        <TablePaginationSelectLabel sx={{ marginRight: 1, marginLeft: 2 }}>ВЫБРАНЫ:</TablePaginationSelectLabel>
        <NumberHighlight sx={{ marginRight: 2 }}>все</NumberHighlight>
      </>
    );
  }

  if (selected > 0) {
    return (
      <>
        <TablePaginationSelectLabel sx={{ marginRight: 1, marginLeft: 2 }}>ВЫБРАНО:</TablePaginationSelectLabel>
        <NumberHighlight sx={{ marginRight: 2 }}>{selected}</NumberHighlight>
      </>
    );
  }

  return null;
};

const TableActions = ({ actions = [] }) => {
  const menuItems = actions.map((action, i) => {
    const Icon = action.Icon;
    return (
      <MenuItem
        key={i}
        onClick={() => {
          handleClose();
          action.onClick();
        }}
        disabled={action.disabled}
      >
        {Icon && <Icon />}&nbsp;
        {action.label}
      </MenuItem>
    );
  });

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Fragment>
      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} endIcon={<ExpandMoreIcon />}>
        Действия
      </Button>
      <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        {menuItems}
      </Menu>
    </Fragment>
  );
};

const labelDisplayedRows = ({ from, to, count }) => `${from}-${to} из ${count !== -1 ? count : `${to}+`}`;

const getAriaLabel = (type) => `Перейти на ${type === 'next' ? 'следующую' : 'предыдущую'} страницу`;

export interface ITableFooter {
  count: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (value: number) => void;
  page: number;
  rowsPerPage: number;
  rowsPerPageOptions?: number[];
  selected?: number;
  isAllSelected?: boolean;
  mainAction?: any[];
  actions?: any[];
}

function TableFooter(props: ITableFooter): JSX.Element {
  const { rowsPerPageOptions, rowsPerPage, count, page, mainAction } = props;

  const handleRowsPerPageChange = (e) => props.onRowsPerPageChange(e.target.value);
  const handlePageChange = (_, value) => props.onPageChange(value);

  const getLabelDisplayedRowsTo = () => {
    if (count === -1) return (page + 1) * rowsPerPage;
    return rowsPerPage === -1 ? count : Math.min(count, (page + 1) * rowsPerPage);
  };

  return (
    <TablePaginationRoot as={'div'}>
      <TablePaginationToolbar>
        {rowsPerPageOptions.length > 1 && (
          <TablePaginationSelectLabel sx={{ flexShrink: 0 }}>Количество на странице:</TablePaginationSelectLabel>
        )}

        {rowsPerPageOptions.length > 1 && (
          <TablePaginationSelect
            variant="standard"
            input={<InputBase />}
            defaultValue={rowsPerPage}
            onChange={handleRowsPerPageChange}
          >
            {rowsPerPageOptions.map((rowsPerPageOption) => (
              <TablePaginationMenuItem key={rowsPerPageOption} value={rowsPerPageOption}>
                {rowsPerPageOption}
              </TablePaginationMenuItem>
            ))}
          </TablePaginationSelect>
        )}

        <TablePaginationDisplayedRows>
          {labelDisplayedRows({
            from: count === 0 ? 0 : page * rowsPerPage + 1,
            to: getLabelDisplayedRowsTo(),
            count: count === -1 ? -1 : count,
          })}
        </TablePaginationDisplayedRows>

        <TablePaginationActions
          sx={{ flexShrink: 0 }}
          count={count}
          onPageChange={handlePageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          showFirstButton={false}
          showLastButton={false}
          getItemAriaLabel={getAriaLabel}
        />
        <TablePaginationSpacer />
        {!!props.selected && (
          <TableSelected selected={props.selected} available={count} isAllSelected={props.isAllSelected} />
        )}
        {!!mainAction && (
          <Box sx={{ flexShrink: 0, display: 'inline-flex' }}>
            {mainAction.reverse().map(({ disabled, onClick, label }, index) => {
              return (
                <Box key={index} sx={{ marginRight: '1em' }}>
                  <Button variant="contained" size="medium" disabled={disabled} onClick={onClick}>
                    {label}
                  </Button>
                </Box>
              );
            })}
            <Box sx={{ marginRight: '1em' }}>{props?.actions?.length && <TableActions actions={props.actions} />}</Box>
          </Box>
        )}
      </TablePaginationToolbar>
    </TablePaginationRoot>
  );
}

export default TableFooter;
