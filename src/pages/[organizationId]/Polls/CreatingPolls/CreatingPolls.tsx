import { Box } from '@material-ui/core';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import formatServerError from 'shared/utils/formatServerError';
import { getPollsAction, PollsState, setPollsTypesAction } from 'redux/slices/polls';
import { useParams } from 'react-router';
import PollsContent from '../PollsContent/PollsContent';
import PollsSidebar from '../PollsSidebar/PollsSidebar';
import PollsTabLayot from '../PollsTabLayot/PollsTabLayot';
import { useDispatch, useSelector } from '../../../../redux';
import { PollsTypes } from 'shared/interfaces/polls';

const CreatingPolls = () => {
  const { organizationId } = useParams<{ organizationId?: string }>();
  const dispatch = useDispatch();
  const { polls } = useSelector((state) => state.polls as PollsState);

  useEffect(() => {
    (async () => {
      try {
        await dispatch(setPollsTypesAction(PollsTypes.creating));
        await dispatch(getPollsAction(+organizationId, 1, 10, true));
      } catch (error) {
        toast.error(formatServerError(error));
      }
    })();
  }, [dispatch, organizationId]);

  return (
    <PollsTabLayot>
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          height: 'calc(100vh - 150px)',
        }}
      >
        <PollsSidebar polls={polls} />
        <PollsContent />
      </Box>
    </PollsTabLayot>
  );
};

export default CreatingPolls;
