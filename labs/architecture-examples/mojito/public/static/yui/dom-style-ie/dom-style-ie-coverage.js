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
_yuitest_coverage["build/dom-style-ie/dom-style-ie.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/dom-style-ie/dom-style-ie.js",
    code: []
};
_yuitest_coverage["build/dom-style-ie/dom-style-ie.js"].code=["YUI.add('dom-style-ie', function (Y, NAME) {","","(function(Y) {","var HAS_LAYOUT = 'hasLayout',","    PX = 'px',","    FILTER = 'filter',","    FILTERS = 'filters',","    OPACITY = 'opacity',","    AUTO = 'auto',","","    BORDER_WIDTH = 'borderWidth',","    BORDER_TOP_WIDTH = 'borderTopWidth',","    BORDER_RIGHT_WIDTH = 'borderRightWidth',","    BORDER_BOTTOM_WIDTH = 'borderBottomWidth',","    BORDER_LEFT_WIDTH = 'borderLeftWidth',","    WIDTH = 'width',","    HEIGHT = 'height',","    TRANSPARENT = 'transparent',","    VISIBLE = 'visible',","    GET_COMPUTED_STYLE = 'getComputedStyle',","    UNDEFINED = undefined,","    documentElement = Y.config.doc.documentElement,","","    testFeature = Y.Features.test,","    addFeature = Y.Features.add,","","    // TODO: unit-less lineHeight (e.g. 1.22)","    re_unit = /^(\\d[.\\d]*)+(em|ex|px|gd|rem|vw|vh|vm|ch|mm|cm|in|pt|pc|deg|rad|ms|s|hz|khz|%){1}?/i,","","    isIE8 = (Y.UA.ie >= 8),","","    _getStyleObj = function(node) {","        return node.currentStyle || node.style;","    },","","    ComputedStyle = {","        CUSTOM_STYLES: {},","","        get: function(el, property) {","            var value = '',","                current;","","            if (el) {","                    current = _getStyleObj(el)[property];","","                if (property === OPACITY && Y.DOM.CUSTOM_STYLES[OPACITY]) {","                    value = Y.DOM.CUSTOM_STYLES[OPACITY].get(el);        ","                } else if (!current || (current.indexOf && current.indexOf(PX) > -1)) { // no need to convert","                    value = current;","                } else if (Y.DOM.IE.COMPUTED[property]) { // use compute function","                    value = Y.DOM.IE.COMPUTED[property](el, property);","                } else if (re_unit.test(current)) { // convert to pixel","                    value = ComputedStyle.getPixel(el, property) + PX;","                } else {","                    value = current;","                }","            }","","            return value;","        },","","        sizeOffsets: {","            width: ['Left', 'Right'],","            height: ['Top', 'Bottom'],","            top: ['Top'],","            bottom: ['Bottom']","        },","","        getOffset: function(el, prop) {","            var current = _getStyleObj(el)[prop],                     // value of \"width\", \"top\", etc.","                capped = prop.charAt(0).toUpperCase() + prop.substr(1), // \"Width\", \"Top\", etc.","                offset = 'offset' + capped,                             // \"offsetWidth\", \"offsetTop\", etc.","                pixel = 'pixel' + capped,                               // \"pixelWidth\", \"pixelTop\", etc.","                sizeOffsets = ComputedStyle.sizeOffsets[prop], ","                mode = el.ownerDocument.compatMode,","                value = '';","","            // IE pixelWidth incorrect for percent","            // manually compute by subtracting padding and border from offset size","            // NOTE: clientWidth/Height (size minus border) is 0 when current === AUTO so offsetHeight is used","            // reverting to auto from auto causes position stacking issues (old impl)","            if (current === AUTO || current.indexOf('%') > -1) {","                value = el['offset' + capped];","","                if (mode !== 'BackCompat') {","                    if (sizeOffsets[0]) {","                        value -= ComputedStyle.getPixel(el, 'padding' + sizeOffsets[0]);","                        value -= ComputedStyle.getBorderWidth(el, 'border' + sizeOffsets[0] + 'Width', 1);","                    }","","                    if (sizeOffsets[1]) {","                        value -= ComputedStyle.getPixel(el, 'padding' + sizeOffsets[1]);","                        value -= ComputedStyle.getBorderWidth(el, 'border' + sizeOffsets[1] + 'Width', 1);","                    }","                }","","            } else { // use style.pixelWidth, etc. to convert to pixels","                // need to map style.width to currentStyle (no currentStyle.pixelWidth)","                if (!el.style[pixel] && !el.style[prop]) {","                    el.style[prop] = current;","                }","                value = el.style[pixel];","                ","            }","            return value + PX;","        },","","        borderMap: {","            thin: (isIE8) ? '1px' : '2px',","            medium: (isIE8) ? '3px': '4px', ","            thick: (isIE8) ? '5px' : '6px'","        },","","        getBorderWidth: function(el, property, omitUnit) {","            var unit = omitUnit ? '' : PX,","                current = el.currentStyle[property];","","            if (current.indexOf(PX) < 0) { // look up keywords if a border exists","                if (ComputedStyle.borderMap[current] &&","                        el.currentStyle.borderStyle !== 'none') {","                    current = ComputedStyle.borderMap[current];","                } else { // otherwise no border (default is \"medium\")","                    current = 0;","                }","            }","            return (omitUnit) ? parseFloat(current) : current;","        },","","        getPixel: function(node, att) {","            // use pixelRight to convert to px","            var val = null,","                style = _getStyleObj(node),","                styleRight = style.right,","                current = style[att];","","            node.style.right = current;","            val = node.style.pixelRight;","            node.style.right = styleRight; // revert","","            return val;","        },","","        getMargin: function(node, att) {","            var val,","                style = _getStyleObj(node);","","            if (style[att] == AUTO) {","                val = 0;","            } else {","                val = ComputedStyle.getPixel(node, att);","            }","            return val + PX;","        },","","        getVisibility: function(node, att) {","            var current;","            while ( (current = node.currentStyle) && current[att] == 'inherit') { // NOTE: assignment in test","                node = node.parentNode;","            }","            return (current) ? current[att] : VISIBLE;","        },","","        getColor: function(node, att) {","            var current = _getStyleObj(node)[att];","","            if (!current || current === TRANSPARENT) {","                Y.DOM.elementByAxis(node, 'parentNode', null, function(parent) {","                    current = _getStyleObj(parent)[att];","                    if (current && current !== TRANSPARENT) {","                        node = parent;","                        return true;","                    }","                });","            }","","            return Y.Color.toRGB(current);","        },","","        getBorderColor: function(node, att) {","            var current = _getStyleObj(node),","                val = current[att] || current.color;","            return Y.Color.toRGB(Y.Color.toHex(val));","        }","    },","","    //fontSize: getPixelFont,","    IEComputed = {};","","addFeature('style', 'computedStyle', {","    test: function() {","        return 'getComputedStyle' in Y.config.win;","    }","});","","addFeature('style', 'opacity', {","    test: function() {","        return 'opacity' in documentElement.style;","    }","});","","addFeature('style', 'filter', {","    test: function() {","        return 'filters' in documentElement;","    }","});","","// use alpha filter for IE opacity","if (!testFeature('style', 'opacity') && testFeature('style', 'filter')) {","    Y.DOM.CUSTOM_STYLES[OPACITY] = {","        get: function(node) {","            var val = 100;","            try { // will error if no DXImageTransform","                val = node[FILTERS]['DXImageTransform.Microsoft.Alpha'][OPACITY];","","            } catch(e) {","                try { // make sure its in the document","                    val = node[FILTERS]('alpha')[OPACITY];","                } catch(err) {","                }","            }","            return val / 100;","        },","","        set: function(node, val, style) {","            var current,","                styleObj = _getStyleObj(node),","                currentFilter = styleObj[FILTER];","","            style = style || node.style;","            if (val === '') { // normalize inline style behavior","                current = (OPACITY in styleObj) ? styleObj[OPACITY] : 1; // revert to original opacity","                val = current;","            }","","            if (typeof currentFilter == 'string') { // in case not appended","                style[FILTER] = currentFilter.replace(/alpha([^)]*\\))/gi, '') +","                        ((val < 1) ? 'alpha(' + OPACITY + '=' + val * 100 + ')' : '');","","                if (!style[FILTER]) {","                    style.removeAttribute(FILTER);","                }","","                if (!styleObj[HAS_LAYOUT]) {","                    style.zoom = 1; // needs layout ","                }","            }","        }","    };","}","","try {","    Y.config.doc.createElement('div').style.height = '-1px';","} catch(e) { // IE throws error on invalid style set; trap common cases","    Y.DOM.CUSTOM_STYLES.height = {","        set: function(node, val, style) {","            var floatVal = parseFloat(val);","            if (floatVal >= 0 || val === 'auto' || val === '') {","                style.height = val;","            } else {","            }","        }","    };","","    Y.DOM.CUSTOM_STYLES.width = {","        set: function(node, val, style) {","            var floatVal = parseFloat(val);","            if (floatVal >= 0 || val === 'auto' || val === '') {","                style.width = val;","            } else {","            }","        }","    };","}","","if (!testFeature('style', 'computedStyle')) {","    // TODO: top, right, bottom, left","    IEComputed[WIDTH] = IEComputed[HEIGHT] = ComputedStyle.getOffset;","","    IEComputed.color = IEComputed.backgroundColor = ComputedStyle.getColor;","","    IEComputed[BORDER_WIDTH] = IEComputed[BORDER_TOP_WIDTH] = IEComputed[BORDER_RIGHT_WIDTH] =","            IEComputed[BORDER_BOTTOM_WIDTH] = IEComputed[BORDER_LEFT_WIDTH] =","            ComputedStyle.getBorderWidth;","","    IEComputed.marginTop = IEComputed.marginRight = IEComputed.marginBottom =","            IEComputed.marginLeft = ComputedStyle.getMargin;","","    IEComputed.visibility = ComputedStyle.getVisibility;","    IEComputed.borderColor = IEComputed.borderTopColor =","            IEComputed.borderRightColor = IEComputed.borderBottomColor =","            IEComputed.borderLeftColor = ComputedStyle.getBorderColor;","","    Y.DOM[GET_COMPUTED_STYLE] = ComputedStyle.get; ","","    Y.namespace('DOM.IE');","    Y.DOM.IE.COMPUTED = IEComputed;","    Y.DOM.IE.ComputedStyle = ComputedStyle;","}","","})(Y);","","","}, '3.7.3', {\"requires\": [\"dom-style\"]});"];
_yuitest_coverage["build/dom-style-ie/dom-style-ie.js"].lines = {"1":0,"3":0,"4":0,"33":0,"40":0,"43":0,"44":0,"46":0,"47":0,"48":0,"49":0,"50":0,"51":0,"52":0,"53":0,"55":0,"59":0,"70":0,"82":0,"83":0,"85":0,"86":0,"87":0,"88":0,"91":0,"92":0,"93":0,"99":0,"100":0,"102":0,"105":0,"115":0,"118":0,"119":0,"121":0,"123":0,"126":0,"131":0,"136":0,"137":0,"138":0,"140":0,"144":0,"147":0,"148":0,"150":0,"152":0,"156":0,"157":0,"158":0,"160":0,"164":0,"166":0,"167":0,"168":0,"169":0,"170":0,"171":0,"176":0,"180":0,"182":0,"189":0,"191":0,"195":0,"197":0,"201":0,"203":0,"208":0,"209":0,"211":0,"212":0,"213":0,"216":0,"217":0,"221":0,"225":0,"229":0,"230":0,"231":0,"232":0,"235":0,"236":0,"239":0,"240":0,"243":0,"244":0,"251":0,"252":0,"254":0,"256":0,"257":0,"258":0,"264":0,"266":0,"267":0,"268":0,"275":0,"277":0,"279":0,"281":0,"285":0,"288":0,"289":0,"293":0,"295":0,"296":0,"297":0};
_yuitest_coverage["build/dom-style-ie/dom-style-ie.js"].functions = {"_getStyleObj:32":0,"get:39":0,"getOffset:69":0,"getBorderWidth:114":0,"getPixel:129":0,"getMargin:143":0,"getVisibility:155":0,"(anonymous 3):167":0,"getColor:163":0,"getBorderColor:179":0,"test:190":0,"test:196":0,"test:202":0,"get:210":0,"set:224":0,"set:255":0,"set:265":0,"(anonymous 2):3":0,"(anonymous 1):1":0};
_yuitest_coverage["build/dom-style-ie/dom-style-ie.js"].coveredLines = 107;
_yuitest_coverage["build/dom-style-ie/dom-style-ie.js"].coveredFunctions = 19;
_yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 1);
YUI.add('dom-style-ie', function (Y, NAME) {

_yuitest_coverfunc("build/dom-style-ie/dom-style-ie.js", "(anonymous 1)", 1);
_yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 3);
(function(Y) {
_yuitest_coverfunc("build/dom-style-ie/dom-style-ie.js", "(anonymous 2)", 3);
_yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 4);
var HAS_LAYOUT = 'hasLayout',
    PX = 'px',
    FILTER = 'filter',
    FILTERS = 'filters',
    OPACITY = 'opacity',
    AUTO = 'auto',

    BORDER_WIDTH = 'borderWidth',
    BORDER_TOP_WIDTH = 'borderTopWidth',
    BORDER_RIGHT_WIDTH = 'borderRightWidth',
    BORDER_BOTTOM_WIDTH = 'borderBottomWidth',
    BORDER_LEFT_WIDTH = 'borderLeftWidth',
    WIDTH = 'width',
    HEIGHT = 'height',
    TRANSPARENT = 'transparent',
    VISIBLE = 'visible',
    GET_COMPUTED_STYLE = 'getComputedStyle',
    UNDEFINED = undefined,
    documentElement = Y.config.doc.documentElement,

    testFeature = Y.Features.test,
    addFeature = Y.Features.add,

    // TODO: unit-less lineHeight (e.g. 1.22)
    re_unit = /^(\d[.\d]*)+(em|ex|px|gd|rem|vw|vh|vm|ch|mm|cm|in|pt|pc|deg|rad|ms|s|hz|khz|%){1}?/i,

    isIE8 = (Y.UA.ie >= 8),

    _getStyleObj = function(node) {
        _yuitest_coverfunc("build/dom-style-ie/dom-style-ie.js", "_getStyleObj", 32);
_yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 33);
return node.currentStyle || node.style;
    },

    ComputedStyle = {
        CUSTOM_STYLES: {},

        get: function(el, property) {
            _yuitest_coverfunc("build/dom-style-ie/dom-style-ie.js", "get", 39);
_yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 40);
var value = '',
                current;

            _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 43);
if (el) {
                    _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 44);
current = _getStyleObj(el)[property];

                _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 46);
