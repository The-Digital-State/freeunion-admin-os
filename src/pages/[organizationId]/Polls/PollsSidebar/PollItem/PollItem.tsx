import React, { useContext, useEffect, useMemo, useState } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { useHistory, useParams } from 'react-router';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { routes } from 'Routes';
import { Box, IconButton, withStyles } from '@material-ui/core';
import QuestionItem from '../QuestionItem/QuestionItem';
import TrashIcon from '../../../../../lib/material-kit/icons/Trash';
import PencilAltIcon from '../../../../../lib/material-kit/icons/PencilAlt';
import Tooltip from 'shared/components/common/Tooltip/Tooltip';
import { toast } from 'react-toastify';
import formatServerError from 'shared/utils/formatServerError';
import { useDispatch, useSelector } from '../../../../../redux';
import { deletePollAction, getQuestionsAction, PollsState } from 'redux/slices/polls';
import { PollQuestionType, PollsTypes, questionsTypesBackToFront } from 'shared/interfaces/polls';
import { Spinner } from 'shared/components/common/Spinner/Spinner';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import styles from './PollItem.module.scss';
import { Button } from 'shared/components/common/Button/Button';
import { ModalContext } from 'context/Modal';
import PollPublishSettings from '../../PollsContent/PollPublishSettings/PollPublishSettings';

export const MiuListItem = withStyles({
  root: {
    '&.Mui-selected': {
      '& .deletePolls': {
        opacity: 1,
      },
    },
    '&.Mui-selected, &.Mui-selected:hover': {
      backgroundColor: 'transparent',
      color: '#828ecc',
      '& .MuiListItemIcon-root': {
        color: '#828ecc',
      },
      '& .MuiListItemText-root': {
        color: '#828ecc',
      },
    },
    '&:hover': {
      background: 'transparent',
      color: 'gray',
      '& .deletePolls': {
        opacity: 1,
      },
      '& .MuiListItemText-root': {
        color: 'gray',
      },
      '& .MuiListItemIcon-root': {
        color: 'gray',
      },
    },
  },
})(ListItem);

