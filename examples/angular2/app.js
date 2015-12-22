var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('angular2/core');
var browser_1 = require('angular2/platform/browser');
var store_1 = require('./services/store');
var ESC_KEY = 27;
var ENTER_KEY = 13;
var TodoApp = (function () {
    function TodoApp() {
        this.todoStore = new store_1.TodoStore();
    }
    TodoApp.prototype.stopEditing = function (todo, editedTitle) {
        todo.setTitle(editedTitle.value);
        todo.editing = false;
    };
    TodoApp.prototype.cancelEditingTodo = function (todo) { todo.editing = false; };
    TodoApp.prototype.updateEditingTodo = function (editedTitle, todo) {
        editedTitle = editedTitle.value.trim();
        todo.editing = false;
        if (editedTitle.length === 0) {
            return this.todoStore.remove(todo.uid);
        }
        todo.setTitle(editedTitle);
    };
    TodoApp.prototype.editTodo = function (todo) {
        todo.editing = true;
    };
    TodoApp.prototype.removeCompleted = function () {
        this.todoStore.removeCompleted();
    };
    TodoApp.prototype.toggleCompletion = function (uid) {
        this.todoStore.toggleCompletion(uid);
    };
    TodoApp.prototype.remove = function (uid) {
        this.todoStore.remove(uid);
    };
    TodoApp.prototype.addTodo = function ($event, newtodo) {
        if ($event.which === ENTER_KEY && newtodo.value.trim().length) {
            this.todoStore.add(newtodo.value);
            newtodo.value = '';
        }
    };
    TodoApp = __decorate([
        core_1.Component({
            selector: 'todo-app',
            template: "\n\t\t<section class=\"todoapp\">\n\t\t\t<header class=\"header\">\n\t\t\t\t<h1>todos</h1>\n\t\t\t\t<input class=\"new-todo\" placeholder=\"What needs to be done?\" autofocus=\"\" #newtodo (keyup)=\"addTodo($event, newtodo)\">\n\t\t\t</header>\n\t\t\t<section class=\"main\" *ngIf=\"todoStore.todos.length > 0\">\n\t\t\t\t<input class=\"toggle-all\" type=\"checkbox\" *ngIf=\"todoStore.todos.length\" #toggleall [checked]=\"todoStore.allCompleted()\" (click)=\"todoStore.setAllTo(toggleall)\">\n\t\t\t\t<ul class=\"todo-list\">\n\t\t\t\t\t<li *ngFor=\"#todo of todoStore.todos\" [class.completed]=\"todo.completed\" [class.editing]=\"todo.editing\">\n\t\t\t\t\t\t<div class=\"view\">\n\t\t\t\t\t\t\t<input class=\"toggle\" type=\"checkbox\" (click)=\"toggleCompletion(todo.uid)\" [checked]=\"todo.completed\">\n\t\t\t\t\t\t\t<label (dblclick)=\"editTodo(todo)\">{{todo.title}}</label>\n\t\t\t\t\t\t\t<button class=\"destroy\" (click)=\"remove(todo.uid)\"></button>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<input class=\"edit\" *ngIf=\"todo.editing\" [value]=\"todo.title\" #editedtodo (blur)=\"stopEditing(todo, editedtodo)\" (keyup.enter)=\"updateEditingTodo(editedtodo, todo)\" (keyup.escape)=\"cancelEditingTodo(todo)\">\n\t\t\t\t\t</li>\n\t\t\t\t</ul>\n\t\t\t</section>\n\t\t\t<footer class=\"footer\" *ngIf=\"todoStore.todos.length > 0\">\n\t\t\t\t<span class=\"todo-count\"><strong>{{todoStore.getRemaining().length}}</strong> {{todoStore.getRemaining().length == 1 ? 'item' : 'items'}} left</span>\n\t\t\t\t<button class=\"clear-completed\" *ngIf=\"todoStore.getCompleted().length > 0\" (click)=\"removeCompleted()\">Clear completed</button>\n\t\t\t</footer>\n\t\t</section>"
        }), 
        __metadata('design:paramtypes', [])
    ], TodoApp);
    return TodoApp;
})();
browser_1.bootstrap(TodoApp);
//# sourceMappingURL=app.js.map