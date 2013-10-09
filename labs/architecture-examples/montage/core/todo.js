var Montage = require('montage').Montage;

exports.Todo = Montage.specialize({

	constructor: {
		value: function Todo() {
			this.super();
		}
	},

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
