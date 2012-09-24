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
	this.filter_ = todomvc.listcontrol.Filter.ALL;
};
goog.inherits( todomvc.listcontrol, mvc.Control );


/**
 * @enum {Function}
 */
todomvc.listcontrol.Filter = {
	ALL: function() {
		return true
	},
	ACTIVE: function( model ) {
		return !model.get('completed')
	},
	COMPLETED: function( model ) {
		return model.get('completed')
	}
};


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

	// save any changes and refresh view
	this.anyModelChange(function() {
		list.save();
		this.refresh();
	}, this );
};


todomvc.listcontrol.prototype.setFilter = function( filter ) {
	this.filter_ = filter;
	this.refresh();
};


/**
 * adds the input as a new item
 */
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


/**
 * refreshes the view of the childen.
 */
todomvc.listcontrol.prototype.refresh = function() {

	// Dispose and remove all the children.
	this.forEachChild(function( child ) {
		child.dispose();
	});
	this.removeChildren( true );

	// Create new controls for the models
	goog.array.forEach( this.getModel().getModels(this.filter_),
		function( model ) {
			var newModelControl = new todomvc.todocontrol( model );

			this.addChild( newModelControl );
			newModelControl.render( goog.dom.getElement('todo-list') );
		}, this );
};



