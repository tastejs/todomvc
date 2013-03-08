/*global goog, mvc, todomvc */
goog.provide('todomvc.listsync');

goog.require('mvc.LocalSync');


/**
 * @constructor
 * @extends {mvc.LocalSync}
 */
todomvc.listsync = function() {
	goog.base( this );
};
goog.inherits( todomvc.listsync, mvc.LocalSync );


/**
 * @inheritDoc
 */
todomvc.listsync.prototype.read = function( model, opt_callback ) {
	var id = /** @type {string} */(model.get('id'));
	var todos = this.store_.get(id) || [];
	goog.array.forEach(/** @type {Array} */(todos),
			function( todo ) {
				model.newModel( todo, true );
			});
	model.change();
};
