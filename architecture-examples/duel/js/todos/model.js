var todos = todos || {};

(function(todos, localStorage) {
	'use strict';

	var KEY = 'todos-DUEL',
		tasks = [];

	function save() {
		localStorage.setItem(KEY, JSON.stringify(tasks));
	}

	// initialize storage
	if (localStorage.getItem(KEY)) {
		tasks = JSON.parse(localStorage.getItem(KEY));
	}

	/*-- export public interface -------------------------------*/

	todos.model = {

//		task: function(id) {
//			for (var i=tasks.length-1; i>=0; --i) {
//				if (tasks[i].id === id) {
//					return tasks[i];
//				}
//			}
//		}

		tasks: function() {
			return tasks;
		},

		stats: function() {
			var stats = {
				total: tasks.length,
				left: tasks.length,
				completed: 0
			};

			for (var i=tasks.length-1; i>=0; --i) {
				if (tasks[i].done) {
					stats.completed++;
				}
			}
			stats.left -= stats.completed;

			return stats;
		},

		add: function(name) {

			var task = {
				// fast, compact, non-repeating, unique ID: e.g., 'c2wwu0vz.pz4zpvi'
				id: (new Date().getTime()+Math.random()).toString(36),
				name: name,
				done: false
			};

			tasks.push(task);
			save();

			return task;
		},

		edit: function(id, name) {
			for (var i=tasks.length-1; i>=0; --i) {
				if (tasks[i].id === id) {
					tasks[i].name = name;
					save();
					return;
				}
			}
		},

		// toggle done of task
		done: function(id, done) {
			for (var i=tasks.length-1; i>=0; --i) {
				if (tasks[i].id === id) {
					tasks[i].done = done;
					save();
					return;
				}
			}
		},

		// toggle done of all tasks
		doneAll: function(done) {
			for (var i=tasks.length-1; i>=0; --i) {
				tasks[i].done = done;
			}
			save();
		},

		remove: function(id) {
			for (var i=tasks.length-1; i>=0; --i) {
				if (tasks[i].id === id) {
					tasks.splice(i, 1);
					save();
					return;
				}
			}
		},

		expunge: function() {
			for (var i=tasks.length-1; i>=0; --i) {
				if (tasks[i].done) {
					tasks.splice(i, 1);
				}
			}
			save();
		}
	};

})(todos, window.localStorage || {});
