import * as types from "../constants/action-types";

export const addTodo = (text) => ({ type: types.ADD_TODO, text });
export const deleteTodo = (id) => ({ type: types.DELETE_TODO, id });
export const editTodo = (id, text) => ({ type: types.EDIT_TODO, id, text });
export const toggleTodo = (id) => ({ type: types.TOGGLE_TODO, id });
export const toggleAll = () => ({ type: types.TOGGLE_ALL });
export const clearCompleted = () => ({ type: types.CLEAR_COMPLETED });
