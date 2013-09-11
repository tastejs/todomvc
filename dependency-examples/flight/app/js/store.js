/*global define */

'use strict';

define([
	'depot'
], function (depot) {
	return depot('todos', { idAttribute: 'id' });
});
