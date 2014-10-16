/*global window */
/*jshint camelcase:false */

var todos = todos || {};

(function (todos, document) {
	'use strict';

	/*-- private members -------------------------------*/

	var ENTER_KEY = 13;
	var STATS_ID = 'footer';
	var TODOAPP_ID = 'todoapp';
	var TASKS_ID = 'main';
	var LIST_ID = 'todo-list';
	var EDITING_CSS = 'editing';

	function getById(id) {
		return document.getElementById(id);
	}

	function refreshStats(stats) {
		// get the data
		var data = stats || todos.model.stats();

		// build the view
		var view = todos.views.Stats(data).toDOM();

		// replace old stats
		var old = getById(STATS_ID);
		if (old) {
			old.parentNode.replaceChild(view, old);
		} else {
			getById(TODOAPP_ID).appendChild(view);
		}
	}

	function refreshAll() {
		// get the data
		var data = {
			tasks: todos.model.tasks(),
			stats: todos.model.stats()
		};

		// build the view
		var view = todos.views.Tasks(data).toDOM();

		// replace old task list
		var old = getById(TASKS_ID);
		if (old) {
			old.parentNode.replaceChild(view, old);
		} else {
			getById(TODOAPP_ID).appendChild(view);
		}

		refreshStats(data.stats);
	}

	function add(input) {
		var title = (input.value || '').trim();
		input.value = '';

		if (!title) {
			return;
		}

		var task = todos.model.add(title);

		var list = getById(LIST_ID);
		if (list) {
			// add new at the top
			list.appendChild(todos.views.Task(task).toDOM());
			refreshStats();
		} else {
			refreshAll();
		}
	}

	function edit(input, id) {
		var title = (input.value || '').trim();
		input.value = title;

		if (title) {
			todos.model.edit(id, title);
		} else {
			todos.model.remove(id);
		}
		refreshAll();
	}

	/*-- export public interface -------------------------------*/

	// event handlers
	todos.actions = {
		addBlur: function () {
			add(this);
		},

		add_keypress: function (e) {
			if (e.keyCode === ENTER_KEY) {
				add(this);
			}
		},

		edit_blur: function (id) {
			// create a closure around the ID
			return function () {
				edit(this, id);
			};
		},

		edit_keypress: function () {
			// create a closure around the ID
			return function (e) {
				if (e.keyCode === ENTER_KEY) {
					// just blur so doesn't get triggered twice
					this.blur();
				}
			};
		},

		remove_click: function (id) {
			// create a closure around the ID
			return function () {
				todos.model.remove(id);
				refreshAll();
			};
		},

		clear_click: function () {
			todos.model.expunge();
			refreshAll();
		},

		content_dblclick: function () {
			// create a closure around the ID
			var toggleEditingMode = function (li) {
				if (li.tagName !== 'LI') {
					return toggleEditingMode(li.parentNode);
				}

				li.className = EDITING_CSS;

				var input = li.getElementsByTagName('input')[1];
				input.focus();
				input.value = input.value;
			};

			return function () {
				toggleEditingMode(this);
			};
		},

		completed_change: function (id) {
			// create a closure around the ID
			return function () {
				var checkbox = this;
				todos.model.toggle(id, checkbox.checked);
				refreshAll();
			};
		},

		toggle_change: function () {
			var checkbox = this;
			todos.model.toggleAll(checkbox.checked);
			refreshAll();
		}
	};

	/*-- init task list -------------------------------*/

	(function (body) {
		// build out task list
		var view = todos.views.TodoApp({
			tasks: todos.model.tasks(),
			stats: todos.model.stats()
		}).toDOM();

		// insert at top
		body.insertBefore(view, body.firstChild);
	})(document.body);

})(todos, window.document);
