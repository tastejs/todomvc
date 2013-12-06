/*!
 * CanJS - 2.0.3
 * http://canjs.us/
 * Copyright (c) 2013 Bitovi
 * Tue, 26 Nov 2013 18:21:22 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define(function(){
	var can = window.can || {};
	if(typeof GLOBALCAN === 'undefined' || GLOBALCAN !== false) {
		window.can = can;
	}

	can.isDeferred = function( obj ) {
		var isFunction = this.isFunction;
		// Returns `true` if something looks like a deferred.
		return obj && isFunction(obj.then) && isFunction(obj.pipe);
	};
	
	var cid = 0;
	can.cid = function(object, name){
		if(object._cid){
			return object._cid
		} else{
			return object._cid = (name ||"" ) + (++cid)
		}
	}
	can.VERSION = '2.0.3';
	
	can.simpleExtend = function(d, s){
		for(var prop in s){
			d[prop] = s[prop]
		}
		return d;
	}
	
	return can;
});