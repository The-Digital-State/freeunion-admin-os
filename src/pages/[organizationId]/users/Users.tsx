import React from 'react';
import { Route } from 'react-router-dom';
import AllUsers from './all';
import Lists from './lists';
import ListsId from './lists/[listId]';
import Applications from './applications';
import { useEffect } from 'react';

const UsersChildren = ({ match }) => {
  return (
    <>
      <Route
        path={`${match.path}/all`}
        component={AllUsers}
        exact={true}
        sensitive={true}
        strict={true}
        key={'all-users-key'}
      />
      <Route exact path={`${match.path}/lists`} component={Lists} />
      <Route path={`${match.path}/lists/:listId`} component={ListsId} />
      <Route path={`${match.path}/applications`} component={Applications} />
    </>
  );
};

function Users() {
  return <Route component={UsersChildren} />;
}

export default Users;
