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
_yuitest_coverage["build/dom-screen/dom-screen.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/dom-screen/dom-screen.js",
    code: []
};
_yuitest_coverage["build/dom-screen/dom-screen.js"].code=["YUI.add('dom-screen', function (Y, NAME) {","","(function(Y) {","","/**"," * Adds position and region management functionality to DOM."," * @module dom"," * @submodule dom-screen"," * @for DOM"," */","","var DOCUMENT_ELEMENT = 'documentElement',","    COMPAT_MODE = 'compatMode',","    POSITION = 'position',","    FIXED = 'fixed',","    RELATIVE = 'relative',","    LEFT = 'left',","    TOP = 'top',","    _BACK_COMPAT = 'BackCompat',","    MEDIUM = 'medium',","    BORDER_LEFT_WIDTH = 'borderLeftWidth',","    BORDER_TOP_WIDTH = 'borderTopWidth',","    GET_BOUNDING_CLIENT_RECT = 'getBoundingClientRect',","    GET_COMPUTED_STYLE = 'getComputedStyle',","","    Y_DOM = Y.DOM,","","    // TODO: how about thead/tbody/tfoot/tr?","    // TODO: does caption matter?","    RE_TABLE = /^t(?:able|d|h)$/i,","","    SCROLL_NODE;","","if (Y.UA.ie) {","    if (Y.config.doc[COMPAT_MODE] !== 'BackCompat') {","        SCROLL_NODE = DOCUMENT_ELEMENT; ","    } else {","        SCROLL_NODE = 'body';","    }","}","","Y.mix(Y_DOM, {","    /**","     * Returns the inner height of the viewport (exludes scrollbar). ","     * @method winHeight","     * @return {Number} The current height of the viewport.","     */","    winHeight: function(node) {","        var h = Y_DOM._getWinSize(node).height;","        return h;","    },","","    /**","     * Returns the inner width of the viewport (exludes scrollbar). ","     * @method winWidth","     * @return {Number} The current width of the viewport.","     */","    winWidth: function(node) {","        var w = Y_DOM._getWinSize(node).width;","        return w;","    },","","    /**","     * Document height ","     * @method docHeight","     * @return {Number} The current height of the document.","     */","    docHeight:  function(node) {","        var h = Y_DOM._getDocSize(node).height;","        return Math.max(h, Y_DOM._getWinSize(node).height);","    },","","    /**","     * Document width ","     * @method docWidth","     * @return {Number} The current width of the document.","     */","    docWidth:  function(node) {","        var w = Y_DOM._getDocSize(node).width;","        return Math.max(w, Y_DOM._getWinSize(node).width);","    },","","    /**","     * Amount page has been scroll horizontally ","     * @method docScrollX","     * @return {Number} The current amount the screen is scrolled horizontally.","     */","    docScrollX: function(node, doc) {","        doc = doc || (node) ? Y_DOM._getDoc(node) : Y.config.doc; // perf optimization","        var dv = doc.defaultView,","            pageOffset = (dv) ? dv.pageXOffset : 0;","        return Math.max(doc[DOCUMENT_ELEMENT].scrollLeft, doc.body.scrollLeft, pageOffset);","    },","","    /**","     * Amount page has been scroll vertically ","     * @method docScrollY","     * @return {Number} The current amount the screen is scrolled vertically.","     */","    docScrollY:  function(node, doc) {","        doc = doc || (node) ? Y_DOM._getDoc(node) : Y.config.doc; // perf optimization","        var dv = doc.defaultView,","            pageOffset = (dv) ? dv.pageYOffset : 0;","        return Math.max(doc[DOCUMENT_ELEMENT].scrollTop, doc.body.scrollTop, pageOffset);","    },","","    /**","     * Gets the current position of an element based on page coordinates. ","     * Element must be part of the DOM tree to have page coordinates","     * (display:none or elements not appended return false).","     * @method getXY","     * @param element The target element","     * @return {Array} The XY position of the element","","     TODO: test inDocument/display?","     */","    getXY: function() {","        if (Y.config.doc[DOCUMENT_ELEMENT][GET_BOUNDING_CLIENT_RECT]) {","            return function(node) {","                var xy = null,","                    scrollLeft,","                    scrollTop,","                    mode,","                    box,","                    offX,","                    offY,","                    doc,","                    win,","                    inDoc,","                    rootNode;","","                if (node && node.tagName) {","                    doc = node.ownerDocument;","                    mode = doc[COMPAT_MODE];","","                    if (mode !== _BACK_COMPAT) {","                        rootNode = doc[DOCUMENT_ELEMENT];","                    } else {","                        rootNode = doc.body;","                    }","","                    // inline inDoc check for perf","                    if (rootNode.contains) {","                        inDoc = rootNode.contains(node); ","                    } else {","                        inDoc = Y.DOM.contains(rootNode, node);","                    }","","                    if (inDoc) {","                        win = doc.defaultView;","","                        // inline scroll calc for perf","                        if (win && 'pageXOffset' in win) {","                            scrollLeft = win.pageXOffset;","                            scrollTop = win.pageYOffset;","                        } else {","                            scrollLeft = (SCROLL_NODE) ? doc[SCROLL_NODE].scrollLeft : Y_DOM.docScrollX(node, doc);","                            scrollTop = (SCROLL_NODE) ? doc[SCROLL_NODE].scrollTop : Y_DOM.docScrollY(node, doc);","                        }","","                        if (Y.UA.ie) { // IE < 8, quirks, or compatMode","                            if (!doc.documentMode || doc.documentMode < 8 || mode === _BACK_COMPAT) {","                                offX = rootNode.clientLeft;","                                offY = rootNode.clientTop;","                            }","                        }","                        box = node[GET_BOUNDING_CLIENT_RECT]();","                        xy = [box.left, box.top];","","                        if (offX || offY) {","                                xy[0] -= offX;","                                xy[1] -= offY;","                            ","                        }","                        if ((scrollTop || scrollLeft)) {","                            if (!Y.UA.ios || (Y.UA.ios >= 4.2)) {","                                xy[0] += scrollLeft;","                                xy[1] += scrollTop;","                            }","                            ","                        }","                    } else {","                        xy = Y_DOM._getOffset(node);       ","                    }","                }","                return xy;                   ","            };","        } else {","            return function(node) { // manually calculate by crawling up offsetParents","                //Calculate the Top and Left border sizes (assumes pixels)","                var xy = null,","                    doc,","                    parentNode,","                    bCheck,","                    scrollTop,","                    scrollLeft;","","                if (node) {","                    if (Y_DOM.inDoc(node)) {","                        xy = [node.offsetLeft, node.offsetTop];","                        doc = node.ownerDocument;","                        parentNode = node;","                        // TODO: refactor with !! or just falsey","                        bCheck = ((Y.UA.gecko || Y.UA.webkit > 519) ? true : false);","","                        // TODO: worth refactoring for TOP/LEFT only?","                        while ((parentNode = parentNode.offsetParent)) {","                            xy[0] += parentNode.offsetLeft;","                            xy[1] += parentNode.offsetTop;","                            if (bCheck) {","                                xy = Y_DOM._calcBorders(parentNode, xy);","                            }","                        }","","                        // account for any scrolled ancestors","                        if (Y_DOM.getStyle(node, POSITION) != FIXED) {","                            parentNode = node;","","                            while ((parentNode = parentNode.parentNode)) {","                                scrollTop = parentNode.scrollTop;","                                scrollLeft = parentNode.scrollLeft;","","                                //Firefox does something funky with borders when overflow is not visible.","                                if (Y.UA.gecko && (Y_DOM.getStyle(parentNode, 'overflow') !== 'visible')) {","                                        xy = Y_DOM._calcBorders(parentNode, xy);","                                }","                                ","","                                if (scrollTop || scrollLeft) {","                                    xy[0] -= scrollLeft;","                                    xy[1] -= scrollTop;","                                }","                            }","                            xy[0] += Y_DOM.docScrollX(node, doc);","                            xy[1] += Y_DOM.docScrollY(node, doc);","","                        } else {","                            //Fix FIXED position -- add scrollbars","                            xy[0] += Y_DOM.docScrollX(node, doc);","                            xy[1] += Y_DOM.docScrollY(node, doc);","                        }","                    } else {","                        xy = Y_DOM._getOffset(node);","                    }","                }","","                return xy;                ","            };","        }","    }(),// NOTE: Executing for loadtime branching","","    /**","    Gets the width of vertical scrollbars on overflowed containers in the body","    content.","","    @method getScrollbarWidth","    @return {Number} Pixel width of a scrollbar in the current browser","    **/","    getScrollbarWidth: Y.cached(function () {","        var doc      = Y.config.doc,","            testNode = doc.createElement('div'),","            body     = doc.getElementsByTagName('body')[0],","            // 0.1 because cached doesn't support falsy refetch values","            width    = 0.1;","            ","        if (body) {","            testNode.style.cssText = \"position:absolute;visibility:hidden;overflow:scroll;width:20px;\";","            testNode.appendChild(doc.createElement('p')).style.height = '1px';","            body.insertBefore(testNode, body.firstChild);","            width = testNode.offsetWidth - testNode.clientWidth;","","            body.removeChild(testNode);","        }","","        return width;","    }, null, 0.1),","","    /**","     * Gets the current X position of an element based on page coordinates. ","     * Element must be part of the DOM tree to have page coordinates","     * (display:none or elements not appended return false).","     * @method getX","     * @param element The target element","     * @return {Number} The X position of the element","     */","","    getX: function(node) {","        return Y_DOM.getXY(node)[0];","    },","","    /**","     * Gets the current Y position of an element based on page coordinates. ","     * Element must be part of the DOM tree to have page coordinates","     * (display:none or elements not appended return false).","     * @method getY","     * @param element The target element","     * @return {Number} The Y position of the element","     */","","    getY: function(node) {","        return Y_DOM.getXY(node)[1];","    },","","    /**","     * Set the position of an html element in page coordinates.","     * The element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).","     * @method setXY","     * @param element The target element","     * @param {Array} xy Contains X & Y values for new position (coordinates are page-based)","     * @param {Boolean} noRetry By default we try and set the position a second time if the first fails","     */","    setXY: function(node, xy, noRetry) {","        var setStyle = Y_DOM.setStyle,","            pos,","            delta,","            newXY,","            currentXY;","","        if (node && xy) {","            pos = Y_DOM.getStyle(node, POSITION);","","            delta = Y_DOM._getOffset(node);       ","            if (pos == 'static') { // default to relative","                pos = RELATIVE;","                setStyle(node, POSITION, pos);","            }","            currentXY = Y_DOM.getXY(node);","","            if (xy[0] !== null) {","                setStyle(node, LEFT, xy[0] - currentXY[0] + delta[0] + 'px');","            }","","            if (xy[1] !== null) {","                setStyle(node, TOP, xy[1] - currentXY[1] + delta[1] + 'px');","            }","","            if (!noRetry) {","                newXY = Y_DOM.getXY(node);","                if (newXY[0] !== xy[0] || newXY[1] !== xy[1]) {","                    Y_DOM.setXY(node, xy, true); ","                }","            }","          ","        } else {","        }","    },","","    /**","     * Set the X position of an html element in page coordinates, regardless of how the element is positioned.","     * The element(s) must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).","     * @method setX","     * @param element The target element","     * @param {Number} x The X values for new position (coordinates are page-based)","     */","    setX: function(node, x) {","        return Y_DOM.setXY(node, [x, null]);","    },","","    /**","     * Set the Y position of an html element in page coordinates, regardless of how the element is positioned.","     * The element(s) must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).","     * @method setY","     * @param element The target element","     * @param {Number} y The Y values for new position (coordinates are page-based)","     */","    setY: function(node, y) {","        return Y_DOM.setXY(node, [null, y]);","    },","","    /**","     * @method swapXY","     * @description Swap the xy position with another node","     * @param {Node} node The node to swap with","     * @param {Node} otherNode The other node to swap with","     * @return {Node}","     */","    swapXY: function(node, otherNode) {","        var xy = Y_DOM.getXY(node);","        Y_DOM.setXY(node, Y_DOM.getXY(otherNode));","        Y_DOM.setXY(otherNode, xy);","    },","","    _calcBorders: function(node, xy2) {","        var t = parseInt(Y_DOM[GET_COMPUTED_STYLE](node, BORDER_TOP_WIDTH), 10) || 0,","            l = parseInt(Y_DOM[GET_COMPUTED_STYLE](node, BORDER_LEFT_WIDTH), 10) || 0;","        if (Y.UA.gecko) {","            if (RE_TABLE.test(node.tagName)) {","                t = 0;","                l = 0;","            }","        }","        xy2[0] += l;","        xy2[1] += t;","        return xy2;","    },","","    _getWinSize: function(node, doc) {","        doc  = doc || (node) ? Y_DOM._getDoc(node) : Y.config.doc;","        var win = doc.defaultView || doc.parentWindow,","            mode = doc[COMPAT_MODE],","            h = win.innerHeight,","            w = win.innerWidth,","            root = doc[DOCUMENT_ELEMENT];","","        if ( mode && !Y.UA.opera ) { // IE, Gecko","            if (mode != 'CSS1Compat') { // Quirks","                root = doc.body; ","            }","            h = root.clientHeight;","            w = root.clientWidth;","        }","        return { height: h, width: w };","    },","","    _getDocSize: function(node) {","        var doc = (node) ? Y_DOM._getDoc(node) : Y.config.doc,","            root = doc[DOCUMENT_ELEMENT];","","        if (doc[COMPAT_MODE] != 'CSS1Compat') {","            root = doc.body;","        }","","        return { height: root.scrollHeight, width: root.scrollWidth };","    }","});","","})(Y);","(function(Y) {","var TOP = 'top',","    RIGHT = 'right',","    BOTTOM = 'bottom',","    LEFT = 'left',","","    getOffsets = function(r1, r2) {","        var t = Math.max(r1[TOP], r2[TOP]),","            r = Math.min(r1[RIGHT], r2[RIGHT]),","            b = Math.min(r1[BOTTOM], r2[BOTTOM]),","            l = Math.max(r1[LEFT], r2[LEFT]),","            ret = {};","        ","        ret[TOP] = t;","        ret[RIGHT] = r;","        ret[BOTTOM] = b;","        ret[LEFT] = l;","        return ret;","    },","","    DOM = Y.DOM;","","Y.mix(DOM, {","    /**","     * Returns an Object literal containing the following about this element: (top, right, bottom, left)","     * @for DOM","     * @method region","     * @param {HTMLElement} element The DOM element. ","     * @return {Object} Object literal containing the following about this element: (top, right, bottom, left)","     */","    region: function(node) {","        var xy = DOM.getXY(node),","            ret = false;","        ","        if (node && xy) {","            ret = DOM._getRegion(","                xy[1], // top","                xy[0] + node.offsetWidth, // right","                xy[1] + node.offsetHeight, // bottom","                xy[0] // left","            );","        }","","        return ret;","    },","","    /**","     * Find the intersect information for the passed nodes.","     * @method intersect","     * @for DOM","     * @param {HTMLElement} element The first element ","     * @param {HTMLElement | Object} element2 The element or region to check the interect with","     * @param {Object} altRegion An object literal containing the region for the first element if we already have the data (for performance e.g. DragDrop)","     * @return {Object} Object literal containing the following intersection data: (top, right, bottom, left, area, yoff, xoff, inRegion)","     */","    intersect: function(node, node2, altRegion) {","        var r = altRegion || DOM.region(node), region = {},","            n = node2,","            off;","","        if (n.tagName) {","            region = DOM.region(n);","        } else if (Y.Lang.isObject(node2)) {","            region = node2;","        } else {","            return false;","        }","        ","        off = getOffsets(region, r);","        return {","            top: off[TOP],","            right: off[RIGHT],","            bottom: off[BOTTOM],","            left: off[LEFT],","            area: ((off[BOTTOM] - off[TOP]) * (off[RIGHT] - off[LEFT])),","            yoff: ((off[BOTTOM] - off[TOP])),","            xoff: (off[RIGHT] - off[LEFT]),","            inRegion: DOM.inRegion(node, node2, false, altRegion)","        };","        ","    },","    /**","     * Check if any part of this node is in the passed region","     * @method inRegion","     * @for DOM","     * @param {Object} node The node to get the region from","     * @param {Object} node2 The second node to get the region from or an Object literal of the region","     * @param {Boolean} all Should all of the node be inside the region","     * @param {Object} altRegion An object literal containing the region for this node if we already have the data (for performance e.g. DragDrop)","     * @return {Boolean} True if in region, false if not.","     */","    inRegion: function(node, node2, all, altRegion) {","        var region = {},","            r = altRegion || DOM.region(node),","            n = node2,","            off;","","        if (n.tagName) {","            region = DOM.region(n);","        } else if (Y.Lang.isObject(node2)) {","            region = node2;","        } else {","            return false;","        }","            ","        if (all) {","            return (","                r[LEFT]   >= region[LEFT]   &&","                r[RIGHT]  <= region[RIGHT]  && ","                r[TOP]    >= region[TOP]    && ","                r[BOTTOM] <= region[BOTTOM]  );","        } else {","            off = getOffsets(region, r);","            if (off[BOTTOM] >= off[TOP] && off[RIGHT] >= off[LEFT]) {","                return true;","            } else {","                return false;","            }","            ","        }","    },","","    /**","     * Check if any part of this element is in the viewport","     * @method inViewportRegion","     * @for DOM","     * @param {HTMLElement} element The DOM element. ","     * @param {Boolean} all Should all of the node be inside the region","     * @param {Object} altRegion An object literal containing the region for this node if we already have the data (for performance e.g. DragDrop)","     * @return {Boolean} True if in region, false if not.","     */","    inViewportRegion: function(node, all, altRegion) {","        return DOM.inRegion(node, DOM.viewportRegion(node), all, altRegion);","            ","    },","","    _getRegion: function(t, r, b, l) {","        var region = {};","","        region[TOP] = region[1] = t;","        region[LEFT] = region[0] = l;","        region[BOTTOM] = b;","        region[RIGHT] = r;","        region.width = region[RIGHT] - region[LEFT];","        region.height = region[BOTTOM] - region[TOP];","","        return region;","    },","","    /**","     * Returns an Object literal containing the following about the visible region of viewport: (top, right, bottom, left)","     * @method viewportRegion","     * @for DOM","     * @return {Object} Object literal containing the following about the visible region of the viewport: (top, right, bottom, left)","     */","    viewportRegion: function(node) {","        node = node || Y.config.doc.documentElement;","        var ret = false,","            scrollX,","            scrollY;","","        if (node) {","            scrollX = DOM.docScrollX(node);","            scrollY = DOM.docScrollY(node);","","            ret = DOM._getRegion(scrollY, // top","                DOM.winWidth(node) + scrollX, // right","                scrollY + DOM.winHeight(node), // bottom","                scrollX); // left","        }","","        return ret;","    }","});","})(Y);","","","}, '3.7.3', {\"requires\": [\"dom-base\", \"dom-style\"]});"];
_yuitest_coverage["build/dom-screen/dom-screen.js"].lines = {"1":0,"3":0,"12":0,"34":0,"35":0,"36":0,"38":0,"42":0,"49":0,"50":0,"59":0,"60":0,"69":0,"70":0,"79":0,"80":0,"89":0,"90":0,"92":0,"101":0,"102":0,"104":0,"118":0,"119":0,"120":0,"132":0,"133":0,"134":0,"136":0,"137":0,"139":0,"143":0,"144":0,"146":0,"149":0,"150":0,"153":0,"154":0,"155":0,"157":0,"158":0,"161":0,"162":0,"163":0,"164":0,"167":0,"168":0,"170":0,"171":0,"172":0,"175":0,"176":0,"177":0,"178":0,"183":0,"186":0,"189":0,"191":0,"198":0,"199":0,"200":0,"201":0,"202":0,"204":0,"207":0,"208":0,"209":0,"210":0,"211":0,"216":0,"217":0,"219":0,"220":0,"221":0,"224":0,"225":0,"229":0,"230":0,"231":0,"234":0,"235":0,"239":0,"240":0,"243":0,"247":0,"260":0,"266":0,"267":0,"268":0,"269":0,"270":0,"272":0,"275":0,"288":0,"301":0,"313":0,"319":0,"320":0,"322":0,"323":0,"324":0,"325":0,"327":0,"329":0,"330":0,"333":0,"334":0,"337":0,"338":0,"339":0,"340":0,"356":0,"367":0,"378":0,"379":0,"380":0,"384":0,"386":0,"387":0,"388":0,"389":0,"392":0,"393":0,"394":0,"398":0,"399":0,"405":0,"406":0,"407":0,"409":0,"410":0,"412":0,"416":0,"419":0,"420":0,"423":0,"428":0,"429":0,"435":0,"441":0,"442":0,"443":0,"444":0,"445":0,"450":0,"459":0,"462":0,"463":0,"471":0,"484":0,"488":0,"489":0,"490":0,"491":0,"493":0,"496":0,"497":0,"520":0,"525":0,"526":0,"527":0,"528":0,"530":0,"533":0,"534":0,"540":0,"541":0,"542":0,"544":0,"560":0,"565":0,"567":0,"568":0,"569":0,"570":0,"571":0,"572":0,"574":0,"584":0,"585":0,"589":0,"590":0,"591":0,"593":0,"599":0};
_yuitest_coverage["build/dom-screen/dom-screen.js"].functions = {"winHeight:48":0,"winWidth:58":0,"docHeight:68":0,"docWidth:78":0,"docScrollX:88":0,"docScrollY:100":0,"(anonymous 3):119":0,"(anonymous 4):189":0,"getXY:117":0,"(anonymous 5):259":0,"getX:287":0,"getY:300":0,"setXY:312":0,"setX:355":0,"setY:366":0,"swapXY:377":0,"_calcBorders:383":0,"_getWinSize:397":0,"_getDocSize:415":0,"(anonymous 2):3":0,"getOffsets:434":0,"region:458":0,"intersect:483":0,"inRegion:519":0,"inViewportRegion:559":0,"_getRegion:564":0,"viewportRegion:583":0,"(anonymous 6):428":0,"(anonymous 1):1":0};
_yuitest_coverage["build/dom-screen/dom-screen.js"].coveredLines = 185;
_yuitest_coverage["build/dom-screen/dom-screen.js"].coveredFunctions = 29;
_yuitest_coverline("build/dom-screen/dom-screen.js", 1);
YUI.add('dom-screen', function (Y, NAME) {

_yuitest_coverfunc("build/dom-screen/dom-screen.js", "(anonymous 1)", 1);
_yuitest_coverline("build/dom-screen/dom-screen.js", 3);
(function(Y) {

/**
 * Adds position and region management functionality to DOM.
 * @module dom
 * @submodule dom-screen
 * @for DOM
 */

_yuitest_coverfunc("build/dom-screen/dom-screen.js", "(anonymous 2)", 3);
_yuitest_coverline("build/dom-screen/dom-screen.js", 12);
var DOCUMENT_ELEMENT = 'documentElement',
    COMPAT_MODE = 'compatMode',
    POSITION = 'position',
    FIXED = 'fixed',
    RELATIVE = 'relative',
    LEFT = 'left',
    TOP = 'top',
    _BACK_COMPAT = 'BackCompat',
    MEDIUM = 'medium',
    BORDER_LEFT_WIDTH = 'borderLeftWidth',
    BORDER_TOP_WIDTH = 'borderTopWidth',
    GET_BOUNDING_CLIENT_RECT = 'getBoundingClientRect',
    GET_COMPUTED_STYLE = 'getComputedStyle',

    Y_DOM = Y.DOM,

    // TODO: how about thead/tbody/tfoot/tr?
    // TODO: does caption matter?
    RE_TABLE = /^t(?:able|d|h)$/i,

    SCROLL_NODE;

_yuitest_coverline("build/dom-screen/dom-screen.js", 34);
if (Y.UA.ie) {
    _yuitest_coverline("build/dom-screen/dom-screen.js", 35);
if (Y.config.doc[COMPAT_MODE] !== 'BackCompat') {
        _yuitest_coverline("build/dom-screen/dom-screen.js", 36);
SCROLL_NODE = DOCUMENT_ELEMENT; 
    } else {
        _yuitest_coverline("build/dom-screen/dom-screen.js", 38);
SCROLL_NODE = 'body';
    }
}

_yuitest_coverline("build/dom-screen/dom-screen.js", 42);
Y.mix(Y_DOM, {
    /**
     * Returns the inner height of the viewport (exludes scrollbar). 
     * @method winHeight
     * @return {Number} The current height of the viewport.
     */
    winHeight: function(node) {
        _yuitest_coverfunc("build/dom-screen/dom-screen.js", "winHeight", 48);
_yuitest_coverline("build/dom-screen/dom-screen.js", 49);
var h = Y_DOM._getWinSize(node).height;
        _yuitest_coverline("build/dom-screen/dom-screen.js", 50);
return h;
    },

    /**
     * Returns the inner width of the viewport (exludes scrollbar). 
     * @method winWidth
     * @return {Number} The current width of the viewport.
     */
    winWidth: function(node) {
        _yuitest_coverfunc("build/dom-screen/dom-screen.js", "winWidth", 58);
_yuitest_coverline("build/dom-screen/dom-screen.js", 59);
var w = Y_DOM._getWinSize(node).width;
        _yuitest_coverline("build/dom-screen/dom-screen.js", 60);
return w;
    },

    /**
     * Document height 
     * @method docHeight
     * @return {Number} The current height of the document.
     */
    docHeight:  function(node) {
        _yuitest_coverfunc("build/dom-screen/dom-screen.js", "docHeight", 68);
_yuitest_coverline("build/dom-screen/dom-screen.js", 69);
var h = Y_DOM._getDocSize(node).height;
        _yuitest_coverline("build/dom-screen/dom-screen.js", 70);
return Math.max(h, Y_DOM._getWinSize(node).height);
    },

    /**
     * Document width 
     * @method docWidth
     * @return {Number} The current width of the document.
     */
    docWidth:  function(node) {
        _yuitest_coverfunc("build/dom-screen/dom-screen.js", "docWidth", 78);
_yuitest_coverline("build/dom-screen/dom-screen.js", 79);
var w = Y_DOM._getDocSize(node).width;
        _yuitest_coverline("build/dom-screen/dom-screen.js", 80);
return Math.max(w, Y_DOM._getWinSize(node).width);
    },

    /**
     * Amount page has been scroll horizontally 
     * @method docScrollX
     * @return {Number} The current amount the screen is scrolled horizontally.
     */
    docScrollX: function(node, doc) {
        _yuitest_coverfunc("build/dom-screen/dom-screen.js", "docScrollX", 88);
_yuitest_coverline("build/dom-screen/dom-screen.js", 89);
doc = doc || (node) ? Y_DOM._getDoc(node) : Y.config.doc; // perf optimization
        _yuitest_coverline("build/dom-screen/dom-screen.js", 90);
var dv = doc.defaultView,
            pageOffset = (dv) ? dv.pageXOffset : 0;
        _yuitest_coverline("build/dom-screen/dom-screen.js", 92);
return Math.max(doc[DOCUMENT_ELEMENT].scrollLeft, doc.body.scrollLeft, pageOffset);
    },

    /**
     * Amount page has been scroll vertically 
     * @method docScrollY
     * @return {Number} The current amount the screen is scrolled vertically.
     */
    docScrollY:  function(node, doc) {
        _yuitest_coverfunc("build/dom-screen/dom-screen.js", "docScrollY", 100);
_yuitest_coverline("build/dom-screen/dom-screen.js", 101);
doc = doc || (node) ? Y_DOM._getDoc(node) : Y.config.doc; // perf optimization
        _yuitest_coverline("build/dom-screen/dom-screen.js", 102);
var dv = doc.defaultView,
            pageOffset = (dv) ? dv.pageYOffset : 0;
        _yuitest_coverline("build/dom-screen/dom-screen.js", 104);
return Math.max(doc[DOCUMENT_ELEMENT].scrollTop, doc.body.scrollTop, pageOffset);
    },

    /**
     * Gets the current position of an element based on page coordinates. 
     * Element must be part of the DOM tree to have page coordinates
     * (display:none or elements not appended return false).
     * @method getXY
     * @param element The target element
     * @return {Array} The XY position of the element

     TODO: test inDocument/display?
     */
    getXY: function() {
        _yuitest_coverfunc("build/dom-screen/dom-screen.js", "getXY", 117);
_yuitest_coverline("build/dom-screen/dom-screen.js", 118);
if (Y.config.doc[DOCUMENT_ELEMENT][GET_BOUNDING_CLIENT_RECT]) {
            _yuitest_coverline("build/dom-screen/dom-screen.js", 119);
return function(node) {
                _yuitest_coverfunc("build/dom-screen/dom-screen.js", "(anonymous 3)", 119);
_yuitest_coverline("build/dom-screen/dom-screen.js", 120);
var xy = null,
                    scrollLeft,
                    scrollTop,
                    mode,
                    box,
                    offX,
                    offY,
                    doc,
                    win,
                    inDoc,
                    rootNode;

                _yuitest_coverline("build/dom-screen/dom-screen.js", 132);
if (node && node.tagName) {
                    _yuitest_coverline("build/dom-screen/dom-screen.js", 133);
doc = node.ownerDocument;
                    _yuitest_coverline("build/dom-screen/dom-screen.js", 134);
mode = doc[COMPAT_MODE];

                    _yuitest_coverline("build/dom-screen/dom-screen.js", 136);
if (mode !== _BACK_COMPAT) {
                        _yuitest_coverline("build/dom-screen/dom-screen.js", 137);
rootNode = doc[DOCUMENT_ELEMENT];
                    } else {
                        _yuitest_coverline("build/dom-screen/dom-screen.js", 139);
rootNode = doc.body;
                    }

                    // inline inDoc check for perf
                    _yuitest_coverline("build/dom-screen/dom-screen.js", 143);
if (rootNode.contains) {
                        _yuitest_coverline("build/dom-screen/dom-screen.js", 144);
inDoc = rootNode.contains(node); 
                    } else {
                        _yuitest_coverline("build/dom-screen/dom-screen.js", 146);
inDoc = Y.DOM.contains(rootNode, node);
                    }

                    _yuitest_coverline("build/dom-screen/dom-screen.js", 149);
if (inDoc) {
                        _yuitest_coverline("build/dom-screen/dom-screen.js", 150);
win = doc.defaultView;

                        // inline scroll calc for perf
                        _yuitest_coverline("build/dom-screen/dom-screen.js", 153);
if (win && 'pageXOffset' in win) {
                            _yuitest_coverline("build/dom-screen/dom-screen.js", 154);
scrollLeft = win.pageXOffset;
                            _yuitest_coverline("build/dom-screen/dom-screen.js", 155);
scrollTop = win.pageYOffset;
                        } else {
                            _yuitest_coverline("build/dom-screen/dom-screen.js", 157);
scrollLeft = (SCROLL_NODE) ? doc[SCROLL_NODE].scrollLeft : Y_DOM.docScrollX(node, doc);
                            _yuitest_coverline("build/dom-screen/dom-screen.js", 158);
scrollTop = (SCROLL_NODE) ? doc[SCROLL_NODE].scrollTop : Y_DOM.docScrollY(node, doc);
                        }

                        _yuitest_coverline("build/dom-screen/dom-screen.js", 161);
if (Y.UA.ie) { // IE < 8, quirks, or compatMode
                            _yuitest_coverline("build/dom-screen/dom-screen.js", 162);
if (!doc.documentMode || doc.documentMode < 8 || mode === _BACK_COMPAT) {
                                _yuitest_coverline("build/dom-screen/dom-screen.js", 163);
offX = rootNode.clientLeft;
                                _yuitest_coverline("build/dom-screen/dom-screen.js", 164);
offY = rootNode.clientTop;
                            }
                        }
                        _yuitest_coverline("build/dom-screen/dom-screen.js", 167);
box = node[GET_BOUNDING_CLIENT_RECT]();
                        _yuitest_coverline("build/dom-screen/dom-screen.js", 168);
xy = [box.left, box.top];

                        _yuitest_coverline("build/dom-screen/dom-screen.js", 170);
if (offX || offY) {
                                _yuitest_coverline("build/dom-screen/dom-screen.js", 171);
xy[0] -= offX;
                                _yuitest_coverline("build/dom-screen/dom-screen.js", 172);
xy[1] -= offY;
                            
                        }
                        _yuitest_coverline("build/dom-screen/dom-screen.js", 175);
if ((scrollTop || scrollLeft)) {
                            _yuitest_coverline("build/dom-screen/dom-screen.js", 176);
if (!Y.UA.ios || (Y.UA.ios >= 4.2)) {
                                _yuitest_coverline("build/dom-screen/dom-screen.js", 177);
xy[0] += scrollLeft;
                                _yuitest_coverline("build/dom-screen/dom-screen.js", 178);
xy[1] += scrollTop;
                            }
                            
                        }
                    } else {
                        _yuitest_coverline("build/dom-screen/dom-screen.js", 183);
xy = Y_DOM._getOffset(node);       
                    }
                }
                _yuitest_coverline("build/dom-screen/dom-screen.js", 186);
return xy;                   
            };
        } else {
            _yuitest_coverline("build/dom-screen/dom-screen.js", 189);
return function(node) { // manually calculate by crawling up offsetParents
                //Calculate the Top and Left border sizes (assumes pixels)
                _yuitest_coverfunc("build/dom-screen/dom-screen.js", "(anonymous 4)", 189);
_yuitest_coverline("build/dom-screen/dom-screen.js", 191);
var xy = null,
                    doc,
                    parentNode,
                    bCheck,
                    scrollTop,
                    scrollLeft;

                _yuitest_coverline("build/dom-screen/dom-screen.js", 198);
if (node) {
                    _yuitest_coverline("build/dom-screen/dom-screen.js", 199);
if (Y_DOM.inDoc(node)) {
                        _yuitest_coverline("build/dom-screen/dom-screen.js", 200);
xy = [node.offsetLeft, node.offsetTop];
                        _yuitest_coverline("build/dom-screen/dom-screen.js", 201);
doc = node.ownerDocument;
                        _yuitest_coverline("build/dom-screen/dom-screen.js", 202);
parentNode = node;
                        // TODO: refactor with !! or just falsey
                        _yuitest_coverline("build/dom-screen/dom-screen.js", 204);
bCheck = ((Y.UA.gecko || Y.UA.webkit > 519) ? true : false);

                        // TODO: worth refactoring for TOP/LEFT only?
                        _yuitest_coverline("build/dom-screen/dom-screen.js", 207);
while ((parentNode = parentNode.offsetParent)) {
                            _yuitest_coverline("build/dom-screen/dom-screen.js", 208);
xy[0] += parentNode.offsetLeft;
                            _yuitest_coverline("build/dom-screen/dom-screen.js", 209);
xy[1] += parentNode.offsetTop;
                            _yuitest_coverline("build/dom-screen/dom-screen.js", 210);
if (bCheck) {
                                _yuitest_coverline("build/dom-screen/dom-screen.js", 211);
xy = Y_DOM._calcBorders(parentNode, xy);
                            }
                        }

                        // account for any scrolled ancestors
                        _yuitest_coverline("build/dom-screen/dom-screen.js", 216);
if (Y_DOM.getStyle(node, POSITION) != FIXED) {
                            _yuitest_coverline("build/dom-screen/dom-screen.js", 217);
parentNode = node;

                            _yuitest_coverline("build/dom-screen/dom-screen.js", 219);
while ((parentNode = parentNode.parentNode)) {
                                _yuitest_coverline("build/dom-screen/dom-screen.js", 220);
scrollTop = parentNode.scrollTop;
                                _yuitest_coverline("build/dom-screen/dom-screen.js", 221);
scrollLeft = parentNode.scrollLeft;

                                //Firefox does something funky with borders when overflow is not visible.
                                _yuitest_coverline("build/dom-screen/dom-screen.js", 224);
if (Y.UA.gecko && (Y_DOM.getStyle(parentNode, 'overflow') !== 'visible')) {
                                        _yuitest_coverline("build/dom-screen/dom-screen.js", 225);
xy = Y_DOM._calcBorders(parentNode, xy);
                                }
                                

                                _yuitest_coverline("build/dom-screen/dom-screen.js", 229);
if (scrollTop || scrollLeft) {
                                    _yuitest_coverline("build/dom-screen/dom-screen.js", 230);
xy[0] -= scrollLeft;
                                    _yuitest_coverline("build/dom-screen/dom-screen.js", 231);
xy[1] -= scrollTop;
                                }
                            }
                            _yuitest_coverline("build/dom-screen/dom-screen.js", 234);
xy[0] += Y_DOM.docScrollX(node, doc);
                            _yuitest_coverline("build/dom-screen/dom-screen.js", 235);
xy[1] += Y_DOM.docScrollY(node, doc);

                        } else {
                            //Fix FIXED position -- add scrollbars
                            _yuitest_coverline("build/dom-screen/dom-screen.js", 239);
xy[0] += Y_DOM.docScrollX(node, doc);
                            _yuitest_coverline("build/dom-screen/dom-screen.js", 240);
xy[1] += Y_DOM.docScrollY(node, doc);
                        }
                    } else {
                        _yuitest_coverline("build/dom-screen/dom-screen.js", 243);
xy = Y_DOM._getOffset(node);
                    }
                }

                _yuitest_coverline("build/dom-screen/dom-screen.js", 247);
return xy;                
            };
        }
    }(),// NOTE: Executing for loadtime branching

    /**
    Gets the width of vertical scrollbars on overflowed containers in the body
    content.

    @method getScrollbarWidth
    @return {Number} Pixel width of a scrollbar in the current browser
    **/
    getScrollbarWidth: Y.cached(function () {
        _yuitest_coverfunc("build/dom-screen/dom-screen.js", "(anonymous 5)", 259);
_yuitest_coverline("build/dom-screen/dom-screen.js", 260);
var doc      = Y.config.doc,
            testNode = doc.createElement('div'),
            body     = doc.getElementsByTagName('body')[0],
            // 0.1 because cached doesn't support falsy refetch values
            width    = 0.1;
            
        _yuitest_coverline("build/dom-screen/dom-screen.js", 266);
if (body) {
            _yuitest_coverline("build/dom-screen/dom-screen.js", 267);
testNode.style.cssText = "position:absolute;visibility:hidden;overflow:scroll;width:20px;";
            _yuitest_coverline("build/dom-screen/dom-screen.js", 268);
testNode.appendChild(doc.createElement('p')).style.height = '1px';
            _yuitest_coverline("build/dom-screen/dom-screen.js", 269);
body.insertBefore(testNode, body.firstChild);
            _yuitest_coverline("build/dom-screen/dom-screen.js", 270);
width = testNode.offsetWidth - testNode.clientWidth;

            _yuitest_coverline("build/dom-screen/dom-screen.js", 272);
body.removeChild(testNode);
        }

        _yuitest_coverline("build/dom-screen/dom-screen.js", 275);
return width;
    }, null, 0.1),

    /**
     * Gets the current X position of an element based on page coordinates. 
     * Element must be part of the DOM tree to have page coordinates
     * (display:none or elements not appended return false).
     * @method getX
     * @param element The target element
     * @return {Number} The X position of the element
     */

    getX: function(node) {
        _yuitest_coverfunc("build/dom-screen/dom-screen.js", "getX", 287);
_yuitest_coverline("build/dom-screen/dom-screen.js", 288);
return Y_DOM.getXY(node)[0];
    },

    /**
     * Gets the current Y position of an element based on page coordinates. 
     * Element must be part of the DOM tree to have page coordinates
     * (display:none or elements not appended return false).
     * @method getY
     * @param element The target element
     * @return {Number} The Y position of the element
     */

    getY: function(node) {
        _yuitest_coverfunc("build/dom-screen/dom-screen.js", "getY", 300);
_yuitest_coverline("build/dom-screen/dom-screen.js", 301);
return Y_DOM.getXY(node)[1];
    },

    /**
     * Set the position of an html element in page coordinates.
     * The element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
     * @method setXY
     * @param element The target element
     * @param {Array} xy Contains X & Y values for new position (coordinates are page-based)
     * @param {Boolean} noRetry By default we try and set the position a second time if the first fails
     */
    setXY: function(node, xy, noRetry) {
        _yuitest_coverfunc("build/dom-screen/dom-screen.js", "setXY", 312);
_yuitest_coverline("build/dom-screen/dom-screen.js", 313);
var setStyle = Y_DOM.setStyle,
            pos,
            delta,
            newXY,
            currentXY;

        _yuitest_coverline("build/dom-screen/dom-screen.js", 319);
if (node && xy) {
            _yuitest_coverline("build/dom-screen/dom-screen.js", 320);
pos = Y_DOM.getStyle(node, POSITION);

            _yuitest_coverline("build/dom-screen/dom-screen.js", 322);
delta = Y_DOM._getOffset(node);       
            _yuitest_coverline("build/dom-screen/dom-screen.js", 323);
if (pos == 'static') { // default to relative
                _yuitest_coverline("build/dom-screen/dom-screen.js", 324);
pos = RELATIVE;
                _yuitest_coverline("build/dom-screen/dom-screen.js", 325);
setStyle(node, POSITION, pos);
            }
            _yuitest_coverline("build/dom-screen/dom-screen.js", 327);
currentXY = Y_DOM.getXY(node);

            _yuitest_coverline("build/dom-screen/dom-screen.js", 329);
if (xy[0] !== null) {
                _yuitest_coverline("build/dom-screen/dom-screen.js", 330);
setStyle(node, LEFT, xy[0] - currentXY[0] + delta[0] + 'px');
            }

            _yuitest_coverline("build/dom-screen/dom-screen.js", 333);
if (xy[1] !== null) {
                _yuitest_coverline("build/dom-screen/dom-screen.js", 334);
setStyle(node, TOP, xy[1] - currentXY[1] + delta[1] + 'px');
            }

            _yuitest_coverline("build/dom-screen/dom-screen.js", 337);
if (!noRetry) {
                _yuitest_coverline("build/dom-screen/dom-screen.js", 338);
newXY = Y_DOM.getXY(node);
                _yuitest_coverline("build/dom-screen/dom-screen.js", 339);
if (newXY[0] !== xy[0] || newXY[1] !== xy[1]) {
                    _yuitest_coverline("build/dom-screen/dom-screen.js", 340);
Y_DOM.setXY(node, xy, true); 
                }
            }
          
        } else {
        }
    },

    /**
     * Set the X position of an html element in page coordinates, regardless of how the element is positioned.
     * The element(s) must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
     * @method setX
     * @param element The target element
     * @param {Number} x The X values for new position (coordinates are page-based)
     */
    setX: function(node, x) {
        _yuitest_coverfunc("build/dom-screen/dom-screen.js", "setX", 355);
_yuitest_coverline("build/dom-screen/dom-screen.js", 356);
return Y_DOM.setXY(node, [x, null]);
    },

    /**
     * Set the Y position of an html element in page coordinates, regardless of how the element is positioned.
     * The element(s) must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
     * @method setY
     * @param element The target element
     * @param {Number} y The Y values for new position (coordinates are page-based)
     */
    setY: function(node, y) {
        _yuitest_coverfunc("build/dom-screen/dom-screen.js", "setY", 366);
_yuitest_coverline("build/dom-screen/dom-screen.js", 367);
return Y_DOM.setXY(node, [null, y]);
    },

    /**
     * @method swapXY
     * @description Swap the xy position with another node
     * @param {Node} node The node to swap with
     * @param {Node} otherNode The other node to swap with
     * @return {Node}
     */
    swapXY: function(node, otherNode) {
        _yuitest_coverfunc("build/dom-screen/dom-screen.js", "swapXY", 377);
_yuitest_coverline("build/dom-screen/dom-screen.js", 378);
var xy = Y_DOM.getXY(node);
        _yuitest_coverline("build/dom-screen/dom-screen.js", 379);
Y_DOM.setXY(node, Y_DOM.getXY(otherNode));
        _yuitest_coverline("build/dom-screen/dom-screen.js", 380);
Y_DOM.setXY(otherNode, xy);
    },

    _calcBorders: function(node, xy2) {
        _yuitest_coverfunc("build/dom-screen/dom-screen.js", "_calcBorders", 383);
_yuitest_coverline("build/dom-screen/dom-screen.js", 384);
var t = parseInt(Y_DOM[GET_COMPUTED_STYLE](node, BORDER_TOP_WIDTH), 10) || 0,
            l = parseInt(Y_DOM[GET_COMPUTED_STYLE](node, BORDER_LEFT_WIDTH), 10) || 0;
        _yuitest_coverline("build/dom-screen/dom-screen.js", 386);
if (Y.UA.gecko) {
            _yuitest_coverline("build/dom-screen/dom-screen.js", 387);
if (RE_TABLE.test(node.tagName)) {
                _yuitest_coverline("build/dom-screen/dom-screen.js", 388);
t = 0;
                _yuitest_coverline("build/dom-screen/dom-screen.js", 389);
l = 0;
            }
        }
        _yuitest_coverline("build/dom-screen/dom-screen.js", 392);
xy2[0] += l;
        _yuitest_coverline("build/dom-screen/dom-screen.js", 393);
xy2[1] += t;
        _yuitest_coverline("build/dom-screen/dom-screen.js", 394);
return xy2;
    },

    _getWinSize: function(node, doc) {
        _yuitest_coverfunc("build/dom-screen/dom-screen.js", "_getWinSize", 397);
_yuitest_coverline("build/dom-screen/dom-screen.js", 398);
doc  = doc || (node) ? Y_DOM._getDoc(node) : Y.config.doc;
        _yuitest_coverline("build/dom-screen/dom-screen.js", 399);
var win = doc.defaultView || doc.parentWindow,
            mode = doc[COMPAT_MODE],
            h = win.innerHeight,
            w = win.innerWidth,
            root = doc[DOCUMENT_ELEMENT];

        _yuitest_coverline("build/dom-screen/dom-screen.js", 405);
if ( mode && !Y.UA.opera ) { // IE, Gecko
            _yuitest_coverline("build/dom-screen/dom-screen.js", 406);
if (mode != 'CSS1Compat') { // Quirks
                _yuitest_coverline("build/dom-screen/dom-screen.js", 407);
root = doc.body; 
            }
            _yuitest_coverline("build/dom-screen/dom-screen.js", 409);
h = root.clientHeight;
            _yuitest_coverline("build/dom-screen/dom-screen.js", 410);
w = root.clientWidth;
        }
        _yuitest_coverline("build/dom-screen/dom-screen.js", 412);
return { height: h, width: w };
    },

    _getDocSize: function(node) {
        _yuitest_coverfunc("build/dom-screen/dom-screen.js", "_getDocSize", 415);
_yuitest_coverline("build/dom-screen/dom-screen.js", 416);
var doc = (node) ? Y_DOM._getDoc(node) : Y.config.doc,
            root = doc[DOCUMENT_ELEMENT];

        _yuitest_coverline("build/dom-screen/dom-screen.js", 419);
if (doc[COMPAT_MODE] != 'CSS1Compat') {
            _yuitest_coverline("build/dom-screen/dom-screen.js", 420);
root = doc.body;
        }

        _yuitest_coverline("build/dom-screen/dom-screen.js", 423);
return { height: root.scrollHeight, width: root.scrollWidth };
    }
});

})(Y);
_yuitest_coverline("build/dom-screen/dom-screen.js", 428);
(function(Y) {
_yuitest_coverfunc("build/dom-screen/dom-screen.js", "(anonymous 6)", 428);
_yuitest_coverline("build/dom-screen/dom-screen.js", 429);
var TOP = 'top',
    RIGHT = 'right',
    BOTTOM = 'bottom',
    LEFT = 'left',

    getOffsets = function(r1, r2) {
        _yuitest_coverfunc("build/dom-screen/dom-screen.js", "getOffsets", 434);
_yuitest_coverline("build/dom-screen/dom-screen.js", 435);
var t = Math.max(r1[TOP], r2[TOP]),
            r = Math.min(r1[RIGHT], r2[RIGHT]),
            b = Math.min(r1[BOTTOM], r2[BOTTOM]),
            l = Math.max(r1[LEFT], r2[LEFT]),
            ret = {};
        
        _yuitest_coverline("build/dom-screen/dom-screen.js", 441);
ret[TOP] = t;
        _yuitest_coverline("build/dom-screen/dom-screen.js", 442);
ret[RIGHT] = r;
        _yuitest_coverline("build/dom-screen/dom-screen.js", 443);
ret[BOTTOM] = b;
        _yuitest_coverline("build/dom-screen/dom-screen.js", 444);
ret[LEFT] = l;
        _yuitest_coverline("build/dom-screen/dom-screen.js", 445);
return ret;
    },

    DOM = Y.DOM;

_yuitest_coverline("build/dom-screen/dom-screen.js", 450);
Y.mix(DOM, {
    /**
     * Returns an Object literal containing the following about this element: (top, right, bottom, left)
     * @for DOM
     * @method region
     * @param {HTMLElement} element The DOM element. 
     * @return {Object} Object literal containing the following about this element: (top, right, bottom, left)
     */
    region: function(node) {
        _yuitest_coverfunc("build/dom-screen/dom-screen.js", "region", 458);
_yuitest_coverline("build/dom-screen/dom-screen.js", 459);
var xy = DOM.getXY(node),
            ret = false;
        
        _yuitest_coverline("build/dom-screen/dom-screen.js", 462);
if (node && xy) {
            _yuitest_coverline("build/dom-screen/dom-screen.js", 463);
ret = DOM._getRegion(
                xy[1], // top
                xy[0] + node.offsetWidth, // right
                xy[1] + node.offsetHeight, // bottom
                xy[0] // left
            );
        }

        _yuitest_coverline("build/dom-screen/dom-screen.js", 471);
return ret;
    },

    /**
     * Find the intersect information for the passed nodes.
     * @method intersect
     * @for DOM
     * @param {HTMLElement} element The first element 
     * @param {HTMLElement | Object} element2 The element or region to check the interect with
     * @param {Object} altRegion An object literal containing the region for the first element if we already have the data (for performance e.g. DragDrop)
     * @return {Object} Object literal containing the following intersection data: (top, right, bottom, left, area, yoff, xoff, inRegion)
     */
    intersect: function(node, node2, altRegion) {
        _yuitest_coverfunc("build/dom-screen/dom-screen.js", "intersect", 483);
_yuitest_coverline("build/dom-screen/dom-screen.js", 484);
var r = altRegion || DOM.region(node), region = {},
            n = node2,
            off;

        _yuitest_coverline("build/dom-screen/dom-screen.js", 488);
if (n.tagName) {
            _yuitest_coverline("build/dom-screen/dom-screen.js", 489);
region = DOM.region(n);
        } else {_yuitest_coverline("build/dom-screen/dom-screen.js", 490);
if (Y.Lang.isObject(node2)) {
            _yuitest_coverline("build/dom-screen/dom-screen.js", 491);
region = node2;
        } else {
            _yuitest_coverline("build/dom-screen/dom-screen.js", 493);
return false;
        }}
        
        _yuitest_coverline("build/dom-screen/dom-screen.js", 496);
off = getOffsets(region, r);
        _yuitest_coverline("build/dom-screen/dom-screen.js", 497);
return {
            top: off[TOP],
            right: off[RIGHT],
            bottom: off[BOTTOM],
            left: off[LEFT],
            area: ((off[BOTTOM] - off[TOP]) * (off[RIGHT] - off[LEFT])),
            yoff: ((off[BOTTOM] - off[TOP])),
            xoff: (off[RIGHT] - off[LEFT]),
            inRegion: DOM.inRegion(node, node2, false, altRegion)
        };
        
    },
    /**
     * Check if any part of this node is in the passed region
     * @method inRegion
     * @for DOM
     * @param {Object} node The node to get the region from
     * @param {Object} node2 The second node to get the region from or an Object literal of the region
     * @param {Boolean} all Should all of the node be inside the region
     * @param {Object} altRegion An object literal containing the region for this node if we already have the data (for performance e.g. DragDrop)
     * @return {Boolean} True if in region, false if not.
     */
    inRegion: function(node, node2, all, altRegion) {
        _yuitest_coverfunc("build/dom-screen/dom-screen.js", "inRegion", 519);
_yuitest_coverline("build/dom-screen/dom-screen.js", 520);
var region = {},
            r = altRegion || DOM.region(node),
            n = node2,
            off;

        _yuitest_coverline("build/dom-screen/dom-screen.js", 525);
if (n.tagName) {
            _yuitest_coverline("build/dom-screen/dom-screen.js", 526);
region = DOM.region(n);
        } else {_yuitest_coverline("build/dom-screen/dom-screen.js", 527);
if (Y.Lang.isObject(node2)) {
            _yuitest_coverline("build/dom-screen/dom-screen.js", 528);
region = node2;
        } else {
            _yuitest_coverline("build/dom-screen/dom-screen.js", 530);
return false;
        }}
            
        _yuitest_coverline("build/dom-screen/dom-screen.js", 533);
if (all) {
            _yuitest_coverline("build/dom-screen/dom-screen.js", 534);
return (
                r[LEFT]   >= region[LEFT]   &&
                r[RIGHT]  <= region[RIGHT]  && 
                r[TOP]    >= region[TOP]    && 
                r[BOTTOM] <= region[BOTTOM]  );
        } else {
            _yuitest_coverline("build/dom-screen/dom-screen.js", 540);
off = getOffsets(region, r);
            _yuitest_coverline("build/dom-screen/dom-screen.js", 541);
if (off[BOTTOM] >= off[TOP] && off[RIGHT] >= off[LEFT]) {
                _yuitest_coverline("build/dom-screen/dom-screen.js", 542);
return true;
            } else {
                _yuitest_coverline("build/dom-screen/dom-screen.js", 544);
return false;
            }
            
        }
    },

    /**
     * Check if any part of this element is in the viewport
     * @method inViewportRegion
     * @for DOM
     * @param {HTMLElement} element The DOM element. 
     * @param {Boolean} all Should all of the node be inside the region
     * @param {Object} altRegion An object literal containing the region for this node if we already have the data (for performance e.g. DragDrop)
     * @return {Boolean} True if in region, false if not.
     */
    inViewportRegion: function(node, all, altRegion) {
        _yuitest_coverfunc("build/dom-screen/dom-screen.js", "inViewportRegion", 559);
_yuitest_coverline("build/dom-screen/dom-screen.js", 560);
return DOM.inRegion(node, DOM.viewportRegion(node), all, altRegion);
            
    },

    _getRegion: function(t, r, b, l) {
        _yuitest_coverfunc("build/dom-screen/dom-screen.js", "_getRegion", 564);
_yuitest_coverline("build/dom-screen/dom-screen.js", 565);
var region = {};

        _yuitest_coverline("build/dom-screen/dom-screen.js", 567);
region[TOP] = region[1] = t;
        _yuitest_coverline("build/dom-screen/dom-screen.js", 568);
region[LEFT] = region[0] = l;
        _yuitest_coverline("build/dom-screen/dom-screen.js", 569);
region[BOTTOM] = b;
        _yuitest_coverline("build/dom-screen/dom-screen.js", 570);
region[RIGHT] = r;
        _yuitest_coverline("build/dom-screen/dom-screen.js", 571);
region.width = region[RIGHT] - region[LEFT];
        _yuitest_coverline("build/dom-screen/dom-screen.js", 572);
region.height = region[BOTTOM] - region[TOP];

        _yuitest_coverline("build/dom-screen/dom-screen.js", 574);
return region;
    },

    /**
     * Returns an Object literal containing the following about the visible region of viewport: (top, right, bottom, left)
     * @method viewportRegion
     * @for DOM
     * @return {Object} Object literal containing the following about the visible region of the viewport: (top, right, bottom, left)
     */
    viewportRegion: function(node) {
        _yuitest_coverfunc("build/dom-screen/dom-screen.js", "viewportRegion", 583);
_yuitest_coverline("build/dom-screen/dom-screen.js", 584);
node = node || Y.config.doc.documentElement;
        _yuitest_coverline("build/dom-screen/dom-screen.js", 585);
var ret = false,
            scrollX,
            scrollY;

        _yuitest_coverline("build/dom-screen/dom-screen.js", 589);
if (node) {
            _yuitest_coverline("build/dom-screen/dom-screen.js", 590);
scrollX = DOM.docScrollX(node);
            _yuitest_coverline("build/dom-screen/dom-screen.js", 591);
scrollY = DOM.docScrollY(node);

            _yuitest_coverline("build/dom-screen/dom-screen.js", 593);
ret = DOM._getRegion(scrollY, // top
                DOM.winWidth(node) + scrollX, // right
                scrollY + DOM.winHeight(node), // bottom
                scrollX); // left
        }

        _yuitest_coverline("build/dom-screen/dom-screen.js", 599);
return ret;
    }
});
})(Y);


}, '3.7.3', {"requires": ["dom-base", "dom-style"]});
