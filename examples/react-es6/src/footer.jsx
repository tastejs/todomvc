import React from 'react';
import * as Utils from './utils';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';

const TodoFooter = props => {
  const activeTodoWord = Utils.pluralize(props.count, 'item');
  let clearButton = null;
  if (props.completedCount > 0) {
    clearButton = (
      <button className="clear-completed" onClick={props.onClearCompleted}>
        Clear completed
      </button>
    );
  }

  const nowShowing = props.nowShowing;

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{props.count}</strong> {activeTodoWord} left
      </span>
      <ul className="filters">
        <li>
          <NavLink
            to="/"
            className={classNames({
              selected: nowShowing === 'all'
            })}>
            All
          </NavLink>
        </li>{' '}
        <li>
          <NavLink
            to="/active"
            className={classNames({
              selected: nowShowing === 'active'
            })}>
            Active
          </NavLink>
        </li>{' '}
        <li>
          <NavLink
            to="/completed"
            ClassName={classNames({
              selected: nowShowing === 'completed'
            })}>
            Completed
          </NavLink>
        </li>
      </ul>
      {clearButton}
    </footer>
  );
};

export default TodoFooter;
