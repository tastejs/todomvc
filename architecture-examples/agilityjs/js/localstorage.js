// custom agilityjs adapter for localstorage
(function ($$, undefined) {
	'use strict';

	$$.adapter.localStorage = function (_params) {
		var storageKey = (this._data.persist.baseUrl || '') + this._data.persist.collection;
		var storageStr = localStorage[storageKey];
		var items = (storageStr ? JSON.parse(storageStr) : {});

		if (_params.type === 'GET') {
			if (_params.id !== undefined) {  // normal get
				if (typeof items[_params.id] === 'object') {
					_params.success(items[_params.id]);
				} else {
					_params.error();
				}
			} else {  // gather call
				_params.success(items);
			}
		} else if (_params.type === 'DELETE') {
			delete items[_params.id];
			localStorage[storageKey] = JSON.stringify(items);
		} else if (_params.type === 'PUT' || _params.type === 'POST') {
			if (_params.id === undefined) {
				_params.id = (new Date()).getTime();
				_params.data.id = _params.id;
			}
			items[_params.id] = _params.data;
			localStorage[storageKey] = JSON.stringify(items);
		} else {
			_params.error();
		}
		_params.complete();
	};
})(window.agility);
