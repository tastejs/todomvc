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
            // vars
            todo = todoViewModel(sandbox);

        // Register application state for the module.
        registerStates('main',
            state('todo',
                onEntry(function () {
                    // pass the template bindings to the appropriate property
                    this.todoItems(template('todo_items_template', todo));
                    this.todoInput(template('todo_input_template', todo));
                })));
    };
});
