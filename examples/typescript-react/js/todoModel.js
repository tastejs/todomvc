/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/// <reference path="../typings/react/react-global.d.ts" />
/// <reference path="./interfaces.d.ts"/>
var app;
(function (app) {
    var models;
    (function (models) {
        // Generic "model" object. You can use whatever
        // framework you want. For this application it
        // may not even be worth separating this logic
        // out, but we do this to demonstrate one way to
        // separate out parts of your application.
        var TodoModel = (function () {
            function TodoModel(key) {
                this.key = key;
                this.todos = app.miscelanious.Utils.store(key);
                this.onChanges = [];
            }
            TodoModel.prototype.subscribe = function (onChange) {
                this.onChanges.push(onChange);
            };
            TodoModel.prototype.inform = function () {
                app.miscelanious.Utils.store(this.key, this.todos);
                this.onChanges.forEach(function (cb) { cb(); });
            };
            TodoModel.prototype.addTodo = function (title) {
                this.todos = this.todos.concat({
                    id: app.miscelanious.Utils.uuid(),
                    title: title,
                    completed: false
                });
                this.inform();
            };
            TodoModel.prototype.toggleAll = function (checked) {
                // Note: it's usually better to use immutable data structures since they're
                // easier to reason about and React works very well with them. That's why
                // we use map() and filter() everywhere instead of mutating the array or
                // todo items themselves.
                this.todos = this.todos.map(function (todo) {
                    return app.miscelanious.Utils.extend({}, todo, { completed: checked });
                });
                this.inform();
            };
            TodoModel.prototype.toggle = function (todoToToggle) {
                this.todos = this.todos.map(function (todo) {
                    return todo !== todoToToggle ?
                        todo :
                        app.miscelanious.Utils.extend({}, todo, { completed: !todo.completed });
                });
                this.inform();
            };
            TodoModel.prototype.destroy = function (todo) {
                this.todos = this.todos.filter(function (candidate) {
                    return candidate !== todo;
                });
                this.inform();
            };
            TodoModel.prototype.save = function (todoToSave, text) {
                this.todos = this.todos.map(function (todo) {
                    return todo !== todoToSave ? todo : app.miscelanious.Utils.extend({}, todo, { title: text });
                });
                this.inform();
            };
            TodoModel.prototype.clearCompleted = function () {
                this.todos = this.todos.filter(function (todo) {
                    return !todo.completed;
                });
                this.inform();
            };
            return TodoModel;
        })();
        models.TodoModel = TodoModel;
    })(models = app.models || (app.models = {}));
})(app || (app = {}));
