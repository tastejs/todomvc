/*global define */

define([
	'app'
], function (app) {
	'use strict';

	return {
		setFilter: function (param) {
			app.vent.trigger('todoList:filter', param && param.trim() || '');
		}
	};
});
