"use strict";
/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoModel = void 0;
/// <reference path="./interfaces.d.ts"/>
const utils_1 = require("./utils");
// Generic "model" object. You can use whatever
// framework you want. For this application it
// may not even be worth separating this logic
// out, but we do this to demonstrate one way to
// separate out parts of your application.
class TodoModel {
    constructor(key) {
        this.key = key;
        this.todos = utils_1.Utils.store(key);
        this.onChanges = [];
    }
    subscribe(onChange) {
        this.onChanges.push(onChange);
    }
    inform() {
        utils_1.Utils.store(this.key, this.todos);
        this.onChanges.forEach(function (cb) { cb(); });
    }
    addTodo(title) {
        this.todos = this.todos.concat({
            id: utils_1.Utils.uuid(),
            title: title,
            completed: false
        });
        this.inform();
    }
    toggleAll(checked) {
        // Note: It's usually better to use immutable data structures since they're
        // easier to reason about and React works very well with them. That's why
        // we use map(), filter() and reduce() everywhere instead of mutating the
        // array or todo items themselves.
        this.todos = this.todos.map((todo) => {
            return utils_1.Utils.extend({}, todo, { completed: checked });
        });
        this.inform();
    }
    toggle(todoToToggle) {
        this.todos = this.todos.map((todo) => {
            return todo !== todoToToggle ?
                todo :
                utils_1.Utils.extend({}, todo, { completed: !todo.completed });
        });
        this.inform();
    }
    destroy(todo) {
        this.todos = this.todos.filter(function (candidate) {
            return candidate !== todo;
        });
        this.inform();
    }
    save(todoToSave, text) {
        this.todos = this.todos.map(function (todo) {
            return todo !== todoToSave ? todo : utils_1.Utils.extend({}, todo, { title: text });
        });
        this.inform();
    }
    clearCompleted() {
        this.todos = this.todos.filter(function (todo) {
            return !todo.completed;
        });
        this.inform();
    }
}
exports.TodoModel = TodoModel;
