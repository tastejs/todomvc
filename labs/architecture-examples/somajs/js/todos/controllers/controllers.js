var todo = window.todo || {};

(function( window ) {
	'use strict';

	todo.TodoCommand = soma.Command.extend({
		execute: function( event ) {
			var model = this.getModel( todo.TodoModel.NAME );
			switch( event.type ) {
				case todo.TodoEvent.RENDER:
					this.getView( todo.TodoListView.NAME ).render( model.data, model.getActiveLength() );
					this.getView( todo.FooterView.NAME ).render( model.dataFooter );
					break;
				case todo.TodoEvent.CREATE:
					model.addItem( event.params.todoTitle );
					break;
				case todo.TodoEvent.DELETE:
					model.removeItem( event.params.todoId );
					break;
				case todo.TodoEvent.TOGGLE:
					model.toggleItem( event.params.todoId );
					break;
				case todo.TodoEvent.TOGGLE_ALL:
					model.toggleAll( event.params.toggleAll );
					break;
				case todo.TodoEvent.UPDATE:
					model.updateItem( event.params.todoId, event.params.todoTitle );
					break;
				case todo.TodoEvent.CLEAR_COMPLETED:
					model.clearCompleted();
					break;
			}

		}
	});

	todo.TodoEvent = soma.Event.extend({
		constructor: function( type, todoTitle, todoId, toggleAll ) {
			return soma.Event.call( this, type, {
				todoTitle: todoTitle,
				todoId: todoId,
				toggleAll: toggleAll
			});
		}
	});

	todo.TodoEvent.RENDER = 'TodoEvent.RENDER';
	todo.TodoEvent.CREATE = 'TodoEvent.CREATE';
	todo.TodoEvent.DELETE = 'TodoEvent.DELETE';
	todo.TodoEvent.UPDATE = 'TodoEvent.UPDATE';
	todo.TodoEvent.TOGGLE = 'TodoEvent.TOGGLE';
	todo.TodoEvent.TOGGLE_ALL = 'TodoEvent.TOGGLE_ALL';
	todo.TodoEvent.CLEAR_COMPLETED = 'TodoEvent.CLEAR_COMPLETED';

})( window );
