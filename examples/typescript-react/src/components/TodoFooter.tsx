import React from 'react';
import { NavLink } from 'react-router-dom';

interface ITodoFooterProps {
  remainingTodosCount: number;
  completedCount: number;
  onClearCompleted: () => void;
}

const TodoFooter: React.FC<ITodoFooterProps> = (props) => {
  const { remainingTodosCount, completedCount, onClearCompleted } = props;

  const itemCountLabel = remainingTodosCount > 1 ? 'items' : 'item';

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{remainingTodosCount}</strong> {itemCountLabel} left
      </span>
      <ul className="filters">
        <li>
          <NavLink exact to="/" activeClassName="selected">
            All
          </NavLink>
        </li>
        <li>
          <NavLink to="/active" activeClassName="selected">
            Active
          </NavLink>
        </li>
        <li>
          <NavLink to="/completed" activeClassName="selected">
            Completed
          </NavLink>
        </li>
      </ul>
      {completedCount > 0 && (
        <button className="clear-completed" onClick={onClearCompleted}>
          Clear completed
        </button>
      )}
    </footer>
  );
};

export default TodoFooter;
