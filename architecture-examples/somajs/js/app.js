var Constants = {
	ENTER_KEY: 13
};

(function( window ) {

	'use strict';

	var TodoApp = new soma.Application.extend({
		init: function() {

			this.addModel(TodoModel.NAME, new TodoModel());

			this.addCommand(TodoEvent.RENDER, TodoCommand);
			this.addCommand(TodoEvent.CREATE, TodoCommand);
			this.addCommand(TodoEvent.DELETE, TodoCommand);
			this.addCommand(TodoEvent.TOGGLE, TodoCommand);
			this.addCommand(TodoEvent.UPDATE, TodoCommand);
			this.addCommand(TodoEvent.TOGGLE_ALL, TodoCommand);
			this.addCommand(TodoEvent.CLEAR_COMPLETED, TodoCommand);

			this.addView(TodoListView.NAME, new TodoListView($('#todo-list')[0]));
			this.addView(FooterView.NAME, new FooterView($('#footer')[0]));
			this.addView(TodoInputView.NAME, new TodoInputView($('#new-todo')[0]));
		},
		start: function() {
			this.dispatchEvent(new TodoEvent(TodoEvent.RENDER));
		}
	});

	var app = new TodoApp();

})( window );
