(function(ns, $, Collection, LocalStore) {

/**
 * @class app.models.StoredCollection
 * @super Lavaca.mvc.Collection
 *
 * A Collection that is saved to localstorage
 *
 * @constructor
 * @params {String} The id used for namespacing in localstorage
 * @params {Array} The array of objects or instance of [[Lavaca.mvc.Model]] that are added to the collection
 * @params {Object} The hash of attributes to set on the collection
 */
ns.StoredCollection = Collection.extend(function(id, models, map) {
	// Initializes new LocalStore type
	this.store = new this.TStore(id);
	// Gets all models from storage
	var savedModels = this.store.all();
	// Calls the super class's contructor
	Collection.call(this, models ? savedModels.concat(models) : savedModels, map);
	// Binds listeners for events triggered on the collection
	this
		.on('addItem', this.onAddItem, this)
		.on('changeItem', this.onChangeItem, this)
		.on('removeItem', this.onRemoveItem, this);
},{
	/**
	* @field {[[Lavaca.storage.LocalStore]]} The type of storage to use
	* @default null
	*/
	TStore: LocalStore,
	/**
	* @method storeItem
	*
	* Sets a model to the store
	*
	* @params {[[Lavaca.mvc.Model]]} model The model
	*/
	storeItem: function(model) {
		this.store.set(model.id(), model);
	},
	/**
	* @method unstoreItem
	*
	* Removes a model from the store
	*
	* @params {[[Lavaca.mvc.Model]]} model The model
	*/
	unstoreItem: function(model) {
		this.store.remove(model.id());
	},
	/**
	* @method onAddItem
	*
	* A handler called when an item is added to the collection
	*
	* @params {Object} e The event
	*/
	onAddItem: function(e) {
		this.storeItem(e.model);
	},
	/**
	* @method onChangeItem
	*
	* A handler called when an item is changed in the collection
	*
	* @params {Object} e The event
	*/
	onChangeItem: function(e) {
		this.storeItem(e.model);
	},
	/**
	* @method onRemoveItem
	*
	* A handler called when an item is removed from the collection
	*
	* @params {Object} e The event
	*/
	onRemoveItem: function(e) {
		this.unstoreItem(e.model);
	}
});

})(Lavaca.resolve('app.models', true), Lavaca.$, Lavaca.mvc.Collection, Lavaca.storage.LocalStore);