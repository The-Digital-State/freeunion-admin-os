import { Route } from 'react-router-dom';

import NotificationsList from './NotificationsList/NotificationsList';
import CreateNotification from './CreateNotification/CreateNotification';

function Notifications({ match }) {
  return (
    <>
      <Route exact path={match.path} component={NotificationsList} />
      <Route path={`${match.path}/new`} component={CreateNotification} />
    </>
  );
}

export default Notifications;
