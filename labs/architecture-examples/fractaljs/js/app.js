/* jshint newcap: false */
/* global F */
(function() {
	'use strict';

	// Your starting point. Enjoy the ride!
	var App = F.App.extend({
		init: function(){
			this.DOM_PARSER = 'bower_components/jquery/dist/jquery.min.js';
			this.TEMPLATE_ENGINE = 'bower_components/hogan/web/builds/3.0.2/hogan-3.0.2.min.js';
			this.PREFIX = {
				component: 'components/',
				template: 'templates/'
			};
			this.REQUIRE_LIST = [ 'js/util.js' ];
		},
	});

	var app = new App();
	app.start();

})();
