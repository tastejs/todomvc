goog.require('goog.array');
goog.require('goog.events.EventType');
goog.require('goog.events.KeyCodes');
goog.require('goog.storage.mechanism.mechanismfactory')
goog.require('goog.storage.Storage');
goog.require('goog.string');
goog.require('goog.ui.Component');
goog.require('goog.ui.Control');

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
 * @type {goog.storage.Storage}
 */
var storage = new goog.storage.Storage(goog.storage.mechanism.mechanismfactory
		.createHTML5LocalStorage());

/**
 * @returns {Array.<todomvc.model.ToDoItem>}
 */
function load() {
	/**
	 * @type {Array.<todomvc.model.ToDoItem>}
	 */
	var items = [];
	var serializedItems = storage.get("todos-closure");
	goog.array.forEach(serializedItems, function (serializedItem) {
		var item = new todomvc.model.ToDoItem();
		item.setDone(serializedItem["completed"]);
		item.setNote(serializedItem["title"]);
		items.push(item);
	});
	return items;
}

/**
 * @param items {Array.<todomvc.model.ToDoItem>}
 */
function save(items) {
	/**
	 * @type {Array.<Object>}
	 */
	var serializedItems = [];
	goog.array.forEach(items, function (item) {
		serializedItems.push({
			"completed" : item.isDone(),
			"title": item.getNote()
		});
	});
	storage.set("todos-closure", serializedItems);
}

/**
 * @type {Array.<todomvc.model.ToDoItem>}
 */
var items = [];

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
	goog.array.forEachRight(items, function(model) {
		if (model.isDone()) {
			goog.array.remove(items, model);
			// do optimised model view sync
			container.forEachChild(function(control) {
				if (control.getModel() === model) {
					container.removeChild(control, true);					
				}
			});
		}
	});
	updateStats();
});

function updateStats() {
	var doneCount = goog.array.reduce(items, function(count, model) {
		return model.isDone() ? count + 1 : count;
	}, 0);
	var remainingCount = items.length - (/**@type {number}*/ doneCount); 
	itemCountControl.setContent((/**@type {string}*/ remainingCount));
	itemCountControl.setVisible(remainingCount > 0);
	clearCompletedControl.setContent((/**@type {string}*/ doneCount));
	clearCompletedControl.setVisible((/**@type {number}*/ doneCount) > 0);
}
updateStats();

/**
 * @type {todomvc.view.ToDoListContainer}
 */
var container = new todomvc.view.ToDoListContainer();
container.decorate(document.getElementById('todo-list'));

goog.events.listen(container, todomvc.view.ToDoItemControl.EventType.EDIT, function(e) {
	/**
	 * @type {todomvc.view.ToDoItemControl}
	 */
	var control = e.target;

	/**
	 * @type {todomvc.model.ToDoItem}
	 */
	var model = (/**@type {todomvc.model.ToDoItem} */ control.getModel());

	// do optimised model view sync
	model.setNote((/**@type {!string} */ control.getContent()));
	model.setDone((/**@type {!boolean} */ control.isChecked()));

	updateStats();
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
	
	// do optimised model view sync
	goog.array.remove(items, model);
	container.removeChild(control, true);
	
	updateStats();
});

/**
 * @type {Element}
 */
var newToDo = document.getElementById('new-todo');
goog.events.listen(newToDo, goog.events.EventType.KEYUP, function(e) {
	if (e.keyCode !== goog.events.KeyCodes.ENTER) {
		return;
	}
	var value = goog.string.trim(newToDo.value);
	if (value === "") {
		return;
	}

	/**
	 * @type {todomvc.model.ToDoItem}
	 */
	var model = new todomvc.model.ToDoItem(value);

	/**
	 * @type {todomvc.view.ToDoItemControl}
	 */
	var control = new todomvc.view.ToDoItemControl();

	// do optimised model view sync
	items.push(model);

	control.setContent(model.getNote());
	control.setChecked(model.isDone());
	control.setModel(model);

	container.addChild(control, true);

	// clear the input box
	newToDo.value = '';

	updateStats();

});

/**
 * @type {Element}
 */
var toggleAll = document.getElementById('toggle-all');
goog.events.listen(toggleAll, goog.events.EventType.CLICK, function(e) {
	/**
	 * @type {Boolean}
	 */
	var state = toggleAll.checked;
	goog.array.forEach(items, function(model) {
		model.setDone(state);
	});
	// do optimised model view sync
	container.forEachChild(function(control) {
		control.setChecked(control.getModel().isDone());
	});

	updateStats();
});
