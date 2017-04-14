(function(ns, $, StoredCollection) {

/**
 * @class app.models.TodosCollection
 * @super app.models.StoredCollection
 * A Collection for todos
 */
ns.TodosCollection = StoredCollection.extend(function() {
	// Calls super class's constructor
	StoredCollection.apply(this, arguments);
	// Sets a hash of computed attributes on the collection
	this.apply({
	filteredItems: this.getFilteredItems,
		completedCount: this.countCompleted,
		itemsLeft: this.countItemsLeft,
		allCompleted: this.isAllCompleted,
		plural: this.getPluralItems
	});
}, {
	/**
	* @method clearCompleted
	*
	* Removes all models marked completed
	*
	*/
	clearCompleted: function() {
		var models = this.filter({completed: true}),
			model,
			i = -1;
		while (model = models[++i]) {
			this.remove(model);
		}
	},
	/**
	* @method markAll
	*
	* Sets the completed status of all models in the collection
	*
	* @params {Boolean} completed The completed status of the models
	*/
	markAll: function(completed) {
		var self = this;
		// Don't fire change events
		this.suppressEvents = true;
		var models = this.each(function(i, model) {
			model.set('completed', completed);
			// Calling StoredCollection's onChangeItem programmatically since events are suppressed
			this.onChangeItem({model: model});
		});
		// Enable events again
		this.suppressEvents = false;
		// Triggers a custom markAll event
		this.trigger('markAll');
	},
	/**
	* @method removeTodo
	*
	* Removes a model from the collection by id
	*
	* @params {String} id The id of the model
	*/
	removeTodo: function(id) {
		this.remove({id: id});
	},
	/**
	* @method addTodo
	*
	* Adds a new model to the collection
	*
	* @params {String} title The title of the todo
	* @return {Boolean} Whether the item was added successfully
	*/
	addTodo: function(title) {
		var trimmedTitle = title.trim();
		if(trimmedTitle.length) {
		// Adds a new model and returns whether the item was added successfully
			return this.add({
				title: title,
				completed: false,
				id: new Date().getTime()
			});
		}
		return false;
	},
	/**
	* @method editTodo
	*
	* Sets the title of an existing model in the collection
	*
	* @params {String} id The id of the model
	* @params {String} title The title of the todo
	* @return {[[Lavaca.mvc.Model]]} The updated todo
	*/
	editTodo: function(id, title) {
		// Returns the first model in the collection that matches the specified attributes
		var todo = this.first({id: id}),
			trimmedTitle = title.trim();
		if (todo) {
			if (trimmedTitle.length) {
				todo.set('title', title);
			} else {
				this.remove(todo);
			}
		}
		return todo;
	},
	/**
	* @method markTodo
	*
	* Sets the title of an existing model in the collection
	*
	* @params {String} id The id of the model
	* @params {Boolean} completed The completed status of the model
	* @return {[[Lavaca.mvc.Model]]} The updated todo
	*/
	markTodo: function(id, completed) {
		var todo = this.first({id: id});
		if (todo) {
			todo.set('completed', completed);
		}
		return todo;
	},
	/**
	* @method getItemsLeft
	*
	* Filters items that have not been marked completed
	*
	* @return {Array} The items not marked completed
	*/
	getItemsLeft: function() {
		return this.filter({completed: false});
	},
	/**
	* @method getItemsCompleted
	*
	* Filters items that have been marked completed
	*
	* @return {Array} The items marked completed
	*/
	getItemsCompleted: function() {
		return this.filter({completed: true});
	},
	/**
	* @method isAllCompleted
	*
	* Returns whether all items in the collection are marked completed
	*
	* @return {Boolean} Whether all items are completed
	*/
	isAllCompleted: function() {
		return this.countCompleted() == this.count();
	},
	/**
	* @method getFilteredItems
	*
	* Returns an array of items that match the current filter (all, active, or completed)
	*
	* @return {Array} Items matching the current filter
	*/
	getFilteredItems: function() {
		var filter = this.get('filter'),
			filteredItems = [],
			filteredModels,
			i = -1,
			item,
			filterMap = {
				'all': function() {
					return this.models;
				},
				'active': this.getItemsLeft,
				'completed': this.getItemsCompleted
			};
		filteredModels = filterMap[filter].call(this);
		while (item = filteredModels[++i]) {
			filteredItems.push(item.toObject());
		}
		return filteredItems;
	},
	/**
	* @method countCompleted
	*
	* Returns the number of items completed
	*
	* @return {Number} The number of items completed
	*/
	countCompleted: function() {
		return this.getItemsCompleted().length;
	},
	/**
	* @method countItemsLeft
	*
	* Returns the number of items left
	*
	* @return {Number} The number of items left
	*/
	countItemsLeft: function() {
		return this.getItemsLeft().length;
	},
	/**
	* @method getPluralItems
	*
	* A rudimentary means to pluralize words
	*
	* @return {String} 's' or ''
	*/
	getPluralItems: function() {
		return this.getItemsLeft() != 1 ? 's' : '';
	}
  
});

})(app.models, Lavaca.$, app.models.StoredCollection);