define(['css!./error.css'], {
	controllers: {
		'/:code': function (code) {
			this.statusCode = code;
		}
	},
	title: function () {
		return this.statusCode;
	},
	statusCode: ''
});
