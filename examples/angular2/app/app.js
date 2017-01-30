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
var Rx_1 = require('rxjs/Rx');
var FocusDirective = (function () {
    function FocusDirective(renderer, elementRef) {
        this.renderer = renderer;
        this.elementRef = elementRef;
    }
    FocusDirective.prototype.ngAfterViewInit = function () {
        var _this = this;
        Rx_1.Observable.timer(0).subscribe(function () {
            _this.renderer.invokeElementMethod(_this.elementRef, 'focus', []);
        });
    };
    FocusDirective = __decorate([
        core_1.Directive({
            selector: '[todo-focus]',
        }), 
        __metadata('design:paramtypes', [core_1.Renderer, core_1.ElementRef])
    ], FocusDirective);
    return FocusDirective;
})();
exports.FocusDirective = FocusDirective;
var TodoApp = (function () {
    function TodoApp(todoStore) {
        this.newTodoText = '';
        this.todoStore = todoStore;
    }
    TodoApp.prototype.stopEditing = function (todo, editedTitle) {
        todo.title = editedTitle;
        todo.editing = false;
    };
    TodoApp.prototype.cancelEditingTodo = function (todo) {
        todo.editing = false;
    };
    TodoApp.prototype.updateEditingTodo = function (todo, editedTitle) {
        editedTitle = editedTitle.trim();
        todo.editing = false;
        if (editedTitle.length === 0) {
            return this.todoStore.remove(todo);
        }
        todo.title = editedTitle;
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
    TodoApp.prototype.addTodo = function () {
        if (this.newTodoText.trim().length) {
            this.todoStore.add(this.newTodoText);
            this.newTodoText = '';
        }
    };
    TodoApp = __decorate([
        core_1.Component({
            selector: 'todo-app',
            directives: [FocusDirective],
            templateUrl: 'app/app.html'
        }), 
        __metadata('design:paramtypes', [store_1.TodoStore])
    ], TodoApp);
    return TodoApp;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TodoApp;
//# sourceMappingURL=app.js.map