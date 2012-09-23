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
		// number of completed
		'completed': {
			get: function() {
				return this.getModels( 'completed' ).length;
			},
			models: true
		},
		'allDone': {
			get: function() {
				return this.getLength() == this.getModels( 'completed' ).length;
			},
			models: true
		},
		// number of active
		'active': {
			get: function() {
				return this.getLength() - this.getModels( 'completed' ).length;
			},
			models: true
		},
		// the total
		'total': {
			get: function() {
				return this.getLength();
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
