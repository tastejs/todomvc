(function(Lavaca, $) {

// Use hash urls instead of HTML5 History default
Lavaca.net.History.overrideStandardsMode();

// Override default view root selector
Lavaca.mvc.Application.prototype.viewRootSelector = '#todoapp';

// Initialize global app object
window.app = new Lavaca.mvc.Application(function() {

	// Initialize the models cache
	app.cache = new Lavaca.util.Cache();

	// Initialize the todos collection
	app.cache.set('todos', new app.models.TodosCollection('todos-lavaca'));

	// Initialize the routes
	app.router.add({
		'/': [app.net.TodosController, 'index', {filter: 'all'}],
		'/active': [app.net.TodosController, 'index', {filter: 'active'}],
		'/completed': [app.net.TodosController, 'index', {filter: 'completed'}],
		'/todo/mark-all': [app.net.TodosController, 'markAll'],
		'/todo/clear-completed': [app.net.TodosController, 'clear'],
		'/todo/remove/{id}': [app.net.TodosController, 'remove'],
		'/todo/add': [app.net.TodosController, 'add'],
		'/todo/edit/{id}': [app.net.TodosController, 'edit'],
		'/todo/mark/{id}': [app.net.TodosController, 'mark']
	});
  
});

})(Lavaca, Lavaca.$);