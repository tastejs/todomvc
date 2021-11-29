"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var TodoModel = (function () {
    function TodoModel(key) {
        this.key = key;
        this.tags = utils_1.Utils.store(key).tags || [];
        this.todos = utils_1.Utils.store(key).todos || [];
        this.onChanges = [];
    }
    TodoModel.prototype.subscribe = function (onChange) {
        this.onChanges.push(onChange);
    };
    TodoModel.prototype.inform = function () {
        utils_1.Utils.store(this.key, { todos: this.todos, tags: this.tags });
        this.onChanges.forEach(function (cb) { cb(); });
    };
    TodoModel.prototype.addTodo = function (title) {
        var titleArray = title.split("@");
        var id = utils_1.Utils.uuid();
        this.todos = this.todos.concat({
            id: id,
            title: titleArray[0] || title,
            completed: false
        });
        this.addTags(titleArray.slice(1), id);
        this.inform();
    };
    TodoModel.prototype.addTags = function (tags, id) {
        var _this = this;
        tags.forEach(function (tag) {
            _this.tags = _this.tags.concat({
                todoId: id,
                id: utils_1.Utils.uuid(),
                tag: tag
            });
        });
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
        var _this = this;
        var titleArray = text.split("@");
        this.todos = this.todos.map(function (todo) {
            return todo !== todoToSave ? todo : utils_1.Utils.extend({}, todo, { title: titleArray[0] || text });
        });
        this.tags = [];
        titleArray.splice(1).map(function (tag) {
            _this.tags.push({
                todoId: todoToSave.id,
                id: utils_1.Utils.uuid(),
                tag: tag
            });
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
