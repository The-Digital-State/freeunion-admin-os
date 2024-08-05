import React, { ReactElement, useMemo } from 'react';

import { Box, Typography } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { useParams } from 'react-router';
import { routes } from 'Routes';
import { KbaseSectionLight } from 'shared/interfaces/kbase';
import QuestionItem from './QuestionItem/QuestionItem';
import PollItem from './PollItem/PollItem';
import { useDispatch, useSelector } from '../../../../redux';
import { getQuestionsAction, PollsState, updateLoadingAction } from 'redux/slices/polls';
import { Spinner } from 'shared/components/common/Spinner/Spinner';
import styles from './PollsSidebar.module.scss';
import { PollsTypes, PollType } from 'shared/interfaces/polls';
import { DragDropContext } from 'react-beautiful-dnd';
import type { DropResult } from 'react-beautiful-dnd';
import ReadMorePolls from './ReadMorePolls/ReadMorePolls';
import { toast } from 'react-toastify';
import formatServerError from 'shared/utils/formatServerError';
import { dragQuestion } from 'services/api/polls';

export interface ISidebarMaterials {
  name: string;
  id?: number;
  icon?: ReactElement<any, any>;
  to?: string;
  section?: KbaseSectionLight;
  index?: number;
}

export interface ISidebarData {
  name: string;
  id?: number;
  icon?: ReactElement<any, any>;
  to?: string;
  items?: ISidebarMaterials[];
}

export default function PollsSidebar({ polls }: { polls: PollType[] }): JSX.Element {
  const { organizationId } = useParams<{ organizationId?: string }>();

  const { isLoading, totalPolls, pollsTypes, questions } = useSelector((state) => state.polls as PollsState);
  const dispatch = useDispatch();

  const pollsSidebar: ISidebarData[] = useMemo(() => {
    return polls.map((poll) => ({
      name: poll.name,
      id: poll.id,
      published: poll.published,
      to: (() => {
        if (pollsTypes === PollsTypes.creating) {
          return routes.polls.getCreatingPoll(organizationId, poll.id);
        } else if (pollsTypes === PollsTypes.active) {
          return routes.polls.getActivePoll(organizationId, poll.id);
        } else {
          return routes.polls.getCompletedPoll(organizationId, poll.id);
        }
      })(),
    }));
  }, [organizationId, polls, pollsTypes]);

  const addNewPoll: ISidebarData = {
    name: 'Добавить опрос',
    to: routes.polls.getNewPoll(organizationId),
    icon: <AddCircleOutlineIcon />,
  };
  const handleDragEnd = async ({ source, destination, draggableId }: DropResult): Promise<void> => {
    try {
      if (!destination) {
        return;
      }
      if (source.droppableId === destination.droppableId && source.index === destination.index) {
        return;
      }
      await dispatch(updateLoadingAction(undefined, +source.droppableId));

      let pollQuestions = questions.find((questionData) => questionData?.pollId === +source.droppableId)?.questions;
      let rowIndex = pollQuestions[destination.index].index;

      if (source.index > destination.index) {
        rowIndex -= 1;
      } else if (destination.index === 0) {
        rowIndex = 1;
      }

      await dragQuestion(+organizationId, +source.droppableId, draggableId, rowIndex);
      await dispatch(getQuestionsAction(+organizationId, +source.droppableId));
      toast('Вопрос перемещен!');
    } catch (e) {
      toast.error(formatServerError(e));
    }
  };

  return (
    <Box
      sx={{
        width: '30%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          overflowY: 'auto',
          height: '100%',
        }}
      >
        {pollsTypes === PollsTypes.creating && (
          <QuestionItem key="new-poll" name={addNewPoll.name} to={addNewPoll.to} icon={addNewPoll.icon} />
        )}
        {pollsTypes !== PollsTypes.creating && !pollsSidebar?.length && !isLoading && (
          <Typography>У вас ещё нет {pollsTypes === PollsTypes.active ? 'активных' : 'завершенных'} опросов</Typography>
        )}

        {isLoading ? (
          <div className={styles.wrapperSpinner}>
            <Spinner />
          </div>
        ) : (
          <>
            <DragDropContext onDragEnd={handleDragEnd}>
              {pollsSidebar.map((poll) => (
                <PollItem key={poll.id} poll={poll} />
              ))}
            </DragDropContext>
            {totalPolls.total > pollsSidebar.length && (
              <ReadMorePolls key="more-polls" page={totalPolls.page} organizationId={organizationId} />
            )}
          </>
        )}
      </Box>
    </Box>
  );
}
