import { TableCell } from '@material-ui/core';

export interface ILookupTableCell {
  id: number; // Table substitutes row id here
  value: number | string; // Table substitutes cell value here
  lookup: { // Key-value dictionary to convert the value
    key: number | string,
    value: string,
  }[];
}

const LookupTableCell = ({ 
  value: key,
  lookup
}: ILookupTableCell): JSX.Element => {
  const content = lookup.find(entry => entry.key === key)?.value || '';
  return (
    <TableCell>
      <span
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textAlign: 'left',
        }}
      >
        { content }
      </span>
    </TableCell>
  );
};

export default LookupTableCell;
