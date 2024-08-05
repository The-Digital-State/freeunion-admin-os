import React, { useState } from 'react';
import { TableCell, TableCellProps, Tooltip } from '@material-ui/core';

const getRandomIntInclusive = (min, max) => {
  const _min = Math.ceil(min);
  const _max = Math.floor(max);
  return Math.floor(Math.random() * (_max - _min + 1) + _min);
};

const makeWord = (length) => {
  const result = [];
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
  }
  return result.join('');
};

const makeString = () =>
  new Array(2)
    .fill(null)
    .map(() => makeWord(getRandomIntInclusive(3, 5)))
    .join(' ');

const HiddenTableCell = (props: TableCellProps) => {
  const [hidden] = useState(makeString());

  return (
    <TableCell {...props}>
      <Tooltip title="Не доступно">
        <span
          style={{
            color: 'transparent',
            textShadow: 'rgba(0, 0, 0, 0.95) 0px 0px 10px',
            backgroundColor: 'rgb(0 0 0 / 2%)',
            overflow: 'hidden',
            display: 'inline-flex',
            userSelect: 'none',
          }}
        >
          {hidden}
        </span>
      </Tooltip>
    </TableCell>
  );
};

export default HiddenTableCell;
