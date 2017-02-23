import * as React from 'react';

import { AppProps, assertNever } from '../shared';
import { TodoFooter } from './TodoFooter';
import { Main } from './Main';
import { NewTodo } from './NewTodo';


export class AppContent extends React.Component<AppProps, {}> {
  render() {
    return (
      <div>
        <header className="header">
          <h1>todos</h1>
          <NewTodo {...this.props} />
        </header>
        <Main {...this.props} />
        <TodoFooter {...this.props} />
      </div>
    );
  }
}
