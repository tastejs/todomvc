import cx from "classnames";
import { h } from "preact";

export default function TodoFooter({ todos, route, onClearCompleted }) {
    const activeTodoCount = todos.filter((todo) => !todo.completed).length;
    const completedTodoCount = todos.length - activeTodoCount;

    return (
        <footer class="footer">
            <span class="todo-count">{`${activeTodoCount} ${activeTodoCount === 1 ? "item" : "items"} left!`}</span>
            <ul class="filters">
                <li>
                    <a href="#/" class={cx({ selected: route === "all" })}>
                        All
                    </a>
                </li>{" "}
                <li>
                    <a href="#/active" class={cx({ selected: route === "active" })}>
                        Active
                    </a>
                </li>{" "}
                <li>
                    <a href="#/completed" class={cx({ selected: route === "completed" })}>
                        Completed
                    </a>
                </li>
            </ul>
            {completedTodoCount > 0
                && <button class="clear-completed" onClick={onClearCompleted}>
                    Clear completed
                </button>
            }
        </footer>
    );
}
