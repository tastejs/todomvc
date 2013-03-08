var Montage = require('montage').Montage;
var Component = require('montage/ui/component').Component;

exports.TodoView = Montage.create(Component, {
	todo: {
		value: null
	},

	editInput: {
		value: null
	},

	didCreate: {
		value: function () {
			Object.defineBinding(this, 'isCompleted', {
				boundObject: this,
				boundObjectPropertyPath: 'todo.completed',
				oneway: true
			});
		}
	},

	prepareForDraw: {
		value: function () {
			this.element.addEventListener('dblclick', this, false);
			this.element.addEventListener('blur', this, true);
			this.element.addEventListener('submit', this, false);
		}
	},

	captureDestroyButtonAction: {
		value: function () {
			this.dispatchDestroy();
		}
	},

	dispatchDestroy: {
		value: function () {
			this.dispatchEventNamed('destroyTodo', true, true, {todo: this.todo})
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

			this._isCompleted = value;
			this.needsDraw = true;
		}
	},

	captureBlur: {
		value: function (e) {
			if (this.isEditing && this.editInput.element === e.target) {
				this._submitTitle();
			}
		}
	},

	handleSubmit: {
		value: function (e) {
			if (this.isEditing) {
				e.preventDefault();
				this._submitTitle();
			}
		}
	},

	_submitTitle: {
		value: function () {
			var title = this.editInput.value.trim();

			if (title === '') {
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
				this.element.classList.add('editing');
				this.editInput.element.focus();
			} else {
				this.element.classList.remove('editing');
				this.editInput.element.blur();
			}

			if (this.isCompleted) {
				this.element.classList.add('completed');
			} else {
				this.element.classList.remove('completed');
			}
		}
	}
});
