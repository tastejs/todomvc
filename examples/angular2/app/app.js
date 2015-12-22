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
    TodoApp.prototype.cancelEditingTodo = function (todo) {
        todo.editing = false;
    };
    TodoApp.prototype.updateEditingTodo = function (editedTitle, todo) {
        editedTitle = editedTitle.value.trim();
        todo.editing = false;
        if (editedTitle.length === 0) {
            return this.todoStore.remove(todo);
        }
        todo.setTitle(editedTitle);
    };
    TodoApp.prototype.editTodo = function (todo) {
        todo.editing = true;
    };
    TodoApp.prototype.removeCompleted = function () {
        this.todoStore.removeCompleted();
    };
    TodoApp.prototype.toggleCompletion = function (todo) {
        this.todoStore.toggleCompletion(todo);
    };
    TodoApp.prototype.remove = function (todo) {
        this.todoStore.remove(todo);
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
            templateUrl: 'app/app.html'
        }), 
        __metadata('design:paramtypes', [])
    ], TodoApp);
    return TodoApp;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TodoApp;
//# sourceMappingURL=app.js.map