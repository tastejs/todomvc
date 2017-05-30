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
var todo_1 = require("../collections/todo");
var todoitem_1 = require("./todoitem");
var constants_1 = require("../constants");
var TodoView = (function (_super) {
    __extends(TodoView, _super);
    function TodoView() {
        _super.apply(this, arguments);
    }
    TodoView.prototype.initialize = function () {
        this.listenTo(this, "filter", this.onFilter);
        this.todos = this.collections.get("todos");
        this.state = this.models.get("state");
        this.todos.fetch();
        this.render();
    };
    // We use this method in @Component subview constructor to map subview to the model of the collection
    TodoView.prototype.findModel = function (el) {
        var model;
        this.todos.forEach(function (todo) {
            if (todo.id === el.dataset["id"]) {
                model = todo;
            }
        });
        return model;
    };
    // Handle router event
    TodoView.prototype.onFilter = function (filter) {
        this.state.set("filter", filter);
        this.views.getAll("items").forEach(function (view) {
            view.filter(filter);
        });
    };
    // Handle keyup event on .new-todo
    TodoView.prototype.onAddTodo = function (e) {
        if (e.which === constants_1.ENTER_KEY) {
            e.preventDefault();
            this.addTodo(e.target);
        }
    };
    // Actually adding an item to the list
    TodoView.prototype.addTodo = function (el) {
        var value = el.value.trim();
        if (value) {
            this.todos.create({
                title: value,
                completed: false
            });
            el.value = "";
        }
    };
    // Toggle all complete
    TodoView.prototype.toogleAll = function () {
        var allChecked = this.todos.getAllChecked();
        this.todos.forEach(function (todo) {
            todo.set("completed", !allChecked);
            todo.save();
        });
    };
    // Clear all completed items
    TodoView.prototype.clearCompleted = function () {
        this.todos
            .getCompleted()
            .forEach(function (todo) {
            todo.destroy();
        });
    };
    TodoView = __decorate([
        ng_backbone_1.Component({
            el: "todo-app",
            events: {
                "keyup .new-todo": "onAddTodo",
                "click .toggle-all": "toogleAll",
                "click .clear-completed": "clearCompleted"
            },
            models: {
                state: new ng_backbone_1.Model({
                    filter: ""
                })
            },
            collections: {
                todos: new todo_1.TodoCollection()
            },
            views: {
                items: [todoitem_1.TodoItemView, function (view, el) {
                        return {
                            models: {
                                todo: view.findModel(el)
                            }
                        };
                    }]
            },
            template: "<section class=\"todoapp\">\n\t<header class=\"header\">\n\t\t<h1>todos</h1>\n\t\t<input class=\"new-todo\" placeholder=\"What needs to be done?\" autofocus=\"\" >\n\t</header>\n\t<section class=\"main\" data-ng-if=\"todos.length\">\n    <input class=\"toggle-all\" type=\"checkbox\" data-ng-prop=\"'checked', todos.allChecked\">\n\t\t<ul class=\"todo-list\">\n\t\t\t<li class=\"todo-item\" data-ng-for=\"let todo of todos\"\n        data-ng-class=\"'editing', todo.editing\"\n        data-ng-class-0=\"'completed', todo.completed\"\n        data-ng-data=\"'id', todo.id\">\n\t\t\t</li>\n\t\t</ul>\n\t</section>\n  <footer class=\"footer\" data-ng-if=\"todos.length\">\n\t\t<span class=\"todo-count\">\n      <strong data-ng-text=\"todos.remaining.length\">0</strong> item<span data-ng-if=\"todos.remaining.length !== 1\">s</span> left\n    </span>\n    <ul class=\"filters\">\n      <li>\n        <a href=\"#/\" data-ng-class=\"'selected', !state.filter\">All</a>\n      </li>\n      <li>\n        <a href=\"#/active\" data-ng-class=\"'selected', state.filter === 'active'\">Active</a>\n      </li>\n      <li>\n        <a href=\"#/completed\" data-ng-class=\"'selected', state.filter === 'completed'\">Completed</a>\n      </li>\n    </ul>\n    <button class=\"clear-completed\" data-ng-class=\"'hidden', !todos.completed.length\">Clear completed</button>\n\t</footer>\n</section>\n"
        }), 
        __metadata('design:paramtypes', [])
    ], TodoView);
    return TodoView;
}(ng_backbone_1.View));
exports.TodoView = TodoView;
