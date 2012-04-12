/*

	 [MIT licensed](http://en.wikipedia.org/wiki/MIT_License)
	 (c) [Toshihide Shimayama](http://github.com/tshm/todomvc/)

*/
// custom agilityjs adapter for localstorage
(function($$, console) {
	'use strict';

	$$.adapter.localStorage = function(_params) {
		var storageKey = (this._data.persist.baseUrl || '') + this._data.persist.collection,
		storageStr = localStorage[storageKey],
		items = (storageStr ? JSON.parse(storageStr) : {});
		//
		if ('GET' === _params.type) {
			if (undefined !== _params.id) {  // normal get
				if ('object' === typeof items[_params.id]) {
					_params.success(items[_params.id]);
				} else {
					_params.error();
				}
			} else {  // gather call
				_params.success(items);
			}
		} else if ('DELETE' === _params.type) {
			delete items[_params.id];
			localStorage[storageKey] = JSON.stringify(items);
		} else if ('PUT' === _params.type || 'POST' === _params.type) {
			if (undefined === _params.id) {
				_params.id = (new Date()).getTime();
				_params.data.id = _params.id;
			}
			items[_params.id] = _params.data;
			//_params.success({id:_params.id});
			localStorage[storageKey] = JSON.stringify(items);
		} else {
			_params.error();
		}
		_params.complete();
	};

})(window.agility, window.console);
