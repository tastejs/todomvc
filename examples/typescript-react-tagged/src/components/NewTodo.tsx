import * as React from 'react';

import { AppProps, Action, Todo, KEY_ENTER, KEY_ESCAPE } from '../shared';

export class NewTodo extends React.Component<AppProps, { editValue: string}> {
  constructor(p) {
    super(p);
    this.state = { editValue: "" };
  }

  private handleKeyDown(event : React.KeyboardEvent<any>) {
    if (event.keyCode === KEY_ESCAPE) {
      this.setState(s => {
        s.editValue = "";
        return s;
      });
    } else if (event.keyCode === KEY_ENTER) {
      this.setState(s => {
        this.props.controller({ name: "todoAdd", title: s.editValue });
        s.editValue = "";
        return s;
      });
    }
  }
  
  render() {
    return (
      <input
        value={this.state.editValue}
        className="new-todo"
        placeholder="What needs to be done?"
        onChange={ (e:any) => this.setState({ editValue: e.target.value }) }
        onKeyDown={ e => this.handleKeyDown(e)}
        autoFocus={true}
      />
    );
  }
}

