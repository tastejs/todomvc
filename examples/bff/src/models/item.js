/* global define */
define(['bff/record'], function (Record) {

	'use strict';

	return Record.withProperties({

		title: 'string',

		completed: { type: 'boolean', defaultValue: false },

		// The "active" property is calculated from the "completed" property
		// In its current form it is not type checked and will not emit any events, as neither is needed.
		// By adding "setter: false", we make sure an error is thrown when trying to assign a value to this property.
		active: { getter: function () { return !this.completed; }, setter: false }

	});

});
