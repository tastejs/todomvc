/*global KISSY */
(function () {
	'use strict';

	// Your starting point. Enjoy the ride!

	KISSY.config({
		packages: [{
			name: 'app',
			path: 'js',
			debug: true
		}]
	});

	KISSY.use('magix/magix', function (S, Magix) {
		Magix.start({
			iniFile: 'app/ini',
			rootId: 'todoapp',
			execError: function (e) { throw e; }
		});
	});
})(window);
