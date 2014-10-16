/*global goog, mvc, soy, todomvc */
goog.provide('todomvc.todocontrol');

goog.require('goog.dom');
goog.require('goog.string');
goog.require('goog.events.KeyCodes');
goog.require('mvc.Control');
goog.require('todomvc.templates');


/**
 * this is the control for a todo item.
 *
 * @constructor
 * @param {mvc.Model} model for the control.
 * @extends {mvc.Control}
 */
todomvc.todocontrol = function( model ) {
	goog.base( this, model );
};
goog.inherits( todomvc.todocontrol, mvc.Control );



/**
 * overrides goog.ui.Component#createDom with the todo template.
 *
 * @inheritDoc
 */
todomvc.todocontrol.prototype.createDom = function() {
	var el = soy.renderAsElement( todomvc.templates.todoItem, null, null );
	this.setElementInternal(/** @type {Element} */(el));
};


/**
 * setup for event listeners.
 *
 * @inheritDoc
 */
todomvc.todocontrol.prototype.enterDocument = function() {

	var model = this.getModel();

	// Toggle complete
	this.autobind('.toggle', '{$completed}');

	// Change li class on completion
	this.autobind('', {
		reqs: ['completed'],
		onClass: 'completed',
		noClick: true
	});

	// Delete the model
	this.click(function() {
		model.dispose();
	}, '.destroy');

	// keep label inline with title
	this.autobind( 'label', {
		reqs: ['title'],
		template: function (data) { return data.title; },
		data: {
			title: function (control) {
				var value = control.getModel().get('title');
				return goog.string.htmlEscape(value);
			}
		}
	});

	var inputEl = this.getEls('.edit')[0];
	// Dblclick to edit
	this.on( goog.events.EventType.DBLCLICK, function() {
		goog.dom.classes.add( this.getElement(), 'editing' );
		inputEl.focus();
	}, '.view');

	// blur on enter
	this.on( goog.events.EventType.KEYUP, function( e ) {
		if ( e.keyCode === goog.events.KeyCodes.ENTER ) {
			e.target.blur();
		}
	});

	// finish editing on blur
	this.on( goog.events.EventType.BLUR, function() {
		goog.dom.classes.remove( this.getElement(), 'editing' );
	});

	// bind the title and the edit input
	this.autobind( '.edit', '{$title}' );
};
