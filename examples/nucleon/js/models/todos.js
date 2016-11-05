/**
 * This file handles the creation of our model.
 */
(function (app) {

    'use strict';

    var ENTER_KEY = 13;
    var ESCAPE_KEY = 27;

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
            // Extract title from "new" attribute (bound to an input), if not empty
            var title = this.new.trim();
            if (title !== '') {
                // Create a new todo
                var todo = {
                    title: title,
                    originalTitle : title,
                    state: 'active',
                    class: 'active',
                    checked: false
                };
                // Add it to the model container
                this.all.push(todo);
                // Increment corresponding counter
                this[todo.state]++;
                // Clear the input by clearing "new" attribute value
                this.new = '';
                // Toggle general checkbox
                this.updateToggleCheckbox();
                // Save in browser memory
                this.persist();
            }
        },

        // Wait enter key press to add a new todo
        addOnEnter: function (e) {
            if (e.keyCode === ENTER_KEY) {
                e.preventDefault();
                this.new += ' ';
                this.add();
            }
        },

        // Edit a todo
        edit: function (todo) {
            // Just need to change class used in the thumb
            todo.class = 'editing';
            // Focus input
            var input = app.first('.editing input.edit');
            input.focus();
        },

        // Save a todo
        save: function (todo) {
            todo.title = todo.title.trim();
            // If todo still has a title value
            if (todo.title) {
                // Just need to remove "editing" class
                todo.class = todo.state;
                todo.originalTitle = todo.title;
            // Elsewise, remove it
            } else {
                this.remove(todo);
            }
            // Save in browser memory
            this.persist();
        },

        // Wait for enter key press to save current edited todo
        saveOnEnter: function (e, todo) {
            if (e.keyCode === ENTER_KEY) {
                e.preventDefault();
                todo.title += ' ';
                this.save(todo);
            }
        },

        // Wait for escape key press to cancel changes
        cancelOnEscape: function (e, todo) {
            if (e.keyCode === ESCAPE_KEY) {
                e.preventDefault();
                // Put back title as it was
                todo.title = todo.originalTitle;
                this.save(todo);
            }
        },

        // Remove a todo
        remove: function (todo, persist) {
            var index = this.all.indexOf(todo);
            if (index !== -1) {
                // Remove it from container and decrement the corresponding counter
                this.all.splice(index, 1);
                this[todo.state]--;
                // Toggle general checkbox
                this.updateToggleCheckbox();
            }
            // Save in browser memory if allowed
            if (persist !== false) {
                this.persist();
            }
        },

        // Toggle a todo
        toggleTodo: function (todo, updateToggle, persist) {
            // Decrement corresponding counter
            this[todo.state]--;
            // Toggle todo values
            todo.checked = todo.checked  === true ? false : true;
            todo.class = todo.class === 'active' ? 'completed' : 'active';
            todo.state = todo.class;
            // Increment corresponding counter
            this[todo.state]++;
            // Toggle general checkbox
            if (updateToggle !== false){
                this.updateToggleCheckbox();
            }
            // Save in browser memory if allowed
            if (persist !== false) {
                this.persist();
            }
        },

        // Toggle all todos
        toggleAllTodos: function () {
            this.toggle = this.toggle === true ? false : true;
            for(var i = 0, len = this.all.length, todo; i < len; i++) {
                todo = this.all[i];
                if (todo.checked !== this.toggle) {
                    this.toggleTodo(todo, false, false);
                }
            }
            // Save in browser memory
            this.persist();
        },

        // Check or uncheck general checkbox
        updateToggleCheckbox: function () {
            if (this.completed === this.all.length) {
                this.toggle = true;
            } else {
                this.toggle = false;
            }
            // Save in browser memory
            this.persist();
        },

        // Remove all complete todos
        removeCompleted: function () {
            // As we are removing elements, we start the loop from the end,
            // To avoid errors on index
            for (var i = this.all.length - 1, todo; i >= 0; i--) {
                todo = this.all[i];
                if (todo.state === 'completed') {
                    this.remove(todo, false);
                }
            }
            // Save in browser memory if allowed
            this.persist();
        },

        // Pluralize a word
        pluralize: function (text, count) {
            if (count === 0 || count > 1) {
                text += 's';
            }

            return text;
        },

        // Save model in memory
        persist: function () {
            var self = this;
            setTimeout(function () {
                app.memory.set('todos', self);
            }, 0);
        }
    });

    // Fetch values in memory
    var inMemory = app.memory.get('todos');
    if (inMemory) {
        model.hydrate(inMemory);
    }

    model.persist();

}(this.app));
