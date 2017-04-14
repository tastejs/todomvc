/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('dom-style-ie', function (Y, NAME) {

(function(Y) {
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
        return node.currentStyle || node.style;
    },

    ComputedStyle = {
        CUSTOM_STYLES: {},

        get: function(el, property) {
            var value = '',
                current;

            if (el) {
                    current = _getStyleObj(el)[property];

                if (property === OPACITY && Y.DOM.CUSTOM_STYLES[OPACITY]) {
                    value = Y.DOM.CUSTOM_STYLES[OPACITY].get(el);        
                } else if (!current || (current.indexOf && current.indexOf(PX) > -1)) { // no need to convert
                    value = current;
                } else if (Y.DOM.IE.COMPUTED[property]) { // use compute function
                    value = Y.DOM.IE.COMPUTED[property](el, property);
                } else if (re_unit.test(current)) { // convert to pixel
                    value = ComputedStyle.getPixel(el, property) + PX;
                } else {
                    value = current;
                }
            }

            return value;
        },

        sizeOffsets: {
            width: ['Left', 'Right'],
            height: ['Top', 'Bottom'],
            top: ['Top'],
            bottom: ['Bottom']
        },

        getOffset: function(el, prop) {
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
            if (current === AUTO || current.indexOf('%') > -1) {
                value = el['offset' + capped];

                if (mode !== 'BackCompat') {
                    if (sizeOffsets[0]) {
                        value -= ComputedStyle.getPixel(el, 'padding' + sizeOffsets[0]);
                        value -= ComputedStyle.getBorderWidth(el, 'border' + sizeOffsets[0] + 'Width', 1);
                    }

                    if (sizeOffsets[1]) {
                        value -= ComputedStyle.getPixel(el, 'padding' + sizeOffsets[1]);
                        value -= ComputedStyle.getBorderWidth(el, 'border' + sizeOffsets[1] + 'Width', 1);
                    }
                }

            } else { // use style.pixelWidth, etc. to convert to pixels
                // need to map style.width to currentStyle (no currentStyle.pixelWidth)
                if (!el.style[pixel] && !el.style[prop]) {
                    el.style[prop] = current;
                }
                value = el.style[pixel];
                
            }
            return value + PX;
        },

        borderMap: {
            thin: (isIE8) ? '1px' : '2px',
            medium: (isIE8) ? '3px': '4px', 
            thick: (isIE8) ? '5px' : '6px'
        },

        getBorderWidth: function(el, property, omitUnit) {
            var unit = omitUnit ? '' : PX,
                current = el.currentStyle[property];

            if (current.indexOf(PX) < 0) { // look up keywords if a border exists
                if (ComputedStyle.borderMap[current] &&
                        el.currentStyle.borderStyle !== 'none') {
                    current = ComputedStyle.borderMap[current];
                } else { // otherwise no border (default is "medium")
                    current = 0;
                }
            }
            return (omitUnit) ? parseFloat(current) : current;
        },

        getPixel: function(node, att) {
            // use pixelRight to convert to px
            var val = null,
                style = _getStyleObj(node),
                styleRight = style.right,
                current = style[att];

            node.style.right = current;
            val = node.style.pixelRight;
            node.style.right = styleRight; // revert

            return val;
        },

        getMargin: function(node, att) {
            var val,
                style = _getStyleObj(node);

            if (style[att] == AUTO) {
                val = 0;
            } else {
                val = ComputedStyle.getPixel(node, att);
            }
            return val + PX;
        },

        getVisibility: function(node, att) {
            var current;
            while ( (current = node.currentStyle) && current[att] == 'inherit') { // NOTE: assignment in test
                node = node.parentNode;
            }
            return (current) ? current[att] : VISIBLE;
        },

        getColor: function(node, att) {
            var current = _getStyleObj(node)[att];

            if (!current || current === TRANSPARENT) {
                Y.DOM.elementByAxis(node, 'parentNode', null, function(parent) {
                    current = _getStyleObj(parent)[att];
                    if (current && current !== TRANSPARENT) {
                        node = parent;
                        return true;
                    }
                });
            }

            return Y.Color.toRGB(current);
        },

        getBorderColor: function(node, att) {
            var current = _getStyleObj(node),
                val = current[att] || current.color;
            return Y.Color.toRGB(Y.Color.toHex(val));
        }
    },

    //fontSize: getPixelFont,
    IEComputed = {};

addFeature('style', 'computedStyle', {
    test: function() {
        return 'getComputedStyle' in Y.config.win;
    }
});

addFeature('style', 'opacity', {
    test: function() {
        return 'opacity' in documentElement.style;
    }
});

addFeature('style', 'filter', {
    test: function() {
        return 'filters' in documentElement;
    }
});

// use alpha filter for IE opacity
if (!testFeature('style', 'opacity') && testFeature('style', 'filter')) {
    Y.DOM.CUSTOM_STYLES[OPACITY] = {
        get: function(node) {
            var val = 100;
            try { // will error if no DXImageTransform
                val = node[FILTERS]['DXImageTransform.Microsoft.Alpha'][OPACITY];

            } catch(e) {
                try { // make sure its in the document
                    val = node[FILTERS]('alpha')[OPACITY];
                } catch(err) {
                }
            }
            return val / 100;
        },

        set: function(node, val, style) {
            var current,
                styleObj = _getStyleObj(node),
                currentFilter = styleObj[FILTER];

            style = style || node.style;
            if (val === '') { // normalize inline style behavior
                current = (OPACITY in styleObj) ? styleObj[OPACITY] : 1; // revert to original opacity
                val = current;
            }

            if (typeof currentFilter == 'string') { // in case not appended
                style[FILTER] = currentFilter.replace(/alpha([^)]*\))/gi, '') +
                        ((val < 1) ? 'alpha(' + OPACITY + '=' + val * 100 + ')' : '');

                if (!style[FILTER]) {
                    style.removeAttribute(FILTER);
                }

                if (!styleObj[HAS_LAYOUT]) {
                    style.zoom = 1; // needs layout 
                }
            }
        }
    };
}

try {
    Y.config.doc.createElement('div').style.height = '-1px';
} catch(e) { // IE throws error on invalid style set; trap common cases
    Y.DOM.CUSTOM_STYLES.height = {
        set: function(node, val, style) {
            var floatVal = parseFloat(val);
            if (floatVal >= 0 || val === 'auto' || val === '') {
                style.height = val;
            } else {
            }
        }
    };

    Y.DOM.CUSTOM_STYLES.width = {
        set: function(node, val, style) {
            var floatVal = parseFloat(val);
            if (floatVal >= 0 || val === 'auto' || val === '') {
                style.width = val;
            } else {
            }
        }
    };
}

if (!testFeature('style', 'computedStyle')) {
    // TODO: top, right, bottom, left
    IEComputed[WIDTH] = IEComputed[HEIGHT] = ComputedStyle.getOffset;

    IEComputed.color = IEComputed.backgroundColor = ComputedStyle.getColor;

    IEComputed[BORDER_WIDTH] = IEComputed[BORDER_TOP_WIDTH] = IEComputed[BORDER_RIGHT_WIDTH] =
            IEComputed[BORDER_BOTTOM_WIDTH] = IEComputed[BORDER_LEFT_WIDTH] =
            ComputedStyle.getBorderWidth;

    IEComputed.marginTop = IEComputed.marginRight = IEComputed.marginBottom =
            IEComputed.marginLeft = ComputedStyle.getMargin;

    IEComputed.visibility = ComputedStyle.getVisibility;
    IEComputed.borderColor = IEComputed.borderTopColor =
            IEComputed.borderRightColor = IEComputed.borderBottomColor =
            IEComputed.borderLeftColor = ComputedStyle.getBorderColor;

    Y.DOM[GET_COMPUTED_STYLE] = ComputedStyle.get; 

    Y.namespace('DOM.IE');
    Y.DOM.IE.COMPUTED = IEComputed;
    Y.DOM.IE.ComputedStyle = ComputedStyle;
}

})(Y);


}, '3.7.3', {"requires": ["dom-style"]});
