(function( window ) {
	'use strict';

	dermis.route('/');
	dermis.route('/active');
	dermis.route('/completed');

	require(['js/models/Todo', 'js/models/Todos', 'js/storage'], function(Todo, Todos, storage){
		//Bind Todos to DOM
		Todos.bind($('#content'));

		//Load previous todos
		var todos = storage.load('todos-dermis');
		if(todos){
			todos.forEach(function(todo){
				todo.editable = false;
				Todos.push(Todo.create().set(todo));
			});
		}

		//Save when todos modified
		Todos.on('change:items', function(){
			storage.save('todos-dermis', Todos.serialize());
		});

		//Add todo when box submitted
		var box = $('#new-todo');
		box.change(function(){
			var title = box.val().trim();
			if(title.length === 0) return;
			Todos.push(Todo.create()
			.set({
				title: title,
				completed: false,
				active: true,
				editable: false
			}));
			box.val('');
		});
	});
})( window );