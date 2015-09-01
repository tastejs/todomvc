/*global window */

var todos = todos || {};

(function (todos, localStorage, KEY) {
	'use strict';

	/*-- private members -------------------------------*/

	var tasks;

	// model uses localStorage as the underlying data store
	// this creates a poor man's localStorage polyfill
	localStorage = localStorage || (function () {
		var storage = {};
		return {
			getItem: function (key) {
				return storage[key];
			},
			setItem: function (key, value) {
				storage[key] = value;
			}
		};
	})();

	function create(title, completed) {
		return {
			// fast, compact, non-repeating, unique ID: e.g., 'c2wwu0vz.pz4zpvi'
			id: (new Date().getTime() + Math.random()).toString(36),
			title: title,
			completed: !!completed
		};
	}

	function find(id) {
		return tasks.filter(function (task) {
			return task.id === id;
		})[0];
	}

	function save() {
		// if doesn't support JSON then will be directly stored in polyfill
		var value = typeof JSON !== 'undefined' ? JSON.stringify(tasks) : tasks;
		localStorage.setItem(KEY, value);
	}

	// initialize storage
	var value = localStorage.getItem(KEY);
	if (value) {
		// if doesn't support JSON then will be directly stored in polyfill
		tasks = typeof JSON !== 'undefined' ? JSON.parse(value) : value;
	} else {
		tasks = [];
	}

	function filterTasks(filter) {
		if (filter === 'completed' || filter === 'active') {
			var completed = filter === 'completed';
			return tasks.filter(function (task) {
				return task.completed === completed;
			});
		}
		return tasks;
	}

	function calcStats(filter) {
		var stats = {
			total: tasks.length,

			completed: tasks.filter(function (task) {
					return task.completed;
				}).length,

			filter: filter || ''
		};

		stats.active = stats.total - stats.completed;

		return stats;
	}

	/*-- export public interface -------------------------------*/

	todos.model = {
		viewData: function (filter) {
			return {
				tasks: filterTasks(filter),
				stats: calcStats(filter)
			};
		},

		add: function (title) {
			var task = create(title, false);

			tasks.push(task);
			save();

			return task;
		},

		find: find,

		edit: function (id, title) {
			(find(id) || {}).title = title;

			save();
		},

		// toggle completion of task
		toggle: function (id, completed) {
			(find(id) || {}).completed = completed;

			save();
		},

		// toggle completion of all tasks
		toggleAll: function (completed) {
			tasks.forEach(function (task) {
				task.completed = completed;
			});

			save();
		},

		remove: function (id) {
			// traverse in reverse for removals
			for (var i = tasks.length - 1; i >= 0; i--) {
				if (tasks[i].id === id) {
					tasks.splice(i, 1);
				}
			}

			save();
		},

		expunge: function () {
			// traverse in reverse for removals
			for (var i = tasks.length - 1; i >= 0; i--) {
				if (tasks[i].completed) {
					tasks.splice(i, 1);
				}
			}

			save();
		}
	};
})(todos, window.localStorage, 'todos-duel');
