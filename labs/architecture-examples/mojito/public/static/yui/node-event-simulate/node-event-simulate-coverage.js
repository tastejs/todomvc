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
_yuitest_coverage["build/node-event-simulate/node-event-simulate.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/node-event-simulate/node-event-simulate.js",
    code: []
};
_yuitest_coverage["build/node-event-simulate/node-event-simulate.js"].code=["YUI.add('node-event-simulate', function (Y, NAME) {","","/**"," * Adds functionality to simulate events."," * @module node"," * @submodule node-event-simulate"," */","","/**"," * Simulates an event on the node."," * @param {String} type The type of event (i.e., \"click\")."," * @param {Object} options (Optional) Extra options to copy onto the event object."," * @return {void}"," * @for Node"," * @method simulate"," */","Y.Node.prototype.simulate = function (type, options) {","    ","    Y.Event.simulate(Y.Node.getDOMNode(this), type, options);","};","","/**"," * Simulates the higher user level gesture of the given name on this node. "," * This method generates a set of low level touch events(Apple specific gesture "," * events as well for the iOS platforms) asynchronously. Note that gesture  "," * simulation is relying on `Y.Event.simulate()` method to generate "," * the touch events under the hood. The `Y.Event.simulate()` method"," * itself is a synchronous method."," * "," * Supported gestures are `tap`, `doubletap`, `press`, `move`, `flick`, `pinch`"," * and `rotate`."," * "," * The `pinch` gesture is used to simulate the pinching and spreading of two"," * fingers. During a pinch simulation, rotation is also possible. Essentially"," * `pinch` and `rotate` simulations share the same base implementation to allow"," * both pinching and rotation at the same time. The only difference is `pinch`"," * requires `start` and `end` option properties while `rotate` requires `rotation` "," * option property."," * "," * The `pinch` and `rotate` gestures can be described as placing 2 fingers along a"," * circle. Pinching and spreading can be described by start and end circles while "," * rotation occurs on a single circle. If the radius of the start circle is greater "," * than the end circle, the gesture becomes a pinch, otherwise it is a spread spread."," * "," * @example"," *"," *     var node = Y.one(\"#target\");"," *       "," *     // double tap example"," *     node.simulateGesture(\"doubletap\", function() {"," *         // my callback function"," *     });"," *     "," *     // flick example from the center of the node, move 50 pixels down for 50ms)"," *     node.simulateGesture(\"flick\", {"," *         axis: y,"," *         distance: -100"," *         duration: 50"," *     }, function() {"," *         // my callback function"," *     });"," *     "," *     // simulate rotating a node 75 degrees counter-clockwise "," *     node.simulateGesture(\"rotate\", {"," *         rotation: -75"," *     });"," *"," *     // simulate a pinch and a rotation at the same time. "," *     // fingers start on a circle of radius 100 px, placed at top/bottom"," *     // fingers end on a circle of radius 50px, placed at right/left "," *     node.simulateGesture(\"pinch\", {"," *         r1: 100,"," *         r2: 50,"," *         start: 0"," *         rotation: 90"," *     });"," *     "," * @method simulateGesture"," * @param {String} name The name of the supported gesture to simulate. The "," *      supported gesture name is one of \"tap\", \"doubletap\", \"press\", \"move\", "," *      \"flick\", \"pinch\" and \"rotate\". "," * @param {Object} [options] Extra options used to define the gesture behavior:"," * "," *      Valid options properties for the `tap` gesture:"," *      "," *      @param {Array} [options.point] (Optional) Indicates the [x,y] coordinates "," *        where the tap should be simulated. Default is the center of the node "," *        element."," *      @param {Number} [options.hold=10] (Optional) The hold time in milliseconds. "," *        This is the time between `touchstart` and `touchend` event generation."," *      @param {Number} [options.times=1] (Optional) Indicates the number of taps."," *      @param {Number} [options.delay=10] (Optional) The number of milliseconds "," *        before the next tap simulation happens. This is valid only when `times` "," *        is more than 1. "," *        "," *      Valid options properties for the `doubletap` gesture:"," *      "," *      @param {Array} [options.point] (Optional) Indicates the [x,y] coordinates "," *        where the doubletap should be simulated. Default is the center of the "," *        node element."," * "," *      Valid options properties for the `press` gesture:"," *      "," *      @param {Array} [options.point] (Optional) Indicates the [x,y] coordinates "," *        where the press should be simulated. Default is the center of the node "," *        element."," *      @param {Number} [options.hold=3000] (Optional) The hold time in milliseconds. "," *        This is the time between `touchstart` and `touchend` event generation. "," *        Default is 3000ms (3 seconds)."," * "," *      Valid options properties for the `move` gesture:"," *      "," *      @param {Object} [options.path] (Optional) Indicates the path of the finger "," *        movement. It's an object with three optional properties: `point`, "," *        `xdist` and  `ydist`."," *        @param {Array} [options.path.point] A starting point of the gesture."," *          Default is the center of the node element."," *        @param {Number} [options.path.xdist=200] A distance to move in pixels  "," *          along the X axis. A negative distance value indicates moving left."," *        @param {Number} [options.path.ydist=0] A distance to move in pixels  "," *          along the Y axis. A negative distance value indicates moving up."," *      @param {Number} [options.duration=1000] (Optional) The duration of the "," *        gesture in milliseconds."," * "," *      Valid options properties for the `flick` gesture:"," *      "," *      @param {Array} [options.point] (Optional) Indicates the [x, y] coordinates "," *        where the flick should be simulated. Default is the center of the "," *        node element."," *      @param {String} [options.axis='x'] (Optional) Valid values are either "," *        \"x\" or \"y\". Indicates axis to move along. The flick can move to one of "," *        4 directions(left, right, up and down)."," *      @param {Number} [options.distance=200] (Optional) Distance to move in pixels"," *      @param {Number} [options.duration=1000] (Optional) The duration of the "," *        gesture in milliseconds. User given value could be automatically "," *        adjusted by the framework if it is below the minimum velocity to be "," *        a flick gesture."," * "," *      Valid options properties for the `pinch` gesture:"," *      "," *      @param {Array} [options.center] (Optional) The center of the circle where "," *        two fingers are placed. Default is the center of the node element."," *      @param {Number} [options.r1] (Required) Pixel radius of the start circle "," *        where 2 fingers will be on when the gesture starts. The circles are "," *        centered at the center of the element."," *      @param {Number} [options.r2] (Required) Pixel radius of the end circle "," *        when this gesture ends."," *      @param {Number} [options.duration=1000] (Optional) The duration of the "," *        gesture in milliseconds."," *      @param {Number} [options.start=0] (Optional) Starting degree of the first "," *        finger. The value is relative to the path of the north. Default is 0 "," *        (i.e., 12:00 on a clock)."," *      @param {Number} [options.rotation=0] (Optional) Degrees to rotate from "," *        the starting degree. A negative value means rotation to the "," *        counter-clockwise direction."," * "," *      Valid options properties for the `rotate` gesture:"," *      "," *      @param {Array} [options.center] (Optional) The center of the circle where "," *        two fingers are placed. Default is the center of the node element."," *      @param {Number} [options.r1] (Optional) Pixel radius of the start circle "," *        where 2 fingers will be on when the gesture starts. The circles are "," *        centered at the center of the element. Default is a fourth of the node "," *        element width or height, whichever is smaller."," *      @param {Number} [options.r2] (Optional) Pixel radius of the end circle "," *        when this gesture ends. Default is a fourth of the node element width or "," *        height, whichever is smaller."," *      @param {Number} [options.duration=1000] (Optional) The duration of the "," *        gesture in milliseconds."," *      @param {Number} [options.start=0] (Optional) Starting degree of the first "," *        finger. The value is relative to the path of the north. Default is 0 "," *        (i.e., 12:00 on a clock)."," *      @param {Number} [options.rotation] (Required) Degrees to rotate from "," *        the starting degree. A negative value means rotation to the "," *        counter-clockwise direction."," * "," * @param {Function} [cb] The callback to execute when the asynchronouse gesture  "," *      simulation is completed. "," *      @param {Error} cb.err An error object if the simulation is failed.  "," * @return {void}"," * @for Node"," */","Y.Node.prototype.simulateGesture = function (name, options, cb) {","","    Y.Event.simulateGesture(this, name, options, cb);","};","","","}, '3.7.3', {\"requires\": [\"node-base\", \"event-simulate\", \"gesture-simulate\"]});"];
_yuitest_coverage["build/node-event-simulate/node-event-simulate.js"].lines = {"1":0,"17":0,"19":0,"183":0,"185":0};
_yuitest_coverage["build/node-event-simulate/node-event-simulate.js"].functions = {"simulate:17":0,"simulateGesture:183":0,"(anonymous 1):1":0};
_yuitest_coverage["build/node-event-simulate/node-event-simulate.js"].coveredLines = 5;
_yuitest_coverage["build/node-event-simulate/node-event-simulate.js"].coveredFunctions = 3;
_yuitest_coverline("build/node-event-simulate/node-event-simulate.js", 1);
YUI.add('node-event-simulate', function (Y, NAME) {

/**
 * Adds functionality to simulate events.
 * @module node
 * @submodule node-event-simulate
 */

/**
 * Simulates an event on the node.
 * @param {String} type The type of event (i.e., "click").
 * @param {Object} options (Optional) Extra options to copy onto the event object.
 * @return {void}
 * @for Node
 * @method simulate
 */
_yuitest_coverfunc("build/node-event-simulate/node-event-simulate.js", "(anonymous 1)", 1);
_yuitest_coverline("build/node-event-simulate/node-event-simulate.js", 17);
Y.Node.prototype.simulate = function (type, options) {
    
    _yuitest_coverfunc("build/node-event-simulate/node-event-simulate.js", "simulate", 17);
_yuitest_coverline("build/node-event-simulate/node-event-simulate.js", 19);
Y.Event.simulate(Y.Node.getDOMNode(this), type, options);
};

/**
 * Simulates the higher user level gesture of the given name on this node. 
 * This method generates a set of low level touch events(Apple specific gesture 
 * events as well for the iOS platforms) asynchronously. Note that gesture  
 * simulation is relying on `Y.Event.simulate()` method to generate 
 * the touch events under the hood. The `Y.Event.simulate()` method
 * itself is a synchronous method.
 * 
 * Supported gestures are `tap`, `doubletap`, `press`, `move`, `flick`, `pinch`
 * and `rotate`.
 * 
 * The `pinch` gesture is used to simulate the pinching and spreading of two
 * fingers. During a pinch simulation, rotation is also possible. Essentially
 * `pinch` and `rotate` simulations share the same base implementation to allow
 * both pinching and rotation at the same time. The only difference is `pinch`
 * requires `start` and `end` option properties while `rotate` requires `rotation` 
 * option property.
 * 
 * The `pinch` and `rotate` gestures can be described as placing 2 fingers along a
 * circle. Pinching and spreading can be described by start and end circles while 
 * rotation occurs on a single circle. If the radius of the start circle is greater 
 * than the end circle, the gesture becomes a pinch, otherwise it is a spread spread.
 * 
 * @example
 *
 *     var node = Y.one("#target");
 *       
 *     // double tap example
 *     node.simulateGesture("doubletap", function() {
 *         // my callback function
 *     });
 *     
 *     // flick example from the center of the node, move 50 pixels down for 50ms)
 *     node.simulateGesture("flick", {
 *         axis: y,
 *         distance: -100
 *         duration: 50
 *     }, function() {
 *         // my callback function
 *     });
 *     
 *     // simulate rotating a node 75 degrees counter-clockwise 
 *     node.simulateGesture("rotate", {
 *         rotation: -75
 *     });
 *
 *     // simulate a pinch and a rotation at the same time. 
 *     // fingers start on a circle of radius 100 px, placed at top/bottom
 *     // fingers end on a circle of radius 50px, placed at right/left 
 *     node.simulateGesture("pinch", {
 *         r1: 100,
 *         r2: 50,
 *         start: 0
 *         rotation: 90
 *     });
 *     
 * @method simulateGesture
 * @param {String} name The name of the supported gesture to simulate. The 
 *      supported gesture name is one of "tap", "doubletap", "press", "move", 
 *      "flick", "pinch" and "rotate". 
 * @param {Object} [options] Extra options used to define the gesture behavior:
 * 
 *      Valid options properties for the `tap` gesture:
 *      
 *      @param {Array} [options.point] (Optional) Indicates the [x,y] coordinates 
 *        where the tap should be simulated. Default is the center of the node 
 *        element.
 *      @param {Number} [options.hold=10] (Optional) The hold time in milliseconds. 
 *        This is the time between `touchstart` and `touchend` event generation.
 *      @param {Number} [options.times=1] (Optional) Indicates the number of taps.
 *      @param {Number} [options.delay=10] (Optional) The number of milliseconds 
 *        before the next tap simulation happens. This is valid only when `times` 
 *        is more than 1. 
 *        
 *      Valid options properties for the `doubletap` gesture:
 *      
 *      @param {Array} [options.point] (Optional) Indicates the [x,y] coordinates 
 *        where the doubletap should be simulated. Default is the center of the 
 *        node element.
 * 
 *      Valid options properties for the `press` gesture:
 *      
 *      @param {Array} [options.point] (Optional) Indicates the [x,y] coordinates 
 *        where the press should be simulated. Default is the center of the node 
 *        element.
 *      @param {Number} [options.hold=3000] (Optional) The hold time in milliseconds. 
 *        This is the time between `touchstart` and `touchend` event generation. 
 *        Default is 3000ms (3 seconds).
 * 
 *      Valid options properties for the `move` gesture:
 *      
 *      @param {Object} [options.path] (Optional) Indicates the path of the finger 
 *        movement. It's an object with three optional properties: `point`, 
 *        `xdist` and  `ydist`.
 *        @param {Array} [options.path.point] A starting point of the gesture.
 *          Default is the center of the node element.
 *        @param {Number} [options.path.xdist=200] A distance to move in pixels  
 *          along the X axis. A negative distance value indicates moving left.
 *        @param {Number} [options.path.ydist=0] A distance to move in pixels  
 *          along the Y axis. A negative distance value indicates moving up.
 *      @param {Number} [options.duration=1000] (Optional) The duration of the 
 *        gesture in milliseconds.
 * 
 *      Valid options properties for the `flick` gesture:
 *      
 *      @param {Array} [options.point] (Optional) Indicates the [x, y] coordinates 
 *        where the flick should be simulated. Default is the center of the 
 *        node element.
 *      @param {String} [options.axis='x'] (Optional) Valid values are either 
 *        "x" or "y". Indicates axis to move along. The flick can move to one of 
 *        4 directions(left, right, up and down).
 *      @param {Number} [options.distance=200] (Optional) Distance to move in pixels
 *      @param {Number} [options.duration=1000] (Optional) The duration of the 
 *        gesture in milliseconds. User given value could be automatically 
 *        adjusted by the framework if it is below the minimum velocity to be 
 *        a flick gesture.
 * 
 *      Valid options properties for the `pinch` gesture:
 *      
 *      @param {Array} [options.center] (Optional) The center of the circle where 
 *        two fingers are placed. Default is the center of the node element.
 *      @param {Number} [options.r1] (Required) Pixel radius of the start circle 
 *        where 2 fingers will be on when the gesture starts. The circles are 
 *        centered at the center of the element.
 *      @param {Number} [options.r2] (Required) Pixel radius of the end circle 
 *        when this gesture ends.
 *      @param {Number} [options.duration=1000] (Optional) The duration of the 
 *        gesture in milliseconds.
 *      @param {Number} [options.start=0] (Optional) Starting degree of the first 
 *        finger. The value is relative to the path of the north. Default is 0 
 *        (i.e., 12:00 on a clock).
 *      @param {Number} [options.rotation=0] (Optional) Degrees to rotate from 
 *        the starting degree. A negative value means rotation to the 
 *        counter-clockwise direction.
 * 
 *      Valid options properties for the `rotate` gesture:
 *      
 *      @param {Array} [options.center] (Optional) The center of the circle where 
 *        two fingers are placed. Default is the center of the node element.
 *      @param {Number} [options.r1] (Optional) Pixel radius of the start circle 
 *        where 2 fingers will be on when the gesture starts. The circles are 
 *        centered at the center of the element. Default is a fourth of the node 
 *        element width or height, whichever is smaller.
 *      @param {Number} [options.r2] (Optional) Pixel radius of the end circle 
 *        when this gesture ends. Default is a fourth of the node element width or 
 *        height, whichever is smaller.
 *      @param {Number} [options.duration=1000] (Optional) The duration of the 
 *        gesture in milliseconds.
 *      @param {Number} [options.start=0] (Optional) Starting degree of the first 
 *        finger. The value is relative to the path of the north. Default is 0 
 *        (i.e., 12:00 on a clock).
 *      @param {Number} [options.rotation] (Required) Degrees to rotate from 
 *        the starting degree. A negative value means rotation to the 
 *        counter-clockwise direction.
 * 
 * @param {Function} [cb] The callback to execute when the asynchronouse gesture  
 *      simulation is completed. 
 *      @param {Error} cb.err An error object if the simulation is failed.  
 * @return {void}
 * @for Node
 */
_yuitest_coverline("build/node-event-simulate/node-event-simulate.js", 183);
Y.Node.prototype.simulateGesture = function (name, options, cb) {

    _yuitest_coverfunc("build/node-event-simulate/node-event-simulate.js", "simulateGesture", 183);
_yuitest_coverline("build/node-event-simulate/node-event-simulate.js", 185);
Y.Event.simulateGesture(this, name, options, cb);
};


}, '3.7.3', {"requires": ["node-base", "event-simulate", "gesture-simulate"]});
