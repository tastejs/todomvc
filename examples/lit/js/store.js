import { createSlice, configureStore } from '@reduxjs/toolkit'

const { actions: todoStoreActions, reducer: todoStoreReducer } = createSlice({
    name: 'todoStore',
    initialState: {
        todos: {},
        completed: [],
        editingTodo: 0
    },
    reducers: {
        setTodo: (state, { payload }) => {
            state.todos[payload.id] = payload
        },
        removeTodos: (state, { payload }) => {
            payload.forEach((id) => (
                delete state.todos[id]
            ))
        },
        appendCompleted: (state, { payload }) => {
            console.log('appendCompleted', payload)
            state.completed.push(payload)
        },
        removeCompleted: (state, { payload }) => {
            state.completed.splice(
                state.completed.findIndex((id) => id === payload),
                1
            )
        },
        clearCompleted: (state) => {
            state.completed = []
        },
        setEdit: (state, { payload }) => {
            state.editingTodo = payload
        },
        leaveEdit: (state) => {
            state.editingTodo = 0
        }
    }
})

const store = configureStore({
    reducer: todoStoreReducer
})

const {
    setTodo, removeTodos, appendCompleted, removeCompleted,
    clearCompleted, setEdit, leaveEdit
} = todoStoreActions

export const deleteTodo = (id) => {
    store.dispatch(removeCompleted(id))
    store.dispatch(removeTodos([id]))
}

export const deleteCompleted = () => {
    const state = store.getState()

    store.dispatch(removeTodos(state.completed))
    store.dispatch(clearCompleted())
}

export const toggleTodos = (items) => {
    const state = store.getState()
    items.forEach((id) => {
        let todo = state.todos[id]
        let todoState = !todo.completed;

        todoState
            ? store.dispatch(appendCompleted(id))
            : store.dispatch(removeCompleted(id))

        store.dispatch(setTodo({ ...todo, completed: todoState }))
    })
}

export const markAll = () => {
    let state = store.getState()
    let shouldMarkAll = state.completed.length === Object.keys(state.todos).length;

    if (shouldMarkAll) {
        const items = Array.from(Object.keys(state.todos));
        return toggleTodos(items)
    }

    const filterItems = (acc, item) =>
        item.completed ? acc : acc.concat(item.id);

    const items = Array.from(Object.values(state.todos))
        .reduce(filterItems, []);

    store.dispatch(toggleTodos(items))
}

export const addTodoByText = (text) => {
    store.dispatch(setTodo({
        text,
        completed: false,
        id: Date.now()
    }))
}

export const getTodos = (filter) => {
    let { todos } = store.getState()
    console.log(11, store.getState());
    return Object.entries(todos).reduce((prev, [id, todo]) => {
        if (
            !filter ||
            filter === 'all' ||
            (filter === 'active' && !todo.completed) ||
            (filter === 'completed' && todo.completed)
        ) {
            prev[id] = todo
            return prev
        }

        return prev
    }, {})
}

export {
    store, setTodo, appendCompleted, clearCompleted, setEdit, leaveEdit
}
