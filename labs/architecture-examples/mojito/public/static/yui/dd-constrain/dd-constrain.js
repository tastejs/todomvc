/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
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
            this._lazyAddAttrs = false;
            C.superclass.constructor.apply(this, arguments);
        };

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
    C.NS = 'con';

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
                var node = Y.one(con);
                if (node) {
                    con = node;
                }
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

    proto = {
        _lastTickXFired: null,
        _lastTickYFired: null,

        initializer: function() {
            this._createEvents();

            this._eventHandles = [
                this.get(HOST).on('drag:end', Y.bind(this._handleEnd, this)),
                this.get(HOST).on('drag:start', Y.bind(this._handleStart, this)),
                this.get(HOST).after('drag:align', Y.bind(this.align, this)),
                this.get(HOST).after('drag:drag', Y.bind(this.drag, this))
            ];
        },
        destructor: function() {
            Y.each(
                this._eventHandles,
                function(handle) {
                    handle.detach();
                }
            );

            this._eventHandles.length = 0;
        },
        /**
        * @private
        * @method _createEvents
        * @description This method creates all the events for this Event Target and publishes them so we get Event Bubbling.
        */
        _createEvents: function() {
            var ev = [
                EV_TICK_ALIGN_X,
                EV_TICK_ALIGN_Y
            ];

            Y.each(ev, function(v) {
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
            this._lastTickYFired = null;
            this._lastTickXFired = null;
        },
        /**
        * @private
        * @method _handleStart
        * @description Fires on drag:start and clears the _regionCache
        */
        _handleStart: function() {
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
            this._regionCache = this.get('constrain').get('region');
        },
        /**
        * @method resetCache
        * @description Reset the internal region cache.
        */
        resetCache: function() {
            this._regionCache = null;
        },
        /**
        * @private
        * @method _getConstraint
        * @description Standardizes the 'constraint' attribute
        */
        _getConstraint: function() {
            var con = this.get('constrain'),
                g = this.get('gutter'),
                region;

            if (con) {
                if (con instanceof Y.Node) {
                    if (!this._regionCache) {
                        this._eventHandles.push(Y.on('resize', Y.bind(this._cacheRegion, this), Y.config.win));
                        this._cacheRegion();
                    }
                    region = Y.clone(this._regionCache);
                    if (!this.get('cacheRegion')) {
                        this.resetCache();
                    }
                } else if (Y.Lang.isObject(con)) {
                    region = Y.clone(con);
                }
            }
            if (!con || !region) {
                con = VIEW;
            }
            if (con === VIEW) {
                region = this.get(HOST).get(DRAG_NODE).get('viewportRegion');
            }

            Y.each(g, function(i, n) {
                if ((n === RIGHT) || (n === BOTTOM)) {
                    region[n] -= i;
                } else {
                    region[n] += i;
                }
            });
            return region;
        },

        /**
        * @method getRegion
        * @description Get the active region: viewport, node, custom region
        * @param {Boolean} inc Include the node's height and width
        * @return {Object} The active region.
        */
        getRegion: function(inc) {
            var r = {}, oh = null, ow = null,
                host = this.get(HOST);

            r = this._getConstraint();

            if (inc) {
                oh = host.get(DRAG_NODE).get(OFFSET_HEIGHT);
                ow = host.get(DRAG_NODE).get(OFFSET_WIDTH);
                r[RIGHT] = r[RIGHT] - ow;
                r[BOTTOM] = r[BOTTOM] - oh;
            }
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
            var oxy = _xy,
                r = this.getRegion(),
                host = this.get(HOST),
                oh = host.get(DRAG_NODE).get(OFFSET_HEIGHT),
                ow = host.get(DRAG_NODE).get(OFFSET_WIDTH);

                if (oxy[1] > (r[BOTTOM] - oh)) {
                    _xy[1] = (r[BOTTOM] - oh);
                }
                if (r[TOP] > oxy[1]) {
                    _xy[1] = r[TOP];

                }
                if (oxy[0] > (r[RIGHT] - ow)) {
                    _xy[0] = (r[RIGHT] - ow);
                }
                if (r[LEFT] > oxy[0]) {
                    _xy[0] = r[LEFT];
                }

            return _xy;
        },
        /**
        * @method inRegion
        * @description Checks if the XY passed or the dragNode is inside the active region.
        * @param {Array} xy Optional XY to check, if not supplied this.get('dragNode').getXY() is used.
        * @return {Boolean} True if the XY is inside the region, false otherwise.
        */
        inRegion: function(xy) {
            xy = xy || this.get(HOST).get(DRAG_NODE).getXY();

            var _xy = this._checkRegion([xy[0], xy[1]]),
                inside = false;
                if ((xy[0] === _xy[0]) && (xy[1] === _xy[1])) {
                    inside = true;
                }
            return inside;
        },
        /**
        * @method align
        * @description Modifies the Drag.actXY method from the after drag:align event. This is where the constraining happens.
        */
        align: function() {
            var host = this.get(HOST),
                _xy = [host.actXY[0], host.actXY[1]],
                r = this.getRegion(true);

            if (this.get('stickX')) {
                _xy[1] = (host.startXY[1] - host.deltaXY[1]);
            }
            if (this.get('stickY')) {
                _xy[0] = (host.startXY[0] - host.deltaXY[0]);
            }

            if (r) {
                _xy = this._checkRegion(_xy);
            }

            _xy = this._checkTicks(_xy, r);

            host.actXY = _xy;
        },
        /**
        * @method drag
        * @description Fires after drag:drag. Handle the tickX and tickX align events.
        */
        drag: function() {
            var host = this.get(HOST),
                xt = this.get('tickX'),
                yt = this.get('tickY'),
                _xy = [host.actXY[0], host.actXY[1]];

            if ((Y.Lang.isNumber(xt) || this.get(TICK_X_ARRAY)) && (this._lastTickXFired !== _xy[0])) {
                this._tickAlignX();
                this._lastTickXFired = _xy[0];
            }

            if ((Y.Lang.isNumber(yt) || this.get(TICK_Y_ARRAY)) && (this._lastTickYFired !== _xy[1])) {
                this._tickAlignY();
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
            var host = this.get(HOST),
                lx = (host.startXY[0] - host.deltaXY[0]),
                ly = (host.startXY[1] - host.deltaXY[1]),
                xt = this.get('tickX'),
                yt = this.get('tickY');
                if (xt && !this.get(TICK_X_ARRAY)) {
                    xy[0] = DDM._calcTicks(xy[0], lx, xt, r[LEFT], r[RIGHT]);
                }
                if (yt && !this.get(TICK_Y_ARRAY)) {
                    xy[1] = DDM._calcTicks(xy[1], ly, yt, r[TOP], r[BOTTOM]);
                }
                if (this.get(TICK_X_ARRAY)) {
                    xy[0] = DDM._calcTickArray(xy[0], this.get(TICK_X_ARRAY), r[LEFT], r[RIGHT]);
                }
                if (this.get(TICK_Y_ARRAY)) {
                    xy[1] = DDM._calcTickArray(xy[1], this.get(TICK_Y_ARRAY), r[TOP], r[BOTTOM]);
                }

            return xy;
        },
        /**
        * @private
        * @method _tickAlignX
        * @description Fires when the actXY[0] reach a new value respecting the tickX gap.
        */
        _tickAlignX: function() {
            this.fire(EV_TICK_ALIGN_X);
        },
        /**
        * @private
        * @method _tickAlignY
        * @description Fires when the actXY[1] reach a new value respecting the tickY gap.
        */
        _tickAlignY: function() {
            this.fire(EV_TICK_ALIGN_Y);
        }
    };

    Y.namespace('Plugin');
    Y.extend(C, Y.Base, proto);
    Y.Plugin.DDConstrained = C;

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
            var ix = ((pos - start) / tick),
                min = Math.floor(ix),
                max = Math.ceil(ix);
                if ((min !== 0) || (max !== 0)) {
                    if ((ix >= min) && (ix <= max)) {
                        pos = (start + (tick * min));
                        if (off1 && off2) {
                            if (pos < off1) {
                                pos = (start + (tick * (min + 1)));
                            }
                            if (pos > off2) {
                                pos = (start + (tick * (min - 1)));
                            }
                        }
                    }
                }
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
            var i = 0, len = ticks.length, next = 0,
                diff1, diff2, ret;

            if (!ticks || (ticks.length === 0)) {
                return pos;
            }
            if (ticks[0] >= pos) {
                return ticks[0];
            }

            for (i = 0; i < len; i++) {
                next = (i + 1);
                if (ticks[next] && ticks[next] >= pos) {
                    diff1 = pos - ticks[i];
                    diff2 = ticks[next] - pos;
                    ret = (diff2 > diff1) ? ticks[i] : ticks[next];
                    if (off1 && off2) {
                        if (ret > off2) {
                            if (ticks[i]) {
                                ret = ticks[i];
                            } else {
                                ret = ticks[len - 1];
                            }
                        }
                    }
                    return ret;
                }

            }
            return ticks[ticks.length - 1];
        }
    });



}, '3.7.3', {"requires": ["dd-drag"]});
