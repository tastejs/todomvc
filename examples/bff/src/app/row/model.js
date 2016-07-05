/* global define */
define(['bff/record'], function (Record) {

	'use strict';

	return Record.withProperties({

		visible: 'boolean',

		editing: { type: 'boolean', defaultValue: false }

	});

});
