goog.provide('todomvc.todocontrol');

goog.require('goog.dom');
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
todomvc.todocontrol = function(model) {
	goog.base(this, model);

};
goog.inherits(todomvc.todocontrol, mvc.Control);



/**
 * overrides goog.ui.Component#createDom with the todo template.
 *
 * @inheritDoc
 */
todomvc.todocontrol.prototype.createDom = function() {
	var el = soy.renderAsFragment(todomvc.templates.todoItem, {
		model: this.getModel().toJson()
	}, null);
 this.setElementInternal(/** @type {Element} */(el));
};


/**
 * setup for event listeners.
 *
 * @inheritDoc
 */
todomvc.todocontrol.prototype.enterDocument = function() {

	var model = this.getModel();

	// toggle complete
	this.click(function(e) {
			model.set('completed', e.target.checked);
	}, 'toggle');

	// delete the model
	this.click(function(e) {
		model.dispose();
	}, 'destroy');

	// dblclick to edit
	this.on(goog.events.EventType.DBLCLICK, function(e) {
		this.makeEditable(true);
	}, 'view');

	// save on edit
	var inputEl = this.getEls('.edit')[0];
	this.on(goog.events.EventType.KEYUP, function(e) {
		if (e.keyCode === goog.events.KeyCodes.ENTER) {
			model.set('title', inputEl.value);
		}
	}, 'edit');

	this.on(goog.events.EventType.BLUR, function(e) {
		model.set('title', inputEl.value);
	}, 'edit');
};


/**
 * make (un)editable
 *
 * @param {boolean} editable whether to make editable.
 */
todomvc.todocontrol.prototype.makeEditable = function(editable) {

	var inputEl = this.getEls('.edit')[0];

	goog.dom.classes.enable(this.getElement(), 'editing', editable);
	if (editable) {
		inputEl.value = this.getModel().get('title');
		inputEl.select();
	}

};
