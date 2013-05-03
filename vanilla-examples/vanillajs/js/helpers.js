(function (window) {
	'use strict';

	// Cache the querySelector/All for easier and faster reuse
	window.$ = document.querySelectorAll.bind(document);
	window.$$ = document.querySelector.bind(document);

	// Allow for looping on Objects by chaining:
	// $('.foo').each(function () {})
	Object.prototype.each = function (callback) {
		for (var x in this) {
			if (this.hasOwnProperty(x)) {
				callback.call(this, this[x]);
			}
		}
	};

})(window);

