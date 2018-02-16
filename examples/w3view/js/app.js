(function (window) {
	'use strict';
	var doc = window.document;
	var app = new window.todoController(todoModel('todos-W3View'));

	var w3view = window.w3view || function (app) {
		var res = new window.W3View(app);
		var sources = doc.getElementById('components');
		res.register(sources.children);
		doc.body.removeChild(sources);
		return res;
	};

	w3view(app).create('application').mount(doc.body, 0);


	window.Router({
		'/': function () {
			app.showAll();
		},
		'/active': function () {
			app.showActive();
		},
		'/completed': function () {
			app.showCompleted();
		},
		'*': function () {
			doc.location.hash = '/';
		}
	}).init();

	if (!doc.location.hash.substr(1)) {
		doc.location.hash = '/';
	}

})(window);
