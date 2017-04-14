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
_yuitest_coverage["build/dom-style/dom-style.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/dom-style/dom-style.js",
    code: []
};
_yuitest_coverage["build/dom-style/dom-style.js"].code=["YUI.add('dom-style', function (Y, NAME) {","","(function(Y) {","/** "," * Add style management functionality to DOM."," * @module dom"," * @submodule dom-style"," * @for DOM"," */","","var DOCUMENT_ELEMENT = 'documentElement',","    DEFAULT_VIEW = 'defaultView',","    OWNER_DOCUMENT = 'ownerDocument',","    STYLE = 'style',","    FLOAT = 'float',","    CSS_FLOAT = 'cssFloat',","    STYLE_FLOAT = 'styleFloat',","    TRANSPARENT = 'transparent',","    GET_COMPUTED_STYLE = 'getComputedStyle',","    GET_BOUNDING_CLIENT_RECT = 'getBoundingClientRect',","","    WINDOW = Y.config.win,","    DOCUMENT = Y.config.doc,","    UNDEFINED = undefined,","","    Y_DOM = Y.DOM,","","    TRANSFORM = 'transform',","    TRANSFORMORIGIN = 'transformOrigin',","    VENDOR_TRANSFORM = [","        'WebkitTransform',","        'MozTransform',","        'OTransform',","        'msTransform'","    ],","","    re_color = /color$/i,","    re_unit = /width|height|top|left|right|bottom|margin|padding/i;","","Y.Array.each(VENDOR_TRANSFORM, function(val) {","    if (val in DOCUMENT[DOCUMENT_ELEMENT].style) {","        TRANSFORM = val;","        TRANSFORMORIGIN = val + \"Origin\";","    }","});","","Y.mix(Y_DOM, {","    DEFAULT_UNIT: 'px',","","    CUSTOM_STYLES: {","    },","","","    /**","     * Sets a style property for a given element.","     * @method setStyle","     * @param {HTMLElement} An HTMLElement to apply the style to.","     * @param {String} att The style property to set. ","     * @param {String|Number} val The value. ","     */","    setStyle: function(node, att, val, style) {","        style = style || node.style;","        var CUSTOM_STYLES = Y_DOM.CUSTOM_STYLES;","","        if (style) {","            if (val === null || val === '') { // normalize unsetting","                val = '';","            } else if (!isNaN(new Number(val)) && re_unit.test(att)) { // number values may need a unit","                val += Y_DOM.DEFAULT_UNIT;","            }","","            if (att in CUSTOM_STYLES) {","                if (CUSTOM_STYLES[att].set) {","                    CUSTOM_STYLES[att].set(node, val, style);","                    return; // NOTE: return","                } else if (typeof CUSTOM_STYLES[att] === 'string') {","                    att = CUSTOM_STYLES[att];","                }","            } else if (att === '') { // unset inline styles","                att = 'cssText';","                val = '';","            }","            style[att] = val; ","        }","    },","","    /**","     * Returns the current style value for the given property.","     * @method getStyle","     * @param {HTMLElement} An HTMLElement to get the style from.","     * @param {String} att The style property to get. ","     */","    getStyle: function(node, att, style) {","        style = style || node.style;","        var CUSTOM_STYLES = Y_DOM.CUSTOM_STYLES,","            val = '';","","        if (style) {","            if (att in CUSTOM_STYLES) {","                if (CUSTOM_STYLES[att].get) {","                    return CUSTOM_STYLES[att].get(node, att, style); // NOTE: return","                } else if (typeof CUSTOM_STYLES[att] === 'string') {","                    att = CUSTOM_STYLES[att];","                }","            }","            val = style[att];","            if (val === '') { // TODO: is empty string sufficient?","                val = Y_DOM[GET_COMPUTED_STYLE](node, att);","            }","        }","","        return val;","    },","","    /**","     * Sets multiple style properties.","     * @method setStyles","     * @param {HTMLElement} node An HTMLElement to apply the styles to. ","     * @param {Object} hash An object literal of property:value pairs. ","     */","    setStyles: function(node, hash) {","        var style = node.style;","        Y.each(hash, function(v, n) {","            Y_DOM.setStyle(node, n, v, style);","        }, Y_DOM);","    },","","    /**","     * Returns the computed style for the given node.","     * @method getComputedStyle","     * @param {HTMLElement} An HTMLElement to get the style from.","     * @param {String} att The style property to get. ","     * @return {String} The computed value of the style property. ","     */","    getComputedStyle: function(node, att) {","        var val = '',","            doc = node[OWNER_DOCUMENT],","            computed;","","        if (node[STYLE] && doc[DEFAULT_VIEW] && doc[DEFAULT_VIEW][GET_COMPUTED_STYLE]) {","            computed = doc[DEFAULT_VIEW][GET_COMPUTED_STYLE](node, null);","            if (computed) { // FF may be null in some cases (ticket #2530548)","                val = computed[att];","            }","        }","        return val;","    }","});","","// normalize reserved word float alternatives (\"cssFloat\" or \"styleFloat\")","if (DOCUMENT[DOCUMENT_ELEMENT][STYLE][CSS_FLOAT] !== UNDEFINED) {","    Y_DOM.CUSTOM_STYLES[FLOAT] = CSS_FLOAT;","} else if (DOCUMENT[DOCUMENT_ELEMENT][STYLE][STYLE_FLOAT] !== UNDEFINED) {","    Y_DOM.CUSTOM_STYLES[FLOAT] = STYLE_FLOAT;","}","","// fix opera computedStyle default color unit (convert to rgb)","if (Y.UA.opera) {","    Y_DOM[GET_COMPUTED_STYLE] = function(node, att) {","        var view = node[OWNER_DOCUMENT][DEFAULT_VIEW],","            val = view[GET_COMPUTED_STYLE](node, '')[att];","","        if (re_color.test(att)) {","            val = Y.Color.toRGB(val);","        }","","        return val;","    };","","}","","// safari converts transparent to rgba(), others use \"transparent\"","if (Y.UA.webkit) {","    Y_DOM[GET_COMPUTED_STYLE] = function(node, att) {","        var view = node[OWNER_DOCUMENT][DEFAULT_VIEW],","            val = view[GET_COMPUTED_STYLE](node, '')[att];","","        if (val === 'rgba(0, 0, 0, 0)') {","            val = TRANSPARENT; ","        }","","        return val;","    };","","}","","Y.DOM._getAttrOffset = function(node, attr) {","    var val = Y.DOM[GET_COMPUTED_STYLE](node, attr),","        offsetParent = node.offsetParent,","        position,","        parentOffset,","        offset;","","    if (val === 'auto') {","        position = Y.DOM.getStyle(node, 'position');","        if (position === 'static' || position === 'relative') {","            val = 0;    ","        } else if (offsetParent && offsetParent[GET_BOUNDING_CLIENT_RECT]) {","            parentOffset = offsetParent[GET_BOUNDING_CLIENT_RECT]()[attr];","            offset = node[GET_BOUNDING_CLIENT_RECT]()[attr];","            if (attr === 'left' || attr === 'top') {","                val = offset - parentOffset;","            } else {","                val = parentOffset - node[GET_BOUNDING_CLIENT_RECT]()[attr];","            }","        }","    }","","    return val;","};","","Y.DOM._getOffset = function(node) {","    var pos,","        xy = null;","","    if (node) {","        pos = Y_DOM.getStyle(node, 'position');","        xy = [","            parseInt(Y_DOM[GET_COMPUTED_STYLE](node, 'left'), 10),","            parseInt(Y_DOM[GET_COMPUTED_STYLE](node, 'top'), 10)","        ];","","        if ( isNaN(xy[0]) ) { // in case of 'auto'","            xy[0] = parseInt(Y_DOM.getStyle(node, 'left'), 10); // try inline","            if ( isNaN(xy[0]) ) { // default to offset value","                xy[0] = (pos === 'relative') ? 0 : node.offsetLeft || 0;","            }","        } ","","        if ( isNaN(xy[1]) ) { // in case of 'auto'","            xy[1] = parseInt(Y_DOM.getStyle(node, 'top'), 10); // try inline","            if ( isNaN(xy[1]) ) { // default to offset value","                xy[1] = (pos === 'relative') ? 0 : node.offsetTop || 0;","            }","        } ","    }","","    return xy;","","};","","Y_DOM.CUSTOM_STYLES.transform = {","    set: function(node, val, style) {","        style[TRANSFORM] = val;","    },","","    get: function(node, style) {","        return Y_DOM[GET_COMPUTED_STYLE](node, TRANSFORM);","    }","};","","Y_DOM.CUSTOM_STYLES.transformOrigin = {","    set: function(node, val, style) {","        style[TRANSFORMORIGIN] = val;","    },","","    get: function(node, style) {","        return Y_DOM[GET_COMPUTED_STYLE](node, TRANSFORMORIGIN);","    }","};","","","})(Y);","(function(Y) {","var PARSE_INT = parseInt,","    RE = RegExp;","","Y.Color = {","    KEYWORDS: {","        black: '000',","        silver: 'c0c0c0',","        gray: '808080',","        white: 'fff',","        maroon: '800000',","        red: 'f00',","        purple: '800080',","        fuchsia: 'f0f',","        green: '008000',","        lime: '0f0',","        olive: '808000',","        yellow: 'ff0',","        navy: '000080',","        blue: '00f',","        teal: '008080',","        aqua: '0ff'","    },","","    re_RGB: /^rgb\\(([0-9]+)\\s*,\\s*([0-9]+)\\s*,\\s*([0-9]+)\\)$/i,","    re_hex: /^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i,","    re_hex3: /([0-9A-F])/gi,","","    toRGB: function(val) {","        if (!Y.Color.re_RGB.test(val)) {","            val = Y.Color.toHex(val);","        }","","        if(Y.Color.re_hex.exec(val)) {","            val = 'rgb(' + [","                PARSE_INT(RE.$1, 16),","                PARSE_INT(RE.$2, 16),","                PARSE_INT(RE.$3, 16)","            ].join(', ') + ')';","        }","        return val;","    },","","    toHex: function(val) {","        val = Y.Color.KEYWORDS[val] || val;","        if (Y.Color.re_RGB.exec(val)) {","            val = [","                Number(RE.$1).toString(16),","                Number(RE.$2).toString(16),","                Number(RE.$3).toString(16)","            ];","","            for (var i = 0; i < val.length; i++) {","                if (val[i].length < 2) {","                    val[i] = '0' + val[i];","                }","            }","","            val = val.join('');","        }","","        if (val.length < 6) {","            val = val.replace(Y.Color.re_hex3, '$1$1');","        }","","        if (val !== 'transparent' && val.indexOf('#') < 0) {","            val = '#' + val;","        }","","        return val.toUpperCase();","    }","};","})(Y);","","","","}, '3.7.3', {\"requires\": [\"dom-base\"]});"];
_yuitest_coverage["build/dom-style/dom-style.js"].lines = {"1":0,"3":0,"11":0,"40":0,"41":0,"42":0,"43":0,"47":0,"62":0,"63":0,"65":0,"66":0,"67":0,"68":0,"69":0,"72":0,"73":0,"74":0,"75":0,"76":0,"77":0,"79":0,"80":0,"81":0,"83":0,"94":0,"95":0,"98":0,"99":0,"100":0,"101":0,"102":0,"103":0,"106":0,"107":0,"108":0,"112":0,"122":0,"123":0,"124":0,"136":0,"140":0,"141":0,"142":0,"143":0,"146":0,"151":0,"152":0,"153":0,"154":0,"158":0,"159":0,"160":0,"163":0,"164":0,"167":0,"173":0,"174":0,"175":0,"178":0,"179":0,"182":0,"187":0,"188":0,"194":0,"195":0,"196":0,"197":0,"198":0,"199":0,"200":0,"201":0,"202":0,"204":0,"209":0,"212":0,"213":0,"216":0,"217":0,"218":0,"223":0,"224":0,"225":0,"226":0,"230":0,"231":0,"232":0,"233":0,"238":0,"242":0,"244":0,"248":0,"252":0,"254":0,"258":0,"264":0,"265":0,"268":0,"293":0,"294":0,"297":0,"298":0,"304":0,"308":0,"309":0,"310":0,"316":0,"317":0,"318":0,"322":0,"325":0,"326":0,"329":0,"330":0,"333":0};
_yuitest_coverage["build/dom-style/dom-style.js"].functions = {"(anonymous 3):40":0,"setStyle:61":0,"getStyle:93":0,"(anonymous 4):123":0,"setStyles:121":0,"getComputedStyle:135":0,"]:159":0,"]:174":0,"_getAttrOffset:187":0,"_getOffset:212":0,"set:243":0,"get:247":0,"set:253":0,"get:257":0,"(anonymous 2):3":0,"toRGB:292":0,"toHex:307":0,"(anonymous 5):264":0,"(anonymous 1):1":0};
_yuitest_coverage["build/dom-style/dom-style.js"].coveredLines = 115;
_yuitest_coverage["build/dom-style/dom-style.js"].coveredFunctions = 19;
_yuitest_coverline("build/dom-style/dom-style.js", 1);
YUI.add('dom-style', function (Y, NAME) {

_yuitest_coverfunc("build/dom-style/dom-style.js", "(anonymous 1)", 1);
_yuitest_coverline("build/dom-style/dom-style.js", 3);
(function(Y) {
/** 
 * Add style management functionality to DOM.
 * @module dom
 * @submodule dom-style
 * @for DOM
 */

_yuitest_coverfunc("build/dom-style/dom-style.js", "(anonymous 2)", 3);
_yuitest_coverline("build/dom-style/dom-style.js", 11);
var DOCUMENT_ELEMENT = 'documentElement',
    DEFAULT_VIEW = 'defaultView',
    OWNER_DOCUMENT = 'ownerDocument',
    STYLE = 'style',
    FLOAT = 'float',
    CSS_FLOAT = 'cssFloat',
    STYLE_FLOAT = 'styleFloat',
    TRANSPARENT = 'transparent',
    GET_COMPUTED_STYLE = 'getComputedStyle',
    GET_BOUNDING_CLIENT_RECT = 'getBoundingClientRect',

    WINDOW = Y.config.win,
    DOCUMENT = Y.config.doc,
    UNDEFINED = undefined,

    Y_DOM = Y.DOM,

    TRANSFORM = 'transform',
    TRANSFORMORIGIN = 'transformOrigin',
    VENDOR_TRANSFORM = [
        'WebkitTransform',
        'MozTransform',
        'OTransform',
        'msTransform'
    ],

    re_color = /color$/i,
    re_unit = /width|height|top|left|right|bottom|margin|padding/i;

_yuitest_coverline("build/dom-style/dom-style.js", 40);
Y.Array.each(VENDOR_TRANSFORM, function(val) {
    _yuitest_coverfunc("build/dom-style/dom-style.js", "(anonymous 3)", 40);
_yuitest_coverline("build/dom-style/dom-style.js", 41);
if (val in DOCUMENT[DOCUMENT_ELEMENT].style) {
        _yuitest_coverline("build/dom-style/dom-style.js", 42);
TRANSFORM = val;
        _yuitest_coverline("build/dom-style/dom-style.js", 43);
TRANSFORMORIGIN = val + "Origin";
    }
});

_yuitest_coverline("build/dom-style/dom-style.js", 47);
Y.mix(Y_DOM, {
    DEFAULT_UNIT: 'px',

    CUSTOM_STYLES: {
    },


    /**
     * Sets a style property for a given element.
     * @method setStyle
     * @param {HTMLElement} An HTMLElement to apply the style to.
     * @param {String} att The style property to set. 
     * @param {String|Number} val The value. 
     */
    setStyle: function(node, att, val, style) {
        _yuitest_coverfunc("build/dom-style/dom-style.js", "setStyle", 61);
_yuitest_coverline("build/dom-style/dom-style.js", 62);
style = style || node.style;
        _yuitest_coverline("build/dom-style/dom-style.js", 63);
var CUSTOM_STYLES = Y_DOM.CUSTOM_STYLES;

        _yuitest_coverline("build/dom-style/dom-style.js", 65);
if (style) {
            _yuitest_coverline("build/dom-style/dom-style.js", 66);
if (val === null || val === '') { // normalize unsetting
                _yuitest_coverline("build/dom-style/dom-style.js", 67);
val = '';
            } else {_yuitest_coverline("build/dom-style/dom-style.js", 68);
if (!isNaN(new Number(val)) && re_unit.test(att)) { // number values may need a unit
                _yuitest_coverline("build/dom-style/dom-style.js", 69);
val += Y_DOM.DEFAULT_UNIT;
            }}

            _yuitest_coverline("build/dom-style/dom-style.js", 72);
if (att in CUSTOM_STYLES) {
                _yuitest_coverline("build/dom-style/dom-style.js", 73);
if (CUSTOM_STYLES[att].set) {
                    _yuitest_coverline("build/dom-style/dom-style.js", 74);
CUSTOM_STYLES[att].set(node, val, style);
                    _yuitest_coverline("build/dom-style/dom-style.js", 75);
return; // NOTE: return
                } else {_yuitest_coverline("build/dom-style/dom-style.js", 76);
if (typeof CUSTOM_STYLES[att] === 'string') {
                    _yuitest_coverline("build/dom-style/dom-style.js", 77);
att = CUSTOM_STYLES[att];
                }}
            } else {_yuitest_coverline("build/dom-style/dom-style.js", 79);
if (att === '') { // unset inline styles
                _yuitest_coverline("build/dom-style/dom-style.js", 80);
att = 'cssText';
                _yuitest_coverline("build/dom-style/dom-style.js", 81);
val = '';
            }}
            _yuitest_coverline("build/dom-style/dom-style.js", 83);
style[att] = val; 
        }
    },

    /**
     * Returns the current style value for the given property.
     * @method getStyle
     * @param {HTMLElement} An HTMLElement to get the style from.
     * @param {String} att The style property to get. 
     */
    getStyle: function(node, att, style) {
        _yuitest_coverfunc("build/dom-style/dom-style.js", "getStyle", 93);
_yuitest_coverline("build/dom-style/dom-style.js", 94);
style = style || node.style;
        _yuitest_coverline("build/dom-style/dom-style.js", 95);
var CUSTOM_STYLES = Y_DOM.CUSTOM_STYLES,
            val = '';

        _yuitest_coverline("build/dom-style/dom-style.js", 98);
if (style) {
            _yuitest_coverline("build/dom-style/dom-style.js", 99);
if (att in CUSTOM_STYLES) {
                _yuitest_coverline("build/dom-style/dom-style.js", 100);
if (CUSTOM_STYLES[att].get) {
                    _yuitest_coverline("build/dom-style/dom-style.js", 101);
return CUSTOM_STYLES[att].get(node, att, style); // NOTE: return
                } else {_yuitest_coverline("build/dom-style/dom-style.js", 102);
if (typeof CUSTOM_STYLES[att] === 'string') {
                    _yuitest_coverline("build/dom-style/dom-style.js", 103);
att = CUSTOM_STYLES[att];
                }}
            }
            _yuitest_coverline("build/dom-style/dom-style.js", 106);
val = style[att];
            _yuitest_coverline("build/dom-style/dom-style.js", 107);
if (val === '') { // TODO: is empty string sufficient?
                _yuitest_coverline("build/dom-style/dom-style.js", 108);
val = Y_DOM[GET_COMPUTED_STYLE](node, att);
            }
        }

        _yuitest_coverline("build/dom-style/dom-style.js", 112);
return val;
    },

    /**
     * Sets multiple style properties.
     * @method setStyles
     * @param {HTMLElement} node An HTMLElement to apply the styles to. 
     * @param {Object} hash An object literal of property:value pairs. 
     */
    setStyles: function(node, hash) {
        _yuitest_coverfunc("build/dom-style/dom-style.js", "setStyles", 121);
_yuitest_coverline("build/dom-style/dom-style.js", 122);
var style = node.style;
        _yuitest_coverline("build/dom-style/dom-style.js", 123);
Y.each(hash, function(v, n) {
            _yuitest_coverfunc("build/dom-style/dom-style.js", "(anonymous 4)", 123);
_yuitest_coverline("build/dom-style/dom-style.js", 124);
Y_DOM.setStyle(node, n, v, style);
        }, Y_DOM);
    },

    /**
     * Returns the computed style for the given node.
     * @method getComputedStyle
     * @param {HTMLElement} An HTMLElement to get the style from.
     * @param {String} att The style property to get. 
     * @return {String} The computed value of the style property. 
     */
    getComputedStyle: function(node, att) {
        _yuitest_coverfunc("build/dom-style/dom-style.js", "getComputedStyle", 135);
_yuitest_coverline("build/dom-style/dom-style.js", 136);
var val = '',
            doc = node[OWNER_DOCUMENT],
            computed;

        _yuitest_coverline("build/dom-style/dom-style.js", 140);
if (node[STYLE] && doc[DEFAULT_VIEW] && doc[DEFAULT_VIEW][GET_COMPUTED_STYLE]) {
            _yuitest_coverline("build/dom-style/dom-style.js", 141);
computed = doc[DEFAULT_VIEW][GET_COMPUTED_STYLE](node, null);
            _yuitest_coverline("build/dom-style/dom-style.js", 142);
if (computed) { // FF may be null in some cases (ticket #2530548)
                _yuitest_coverline("build/dom-style/dom-style.js", 143);
val = computed[att];
            }
        }
        _yuitest_coverline("build/dom-style/dom-style.js", 146);
return val;
    }
});

// normalize reserved word float alternatives ("cssFloat" or "styleFloat")
_yuitest_coverline("build/dom-style/dom-style.js", 151);
if (DOCUMENT[DOCUMENT_ELEMENT][STYLE][CSS_FLOAT] !== UNDEFINED) {
    _yuitest_coverline("build/dom-style/dom-style.js", 152);
Y_DOM.CUSTOM_STYLES[FLOAT] = CSS_FLOAT;
} else {_yuitest_coverline("build/dom-style/dom-style.js", 153);
if (DOCUMENT[DOCUMENT_ELEMENT][STYLE][STYLE_FLOAT] !== UNDEFINED) {
    _yuitest_coverline("build/dom-style/dom-style.js", 154);
Y_DOM.CUSTOM_STYLES[FLOAT] = STYLE_FLOAT;
}}

// fix opera computedStyle default color unit (convert to rgb)
_yuitest_coverline("build/dom-style/dom-style.js", 158);
if (Y.UA.opera) {
    _yuitest_coverline("build/dom-style/dom-style.js", 159);
Y_DOM[GET_COMPUTED_STYLE] = function(node, att) {
        _yuitest_coverfunc("build/dom-style/dom-style.js", "]", 159);
_yuitest_coverline("build/dom-style/dom-style.js", 160);
var view = node[OWNER_DOCUMENT][DEFAULT_VIEW],
            val = view[GET_COMPUTED_STYLE](node, '')[att];

        _yuitest_coverline("build/dom-style/dom-style.js", 163);
if (re_color.test(att)) {
            _yuitest_coverline("build/dom-style/dom-style.js", 164);
val = Y.Color.toRGB(val);
        }

        _yuitest_coverline("build/dom-style/dom-style.js", 167);
return val;
    };

}

// safari converts transparent to rgba(), others use "transparent"
_yuitest_coverline("build/dom-style/dom-style.js", 173);
if (Y.UA.webkit) {
    _yuitest_coverline("build/dom-style/dom-style.js", 174);
Y_DOM[GET_COMPUTED_STYLE] = function(node, att) {
        _yuitest_coverfunc("build/dom-style/dom-style.js", "]", 174);
_yuitest_coverline("build/dom-style/dom-style.js", 175);
var view = node[OWNER_DOCUMENT][DEFAULT_VIEW],
            val = view[GET_COMPUTED_STYLE](node, '')[att];

        _yuitest_coverline("build/dom-style/dom-style.js", 178);
if (val === 'rgba(0, 0, 0, 0)') {
            _yuitest_coverline("build/dom-style/dom-style.js", 179);
val = TRANSPARENT; 
        }

        _yuitest_coverline("build/dom-style/dom-style.js", 182);
return val;
    };

}

_yuitest_coverline("build/dom-style/dom-style.js", 187);
Y.DOM._getAttrOffset = function(node, attr) {
    _yuitest_coverfunc("build/dom-style/dom-style.js", "_getAttrOffset", 187);
_yuitest_coverline("build/dom-style/dom-style.js", 188);
var val = Y.DOM[GET_COMPUTED_STYLE](node, attr),
        offsetParent = node.offsetParent,
        position,
        parentOffset,
        offset;

    _yuitest_coverline("build/dom-style/dom-style.js", 194);
if (val === 'auto') {
        _yuitest_coverline("build/dom-style/dom-style.js", 195);
position = Y.DOM.getStyle(node, 'position');
        _yuitest_coverline("build/dom-style/dom-style.js", 196);
if (position === 'static' || position === 'relative') {
            _yuitest_coverline("build/dom-style/dom-style.js", 197);
val = 0;    
        } else {_yuitest_coverline("build/dom-style/dom-style.js", 198);
if (offsetParent && offsetParent[GET_BOUNDING_CLIENT_RECT]) {
            _yuitest_coverline("build/dom-style/dom-style.js", 199);
parentOffset = offsetParent[GET_BOUNDING_CLIENT_RECT]()[attr];
            _yuitest_coverline("build/dom-style/dom-style.js", 200);
offset = node[GET_BOUNDING_CLIENT_RECT]()[attr];
            _yuitest_coverline("build/dom-style/dom-style.js", 201);
if (attr === 'left' || attr === 'top') {
                _yuitest_coverline("build/dom-style/dom-style.js", 202);
val = offset - parentOffset;
            } else {
                _yuitest_coverline("build/dom-style/dom-style.js", 204);
val = parentOffset - node[GET_BOUNDING_CLIENT_RECT]()[attr];
            }
        }}
    }

    _yuitest_coverline("build/dom-style/dom-style.js", 209);
return val;
};

_yuitest_coverline("build/dom-style/dom-style.js", 212);
Y.DOM._getOffset = function(node) {
    _yuitest_coverfunc("build/dom-style/dom-style.js", "_getOffset", 212);
_yuitest_coverline("build/dom-style/dom-style.js", 213);
var pos,
        xy = null;

    _yuitest_coverline("build/dom-style/dom-style.js", 216);
if (node) {
        _yuitest_coverline("build/dom-style/dom-style.js", 217);
pos = Y_DOM.getStyle(node, 'position');
        _yuitest_coverline("build/dom-style/dom-style.js", 218);
xy = [
            parseInt(Y_DOM[GET_COMPUTED_STYLE](node, 'left'), 10),
            parseInt(Y_DOM[GET_COMPUTED_STYLE](node, 'top'), 10)
        ];

        _yuitest_coverline("build/dom-style/dom-style.js", 223);
if ( isNaN(xy[0]) ) { // in case of 'auto'
            _yuitest_coverline("build/dom-style/dom-style.js", 224);
xy[0] = parseInt(Y_DOM.getStyle(node, 'left'), 10); // try inline
            _yuitest_coverline("build/dom-style/dom-style.js", 225);
if ( isNaN(xy[0]) ) { // default to offset value
                _yuitest_coverline("build/dom-style/dom-style.js", 226);
xy[0] = (pos === 'relative') ? 0 : node.offsetLeft || 0;
            }
        } 

        _yuitest_coverline("build/dom-style/dom-style.js", 230);
if ( isNaN(xy[1]) ) { // in case of 'auto'
            _yuitest_coverline("build/dom-style/dom-style.js", 231);
xy[1] = parseInt(Y_DOM.getStyle(node, 'top'), 10); // try inline
            _yuitest_coverline("build/dom-style/dom-style.js", 232);
if ( isNaN(xy[1]) ) { // default to offset value
                _yuitest_coverline("build/dom-style/dom-style.js", 233);
xy[1] = (pos === 'relative') ? 0 : node.offsetTop || 0;
            }
        } 
    }

    _yuitest_coverline("build/dom-style/dom-style.js", 238);
return xy;

};

_yuitest_coverline("build/dom-style/dom-style.js", 242);
Y_DOM.CUSTOM_STYLES.transform = {
    set: function(node, val, style) {
        _yuitest_coverfunc("build/dom-style/dom-style.js", "set", 243);
_yuitest_coverline("build/dom-style/dom-style.js", 244);
style[TRANSFORM] = val;
    },

    get: function(node, style) {
        _yuitest_coverfunc("build/dom-style/dom-style.js", "get", 247);
_yuitest_coverline("build/dom-style/dom-style.js", 248);
return Y_DOM[GET_COMPUTED_STYLE](node, TRANSFORM);
    }
};

_yuitest_coverline("build/dom-style/dom-style.js", 252);
Y_DOM.CUSTOM_STYLES.transformOrigin = {
    set: function(node, val, style) {
        _yuitest_coverfunc("build/dom-style/dom-style.js", "set", 253);
_yuitest_coverline("build/dom-style/dom-style.js", 254);
style[TRANSFORMORIGIN] = val;
    },

    get: function(node, style) {
        _yuitest_coverfunc("build/dom-style/dom-style.js", "get", 257);
_yuitest_coverline("build/dom-style/dom-style.js", 258);
return Y_DOM[GET_COMPUTED_STYLE](node, TRANSFORMORIGIN);
    }
};


})(Y);
_yuitest_coverline("build/dom-style/dom-style.js", 264);
(function(Y) {
_yuitest_coverfunc("build/dom-style/dom-style.js", "(anonymous 5)", 264);
_yuitest_coverline("build/dom-style/dom-style.js", 265);
var PARSE_INT = parseInt,
    RE = RegExp;

_yuitest_coverline("build/dom-style/dom-style.js", 268);
Y.Color = {
    KEYWORDS: {
        black: '000',
        silver: 'c0c0c0',
        gray: '808080',
        white: 'fff',
        maroon: '800000',
        red: 'f00',
        purple: '800080',
        fuchsia: 'f0f',
        green: '008000',
        lime: '0f0',
        olive: '808000',
        yellow: 'ff0',
        navy: '000080',
        blue: '00f',
        teal: '008080',
        aqua: '0ff'
    },

    re_RGB: /^rgb\(([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\)$/i,
    re_hex: /^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i,
    re_hex3: /([0-9A-F])/gi,

    toRGB: function(val) {
        _yuitest_coverfunc("build/dom-style/dom-style.js", "toRGB", 292);
_yuitest_coverline("build/dom-style/dom-style.js", 293);
if (!Y.Color.re_RGB.test(val)) {
            _yuitest_coverline("build/dom-style/dom-style.js", 294);
val = Y.Color.toHex(val);
        }

        _yuitest_coverline("build/dom-style/dom-style.js", 297);
if(Y.Color.re_hex.exec(val)) {
            _yuitest_coverline("build/dom-style/dom-style.js", 298);
val = 'rgb(' + [
                PARSE_INT(RE.$1, 16),
                PARSE_INT(RE.$2, 16),
                PARSE_INT(RE.$3, 16)
            ].join(', ') + ')';
        }
        _yuitest_coverline("build/dom-style/dom-style.js", 304);
return val;
    },

    toHex: function(val) {
        _yuitest_coverfunc("build/dom-style/dom-style.js", "toHex", 307);
_yuitest_coverline("build/dom-style/dom-style.js", 308);
val = Y.Color.KEYWORDS[val] || val;
        _yuitest_coverline("build/dom-style/dom-style.js", 309);
if (Y.Color.re_RGB.exec(val)) {
            _yuitest_coverline("build/dom-style/dom-style.js", 310);
val = [
                Number(RE.$1).toString(16),
                Number(RE.$2).toString(16),
                Number(RE.$3).toString(16)
            ];

            _yuitest_coverline("build/dom-style/dom-style.js", 316);
for (var i = 0; i < val.length; i++) {
                _yuitest_coverline("build/dom-style/dom-style.js", 317);
if (val[i].length < 2) {
                    _yuitest_coverline("build/dom-style/dom-style.js", 318);
val[i] = '0' + val[i];
                }
            }

            _yuitest_coverline("build/dom-style/dom-style.js", 322);
val = val.join('');
        }

        _yuitest_coverline("build/dom-style/dom-style.js", 325);
if (val.length < 6) {
            _yuitest_coverline("build/dom-style/dom-style.js", 326);
val = val.replace(Y.Color.re_hex3, '$1$1');
        }

        _yuitest_coverline("build/dom-style/dom-style.js", 329);
if (val !== 'transparent' && val.indexOf('#') < 0) {
            _yuitest_coverline("build/dom-style/dom-style.js", 330);
val = '#' + val;
        }

        _yuitest_coverline("build/dom-style/dom-style.js", 333);
return val.toUpperCase();
    }
};
})(Y);



}, '3.7.3', {"requires": ["dom-base"]});
