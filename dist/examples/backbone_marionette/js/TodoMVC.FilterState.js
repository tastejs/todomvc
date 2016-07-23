/*global Backbone */

// This file acts as a Service, providing
// the rest of the app access to the filter state
// as needed, without them needing to know the implementation
// details
(function () {
	'use strict';
	var filterState = new Backbone.Model({
		filter: 'all'
	});

	var filterChannel = Backbone.Radio.channel('filter');
	filterChannel.reply('filterState', function () {
		return filterState;
	});
})();