if (property === OPACITY && Y.DOM.CUSTOM_STYLES[OPACITY]) {
                    _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 47);
value = Y.DOM.CUSTOM_STYLES[OPACITY].get(el);        
                } else {_yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 48);
if (!current || (current.indexOf && current.indexOf(PX) > -1)) { // no need to convert
                    _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 49);
value = current;
                } else {_yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 50);
if (Y.DOM.IE.COMPUTED[property]) { // use compute function
                    _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 51);
value = Y.DOM.IE.COMPUTED[property](el, property);
                } else {_yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 52);
if (re_unit.test(current)) { // convert to pixel
                    _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 53);
value = ComputedStyle.getPixel(el, property) + PX;
                } else {
                    _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 55);
value = current;
                }}}}
            }

            _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 59);
return value;
        },

        sizeOffsets: {
            width: ['Left', 'Right'],
            height: ['Top', 'Bottom'],
            top: ['Top'],
            bottom: ['Bottom']
        },

        getOffset: function(el, prop) {
            _yuitest_coverfunc("build/dom-style-ie/dom-style-ie.js", "getOffset", 69);
_yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 70);
var current = _getStyleObj(el)[prop],                     // value of "width", "top", etc.
                capped = prop.charAt(0).toUpperCase() + prop.substr(1), // "Width", "Top", etc.
                offset = 'offset' + capped,                             // "offsetWidth", "offsetTop", etc.
                pixel = 'pixel' + capped,                               // "pixelWidth", "pixelTop", etc.
                sizeOffsets = ComputedStyle.sizeOffsets[prop], 
                mode = el.ownerDocument.compatMode,
                value = '';

            // IE pixelWidth incorrect for percent
            // manually compute by subtracting padding and border from offset size
            // NOTE: clientWidth/Height (size minus border) is 0 when current === AUTO so offsetHeight is used
            // reverting to auto from auto causes position stacking issues (old impl)
            _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 82);
