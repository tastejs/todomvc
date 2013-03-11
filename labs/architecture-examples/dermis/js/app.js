/*global $ dermis require*/
(function () {
	'use strict';

	dermis.route('/');
	dermis.route('/active');
	dermis.route('/completed');

	require(['js/models/Todo', 'js/models/Todos', 'js/storage'], function (Todo, Todos, storage) {
		//Bind Todos to DOM
		Todos.bind($('#content'));

		$('#content').on('dblclick', '.view > label', function () {
			$(this).parent().siblings('input').focus();
		});

		//Load previous todos
		var todos = storage.load('todos-dermis');
		if (todos) {
			todos.forEach(function (todo) {
				Todos.push(Todo.create({collection: Todos})
					.set(todo)
					.set({editable: false}));
			});
		}

		//Save when todos modified
		var save = function () {
			storage.save('todos-dermis', Todos.serialize());
		};
		Todos.on('change', save).on('change:child', save);

		//Add todo when box submitted
		var box = $('#new-todo');
		box.change(function () {
			var title = box.val().trim();
			if (title.length === 0) {
				return;
			}
			Todos.push(Todo.create({collection: Todos})
				.set({
					title: title,
					completed: false,
					editable: false
				}));
			box.val('');
		});
	});
})();
