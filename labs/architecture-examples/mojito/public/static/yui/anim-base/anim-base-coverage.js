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
_yuitest_coverage["build/anim-base/anim-base.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/anim-base/anim-base.js",
    code: []
};
_yuitest_coverage["build/anim-base/anim-base.js"].code=["YUI.add('anim-base', function (Y, NAME) {","","/**","* The Animation Utility provides an API for creating advanced transitions.","* @module anim","*/","","/**","* Provides the base Anim class, for animating numeric properties.","*","* @module anim","* @submodule anim-base","*/","","    /**","     * A class for constructing animation instances.","     * @class Anim","     * @for Anim","     * @constructor","     * @extends Base","     */","","    var RUNNING = 'running',","        START_TIME = 'startTime',","        ELAPSED_TIME = 'elapsedTime',","        /**","        * @for Anim","        * @event start","        * @description fires when an animation begins.","        * @param {Event} ev The start event.","        * @type Event.Custom","        */","        START = 'start',","","        /**","        * @event tween","        * @description fires every frame of the animation.","        * @param {Event} ev The tween event.","        * @type Event.Custom","        */","        TWEEN = 'tween',","","        /**","        * @event end","        * @description fires after the animation completes.","        * @param {Event} ev The end event.","        * @type Event.Custom","        */","        END = 'end',","        NODE = 'node',","        PAUSED = 'paused',","        REVERSE = 'reverse', // TODO: cleanup","        ITERATION_COUNT = 'iterationCount',","","        NUM = Number;","","    var _running = {},","        _timer;","","    Y.Anim = function() {","        Y.Anim.superclass.constructor.apply(this, arguments);","        Y.Anim._instances[Y.stamp(this)] = this;","    };","","    Y.Anim.NAME = 'anim';","","    Y.Anim._instances = {};","","    /**","     * Regex of properties that should use the default unit.","     *","     * @property RE_DEFAULT_UNIT","     * @static","     */","    Y.Anim.RE_DEFAULT_UNIT = /^width|height|top|right|bottom|left|margin.*|padding.*|border.*$/i;","","    /**","     * The default unit to use with properties that pass the RE_DEFAULT_UNIT test.","     *","     * @property DEFAULT_UNIT","     * @static","     */","    Y.Anim.DEFAULT_UNIT = 'px';","","    Y.Anim.DEFAULT_EASING = function (t, b, c, d) {","        return c * t / d + b; // linear easing","    };","","    /**","     * Time in milliseconds passed to setInterval for frame processing ","     *","     * @property intervalTime","     * @default 20","     * @static","     */","    Y.Anim._intervalTime = 20;","","    /**","     * Bucket for custom getters and setters","     *","     * @property behaviors","     * @static","     */","    Y.Anim.behaviors = {","        left: {","            get: function(anim, attr) {","                return anim._getOffset(attr);","            }","        }","    };","","    Y.Anim.behaviors.top = Y.Anim.behaviors.left;","","    /**","     * The default setter to use when setting object properties.","     *","     * @property DEFAULT_SETTER","     * @static","     */","    Y.Anim.DEFAULT_SETTER = function(anim, att, from, to, elapsed, duration, fn, unit) {","        var node = anim._node,","            domNode = node._node,","            val = fn(elapsed, NUM(from), NUM(to) - NUM(from), duration);","","        if (domNode) {","            if ('style' in domNode && (att in domNode.style || att in Y.DOM.CUSTOM_STYLES)) {","                unit = unit || '';","                node.setStyle(att, val + unit);","            } else if ('attributes' in domNode && att in domNode.attributes) {","                node.setAttribute(att, val);","            } else if (att in domNode) {","                domNode[att] = val;","            }","        } else if (node.set) {","            node.set(att, val);","        } else if (att in node) {","            node[att] = val;","        }","    };","","    /**","     * The default getter to use when getting object properties.","     *","     * @property DEFAULT_GETTER","     * @static","     */","    Y.Anim.DEFAULT_GETTER = function(anim, att) {","        var node = anim._node,","            domNode = node._node,","            val = '';","","        if (domNode) {","            if ('style' in domNode && (att in domNode.style || att in Y.DOM.CUSTOM_STYLES)) {","                val = node.getComputedStyle(att);","            } else if ('attributes' in domNode && att in domNode.attributes) {","                val = node.getAttribute(att);","            } else if (att in domNode) {","                val = domNode[att];","            }","        } else if (node.get) {","            val = node.get(att);","        } else if (att in node) {","            val = node[att];","        }","","        return val;","    };","","    Y.Anim.ATTRS = {","        /**","         * The object to be animated.","         * @attribute node","         * @type Node","         */","        node: {","            setter: function(node) {","                if (node) {","                    if (typeof node == 'string' || node.nodeType) {","                        node = Y.one(node);","                    }","                }","","                this._node = node;","                if (!node) {","                }","                return node;","            }","        },","","        /**","         * The length of the animation.  Defaults to \"1\" (second).","         * @attribute duration","         * @type NUM","         */","        duration: {","            value: 1","        },","","        /**","         * The method that will provide values to the attribute(s) during the animation. ","         * Defaults to \"Easing.easeNone\".","         * @attribute easing","         * @type Function","         */","        easing: {","            value: Y.Anim.DEFAULT_EASING,","","            setter: function(val) {","                if (typeof val === 'string' && Y.Easing) {","                    return Y.Easing[val];","                }","            }","        },","","        /**","         * The starting values for the animated properties.","         *","         * Fields may be strings, numbers, or functions.","         * If a function is used, the return value becomes the from value.","         * If no from value is specified, the DEFAULT_GETTER will be used.","         * Supports any unit, provided it matches the \"to\" (or default)","         * unit (e.g. `{width: '10em', color: 'rgb(0, 0, 0)', borderColor: '#ccc'}`).","         *","         * If using the default ('px' for length-based units), the unit may be omitted","         * (e.g. `{width: 100}, borderColor: 'ccc'}`, which defaults to pixels","         * and hex, respectively).","         *","         * @attribute from","         * @type Object","         */","        from: {},","","        /**","         * The ending values for the animated properties.","         *","         * Fields may be strings, numbers, or functions.","         * Supports any unit, provided it matches the \"from\" (or default)","         * unit (e.g. `{width: '50%', color: 'red', borderColor: '#ccc'}`).","         *","         * If using the default ('px' for length-based units), the unit may be omitted","         * (e.g. `{width: 100, borderColor: 'ccc'}`, which defaults to pixels","         * and hex, respectively).","         *","         * @attribute to","         * @type Object","         */","        to: {},","","        /**","         * Date stamp for the first frame of the animation.","         * @attribute startTime","         * @type Int","         * @default 0 ","         * @readOnly","         */","        startTime: {","            value: 0,","            readOnly: true","        },","","        /**","         * Current time the animation has been running.","         * @attribute elapsedTime","         * @type Int","         * @default 0 ","         * @readOnly","         */","        elapsedTime: {","            value: 0,","            readOnly: true","        },","","        /**","         * Whether or not the animation is currently running.","         * @attribute running ","         * @type Boolean","         * @default false ","         * @readOnly","         */","        running: {","            getter: function() {","                return !!_running[Y.stamp(this)];","            },","            value: false,","            readOnly: true","        },","","        /**","         * The number of times the animation should run ","         * @attribute iterations","         * @type Int","         * @default 1 ","         */","        iterations: {","            value: 1","        },","","        /**","         * The number of iterations that have occurred.","         * Resets when an animation ends (reaches iteration count or stop() called). ","         * @attribute iterationCount","         * @type Int","         * @default 0","         * @readOnly","         */","        iterationCount: {","            value: 0,","            readOnly: true","        },","","        /**","         * How iterations of the animation should behave. ","         * Possible values are \"normal\" and \"alternate\".","         * Normal will repeat the animation, alternate will reverse on every other pass.","         *","         * @attribute direction","         * @type String","         * @default \"normal\"","         */","        direction: {","            value: 'normal' // | alternate (fwd on odd, rev on even per spec)","        },","","        /**","         * Whether or not the animation is currently paused.","         * @attribute paused ","         * @type Boolean","         * @default false ","         * @readOnly","         */","        paused: {","            readOnly: true,","            value: false","        },","","        /**","         * If true, animation begins from last frame","         * @attribute reverse","         * @type Boolean","         * @default false ","         */","        reverse: {","            value: false","        }","","","    };","","    /**","     * Runs all animation instances.","     * @method run","     * @static","     */    ","    Y.Anim.run = function() {","        var instances = Y.Anim._instances;","        for (var i in instances) {","            if (instances[i].run) {","                instances[i].run();","            }","        }","    };","","    /**","     * Pauses all animation instances.","     * @method pause","     * @static","     */    ","    Y.Anim.pause = function() {","        for (var i in _running) { // stop timer if nothing running","            if (_running[i].pause) {","                _running[i].pause();","            }","        }","","        Y.Anim._stopTimer();","    };","","    /**","     * Stops all animation instances.","     * @method stop","     * @static","     */    ","    Y.Anim.stop = function() {","        for (var i in _running) { // stop timer if nothing running","            if (_running[i].stop) {","                _running[i].stop();","            }","        }","        Y.Anim._stopTimer();","    };","    ","    Y.Anim._startTimer = function() {","        if (!_timer) {","            _timer = setInterval(Y.Anim._runFrame, Y.Anim._intervalTime);","        }","    };","","    Y.Anim._stopTimer = function() {","        clearInterval(_timer);","        _timer = 0;","    };","","    /**","     * Called per Interval to handle each animation frame.","     * @method _runFrame","     * @private","     * @static","     */    ","    Y.Anim._runFrame = function() {","        var done = true;","        for (var anim in _running) {","            if (_running[anim]._runFrame) {","                done = false;","                _running[anim]._runFrame();","            }","        }","","        if (done) {","            Y.Anim._stopTimer();","        }","    };","","    Y.Anim.RE_UNITS = /^(-?\\d*\\.?\\d*){1}(em|ex|px|in|cm|mm|pt|pc|%)*$/;","","    var proto = {","        /**","         * Starts or resumes an animation.","         * @method run","         * @chainable","         */    ","        run: function() {","            if (this.get(PAUSED)) {","                this._resume();","            } else if (!this.get(RUNNING)) {","                this._start();","            }","            return this;","        },","","        /**","         * Pauses the animation and","         * freezes it in its current state and time.","         * Calling run() will continue where it left off.","         * @method pause","         * @chainable","         */    ","        pause: function() {","            if (this.get(RUNNING)) {","                this._pause();","            }","            return this;","        },","","        /**","         * Stops the animation and resets its time.","         * @method stop","         * @param {Boolean} finish If true, the animation will move to the last frame","         * @chainable","         */    ","        stop: function(finish) {","            if (this.get(RUNNING) || this.get(PAUSED)) {","                this._end(finish);","            }","            return this;","        },","","        _added: false,","","        _start: function() {","            this._set(START_TIME, new Date() - this.get(ELAPSED_TIME));","            this._actualFrames = 0;","            if (!this.get(PAUSED)) {","                this._initAnimAttr();","            }","            _running[Y.stamp(this)] = this;","            Y.Anim._startTimer();","","            this.fire(START);","        },","","        _pause: function() {","            this._set(START_TIME, null);","            this._set(PAUSED, true);","            delete _running[Y.stamp(this)];","","            /**","            * @event pause","            * @description fires when an animation is paused.","            * @param {Event} ev The pause event.","            * @type Event.Custom","            */","            this.fire('pause');","        },","","        _resume: function() {","            this._set(PAUSED, false);","            _running[Y.stamp(this)] = this;","            this._set(START_TIME, new Date() - this.get(ELAPSED_TIME));","            Y.Anim._startTimer();","","            /**","            * @event resume","            * @description fires when an animation is resumed (run from pause).","            * @param {Event} ev The pause event.","            * @type Event.Custom","            */","            this.fire('resume');","        },","","        _end: function(finish) {","            var duration = this.get('duration') * 1000;","            if (finish) { // jump to last frame","                this._runAttrs(duration, duration, this.get(REVERSE));","            }","","            this._set(START_TIME, null);","            this._set(ELAPSED_TIME, 0);","            this._set(PAUSED, false);","","            delete _running[Y.stamp(this)];","            this.fire(END, {elapsed: this.get(ELAPSED_TIME)});","        },","","        _runFrame: function() {","            var d = this._runtimeAttr.duration,","                t = new Date() - this.get(START_TIME),","                reverse = this.get(REVERSE),","                done = (t >= d),","                attribute,","                setter;","                ","            this._runAttrs(t, d, reverse);","            this._actualFrames += 1;","            this._set(ELAPSED_TIME, t);","","            this.fire(TWEEN);","            if (done) {","                this._lastFrame();","            }","        },","","        _runAttrs: function(t, d, reverse) {","            var attr = this._runtimeAttr,","                customAttr = Y.Anim.behaviors,","                easing = attr.easing,","                lastFrame = d,","                done = false,","                attribute,","                setter,","                i;","","            if (t >= d) {","                done = true;","            }","","            if (reverse) {","                t = d - t;","                lastFrame = 0;","            }","","            for (i in attr) {","                if (attr[i].to) {","                    attribute = attr[i];","                    setter = (i in customAttr && 'set' in customAttr[i]) ?","                            customAttr[i].set : Y.Anim.DEFAULT_SETTER;","","                    if (!done) {","                        setter(this, i, attribute.from, attribute.to, t, d, easing, attribute.unit); ","                    } else {","                        setter(this, i, attribute.from, attribute.to, lastFrame, d, easing, attribute.unit); ","                    }","                }","            }","","","        },","","        _lastFrame: function() {","            var iter = this.get('iterations'),","                iterCount = this.get(ITERATION_COUNT);","","            iterCount += 1;","            if (iter === 'infinite' || iterCount < iter) {","                if (this.get('direction') === 'alternate') {","                    this.set(REVERSE, !this.get(REVERSE)); // flip it","                }","                /**","                * @event iteration","                * @description fires when an animation begins an iteration.","                * @param {Event} ev The iteration event.","                * @type Event.Custom","                */","                this.fire('iteration');","            } else {","                iterCount = 0;","                this._end();","            }","","            this._set(START_TIME, new Date());","            this._set(ITERATION_COUNT, iterCount);","        },","","        _initAnimAttr: function() {","            var from = this.get('from') || {},","                to = this.get('to') || {},","                attr = {","                    duration: this.get('duration') * 1000,","                    easing: this.get('easing')","                },","                customAttr = Y.Anim.behaviors,","                node = this.get(NODE), // implicit attr init","                unit, begin, end;","","            Y.each(to, function(val, name) {","                if (typeof val === 'function') {","                    val = val.call(this, node);","                }","","                begin = from[name];","                if (begin === undefined) {","                    begin = (name in customAttr && 'get' in customAttr[name])  ?","                            customAttr[name].get(this, name) : Y.Anim.DEFAULT_GETTER(this, name);","                } else if (typeof begin === 'function') {","                    begin = begin.call(this, node);","                }","","                var mFrom = Y.Anim.RE_UNITS.exec(begin);","                var mTo = Y.Anim.RE_UNITS.exec(val);","","                begin = mFrom ? mFrom[1] : begin;","                end = mTo ? mTo[1] : val;","                unit = mTo ? mTo[2] : mFrom ?  mFrom[2] : ''; // one might be zero TODO: mixed units","","                if (!unit && Y.Anim.RE_DEFAULT_UNIT.test(name)) {","                    unit = Y.Anim.DEFAULT_UNIT;","                }","","                if (!begin || !end) {","                    Y.error('invalid \"from\" or \"to\" for \"' + name + '\"', 'Anim');","                    return;","                }","","                attr[name] = {","                    from: Y.Lang.isObject(begin) ? Y.clone(begin) : begin,","                    to: end,","                    unit: unit","                };","","            }, this);","","            this._runtimeAttr = attr;","        },","","","        // TODO: move to computedStyle? (browsers dont agree on default computed offsets)","        _getOffset: function(attr) {","            var node = this._node,","                val = node.getComputedStyle(attr),","                get = (attr === 'left') ? 'getX': 'getY',","                set = (attr === 'left') ? 'setX': 'setY';","","            if (val === 'auto') {","                var position = node.getStyle('position');","                if (position === 'absolute' || position === 'fixed') {","                    val = node[get]();","                    node[set](val);","                } else {","                    val = 0;","                }","            }","","            return val;","        },","","        destructor: function() {","            delete Y.Anim._instances[Y.stamp(this)];","        }","    };","","    Y.extend(Y.Anim, Y.Base, proto);","","","}, '3.7.3', {\"requires\": [\"base-base\", \"node-style\"]});"];
_yuitest_coverage["build/anim-base/anim-base.js"].lines = {"1":0,"23":0,"57":0,"60":0,"61":0,"62":0,"65":0,"67":0,"75":0,"83":0,"85":0,"86":0,"96":0,"104":0,"107":0,"112":0,"120":0,"121":0,"125":0,"126":0,"127":0,"128":0,"129":0,"130":0,"131":0,"132":0,"134":0,"135":0,"136":0,"137":0,"147":0,"148":0,"152":0,"153":0,"154":0,"155":0,"156":0,"157":0,"158":0,"160":0,"161":0,"162":0,"163":0,"166":0,"169":0,"177":0,"178":0,"179":0,"183":0,"184":0,"186":0,"209":0,"210":0,"282":0,"354":0,"355":0,"356":0,"357":0,"358":0,"368":0,"369":0,"370":0,"371":0,"375":0,"383":0,"384":0,"385":0,"386":0,"389":0,"392":0,"393":0,"394":0,"398":0,"399":0,"400":0,"409":0,"410":0,"411":0,"412":0,"413":0,"414":0,"418":0,"419":0,"423":0,"425":0,"432":0,"433":0,"434":0,"435":0,"437":0,"448":0,"449":0,"451":0,"461":0,"462":0,"464":0,"470":0,"471":0,"472":0,"473":0,"475":0,"476":0,"478":0,"482":0,"483":0,"484":0,"492":0,"496":0,"497":0,"498":0,"499":0,"507":0,"511":0,"512":0,"513":0,"516":0,"517":0,"518":0,"520":0,"521":0,"525":0,"532":0,"533":0,"534":0,"536":0,"537":0,"538":0,"543":0,"552":0,"553":0,"556":0,"557":0,"558":0,"561":0,"562":0,"563":0,"564":0,"567":0,"568":0,"570":0,"579":0,"582":0,"583":0,"584":0,"585":0,"593":0,"595":0,"596":0,"599":0,"600":0,"604":0,"614":0,"615":0,"616":0,"619":0,"620":0,"621":0,"623":0,"624":0,"627":0,"628":0,"630":0,"631":0,"632":0,"634":0,"635":0,"638":0,"639":0,"640":0,"643":0,"651":0,"657":0,"662":0,"663":0,"664":0,"665":0,"666":0,"668":0,"672":0,"676":0,"680":0};
_yuitest_coverage["build/anim-base/anim-base.js"].functions = {"Anim:60":0,"DEFAULT_EASING:85":0,"get:106":0,"DEFAULT_SETTER:120":0,"DEFAULT_GETTER:147":0,"setter:176":0,"setter:208":0,"getter:281":0,"run:354":0,"pause:368":0,"stop:383":0,"_startTimer:392":0,"_stopTimer:398":0,"_runFrame:409":0,"run:431":0,"pause:447":0,"stop:460":0,"_start:469":0,"_pause:481":0,"_resume:495":0,"_end:510":0,"_runFrame:524":0,"_runAttrs:542":0,"_lastFrame:578":0,"(anonymous 2):614":0,"_initAnimAttr:603":0,"_getOffset:656":0,"destructor:675":0,"(anonymous 1):1":0};
_yuitest_coverage["build/anim-base/anim-base.js"].coveredLines = 181;
_yuitest_coverage["build/anim-base/anim-base.js"].coveredFunctions = 29;
_yuitest_coverline("build/anim-base/anim-base.js", 1);
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

    _yuitest_coverfunc("build/anim-base/anim-base.js", "(anonymous 1)", 1);
