export const ADD_TODO = 'ADD_TODO';
export const TOGGLE_TODO_EDIT = 'TOGGLE_TODO_EDIT';
export const UPDATE_TODO = 'UPDATE_TODO';
export const TOGGLE_TODO_STATUS = 'TOGGLE_TODO_STATUS';
export const TOGGLE_ALL_TODO_STATUS = 'TOGGLE_ALL_TODO_STATUS';
export const REMOVE_TODO = 'REMOVE_TODO';
export const REMOVE_COMPLETED_TODOS = 'REMOVE_COMPLETED_TODOS';
export const SET_FILTER = 'SET_FILTER';

export class TodoActions {
    nextToDoId: number;

    constructor() {
        this.nextToDoId = 0;
    }

    add(text) {
        return {
            type: ADD_TODO,
            id: this.nextToDoId++,
            text: text,
            editing: false,
            completed: false
        };
    }

    toggleEdit(id) {
        return {
            type: TOGGLE_TODO_EDIT,
            id: id
        };
    }

    update(todo, newText) {
        return {
            type: UPDATE_TODO,
            id: todo.id,
            text: newText,
            editing: false
        };
    }

    toggleStatus(id) {
        return {
            type: TOGGLE_TODO_STATUS,
            id: id
        };
    }

    toggleAllStatus(status) {
        return {
            type: TOGGLE_ALL_TODO_STATUS,
            status: status
        };
    }

    remove(id) {
        return {
            type: REMOVE_TODO,
            id: id
        };
    }

    removeCompleted() {
        return {
            type: REMOVE_COMPLETED_TODOS
        };
    }

    setFilter(filter) {
        return {
            type: SET_FILTER,
            filter: filter
        };
    }
}
