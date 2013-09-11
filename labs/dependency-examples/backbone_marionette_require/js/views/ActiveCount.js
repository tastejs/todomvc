/*global define */

define([
	'marionette',
	'jquery'
], function (Marionette, $) {
	'use strict';

	return Marionette.View.extend({
		initialize: function () {
			this.listenTo(this.collection, 'all', this.render, this);
		},

		render: function () {
			this.$el = $('#todo-count');

			var itemsLeft = this.collection.getActive().length;
			var itemsWord = itemsLeft < 1 || itemsLeft > 1 ? 'items' : 'item';

			this.$el.html('<strong>' + itemsLeft + '</strong> ' + itemsWord + ' left');
		}
	});
});
