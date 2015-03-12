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
import ReactComponent = require('../react/ReactComponent');

var ENTER_KEY_CODE = 13;

interface TodoTextInputState
{
  value: string;
}

interface TodoTextInputProps
{
  className: string;
  id: string;
  placeholder: string;
  onSave: (value:string) => void;
  value: string;
}



interface InputEvent {
  target: HTMLInputElement;
}

// Probably a bug in the typings. If you use 'TodoTextInputProps' instead of 'any':
// class TodoTextInput extends React.Component<TodoTextInputProps,TodoTextInputState> {
// you'll get this error:
// .../fluxts-todomvc/build/src/components/Header.react.ts(32,29):
// error TS2345: Argument of type 'typeof TodoTextInput' is not assignable to parameter of type 'string'.

class TodoTextInput extends ReactComponent<any,TodoTextInputState> {

  static propTypes: React.ValidationMap<TodoState> =  {
    className: ReactPropTypes.string,
    id: ReactPropTypes.string,
    placeholder: ReactPropTypes.string,
    onSave: ReactPropTypes.func.isRequired,
    value: ReactPropTypes.string
  };


  /**
   * Invokes the callback passed in as onSave, allowing this component to be
   * used in different ways.
   */
  private _save = () => {
    this.props.onSave(this.state.value);
    this.setState({
      value: ''
    });
  };

  /**
   * @param {object} event
   */
  private _onChange = (event: InputEvent) => {
    this.setState({
      value: event.target.value
    });
  };

  /**
   * @param  {object} event
   */
  private _onKeyDown = (event: KeyboardEvent) => {
    if (event.keyCode === ENTER_KEY_CODE) {
      this._save();
    }
  };

  public getDerivedInitialState(): TodoTextInputState {
    return {
      value: this.props.value || ''
    };
  }

  /**
   * @return {object}
   */
  public render(): React.DOMElement<TodoTextInputElement> {
    // this.state = this.state || this.getInitialState();
    return (React.jsx(`
      <input
        className={this.props.className}
        id={this.props.id}
        placeholder={this.props.placeholder}
        onBlur={this._save}
        onChange={this._onChange}
        onKeyDown={this._onKeyDown}
        value={this.state.value}
        autoFocus={true}
      />
    `));
  }

};

export = TodoTextInput;