_yuitest_coverline("build/anim-base/anim-base.js", 23);
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

    _yuitest_coverline("build/anim-base/anim-base.js", 57);
var _running = {},
        _timer;

    _yuitest_coverline("build/anim-base/anim-base.js", 60);
Y.Anim = function() {
        _yuitest_coverfunc("build/anim-base/anim-base.js", "Anim", 60);
_yuitest_coverline("build/anim-base/anim-base.js", 61);
Y.Anim.superclass.constructor.apply(this, arguments);
        _yuitest_coverline("build/anim-base/anim-base.js", 62);
Y.Anim._instances[Y.stamp(this)] = this;
    };

    _yuitest_coverline("build/anim-base/anim-base.js", 65);
Y.Anim.NAME = 'anim';

    _yuitest_coverline("build/anim-base/anim-base.js", 67);
Y.Anim._instances = {};

    /**
     * Regex of properties that should use the default unit.
     *
     * @property RE_DEFAULT_UNIT
     * @static
     */
    _yuitest_coverline("build/anim-base/anim-base.js", 75);
Y.Anim.RE_DEFAULT_UNIT = /^width|height|top|right|bottom|left|margin.*|padding.*|border.*$/i;

    /**
     * The default unit to use with properties that pass the RE_DEFAULT_UNIT test.
     *
     * @property DEFAULT_UNIT
     * @static
     */
    _yuitest_coverline("build/anim-base/anim-base.js", 83);
