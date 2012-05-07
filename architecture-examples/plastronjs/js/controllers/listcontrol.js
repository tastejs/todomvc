goog.provide('todomvc.listcontrol');

goog.require('goog.dom');
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
};
goog.inherits(todomvc.listcontrol, mvc.Control);


/**
 * setup for event listeners.
 *
 * @inheritDoc
 */
todomvc.listcontrol.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  var list = this.getModel();

  this.on('keyup', function(e) {
    // on return get trimmed text
    if (e.keyCode != 13) return;
    var text = (this.getEls('input')[0]).value;
    if (text == '') return;

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
    goog.array.forEach(this.getModel().getModels(), function(mod) {
      mod.set('completed', e.target.checked);
    });
  }, 'toggle-all');

  // hide/show footer and main body
  var main = goog.dom.getElement('main');
  var footer = goog.dom.getElementsByTagNameAndClass('footer')[0];

  var showMainFooter = function() {
    var display = list.getLength() ? 'block' : 'none';
    main.style.display = display;
    footer.style.display = display;
  };

  this.modelChange(showMainFooter);
  showMainFooter();

  this.modelChange(this.refresh, this);
  this.refresh();

  // save any changes
  this.anyModelChange(list.save, list);

  // update count on model change
  this.bind('completed', function(mods) {
    goog.dom.setTextContent(goog.dom.getElement('todo-count'),
        (list.getModels().length - mods.length) + ' items left');
  });

  list.fetch();
};


/**
 *
 */
todomvc.listcontrol.prototype.refresh = function() {
  this.removeChildren(true);
  goog.array.forEach(this.getModel().getModels(), function(model) {
    var newModelControl = new todomvc.todocontrol(model);
    this.addChild(newModelControl);
    newModelControl.render(goog.dom.getElement('todo-list'));
  }, this);
};


