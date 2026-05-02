import { useMemo, useCallback } from "react";
import { useLocation } from "react-router-dom";

import { Item } from "./item";

import { TOGGLE_ALL } from "../constants";

export function Main({ todos, dispatch }) {
    const { pathname: route } = useLocation();

    const visibleTodos = useMemo(
        () =>
            todos.filter((todo) => {
                if (route === "/active")
                    return !todo.completed;

                if (route === "/completed")
                    return todo.completed;

                return todo;
            }),
        [todos, route]
    );

    const toggleAll = useCallback((e) => dispatch({ type: TOGGLE_ALL, payload: { completed: e.target.checked } }), [dispatch]);

    return (
        <main className="main" data-testid="main" hidden={todos.length === 0}>
            <div className="toggle-all-container">
                <input
                    className="toggle-all"
                    type="checkbox"
                    id="toggle-all"
                    data-testid="toggle-all"
                    checked={visibleTodos.length > 0 && visibleTodos.every((todo) => todo.completed)}
                    onChange={toggleAll}
                />
                <label className="toggle-all-label" htmlFor="toggle-all">
                    Toggle All Input
                </label>
            </div>
            <ul className="todo-list" data-testid="todo-list">
                {visibleTodos.map((todo) => (
                    <Item todo={todo} key={todo.id} dispatch={dispatch} />
                ))}
            </ul>
        </main>
    );
}
