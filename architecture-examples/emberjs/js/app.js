(function( win ) {
	'use strict';

	win.Todos = Ember.Application.create({
		VERSION: '1.0',
		rootElement: '#todoapp',
		storeNamespace: 'todos-emberjs',
		// Extend to inherit outlet support
		ApplicationController: Ember.Controller.extend(),
		ready: function() {
			this.initialize();
		}
	});

})( window );
