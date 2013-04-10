/*jshint strict: false */
/*global maria, checkit */

maria.Model.subclass(checkit, 'TodoModel', {
	properties: {
		_title: '',
		_completed: false,

		getTitle: function () {
			return this._title;
		},

		setTitle: function (title) {
			title = ('' + title).trim();

			if (this._title !== title) {
				this._title = title;

				this.dispatchEvent({ type: 'change' });
			}
		},

		isCompleted: function () {
			return this._completed;
		},

		setCompleted: function (completed) {
			completed = !!completed;

			if (this._completed !== completed) {
				this._completed = completed;

				this.dispatchEvent({ type: 'change' });
			}
		},

		toggleCompleted: function () {
			this.setCompleted(!this.isCompleted());
		},

		toJSON: function () {
			return {
				title: this._title,
				completed: this._completed
			};
		}
	}
});

checkit.TodoModel.fromJSON = function (todoJSON) {
	var model = new checkit.TodoModel();

	model._title = todoJSON.title;
	model._completed = todoJSON.completed;

	return model;
};
