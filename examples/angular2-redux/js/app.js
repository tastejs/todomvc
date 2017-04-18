System.register(['angular2/core', './todoActions', './statusFilterPipe'], function(exports_1) {
    "use strict";
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var __param = (this && this.__param) || function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };
    var core_1, todoActions_1, statusFilterPipe_1;
    var App;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (todoActions_1_1) {
                todoActions_1 = todoActions_1_1;
            },
            function (statusFilterPipe_1_1) {
                statusFilterPipe_1 = statusFilterPipe_1_1;
            }],
        execute: function() {
            App = (function () {
                function App(appStore, todoActions) {
                    var _this = this;
                    this.appStore = appStore;
                    this.todoActions = todoActions;
                    this.todos = [];
                    this.currentFilter = 'SHOW_ALL';
                    this.newTodoText = '';
                    this.unsubscribe = this.appStore.subscribe(function () {
                        var state = _this.appStore.getState();
                        _this.todos = state.todos;
                        _this.currentFilter = state.currentFilter;
                    });
                }
                App.prototype.add = function () {
                    if (this.newTodoText) {
                        this.appStore.dispatch(this.todoActions.add(this.newTodoText));
                        this.newTodoText = '';
                    }
                };
                App.prototype.toggleEdit = function (todo) {
                    this.appStore.dispatch(this.todoActions.toggleEdit(todo.id));
                };
                App.prototype.update = function (todo, newText) {
                    this.appStore.dispatch(this.todoActions.update(todo, newText));
                };
                App.prototype.remove = function (todo) {
                    this.appStore.dispatch(this.todoActions.remove(todo.id));
                };
                App.prototype.removeCompleted = function () {
                    this.appStore.dispatch(this.todoActions.removeCompleted());
                };
                App.prototype.toggleAllStatus = function (filter) {
                    this.appStore.dispatch(this.todoActions.toggleAllStatus(filter));
                };
                App.prototype.toggleStatus = function (todo) {
                    this.appStore.dispatch(this.todoActions.toggleStatus(todo.id));
                };
                App.prototype.setFilter = function (filter) {
                    this.appStore.dispatch(this.todoActions.setFilter(filter));
                };
                App.prototype.isAllCompleted = function () {
                    return this.todos.every(function (todo) {
                        return todo.completed;
                    });
                };
                App.prototype.activeCount = function () {
                    return this.todos.filter(function (todo) {
                        return !todo.completed;
                    }).length;
                };
                App.prototype.completedCount = function () {
                    return this.todos.filter(function (todo) {
                        return todo.completed;
                    }).length;
                };
                App = __decorate([
                    core_1.Component({
                        selector: 'todo-app',
                        templateUrl: 'app.html',
                        pipes: [statusFilterPipe_1.StatusFilterPipe]
                    }),
                    __param(0, core_1.Inject('AppStore')), 
                    __metadata('design:paramtypes', [Object, todoActions_1.TodoActions])
                ], App);
                return App;
            }());
            exports_1("App", App);
        }
    }
});
//# sourceMappingURL=app.js.map