if (current === AUTO || current.indexOf('%') > -1) {
                _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 83);
value = el['offset' + capped];

                _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 85);
if (mode !== 'BackCompat') {
                    _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 86);
if (sizeOffsets[0]) {
                        _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 87);
value -= ComputedStyle.getPixel(el, 'padding' + sizeOffsets[0]);
                        _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 88);
value -= ComputedStyle.getBorderWidth(el, 'border' + sizeOffsets[0] + 'Width', 1);
                    }

                    _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 91);
if (sizeOffsets[1]) {
                        _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 92);
value -= ComputedStyle.getPixel(el, 'padding' + sizeOffsets[1]);
                        _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 93);
value -= ComputedStyle.getBorderWidth(el, 'border' + sizeOffsets[1] + 'Width', 1);
                    }
                }

            } else { // use style.pixelWidth, etc. to convert to pixels
                // need to map style.width to currentStyle (no currentStyle.pixelWidth)
                _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 99);
if (!el.style[pixel] && !el.style[prop]) {
                    _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 100);
el.style[prop] = current;
                }
                _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 102);
value = el.style[pixel];
                
            }
            _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 105);
return value + PX;
        },

        borderMap: {
            thin: (isIE8) ? '1px' : '2px',
            medium: (isIE8) ? '3px': '4px', 
            thick: (isIE8) ? '5px' : '6px'
        },

        getBorderWidth: function(el, property, omitUnit) {
            _yuitest_coverfunc("build/dom-style-ie/dom-style-ie.js", "getBorderWidth", 114);
_yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 115);
var unit = omitUnit ? '' : PX,
                current = el.currentStyle[property];

            _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 118);