Y.Anim.DEFAULT_UNIT = 'px';

    _yuitest_coverline("build/anim-base/anim-base.js", 85);
Y.Anim.DEFAULT_EASING = function (t, b, c, d) {
        _yuitest_coverfunc("build/anim-base/anim-base.js", "DEFAULT_EASING", 85);
_yuitest_coverline("build/anim-base/anim-base.js", 86);
return c * t / d + b; // linear easing
    };

    /**
     * Time in milliseconds passed to setInterval for frame processing 
     *
     * @property intervalTime
     * @default 20
     * @static
     */
    _yuitest_coverline("build/anim-base/anim-base.js", 96);
Y.Anim._intervalTime = 20;

    /**
     * Bucket for custom getters and setters
     *
     * @property behaviors
     * @static
     */
    _yuitest_coverline("build/anim-base/anim-base.js", 104);
Y.Anim.behaviors = {
        left: {
            get: function(anim, attr) {
                _yuitest_coverfunc("build/anim-base/anim-base.js", "get", 106);
_yuitest_coverline("build/anim-base/anim-base.js", 107);
return anim._getOffset(attr);
            }
        }
    };

    _yuitest_coverline("build/anim-base/anim-base.js", 112);
Y.Anim.behaviors.top = Y.Anim.behaviors.left;

    /**
     * The default setter to use when setting object properties.
     *
     * @property DEFAULT_SETTER
     * @static
     */
    _yuitest_coverline("build/anim-base/anim-base.js", 120);
