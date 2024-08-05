import { TableCell, Avatar, Box, Link, Typography } from '@material-ui/core';

export interface IUserTableCell {
  value: {
    avatar: string;
    firstName: string;
    middleName: string;
    lastName: string;
  };
}

const UserTableCell = ({ value }: IUserTableCell): JSX.Element => {
  const { avatar, firstName, middleName, lastName } = value;

  return (
    <TableCell>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
        }}
      >
        <Avatar
          src={avatar}
          sx={{
            height: 42,
            width: 42,
          }}
        />
        <Box sx={{ ml: 1 }}>
          <Link color="inherit" variant="subtitle2">
            {firstName} {middleName} {lastName}
          </Link>
          <Typography color="textSecondary" variant="body2">
            {/* {email} */}
          </Typography>
        </Box>
      </Box>
    </TableCell>
  );
};

export default UserTableCell;
