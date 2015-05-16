/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * Typescript port by Bernd Paradies, May 2015
 * @see https://github.com/facebook/flux/blob/master/examples/flux-todomvc/js/components/Footer.react.js
 */

///<reference path="../../typings/todomvc/todomvc.d.ts"/>

import React = require('react/addons');
import ReactComponent = require('../react/ReactComponent');
import ReactJSX = require('../react/ReactJSX');
import TodoActions = require('../actions/TodoActions');

var ReactPropTypes: React.ReactPropTypes = React.PropTypes;

interface FooterProps {
  allTodos: MapStringTo<TodoData>;
}

interface FooterElement {
  id: string;
}

interface ClearCompletedButton {
  id: string;
  onClick: () => void;
}

class Footer extends ReactComponent<FooterProps,any> {

  static propTypes: React.ValidationMap<FooterProps> =	{
    allTodos: ReactPropTypes.object.isRequired
  };

  /**
   * Event handler to delete all completed TODOs
   */
  private _onClearCompletedClick: () => void =
    (): void => {
      TodoActions.destroyCompleted();
    };

  /**
   * @return {object}
   */
  public render(): React.ReactElement<FooterElement> {

    var allTodos: MapStringTo<TodoData> = this.props.allTodos;
    var total: number = Object.keys(allTodos).length;
    var completed: number = 0;
    var key: string;
    var itemsLeft: number;
    var itemsLeftPhrase: string;
    var clearCompletedButton:  React.ReactElement<ClearCompletedButton>;

    if (total === 0) {
      return null;
    }

    for (key in allTodos) {
      if (allTodos[key].complete) {
	     completed++;
      }
    }

    itemsLeft = total - completed;
    itemsLeftPhrase = itemsLeft === 1 ? ' item ' : ' items ';
    itemsLeftPhrase += 'left';

    // Undefined and thus not rendered if no completed items are left.
    if (completed) {
      clearCompletedButton =
	     ReactJSX<ClearCompletedButton>(`
				<button
	       id="clear-completed"
	       onClick={this._onClearCompletedClick}>
	       Clear completed ({completed})
				</button>`,
				this,
				{
					completed: completed
				});
    }

    return ReactJSX<FooterElement>(`
      <footer id="footer">
	     <span id="todo-count">
	       <strong>
	       {itemsLeft}
	       </strong>
	       {itemsLeftPhrase}
	     </span>
	     {clearCompletedButton}
      </footer>`,
      this,
      {
	      'itemsLeft': itemsLeft,
	      'itemsLeftPhrase': itemsLeftPhrase,
	      'clearCompletedButton': clearCompletedButton
      }
    );
  }
}

export = Footer;
