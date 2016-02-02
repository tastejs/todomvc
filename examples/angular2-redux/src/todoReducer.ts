import * as TodoActions from './todoActions';

const initialState = {
    todos: [],
    currentFilter: 'SHOW_ALL'
}

export function TodoReducer (state = initialState, action) {
    switch (action.type) {
        case TodoActions.ADD_TODO:
            return {
                todos: state.todos.concat({
                    id: action.id,
                    text: action.text,
                    editing: action.editing,
                    completed: action.completed
                }),
                currentFilter: state.currentFilter
            };
        case TodoActions.TOGGLE_TODO_EDIT:
            return {
                todos: toggleEdit(state.todos, action),
                currentFilter: state.currentFilter
            };
        case TodoActions.UPDATE_TODO:
            return {
                todos: updateTodo(state.todos, action),
                currentFilter: state.currentFilter
            };
        case TodoActions.TOGGLE_TODO_STATUS:
            return {
                todos: toggleStatus(state.todos, action),
                currentFilter: state.currentFilter
            };
        case TodoActions.TOGGLE_ALL_TODO_STATUS:
            return {
                todos: state.todos.map(todo => {
                    return {
                        id: todo.id,
                        text: todo.text,
                        editing: todo.editing,
                        completed: action.status
                    };
                }),
                currentFilter: state.currentFilter
            };
        case TodoActions.REMOVE_TODO:
            return {
                todos: state.todos.filter(todo => todo.id !== action.id),
                currentFilter: state.currentFilter
            };
        case TodoActions.REMOVE_COMPLETED_TODOS:
            return {
                todos: state.todos.filter(todo => todo.completed !== true),
                currentFilter: state.currentFilter
            };
        case TodoActions.SET_FILTER:
            return {
                todos: state.todos.map(todo => todo),
                currentFilter: action.filter
            };
        default:
            return state;
    }
};

function toggleEdit (todos, action) {
    return todos.map(todo => {
        if (todo.id !== action.id) {
            return todo;
        }

        return {
            id: todo.id,
            text: todo.text,
            editing: !todo.editing,
            completed: todo.completed
        };
    })
}

function updateTodo (todos, action) {
    return todos.map(todo => {
        if (todo.id !== action.id) {
            return todo;
        }

        return {
            id: todo.id,
            text: action.text,
            editing: action.editing,
            completed: todo.completed
        };
    });
}

function toggleStatus (todos, action) {
    return todos.map(todo => {
        if (todo.id !== action.id) {
            return todo;
        }

        return {
            id: todo.id,
            text: todo.text,
            editing: todo.editing,
            completed: !todo.completed
        };
    });
}
