/*global define:false */
define([
	'troopjs-browser/component/widget',
	'jquery'
], function FiltersModule(Widget, $) {
	'use strict';

	return Widget.extend({
		'hub:memory/route': function onRoute(uri) {
			this.publish('todos/filter', uri.source);
		},

		'hub:memory/todos/filter': function onFilter(filter) {
			$('a[href^="#"]')
				.removeClass('selected')
				.filter('[href="#' + (filter || '/') + '"]')
				.addClass('selected');
		}
	});
});
