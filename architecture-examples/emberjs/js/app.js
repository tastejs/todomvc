(function( win ) {
	'use strict';

	win.Todos = Ember.Application.create({
		VERSION: '0.2',
		rootElement: '#todoapp',
		storeNamespace: 'todos-emberjs',
		// Extend to inherit outlet support
		ApplicationController: Ember.Controller.extend(),
	});

})( window );