if (current.indexOf(PX) < 0) { // look up keywords if a border exists
                _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 119);
if (ComputedStyle.borderMap[current] &&
                        el.currentStyle.borderStyle !== 'none') {
                    _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 121);
current = ComputedStyle.borderMap[current];
                } else { // otherwise no border (default is "medium")
                    _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 123);
current = 0;
                }
            }
            _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 126);
return (omitUnit) ? parseFloat(current) : current;
        },

        getPixel: function(node, att) {
            // use pixelRight to convert to px
            _yuitest_coverfunc("build/dom-style-ie/dom-style-ie.js", "getPixel", 129);
_yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 131);
var val = null,
                style = _getStyleObj(node),
                styleRight = style.right,
                current = style[att];

            _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 136);
node.style.right = current;
            _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 137);
val = node.style.pixelRight;
            _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 138);
node.style.right = styleRight; // revert

            _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 140);
return val;
        },

        getMargin: function(node, att) {
            _yuitest_coverfunc("build/dom-style-ie/dom-style-ie.js", "getMargin", 143);
_yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 144);
var val,
                style = _getStyleObj(node);

            _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 147);
if (style[att] == AUTO) {
                _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 148);
val = 0;
            } else {
                _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 150);
val = ComputedStyle.getPixel(node, att);
            }
            _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 152);
