/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('event-mouseenter', function (Y, NAME) {

/**
 * <p>Adds subscription and delegation support for mouseenter and mouseleave
 * events.  Unlike mouseover and mouseout, these events aren't fired from child
 * elements of a subscribed node.</p>
 *
 * <p>This avoids receiving three mouseover notifications from a setup like</p>
 *
 * <pre><code>div#container > p > a[href]</code></pre>
 *
 * <p>where</p>
 *
 * <pre><code>Y.one('#container').on('mouseover', callback)</code></pre>
 *
 * <p>When the mouse moves over the link, one mouseover event is fired from
 * #container, then when the mouse moves over the p, another mouseover event is
 * fired and bubbles to #container, causing a second notification, and finally
 * when the mouse moves over the link, a third mouseover event is fired and
 * bubbles to #container for a third notification.</p>
 *
 * <p>By contrast, using mouseenter instead of mouseover, the callback would be
 * executed only once when the mouse moves over #container.</p>
 *
 * @module event
 * @submodule event-mouseenter
 */

var domEventProxies = Y.Env.evt.dom_wrappers,
    contains = Y.DOM.contains,
    toArray = Y.Array,
    noop = function () {},

    config = {
        proxyType: "mouseover",
        relProperty: "fromElement",

        _notify: function (e, property, notifier) {
            var el = this._node,
                related = e.relatedTarget || e[property];

            if (el !== related && !contains(el, related)) {
                notifier.fire(new Y.DOMEventFacade(e, el,
                    domEventProxies['event:' + Y.stamp(el) + e.type]));
            }
        },

        on: function (node, sub, notifier) {
            var el = Y.Node.getDOMNode(node),
                args = [
                    this.proxyType,
                    this._notify,
                    el,
                    null,
                    this.relProperty,
                    notifier];

            sub.handle = Y.Event._attach(args, { facade: false });
            // node.on(this.proxyType, notify, null, notifier);
        },

        detach: function (node, sub) {
            sub.handle.detach();
        },

        delegate: function (node, sub, notifier, filter) {
            var el = Y.Node.getDOMNode(node),
                args = [
                    this.proxyType,
                    noop,
                    el,
                    null,
                    notifier
                ];

            sub.handle = Y.Event._attach(args, { facade: false });
            sub.handle.sub.filter = filter;
            sub.handle.sub.relProperty = this.relProperty;
            sub.handle.sub._notify = this._filterNotify;
        },

        _filterNotify: function (thisObj, args, ce) {
            args = args.slice();
            if (this.args) {
                args.push.apply(args, this.args);
            }

            var currentTarget = Y.delegate._applyFilter(this.filter, args, ce),
                related = args[0].relatedTarget || args[0][this.relProperty],
                e, i, len, ret, ct;

            if (currentTarget) {
                currentTarget = toArray(currentTarget);
                
                for (i = 0, len = currentTarget.length && (!e || !e.stopped); i < len; ++i) {
                    ct = currentTarget[0];
                    if (!contains(ct, related)) {
                        if (!e) {
                            e = new Y.DOMEventFacade(args[0], ct, ce);
                            e.container = Y.one(ce.el);
                        }
                        e.currentTarget = Y.one(ct);

                        // TODO: where is notifier? args? this.notifier?
                        ret = args[1].fire(e);

                        if (ret === false) {
                            break;
                        }
                    }
                }
            }

            return ret;
        },

        detachDelegate: function (node, sub) {
            sub.handle.detach();
        }
    };

Y.Event.define("mouseenter", config, true);
Y.Event.define("mouseleave", Y.merge(config, {
    proxyType: "mouseout",
    relProperty: "toElement"
}), true);


}, '3.7.3', {"requires": ["event-synthetic"]});
