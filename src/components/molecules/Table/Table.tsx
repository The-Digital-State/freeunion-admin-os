import {
  Box,
  IconButton,
  Table as MUITable,
  TableBody as MUITableBody,
  TableCell as MUITableCell,
  TableHead as MUITableHead,
  TableRow as MUITableRow,
  TableCellProps as MUITableCellProps,
  Checkbox,
  CircularProgress,
  TableSortLabel,
} from '@material-ui/core';
import Scrollbar from '../../../lib/material-kit/components/Scrollbar';
import HiddenTableCell from '../../atoms/HiddenTableCell';
import { SortDirection } from '../../../types';

import styles from './Table.module.css';
import { isFunction } from 'util';
import Tooltip from 'shared/components/common/Tooltip/Tooltip';

export type TableColumnId = string | number;

export type TableColumn = {
  id: TableColumnId;
  Header: string | JSX.Element;
  // BLur if the value equals "null"
  blur?: boolean;
  sort?: boolean;
  Component?: (props: React.ComponentProps<any>) => JSX.Element;
  componentProps?: { [key: string]: any };
  align?: MUITableCellProps['align'];
  type?: 'number' | 'string' | 'date';
};

export type TableRowActions = {
  id: string;
  title: string;
  onClick: (id: TableColumnId) => void;
  Icon: any;
  iconClassName?: string;
  showCallback?: (row: any) => boolean;
};

export type TableColumnSettings = {
  id: TableColumnId;
  order?: number;
  hide?: (() => boolean) | boolean;
};

export type TableSortBy = {
  field: string;
  direction: SortDirection;
  setSortBy: (field: string, direction: SortDirection) => void;
};

export type TableSettings = {
  sortBy?: TableColumnId;
  sortDirection?: SortDirection;
  columns?: TableColumnSettings[];
};

export type TableData<T> = T & { id: TableColumnId };

export interface ITable<T> {
  data: TableData<T>[];
  columns: TableColumn[];
  actions?: TableRowActions[];
  loading?: boolean;
  selected?: TableColumnId[];
  hideSelectAll?: boolean;
  isAllSelected?: boolean;
  sortBy?: TableSortBy;
  settings?: TableSettings;
  onSelect?: (id: TableColumnId) => void;
  onSelectAll?: () => void;
  onClickRow?: (id: TableColumnId) => void;
  onRowActionClick?: (actionId: any, id: any) => void;
  handleAddComment?: (id: TableColumnId) => void;
  fromModal?: boolean;
  hasFooter?: boolean;
}

