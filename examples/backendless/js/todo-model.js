/**
 * @constructor
 * @class Todo
 * @summary class of todo model
 *
 * @defaults:
 *  - @title {String} = '';
 *  - @completed {Boolean} = false;
 */
function Todo(args) {
	this.order = new Date().getTime();
	this.title = args && args.title || '';
	this.completed = args && args.completed || false;
}

/**
 * @instance of {@class Backendless.DataStore}
 * @summary interface for manipulation with  data, create/update/save/delete todo items on the Backendless server
 */
var TodoStorage = Backendless.Persistence.of(Todo);
