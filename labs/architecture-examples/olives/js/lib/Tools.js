/*
 * A set of commonly used functions.
 * They're useful for several UIs in the app.
 * They could also be reused in other projects
 */
define( 'Todos/Tools', {

	// className is set to the 'this' dom node according to the value's truthiness
	'toggleClass': function ( value, className ) {
		value ? this.classList.add( className ) : this.classList.remove( className );
	}

});
