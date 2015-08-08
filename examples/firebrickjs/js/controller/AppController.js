/*!
 * @author Steven Masala [me@smasala.com]
 */
define(['jquery', 'knockout-mapping'], function ($, kom) {
	'use strict';
	var ENTER_KEY = 13;
	var ESCAPE_KEY = 27;
	return Firebrick.createController('TODOMVC.controll.AppController', {

		init: function () {
			var self = this;

			self.app.on({
				'.new-todo': {
					keyup: self.onNewKeyUp
				},
				'.todo-list li label': {
					dblclick: self.onLabelDblClick
				},
				'.todo-list li input.edit': {
					blur: self.onEditBlur,
					keyup: self.onEditKeyUp
				},
				'.clear-completed': {
					click: self.clearCompleted
				},
				'.destroy': {
					click: self.onDestroy
				},
				scope: self
			});

			self.routes();
			self.onUnload();

			return self.callParent(arguments); //important!
		},

		/**
		 * @method routes
		 */
		routes: function () {
			var self = this;
			Firebrick.router.hashbang.set({
				'*/index.html': {	//for the selenium tests
					require: ['view/AppView']
				},
				'/': {
					require: ['view/AppView']
				},
				'*#/': {
					require: ['view/AppView'],
					callback: function () {
						self.filterTodos('none');
					}
				},
				'*#/:filter': {
					require: ['view/AppView'],
					callback: function (filter) {
						self.filterTodos(filter);
					}
				}
			});
			Firebrick.router.init();
		},

		/**
		 * @method onUnload
		 */
		onUnload: function () {
			$(window).unload(function () {
				var todos = kom.toJS(Firebrick.getById('mytodoview').getData().todos);
				if (todos.length) {
					window.localStorage.setItem('todomvc.todos', JSON.stringify(todos));
				}
			});
		},

		/**
		 * @method filterTodos
		 */
		filterTodos: function (filter) {
			Firebrick.getById('mytodoview').getData().filter(filter);
		},

		/**
		 * @method clearCompleted
		 */
		clearCompleted: function () {
			var todos = Firebrick.getById('mytodoview').getData().todos;
			Firebrick.getById('mytodoview').getData().todos(todos().filter(function (it) {
				return !it.done();
			}));
		},

		/**
		 * @method onNewKeyUp
		 */
		onNewKeyUp: function (event, element) {
			var self = this;
			var $el;
			var key = event.which;
			var value;
			if (key === ENTER_KEY) {
				$el = $(element);
				value = $el.val();
				self.newTodo($el.val());
				$el.val('');
			}
		},

		/**
		 * @method newTodo
		 * @param text {String} text for the new todo
		 */
		newTodo: function (text) {
			Firebrick.getById('mytodoview').getData().todos.push(kom.fromJS({
				text: text.trim(),
				done: false,
				editing: false
			}));
		},

		/**
		 * @method onDestroy
		 */
		onDestroy: function (event, element) {
			var self = this;
			var $li = $(element).closest('li');
			var id = $li.attr('id');
			self.deleteTodo(id);
		},

		/**
		 * @method deleteTodo
		 * @param id {Integer}
		 */
		deleteTodo: function (id) {
			Firebrick.getById('mytodoview').getData().todos.splice(id, 1);
		},

		/**
		 * @method onLabelDblClick
		 */
		onLabelDblClick: function (event, element) {
			var self = this;
			var $el = $(element).closest('li');
			self.toggleEdit($el);
		},

		/**
		 * @method onEditBlur
		 */
		onEditBlur: function (event, element) {
			var self = this;
			var $el = $(element).parent('li');
			var $edit = $('input.edit', $el);
			var val = $edit.val().trim();
			var todos = Firebrick.getById('mytodoview').getData().todos;
			todos()[$el.attr('id')].text(val);
			self.toggleEdit($el);
		},

		/**
		 * @method onEditKeyUp
		 * @param $li {jQuery Object}
		 */
		onEditKeyUp: function (event, element) {
			var self = this;
			var key = event.which;
			var val;
			var $el = $(element);
			var $li = $el.closest('li');
			if (key === ENTER_KEY) {
				val = $el.val().trim();
				if (val) {
					$el.blur();
				} else {
					self.deleteTodo($li.attr('id'));
				}
			} else if (key === ESCAPE_KEY) {
				self.cancelEdit($li);
			}
		},

		/**
		 * @method cancelEdit
		 * @param $li {jQuery Object}
		 */
		cancelEdit: function ($li) {
			var $edit = $li.find('.edit');
			$li.prop('reset-value', $li.prop('original-value'));
			$edit.blur();
		},

		/**
		 * @method toggleEdit
		 * @param $li {jQuery Object} parent li element
		 */
		toggleEdit: function ($li) {
			var data = Firebrick.utils.dataFor($li[0]);
			var editing = data.editing();
			var $edit = $li.find('.edit');
			data.editing(!editing);
			if ($li.prop('reset-value')) {
				data.text($li.prop('reset-value'));
				$li.removeProp('reset-value');
			} else if (!editing) {
				$li.prop('original-value', data.text());
				$edit.focus();
			}
		}

	});
});
