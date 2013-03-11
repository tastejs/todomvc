var Montage = require('montage').Montage;

exports.Todo = Montage.create(Montage, {
	initWithTitle: {
		value: function (title) {
			this.title = title;
			return this;
		}
	},
	title: {
		value: null
	},
	completed: {
		value: false
	}
});
