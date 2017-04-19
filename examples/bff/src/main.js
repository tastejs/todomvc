require.config({
	// Define some RequireJS path shortcuts
	paths: {
		text: '../node_modules/requirejs-text/text',
		doT: '../node_modules/dot/doT'
	},
	// Specify BFF as a package. This is needed because BFF modules use relative dependency paths internally
	packages: [{
		name: 'bff',
		location: '../node_modules/bff-lib/dist/dev' // Change to /prod for minified code w/ no error checks
	}]
});

require(['app/view'], function (AppView) {

	'use strict';
	// Create the main app view and attach its DOM element to the document
	document.body.appendChild(new AppView().el);

});
