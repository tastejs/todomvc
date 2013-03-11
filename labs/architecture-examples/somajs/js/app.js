var todo = window.todo || {};

(function( window ) {
	'use strict';

	todo.TodoApp = new soma.Application.extend({

		init: function() {

			this.addModel( todo.TodoModel.NAME, new todo.TodoModel() );

			this.addCommand( todo.TodoEvent.RENDER, todo.TodoCommand );
			this.addCommand( todo.TodoEvent.CREATE, todo.TodoCommand );
			this.addCommand( todo.TodoEvent.DELETE, todo.TodoCommand );
			this.addCommand( todo.TodoEvent.TOGGLE, todo.TodoCommand );
			this.addCommand( todo.TodoEvent.UPDATE, todo.TodoCommand );
			this.addCommand( todo.TodoEvent.TOGGLE_ALL, todo.TodoCommand );
			this.addCommand( todo.TodoEvent.CLEAR_COMPLETED, todo.TodoCommand );

			this.addView( todo.TodoListView.NAME, new todo.TodoListView( $('#todo-list')[0] ) );
			this.addView( todo.FooterView.NAME, new todo.FooterView( $('#footer')[0] ) );
			this.addView( todo.TodoInputView.NAME, new todo.TodoInputView( $('#new-todo')[0] ) );
		},

		start: function() {
			this.dispatchEvent( new todo.TodoEvent( todo.TodoEvent.RENDER ) );
		}

	});

	var app = new todo.TodoApp();

})( window );
