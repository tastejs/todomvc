goog.provide('todomvc');

goog.require('goog.History');
goog.require('goog.array');
goog.require('goog.dom.query');
goog.require('goog.events.EventType');
goog.require('goog.events.KeyCodes');
goog.require('goog.storage.Storage');
goog.require('goog.storage.mechanism.mechanismfactory');
goog.require('goog.string');
goog.require('goog.ui.Component');
goog.require('goog.ui.Control');
goog.require('todomvc.model.ToDoItem');
goog.require('todomvc.model.ToDoItemStore');
goog.require('todomvc.view');
goog.require('todomvc.view.ClearCompletedControlRenderer');
goog.require('todomvc.view.ItemCountControlRenderer');
goog.require('todomvc.view.ToDoItemControl');
goog.require('todomvc.view.ToDoListContainer');

/**
 * @fileoverview The controller/business logic for the application.
 *
 * This file creates the interface and marshals changes from the interface
 * to the model and back.
 */

/**
 * @type {todomvc.model.ToDoItemStore}
 */
var itemStore = new todomvc.model.ToDoItemStore();
itemStore.addEventListener(todomvc.model.ToDoItemStore.ChangeEventType,
    redraw);

/**
 * @type {todomvc.view.ToDoListContainer}
 */
var container = new todomvc.view.ToDoListContainer();
container.decorate(document.getElementById('todo-list'));

/**
 * @type {Element}
 */
var main = document.getElementById('main');

/**
 * @type {Element}
 */
var footer = document.getElementById('footer');

/**
 * @type {goog.ui.Control}
 */
var itemCountControl = new goog.ui.Control(null,
    todomvc.view.ItemCountControlRenderer.getInstance());
itemCountControl.render(footer);

/**
 * @type {goog.ui.Control}
 */
var clearCompletedControl = new goog.ui.Control(null,
    todomvc.view.ClearCompletedControlRenderer.getInstance());
clearCompletedControl.render(footer);

goog.events.listen(clearCompletedControl,
    goog.ui.Component.EventType.ACTION, function(e) {
    // go backwards to avoid collection modification problems
    goog.array.forEachRight(itemStore.getAll(), function(model) {
        if (model.isDone()) {
            itemStore.remove(model);
        }
    });
});

/**
 * @type {Element}
 */
var toggleAll = document.getElementById('toggle-all');
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

/**
 * Enum for the three possible route values
 * @enum {!string}
 */
todomvc.Route = {
    ALL: '/',
    ACTIVE: '/active',
    COMPLETED: '/completed'
};

/**
 * @type {!todomvc.Route}
 */
var currentRoute = todomvc.Route.ALL;

/**
 * @type {!goog.History}
 */
var history = new goog.History();
goog.events.listen(history, goog.history.EventType.NAVIGATE,
        function(e) {
    // constrain the route to be one of the enum values
    switch (e.token) {
    case todomvc.Route.ALL:
    case todomvc.Route.ACTIVE:
    case todomvc.Route.COMPLETED:
        if (e.token !== currentRoute) {
            currentRoute = e.token;
            redraw();
        }
        break;
    default:
        history.replaceToken(todomvc.Route.ALL);
        break;
    }
});

function redraw() {
    container.removeChildren(true);
    /**
     * @type {Array.<todomvc.model.ToDoItem>}
     */
    var items = itemStore.getAll();
    goog.array.forEach(items, function(item) {
        // filter based on current route
        if ((currentRoute === todomvc.Route.ACTIVE && item.isDone()) ||
                (currentRoute === todomvc.Route.COMPLETED && !item.isDone())) {
            return;
        }

        /**
         * @type {todomvc.view.ToDoItemControl}
         */
        var control = new todomvc.view.ToDoItemControl();

        control.setContent(item.getNote());
        control.setChecked(item.isDone());
        control.setModel(item);

        container.addChild(control, true);
    });

    var doneCount = /** @type {number} */
    (goog.array.reduce(items, function(count, model) {
        return model.isDone() ? count + 1 : count;
    }, 0));
    var remainingCount = items.length - (doneCount);
    toggleAll.checked = remainingCount === 0;
    itemCountControl.setContent(remainingCount.toString());
    clearCompletedControl.setContent(doneCount.toString());
    clearCompletedControl.setVisible(doneCount > 0);
    goog.style.showElement(main, items.length > 0);
    goog.style.showElement(footer, items.length > 0);

    /**
     * @type {Array.<Element>}
     */
    var routeLinks = /** @type {Array.<Element>} */
        (goog.dom.query('#filters a'));
    goog.array.forEach(routeLinks, function(link, i) {
        if ((currentRoute === todomvc.Route.ALL && i === 0) ||
                (currentRoute === todomvc.Route.ACTIVE && i === 1) ||
                (currentRoute === todomvc.Route.COMPLETED && i === 2)) {
            link.className = 'selected';
        } else {
            link.className = '';
        }
    });
}

goog.events.listen(container,
    todomvc.view.ToDoItemControl.EventType.EDIT, function(e) {
    /**
     * @type {todomvc.view.ToDoItemControl}
     */
    var control = e.target;

    /**
     * @type {todomvc.model.ToDoItem}
     */
    var originalModel = /**@type {todomvc.model.ToDoItem} */
        (control.getModel());

    /**
     * @type {!todomvc.model.ToDoItem}
     */
    var updatedModel = new todomvc.model.ToDoItem(
            (/**@type {!string} */ control.getContent()),
            (/**@type {!boolean} */ control.isChecked()),
            originalModel.getId());

    itemStore.addOrUpdate(updatedModel);
});

goog.events.listen(container,
    todomvc.view.ToDoItemControl.EventType.DESTROY, function(e) {
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
    if (value === '') {
        return;
    }
    // clear the input box
    newToDo.value = '';
    // create the item
    itemStore.addOrUpdate(new todomvc.model.ToDoItem(value));
});

itemStore.load();
history.setEnabled(true);
