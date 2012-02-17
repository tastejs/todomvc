goog.provide('todomvc.model.ToDoItem');

/**
 * The model object representing a todo item.
 * 
 * @param {!string} note the text associated with this item 
 * @param {!boolean=} opt_done is this item complete? defaults to false 
 * @constructor
 */
todomvc.model.ToDoItem = function(note, opt_done) {
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
};

/**
 * @return {!string} the text associated with this item 
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
 * @param {!string} note the text associated with this item 
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