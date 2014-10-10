/**
 * Olives http://flams.github.com/olives
 * The MIT License (MIT)
 * Copyright (c) 2012-2013 Olivier Scherrer <pode.fr@gmail.com> - Olivier Wietrich <olivier.wietrich@gmail.com>
 */

define(["Store", "Tools"],

/**
 * @class
 * LocalStore is an Emily's Store that can be synchronized with localStorage
 * Synchronize the store, reload your page/browser and resynchronize it with the same value
 * and it gets restored.
 * Only valid JSON data will be stored
 */
function LocalStore(Store, Tools) {

	function LocalStoreConstructor() {

		/**
		 * The name of the property in which to store the data
		 * @private
		 */
		var _name = null,

		/**
		 * The localStorage
		 * @private
		 */
		_localStorage = localStorage,

		/**
		 * Saves the current values in localStorage
		 * @private
		 */
		setLocalStorage = function setLocalStorage() {
			_localStorage.setItem(_name, this.toJSON());
		};

		/**
		 * Override default localStorage with a new one
		 * @param local$torage the new localStorage
		 * @returns {Boolean} true if success
		 * @private
		 */
		this.setLocalStorage = function setLocalStorage(local$torage) {
			if (local$torage && local$torage.setItem instanceof Function) {
				_localStorage = local$torage;
				return true;
			} else {
				return false;
			}
		};

		/**
		 * Get the current localStorage
		 * @returns localStorage
		 * @private
		 */
		this.getLocalStorage = function getLocalStorage() {
			return _localStorage;
		};

		/**
		 * Synchronize the store with localStorage
		 * @param {String} name the name in which to save the data
		 * @returns {Boolean} true if the param is a string
		 */
		this.sync = function sync(name) {
			var json;

			if (typeof name == "string") {
				_name = name;
				json = JSON.parse(_localStorage.getItem(name));

				Tools.loop(json, function (value, idx) {
					if (!this.has(idx)) {
						this.set(idx, value);
					}
				}, this);

				setLocalStorage.call(this);

				// Watch for modifications to update localStorage
				this.watch("added", setLocalStorage, this);
				this.watch("updated", setLocalStorage, this);
				this.watch("deleted", setLocalStorage, this);
				return true;
			} else {
				return false;
			}
		};


	}

	return function LocalStoreFactory(init) {
		LocalStoreConstructor.prototype = new Store(init);
		return new LocalStoreConstructor;
	};

});
