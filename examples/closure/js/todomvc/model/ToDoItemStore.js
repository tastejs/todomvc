goog.provide('todomvc.model.ToDoItemStore');

goog.require('goog.array');
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
goog.require('goog.storage.Storage');
goog.require('goog.storage.mechanism.mechanismfactory');
goog.require('goog.string');
goog.require('goog.ui.Component');
goog.require('goog.ui.Control');
goog.require('todomvc.model.ToDoItem');


/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
todomvc.model.ToDoItemStore = function() {
    var mechanism = goog.storage.mechanism.mechanismfactory
            .createHTML5LocalStorage();
    /**
     * @type {goog.storage.Storage}
     * @private
     */
    this.storage_ = mechanism ? new goog.storage.Storage(mechanism) : null;

    /**
     * @type {!Array.<todomvc.model.ToDoItem>}
     * @private
     */
    this.items_ = [];

    /**
     * Fundamentally flawed approach to ID-ing but fine for demo
     * @type {!number}
     * @private
     */
    this.maxId_ = 0;
};
goog.inherits(todomvc.model.ToDoItemStore, goog.events.EventTarget);

/**
 * Load item list from storage
 */
todomvc.model.ToDoItemStore.prototype.load = function() {
    if (!this.storage_) {
        this.notify_(false);
        return; // no storage = no loading!
    }
    goog.array.clear(this.items_);
    /**
     * @type {Array.<*>}
     */
    var serializedItems = /** @type {Array.<*>} */
        (this.storage_.get('todos-closure'));
    if (!serializedItems) {
        this.notify_(false);
        return; // nothing in storage
    }
    goog.array.forEach(serializedItems, function(serializedItem) {
        var item = new todomvc.model.ToDoItem(serializedItem['title'],
                serializedItem['completed'], serializedItem['id']);
        if (item.getId() > this.maxId_) {
            this.maxId_ = item.getId();
        }
        this.items_.push(item);
    }, this);
    this.notify_(false);
};

/**
 * @param {!todomvc.model.ToDoItem} updatedItem A prototype model to update.
 */
todomvc.model.ToDoItemStore.prototype.addOrUpdate = function(updatedItem) {
    var idx = goog.array.findIndex(this.items_, function(item) {
        return updatedItem.getId() === item.getId();
    });
    if (idx === -1) {
        if (updatedItem.getId() === 0) {
            updatedItem.setId(++this.maxId_);
        }
        this.items_.push(updatedItem);
    } else {
        this.items_[idx] = updatedItem;
    }
    this.notify_();
};

/**
 * @param {!todomvc.model.ToDoItem} itemToRemove A prototype model to remove.
 */
todomvc.model.ToDoItemStore.prototype.remove = function(itemToRemove) {
    goog.array.removeIf(this.items_, function(item) {
        return itemToRemove.getId() === item.getId();
    });
    this.notify_();
};

/**
 * @param {boolean=} opt_save whether to save to storage, defaults to true.
 * @private
 */
todomvc.model.ToDoItemStore.prototype.notify_ = function(opt_save) {
    // TODO delay until all changes have been made
    if (!goog.isDef(opt_save) || opt_save) {
        this.save_();
    }
    this.dispatchEvent(new todomvc.model.ToDoItemStore.ChangeEvent(this));
};

/**
 * @return {Array.<todomvc.model.ToDoItem>} All of the stored items.
 */
todomvc.model.ToDoItemStore.prototype.getAll = function() {
    return this.items_;
};

/**
 * @private
 */
todomvc.model.ToDoItemStore.prototype.save_ = function() {
    if (!this.storage_) {
        return; // no storage = no saving!
    }
    /**
     * @type {Array.<*>}
     */
    var serializedItems = [];
    goog.array.forEach(this.items_, function(item) {
        serializedItems.push({
            'completed' : item.isDone(),
            'title': item.getNote(),
            'id' : item.getId()
        });
    });
    this.storage_.set('todos-closure', serializedItems);
};

/**
 * @const
 */
todomvc.model.ToDoItemStore.ChangeEventType = 'change';

/**
 * @constructor
 * @extends {goog.events.Event}
 * @param {todomvc.model.ToDoItemStore} target The item store.
 */
todomvc.model.ToDoItemStore.ChangeEvent = function(target) {
    goog.events.Event.call(this,
        todomvc.model.ToDoItemStore.ChangeEventType, target);
};
goog.inherits(todomvc.model.ToDoItemStore.ChangeEvent, goog.events.Event);
