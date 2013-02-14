YUI.add('TodoMojitModelTodo', function(Y, NAME) {

	// Finally, got official localStorage: http://yuilibrary.com/yui/docs/api/classes/CacheOffline.html. Huh!
	var storage = new Y.CacheOffline();

	Y.namespace('mojito.models').Todo = {
		init: function(config) {
			Y.log('Initializing... ', 'warn', NAME);
			this.config = config;

			var initData = storage.retrieve('todo');
			if(!initData) {
				storage.add('todo', []);
			}
		},

		getAll: function(callback) {
			if(storage) {
				//var rv = storage.getItem('todo', true);
				//Y.log(' rv: ' + Y.JSON.stringify(rv), 'warn', NAME);
				var obj = storage.retrieve('todo'),
					rv = obj.response;
				callback(null, rv);
			} else {
				callback('Storage not initialized');
			}
		},

		getFiltered: function(completed, callback) {
			if(storage) {
				var all = storage.retrieve('todo').response,
					l = all.length,
					i = 0,
					rv = [];

				for(i = 0; i < l; i++) {
					if(completed == !!all[i].completed) {
						rv.push(all[i]);
					}
				}
				callback(null, rv);
			} else {
				callback('Storage not initialized');
			}
		},

		add: function(item, callback) {
			if(storage) {
				item.id = Y.guid();
				item.complete = false;
				var all = storage.retrieve('todo').response;
				all.push(item);
				storage.add('todo', all);
				callback(null, all);
			} else {
				callback('Storage not initialized');
			}
		},

		remove: function(id, callback) {
			if(!id) {
				callback('Missing id to delete');
				return;
			}
			if(storage) {
				var all = storage.retrieve('todo').response,
					l = all.length,
					i, item;
				for(i = 0; i < l; i++) {
					item = all[i];
					if(item.id === id) {
						all.splice(i, 1);
						storage.add('todo', all);
						callback(null, item);
						return;
					}
				}
				callback('Item not found');
			} else {
				callback('Storage not initialized');
			}
		},

		removeAll: function(callback) {
			if(storage) {
				storage.add('todo', []);
				callback(null, []);
			} else {
				callback('Storage not initialized');
			}
		},

		batchMark: function(completed, callback) {
			if(storage) {
				var all = storage.retrieve('todo').response;

				Y.each(all, function(item) {
					item.completed = !!completed;
				});
				storage.add('todo', all);
				callback(null, 'updated');
			} else {
				callback('Storage not initialized');
			}
		},

		toggle: function(id, callback) {
			if(!id) {
				callback('Missing id to retrieve');
				return;
			}
			if(storage) {
				var all = storage.retrieve('todo').response,
					l = all.length,
					i = 0,
					success = false,
					item;

				for(i = 0; i < l; i++) {
					item = all[i];
					if(item && item.id === id) {
						item.completed = !item.completed;
						storage.add('todo', all);
						success = true;
						break;
					}
				}

				if(success) {
					callback(null, item);
				} else {
					callback('Item not found');
				}
			} else {
				callback('Storage not initialized');
			}
		},

		update: function(item, callback) {
			if(!item.id) {
				callback('Missing id to retrieve');
				return;
			}
			if(storage) {
				var all = storage.retrieve('todo').response,
					l = all.length,
					i = 0,
					updated = false;

				for(i = 0; i < l; i++) {
					if(all[i] && all[i].id === item.id) {
						all[i] = item;
						storage.add('todo', all);
						updated = true;
						break;
					}
				}

				if(updated) {
					callback(null, item);
				} else {
					callback('Item not found');
				}
			} else {
				callback('Storage not initialized');
			}
		},

		get: function(id, callback) {
			if(!id) {
				callback('Missing id to retrieve');
				return;
			}
			if(storage) {
				var all = storage.retrieve('todo').response,
					l = all.length,
					i = 0,
					item = null;

				for(i = 0; i < l; i++) {
					if(all[i] && all[i].id === id) {
						item = all[i];
						break;
					}
				}

				if(item) {
					callback(null, item);
				} else {
					callback('Item not found');
				}
			} else {
				callback('Storage not initialized');
			}
		}
	};

}, "0.0.1", { requires: [ 'json', 'cache-offline' ] });
