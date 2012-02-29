/* App Controllers */

App.Controllers.TodoController = function () {
    var self = this;

    self.newTodo = "";

    self.addTodo = function() {
        if (self.newTodo.length === 0) return;

        self.todos.push({
            content: self.newTodo,
            done: false,
            editing: false
        });
        self.newTodo = "";
    };

    self.editTodo = function(todo) {
        //cancel any active editing operation
        angular.forEach(self.todos, function(value) {
            value.editing = false;
        });
        todo.editing = true;
    };

    self.finishEditing = function(todo) {
        todo.editing = false;
    };

    self.removeTodo = function(todo) {
        angular.Array.remove(self.todos, todo);
    };

    self.todos = [];

    var countTodos = function(done) {
        return function() {
            return angular.Array.count(self.todos, function(x) {
                return x.done === (done === "done");
            });
        }
    };

    var pluralize = function( count, word ) {
        return count === 1 ? word : word + 's';
    };

    self.remainingTodos = countTodos("undone");

    self.finishedTodos = countTodos("done");

    self.itemsLeftText = function(){
        return pluralize(self.remainingTodos(), 'item') + ' left'
    };

    self.clearItemsText = function(){
        var finishedTodos = self.finishedTodos();
        return 'Clear ' + finishedTodos + ' completed ' + pluralize(finishedTodos, 'item');
    };

    self.clearCompletedItems = function() {
        var oldTodos = self.todos;
        self.todos = [];
        angular.forEach(oldTodos, function(todo) {
            if (!todo.done) self.todos.push(todo);
        });
    };

    self.toggleAllStates = function(){
        angular.forEach(self.todos, function(todo){
            todo.done = self.allChecked;
        })
    };

    self.hasFinishedTodos = function() {
        return self.finishedTodos() > 0;
    };

    self.hasTodos = function() {
        return self.todos.length > 0;
    };
};
