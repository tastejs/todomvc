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

	/*-- export public interface -------------------------------*/

	todos.model = {
		tasks: function () {
			return tasks;
		},

		stats: function () {
			var stats = {};

			stats.total = tasks.length;

			stats.completed = tasks.filter(function (task) {
				return task.completed;
			}).length;

			stats.active = stats.total - stats.completed;

			return stats;
		},

		add: function (title) {
			var task = create(title, false);

			tasks.push(task);
			save();

			return task;
		},

		edit: function (id, title) {
			tasks.filter(function (task) {
				return task.id === id;
			})[0].title = title;

			save();
		},

		// toggle completion of task
		toggle: function (id, completed) {
			tasks.filter(function (task) {
				return task.id === id;
			})[0].completed = completed;

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
			tasks.forEach(function (task, index) {
				if (task.id === id) {
					tasks.splice(index, 1);
				}
			});

			save();
		},

		expunge: function () {
			tasks.forEach(function (task, index) {
				if (task.completed) {
					tasks.splice(index, 1);
				}
			});

			save();
		}
	};
})(todos, window.localStorage, 'todos-duel');
