steal('jquery/model/list','jquery/lang/object',function($){

var same = $.Object.same;


$.Class('jQuery.Model.Store',
{
	init : function(){
		if(this.fullName === 'jQuery.Model.Store'){
			return;
		}
		/**
		 * which sets are represented in this store ...
		 */
		this.sets = [];
		this.data = {};
		// listen on create and add ... listen on destroy and remove
		
		this.namespace.bind('destroyed', this.callback('remove'))
		this.namespace.bind('updated', this.callback('updated'))
	},
	updated : function(ev, item){
		// go through lists and remove this guy if he is in the list and should not be ...
		var sets  = this.sets.slice(0),
			report = ["Store - updating "];
			
		for(var i=0; i < sets.length; i++){
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
		/*if(report.length > 1) {
			console.log.apply(console, report);
		} else {
			console.log("Store - Updated, but no changes")
		}*/
	},
	// this is mostly unnecessary
	remove : function(ev,id){
		var idProp = this.id;
		if(id[idProp] !== undefined){
			id = id[idProp];
		}
		var item = this.data[id];
		if(!item){
			return;
		}
		// need to unbind?  Of course lists should cause this to happen
		delete this.data[id];
		// go through sets ... 
		
		/*var sets  = this.sets.slice(0),
			report = ["Store - removing from "];
		for(var i=0; i < sets.length; i++){
			var set = sets[i],
				removed;
			
			if(set.list){
				removed = set.list.remove(item)
			}
			
			if(removed.length) {
				report.push(set.params, "; ");
			}
		}
		if(report.length > 1) {
			console.log.apply(console, report);
		} else {
			console.log("Store - Items to remove, but no matches")
		}*/
	},
	id: "id",
	/**
	 * Adds items ... this essentially creates / updates them ...
	 * or looks 
	 * @param {Array} items
	 * @param {Object} [params] will only add to matching sets
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
			item = items[i]
			id = item[idProp]
			if( this.data[id] ){
				// if there is something there ... take care of it ..
				this.update(this.data[id], item);
			} else {
				added.push(this.data[id] = this.create(item))
			}
			
		}
		// go through sets and add to them ...
		//   slice so that if in callback, the number of sets increases, you are ok
		var sets  = this.sets.slice(0),
			report = ["Store - adding "];
		for(var i=0; i < sets.length; i++){
			var set = sets[i],
				itemsForSet = [];
			
			for(var j =0; j< added.length; j++){
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
		
		/*if(report.length > 1) {
			console.log.apply(console, report);
		} else {
			console.log("Store - Got new items, but no matches")
		}*/
		
		// check if item would be added to set
		
		// make sure item isn't already in set?  
	},
	/**
	 * updates the properties of currentItem
	 */
	update : function(currentItem, newItem){
		currentItem.attrs(newItem.serialize());
	},
	/**
	 * 
	 * @param {Object} newItem
	 */
	create : function(newItem){
		return newItem;
	},
	has : function(params){
		// check if it has an evil param ...
		
		return $.Object.subsets(params, this.sets).length
	},
	/**
	 * Called with the item and the current params.
	 * Should return __false__ if the item should be filtered out of the result.
	 * 
	 * By default this goes through each param in params and see if it matches the
	 * same property in item (if item has the property defined).
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
				 && !this._compare(param, item[param] ,paramValue) ) {
				return false;
			}
		}
	},
	compare : {},
	_compare : function(prop, itemData, paramData){
		return same(itemData, paramData, this.compare[prop]) //this.compare[prop] ? this.compare[prop](itemData, paramData) :  itemData == paramData;
	},
	/**
	 * Sorts the object in place
	 * 
	 * By default uses an order property in the param
	 * @param {Object} items
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
	pagination : function(items, params){
		var offset = parseInt(params.offset, 10) || 0,
			limit = parseInt(params.limit, 10) || (items.length - offset);
		
		return items.slice(offset, offset + limit);
	},
	get : function(id){
		return this.data[id];
	},
	findOne : function(id, success, error){
		//console.log("findOne ", id)
		if(this.data[id]){
			// check if it is a deferred or not
			if(this.data[id].isRejected){
				return this.data[id]
			} else {
				var def = $.Deferred()
				def.resolve(this.data[id])
			}
		} else {
			var def  = this.namespace.findOne({id: id}),
				self = this;
			def.done(function(item){
				self[id] = item;
			})
		}
		def.done(success)
		return def;
	},
	/**
	 * Returns a list that interacts with the store
	 * @param {Object} params
	 * @param {Boolean} register registers this list as owning some content, but does not 
	 * actually do the request ...
	 */
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
		
		for(var i =0; i < this.sets.length; i++){
			var set = this.sets[i];
			if( $.Object.subset(params, set.params, this.compare)  ){
				parentLoadedSet = set;
				//console.log($.Object.same( set.params, params), set.params, params );
				if( $.Object.same( set.params, params, this.compare) ){
					
					// what if it's not loaded
					if(!set.def){
						//console.log("Store - a listening list, but not loaded", params, ready);
						var def = this.namespace.findAll(params);
						set.def = def;
						def.done(function(items){
							//console.log("adding items from findALL", params, items.length)
							list = items;
							self.add(items, params)
							cb();;
						})
					} else {
						//console.log("Store - already loaded exact match",params, ready);
						list = set.list;
						if(set.def.isResolved()){
							setTimeout(cb, 1);
						} else {
							set.def.done(cb);
						}
						//ready && ready(set.list);
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
				//console.log("Store - already loaded parent set",params);
				var items = self.findAllCached(params);
					//list.reset();
				list.push(items);
				setTimeout(cb, 1);;
			} else {
				// this will be filled when add is called ...
				parentLoadedSet.def.done(function(){
					//console.log("Store - already loading parent set, waiting for it to return",params, ready);
					var items = self.findAllCached(params);
					//list.reset();
					list.push(items);
					cb();
				})
			}
			
		} else {
			
			if( register ) {
				// do nothing ...
				
				
			} else {
				// we need to load it
				//console.log("Store - loading data for the first time", params, ready);
				var def = this.namespace.findAll(params);
				sameSet.def = def;
				
				def.done(function(items){
					self.add(items, params);
					cb();//ready && ready(sameSet.list);
				})
				
			}

		}
		
		
		
		// wait until the items are loaded, do the reset and pushing ...
		
		// check later if no one is listening ...
		setTimeout(function(){
			//console.log('unbinding ...?')
			/*if(!list.bound){
				this.sets = $.grep(this.sets, function(set){ set !== sameSet});
				// we need to remove these items too ... (unless we are a superset)
			}*/
		},10);
		return list;		
		
	},
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
},{});


});
