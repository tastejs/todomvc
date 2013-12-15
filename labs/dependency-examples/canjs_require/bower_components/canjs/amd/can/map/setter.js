/*!
 * CanJS - 2.0.3
 * http://canjs.us/
 * Copyright (c) 2013 Bitovi
 * Tue, 26 Nov 2013 18:21:22 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define(["can/util/library", "can/map/attributes"], function(can) {

/**
 * @function can.classize can.classize
 * @parent can.Map.setter
 * @plugin can/map/setter
 * 
 * @description Make a string into a class name.
 *
 * @signature `can.classize(str)`
 * 
 * `can.classize` splits a string by underscores or
 * dashes and capitalizes each part before joining
 * them back together. This method is useful for
 * taking HTML class names and getting the original
 * Control name from them.
 * 
 * @codestart
 * can.classize('my_control_name'); // 'MyControlName'
 * @codeend
 * @param {String} str The string to transform.
 * @return {String} The string as a class name.
 */
can.classize =  function( s , join) {
	// this can be moved out ..
	// used for getter setter
	var parts = s.split(can.undHash),
		i = 0;
	for (; i < parts.length; i++ ) {
		parts[i] = can.capitalize(parts[i]);
	}

	return parts.join(join || '');
}

var classize = can.classize,
	proto =  can.Map.prototype,
	old = proto.__set;

proto.__set = function(prop, value, current, success, error){
	// check if there's a setter
	var cap = classize(prop),
		setName = "set" + cap,
		errorCallback = function( errors ) {
			var stub = error && error.call(self, errors);
			
			// if 'setter' is on the page it will trigger
			// the error itself and we dont want to trigger
			// the event twice. :)
			if(stub !== false){
				can.trigger(self, "error", [prop, errors], true);
			}
			
			return false;
		},
		self = this;
		
	// if we have a setter
	if ( this[setName] &&
		// call the setter, if returned value is undefined,
		// this means the setter is async so we 
		// do not call update property and return right away
		( value = this[setName](value, 
			function(value ){ old.call(self,prop, value, current, success, errorCallback) },
			errorCallback ) ) === undefined ) {
		return;
	}
	
	old.call(self,prop, value, current, success, errorCallback);
	
	return this;
};
return can.Map;
});