return val + PX;
        },

        getVisibility: function(node, att) {
            _yuitest_coverfunc("build/dom-style-ie/dom-style-ie.js", "getVisibility", 155);
_yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 156);
var current;
            _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 157);
while ( (current = node.currentStyle) && current[att] == 'inherit') { // NOTE: assignment in test
                _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 158);
node = node.parentNode;
            }
            _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 160);
return (current) ? current[att] : VISIBLE;
        },

        getColor: function(node, att) {
            _yuitest_coverfunc("build/dom-style-ie/dom-style-ie.js", "getColor", 163);
_yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 164);
var current = _getStyleObj(node)[att];

            _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 166);
if (!current || current === TRANSPARENT) {
                _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 167);
Y.DOM.elementByAxis(node, 'parentNode', null, function(parent) {
                    _yuitest_coverfunc("build/dom-style-ie/dom-style-ie.js", "(anonymous 3)", 167);
_yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 168);
current = _getStyleObj(parent)[att];
                    _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 169);
if (current && current !== TRANSPARENT) {
                        _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 170);
node = parent;
                        _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 171);
return true;
                    }
                });
            }

            _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 176);
return Y.Color.toRGB(current);
        },

        getBorderColor: function(node, att) {
            _yuitest_coverfunc("build/dom-style-ie/dom-style-ie.js", "getBorderColor", 179);
_yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 180);
var current = _getStyleObj(node),
                val = current[att] || current.color;
            _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 182);
return Y.Color.toRGB(Y.Color.toHex(val));
        }
    },

    //fontSize: getPixelFont,
    IEComputed = {};

_yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 189);
addFeature('style', 'computedStyle', {
    test: function() {
        _yuitest_coverfunc("build/dom-style-ie/dom-style-ie.js", "test", 190);
_yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 191);
return 'getComputedStyle' in Y.config.win;
    }
});

_yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 195);
addFeature('style', 'opacity', {
    test: function() {
        _yuitest_coverfunc("build/dom-style-ie/dom-style-ie.js", "test", 196);
_yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 197);
return 'opacity' in documentElement.style;
    }
});

_yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 201);
addFeature('style', 'filter', {
    test: function() {
        _yuitest_coverfunc("build/dom-style-ie/dom-style-ie.js", "test", 202);
_yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 203);
return 'filters' in documentElement;
    }
});

