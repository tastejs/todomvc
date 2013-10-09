var Component = require('montage/ui/component').Component;

exports.TodoView = Component.specialize({

	todo: {
		value: null
	},

	editInput: {
		value: null
	},

	constructor: {
		value: function TodoView() {
			this.defineBinding('isCompleted', {
				'<-': 'todo.completed'
			});
		}
	},

	enterDocument: {
		value: function (firstTime) {
			if (firstTime) {
				this.element.addEventListener('dblclick', this, false);
				this.element.addEventListener('blur', this, true);
				this.element.addEventListener('submit', this, false);
			}
		}
	},

	captureDestroyButtonAction: {
		value: function () {
			this.dispatchDestroy();
		}
	},

	dispatchDestroy: {
		value: function () {
			this.dispatchEventNamed('destroyTodo', true, true, {todo: this.todo});
		}
	},

	handleDblclick: {
		value: function () {
			this.isEditing = true;
		}
	},

	_isEditing: {
		value: false
	},

	isEditing: {
		get: function () {
			return this._isEditing;
		},
		set: function (value) {
			if (value === this._isEditing) {
				return;
			}

			if (value) {
				this.classList.add('editing');
			} else {
				this.classList.remove('editing');
			}

			this._isEditing = value;
			this.needsDraw = true;
		}
	},

	_isCompleted: {
		value: false
	},

	isCompleted: {
		get: function () {
			return this._isCompleted;
		},
		set: function (value) {
			if (value === this._isCompleted) {
				return;
			}

			if (value) {
				this.classList.add('completed');
			} else {
				this.classList.remove('completed');
			}

			this._isCompleted = value;
			this.needsDraw = true;
		}
	},

	captureBlur: {
		value: function (evt) {
			if (this.isEditing && this.editInput.element === evt.target) {
				this._submitTitle();
			}
		}
	},

	handleSubmit: {
		value: function (evt) {
			if (this.isEditing) {
				evt.preventDefault();
				this._submitTitle();
			}
		}
	},

	_submitTitle: {
		value: function () {

			var title = this.editInput.value.trim();

			if ('' === title) {
				this.dispatchDestroy();
			} else {
				this.todo.title = title;
			}

			this.isEditing = false;
		}
	},

	draw: {
		value: function () {
			if (this.isEditing) {
				this.editInput.element.focus();
			} else {
				this.editInput.element.blur();
			}
		}
	}

});
