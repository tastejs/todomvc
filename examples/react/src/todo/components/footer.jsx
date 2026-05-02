import { useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import classnames from "classnames";

import { REMOVE_COMPLETED_ITEMS } from "../constants";

export function Footer({ todos, dispatch }) {
    const { pathname: route } = useLocation();

    const activeTodos = useMemo(() => todos.filter((todo) => !todo.completed), [todos]);
    const completedCount = todos.length - activeTodos.length;

    const removeCompleted = useCallback(() => dispatch({ type: REMOVE_COMPLETED_ITEMS }), [dispatch]);

    return (
        <footer className="footer" data-testid="footer" hidden={todos.length === 0}>
            <span className="todo-count">{`${activeTodos.length} ${activeTodos.length === 1 ? "item" : "items"} left!`}</span>
            <ul className="filters" data-testid="footer-navigation">
                <li>
                    <a className={classnames({ selected: route === "/" })} href="#/">All</a>
                </li>
                <li>
                    <a className={classnames({ selected: route === "/active" })} href="#/active">Active</a>
                </li>
                <li>
                    <a className={classnames({ selected: route === "/completed" })} href="#/completed">Completed</a>
                </li>
            </ul>
            <button
                className="clear-completed"
                hidden={completedCount === 0}
                onClick={removeCompleted}
            >
                Clear completed
            </button>
        </footer>
    );
}
