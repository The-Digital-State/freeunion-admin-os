import { useState } from 'react';
import type { FC, ReactNode } from 'react';
// import { NavLink as RouterLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Box, Button, Collapse, ListItem } from '@material-ui/core';
import type { ListItemProps } from '@material-ui/core';
import ChevronDownIcon from '../icons/ChevronDown';
import ChevronRightIcon from '../icons/ChevronRight';
import NotificationCount from 'components/atoms/NotificationCount';

interface NavItemProps extends ListItemProps {
  active?: boolean;
  children?: ReactNode;
  depth: number;
  icon?: ReactNode;
  info?: ReactNode;
  open?: boolean;
  path?: string;
  title: string;
  count?: number;
}

const NavItem: FC<NavItemProps> = (props) => {
  const { active, children, depth, icon, info, open: openProp, path, title, count, ...other } = props;
  const [open, setOpen] = useState<boolean>(openProp);

  const handleToggle = (): void => {
    setOpen((prevOpen) => !prevOpen);
  };

  let paddingLeft = 16;

  if (depth > 0) {
    paddingLeft = 32 + 8 * depth;
  }

  // Branch
  if (children) {
    return (
      <ListItem
        disableGutters
        sx={{
          display: 'block',
          py: 0,
        }}
        {...other}
      >
        <Button
          endIcon={!open ? <ChevronRightIcon fontSize="small" /> : <ChevronDownIcon fontSize="small" />}
          onClick={handleToggle}
          startIcon={icon}
          sx={{
            color: 'text.secondary',
            fontWeight: 'fontWeightMedium',
            justifyContent: 'flex-start',
            pl: `${paddingLeft}px`,
            pr: '8px',
            py: '12px',
            textAlign: 'left',
            textTransform: 'none',
            width: '100%',
          }}
          variant="text"
        >
          <Box sx={{ flexGrow: 1 }}>{title}</Box>
          {info}
        </Button>
        <Collapse in={open}>{children}</Collapse>
      </ListItem>
    );
  }

  // Leaf
  return (
    <ListItem
      disableGutters
      sx={{
        display: 'flex',
        py: 0,
      }}
    >
      <Link to={path || ''}>
        <Button
          startIcon={icon}
          sx={{
            color: 'text.secondary',
            fontWeight: 'fontWeightMedium',
            justifyContent: 'flex-start',
            textAlign: 'left',
            pl: `${paddingLeft}px`,
            pr: '8px',
            py: '12px',
            textTransform: 'none',
            width: '100%',
            ...(active && {
              color: 'primary.main',
              fontWeight: 'fontWeightBold',
              '& svg': {
                color: 'primary.main',
                '& path': {
                  stroke: '#808eca',
                },
              },
            }),
          }}
          variant="text"
        >
          <Box sx={{ flexGrow: 1 }}>{title}</Box>
          {!!count && <NotificationCount top="5px" right="-9px" count={count} />}
          {info}
        </Button>
      </Link>
    </ListItem>
  );
};

NavItem.propTypes = {
  active: PropTypes.bool,
  children: PropTypes.node,
  depth: PropTypes.number.isRequired,
  icon: PropTypes.node,
  info: PropTypes.node,
  open: PropTypes.bool,
  path: PropTypes.string,
  title: PropTypes.string.isRequired,
};

NavItem.defaultProps = {
  active: false,
  open: false,
};

export default NavItem;
