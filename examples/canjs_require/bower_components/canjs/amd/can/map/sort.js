/*!
 * CanJS - 2.0.3
 * http://canjs.us/
 * Copyright (c) 2013 Bitovi
 * Tue, 26 Nov 2013 18:21:22 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define(["can/util/library", "can/list"], function(can) {

var proto = can.List.prototype,
	_changes = proto._changes,
	setup = proto.setup;

// extend the list for sorting support
can.extend(proto,{
	comparator: undefined,
	sortIndexes: [],

	/**
	 * @hide
	 */
	sortedIndex: function(item){
		var itemCompare = item.attr(this.comparator),
			equaled = 0, i;

		for(var i = 0, length = this.length; i < length; i++){
			if(item === this[i]){
				equaled = -1;
				continue;
			}

			if(itemCompare <= this[i].attr(this.comparator)) {
				return i+equaled;
			}
		}

		return i + equaled;
	},

	/**
	 * @hide
	 */
	sort: function(method, silent){
		var comparator = this.comparator,
			args = comparator ? [function(a, b){
				a = (typeof a[comparator] === 'function')?a[comparator]():a[comparator];
				b = (typeof b[comparator] === 'function')?b[comparator]():b[comparator];
				return a === b ? 0 : (a < b ? -1 : 1);
			}] : [method],
			res = [].sort.apply(this, args);

		!silent && can.trigger(this, "reset");
	}
});

// create push, pop, shift, and unshift
// converts to an array of arguments
var getArgs = function( args ) {
		return args[0] && can.isArray(args[0]) ?
			args[0] :
			can.makeArray(args);
};

can.each({
	/**
	 * @function push
	 * Add items to the end of the list.
	 *
	 *     var l = new can.List([]);
	 *
	 *     l.bind('change', function(
	 *         ev,        // the change event
	 *         attr,      // the attr that was changed, for multiple items, "*" is used
	 *         how,       // "add"
	 *         newVals,   // an array of new values pushed
	 *         oldVals,   // undefined
	 *         where      // the location where these items where added
	 *         ) {
	 *
	 *     })
	 *
	 *     l.push('0','1','2');
	 *
	 * @param {...*} [...items] items to add to the end of the list.
	 * @return {Number} the number of items in the array
	 */
	push: "length",
	/**
	 * @function unshift
	 * Add items to the start of the list.  This is very similar to
	 * [can.List::push].  Example:
	 *
	 *     var l = new can.List(["a","b"]);
	 *     l.unshift(1,2,3) //-> 5
	 *     l.attr() //-> [1,2,3,"a","b"]
	 *
	 * @param {...*} [...items] items to add to the start of the list.
	 * @return {Number} the length of the array.
	 */
	unshift: 0
},
// adds a method where
// - name - method name
// - where - where items in the array should be added
function( where , name ) {
	var proto = can.List.prototype,
		old = proto[name];

	proto[name] = function() {
		// get the items being added
		var args = getArgs(arguments),
			// where we are going to add items
			len = where ? this.length : 0;

		// call the original method
		var res = old.apply(this, arguments);

		// cause the change where the args are:
		// len - where the additions happened
		// add - items added
		// args - the items added
		// undefined - the old value
		if ( this.comparator && args.length ) {
			this.sort(null, true);
			can.batch.trigger(this,"reset", [args]);
			this._triggerChange(""+len, "add", args, undefined);
		}

		return res;
	}
});

//- override changes for sorting
proto._changes = function(ev, attr, how, newVal, oldVal){
	if(this.comparator && /^\d+./.test(attr) ) {
		// get the index
		var index = +(/^\d+/).exec(attr)[0],
		// and item
			item = this[index];

		if( typeof item != "undefined") {
			// and the new item
			var newIndex = this.sortedIndex(item);

			if(newIndex !== index){
				// move ...
				[].splice.call(this, index, 1);
				[].splice.call(this, newIndex, 0, item);

				can.trigger(this, "move", [item, newIndex, index]);
				can.trigger(this,"change", [
					attr.replace(/^\d+/,newIndex),
					how,
					newVal,
					oldVal
				]);

				return;
			}
		}
	}

	_changes.apply(this, arguments);
};

//- override setup for sorting
proto.setup = function( instances, options ) {
	setup.apply(this, arguments);

	if(this.comparator){
		this.sort()
	}
};

return can.Map;
});