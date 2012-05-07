goog.provide('todomvc.listcontrol');

goog.require('goog.dom');
goog.require('goog.events.KeyCodes');
goog.require('goog.string');
goog.require('mvc.Control');
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
  this.returnState_ = todomvc.listcontrol.ReturnState.DEFAULT;
};
goog.inherits(todomvc.listcontrol, mvc.Control);


/**
 * @enum {Function}
 */
todomvc.listcontrol.ReturnState = {
  DEFAULT: function() {return true},
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
  this.on('keyup', function(e) {
    e.preventDefault();

    // on return get trimmed text
    if (e.keyCode != goog.events.KeyCodes.ENTER) return;

    var text = goog.string.trim(input.value);
    if (text == '') return;
    input.value = '';

    //create new model
    list.newModel({'text': text});

  }, 'todo-entry');

  // clear completed
  this.click(function(e) {
    goog.array.forEach(list.get('completed'), function(mod) {
      mod.dispose();
    });
  }, 'clear-completed');

  // toggle completed
  this.click(function(e) {
    var checked = e.target.checked;
    goog.array.forEach(list.getModels(), function(mod) {
      mod.set('completed', checked);
    });
  }, 'toggle-all');

  // hide/show footer and main body
  this.modelChange(function(e) {
    this.showMainFooter(!!list.getLength());
  }, this);
  this.showMainFooter(!!list.getLength());

  // refresh the view on changes that effect the models order
  this.modelChange(this.refresh, this);
  this.refresh();

  // save any changes from models
  this.anyModelChange(list.save, list);

  // update count on completed changes
  this.bind('completed', function(mods) {

    var checkBox = this.getEls('.toggle-all')[0];

    // set items left count
    goog.dom.getElement('todo-count').innerHTML =
        '<strong>' + (list.getLength() - mods.length) + '</strong> items left';

    // set clear button
    var clearButton = goog.dom.getElement('clear-completed');
    goog.dom.setTextContent(clearButton,
        'Clear completed (' + mods.length + ')');
    goog.style.showElement(clearButton, mods.length);

    checkBox.checked = mods.length && mods.length == list.getLength();
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
 * @param {Function} state to decide models returned.
 */
todomvc.listcontrol.prototype.setReturnState = function(state) {
  this.returnState_ = state;
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
  goog.array.forEach(this.getModel().getModels(this.returnState_),
      function(model) {
        var newModelControl = new todomvc.todocontrol(model);
        this.addChild(newModelControl);
        newModelControl.render(goog.dom.getElement('todo-list'));
      }, this);
};


/**
 * make child editable
 *
 * @param {todomvc.todocontrol} child to make editable.
 */
todomvc.listcontrol.prototype.makeChildEditable = function(child) {
  this.forEachChild(function(todoControl) {
    todoControl.makeEditable(todoControl == child);
  });
};



