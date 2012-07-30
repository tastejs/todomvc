steal('jquery/model/list','jquery/lang/object', function($){

var same = $.Object.same,
	trigger = function(obj, event, args){
		$.event.trigger(event, args, obj, true)
	},
	$method = function( name ) {
		return function( eventType, handler ) {
			return $.fn[name].apply($([this]), arguments);
		}
	},
	bind = $method('bind'),
	unbind = $method('unbind');


$.Class('jQuery.Model.Store',
{
	id: "id",
	bind: bind,
	unbind: unbind,
	compare : {},
	
	init : function(){
		if(this.fullName === 'jQuery.Model.Store'){
			return;
		}
		
		this.sets = [];
		this.data = {};
		
		// listen on create and add ... listen on destroy and remove
		this.namespace.bind('destroyed', this.proxy('destroyed'));
		this.namespace.bind('updated', this.proxy('updated'));
		this.namespace.bind("created", this.proxy('created'));
	},
	
	/**
	 * Internal compare method.
	 * 
	 * @param {Object} prop
	 * @param {Object} itemData
	 * @param {Object} paramData
	 */
	_compare : function(prop, itemData, paramData){
		return same(itemData, paramData, this.compare[prop]);
	},
	
	/**
	 * Creates an item in the sets.  Triggered from a model
	 * event indicating an item was created.
	 *
	 * @param {Object} event
	 * @param {Object} item
	 */
	created: function(ev,item){
		this.add([item]);
	},
	
	/**
	 * Updates an item in the sets.  Triggered from a model
	 * event indicating an item was updated.
	 *
	 * @param {Object} event
	 * @param {Object} item
	 */
	updated: function(ev, item){
		// go through lists and remove this guy if he is in the list and should not be ...
		var sets  = this.sets.slice(0),
			report = ["Store - updating "];
			
		for(var i =0, length = this.sets.length; i < length; i++){
			var set = sets[i],
				inSet = this.filter(item, set.params) !== false,
				inList = set.list.get(item)[0];
			
			if(inSet && !inList){
				report.push("adding to", set.params, "; ");
				set.list.push(item)
			} else if(!inSet && inList) {
				report.push("removing from", set.params, "; ");
				set.list.remove(item.id)
			}
		}
	},
	
	/** 
	 * Destroy triggered by model event.  
	 * Calls remove function to remove item from lists.
	 *
	 * @param {Object} event
	 * @param {Object} id
	 */
	destroyed : function(ev,id){
		this.remove(id);
	},
	
	/**
	 * @function remove
	 *
	 * Removes an item from the sets.
	 *
	 * @param {Object} id
	 */
	remove:function(id){
		var idProp = this.id;
		
		if(id[idProp] !== undefined){
			id = id[idProp];
		}
		
		var item = this.data[id];
		
		if(!item){
			return;
		}
		
		delete this.data[id];
	},
	
	/**
	 * @function removeSet
	 * 
	 * Removes a set given a parms object and 
	 * removes each one of the items from the data.
	 *
	 * @param {Object} params
	 */
	removeSet: function(params){
		var matchIdx;
		
		$.each(this.sets, this.proxy(function(i,set){
			if($.Object.same(params, set.params, this.compare)){
				set.list.each(this.proxy(function(i,item){
					delete this.data[item[this.id]];
				}));
				matchIdx = i;
				return false;
			}
		}));
		
		matchIdx != undefined && this.sets.splice(matchIdx, 1);
	},
	
	/**
	 * @function add
	 *
	 * Adds items to the set(s) given the matching params.
	 *
	 * @param {Object} items
	 * @param {Object} params
	 */
	add : function(items, params){
		// need to check the filter rules, if we can even add this ...
		
		var len = items.length,
			i=0,
			item,
			idProp = this.id,
			id,
			added = [];
			
		for(; i< len; i++){
			item = items[i];
			id = item[idProp];
			
			if( this.data[id] ){
				
				// if there is something there ... take care of it ..
				this.update(this.data[id], item);
				
				// if the item already exists from say a 'findOne' call
				// the item will already exist in 'data' but not the 'list'
				added.push(item)
			} else {
				added.push(this.data[id] = item);
			}	
		}
		
		// go through sets and add to them ...
		//   slice so that if in callback, the number of sets increases, you are ok
		var sets  = this.sets.slice(0),
			report = ["Store - adding "];
			
		for(var i=0, iLength = sets.length; i < iLength; i++){
			var set = sets[i],
				itemsForSet = [];
			
			for(var j =0, jLength = added.length; j< jLength; j++){
				item = added[j]
				if( this.filter(item, set.params) !== false) {
					itemsForSet.push(item)
				}
			}
			
			if(itemsForSet.length) {
				report.push(itemsForSet.length,"to", set.params, "; ");
				set.list.push(itemsForSet);
			}
		}
	},
	
	/**
	 * @function update
	 *
	 * Updates the properties of currentItem
	 *
	 * @param {Object} currentItem
	 * @param {Object} newItem
	 */
	update : function(currentItem, newItem){
		currentItem.attrs(newItem.serialize());
	},
	
	/**
	 * @function sort
	 *
	 * Returns if a set contains the parameters.
	 * 
	 * @param {Object} params
	 **/
	has : function(params){
		// check if it has an evil param ...
		return $.Object.subsets(params, this.sets).length
	},
	
	/**
	 * @function filter
	 *
	 * Called with the item and the current params.
	 * Should return __false__ if the item should be filtered out of the result.
	 * 
	 * By default this goes through each param in params and see if it matches the
	 * same property in item (if item has the property defined).
	 *
	 * @param {Object} item
	 * @param {Object} params
	 */
	filter : function(item, params){
		// go through each param in params
		var param, paramValue
		for ( var param in params ) {
			i=0;
			paramValue = params[param];
			
			// in fixtures we ignore null, I don't want to now
			if ( paramValue !== undefined && item[param] !== undefined 
				 && !this._compare(param, item[param], paramValue) ) {
				return false;
			}
		}
	},
	
	/**
	 * @function sort
	 *
	 * Sorts the object in place. By default uses an order 
	 * property in the param of the class.
	 *
	 * @codestart
	 * var models = $.Model.Store.sort(myModelListInstance);
	 * @codeend
	 *
	 * @param {Object} items
	 * @param {Object} params
	 */
	sort : function(items, params){
		$.each((params.order || []).slice(0).reverse(), function( i, name ) {
			var split = name.split(" ");
			items = items.sort(function( a, b ) {
				if ( split[1].toUpperCase() !== "ASC" ) {
					if( a[split[0]] < b[split[0]] ) {
						return 1;
					} else if(a[split[0]] == b[split[0]]){
						return 0
					} else {
						return -1;
					}
				}
				else {
					if( a[split[0]] < b[split[0]] ) {
						return -1;
					} else if(a[split[0]] == b[split[0]]){
						return 0
					} else {
						return 1;
					}
				}
			});
		});
		return items
	},
	
	/**
	 * @function pagination
	 *
	 * Paginates the item in place. By default uses an order 
	 * property in the param of the class.
	 *
	 * @codestart
	 * var models = $.Model.Store.pagination(myModelListInstance);
	 * @codeend
	 *
	 * @param {Object} items
	 * @param {Object} params
	 */
	pagination : function(items, params){
		var offset = parseInt(params.offset, 10) || 0,
			limit = parseInt(params.limit, 10) || (items.length - offset);
		
		return items.slice(offset, offset + limit);
	},
	
	/**
	 * @function get
	 *
	 * Retrieves an item(s) given an id or array of ids from the global data
	 * set of the model store.  If the item is not returned yet, it will return
	 * the deffered.
	 *
	 * @codestart
	 * var model = $.Model.Store.get(222);
	 * @codeend
	 *
	 * @codestart
	 * var models = $.Model.Store.get([222, 223, 224]);
	 * @codeend
	 *
	 * @param {Object} id int or array of ints
	 */
	get : function(id){
		if($.isArray(id)) {
			var returnArr = [];
			
			$.each(id, this.proxy(function(i,d){
				var m = this.data[d];
				m && returnArr.push(m);
			}));
			
			return returnArr;
		} else {
			return this.data[id];
		}
	},
	
	/**
	 * @function findOne
	 *
	 * FindOne attempts to retrieve an individual model
	 * from the sets of currently fetched data.  If the model
	 * was not previously fetched, it will then execute a request on the 
	 * static 'findOne' method of the model.  It returns
	 * the deffered object.
	 * 
	 * @codestart
	 * $.Model.Store.findOne(222).done(success);
	 * @codeend
	 *
	 *
	 * You can listen for 'findOne' to be triggered by
	 * binding to the 'findOne' event on the class.
	 *
	 * @codestart
	 * $.Model.Store.bind('findOne', function(id){ ... });
	 * @codeend
	 *
	 *
	 * @param {Object} id of item
	 * @param {Function} success handler
	 * @param {Function} error handler
	 **/
	findOne : function(id, success, error){
		var data = this.data[id],
			def;
			
		if(data){
			if(data.isRejected){
				return data;
			} else {
				def = $.Deferred();
				def.resolve(data);
			}
		} else {
			this.data[id] = def = this.namespace.findOne({ id: id });
			
			def.done(this.proxy(function(item){
				this.data[id] = item;
			}));
		}
		
		def.done(success);
		trigger(this, 'findOne', id);
		
		return def;
	},

	/**
	 * @function findAll
	 *
	 * FindAll attempts to retrieve a list of model(s)
	 * from the sets of currently fetched data.  If the model(s)
	 * were not previously fetched, it will then execute a request on the 
	 * static 'findAll' method of the model.  It returns
	 * the deffered object. 
	 * 
	 * @codestart
	 * $.Model.Store.findAll({ parentId: 2222 }).done(success);
	 * @codeend
	 *
	 *
	 * You can listen for 'findAll' to be triggered by
	 * binding to the 'findAll' event on the class.
	 *
	 * @codestart
	 * $.Model.Store.bind('findAll', function(params){ ... });
	 * @codeend
	 *
	 *
	 * @param {Object} params
	 * @param {Boolean} register registers this list as owning some content, but does not
	 * @param {Boolean} ready
	 **/
	findAll : function(params, register, ready){
		// find the first set that is the same
		//   or is a subset with a def
		var parentLoadedSet,
			self = this,
			list,
			cb = function(){
				ready(list)
			};
			
		if(typeof  register === 'function' ){
			ready = register;
			register = false;
		}
		ready  = ready || function(){};
		
		for(var i =0, length = this.sets.length; i < length; i++){
			var set = this.sets[i];
			if( $.Object.subset(params, set.params, this.compare) ){
				parentLoadedSet = set;
				
				if( $.Object.same(set.params, params, this.compare) ){
					// what if it's not loaded
					if(!set.def){
						var def = this.namespace.findAll(params);
						set.def = def;
						def.done(function(items){
							list = items;
							self.add(items, params)
							cb && cb();
						})
					} else {
						list = set.list;
						if(set.def.isResolved()){
							setTimeout(cb, 1);
						} else {
							set.def.done(cb);
						}
					}
					
					return set.list;
				}
			}
		}
		
		// create a list, a set and add the set to our list of sets
		list = new this.namespace.List();
		var sameSet = {
				params: $.extend({},params),
				list: list
			};
			
		this.sets.push(sameSet);
		
		// we have loaded or are loading what we need
		if( parentLoadedSet ) {
			// find the first set with a deferred
			if( !parentLoadedSet.def ) {
				
				// we need to load this ...
				
			} else if( parentLoadedSet.def.isResolved() ){
				// add right away
				var items = self.findAllCached(params);
				list.push(items);
				setTimeout(cb, 1);;
			} else {
				// this will be filled when add is called ...
				parentLoadedSet.def.done(function(){
					var items = self.findAllCached(params);
					list.push(items);
					cb && cb();
				})
			}
			
		} else {
			
			if( !register ) {
				// we need to load it
				var def = sameSet.def = this.namespace.findAll(params);
				
				def.done(function(items){
					self.add(items, params);
					cb && cb();
				});
			}
		}
		
		trigger(this, 'findAll', params);
		
		return list;		
	},
	
	/**
	 * @function findAllCached
	 *
	 * FindAll attempts to retrieve a list of model(s)
	 * only from the cache.
	 *
	 * @param {Object} params
	 **/
	findAllCached : function(params){
		// remove anything not filtering ....
		//   - sorting, grouping, limit, and offset
		
		var list = [],
			data = this.data,
			item;
			
		for(var id in data){
			item = data[id];
			if( this.filter(item, params) !== false) {
				list.push(item)
			}
		}
		
		// do sorting / grouping
		list = this.pagination(this.sort(list, params), params);
		
		// take limit and offset ...
		return list;
	}
},{ });

});