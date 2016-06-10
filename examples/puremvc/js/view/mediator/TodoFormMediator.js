/**
 * @author Mike Britton
 *
 * @class TodoFormMediator
 * @link https://github.com/PureMVC/puremvc-js-demo-todomvc.git
 */
puremvc.define({
		name: 'todomvc.view.mediator.TodoFormMediator',
		parent: puremvc.Mediator
	},

	// INSTANCE MEMBERS
	{
		// Notifications this mediator is interested in
		listNotificationInterests: function() {
			return [ todomvc.AppConstants.TODOS_FILTERED ];
		},

		// Code to be executed when the Mediator instance is registered with the View
		onRegister: function() {
			this.setViewComponent( new todomvc.view.component.TodoForm );
			this.viewComponent.addEventListener( todomvc.view.event.AppEvents.TOGGLE_COMPLETE, this );
			this.viewComponent.addEventListener( todomvc.view.event.AppEvents.TOGGLE_COMPLETE_ALL, this );
			this.viewComponent.addEventListener( todomvc.view.event.AppEvents.UPDATE_ITEM, this );
			this.viewComponent.addEventListener( todomvc.view.event.AppEvents.DELETE_ITEM, this );
			this.viewComponent.addEventListener( todomvc.view.event.AppEvents.ADD_ITEM, this );
			this.viewComponent.addEventListener( todomvc.view.event.AppEvents.CLEAR_COMPLETED, this );
		},

		// Handle events from the view component
		handleEvent: function ( event ) {
			switch( event.type ) {
				case todomvc.view.event.AppEvents.TOGGLE_COMPLETE_ALL:
					this.sendNotification( todomvc.AppConstants.TOGGLE_TODO_STATUS, event.doToggleComplete );
					break;

				case todomvc.view.event.AppEvents.DELETE_ITEM:
					this.sendNotification( todomvc.AppConstants.DELETE_TODO, event.todoId );
					break;

				case todomvc.view.event.AppEvents.ADD_ITEM:
					this.sendNotification( todomvc.AppConstants.ADD_TODO, event.todo );
					break;

				case todomvc.view.event.AppEvents.CLEAR_COMPLETED:
					this.sendNotification( todomvc.AppConstants.REMOVE_TODOS_COMPLETED );
					break;

				case todomvc.view.event.AppEvents.TOGGLE_COMPLETE:
				case todomvc.view.event.AppEvents.UPDATE_ITEM:
					this.sendNotification( todomvc.AppConstants.UPDATE_TODO, event.todo );
					break;
			 }

		},

		// Handle notifications from other PureMVC actors
		handleNotification: function( note ) {
			switch ( note.getName() ) {
				case todomvc.AppConstants.TODOS_FILTERED:
					this.viewComponent.setFilteredTodoList( note.getBody() );
					break;
			}
		},
	},

	// STATIC MEMBERS
	{
		NAME: 'TodoFormMediator'
	}
);
