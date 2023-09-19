import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from "../constants/todo-filters";

function getFilteredTodos(todos, filter) {
    switch (filter) {
        case SHOW_ALL:
            return todos;
        case SHOW_COMPLETED:
            return todos.filter((t) => t.completed);
        case SHOW_ACTIVE:
            return todos.filter((t) => !t.completed);
        default:
            throw new Error(`Unknown filter: ${filter}.`);
    }
}

export function getVisibleTodos(todos, route) {
    return getFilteredTodos(todos, route);
}

export function getCompletedTodos(todos) {
    return getFilteredTodos(todos, SHOW_COMPLETED);
}
