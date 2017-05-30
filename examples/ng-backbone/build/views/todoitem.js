"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ng_backbone_1 = require("ng-backbone");
var constants_1 = require("../constants");
var TodoItemView = (function (_super) {
    __extends(TodoItemView, _super);
    function TodoItemView() {
        _super.apply(this, arguments);
    }
    // Make a shortcut for `todo` scope model and auto-render
    TodoItemView.prototype.initialize = function () {
        this.todo = this.models.get("todo");
        this.render();
    };
    // Obtain .edit node reference on mounting
    TodoItemView.prototype.componentDidMount = function () {
        this.edit = this.$(".edit").get(0);
    };
    // Toggle visibility of the item according to the specified filter param
    TodoItemView.prototype.filter = function (filter) {
        switch (filter) {
            case constants_1.FILTER_ACTIVE:
                return this.toggleVisible(!this.todo.get("completed"));
            case constants_1.FILTER_COMPLETED:
                return this.toggleVisible(this.todo.get("completed"));
            default:
                return this.toggleVisible(true);
        }
    };
    // Show/hide the view
    TodoItemView.prototype.toggleVisible = function (toggle) {
        this.el.classList.toggle("hidden", !toggle);
    };
    // Toggle item state by click on .toggle
    TodoItemView.prototype.toggleCompletion = function () {
        var completed = Boolean(this.todo.get("completed"));
        this.todo.set("completed", !completed);
        this.todo.save();
    };
    // Remove an item from the list
    TodoItemView.prototype.removeTodo = function () {
        // Collection updates asynchronously, so on fast repeating remove the model may not esits anymore
        if (!this.todo) {
            return;
        }
        this.remove();
        this.todo.destroy();
        this.todo = null;
    };
    // Switch to editing mode
    TodoItemView.prototype.editTodo = function () {
        this.el.classList.toggle("editing", true);
        this.edit.focus();
    };
    // Handle keyup while editing
    TodoItemView.prototype.updateEditing = function (e) {
        if (e.which === constants_1.ENTER_KEY) {
            return this.saveEditing();
        }
        if (e.which === constants_1.ESCAPE_KEY) {
            return this.stopEditing();
        }
    };
    // Save the edited value
    TodoItemView.prototype.saveEditing = function () {
        var value = this.edit.value.trim();
        if (value) {
            this.todo.set("title", value);
            this.todo.save();
        }
        else {
            this.removeTodo();
        }
        this.stopEditing();
    };
    // Leave editing mode
    TodoItemView.prototype.stopEditing = function () {
        if (this.todo) {
            this.edit.value = this.todo.get("title");
        }
        this.el.classList.toggle("editing", false);
    };
    TodoItemView = __decorate([
        ng_backbone_1.Component({
            el: ".todo-item",
            events: {
                "click .toggle": "toggleCompletion",
                "dblclick label": "editTodo",
                "click .destroy": "removeTodo",
                "keyup .edit": "updateEditing",
                "blur .edit": "saveEditing"
            },
            template: "\n  <div class=\"view\">\n    <input class=\"toggle\" type=\"checkbox\" data-ng-prop=\"'checked', todo.completed\">\n    <label data-ng-text=\"todo.title\"></label>\n    <button class=\"destroy\"></button>\n  </div>\n  <input class=\"edit\" data-ng-attr=\"'value', todo.title\">\n"
        }), 
        __metadata('design:paramtypes', [])
    ], TodoItemView);
    return TodoItemView;
}(ng_backbone_1.View));
exports.TodoItemView = TodoItemView;
