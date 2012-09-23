goog.provide('todomvc.listcontrol');

goog.require('goog.events.KeyCodes');
goog.require('goog.string');
goog.require('mvc.Control');
goog.require('todomvc.templates');
goog.require('todomvc.todocontrol');


/**
 * the control for the todo list, handles the page as well
 *
 * @constructor
 * @param {mvc.Collection} list model for todo items.
 * @extends {mvc.Control}
 */
todomvc.listcontrol = function( list ) {
	goog.base( this, list );
};
goog.inherits( todomvc.listcontrol, mvc.Control );


/**
 * setup for event listeners.
 *
 * @inheritDoc
 */
todomvc.listcontrol.prototype.enterDocument = function() {
	goog.base( this, 'enterDocument' );

	var list = /** @type {Object} */(this.getModel());

	// handle new note entry
	this.on( goog.events.EventType.KEYUP, this.handleNewInput, 'todo-entry' );

	// setup list display
	this.autolist( todomvc.todocontrol, this.getEls( 'ul' )[0] );

	// update complete button based on completed
	this.autobind('#clear-completed', {
		template: 'Clear completed ({$completed})',
		show: true
	});

	// Clear completed
	this.click(function( e ) {
		goog.array.forEach( list.getModels( 'completed' ),
			function( model ) {
				model.dispose();
			});
	}, 'clear-completed' );

	// when to check the check all
	this.autobind('.toggle-all', {
		reqs: "allDone",
		// don't bind on click, we'll do that next
		noClick: true
	});

	// Toggle completed
	this.click(function( e ) {
		var checked = e.target.checked;

		goog.array.forEach( list.getModels(), function( model ) {
			model.set( 'completed', checked );
		});
	}, 'toggle-all' );

	// change classes of ULs based on filter
	this.autobind( 'ul', {
		reqs: 'filter',
		reqClass: ['active', 'completed', 'none']
	} );

	// update the count based on active
	this.autobind('#todo-count', {
		template: todomvc.templates.itemsLeft,
		reqs: 'active'
	});

	// show or hide based on the totals
	this.autobind(['#main', 'footer'], {
		show: 'total'
	});

	// Get the saved todos
	list.fetch();

	// save any changes
	this.anyModelChange(function() {
		list.save();
	}, this );
};


todomvc.listcontrol.prototype.handleNewInput = function( e ) {
	var input = e.target;

	// On return get trimmed text
	if ( e.keyCode !== goog.events.KeyCodes.ENTER ) {
		return;
	}

	var text = goog.string.trim( input.value );
	if ( !text ) {
		return;
	}

	// Create new model
	this.getModel().newModel({
		'title': text
	});

	input.value = '';
};



