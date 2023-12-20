import { h } from "preact";

import TodoItem from "./item";
import { FILTERS } from "./utils";

export default function TodoMain({ onChange, onToggle, onRemove, onSave, todos, route }) {
    const visibleTodos = todos.filter(FILTERS[route]);
    const activeTodoCount = todos.filter(FILTERS["active"]).length;

    return (
        <main class="main">
            <div class="toggle-all-container">
                <input class="toggle-all" type="checkbox" checked={activeTodoCount === 0} onChange={onChange} />
                <label class="toggle-all-label" htmlFor="toggle-all">
                    Toggle All Input
                </label>
            </div>
            <ul class="todo-list">
                {visibleTodos.map((todo, index) =>
                    <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onRemove={onRemove} onSave={onSave} index={index} />
                )}
            </ul>
        </main>
    );
}
