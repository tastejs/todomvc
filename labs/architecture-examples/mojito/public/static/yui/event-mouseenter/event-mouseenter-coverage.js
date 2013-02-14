/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/event-mouseenter/event-mouseenter.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/event-mouseenter/event-mouseenter.js",
    code: []
};
_yuitest_coverage["build/event-mouseenter/event-mouseenter.js"].code=["YUI.add('event-mouseenter', function (Y, NAME) {","","/**"," * <p>Adds subscription and delegation support for mouseenter and mouseleave"," * events.  Unlike mouseover and mouseout, these events aren't fired from child"," * elements of a subscribed node.</p>"," *"," * <p>This avoids receiving three mouseover notifications from a setup like</p>"," *"," * <pre><code>div#container > p > a[href]</code></pre>"," *"," * <p>where</p>"," *"," * <pre><code>Y.one('#container').on('mouseover', callback)</code></pre>"," *"," * <p>When the mouse moves over the link, one mouseover event is fired from"," * #container, then when the mouse moves over the p, another mouseover event is"," * fired and bubbles to #container, causing a second notification, and finally"," * when the mouse moves over the link, a third mouseover event is fired and"," * bubbles to #container for a third notification.</p>"," *"," * <p>By contrast, using mouseenter instead of mouseover, the callback would be"," * executed only once when the mouse moves over #container.</p>"," *"," * @module event"," * @submodule event-mouseenter"," */","","var domEventProxies = Y.Env.evt.dom_wrappers,","    contains = Y.DOM.contains,","    toArray = Y.Array,","    noop = function () {},","","    config = {","        proxyType: \"mouseover\",","        relProperty: \"fromElement\",","","        _notify: function (e, property, notifier) {","            var el = this._node,","                related = e.relatedTarget || e[property];","","            if (el !== related && !contains(el, related)) {","                notifier.fire(new Y.DOMEventFacade(e, el,","                    domEventProxies['event:' + Y.stamp(el) + e.type]));","            }","        },","","        on: function (node, sub, notifier) {","            var el = Y.Node.getDOMNode(node),","                args = [","                    this.proxyType,","                    this._notify,","                    el,","                    null,","                    this.relProperty,","                    notifier];","","            sub.handle = Y.Event._attach(args, { facade: false });","            // node.on(this.proxyType, notify, null, notifier);","        },","","        detach: function (node, sub) {","            sub.handle.detach();","        },","","        delegate: function (node, sub, notifier, filter) {","            var el = Y.Node.getDOMNode(node),","                args = [","                    this.proxyType,","                    noop,","                    el,","                    null,","                    notifier","                ];","","            sub.handle = Y.Event._attach(args, { facade: false });","            sub.handle.sub.filter = filter;","            sub.handle.sub.relProperty = this.relProperty;","            sub.handle.sub._notify = this._filterNotify;","        },","","        _filterNotify: function (thisObj, args, ce) {","            args = args.slice();","            if (this.args) {","                args.push.apply(args, this.args);","            }","","            var currentTarget = Y.delegate._applyFilter(this.filter, args, ce),","                related = args[0].relatedTarget || args[0][this.relProperty],","                e, i, len, ret, ct;","","            if (currentTarget) {","                currentTarget = toArray(currentTarget);","                ","                for (i = 0, len = currentTarget.length && (!e || !e.stopped); i < len; ++i) {","                    ct = currentTarget[0];","                    if (!contains(ct, related)) {","                        if (!e) {","                            e = new Y.DOMEventFacade(args[0], ct, ce);","                            e.container = Y.one(ce.el);","                        }","                        e.currentTarget = Y.one(ct);","","                        // TODO: where is notifier? args? this.notifier?","                        ret = args[1].fire(e);","","                        if (ret === false) {","                            break;","                        }","                    }","                }","            }","","            return ret;","        },","","        detachDelegate: function (node, sub) {","            sub.handle.detach();","        }","    };","","Y.Event.define(\"mouseenter\", config, true);","Y.Event.define(\"mouseleave\", Y.merge(config, {","    proxyType: \"mouseout\",","    relProperty: \"toElement\"","}), true);","","","}, '3.7.3', {\"requires\": [\"event-synthetic\"]});"];
_yuitest_coverage["build/event-mouseenter/event-mouseenter.js"].lines = {"1":0,"29":0,"39":0,"42":0,"43":0,"49":0,"58":0,"63":0,"67":0,"76":0,"77":0,"78":0,"79":0,"83":0,"84":0,"85":0,"88":0,"92":0,"93":0,"95":0,"96":0,"97":0,"98":0,"99":0,"100":0,"102":0,"105":0,"107":0,"108":0,"114":0,"118":0,"122":0,"123":0};
_yuitest_coverage["build/event-mouseenter/event-mouseenter.js"].functions = {"_notify:38":0,"on:48":0,"detach:62":0,"delegate:66":0,"_filterNotify:82":0,"detachDelegate:117":0,"(anonymous 1):1":0};
_yuitest_coverage["build/event-mouseenter/event-mouseenter.js"].coveredLines = 33;
_yuitest_coverage["build/event-mouseenter/event-mouseenter.js"].coveredFunctions = 7;
_yuitest_coverline("build/event-mouseenter/event-mouseenter.js", 1);
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

