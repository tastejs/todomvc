(function (window) {
	'use strict';

	var app = new window.todoController(todoModel('todos-W3View'));

	var w3view = window.w3view || function(app){
		var res = new window.W3View(app);
		var sources = window.document.getElementById('components');
		res.register(sources.children);
		window.document.body.removeChild(sources);
		return res;
	};

	var view = w3view(app).create('application');
	view.mount(document.body, 0);
	app.setView(view);

	window.Router({
		'/': function (){
			app.showAll();
		},
		'/active': function (){
			app.showActive();
		},
		'/completed': function (){
			app.showCompleted();
		},
		'*': function (){
			app.showAll();
		}
	}).init();

	if(!window.document.location.hash.substr(1)) document.location.hash='/';

})(window);
