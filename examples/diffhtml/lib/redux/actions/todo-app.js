export const ADD_TODO = 'ADD_TODO';
export const REMOVE_TODO = 'REMOVE_TODO';
export const TOGGLE_COMPLETION = 'TOGGLE_COMPLETION';
export const START_EDITING = 'START_EDITING';
export const STOP_EDITING = 'STOP_EDITING';
export const CLEAR_COMPLETED = 'CLEAR_COMPLETED';
export const TOGGLE_ALL = 'TOGGLE_ALL';

export function addTodo(title) {
	return {
		type: ADD_TODO,
		title
	};
}

export function removeTodo(index) {
	return {
		type: REMOVE_TODO,
		index
	};
}

export function toggleCompletion(index, completed) {
	return {
		type: TOGGLE_COMPLETION,
		index,
		completed
	};
}

export function startEditing(index) {
	return {
		type: START_EDITING,
		index
	};
}

export function stopEditing(index, title) {
	return {
		type: STOP_EDITING,
		index,
		title
	};
}

export function clearCompleted() {
	return {
		type: CLEAR_COMPLETED
	};
}

export function toggleAll(completed) {
	return {
		type: TOGGLE_ALL,
		completed
	};
}
