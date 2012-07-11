YUI.add('mvc-todos', function (Y) {
    "use strict";
    
    // Dependencies from Y.MVC.
    var Todo = Y.MVC.Todo,
        TodoList;

    // -- TodoList Model list -----
    TodoList = Y.Base.create('todoList', Y.ModelList, [Y.ModelSync.Local], {

        // The related Model for our Model List.
        model: Todo,

        // The root used for our localStorage key.
        root: 'todos-yui',

        // Return an Array of our completed Models.
        completed: function () {
            return this.filter(function (todo) {
                return todo.get('completed');
            });
        },

        // Return an Array of our un-completed Models.
        remaining: function () {
            return this.filter(function (todo) {
                return !todo.get('completed');
            });
        }

    });

    // Set this Model List under our custom Y.MVC namespace.
    Y.namespace('MVC').TodoList = TodoList;

}, '@VERSION@', {
    requires: [
        'model-sync-local',
        'model-list',
        'mvc-todo'
    ]
});
