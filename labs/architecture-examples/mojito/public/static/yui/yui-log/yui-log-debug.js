/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('yui-log', function (Y, NAME) {

/**
 * Provides console log capability and exposes a custom event for
 * console implementations. This module is a `core` YUI module, <a href="../classes/YUI.html#method_log">it's documentation is located under the YUI class</a>.
 *
 * @module yui
 * @submodule yui-log
 */

var INSTANCE = Y,
    LOGEVENT = 'yui:log',
    UNDEFINED = 'undefined',
    LEVELS = { debug: 1,
               info: 1,
               warn: 1,
               error: 1 };

/**
 * If the 'debug' config is true, a 'yui:log' event will be
 * dispatched, which the Console widget and anything else
 * can consume.  If the 'useBrowserConsole' config is true, it will
 * write to the browser console if available.  YUI-specific log
 * messages will only be present in the -debug versions of the
 * JS files.  The build system is supposed to remove log statements
 * from the raw and minified versions of the files.
 *
 * @method log
 * @for YUI
 * @param  {String}  msg  The message to log.
 * @param  {String}  cat  The log category for the message.  Default
 *                        categories are "info", "warn", "error", time".
 *                        Custom categories can be used as well. (opt).
 * @param  {String}  src  The source of the the message (opt).
 * @param  {boolean} silent If true, the log event won't fire.
 * @return {YUI}      YUI instance.
 */
INSTANCE.log = function(msg, cat, src, silent) {
    var bail, excl, incl, m, f,
        Y = INSTANCE,
        c = Y.config,
        publisher = (Y.fire) ? Y : YUI.Env.globalEvents;
    // suppress log message if the config is off or the event stack
    // or the event call stack contains a consumer of the yui:log event
    if (c.debug) {
        // apply source filters
        src = src || "";
        if (typeof src !== "undefined") {
            excl = c.logExclude;
            incl = c.logInclude;
            if (incl && !(src in incl)) {
                bail = 1;
            } else if (incl && (src in incl)) {
                bail = !incl[src];
            } else if (excl && (src in excl)) {
                bail = excl[src];
            }
        }
        if (!bail) {
            if (c.useBrowserConsole) {
                m = (src) ? src + ': ' + msg : msg;
                if (Y.Lang.isFunction(c.logFn)) {
                    c.logFn.call(Y, msg, cat, src);
                } else if (typeof console != UNDEFINED && console.log) {
                    f = (cat && console[cat] && (cat in LEVELS)) ? cat : 'log';
                    console[f](m);
                } else if (typeof opera != UNDEFINED) {
                    opera.postError(m);
                }
            }

            if (publisher && !silent) {

                if (publisher == Y && (!publisher.getEvent(LOGEVENT))) {
                    publisher.publish(LOGEVENT, {
                        broadcast: 2
                    });
                }

                publisher.fire(LOGEVENT, {
                    msg: msg,
                    cat: cat,
                    src: src
                });
            }
        }
    }

    return Y;
};

/**
 * Write a system message.  This message will be preserved in the
 * minified and raw versions of the YUI files, unlike log statements.
 * @method message
 * @for YUI
 * @param  {String}  msg  The message to log.
 * @param  {String}  cat  The log category for the message.  Default
 *                        categories are "info", "warn", "error", time".
 *                        Custom categories can be used as well. (opt).
 * @param  {String}  src  The source of the the message (opt).
 * @param  {boolean} silent If true, the log event won't fire.
 * @return {YUI}      YUI instance.
 */
INSTANCE.message = function() {
    return INSTANCE.log.apply(INSTANCE, arguments);
};


}, '3.7.3', {"requires": ["yui-base"]});
