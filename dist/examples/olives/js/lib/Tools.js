'use strict';

/*
 * A set of commonly used functions.
 * They're useful for several UIs in the app.
 * They could also be reused in other projects
 */
module.exports = {
	// className is set to the 'this' dom node according to the value's truthiness
	toggleClass: function (value, className) {
		if (value) {
			this.classList.add(className);
		} else {
			this.classList.remove(className);
		}
	}
};
