import { TableCell } from '@material-ui/core';
import AddCommentIcon from '../../../lib/material-kit/icons/AddComment';

export interface ICommentTableCell {
  id: string | number;
  value: string;
}

const CommentTableCell = ({ id, value }: ICommentTableCell): JSX.Element => {
  return (
    <TableCell>
      <span
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textAlign: 'center',
        }}
      >
        {value ? value : <AddCommentIcon />}
      </span>
    </TableCell>
  );
};

export default CommentTableCell;
