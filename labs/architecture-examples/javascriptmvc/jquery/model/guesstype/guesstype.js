steal.plugins('jquery/model').then(function(){
	
	
	    /**
		 * @hide
		 * Guesses the type of an object.  This is what sets the type if not provided in 
		 * [jQuery.Model.static.attributes].
		 * @param {Object} object the object you want to test.
		 * @return {String} one of string, object, date, array, boolean, number, function
		 */
		$.Model.guessType= function( object ) {
			if ( typeof object != 'string' ) {
				if ( object === null ) {
					return typeof object;
				}
				if ( object.constructor == Date ) {
					return 'date';
				}
				if ( isArray(object) ) {
					return 'array';
				}
				return typeof object;
			}
			if ( object === "" ) {
				return 'string';
			}
			//check if true or false
			if ( object == 'true' || object == 'false' ) {
				return 'boolean';
			}
			if (!isNaN(object) && isFinite(+object) ) {
				return 'number';
			}
			return typeof object;
		};
	
});
