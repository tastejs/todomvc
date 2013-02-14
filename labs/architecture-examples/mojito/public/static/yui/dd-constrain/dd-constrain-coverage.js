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
_yuitest_coverage["build/dd-constrain/dd-constrain.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/dd-constrain/dd-constrain.js",
    code: []
};
_yuitest_coverage["build/dd-constrain/dd-constrain.js"].code=["YUI.add('dd-constrain', function (Y, NAME) {","","","    /**","     * The Drag & Drop Utility allows you to create a draggable interface efficiently,","     * buffering you from browser-level abnormalities and enabling you to focus on the interesting","     * logic surrounding your particular implementation. This component enables you to create a","     * variety of standard draggable objects with just a few lines of code and then,","     * using its extensive API, add your own specific implementation logic.","     * @module dd","     * @main dd","     * @submodule dd-constrain","     */","    /**","     * Plugin for the dd-drag module to add the constraining methods to it.","     * It supports constraining to a node or viewport. It supports tick based moves and XY axis constraints.","     * @class DDConstrained","     * @extends Base","     * @constructor","     * @namespace Plugin","     */","","    var DRAG_NODE = 'dragNode',","        OFFSET_HEIGHT = 'offsetHeight',","        OFFSET_WIDTH = 'offsetWidth',","        HOST = 'host',","        TICK_X_ARRAY = 'tickXArray',","        TICK_Y_ARRAY = 'tickYArray',","        DDM = Y.DD.DDM,","        TOP = 'top',","        RIGHT = 'right',","        BOTTOM = 'bottom',","        LEFT = 'left',","        VIEW = 'view',","        proto = null,","","        /**","        * @event drag:tickAlignX","        * @description Fires when this node is aligned with the tickX value.","        * @param {EventFacade} event An Event Facade object","        * @type {CustomEvent}","        */","        EV_TICK_ALIGN_X = 'drag:tickAlignX',","","        /**","        * @event drag:tickAlignY","        * @description Fires when this node is aligned with the tickY value.","        * @param {EventFacade} event An Event Facade object","        * @type {CustomEvent}","        */","        EV_TICK_ALIGN_Y = 'drag:tickAlignY',","","        C = function() {","            this._lazyAddAttrs = false;","            C.superclass.constructor.apply(this, arguments);","        };","","    C.NAME = 'ddConstrained';","    /**","    * @property NS","    * @default con","    * @readonly","    * @protected","    * @static","    * @description The Constrained instance will be placed on the Drag instance under the con namespace.","    * @type {String}","*/","    C.NS = 'con';","","    C.ATTRS = {","        host: {","        },","        /**","        * @attribute stickX","        * @description Stick the drag movement to the X-Axis. Default: false","        * @type Boolean","        */","        stickX: {","            value: false","        },","        /**","        * @attribute stickY","        * @description Stick the drag movement to the Y-Axis","        * @type Boolean","        */","        stickY: {","            value: false","        },","        /**","        * @attribute tickX","        * @description The X tick offset the drag node should snap to on each drag move. False for no ticks. Default: false","        * @type Number/false","        */","        tickX: {","            value: false","        },","        /**","        * @attribute tickY","        * @description The Y tick offset the drag node should snap to on each drag move. False for no ticks. Default: false","        * @type Number/false","        */","        tickY: {","            value: false","        },","        /**","        * @attribute tickXArray","        * @description An array of page coordinates to use as X ticks for drag movement.","        * @type Array","        */","        tickXArray: {","            value: false","        },","        /**","        * @attribute tickYArray","        * @description An array of page coordinates to use as Y ticks for drag movement.","        * @type Array","        */","        tickYArray: {","            value: false","        },","        /**","        * CSS style string for the gutter of a region (supports negative values): '5 0'","        * (sets top and bottom to 5px, left and right to 0px), '1 2 3 4' (top 1px, right 2px, bottom 3px, left 4px)","        * @attribute gutter","        * @type String","        */","        gutter: {","            value: '0',","            setter: function(gutter) {","                return Y.DD.DDM.cssSizestoObject(gutter);","            }","        },","        /**","        * @attribute constrain","        * @description Will attempt to constrain the drag node to the boundaries. Arguments:<br>","        * 'view': Contrain to Viewport<br>","        * '#selector_string': Constrain to this node<br>","        * '{Region Object}': An Object Literal containing a valid region (top, right, bottom, left) of page positions","        * @type {String/Object/Node}","        */","        constrain: {","            value: VIEW,","            setter: function(con) {","                var node = Y.one(con);","                if (node) {","                    con = node;","                }","                return con;","            }","        },","        /**","        * @deprecated","        * @attribute constrain2region","        * @description An Object Literal containing a valid region (top, right, bottom, left) of page positions to constrain the drag node to.","        * @type Object","        */","        constrain2region: {","            setter: function(r) {","                return this.set('constrain', r);","            }","        },","        /**","        * @deprecated","        * @attribute constrain2node","        * @description Will attempt to constrain the drag node to the boundaries of this node.","        * @type Object","        */","        constrain2node: {","            setter: function(n) {","                return this.set('constrain', Y.one(n));","            }","        },","        /**","        * @deprecated","        * @attribute constrain2view","        * @description Will attempt to constrain the drag node to the boundaries of the viewport region.","        * @type Object","        */","        constrain2view: {","            setter: function() {","                return this.set('constrain', VIEW);","            }","        },","        /**","        * @attribute cacheRegion","        * @description Should the region be cached for performace. Default: true","        * @type Boolean","        */","        cacheRegion: {","            value: true","        }","    };","","    proto = {","        _lastTickXFired: null,","        _lastTickYFired: null,","","        initializer: function() {","            this._createEvents();","","            this._eventHandles = [","                this.get(HOST).on('drag:end', Y.bind(this._handleEnd, this)),","                this.get(HOST).on('drag:start', Y.bind(this._handleStart, this)),","                this.get(HOST).after('drag:align', Y.bind(this.align, this)),","                this.get(HOST).after('drag:drag', Y.bind(this.drag, this))","            ];","        },","        destructor: function() {","            Y.each(","                this._eventHandles,","                function(handle) {","                    handle.detach();","                }","            );","","            this._eventHandles.length = 0;","        },","        /**","        * @private","        * @method _createEvents","        * @description This method creates all the events for this Event Target and publishes them so we get Event Bubbling.","        */","        _createEvents: function() {","            var ev = [","                EV_TICK_ALIGN_X,","                EV_TICK_ALIGN_Y","            ];","","            Y.each(ev, function(v) {","                this.publish(v, {","                    type: v,","                    emitFacade: true,","                    bubbles: true,","                    queuable: false,","                    prefix: 'drag'","                });","            }, this);","        },","        /**","        * @private","        * @method _handleEnd","        * @description Fires on drag:end","        */","        _handleEnd: function() {","            this._lastTickYFired = null;","            this._lastTickXFired = null;","        },","        /**","        * @private","        * @method _handleStart","        * @description Fires on drag:start and clears the _regionCache","        */","        _handleStart: function() {","            this.resetCache();","        },","        /**","        * @private","        * @property _regionCache","        * @description Store a cache of the region that we are constraining to","        * @type Object","        */","        _regionCache: null,","        /**","        * @private","        * @method _cacheRegion","        * @description Get's the region and caches it, called from window.resize and when the cache is null","        */","        _cacheRegion: function() {","            this._regionCache = this.get('constrain').get('region');","        },","        /**","        * @method resetCache","        * @description Reset the internal region cache.","        */","        resetCache: function() {","            this._regionCache = null;","        },","        /**","        * @private","        * @method _getConstraint","        * @description Standardizes the 'constraint' attribute","        */","        _getConstraint: function() {","            var con = this.get('constrain'),","                g = this.get('gutter'),","                region;","","            if (con) {","                if (con instanceof Y.Node) {","                    if (!this._regionCache) {","                        this._eventHandles.push(Y.on('resize', Y.bind(this._cacheRegion, this), Y.config.win));","                        this._cacheRegion();","                    }","                    region = Y.clone(this._regionCache);","                    if (!this.get('cacheRegion')) {","                        this.resetCache();","                    }","                } else if (Y.Lang.isObject(con)) {","                    region = Y.clone(con);","                }","            }","            if (!con || !region) {","                con = VIEW;","            }","            if (con === VIEW) {","                region = this.get(HOST).get(DRAG_NODE).get('viewportRegion');","            }","","            Y.each(g, function(i, n) {","                if ((n === RIGHT) || (n === BOTTOM)) {","                    region[n] -= i;","                } else {","                    region[n] += i;","                }","            });","            return region;","        },","","        /**","        * @method getRegion","        * @description Get the active region: viewport, node, custom region","        * @param {Boolean} inc Include the node's height and width","        * @return {Object} The active region.","        */","        getRegion: function(inc) {","            var r = {}, oh = null, ow = null,","                host = this.get(HOST);","","            r = this._getConstraint();","","            if (inc) {","                oh = host.get(DRAG_NODE).get(OFFSET_HEIGHT);","                ow = host.get(DRAG_NODE).get(OFFSET_WIDTH);","                r[RIGHT] = r[RIGHT] - ow;","                r[BOTTOM] = r[BOTTOM] - oh;","            }","            return r;","        },","        /**","        * @private","        * @method _checkRegion","        * @description Check if xy is inside a given region, if not change to it be inside.","        * @param {Array} _xy The XY to check if it's in the current region, if it isn't","        * inside the region, it will reset the xy array to be inside the region.","        * @return {Array} The new XY that is inside the region","        */","        _checkRegion: function(_xy) {","            var oxy = _xy,","                r = this.getRegion(),","                host = this.get(HOST),","                oh = host.get(DRAG_NODE).get(OFFSET_HEIGHT),","                ow = host.get(DRAG_NODE).get(OFFSET_WIDTH);","","                if (oxy[1] > (r[BOTTOM] - oh)) {","                    _xy[1] = (r[BOTTOM] - oh);","                }","                if (r[TOP] > oxy[1]) {","                    _xy[1] = r[TOP];","","                }","                if (oxy[0] > (r[RIGHT] - ow)) {","                    _xy[0] = (r[RIGHT] - ow);","                }","                if (r[LEFT] > oxy[0]) {","                    _xy[0] = r[LEFT];","                }","","            return _xy;","        },","        /**","        * @method inRegion","        * @description Checks if the XY passed or the dragNode is inside the active region.","        * @param {Array} xy Optional XY to check, if not supplied this.get('dragNode').getXY() is used.","        * @return {Boolean} True if the XY is inside the region, false otherwise.","        */","        inRegion: function(xy) {","            xy = xy || this.get(HOST).get(DRAG_NODE).getXY();","","            var _xy = this._checkRegion([xy[0], xy[1]]),","                inside = false;","                if ((xy[0] === _xy[0]) && (xy[1] === _xy[1])) {","                    inside = true;","                }","            return inside;","        },","        /**","        * @method align","        * @description Modifies the Drag.actXY method from the after drag:align event. This is where the constraining happens.","        */","        align: function() {","            var host = this.get(HOST),","                _xy = [host.actXY[0], host.actXY[1]],","                r = this.getRegion(true);","","            if (this.get('stickX')) {","                _xy[1] = (host.startXY[1] - host.deltaXY[1]);","            }","            if (this.get('stickY')) {","                _xy[0] = (host.startXY[0] - host.deltaXY[0]);","            }","","            if (r) {","                _xy = this._checkRegion(_xy);","            }","","            _xy = this._checkTicks(_xy, r);","","            host.actXY = _xy;","        },","        /**","        * @method drag","        * @description Fires after drag:drag. Handle the tickX and tickX align events.","        */","        drag: function() {","            var host = this.get(HOST),","                xt = this.get('tickX'),","                yt = this.get('tickY'),","                _xy = [host.actXY[0], host.actXY[1]];","","            if ((Y.Lang.isNumber(xt) || this.get(TICK_X_ARRAY)) && (this._lastTickXFired !== _xy[0])) {","                this._tickAlignX();","                this._lastTickXFired = _xy[0];","            }","","            if ((Y.Lang.isNumber(yt) || this.get(TICK_Y_ARRAY)) && (this._lastTickYFired !== _xy[1])) {","                this._tickAlignY();","                this._lastTickYFired = _xy[1];","            }","        },","        /**","        * @private","        * @method _checkTicks","        * @description This method delegates the proper helper method for tick calculations","        * @param {Array} xy The XY coords for the Drag","        * @param {Object} r The optional region that we are bound to.","        * @return {Array} The calced XY coords","        */","        _checkTicks: function(xy, r) {","            var host = this.get(HOST),","                lx = (host.startXY[0] - host.deltaXY[0]),","                ly = (host.startXY[1] - host.deltaXY[1]),","                xt = this.get('tickX'),","                yt = this.get('tickY');","                if (xt && !this.get(TICK_X_ARRAY)) {","                    xy[0] = DDM._calcTicks(xy[0], lx, xt, r[LEFT], r[RIGHT]);","                }","                if (yt && !this.get(TICK_Y_ARRAY)) {","                    xy[1] = DDM._calcTicks(xy[1], ly, yt, r[TOP], r[BOTTOM]);","                }","                if (this.get(TICK_X_ARRAY)) {","                    xy[0] = DDM._calcTickArray(xy[0], this.get(TICK_X_ARRAY), r[LEFT], r[RIGHT]);","                }","                if (this.get(TICK_Y_ARRAY)) {","                    xy[1] = DDM._calcTickArray(xy[1], this.get(TICK_Y_ARRAY), r[TOP], r[BOTTOM]);","                }","","            return xy;","        },","        /**","        * @private","        * @method _tickAlignX","        * @description Fires when the actXY[0] reach a new value respecting the tickX gap.","        */","        _tickAlignX: function() {","            this.fire(EV_TICK_ALIGN_X);","        },","        /**","        * @private","        * @method _tickAlignY","        * @description Fires when the actXY[1] reach a new value respecting the tickY gap.","        */","        _tickAlignY: function() {","            this.fire(EV_TICK_ALIGN_Y);","        }","    };","","    Y.namespace('Plugin');","    Y.extend(C, Y.Base, proto);","    Y.Plugin.DDConstrained = C;","","    Y.mix(DDM, {","        /**","        * @for DDM","        * @namespace DD","        * @private","        * @method _calcTicks","        * @description Helper method to calculate the tick offsets for a given position","        * @param {Number} pos The current X or Y position","        * @param {Number} start The start X or Y position","        * @param {Number} tick The X or Y tick increment","        * @param {Number} off1 The min offset that we can't pass (region)","        * @param {Number} off2 The max offset that we can't pass (region)","        * @return {Number} The new position based on the tick calculation","        */","        _calcTicks: function(pos, start, tick, off1, off2) {","            var ix = ((pos - start) / tick),","                min = Math.floor(ix),","                max = Math.ceil(ix);","                if ((min !== 0) || (max !== 0)) {","                    if ((ix >= min) && (ix <= max)) {","                        pos = (start + (tick * min));","                        if (off1 && off2) {","                            if (pos < off1) {","                                pos = (start + (tick * (min + 1)));","                            }","                            if (pos > off2) {","                                pos = (start + (tick * (min - 1)));","                            }","                        }","                    }","                }","                return pos;","        },","        /**","        * @for DDM","        * @namespace DD","        * @private","        * @method _calcTickArray","        * @description This method is used with the tickXArray and tickYArray config options","        * @param {Number} pos The current X or Y position","        * @param {Number} ticks The array containing our custom tick positions.","        * @param {Number} off1 The min offset that we can't pass (region)","        * @param {Number} off2 The max offset that we can't pass (region)","        * @return The tick position","        */","        _calcTickArray: function(pos, ticks, off1, off2) {","            var i = 0, len = ticks.length, next = 0,","                diff1, diff2, ret;","","            if (!ticks || (ticks.length === 0)) {","                return pos;","            }","            if (ticks[0] >= pos) {","                return ticks[0];","            }","","            for (i = 0; i < len; i++) {","                next = (i + 1);","                if (ticks[next] && ticks[next] >= pos) {","                    diff1 = pos - ticks[i];","                    diff2 = ticks[next] - pos;","                    ret = (diff2 > diff1) ? ticks[i] : ticks[next];","                    if (off1 && off2) {","                        if (ret > off2) {","                            if (ticks[i]) {","                                ret = ticks[i];","                            } else {","                                ret = ticks[len - 1];","                            }","                        }","                    }","                    return ret;","                }","","            }","            return ticks[ticks.length - 1];","        }","    });","","","","}, '3.7.3', {\"requires\": [\"dd-drag\"]});"];
_yuitest_coverage["build/dd-constrain/dd-constrain.js"].lines = {"1":0,"23":0,"54":0,"55":0,"58":0,"68":0,"70":0,"130":0,"144":0,"145":0,"146":0,"148":0,"159":0,"170":0,"181":0,"194":0,"199":0,"201":0,"209":0,"212":0,"216":0,"224":0,"229":0,"230":0,"245":0,"246":0,"254":0,"269":0,"276":0,"284":0,"288":0,"289":0,"290":0,"291":0,"292":0,"294":0,"295":0,"296":0,"298":0,"299":0,"302":0,"303":0,"305":0,"306":0,"309":0,"310":0,"311":0,"313":0,"316":0,"326":0,"329":0,"331":0,"332":0,"333":0,"334":0,"335":0,"337":0,"348":0,"354":0,"355":0,"357":0,"358":0,"361":0,"362":0,"364":0,"365":0,"368":0,"377":0,"379":0,"381":0,"382":0,"384":0,"391":0,"395":0,"396":0,"398":0,"399":0,"402":0,"403":0,"406":0,"408":0,"415":0,"420":0,"421":0,"422":0,"425":0,"426":0,"427":0,"439":0,"444":0,"445":0,"447":0,"448":0,"450":0,"451":0,"453":0,"454":0,"457":0,"465":0,"473":0,"477":0,"478":0,"479":0,"481":0,"496":0,"499":0,"500":0,"501":0,"502":0,"503":0,"504":0,"506":0,"507":0,"512":0,"527":0,"530":0,"531":0,"533":0,"534":0,"537":0,"538":0,"539":0,"540":0,"541":0,"542":0,"543":0,"544":0,"545":0,"546":0,"548":0,"552":0,"556":0};
_yuitest_coverage["build/dd-constrain/dd-constrain.js"].functions = {"C:53":0,"setter:129":0,"setter:143":0,"setter:158":0,"setter:169":0,"setter:180":0,"initializer:198":0,"(anonymous 2):211":0,"destructor:208":0,"(anonymous 3):229":0,"_createEvents:223":0,"_handleEnd:244":0,"_handleStart:253":0,"_cacheRegion:268":0,"resetCache:275":0,"(anonymous 4):309":0,"_getConstraint:283":0,"getRegion:325":0,"_checkRegion:347":0,"inRegion:376":0,"align:390":0,"drag:414":0,"_checkTicks:438":0,"_tickAlignX:464":0,"_tickAlignY:472":0,"_calcTicks:495":0,"_calcTickArray:526":0,"(anonymous 1):1":0};
_yuitest_coverage["build/dd-constrain/dd-constrain.js"].coveredLines = 132;
_yuitest_coverage["build/dd-constrain/dd-constrain.js"].coveredFunctions = 28;
_yuitest_coverline("build/dd-constrain/dd-constrain.js", 1);
YUI.add('dd-constrain', function (Y, NAME) {


    /**
     * The Drag & Drop Utility allows you to create a draggable interface efficiently,
     * buffering you from browser-level abnormalities and enabling you to focus on the interesting
     * logic surrounding your particular implementation. This component enables you to create a
     * variety of standard draggable objects with just a few lines of code and then,
     * using its extensive API, add your own specific implementation logic.
     * @module dd
     * @main dd
     * @submodule dd-constrain
     */
    /**
     * Plugin for the dd-drag module to add the constraining methods to it.
     * It supports constraining to a node or viewport. It supports tick based moves and XY axis constraints.
     * @class DDConstrained
     * @extends Base
     * @constructor
     * @namespace Plugin
     */

    _yuitest_coverfunc("build/dd-constrain/dd-constrain.js", "(anonymous 1)", 1);
_yuitest_coverline("build/dd-constrain/dd-constrain.js", 23);
var DRAG_NODE = 'dragNode',
        OFFSET_HEIGHT = 'offsetHeight',
        OFFSET_WIDTH = 'offsetWidth',
        HOST = 'host',
        TICK_X_ARRAY = 'tickXArray',
        TICK_Y_ARRAY = 'tickYArray',
        DDM = Y.DD.DDM,
        TOP = 'top',
        RIGHT = 'right',
        BOTTOM = 'bottom',
        LEFT = 'left',
        VIEW = 'view',
        proto = null,

        /**
        * @event drag:tickAlignX
        * @description Fires when this node is aligned with the tickX value.
        * @param {EventFacade} event An Event Facade object
        * @type {CustomEvent}
        */
        EV_TICK_ALIGN_X = 'drag:tickAlignX',

        /**
        * @event drag:tickAlignY
        * @description Fires when this node is aligned with the tickY value.
        * @param {EventFacade} event An Event Facade object
        * @type {CustomEvent}
        */
        EV_TICK_ALIGN_Y = 'drag:tickAlignY',

        C = function() {
            _yuitest_coverfunc("build/dd-constrain/dd-constrain.js", "C", 53);
_yuitest_coverline("build/dd-constrain/dd-constrain.js", 54);
this._lazyAddAttrs = false;
            _yuitest_coverline("build/dd-constrain/dd-constrain.js", 55);
C.superclass.constructor.apply(this, arguments);
        };

    _yuitest_coverline("build/dd-constrain/dd-constrain.js", 58);
C.NAME = 'ddConstrained';
    /**
    * @property NS
    * @default con
    * @readonly
    * @protected
    * @static
    * @description The Constrained instance will be placed on the Drag instance under the con namespace.
    * @type {String}
*/
    _yuitest_coverline("build/dd-constrain/dd-constrain.js", 68);
C.NS = 'con';

    _yuitest_coverline("build/dd-constrain/dd-constrain.js", 70);
C.ATTRS = {
        host: {
        },
        /**
        * @attribute stickX
        * @description Stick the drag movement to the X-Axis. Default: false
        * @type Boolean
        */
        stickX: {
            value: false
        },
        /**
        * @attribute stickY
        * @description Stick the drag movement to the Y-Axis
        * @type Boolean
        */
        stickY: {
            value: false
        },
        /**
        * @attribute tickX
        * @description The X tick offset the drag node should snap to on each drag move. False for no ticks. Default: false
        * @type Number/false
        */
        tickX: {
            value: false
        },
        /**
        * @attribute tickY
        * @description The Y tick offset the drag node should snap to on each drag move. False for no ticks. Default: false
        * @type Number/false
        */
        tickY: {
            value: false
        },
        /**
        * @attribute tickXArray
        * @description An array of page coordinates to use as X ticks for drag movement.
        * @type Array
        */
        tickXArray: {
            value: false
        },
        /**
        * @attribute tickYArray
        * @description An array of page coordinates to use as Y ticks for drag movement.
        * @type Array
        */
        tickYArray: {
            value: false
        },
        /**
        * CSS style string for the gutter of a region (supports negative values): '5 0'
        * (sets top and bottom to 5px, left and right to 0px), '1 2 3 4' (top 1px, right 2px, bottom 3px, left 4px)
        * @attribute gutter
        * @type String
        */
        gutter: {
            value: '0',
            setter: function(gutter) {
                _yuitest_coverfunc("build/dd-constrain/dd-constrain.js", "setter", 129);
_yuitest_coverline("build/dd-constrain/dd-constrain.js", 130);
return Y.DD.DDM.cssSizestoObject(gutter);
            }
        },
        /**
        * @attribute constrain
        * @description Will attempt to constrain the drag node to the boundaries. Arguments:<br>
        * 'view': Contrain to Viewport<br>
        * '#selector_string': Constrain to this node<br>
        * '{Region Object}': An Object Literal containing a valid region (top, right, bottom, left) of page positions
        * @type {String/Object/Node}
        */
        constrain: {
            value: VIEW,
            setter: function(con) {
                _yuitest_coverfunc("build/dd-constrain/dd-constrain.js", "setter", 143);
_yuitest_coverline("build/dd-constrain/dd-constrain.js", 144);
var node = Y.one(con);
                _yuitest_coverline("build/dd-constrain/dd-constrain.js", 145);
if (node) {
                    _yuitest_coverline("build/dd-constrain/dd-constrain.js", 146);
con = node;
                }
                _yuitest_coverline("build/dd-constrain/dd-constrain.js", 148);
return con;
            }
        },
        /**
        * @deprecated
        * @attribute constrain2region
        * @description An Object Literal containing a valid region (top, right, bottom, left) of page positions to constrain the drag node to.
        * @type Object
        */
        constrain2region: {
            setter: function(r) {
                _yuitest_coverfunc("build/dd-constrain/dd-constrain.js", "setter", 158);
_yuitest_coverline("build/dd-constrain/dd-constrain.js", 159);
return this.set('constrain', r);
            }
        },
        /**
        * @deprecated
        * @attribute constrain2node
        * @description Will attempt to constrain the drag node to the boundaries of this node.
        * @type Object
        */
        constrain2node: {
            setter: function(n) {
                _yuitest_coverfunc("build/dd-constrain/dd-constrain.js", "setter", 169);
_yuitest_coverline("build/dd-constrain/dd-constrain.js", 170);
return this.set('constrain', Y.one(n));
            }
        },
        /**
        * @deprecated
        * @attribute constrain2view
        * @description Will attempt to constrain the drag node to the boundaries of the viewport region.
        * @type Object
        */
        constrain2view: {
            setter: function() {
                _yuitest_coverfunc("build/dd-constrain/dd-constrain.js", "setter", 180);
_yuitest_coverline("build/dd-constrain/dd-constrain.js", 181);
return this.set('constrain', VIEW);
            }
        },
        /**
        * @attribute cacheRegion
        * @description Should the region be cached for performace. Default: true
        * @type Boolean
        */
        cacheRegion: {
            value: true
        }
    };

    _yuitest_coverline("build/dd-constrain/dd-constrain.js", 194);
proto = {
        _lastTickXFired: null,
        _lastTickYFired: null,

        initializer: function() {
            _yuitest_coverfunc("build/dd-constrain/dd-constrain.js", "initializer", 198);
_yuitest_coverline("build/dd-constrain/dd-constrain.js", 199);
this._createEvents();

            _yuitest_coverline("build/dd-constrain/dd-constrain.js", 201);
this._eventHandles = [
                this.get(HOST).on('drag:end', Y.bind(this._handleEnd, this)),
                this.get(HOST).on('drag:start', Y.bind(this._handleStart, this)),
                this.get(HOST).after('drag:align', Y.bind(this.align, this)),
                this.get(HOST).after('drag:drag', Y.bind(this.drag, this))
            ];
        },
        destructor: function() {
            _yuitest_coverfunc("build/dd-constrain/dd-constrain.js", "destructor", 208);
_yuitest_coverline("build/dd-constrain/dd-constrain.js", 209);
Y.each(
                this._eventHandles,
                function(handle) {
                    _yuitest_coverfunc("build/dd-constrain/dd-constrain.js", "(anonymous 2)", 211);
_yuitest_coverline("build/dd-constrain/dd-constrain.js", 212);
handle.detach();
                }
            );

            _yuitest_coverline("build/dd-constrain/dd-constrain.js", 216);
this._eventHandles.length = 0;
        },
        /**
        * @private
        * @method _createEvents
        * @description This method creates all the events for this Event Target and publishes them so we get Event Bubbling.
        */
        _createEvents: function() {
            _yuitest_coverfunc("build/dd-constrain/dd-constrain.js", "_createEvents", 223);
_yuitest_coverline("build/dd-constrain/dd-constrain.js", 224);
var ev = [
                EV_TICK_ALIGN_X,
                EV_TICK_ALIGN_Y
            ];

            _yuitest_coverline("build/dd-constrain/dd-constrain.js", 229);
Y.each(ev, function(v) {
                _yuitest_coverfunc("build/dd-constrain/dd-constrain.js", "(anonymous 3)", 229);
_yuitest_coverline("build/dd-constrain/dd-constrain.js", 230);
this.publish(v, {
                    type: v,
                    emitFacade: true,
                    bubbles: true,
                    queuable: false,
                    prefix: 'drag'
                });
            }, this);
        },
        /**
        * @private
        * @method _handleEnd
        * @description Fires on drag:end
        */
        _handleEnd: function() {
            _yuitest_coverfunc("build/dd-constrain/dd-constrain.js", "_handleEnd", 244);
_yuitest_coverline("build/dd-constrain/dd-constrain.js", 245);
this._lastTickYFired = null;
            _yuitest_coverline("build/dd-constrain/dd-constrain.js", 246);
this._lastTickXFired = null;
        },
        /**
        * @private
        * @method _handleStart
        * @description Fires on drag:start and clears the _regionCache
        */
        _handleStart: function() {
            _yuitest_coverfunc("build/dd-constrain/dd-constrain.js", "_handleStart", 253);
_yuitest_coverline("build/dd-constrain/dd-constrain.js", 254);
this.resetCache();
        },
        /**
        * @private
        * @property _regionCache
        * @description Store a cache of the region that we are constraining to
        * @type Object
        */
        _regionCache: null,
        /**
        * @private
        * @method _cacheRegion
        * @description Get's the region and caches it, called from window.resize and when the cache is null
        */
        _cacheRegion: function() {
            _yuitest_coverfunc("build/dd-constrain/dd-constrain.js", "_cacheRegion", 268);
_yuitest_coverline("build/dd-constrain/dd-constrain.js", 269);
this._regionCache = this.get('constrain').get('region');
        },
        /**
        * @method resetCache
        * @description Reset the internal region cache.
        */
        resetCache: function() {
            _yuitest_coverfunc("build/dd-constrain/dd-constrain.js", "resetCache", 275);
_yuitest_coverline("build/dd-constrain/dd-constrain.js", 276);
this._regionCache = null;
        },
        /**
        * @private
        * @method _getConstraint
        * @description Standardizes the 'constraint' attribute
        */
        _getConstraint: function() {
            _yuitest_coverfunc("build/dd-constrain/dd-constrain.js", "_getConstraint", 283);
_yuitest_coverline("build/dd-constrain/dd-constrain.js", 284);
var con = this.get('constrain'),
                g = this.get('gutter'),
                region;

            _yuitest_coverline("build/dd-constrain/dd-constrain.js", 288);
if (con) {
                _yuitest_coverline("build/dd-constrain/dd-constrain.js", 289);
if (con instanceof Y.Node) {
                    _yuitest_coverline("build/dd-constrain/dd-constrain.js", 290);
if (!this._regionCache) {
                        _yuitest_coverline("build/dd-constrain/dd-constrain.js", 291);
this._eventHandles.push(Y.on('resize', Y.bind(this._cacheRegion, this), Y.config.win));
                        _yuitest_coverline("build/dd-constrain/dd-constrain.js", 292);
this._cacheRegion();
                    }
                    _yuitest_coverline("build/dd-constrain/dd-constrain.js", 294);
region = Y.clone(this._regionCache);
                    _yuitest_coverline("build/dd-constrain/dd-constrain.js", 295);
if (!this.get('cacheRegion')) {
                        _yuitest_coverline("build/dd-constrain/dd-constrain.js", 296);
this.resetCache();
                    }
                } else {_yuitest_coverline("build/dd-constrain/dd-constrain.js", 298);
if (Y.Lang.isObject(con)) {
                    _yuitest_coverline("build/dd-constrain/dd-constrain.js", 299);
region = Y.clone(con);
                }}
            }
            _yuitest_coverline("build/dd-constrain/dd-constrain.js", 302);
if (!con || !region) {
                _yuitest_coverline("build/dd-constrain/dd-constrain.js", 303);
con = VIEW;
            }
            _yuitest_coverline("build/dd-constrain/dd-constrain.js", 305);
if (con === VIEW) {
                _yuitest_coverline("build/dd-constrain/dd-constrain.js", 306);
region = this.get(HOST).get(DRAG_NODE).get('viewportRegion');
            }

            _yuitest_coverline("build/dd-constrain/dd-constrain.js", 309);
Y.each(g, function(i, n) {
                _yuitest_coverfunc("build/dd-constrain/dd-constrain.js", "(anonymous 4)", 309);
_yuitest_coverline("build/dd-constrain/dd-constrain.js", 310);
if ((n === RIGHT) || (n === BOTTOM)) {
                    _yuitest_coverline("build/dd-constrain/dd-constrain.js", 311);
region[n] -= i;
                } else {
                    _yuitest_coverline("build/dd-constrain/dd-constrain.js", 313);
region[n] += i;
                }
            });
            _yuitest_coverline("build/dd-constrain/dd-constrain.js", 316);
return region;
        },

        /**
        * @method getRegion
        * @description Get the active region: viewport, node, custom region
        * @param {Boolean} inc Include the node's height and width
        * @return {Object} The active region.
        */
        getRegion: function(inc) {
            _yuitest_coverfunc("build/dd-constrain/dd-constrain.js", "getRegion", 325);
_yuitest_coverline("build/dd-constrain/dd-constrain.js", 326);
var r = {}, oh = null, ow = null,
                host = this.get(HOST);

            _yuitest_coverline("build/dd-constrain/dd-constrain.js", 329);
r = this._getConstraint();

            _yuitest_coverline("build/dd-constrain/dd-constrain.js", 331);
if (inc) {
                _yuitest_coverline("build/dd-constrain/dd-constrain.js", 332);
oh = host.get(DRAG_NODE).get(OFFSET_HEIGHT);
                _yuitest_coverline("build/dd-constrain/dd-constrain.js", 333);
ow = host.get(DRAG_NODE).get(OFFSET_WIDTH);
                _yuitest_coverline("build/dd-constrain/dd-constrain.js", 334);
r[RIGHT] = r[RIGHT] - ow;
                _yuitest_coverline("build/dd-constrain/dd-constrain.js", 335);
r[BOTTOM] = r[BOTTOM] - oh;
            }
            _yuitest_coverline("build/dd-constrain/dd-constrain.js", 337);
return r;
        },
        /**
        * @private
        * @method _checkRegion
        * @description Check if xy is inside a given region, if not change to it be inside.
        * @param {Array} _xy The XY to check if it's in the current region, if it isn't
        * inside the region, it will reset the xy array to be inside the region.
        * @return {Array} The new XY that is inside the region
        */
        _checkRegion: function(_xy) {
            _yuitest_coverfunc("build/dd-constrain/dd-constrain.js", "_checkRegion", 347);
_yuitest_coverline("build/dd-constrain/dd-constrain.js", 348);
var oxy = _xy,
                r = this.getRegion(),
                host = this.get(HOST),
                oh = host.get(DRAG_NODE).get(OFFSET_HEIGHT),
                ow = host.get(DRAG_NODE).get(OFFSET_WIDTH);

                _yuitest_coverline("build/dd-constrain/dd-constrain.js", 354);
if (oxy[1] > (r[BOTTOM] - oh)) {
                    _yuitest_coverline("build/dd-constrain/dd-constrain.js", 355);
_xy[1] = (r[BOTTOM] - oh);
                }
                _yuitest_coverline("build/dd-constrain/dd-constrain.js", 357);
if (r[TOP] > oxy[1]) {
                    _yuitest_coverline("build/dd-constrain/dd-constrain.js", 358);
_xy[1] = r[TOP];

                }
                _yuitest_coverline("build/dd-constrain/dd-constrain.js", 361);
if (oxy[0] > (r[RIGHT] - ow)) {
                    _yuitest_coverline("build/dd-constrain/dd-constrain.js", 362);
_xy[0] = (r[RIGHT] - ow);
                }
                _yuitest_coverline("build/dd-constrain/dd-constrain.js", 364);
if (r[LEFT] > oxy[0]) {
                    _yuitest_coverline("build/dd-constrain/dd-constrain.js", 365);
_xy[0] = r[LEFT];
                }

            _yuitest_coverline("build/dd-constrain/dd-constrain.js", 368);
return _xy;
        },
        /**
        * @method inRegion
        * @description Checks if the XY passed or the dragNode is inside the active region.
        * @param {Array} xy Optional XY to check, if not supplied this.get('dragNode').getXY() is used.
        * @return {Boolean} True if the XY is inside the region, false otherwise.
        */
        inRegion: function(xy) {
            _yuitest_coverfunc("build/dd-constrain/dd-constrain.js", "inRegion", 376);
_yuitest_coverline("build/dd-constrain/dd-constrain.js", 377);
xy = xy || this.get(HOST).get(DRAG_NODE).getXY();

            _yuitest_coverline("build/dd-constrain/dd-constrain.js", 379);
var _xy = this._checkRegion([xy[0], xy[1]]),
                inside = false;
                _yuitest_coverline("build/dd-constrain/dd-constrain.js", 381);
if ((xy[0] === _xy[0]) && (xy[1] === _xy[1])) {
                    _yuitest_coverline("build/dd-constrain/dd-constrain.js", 382);
inside = true;
                }
            _yuitest_coverline("build/dd-constrain/dd-constrain.js", 384);
return inside;
        },
        /**
        * @method align
        * @description Modifies the Drag.actXY method from the after drag:align event. This is where the constraining happens.
        */
        align: function() {
            _yuitest_coverfunc("build/dd-constrain/dd-constrain.js", "align", 390);
_yuitest_coverline("build/dd-constrain/dd-constrain.js", 391);
var host = this.get(HOST),
                _xy = [host.actXY[0], host.actXY[1]],
                r = this.getRegion(true);

            _yuitest_coverline("build/dd-constrain/dd-constrain.js", 395);
if (this.get('stickX')) {
                _yuitest_coverline("build/dd-constrain/dd-constrain.js", 396);
_xy[1] = (host.startXY[1] - host.deltaXY[1]);
            }
            _yuitest_coverline("build/dd-constrain/dd-constrain.js", 398);
if (this.get('stickY')) {
                _yuitest_coverline("build/dd-constrain/dd-constrain.js", 399);
_xy[0] = (host.startXY[0] - host.deltaXY[0]);
            }

            _yuitest_coverline("build/dd-constrain/dd-constrain.js", 402);
if (r) {
                _yuitest_coverline("build/dd-constrain/dd-constrain.js", 403);
_xy = this._checkRegion(_xy);
            }

            _yuitest_coverline("build/dd-constrain/dd-constrain.js", 406);
_xy = this._checkTicks(_xy, r);

            _yuitest_coverline("build/dd-constrain/dd-constrain.js", 408);
host.actXY = _xy;
        },
        /**
        * @method drag
        * @description Fires after drag:drag. Handle the tickX and tickX align events.
        */
        drag: function() {
            _yuitest_coverfunc("build/dd-constrain/dd-constrain.js", "drag", 414);
_yuitest_coverline("build/dd-constrain/dd-constrain.js", 415);
var host = this.get(HOST),
                xt = this.get('tickX'),
                yt = this.get('tickY'),
                _xy = [host.actXY[0], host.actXY[1]];

            _yuitest_coverline("build/dd-constrain/dd-constrain.js", 420);
if ((Y.Lang.isNumber(xt) || this.get(TICK_X_ARRAY)) && (this._lastTickXFired !== _xy[0])) {
                _yuitest_coverline("build/dd-constrain/dd-constrain.js", 421);
this._tickAlignX();
                _yuitest_coverline("build/dd-constrain/dd-constrain.js", 422);
this._lastTickXFired = _xy[0];
            }

            _yuitest_coverline("build/dd-constrain/dd-constrain.js", 425);
if ((Y.Lang.isNumber(yt) || this.get(TICK_Y_ARRAY)) && (this._lastTickYFired !== _xy[1])) {
                _yuitest_coverline("build/dd-constrain/dd-constrain.js", 426);
this._tickAlignY();
                _yuitest_coverline("build/dd-constrain/dd-constrain.js", 427);
this._lastTickYFired = _xy[1];
            }
        },
        /**
        * @private
        * @method _checkTicks
        * @description This method delegates the proper helper method for tick calculations
        * @param {Array} xy The XY coords for the Drag
        * @param {Object} r The optional region that we are bound to.
        * @return {Array} The calced XY coords
        */
        _checkTicks: function(xy, r) {
            _yuitest_coverfunc("build/dd-constrain/dd-constrain.js", "_checkTicks", 438);
_yuitest_coverline("build/dd-constrain/dd-constrain.js", 439);
var host = this.get(HOST),
                lx = (host.startXY[0] - host.deltaXY[0]),
                ly = (host.startXY[1] - host.deltaXY[1]),
                xt = this.get('tickX'),
                yt = this.get('tickY');
                _yuitest_coverline("build/dd-constrain/dd-constrain.js", 444);
if (xt && !this.get(TICK_X_ARRAY)) {
                    _yuitest_coverline("build/dd-constrain/dd-constrain.js", 445);
xy[0] = DDM._calcTicks(xy[0], lx, xt, r[LEFT], r[RIGHT]);
                }
                _yuitest_coverline("build/dd-constrain/dd-constrain.js", 447);
if (yt && !this.get(TICK_Y_ARRAY)) {
                    _yuitest_coverline("build/dd-constrain/dd-constrain.js", 448);
xy[1] = DDM._calcTicks(xy[1], ly, yt, r[TOP], r[BOTTOM]);
                }
                _yuitest_coverline("build/dd-constrain/dd-constrain.js", 450);
if (this.get(TICK_X_ARRAY)) {
                    _yuitest_coverline("build/dd-constrain/dd-constrain.js", 451);
xy[0] = DDM._calcTickArray(xy[0], this.get(TICK_X_ARRAY), r[LEFT], r[RIGHT]);
                }
                _yuitest_coverline("build/dd-constrain/dd-constrain.js", 453);
if (this.get(TICK_Y_ARRAY)) {
                    _yuitest_coverline("build/dd-constrain/dd-constrain.js", 454);
xy[1] = DDM._calcTickArray(xy[1], this.get(TICK_Y_ARRAY), r[TOP], r[BOTTOM]);
                }

            _yuitest_coverline("build/dd-constrain/dd-constrain.js", 457);
return xy;
        },
        /**
        * @private
        * @method _tickAlignX
        * @description Fires when the actXY[0] reach a new value respecting the tickX gap.
        */
        _tickAlignX: function() {
            _yuitest_coverfunc("build/dd-constrain/dd-constrain.js", "_tickAlignX", 464);
_yuitest_coverline("build/dd-constrain/dd-constrain.js", 465);
this.fire(EV_TICK_ALIGN_X);
        },
        /**
        * @private
        * @method _tickAlignY
        * @description Fires when the actXY[1] reach a new value respecting the tickY gap.
        */
        _tickAlignY: function() {
            _yuitest_coverfunc("build/dd-constrain/dd-constrain.js", "_tickAlignY", 472);
_yuitest_coverline("build/dd-constrain/dd-constrain.js", 473);
this.fire(EV_TICK_ALIGN_Y);
        }
    };

    _yuitest_coverline("build/dd-constrain/dd-constrain.js", 477);
Y.namespace('Plugin');
    _yuitest_coverline("build/dd-constrain/dd-constrain.js", 478);
Y.extend(C, Y.Base, proto);
    _yuitest_coverline("build/dd-constrain/dd-constrain.js", 479);
Y.Plugin.DDConstrained = C;

    _yuitest_coverline("build/dd-constrain/dd-constrain.js", 481);
Y.mix(DDM, {
        /**
        * @for DDM
        * @namespace DD
        * @private
        * @method _calcTicks
        * @description Helper method to calculate the tick offsets for a given position
        * @param {Number} pos The current X or Y position
        * @param {Number} start The start X or Y position
        * @param {Number} tick The X or Y tick increment
        * @param {Number} off1 The min offset that we can't pass (region)
        * @param {Number} off2 The max offset that we can't pass (region)
        * @return {Number} The new position based on the tick calculation
        */
        _calcTicks: function(pos, start, tick, off1, off2) {
            _yuitest_coverfunc("build/dd-constrain/dd-constrain.js", "_calcTicks", 495);
_yuitest_coverline("build/dd-constrain/dd-constrain.js", 496);
var ix = ((pos - start) / tick),
                min = Math.floor(ix),
                max = Math.ceil(ix);
                _yuitest_coverline("build/dd-constrain/dd-constrain.js", 499);
if ((min !== 0) || (max !== 0)) {
                    _yuitest_coverline("build/dd-constrain/dd-constrain.js", 500);
if ((ix >= min) && (ix <= max)) {
                        _yuitest_coverline("build/dd-constrain/dd-constrain.js", 501);
pos = (start + (tick * min));
                        _yuitest_coverline("build/dd-constrain/dd-constrain.js", 502);
if (off1 && off2) {
                            _yuitest_coverline("build/dd-constrain/dd-constrain.js", 503);
if (pos < off1) {
                                _yuitest_coverline("build/dd-constrain/dd-constrain.js", 504);
pos = (start + (tick * (min + 1)));
                            }
                            _yuitest_coverline("build/dd-constrain/dd-constrain.js", 506);
if (pos > off2) {
                                _yuitest_coverline("build/dd-constrain/dd-constrain.js", 507);
pos = (start + (tick * (min - 1)));
                            }
                        }
                    }
                }
                _yuitest_coverline("build/dd-constrain/dd-constrain.js", 512);
return pos;
        },
        /**
        * @for DDM
        * @namespace DD
        * @private
        * @method _calcTickArray
        * @description This method is used with the tickXArray and tickYArray config options
        * @param {Number} pos The current X or Y position
        * @param {Number} ticks The array containing our custom tick positions.
        * @param {Number} off1 The min offset that we can't pass (region)
        * @param {Number} off2 The max offset that we can't pass (region)
        * @return The tick position
        */
        _calcTickArray: function(pos, ticks, off1, off2) {
            _yuitest_coverfunc("build/dd-constrain/dd-constrain.js", "_calcTickArray", 526);
_yuitest_coverline("build/dd-constrain/dd-constrain.js", 527);
var i = 0, len = ticks.length, next = 0,
                diff1, diff2, ret;

            _yuitest_coverline("build/dd-constrain/dd-constrain.js", 530);
if (!ticks || (ticks.length === 0)) {
                _yuitest_coverline("build/dd-constrain/dd-constrain.js", 531);
return pos;
            }
            _yuitest_coverline("build/dd-constrain/dd-constrain.js", 533);
if (ticks[0] >= pos) {
                _yuitest_coverline("build/dd-constrain/dd-constrain.js", 534);
return ticks[0];
            }

            _yuitest_coverline("build/dd-constrain/dd-constrain.js", 537);
for (i = 0; i < len; i++) {
                _yuitest_coverline("build/dd-constrain/dd-constrain.js", 538);
next = (i + 1);
                _yuitest_coverline("build/dd-constrain/dd-constrain.js", 539);
if (ticks[next] && ticks[next] >= pos) {
                    _yuitest_coverline("build/dd-constrain/dd-constrain.js", 540);
diff1 = pos - ticks[i];
                    _yuitest_coverline("build/dd-constrain/dd-constrain.js", 541);
diff2 = ticks[next] - pos;
                    _yuitest_coverline("build/dd-constrain/dd-constrain.js", 542);
ret = (diff2 > diff1) ? ticks[i] : ticks[next];
                    _yuitest_coverline("build/dd-constrain/dd-constrain.js", 543);
if (off1 && off2) {
                        _yuitest_coverline("build/dd-constrain/dd-constrain.js", 544);
if (ret > off2) {
                            _yuitest_coverline("build/dd-constrain/dd-constrain.js", 545);
if (ticks[i]) {
                                _yuitest_coverline("build/dd-constrain/dd-constrain.js", 546);
ret = ticks[i];
                            } else {
                                _yuitest_coverline("build/dd-constrain/dd-constrain.js", 548);
ret = ticks[len - 1];
                            }
                        }
                    }
                    _yuitest_coverline("build/dd-constrain/dd-constrain.js", 552);
return ret;
                }

            }
            _yuitest_coverline("build/dd-constrain/dd-constrain.js", 556);
return ticks[ticks.length - 1];
        }
    });



}, '3.7.3', {"requires": ["dd-drag"]});
