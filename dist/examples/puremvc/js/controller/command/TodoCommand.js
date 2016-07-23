/**
 * @author Mike Britton, Cliff Hall
 *
 * @class TodoCommand
 * @link https://github.com/PureMVC/puremvc-js-demo-todomvc.git
 */
puremvc.define ({
		name: 'todomvc.controller.command.TodoCommand',
		parent: puremvc.SimpleCommand
	},

	// INSTANCE MEMBERS
	{
		/**
		 * Perform business logic (in this case, based on Notification name)
		 * @override
		 */
		execute: function ( note ) {
			var proxy = this.facade.retrieveProxy( todomvc.model.proxy.TodoProxy.NAME );

			switch( note.getName() ) {
				case todomvc.AppConstants.ADD_TODO:
					proxy.addTodo( note.getBody() );
					break;

				case todomvc.AppConstants.DELETE_TODO:
					proxy.deleteTodo( note.getBody() );
					break;

				case todomvc.AppConstants.UPDATE_TODO:
					proxy.updateTodo( note.getBody() );
					break;

				case todomvc.AppConstants.TOGGLE_TODO_STATUS:
					proxy.toggleCompleteStatus( note.getBody() );
					break;

				case todomvc.AppConstants.REMOVE_TODOS_COMPLETED:
					proxy.removeTodosCompleted();
					break;

				case todomvc.AppConstants.FILTER_TODOS:
					proxy.filterTodos( note.getBody() );
					break;

				default:
					console.log('TodoCommand received an unsupported Notification');
					break;
			}
		}
	}
);
