/*global goog, mvc, todomvc */
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
	this.on( goog.events.EventType.KEYUP, this.handleNewInput, '.todo-entry' );

	// update complete button based on completed
	this.autobind('#clear-completed', {
		template: 'Clear completed ({$completed})',
		noClick: true, // click should not set completed
		show: true // hide when completed == false
	});

	// Clear completed
	this.click( function() {
		goog.array.forEach( list.getModels( 'completed' ),
			function( model ) {
				model.dispose();
			});
	}, '.clear-completed' );

	// when to check the check all
	this.autobind('.toggle-all', {
		reqs: 'allDone'
	});

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
		show: 'total',
		noClick: true
	});

	// autolists on modelChange and return refresh function
	var refresh = this.autolist( todomvc.todocontrol,
		goog.dom.getElement('todo-list') ).fire;

	// if filter changes refresh view
	this.bind( 'filter', refresh );

	// if anything changes save models and refresh view
	this.anyModelChange( refresh );
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

