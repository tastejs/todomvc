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
_yuitest_coverage["build/dd-scroll/dd-scroll.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/dd-scroll/dd-scroll.js",
    code: []
};
_yuitest_coverage["build/dd-scroll/dd-scroll.js"].code=["YUI.add('dd-scroll', function (Y, NAME) {","","","    /**","     * Base scroller class used to create the Plugin.DDNodeScroll and Plugin.DDWinScroll.","     * This class should not be called on it's own, it's designed to be a plugin.","     * @module dd","     * @submodule dd-scroll","     */","    /**","     * Base scroller class used to create the Plugin.DDNodeScroll and Plugin.DDWinScroll.","     * This class should not be called on it's own, it's designed to be a plugin.","     * @class Scroll","     * @extends Base","     * @namespace DD","     * @constructor","     */","","    var S = function() {","        S.superclass.constructor.apply(this, arguments);","","    },","    WS, NS,","    HOST = 'host',","    BUFFER = 'buffer',","    PARENT_SCROLL = 'parentScroll',","    WINDOW_SCROLL = 'windowScroll',","    SCROLL_TOP = 'scrollTop',","    SCROLL_LEFT = 'scrollLeft',","    OFFSET_WIDTH = 'offsetWidth',","    OFFSET_HEIGHT = 'offsetHeight';","","","    S.ATTRS = {","        /**","        * @attribute parentScroll","        * @description Internal config option to hold the node that we are scrolling. Should not be set by the developer.","        * @type Node","        */","        parentScroll: {","            value: false,","            setter: function(node) {","                if (node) {","                    return node;","                }","                return false;","            }","        },","        /**","        * @attribute buffer","        * @description The number of pixels from the edge of the screen to turn on scrolling. Default: 30","        * @type Number","        */","        buffer: {","            value: 30,","            validator: Y.Lang.isNumber","        },","        /**","        * @attribute scrollDelay","        * @description The number of milliseconds delay to pass to the auto scroller. Default: 235","        * @type Number","        */","        scrollDelay: {","            value: 235,","            validator: Y.Lang.isNumber","        },","        /**","        * @attribute host","        * @description The host we are plugged into.","        * @type Object","        */","        host: {","            value: null","        },","        /**","        * @attribute windowScroll","        * @description Turn on window scroll support, default: false","        * @type Boolean","        */","        windowScroll: {","            value: false,","            validator: Y.Lang.isBoolean","        },","        /**","        * @attribute vertical","        * @description Allow vertical scrolling, default: true.","        * @type Boolean","        */","        vertical: {","            value: true,","            validator: Y.Lang.isBoolean","        },","        /**","        * @attribute horizontal","        * @description Allow horizontal scrolling, default: true.","        * @type Boolean","        */","        horizontal: {","            value: true,","            validator: Y.Lang.isBoolean","        }","    };","","    Y.extend(S, Y.Base, {","        /**","        * @private","        * @property _scrolling","        * @description Tells if we are actively scrolling or not.","        * @type Boolean","        */","        _scrolling: null,","        /**","        * @private","        * @property _vpRegionCache","        * @description Cache of the Viewport dims.","        * @type Object","        */","        _vpRegionCache: null,","        /**","        * @private","        * @property _dimCache","        * @description Cache of the dragNode dims.","        * @type Object","        */","        _dimCache: null,","        /**","        * @private","        * @property _scrollTimer","        * @description Holder for the Timer object returned from Y.later.","        * @type {Y.later}","        */","        _scrollTimer: null,","        /**","        * @private","        * @method _getVPRegion","        * @description Sets the _vpRegionCache property with an Object containing the dims from the viewport.","        */","        _getVPRegion: function() {","            var r = {},","                n = this.get(PARENT_SCROLL),","            b = this.get(BUFFER),","            ws = this.get(WINDOW_SCROLL),","            xy = ((ws) ? [] : n.getXY()),","            w = ((ws) ? 'winWidth' : OFFSET_WIDTH),","            h = ((ws) ? 'winHeight' : OFFSET_HEIGHT),","            t = ((ws) ? n.get(SCROLL_TOP) : xy[1]),","            l = ((ws) ? n.get(SCROLL_LEFT) : xy[0]);","","            r = {","                top: t + b,","                right: (n.get(w) + l) - b,","                bottom: (n.get(h) + t) - b,","                left: l + b","            };","            this._vpRegionCache = r;","            return r;","        },","        initializer: function() {","            var h = this.get(HOST);","            h.after('drag:start', Y.bind(this.start, this));","            h.after('drag:end', Y.bind(this.end, this));","            h.on('drag:align', Y.bind(this.align, this));","","            //TODO - This doesn't work yet??","            Y.one('win').on('scroll', Y.bind(function() {","                this._vpRegionCache = null;","            }, this));","        },","        /**","        * @private","        * @method _checkWinScroll","        * @description Check to see if we need to fire the scroll timer. If scroll timer is running this will scroll the window.","        * @param {Boolean} move Should we move the window. From Y.later","        */","        _checkWinScroll: function(move) {","            var r = this._getVPRegion(),","                ho = this.get(HOST),","                ws = this.get(WINDOW_SCROLL),","                xy = ho.lastXY,","                scroll = false,","                b = this.get(BUFFER),","                win = this.get(PARENT_SCROLL),","                sTop = win.get(SCROLL_TOP),","                sLeft = win.get(SCROLL_LEFT),","                w = this._dimCache.w,","                h = this._dimCache.h,","                bottom = xy[1] + h,","                top = xy[1],","                right = xy[0] + w,","                left = xy[0],","                nt = top,","                nl = left,","                st = sTop,","                sl = sLeft;","","            if (this.get('horizontal')) {","                if (left <= r.left) {","                    scroll = true;","                    nl = xy[0] - ((ws) ? b : 0);","                    sl = sLeft - b;","                }","                if (right >= r.right) {","                    scroll = true;","                    nl = xy[0] + ((ws) ? b : 0);","                    sl = sLeft + b;","                }","            }","            if (this.get('vertical')) {","                if (bottom >= r.bottom) {","                    scroll = true;","                    nt = xy[1] + ((ws) ? b : 0);","                    st = sTop + b;","","                }","                if (top <= r.top) {","                    scroll = true;","                    nt = xy[1] - ((ws) ? b : 0);","                    st = sTop - b;","                }","            }","","            if (st < 0) {","                st = 0;","                nt = xy[1];","            }","","            if (sl < 0) {","                sl = 0;","                nl = xy[0];","            }","","            if (nt < 0) {","                nt = xy[1];","            }","            if (nl < 0) {","                nl = xy[0];","            }","            if (ho.con) {","                if (!ho.con.inRegion([nl + sl, nt + st])) {","                    move = false;","                }","            }","            if (move) {","                ho.actXY = [nl, nt];","                ho._alignNode([nl, nt], true); //We are srolling..","                xy = ho.actXY;","                ho.actXY = [nl, nt];","                ho._moveNode({ node: win, top: st, left: sl});","                if (!st && !sl) {","                    this._cancelScroll();","                }","            } else {","                if (scroll) {","                    this._initScroll();","                } else {","                    this._cancelScroll();","                }","            }","        },","        /**","        * @private","        * @method _initScroll","        * @description Cancel a previous scroll timer and init a new one.","        */","        _initScroll: function() {","            this._cancelScroll();","            this._scrollTimer = Y.Lang.later(this.get('scrollDelay'), this, this._checkWinScroll, [true], true);","","        },","        /**","        * @private","        * @method _cancelScroll","        * @description Cancel a currently running scroll timer.","        */","        _cancelScroll: function() {","            this._scrolling = false;","            if (this._scrollTimer) {","                this._scrollTimer.cancel();","                delete this._scrollTimer;","            }","        },","        /**","        * @method align","        * @description Called from the drag:align event to determine if we need to scroll.","        */","        align: function(e) {","            if (this._scrolling) {","                this._cancelScroll();","                e.preventDefault();","            }","            if (!this._scrolling) {","                this._checkWinScroll();","            }","        },","        /**","        * @private","        * @method _setDimCache","        * @description Set the cache of the dragNode dims.","        */","        _setDimCache: function() {","            var node = this.get(HOST).get('dragNode');","            this._dimCache = {","                h: node.get(OFFSET_HEIGHT),","                w: node.get(OFFSET_WIDTH)","            };","        },","        /**","        * @method start","        * @description Called from the drag:start event","        */","        start: function() {","            this._setDimCache();","        },","        /**","        * @method end","        * @description Called from the drag:end event","        */","        end: function() {","            this._dimCache = null;","            this._cancelScroll();","        }","    });","","    Y.namespace('Plugin');","","","    /**","     * Extends the Scroll class to make the window scroll while dragging.","     * @class DDWindowScroll","     * @extends Scroll","     * @namespace Plugin","     * @constructor","     */","    WS = function() {","        WS.superclass.constructor.apply(this, arguments);","    };","    WS.ATTRS = Y.merge(S.ATTRS, {","        /**","        * @attribute windowScroll","        * @description Turn on window scroll support, default: true","        * @type Boolean","        */","        windowScroll: {","            value: true,","            setter: function(scroll) {","                if (scroll) {","                    this.set(PARENT_SCROLL, Y.one('win'));","                }","                return scroll;","            }","        }","    });","    Y.extend(WS, S, {","        //Shouldn't have to do this..","        initializer: function() {","            this.set('windowScroll', this.get('windowScroll'));","        }","    });","    /**","    * @property NS","    * @default winscroll","    * @readonly","    * @protected","    * @static","    * @description The Scroll instance will be placed on the Drag instance under the winscroll namespace.","    * @type {String}","    */","    WS.NAME = WS.NS = 'winscroll';","    Y.Plugin.DDWinScroll = WS;","","","    /**","     * Extends the Scroll class to make a parent node scroll while dragging.","     * @class DDNodeScroll","     * @extends Scroll","     * @namespace Plugin","     * @constructor","     */","    NS = function() {","        NS.superclass.constructor.apply(this, arguments);","","    };","    NS.ATTRS = Y.merge(S.ATTRS, {","        /**","        * @attribute node","        * @description The node we want to scroll. Used to set the internal parentScroll attribute.","        * @type Node","        */","        node: {","            value: false,","            setter: function(node) {","                var n = Y.one(node);","                if (!n) {","                    if (node !== false) {","                        Y.error('DDNodeScroll: Invalid Node Given: ' + node);","                    }","                } else {","                    this.set(PARENT_SCROLL, n);","                }","                return n;","            }","        }","    });","    Y.extend(NS, S, {","        //Shouldn't have to do this..","        initializer: function() {","            this.set('node', this.get('node'));","        }","    });","    /**","    * @property NS","    * @default nodescroll","    * @readonly","    * @protected","    * @static","    * @description The NodeScroll instance will be placed on the Drag instance under the nodescroll namespace.","    * @type {String}","    */","    NS.NAME = NS.NS = 'nodescroll';","    Y.Plugin.DDNodeScroll = NS;","","    Y.DD.Scroll = S;","","","","","}, '3.7.3', {\"requires\": [\"dd-drag\"]});"];
_yuitest_coverage["build/dd-scroll/dd-scroll.js"].lines = {"1":0,"19":0,"20":0,"34":0,"43":0,"44":0,"46":0,"104":0,"139":0,"149":0,"155":0,"156":0,"159":0,"160":0,"161":0,"162":0,"165":0,"166":0,"176":0,"196":0,"197":0,"198":0,"199":0,"200":0,"202":0,"203":0,"204":0,"205":0,"208":0,"209":0,"210":0,"211":0,"212":0,"215":0,"216":0,"217":0,"218":0,"222":0,"223":0,"224":0,"227":0,"228":0,"229":0,"232":0,"233":0,"235":0,"236":0,"238":0,"239":0,"240":0,"243":0,"244":0,"245":0,"246":0,"247":0,"248":0,"249":0,"250":0,"253":0,"254":0,"256":0,"266":0,"267":0,"276":0,"277":0,"278":0,"279":0,"287":0,"288":0,"289":0,"291":0,"292":0,"301":0,"302":0,"312":0,"319":0,"320":0,"324":0,"334":0,"335":0,"337":0,"346":0,"347":0,"349":0,"353":0,"356":0,"368":0,"369":0,"379":0,"380":0,"383":0,"392":0,"393":0,"394":0,"395":0,"398":0,"400":0,"404":0,"407":0,"419":0,"420":0,"422":0};
_yuitest_coverage["build/dd-scroll/dd-scroll.js"].functions = {"S:19":0,"setter:42":0,"_getVPRegion:138":0,"(anonymous 2):165":0,"initializer:158":0,"_checkWinScroll:175":0,"_initScroll:265":0,"_cancelScroll:275":0,"align:286":0,"_setDimCache:300":0,"start:311":0,"end:318":0,"WS:334":0,"setter:345":0,"initializer:355":0,"NS:379":0,"setter:391":0,"initializer:406":0,"(anonymous 1):1":0};
_yuitest_coverage["build/dd-scroll/dd-scroll.js"].coveredLines = 102;
_yuitest_coverage["build/dd-scroll/dd-scroll.js"].coveredFunctions = 19;
_yuitest_coverline("build/dd-scroll/dd-scroll.js", 1);
YUI.add('dd-scroll', function (Y, NAME) {


    /**
     * Base scroller class used to create the Plugin.DDNodeScroll and Plugin.DDWinScroll.
     * This class should not be called on it's own, it's designed to be a plugin.
     * @module dd
     * @submodule dd-scroll
     */
    /**
     * Base scroller class used to create the Plugin.DDNodeScroll and Plugin.DDWinScroll.
     * This class should not be called on it's own, it's designed to be a plugin.
     * @class Scroll
     * @extends Base
     * @namespace DD
     * @constructor
     */

    _yuitest_coverfunc("build/dd-scroll/dd-scroll.js", "(anonymous 1)", 1);
_yuitest_coverline("build/dd-scroll/dd-scroll.js", 19);
var S = function() {
        _yuitest_coverfunc("build/dd-scroll/dd-scroll.js", "S", 19);
_yuitest_coverline("build/dd-scroll/dd-scroll.js", 20);
S.superclass.constructor.apply(this, arguments);

    },
    WS, NS,
    HOST = 'host',
    BUFFER = 'buffer',
    PARENT_SCROLL = 'parentScroll',
    WINDOW_SCROLL = 'windowScroll',
    SCROLL_TOP = 'scrollTop',
    SCROLL_LEFT = 'scrollLeft',
    OFFSET_WIDTH = 'offsetWidth',
    OFFSET_HEIGHT = 'offsetHeight';


    _yuitest_coverline("build/dd-scroll/dd-scroll.js", 34);
S.ATTRS = {
        /**
        * @attribute parentScroll
        * @description Internal config option to hold the node that we are scrolling. Should not be set by the developer.
        * @type Node
        */
        parentScroll: {
            value: false,
            setter: function(node) {
                _yuitest_coverfunc("build/dd-scroll/dd-scroll.js", "setter", 42);
_yuitest_coverline("build/dd-scroll/dd-scroll.js", 43);
if (node) {
                    _yuitest_coverline("build/dd-scroll/dd-scroll.js", 44);
return node;
                }
                _yuitest_coverline("build/dd-scroll/dd-scroll.js", 46);
return false;
            }
        },
        /**
        * @attribute buffer
        * @description The number of pixels from the edge of the screen to turn on scrolling. Default: 30
        * @type Number
        */
        buffer: {
            value: 30,
            validator: Y.Lang.isNumber
        },
        /**
        * @attribute scrollDelay
        * @description The number of milliseconds delay to pass to the auto scroller. Default: 235
        * @type Number
        */
        scrollDelay: {
            value: 235,
            validator: Y.Lang.isNumber
        },
        /**
        * @attribute host
        * @description The host we are plugged into.
        * @type Object
        */
        host: {
            value: null
        },
        /**
        * @attribute windowScroll
        * @description Turn on window scroll support, default: false
        * @type Boolean
        */
        windowScroll: {
            value: false,
            validator: Y.Lang.isBoolean
        },
        /**
        * @attribute vertical
        * @description Allow vertical scrolling, default: true.
        * @type Boolean
        */
        vertical: {
            value: true,
            validator: Y.Lang.isBoolean
        },
        /**
        * @attribute horizontal
        * @description Allow horizontal scrolling, default: true.
        * @type Boolean
        */
        horizontal: {
            value: true,
            validator: Y.Lang.isBoolean
        }
    };

    _yuitest_coverline("build/dd-scroll/dd-scroll.js", 104);
Y.extend(S, Y.Base, {
        /**
        * @private
        * @property _scrolling
        * @description Tells if we are actively scrolling or not.
        * @type Boolean
        */
        _scrolling: null,
        /**
        * @private
        * @property _vpRegionCache
        * @description Cache of the Viewport dims.
        * @type Object
        */
        _vpRegionCache: null,
        /**
        * @private
        * @property _dimCache
        * @description Cache of the dragNode dims.
        * @type Object
        */
        _dimCache: null,
        /**
        * @private
        * @property _scrollTimer
        * @description Holder for the Timer object returned from Y.later.
        * @type {Y.later}
        */
        _scrollTimer: null,
        /**
        * @private
        * @method _getVPRegion
        * @description Sets the _vpRegionCache property with an Object containing the dims from the viewport.
        */
        _getVPRegion: function() {
            _yuitest_coverfunc("build/dd-scroll/dd-scroll.js", "_getVPRegion", 138);
_yuitest_coverline("build/dd-scroll/dd-scroll.js", 139);
var r = {},
                n = this.get(PARENT_SCROLL),
            b = this.get(BUFFER),
            ws = this.get(WINDOW_SCROLL),
            xy = ((ws) ? [] : n.getXY()),
            w = ((ws) ? 'winWidth' : OFFSET_WIDTH),
            h = ((ws) ? 'winHeight' : OFFSET_HEIGHT),
            t = ((ws) ? n.get(SCROLL_TOP) : xy[1]),
            l = ((ws) ? n.get(SCROLL_LEFT) : xy[0]);

            _yuitest_coverline("build/dd-scroll/dd-scroll.js", 149);
r = {
                top: t + b,
                right: (n.get(w) + l) - b,
                bottom: (n.get(h) + t) - b,
                left: l + b
            };
            _yuitest_coverline("build/dd-scroll/dd-scroll.js", 155);
this._vpRegionCache = r;
            _yuitest_coverline("build/dd-scroll/dd-scroll.js", 156);
return r;
        },
        initializer: function() {
            _yuitest_coverfunc("build/dd-scroll/dd-scroll.js", "initializer", 158);
_yuitest_coverline("build/dd-scroll/dd-scroll.js", 159);
var h = this.get(HOST);
            _yuitest_coverline("build/dd-scroll/dd-scroll.js", 160);
h.after('drag:start', Y.bind(this.start, this));
            _yuitest_coverline("build/dd-scroll/dd-scroll.js", 161);
h.after('drag:end', Y.bind(this.end, this));
            _yuitest_coverline("build/dd-scroll/dd-scroll.js", 162);
h.on('drag:align', Y.bind(this.align, this));

            //TODO - This doesn't work yet??
            _yuitest_coverline("build/dd-scroll/dd-scroll.js", 165);
Y.one('win').on('scroll', Y.bind(function() {
                _yuitest_coverfunc("build/dd-scroll/dd-scroll.js", "(anonymous 2)", 165);
_yuitest_coverline("build/dd-scroll/dd-scroll.js", 166);
this._vpRegionCache = null;
            }, this));
        },
        /**
        * @private
        * @method _checkWinScroll
        * @description Check to see if we need to fire the scroll timer. If scroll timer is running this will scroll the window.
        * @param {Boolean} move Should we move the window. From Y.later
        */
        _checkWinScroll: function(move) {
            _yuitest_coverfunc("build/dd-scroll/dd-scroll.js", "_checkWinScroll", 175);
_yuitest_coverline("build/dd-scroll/dd-scroll.js", 176);
var r = this._getVPRegion(),
                ho = this.get(HOST),
                ws = this.get(WINDOW_SCROLL),
                xy = ho.lastXY,
                scroll = false,
                b = this.get(BUFFER),
                win = this.get(PARENT_SCROLL),
                sTop = win.get(SCROLL_TOP),
                sLeft = win.get(SCROLL_LEFT),
                w = this._dimCache.w,
                h = this._dimCache.h,
                bottom = xy[1] + h,
                top = xy[1],
                right = xy[0] + w,
                left = xy[0],
                nt = top,
                nl = left,
                st = sTop,
                sl = sLeft;

            _yuitest_coverline("build/dd-scroll/dd-scroll.js", 196);
if (this.get('horizontal')) {
                _yuitest_coverline("build/dd-scroll/dd-scroll.js", 197);
if (left <= r.left) {
                    _yuitest_coverline("build/dd-scroll/dd-scroll.js", 198);
scroll = true;
                    _yuitest_coverline("build/dd-scroll/dd-scroll.js", 199);
nl = xy[0] - ((ws) ? b : 0);
                    _yuitest_coverline("build/dd-scroll/dd-scroll.js", 200);
sl = sLeft - b;
                }
                _yuitest_coverline("build/dd-scroll/dd-scroll.js", 202);
if (right >= r.right) {
                    _yuitest_coverline("build/dd-scroll/dd-scroll.js", 203);
scroll = true;
                    _yuitest_coverline("build/dd-scroll/dd-scroll.js", 204);
nl = xy[0] + ((ws) ? b : 0);
                    _yuitest_coverline("build/dd-scroll/dd-scroll.js", 205);
sl = sLeft + b;
                }
            }
            _yuitest_coverline("build/dd-scroll/dd-scroll.js", 208);
if (this.get('vertical')) {
                _yuitest_coverline("build/dd-scroll/dd-scroll.js", 209);
if (bottom >= r.bottom) {
                    _yuitest_coverline("build/dd-scroll/dd-scroll.js", 210);
scroll = true;
                    _yuitest_coverline("build/dd-scroll/dd-scroll.js", 211);
nt = xy[1] + ((ws) ? b : 0);
                    _yuitest_coverline("build/dd-scroll/dd-scroll.js", 212);
st = sTop + b;

                }
                _yuitest_coverline("build/dd-scroll/dd-scroll.js", 215);
if (top <= r.top) {
                    _yuitest_coverline("build/dd-scroll/dd-scroll.js", 216);
scroll = true;
                    _yuitest_coverline("build/dd-scroll/dd-scroll.js", 217);
nt = xy[1] - ((ws) ? b : 0);
                    _yuitest_coverline("build/dd-scroll/dd-scroll.js", 218);
st = sTop - b;
                }
            }

            _yuitest_coverline("build/dd-scroll/dd-scroll.js", 222);
if (st < 0) {
                _yuitest_coverline("build/dd-scroll/dd-scroll.js", 223);
st = 0;
                _yuitest_coverline("build/dd-scroll/dd-scroll.js", 224);
nt = xy[1];
            }

            _yuitest_coverline("build/dd-scroll/dd-scroll.js", 227);
if (sl < 0) {
                _yuitest_coverline("build/dd-scroll/dd-scroll.js", 228);
sl = 0;
                _yuitest_coverline("build/dd-scroll/dd-scroll.js", 229);
nl = xy[0];
            }

            _yuitest_coverline("build/dd-scroll/dd-scroll.js", 232);
if (nt < 0) {
                _yuitest_coverline("build/dd-scroll/dd-scroll.js", 233);
nt = xy[1];
            }
            _yuitest_coverline("build/dd-scroll/dd-scroll.js", 235);
if (nl < 0) {
                _yuitest_coverline("build/dd-scroll/dd-scroll.js", 236);
nl = xy[0];
            }
            _yuitest_coverline("build/dd-scroll/dd-scroll.js", 238);
if (ho.con) {
                _yuitest_coverline("build/dd-scroll/dd-scroll.js", 239);
if (!ho.con.inRegion([nl + sl, nt + st])) {
                    _yuitest_coverline("build/dd-scroll/dd-scroll.js", 240);
move = false;
                }
            }
            _yuitest_coverline("build/dd-scroll/dd-scroll.js", 243);
if (move) {
                _yuitest_coverline("build/dd-scroll/dd-scroll.js", 244);
ho.actXY = [nl, nt];
                _yuitest_coverline("build/dd-scroll/dd-scroll.js", 245);
ho._alignNode([nl, nt], true); //We are srolling..
                _yuitest_coverline("build/dd-scroll/dd-scroll.js", 246);
xy = ho.actXY;
                _yuitest_coverline("build/dd-scroll/dd-scroll.js", 247);
ho.actXY = [nl, nt];
                _yuitest_coverline("build/dd-scroll/dd-scroll.js", 248);
ho._moveNode({ node: win, top: st, left: sl});
                _yuitest_coverline("build/dd-scroll/dd-scroll.js", 249);
if (!st && !sl) {
                    _yuitest_coverline("build/dd-scroll/dd-scroll.js", 250);
this._cancelScroll();
                }
            } else {
                _yuitest_coverline("build/dd-scroll/dd-scroll.js", 253);
if (scroll) {
                    _yuitest_coverline("build/dd-scroll/dd-scroll.js", 254);
this._initScroll();
                } else {
                    _yuitest_coverline("build/dd-scroll/dd-scroll.js", 256);
this._cancelScroll();
                }
            }
        },
        /**
        * @private
        * @method _initScroll
        * @description Cancel a previous scroll timer and init a new one.
        */
        _initScroll: function() {
            _yuitest_coverfunc("build/dd-scroll/dd-scroll.js", "_initScroll", 265);
_yuitest_coverline("build/dd-scroll/dd-scroll.js", 266);
this._cancelScroll();
            _yuitest_coverline("build/dd-scroll/dd-scroll.js", 267);
this._scrollTimer = Y.Lang.later(this.get('scrollDelay'), this, this._checkWinScroll, [true], true);

        },
        /**
        * @private
        * @method _cancelScroll
        * @description Cancel a currently running scroll timer.
        */
        _cancelScroll: function() {
            _yuitest_coverfunc("build/dd-scroll/dd-scroll.js", "_cancelScroll", 275);
_yuitest_coverline("build/dd-scroll/dd-scroll.js", 276);
this._scrolling = false;
            _yuitest_coverline("build/dd-scroll/dd-scroll.js", 277);
if (this._scrollTimer) {
                _yuitest_coverline("build/dd-scroll/dd-scroll.js", 278);
this._scrollTimer.cancel();
                _yuitest_coverline("build/dd-scroll/dd-scroll.js", 279);
delete this._scrollTimer;
            }
        },
        /**
        * @method align
        * @description Called from the drag:align event to determine if we need to scroll.
        */
        align: function(e) {
            _yuitest_coverfunc("build/dd-scroll/dd-scroll.js", "align", 286);
_yuitest_coverline("build/dd-scroll/dd-scroll.js", 287);
if (this._scrolling) {
                _yuitest_coverline("build/dd-scroll/dd-scroll.js", 288);
this._cancelScroll();
                _yuitest_coverline("build/dd-scroll/dd-scroll.js", 289);
e.preventDefault();
            }
            _yuitest_coverline("build/dd-scroll/dd-scroll.js", 291);
if (!this._scrolling) {
                _yuitest_coverline("build/dd-scroll/dd-scroll.js", 292);
this._checkWinScroll();
            }
        },
        /**
        * @private
        * @method _setDimCache
        * @description Set the cache of the dragNode dims.
        */
        _setDimCache: function() {
            _yuitest_coverfunc("build/dd-scroll/dd-scroll.js", "_setDimCache", 300);
_yuitest_coverline("build/dd-scroll/dd-scroll.js", 301);
var node = this.get(HOST).get('dragNode');
            _yuitest_coverline("build/dd-scroll/dd-scroll.js", 302);
this._dimCache = {
                h: node.get(OFFSET_HEIGHT),
                w: node.get(OFFSET_WIDTH)
            };
        },
        /**
        * @method start
        * @description Called from the drag:start event
        */
        start: function() {
            _yuitest_coverfunc("build/dd-scroll/dd-scroll.js", "start", 311);
_yuitest_coverline("build/dd-scroll/dd-scroll.js", 312);
this._setDimCache();
        },
        /**
        * @method end
        * @description Called from the drag:end event
        */
        end: function() {
            _yuitest_coverfunc("build/dd-scroll/dd-scroll.js", "end", 318);
_yuitest_coverline("build/dd-scroll/dd-scroll.js", 319);
this._dimCache = null;
            _yuitest_coverline("build/dd-scroll/dd-scroll.js", 320);
this._cancelScroll();
        }
    });

    _yuitest_coverline("build/dd-scroll/dd-scroll.js", 324);
Y.namespace('Plugin');


    /**
     * Extends the Scroll class to make the window scroll while dragging.
     * @class DDWindowScroll
     * @extends Scroll
     * @namespace Plugin
     * @constructor
     */
    _yuitest_coverline("build/dd-scroll/dd-scroll.js", 334);
WS = function() {
        _yuitest_coverfunc("build/dd-scroll/dd-scroll.js", "WS", 334);
_yuitest_coverline("build/dd-scroll/dd-scroll.js", 335);
WS.superclass.constructor.apply(this, arguments);
    };
    _yuitest_coverline("build/dd-scroll/dd-scroll.js", 337);
WS.ATTRS = Y.merge(S.ATTRS, {
        /**
        * @attribute windowScroll
        * @description Turn on window scroll support, default: true
        * @type Boolean
        */
        windowScroll: {
            value: true,
            setter: function(scroll) {
                _yuitest_coverfunc("build/dd-scroll/dd-scroll.js", "setter", 345);
_yuitest_coverline("build/dd-scroll/dd-scroll.js", 346);
if (scroll) {
                    _yuitest_coverline("build/dd-scroll/dd-scroll.js", 347);
this.set(PARENT_SCROLL, Y.one('win'));
                }
                _yuitest_coverline("build/dd-scroll/dd-scroll.js", 349);
return scroll;
            }
        }
    });
    _yuitest_coverline("build/dd-scroll/dd-scroll.js", 353);
Y.extend(WS, S, {
        //Shouldn't have to do this..
        initializer: function() {
            _yuitest_coverfunc("build/dd-scroll/dd-scroll.js", "initializer", 355);
_yuitest_coverline("build/dd-scroll/dd-scroll.js", 356);
this.set('windowScroll', this.get('windowScroll'));
        }
    });
    /**
    * @property NS
    * @default winscroll
    * @readonly
    * @protected
    * @static
    * @description The Scroll instance will be placed on the Drag instance under the winscroll namespace.
    * @type {String}
    */
    _yuitest_coverline("build/dd-scroll/dd-scroll.js", 368);
WS.NAME = WS.NS = 'winscroll';
    _yuitest_coverline("build/dd-scroll/dd-scroll.js", 369);
Y.Plugin.DDWinScroll = WS;


    /**
     * Extends the Scroll class to make a parent node scroll while dragging.
     * @class DDNodeScroll
     * @extends Scroll
     * @namespace Plugin
     * @constructor
     */
    _yuitest_coverline("build/dd-scroll/dd-scroll.js", 379);
NS = function() {
        _yuitest_coverfunc("build/dd-scroll/dd-scroll.js", "NS", 379);
_yuitest_coverline("build/dd-scroll/dd-scroll.js", 380);
NS.superclass.constructor.apply(this, arguments);

    };
    _yuitest_coverline("build/dd-scroll/dd-scroll.js", 383);
NS.ATTRS = Y.merge(S.ATTRS, {
        /**
        * @attribute node
        * @description The node we want to scroll. Used to set the internal parentScroll attribute.
        * @type Node
        */
        node: {
            value: false,
            setter: function(node) {
                _yuitest_coverfunc("build/dd-scroll/dd-scroll.js", "setter", 391);
_yuitest_coverline("build/dd-scroll/dd-scroll.js", 392);
var n = Y.one(node);
                _yuitest_coverline("build/dd-scroll/dd-scroll.js", 393);
if (!n) {
                    _yuitest_coverline("build/dd-scroll/dd-scroll.js", 394);
if (node !== false) {
                        _yuitest_coverline("build/dd-scroll/dd-scroll.js", 395);
Y.error('DDNodeScroll: Invalid Node Given: ' + node);
                    }
                } else {
                    _yuitest_coverline("build/dd-scroll/dd-scroll.js", 398);
this.set(PARENT_SCROLL, n);
                }
                _yuitest_coverline("build/dd-scroll/dd-scroll.js", 400);
return n;
            }
        }
    });
    _yuitest_coverline("build/dd-scroll/dd-scroll.js", 404);
Y.extend(NS, S, {
        //Shouldn't have to do this..
        initializer: function() {
            _yuitest_coverfunc("build/dd-scroll/dd-scroll.js", "initializer", 406);
_yuitest_coverline("build/dd-scroll/dd-scroll.js", 407);
this.set('node', this.get('node'));
        }
    });
    /**
    * @property NS
    * @default nodescroll
    * @readonly
    * @protected
    * @static
    * @description The NodeScroll instance will be placed on the Drag instance under the nodescroll namespace.
    * @type {String}
    */
    _yuitest_coverline("build/dd-scroll/dd-scroll.js", 419);
NS.NAME = NS.NS = 'nodescroll';
    _yuitest_coverline("build/dd-scroll/dd-scroll.js", 420);
Y.Plugin.DDNodeScroll = NS;

    _yuitest_coverline("build/dd-scroll/dd-scroll.js", 422);
Y.DD.Scroll = S;




}, '3.7.3', {"requires": ["dd-drag"]});
