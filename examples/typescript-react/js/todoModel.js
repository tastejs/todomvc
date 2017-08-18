"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var TodoModel = (function () {
    function TodoModel(key) {
        this.key = key;
        this.todos = utils_1.Utils.store(key);
        this.onChanges = [];
    }
    TodoModel.prototype.subscribe = function (onChange) {
        this.onChanges.push(onChange);
    };
    TodoModel.prototype.inform = function () {
        utils_1.Utils.store(this.key, this.todos);
        this.onChanges.forEach(function (cb) { cb(); });
    };
    TodoModel.prototype.addTodo = function (title) {
        this.todos = this.todos.concat({
            id: utils_1.Utils.uuid(),
            title: title,
            completed: false
        });
        this.inform();
    };
    TodoModel.prototype.toggleAll = function (checked) {
        this.todos = this.todos.map(function (todo) {
            return utils_1.Utils.extend({}, todo, { completed: checked });
        });
        this.inform();
    };
    TodoModel.prototype.toggle = function (todoToToggle) {
        this.todos = this.todos.map(function (todo) {
            return todo !== todoToToggle ?
                todo :
                utils_1.Utils.extend({}, todo, { completed: !todo.completed });
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
            return todo !== todoToSave ? todo : utils_1.Utils.extend({}, todo, { title: text });
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
}());
exports.TodoModel = TodoModel;
