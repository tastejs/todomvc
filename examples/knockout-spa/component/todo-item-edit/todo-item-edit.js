define(['text!./todo-item-edit.html', 'jsface', 'util/dom', 'ko', 'sugar'], function (template, Class, Dom, ko) {

	var TodoItemEdit = Class({
		constructor: function (params) {
			this.todoItem = params.todoItem;
			this.title = params.todoItem.model.title;
			ko.observe(this);
		},
		edit: function (data, event) {
			var keyCode = (event.which ? event.which : event.keyCode);
			if ((keyCode === Dom.keyCodes.enter) || !keyCode) {
				var title = data.title.compact();
				if (title) {
					data.todoItem.model.editing = false;
					data.todoItem.model.title = title;
				} else {
					data.todoItem.todoList.destroyItem(data.todoItem);
				}
			} else if (keyCode === Dom.keyCodes.esc) {
				data.todoItem.model.editing = false;
			} else {
				return true;
			}
		}
	});

	return {
		viewModel: TodoItemEdit,
		template: template
	};

});
