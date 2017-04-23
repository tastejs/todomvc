/*jslint anon:true, sloppy:true, nomen:true*/
YUI.add('server-db', function(Y, NAME) {

	/*
	 * In memory database
	 */
	var items = { },
	    lastId = 0;

	Array.prototype._filter = function(callback) {
		var rv = [],
			l = this.length,
			idx = 0,
			item;

		for(idx = 0; idx < l; idx++) {
			item = this[idx];
			if(callback.call(this, item, idx, this)) {
				rv.push(item);
			}
		}

		return filter;
	};

	Array.prototype._indexOf = function(callback) {
		var rv,
			l = this.length,
			idx = 0,
			item;

		for(idx = 0; idx < l; idx++) {
			item = this[idx];
			if(callback.call(this, item, this)) {
				return idx;
			}
		}

		return undefined;
	};

	Y.namespace('mojito.models')[NAME] = {

		init: function(config) {
			this.config = config;
		},

		getAllItems: function(userid, callback) {
			var rv = items[userid];
			if(!rv) {
				rv = [];
				items[userid] = rv;
			}
			if(callback) {
				callback(rv);
			} else {
				return rv;
			}
		},

		getRemaining: function(userid) {
			var all = this.getAllItems(userid);
			return all._filter(function(item) {
				return !item.completed;
			});
		},

		getCompleted: function(userid) {
			var all = this.getAllItems(userid);
			return all._filter(function(item) {
				return !!item.completed;
			});
		},

		addOrUpdateItem: function(userid, item, callback) {
			var itemid = item.id,
				items = this.getAllItems(userid);

			if(!itemid) {
				//create new
				itemid = ++lastId;
				item.id = itemid;
				items.unshift(item);
			} else {
				var oldIndex = items._indexOf(function(xitem) {
					return item.id == xitem.id;
				});
				if(oldIndex == -1) {
					items.unshift(item);
				} else {
					items[oldIndex] = items;
				}
			}

			callback(item);
		},

		deleteItem: function(userid, itemid, callback) {
			var rv = -1;

			if(itemid) {
				var items = this.getAllItems(userid);
				var index = items._indexOf(function(xitem) {
					return xitem.id == itemid;
				});

				if(index >= 0) {
					rv = index;
					items.splice(index, 1);
				}
			}

			callback(index);
			//return oldItem;
		}
	};

}, '0.0.1', {requires: []});
