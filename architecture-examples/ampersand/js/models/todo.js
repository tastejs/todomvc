'use strict';

// We're using 'ampersand-state' here instead of 'ampersand-model'
// because we don't need any of the RESTful
// methods for this app.
var State = require('ampersand-state');


module.exports = State.extend({
	// Properties this model will store
	// At minimum we have to provide a type
	// but we can also specify as follows:
	// [{type}, {is required}, {default value}]
	// if no default is given they are `undefined`
	// until set.
	props: {
		title: 'string',
		completed: ['boolean', true, false]
	},
	// session properties work the same way as `props`
	// but will not be included when serializing.
	session: {
		editing: 'boolean'
	},
	destroy: function () {
		if (this.collection) {
			this.collection.remove(this);
		}
	}
});
