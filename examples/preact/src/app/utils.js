export const FILTERS = {
    all: (todo) => true,
    active: (todo) => !todo.completed,
    completed: (todo) => todo.completed,
};
