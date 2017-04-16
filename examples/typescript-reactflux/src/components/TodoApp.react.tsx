/**
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

/**
 * This component operates as a "Controller-View".  It listens for changes in
 * the TodoStore and passes the new data to its children.
 */

import Footer = require('./Footer.react');
import Header = require('./Header.react');
import MainSection = require('./MainSection.react');
import React = require('react/addons');
import TodoStore = require('../stores/TodoStore');
import ReactComponent = require('../react/ReactComponent');

interface TodoAppProps
{
}

interface TodoAppElement
{
  className: string;
}

/**
 * Retrieve the current TODO data from the TodoStore
 */
function getTodoState(): TodoState {
  return {
    allTodos: TodoStore.getAll(),
    areAllComplete: TodoStore.areAllComplete()
  };
}

class TodoApp extends ReactComponent<TodoAppProps,TodoState> {


  /**
   * Event handler for 'change' events coming from the TodoStore
   */
  private _onChange = () => {
    this.setState(getTodoState());
  };

  public componentDidMount: () => void =
    (): void => {
      TodoStore.addChangeListener(this._onChange);
    };

  public componentWillUnmount: () => void =
    (): void => {
      TodoStore.removeChangeListener(this._onChange);
    };

  public getDerivedInitialState(): TodoState {
    return getTodoState();
  }

  /**
   * @return {object}
   */
  public render(): React.DOMElement<TodoAppElement> {
    // this.state = this.state || this.getInitialState();

  	return (React.jsx(`
      <div>
        <Header />
        <MainSection
          allTodos={this.state.allTodos}
          areAllComplete={this.state.areAllComplete}
        />
        <Footer allTodos={this.state.allTodos} />
      </div>
  	`));
  }
};

export = TodoApp;
