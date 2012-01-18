/**
 * curl debug plugin
 *
 * (c) copyright 2011, unscriptable.com / John Hann
 * Licensed under the MIT License at:
 * 		http://www.opensource.org/licenses/mit-license.php
 *
 * usage:
 *  curl({ debug: true }, ['curl/debug']).next(['other/modules'], function (otherModules) {
 * 		// do stuff while logging debug messages
 * 	});
 *
 * The debug module must be used in conjunction with the debug: true config param!
 *
 */
(function (global) {

define(['require'], function (require) {

	var curl, cache, totalWaiting, prevTotal;

	curl = require['curl'];

	if (!curl) {
		throw new Error('You must also enable debugging via the debug:true config param.');
	}
	else if (typeof console == 'undefined') {
		throw new Error('`console` object must be defined to use debug module.');
	}
	else {

		cache = curl['cache'];
		totalWaiting = 0;

		function count () {
			totalWaiting = 0;
			for (var p in cache) {
				if ('resolved' in cache[p]) totalWaiting++;
			}
		}
		count();

		function periodicLogger () {
			count();
			if (prevTotal != totalWaiting) {
				console.log('curl: ********** modules waiting: ' + totalWaiting);
			}
			prevTotal = totalWaiting;
			setTimeout(periodicLogger, 500);
		}
		periodicLogger();

	}

});

}(this));
