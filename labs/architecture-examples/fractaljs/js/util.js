/* jshint newcap: false */
/* global F */
(function( window ) {
	'use strict';

	var Store = (function(){
		var __seq = 0;
		var Store = function(){
			this.dataKey = 'todo-fractaljs-' + (++__seq);
			this.idKey = this.dataKey + '.last';
			this.topic = this.dataKey + '.updated';
			this.getAll();
		};
		var proto = Store.prototype;
		proto.getAll = function() {
			if (!this.data) {
				var data = localStorage.getItem(this.dataKey);
				if (data) {
					data = JSON.parse(data);
				}
				this.data = data || [];
			}
			return this.data;
		};
		var sync = function() {
			localStorage.setItem(this.dataKey, JSON.stringify(this.data));
			F.Pubsub.publish(this.topic, this.data);
		};
		proto.nextId = function(){
			var id = localStorage.getItem(this.idKey);
			localStorage.setItem(this.idKey, ++id);
			return id;
		};
		proto.insert = function(item) {
			var id = this.nextId();
			item._id = id;
			this.data.push(item);
			sync.bind(this)();
		};
		proto.update = function(idList, key, value) {
			if (!Array.isArray(idList)) {
				idList = [idList];
			}
			var idMap = {};
			var i = 0, len = idList.length;
			for(; i<len; ++i) {
				idMap[idList[i]] = true;
			}
			i = 0;
			len = this.data.length;
			for (; i<len; ++i) {
				if (this.data[i]._id in idMap) {
					this.data[i][key] = value;
				}
			}
			sync.bind(this)();
		};
		proto.remove = function(idList) {
			if (!Array.isArray(idList)) {
				idList = [idList];
			}
			var i = 0, ilen = idList.length;
			for(; i<ilen; ++i) {
				var id = idList[i];
				var j = 0, jlen = this.data.length;
				for (; j<jlen; ++j) {
					if (this.data[j]._id === id) {
						this.data.splice(j, 1); // safe to do 1 splice and break
						break;
					}
				}
			}
			sync.bind(this)();
		};
		proto.onChange = function(cb) { F.Pubsub.subscribe(this.topic, cb); };

		return Store;
	})();

	window.getStore = (function(){
		var store = new Store();
		return function() { return store; };
	})();

	window.ENTER_KEY = 13;
	window.ESCAPE_KEY = 27;

})( window );
