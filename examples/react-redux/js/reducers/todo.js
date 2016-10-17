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
			if (state.id !== action.id) {
				return state;
			}

			return toggleTodo(state);
		case actionTypes.TOGGLE_ALL:
			return action.toggleTo === state.completed ? state : toggleTodo(state);
		case actionTypes.EDIT_TODO:
			if (state.id !== action.id) {
				return state;
			}

			return {
				// Object spread operator is not supported by jshint yet
				/* jshint ignore:start */
				...state,
				/* jshint ignore:end */
				text: action.newText
			};
		default:
			return state;
	}
};

export default todo;