const PollItem = React.memo(({ poll }: { poll: any }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { organizationId } = useParams<{ organizationId?: string }>();
  const { isLoadingQuestions, pollsTypes } = useSelector((state) => state.polls as PollsState);
  const [isFirstOpen, setIsFirstOpen] = useState(true);
  const questions: PollQuestionType[] = useSelector(
    (state) => state.polls.questions?.find((questionData) => questionData?.pollId === poll.id)?.questions
  );
  const modalContext = useContext(ModalContext);

  const pollId = history.location.pathname.split('/')[5];

  const isActive = useMemo(() => {
    return +pollId === poll.id;
  }, [poll.id, pollId]);

  const [open, setOpen] = useState(isActive);

  useEffect(() => {
    if (+pollId === poll.id) {
      setOpen(true);
    }
  }, [pollId, poll.id]);

  useEffect(() => {
    if ((!!isActive || !!open) && !!isFirstOpen) {
      (async () => {
        try {
          await dispatch(getQuestionsAction(+organizationId, poll.id));

          setIsFirstOpen(false);
        } catch (e) {
          toast.error(formatServerError(e));
        }
      })();
    }
  }, [poll.id, organizationId, isActive, dispatch, open, isFirstOpen]);

  const questionsSidebar = useMemo(() => {
    if (!!questions?.length) {
      return questions.map((question) => ({
        name: question.question,
        id: question.id,
        to: (() => {
          if (pollsTypes === PollsTypes.creating) {
            return routes.polls.getCreatingQuestion(
              organizationId,
              question.id,
              poll.id,
              questionsTypesBackToFront[question.type]
            );
          } else if (pollsTypes === PollsTypes.active) {
            return routes.polls.getActiveQuestion(
              organizationId,
              question.id,
              poll.id,
              questionsTypesBackToFront[question.type]
            );
          } else {
            return routes.polls.getCompletedQuestion(
              organizationId,
              question.id,
              poll.id,
              questionsTypesBackToFront[question.type]
            );
          }
        })(),
      }));
    }
  }, [organizationId, poll.id, questions, pollsTypes]);

  const addNewArticle = {
    name: 'Добавить вопрос',
    to: routes.polls.getNewQuestionPage(organizationId, poll.id),
    icon: <AddCircleOutlineIcon />,
  };

  const handleClick = () => {
    if (+pollId !== poll.id && !open) {
      setOpen(true);
    }
    history.push(poll.to);
  };

  const editPoll = () => {
    history.push(routes.polls.getEditPoll(organizationId, poll.id));
  };

  const deletePoll = async () => {
    try {
      const isDelete = window.confirm(`Вы действительно хотите удалить опрос "${poll.name}"?`);

      if (isDelete) {
        await dispatch(deletePollAction(+organizationId, +poll.id));
        toast('Опрос удален');
        if (pollsTypes === PollsTypes.creating) {
          history.push(routes.polls.getCreatingPolls(+organizationId));
        } else if (pollsTypes === PollsTypes.active) {
          history.push(routes.polls.getActivePolls(+organizationId));
        } else {
          history.push(routes.polls.getCompletedPolls(+organizationId));
        }
      }
    } catch (error) {
      toast.error(formatServerError(error));
    }
  };

  const publishClick = (id) => {
    modalContext.openModal(
      <PollPublishSettings
        close={() => {
          modalContext.closeModal();
        }}
        organizationId={+organizationId}
        pollId={+poll.id}
      />
    );
  };

  return (
    <React.Fragment>
      <MiuListItem button selected={isActive}>
        <ExpandLessIcon
          onClick={() => setOpen((prev) => !prev)}
          sx={{
            mr: '5px',
            transition: 'all .3s ease',
            transform: open ? 'rotate(180deg)' : 'rotate(90deg)',
          }}
        />
        <ListItemText
          primary={poll.name.length < 40 ? poll.name : `${poll.name.slice(0, 40)}...`}
          onClick={handleClick}
        />
        {pollsTypes === PollsTypes.creating && (
          <Box
            className="deletePolls"
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
                editPoll();
              }}
              data-tip
              data-for={`changePoll`}
            >
              <PencilAltIcon fontSize="small" />
            </IconButton>
            <Tooltip id={`changePoll`} title="Изменить опрос" />
          </Box>
        )}
        {pollsTypes !== PollsTypes.active && (
          <Box
            className="deletePolls"
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
                deletePoll();
              }}
              data-tip
              data-for={`deletePoll`}
            >
              <TrashIcon fontSize="small" />
            </IconButton>

            <Tooltip title="Удалить опрос" id="deletePoll" />
          </Box>
        )}
      </MiuListItem>
      <Collapse
        in={open}
        timeout="auto"
        unmountOnExit
        sx={{
          padding: '0 0 0 20px',
        }}
      >
        {isLoadingQuestions === poll.id ? (
          <div className={styles.wrapperSpinner}>
            <Spinner />
          </div>
        ) : (
          <>
            {pollsTypes === PollsTypes.creating && (
              <QuestionItem name={addNewArticle.name} to={addNewArticle.to} icon={addNewArticle.icon} />
            )}

            <Droppable droppableId={`${poll?.id}`} type="card">
              {(provided, snapshot): JSX.Element => (
                <div ref={provided.innerRef}>
                  {!!questionsSidebar?.length &&
                    questionsSidebar.map((question, index) => (
                      <Draggable
                        draggableId={`${question.id}`}
                        index={index}
                        isDragDisabled={pollsTypes !== PollsTypes.creating}
                        key={question.id}
                      >
                        {(_provided): JSX.Element => (
                          <QuestionItem
                            key={question.id}
                            name={question.name}
                            to={question.to}
                            id={question.id}
                            isActivePoll={isActive}
                            orgId={+organizationId}
                            pollId={poll.id}
                            order={index + 1}
                            ref={_provided.innerRef}
                            {..._provided.draggableProps}
                            {..._provided.dragHandleProps}
                          />
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            {!poll.published && !!questionsSidebar?.length && (
              <Button size="small" maxWidth className={styles.buttonWrapper} onClick={publishClick}>
                Опубликовать опрос
              </Button>
            )}
          </>
        )}
      </Collapse>
    </React.Fragment>
  );
});

export default PollItem;
