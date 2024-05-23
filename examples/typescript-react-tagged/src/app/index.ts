import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { AppProps, Action, Todo, TodoFilter, assertNever } from '../shared';
import { controller } from './controller';
import { AppContent } from '../components';


export class App extends React.Component<{}, AppProps> {
  constructor(p) {
    super(p);
    this.state = {
      appStateId: 0,
      filter: TodoFilter.All,
      controller: x => this.appController(x),
      todos: []
    };
  }

  componentDidMount() {
    this.appController({name: "init"});
  }

  private appController(action: Action) {
    // console.log(["action", action]);
    const f = controller(action);
    if (f) {
      this.setState((s,p) => {
        s.appStateId += 1;
        return f(s);
      });
    }
  }

  render() {
    return React.createElement(AppContent, this.state);
  }
}

ReactDOM.render(
  React.createElement(App, {}),
  document.getElementsByClassName('todoapp')[0]);

