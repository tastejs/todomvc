define(function () {
	"use strict";

	return {
		createTodo: function() {},
		removeTodo: function() {},

		removeCompleted: function() {
			var todos = this.todos;

			todos.forEach(function(todo) {
				if(todo.complete) todos.remove(todo);
			});

			this.updateCount();
		},

		toggleAll: function() {
			var todos, complete;

			todos = this.todos;
			complete = this.masterCheckbox.checked;

			todos.forEach(function(todo) {
				todo.complete = complete;
				todos.update(todo);
			});
		},

		updateCount: function() {
			var total, checked;

			total = checked = 0;

			this.todos.forEach(function(todo) {
				total++;
				if(todo.complete) checked++;
			});

			this.masterCheckbox.checked = total > 0 && checked === total;

			this.countNode.innerHTML = checked;
			this.remainingNode.innerHTML = total - checked;

			return checked;
		}
	}

});