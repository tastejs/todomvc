/*jshint strict: false */
/*global maria, aristocrat, checkit */

maria.ElementView.subclass(checkit, 'TodoView', {
	uiActions: {
		'click .destroy': 'onClickDestroy',
		'click .toggle': 'onClickToggle',
		'dblclick label': 'onDblclickLabel',
		'keyup .edit': 'onKeyupEdit',
		'blur .edit': 'onBlurEdit'
	},

	properties: {
		buildData: function () {
			var model = this.getModel();
			var item = this.find('li');

			aristocrat.removeClass(item, '(in|)completed');
			aristocrat.addClass(item, (model.isCompleted() ? 'completed' : 'incompleted'));

			this.find('label').innerHTML = checkit.escapeHTML(model.getTitle());

			this.find('.toggle').checked = model.isCompleted();
		},

		update: function () {
			this.buildData();
		},

		resetEdit: function () {
			var input = this.find('.edit');

			input.value = this.getModel().getTitle();
		},

		showEdit: function () {
			var input = this.find('.edit');

			this.resetEdit();

			aristocrat.addClass(this.find('li'), 'editing');

			input.focus();
		},

		showDisplay: function () {
			aristocrat.removeClass(this.find('li'), 'editing');
		},

		getInputValue: function () {
			return this.find('.edit').value;
		}
	}
});
