/*global KISSY */
KISSY.add('app/views/default', function (S, View, Router, Todo, XTemplate, Node) {
	'use strict';

	var KEY_ENTER = 13;
	var KEY_ESCAPE = 27;
	var $ = Node.all;

	return View.extend({
		render: function () {
			var filter = this.location.pathname.replace(/^\//, '');
			var todos;
			var completedTodos = Todo.where({ completed: true });
			var activeTodos = Todo.where({ completed: false });
			var markup;

			filter = filter.split('/').shift() || 'all';
			if ('active' === filter) {
				todos = activeTodos;
			} else if ('completed' === filter) {
				todos = completedTodos;
			} else {
				todos = Todo.all();
			}

			markup = new XTemplate(this.template).render({
				todos: todos,
				activeTodos: activeTodos,
				completedTodos: completedTodos,
				filter: filter
			});
			this.setViewHTML(markup);

			// Ugly hack for focusing on the current editing todo
			S.each(todos, function (td) {
				if (td.editing) {
					$('li[data-id="' + td.id + '"]').one('.edit').fire('focus');
				}
			});
		},

		locationChange: function () {
			this.render();
		},

		'quitEditing<focusout>': function (e) {
			var ev = e.domEvent;
			var todo = Todo.find($(ev.target).parent('li').attr('data-id'));

			todo.editing = false;
			this.render();
		},

		'addTodo<keyup>': function (e) {
			var ev = e.domEvent;
			var value = ev.target.value;

			if (value && (KEY_ENTER === ev.keyCode)) {
				Todo.create({ title: value });
				this.render();
			} else if (KEY_ESCAPE === ev.keyCode) {
				this.render();
			}
		},

		'editTodo<dblclick>': function (e) {
			var ev = e.domEvent;
			var li = $(ev.target).parent('li');
			var todo = Todo.find(li.attr('data-id'));

			todo.editing = true;
			this.render();
		},

		'updateTodo<keyup>': function (e) {
			var ev = e.domEvent;
			var value = ev.target.value;
			var li = $(ev.target).parent('li');
			var id = li.attr('data-id');

			if (value && (KEY_ENTER === ev.keyCode)) {
				Todo.update(id, {
					title: value,
					editing: false
				});
				this.render();
			} else if (KEY_ESCAPE === ev.keyCode) {
				Todo.update(id, { editing: false });
				this.render();
			}
		},

		'toggleTodo<click>': function (e) {
			var ev = e.domEvent;
			var li = $(ev.target).parent('li');

			Todo.update(li.attr('data-id'), { completed: ev.target.checked });
			this.render();
		},

		'toggleAll<click>': function (e) {
			Todo.update({ completed: e.domEvent.target.checked });
			this.render();
		},

		'deleteTodo<click>': function (e) {
			var ev = e.domEvent;
			var li = $(ev.target).parent('li');

			Todo.delete(li.attr('data-id'));
			this.render();
		},

		'clearCompleted<click>': function () {
			Todo.delete({ completed: false });
			this.render();
		}
	});
}, {
	requires: ['magix/view', 'magix/router', 'app/models/todo', 'xtemplate', 'node', 'app/exts/pc-events']
});