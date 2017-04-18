System.register([], function(exports_1) {
    "use strict";
    var ADD_TODO, TOGGLE_TODO_EDIT, UPDATE_TODO, TOGGLE_TODO_STATUS, TOGGLE_ALL_TODO_STATUS, REMOVE_TODO, REMOVE_COMPLETED_TODOS, SET_FILTER, TodoActions;
    return {
        setters:[],
        execute: function() {
            exports_1("ADD_TODO", ADD_TODO = 'ADD_TODO');
            exports_1("TOGGLE_TODO_EDIT", TOGGLE_TODO_EDIT = 'TOGGLE_TODO_EDIT');
            exports_1("UPDATE_TODO", UPDATE_TODO = 'UPDATE_TODO');
            exports_1("TOGGLE_TODO_STATUS", TOGGLE_TODO_STATUS = 'TOGGLE_TODO_STATUS');
            exports_1("TOGGLE_ALL_TODO_STATUS", TOGGLE_ALL_TODO_STATUS = 'TOGGLE_ALL_TODO_STATUS');
            exports_1("REMOVE_TODO", REMOVE_TODO = 'REMOVE_TODO');
            exports_1("REMOVE_COMPLETED_TODOS", REMOVE_COMPLETED_TODOS = 'REMOVE_COMPLETED_TODOS');
            exports_1("SET_FILTER", SET_FILTER = 'SET_FILTER');
            TodoActions = (function () {
                function TodoActions() {
                    this.nextToDoId = 0;
                }
                TodoActions.prototype.add = function (text) {
                    return {
                        type: ADD_TODO,
                        id: this.nextToDoId++,
                        text: text,
                        editing: false,
                        completed: false
                    };
                };
                TodoActions.prototype.toggleEdit = function (id) {
                    return {
                        type: TOGGLE_TODO_EDIT,
                        id: id
                    };
                };
                TodoActions.prototype.update = function (todo, newText) {
                    return {
                        type: UPDATE_TODO,
                        id: todo.id,
                        text: newText,
                        editing: false
                    };
                };
                TodoActions.prototype.toggleStatus = function (id) {
                    return {
                        type: TOGGLE_TODO_STATUS,
                        id: id
                    };
                };
                TodoActions.prototype.toggleAllStatus = function (status) {
                    return {
                        type: TOGGLE_ALL_TODO_STATUS,
                        status: status
                    };
                };
                TodoActions.prototype.remove = function (id) {
                    return {
                        type: REMOVE_TODO,
                        id: id
                    };
                };
                TodoActions.prototype.removeCompleted = function () {
                    return {
                        type: REMOVE_COMPLETED_TODOS
                    };
                };
                TodoActions.prototype.setFilter = function (filter) {
                    return {
                        type: SET_FILTER,
                        filter: filter
                    };
                };
                return TodoActions;
            }());
            exports_1("TodoActions", TodoActions);
        }
    }
});
//# sourceMappingURL=todoActions.js.map