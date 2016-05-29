import * as todoAppActions from '../actions/todo-app';

const { assign } = Object;

// Generates good-enough-for-a-demo keys using uuidv4.
const uuidv4 = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
const uuid = () => uuidv4.replace(/[xy]/g, c => {
	const r = Math.random() * 16 | 0;
	return (c == 'x' ? r : r & 0x3 | 0x8).toString(16);
});

// Persists todos to localStorage and
const initialState = {
	todos: JSON.parse(localStorage['diffhtml-todos'] || '[]'),

	getByStatus(type) {
		return this.todos.filter(todo => {
			switch (type) {
				case 'active': return !todo.completed;
				case 'completed': return todo.completed;
			}

			return true;
		})
	}
};

export default function todoApp(state = initialState, action) {
	switch (action.type) {
		case todoAppActions.ADD_TODO: {
			if (!action.title) { return state; }

			return assign({}, state, {
				todos: state.todos.concat({
					completed: false,
					editing: false,

					title: action.title.trim(),
					key: uuid()
				})
			});
		}

		case todoAppActions.REMOVE_TODO: {
			return assign({}, state, {
				todos: state.todos.filter(todo => todo.key !== action.key)
			});
		}

		case todoAppActions.TOGGLE_COMPLETION: {
			const index = state.todos.findIndex(todo => todo.key === action.key);
			const todo = state.todos[index];

			state.todos[index] = assign({}, todo, {
				completed: action.completed
			});

			return assign({}, state, {
				todos: [...state.todos]
			});
		}

		case todoAppActions.START_EDITING: {
			const index = state.todos.findIndex(todo => todo.key === action.key);
			const todo = state.todos[index];

			state.todos[index] = assign({}, todo, {
				editing: true
			});

			return assign({}, state, {
				todos: [...state.todos]
			});
		}

		case todoAppActions.STOP_EDITING: {
			const index = state.todos.findIndex(todo => todo.key === action.key);
			const todo = state.todos[index];

			state.todos[index] = assign({}, todo, {
				title: action.title,
				editing: false
			});

			return assign({}, state, {
				todos: [...state.todos]
			});
		}

		case todoAppActions.CLEAR_COMPLETED: {
			return assign({}, state, {
				todos: state.todos.filter(todo => todo.completed === false)
			});
		}

		case todoAppActions.TOGGLE_ALL: {
			return assign({}, state, {
				todos: state.todos.map(todo => assign({}, todo, {
					completed: action.completed
				}))
			});
		}

		default: {
			return state;
		}
	}
}
