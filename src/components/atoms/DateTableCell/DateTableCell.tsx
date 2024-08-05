import { TableCell, TableCellProps } from '@material-ui/core';

const DateTableCell = ({ children, ...props }: TableCellProps): JSX.Element => {
  // @ts-ignore
  const formattedDate = (children as Date)?.toLocaleDateString?.() || children;

  return <TableCell {...props}>{formattedDate}</TableCell>;
};

export default DateTableCell;