Y.Anim.DEFAULT_SETTER = function(anim, att, from, to, elapsed, duration, fn, unit) {
        _yuitest_coverfunc("build/anim-base/anim-base.js", "DEFAULT_SETTER", 120);
_yuitest_coverline("build/anim-base/anim-base.js", 121);
var node = anim._node,
            domNode = node._node,
            val = fn(elapsed, NUM(from), NUM(to) - NUM(from), duration);

        _yuitest_coverline("build/anim-base/anim-base.js", 125);
if (domNode) {
            _yuitest_coverline("build/anim-base/anim-base.js", 126);
if ('style' in domNode && (att in domNode.style || att in Y.DOM.CUSTOM_STYLES)) {
                _yuitest_coverline("build/anim-base/anim-base.js", 127);
unit = unit || '';
                _yuitest_coverline("build/anim-base/anim-base.js", 128);
node.setStyle(att, val + unit);
            } else {_yuitest_coverline("build/anim-base/anim-base.js", 129);
if ('attributes' in domNode && att in domNode.attributes) {
                _yuitest_coverline("build/anim-base/anim-base.js", 130);
node.setAttribute(att, val);
            } else {_yuitest_coverline("build/anim-base/anim-base.js", 131);
if (att in domNode) {
                _yuitest_coverline("build/anim-base/anim-base.js", 132);
domNode[att] = val;
            }}}
        } else {_yuitest_coverline("build/anim-base/anim-base.js", 134);
if (node.set) {
            _yuitest_coverline("build/anim-base/anim-base.js", 135);
node.set(att, val);
        } else {_yuitest_coverline("build/anim-base/anim-base.js", 136);
if (att in node) {
            _yuitest_coverline("build/anim-base/anim-base.js", 137);
node[att] = val;
        }}}
    };

    /**
     * The default getter to use when getting object properties.
     *
     * @property DEFAULT_GETTER
     * @static
     */
    _yuitest_coverline("build/anim-base/anim-base.js", 147);
