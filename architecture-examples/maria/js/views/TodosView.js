/*jshint strict: false */
/*global maria, aristocrat, checkit */

maria.SetView.subclass(checkit, 'TodosAppView', {
	uiActions: {
		'keyup #new-todo': 'onKeyupNewTodo',
		'click #toggle-all': 'onClickToggleAll',
		'click #clear-completed': 'onClickClearCompleted'
	},

	properties: {
		buildData: function () {
			var model = this.getModel();

			var length = model.size;
			this.find('#main').style.display = (length > 0) ? '' : 'none';
			this.find('#footer').style.display = (length > 0) ? '' : 'none';

			var checkbox = this.find('#toggle-all');
			checkbox.checked = model.isAllCompleted();
			checkbox.disabled = model.isEmpty();

			var todoList = this.find('#todo-list');
			model.getPossibleModes().forEach(function (mode) {
				aristocrat.removeClass(todoList, mode);
			});
			aristocrat.addClass(todoList, model.getMode());

			var incompletedLength = model.getIncompleted().length;
			this.find('#todo-count').innerHTML =
				'<strong>' + incompletedLength + '</strong> ' +
				((incompletedLength === 1) ? 'item' : 'items') +
				' left';

			var selected = this.find('.selected');
			if (selected) {
				aristocrat.removeClass(selected, 'selected');
			}
			aristocrat.addClass(this.find('.' + model.getMode() + '-filter'), 'selected');

			var completedLength = model.getCompleted().length;
			var clearButton = this.find('#clear-completed');
			clearButton.style.display = (completedLength > 0) ? '' : 'none';
			clearButton.innerHTML = 'Clear completed (' + completedLength + ')';
		},

		update: function (evt) {
			maria.SetView.prototype.update.call(this, evt);

			this.buildData();
		},

		getContainerEl: function () {
			// child views will be appended to this element
			return this.find('#todo-list');
		},

		createChildView: function (todoModel) {
			return new checkit.TodoView(todoModel);
		},

		getInputValue: function () {
			return this.find('#new-todo').value;
		},

		clearInput: function () {
			this.find('#new-todo').value = '';
		}
	}
});
