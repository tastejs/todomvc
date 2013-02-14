/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('yui-later', function (Y, NAME) {

/**
 * Provides a setTimeout/setInterval wrapper. This module is a `core` YUI module, <a href="../classes/YUI.html#method_later">it's documentation is located under the YUI class</a>.
 *
 * @module yui
 * @submodule yui-later
 */

var NO_ARGS = [];

/**
 * Executes the supplied function in the context of the supplied
 * object 'when' milliseconds later.  Executes the function a
 * single time unless periodic is set to true.
 * @for YUI
 * @method later
 * @param when {int} the number of milliseconds to wait until the fn
 * is executed.
 * @param o the context object.
 * @param fn {Function|String} the function to execute or the name of
 * the method in the 'o' object to execute.
 * @param data [Array] data that is provided to the function.  This
 * accepts either a single item or an array.  If an array is provided,
 * the function is executed with one parameter for each array item.
 * If you need to pass a single array parameter, it needs to be wrapped
 * in an array [myarray].
 *
 * Note: native methods in IE may not have the call and apply methods.
 * In this case, it will work, but you are limited to four arguments.
 *
 * @param periodic {boolean} if true, executes continuously at supplied
 * interval until canceled.
 * @return {object} a timer object. Call the cancel() method on this
 * object to stop the timer.
 */
Y.later = function(when, o, fn, data, periodic) {
    when = when || 0;
    data = (!Y.Lang.isUndefined(data)) ? Y.Array(data) : NO_ARGS;
    o = o || Y.config.win || Y;

    var cancelled = false,
        method = (o && Y.Lang.isString(fn)) ? o[fn] : fn,
        wrapper = function() {
            // IE 8- may execute a setInterval callback one last time
            // after clearInterval was called, so in order to preserve
            // the cancel() === no more runny-run, we have to jump through
            // an extra hoop.
            if (!cancelled) {
                if (!method.apply) {
                    method(data[0], data[1], data[2], data[3]);
                } else {
                    method.apply(o, data || NO_ARGS);
                }
            }
        },
        id = (periodic) ? setInterval(wrapper, when) : setTimeout(wrapper, when);

    return {
        id: id,
        interval: periodic,
        cancel: function() {
            cancelled = true;
            if (this.interval) {
                clearInterval(id);
            } else {
                clearTimeout(id);
            }
        }
    };
};

Y.Lang.later = Y.later;



}, '3.7.3', {"requires": ["yui-base"]});
