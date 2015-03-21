(function () {
    'use strict';

    window.TodoMVCView = {
        elements: {},
        model: {
            statusFilter: '',
            todos: []
        },
        initialize: function () {
            this.elements.$root = $('#todoapp');

            this.loadFromStorage();
            this.configureRivets();
        },

        loadFromStorage: function(){
            var stored = localStorage.getItem('todos-rivets');
            if (stored){
                JSON.parse(stored).forEach(function(item){
                    // sets up checked listenders(with sightglass)
                    this.model.todos.push(this._createTodo(item, this));
                }.bind(this))
            }
        },

        configureRivets: function () {

            this.rivetsView = rivets.bind(this.elements.$root, {
                model: this.model,
                view: this
            });

            rivets._.sightglass(this.model, 'todos', function() {
                localStorage.setItem('todos-rivets',JSON.stringify(this.model.todos))
            }.bind(this), {
                root: '.',
                adapters: rivets._.public.adapters
            });

        },

        setStatusFilter: function(statusFilter){
            this.model.statusFilter = statusFilter;
        },

        _createTodo: function(args, ctx){
            var newTodo = $.extend({
                id: (''+Math.random()).replace('0.','')
            }, args);

            // observe completed props in todos
            rivets._.sightglass(newTodo, 'completed', function() {
                ctx.model.todos.splice(0,0); // dont change array, just force array binders recalculation
            }, {
                root: '.',
                adapters: rivets._.public.adapters
            });
            return newTodo;
        },

        addTodo: function ($ev, ctx) {
            $ev.preventDefault(); // prevent form submit
            if (ctx.model.newTodo && ctx.model.newTodo.trim()) {

                ctx.model.todos.push(ctx.view._createTodo(
                    {
                        title:ctx.model.newTodo.trim(),
                        completed: false
                    }, ctx)
                );

            }
            ctx.model.newTodo = '';
        },
        toggleAllChecked: function ($ev, ctx) {
            var allChecked = $($ev.target).prop('checked');
            ctx.model.todos.forEach(function (todo) {
                todo.completed = allChecked;
            });

        },
        editTodo: function ($ev, ctx) {
            ctx.todo.editing = true;
            ctx.todo.previous_title = ctx.todo.title;
        },
        removeTodo: function ($ev, ctx) {
            ctx.model.todos = $.grep(ctx.model.todos, function (todo) {
                return todo !== ctx.todo;
            });
        },
        saveTodo: function ($ev, ctx) {
            $ev.preventDefault(); // prevent form submit
           if (!ctx.todo.title.trim()){
                ctx.model.todos = $.grep(ctx.model.todos, function (todo) {
                    return todo !== ctx.todo;
                });
                return;
            }
            ctx.todo.title = ctx.todo.title.trim();
            ctx.todo.editing = false;
            delete ctx.todo.previous_title;
        },
        revertEdits: function ($ev, ctx) {
            ctx.todo.title = ctx.todo.previous_title;
            ctx.todo.editing = false;
            delete ctx.todo.previous_title;
        },
        clearCompletedTodos: function($ev, ctx) {
            ctx.model.todos = $.grep(ctx.model.todos, function (todo) {
                return !todo.completed;
            });
        }

    };

    TodoMVCView.initialize();
})();