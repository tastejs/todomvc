var TodoCommand = soma.Command.extend({
	execute: function(event) {
		var model = this.getModel(TodoModel.NAME);
		switch(event.type) {
			case TodoEvent.RENDER:
				this.getView(TodoListView.NAME).render(model.data);
				this.getView(FooterView.NAME).render(model.dataFooter);
				break;
			case TodoEvent.CREATE:
				model.addItem(event.params.todoTitle);
				break;
			case TodoEvent.DELETE:
				model.removeItem(event.params.todoId);
				break;
			case TodoEvent.TOGGLE:
				model.toggleItem(event.params.todoId);
				break;
			case TodoEvent.TOGGLE_ALL:
				model.toggleAll(event.params.toggleAll);
				break;
			case TodoEvent.UPDATE:
				model.updateItem(event.params.todoId, event.params.todoTitle);
				break;
			case TodoEvent.CLEAR_COMPLETED:
				model.clearCompleted();
				break;
		}
	}
});

var TodoEvent = soma.Event.extend({
	constructor: function(type, todoTitle, todoId, toggleAll) {
		return soma.Event.call(this, type, {todoTitle:todoTitle, todoId:todoId, toggleAll:toggleAll});
	}
});
TodoEvent.RENDER = 'TodoEvent.RENDER';
TodoEvent.CREATE = 'TodoEvent.CREATE';
TodoEvent.DELETE = 'TodoEvent.DELETE';
TodoEvent.UPDATE = 'TodoEvent.UPDATE';
TodoEvent.TOGGLE = 'TodoEvent.TOGGLE';
TodoEvent.TOGGLE_ALL = 'TodoEvent.TOGGLE_ALL';
TodoEvent.CLEAR_COMPLETED = 'TodoEvent.CLEAR_COMPLETED';
