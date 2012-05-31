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
			var total, checked, remaining;

			total = checked = 0;

			this.todos.forEach(function(todo) {
				total++;
				if(todo.complete) checked++;
			});

			// TODO: It may make sense to move this stuff to a JS view
			this.masterCheckbox.checked = total > 0 && checked === total;

			this.countNode.innerHTML = checked;

			remaining = total - checked;
			// TODO: It would be nice to abstract this kind of singular/pluralization
			this.remainingNode.innerHTML =
				(remaining === 1 ? this.strings.itemsLeft.singular : this.strings.itemsLeft.plural)
					.replace(/\{count\}/, function() { return remaining; });

			return checked;
		}
	}
});