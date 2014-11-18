(function () {
	'use strict';

	function FakeDataStore(data) {
		this.data = data || [
			{title: 'buy some unicorns', completed: false, id: '108e8c51-bb3f-608d-15e2-611cfc7e5838'},
			{title: 'get a baguette mustache', completed: false, id: '6cdd0a1f-b6f8-21e1-f35b-aa18af99ad91'},
			{title: 'shave yaks', completed: true, id: 'abe678dd-3087-198c-eefa-180248cb3d8b'}
		];
	}

	FakeDataStore.prototype.all = function all() {
		return this.data;
	};

	FakeDataStore.prototype.save = function save(data) {
		this.data.push(data);
	};

	FakeDataStore.prototype.destroyAll = function destroyAll() {
		// Stub
	};

	window.mocks.DataStore = FakeDataStore;
}());
