/* global plat, __extends */
/* jshint unused:false */
var todoapp;
(function (todoapp) {
    'use strict';
    (function (repositories) {

        var TodoRepository = (function () {
            /**
            * Injectables can inject other injectables!
            */
            function TodoRepository(storage) {
                this.storage = storage;
                this.id = 'todos-platypits';
            }
            TodoRepository.prototype.getTodos = function () {
                return JSON.parse(this.storage.getItem(this.id) || '[]');
            };

            TodoRepository.prototype.setTodos = function (todos) {
                this.storage.setItem(this.id, JSON.stringify(todos));
            };
            return TodoRepository;
        })();
        repositories.TodoRepository = TodoRepository;

        /**
        * Here is how you register an injectable. This injectable is registered as
        * 'storage' and depends on 'plat.localStorage'. If another component wants to
        * use this injectable, it simply adds 'storage' to its dependencies array.
        */
        plat.register.injectable('todoRepository', TodoRepository, [plat.storage.LocalStorage]);
    })(todoapp.repositories || (todoapp.repositories = {}));
    var repositories = todoapp.repositories;
})(todoapp || (todoapp = {}));
//# sourceMappingURL=todo.repository.js.map
