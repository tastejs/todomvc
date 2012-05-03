/* App Controllers */

App.Controllers.TodoController = function (persistencejs) {
    var self = this;
    self.newTodo = "";
	self.editTodoStartContent = "";

    self.addTodo = function() {
        if (self.newTodo.length === 0) return;
        
        self.todos.push({
            title: self.newTodo,
            done: false,
            editing: false
        });
		persistencejs.add(self.newTodo);
        self.newTodo = "";
    };

    self.editTodo = function(todo) {
        angular.forEach(self.todos, function(value) {
            value.editing = false;
        });
        todo.editing = true;
		self.editTodoStartContent = todo.title;
    };

	self.changeStatus = function(todo){
		persistencejs.changeStatus(todo);
	};
	
    self.finishEditing = function(todo) {
		if (todo.title.trim().length === 0){
            self.removeTodo(todo);
        }else{
			todo.editing = false;
			persistencejs.edit(self.editTodoStartContent, todo.title);
		}
    };

    self.removeTodo = function(todo) {
        angular.Array.remove(self.todos, todo);
		persistencejs.remove(todo);
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
	
	self.itemsLeftText = function(){
        return pluralize(self.remainingTodos(), 'item') + ' left'
    };
	
	self.clearItemsText = function(){
        var finishedTodos = self.finishedTodos();
        return 'Clear ' + finishedTodos + ' completed ' + pluralize(finishedTodos, 'item');
    };
	
    self.remainingTodos = countTodos("undone");

    self.finishedTodos = countTodos("done");

    self.clearCompletedItems = function() {
        var oldTodos = self.todos;
        self.todos = [];
        angular.forEach(oldTodos, function(todo) {
            if (!todo.done) self.todos.push(todo);
        });
		persistencejs.clearCompletedItems();
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
	
	self.loadTodos = function(){
		persistencejs.fetchAll(self);
	}
	
	self.refresh = function(){ self.$apply(); }

	self.loadTodos();
};

App.Controllers.TodoController.$inject = ['persistencejs'];