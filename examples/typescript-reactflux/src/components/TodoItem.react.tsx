/**
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

import React = require('react/addons');
var ReactPropTypes = React.PropTypes;
import TodoActions = require('../actions/TodoActions');
import TodoTextInput = require('./TodoTextInput.react');
import ReactComponent = require('../react/ReactComponent');

import cx = require('react/lib/cx');

interface TodoItemState
{
  isEditing: boolean;
}

interface TodoItemElement
{
  className: any;
  key: string;
}

class TodoItem extends ReactComponent<TodoItemProps,TodoItemState> {

  static propTypes: React.ValidationMap<TodoItemProps> =  {
    todo: ReactPropTypes.object.isRequired
  };


  private _onToggleComplete = () => {
    TodoActions.toggleComplete(this.props.todo);
  };

  private _onDoubleClick = () => {
    this.setState({isEditing: true});
  };

  /**
   * Event handler called within TodoTextInput.
   * Defining this here allows TodoTextInput to be used in multiple places
   * in different ways.
   * @param  {string} text
   */
  private _onSave = (text: string) => {
    TodoActions.updateText(this.props.todo.id, text);
    this.setState({isEditing: false});
  };

  private _onDestroyClick = () => {
    TodoActions.destroy(this.props.todo.id);
  };

  public getDerivedInitialState(): TodoItemState {
    return {
      isEditing: false
    };
  }

  /**
   * @return {object}
   */
  public render(): React.DOMElement<TodoItemElement> {
    var todo = this.props.todo;
    // this.state = this.state || this.getInitialState();

    var input: React.ReactElement<TodoTextInputElement>;
    if (this.state.isEditing) {
      input = React.jsx(`
        <TodoTextInput
          className="edit"
          onSave={this._onSave}
          value={todo.text}
        />`);
    }

    // List items should get the class 'editing' when editing
    // and 'completed' when marked as completed.
    // Note that 'completed' is a classification while 'complete' is a state.
    // This differentiation between classification and state becomes important
    // in the naming of view actions toggleComplete() vs. destroyCompleted().
    return (React.jsx(`
      <li
        className={cx({
          'completed': todo.complete,
          'editing': this.state.isEditing
        })}
        key={todo.id}>
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={todo.complete}
            onChange={this._onToggleComplete}
          />
          <label onDoubleClick={this._onDoubleClick}>
            {todo.text}
          </label>
          <button className="destroy" onClick={this._onDestroyClick} />
        </div>
        {input}
      </li>
    `));
  }


};

export = TodoItem;
