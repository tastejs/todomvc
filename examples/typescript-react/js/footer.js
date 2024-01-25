"use strict";
/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*global React */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoFooter = void 0;
/// <reference path="./interfaces.d.ts"/>
const classNames = __importStar(require("classnames"));
const React = __importStar(require("react"));
const constants_1 = require("./constants");
const utils_1 = require("./utils");
class TodoFooter extends React.Component {
    render() {
        var activeTodoWord = utils_1.Utils.pluralize(this.props.count, 'item');
        var clearButton = null;
        if (this.props.completedCount > 0) {
            clearButton = (<button className="clear-completed" onClick={this.props.onClearCompleted}>
          Clear completed
        </button>);
        }
        const nowShowing = this.props.nowShowing;
        return (<footer className="footer">
        <span className="todo-count">
          <strong>{this.props.count}</strong> {activeTodoWord} left
        </span>
        <ul className="filters">
          <li>
            <a href="#/" className={classNames({ selected: nowShowing === constants_1.ALL_TODOS })}>
                All
            </a>
          </li>
          {' '}
          <li>
            <a href="#/active" className={classNames({ selected: nowShowing === constants_1.ACTIVE_TODOS })}>
                Active
            </a>
          </li>
          {' '}
          <li>
            <a href="#/completed" className={classNames({ selected: nowShowing === constants_1.COMPLETED_TODOS })}>
                Completed
            </a>
          </li>
        </ul>
        {clearButton}
      </footer>);
    }
}
exports.TodoFooter = TodoFooter;
