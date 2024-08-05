import { TableCell } from '@material-ui/core';

export interface IListTableCell {
  value: string | string[];
}

const ListTableCell = ({ value }: IListTableCell): JSX.Element => {
  const listOptions = () => {
    return typeof value === 'string' ? <li>{value}</li> : value.map((el, i) => <li key={i}>{el}</li>);
  };

  return (
    <TableCell>
      <ul>{listOptions()}</ul>
    </TableCell>
  );
};

export default ListTableCell;
