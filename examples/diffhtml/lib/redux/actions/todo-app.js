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

export function removeTodo(key) {
	return {
		type: REMOVE_TODO,
		key
	};
}

export function toggleCompletion(key, completed) {
	return {
		type: TOGGLE_COMPLETION,
		key,
		completed
	};
}

export function startEditing(key) {
	return {
		type: START_EDITING,
		key
	};
}

export function stopEditing(key, title) {
	return {
		type: STOP_EDITING,
		key,
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
