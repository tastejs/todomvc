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
_yuitest_coverage["build/event-resize/event-resize.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/event-resize/event-resize.js",
    code: []
};
_yuitest_coverage["build/event-resize/event-resize.js"].code=["YUI.add('event-resize', function (Y, NAME) {","","/**"," * Adds a window resize event that has its behavior normalized to fire at the"," * end of the resize rather than constantly during the resize."," * @module event"," * @submodule event-resize"," */","","","/**"," * Old firefox fires the window resize event once when the resize action"," * finishes, other browsers fire the event periodically during the"," * resize.  This code uses timeout logic to simulate the Firefox "," * behavior in other browsers."," * @event windowresize"," * @for YUI"," */","Y.Event.define('windowresize', {","","    on: (Y.UA.gecko && Y.UA.gecko < 1.91) ?","        function (node, sub, notifier) {","            sub._handle = Y.Event.attach('resize', function (e) {","                notifier.fire(e);","            });","        } :","        function (node, sub, notifier) {","            // interval bumped from 40 to 100ms as of 3.4.1","            var delay = Y.config.windowResizeDelay || 100;","","            sub._handle = Y.Event.attach('resize', function (e) {","                if (sub._timer) {","                    sub._timer.cancel();","                }","","                sub._timer = Y.later(delay, Y, function () {","                    notifier.fire(e);","                });","            });","        },","","    detach: function (node, sub) {","        if (sub._timer) {","            sub._timer.cancel();","        }","        sub._handle.detach();","    }","    // delegate methods not defined because this only works for window","    // subscriptions, so...yeah.","});","","","}, '3.7.3', {\"requires\": [\"node-base\", \"event-synthetic\"]});"];
_yuitest_coverage["build/event-resize/event-resize.js"].lines = {"1":0,"19":0,"23":0,"24":0,"29":0,"31":0,"32":0,"33":0,"36":0,"37":0,"43":0,"44":0,"46":0};
_yuitest_coverage["build/event-resize/event-resize.js"].functions = {"(anonymous 3):23":0,"(anonymous 2):22":0,"(anonymous 5):36":0,"(anonymous 4):31":0,"}:27":0,"detach:42":0,"(anonymous 1):1":0};
_yuitest_coverage["build/event-resize/event-resize.js"].coveredLines = 13;
_yuitest_coverage["build/event-resize/event-resize.js"].coveredFunctions = 7;
_yuitest_coverline("build/event-resize/event-resize.js", 1);
YUI.add('event-resize', function (Y, NAME) {

/**
 * Adds a window resize event that has its behavior normalized to fire at the
 * end of the resize rather than constantly during the resize.
 * @module event
 * @submodule event-resize
 */


/**
 * Old firefox fires the window resize event once when the resize action
 * finishes, other browsers fire the event periodically during the
 * resize.  This code uses timeout logic to simulate the Firefox 
 * behavior in other browsers.
 * @event windowresize
 * @for YUI
 */
_yuitest_coverfunc("build/event-resize/event-resize.js", "(anonymous 1)", 1);
_yuitest_coverline("build/event-resize/event-resize.js", 19);
Y.Event.define('windowresize', {

    on: (Y.UA.gecko && Y.UA.gecko < 1.91) ?
        function (node, sub, notifier) {
            _yuitest_coverfunc("build/event-resize/event-resize.js", "(anonymous 2)", 22);
_yuitest_coverline("build/event-resize/event-resize.js", 23);
sub._handle = Y.Event.attach('resize', function (e) {
                _yuitest_coverfunc("build/event-resize/event-resize.js", "(anonymous 3)", 23);
_yuitest_coverline("build/event-resize/event-resize.js", 24);
notifier.fire(e);
            });
        } :
        function (node, sub, notifier) {
            // interval bumped from 40 to 100ms as of 3.4.1
            _yuitest_coverfunc("build/event-resize/event-resize.js", "}", 27);
_yuitest_coverline("build/event-resize/event-resize.js", 29);
var delay = Y.config.windowResizeDelay || 100;

            _yuitest_coverline("build/event-resize/event-resize.js", 31);
sub._handle = Y.Event.attach('resize', function (e) {
                _yuitest_coverfunc("build/event-resize/event-resize.js", "(anonymous 4)", 31);
_yuitest_coverline("build/event-resize/event-resize.js", 32);
if (sub._timer) {
                    _yuitest_coverline("build/event-resize/event-resize.js", 33);
sub._timer.cancel();
                }

                _yuitest_coverline("build/event-resize/event-resize.js", 36);
sub._timer = Y.later(delay, Y, function () {
                    _yuitest_coverfunc("build/event-resize/event-resize.js", "(anonymous 5)", 36);
_yuitest_coverline("build/event-resize/event-resize.js", 37);
notifier.fire(e);
                });
            });
        },

    detach: function (node, sub) {
        _yuitest_coverfunc("build/event-resize/event-resize.js", "detach", 42);
_yuitest_coverline("build/event-resize/event-resize.js", 43);
if (sub._timer) {
            _yuitest_coverline("build/event-resize/event-resize.js", 44);
sub._timer.cancel();
        }
        _yuitest_coverline("build/event-resize/event-resize.js", 46);
sub._handle.detach();
    }
    // delegate methods not defined because this only works for window
    // subscriptions, so...yeah.
});


}, '3.7.3', {"requires": ["node-base", "event-synthetic"]});
