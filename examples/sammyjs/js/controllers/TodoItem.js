/*global jQuery, TodoApp */

(function ($) {
	'use strict';

	var ESCAPE_KEY = 27;
	var ENTER_KEY = 13;

	var TodoItem = {
		// `effectCause`
		// i.e. "removeClick" = "a click to remove a todoItem"

		removeClick: function () {
			TodoApp.trigger('removeTodo', {
				id: $(this).parents('li').data('id')
			});
		},

		toggleClick: function () {
			TodoApp.trigger('toggleTodoCompleted', {
				id: $(this).parents('li').data('id')
			});
		},

		editDblClick: function () {
			$(this).parents('li').data('original-name', $(this).text());

			TodoApp.trigger('editingTodo', {
				id: $(this).parents('li').data('id')
			});
		},

		editBlur: function () {
			TodoApp.trigger('doneEditingTodo', {
				id: $(this).parents('li').data('id'),
				name: $.trim($(this).val())
			});
		},

		editKeyup: function (e) {
			if (e.which === ESCAPE_KEY) {
				$(this).trigger('cancelEditingTodo', {
					id: $(this).parents('li').data('id'),
					name: $(this).parents('li').data('original-name')
				});
			}

			if (e.which === ENTER_KEY) {
				$(this).trigger('blur');
			}
		},

		init: function () {
			$('#todo-list')
				.on('click', '.destroy', TodoItem.removeClick)
				.on('click', '.toggle', TodoItem.toggleClick)
				.on('dblclick', 'label', TodoItem.editDblClick)
				.on('blur', '.edit', TodoItem.editBlur)
				.on('keyup', '.edit', TodoItem.editKeyup);
		}
	};

	TodoApp.bind('todoListRendered', TodoItem.init);
})(jQuery);
