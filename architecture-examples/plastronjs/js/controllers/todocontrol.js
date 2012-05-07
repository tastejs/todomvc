goog.provide('todomvc.todocontrol');

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
  this.el = goog.dom.htmlToDocumentFragment('<li>' +
          '<div class="view">' +
            '<input class="toggle" type="checkbox">' +
            '<label>' + this.getModel().get('text') + '</label>' +
            '<a class="destroy"></a>' +
          '</div>' +
          '<input class="edit" type="text" value="Create a TodoMVC template">' +
        '</li>');
 this.setElementInternal(this.el);
};


/**
 * setup for event listeners.
 *
 * @inheritDoc
 */
todomvc.todocontrol.prototype.enterDocument = function() {

  var model = this.getModel();
  var element = this.getElement();

  // toggle complete
  this.click(function(e) {
    if (e.target.checked) {
      model.set('completed', true);
    } else {
      model.set('completed', false);
    }
  }, 'toggle');

  // toggle classes on 'complete' change
  var completeToggle = this.getEls('.toggle')[0];

  var completedFn = function(complete) {
    if (complete) {
      goog.dom.classes.add(element, 'done');
    } else {
      goog.dom.classes.remove(element, 'done');
    }
    completeToggle.checked = complete;
  };
  this.bind('completed', completedFn);
  completedFn(model.get('completed'));

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
  var inputEl = this.getEls('.edit')[0];
  var displayEl = this.getEls('.view')[0];
  this.on(goog.events.EventType.DBLCLICK, function(e) {
    displayEl.style.display = 'none';
    inputEl.value = model.get('text');
    inputEl.style.display = 'block';
  }, 'view');

  // save on edit
  this.on(goog.events.EventType.KEYUP, function(e) {
    if (e.keyCode == 13) {
      displayEl.style.display = 'block';
      inputEl.style.display = 'none';
    }
    model.set('text', inputEl.value);
  }, 'edit');
};



