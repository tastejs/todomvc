/*global window, RSVP, rJS, loopEventListener */
/*jshint unused:false */
(function(window, RSVP, rJS, loopEventListener) {
	'use strict';


	// Get the appropriate query for allDocs() based on the given hash.
	function getQueryFromHash(hash) {
		switch (hash) {
			case '#/active':
				return 'completed: "false"';
			case '#/completed':
				return 'completed: "true"';
			default:
				return '';
		}
	}

	rJS(window)

		// Initialize the gadget as soon as it is loaded in memory,
		// blocking all other methods in itself and its ancestors.
		.ready(function() {
			var gadget = this;
			return gadget.setQuery(getQueryFromHash(window.location.hash));
		})

		// Initialize the gadget as soon as it is loaded in the DOM,
		// but only after ready() has finished and stopped blocking.
		.declareService(function() {
			var gadget = this;
			return loopEventListener(window, 'hashchange', false,
				function() {
					return gadget.setQuery(
						getQueryFromHash(window.location.hash)
					);
				});
		}, false)


		// Declare an acquired method from the parent gadget to use it.
		.declareAcquiredMethod('setQuery', 'setQuery');

}(window, RSVP, rJS, loopEventListener));
