/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('anim-base', function (Y, NAME) {

/**
* The Animation Utility provides an API for creating advanced transitions.
* @module anim
*/

/**
* Provides the base Anim class, for animating numeric properties.
*
* @module anim
* @submodule anim-base
*/

    /**
     * A class for constructing animation instances.
     * @class Anim
     * @for Anim
     * @constructor
     * @extends Base
     */

    var RUNNING = 'running',
        START_TIME = 'startTime',
        ELAPSED_TIME = 'elapsedTime',
        /**
        * @for Anim
        * @event start
        * @description fires when an animation begins.
        * @param {Event} ev The start event.
        * @type Event.Custom
        */
        START = 'start',

        /**
        * @event tween
        * @description fires every frame of the animation.
        * @param {Event} ev The tween event.
        * @type Event.Custom
        */
        TWEEN = 'tween',

        /**
        * @event end
        * @description fires after the animation completes.
        * @param {Event} ev The end event.
        * @type Event.Custom
        */
        END = 'end',
        NODE = 'node',
        PAUSED = 'paused',
        REVERSE = 'reverse', // TODO: cleanup
        ITERATION_COUNT = 'iterationCount',

        NUM = Number;

    var _running = {},
        _timer;

    Y.Anim = function() {
        Y.Anim.superclass.constructor.apply(this, arguments);
        Y.Anim._instances[Y.stamp(this)] = this;
    };

    Y.Anim.NAME = 'anim';

    Y.Anim._instances = {};

    /**
     * Regex of properties that should use the default unit.
     *
     * @property RE_DEFAULT_UNIT
     * @static
     */
    Y.Anim.RE_DEFAULT_UNIT = /^width|height|top|right|bottom|left|margin.*|padding.*|border.*$/i;

    /**
     * The default unit to use with properties that pass the RE_DEFAULT_UNIT test.
     *
     * @property DEFAULT_UNIT
     * @static
     */
    Y.Anim.DEFAULT_UNIT = 'px';

    Y.Anim.DEFAULT_EASING = function (t, b, c, d) {
        return c * t / d + b; // linear easing
    };

    /**
     * Time in milliseconds passed to setInterval for frame processing 
     *
     * @property intervalTime
     * @default 20
     * @static
     */
    Y.Anim._intervalTime = 20;

    /**
     * Bucket for custom getters and setters
     *
     * @property behaviors
     * @static
     */
    Y.Anim.behaviors = {
        left: {
            get: function(anim, attr) {
                return anim._getOffset(attr);
            }
        }
    };

    Y.Anim.behaviors.top = Y.Anim.behaviors.left;

    /**
     * The default setter to use when setting object properties.
     *
     * @property DEFAULT_SETTER
     * @static
     */
    Y.Anim.DEFAULT_SETTER = function(anim, att, from, to, elapsed, duration, fn, unit) {
        var node = anim._node,
            domNode = node._node,
            val = fn(elapsed, NUM(from), NUM(to) - NUM(from), duration);

        if (domNode) {
            if ('style' in domNode && (att in domNode.style || att in Y.DOM.CUSTOM_STYLES)) {
                unit = unit || '';
                node.setStyle(att, val + unit);
            } else if ('attributes' in domNode && att in domNode.attributes) {
                node.setAttribute(att, val);
            } else if (att in domNode) {
                domNode[att] = val;
            }
        } else if (node.set) {
            node.set(att, val);
        } else if (att in node) {
            node[att] = val;
        }
    };

    /**
     * The default getter to use when getting object properties.
     *
     * @property DEFAULT_GETTER
     * @static
     */
    Y.Anim.DEFAULT_GETTER = function(anim, att) {
        var node = anim._node,
            domNode = node._node,
            val = '';

        if (domNode) {
            if ('style' in domNode && (att in domNode.style || att in Y.DOM.CUSTOM_STYLES)) {
                val = node.getComputedStyle(att);
            } else if ('attributes' in domNode && att in domNode.attributes) {
                val = node.getAttribute(att);
            } else if (att in domNode) {
                val = domNode[att];
            }
        } else if (node.get) {
            val = node.get(att);
        } else if (att in node) {
            val = node[att];
        }

        return val;
    };

    Y.Anim.ATTRS = {
        /**
         * The object to be animated.
         * @attribute node
         * @type Node
         */
        node: {
            setter: function(node) {
                if (node) {
                    if (typeof node == 'string' || node.nodeType) {
                        node = Y.one(node);
                    }
                }

                this._node = node;
                if (!node) {
                    Y.log(node + ' is not a valid node', 'warn', 'Anim');
                }
                return node;
            }
        },

        /**
         * The length of the animation.  Defaults to "1" (second).
         * @attribute duration
         * @type NUM
         */
        duration: {
            value: 1
        },

        /**
         * The method that will provide values to the attribute(s) during the animation. 
         * Defaults to "Easing.easeNone".
         * @attribute easing
         * @type Function
         */
        easing: {
            value: Y.Anim.DEFAULT_EASING,

            setter: function(val) {
                if (typeof val === 'string' && Y.Easing) {
                    return Y.Easing[val];
                }
            }
        },

        /**
         * The starting values for the animated properties.
         *
         * Fields may be strings, numbers, or functions.
         * If a function is used, the return value becomes the from value.
         * If no from value is specified, the DEFAULT_GETTER will be used.
         * Supports any unit, provided it matches the "to" (or default)
         * unit (e.g. `{width: '10em', color: 'rgb(0, 0, 0)', borderColor: '#ccc'}`).
         *
         * If using the default ('px' for length-based units), the unit may be omitted
         * (e.g. `{width: 100}, borderColor: 'ccc'}`, which defaults to pixels
         * and hex, respectively).
         *
         * @attribute from
         * @type Object
         */
        from: {},

        /**
         * The ending values for the animated properties.
         *
         * Fields may be strings, numbers, or functions.
         * Supports any unit, provided it matches the "from" (or default)
         * unit (e.g. `{width: '50%', color: 'red', borderColor: '#ccc'}`).
         *
         * If using the default ('px' for length-based units), the unit may be omitted
         * (e.g. `{width: 100, borderColor: 'ccc'}`, which defaults to pixels
         * and hex, respectively).
         *
         * @attribute to
         * @type Object
         */
        to: {},

        /**
         * Date stamp for the first frame of the animation.
         * @attribute startTime
         * @type Int
         * @default 0 
         * @readOnly
         */
        startTime: {
            value: 0,
            readOnly: true
        },

        /**
         * Current time the animation has been running.
         * @attribute elapsedTime
         * @type Int
         * @default 0 
         * @readOnly
         */
        elapsedTime: {
            value: 0,
            readOnly: true
        },

        /**
         * Whether or not the animation is currently running.
         * @attribute running 
         * @type Boolean
         * @default false 
         * @readOnly
         */
        running: {
            getter: function() {
                return !!_running[Y.stamp(this)];
            },
            value: false,
            readOnly: true
        },

        /**
         * The number of times the animation should run 
         * @attribute iterations
         * @type Int
         * @default 1 
         */
        iterations: {
            value: 1
        },

        /**
         * The number of iterations that have occurred.
         * Resets when an animation ends (reaches iteration count or stop() called). 
         * @attribute iterationCount
         * @type Int
         * @default 0
         * @readOnly
         */
        iterationCount: {
            value: 0,
            readOnly: true
        },

        /**
         * How iterations of the animation should behave. 
         * Possible values are "normal" and "alternate".
         * Normal will repeat the animation, alternate will reverse on every other pass.
         *
         * @attribute direction
         * @type String
         * @default "normal"
         */
        direction: {
            value: 'normal' // | alternate (fwd on odd, rev on even per spec)
        },

        /**
         * Whether or not the animation is currently paused.
         * @attribute paused 
         * @type Boolean
         * @default false 
         * @readOnly
         */
        paused: {
            readOnly: true,
            value: false
        },

        /**
         * If true, animation begins from last frame
         * @attribute reverse
         * @type Boolean
         * @default false 
         */
        reverse: {
            value: false
        }


    };

    /**
     * Runs all animation instances.
     * @method run
     * @static
     */    
    Y.Anim.run = function() {
        var instances = Y.Anim._instances;
        for (var i in instances) {
            if (instances[i].run) {
                instances[i].run();
            }
        }
    };

    /**
     * Pauses all animation instances.
     * @method pause
     * @static
     */    
    Y.Anim.pause = function() {
        for (var i in _running) { // stop timer if nothing running
            if (_running[i].pause) {
                _running[i].pause();
            }
        }

        Y.Anim._stopTimer();
    };

    /**
     * Stops all animation instances.
     * @method stop
     * @static
     */    
    Y.Anim.stop = function() {
        for (var i in _running) { // stop timer if nothing running
            if (_running[i].stop) {
                _running[i].stop();
            }
        }
        Y.Anim._stopTimer();
    };
    
    Y.Anim._startTimer = function() {
        if (!_timer) {
            _timer = setInterval(Y.Anim._runFrame, Y.Anim._intervalTime);
        }
    };

    Y.Anim._stopTimer = function() {
        clearInterval(_timer);
        _timer = 0;
    };

    /**
     * Called per Interval to handle each animation frame.
     * @method _runFrame
     * @private
     * @static
     */    
    Y.Anim._runFrame = function() {
        var done = true;
        for (var anim in _running) {
            if (_running[anim]._runFrame) {
                done = false;
                _running[anim]._runFrame();
            }
        }

        if (done) {
            Y.Anim._stopTimer();
        }
    };

    Y.Anim.RE_UNITS = /^(-?\d*\.?\d*){1}(em|ex|px|in|cm|mm|pt|pc|%)*$/;

    var proto = {
        /**
         * Starts or resumes an animation.
         * @method run
         * @chainable
         */    
        run: function() {
            if (this.get(PAUSED)) {
                this._resume();
            } else if (!this.get(RUNNING)) {
                this._start();
            }
            return this;
        },

        /**
         * Pauses the animation and
         * freezes it in its current state and time.
         * Calling run() will continue where it left off.
         * @method pause
         * @chainable
         */    
        pause: function() {
            if (this.get(RUNNING)) {
                this._pause();
            }
            return this;
        },

        /**
         * Stops the animation and resets its time.
         * @method stop
         * @param {Boolean} finish If true, the animation will move to the last frame
         * @chainable
         */    
        stop: function(finish) {
            if (this.get(RUNNING) || this.get(PAUSED)) {
                this._end(finish);
            }
            return this;
        },

        _added: false,

        _start: function() {
            this._set(START_TIME, new Date() - this.get(ELAPSED_TIME));
            this._actualFrames = 0;
            if (!this.get(PAUSED)) {
                this._initAnimAttr();
            }
            _running[Y.stamp(this)] = this;
            Y.Anim._startTimer();

            this.fire(START);
        },

        _pause: function() {
            this._set(START_TIME, null);
            this._set(PAUSED, true);
            delete _running[Y.stamp(this)];

            /**
            * @event pause
            * @description fires when an animation is paused.
            * @param {Event} ev The pause event.
            * @type Event.Custom
            */
            this.fire('pause');
        },

        _resume: function() {
            this._set(PAUSED, false);
            _running[Y.stamp(this)] = this;
            this._set(START_TIME, new Date() - this.get(ELAPSED_TIME));
            Y.Anim._startTimer();

            /**
            * @event resume
            * @description fires when an animation is resumed (run from pause).
            * @param {Event} ev The pause event.
            * @type Event.Custom
            */
            this.fire('resume');
        },

        _end: function(finish) {
            var duration = this.get('duration') * 1000;
            if (finish) { // jump to last frame
                this._runAttrs(duration, duration, this.get(REVERSE));
            }

            this._set(START_TIME, null);
            this._set(ELAPSED_TIME, 0);
            this._set(PAUSED, false);

            delete _running[Y.stamp(this)];
            this.fire(END, {elapsed: this.get(ELAPSED_TIME)});
        },

        _runFrame: function() {
            var d = this._runtimeAttr.duration,
                t = new Date() - this.get(START_TIME),
                reverse = this.get(REVERSE),
                done = (t >= d),
                attribute,
                setter;
                
            this._runAttrs(t, d, reverse);
            this._actualFrames += 1;
            this._set(ELAPSED_TIME, t);

            this.fire(TWEEN);
            if (done) {
                this._lastFrame();
            }
        },

        _runAttrs: function(t, d, reverse) {
            var attr = this._runtimeAttr,
                customAttr = Y.Anim.behaviors,
                easing = attr.easing,
                lastFrame = d,
                done = false,
                attribute,
                setter,
                i;

            if (t >= d) {
                done = true;
            }

            if (reverse) {
                t = d - t;
                lastFrame = 0;
            }

            for (i in attr) {
                if (attr[i].to) {
                    attribute = attr[i];
                    setter = (i in customAttr && 'set' in customAttr[i]) ?
                            customAttr[i].set : Y.Anim.DEFAULT_SETTER;

                    if (!done) {
                        setter(this, i, attribute.from, attribute.to, t, d, easing, attribute.unit); 
                    } else {
                        setter(this, i, attribute.from, attribute.to, lastFrame, d, easing, attribute.unit); 
                    }
                }
            }


        },

        _lastFrame: function() {
            var iter = this.get('iterations'),
                iterCount = this.get(ITERATION_COUNT);

            iterCount += 1;
            if (iter === 'infinite' || iterCount < iter) {
                if (this.get('direction') === 'alternate') {
                    this.set(REVERSE, !this.get(REVERSE)); // flip it
                }
                /**
                * @event iteration
                * @description fires when an animation begins an iteration.
                * @param {Event} ev The iteration event.
                * @type Event.Custom
                */
                this.fire('iteration');
            } else {
                iterCount = 0;
                this._end();
            }

            this._set(START_TIME, new Date());
            this._set(ITERATION_COUNT, iterCount);
        },

        _initAnimAttr: function() {
            var from = this.get('from') || {},
                to = this.get('to') || {},
                attr = {
                    duration: this.get('duration') * 1000,
                    easing: this.get('easing')
                },
                customAttr = Y.Anim.behaviors,
                node = this.get(NODE), // implicit attr init
                unit, begin, end;

            Y.each(to, function(val, name) {
                if (typeof val === 'function') {
                    val = val.call(this, node);
                }

                begin = from[name];
                if (begin === undefined) {
                    begin = (name in customAttr && 'get' in customAttr[name])  ?
                            customAttr[name].get(this, name) : Y.Anim.DEFAULT_GETTER(this, name);
                } else if (typeof begin === 'function') {
                    begin = begin.call(this, node);
                }

                var mFrom = Y.Anim.RE_UNITS.exec(begin);
                var mTo = Y.Anim.RE_UNITS.exec(val);

                begin = mFrom ? mFrom[1] : begin;
                end = mTo ? mTo[1] : val;
                unit = mTo ? mTo[2] : mFrom ?  mFrom[2] : ''; // one might be zero TODO: mixed units

                if (!unit && Y.Anim.RE_DEFAULT_UNIT.test(name)) {
                    unit = Y.Anim.DEFAULT_UNIT;
                }

                if (!begin || !end) {
                    Y.error('invalid "from" or "to" for "' + name + '"', 'Anim');
                    return;
                }

                attr[name] = {
                    from: Y.Lang.isObject(begin) ? Y.clone(begin) : begin,
                    to: end,
                    unit: unit
                };

            }, this);

            this._runtimeAttr = attr;
        },


        // TODO: move to computedStyle? (browsers dont agree on default computed offsets)
        _getOffset: function(attr) {
            var node = this._node,
                val = node.getComputedStyle(attr),
                get = (attr === 'left') ? 'getX': 'getY',
                set = (attr === 'left') ? 'setX': 'setY';

            if (val === 'auto') {
                var position = node.getStyle('position');
                if (position === 'absolute' || position === 'fixed') {
                    val = node[get]();
                    node[set](val);
                } else {
                    val = 0;
                }
            }

            return val;
        },

        destructor: function() {
            delete Y.Anim._instances[Y.stamp(this)];
        }
    };

    Y.extend(Y.Anim, Y.Base, proto);


}, '3.7.3', {"requires": ["base-base", "node-style"]});
