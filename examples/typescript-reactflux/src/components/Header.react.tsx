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
import TodoActions = require('../actions/TodoActions');
import TodoTextInput = require('./TodoTextInput.react');
import ReactComponent = require('../react/ReactComponent');

interface HeaderProps
{
}

interface HeaderElement
{
  id: string;
}

class Header extends ReactComponent<HeaderProps,any> {


  /**
   * Event handler called within TodoTextInput.
   * Defining this here allows TodoTextInput to be used in multiple places
   * in different ways.
   * @param {string} text
   */
  private _onSave: (text: string) => void =
    (text: string): void => {
      if (text.trim()){
        TodoActions.create(text);
      }
    };

  /**
   * @return {object}
   */
  public render(): React.DOMElement<HeaderElement> {
    return (
        React.jsx(`<header id="header">
        <h1>todos</h1>
        <TodoTextInput
          id="new-todo"
          placeholder="What needs to be done?"
          onSave={this._onSave}
        />
      </header>`)
    );
  }

};

export = Header;
