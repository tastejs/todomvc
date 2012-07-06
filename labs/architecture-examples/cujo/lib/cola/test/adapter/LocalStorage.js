(function(buster, LocalStorageAdapter) {

var assert, refute, fail;

assert = buster.assert;
refute = buster.refute;
fail = buster.assertions.fail;

function identifier(item) {
	return item.id;
}

function fakeLocalStorage() {
	return {
		items: {},
		setItem: function(key, val) {
			this.items[key] = val;
		},
		getItem: function(key) {
			return this.items[key];
		},
		removeItem: function(key) {
			delete this.items[key];
		}
	}
}

buster.testCase('adapter/LocalStorage', {

	'should throw when namespace not provided': function() {
		assert.exception(function() {
			new LocalStorageAdapter();
		});
	},

	'should throw when localStorage not available and not provided in options': function() {
		assert.exception(function() {
			new LocalStorageAdapter('fail');
		});
	},

	'forEach': {
		'should iterate over zero items when empty': function() {
			var storage, a, count;

			storage = fakeLocalStorage();
			a = new LocalStorageAdapter('test', { localStorage: storage, identifier:  identifier });

			count = 0;
			a.forEach(function() {
				++count;
			});

			assert.equals(count, 0);
		},

		'should iterate over all items': function() {
			var storage, a, count;

			storage = fakeLocalStorage();
			a = new LocalStorageAdapter('test', { localStorage: storage, identifier:  identifier });

			a.add({ id: 1 });
			a.add({ id: 2 });
			a.add({ id: 3 });

			count = 0;
			a.forEach(function() {
				++count;
			});

			assert.equals(count, 3);
		}
	},

	'add': {
		'should add items': function() {
			var storage, a, count;

			storage = fakeLocalStorage();
			a = new LocalStorageAdapter('test', { localStorage: storage, identifier:  identifier });

			a.add({ id: 1 });

			count = 0;
			a.forEach(function(item) {
				++count;
				assert.equals(item, { id: 1 });
			});

			assert.equals(count, 1);
		}
	},

	'update': {
		'should update items': function() {
			var storage, a, count;

			storage = fakeLocalStorage();
			a = new LocalStorageAdapter('test', { localStorage: storage, identifier:  identifier });

			a.add({ id: 1 });
			a.update({ id: 1, success: true });

			count = 0;
			a.forEach(function(item) {
				++count;
				assert(item.success);
			});

			assert.equals(count, 1);
		}
	},

	'remove': {
		'should remove items': function() {
			var storage, a, count;

			storage = fakeLocalStorage();
			a = new LocalStorageAdapter('test', { localStorage: storage, identifier:  identifier });

			a.add({ id: 1 });

			count = 0;
			a.forEach(function(item) {
				++count;
				assert.equals(item, { id: 1 });
			});

			assert.equals(count, 1);

			a.remove({ id: 1 });

			count = 0;
			a.forEach(function() {
				++count;
			});

			assert.equals(count, 0);
		}
	}

});

})(
	require('buster'),
	require('../../adapter/LocalStorage')
);
