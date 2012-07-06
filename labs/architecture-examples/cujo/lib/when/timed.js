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
define(['./timeout', './delay'], function(timeout, delay) {

    return {
        timeout: timeout,
        delay: delay
    };

});
})(typeof define == 'function'
    ? define
    : function (deps, factory) { typeof module != 'undefined'
        ? (module.exports = factory.apply(this, deps.map(require)))
        : (this.when_timed = factory(this.when_timeout, this.when_delay));
    }
    // Boilerplate for AMD, Node, and browser global
);


