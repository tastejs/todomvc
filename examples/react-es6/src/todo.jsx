import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import TodoApp from './app';

const ALL_TODOS = 'all';
const ACTIVE_TODOS = 'active';
const COMPLETED_TODOS = 'completed';

const Todo = props => {
  return (
    <BrowserRouter>
      <TodoSwitch />
    </BrowserRouter>
  );
};

const TodoSwitch = () => {
  return (
    <Fragment>
      <Switch>
        <Route
          exact
          path="/"
          render={() => <TodoApp nowShowing={ALL_TODOS} />}
        />
        <Route
          exact
          path="/active"
          render={() => <TodoApp nowShowing={ACTIVE_TODOS} />}
        />
        <Route
          exact
          path="/completed"
          render={() => <TodoApp nowShowing={COMPLETED_TODOS} />}
        />
      </Switch>
    </Fragment>
  );
};

document.addEventListener('DOMContentLoaded', () => {
  const todoApp = document.getElementsByClassName('todoapp')[0];
  ReactDOM.render(<Todo />, todoApp);
});
