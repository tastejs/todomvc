import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import Item from "./item";
import Footer from "./footer";
import {
    selectCompletedCount,
    selectTodos,
    selectVisibleTodos,
    toggleAll,
} from "../store";

export default function Main() {
    const dispatch = useDispatch();
    const location = useLocation();
    const todos = useSelector(selectTodos);
    const visibleTodos = useSelector(selectVisibleTodos(location.pathname));
    const completedCount = useSelector(selectCompletedCount);
    const activeCount = todos.length - completedCount;

    if (todos.length === 0) return null;

    return (
        <main className="main" data-testid="main">
            <div className="toggle-all-container">
                <input
                    id="toggle-all"
                    className="toggle-all"
                    type="checkbox"
                    data-testid="toggle-all"
                    checked={completedCount === todos.length}
                    onChange={() => dispatch(toggleAll())}
                />
                <label className="toggle-all-label" htmlFor="toggle-all">
                    Toggle All Input
                </label>
            </div>
            <ul className="todo-list" data-testid="todo-list">
                {visibleTodos.map((todo) => (
                    <Item key={todo.id} todo={todo} />
                ))}
            </ul>
            <Footer
                completedCount={completedCount}
                activeCount={activeCount}
                filter={location.pathname}
            />
        </main>
    );
}
