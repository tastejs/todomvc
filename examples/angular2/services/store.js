var uuid = require('node-uuid');
require('store.js');
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
    return TodoStore;
})();
exports.TodoStore = TodoStore;
//# sourceMappingURL=store.js.map