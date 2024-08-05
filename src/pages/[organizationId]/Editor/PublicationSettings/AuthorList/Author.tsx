import { Avatar, Box, Button, ListItem, Typography } from '@material-ui/core';
import { useState } from 'react';
import { User } from 'types/User';
import DeleteIcon from '../../../../../lib/material-kit/icons/X';

type AuthorProps = {
  author: User;
  onDelete: () => void;
};
export const Author = ({ author, onDelete }: AuthorProps) => {
  const [hover, setHover] = useState(false);
  return (
    <ListItem
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ padding: '0 30px 0 0', marginBottom: '15px' }}
    >
      <Avatar
        src={author.public_avatar}
        sx={{
          height: 48,
          width: 48,
        }}
      />
      <Box sx={{ ml: 2 }}>
        <Typography variant="subtitle2">
          {author.public_name} {author.public_family}
        </Typography>
      </Box>
      {hover && (
        <Button
          onClick={onDelete}
          style={{
            padding: 0,
            minWidth: '24px',
            position: 'absolute',
            right: 0,
          }}
        >
          <DeleteIcon />
        </Button>
      )}
    </ListItem>
  );
};
