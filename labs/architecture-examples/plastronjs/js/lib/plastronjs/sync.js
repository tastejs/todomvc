//     (c) 2012 Rhys Brett-Bowen, Catch.com
//     goog.mvc may be freely distributed under the MIT license.
//     For all details and documentation:
//     https://github.com/rhysbrettbowen/goog.mvc

goog.provide('mvc.Sync');



/**
 * Sync object used to communicate between model and source
 *
 * @interface
 */
mvc.Sync = function() {};


/*
This can be used for HTTP status

mvc.Sync.Status = {
    // Successful
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    // Client Error
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    PAYMENT: 402,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    NOT_ACCEPTABLE: 406,
    REQUEST_TIMEOUT: 408,
    CONFLICT: 409,
    GONE: 410,
    // Server Error
    INTERNAL_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    BAD_GATEWAY: 502,
    GATEWAY_TIMEOUT: 504
}*/


/**
 * take in the model to push to server (use .toJson())
 * and call callback when done
 * pass in the json and status (use HTTP status codes) as a number.
 *
 * @param {mvc.Model} model to create.
 * @param {function(Object, number)=} opt_callback optional.
 */
mvc.Sync.prototype.create = function(model, opt_callback) {};


/**
 * take in the model to push to server (use .toJson())
 * and call callback when done
 * pass in the json and status (use HTTP status codes) as a number.
 *
 * @param {mvc.Model} model to refresh.
 * @param {function(Object, number)=} opt_callback optional.
 */
mvc.Sync.prototype.read = function(model, opt_callback) {};


/**
 * take in the model to push to server (use .toJson())
 * and call callback when done
 * pass in the json and status (use HTTP status codes) as a number.
 *
 * @param {mvc.Model} model to update.
 * @param {function(Object, number)=} opt_callback optional.
 */
mvc.Sync.prototype.update = function(model, opt_callback) {};


/**
 * take in the model to push to server (use .toJson())
 * and call callback when done
 * pass in the status (use HTTP status codes) as a number.
 *
 * @param {mvc.Model} model to delete.
 * @param {Function=} opt_callback optional.
 */
mvc.Sync.prototype.del = function(model, opt_callback) {};
