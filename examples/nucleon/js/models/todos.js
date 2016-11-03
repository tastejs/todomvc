/**
 * This file handles the creation of our model.
 */
(function (app) {

    'use strict';

    // Registering a new model in the app
    var model = app.models.add('todos', {

        // Attributes
        // ==========

        new: '',       // Will be used to store new todo input value
        all: [],       // Will store todos
        active: 0,     // Will count active ones
        completed: 0,  // Will count completed ones
        filter: '',    // Will store a filter to show partial list of todos
        toggle: false, // Will be used to toggle todos

        // Methods
        // =======

        // Add a new todo
        add: function () {
            // Extract title from new attribute (bound to an input), if not empty
            var title = this.new.trim();
            if (title !== '') {
                // Create a new todo
                var todo = {
                    title: title,
                    state: 'active',
                    class: 'active',
                    checked: false
                };
                // Add it to the model container
                this.all.push(todo);
                // Increment corresponding counter
                this[todo.state]++;
                // Clear the input by clear new attribute value
                this.new = '';
            }
        },

        // Edit a todo
        edit: function (todo) {
            // Just need to change class used in the thumb
            todo.class = 'editing';
        },

        // Save a todo
        save: function (todo) {
            // If todo still has a title value
            if (todo.title.trim()) {
                // Just need to remove "editing" class
                todo.class = todo.state;
            // Elsewise, remove it
            } else {
                this.remove(todo);
            }
        },

        // Remove a todo
        remove: function (todo) {
            var index = this.all.indexOf(todo);
            if (index !== -1) {
                // Remove it from container and decrement the corresponding counter
                this.all.splice(index, 1);
                this[todo.state]--;
            }
        },

        // Toggle a todo
        toggleTodo: function (todo) {
            // Decrement corresponding counter
            this[todo.state]--;
            // Toggle todo values
            todo.checked = todo.checked  === true ? false : true;
            todo.class = todo.class === 'active' ? 'completed' : 'active';
            todo.state = todo.class;
            // Increment corresponding counter
            this[todo.state]++;
        },

        // Toggle all todos
        toggleAllTodos: function () {
            this.toggle = this.toggle === true ? false : true;
            for(var i = 0, len = this.all.length, todo; i < len; i++) {
                todo = this.all[i];
                if (todo.checked !== this.toggle) {
                    this.toggleTodo(todo);
                }
            }
        },

        // Remove all complete todos
        removeCompleted: function () {
            // As we are removing elements, we start the loop from the end,
            // To avoid errors on index
            for (var i = this.all.length - 1, todo; i >= 0; i--) {
                todo = this.all[i];
                if (todo.state === 'completed') {
                    this.remove(todo);
                }
            }
        }
    });

}(this.app));
