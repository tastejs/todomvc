/*global define */
define([
    'sandbox!todo',
    'app/todo/viewmodels/todoViewModel',
    'bindings!todo',
    'views!todo',
    'styles!todo'
], function (
    sandbox,
    todoViewModel
) {
    'use strict';

    return function todoModule() {
        var // imports
            template = sandbox.mvvm.template,
            registerStates = sandbox.state.registerStates,
            state = sandbox.state.builder.state,
            onEntry = sandbox.state.builder.onEntry,
            on = sandbox.state.builder.on,
            gotoInternally = sandbox.state.builder.gotoInternally,
            route = sandbox.routing.route,
            // vars
            todo = todoViewModel(sandbox);

        // Register application state for the module.
        registerStates('main',
            state('todo',
                onEntry(function () {
                    // pass the template bindings to the appropriate property
                    this.todoItems(template('todo_items_template', todo));
                    this.todoInput(template('todo_input_template', todo));
                }),
                on('todo.All', gotoInternally('todo.all')),
                on('todo.Active', gotoInternally('todo.active')),
                on('todo.Completed', gotoInternally('todo.completed')),
                state('todo.all',
                    route('/'),
                    onEntry(function () {
                        todo.currentView("All");
                    })),
                state('todo.active',
                    route('active'),
                    onEntry(function () {
                        todo.currentView("Active");
                    })),
                state('todo.completed',
                    route('completed'),
                    onEntry(function () {
                        todo.currentView("Completed");
                    }))));
    };
});
