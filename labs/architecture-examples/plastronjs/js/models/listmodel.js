goog.provide('todomvc.listmodel');

goog.require('mvc.Collection');
goog.require('todomvc.listsync');
goog.require('todomvc.todomodel');


/**
 * @constructor
 * @extends {mvc.Collection}
 */
todomvc.listmodel = function() {

	var todosSchema = {
		'completed': {
			get: function() {
				return this.getModels(function( mod ) {
					return mod.get('completed');
				});
			},
			models: true
		}
	};

	goog.base( this, {
		'id': 'todos-plastronjs',
		'sync': new todomvc.listsync(),
		'schema': todosSchema,
		'modelType': todomvc.todomodel
	});
};
goog.inherits( todomvc.listmodel, mvc.Collection );


/**
 * @return {Object} todos as json.
 */
todomvc.listmodel.prototype.toJson = function() {
	return goog.array.map( this.getModels(), function( mod ) {
		return mod.toJson();
	});
};
