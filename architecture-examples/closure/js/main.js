goog.require('goog.array');
goog.require('goog.events.EventType');
goog.require('goog.events.KeyCodes');
goog.require('goog.storage.mechanism.mechanismfactory')
goog.require('goog.storage.Storage');
goog.require('goog.string');
goog.require('goog.ui.Component');
goog.require('goog.ui.Control');

goog.require('todomvc.model.ToDoItemStore');
goog.require('todomvc.model.ToDoItem');
goog.require('todomvc.view');
goog.require('todomvc.view.ClearCompletedControlRenderer');
goog.require('todomvc.view.ItemCountControlRenderer');
goog.require('todomvc.view.ToDoItemControl');
goog.require('todomvc.view.ToDoListContainer');

/**
 * @fileoverview The controller/business logic for the application.
 * 
 * This file creates the interface and marshals changes from the interface to the model and back.
 */


/**
 * @type {todomvc.view.ToDoListContainer}
 */
var container = new todomvc.view.ToDoListContainer();
container.decorate(document.getElementById('todo-list'));

/**
 * @type {Element}
 */
var todoStats = document.getElementById('footer');

/**
 * @type {goog.ui.Control}
 */
var itemCountControl = new goog.ui.Control(null, todomvc.view.ItemCountControlRenderer.getInstance());
itemCountControl.render(todoStats);

/**
 * @type {goog.ui.Control}
 */
var clearCompletedControl = new goog.ui.Control(null, todomvc.view.ClearCompletedControlRenderer.getInstance());
clearCompletedControl.render(todoStats);

goog.events.listen(clearCompletedControl, goog.ui.Component.EventType.ACTION, function(e) {
	// go backwards to avoid collection modification problems
	goog.array.forEachRight(itemStore.getAll(), function(model) {
		if (model.isDone()) {
			itemStore.remove(model);
		}
	});
});

/**
 * @type {todomvc.model.ToDoItemStore}
 */
var itemStore = new todomvc.model.ToDoItemStore();
itemStore.addEventListener(todomvc.model.ToDoItemStore.ChangeEventType, function() {
	container.removeChildren(true);
	/**
	 * @type {Array.<todomvc.model.ToDoItem>}
	 */
	var items = itemStore.getAll();
	goog.array.forEach(items, function(item) {
		/**
		 * @type {todomvc.view.ToDoItemControl}
		 */
		var control = new todomvc.view.ToDoItemControl();

		control.setContent(item.getNote());
		control.setChecked(item.isDone());
		control.setModel(item);

		container.addChild(control, true);
	});

	var doneCount = goog.array.reduce(items, function(count, model) {
		return model.isDone() ? count + 1 : count;
	}, 0);
	var remainingCount = items.length - (/**@type {number}*/ doneCount); 
	itemCountControl.setContent((/**@type {string}*/ remainingCount));
	itemCountControl.setVisible(remainingCount > 0);
	clearCompletedControl.setContent((/**@type {string}*/ doneCount));
	clearCompletedControl.setVisible((/**@type {number}*/ doneCount) > 0);
});
itemStore.load();


goog.events.listen(container, todomvc.view.ToDoItemControl.EventType.EDIT, function(e) {
	/**
	 * @type {todomvc.view.ToDoItemControl}
	 */
	var control = e.target;

	/**
	 * @type {todomvc.model.ToDoItem}
	 */
	var originalModel = (/**@type {todomvc.model.ToDoItem} */ control.getModel());

	/**
	 * @type {!todomvc.model.ToDoItem}
	 */
	var updatedModel = new todomvc.model.ToDoItem(
			(/**@type {!string} */ control.getContent()),
			(/**@type {!boolean} */ control.isChecked()),
			originalModel.getId());

	itemStore.addOrUpdate(updatedModel);
});

goog.events.listen(container, todomvc.view.ToDoItemControl.EventType.DESTROY, function(e) {
	/**
	 * @type {todomvc.view.ToDoItemControl}
	 */
	var control = e.target;

	/**
	 * @type {todomvc.model.ToDoItem}
	 */
	var model = (/**@type {todomvc.model.ToDoItem} */ control.getModel());
	if (model !== null) {
		itemStore.remove(model);
	}
});

/**
 * @type {Element}
 */
var newToDo = document.getElementById('new-todo');
goog.events.listen(newToDo, goog.events.EventType.KEYUP, function(e) {
	if (e.keyCode !== goog.events.KeyCodes.ENTER) {
		return;
	}
	// get the text
	var value = goog.string.trim(newToDo.value);
	if (value === "") {
		return;
	}
	// clear the input box
	newToDo.value = '';
	// create the item
	itemStore.addOrUpdate(new todomvc.model.ToDoItem(value));
});

/**
 * @type {Element}
 */
var toggleAll = document.getElementById('toggle-all');
// TODO - respond to manual selection/deselection post toggling all
goog.events.listen(toggleAll, goog.events.EventType.CLICK, function(e) {
	/**
	 * @type {boolean}
	 */
	var state = toggleAll.checked;
	goog.array.forEach(itemStore.getAll(), function(model) {
		/**
		 * @type {!todomvc.model.ToDoItem}
		 */
		var updatedModel = new todomvc.model.ToDoItem(
				model.getNote(), state, model.getId());

		itemStore.addOrUpdate(updatedModel);
	});
});
