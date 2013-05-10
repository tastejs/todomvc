/** @license MIT License (c) copyright B Cavalier & J Hann */

/**
 * timed.js
 *
 * Helper group that aggregates all time & delay related helpers.  If you
 * use several of these helpers it can be more convenient to use this module
 * instead of the individual helpers
 *
 * @author brian@hovercraftstudios.com
 */

(function(define) {
define(function(require) {

	var timeout, delay;

	timeout = require('./timeout');
	delay = require('./delay');

    return {
        timeout: timeout,
        delay: delay
    };

});
})(
	typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); }
	// Boilerplate for AMD and Node
);


