/*jshint strict: false */
/*global maria, checkit */

maria.Controller.subclass(checkit, 'TodosAppController', {
	properties: {
		onKeyupNewTodo: function (evt) {
			if (checkit.isEnterKeyCode(evt.keyCode)) {
				var view = this.getView();
				var value = view.getInputValue();

				if (!checkit.isBlank(value)) {
					var todo = new checkit.TodoModel();

					todo.setTitle(value);
					this.getModel().add(todo);

					view.clearInput();
				}
			}
		},

		onClickToggleAll: function () {
			var model = this.getModel();

			if (model.isAllCompleted()) {
				model.markAllIncompleted();
			} else {
				model.markAllCompleted();
			}
		},

		onClickClearCompleted: function () {
			this.getModel().deleteCompleted();
		}
	}
});
