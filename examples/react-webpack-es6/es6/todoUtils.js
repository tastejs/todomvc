/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*jshint unused:false */

function uuid() {
	'use strict';
	/*jshint bitwise:false */
	var i, random;
	var uuid = '';

	for (i = 0; i < 32; i++) {
		random = Math.random() * 16 | 0;
		if (i === 8 || i === 12 || i === 16 || i === 20) {
			uuid += '-';
		}
		uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
			.toString(16);
	}

	return uuid;
}


function pluralize(count, word) {
	'use strict';
	return count === 1 ? word : word + 's';
}


function store(namespace, data) {
	'use strict';
	if (data) {
		return localStorage.setItem(namespace, JSON.stringify(data));
	}

	var store = localStorage.getItem(namespace);
	return (store && JSON.parse(store)) || [];
}


function extend() {
	'use strict';
	var newObj = {};
	for (var i = 0; i < arguments.length; i++) {
		var obj = arguments[i];
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				newObj[key] = obj[key];
			}
		}
	}
	return newObj;
}

const utils = {
	uuid: uuid,
	pluralize: pluralize,
	store: store,
	extend: extend
};

export default utils;
