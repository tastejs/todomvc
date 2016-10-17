import { v4 } from 'node-uuid';
import * as actionTypes from './actionTypes';

export const addTodo = (text) => ({
	type: actionTypes.ADD_TODO,

	// Creates a random id
	id: v4(),

	// text property of the new todo
	text
});

export const toggleTodo = (id) => ({
	type: actionTypes.TOGGLE_TODO,
	id
});

export const toggleAll = () => ({
	type: actionTypes.TOGGLE_ALL
});

export const editTodo = (todo) => ({
	type: actionTypes.EDIT_TODO,
	todo
});

export const removeTodo = (id) => ({
	type: actionTypes.REMOVE_TODO,
	id
});

export const removeCompleted = () => ({
	type: actionTypes.REMOVE_COMPLETED_TODOS
});
