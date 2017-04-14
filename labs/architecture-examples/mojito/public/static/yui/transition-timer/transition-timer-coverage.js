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
_yuitest_coverage["build/transition-timer/transition-timer.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/transition-timer/transition-timer.js",
    code: []
};
_yuitest_coverage["build/transition-timer/transition-timer.js"].code=["YUI.add('transition-timer', function (Y, NAME) {","","/**","* Provides the base Transition class, for animating numeric properties.","*","* @module transition","* @submodule transition-timer","*/","","","var Transition = Y.Transition;","","Y.mix(Transition.prototype, {","    _start: function() {","        if (Transition.useNative) {","            this._runNative();","        } else {","            this._runTimer();","        }","    },","","    _runTimer: function() {","        var anim = this;","        anim._initAttrs();","","        Transition._running[Y.stamp(anim)] = anim;","        anim._startTime = new Date();","        Transition._startTimer();","    },","","    _endTimer: function() {","        var anim = this;","        delete Transition._running[Y.stamp(anim)];","        anim._startTime = null;","    },","","    _runFrame: function() {","        var t = new Date() - this._startTime;","        this._runAttrs(t);","    },","","    _runAttrs: function(time) {","        var anim = this,","            node = anim._node,","            config = anim._config,","            uid = Y.stamp(node),","            attrs = Transition._nodeAttrs[uid],","            customAttr = Transition.behaviors,","            done = false,","            allDone = false,","            data,","            name,","            attribute,","            setter,","            elapsed,","            delay,","            d,","            t,","            i;","","        for (name in attrs) {","            if ((attribute = attrs[name]) && attribute.transition === anim) {","                d = attribute.duration;","                delay = attribute.delay;","                elapsed = (time - delay) / 1000;","                t = time;","                data = {","                    type: 'propertyEnd',","                    propertyName: name,","                    config: config,","                    elapsedTime: elapsed","                };","","                setter = (i in customAttr && 'set' in customAttr[i]) ?","                        customAttr[i].set : Transition.DEFAULT_SETTER;","","                done = (t >= d);","","                if (t > d) {","                    t = d;","                }","","                if (!delay || time >= delay) {","                    setter(anim, name, attribute.from, attribute.to, t - delay, d - delay,","                        attribute.easing, attribute.unit); ","","                    if (done) {","                        delete attrs[name];","                        anim._count--;","","                        if (config[name] && config[name].on && config[name].on.end) {","                            config[name].on.end.call(Y.one(node), data);","                        }","","                        //node.fire('transition:propertyEnd', data);","","                        if (!allDone && anim._count <= 0) {","                            allDone = true;","                            anim._end(elapsed);","                            anim._endTimer();","                        }","                    }","                }","","            }","        }","    },","","    _initAttrs: function() {","        var anim = this,","            customAttr = Transition.behaviors,","            uid = Y.stamp(anim._node),","            attrs = Transition._nodeAttrs[uid],","            attribute,","            duration,","            delay,","            easing,","            val,","            name,","            mTo,","            mFrom,","            unit, begin, end;","","        for (name in attrs) {","            if ((attribute = attrs[name]) && attribute.transition === anim) {","                duration = attribute.duration * 1000;","                delay = attribute.delay * 1000;","                easing = attribute.easing;","                val = attribute.value;","","                // only allow supported properties","                if (name in anim._node.style || name in Y.DOM.CUSTOM_STYLES) {","                    begin = (name in customAttr && 'get' in customAttr[name])  ?","                            customAttr[name].get(anim, name) : Transition.DEFAULT_GETTER(anim, name);","","                    mFrom = Transition.RE_UNITS.exec(begin);","                    mTo = Transition.RE_UNITS.exec(val);","","                    begin = mFrom ? mFrom[1] : begin;","                    end = mTo ? mTo[1] : val;","                    unit = mTo ? mTo[2] : mFrom ?  mFrom[2] : ''; // one might be zero TODO: mixed units","","                    if (!unit && Transition.RE_DEFAULT_UNIT.test(name)) {","                        unit = Transition.DEFAULT_UNIT;","                    }","","                    if (typeof easing === 'string') {","                        if (easing.indexOf('cubic-bezier') > -1) {","                            easing = easing.substring(13, easing.length - 1).split(',');","                        } else if (Transition.easings[easing]) {","                            easing = Transition.easings[easing];","                        }","                    }","","                    attribute.from = Number(begin);","                    attribute.to = Number(end);","                    attribute.unit = unit;","                    attribute.easing = easing;","                    attribute.duration = duration + delay;","                    attribute.delay = delay;","                } else {","                    delete attrs[name];","                    anim._count--;","                }","            }","        }","    },","","    destroy: function() {","        this.detachAll();","        this._node = null;","    }","}, true);","","Y.mix(Y.Transition, {","    _runtimeAttrs: {},","    /*","     * Regex of properties that should use the default unit.","     *","     * @property RE_DEFAULT_UNIT","     * @static","     */","    RE_DEFAULT_UNIT: /^width|height|top|right|bottom|left|margin.*|padding.*|border.*$/i,","","    /*","     * The default unit to use with properties that pass the RE_DEFAULT_UNIT test.","     *","     * @property DEFAULT_UNIT","     * @static","     */","    DEFAULT_UNIT: 'px',","","    /*","     * Time in milliseconds passed to setInterval for frame processing ","     *","     * @property intervalTime","     * @default 20","     * @static","     */","    intervalTime: 20,","","    /*","     * Bucket for custom getters and setters","     *","     * @property behaviors","     * @static","     */","    behaviors: {","        left: {","            get: function(anim, attr) {","                return Y.DOM._getAttrOffset(anim._node, attr);","            }","        }","    },","","    /*","     * The default setter to use when setting object properties.","     *","     * @property DEFAULT_SETTER","     * @static","     */","    DEFAULT_SETTER: function(anim, att, from, to, elapsed, duration, fn, unit) {","        from = Number(from);","        to = Number(to);","","        var node = anim._node,","            val = Transition.cubicBezier(fn, elapsed / duration);","","        val = from + val[0] * (to - from);","","        if (node) {","            if (att in node.style || att in Y.DOM.CUSTOM_STYLES) {","                unit = unit || '';","                Y.DOM.setStyle(node, att, val + unit);","            }","        } else {","            anim._end();","        }","    },","","    /*","     * The default getter to use when getting object properties.","     *","     * @property DEFAULT_GETTER","     * @static","     */","    DEFAULT_GETTER: function(anim, att) {","        var node = anim._node,","            val = '';","","        if (att in node.style || att in Y.DOM.CUSTOM_STYLES) {","            val = Y.DOM.getComputedStyle(node, att);","        }","","        return val;","    },","","    _startTimer: function() {","        if (!Transition._timer) {","            Transition._timer = setInterval(Transition._runFrame, Transition.intervalTime);","        }","    },","","    _stopTimer: function() {","        clearInterval(Transition._timer);","        Transition._timer = null;","    },","","    /*","     * Called per Interval to handle each animation frame.","     * @method _runFrame","     * @private","     * @static","     */    ","    _runFrame: function() {","        var done = true,","            anim;","        for (anim in Transition._running) {","            if (Transition._running[anim]._runFrame) {","                done = false;","                Transition._running[anim]._runFrame();","            }","        }","","        if (done) {","            Transition._stopTimer();","        }","    },","","    cubicBezier: function(p, t) {","        var x0 = 0,","            y0 = 0,","            x1 = p[0],","            y1 = p[1],","            x2 = p[2],","            y2 = p[3],","            x3 = 1,","            y3 = 0,","","            A = x3 - 3 * x2 + 3 * x1 - x0,","            B = 3 * x2 - 6 * x1 + 3 * x0,","            C = 3 * x1 - 3 * x0,","            D = x0,","            E = y3 - 3 * y2 + 3 * y1 - y0,","            F = 3 * y2 - 6 * y1 + 3 * y0,","            G = 3 * y1 - 3 * y0,","            H = y0,","","            x = (((A*t) + B)*t + C)*t + D,","            y = (((E*t) + F)*t + G)*t + H;","","        return [x, y];","    },","","    easings: {","        ease: [0.25, 0, 1, 0.25],","        linear: [0, 0, 1, 1],","        'ease-in': [0.42, 0, 1, 1],","        'ease-out': [0, 0, 0.58, 1],","        'ease-in-out': [0.42, 0, 0.58, 1]","    },","","    _running: {},","    _timer: null,","","    RE_UNITS: /^(-?\\d*\\.?\\d*){1}(em|ex|px|in|cm|mm|pt|pc|%)*$/","}, true); ","","Transition.behaviors.top = Transition.behaviors.bottom = Transition.behaviors.right = Transition.behaviors.left;","","Y.Transition = Transition;","","","}, '3.7.3', {\"requires\": [\"transition\"]});"];
_yuitest_coverage["build/transition-timer/transition-timer.js"].lines = {"1":0,"11":0,"13":0,"15":0,"16":0,"18":0,"23":0,"24":0,"26":0,"27":0,"28":0,"32":0,"33":0,"34":0,"38":0,"39":0,"43":0,"61":0,"62":0,"63":0,"64":0,"65":0,"66":0,"67":0,"74":0,"77":0,"79":0,"80":0,"83":0,"84":0,"87":0,"88":0,"89":0,"91":0,"92":0,"97":0,"98":0,"99":0,"100":0,"110":0,"124":0,"125":0,"126":0,"127":0,"128":0,"129":0,"132":0,"133":0,"136":0,"137":0,"139":0,"140":0,"141":0,"143":0,"144":0,"147":0,"148":0,"149":0,"150":0,"151":0,"155":0,"156":0,"157":0,"158":0,"159":0,"160":0,"162":0,"163":0,"170":0,"171":0,"175":0,"211":0,"223":0,"224":0,"226":0,"229":0,"231":0,"232":0,"233":0,"234":0,"237":0,"248":0,"251":0,"252":0,"255":0,"259":0,"260":0,"265":0,"266":0,"276":0,"278":0,"279":0,"280":0,"281":0,"285":0,"286":0,"291":0,"312":0,"329":0,"331":0};
_yuitest_coverage["build/transition-timer/transition-timer.js"].functions = {"_start:14":0,"_runTimer:22":0,"_endTimer:31":0,"_runFrame:37":0,"_runAttrs:42":0,"_initAttrs:109":0,"destroy:169":0,"get:210":0,"DEFAULT_SETTER:222":0,"DEFAULT_GETTER:247":0,"_startTimer:258":0,"_stopTimer:264":0,"_runFrame:275":0,"cubicBezier:290":0,"(anonymous 1):1":0};
_yuitest_coverage["build/transition-timer/transition-timer.js"].coveredLines = 100;
_yuitest_coverage["build/transition-timer/transition-timer.js"].coveredFunctions = 15;
_yuitest_coverline("build/transition-timer/transition-timer.js", 1);
YUI.add('transition-timer', function (Y, NAME) {

/**
* Provides the base Transition class, for animating numeric properties.
*
* @module transition
* @submodule transition-timer
*/


_yuitest_coverfunc("build/transition-timer/transition-timer.js", "(anonymous 1)", 1);
_yuitest_coverline("build/transition-timer/transition-timer.js", 11);
var Transition = Y.Transition;

_yuitest_coverline("build/transition-timer/transition-timer.js", 13);
Y.mix(Transition.prototype, {
    _start: function() {
        _yuitest_coverfunc("build/transition-timer/transition-timer.js", "_start", 14);
_yuitest_coverline("build/transition-timer/transition-timer.js", 15);
if (Transition.useNative) {
            _yuitest_coverline("build/transition-timer/transition-timer.js", 16);
this._runNative();
        } else {
            _yuitest_coverline("build/transition-timer/transition-timer.js", 18);
this._runTimer();
        }
    },

    _runTimer: function() {
        _yuitest_coverfunc("build/transition-timer/transition-timer.js", "_runTimer", 22);
_yuitest_coverline("build/transition-timer/transition-timer.js", 23);
var anim = this;
        _yuitest_coverline("build/transition-timer/transition-timer.js", 24);
anim._initAttrs();

        _yuitest_coverline("build/transition-timer/transition-timer.js", 26);
Transition._running[Y.stamp(anim)] = anim;
        _yuitest_coverline("build/transition-timer/transition-timer.js", 27);
anim._startTime = new Date();
        _yuitest_coverline("build/transition-timer/transition-timer.js", 28);
Transition._startTimer();
    },

    _endTimer: function() {
        _yuitest_coverfunc("build/transition-timer/transition-timer.js", "_endTimer", 31);
_yuitest_coverline("build/transition-timer/transition-timer.js", 32);
var anim = this;
        _yuitest_coverline("build/transition-timer/transition-timer.js", 33);
delete Transition._running[Y.stamp(anim)];
        _yuitest_coverline("build/transition-timer/transition-timer.js", 34);
anim._startTime = null;
    },

    _runFrame: function() {
        _yuitest_coverfunc("build/transition-timer/transition-timer.js", "_runFrame", 37);
_yuitest_coverline("build/transition-timer/transition-timer.js", 38);
var t = new Date() - this._startTime;
        _yuitest_coverline("build/transition-timer/transition-timer.js", 39);
this._runAttrs(t);
    },

    _runAttrs: function(time) {
        _yuitest_coverfunc("build/transition-timer/transition-timer.js", "_runAttrs", 42);
_yuitest_coverline("build/transition-timer/transition-timer.js", 43);
var anim = this,
            node = anim._node,
            config = anim._config,
            uid = Y.stamp(node),
            attrs = Transition._nodeAttrs[uid],
            customAttr = Transition.behaviors,
            done = false,
            allDone = false,
            data,
            name,
            attribute,
            setter,
            elapsed,
            delay,
            d,
            t,
            i;

        _yuitest_coverline("build/transition-timer/transition-timer.js", 61);
for (name in attrs) {
            _yuitest_coverline("build/transition-timer/transition-timer.js", 62);
if ((attribute = attrs[name]) && attribute.transition === anim) {
                _yuitest_coverline("build/transition-timer/transition-timer.js", 63);
d = attribute.duration;
                _yuitest_coverline("build/transition-timer/transition-timer.js", 64);
delay = attribute.delay;
                _yuitest_coverline("build/transition-timer/transition-timer.js", 65);
elapsed = (time - delay) / 1000;
                _yuitest_coverline("build/transition-timer/transition-timer.js", 66);
t = time;
                _yuitest_coverline("build/transition-timer/transition-timer.js", 67);
data = {
                    type: 'propertyEnd',
                    propertyName: name,
                    config: config,
                    elapsedTime: elapsed
                };

                _yuitest_coverline("build/transition-timer/transition-timer.js", 74);
setter = (i in customAttr && 'set' in customAttr[i]) ?
                        customAttr[i].set : Transition.DEFAULT_SETTER;

                _yuitest_coverline("build/transition-timer/transition-timer.js", 77);
done = (t >= d);

                _yuitest_coverline("build/transition-timer/transition-timer.js", 79);
if (t > d) {
                    _yuitest_coverline("build/transition-timer/transition-timer.js", 80);
t = d;
                }

                _yuitest_coverline("build/transition-timer/transition-timer.js", 83);
if (!delay || time >= delay) {
                    _yuitest_coverline("build/transition-timer/transition-timer.js", 84);
setter(anim, name, attribute.from, attribute.to, t - delay, d - delay,
                        attribute.easing, attribute.unit); 

                    _yuitest_coverline("build/transition-timer/transition-timer.js", 87);
if (done) {
                        _yuitest_coverline("build/transition-timer/transition-timer.js", 88);
delete attrs[name];
                        _yuitest_coverline("build/transition-timer/transition-timer.js", 89);
anim._count--;

                        _yuitest_coverline("build/transition-timer/transition-timer.js", 91);
if (config[name] && config[name].on && config[name].on.end) {
                            _yuitest_coverline("build/transition-timer/transition-timer.js", 92);
config[name].on.end.call(Y.one(node), data);
                        }

                        //node.fire('transition:propertyEnd', data);

                        _yuitest_coverline("build/transition-timer/transition-timer.js", 97);
if (!allDone && anim._count <= 0) {
                            _yuitest_coverline("build/transition-timer/transition-timer.js", 98);
allDone = true;
                            _yuitest_coverline("build/transition-timer/transition-timer.js", 99);
anim._end(elapsed);
                            _yuitest_coverline("build/transition-timer/transition-timer.js", 100);
anim._endTimer();
                        }
                    }
                }

            }
        }
    },

    _initAttrs: function() {
        _yuitest_coverfunc("build/transition-timer/transition-timer.js", "_initAttrs", 109);
_yuitest_coverline("build/transition-timer/transition-timer.js", 110);
var anim = this,
            customAttr = Transition.behaviors,
            uid = Y.stamp(anim._node),
            attrs = Transition._nodeAttrs[uid],
            attribute,
            duration,
            delay,
            easing,
            val,
            name,
            mTo,
            mFrom,
            unit, begin, end;

        _yuitest_coverline("build/transition-timer/transition-timer.js", 124);
for (name in attrs) {
            _yuitest_coverline("build/transition-timer/transition-timer.js", 125);
if ((attribute = attrs[name]) && attribute.transition === anim) {
                _yuitest_coverline("build/transition-timer/transition-timer.js", 126);
duration = attribute.duration * 1000;
                _yuitest_coverline("build/transition-timer/transition-timer.js", 127);
delay = attribute.delay * 1000;
                _yuitest_coverline("build/transition-timer/transition-timer.js", 128);
easing = attribute.easing;
                _yuitest_coverline("build/transition-timer/transition-timer.js", 129);
val = attribute.value;

                // only allow supported properties
                _yuitest_coverline("build/transition-timer/transition-timer.js", 132);
if (name in anim._node.style || name in Y.DOM.CUSTOM_STYLES) {
                    _yuitest_coverline("build/transition-timer/transition-timer.js", 133);
begin = (name in customAttr && 'get' in customAttr[name])  ?
                            customAttr[name].get(anim, name) : Transition.DEFAULT_GETTER(anim, name);

                    _yuitest_coverline("build/transition-timer/transition-timer.js", 136);
mFrom = Transition.RE_UNITS.exec(begin);
                    _yuitest_coverline("build/transition-timer/transition-timer.js", 137);
mTo = Transition.RE_UNITS.exec(val);

                    _yuitest_coverline("build/transition-timer/transition-timer.js", 139);
begin = mFrom ? mFrom[1] : begin;
                    _yuitest_coverline("build/transition-timer/transition-timer.js", 140);
end = mTo ? mTo[1] : val;
                    _yuitest_coverline("build/transition-timer/transition-timer.js", 141);
unit = mTo ? mTo[2] : mFrom ?  mFrom[2] : ''; // one might be zero TODO: mixed units

                    _yuitest_coverline("build/transition-timer/transition-timer.js", 143);
if (!unit && Transition.RE_DEFAULT_UNIT.test(name)) {
                        _yuitest_coverline("build/transition-timer/transition-timer.js", 144);
unit = Transition.DEFAULT_UNIT;
                    }

                    _yuitest_coverline("build/transition-timer/transition-timer.js", 147);
if (typeof easing === 'string') {
                        _yuitest_coverline("build/transition-timer/transition-timer.js", 148);
if (easing.indexOf('cubic-bezier') > -1) {
                            _yuitest_coverline("build/transition-timer/transition-timer.js", 149);
easing = easing.substring(13, easing.length - 1).split(',');
                        } else {_yuitest_coverline("build/transition-timer/transition-timer.js", 150);
if (Transition.easings[easing]) {
                            _yuitest_coverline("build/transition-timer/transition-timer.js", 151);
easing = Transition.easings[easing];
                        }}
                    }

                    _yuitest_coverline("build/transition-timer/transition-timer.js", 155);
attribute.from = Number(begin);
                    _yuitest_coverline("build/transition-timer/transition-timer.js", 156);
attribute.to = Number(end);
                    _yuitest_coverline("build/transition-timer/transition-timer.js", 157);
attribute.unit = unit;
                    _yuitest_coverline("build/transition-timer/transition-timer.js", 158);
attribute.easing = easing;
                    _yuitest_coverline("build/transition-timer/transition-timer.js", 159);
attribute.duration = duration + delay;
                    _yuitest_coverline("build/transition-timer/transition-timer.js", 160);
attribute.delay = delay;
                } else {
                    _yuitest_coverline("build/transition-timer/transition-timer.js", 162);
delete attrs[name];
                    _yuitest_coverline("build/transition-timer/transition-timer.js", 163);
anim._count--;
                }
            }
        }
    },

    destroy: function() {
        _yuitest_coverfunc("build/transition-timer/transition-timer.js", "destroy", 169);
_yuitest_coverline("build/transition-timer/transition-timer.js", 170);
this.detachAll();
        _yuitest_coverline("build/transition-timer/transition-timer.js", 171);
this._node = null;
    }
}, true);

_yuitest_coverline("build/transition-timer/transition-timer.js", 175);
Y.mix(Y.Transition, {
    _runtimeAttrs: {},
    /*
     * Regex of properties that should use the default unit.
     *
     * @property RE_DEFAULT_UNIT
     * @static
     */
    RE_DEFAULT_UNIT: /^width|height|top|right|bottom|left|margin.*|padding.*|border.*$/i,

    /*
     * The default unit to use with properties that pass the RE_DEFAULT_UNIT test.
     *
     * @property DEFAULT_UNIT
     * @static
     */
    DEFAULT_UNIT: 'px',

    /*
     * Time in milliseconds passed to setInterval for frame processing 
     *
     * @property intervalTime
     * @default 20
     * @static
     */
    intervalTime: 20,

    /*
     * Bucket for custom getters and setters
     *
     * @property behaviors
     * @static
     */
    behaviors: {
        left: {
            get: function(anim, attr) {
                _yuitest_coverfunc("build/transition-timer/transition-timer.js", "get", 210);
_yuitest_coverline("build/transition-timer/transition-timer.js", 211);
return Y.DOM._getAttrOffset(anim._node, attr);
            }
        }
    },

    /*
     * The default setter to use when setting object properties.
     *
     * @property DEFAULT_SETTER
     * @static
     */
    DEFAULT_SETTER: function(anim, att, from, to, elapsed, duration, fn, unit) {
        _yuitest_coverfunc("build/transition-timer/transition-timer.js", "DEFAULT_SETTER", 222);
_yuitest_coverline("build/transition-timer/transition-timer.js", 223);
from = Number(from);
        _yuitest_coverline("build/transition-timer/transition-timer.js", 224);
to = Number(to);

        _yuitest_coverline("build/transition-timer/transition-timer.js", 226);
var node = anim._node,
            val = Transition.cubicBezier(fn, elapsed / duration);

        _yuitest_coverline("build/transition-timer/transition-timer.js", 229);
val = from + val[0] * (to - from);

        _yuitest_coverline("build/transition-timer/transition-timer.js", 231);
if (node) {
            _yuitest_coverline("build/transition-timer/transition-timer.js", 232);
if (att in node.style || att in Y.DOM.CUSTOM_STYLES) {
                _yuitest_coverline("build/transition-timer/transition-timer.js", 233);
unit = unit || '';
                _yuitest_coverline("build/transition-timer/transition-timer.js", 234);
Y.DOM.setStyle(node, att, val + unit);
            }
        } else {
            _yuitest_coverline("build/transition-timer/transition-timer.js", 237);
anim._end();
        }
    },

    /*
     * The default getter to use when getting object properties.
     *
     * @property DEFAULT_GETTER
     * @static
     */
    DEFAULT_GETTER: function(anim, att) {
        _yuitest_coverfunc("build/transition-timer/transition-timer.js", "DEFAULT_GETTER", 247);
_yuitest_coverline("build/transition-timer/transition-timer.js", 248);
var node = anim._node,
            val = '';

        _yuitest_coverline("build/transition-timer/transition-timer.js", 251);
if (att in node.style || att in Y.DOM.CUSTOM_STYLES) {
            _yuitest_coverline("build/transition-timer/transition-timer.js", 252);
val = Y.DOM.getComputedStyle(node, att);
        }

        _yuitest_coverline("build/transition-timer/transition-timer.js", 255);
return val;
    },

    _startTimer: function() {
        _yuitest_coverfunc("build/transition-timer/transition-timer.js", "_startTimer", 258);
_yuitest_coverline("build/transition-timer/transition-timer.js", 259);
if (!Transition._timer) {
            _yuitest_coverline("build/transition-timer/transition-timer.js", 260);
Transition._timer = setInterval(Transition._runFrame, Transition.intervalTime);
        }
    },

    _stopTimer: function() {
        _yuitest_coverfunc("build/transition-timer/transition-timer.js", "_stopTimer", 264);
_yuitest_coverline("build/transition-timer/transition-timer.js", 265);
clearInterval(Transition._timer);
        _yuitest_coverline("build/transition-timer/transition-timer.js", 266);
Transition._timer = null;
    },

    /*
     * Called per Interval to handle each animation frame.
     * @method _runFrame
     * @private
     * @static
     */    
    _runFrame: function() {
        _yuitest_coverfunc("build/transition-timer/transition-timer.js", "_runFrame", 275);
_yuitest_coverline("build/transition-timer/transition-timer.js", 276);
var done = true,
            anim;
        _yuitest_coverline("build/transition-timer/transition-timer.js", 278);
for (anim in Transition._running) {
            _yuitest_coverline("build/transition-timer/transition-timer.js", 279);
if (Transition._running[anim]._runFrame) {
                _yuitest_coverline("build/transition-timer/transition-timer.js", 280);
done = false;
                _yuitest_coverline("build/transition-timer/transition-timer.js", 281);
Transition._running[anim]._runFrame();
            }
        }

        _yuitest_coverline("build/transition-timer/transition-timer.js", 285);
if (done) {
            _yuitest_coverline("build/transition-timer/transition-timer.js", 286);
Transition._stopTimer();
        }
    },

    cubicBezier: function(p, t) {
        _yuitest_coverfunc("build/transition-timer/transition-timer.js", "cubicBezier", 290);
_yuitest_coverline("build/transition-timer/transition-timer.js", 291);
var x0 = 0,
            y0 = 0,
            x1 = p[0],
            y1 = p[1],
            x2 = p[2],
            y2 = p[3],
            x3 = 1,
            y3 = 0,

            A = x3 - 3 * x2 + 3 * x1 - x0,
            B = 3 * x2 - 6 * x1 + 3 * x0,
            C = 3 * x1 - 3 * x0,
            D = x0,
            E = y3 - 3 * y2 + 3 * y1 - y0,
            F = 3 * y2 - 6 * y1 + 3 * y0,
            G = 3 * y1 - 3 * y0,
            H = y0,

            x = (((A*t) + B)*t + C)*t + D,
            y = (((E*t) + F)*t + G)*t + H;

        _yuitest_coverline("build/transition-timer/transition-timer.js", 312);
return [x, y];
    },

    easings: {
        ease: [0.25, 0, 1, 0.25],
        linear: [0, 0, 1, 1],
        'ease-in': [0.42, 0, 1, 1],
        'ease-out': [0, 0, 0.58, 1],
        'ease-in-out': [0.42, 0, 0.58, 1]
    },

    _running: {},
    _timer: null,

    RE_UNITS: /^(-?\d*\.?\d*){1}(em|ex|px|in|cm|mm|pt|pc|%)*$/
}, true); 

_yuitest_coverline("build/transition-timer/transition-timer.js", 329);
Transition.behaviors.top = Transition.behaviors.bottom = Transition.behaviors.right = Transition.behaviors.left;

_yuitest_coverline("build/transition-timer/transition-timer.js", 331);
Y.Transition = Transition;


}, '3.7.3', {"requires": ["transition"]});
