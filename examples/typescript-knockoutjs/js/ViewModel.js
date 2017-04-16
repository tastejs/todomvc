/// <reference path="Model.ts" />
var TodoItem = Model.TodoItem;

var ViewModel = (function () {
    function ViewModel(todos) {
        var _this = this;
        this.todos = ko.observableArray(todos.map(function (todo) {
            return new TodoItem(todo.title, todo.completed);
        }));

        this.current = ko.observable('');

        this.showMode = ko.observable('all');

        this.filteredTodos = ko.computed(function () {
            switch (_this.showMode()) {
                case 'active':
                    return _this.todos().filter(function (todo) {
                        return !todo.completed();
                    });
                case 'completed':
                    return _this.todos().filter(function (todo) {
                        return todo.completed();
                    });
                default:
                    return _this.todos();
            }
        });

        // count of all completed todos
        this.completedCount = ko.computed(function () {
            return _this.todos().filter(function (todo) {
                return todo.completed();
            }).length;
        });

        // count of todos that are not complete
        this.remainingCount = ko.computed(function () {
            return _this.todos().length - _this.completedCount();
        });

        // writeable computed observable to handle marking all complete/incomplete
        this.allCompleted = ko.computed({
            // always return true/false based on the done flag of all todos
            read: function () {
                return !_this.remainingCount();
            },
            // set all todos to the written value (true/false)
            write: function (newValue) {
                _this.todos().forEach(function (todo) {
                    // set even if value is the same, as subscribers are not notified in that case
                    todo.completed(newValue);
                });
            }
        });

        // internal computed observable that fires whenever anything changes in our todos
        ko.computed(function () {
            // store a clean copy to local storage, which also creates a dependency on the observableArray and all observables in each item
            localStorage.setItem('todos-typescript-knockoutjs', ko.toJSON(_this.todos));
        }).extend({
            rateLimit: { timeout: 500, method: 'notifyWhenChangesStop' }
        }); // save at most twice per second
    }
    // add a new todo, when enter key is pressed
    ViewModel.prototype.add = function () {
        var current = this.current().trim();
        if (current) {
            this.todos.push(new TodoItem(current));
            this.current('');
        }
    };

    // remove a single todo
    ViewModel.prototype.remove = function (todo) {
        this.todos.remove(todo);
    };

    // remove all completed todos
    ViewModel.prototype.removeCompleted = function () {
        this.todos.remove(function (todo) {
            return todo.completed();
        });
    };

    // edit an item
    ViewModel.prototype.editItem = function (item) {
        item.editing(true);
        item.previousTitle = item.title();
    };

    // stop editing an item.  Remove the item, if it is now empty
    ViewModel.prototype.saveEditing = function (item) {
        var title = item.title(), trimmedTitle = title.trim();

        item.editing(false);

        // Observable value changes are not triggered if they're consisting of whitespaces only
        // Therefore we've to compare untrimmed version with a trimmed one to check whether anything changed
        // And if yes, we've to set the new value manually
        if (title !== trimmedTitle) {
            item.title(trimmedTitle);
        }

        if (!trimmedTitle) {
            this.remove(item);
        }
    };

    // cancel editing an item and revert to the previous content
    ViewModel.prototype.cancelEditing = function (item) {
        item.editing(false);
        item.title(item.previousTitle);
    };

    // helper function to keep expressions out of markup
    ViewModel.prototype.getLabel = function (count) {
        return ko.utils.unwrapObservable(count) === 1 ? 'item' : 'items';
    };
    return ViewModel;
})();
