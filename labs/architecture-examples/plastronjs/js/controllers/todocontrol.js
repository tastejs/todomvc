goog.provide('todomvc.todocontrol');

goog.require('goog.dom');
goog.require('goog.events.KeyCodes');
goog.require('mvc.Control');


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
  var el = goog.dom.htmlToDocumentFragment('<li>' +
          '<div class="view">' +
            '<input class="toggle" type="checkbox">' +
            '<label>' + this.getModel().get('text') + '</label>' +
            '<a class="destroy"></a>' +
          '</div>' +
          '<input class="edit" type="text" value="">' +
        '</li>');
 this.setElementInternal(/** @type {Element} */(el));
};


/**
 * setup for event listeners.
 *
 * @inheritDoc
 */
todomvc.todocontrol.prototype.enterDocument = function() {

  var model = this.getModel();
  var element = this.getElement();
  this.inputEl = this.getEls('.edit')[0];
  this.displayEl = this.getEls('.view')[0];

  // toggle complete
  this.click(function(e) {
    if (e.target.checked) {
      model.set('completed', true);
    } else {
      model.set('completed', false);
    }
  }, 'toggle');

  // toggle classes on 'complete' change
  this.bind('completed', this.setComplete, this);
  this.setComplete(model.get('completed'));

  // keep label up to date with text
  var textLabel = this.getEls('label')[0];
  this.bind('text', function(text) {
    goog.dom.setTextContent(textLabel, text);
  });

  // remove control on model delete
  this.bindUnload(function() {
    this.dispose();
  });

  // delete the model
  this.click(function(e) {
    e.preventDefault();
    this.getModel().dispose();
    return false;
  }, 'destroy');

  // dblclick to edit
  this.on(goog.events.EventType.DBLCLICK, function(e) {
    this.getParent().makeChildEditable(this);
  }, 'view');

  // save on edit
  var inputEl = this.getEls('.edit')[0];
  this.on(goog.events.EventType.KEYUP, function(e) {
    if (e.keyCode == goog.events.KeyCodes.ENTER &&
        model.set('text', inputEl.value))
      this.makeEditable(false);
  }, 'edit');

  this.on(goog.events.EventType.BLUR, function(e) {
    if (model.set('text', inputEl.value))
      this.makeEditable(false);
  }, 'edit');
};


/**
 * toggle completed state.
 *
 * @param {boolean} complete whether the item is completed.
 */
todomvc.todocontrol.prototype.setComplete = function(complete) {

  var completeToggle = this.getEls('.toggle')[0];

  goog.dom.classes.enable(this.getElement(), 'done', complete);

  completeToggle.checked = complete;
};


/**
 * make (un)editable
 *
 * @param {boolean} editable whether to make editable.
 */
todomvc.todocontrol.prototype.makeEditable = function(editable) {

  var inputEl = this.getEls('.edit')[0];

  inputEl.value = this.getModel().get('text');
  goog.dom.classes.enable(this.getElement(), 'editing', editable);
  if (editable)
    inputEl.select();
};