// use alpha filter for IE opacity
_yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 208);
if (!testFeature('style', 'opacity') && testFeature('style', 'filter')) {
    _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 209);
Y.DOM.CUSTOM_STYLES[OPACITY] = {
        get: function(node) {
            _yuitest_coverfunc("build/dom-style-ie/dom-style-ie.js", "get", 210);
_yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 211);
var val = 100;
            _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 212);
try { // will error if no DXImageTransform
                _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 213);
val = node[FILTERS]['DXImageTransform.Microsoft.Alpha'][OPACITY];

            } catch(e) {
                _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 216);
try { // make sure its in the document
                    _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 217);
val = node[FILTERS]('alpha')[OPACITY];
                } catch(err) {
                }
            }
            _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 221);
return val / 100;
        },

        set: function(node, val, style) {
            _yuitest_coverfunc("build/dom-style-ie/dom-style-ie.js", "set", 224);
_yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 225);
var current,
                styleObj = _getStyleObj(node),
                currentFilter = styleObj[FILTER];

            _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 229);
style = style || node.style;
            _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 230);
if (val === '') { // normalize inline style behavior
                _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 231);
current = (OPACITY in styleObj) ? styleObj[OPACITY] : 1; // revert to original opacity
                _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 232);
val = current;
            }

            _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 235);
if (typeof currentFilter == 'string') { // in case not appended
                _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 236);
style[FILTER] = currentFilter.replace(/alpha([^)]*\))/gi, '') +
                        ((val < 1) ? 'alpha(' + OPACITY + '=' + val * 100 + ')' : '');

                _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 239);
if (!style[FILTER]) {
                    _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 240);
style.removeAttribute(FILTER);
                }

                _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 243);
if (!styleObj[HAS_LAYOUT]) {
                    _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 244);
style.zoom = 1; // needs layout 
                }
            }
        }
    };
}

_yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 251);
try {
    _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 252);
Y.config.doc.createElement('div').style.height = '-1px';
} catch(e) { // IE throws error on invalid style set; trap common cases
    _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 254);
Y.DOM.CUSTOM_STYLES.height = {
        set: function(node, val, style) {
            _yuitest_coverfunc("build/dom-style-ie/dom-style-ie.js", "set", 255);
_yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 256);
var floatVal = parseFloat(val);
            _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 257);
if (floatVal >= 0 || val === 'auto' || val === '') {
                _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 258);
style.height = val;
            } else {
            }
        }
    };

    _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 264);
Y.DOM.CUSTOM_STYLES.width = {
        set: function(node, val, style) {
            _yuitest_coverfunc("build/dom-style-ie/dom-style-ie.js", "set", 265);
_yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 266);
var floatVal = parseFloat(val);
            _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 267);
if (floatVal >= 0 || val === 'auto' || val === '') {
                _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 268);
style.width = val;
            } else {
            }
        }
    };
}

_yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 275);
if (!testFeature('style', 'computedStyle')) {
    // TODO: top, right, bottom, left
    _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 277);
IEComputed[WIDTH] = IEComputed[HEIGHT] = ComputedStyle.getOffset;

    _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 279);
IEComputed.color = IEComputed.backgroundColor = ComputedStyle.getColor;

    _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 281);
IEComputed[BORDER_WIDTH] = IEComputed[BORDER_TOP_WIDTH] = IEComputed[BORDER_RIGHT_WIDTH] =
            IEComputed[BORDER_BOTTOM_WIDTH] = IEComputed[BORDER_LEFT_WIDTH] =
            ComputedStyle.getBorderWidth;

    _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 285);
IEComputed.marginTop = IEComputed.marginRight = IEComputed.marginBottom =
            IEComputed.marginLeft = ComputedStyle.getMargin;

    _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 288);
IEComputed.visibility = ComputedStyle.getVisibility;
    _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 289);
IEComputed.borderColor = IEComputed.borderTopColor =
            IEComputed.borderRightColor = IEComputed.borderBottomColor =
            IEComputed.borderLeftColor = ComputedStyle.getBorderColor;

    _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 293);
Y.DOM[GET_COMPUTED_STYLE] = ComputedStyle.get; 

    _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 295);
Y.namespace('DOM.IE');
    _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 296);
Y.DOM.IE.COMPUTED = IEComputed;
    _yuitest_coverline("build/dom-style-ie/dom-style-ie.js", 297);
Y.DOM.IE.ComputedStyle = ComputedStyle;
}

})(Y);


}, '3.7.3', {"requires": ["dom-style"]});
