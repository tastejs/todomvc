import todo from './todo';
import * as actionTypes from '../actions/actionTypes';

// Suppress "Regular parameters should not come after default parameters"
/* jshint -W138 */
const todos = (state = [], action) => {
	switch (action.type) {

		case actionTypes.ADD_TODO:
			// Returns a new array with previous todos
			// and the new todo returned by the todo reducer
			return [
				// Object spread operator is not supported by jshint yet
				/* jshint ignore:start */
				...state,
				/* jshint ignore:end */
				todo(undefined, action)
			];

		case actionTypes.TOGGLE_TODO:
			// Delegates to todo reducer
			return state.map(todoItem => todo(todoItem, action));

		case actionTypes.TOGGLE_ALL:
			// Calculates the new completed boolean value
			const toggleTo = !!state.find(todo => !todo.completed);

			return state.map(todoItem => todo(todoItem, {
				// Object spread operator is not supported by jshint yet
				/* jshint ignore:start */
				...action,
				/* jshint ignore:end */
				toggleTo
			}));

		case actionTypes.EDIT_TODO:
			return state.map(todoItem => todo(todoItem, action));
		case actionTypes.REMOVE_TODO:
			return state.filter(todoItem => todoItem.id !== action.id);

		case actionTypes.REMOVE_COMPLETED_TODOS:
			return state.filter(todoItem => !todoItem.completed);

		default:
			return state;
	}
};

export default todos;