_yuitest_coverfunc("build/event-mouseenter/event-mouseenter.js", "(anonymous 1)", 1);
_yuitest_coverline("build/event-mouseenter/event-mouseenter.js", 29);
var domEventProxies = Y.Env.evt.dom_wrappers,
    contains = Y.DOM.contains,
    toArray = Y.Array,
    noop = function () {},

    config = {
        proxyType: "mouseover",
        relProperty: "fromElement",

        _notify: function (e, property, notifier) {
            _yuitest_coverfunc("build/event-mouseenter/event-mouseenter.js", "_notify", 38);
_yuitest_coverline("build/event-mouseenter/event-mouseenter.js", 39);
var el = this._node,
                related = e.relatedTarget || e[property];

            _yuitest_coverline("build/event-mouseenter/event-mouseenter.js", 42);
if (el !== related && !contains(el, related)) {
                _yuitest_coverline("build/event-mouseenter/event-mouseenter.js", 43);
notifier.fire(new Y.DOMEventFacade(e, el,
                    domEventProxies['event:' + Y.stamp(el) + e.type]));
            }
        },

        on: function (node, sub, notifier) {
            _yuitest_coverfunc("build/event-mouseenter/event-mouseenter.js", "on", 48);
_yuitest_coverline("build/event-mouseenter/event-mouseenter.js", 49);
var el = Y.Node.getDOMNode(node),
                args = [
                    this.proxyType,
                    this._notify,
                    el,
                    null,
                    this.relProperty,
                    notifier];

            _yuitest_coverline("build/event-mouseenter/event-mouseenter.js", 58);
sub.handle = Y.Event._attach(args, { facade: false });
            // node.on(this.proxyType, notify, null, notifier);
        },

        detach: function (node, sub) {
            _yuitest_coverfunc("build/event-mouseenter/event-mouseenter.js", "detach", 62);
_yuitest_coverline("build/event-mouseenter/event-mouseenter.js", 63);
sub.handle.detach();
        },

        delegate: function (node, sub, notifier, filter) {
            _yuitest_coverfunc("build/event-mouseenter/event-mouseenter.js", "delegate", 66);
_yuitest_coverline("build/event-mouseenter/event-mouseenter.js", 67);
var el = Y.Node.getDOMNode(node),
                args = [
                    this.proxyType,
                    noop,
                    el,
                    null,
                    notifier
                ];

            _yuitest_coverline("build/event-mouseenter/event-mouseenter.js", 76);
sub.handle = Y.Event._attach(args, { facade: false });
            _yuitest_coverline("build/event-mouseenter/event-mouseenter.js", 77);
sub.handle.sub.filter = filter;
            _yuitest_coverline("build/event-mouseenter/event-mouseenter.js", 78);
sub.handle.sub.relProperty = this.relProperty;
            _yuitest_coverline("build/event-mouseenter/event-mouseenter.js", 79);
sub.handle.sub._notify = this._filterNotify;
        },

        _filterNotify: function (thisObj, args, ce) {
            _yuitest_coverfunc("build/event-mouseenter/event-mouseenter.js", "_filterNotify", 82);
_yuitest_coverline("build/event-mouseenter/event-mouseenter.js", 83);
args = args.slice();
            _yuitest_coverline("build/event-mouseenter/event-mouseenter.js", 84);
if (this.args) {
                _yuitest_coverline("build/event-mouseenter/event-mouseenter.js", 85);
args.push.apply(args, this.args);
            }

            _yuitest_coverline("build/event-mouseenter/event-mouseenter.js", 88);
var currentTarget = Y.delegate._applyFilter(this.filter, args, ce),
                related = args[0].relatedTarget || args[0][this.relProperty],
                e, i, len, ret, ct;

            _yuitest_coverline("build/event-mouseenter/event-mouseenter.js", 92);
if (currentTarget) {
                _yuitest_coverline("build/event-mouseenter/event-mouseenter.js", 93);
currentTarget = toArray(currentTarget);
                
                _yuitest_coverline("build/event-mouseenter/event-mouseenter.js", 95);
for (i = 0, len = currentTarget.length && (!e || !e.stopped); i < len; ++i) {
                    _yuitest_coverline("build/event-mouseenter/event-mouseenter.js", 96);
ct = currentTarget[0];
                    _yuitest_coverline("build/event-mouseenter/event-mouseenter.js", 97);
if (!contains(ct, related)) {
                        _yuitest_coverline("build/event-mouseenter/event-mouseenter.js", 98);
if (!e) {
                            _yuitest_coverline("build/event-mouseenter/event-mouseenter.js", 99);
e = new Y.DOMEventFacade(args[0], ct, ce);
                            _yuitest_coverline("build/event-mouseenter/event-mouseenter.js", 100);
e.container = Y.one(ce.el);
                        }
                        _yuitest_coverline("build/event-mouseenter/event-mouseenter.js", 102);
e.currentTarget = Y.one(ct);

                        // TODO: where is notifier? args? this.notifier?
                        _yuitest_coverline("build/event-mouseenter/event-mouseenter.js", 105);
ret = args[1].fire(e);

                        _yuitest_coverline("build/event-mouseenter/event-mouseenter.js", 107);
if (ret === false) {
                            _yuitest_coverline("build/event-mouseenter/event-mouseenter.js", 108);
break;
                        }
                    }
                }
            }

            _yuitest_coverline("build/event-mouseenter/event-mouseenter.js", 114);
return ret;
        },

        detachDelegate: function (node, sub) {
            _yuitest_coverfunc("build/event-mouseenter/event-mouseenter.js", "detachDelegate", 117);
_yuitest_coverline("build/event-mouseenter/event-mouseenter.js", 118);
sub.handle.detach();
        }
    };

_yuitest_coverline("build/event-mouseenter/event-mouseenter.js", 122);
Y.Event.define("mouseenter", config, true);
_yuitest_coverline("build/event-mouseenter/event-mouseenter.js", 123);
Y.Event.define("mouseleave", Y.merge(config, {
    proxyType: "mouseout",
    relProperty: "toElement"
}), true);


}, '3.7.3', {"requires": ["event-synthetic"]});
