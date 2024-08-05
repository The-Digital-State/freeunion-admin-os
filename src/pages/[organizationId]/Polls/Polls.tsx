import { Route, Switch } from 'react-router-dom';
import { routes } from 'Routes';

import CreatingPolls from './CreatingPolls/CreatingPolls';
import CompletedPolls from './CompletedPolls/CompletedPolls';
import ActivePolls from './ActivePolls/ActivePolls';

const Polls = () => {
  return (
    <Switch>
      <Route path={routes.polls.creatingPolls} component={CreatingPolls} key={'creating-polls'} />
      <Route path={routes.polls.activePolls} component={ActivePolls} key={'active-polls'} />
      <Route path={routes.polls.completedPolls} component={CompletedPolls} key={'completed-polls'} />
    </Switch>
  );
};

export default Polls;
