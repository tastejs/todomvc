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
_yuitest_coverage["build/event-outside/event-outside.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/event-outside/event-outside.js",
    code: []
};
_yuitest_coverage["build/event-outside/event-outside.js"].code=["YUI.add('event-outside', function (Y, NAME) {","","/**"," * Outside events are synthetic DOM events that fire when a corresponding native"," * or synthetic DOM event occurs outside a bound element."," *"," * The following outside events are pre-defined by this module:"," * <ul>"," *   <li>blur</li>"," *   <li>change</li>"," *   <li>click</li>"," *   <li>dblclick</li>"," *   <li>focus</li>"," *   <li>keydown</li>"," *   <li>keypress</li>"," *   <li>keyup</li>"," *   <li>mousedown</li>"," *   <li>mousemove</li>"," *   <li>mouseout</li>"," *   <li>mouseover</li>"," *   <li>mouseup</li>"," *   <li>select</li>"," *   <li>submit</li>"," * </ul>"," *"," * Define new outside events with"," * <code>Y.Event.defineOutside(eventType);</code>."," * By default, the created synthetic event name will be the name of the event"," * with \"outside\" appended (e.g. \"click\" becomes \"clickoutside\"). If you want"," * a different name for the created Event, pass it as a second argument like so:"," * <code>Y.Event.defineOutside(eventType, \"yonderclick\")</code>."," *"," * This module was contributed by Brett Stimmerman, promoted from his"," * gallery-outside-events module at"," * http://yuilibrary.com/gallery/show/outside-events"," *"," * @module event"," * @submodule event-outside"," * @author brettstimmerman"," * @since 3.4.0"," */","","// Outside events are pre-defined for each of these native DOM events","var nativeEvents = [","        'blur', 'change', 'click', 'dblclick', 'focus', 'keydown', 'keypress',","        'keyup', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup',","        'select', 'submit'","    ];","","/**"," * Defines a new outside event to correspond with the given DOM event."," *"," * By default, the created synthetic event name will be the name of the event"," * with \"outside\" appended (e.g. \"click\" becomes \"clickoutside\"). If you want"," * a different name for the created Event, pass it as a second argument like so:"," * <code>Y.Event.defineOutside(eventType, \"yonderclick\")</code>."," *"," * @method defineOutside"," * @param {String} event DOM event"," * @param {String} name (optional) custom outside event name"," * @static"," * @for Event"," */","Y.Event.defineOutside = function (event, name) {","    name = name || (event + 'outside');","","    var config = {","    ","        on: function (node, sub, notifier) {","            sub.handle = Y.one('doc').on(event, function(e) {","                if (this.isOutside(node, e.target)) {","                    e.currentTarget = node;","                    notifier.fire(e);","                }","            }, this);","        },","        ","        detach: function (node, sub, notifier) {","            sub.handle.detach();","        },","        ","        delegate: function (node, sub, notifier, filter) {","            sub.handle = Y.one('doc').delegate(event, function (e) {","                if (this.isOutside(node, e.target)) {","                    notifier.fire(e);","                }","            }, filter, this);","        },","        ","        isOutside: function (node, target) {","            return target !== node && !target.ancestor(function (p) {","                    return p === node;","                });","        }","    };","    config.detachDelegate = config.detach;","","    Y.Event.define(name, config);","};","","// Define outside events for some common native DOM events","Y.Array.each(nativeEvents, function (event) {","    Y.Event.defineOutside(event);","});","","","}, '3.7.3', {\"requires\": [\"event-synthetic\"]});"];
_yuitest_coverage["build/event-outside/event-outside.js"].lines = {"1":0,"44":0,"64":0,"65":0,"67":0,"70":0,"71":0,"72":0,"73":0,"79":0,"83":0,"84":0,"85":0,"91":0,"92":0,"96":0,"98":0,"102":0,"103":0};
_yuitest_coverage["build/event-outside/event-outside.js"].functions = {"(anonymous 2):70":0,"on:69":0,"detach:78":0,"(anonymous 3):83":0,"delegate:82":0,"(anonymous 4):91":0,"isOutside:90":0,"defineOutside:64":0,"(anonymous 5):102":0,"(anonymous 1):1":0};
_yuitest_coverage["build/event-outside/event-outside.js"].coveredLines = 19;
_yuitest_coverage["build/event-outside/event-outside.js"].coveredFunctions = 10;
_yuitest_coverline("build/event-outside/event-outside.js", 1);
YUI.add('event-outside', function (Y, NAME) {

/**
 * Outside events are synthetic DOM events that fire when a corresponding native
 * or synthetic DOM event occurs outside a bound element.
 *
 * The following outside events are pre-defined by this module:
 * <ul>
 *   <li>blur</li>
 *   <li>change</li>
 *   <li>click</li>
 *   <li>dblclick</li>
 *   <li>focus</li>
 *   <li>keydown</li>
 *   <li>keypress</li>
 *   <li>keyup</li>
 *   <li>mousedown</li>
 *   <li>mousemove</li>
 *   <li>mouseout</li>
 *   <li>mouseover</li>
 *   <li>mouseup</li>
 *   <li>select</li>
 *   <li>submit</li>
 * </ul>
 *
 * Define new outside events with
 * <code>Y.Event.defineOutside(eventType);</code>.
 * By default, the created synthetic event name will be the name of the event
 * with "outside" appended (e.g. "click" becomes "clickoutside"). If you want
 * a different name for the created Event, pass it as a second argument like so:
 * <code>Y.Event.defineOutside(eventType, "yonderclick")</code>.
 *
 * This module was contributed by Brett Stimmerman, promoted from his
 * gallery-outside-events module at
 * http://yuilibrary.com/gallery/show/outside-events
 *
 * @module event
 * @submodule event-outside
 * @author brettstimmerman
 * @since 3.4.0
 */

// Outside events are pre-defined for each of these native DOM events
_yuitest_coverfunc("build/event-outside/event-outside.js", "(anonymous 1)", 1);
_yuitest_coverline("build/event-outside/event-outside.js", 44);
var nativeEvents = [
        'blur', 'change', 'click', 'dblclick', 'focus', 'keydown', 'keypress',
        'keyup', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup',
        'select', 'submit'
    ];

/**
 * Defines a new outside event to correspond with the given DOM event.
 *
 * By default, the created synthetic event name will be the name of the event
 * with "outside" appended (e.g. "click" becomes "clickoutside"). If you want
 * a different name for the created Event, pass it as a second argument like so:
 * <code>Y.Event.defineOutside(eventType, "yonderclick")</code>.
 *
 * @method defineOutside
 * @param {String} event DOM event
 * @param {String} name (optional) custom outside event name
 * @static
 * @for Event
 */
_yuitest_coverline("build/event-outside/event-outside.js", 64);
Y.Event.defineOutside = function (event, name) {
    _yuitest_coverfunc("build/event-outside/event-outside.js", "defineOutside", 64);
_yuitest_coverline("build/event-outside/event-outside.js", 65);
name = name || (event + 'outside');

    _yuitest_coverline("build/event-outside/event-outside.js", 67);
var config = {
    
        on: function (node, sub, notifier) {
            _yuitest_coverfunc("build/event-outside/event-outside.js", "on", 69);
_yuitest_coverline("build/event-outside/event-outside.js", 70);
sub.handle = Y.one('doc').on(event, function(e) {
                _yuitest_coverfunc("build/event-outside/event-outside.js", "(anonymous 2)", 70);
_yuitest_coverline("build/event-outside/event-outside.js", 71);
if (this.isOutside(node, e.target)) {
                    _yuitest_coverline("build/event-outside/event-outside.js", 72);
e.currentTarget = node;
                    _yuitest_coverline("build/event-outside/event-outside.js", 73);
notifier.fire(e);
                }
            }, this);
        },
        
        detach: function (node, sub, notifier) {
            _yuitest_coverfunc("build/event-outside/event-outside.js", "detach", 78);
_yuitest_coverline("build/event-outside/event-outside.js", 79);
sub.handle.detach();
        },
        
        delegate: function (node, sub, notifier, filter) {
            _yuitest_coverfunc("build/event-outside/event-outside.js", "delegate", 82);
_yuitest_coverline("build/event-outside/event-outside.js", 83);
sub.handle = Y.one('doc').delegate(event, function (e) {
                _yuitest_coverfunc("build/event-outside/event-outside.js", "(anonymous 3)", 83);
_yuitest_coverline("build/event-outside/event-outside.js", 84);
if (this.isOutside(node, e.target)) {
                    _yuitest_coverline("build/event-outside/event-outside.js", 85);
notifier.fire(e);
                }
            }, filter, this);
        },
        
        isOutside: function (node, target) {
            _yuitest_coverfunc("build/event-outside/event-outside.js", "isOutside", 90);
_yuitest_coverline("build/event-outside/event-outside.js", 91);
return target !== node && !target.ancestor(function (p) {
                    _yuitest_coverfunc("build/event-outside/event-outside.js", "(anonymous 4)", 91);
_yuitest_coverline("build/event-outside/event-outside.js", 92);
return p === node;
                });
        }
    };
    _yuitest_coverline("build/event-outside/event-outside.js", 96);
config.detachDelegate = config.detach;

    _yuitest_coverline("build/event-outside/event-outside.js", 98);
Y.Event.define(name, config);
};

// Define outside events for some common native DOM events
_yuitest_coverline("build/event-outside/event-outside.js", 102);
Y.Array.each(nativeEvents, function (event) {
    _yuitest_coverfunc("build/event-outside/event-outside.js", "(anonymous 5)", 102);
_yuitest_coverline("build/event-outside/event-outside.js", 103);
Y.Event.defineOutside(event);
});


}, '3.7.3', {"requires": ["event-synthetic"]});
