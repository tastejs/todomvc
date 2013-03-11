/*jshint strict: false */
/*global maria, Router, checkit */

maria.on(window, 'load', function() {
	var model;
	if ((typeof localStorage === 'object') && (typeof JSON === 'object')) {
		var store = localStorage.getItem('todos-maria');
		model = store ? checkit.TodosModel.fromJSON(JSON.parse(store)) :
						new checkit.TodosModel();
		maria.on(model, 'change', function() {
			localStorage.setItem('todos-maria', JSON.stringify(model.toJSON()));
		});
	}
	else {
		model = new checkit.TodosModel();
	}

	var routes = {
		'/': function() {
			model.setMode('all');
		},
		'/active': function() {
			model.setMode('incompleted');
		},
		'/completed': function() {
			model.setMode('completed');
		}
	};
	var router = Router(routes);
	router.init();

	var view = new checkit.TodosAppView(model);
	document.body.appendChild(view.build());
});
