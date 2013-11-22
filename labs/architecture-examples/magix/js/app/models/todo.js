/*global KISSY */
KISSY.add('app/models/todo', function (S) {
	'use strict';

	var todos;

	if (window.localStorage) {
		todos = localStorage.getItem('todos-magix');
		todos = todos ? JSON.parse(todos) : [];
	} else {
		todos = [];
	}

	var exports = {
		create: function (attrs) {
			var obj = S.mix({
				completed: false,
				editing: false,
				id: S.guid('todo-')
			}, attrs);

			todos.push(obj);
			exports.persist();

			return obj;
		},

		all: function () {
			return todos;
		},

		find: function (id) {
			var todo;

			S.each(todos, function (td) {
				if (td.id === id) {
					todo = td;
				}
			});

			return todo;
		},

		delete: function (attrs) {
			if (!S.isPlainObject(attrs)) {
				exports.delete({ attrs: attrs });
			}
			var i = todos.length - 1;
			var p;
			var match;
			var found;

			for (; i >= 0; i--) {
				match = true;
				for (p in attrs) {
					if (todos[i][p] !== attrs[p]) {
						match = false;
						break;
					}
				}
				if (match) {
					found = true;
					todos.splice(i, 1);
				}
			}

			if (found) {
				exports.persist();
			}
		},

		where: function (attrs) {
			var res = [];
			var match;

			S.each(todos, function (td) {
				match = true;
				for (var p in attrs) {
					if (td[p] !== attrs[p]) {
						match = false;
						break;
					}
				}
				if (match) {
					res.push(td);
				}
			});

			return res;
		},

		update: function (id, attrs) {
			function update(td) {
				for (var p in attrs) {
					td[p] = attrs[p];
				}
			}

			if (S.isPlainObject(id)) {
				attrs = id;
				id = null;
			}

			delete attrs.id;

			if (id) {
				update(exports.find(id));
			} else {
				S.each(todos, update);
			}

			exports.persist();
		},

		persist: function () {
			if (!window.localStorage) {
				return;
			}

			localStorage.setItem(
				'todos-magix',
				JSON.stringify(todos, function (p, value) {
					return p === 'editing' ? undefined : value;
				})
			);
		}
	};

	return exports;
});