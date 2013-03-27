/*jshint strict: false */
/*global maria, checkit */

maria.Controller.subclass(checkit, 'TodoController', {
	properties: {
		onClickDestroy: function() {
			this.getModel().destroy();
		},
		onClickToggle: function() {
			this.getModel().toggleCompleted();
		},
		onDblclickLabel: function() {
			this.getView().showEdit();
		},
		onKeyupEdit: function(evt) {
			if (checkit.isEnterKeyCode(evt.keyCode)) {
				this.onBlurEdit();
			}
		},
		onBlurEdit: function() {
			var model = this.getModel();
			var view = this.getView();
			var value = view.getInputValue();
			view.showDisplay();
			if (checkit.isBlank(value)) {
				model.destroy();
			}
			else {
				model.setTitle(value);
			}
		}
	}
});
