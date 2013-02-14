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
_yuitest_coverage["build/event-flick/event-flick.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/event-flick/event-flick.js",
    code: []
};
_yuitest_coverage["build/event-flick/event-flick.js"].code=["YUI.add('event-flick', function (Y, NAME) {","","/**"," * The gestures module provides gesture events such as \"flick\", which normalize user interactions"," * across touch and mouse or pointer based input devices. This layer can be used by application developers"," * to build input device agnostic components which behave the same in response to either touch or mouse based"," * interaction."," *"," * <p>Documentation for events added by this module can be found in the event document for the <a href=\"../classes/YUI.html#events\">YUI</a> global.</p>"," *"," *"," @example","","     YUI().use('event-flick', function (Y) {","         Y.one('#myNode').on('flick', function (e) {","         });","     });",""," *"," * @module event-gestures"," */","","/**"," * Adds support for a \"flick\" event, which is fired at the end of a touch or mouse based flick gesture, and provides"," * velocity of the flick, along with distance and time information."," *"," * <p>Documentation for the flick event can be found on the <a href=\"../classes/YUI.html#event_flick\">YUI</a> global,"," * along with the other supported events.</p>"," *"," * @module event-gestures"," * @submodule event-flick"," */","var GESTURE_MAP = Y.Event._GESTURE_MAP,","    EVENT = {","        start: GESTURE_MAP.start,","        end: GESTURE_MAP.end,","        move: GESTURE_MAP.move","    },","    START = \"start\",","    END = \"end\",","    MOVE = \"move\",","","    OWNER_DOCUMENT = \"ownerDocument\",","    MIN_VELOCITY = \"minVelocity\",","    MIN_DISTANCE = \"minDistance\",","    PREVENT_DEFAULT = \"preventDefault\",","","    _FLICK_START = \"_fs\",","    _FLICK_START_HANDLE = \"_fsh\",","    _FLICK_END_HANDLE = \"_feh\",","    _FLICK_MOVE_HANDLE = \"_fmh\",","","    NODE_TYPE = \"nodeType\";","","/**"," * Sets up a \"flick\" event, that is fired whenever the user initiates a flick gesture on the node"," * where the listener is attached. The subscriber can specify a minimum distance or velocity for"," * which the event is to be fired. The subscriber can also specify if there is a particular axis which"," * they are interested in - \"x\" or \"y\". If no axis is specified, the axis along which there was most distance"," * covered is used."," *"," * <p>It is recommended that you use Y.bind to set up context and additional arguments for your event handler,"," * however if you want to pass the context and arguments as additional signature arguments to \"on\","," * you need to provide a null value for the configuration object, e.g: <code>node.on(\"flick\", fn, null, context, arg1, arg2, arg3)</code></p>"," *"," * @event flick"," * @for YUI"," * @param type {string} \"flick\""," * @param fn {function} The method the event invokes. It receives an event facade with an e.flick object containing the flick related properties: e.flick.time, e.flick.distance, e.flick.velocity and e.flick.axis, e.flick.start."," * @param cfg {Object} Optional. An object which specifies any of the following:"," * <dl>"," * <dt>minDistance (in pixels, defaults to 10)</dt>"," * <dd>The minimum distance between start and end points, which would qualify the gesture as a flick.</dd>"," * <dt>minVelocity (in pixels/ms, defaults to 0)</dt>"," * <dd>The minimum velocity which would qualify the gesture as a flick.</dd>"," * <dt>preventDefault (defaults to false)</dt>"," * <dd>Can be set to true/false to prevent default behavior as soon as the touchstart/touchend or mousedown/mouseup is received so that things like scrolling or text selection can be"," * prevented. This property can also be set to a function, which returns true or false, based on the event facade passed to it.</dd>"," * <dt>axis (no default)</dt>"," * <dd>Can be set to \"x\" or \"y\" if you want to constrain the flick velocity and distance to a single axis. If not"," * defined, the axis along which the maximum distance was covered is used.</dd>"," * </dl>"," * @return {EventHandle} the detach handle"," */","","Y.Event.define('flick', {","","    on: function (node, subscriber, ce) {","","        var startHandle = node.on(EVENT[START],","            this._onStart,","            this,","            node,","            subscriber,","            ce);","","        subscriber[_FLICK_START_HANDLE] = startHandle;","    },","","    detach: function (node, subscriber, ce) {","","        var startHandle = subscriber[_FLICK_START_HANDLE],","            endHandle = subscriber[_FLICK_END_HANDLE];","","        if (startHandle) {","            startHandle.detach();","            subscriber[_FLICK_START_HANDLE] = null;","        }","","        if (endHandle) {","            endHandle.detach();","            subscriber[_FLICK_END_HANDLE] = null;","        }","    },","","    processArgs: function(args) {","        var params = (args.length > 3) ? Y.merge(args.splice(3, 1)[0]) : {};","","        if (!(MIN_VELOCITY in params)) {","            params[MIN_VELOCITY] = this.MIN_VELOCITY;","        }","","        if (!(MIN_DISTANCE in params)) {","            params[MIN_DISTANCE] = this.MIN_DISTANCE;","        }","","        if (!(PREVENT_DEFAULT in params)) {","            params[PREVENT_DEFAULT] = this.PREVENT_DEFAULT;","        }","","        return params;","    },","","    _onStart: function(e, node, subscriber, ce) {","","        var start = true, // always true for mouse","            endHandle,","            moveHandle,","            doc,","            preventDefault = subscriber._extra.preventDefault,","            origE = e;","","        if (e.touches) {","            start = (e.touches.length === 1);","            e = e.touches[0];","        }","","        if (start) {","","            if (preventDefault) {","                // preventDefault is a boolean or function","                if (!preventDefault.call || preventDefault(e)) {","                    origE.preventDefault();","                }","            }","","            e.flick = {","                time : new Date().getTime()","            };","","            subscriber[_FLICK_START] = e;","","            endHandle = subscriber[_FLICK_END_HANDLE];","","            doc = (node.get(NODE_TYPE) === 9) ? node : node.get(OWNER_DOCUMENT);","            if (!endHandle) {","                endHandle = doc.on(EVENT[END], Y.bind(this._onEnd, this), null, node, subscriber, ce);","                subscriber[_FLICK_END_HANDLE] = endHandle;","            }","","            subscriber[_FLICK_MOVE_HANDLE] = doc.once(EVENT[MOVE], Y.bind(this._onMove, this), null, node, subscriber, ce);","        }","    },","","    _onMove: function(e, node, subscriber, ce) {","        var start = subscriber[_FLICK_START];","","        // Start timing from first move.","        if (start && start.flick) {","            start.flick.time = new Date().getTime();","        }","    },","","    _onEnd: function(e, node, subscriber, ce) {","","        var endTime = new Date().getTime(),","            start = subscriber[_FLICK_START],","            valid = !!start,","            endEvent = e,","            startTime,","            time,","            preventDefault,","            params,","            xyDistance,","            distance,","            velocity,","            axis,","            moveHandle = subscriber[_FLICK_MOVE_HANDLE];","","        if (moveHandle) {","            moveHandle.detach();","            delete subscriber[_FLICK_MOVE_HANDLE];","        }","","        if (valid) {","","            if (e.changedTouches) {","                if (e.changedTouches.length === 1 && e.touches.length === 0) {","                    endEvent = e.changedTouches[0];","                } else {","                    valid = false;","                }","            }","","            if (valid) {","","                params = subscriber._extra;","                preventDefault = params[PREVENT_DEFAULT];","","                if (preventDefault) {","                    // preventDefault is a boolean or function","                    if (!preventDefault.call || preventDefault(e)) {","                        e.preventDefault();","                    }","                }","","                startTime = start.flick.time;","                endTime = new Date().getTime();","                time = endTime - startTime;","","                xyDistance = [","                    endEvent.pageX - start.pageX,","                    endEvent.pageY - start.pageY","                ];","","                if (params.axis) {","                    axis = params.axis;","                } else {","                    axis = (Math.abs(xyDistance[0]) >= Math.abs(xyDistance[1])) ? 'x' : 'y';","                }","","                distance = xyDistance[(axis === 'x') ? 0 : 1];","                velocity = (time !== 0) ? distance/time : 0;","","                if (isFinite(velocity) && (Math.abs(distance) >= params[MIN_DISTANCE]) && (Math.abs(velocity)  >= params[MIN_VELOCITY])) {","","                    e.type = \"flick\";","                    e.flick = {","                        time:time,","                        distance: distance,","                        velocity:velocity,","                        axis: axis,","                        start : start","                    };","","                    ce.fire(e);","","                }","","                subscriber[_FLICK_START] = null;","            }","        }","    },","","    MIN_VELOCITY : 0,","    MIN_DISTANCE : 0,","    PREVENT_DEFAULT : false","});","","","}, '3.7.3', {\"requires\": [\"node-base\", \"event-touch\", \"event-synthetic\"]});"];
_yuitest_coverage["build/event-flick/event-flick.js"].lines = {"1":0,"33":0,"86":0,"90":0,"97":0,"102":0,"105":0,"106":0,"107":0,"110":0,"111":0,"112":0,"117":0,"119":0,"120":0,"123":0,"124":0,"127":0,"128":0,"131":0,"136":0,"143":0,"144":0,"145":0,"148":0,"150":0,"152":0,"153":0,"157":0,"161":0,"163":0,"165":0,"166":0,"167":0,"168":0,"171":0,"176":0,"179":0,"180":0,"186":0,"200":0,"201":0,"202":0,"205":0,"207":0,"208":0,"209":0,"211":0,"215":0,"217":0,"218":0,"220":0,"222":0,"223":0,"227":0,"228":0,"229":0,"231":0,"236":0,"237":0,"239":0,"242":0,"243":0,"245":0,"247":0,"248":0,"256":0,"260":0};
_yuitest_coverage["build/event-flick/event-flick.js"].functions = {"on:88":0,"detach:100":0,"processArgs:116":0,"_onStart:134":0,"_onMove:175":0,"_onEnd:184":0,"(anonymous 1):1":0};
_yuitest_coverage["build/event-flick/event-flick.js"].coveredLines = 68;
_yuitest_coverage["build/event-flick/event-flick.js"].coveredFunctions = 7;
_yuitest_coverline("build/event-flick/event-flick.js", 1);
YUI.add('event-flick', function (Y, NAME) {

/**
 * The gestures module provides gesture events such as "flick", which normalize user interactions
 * across touch and mouse or pointer based input devices. This layer can be used by application developers
 * to build input device agnostic components which behave the same in response to either touch or mouse based
 * interaction.
 *
 * <p>Documentation for events added by this module can be found in the event document for the <a href="../classes/YUI.html#events">YUI</a> global.</p>
 *
 *
 @example

     YUI().use('event-flick', function (Y) {
         Y.one('#myNode').on('flick', function (e) {
         });
     });

 *
 * @module event-gestures
 */

/**
 * Adds support for a "flick" event, which is fired at the end of a touch or mouse based flick gesture, and provides
 * velocity of the flick, along with distance and time information.
 *
 * <p>Documentation for the flick event can be found on the <a href="../classes/YUI.html#event_flick">YUI</a> global,
 * along with the other supported events.</p>
 *
 * @module event-gestures
 * @submodule event-flick
 */
_yuitest_coverfunc("build/event-flick/event-flick.js", "(anonymous 1)", 1);
_yuitest_coverline("build/event-flick/event-flick.js", 33);
var GESTURE_MAP = Y.Event._GESTURE_MAP,
    EVENT = {
        start: GESTURE_MAP.start,
        end: GESTURE_MAP.end,
        move: GESTURE_MAP.move
    },
    START = "start",
    END = "end",
    MOVE = "move",

    OWNER_DOCUMENT = "ownerDocument",
    MIN_VELOCITY = "minVelocity",
    MIN_DISTANCE = "minDistance",
    PREVENT_DEFAULT = "preventDefault",

    _FLICK_START = "_fs",
    _FLICK_START_HANDLE = "_fsh",
    _FLICK_END_HANDLE = "_feh",
    _FLICK_MOVE_HANDLE = "_fmh",

    NODE_TYPE = "nodeType";

/**
 * Sets up a "flick" event, that is fired whenever the user initiates a flick gesture on the node
 * where the listener is attached. The subscriber can specify a minimum distance or velocity for
 * which the event is to be fired. The subscriber can also specify if there is a particular axis which
 * they are interested in - "x" or "y". If no axis is specified, the axis along which there was most distance
 * covered is used.
 *
 * <p>It is recommended that you use Y.bind to set up context and additional arguments for your event handler,
 * however if you want to pass the context and arguments as additional signature arguments to "on",
 * you need to provide a null value for the configuration object, e.g: <code>node.on("flick", fn, null, context, arg1, arg2, arg3)</code></p>
 *
 * @event flick
 * @for YUI
 * @param type {string} "flick"
 * @param fn {function} The method the event invokes. It receives an event facade with an e.flick object containing the flick related properties: e.flick.time, e.flick.distance, e.flick.velocity and e.flick.axis, e.flick.start.
 * @param cfg {Object} Optional. An object which specifies any of the following:
 * <dl>
 * <dt>minDistance (in pixels, defaults to 10)</dt>
 * <dd>The minimum distance between start and end points, which would qualify the gesture as a flick.</dd>
 * <dt>minVelocity (in pixels/ms, defaults to 0)</dt>
 * <dd>The minimum velocity which would qualify the gesture as a flick.</dd>
 * <dt>preventDefault (defaults to false)</dt>
 * <dd>Can be set to true/false to prevent default behavior as soon as the touchstart/touchend or mousedown/mouseup is received so that things like scrolling or text selection can be
 * prevented. This property can also be set to a function, which returns true or false, based on the event facade passed to it.</dd>
 * <dt>axis (no default)</dt>
 * <dd>Can be set to "x" or "y" if you want to constrain the flick velocity and distance to a single axis. If not
 * defined, the axis along which the maximum distance was covered is used.</dd>
 * </dl>
 * @return {EventHandle} the detach handle
 */

_yuitest_coverline("build/event-flick/event-flick.js", 86);
Y.Event.define('flick', {

    on: function (node, subscriber, ce) {

        _yuitest_coverfunc("build/event-flick/event-flick.js", "on", 88);
_yuitest_coverline("build/event-flick/event-flick.js", 90);
var startHandle = node.on(EVENT[START],
            this._onStart,
            this,
            node,
            subscriber,
            ce);

        _yuitest_coverline("build/event-flick/event-flick.js", 97);
subscriber[_FLICK_START_HANDLE] = startHandle;
    },

    detach: function (node, subscriber, ce) {

        _yuitest_coverfunc("build/event-flick/event-flick.js", "detach", 100);
_yuitest_coverline("build/event-flick/event-flick.js", 102);
var startHandle = subscriber[_FLICK_START_HANDLE],
            endHandle = subscriber[_FLICK_END_HANDLE];

        _yuitest_coverline("build/event-flick/event-flick.js", 105);
if (startHandle) {
            _yuitest_coverline("build/event-flick/event-flick.js", 106);
startHandle.detach();
            _yuitest_coverline("build/event-flick/event-flick.js", 107);
subscriber[_FLICK_START_HANDLE] = null;
        }

        _yuitest_coverline("build/event-flick/event-flick.js", 110);
if (endHandle) {
            _yuitest_coverline("build/event-flick/event-flick.js", 111);
endHandle.detach();
            _yuitest_coverline("build/event-flick/event-flick.js", 112);
subscriber[_FLICK_END_HANDLE] = null;
        }
    },

    processArgs: function(args) {
        _yuitest_coverfunc("build/event-flick/event-flick.js", "processArgs", 116);
_yuitest_coverline("build/event-flick/event-flick.js", 117);
var params = (args.length > 3) ? Y.merge(args.splice(3, 1)[0]) : {};

        _yuitest_coverline("build/event-flick/event-flick.js", 119);
if (!(MIN_VELOCITY in params)) {
            _yuitest_coverline("build/event-flick/event-flick.js", 120);
params[MIN_VELOCITY] = this.MIN_VELOCITY;
        }

        _yuitest_coverline("build/event-flick/event-flick.js", 123);
if (!(MIN_DISTANCE in params)) {
            _yuitest_coverline("build/event-flick/event-flick.js", 124);
params[MIN_DISTANCE] = this.MIN_DISTANCE;
        }

        _yuitest_coverline("build/event-flick/event-flick.js", 127);
if (!(PREVENT_DEFAULT in params)) {
            _yuitest_coverline("build/event-flick/event-flick.js", 128);
params[PREVENT_DEFAULT] = this.PREVENT_DEFAULT;
        }

        _yuitest_coverline("build/event-flick/event-flick.js", 131);
return params;
    },

    _onStart: function(e, node, subscriber, ce) {

        _yuitest_coverfunc("build/event-flick/event-flick.js", "_onStart", 134);
_yuitest_coverline("build/event-flick/event-flick.js", 136);
var start = true, // always true for mouse
            endHandle,
            moveHandle,
            doc,
            preventDefault = subscriber._extra.preventDefault,
            origE = e;

        _yuitest_coverline("build/event-flick/event-flick.js", 143);
if (e.touches) {
            _yuitest_coverline("build/event-flick/event-flick.js", 144);
start = (e.touches.length === 1);
            _yuitest_coverline("build/event-flick/event-flick.js", 145);
e = e.touches[0];
        }

        _yuitest_coverline("build/event-flick/event-flick.js", 148);
if (start) {

            _yuitest_coverline("build/event-flick/event-flick.js", 150);
if (preventDefault) {
                // preventDefault is a boolean or function
                _yuitest_coverline("build/event-flick/event-flick.js", 152);
if (!preventDefault.call || preventDefault(e)) {
                    _yuitest_coverline("build/event-flick/event-flick.js", 153);
origE.preventDefault();
                }
            }

            _yuitest_coverline("build/event-flick/event-flick.js", 157);
e.flick = {
                time : new Date().getTime()
            };

            _yuitest_coverline("build/event-flick/event-flick.js", 161);
subscriber[_FLICK_START] = e;

            _yuitest_coverline("build/event-flick/event-flick.js", 163);
endHandle = subscriber[_FLICK_END_HANDLE];

            _yuitest_coverline("build/event-flick/event-flick.js", 165);
doc = (node.get(NODE_TYPE) === 9) ? node : node.get(OWNER_DOCUMENT);
            _yuitest_coverline("build/event-flick/event-flick.js", 166);
if (!endHandle) {
                _yuitest_coverline("build/event-flick/event-flick.js", 167);
endHandle = doc.on(EVENT[END], Y.bind(this._onEnd, this), null, node, subscriber, ce);
                _yuitest_coverline("build/event-flick/event-flick.js", 168);
subscriber[_FLICK_END_HANDLE] = endHandle;
            }

            _yuitest_coverline("build/event-flick/event-flick.js", 171);
subscriber[_FLICK_MOVE_HANDLE] = doc.once(EVENT[MOVE], Y.bind(this._onMove, this), null, node, subscriber, ce);
        }
    },

    _onMove: function(e, node, subscriber, ce) {
        _yuitest_coverfunc("build/event-flick/event-flick.js", "_onMove", 175);
_yuitest_coverline("build/event-flick/event-flick.js", 176);
var start = subscriber[_FLICK_START];

        // Start timing from first move.
        _yuitest_coverline("build/event-flick/event-flick.js", 179);
if (start && start.flick) {
            _yuitest_coverline("build/event-flick/event-flick.js", 180);
start.flick.time = new Date().getTime();
        }
    },

    _onEnd: function(e, node, subscriber, ce) {

        _yuitest_coverfunc("build/event-flick/event-flick.js", "_onEnd", 184);
_yuitest_coverline("build/event-flick/event-flick.js", 186);
var endTime = new Date().getTime(),
            start = subscriber[_FLICK_START],
            valid = !!start,
            endEvent = e,
            startTime,
            time,
            preventDefault,
            params,
            xyDistance,
            distance,
            velocity,
            axis,
            moveHandle = subscriber[_FLICK_MOVE_HANDLE];

        _yuitest_coverline("build/event-flick/event-flick.js", 200);
if (moveHandle) {
            _yuitest_coverline("build/event-flick/event-flick.js", 201);
moveHandle.detach();
            _yuitest_coverline("build/event-flick/event-flick.js", 202);
delete subscriber[_FLICK_MOVE_HANDLE];
        }

        _yuitest_coverline("build/event-flick/event-flick.js", 205);
if (valid) {

            _yuitest_coverline("build/event-flick/event-flick.js", 207);
if (e.changedTouches) {
                _yuitest_coverline("build/event-flick/event-flick.js", 208);
if (e.changedTouches.length === 1 && e.touches.length === 0) {
                    _yuitest_coverline("build/event-flick/event-flick.js", 209);
endEvent = e.changedTouches[0];
                } else {
                    _yuitest_coverline("build/event-flick/event-flick.js", 211);
valid = false;
                }
            }

            _yuitest_coverline("build/event-flick/event-flick.js", 215);
if (valid) {

                _yuitest_coverline("build/event-flick/event-flick.js", 217);
params = subscriber._extra;
                _yuitest_coverline("build/event-flick/event-flick.js", 218);
preventDefault = params[PREVENT_DEFAULT];

                _yuitest_coverline("build/event-flick/event-flick.js", 220);
if (preventDefault) {
                    // preventDefault is a boolean or function
                    _yuitest_coverline("build/event-flick/event-flick.js", 222);
if (!preventDefault.call || preventDefault(e)) {
                        _yuitest_coverline("build/event-flick/event-flick.js", 223);
e.preventDefault();
                    }
                }

                _yuitest_coverline("build/event-flick/event-flick.js", 227);
startTime = start.flick.time;
                _yuitest_coverline("build/event-flick/event-flick.js", 228);
endTime = new Date().getTime();
                _yuitest_coverline("build/event-flick/event-flick.js", 229);
time = endTime - startTime;

                _yuitest_coverline("build/event-flick/event-flick.js", 231);
xyDistance = [
                    endEvent.pageX - start.pageX,
                    endEvent.pageY - start.pageY
                ];

                _yuitest_coverline("build/event-flick/event-flick.js", 236);
if (params.axis) {
                    _yuitest_coverline("build/event-flick/event-flick.js", 237);
axis = params.axis;
                } else {
                    _yuitest_coverline("build/event-flick/event-flick.js", 239);
axis = (Math.abs(xyDistance[0]) >= Math.abs(xyDistance[1])) ? 'x' : 'y';
                }

                _yuitest_coverline("build/event-flick/event-flick.js", 242);
distance = xyDistance[(axis === 'x') ? 0 : 1];
                _yuitest_coverline("build/event-flick/event-flick.js", 243);
velocity = (time !== 0) ? distance/time : 0;

                _yuitest_coverline("build/event-flick/event-flick.js", 245);
if (isFinite(velocity) && (Math.abs(distance) >= params[MIN_DISTANCE]) && (Math.abs(velocity)  >= params[MIN_VELOCITY])) {

                    _yuitest_coverline("build/event-flick/event-flick.js", 247);
e.type = "flick";
                    _yuitest_coverline("build/event-flick/event-flick.js", 248);
e.flick = {
                        time:time,
                        distance: distance,
                        velocity:velocity,
                        axis: axis,
                        start : start
                    };

                    _yuitest_coverline("build/event-flick/event-flick.js", 256);
ce.fire(e);

                }

                _yuitest_coverline("build/event-flick/event-flick.js", 260);
subscriber[_FLICK_START] = null;
            }
        }
    },

    MIN_VELOCITY : 0,
    MIN_DISTANCE : 0,
    PREVENT_DEFAULT : false
});


}, '3.7.3', {"requires": ["node-base", "event-touch", "event-synthetic"]});
