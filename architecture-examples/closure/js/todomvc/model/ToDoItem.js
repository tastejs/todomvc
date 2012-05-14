goog.provide('todomvc.model.ToDoItem');

/**
 * The model object representing a todo item.
 *
 * @param {!string} note the text associated with this item.
 * @param {!boolean=} opt_done is this item complete? defaults to false.
 * @param {!number=} opt_id the id for the item defaults to 0 meaning undefined.
 * @constructor
 */
todomvc.model.ToDoItem = function(note, opt_done, opt_id) {
    /**
     * note the text associated with this item
     * @private
     * @type {!string}
     */
    this.note_ = note;

    /**
     * is this item complete?
     * @private
     * @type {!boolean}
     */
    this.done_ = opt_done || false;

    /**
     * the id for the item, or 0 if it is not yet defined
     * @private
     * @type {!number}
     */
    this.id_ = opt_id || 0;
};

/**
 * @return {!string} the text associated with this item.
 */
todomvc.model.ToDoItem.prototype.getNote = function() {
    return this.note_;
};

/**
 * @return {!boolean} is this item complete?
 */
todomvc.model.ToDoItem.prototype.isDone = function() {
    return this.done_;
};

/**
 * @return {!number} the id for the item, or 0 if it is not yet defined.
 */
todomvc.model.ToDoItem.prototype.getId = function() {
    return this.id_;
};

/**
 * @param {!string} note the text associated with this item.
 */
todomvc.model.ToDoItem.prototype.setNote = function(note) {
    this.note_ = note;
};

/**
 * @param {!boolean} done is this item complete?
 */
todomvc.model.ToDoItem.prototype.setDone = function(done) {
    this.done_ = done;
};

/**
 * @param {!number} id the id for the item, or 0 if it is not yet defined.
 */
todomvc.model.ToDoItem.prototype.setId = function(id) {
    this.id_ = id;
};
