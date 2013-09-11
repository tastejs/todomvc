/*global Epitome, App */
/*jshint mootools:true */
(function (window) {
	'use strict';

	window.App = window.App || {};

	App.Router = new Class({

		Extends: Epitome.Router,

		showActiveFilter: function () {
			// fix up the links for current filter
			var self = this;
			document.getElements('#filters li a').each(function (link) {
				link.set('class', link.get('href') === self.req ? 'selected' : '');
			});
		}
	});


})(window);
