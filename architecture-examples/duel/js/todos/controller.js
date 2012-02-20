var todos = todos || {};

(function(todos, document) {
	'use strict';

	var ENTER_KEY = 0x0D;

	function getById(id) {
		return document.getElementById(id);
	}

	function rebuildStats(stats) {
		// get the data
		var data = stats || todos.model.stats();
		// build the view
		var view = todos.views.stats(data).toDOM();

		// replace old
		var old = getById('todo-stats');
		if (old) {
			old.parentNode.replaceChild(view, old);
		} else {
			getById('todoapp').appendChild(view);
		}
	}

	function rebuildAll() {
		// get the data
		var data = {
			tasks: todos.model.tasks(),
			stats: todos.model.stats()
		};

		// build the view
		var view = todos.views.tasks(data).toDOM();

		// replace old
		var old = getById('main');
		if (old) {
			old.parentNode.replaceChild(view, old);
		} else {
			getById('todoapp').appendChild(view);
		}

		rebuildStats(data.stats);
	}

	/*-- export public interface -------------------------------*/

	// event handlers
	todos.actions = {
		add_keypress: function(e) {
			if (e.keyCode === ENTER_KEY) {
				var input = this;
				var task = todos.model.add(input.value);
				input.value = '';

				var list = getById('todo-list');
				if (list) {
					list.appendChild(todos.views.task(task).toDOM());
					rebuildStats();
				} else {
					rebuildAll();
				}
			}
		},

		edit_keypress: function(id) {
			// create a closure around the ID
			return function(e) {
				var input = this;
				if (e.keyCode === ENTER_KEY) {
					todos.model.edit(id, input.value);
					rebuildAll();
				}
			};
		},

		remove_click: function(id) {
			// create a closure around the ID
			return function(e) {
				todos.model.remove(id);
				rebuildAll();
			};
		},

		clear_click: function() {
			todos.model.expunge();
			rebuildAll();
		},

		content_dblclick: function(id) {
			// create a closure around the ID
			return function(e) {
				var li = this;
				li.className = 'editing';
				li.getElementsByTagName('input')[1].focus();
			};
		},

		done_change: function(id) {
			// create a closure around the ID
			return function(e) {
				var checkbox = this;
				todos.model.done(id, checkbox.checked);
				rebuildAll();
			};
		},

		toggle_change: function(e) {
			var checkbox = this;
			todos.model.doneAll(checkbox.checked);
			rebuildAll();
		}
	};

	/*-- initialize app UI -------------------------------*/

	document.body.appendChild(
		todos.views.main({
			tasks: todos.model.tasks(),
			stats: todos.model.stats()
		}).toDOM()
	);

})(todos, document);
