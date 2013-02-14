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
_yuitest_coverage["build/anim-easing/anim-easing.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/anim-easing/anim-easing.js",
    code: []
};
_yuitest_coverage["build/anim-easing/anim-easing.js"].code=["YUI.add('anim-easing', function (Y, NAME) {","","/*","TERMS OF USE - EASING EQUATIONS","Open source under the BSD License.","Copyright 2001 Robert Penner All rights reserved.","","Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:",""," * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer."," * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution."," * Neither the name of the author nor the names of contributors may be used to endorse or promote products derived from this software without specific prior written permission.","","THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS \"AS IS\" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.","*/","","/**"," * The easing module provides methods for customizing"," * how an animation behaves during each run."," * @class Easing"," * @module anim"," * @submodule anim-easing"," */","","var Easing = {","","    /**","     * Uniform speed between points.","     * @for Easing","     * @method easeNone","     * @param {Number} t Time value used to compute current value","     * @param {Number} b Starting value","     * @param {Number} c Delta between start and end values","     * @param {Number} d Total length of animation","     * @return {Number} The computed value for the current animation frame","     */","    easeNone: function (t, b, c, d) {","        return c*t/d + b;","    },","    ","    /**","     * Begins slowly and accelerates towards end. (quadratic)","     * @method easeIn","     * @param {Number} t Time value used to compute current value","     * @param {Number} b Starting value","     * @param {Number} c Delta between start and end values","     * @param {Number} d Total length of animation","     * @return {Number} The computed value for the current animation frame","     */","    easeIn: function (t, b, c, d) {","        return c*(t/=d)*t + b;","    },","","    /**","     * Begins quickly and decelerates towards end.  (quadratic)","     * @method easeOut","     * @param {Number} t Time value used to compute current value","     * @param {Number} b Starting value","     * @param {Number} c Delta between start and end values","     * @param {Number} d Total length of animation","     * @return {Number} The computed value for the current animation frame","     */","    easeOut: function (t, b, c, d) {","        return -c *(t/=d)*(t-2) + b;","    },","    ","    /**","     * Begins slowly and decelerates towards end. (quadratic)","     * @method easeBoth","     * @param {Number} t Time value used to compute current value","     * @param {Number} b Starting value","     * @param {Number} c Delta between start and end values","     * @param {Number} d Total length of animation","     * @return {Number} The computed value for the current animation frame","     */","    easeBoth: function (t, b, c, d) {","        if ((t/=d/2) < 1) {","            return c/2*t*t + b;","        }","        ","        return -c/2 * ((--t)*(t-2) - 1) + b;","    },","    ","    /**","     * Begins slowly and accelerates towards end. (quartic)","     * @method easeInStrong","     * @param {Number} t Time value used to compute current value","     * @param {Number} b Starting value","     * @param {Number} c Delta between start and end values","     * @param {Number} d Total length of animation","     * @return {Number} The computed value for the current animation frame","     */","    easeInStrong: function (t, b, c, d) {","        return c*(t/=d)*t*t*t + b;","    },","    ","    /**","     * Begins quickly and decelerates towards end.  (quartic)","     * @method easeOutStrong","     * @param {Number} t Time value used to compute current value","     * @param {Number} b Starting value","     * @param {Number} c Delta between start and end values","     * @param {Number} d Total length of animation","     * @return {Number} The computed value for the current animation frame","     */","    easeOutStrong: function (t, b, c, d) {","        return -c * ((t=t/d-1)*t*t*t - 1) + b;","    },","    ","    /**","     * Begins slowly and decelerates towards end. (quartic)","     * @method easeBothStrong","     * @param {Number} t Time value used to compute current value","     * @param {Number} b Starting value","     * @param {Number} c Delta between start and end values","     * @param {Number} d Total length of animation","     * @return {Number} The computed value for the current animation frame","     */","    easeBothStrong: function (t, b, c, d) {","        if ((t/=d/2) < 1) {","            return c/2*t*t*t*t + b;","        }","        ","        return -c/2 * ((t-=2)*t*t*t - 2) + b;","    },","","    /**","     * Snap in elastic effect.","     * @method elasticIn","     * @param {Number} t Time value used to compute current value","     * @param {Number} b Starting value","     * @param {Number} c Delta between start and end values","     * @param {Number} d Total length of animation","     * @param {Number} a Amplitude (optional)","     * @param {Number} p Period (optional)","     * @return {Number} The computed value for the current animation frame","     */","","    elasticIn: function (t, b, c, d, a, p) {","        var s;","        if (t === 0) {","            return b;","        }","        if ( (t /= d) === 1 ) {","            return b+c;","        }","        if (!p) {","            p = d* 0.3;","        }","        ","        if (!a || a < Math.abs(c)) {","            a = c; ","            s = p/4;","        }","        else {","            s = p/(2*Math.PI) * Math.asin (c/a);","        }","        ","        return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;","    },","","    /**","     * Snap out elastic effect.","     * @method elasticOut","     * @param {Number} t Time value used to compute current value","     * @param {Number} b Starting value","     * @param {Number} c Delta between start and end values","     * @param {Number} d Total length of animation","     * @param {Number} a Amplitude (optional)","     * @param {Number} p Period (optional)","     * @return {Number} The computed value for the current animation frame","     */","    elasticOut: function (t, b, c, d, a, p) {","        var s;","        if (t === 0) {","            return b;","        }","        if ( (t /= d) === 1 ) {","            return b+c;","        }","        if (!p) {","            p=d * 0.3;","        }","        ","        if (!a || a < Math.abs(c)) {","            a = c;","            s = p / 4;","        }","        else {","            s = p/(2*Math.PI) * Math.asin (c/a);","        }","        ","        return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;","    },","    ","    /**","     * Snap both elastic effect.","     * @method elasticBoth","     * @param {Number} t Time value used to compute current value","     * @param {Number} b Starting value","     * @param {Number} c Delta between start and end values","     * @param {Number} d Total length of animation","     * @param {Number} a Amplitude (optional)","     * @param {Number} p Period (optional)","     * @return {Number} The computed value for the current animation frame","     */","    elasticBoth: function (t, b, c, d, a, p) {","        var s;","        if (t === 0) {","            return b;","        }","        ","        if ( (t /= d/2) === 2 ) {","            return b+c;","        }","        ","        if (!p) {","            p = d*(0.3*1.5);","        }","        ","        if ( !a || a < Math.abs(c) ) {","            a = c; ","            s = p/4;","        }","        else {","            s = p/(2*Math.PI) * Math.asin (c/a);","        }","        ","        if (t < 1) {","            return -0.5*(a*Math.pow(2,10*(t-=1)) * ","                    Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;","        }","        return a*Math.pow(2,-10*(t-=1)) * ","                Math.sin( (t*d-s)*(2*Math.PI)/p )*0.5 + c + b;","    },","","","    /**","     * Backtracks slightly, then reverses direction and moves to end.","     * @method backIn","     * @param {Number} t Time value used to compute current value","     * @param {Number} b Starting value","     * @param {Number} c Delta between start and end values","     * @param {Number} d Total length of animation","     * @param {Number} s Overshoot (optional)","     * @return {Number} The computed value for the current animation frame","     */","    backIn: function (t, b, c, d, s) {","        if (s === undefined) {","            s = 1.70158;","        }","        if (t === d) {","            t -= 0.001;","        }","        return c*(t/=d)*t*((s+1)*t - s) + b;","    },","","    /**","     * Overshoots end, then reverses and comes back to end.","     * @method backOut","     * @param {Number} t Time value used to compute current value","     * @param {Number} b Starting value","     * @param {Number} c Delta between start and end values","     * @param {Number} d Total length of animation","     * @param {Number} s Overshoot (optional)","     * @return {Number} The computed value for the current animation frame","     */","    backOut: function (t, b, c, d, s) {","        if (typeof s === 'undefined') {","            s = 1.70158;","        }","        return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;","    },","    ","    /**","     * Backtracks slightly, then reverses direction, overshoots end, ","     * then reverses and comes back to end.","     * @method backBoth","     * @param {Number} t Time value used to compute current value","     * @param {Number} b Starting value","     * @param {Number} c Delta between start and end values","     * @param {Number} d Total length of animation","     * @param {Number} s Overshoot (optional)","     * @return {Number} The computed value for the current animation frame","     */","    backBoth: function (t, b, c, d, s) {","        if (typeof s === 'undefined') {","            s = 1.70158; ","        }","        ","        if ((t /= d/2 ) < 1) {","            return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;","        }","        return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;","    },","","    /**","     * Bounce off of start.","     * @method bounceIn","     * @param {Number} t Time value used to compute current value","     * @param {Number} b Starting value","     * @param {Number} c Delta between start and end values","     * @param {Number} d Total length of animation","     * @return {Number} The computed value for the current animation frame","     */","    bounceIn: function (t, b, c, d) {","        return c - Y.Easing.bounceOut(d-t, 0, c, d) + b;","    },","    ","    /**","     * Bounces off end.","     * @method bounceOut","     * @param {Number} t Time value used to compute current value","     * @param {Number} b Starting value","     * @param {Number} c Delta between start and end values","     * @param {Number} d Total length of animation","     * @return {Number} The computed value for the current animation frame","     */","    bounceOut: function (t, b, c, d) {","        if ((t/=d) < (1/2.75)) {","                return c*(7.5625*t*t) + b;","        } else if (t < (2/2.75)) {","                return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;","        } else if (t < (2.5/2.75)) {","                return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;","        }","        return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;","    },","    ","    /**","     * Bounces off start and end.","     * @method bounceBoth","     * @param {Number} t Time value used to compute current value","     * @param {Number} b Starting value","     * @param {Number} c Delta between start and end values","     * @param {Number} d Total length of animation","     * @return {Number} The computed value for the current animation frame","     */","    bounceBoth: function (t, b, c, d) {","        if (t < d/2) {","            return Y.Easing.bounceIn(t * 2, 0, c, d) * 0.5 + b;","        }","        return Y.Easing.bounceOut(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;","    }","};","","Y.Easing = Easing;","","","}, '3.7.3', {\"requires\": [\"anim-base\"]});"];
_yuitest_coverage["build/anim-easing/anim-easing.js"].lines = {"1":0,"25":0,"38":0,"51":0,"64":0,"77":0,"78":0,"81":0,"94":0,"107":0,"120":0,"121":0,"124":0,"140":0,"141":0,"142":0,"144":0,"145":0,"147":0,"148":0,"151":0,"152":0,"153":0,"156":0,"159":0,"174":0,"175":0,"176":0,"178":0,"179":0,"181":0,"182":0,"185":0,"186":0,"187":0,"190":0,"193":0,"208":0,"209":0,"210":0,"213":0,"214":0,"217":0,"218":0,"221":0,"222":0,"223":0,"226":0,"229":0,"230":0,"233":0,"249":0,"250":0,"252":0,"253":0,"255":0,"269":0,"270":0,"272":0,"287":0,"288":0,"291":0,"292":0,"294":0,"307":0,"320":0,"321":0,"322":0,"323":0,"324":0,"325":0,"327":0,"340":0,"341":0,"343":0,"347":0};
_yuitest_coverage["build/anim-easing/anim-easing.js"].functions = {"easeNone:37":0,"easeIn:50":0,"easeOut:63":0,"easeBoth:76":0,"easeInStrong:93":0,"easeOutStrong:106":0,"easeBothStrong:119":0,"elasticIn:139":0,"elasticOut:173":0,"elasticBoth:207":0,"backIn:248":0,"backOut:268":0,"backBoth:286":0,"bounceIn:306":0,"bounceOut:319":0,"bounceBoth:339":0,"(anonymous 1):1":0};
_yuitest_coverage["build/anim-easing/anim-easing.js"].coveredLines = 76;
_yuitest_coverage["build/anim-easing/anim-easing.js"].coveredFunctions = 17;
_yuitest_coverline("build/anim-easing/anim-easing.js", 1);
YUI.add('anim-easing', function (Y, NAME) {

/*
TERMS OF USE - EASING EQUATIONS
Open source under the BSD License.
Copyright 2001 Robert Penner All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 * Neither the name of the author nor the names of contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
 * The easing module provides methods for customizing
 * how an animation behaves during each run.
 * @class Easing
 * @module anim
 * @submodule anim-easing
 */

_yuitest_coverfunc("build/anim-easing/anim-easing.js", "(anonymous 1)", 1);
_yuitest_coverline("build/anim-easing/anim-easing.js", 25);
var Easing = {

    /**
     * Uniform speed between points.
     * @for Easing
     * @method easeNone
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @return {Number} The computed value for the current animation frame
     */
    easeNone: function (t, b, c, d) {
        _yuitest_coverfunc("build/anim-easing/anim-easing.js", "easeNone", 37);
_yuitest_coverline("build/anim-easing/anim-easing.js", 38);
return c*t/d + b;
    },
    
    /**
     * Begins slowly and accelerates towards end. (quadratic)
     * @method easeIn
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @return {Number} The computed value for the current animation frame
     */
    easeIn: function (t, b, c, d) {
        _yuitest_coverfunc("build/anim-easing/anim-easing.js", "easeIn", 50);
_yuitest_coverline("build/anim-easing/anim-easing.js", 51);
return c*(t/=d)*t + b;
    },

    /**
     * Begins quickly and decelerates towards end.  (quadratic)
     * @method easeOut
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @return {Number} The computed value for the current animation frame
     */
    easeOut: function (t, b, c, d) {
        _yuitest_coverfunc("build/anim-easing/anim-easing.js", "easeOut", 63);
_yuitest_coverline("build/anim-easing/anim-easing.js", 64);
return -c *(t/=d)*(t-2) + b;
    },
    
    /**
     * Begins slowly and decelerates towards end. (quadratic)
     * @method easeBoth
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @return {Number} The computed value for the current animation frame
     */
    easeBoth: function (t, b, c, d) {
        _yuitest_coverfunc("build/anim-easing/anim-easing.js", "easeBoth", 76);
_yuitest_coverline("build/anim-easing/anim-easing.js", 77);
if ((t/=d/2) < 1) {
            _yuitest_coverline("build/anim-easing/anim-easing.js", 78);
return c/2*t*t + b;
        }
        
        _yuitest_coverline("build/anim-easing/anim-easing.js", 81);
return -c/2 * ((--t)*(t-2) - 1) + b;
    },
    
    /**
     * Begins slowly and accelerates towards end. (quartic)
     * @method easeInStrong
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @return {Number} The computed value for the current animation frame
     */
    easeInStrong: function (t, b, c, d) {
        _yuitest_coverfunc("build/anim-easing/anim-easing.js", "easeInStrong", 93);
_yuitest_coverline("build/anim-easing/anim-easing.js", 94);
return c*(t/=d)*t*t*t + b;
    },
    
    /**
     * Begins quickly and decelerates towards end.  (quartic)
     * @method easeOutStrong
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @return {Number} The computed value for the current animation frame
     */
    easeOutStrong: function (t, b, c, d) {
        _yuitest_coverfunc("build/anim-easing/anim-easing.js", "easeOutStrong", 106);
_yuitest_coverline("build/anim-easing/anim-easing.js", 107);
return -c * ((t=t/d-1)*t*t*t - 1) + b;
    },
    
    /**
     * Begins slowly and decelerates towards end. (quartic)
     * @method easeBothStrong
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @return {Number} The computed value for the current animation frame
     */
    easeBothStrong: function (t, b, c, d) {
        _yuitest_coverfunc("build/anim-easing/anim-easing.js", "easeBothStrong", 119);
_yuitest_coverline("build/anim-easing/anim-easing.js", 120);
if ((t/=d/2) < 1) {
            _yuitest_coverline("build/anim-easing/anim-easing.js", 121);
return c/2*t*t*t*t + b;
        }
        
        _yuitest_coverline("build/anim-easing/anim-easing.js", 124);
return -c/2 * ((t-=2)*t*t*t - 2) + b;
    },

    /**
     * Snap in elastic effect.
     * @method elasticIn
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @param {Number} a Amplitude (optional)
     * @param {Number} p Period (optional)
     * @return {Number} The computed value for the current animation frame
     */

    elasticIn: function (t, b, c, d, a, p) {
        _yuitest_coverfunc("build/anim-easing/anim-easing.js", "elasticIn", 139);
_yuitest_coverline("build/anim-easing/anim-easing.js", 140);
var s;
        _yuitest_coverline("build/anim-easing/anim-easing.js", 141);
if (t === 0) {
            _yuitest_coverline("build/anim-easing/anim-easing.js", 142);
return b;
        }
        _yuitest_coverline("build/anim-easing/anim-easing.js", 144);
if ( (t /= d) === 1 ) {
            _yuitest_coverline("build/anim-easing/anim-easing.js", 145);
return b+c;
        }
        _yuitest_coverline("build/anim-easing/anim-easing.js", 147);
if (!p) {
            _yuitest_coverline("build/anim-easing/anim-easing.js", 148);
p = d* 0.3;
        }
        
        _yuitest_coverline("build/anim-easing/anim-easing.js", 151);
if (!a || a < Math.abs(c)) {
            _yuitest_coverline("build/anim-easing/anim-easing.js", 152);
a = c; 
            _yuitest_coverline("build/anim-easing/anim-easing.js", 153);
s = p/4;
        }
        else {
            _yuitest_coverline("build/anim-easing/anim-easing.js", 156);
s = p/(2*Math.PI) * Math.asin (c/a);
        }
        
        _yuitest_coverline("build/anim-easing/anim-easing.js", 159);
return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
    },

    /**
     * Snap out elastic effect.
     * @method elasticOut
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @param {Number} a Amplitude (optional)
     * @param {Number} p Period (optional)
     * @return {Number} The computed value for the current animation frame
     */
    elasticOut: function (t, b, c, d, a, p) {
        _yuitest_coverfunc("build/anim-easing/anim-easing.js", "elasticOut", 173);
_yuitest_coverline("build/anim-easing/anim-easing.js", 174);
var s;
        _yuitest_coverline("build/anim-easing/anim-easing.js", 175);
if (t === 0) {
            _yuitest_coverline("build/anim-easing/anim-easing.js", 176);
return b;
        }
        _yuitest_coverline("build/anim-easing/anim-easing.js", 178);
if ( (t /= d) === 1 ) {
            _yuitest_coverline("build/anim-easing/anim-easing.js", 179);
return b+c;
        }
        _yuitest_coverline("build/anim-easing/anim-easing.js", 181);
if (!p) {
            _yuitest_coverline("build/anim-easing/anim-easing.js", 182);
p=d * 0.3;
        }
        
        _yuitest_coverline("build/anim-easing/anim-easing.js", 185);
if (!a || a < Math.abs(c)) {
            _yuitest_coverline("build/anim-easing/anim-easing.js", 186);
a = c;
            _yuitest_coverline("build/anim-easing/anim-easing.js", 187);
s = p / 4;
        }
        else {
            _yuitest_coverline("build/anim-easing/anim-easing.js", 190);
s = p/(2*Math.PI) * Math.asin (c/a);
        }
        
        _yuitest_coverline("build/anim-easing/anim-easing.js", 193);
return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
    },
    
    /**
     * Snap both elastic effect.
     * @method elasticBoth
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @param {Number} a Amplitude (optional)
     * @param {Number} p Period (optional)
     * @return {Number} The computed value for the current animation frame
     */
    elasticBoth: function (t, b, c, d, a, p) {
        _yuitest_coverfunc("build/anim-easing/anim-easing.js", "elasticBoth", 207);
_yuitest_coverline("build/anim-easing/anim-easing.js", 208);
var s;
        _yuitest_coverline("build/anim-easing/anim-easing.js", 209);
if (t === 0) {
            _yuitest_coverline("build/anim-easing/anim-easing.js", 210);
return b;
        }
        
        _yuitest_coverline("build/anim-easing/anim-easing.js", 213);
if ( (t /= d/2) === 2 ) {
            _yuitest_coverline("build/anim-easing/anim-easing.js", 214);
return b+c;
        }
        
        _yuitest_coverline("build/anim-easing/anim-easing.js", 217);
if (!p) {
            _yuitest_coverline("build/anim-easing/anim-easing.js", 218);
p = d*(0.3*1.5);
        }
        
        _yuitest_coverline("build/anim-easing/anim-easing.js", 221);
if ( !a || a < Math.abs(c) ) {
            _yuitest_coverline("build/anim-easing/anim-easing.js", 222);
a = c; 
            _yuitest_coverline("build/anim-easing/anim-easing.js", 223);
s = p/4;
        }
        else {
            _yuitest_coverline("build/anim-easing/anim-easing.js", 226);
s = p/(2*Math.PI) * Math.asin (c/a);
        }
        
        _yuitest_coverline("build/anim-easing/anim-easing.js", 229);
if (t < 1) {
            _yuitest_coverline("build/anim-easing/anim-easing.js", 230);
return -0.5*(a*Math.pow(2,10*(t-=1)) * 
                    Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
        }
        _yuitest_coverline("build/anim-easing/anim-easing.js", 233);
return a*Math.pow(2,-10*(t-=1)) * 
                Math.sin( (t*d-s)*(2*Math.PI)/p )*0.5 + c + b;
    },


    /**
     * Backtracks slightly, then reverses direction and moves to end.
     * @method backIn
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @param {Number} s Overshoot (optional)
     * @return {Number} The computed value for the current animation frame
     */
    backIn: function (t, b, c, d, s) {
        _yuitest_coverfunc("build/anim-easing/anim-easing.js", "backIn", 248);
_yuitest_coverline("build/anim-easing/anim-easing.js", 249);
if (s === undefined) {
            _yuitest_coverline("build/anim-easing/anim-easing.js", 250);
s = 1.70158;
        }
        _yuitest_coverline("build/anim-easing/anim-easing.js", 252);
if (t === d) {
            _yuitest_coverline("build/anim-easing/anim-easing.js", 253);
t -= 0.001;
        }
        _yuitest_coverline("build/anim-easing/anim-easing.js", 255);
return c*(t/=d)*t*((s+1)*t - s) + b;
    },

    /**
     * Overshoots end, then reverses and comes back to end.
     * @method backOut
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @param {Number} s Overshoot (optional)
     * @return {Number} The computed value for the current animation frame
     */
    backOut: function (t, b, c, d, s) {
        _yuitest_coverfunc("build/anim-easing/anim-easing.js", "backOut", 268);
_yuitest_coverline("build/anim-easing/anim-easing.js", 269);
if (typeof s === 'undefined') {
            _yuitest_coverline("build/anim-easing/anim-easing.js", 270);
s = 1.70158;
        }
        _yuitest_coverline("build/anim-easing/anim-easing.js", 272);
return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
    },
    
    /**
     * Backtracks slightly, then reverses direction, overshoots end, 
     * then reverses and comes back to end.
     * @method backBoth
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @param {Number} s Overshoot (optional)
     * @return {Number} The computed value for the current animation frame
     */
    backBoth: function (t, b, c, d, s) {
        _yuitest_coverfunc("build/anim-easing/anim-easing.js", "backBoth", 286);
_yuitest_coverline("build/anim-easing/anim-easing.js", 287);
if (typeof s === 'undefined') {
            _yuitest_coverline("build/anim-easing/anim-easing.js", 288);
s = 1.70158; 
        }
        
        _yuitest_coverline("build/anim-easing/anim-easing.js", 291);
if ((t /= d/2 ) < 1) {
            _yuitest_coverline("build/anim-easing/anim-easing.js", 292);
return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
        }
        _yuitest_coverline("build/anim-easing/anim-easing.js", 294);
return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
    },

    /**
     * Bounce off of start.
     * @method bounceIn
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @return {Number} The computed value for the current animation frame
     */
    bounceIn: function (t, b, c, d) {
        _yuitest_coverfunc("build/anim-easing/anim-easing.js", "bounceIn", 306);
_yuitest_coverline("build/anim-easing/anim-easing.js", 307);
return c - Y.Easing.bounceOut(d-t, 0, c, d) + b;
    },
    
    /**
     * Bounces off end.
     * @method bounceOut
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @return {Number} The computed value for the current animation frame
     */
    bounceOut: function (t, b, c, d) {
        _yuitest_coverfunc("build/anim-easing/anim-easing.js", "bounceOut", 319);
_yuitest_coverline("build/anim-easing/anim-easing.js", 320);
if ((t/=d) < (1/2.75)) {
                _yuitest_coverline("build/anim-easing/anim-easing.js", 321);
return c*(7.5625*t*t) + b;
        } else {_yuitest_coverline("build/anim-easing/anim-easing.js", 322);
if (t < (2/2.75)) {
                _yuitest_coverline("build/anim-easing/anim-easing.js", 323);
return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
        } else {_yuitest_coverline("build/anim-easing/anim-easing.js", 324);
if (t < (2.5/2.75)) {
                _yuitest_coverline("build/anim-easing/anim-easing.js", 325);
return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
        }}}
        _yuitest_coverline("build/anim-easing/anim-easing.js", 327);
return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
    },
    
    /**
     * Bounces off start and end.
     * @method bounceBoth
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @return {Number} The computed value for the current animation frame
     */
    bounceBoth: function (t, b, c, d) {
        _yuitest_coverfunc("build/anim-easing/anim-easing.js", "bounceBoth", 339);
_yuitest_coverline("build/anim-easing/anim-easing.js", 340);
if (t < d/2) {
            _yuitest_coverline("build/anim-easing/anim-easing.js", 341);
return Y.Easing.bounceIn(t * 2, 0, c, d) * 0.5 + b;
        }
        _yuitest_coverline("build/anim-easing/anim-easing.js", 343);
return Y.Easing.bounceOut(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
    }
};

_yuitest_coverline("build/anim-easing/anim-easing.js", 347);
Y.Easing = Easing;


}, '3.7.3', {"requires": ["anim-base"]});
