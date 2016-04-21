/// <reference path="../node_modules/backendless/libs/backendless.d.ts" />
var Todo = (function () {
	function Todo(args) {
		this.order = new Date().getTime();
		this.title = args && args.title || '';
		this.completed = args && args.completed || false;
	}

	return Todo;
}());
/**
 * @instance of {@class Backendless.DataStore}
 * @summary interface for manipulation with  data, create/update/save/delete todo items on the Backendless server
 */
var TodoStorage = Backendless.Persistence.of(Todo);
