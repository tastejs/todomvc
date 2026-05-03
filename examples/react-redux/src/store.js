import { configureStore, createSlice, nanoid } from "@reduxjs/toolkit";

const todosSlice = createSlice({
    name: "todos",
    initialState: [],
    reducers: {
        addTodo: {
            reducer(state, action) {
                state.push(action.payload);
            },
            prepare(text) {
                return { payload: { id: nanoid(), text, completed: false } };
            },
        },
        deleteTodo(state, action) {
            return state.filter((todo) => todo.id !== action.payload);
        },
        editTodo(state, action) {
            const todo = state.find((t) => t.id === action.payload.id);
            if (todo) todo.text = action.payload.text;
        },
        toggleTodo(state, action) {
            const todo = state.find((t) => t.id === action.payload);
            if (todo) todo.completed = !todo.completed;
        },
        toggleAll(state) {
            const allCompleted = state.every((todo) => todo.completed);
            for (const todo of state) {
                todo.completed = !allCompleted;
            }
        },
        clearCompleted(state) {
            return state.filter((todo) => !todo.completed);
        },
    },
});

export const { addTodo, deleteTodo, editTodo, toggleTodo, toggleAll, clearCompleted } = todosSlice.actions;

export const store = configureStore({
    reducer: { todos: todosSlice.reducer },
});

export const FILTERS = {
    "/": (todos) => todos,
    "/all": (todos) => todos,
    "/active": (todos) => todos.filter((t) => !t.completed),
    "/completed": (todos) => todos.filter((t) => t.completed),
};

export const selectVisibleTodos = (pathname) => (state) =>
    (FILTERS[pathname] ?? FILTERS["/"])(state.todos);

export const selectCompletedCount = (state) =>
    state.todos.filter((todo) => todo.completed).length;

export const selectTodos = (state) => state.todos;
