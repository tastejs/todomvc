/*global jQuery, TodoApp */

(function ($) {
	'use strict';

	var TodoList = {
		elem: {
			todoapp: '#todoapp',
			main: '#main',
			footer: '#footer'
		},

		render: function () {
			TodoList.elem.todoapp = $(TodoList.elem.todoapp);
			TodoList.elem.main = $(TodoList.elem.main);
			TodoList.elem.footer = $(TodoList.elem.footer);

			this.render('templates/todos.template').then(function () {
				TodoList.elem.main.html(this.content);

				TodoApp.trigger('todoListRendered');
			});
		},

		refreshStats: function (e, data) {
			var todoData = {
				itemsLeft: data.active.length || 0,
				completedCount: data.completed.length || 0,
				flag: data.flag || ''
			};

			// Toggles the `#toggle-all` checkbox if all items are completed.
			$('#toggle-all').prop('checked', data.completed.length === data.all.length ? 'checked' : false);

			// Hides '#main' and '#footer' unless there are todoItems.
			TodoList.elem.main.toggle(data.all.length > 0);
			TodoList.elem.footer.toggle(data.all.length > 0);

			this.render('templates/footer.template', todoData).then(function () {
				TodoList.elem.footer.html(this.content);
			});
		}
	};

	TodoApp.bind('launch', TodoList.render);

	TodoApp.bind('todoItemsRendered', TodoList.refreshStats);
})(jQuery);
