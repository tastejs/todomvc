/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('gesture-simulate', function (Y, NAME) {

/**
 * Simulate high-level user gestures by generating a set of native DOM events.
 *
 * @module gesture-simulate
 * @requires event-simulate, async-queue, node-screen
 */

var NAME = "gesture-simulate",

    // phantomjs check may be temporary, until we determine if it really support touch all the way through, like it claims to (http://code.google.com/p/phantomjs/issues/detail?id=375)
    SUPPORTS_TOUCH = ((Y.config.win && ("ontouchstart" in Y.config.win)) && !(Y.UA.phantomjs) && !(Y.UA.chrome && Y.UA.chrome < 6)),

    gestureNames = {
        tap: 1,
        doubletap: 1,
        press: 1,
        move: 1,
        flick: 1,
        pinch: 1,
        rotate: 1
    },

    touchEvents = {
        touchstart: 1,
        touchmove: 1,
        touchend: 1,
        touchcancel: 1
    },

    document = Y.config.doc,
    emptyTouchList,

    EVENT_INTERVAL = 20,        // 20ms
    START_PAGEX,                // will be adjusted to the node element center
    START_PAGEY,                // will be adjusted to the node element center

    // defaults that user can override.
    DEFAULTS = {
        // tap gestures
        HOLD_TAP: 10,           // 10ms
        DELAY_TAP: 10,          // 10ms

        // press gesture
        HOLD_PRESS: 3000,       // 3sec
        MIN_HOLD_PRESS: 1000,   // 1sec
        MAX_HOLD_PRESS: 60000,  // 1min

        // move gesture
        DISTANCE_MOVE: 200,     // 200 pixels
        DURATION_MOVE: 1000,    // 1sec
        MAX_DURATION_MOVE: 5000,// 5sec

        // flick gesture
        MIN_VELOCITY_FLICK: 1.3,
        DISTANCE_FLICK: 200,     // 200 pixels
        DURATION_FLICK: 1000,    // 1sec
        MAX_DURATION_FLICK: 5000,// 5sec

        // pinch/rotation
        DURATION_PINCH: 1000     // 1sec
    },

    TOUCH_START = 'touchstart',
    TOUCH_MOVE = 'touchmove',
    TOUCH_END = 'touchend',

    GESTURE_START = 'gesturestart',
    GESTURE_CHANGE = 'gesturechange',
    GESTURE_END = 'gestureend',

    MOUSE_UP    = 'mouseup',
    MOUSE_MOVE  = 'mousemove',
    MOUSE_DOWN  = 'mousedown',
    MOUSE_CLICK = 'click',
    MOUSE_DBLCLICK = 'dblclick',

    X_AXIS = 'x',
    Y_AXIS = 'y';

/**
 *
 */
function Simulations(node) {
    if(!node) {
        Y.error(NAME+': invalid target node');
    }
    this.node = node;
    this.target = Y.Node.getDOMNode(node);

    var startXY = this.node.getXY(),
        dims = this._getDims();

    START_PAGEX = startXY[0] + (dims[0])/2;
    START_PAGEY = startXY[1] + (dims[1])/2;
}

Simulations.prototype = {

    /**
     * Helper method to convert a degree to a radian.
     * 
     * @method _toRadian
     * @private
     * @param {Number} deg A degree to be converted to a radian.
     * @return {Number} The degree in radian. 
     */
    _toRadian: function(deg) {
        return deg * (Math.PI/180);
    },

    /**
     * Helper method to get height/width while accounting for 
     * rotation/scale transforms where possible by using the 
     * bounding client rectangle height/width instead of the 
     * offsetWidth/Height which region uses.
     * @method _getDims
     * @private
     * @return {Array} Array with [height, width]
     */
    _getDims : function() {
        var region,
            width,
            height;

        // Ideally, this should be in DOM somewhere.
        if (this.target.getBoundingClientRect) {
            region = this.target.getBoundingClientRect();

            if ("height" in region) {
                height = region.height;
            } else {
                // IE7,8 has getBCR, but no height.
                height = Math.abs(region.bottom - region.top);
            }

            if ("width" in region) {
                width = region.width;
            } else {
                // IE7,8 has getBCR, but no width.
                width = Math.abs(region.right - region.left);
            }
        } else {
            region = this.node.get("region");
            width = region.width;
            height = region.height;
        }

        return [width, height];
    },

    /**
     * Helper method to convert a point relative to the node element into 
     * the point in the page coordination.
     * 
     * @method _calculateDefaultPoint
     * @private
     * @param {Array} point A point relative to the node element.
     * @return {Array} The same point in the page coordination. 
     */
    _calculateDefaultPoint: function(point) {

        var height;

        if(!Y.Lang.isArray(point) || point.length === 0) {
            point = [START_PAGEX, START_PAGEY];
        } else {
            if(point.length == 1) {
                height = this._getDims[1];
                point[1] = height/2;
            }
            // convert to page(viewport) coordination
            point[0] = this.node.getX() + point[0];
            point[1] = this.node.getY() + point[1];
        }

        return point;
    },

    /**
     * The "rotate" and "pinch" methods are essencially same with the exact same 
     * arguments. Only difference is the required parameters. The rotate method 
     * requires "rotation" parameter while the pinch method requires "startRadius" 
     * and "endRadius" parameters.
     *
     * @method rotate
     * @param {Function} cb The callback to execute when the gesture simulation 
     *      is completed.
     * @param {Array} center A center point where the pinch gesture of two fingers
     *      should happen. It is relative to the top left corner of the target 
     *      node element.
     * @param {Number} startRadius A radius of start circle where 2 fingers are 
     *      on when the gesture starts. This is optional. The default is a fourth of 
     *      either target node width or height whichever is smaller.
     * @param {Number} endRadius A radius of end circle where 2 fingers will be on when
     *      the pinch or spread gestures are completed. This is optional. 
     *      The default is a fourth of either target node width or height whichever is less.
     * @param {Number} duration A duration of the gesture in millisecond.
     * @param {Number} start A start angle(0 degree at 12 o'clock) where the 
     *      gesture should start. Default is 0.  
     * @param {Number} rotation A rotation in degree. It is required.
     */
    rotate: function(cb, center, startRadius, endRadius, duration, start, rotation) {
        var radius,
            r1 = startRadius,   // optional
            r2 = endRadius;     // optional

        if(!Y.Lang.isNumber(r1) || !Y.Lang.isNumber(r2) || r1<0 || r2<0) {
            radius = (this.target.offsetWidth < this.target.offsetHeight)? 
                this.target.offsetWidth/4 : this.target.offsetHeight/4;
            r1 = radius;
            r2 = radius;
        }

        // required
        if(!Y.Lang.isNumber(rotation)) {
            Y.error(NAME+'Invalid rotation detected.');
        }

        this.pinch(cb, center, r1, r2, duration, start, rotation);
    },

    /**
     * The "rotate" and "pinch" methods are essencially same with the exact same 
     * arguments. Only difference is the required parameters. The rotate method 
     * requires "rotation" parameter while the pinch method requires "startRadius" 
     * and "endRadius" parameters.
     *
     * The "pinch" gesture can simulate various 2 finger gestures such as pinch, 
     * spread and/or rotation. The "startRadius" and "endRadius" are required.
     * If endRadius is larger than startRadius, it becomes a spread gesture 
     * otherwise a pinch gesture. 
     *
     * @method pinch
     * @param {Function} cb The callback to execute when the gesture simulation 
     *      is completed.
     * @param {Array} center A center point where the pinch gesture of two fingers
     *      should happen. It is relative to the top left corner of the target 
     *      node element.
     * @param {Number} startRadius A radius of start circle where 2 fingers are 
     *      on when the gesture starts. This paramenter is required.
     * @param {Number} endRadius A radius of end circle where 2 fingers will be on when
     *      the pinch or spread gestures are completed. This parameter is required.
     * @param {Number} duration A duration of the gesture in millisecond.
     * @param {Number} start A start angle(0 degree at 12 o'clock) where the 
     *      gesture should start. Default is 0.  
     * @param {Number} rotation If rotation is desired during the pinch or 
     *      spread gestures, this parameter can be used. Default is 0 degree.  
     */
    pinch: function(cb, center, startRadius, endRadius, duration, start, rotation) {
        var eventQueue,
            i,
            interval = EVENT_INTERVAL,
            touches,
            id = 0,
            r1 = startRadius,   // required
            r2 = endRadius,     // required
            radiusPerStep,
            centerX, centerY,
            startScale, endScale, scalePerStep,
            startRot, endRot, rotPerStep,
            path1 = {start: [], end: []}, // paths for 1st and 2nd fingers. 
            path2 = {start: [], end: []},
            steps,
            touchMove;

        center = this._calculateDefaultPoint(center);

        if(!Y.Lang.isNumber(r1) || !Y.Lang.isNumber(r2) || r1<0 || r2<0) {
            Y.error(NAME+'Invalid startRadius and endRadius detected.');
        }

        if(!Y.Lang.isNumber(duration) || duration <= 0) {
            duration = DEFAULTS.DURATION_PINCH;
        }

        if(!Y.Lang.isNumber(start)) {
            start = 0.0;
        } else {
            start = start%360;
            while(start < 0) {
                start += 360;
            }
        }

        if(!Y.Lang.isNumber(rotation)) {
            rotation = 0.0;
        }

        Y.AsyncQueue.defaults.timeout = interval;
        eventQueue = new Y.AsyncQueue();

        // range determination
        centerX = center[0];
        centerY = center[1];

        startRot = start;
        endRot = start + rotation;

        // 1st finger path
        path1.start = [
            centerX + r1*Math.sin(this._toRadian(startRot)), 
            centerY - r1*Math.cos(this._toRadian(startRot))
        ];
        path1.end   = [
            centerX + r2*Math.sin(this._toRadian(endRot)), 
            centerY - r2*Math.cos(this._toRadian(endRot))
        ];
        
        // 2nd finger path
        path2.start = [
            centerX - r1*Math.sin(this._toRadian(startRot)), 
            centerY + r1*Math.cos(this._toRadian(startRot))
        ];
        path2.end   = [
            centerX - r2*Math.sin(this._toRadian(endRot)), 
            centerY + r2*Math.cos(this._toRadian(endRot))
        ];

        startScale = 1.0;
        endScale = endRadius/startRadius;

        // touch/gesture start
        eventQueue.add({
            fn: function() {
                var coord1, coord2, coord, touches;

                // coordinate for each touch object.
                coord1 = {
                    pageX: path1.start[0], 
                    pageY: path1.start[1],
                    clientX: path1.start[0], 
                    clientY: path1.start[1]
                };
                coord2 = {
                    pageX: path2.start[0], 
                    pageY: path2.start[1],
                    clientX: path2.start[0], 
                    clientY: path2.start[1]
                };
                touches = this._createTouchList([Y.merge({
                    identifier: (id++)   
                }, coord1), Y.merge({
                    identifier: (id++)
                }, coord2)]);

                // coordinate for top level event
                coord = {
                    pageX: (path1.start[0] + path2.start[0])/2,
                    pageY: (path1.start[0] + path2.start[1])/2,
                    clientX: (path1.start[0] + path2.start[0])/2,
                    clientY: (path1.start[0] + path2.start[1])/2
                };

                this._simulateEvent(this.target, TOUCH_START, Y.merge({
                    touches: touches,
                    targetTouches: touches,
                    changedTouches: touches,
                    scale: startScale,
                    rotation: startRot
                }, coord));

                if(Y.UA.ios >= 2.0) {
                    /* gesture starts when the 2nd finger touch starts.
                    * The implementation will fire 1 touch start event for both fingers,
                    * simulating 2 fingers touched on the screen at the same time.
                    */
                    this._simulateEvent(this.target, GESTURE_START, Y.merge({
                        scale: startScale,
                        rotation: startRot
                    }, coord));
                }
            },
            timeout: 0,
            context: this
        });

        // gesture change
        steps = Math.floor(duration/interval);
        radiusPerStep = (r2 - r1)/steps;
        scalePerStep = (endScale - startScale)/steps;
        rotPerStep = (endRot - startRot)/steps;
        
        touchMove = function(step) {
            var radius = r1 + (radiusPerStep)*step,
                px1 = centerX + radius*Math.sin(this._toRadian(startRot + rotPerStep*step)),
                py1 = centerY - radius*Math.cos(this._toRadian(startRot + rotPerStep*step)),
                px2 = centerX - radius*Math.sin(this._toRadian(startRot + rotPerStep*step)),
                py2 = centerY + radius*Math.cos(this._toRadian(startRot + rotPerStep*step)),
                px = (px1+px2)/2,
                py = (py1+py2)/2,
                coord1, coord2, coord, touches;

            // coordinate for each touch object.    
            coord1 = {
                pageX: px1,
                pageY: py1,
                clientX: px1,
                clientY: py1
            };
            coord2 = {
                pageX: px2,
                pageY: py2,
                clientX: px2,
                clientY: py2
            };
            touches = this._createTouchList([Y.merge({
                identifier: (id++)   
            }, coord1), Y.merge({
                identifier: (id++)
            }, coord2)]);

            // coordinate for top level event
            coord = {
                pageX: px,
                pageY: py,
                clientX: px,
                clientY: py
            };

            this._simulateEvent(this.target, TOUCH_MOVE, Y.merge({
                touches: touches,
                targetTouches: touches,
                changedTouches: touches,
                scale: startScale + scalePerStep*step,
                rotation: startRot + rotPerStep*step
            }, coord));

            if(Y.UA.ios >= 2.0) {
                this._simulateEvent(this.target, GESTURE_CHANGE, Y.merge({
                    scale: startScale + scalePerStep*step,
                    rotation: startRot + rotPerStep*step
                }, coord));
            }
        };

        for (i=0; i < steps; i++) {
            eventQueue.add({
                fn: touchMove,
                args: [i],
                context: this
            });
        }

        // gesture end
        eventQueue.add({
            fn: function() {
                var emptyTouchList = this._getEmptyTouchList(),
                    coord1, coord2, coord, touches;

                // coordinate for each touch object.
                coord1 = {
                    pageX: path1.end[0], 
                    pageY: path1.end[1],
                    clientX: path1.end[0], 
                    clientY: path1.end[1]
                };
                coord2 = {
                    pageX: path2.end[0], 
                    pageY: path2.end[1],
                    clientX: path2.end[0], 
                    clientY: path2.end[1]
                };
                touches = this._createTouchList([Y.merge({
                    identifier: (id++)   
                }, coord1), Y.merge({
                    identifier: (id++)
                }, coord2)]);

                // coordinate for top level event
                coord = {
                    pageX: (path1.end[0] + path2.end[0])/2,
                    pageY: (path1.end[0] + path2.end[1])/2,
                    clientX: (path1.end[0] + path2.end[0])/2,
                    clientY: (path1.end[0] + path2.end[1])/2
                };  

                if(Y.UA.ios >= 2.0) {
                    this._simulateEvent(this.target, GESTURE_END, Y.merge({
                        scale: endScale,
                        rotation: endRot
                    }, coord));
                }

                this._simulateEvent(this.target, TOUCH_END, Y.merge({
                    touches: emptyTouchList,
                    targetTouches: emptyTouchList,
                    changedTouches: touches,
                    scale: endScale,
                    rotation: endRot
                }, coord));
            },
            context: this
        });

        if(cb && Y.Lang.isFunction(cb)) {
            eventQueue.add({
                fn: cb,

                // by default, the callback runs the node context where 
                // simulateGesture method is called.
                context: this.node

                //TODO: Use args to pass error object as 1st param if there is an error.
                //args: 
            });
        }

        eventQueue.run();
    },

    /**
     * The "tap" gesture can be used for various single touch point gestures 
     * such as single tap, N number of taps, long press. The default is a single 
     * tap.
     * 
     * @method tap
     * @param {Function} cb The callback to execute when the gesture simulation 
     *      is completed.
     * @param {Array} point A point(relative to the top left corner of the 
     *      target node element) where the tap gesture should start. The default 
     *      is the center of the taget node.
     * @param {Number} times The number of taps. Default is 1.
     * @param {Number} hold The hold time in milliseconds between "touchstart" and
     *      "touchend" event generation. Default is 10ms.
     * @param {Number} delay The time gap in millisecond between taps if this
     *      gesture has more than 1 tap. Default is 10ms.
     */
    tap: function(cb, point, times, hold, delay) {           
        var eventQueue = new Y.AsyncQueue(),
            emptyTouchList = this._getEmptyTouchList(),
            touches,
            coord,
            i,
            touchStart,
            touchEnd;

        point = this._calculateDefaultPoint(point);

        if(!Y.Lang.isNumber(times) || times < 1) {
            times = 1;
        }

        if(!Y.Lang.isNumber(hold)) {
            hold = DEFAULTS.HOLD_TAP;
        }

        if(!Y.Lang.isNumber(delay)) {
            delay = DEFAULTS.DELAY_TAP;
        }

        coord = {
            pageX: point[0], 
            pageY: point[1],
            clientX: point[0], 
            clientY: point[1]
        };

        touches = this._createTouchList([Y.merge({identifier: 0}, coord)]);

        touchStart = function() {
            this._simulateEvent(this.target, TOUCH_START, Y.merge({
                touches: touches,
                targetTouches: touches,
                changedTouches: touches
            }, coord));
        };
        
        touchEnd = function() {
            this._simulateEvent(this.target, TOUCH_END, Y.merge({
                touches: emptyTouchList,
                targetTouches: emptyTouchList,
                changedTouches: touches
            }, coord));
        };
        
        for (i=0; i < times; i++) {
            eventQueue.add({
                fn: touchStart,
                context: this,
                timeout: (i === 0)? 0 : delay
            });

            eventQueue.add({
                fn: touchEnd,
                context: this,
                timeout: hold
            });
        }

        if(times > 1 && !SUPPORTS_TOUCH) {
            eventQueue.add({
                fn: function() {
                    this._simulateEvent(this.target, MOUSE_DBLCLICK, coord);
                },
                context: this
            });
        }

        if(cb && Y.Lang.isFunction(cb)) {
            eventQueue.add({
                fn: cb,

                // by default, the callback runs the node context where 
                // simulateGesture method is called.
                context: this.node

                //TODO: Use args to pass error object as 1st param if there is an error.
                //args: 
            });
        }

        eventQueue.run();
    },

    /**
     * The "flick" gesture is a specialized "move" that has some velocity 
     * and the movement always runs either x or y axis. The velocity is calculated
     * with "distance" and "duration" arguments. If the calculated velocity is 
     * below than the minimum velocity, the given duration will be ignored and 
     * new duration will be created to make a valid flick gesture.
     *   
     * @method flick
     * @param {Function} cb The callback to execute when the gesture simulation 
     *      is completed.
     * @param {Array} point A point(relative to the top left corner of the 
     *      target node element) where the flick gesture should start. The default 
     *      is the center of the taget node.
     * @param {String} axis Either "x" or "y".
     * @param {Number} distance A distance in pixels to flick.
     * @param {Number} duration A duration of the gesture in millisecond.
     * 
     */
    flick: function(cb, point, axis, distance, duration) {
        var path;

        point = this._calculateDefaultPoint(point);

        if(!Y.Lang.isString(axis)) {
            axis = X_AXIS;
        } else {
            axis = axis.toLowerCase();
            if(axis !== X_AXIS && axis !== Y_AXIS) {
                Y.error(NAME+'(flick): Only x or y axis allowed');
            }
        }

        if(!Y.Lang.isNumber(distance)) { 
            distance = DEFAULTS.DISTANCE_FLICK; 
        }

        if(!Y.Lang.isNumber(duration)){
            duration = DEFAULTS.DURATION_FLICK; // ms
        } else {
            if(duration > DEFAULTS.MAX_DURATION_FLICK) {
                duration = DEFAULTS.MAX_DURATION_FLICK;
            }
        }

        /**
         * Check if too slow for a flick.
         * Adjust duration if the calculated velocity is less than 
         * the minimum velcocity to be claimed as a flick.
         */
        if(Math.abs(distance)/duration < DEFAULTS.MIN_VELOCITY_FLICK) {
            duration = Math.abs(distance)/DEFAULTS.MIN_VELOCITY_FLICK;
        }

        path = {
            start: Y.clone(point),
            end: [
                (axis === X_AXIS) ? point[0]+distance : point[0],
                (axis === Y_AXIS) ? point[1]+distance : point[1]
            ]
        };

        this._move(cb, path, duration);
    },

    /**
     * The "move" gesture simulate the movement of any direction between 
     * the straight line of start and end point for the given duration.
     * The path argument is an object with "point", "xdist" and "ydist" properties.
     * The "point" property is an array with x and y coordinations(relative to the
     * top left corner of the target node element) while "xdist" and "ydist" 
     * properties are used for the distance along the x and y axis. A negative 
     * distance number can be used to drag either left or up direction. 
     * 
     * If no arguments are given, it will simulate the default move, which
     * is moving 200 pixels from the center of the element to the positive X-axis 
     * direction for 1 sec.
     * 
     * @method move
     * @param {Function} cb The callback to execute when the gesture simulation 
     *      is completed.
     * @param {Object} path An object with "point", "xdist" and "ydist".
     * @param {Number} duration A duration of the gesture in millisecond.
     */
    move: function(cb, path, duration) {
        var convertedPath;

        if(!Y.Lang.isObject(path)) {
            path = {
                point: this._calculateDefaultPoint([]),
                xdist: DEFAULTS.DISTANCE_MOVE,
                ydist: 0
            };
        } else {
            // convert to the page coordination
            if(!Y.Lang.isArray(path.point)) {
                path.point = this._calculateDefaultPoint([]);
            } else {
                path.point = this._calculateDefaultPoint(path.point);
            }

            if(!Y.Lang.isNumber(path.xdist)) {
                path.xdist = DEFAULTS.DISTANCE_MOVE;
            }

            if(!Y.Lang.isNumber(path.ydist)) {
                path.ydist = 0;
            }
        }

        if(!Y.Lang.isNumber(duration)){
            duration = DEFAULTS.DURATION_MOVE; // ms
        } else {
            if(duration > DEFAULTS.MAX_DURATION_MOVE) {
                duration = DEFAULTS.MAX_DURATION_MOVE;
            }
        }

        convertedPath = {
            start: Y.clone(path.point),
            end: [path.point[0]+path.xdist, path.point[1]+path.ydist]
        };

        this._move(cb, convertedPath, duration);
    },

    /**
     * A base method on top of "move" and "flick" methods. The method takes
     * the path with start/end properties and duration to generate a set of 
     * touch events for the movement gesture. 
     *
     * @method _move
     * @private
     * @param {Function} cb The callback to execute when the gesture simulation 
     *      is completed.
     * @param {Object} path An object with "start" and "end" properties. Each 
     *      property should be an array with x and y coordination (e.g. start: [100, 50])
     * @param {Number} duration A duration of the gesture in millisecond. 
     */
    _move: function(cb, path, duration) {
        var eventQueue,
            i,
            interval = EVENT_INTERVAL,
            steps, stepX, stepY,
            id = 0,
            touchMove;

        if(!Y.Lang.isNumber(duration)){
            duration = DEFAULTS.DURATION_MOVE; // ms
        } else {
            if(duration > DEFAULTS.MAX_DURATION_MOVE) {
                duration = DEFAULTS.MAX_DURATION_MOVE;
            }
        }

        if(!Y.Lang.isObject(path)) {
            path = {
                start: [
                    START_PAGEX, 
                    START_PAGEY
                ], 
                end: [
                    START_PAGEX + DEFAULTS.DISTANCE_MOVE, 
                    START_PAGEY
                ]
            };
        } else {
            if(!Y.Lang.isArray(path.start)) {
                path.start = [
                    START_PAGEX, 
                    START_PAGEY
                ];
            }
            if(!Y.Lang.isArray(path.end)) {
                path.end = [
                    START_PAGEX + DEFAULTS.DISTANCE_MOVE, 
                    START_PAGEY
                ];
            }
        }

        Y.AsyncQueue.defaults.timeout = interval;
        eventQueue = new Y.AsyncQueue();

        // start
        eventQueue.add({
            fn: function() {
                var coord = {
                        pageX: path.start[0], 
                        pageY: path.start[1],
                        clientX: path.start[0], 
                        clientY: path.start[1]
                    }, 
                    touches = this._createTouchList([
                        Y.merge({identifier: (id++)}, coord)
                    ]);

                this._simulateEvent(this.target, TOUCH_START, Y.merge({
                    touches: touches,
                    targetTouches: touches,
                    changedTouches: touches
                }, coord));
            },
            timeout: 0,
            context: this
        });

        // move
        steps = Math.floor(duration/interval);
        stepX = (path.end[0] - path.start[0])/steps;
        stepY = (path.end[1] - path.start[1])/steps;

        touchMove = function(step) {
            var px = path.start[0]+(stepX * step),
                py = path.start[1]+(stepY * step), 
                coord = {
                    pageX: px, 
                    pageY: py,
                    clientX: px,
                    clientY: py
                }, 
                touches = this._createTouchList([
                    Y.merge({identifier: (id++)}, coord)
                ]);

            this._simulateEvent(this.target, TOUCH_MOVE, Y.merge({
                touches: touches,
                targetTouches: touches,
                changedTouches: touches
            }, coord));
        };

        for (i=0; i < steps; i++) {
            eventQueue.add({
                fn: touchMove,
                args: [i],
                context: this
            });
        }

        // last move
        eventQueue.add({
            fn: function() {
                var coord = {
                        pageX: path.end[0], 
                        pageY: path.end[1],
                        clientX: path.end[0], 
                        clientY: path.end[1]
                    },
                    touches = this._createTouchList([
                        Y.merge({identifier: id}, coord)
                    ]);

                this._simulateEvent(this.target, TOUCH_MOVE, Y.merge({
                    touches: touches,
                    targetTouches: touches,
                    changedTouches: touches
                }, coord));
            },
            timeout: 0,
            context: this
        });

        // end
        eventQueue.add({
            fn: function() {
                var coord = {
                    pageX: path.end[0], 
                    pageY: path.end[1],
                    clientX: path.end[0], 
                    clientY: path.end[1]
                },
                emptyTouchList = this._getEmptyTouchList(),
                touches = this._createTouchList([
                    Y.merge({identifier: id}, coord)
                ]);

                this._simulateEvent(this.target, TOUCH_END, Y.merge({
                    touches: emptyTouchList,
                    targetTouches: emptyTouchList,
                    changedTouches: touches
                }, coord));
            },
            context: this
        });
        
        if(cb && Y.Lang.isFunction(cb)) {
            eventQueue.add({
                fn: cb,

                // by default, the callback runs the node context where 
                // simulateGesture method is called.
                context: this.node

                //TODO: Use args to pass error object as 1st param if there is an error.
                //args: 
            });
        }
        
        eventQueue.run();
    },

    /**
     * Helper method to return a singleton instance of empty touch list.
     * 
     * @method _getEmptyTouchList
     * @private
     * @return {TouchList | Array} An empty touch list object.
     */
    _getEmptyTouchList: function() {
        if(!emptyTouchList) {
            emptyTouchList = this._createTouchList([]);
        }

        return emptyTouchList;
    },

    /**
     * Helper method to convert an array with touch points to TouchList object as
     * defined in http://www.w3.org/TR/touch-events/
     * 
     * @method _createTouchList
     * @private
     * @param {Array} touchPoints 
     * @return {TouchList | Array} If underlaying platform support creating touch list
     *      a TouchList object will be returned otherwise a fake Array object 
     *      will be returned.
     */
    _createTouchList: function(touchPoints) {
        /*
        * Android 4.0.3 emulator:
        * Native touch api supported starting in version 4.0 (Ice Cream Sandwich).
        * However the support seems limited. In Android 4.0.3 emulator, I got
        * "TouchList is not defined".
        */
        var touches = [],
            touchList,
            self = this;

        if(!!touchPoints && Y.Lang.isArray(touchPoints)) {
            if(Y.UA.android && Y.UA.android >= 4.0 || Y.UA.ios && Y.UA.ios >= 2.0) {
                Y.each(touchPoints, function(point) {
                    if(!point.identifier) {point.identifier = 0;}
                    if(!point.pageX) {point.pageX = 0;}
                    if(!point.pageY) {point.pageY = 0;}
                    if(!point.screenX) {point.screenX = 0;}
                    if(!point.screenY) {point.screenY = 0;}

                    touches.push(document.createTouch(Y.config.win, 
                        self.target,
                        point.identifier, 
                        point.pageX, point.pageY, 
                        point.screenX, point.screenY));
                });

                touchList = document.createTouchList.apply(document, touches);
            } else if(Y.UA.ios && Y.UA.ios < 2.0) { 
                Y.error(NAME+': No touch event simulation framework present.');
            } else {
                // this will inclide android(Y.UA.android && Y.UA.android < 4.0) 
                // and desktops among all others. 

                /**
                 * Touch APIs are broken in androids older than 4.0. We will use 
                 * simulated touch apis for these versions. 
                 */
                touchList = [];
                Y.each(touchPoints, function(point) {
                    if(!point.identifier) {point.identifier = 0;}
                    if(!point.clientX)  {point.clientX = 0;}
                    if(!point.clientY)  {point.clientY = 0;}
                    if(!point.pageX)    {point.pageX = 0;}
                    if(!point.pageY)    {point.pageY = 0;}
                    if(!point.screenX)  {point.screenX = 0;}
                    if(!point.screenY)  {point.screenY = 0;}

                    touchList.push({
                        target: self.target,
                        identifier: point.identifier,
                        clientX: point.clientX,
                        clientY: point.clientY,
                        pageX: point.pageX,
                        pageY: point.pageY,
                        screenX: point.screenX,
                        screenY: point.screenY
                    });
                });

                touchList.item = function(i) {
                    return touchList[i];
                };
            }
        } else {
            Y.error(NAME+': Invalid touchPoints passed');
        }

        return touchList;
    },

    /**
     * @method _simulateEvent
     * @private
     * @param {HTMLElement} target The DOM element that's the target of the event.
     * @param {String} type The type of event or name of the supported gesture to simulate 
     *      (i.e., "click", "doubletap", "flick").
     * @param {Object} options (Optional) Extra options to copy onto the event object. 
     *      For gestures, options are used to refine the gesture behavior.
     * @return {void}
     */
    _simulateEvent: function(target, type, options) {
        var touches;

        if (touchEvents[type]) {
            if(SUPPORTS_TOUCH) {
                Y.Event.simulate(target, type, options);
            } else {
                // simulate using mouse events if touch is not applicable on this platform.
                // but only single touch event can be simulated.
                if(this._isSingleTouch(options.touches, options.targetTouches, options.changedTouches)) {
                    type = {
                        touchstart: MOUSE_DOWN,
                        touchmove: MOUSE_MOVE,
                        touchend: MOUSE_UP
                    }[type];

                    options.button = 0;
                    options.relatedTarget = null; // since we are not using mouseover event.

                    // touchend has none in options.touches.
                    touches = (type === MOUSE_UP)? options.changedTouches : options.touches;

                    options = Y.mix(options, {
                        screenX: touches.item(0).screenX,
                        screenY: touches.item(0).screenY,
                        clientX: touches.item(0).clientX,
                        clientY: touches.item(0).clientY
                    }, true);

                    Y.Event.simulate(target, type, options);

                    if(type == MOUSE_UP) {
                        Y.Event.simulate(target, MOUSE_CLICK, options);
                    }
                } else {
                    Y.error("_simulateEvent(): Event '" + type + "' has multi touch objects that can't be simulated in your platform.");
                }
            }
        } else {
            // pass thru for all non touch events
            Y.Event.simulate(target, type, options);
        }
    },

    /**
     * Helper method to check the single touch.
     * @method _isSingleTouch
     * @private
     * @param {TouchList} touches
     * @param {TouchList} targetTouches
     * @param {TouchList} changedTouches
     */
    _isSingleTouch: function(touches, targetTouches, changedTouches) {
        return (touches && (touches.length <= 1)) && 
            (targetTouches && (targetTouches.length <= 1)) &&
            (changedTouches && (changedTouches.length <= 1));
    }
};

/**
 * A gesture simulation class.
 */
Y.GestureSimulation = Simulations;

/**
 * Various simulation default behavior properties. If user override 
 * Y.GestureSimulation.defaults, overriden values will be used and this 
 * should be done before the gesture simulation.  
 */
Y.GestureSimulation.defaults = DEFAULTS;

/**
 * The high level gesture names that YUI knows how to simulate.
 */
Y.GestureSimulation.GESTURES = gestureNames;

/**
 * Simulates the higher user level gesture of the given name on a target. 
 * This method generates a set of low level touch events(Apple specific gesture 
 * events as well for the iOS platforms) asynchronously. Note that gesture  
 * simulation is relying on `Y.Event.simulate()` method to generate 
 * the touch events under the hood. The `Y.Event.simulate()` method
 * itself is a synchronous method.
 * 
 * Users are suggested to use `Node.simulateGesture()` method which 
 * basically calls this method internally. Supported gestures are `tap`, 
 * `doubletap`, `press`, `move`, `flick`, `pinch` and `rotate`.
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
 * @param {HTMLElement|Node} node The YUI node or HTML element that's the target 
 *      of the event.
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
 * @for Event
 * @static
 */
Y.Event.simulateGesture = function(node, name, options, cb) {

    node = Y.one(node);    

    var sim = new Y.GestureSimulation(node);
    name = name.toLowerCase();

    if(!cb && Y.Lang.isFunction(options)) {
        cb = options;
        options = {};
    }

    options = options || {};

    if (gestureNames[name]) {
        switch(name) {
            // single-touch: point gestures 
            case 'tap':
                sim.tap(cb, options.point, options.times, options.hold, options.delay);
                break;
            case 'doubletap':
                sim.tap(cb, options.point, 2);
                break;
            case 'press':
                if(!Y.Lang.isNumber(options.hold)) {
                    options.hold = DEFAULTS.HOLD_PRESS;
                } else if(options.hold < DEFAULTS.MIN_HOLD_PRESS) {
                    options.hold = DEFAULTS.MIN_HOLD_PRESS;
                } else if(options.hold > DEFAULTS.MAX_HOLD_PRESS) {
                    options.hold = DEFAULTS.MAX_HOLD_PRESS;
                }
                sim.tap(cb, options.point, 1, options.hold);
                break;

            // single-touch: move gestures 
            case 'move':
                sim.move(cb, options.path, options.duration);
                break;
            case 'flick':
                sim.flick(cb, options.point, options.axis, options.distance, 
                    options.duration);
                break;

            // multi-touch: pinch/rotation gestures
            case 'pinch':
                sim.pinch(cb, options.center, options.r1, options.r2, 
                    options.duration, options.start, options.rotation);
                break;    
            case 'rotate':
                sim.rotate(cb, options.center, options.r1, options.r2, 
                    options.duration, options.start, options.rotation);
                break;
        }
    } else {
        Y.error(NAME+': Not a supported gesture simulation: '+name);
    }
};


}, '3.7.3', {"requires": ["async-queue", "event-simulate", "node-screen"]});
