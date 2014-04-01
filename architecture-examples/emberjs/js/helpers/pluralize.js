/*global Ember */
(function () {
	'use strict';

	Ember.Handlebars.helper('pluralize', function (singular, count) {
		/* From Ember-Data */
		var inflector = Ember.Inflector.inflector;

		return count === 1 ? singular : inflector.pluralize(singular);
	});
})();
