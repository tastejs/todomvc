(function ($, kendo) {
	'use strict';

	var itemBase, separator, idField;

	kendo.data.extensions = kendo.data.extensions || {};

	// Function to create a quasi-unique GUID for localStorage
	var getGuid = function () {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
			return v.toString(16);
		});
	};

	// Obtains the list of keys from localStorage
	var getKeys = function () {
		var keysList = localStorage.getItem(itemBase);
		return keysList ? keysList.split(',') : [];
	};

	// Checks the localStorage key list for the current id and,
	// if it doesn't exist, adds that key to the list and saves
	// the list back to localStorage.
	var addKeyIfNew = function (id) {
		var keys = getKeys(),
			matchingKey = $.grep(keys, function (key) { return key === id; });

		if (!matchingKey.length) {
			keys.push(id);
			localStorage.setItem(itemBase, keys.join(','));
		}
	};

	// Fetches an array of objects from localStorage
	var getFromLocalStorage = function () {
		var keys = getKeys(),
			todos = [];

		$.each(keys, function (index, value) {
			var item = localStorage.getItem(itemBase + separator + value);

			if (item) {
				todos.push(JSON.parse(item));
			}
		});

		return todos;
	};

	// Saves the current item to localStorage
	var saveToLocalStorage = function (data) {
		if (!data[idField]) {
			data[idField] = getGuid();
		}

		addKeyIfNew(data[idField]);
		localStorage.setItem(itemBase + separator + data[idField], JSON.stringify(data));
	};

	// Removes the current item from localStorage
	var removeFromLocalStorage = function (data) {
		var keys = getKeys();

		var index = keys.indexOf(data[idField]);

		if (index >= 0) {
			keys.splice(index, 1);
			localStorage.setItem(itemBase, keys.join(','));

			localStorage.removeItem(itemBase + separator + data[idField]);
		}
	};

	// Specify a CRUD transport object for our custom Kendo DataSource
	var localTransports = {
		read: function (options) {
			var todos = getFromLocalStorage();

			options.success(todos);
		},
		create: function (options) {
			saveToLocalStorage(options.data);

			options.success(options.data);
		},
		update: function (options) {
			saveToLocalStorage(options.data);

			options.success(options.data);
		},
		destroy: function (options) {
			removeFromLocalStorage(options.data);

			options.success(options.data);
		}
	};

	// Create the custom DataSource by extending a kendo.data.DataSource
	// and specify an init method that wires up needed functionality.
	kendo.data.extensions.LocalStorageDataSource = kendo.data.DataSource.extend({
		init: function (options) {
			// DataSource consumers can specify custom itemBase and separator
			// strings when initializing the DataSource. These values are
			// used when saving records to localStorage.
			itemBase = options.itemBase || 'kendo-ds';
			separator = options.separator || '-';
			idField = options.schema.model.idField;

			// The idField is required. If not specified on the model, throw an error
			if (!idField) {
				throw new Error('An id field is required in order to work with localStorage. Please specify an id on your Model.');
			}

			// Call the "base" DataSource init function and provide our custom transport object
			kendo.data.DataSource.fn.init.call(this, $.extend(true, {}, { transport: localTransports }, options));
		}
	});
})($, kendo);
