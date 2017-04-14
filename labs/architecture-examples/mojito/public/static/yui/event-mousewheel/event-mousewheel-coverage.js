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
_yuitest_coverage["build/event-mousewheel/event-mousewheel.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/event-mousewheel/event-mousewheel.js",
    code: []
};
_yuitest_coverage["build/event-mousewheel/event-mousewheel.js"].code=["YUI.add('event-mousewheel', function (Y, NAME) {","","/**"," * Adds mousewheel event support"," * @module event"," * @submodule event-mousewheel"," */","var DOM_MOUSE_SCROLL = 'DOMMouseScroll',","    fixArgs = function(args) {","        var a = Y.Array(args, 0, true), target;","        if (Y.UA.gecko) {","            a[0] = DOM_MOUSE_SCROLL;","            target = Y.config.win;","        } else {","            target = Y.config.doc;","        }","","        if (a.length < 3) {","            a[2] = target;","        } else {","            a.splice(2, 0, target);","        }","","        return a;","    };","","/**"," * Mousewheel event.  This listener is automatically attached to the"," * correct target, so one should not be supplied.  Mouse wheel "," * direction and velocity is stored in the 'wheelDelta' field."," * @event mousewheel"," * @param type {string} 'mousewheel'"," * @param fn {function} the callback to execute"," * @param context optional context object"," * @param args 0..n additional arguments to provide to the listener."," * @return {EventHandle} the detach handle"," * @for YUI"," */","Y.Env.evt.plugins.mousewheel = {","    on: function() {","        return Y.Event._attach(fixArgs(arguments));","    },","","    detach: function() {","        return Y.Event.detach.apply(Y.Event, fixArgs(arguments));","    }","};","","","}, '3.7.3', {\"requires\": [\"node-base\"]});"];
_yuitest_coverage["build/event-mousewheel/event-mousewheel.js"].lines = {"1":0,"8":0,"10":0,"11":0,"12":0,"13":0,"15":0,"18":0,"19":0,"21":0,"24":0,"39":0,"41":0,"45":0};
_yuitest_coverage["build/event-mousewheel/event-mousewheel.js"].functions = {"fixArgs:9":0,"on:40":0,"detach:44":0,"(anonymous 1):1":0};
_yuitest_coverage["build/event-mousewheel/event-mousewheel.js"].coveredLines = 14;
_yuitest_coverage["build/event-mousewheel/event-mousewheel.js"].coveredFunctions = 4;
_yuitest_coverline("build/event-mousewheel/event-mousewheel.js", 1);
YUI.add('event-mousewheel', function (Y, NAME) {

/**
 * Adds mousewheel event support
 * @module event
 * @submodule event-mousewheel
 */
_yuitest_coverfunc("build/event-mousewheel/event-mousewheel.js", "(anonymous 1)", 1);
_yuitest_coverline("build/event-mousewheel/event-mousewheel.js", 8);
var DOM_MOUSE_SCROLL = 'DOMMouseScroll',
    fixArgs = function(args) {
        _yuitest_coverfunc("build/event-mousewheel/event-mousewheel.js", "fixArgs", 9);
_yuitest_coverline("build/event-mousewheel/event-mousewheel.js", 10);
var a = Y.Array(args, 0, true), target;
        _yuitest_coverline("build/event-mousewheel/event-mousewheel.js", 11);
if (Y.UA.gecko) {
            _yuitest_coverline("build/event-mousewheel/event-mousewheel.js", 12);
a[0] = DOM_MOUSE_SCROLL;
            _yuitest_coverline("build/event-mousewheel/event-mousewheel.js", 13);
target = Y.config.win;
        } else {
            _yuitest_coverline("build/event-mousewheel/event-mousewheel.js", 15);
target = Y.config.doc;
        }

        _yuitest_coverline("build/event-mousewheel/event-mousewheel.js", 18);
if (a.length < 3) {
            _yuitest_coverline("build/event-mousewheel/event-mousewheel.js", 19);
a[2] = target;
        } else {
            _yuitest_coverline("build/event-mousewheel/event-mousewheel.js", 21);
a.splice(2, 0, target);
        }

        _yuitest_coverline("build/event-mousewheel/event-mousewheel.js", 24);
return a;
    };

/**
 * Mousewheel event.  This listener is automatically attached to the
 * correct target, so one should not be supplied.  Mouse wheel 
 * direction and velocity is stored in the 'wheelDelta' field.
 * @event mousewheel
 * @param type {string} 'mousewheel'
 * @param fn {function} the callback to execute
 * @param context optional context object
 * @param args 0..n additional arguments to provide to the listener.
 * @return {EventHandle} the detach handle
 * @for YUI
 */
_yuitest_coverline("build/event-mousewheel/event-mousewheel.js", 39);
Y.Env.evt.plugins.mousewheel = {
    on: function() {
        _yuitest_coverfunc("build/event-mousewheel/event-mousewheel.js", "on", 40);
_yuitest_coverline("build/event-mousewheel/event-mousewheel.js", 41);
return Y.Event._attach(fixArgs(arguments));
    },

    detach: function() {
        _yuitest_coverfunc("build/event-mousewheel/event-mousewheel.js", "detach", 44);
_yuitest_coverline("build/event-mousewheel/event-mousewheel.js", 45);
return Y.Event.detach.apply(Y.Event, fixArgs(arguments));
    }
};


}, '3.7.3', {"requires": ["node-base"]});
