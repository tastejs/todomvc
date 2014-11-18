/*jshint strict: false */
/*global maria, checkit */

maria.Controller.subclass(checkit, 'TodoController', {
	properties: {
		onClickDestroy: function () {
			this.getModel().destroy();
		},

		onClickToggle: function () {
			this.getModel().toggleCompleted();
		},

		onDblclickLabel: function () {
			this.getView().showEdit();
		},

		onKeyupEdit: function (evt) {
			var keyCode = evt.keyCode;

			if (checkit.isEnterKeyCode(keyCode)) {
				this.onBlurEdit();
			} else if (checkit.isEscapeKeyCode(keyCode)) {
				var view = this.getView();

				view.resetEdit();
				view.showDisplay();
			}
		},

		onBlurEdit: function () {
			var model = this.getModel();
			var view = this.getView();
			var value = view.getInputValue();

			view.showDisplay();

			if (checkit.isBlank(value)) {
				model.destroy();
			} else {
				model.setTitle(value);
			}
		}
	}
});
