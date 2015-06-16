/// <reference path="../typings/node-uuid/node-uuid.d.ts" />
/// <reference path="../typings/storejs/storejs.d.ts" />
/// <reference path="../typings/angular2/angular2.d.ts" />
if (typeof __decorate !== "function") __decorate = function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var angular2_1 = require('angular2/angular2');
var uuid = require('node-uuid');
var Todo = (function () {
    function Todo(title) {
        this.uid = uuid.v4();
        this.completed = false;
        this.editing = false;
        this.title = title.trim();
    }
    Todo.prototype.setTitle = function (title) {
        this.title = title.trim();
    };
    return Todo;
})();
exports.Todo = Todo;
var TodoStore = (function () {
    function TodoStore() {
        var persistedTodos = store.get('angular2-todos') || [];
        // Normalize back into classes
        this.todos = persistedTodos.map(function (todo) {
            var ret = new Todo(todo.title);
            ret.completed = todo.completed;
            ret.uid = todo.uid;
            return ret;
        });
    }
    TodoStore.prototype._updateStore = function () {
        store.set('angular2-todos', this.todos);
    };
    TodoStore.prototype.get = function (state) {
        return this.todos.filter(function (todo) { return todo.completed === state.completed; });
    };
    TodoStore.prototype.allCompleted = function () {
        return this.todos.length === this.getCompleted().length;
    };
    TodoStore.prototype.setAllTo = function (toggler) {
        this.todos.forEach(function (t) { return t.completed = toggler.checked; });
        this._updateStore();
    };
    TodoStore.prototype.removeCompleted = function () {
        this.todos = this.get({ completed: false });
    };
    TodoStore.prototype.getRemaining = function () {
        return this.get({ completed: false });
    };
    TodoStore.prototype.getCompleted = function () {
        return this.get({ completed: true });
    };
    TodoStore.prototype.toggleCompletion = function (uid) {
        for (var _i = 0, _a = this.todos; _i < _a.length; _i++) {
            var todo = _a[_i];
            if (todo.uid === uid) {
                todo.completed = !todo.completed;
                break;
            }
        }
        ;
        this._updateStore();
    };
    TodoStore.prototype.remove = function (uid) {
        for (var _i = 0, _a = this.todos; _i < _a.length; _i++) {
            var todo = _a[_i];
            if (todo.uid === uid) {
                this.todos.splice(this.todos.indexOf(todo), 1);
                break;
            }
        }
        this._updateStore();
    };
    TodoStore.prototype.add = function (title) {
        this.todos.push(new Todo(title));
        this._updateStore();
    };
    TodoStore = __decorate([
        angular2_1.Injectable()
    ], TodoStore);
    return TodoStore;
})();
exports.TodoStore = TodoStore;
