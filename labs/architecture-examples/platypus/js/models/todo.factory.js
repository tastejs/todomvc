/* global plat, __extends */
/* jshint unused:false */
var todoapp;
(function (todoapp) {
    'use strict';
    (function (models) {

        var TodoFactory = (function () {
            function TodoFactory() {
            }
            TodoFactory.createTodo = function (title, completed, id) {
                return {
                    id: id || TodoFactory._utils.uniqueId('todo_'),
                    title: title,
                    completed: !!completed
                };
            };

            TodoFactory.getTodos = function () {
                var storedTodos = TodoFactory._todoRepository.getTodos();
                var length = storedTodos.length;
                var todos = [];
                var todo;
                var create = TodoFactory.createTodo;

                for (var i = 0; i < length; ++i) {
                    todo = storedTodos[i];
                    todos.push(create(todo.title, todo.completed, todo.id));
                }

                return todos;
            };

            TodoFactory.setTodos = function (todos) {
                TodoFactory._todoRepository.setTodos(todos);
            };
            return TodoFactory;
        })();
        models.TodoFactory = TodoFactory;

        

        /**
        * This is the static constructor for the TodoFactory. TodoFactory is a
        * static class, yet it has dependencies. We allow you to register injectables
        * as "static" and specify a static constructor which will return the class.
        */
        function TodoFactoryStatic(_todoRepository, _utils) {
            TodoFactory._todoRepository = _todoRepository;
            TodoFactory._utils = _utils;
            return TodoFactory;
        }
        models.TodoFactoryStatic = TodoFactoryStatic;

        /**
        * Injectables can be of type static. Here you see that the TodoFactoryStatic
        * constructor is referenced. All STATIC injectables will be injected when the
        * app starts, and used throughout the application lifetime.
        */
        plat.register.injectable('todoFactory', TodoFactoryStatic, [
            todoapp.repositories.TodoRepository,
            plat.Utils
        ], plat.register.injectableType.STATIC);
    })(todoapp.models || (todoapp.models = {}));
    var models = todoapp.models;
})(todoapp || (todoapp = {}));
//# sourceMappingURL=todo.factory.js.map
