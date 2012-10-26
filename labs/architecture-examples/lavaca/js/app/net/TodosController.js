(function(ns, Controller, TodosCollection, Promise, $) {

var _todos;
/**
 * @class app.net.TodoController
 * @super Lavaca.mvc.Controller
 * Todo controller
 */
ns.TodosController = Controller.extend(function() {
	Controller.apply(this, arguments);
	// Creates a reference to the todos collection
	_todos = app.cache.get('todos');
}, {
	/**
	* @method index
	* Sets the filter, renders the view, and adds a history record
	*
	* @param {Object} params  Action arguments
	* @param {Object} model  History state model
	* @return {Lavaca.util.Promise}  A promise
	*/
	index: function(params, model) {
		_todos.set('filter', params.filter || 'all');
		if (this.viewManager.layers.length) {
			// If the view is already being shown just push a history state
			return new Promise(this).resolve()
				.then(this.history(model, 'Lavaca Todos', params.url));
		} else {
			// Load the TodosView and push a history state
			return this
				.view('home', app.ui.views.TodosView, _todos)
				.then(this.history(model, 'Lavaca Todos', params.url));
		}
	},
	/**
	* @method clear
	* Calls a method on the collection that clears all completed items
	*
	* @param {Object} params  Action arguments
	* @param {Object} collection  History state model
	* @return {Lavaca.util.Promise}  A promise
	*/
	clear: function(params, model) {
		_todos.clearCompleted();
		return new Promise(this).resolve();
	},
	/**
	* @method remove
	* Calls a method on the collection that removes a specific model
	*
	* @param {Object} params  Action arguments
	* @param {Object} collection  History state model
	* @return {Lavaca.util.Promise}  A promise
	*/
	remove: function(params, model) {
		_todos.removeTodo(params.id);
		return new Promise(this).resolve();
	},
	/**
	* @method add
	* Calls a method on the collection that adds a new model
	*
	* @param {Object} params  Action arguments
	* @param {Object} collection  History state model
	* @return {Lavaca.util.Promise}  A promise
	*/
	add: function(params, model) {
		todo = _todos.addTodo(params.title);
		return new Promise(this).resolve(todo);
	},
	/**
	* @method edit
	* Calls a method on the collection that updates a model
	*
	* @param {Object} params  Action arguments
	* @param {Object} collection  History state model
	* @return {Lavaca.util.Promise}  A promise
	*/
	edit: function(params, model) {
		var promise = new Promise(this);
		if (_todos.editTodo(params.id, params.title)) {
			promise.resolve();
		} else {
			promise.reject();
		}
		return promise;
	},
	/**
	* @method mark
	* Calls a method on the collection that sets the completed attribute on a model
	*
	* @param {Object} params  Action arguments
	* @param {Object} collection  History state model
	* @return {Lavaca.util.Promise}  A promise
	*/
	mark: function(params, model) {
		var promise = new Promise(this);
		if (_todos.markTodo(params.id, params.completed)) {
			promise.resolve();
		} else {
			promise.reject();
		}
		return promise;
	},
	/**
	* @method mark
	* Calls a method on the collection that sets the completed attribute of all the models
	*
	* @param {Object} params  Action arguments
	* @param {Object} collection  History state model
	* @return {Lavaca.util.Promise}  A promise
	*/
	markAll: function(params, model) {
		_todos.markAll(params.completed);
		return new Promise(this).resolve();
	}
});

})(Lavaca.resolve('app.net', true), Lavaca.mvc.Controller, app.models.TodosCollection, Lavaca.util.Promise, Lavaca.$);