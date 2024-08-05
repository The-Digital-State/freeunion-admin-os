import { TableCell } from '@material-ui/core';

export interface ILongTextTableCell {
  value: string;
}

const LongTextTableCell = ({ value }: ILongTextTableCell): JSX.Element => {
  return (
    <TableCell>
      <span
        style={
          {
            display: '-webkit-box',
            WebkitLineClamp: '3',
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          } as any
        }
      >
        {value}
      </span>
    </TableCell>
  );
};

export default LongTextTableCell;
