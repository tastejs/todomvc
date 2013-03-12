/*global define*/
'use strict';
// Taken from https://github.com/Ensighten/Halo.extras
define(['CrudModel', './kizzy'], function (CrudModel, kizzy) {
	function persist(params) {
		// Namespace each model and allow for subnamspacing with
		var kizzyKey = params.name + (params.persistKey || ''),
			cache = kizzy(kizzyKey);

		// Attach store to params
		params.persist = {
			'set': function (key, val) {
				cache.set(key, val);
			},
			'get': function (key) {
				return cache.get(key);
			},
			'clear': function () {
				cache.clear();
			}
		};

		// Return modified params
		return params;
	}

	// Mixin persist on Crudmodel
	CrudModel.addMixin('persist', persist);

	return persist;
});