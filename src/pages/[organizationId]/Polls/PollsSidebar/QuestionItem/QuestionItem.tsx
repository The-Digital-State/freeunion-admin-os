import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { useHistory } from 'react-router-dom';
import React, { useMemo } from 'react';
import { Box, IconButton, ListItem } from '@material-ui/core';
import TrashIcon from '../../../../../lib/material-kit/icons/Trash';
import Tooltip from 'shared/components/common/Tooltip/Tooltip';
import { useDispatch, useSelector } from '../../../../../redux';
import { deleteQuestionAction, PollsState } from 'redux/slices/polls';
import { toast } from 'react-toastify';
import { routes } from 'Routes';
import formatServerError from 'shared/utils/formatServerError';
import { PollsTypes } from 'shared/interfaces/polls';

const QuestionItem = React.forwardRef<HTMLDivElement, any>((props, ref) => {
  const { name, id, to, pollId, section, icon, isActivePoll, order, orgId, ...other } = props;
  const history = useHistory();
  const dispatch = useDispatch();
  const { pollsTypes } = useSelector((state) => state.polls as PollsState);

  const questionId = history.location.pathname.split('/')[7];
  const newSection = history.location.pathname.split('/')[5];

  const isActive = useMemo(() => {
    return (
      (+questionId === id && !!isActivePoll) ||
      (newSection === 'new' && to === history.location.pathname) ||
      (questionId === 'new' && to === history.location.pathname)
    );
  }, [id, newSection, questionId, history.location.pathname, to, isActivePoll]);

  const deleteQuestion = async () => {
    try {
      const isDelete = window.confirm(`Вы действительно хотите удалить вопрос "${name}"?`);

      if (isDelete) {
        await dispatch(deleteQuestionAction(orgId, pollId, id));
        toast('Вопрос удален');
        history.push(routes.polls.getCreatingPoll(orgId, pollId));
      }
    } catch (error) {
      toast.error(formatServerError(error));
    }
  };

  return (
    <div ref={ref} {...other}>
      <ListItem
        button
        selected={isActive}
        onClick={() => history.push(to)}
        sx={{
          '&.Mui-selected': {
            '& .deleteQuestions': {
              opacity: 1,
            },
          },
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
            '& .deleteQuestions': {
              opacity: 1,
            },
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
        {icon && <ListItemIcon>{icon}</ListItemIcon>}
        <ListItemText
          primary={`${order ? `${order}. ` : ''}${name.length < 40 ? name : `${name.slice(0, 40)}...`}`}
          primaryTypographyProps={{ fontSize: '14px' }}
        />
        {!!order && pollsTypes === PollsTypes.creating && (
          <Box
            className="deleteQuestions"
            sx={{
              transition: 'all .3s ease',
              opacity: 0,
              '& > button': {
                padding: '5px',
              },
            }}
          >
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                deleteQuestion();
              }}
              data-tip
              data-for={`deleteQuestions`}
            >
              <TrashIcon fontSize="small" />
            </IconButton>

            <Tooltip title="Удалить вопрос" id="deleteQuestions" />
          </Box>
        )}
      </ListItem>
    </div>
  );
});

export default QuestionItem;
