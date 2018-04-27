var Todo = (function () {
    function Todo(title, tododate, colorCode) {
        this.completed = false;
        this.editing = false;
        this.title = title.trim();
        this.tododate = tododate;
        this.colorCode = colorCode;
    }
    Object.defineProperty(Todo.prototype, "title", {
        get: function () {
            return this._title;
        },
        set: function (value) {
            this._title = value.trim();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Todo.prototype, "tododate", {
        get: function () {
            return this._tododate;
        },
        set: function (value) {
            this._tododate = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Todo.prototype, "colorCode", {
        get: function () {
            return this._colorCode;
        },
        set: function (value) {
            this._colorCode = value;
        },
        enumerable: true,
        configurable: true
    });
    return Todo;
})();
exports.Todo = Todo;
var TodoStore = (function () {
    function TodoStore() {
        var _this = this;
        this.colorCodeMap = {
            "duesoon": "#E8E8E8",
            "overdue": "#6A6A6A"
        };
        var persistedTodos = JSON.parse(localStorage.getItem('angular2-todos') || '[]');
        // Normalize back into classes
        this.todos = persistedTodos.map(function (todo) {
            var colorCode = _this.colorCodeMap[_this.checkDue(todo._tododate)];
            var ret = new Todo(todo._title, todo._tododate, colorCode);
            ret.completed = todo.completed;
            return ret;
        });
    }
    TodoStore.prototype.updateStore = function () {
        localStorage.setItem('angular2-todos', JSON.stringify(this.todos));
    };
    TodoStore.prototype.getWithCompleted = function (completed) {
        return this.todos.filter(function (todo) { return todo.completed === completed; });
    };
    TodoStore.prototype.allCompleted = function () {
        return this.todos.length === this.getCompleted().length;
    };
    TodoStore.prototype.setAllTo = function (completed) {
        this.todos.forEach(function (t) { return t.completed = completed; });
        this.updateStore();
    };
    TodoStore.prototype.removeCompleted = function () {
        this.todos = this.getWithCompleted(false);
        this.updateStore();
    };
    TodoStore.prototype.getRemaining = function () {
        return this.getWithCompleted(false);
    };
    TodoStore.prototype.getCompleted = function () {
        return this.getWithCompleted(true);
    };
    TodoStore.prototype.toggleCompletion = function (todo) {
        todo.completed = !todo.completed;
        this.updateStore();
    };
    TodoStore.prototype.remove = function (todo) {
        this.todos.splice(this.todos.indexOf(todo), 1);
        this.updateStore();
    };
    TodoStore.prototype.add = function (title, tododate) {
        var colorCode = this.colorCodeMap[this.checkDue(tododate)];
        this.todos.push(new Todo(title, tododate, colorCode));
        this.updateStore();
    };
    TodoStore.prototype.checkDue = function (tododate) {
        var today = new Date().getTime(), datediff = Math.round(new Date(tododate).getTime() - today) / (1000 * 3600 * 24);
        if (datediff < 0) {
            return "overdue";
        }
        else if (datediff > 0 && datediff <= 2) {
            return "duesoon";
        }
        return true;
    };
    return TodoStore;
})();
exports.TodoStore = TodoStore;
//# sourceMappingURL=store.js.map