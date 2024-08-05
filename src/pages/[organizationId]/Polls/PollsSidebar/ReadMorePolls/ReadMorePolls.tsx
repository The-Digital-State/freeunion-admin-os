import ListItemText from '@material-ui/core/ListItemText';
import React from 'react';
import { ListItem } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { getPollsAction } from 'redux/slices/polls';
import { toast } from 'react-toastify';
import formatServerError from 'shared/utils/formatServerError';

const ReadMorePolls = React.forwardRef<HTMLDivElement, any>((props, ref) => {
  const { page, organizationId } = props;
  const dispatch = useDispatch();

  const readMore = async () => {
    try {
      await dispatch(getPollsAction(+organizationId, page + 1, 10, false));
    } catch (error) {
      toast.error(formatServerError(error));
    }
  };

  return (
    <div ref={ref}>
      <ListItem
        button
        onClick={() => readMore()}
        sx={{
          '&.Mui-selected, &.Mui-selected:hover': {
            backgroundColor: 'transparent',
            color: '#828ecc',
            '& .MuiListItemIcon-root': {
              color: '#828ecc',
            },
          },
          '&:hover': {
            background: 'transparent',
            color: '#828ecc',
            '& .MuiListItemText-root': {
              color: '#828ecc',
            },
            '& .MuiListItemIcon-root': {
              color: '#828ecc',
            },
          },
          paddingTop: '3px',
          paddingBottom: '3px',
        }}
      >
        <ListItemText primary="Загрузить ещё опросы" primaryTypographyProps={{ fontSize: '16px' }} />
      </ListItem>
    </div>
  );
});

export default ReadMorePolls;
