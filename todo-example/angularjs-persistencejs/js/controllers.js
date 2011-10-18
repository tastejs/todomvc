/* App Controllers */

App.Controllers.TodoController = function (persistencejs) {
    var self = this;
    self.newTodo = "";
	self.editTodoStartContent = "";

    self.addTodo = function() {
        if (self.newTodo.length === 0) return;
        
        self.todos.push({
            content: self.newTodo,
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
		self.editTodoStartContent = todo.content;
    };

	self.changeStatus = function(todo){
		persistencejs.changeStatus(todo);
	};
	
    self.finishEditing = function(todo) {
        todo.editing = false;
		persistencejs.edit(self.editTodoStartContent, todo.content);
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

    self.remainingTodos = countTodos("undone");

    self.finishedTodos = countTodos("done");

    self.clearCompletedItems = function() {
        var oldTodos = self.todos;
        self.todos = [];
        angular.forEach(oldTodos, function(todo) {
            if (!todo.done) self.todos.push(todo);
        });
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
	self.refresh = function(){ self.$root.$eval(); }

	self.loadTodos();
	
    /*
     The following code deals with hiding the hint *while* you are typing,
     showing it once you did *finish* typing (aka 500 ms since you hit the last key)
     *in case* the result is a non empty string
     */
    Rx.Observable.FromAngularScope(self, "newTodo")
        .Do(function() {
            self.showHitEnterHint = false;
        })
        .Throttle(500)
        .Select(function(x) {
            return x.length > 0;
        })
        .ToOutputProperty(self, "showHitEnterHint");
};

App.Controllers.TodoController.$inject = ['persistencejs'];