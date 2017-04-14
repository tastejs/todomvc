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
_yuitest_coverage["build/event-hover/event-hover.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/event-hover/event-hover.js",
    code: []
};
_yuitest_coverage["build/event-hover/event-hover.js"].code=["YUI.add('event-hover', function (Y, NAME) {","","/**"," * Adds support for a \"hover\" event.  The event provides a convenience wrapper"," * for subscribing separately to mouseenter and mouseleave.  The signature for"," * subscribing to the event is</p>"," *"," * <pre><code>node.on(\"hover\", overFn, outFn);"," * node.delegate(\"hover\", overFn, outFn, \".filterSelector\");"," * Y.on(\"hover\", overFn, outFn, \".targetSelector\");"," * Y.delegate(\"hover\", overFn, outFn, \"#container\", \".filterSelector\");"," * </code></pre>"," *"," * <p>Additionally, for compatibility with a more typical subscription"," * signature, the following are also supported:</p>"," *"," * <pre><code>Y.on(\"hover\", overFn, \".targetSelector\", outFn);"," * Y.delegate(\"hover\", overFn, \"#container\", outFn, \".filterSelector\");"," * </code></pre>"," *"," * @module event"," * @submodule event-hover"," */","var isFunction = Y.Lang.isFunction,","    noop = function () {},","    conf = {","        processArgs: function (args) {","            // Y.delegate('hover', over, out, '#container', '.filter')","            // comes in as ['hover', over, out, '#container', '.filter'], but","            // node.delegate('hover', over, out, '.filter')","            // comes in as ['hover', over, containerEl, out, '.filter']","            var i = isFunction(args[2]) ? 2 : 3;","","            return (isFunction(args[i])) ? args.splice(i,1)[0] : noop;","        },","","        on: function (node, sub, notifier, filter) {","            var args = (sub.args) ? sub.args.slice() : [];","","            args.unshift(null);","","            sub._detach = node[(filter) ? \"delegate\" : \"on\"]({","                mouseenter: function (e) {","                    e.phase = 'over';","                    notifier.fire(e);","                },","                mouseleave: function (e) {","                    var thisObj = sub.context || this;","","                    args[0] = e;","","                    e.type = 'hover';","                    e.phase = 'out';","                    sub._extra.apply(thisObj, args);","                }","            }, filter);","        },","","        detach: function (node, sub, notifier) {","            sub._detach.detach();","        }","    };","","conf.delegate = conf.on;","conf.detachDelegate = conf.detach;","","Y.Event.define(\"hover\", conf);","","","}, '3.7.3', {\"requires\": [\"event-mouseenter\"]});"];
_yuitest_coverage["build/event-hover/event-hover.js"].lines = {"1":0,"24":0,"32":0,"34":0,"38":0,"40":0,"42":0,"44":0,"45":0,"48":0,"50":0,"52":0,"53":0,"54":0,"60":0,"64":0,"65":0,"67":0};
_yuitest_coverage["build/event-hover/event-hover.js"].functions = {"processArgs:27":0,"mouseenter:43":0,"mouseleave:47":0,"on:37":0,"detach:59":0,"(anonymous 1):1":0};
_yuitest_coverage["build/event-hover/event-hover.js"].coveredLines = 18;
_yuitest_coverage["build/event-hover/event-hover.js"].coveredFunctions = 6;
_yuitest_coverline("build/event-hover/event-hover.js", 1);
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
_yuitest_coverfunc("build/event-hover/event-hover.js", "(anonymous 1)", 1);
_yuitest_coverline("build/event-hover/event-hover.js", 24);
var isFunction = Y.Lang.isFunction,
    noop = function () {},
    conf = {
        processArgs: function (args) {
            // Y.delegate('hover', over, out, '#container', '.filter')
            // comes in as ['hover', over, out, '#container', '.filter'], but
            // node.delegate('hover', over, out, '.filter')
            // comes in as ['hover', over, containerEl, out, '.filter']
            _yuitest_coverfunc("build/event-hover/event-hover.js", "processArgs", 27);
_yuitest_coverline("build/event-hover/event-hover.js", 32);
var i = isFunction(args[2]) ? 2 : 3;

            _yuitest_coverline("build/event-hover/event-hover.js", 34);
return (isFunction(args[i])) ? args.splice(i,1)[0] : noop;
        },

        on: function (node, sub, notifier, filter) {
            _yuitest_coverfunc("build/event-hover/event-hover.js", "on", 37);
_yuitest_coverline("build/event-hover/event-hover.js", 38);
var args = (sub.args) ? sub.args.slice() : [];

            _yuitest_coverline("build/event-hover/event-hover.js", 40);
args.unshift(null);

            _yuitest_coverline("build/event-hover/event-hover.js", 42);
sub._detach = node[(filter) ? "delegate" : "on"]({
                mouseenter: function (e) {
                    _yuitest_coverfunc("build/event-hover/event-hover.js", "mouseenter", 43);
_yuitest_coverline("build/event-hover/event-hover.js", 44);
e.phase = 'over';
                    _yuitest_coverline("build/event-hover/event-hover.js", 45);
notifier.fire(e);
                },
                mouseleave: function (e) {
                    _yuitest_coverfunc("build/event-hover/event-hover.js", "mouseleave", 47);
_yuitest_coverline("build/event-hover/event-hover.js", 48);
var thisObj = sub.context || this;

                    _yuitest_coverline("build/event-hover/event-hover.js", 50);
args[0] = e;

                    _yuitest_coverline("build/event-hover/event-hover.js", 52);
e.type = 'hover';
                    _yuitest_coverline("build/event-hover/event-hover.js", 53);
e.phase = 'out';
                    _yuitest_coverline("build/event-hover/event-hover.js", 54);
sub._extra.apply(thisObj, args);
                }
            }, filter);
        },

        detach: function (node, sub, notifier) {
            _yuitest_coverfunc("build/event-hover/event-hover.js", "detach", 59);
_yuitest_coverline("build/event-hover/event-hover.js", 60);
sub._detach.detach();
        }
    };

_yuitest_coverline("build/event-hover/event-hover.js", 64);
conf.delegate = conf.on;
_yuitest_coverline("build/event-hover/event-hover.js", 65);
conf.detachDelegate = conf.detach;

_yuitest_coverline("build/event-hover/event-hover.js", 67);
Y.Event.define("hover", conf);


}, '3.7.3', {"requires": ["event-mouseenter"]});
