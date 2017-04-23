/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */


/*jslint anon:true, sloppy:true, nomen:true, node:true*/


process.chdir(__dirname);


/**
 * @param {object} config The configuration object containing processing params.
 * @param {object} token Token used to identify the application.
 */
module.exports = function(config, token) {
    var app = require('./server.js');

    // Signal the application is ready, providing the token and app references.
    process.emit('application-ready', token, app);
};
