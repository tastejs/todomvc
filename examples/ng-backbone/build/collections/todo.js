"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ng_backbone_1 = require("ng-backbone");
var todo_1 = require("../models/todo");
var TodoCollection = (function (_super) {
    __extends(TodoCollection, _super);
    function TodoCollection() {
        _super.apply(this, arguments);
        this.localStorage = new Backbone.LocalStorage("todos");
        this.model = todo_1.TodoModel;
    }
    // getter available in the template scope as todos.allChecked
    TodoCollection.prototype.getAllChecked = function () {
        return this.getCompleted().length === this.length;
    };
    // getter available in the template scope as todos.completed
    TodoCollection.prototype.getCompleted = function () {
        return this.where({ "completed": true });
    };
    // getter available in the template scope as todos.remaining
    TodoCollection.prototype.getRemaining = function () {
        return this.where({ "completed": false });
    };
    return TodoCollection;
}(ng_backbone_1.Collection));
exports.TodoCollection = TodoCollection;
