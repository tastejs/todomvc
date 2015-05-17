/**
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 * 
 * Typescript port by Bernd Paradies, May 2015
 * @see https://github.com/facebook/flux/blob/master/examples/flux-todomvc/js/components/MainSection.react.js
 *
 */

import React = require('react/addons');
import TodoActions = require('../actions/TodoActions');
import TodoItem = require('./TodoItem.jsx');
import ReactComponent = require('../react/ReactComponent');
import ReactJSX = require('../react/ReactJSX');

var ReactPropTypes: React.ReactPropTypes = React.PropTypes;

interface MainSectionElement {
  id: string;
}

class MainSection extends ReactComponent<TodoState,any> {

  static propTypes: React.ValidationMap<TodoState> =  {
    allTodos: ReactPropTypes.object.isRequired,
    areAllComplete: ReactPropTypes.bool.isRequired
  };

  /**
   * Event handler to mark all TODOs as complete
   */
  private _onToggleCompleteAll: () => void =
    (): void => {
      TodoActions.toggleCompleteAll();
    };

  /**
   * @return {object}
   */
  public render(): React.ReactElement<MainSectionElement>  {
    var key: string;
    var todos: React.ReactElement<TodoItemProps>[];
    var allTodos: MapStringTo<TodoData>;

    // This section should be hidden by default
    // and shown when there are todos.
    if (Object.keys(this.props.allTodos).length < 1) {
      return null;
    }

    allTodos = this.props.allTodos;
    todos = [];

    for (key in allTodos) {
      if( allTodos.hasOwnProperty(key) )
      {
	       todos.push(
			     ReactJSX<TodoItemProps>(`<TodoItem key={key} todo={allTodos[key]} />`,
						 this,
						 {
						  TodoItem: TodoItem,
						  allTodos: allTodos,
						  key: key
						 })
	       );
      }
    }

    return ReactJSX<MainSectionElement>(`
      <section id='main'>
	     <input
	       id='toggle-all'
	       type='checkbox'
	       onChange={this._onToggleCompleteAll}
	       checked={this.props.areAllComplete ? 'checked' : ''}
	     />
	     <label htmlFor='toggle-all'>Mark all as complete</label>
	     <ul id='todo-list'>{todos}</ul>
      </section>`,
      this,
      {
	     'todos': todos
      });
  }
};

export = MainSection;