Y.Anim.DEFAULT_GETTER = function(anim, att) {
        _yuitest_coverfunc("build/anim-base/anim-base.js", "DEFAULT_GETTER", 147);
_yuitest_coverline("build/anim-base/anim-base.js", 148);
var node = anim._node,
            domNode = node._node,
            val = '';

        _yuitest_coverline("build/anim-base/anim-base.js", 152);
if (domNode) {
            _yuitest_coverline("build/anim-base/anim-base.js", 153);
if ('style' in domNode && (att in domNode.style || att in Y.DOM.CUSTOM_STYLES)) {
                _yuitest_coverline("build/anim-base/anim-base.js", 154);
val = node.getComputedStyle(att);
            } else {_yuitest_coverline("build/anim-base/anim-base.js", 155);
if ('attributes' in domNode && att in domNode.attributes) {
                _yuitest_coverline("build/anim-base/anim-base.js", 156);
val = node.getAttribute(att);
            } else {_yuitest_coverline("build/anim-base/anim-base.js", 157);
if (att in domNode) {
                _yuitest_coverline("build/anim-base/anim-base.js", 158);
val = domNode[att];
            }}}
        } else {_yuitest_coverline("build/anim-base/anim-base.js", 160);
if (node.get) {
            _yuitest_coverline("build/anim-base/anim-base.js", 161);
val = node.get(att);
        } else {_yuitest_coverline("build/anim-base/anim-base.js", 162);
if (att in node) {
            _yuitest_coverline("build/anim-base/anim-base.js", 163);
val = node[att];
        }}}

        _yuitest_coverline("build/anim-base/anim-base.js", 166);
return val;
    };

    _yuitest_coverline("build/anim-base/anim-base.js", 169);
