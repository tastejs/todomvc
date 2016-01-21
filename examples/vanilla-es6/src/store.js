/*jshint eqeqeq:false */

/**
 * Creates a new client side storage object and will create an empty
 * collection if no collection already exists.
 *
 * @param {string} name The name of our DB we want to use
 * @param {function} callback Our fake DB uses callbacks because in
 * real life you probably would be making AJAX calls
 */
export default class Store {
	constructor(name, callback) {
		this._dbName = name;

		if (!localStorage[name]) {
			const data = {
				todos: []
			};

			localStorage[name] = JSON.stringify(data);
		}

		if (callback) {
			callback.call(this, JSON.parse(localStorage[name]));
		}
	}

	/**
	 * Finds items based on a query given as a JS object
	 *
	 * @param {object} query The query to match against (i.e. {foo: 'bar'})
	 * @param {function} callback   The callback to fire when the query has
	 * completed running
	 *
	 * @example
	 * db.find({foo: 'bar', hello: 'world'}, function (data) {
		 *	 // data will return any items that have foo: bar and
		 *	 // hello: world in their properties
		 * })
	 */
	find(query, callback){
		const todos = JSON.parse(localStorage[this._dbName]).todos;

		callback.call(this, todos.filter(todo => {
			for (let q in query) {
				if (query[q] !== todo[q]) {
					return false;
				}
			}
			return true;
		}));
	}

	/**
	 * Will retrieve all data from the collection
	 *
	 * @param {function} callback The callback to fire upon retrieving data
	 */
	findAll(callback){
		if (callback) {
			callback.call(this, JSON.parse(localStorage[this._dbName]).todos);
		}
	}

	/**
	 * Will save the given data to the DB. If no item exists it will create a new
	 * item, otherwise it'll simply update an existing item's properties
	 *
	 * @param {object} updateData The data to save back into the DB
	 * @param {function} callback The callback to fire after saving
	 * @param {number} id An optional param to enter an ID of an item to update
	 */
	save(updateData, callback, id){
		const data = JSON.parse(localStorage[this._dbName]);
		const todos = data.todos;
		const len = todos.length;

		// If an ID was actually given, find the item and update each property
		if (id) {
			for (let i = 0; i < len; i++) {
				if (todos[i].id === id) {
					for (let key in updateData) {
						todos[i][key] = updateData[key];
					}
					break;
				}
			}

			localStorage[this._dbName] = JSON.stringify(data);

			if (callback) {
				callback.call(this, JSON.parse(localStorage[this._dbName]).todos);
			}
		} else {
			// Generate an ID
			updateData.id = new Date().getTime();

			todos.push(updateData);
			localStorage[this._dbName] = JSON.stringify(data);

			if (callback) {
				callback.call(this, [updateData]);
			}
		}
	}

	/**
	 * Will remove an item from the Store based on its ID
	 *
	 * @param {number} id The ID of the item you want to remove
	 * @param {function} callback The callback to fire after saving
	 */
	remove(id, callback){
		const data = JSON.parse(localStorage[this._dbName]);
		const todos = data.todos;
		const len = todos.length;

		for (let i = 0; i < todos.length; i++) {
			if (todos[i].id == id) {
				todos.splice(i, 1);
				break;
			}
		}

		localStorage[this._dbName] = JSON.stringify(data);

		if (callback) {
			callback.call(this, JSON.parse(localStorage[this._dbName]).todos);
		}
	}

	/**
	 * Will drop all storage and start fresh
	 *
	 * @param {function} callback The callback to fire after dropping the data
	 */
	drop(callback){
		localStorage[this._dbName] = JSON.stringify({todos: []});

		if (callback) {
			callback.call(this, JSON.parse(localStorage[this._dbName]).todos);
		}
	}
}
