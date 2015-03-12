/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

///<reference path="../../typings/todomfc/todomfc.d.ts"/>

'use strict';

import React = require('react/addons');
import ReactComponent = require('../react/ReactComponent');


var ReactPropTypes: React.ReactPropTypes = React.PropTypes;
import TodoActions = require('../actions/TodoActions');

interface FooterProps
{
  allTodos: MapStringTo<TodoData>;
}

interface FooterElement
{
  id: string;
}

interface ClearCompletedButton
{
  id: string;
  onClick: () => void;
}

class Footer extends ReactComponent<FooterProps,any> {

  static propTypes: React.ValidationMap<FooterProps> =  {
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
  public render(): React.DOMElement<FooterElement> {

    var allTodos: MapStringTo<TodoData> = this.props.allTodos;
    var total: number = Object.keys(allTodos).length;
    var completed: number = 0;
    var key: string;
    var itemsLeft: number;
    var itemsLeftPhrase: string;
    var clearCompletedButton:  React.DOMElement<ClearCompletedButton>;

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
          React.jsx(`<button
          id="clear-completed"
          onClick={this._onClearCompletedClick}>
          Clear completed ({completed})
        </button>`);
    }

    return (
        React.jsx(`<footer id="footer">
        <span id="todo-count">
          <strong>
            {itemsLeft}
          </strong>
          {itemsLeftPhrase}
        </span>
        {clearCompletedButton}
      </footer>`)
    );
  }
}

export = Footer;
