goog.provide('todomvc.listcontrol');

goog.require('goog.dom');
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
todomvc.listcontrol = function(list) {
  goog.base(this, list);
  this.filter_ = todomvc.listcontrol.Filter.ALL;
};
goog.inherits(todomvc.listcontrol, mvc.Control);


/**
 * @enum {Function}
 */
todomvc.listcontrol.Filter = {
  ALL: function() {return true},
  ACTIVE: function(model) {return !model.get('completed')},
  COMPLETED: function(model) {return model.get('completed')}
};


/**
 * setup for event listeners.
 *
 * @inheritDoc
 */
todomvc.listcontrol.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  var list = /** @type {Object} */(this.getModel());

  // create new model from text box
  var input = this.getEls('input')[0];
  this.on(goog.events.EventType.KEYUP, function(e) {

    // on return get trimmed text
    if (e.keyCode !== goog.events.KeyCodes.ENTER) return;

    var text = goog.string.trim(input.value);
    if (text === '') return;

    //create new model
    list.newModel({'title': text});

    input.value = '';

  }, 'todo-entry');

  // clear completed
  this.click(function(e) {
    goog.array.forEach(list.get('completed'), function(model) {
      model.dispose();
    });
  }, 'clear-completed');

  // toggle completed
  this.click(function(e) {
    var checked = e.target.checked;
    goog.array.forEach(list.getModels(), function(model) {
      model.set('completed', checked);
    });
  }, 'toggle-all');

  // refresh the view on changes that effect the models order
  this.anyModelChange(this.refresh, this);
  this.refresh();

  // save any changes from models
  this.anyModelChange(list.save, list);

  // hide/show footer and main body
  this.modelChange(function() {
    this.showMainFooter(!!list.getLength());
  }, this);
  this.showMainFooter(!!list.getLength());

  // update counts
  this.bind('completed', function(mods) {

    // update "left" count
    soy.renderElement(goog.dom.getElement('todo-count'),
        todomvc.templates.itemsLeft, {
          left: list.getLength() - mods.length
        });

    // update clear button
    var clearButton = goog.dom.getElement('clear-completed');
    goog.dom.setTextContent(clearButton,
        'Clear completed (' + mods.length + ')');
    goog.style.showElement(clearButton, mods.length);

    // update checkbox
    var checkBox = this.getEls('.toggle-all')[0];
    checkBox.checked = mods.length === list.getLength();
  });

  // get the saved todos
  list.fetch();
};


/**
 * show or hide the footer.
 *
 * @param {boolean=} opt_hide whether to hide the footer.
 */
todomvc.listcontrol.prototype.showMainFooter = function(opt_hide) {
  var main = goog.dom.getElement('main');
  var footer = goog.dom.getElementsByTagNameAndClass('footer')[0];

  goog.style.showElement(main, opt_hide);
  goog.style.showElement(footer, opt_hide);
};


/**
 * sets the function to determine which children are returned by the control.
 *
 * @param {Function} filter to decide models returned.
 */
todomvc.listcontrol.prototype.setFilter = function(filter) {
  this.filter_ = filter;
  this.refresh();
};


/**
 * refreshes the view of the childen.
 */
todomvc.listcontrol.prototype.refresh = function() {

  // dispose and remove all the children.
  this.forEachChild(function(child) {child.dispose();});
  this.removeChildren(true);

  // create new controls for the models
  goog.array.forEach(this.getModel().getModels(this.filter_),
      function(model) {
        var newModelControl = new todomvc.todocontrol(model);
        this.addChild(newModelControl);
        newModelControl.render(goog.dom.getElement('todo-list'));
      }, this);
};


