import { Route, Switch } from 'react-router-dom';
import { routes } from 'Routes';
import { Box, Typography } from '@material-ui/core';
import NewPoll from './NewPoll/NewPoll';
import NewQuestion from './NewQuestion/NewQuestion';
import NewQuestionType from './NewQuestionType/NewQuestionType';
import PollPreview from './PollPreview/PollPreview';
import CreatedQuestionType from './CreatedQuestionsType/CreatedQuestionsType';

const PollsContent = () => {
  return (
    <Box
      sx={{
        width: '70%',
        padding: '0 20px',
        height: '100%',
        overflowY: 'auto',
      }}
    >
      <Switch>
        <Route
          path={[routes.polls.creatingPolls, routes.polls.activePolls, routes.polls.completedPolls]}
          exact={true}
          key={'active-polls'}
        >
          <Typography
            sx={{
              textTransform: 'uppercase',
              fontFamily: 'Jost',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '25px',
              lineHeight: '35px',
            }}
          >
            добавляйте опросы, голосования и викторины чтобы больше узнать о ваших участниках, проверить их знания и
            принять коллективное решение
          </Typography>
        </Route>
        <Route path={[routes.polls.newPoll, routes.polls.editPoll]} exact={true} key={'new-poll'}>
          <NewPoll />
        </Route>
        <Route path={routes.polls.newQuestionPage} exact={true} key={'new-question-page'}>
          <NewQuestion />
        </Route>
        <Route
          path={[routes.polls.newQuestionTypeLink, routes.polls.creatingQuestionLink]}
          exact={true}
          key={'question-type'}
        >
          <NewQuestionType />
        </Route>
        <Route
          path={[routes.polls.creatingPoll, routes.polls.activePoll, routes.polls.completedPoll]}
          exact={true}
          key={'active-poll-preview'}
        >
          <PollPreview />
        </Route>
        <Route
          path={[routes.polls.completedQuestionLink, routes.polls.activeQuestionLink]}
          exact={true}
          key={'completed-question-type'}
        >
          <CreatedQuestionType />
        </Route>
      </Switch>
    </Box>
  );
};

export default PollsContent;
