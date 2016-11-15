import * as actionTypes from '../actions/actionTypes';

const toggleTodo = state => {
	return {
		// Object spread operator is not supported by jshint yet
		/* jshint ignore:start */
		...state,
		/* jshint ignore:end */
		completed: !state.completed
	};
};

// This supress the "Regular parameters should not come after default parameters" jshint error
/* jshint -W138 */
const todo = (state = {}, action) => {
	switch (action.type) {
		case actionTypes.ADD_TODO:
			return {
				id: action.id,
				text: action.text,
				completed: false
			};
		case actionTypes.TOGGLE_TODO:
			return state.id !== action.id ? state : toggleTodo(state);
		case actionTypes.TOGGLE_ALL:
			return action.toggleTo === state.completed ? state : toggleTodo(state);
		case actionTypes.EDIT_TODO:
			return state.id !== action.todo.id ? state : {
				// Object spread operator is not supported by jshint yet
				/* jshint ignore:start */
				...state,
				...action.todo
				/* jshint ignore:end */
			};
		default:
			return state;
	}
};

export default todo;
