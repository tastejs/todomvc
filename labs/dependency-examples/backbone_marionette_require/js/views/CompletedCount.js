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
			this.$el = $('#clear-completed');

			var completedTodos = this.collection.getCompleted();

			this.$el
				.toggle(completedTodos.length > 0)
				.html('Clear completed (' + completedTodos.length + ')');
		}
	});
});
