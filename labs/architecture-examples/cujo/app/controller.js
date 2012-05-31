define(function () {
	"use strict";

	var updateRemainingCount, textProp;

	updateRemainingCount = normalizeTextProp;

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

			this.updateRemainingCount(remaining);

			return checked;
		},

		updateRemainingCount: function (remaining) {
			updateRemainingCount(this.remainingNodes, remaining);
			return remaining;
		}

	};

	function normalizeTextProp () {
		// sniff for proper textContent property
		textProp = 'textContent' in document.documentElement ? 'textContent' : 'innerText';
		// resume normally
		(updateRemainingCount = setTextProp).apply(this, arguments);
	}

	function setTextProp (nodes, value) {
		for (var i = 0; i < nodes.length; i++) {
			nodes[i][textProp] = '' + value;
		}
	}

});