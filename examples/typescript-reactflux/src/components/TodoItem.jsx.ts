/**
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 * 
 * Typescript port by Bernd Paradies, May 2015
 * @see https://github.com/facebook/flux/blob/master/examples/flux-todomvc/js/components/TodoItem.react.js
 *
 */

///<reference path='../../typings/react-jsx/react-jsx.d.ts'/>

import React = require('react/addons');
import TodoActions = require('../actions/TodoActions');
import TodoTextInput = require('./TodoTextInput.jsx');
import ReactComponent = require('../react/ReactComponent');
import ReactJSX = require('../react/ReactJSX');
import cx = require('react/lib/cx');

var ReactPropTypes = React.PropTypes;

interface TodoItemState {
  isEditing: boolean;
}

interface TodoItemElement {
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
    if( text.length > 0 )
    {
      TodoActions.updateText(this.props.todo.id, text);
      this.setState({isEditing: false});
    }	 
    else
    {
      this._onDestroyClick(); 
    }
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
  public render(): React.ReactElement<TodoItemElement> {
    var todo = this.props.todo;
    // this.state = this.state || this.getInitialState();

    var input: React.ReactElement<TodoTextInputElement>;
    if (this.state.isEditing) {
      input = ReactJSX<TodoTextInputElement>(`
	     <TodoTextInput
	       className='edit'
	       onSave={this._onSave}
	       value={todo.text}
	     />`,
	     this,
	     {
	       TodoTextInput: TodoTextInput,
	       todo: todo
	     });
    }

    // List items should get the class 'editing' when editing
    // and 'completed' when marked as completed.
    // Note that 'completed' is a classification while 'complete' is a state.
    // This differentiation between classification and state becomes important
    // in the naming of view actions toggleComplete() vs. destroyCompleted().
    return ReactJSX<TodoItemElement>(`
      <li
				className={cx({
					'completed': todo.complete,
					'editing': this.state.isEditing
				})}
				key={todo.id}>
				<div className='view'>
				<input
						className='toggle'
				    type='checkbox'
						checked={todo.complete}
				    onChange={this._onToggleComplete}
				/>
				<label onDoubleClick={this._onDoubleClick}>
					{todo.text}
				</label>
				<button className='destroy' onClick={this._onDestroyClick} />
				</div>
				{input}
      </li>
    `,
    this,
    {
      'todo': todo,
      'cx': cx,
      'input': input
    });
  }


};

export = TodoItem;
