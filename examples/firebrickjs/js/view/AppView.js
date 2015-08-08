/*!
 * @author Steven Masala [me@smasala.com]
 */
define(['text!./AppView.html', 'knockout', 'jquery'], function (tpl, ko, $) {
	'use strict';
	return Firebrick.createView('TODOMVC.view.AppView', {
		id: 'mytodoview',
		target: '#app',
		tpl: tpl,
		store: {
			todos: (function () {
				var todos = window.localStorage.getItem('todomvc.todos');
				if (todos) {
					return JSON.parse(todos);
				}
				return [];
			})()
		},
		init: function () {
			var self = this;
			var computed;

			self.on('rendered', function () {
				$('.new-todo').focus();
			});

			self.store.allChecked = function () {
				computed = computed || ko.computed({
					read: function () {
						var tasks = self.store.todos || self.getData().todos();
						var done;

						for (var i = 0; i < tasks.length; i++) {
							done = $.isFunction(tasks[i].done) ? tasks[i].done() : tasks[i].done;
							if (!done) {
								return false;
							}
						}
						return true;
					},
					write: function (newValue) {
						var tasks = self.getData().todos();
						for (var i = 0; i < tasks.length; i++) {
							tasks[i].done(newValue);
						}
					}
				});
				return computed;
			};

			self.store.filter = 'none';

			self.store.getTodos = function () {
				var data = self.getData();
				var filter = data.filter();
				var todos = data.todos();
				var filtered = ko.observableArray();
				var it;
				var done;

				if (filter === 'none') {
					return todos;
				} else {
					for (var i = 0, l = todos.length; i < l; i++) {
						it = todos[i];
						done = it.done();
						if (filter === 'active' && !done) {
							filtered.push(it);
						} else if (filter === 'completed' && done) {
							filtered.push(it);
						}
					}
					return filtered;
				}

			};

			self.store.getTodosLeft = function () {
				return self.getData().todos().filter(function (it) {
					return !it.done();
				}).length;
			};

			self.store.getTodosCompleted = function () {
				return self.getData().todos().length - self.getData().getTodosLeft();
			};

			self.store.itemText = function () {
				var num = self.getData().getTodosLeft();
				if (num === 1) {
					return 'item';
				} else {
					return 'items';
				}
			}

			return self.callParent(arguments); //important!
		}
	});
});