Y.Anim.ATTRS = {
        /**
         * The object to be animated.
         * @attribute node
         * @type Node
         */
        node: {
            setter: function(node) {
                _yuitest_coverfunc("build/anim-base/anim-base.js", "setter", 176);
_yuitest_coverline("build/anim-base/anim-base.js", 177);
if (node) {
                    _yuitest_coverline("build/anim-base/anim-base.js", 178);
if (typeof node == 'string' || node.nodeType) {
                        _yuitest_coverline("build/anim-base/anim-base.js", 179);
node = Y.one(node);
                    }
                }

                _yuitest_coverline("build/anim-base/anim-base.js", 183);
this._node = node;
                _yuitest_coverline("build/anim-base/anim-base.js", 184);
if (!node) {
                }
                _yuitest_coverline("build/anim-base/anim-base.js", 186);
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
                _yuitest_coverfunc("build/anim-base/anim-base.js", "setter", 208);
_yuitest_coverline("build/anim-base/anim-base.js", 209);
if (typeof val === 'string' && Y.Easing) {
                    _yuitest_coverline("build/anim-base/anim-base.js", 210);
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
                _yuitest_coverfunc("build/anim-base/anim-base.js", "getter", 281);
_yuitest_coverline("build/anim-base/anim-base.js", 282);
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
    _yuitest_coverline("build/anim-base/anim-base.js", 354);
Y.Anim.run = function() {
        _yuitest_coverfunc("build/anim-base/anim-base.js", "run", 354);
_yuitest_coverline("build/anim-base/anim-base.js", 355);
var instances = Y.Anim._instances;
        _yuitest_coverline("build/anim-base/anim-base.js", 356);
for (var i in instances) {
            _yuitest_coverline("build/anim-base/anim-base.js", 357);
if (instances[i].run) {
                _yuitest_coverline("build/anim-base/anim-base.js", 358);
instances[i].run();
            }
        }
    };

    /**
     * Pauses all animation instances.
     * @method pause
     * @static
     */    
    _yuitest_coverline("build/anim-base/anim-base.js", 368);
Y.Anim.pause = function() {
        _yuitest_coverfunc("build/anim-base/anim-base.js", "pause", 368);
_yuitest_coverline("build/anim-base/anim-base.js", 369);
for (var i in _running) { // stop timer if nothing running
            _yuitest_coverline("build/anim-base/anim-base.js", 370);
if (_running[i].pause) {
                _yuitest_coverline("build/anim-base/anim-base.js", 371);
_running[i].pause();
            }
        }

        _yuitest_coverline("build/anim-base/anim-base.js", 375);
Y.Anim._stopTimer();
    };

    /**
     * Stops all animation instances.
     * @method stop
     * @static
     */    
    _yuitest_coverline("build/anim-base/anim-base.js", 383);
Y.Anim.stop = function() {
        _yuitest_coverfunc("build/anim-base/anim-base.js", "stop", 383);
_yuitest_coverline("build/anim-base/anim-base.js", 384);
for (var i in _running) { // stop timer if nothing running
            _yuitest_coverline("build/anim-base/anim-base.js", 385);
if (_running[i].stop) {
                _yuitest_coverline("build/anim-base/anim-base.js", 386);
_running[i].stop();
            }
        }
        _yuitest_coverline("build/anim-base/anim-base.js", 389);
Y.Anim._stopTimer();
    };
    
    _yuitest_coverline("build/anim-base/anim-base.js", 392);
Y.Anim._startTimer = function() {
        _yuitest_coverfunc("build/anim-base/anim-base.js", "_startTimer", 392);
_yuitest_coverline("build/anim-base/anim-base.js", 393);
if (!_timer) {
            _yuitest_coverline("build/anim-base/anim-base.js", 394);
_timer = setInterval(Y.Anim._runFrame, Y.Anim._intervalTime);
        }
    };

    _yuitest_coverline("build/anim-base/anim-base.js", 398);
Y.Anim._stopTimer = function() {
        _yuitest_coverfunc("build/anim-base/anim-base.js", "_stopTimer", 398);
_yuitest_coverline("build/anim-base/anim-base.js", 399);
clearInterval(_timer);
        _yuitest_coverline("build/anim-base/anim-base.js", 400);
_timer = 0;
    };

    /**
     * Called per Interval to handle each animation frame.
     * @method _runFrame
     * @private
     * @static
     */    
    _yuitest_coverline("build/anim-base/anim-base.js", 409);
Y.Anim._runFrame = function() {
        _yuitest_coverfunc("build/anim-base/anim-base.js", "_runFrame", 409);
_yuitest_coverline("build/anim-base/anim-base.js", 410);
var done = true;
        _yuitest_coverline("build/anim-base/anim-base.js", 411);
for (var anim in _running) {
            _yuitest_coverline("build/anim-base/anim-base.js", 412);
if (_running[anim]._runFrame) {
                _yuitest_coverline("build/anim-base/anim-base.js", 413);
done = false;
                _yuitest_coverline("build/anim-base/anim-base.js", 414);
_running[anim]._runFrame();
            }
        }

        _yuitest_coverline("build/anim-base/anim-base.js", 418);
if (done) {
            _yuitest_coverline("build/anim-base/anim-base.js", 419);
Y.Anim._stopTimer();
        }
    };

    _yuitest_coverline("build/anim-base/anim-base.js", 423);
Y.Anim.RE_UNITS = /^(-?\d*\.?\d*){1}(em|ex|px|in|cm|mm|pt|pc|%)*$/;

    _yuitest_coverline("build/anim-base/anim-base.js", 425);
var proto = {
        /**
         * Starts or resumes an animation.
         * @method run
         * @chainable
         */    
        run: function() {
            _yuitest_coverfunc("build/anim-base/anim-base.js", "run", 431);
_yuitest_coverline("build/anim-base/anim-base.js", 432);
if (this.get(PAUSED)) {
                _yuitest_coverline("build/anim-base/anim-base.js", 433);
this._resume();
            } else {_yuitest_coverline("build/anim-base/anim-base.js", 434);
if (!this.get(RUNNING)) {
                _yuitest_coverline("build/anim-base/anim-base.js", 435);
this._start();
            }}
            _yuitest_coverline("build/anim-base/anim-base.js", 437);
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
            _yuitest_coverfunc("build/anim-base/anim-base.js", "pause", 447);
_yuitest_coverline("build/anim-base/anim-base.js", 448);
if (this.get(RUNNING)) {
                _yuitest_coverline("build/anim-base/anim-base.js", 449);
this._pause();
            }
            _yuitest_coverline("build/anim-base/anim-base.js", 451);
return this;
        },

        /**
         * Stops the animation and resets its time.
         * @method stop
         * @param {Boolean} finish If true, the animation will move to the last frame
         * @chainable
         */    
        stop: function(finish) {
            _yuitest_coverfunc("build/anim-base/anim-base.js", "stop", 460);
_yuitest_coverline("build/anim-base/anim-base.js", 461);
if (this.get(RUNNING) || this.get(PAUSED)) {
                _yuitest_coverline("build/anim-base/anim-base.js", 462);
this._end(finish);
            }
            _yuitest_coverline("build/anim-base/anim-base.js", 464);
return this;
        },

        _added: false,

        _start: function() {
            _yuitest_coverfunc("build/anim-base/anim-base.js", "_start", 469);
_yuitest_coverline("build/anim-base/anim-base.js", 470);
this._set(START_TIME, new Date() - this.get(ELAPSED_TIME));
            _yuitest_coverline("build/anim-base/anim-base.js", 471);
this._actualFrames = 0;
            _yuitest_coverline("build/anim-base/anim-base.js", 472);
if (!this.get(PAUSED)) {
                _yuitest_coverline("build/anim-base/anim-base.js", 473);
this._initAnimAttr();
            }
            _yuitest_coverline("build/anim-base/anim-base.js", 475);
_running[Y.stamp(this)] = this;
            _yuitest_coverline("build/anim-base/anim-base.js", 476);
Y.Anim._startTimer();

            _yuitest_coverline("build/anim-base/anim-base.js", 478);
this.fire(START);
        },

        _pause: function() {
            _yuitest_coverfunc("build/anim-base/anim-base.js", "_pause", 481);
_yuitest_coverline("build/anim-base/anim-base.js", 482);
this._set(START_TIME, null);
            _yuitest_coverline("build/anim-base/anim-base.js", 483);
this._set(PAUSED, true);
            _yuitest_coverline("build/anim-base/anim-base.js", 484);
delete _running[Y.stamp(this)];

            /**
            * @event pause
            * @description fires when an animation is paused.
            * @param {Event} ev The pause event.
            * @type Event.Custom
            */
            _yuitest_coverline("build/anim-base/anim-base.js", 492);
this.fire('pause');
        },

        _resume: function() {
            _yuitest_coverfunc("build/anim-base/anim-base.js", "_resume", 495);
_yuitest_coverline("build/anim-base/anim-base.js", 496);
this._set(PAUSED, false);
            _yuitest_coverline("build/anim-base/anim-base.js", 497);
_running[Y.stamp(this)] = this;
            _yuitest_coverline("build/anim-base/anim-base.js", 498);
this._set(START_TIME, new Date() - this.get(ELAPSED_TIME));
            _yuitest_coverline("build/anim-base/anim-base.js", 499);
Y.Anim._startTimer();

            /**
            * @event resume
            * @description fires when an animation is resumed (run from pause).
            * @param {Event} ev The pause event.
            * @type Event.Custom
            */
            _yuitest_coverline("build/anim-base/anim-base.js", 507);
this.fire('resume');
        },

        _end: function(finish) {
            _yuitest_coverfunc("build/anim-base/anim-base.js", "_end", 510);
_yuitest_coverline("build/anim-base/anim-base.js", 511);
var duration = this.get('duration') * 1000;
            _yuitest_coverline("build/anim-base/anim-base.js", 512);
if (finish) { // jump to last frame
                _yuitest_coverline("build/anim-base/anim-base.js", 513);
this._runAttrs(duration, duration, this.get(REVERSE));
            }

            _yuitest_coverline("build/anim-base/anim-base.js", 516);
this._set(START_TIME, null);
            _yuitest_coverline("build/anim-base/anim-base.js", 517);
this._set(ELAPSED_TIME, 0);
            _yuitest_coverline("build/anim-base/anim-base.js", 518);
this._set(PAUSED, false);

            _yuitest_coverline("build/anim-base/anim-base.js", 520);
delete _running[Y.stamp(this)];
            _yuitest_coverline("build/anim-base/anim-base.js", 521);
this.fire(END, {elapsed: this.get(ELAPSED_TIME)});
        },

        _runFrame: function() {
            _yuitest_coverfunc("build/anim-base/anim-base.js", "_runFrame", 524);
_yuitest_coverline("build/anim-base/anim-base.js", 525);
var d = this._runtimeAttr.duration,
                t = new Date() - this.get(START_TIME),
                reverse = this.get(REVERSE),
                done = (t >= d),
                attribute,
                setter;
                
            _yuitest_coverline("build/anim-base/anim-base.js", 532);
this._runAttrs(t, d, reverse);
            _yuitest_coverline("build/anim-base/anim-base.js", 533);
this._actualFrames += 1;
            _yuitest_coverline("build/anim-base/anim-base.js", 534);
this._set(ELAPSED_TIME, t);

            _yuitest_coverline("build/anim-base/anim-base.js", 536);
this.fire(TWEEN);
            _yuitest_coverline("build/anim-base/anim-base.js", 537);
if (done) {
                _yuitest_coverline("build/anim-base/anim-base.js", 538);
this._lastFrame();
            }
        },

        _runAttrs: function(t, d, reverse) {
            _yuitest_coverfunc("build/anim-base/anim-base.js", "_runAttrs", 542);
_yuitest_coverline("build/anim-base/anim-base.js", 543);
var attr = this._runtimeAttr,
                customAttr = Y.Anim.behaviors,
                easing = attr.easing,
                lastFrame = d,
                done = false,
                attribute,
                setter,
                i;

            _yuitest_coverline("build/anim-base/anim-base.js", 552);
if (t >= d) {
                _yuitest_coverline("build/anim-base/anim-base.js", 553);
done = true;
            }

            _yuitest_coverline("build/anim-base/anim-base.js", 556);
if (reverse) {
                _yuitest_coverline("build/anim-base/anim-base.js", 557);
t = d - t;
                _yuitest_coverline("build/anim-base/anim-base.js", 558);
lastFrame = 0;
            }

            _yuitest_coverline("build/anim-base/anim-base.js", 561);
for (i in attr) {
                _yuitest_coverline("build/anim-base/anim-base.js", 562);
if (attr[i].to) {
                    _yuitest_coverline("build/anim-base/anim-base.js", 563);
attribute = attr[i];
                    _yuitest_coverline("build/anim-base/anim-base.js", 564);
setter = (i in customAttr && 'set' in customAttr[i]) ?
                            customAttr[i].set : Y.Anim.DEFAULT_SETTER;

                    _yuitest_coverline("build/anim-base/anim-base.js", 567);
if (!done) {
                        _yuitest_coverline("build/anim-base/anim-base.js", 568);
setter(this, i, attribute.from, attribute.to, t, d, easing, attribute.unit); 
                    } else {
                        _yuitest_coverline("build/anim-base/anim-base.js", 570);
setter(this, i, attribute.from, attribute.to, lastFrame, d, easing, attribute.unit); 
                    }
                }
            }


        },

        _lastFrame: function() {
            _yuitest_coverfunc("build/anim-base/anim-base.js", "_lastFrame", 578);
_yuitest_coverline("build/anim-base/anim-base.js", 579);
var iter = this.get('iterations'),
                iterCount = this.get(ITERATION_COUNT);

            _yuitest_coverline("build/anim-base/anim-base.js", 582);
iterCount += 1;
            _yuitest_coverline("build/anim-base/anim-base.js", 583);
if (iter === 'infinite' || iterCount < iter) {
                _yuitest_coverline("build/anim-base/anim-base.js", 584);
if (this.get('direction') === 'alternate') {
                    _yuitest_coverline("build/anim-base/anim-base.js", 585);
this.set(REVERSE, !this.get(REVERSE)); // flip it
                }
                /**
                * @event iteration
                * @description fires when an animation begins an iteration.
                * @param {Event} ev The iteration event.
                * @type Event.Custom
                */
                _yuitest_coverline("build/anim-base/anim-base.js", 593);
this.fire('iteration');
            } else {
                _yuitest_coverline("build/anim-base/anim-base.js", 595);
iterCount = 0;
                _yuitest_coverline("build/anim-base/anim-base.js", 596);
this._end();
            }

            _yuitest_coverline("build/anim-base/anim-base.js", 599);
this._set(START_TIME, new Date());
            _yuitest_coverline("build/anim-base/anim-base.js", 600);
this._set(ITERATION_COUNT, iterCount);
        },

        _initAnimAttr: function() {
            _yuitest_coverfunc("build/anim-base/anim-base.js", "_initAnimAttr", 603);
_yuitest_coverline("build/anim-base/anim-base.js", 604);
var from = this.get('from') || {},
                to = this.get('to') || {},
                attr = {
                    duration: this.get('duration') * 1000,
                    easing: this.get('easing')
                },
                customAttr = Y.Anim.behaviors,
                node = this.get(NODE), // implicit attr init
                unit, begin, end;

            _yuitest_coverline("build/anim-base/anim-base.js", 614);
Y.each(to, function(val, name) {
                _yuitest_coverfunc("build/anim-base/anim-base.js", "(anonymous 2)", 614);
_yuitest_coverline("build/anim-base/anim-base.js", 615);
if (typeof val === 'function') {
                    _yuitest_coverline("build/anim-base/anim-base.js", 616);
val = val.call(this, node);
                }

                _yuitest_coverline("build/anim-base/anim-base.js", 619);
begin = from[name];
                _yuitest_coverline("build/anim-base/anim-base.js", 620);
if (begin === undefined) {
                    _yuitest_coverline("build/anim-base/anim-base.js", 621);
begin = (name in customAttr && 'get' in customAttr[name])  ?
                            customAttr[name].get(this, name) : Y.Anim.DEFAULT_GETTER(this, name);
                } else {_yuitest_coverline("build/anim-base/anim-base.js", 623);
if (typeof begin === 'function') {
                    _yuitest_coverline("build/anim-base/anim-base.js", 624);
begin = begin.call(this, node);
                }}

                _yuitest_coverline("build/anim-base/anim-base.js", 627);
var mFrom = Y.Anim.RE_UNITS.exec(begin);
                _yuitest_coverline("build/anim-base/anim-base.js", 628);
var mTo = Y.Anim.RE_UNITS.exec(val);

                _yuitest_coverline("build/anim-base/anim-base.js", 630);
begin = mFrom ? mFrom[1] : begin;
                _yuitest_coverline("build/anim-base/anim-base.js", 631);
end = mTo ? mTo[1] : val;
                _yuitest_coverline("build/anim-base/anim-base.js", 632);
unit = mTo ? mTo[2] : mFrom ?  mFrom[2] : ''; // one might be zero TODO: mixed units

                _yuitest_coverline("build/anim-base/anim-base.js", 634);
if (!unit && Y.Anim.RE_DEFAULT_UNIT.test(name)) {
                    _yuitest_coverline("build/anim-base/anim-base.js", 635);
unit = Y.Anim.DEFAULT_UNIT;
                }

                _yuitest_coverline("build/anim-base/anim-base.js", 638);
if (!begin || !end) {
                    _yuitest_coverline("build/anim-base/anim-base.js", 639);
Y.error('invalid "from" or "to" for "' + name + '"', 'Anim');
                    _yuitest_coverline("build/anim-base/anim-base.js", 640);
return;
                }

                _yuitest_coverline("build/anim-base/anim-base.js", 643);
attr[name] = {
                    from: Y.Lang.isObject(begin) ? Y.clone(begin) : begin,
                    to: end,
                    unit: unit
                };

            }, this);

            _yuitest_coverline("build/anim-base/anim-base.js", 651);
this._runtimeAttr = attr;
        },


        // TODO: move to computedStyle? (browsers dont agree on default computed offsets)
        _getOffset: function(attr) {
            _yuitest_coverfunc("build/anim-base/anim-base.js", "_getOffset", 656);
_yuitest_coverline("build/anim-base/anim-base.js", 657);
var node = this._node,
                val = node.getComputedStyle(attr),
                get = (attr === 'left') ? 'getX': 'getY',
                set = (attr === 'left') ? 'setX': 'setY';

            _yuitest_coverline("build/anim-base/anim-base.js", 662);
if (val === 'auto') {
                _yuitest_coverline("build/anim-base/anim-base.js", 663);
var position = node.getStyle('position');
                _yuitest_coverline("build/anim-base/anim-base.js", 664);
if (position === 'absolute' || position === 'fixed') {
                    _yuitest_coverline("build/anim-base/anim-base.js", 665);
val = node[get]();
                    _yuitest_coverline("build/anim-base/anim-base.js", 666);
node[set](val);
                } else {
                    _yuitest_coverline("build/anim-base/anim-base.js", 668);
val = 0;
                }
            }

            _yuitest_coverline("build/anim-base/anim-base.js", 672);
return val;
        },

        destructor: function() {
            _yuitest_coverfunc("build/anim-base/anim-base.js", "destructor", 675);
_yuitest_coverline("build/anim-base/anim-base.js", 676);
delete Y.Anim._instances[Y.stamp(this)];
        }
    };

    _yuitest_coverline("build/anim-base/anim-base.js", 680);
Y.extend(Y.Anim, Y.Base, proto);


}, '3.7.3', {"requires": ["base-base", "node-style"]});
