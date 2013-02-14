/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */


/*jslint anon:true, sloppy:true*/


/**
 * Returns a new Mojito server instance.
 */
//module.exports = require('mojito').createServer();
var mojito = require('mojito');
new mojito.constructor().createServer().listen(process.env.PORT || 6789, null, function(err) {
	if(err) {
		console.log('Failed to start Mojito...');
		console.log('error: ' + err);
	} else {
		console.log('Server started...');
	}
});
