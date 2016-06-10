/**
* Controls the main (root) UI container for the application.
*/
Ext.define('TodoDeftJS.controller.TodoController', {
	extend: 'Deft.mvc.ViewController',
	inject: ['todoStore'],

	config: {
		todoStore: null,
		currentTodo: null
	},

	control: {
		view: {
			beforecontainerkeydown: 'onNewTodoKeyDown',
			beforecontainerclick: 'onTodoToolsClick',
			beforeitemclick: 'onTodoClick',
			beforeitemdblclick: 'onTodoEditClick',
			beforeitemkeydown: 'onEditTodoKeyDown'
		}
	},

	init: function () {
		this.callParent(arguments);
		return this;
	},

	addTodo: function (title) {
		var newTodo;
		title = title.trim();

		if(title.length) {
			newTodo = Ext.create('TodoDeftJS.model.Todo', {
				title: Ext.util.Format.htmlEncode(title),
				completed: false
			});

			this.getTodoStore().add(newTodo);
		}

		Ext.dom.Query.selectNode('#new-todo').focus();
	},

	toggleCompleted: function (todo) {
		todo.set('completed', !todo.get('completed'));
	},

	deleteTodo: function (todo) {
		this.getTodoStore().remove(todo);
	},

	updateTodo: function (todo, title) {
		this.setCurrentTodo(null);

		if ((todo === null) || (todo === undefined)) {
			return;
		}

		todo.set('editing', false);
		title = title.trim();

		if (((title != null) && (title != undefined) && title.length)) {
			todo.set('title', Ext.util.Format.htmlEncode(title));
		} else {
			this.deleteTodo(todo);
		}

		Ext.dom.Query.selectNode('#new-todo').focus();
	},

	completedCount: function () {
		return this.getTodoStore().completedCount();
	},

	incompleteCount: function () {
		return this.getTodoStore().incompleteCount();
	},

	areAllComplete: function () {
		return this.getTodoStore().completedCount() === this.getTodoStore().count();
	},

	onNewTodoKeyDown: function (view, event) {
		var title;
		if (event.target.id === 'new-todo' && event.keyCode === Ext.EventObject.ENTER) {
			title = event.target.value.trim();
			this.addTodo(title);
			event.target.value = null;
			return false;
		}
		return true;
	},

	onTodoEditClick: function (view, todo, item, idx, event) {
		var editField;
		this.setCurrentTodo(todo);
		todo.set('editing', true);
		editField = Ext.dom.Query.selectNode('#todo-list li.editing .edit');
		editField.focus();
		// Ensure that focus() doesn't select all the text as well by resetting the value.
		editField.value = editField.value;
		Ext.fly(editField).on('blur', this.onTodoBlur, this);
		return false;
	},

	onTodoBlur: function (event, target) {
		Ext.fly(event.target).un('blur', this.onTodoBlur, this);
		if ((target != null) && (target != undefined)) {
			return this.updateTodo(this.getCurrentTodo(), target.value.trim());
		}
	},

	onEditTodoKeyDown: function (view, todo, item, idx, event) {
		var title;

		if (event.keyCode === Ext.EventObject.ENTER) {
			if (event.target.id === 'new-todo') {
				this.onNewTodoKeyDown(view, event);
				return false;
			}

			title = event.target.value.trim();
			Ext.fly(event.target).un('blur', this.onTodoBlur, this);
			this.updateTodo(todo, title);
			return false;
		}

		return true;
	},

	onTodoClick: function (view, todo, item, idx, event) {
		if (Ext.fly(event.target).hasCls('toggle')) {
			this.toggleCompleted(todo);
		} else if (Ext.fly(event.target).hasCls('destroy')) {
			this.deleteTodo(todo);
		}
		return true;
	},

	onTodoToolsClick: function (view, event) {
		if (Ext.fly(event.target).hasCls('toggleall')) {
			this.getTodoStore().toggleAllCompleted(event.target.checked);
		} else if (Ext.fly(event.target).hasCls('clearcompleted')) {
			this.getTodoStore().deleteCompleted();
		}
		return true;
	}

});