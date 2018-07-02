'use strict';
// declare const stream: Mithril.StreamFactory;
var ToDoController = (function () {
    function ToDoController() {
        // Todo collection
        var storedTodos = TodoStorage.get();
        // Update with Mithril Stream
        this.list = storedTodos.map(function (item) {
            return new TodoItem(item);
        });
        this.title = stream("");
        this.filter = stream(m.route.param('filter') || '');
    }
    ToDoController.prototype.add = function () {
        var title = this.title().trim();
        if (title) {
            var newItem = {};
            newItem.title = title;
            this.list.push(new TodoItem(newItem));
            TodoStorage.put(this.list);
        }
        this.title('');
    };
    ToDoController.prototype.isVisible = function (todo) {
        switch (this.filter()) {
            case 'active':
                return !todo.completed();
            case 'completed':
                return todo.completed();
            default:
                return true;
        }
    };
    ;
    ToDoController.prototype.complete = function (todo) {
        if (todo.completed()) {
            todo.completed(false);
        }
        else {
            todo.completed(true);
        }
        TodoStorage.put(this.list);
    };
    ;
    ToDoController.prototype.edit = function (todo) {
        todo.previousTitle = todo.title();
        todo.editing(true);
    };
    ;
    ToDoController.prototype.doneEditing = function (todo, index) {
        if (!todo.editing()) {
            return;
        }
        todo.editing(false);
        todo.title(todo.title().trim());
        if (!todo.title()) {
            this.list.splice(index, 1);
        }
        TodoStorage.put(this.list);
    };
    ;
    ToDoController.prototype.cancelEditing = function (todo) {
        todo.title(todo.previousTitle);
        todo.editing(false);
    };
    ;
    ToDoController.prototype.clearTitle = function () {
        this.title('');
    };
    ;
    ToDoController.prototype.remove = function (key) {
        this.list.splice(key, 1);
        TodoStorage.put(this.list);
    };
    ;
    ToDoController.prototype.clearCompleted = function () {
        for (var i = this.list.length - 1; i >= 0; i--) {
            if (this.list[i].completed()) {
                this.list.splice(i, 1);
            }
        }
        TodoStorage.put(this.list);
    };
    ;
    ToDoController.prototype.amountCompleted = function () {
        var amount = 0;
        for (var i = 0; i < this.list.length; i++) {
            if (this.list[i].completed()) {
                amount++;
            }
        }
        return amount;
    };
    ;
    ToDoController.prototype.allCompleted = function () {
        for (var i = 0; i < this.list.length; i++) {
            if (!this.list[i].completed()) {
                return false;
            }
        }
        return true;
    };
    ;
    ToDoController.prototype.completeAll = function () {
        var allCompleted = this.allCompleted();
        for (var i = 0; i < this.list.length; i++) {
            this.list[i].completed(!allCompleted);
        }
        TodoStorage.put(this.list);
    };
    ;
    return ToDoController;
}());
//# sourceMappingURL=todo.js.map