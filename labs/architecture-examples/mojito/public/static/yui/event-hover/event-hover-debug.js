/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('event-hover', function (Y, NAME) {

/**
 * Adds support for a "hover" event.  The event provides a convenience wrapper
 * for subscribing separately to mouseenter and mouseleave.  The signature for
 * subscribing to the event is</p>
 *
 * <pre><code>node.on("hover", overFn, outFn);
 * node.delegate("hover", overFn, outFn, ".filterSelector");
 * Y.on("hover", overFn, outFn, ".targetSelector");
 * Y.delegate("hover", overFn, outFn, "#container", ".filterSelector");
 * </code></pre>
 *
 * <p>Additionally, for compatibility with a more typical subscription
 * signature, the following are also supported:</p>
 *
 * <pre><code>Y.on("hover", overFn, ".targetSelector", outFn);
 * Y.delegate("hover", overFn, "#container", outFn, ".filterSelector");
 * </code></pre>
 *
 * @module event
 * @submodule event-hover
 */
var isFunction = Y.Lang.isFunction,
    noop = function () {},
    conf = {
        processArgs: function (args) {
            // Y.delegate('hover', over, out, '#container', '.filter')
            // comes in as ['hover', over, out, '#container', '.filter'], but
            // node.delegate('hover', over, out, '.filter')
            // comes in as ['hover', over, containerEl, out, '.filter']
            var i = isFunction(args[2]) ? 2 : 3;

            return (isFunction(args[i])) ? args.splice(i,1)[0] : noop;
        },

        on: function (node, sub, notifier, filter) {
            var args = (sub.args) ? sub.args.slice() : [];

            args.unshift(null);

            sub._detach = node[(filter) ? "delegate" : "on"]({
                mouseenter: function (e) {
                    e.phase = 'over';
                    notifier.fire(e);
                },
                mouseleave: function (e) {
                    var thisObj = sub.context || this;

                    args[0] = e;

                    e.type = 'hover';
                    e.phase = 'out';
                    sub._extra.apply(thisObj, args);
                }
            }, filter);
        },

        detach: function (node, sub, notifier) {
            sub._detach.detach();
        }
    };

conf.delegate = conf.on;
conf.detachDelegate = conf.detach;

Y.Event.define("hover", conf);


}, '3.7.3', {"requires": ["event-mouseenter"]});
