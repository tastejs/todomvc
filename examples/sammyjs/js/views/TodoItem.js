/*global jQuery, TodoApp */

(function ($) {
	'use strict';

	var TodoItem = {
		renderAllTodos: function (e, data) {
			this.renderEach('templates/todoItem.template', data.visible).then(function () {
				$('#todo-list').html(this.content);

				TodoApp.trigger('todoItemsRendered', data);
			});
		},

		toggleCompleteClass: function (e, data) {
			if (data.completed) {
				$('[data-id="' + data.id + '"]').addClass('completed');
			} else {
				$('[data-id="' + data.id + '"]').removeClass('completed');
			}
		},

		editingTodo: function (e, data) {
			var todo = $('[data-id="' + data.id + '"]');

			todo.addClass('editing');

			todo.find('.edit').focus().val(todo.find('.edit').val());
		},

		doneEditingTodo: function (e, data) {
			var todo = $('[data-id="' + data.id + '"]');

			todo.removeClass('editing');

			if (data.name) {
				todo.find('label').text(data.name);
				todo.find('.edit').val(data.name);
			}
		}
	};

	TodoApp.bind('todosUpdated', TodoItem.renderAllTodos);

	TodoApp.bind('toggleAllTodosCompleted', TodoItem.toggleCompleteClass);
	TodoApp.bind('toggledTodoCompleted', TodoItem.toggleCompleteClass);

	TodoApp.bind('editingTodo', TodoItem.editingTodo);
	TodoApp.bind('cancelEditingTodo', TodoItem.doneEditingTodo);
	TodoApp.bind('doneEditingTodo', TodoItem.doneEditingTodo);
})(jQuery);