function Table<T>({
  data,
  columns,
  loading,
  selected,
  isAllSelected,
  actions,
  sortBy,
  settings,
  onSelect,
  onSelectAll,
  hideSelectAll,
  onClickRow,
  hasFooter,
  handleAddComment,
  fromModal,
}: ITable<T>): JSX.Element {
  const hasSelection = selected && Array.isArray(selected);
  const hasActions = actions && Array.isArray(actions);

  if (!loading && !data) {
    // TODO: Create component for error table
    return <div>[error]</div>;
  }

  if (!loading && !data.length) {
    // TODO: Create component for empty table
    return <div></div>;
  }

  if (loading) {
    return <CircularProgress sx={{ display: 'block', m: 'auto' }} />;
  }

  const handleSortByClick = (id) => {
    if (!sortBy.field || sortBy.field !== id) {
      return sortBy.setSortBy(id, SortDirection.ASC);
    }

    if (sortBy.direction === SortDirection.DESC) {
      return sortBy.setSortBy(null, null);
    }

    if (sortBy.direction === SortDirection.ASC) {
      return sortBy.setSortBy(id, SortDirection.DESC);
    }

    return sortBy.setSortBy(id, SortDirection.ASC);
  };

  const filteredAndOrderedColumns = columns
    ?.reduce((acc, column) => {
      const itemSettings = settings?.columns?.find((x) => x.id === column.id);
      return itemSettings ? [...acc, { ...column, ...itemSettings }] : [...acc, { ...column }];
    }, [] as Array<TableColumn & TableColumnSettings>)
    .filter((x) => {
      // eslint-disable-next-line no-prototype-builtins
      const result = x.hasOwnProperty('hide')
        ? // eslint-disable-next-line @typescript-eslint/ban-types
          !(isFunction(x.hide) ? (x.hide as Function)() : x.hide)
        : true;
      return result;
    })
    .sort((a, b) => a.order - b.order);

  const renderTableHead = () => (
    <>
      {!hideSelectAll && hasSelection && (
        <MUITableCell padding="checkbox">
          <Checkbox color="primary" checked={isAllSelected} onChange={onSelectAll} />
        </MUITableCell>
      )}
      {filteredAndOrderedColumns.map((column, i) =>
        column.sort ? (
          <MUITableCell key={column.id} align={column.align}>
            <TableSortLabel
              key={i}
              active={sortBy.field === column.id}
              direction={sortBy.direction === SortDirection.ASC ? 'asc' : 'desc'}
              onClick={() => handleSortByClick(column.id)}
              hideSortIcon={column.id !== sortBy.field}
            >
              {column.Header}
            </TableSortLabel>
          </MUITableCell>
        ) : (
          <MUITableCell key={column.id} align={column.align}>
            {column.Header}
          </MUITableCell>
        )
      )}
      {hasActions && (
        <MUITableCell key={'__actions'} align={'left'}>
          Действия
        </MUITableCell>
      )}
    </>
  );

  const renderRow = (row: TableData<T>) => {
    const cellKeys = filteredAndOrderedColumns
      .map((x) => String(x.id))
      .filter((id) => Object.keys(row).includes(String(id)));

    return cellKeys.map((cellKey) => {
      const cellData = row[cellKey];
      const cellConfig = filteredAndOrderedColumns.find((x) => x.id === cellKey);

      if (cellConfig.blur && cellData === null) {
        return <HiddenTableCell key={`table-cell-${cellKey}`} />;
      }

      const TableCell: any = cellConfig.Component || MUITableCell;
      const componentProps = { id: row.id, ...(cellConfig?.componentProps || {}) };

      return (
        <TableCell value={cellData} key={`table-cell-${cellKey}`} {...componentProps}>
          {cellData}
        </TableCell>
      );
    });
  };

  const renderTableBody = () =>
    data?.map((row) => (
      <MUITableRow hover key={`table-row-${row.id}`} onClick={() => onClickRow?.(row.id)}>
        {hasSelection && (
          <MUITableCell padding="checkbox">
            <Checkbox
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                onSelect?.(row.id);
              }}
              disabled={isAllSelected}
              checked={isAllSelected || selected.findIndex((x) => x === row.id) > -1}
            />
          </MUITableCell>
        )}
        {renderRow(row)}
        {hasActions && (
          <MUITableCell key={'__actions'}>
            <Box
              sx={{
                display: 'inline-flex',
                width: '100%',
                justifyContent: 'flex-start',
              }}
            >
              {actions
                .filter((action) => (action.showCallback ? action.showCallback(row) : true))
                .map((action, i) => (
                  <>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        action.onClick(row.id);
                      }}
                      data-tip
                      data-for={`${action.id}${action.title}`}
                    >
                      <action.Icon className={action.iconClassName || ''} fontSize="small" />
                    </IconButton>
                    <Tooltip title={action.title} id={`${action.id}${action.title}`} />
                  </>
                ))}
            </Box>
          </MUITableCell>
        )}
      </MUITableRow>
    ));

  return (
    <Scrollbar
      style={{
        overflow: 'auto',
        height: fromModal ? 550 : '100%',
        maxHeight: hasFooter ? 'calc(100vh - 270px)' : 'calc(100vh - 200px)',
      }}
      className={`${styles['table-scroll']}`}
    >
      <Box sx={{ minWidth: 700 }}>
        <MUITable>
          <MUITableHead>
            <MUITableRow>{renderTableHead()}</MUITableRow>
          </MUITableHead>
          <MUITableBody sx={{ position: 'relative' }}>{renderTableBody()}</MUITableBody>
        </MUITable>
      </Box>
    </Scrollbar>
  );
}

export default Table;
