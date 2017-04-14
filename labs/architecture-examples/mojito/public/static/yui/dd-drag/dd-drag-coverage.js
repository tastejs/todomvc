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
_yuitest_coverage["build/dd-drag/dd-drag.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/dd-drag/dd-drag.js",
    code: []
};
_yuitest_coverage["build/dd-drag/dd-drag.js"].code=["YUI.add('dd-drag', function (Y, NAME) {","","","    /**","     * Provides the ability to drag a Node.","     * @module dd","     * @submodule dd-drag","     */","    /**","     * Provides the ability to drag a Node.","     * @class Drag","     * @extends Base","     * @constructor","     * @namespace DD","     */","","    var DDM = Y.DD.DDM,","        NODE = 'node',","        DRAGGING = 'dragging',","        DRAG_NODE = 'dragNode',","        OFFSET_HEIGHT = 'offsetHeight',","        OFFSET_WIDTH = 'offsetWidth',","        /**","        * @event drag:mouseup","        * @description Handles the mouseup DOM event, does nothing internally just fires.","        * @bubbles DDM","        * @type {CustomEvent}","        */","        /**","        * @event drag:mouseDown","        * @description Handles the mousedown DOM event, checks to see if you have a valid handle then starts the drag timers.","        * @preventable _defMouseDownFn","        * @param {EventFacade} event An Event Facade object with the following specific property added:","        * <dl><dt>ev</dt><dd>The original mousedown event.</dd></dl>","        * @bubbles DDM","        * @type {CustomEvent}","        */","        EV_MOUSE_DOWN = 'drag:mouseDown',","        /**","        * @event drag:afterMouseDown","        * @description Fires after the mousedown event has been cleared.","        * @param {EventFacade} event An Event Facade object with the following specific property added:","        * <dl><dt>ev</dt><dd>The original mousedown event.</dd></dl>","        * @bubbles DDM","        * @type {CustomEvent}","        */","        EV_AFTER_MOUSE_DOWN = 'drag:afterMouseDown',","        /**","        * @event drag:removeHandle","        * @description Fires after a handle is removed.","        * @param {EventFacade} event An Event Facade object with the following specific property added:","        * <dl><dt>handle</dt><dd>The handle that was removed.</dd></dl>","        * @bubbles DDM","        * @type {CustomEvent}","        */","        EV_REMOVE_HANDLE = 'drag:removeHandle',","        /**","        * @event drag:addHandle","        * @description Fires after a handle is added.","        * @param {EventFacade} event An Event Facade object with the following specific property added:","        * <dl><dt>handle</dt><dd>The handle that was added.</dd></dl>","        * @bubbles DDM","        * @type {CustomEvent}","        */","        EV_ADD_HANDLE = 'drag:addHandle',","        /**","        * @event drag:removeInvalid","        * @description Fires after an invalid selector is removed.","        * @param {EventFacade} event An Event Facade object with the following specific property added:","        * <dl><dt>handle</dt><dd>The handle that was removed.</dd></dl>","        * @bubbles DDM","        * @type {CustomEvent}","        */","        EV_REMOVE_INVALID = 'drag:removeInvalid',","        /**","        * @event drag:addInvalid","        * @description Fires after an invalid selector is added.","        * @param {EventFacade} event An Event Facade object with the following specific property added:","        * <dl><dt>handle</dt><dd>The handle that was added.</dd></dl>","        * @bubbles DDM","        * @type {CustomEvent}","        */","        EV_ADD_INVALID = 'drag:addInvalid',","        /**","        * @event drag:start","        * @description Fires at the start of a drag operation.","        * @param {EventFacade} event An Event Facade object with the following specific property added:","        * <dl>","        * <dt>pageX</dt><dd>The original node position X.</dd>","        * <dt>pageY</dt><dd>The original node position Y.</dd>","        * <dt>startTime</dt><dd>The startTime of the event. getTime on the current Date object.</dd>","        * </dl>","        * @bubbles DDM","        * @type {CustomEvent}","        */","        EV_START = 'drag:start',","        /**","        * @event drag:end","        * @description Fires at the end of a drag operation.","        * @param {EventFacade} event An Event Facade object with the following specific property added:","        * <dl>","        * <dt>pageX</dt><dd>The current node position X.</dd>","        * <dt>pageY</dt><dd>The current node position Y.</dd>","        * <dt>startTime</dt><dd>The startTime of the event, from the start event.</dd>","        * <dt>endTime</dt><dd>The endTime of the event. getTime on the current Date object.</dd>","        * </dl>","        * @bubbles DDM","        * @type {CustomEvent}","        */","        EV_END = 'drag:end',","        /**","        * @event drag:drag","        * @description Fires every mousemove during a drag operation.","        * @param {EventFacade} event An Event Facade object with the following specific property added:","        * <dl>","        * <dt>pageX</dt><dd>The current node position X.</dd>","        * <dt>pageY</dt><dd>The current node position Y.</dd>","        * <dt>scroll</dt><dd>Should a scroll action occur.</dd>","        * <dt>info</dt><dd>Object hash containing calculated XY arrays: start, xy, delta, offset</dd>","        * </dl>","        * @bubbles DDM","        * @type {CustomEvent}","        */","        EV_DRAG = 'drag:drag',","        /**","        * @event drag:align","        * @preventable _defAlignFn","        * @description Fires when this node is aligned.","        * @param {EventFacade} event An Event Facade object with the following specific property added:","        * <dl>","        * <dt>pageX</dt><dd>The current node position X.</dd>","        * <dt>pageY</dt><dd>The current node position Y.</dd>","        * </dl>","        * @bubbles DDM","        * @type {CustomEvent}","        */","        EV_ALIGN = 'drag:align',","        /**","        * @event drag:over","        * @description Fires when this node is over a Drop Target. (Fired from dd-drop)","        * @param {EventFacade} event An Event Facade object with the following specific property added:","        * <dl>","        * <dt>drop</dt><dd>The drop object at the time of the event.</dd>","        * <dt>drag</dt><dd>The drag object at the time of the event.</dd>","        * </dl>","        * @bubbles DDM","        * @type {CustomEvent}","        */","        /**","        * @event drag:enter","        * @description Fires when this node enters a Drop Target. (Fired from dd-drop)","        * @param {EventFacade} event An Event Facade object with the following specific property added:","        * <dl>","        * <dt>drop</dt><dd>The drop object at the time of the event.</dd>","        * <dt>drag</dt><dd>The drag object at the time of the event.</dd>","        * </dl>","        * @bubbles DDM","        * @type {CustomEvent}","        */","        /**","        * @event drag:exit","        * @description Fires when this node exits a Drop Target. (Fired from dd-drop)","        * @param {EventFacade} event An Event Facade object with the following specific property added:","        * <dl>","        * <dt>drop</dt><dd>The drop object at the time of the event.</dd>","        * </dl>","        * @bubbles DDM","        * @type {CustomEvent}","        */","        /**","        * @event drag:drophit","        * @description Fires when this node is dropped on a valid Drop Target. (Fired from dd-ddm-drop)","        * @param {EventFacade} event An Event Facade object with the following specific property added:","        * <dl>","        * <dt>drop</dt><dd>The best guess on what was dropped on.</dd>","        * <dt>drag</dt><dd>The drag object at the time of the event.</dd>","        * <dt>others</dt><dd>An array of all the other drop targets that was dropped on.</dd>","        * </dl>","        * @bubbles DDM","        * @type {CustomEvent}","        */","        /**","        * @event drag:dropmiss","        * @description Fires when this node is dropped on an invalid Drop Target. (Fired from dd-ddm-drop)","        * @param {EventFacade} event An Event Facade object with the following specific property added:","        * <dl>","        * <dt>pageX</dt><dd>The current node position X.</dd>","        * <dt>pageY</dt><dd>The current node position Y.</dd>","        * </dl>","        * @bubbles DDM","        * @type {CustomEvent}","        */","","    Drag = function(o) {","        this._lazyAddAttrs = false;","        Drag.superclass.constructor.apply(this, arguments);","","        var valid = DDM._regDrag(this);","        if (!valid) {","            Y.error('Failed to register node, already in use: ' + o.node);","        }","    };","","    Drag.NAME = 'drag';","","    /**","    * This property defaults to \"mousedown\", but when drag-gestures is loaded, it is changed to \"gesturemovestart\"","    * @static","    * @property START_EVENT","    */","    Drag.START_EVENT = 'mousedown';","","    Drag.ATTRS = {","        /**","        * @attribute node","        * @description Y.Node instance to use as the element to initiate a drag operation","        * @type Node","        */","        node: {","            setter: function(node) {","                if (this._canDrag(node)) {","                    return node;","                }","                var n = Y.one(node);","                if (!n) {","                    Y.error('DD.Drag: Invalid Node Given: ' + node);","                }","                return n;","            }","        },","        /**","        * @attribute dragNode","        * @description Y.Node instance to use as the draggable element, defaults to node","        * @type Node","        */","        dragNode: {","            setter: function(node) {","                if (this._canDrag(node)) {","                    return node;","                }","                var n = Y.one(node);","                if (!n) {","                    Y.error('DD.Drag: Invalid dragNode Given: ' + node);","                }","                return n;","            }","        },","        /**","        * @attribute offsetNode","        * @description Offset the drag element by the difference in cursor position: default true","        * @type Boolean","        */","        offsetNode: {","            value: true","        },","        /**","        * @attribute startCentered","        * @description Center the dragNode to the mouse position on drag:start: default false","        * @type Boolean","        */","        startCentered: {","            value: false","        },","        /**","        * @attribute clickPixelThresh","        * @description The number of pixels to move to start a drag operation, default is 3.","        * @type Number","        */","        clickPixelThresh: {","            value: DDM.get('clickPixelThresh')","        },","        /**","        * @attribute clickTimeThresh","        * @description The number of milliseconds a mousedown has to pass to start a drag operation, default is 1000.","        * @type Number","        */","        clickTimeThresh: {","            value: DDM.get('clickTimeThresh')","        },","        /**","        * @attribute lock","        * @description Set to lock this drag element so that it can't be dragged: default false.","        * @type Boolean","        */","        lock: {","            value: false,","            setter: function(lock) {","                if (lock) {","                    this.get(NODE).addClass(DDM.CSS_PREFIX + '-locked');","                } else {","                    this.get(NODE).removeClass(DDM.CSS_PREFIX + '-locked');","                }","                return lock;","            }","        },","        /**","        * @attribute data","        * @description A payload holder to store arbitrary data about this drag object, can be used to store any value.","        * @type Mixed","        */","        data: {","            value: false","        },","        /**","        * @attribute move","        * @description If this is false, the drag element will not move with the cursor: default true. Can be used to \"resize\" the element.","        * @type Boolean","        */","        move: {","            value: true","        },","        /**","        * @attribute useShim","        * @description Use the protective shim on all drag operations: default true. Only works with dd-ddm, not dd-ddm-base.","        * @type Boolean","        */","        useShim: {","            value: true","        },","        /**","        * Config option is set by Drag to inform you of which handle fired the drag event (in the case that there are several handles): default false.","        * @attribute activeHandle","        * @type Node","        */","        activeHandle: {","            value: false","        },","        /**","        * By default a drag operation will only begin if the mousedown occurred with the primary mouse button.","        * Setting this to false will allow for all mousedown events to trigger a drag.","        * @attribute primaryButtonOnly","        * @type Boolean","        */","        primaryButtonOnly: {","            value: true","        },","        /**","        * This attribute is not meant to be used by the implementor, it is meant to be used as an Event tracker so you can listen for it to change.","        * @attribute dragging","        * @type Boolean","        */","        dragging: {","            value: false","        },","        parent: {","            value: false","        },","        /**","        * @attribute target","        * @description This attribute only works if the dd-drop module has been loaded. It will make this node a drop target as well as draggable.","        * @type Boolean","        */","        target: {","            value: false,","            setter: function(config) {","                this._handleTarget(config);","                return config;","            }","        },","        /**","        * This attribute only works if the dd-drop module is active. It will set the dragMode (point, intersect, strict) of this Drag instance.","        * @attribute dragMode","        * @type String","        */","        dragMode: {","            value: null,","            setter: function(mode) {","                return DDM._setDragMode(mode);","            }","        },","        /**","        * @attribute groups","        * @description Array of groups to add this drag into.","        * @type Array","        */","        groups: {","            value: ['default'],","            getter: function() {","                if (!this._groups) {","                    this._groups = {};","                }","                var ret = [];","                Y.each(this._groups, function(v, k) {","                    ret[ret.length] = k;","                });","                return ret;","            },","            setter: function(g) {","                this._groups = {};","                Y.each(g, function(v) {","                    this._groups[v] = true;","                }, this);","                return g;","            }","        },","        /**","        * @attribute handles","        * @description Array of valid handles to add. Adding something here will set all handles, even if previously added with addHandle","        * @type Array","        */","        handles: {","            value: null,","            setter: function(g) {","                if (g) {","                    this._handles = {};","                    Y.each(g, function(v) {","                        var key = v;","                        if (v instanceof Y.Node || v instanceof Y.NodeList) {","                            key = v._yuid;","                        }","                        this._handles[key] = v;","                    }, this);","                } else {","                    this._handles = null;","                }","                return g;","            }","        },","        /**","        * Controls the default bubble parent for this Drag instance. Default: Y.DD.DDM. Set to false to disable bubbling. Use bubbleTargets in config","        * @deprecated","        * @attribute bubbles","        * @type Object","        */","        bubbles: {","            setter: function(t) {","                this.addTarget(t);","                return t;","            }","        },","        /**","        * @attribute haltDown","        * @description Should the mousedown event be halted. Default: true","        * @type Boolean","        */","        haltDown: {","            value: true","        }","    };","","    Y.extend(Drag, Y.Base, {","        /**","        * Checks the object for the methods needed to drag the object around.","        * Normally this would be a node instance, but in the case of Graphics, it","        * may be an SVG node or something similar.","        * @method _canDrag","        * @private","        * @param {Object} n The object to check","        * @return {Boolean} True or false if the Object contains the methods needed to Drag","        */","        _canDrag: function(n) {","            if (n && n.setXY && n.getXY && n.test && n.contains) {","                return true;","            }","            return false;","        },","        /**","        * @private","        * @property _bubbleTargets","        * @description The default bubbleTarget for this object. Default: Y.DD.DDM","        */","        _bubbleTargets: Y.DD.DDM,","        /**","        * @method addToGroup","        * @description Add this Drag instance to a group, this should be used for on-the-fly group additions.","        * @param {String} g The group to add this Drag Instance to.","        * @return {Self}","        * @chainable","        */","        addToGroup: function(g) {","            this._groups[g] = true;","            DDM._activateTargets();","            return this;","        },","        /**","        * @method removeFromGroup","        * @description Remove this Drag instance from a group, this should be used for on-the-fly group removals.","        * @param {String} g The group to remove this Drag Instance from.","        * @return {Self}","        * @chainable","        */","        removeFromGroup: function(g) {","            delete this._groups[g];","            DDM._activateTargets();","            return this;","        },","        /**","        * @property target","        * @description This will be a reference to the Drop instance associated with this drag if the target: true config attribute is set..","        * @type {Object}","        */","        target: null,","        /**","        * @private","        * @method _handleTarget","        * @description Attribute handler for the target config attribute.","        * @param {Boolean/Object} config The Config","        */","        _handleTarget: function(config) {","            if (Y.DD.Drop) {","                if (config === false) {","                    if (this.target) {","                        DDM._unregTarget(this.target);","                        this.target = null;","                    }","                } else {","                    if (!Y.Lang.isObject(config)) {","                        config = {};","                    }","                    config.bubbleTargets = config.bubbleTargets || Y.Object.values(this._yuievt.targets);","                    config.node = this.get(NODE);","                    config.groups = config.groups || this.get('groups');","                    this.target = new Y.DD.Drop(config);","                }","            }","        },","        /**","        * @private","        * @property _groups","        * @description Storage Array for the groups this drag belongs to.","        * @type {Array}","        */","        _groups: null,","        /**","        * @private","        * @method _createEvents","        * @description This method creates all the events for this Event Target and publishes them so we get Event Bubbling.","        */","        _createEvents: function() {","","            this.publish(EV_MOUSE_DOWN, {","                defaultFn: this._defMouseDownFn,","                queuable: false,","                emitFacade: true,","                bubbles: true,","                prefix: 'drag'","            });","","            this.publish(EV_ALIGN, {","                defaultFn: this._defAlignFn,","                queuable: false,","                emitFacade: true,","                bubbles: true,","                prefix: 'drag'","            });","","            this.publish(EV_DRAG, {","                defaultFn: this._defDragFn,","                queuable: false,","                emitFacade: true,","                bubbles: true,","                prefix: 'drag'","            });","","            this.publish(EV_END, {","                defaultFn: this._defEndFn,","                preventedFn: this._prevEndFn,","                queuable: false,","                emitFacade: true,","                bubbles: true,","                prefix: 'drag'","            });","","            var ev = [","                EV_AFTER_MOUSE_DOWN,","                EV_REMOVE_HANDLE,","                EV_ADD_HANDLE,","                EV_REMOVE_INVALID,","                EV_ADD_INVALID,","                EV_START,","                'drag:drophit',","                'drag:dropmiss',","                'drag:over',","                'drag:enter',","                'drag:exit'","            ];","","            Y.each(ev, function(v) {","                this.publish(v, {","                    type: v,","                    emitFacade: true,","                    bubbles: true,","                    preventable: false,","                    queuable: false,","                    prefix: 'drag'","                });","            }, this);","        },","        /**","        * @private","        * @property _ev_md","        * @description A private reference to the mousedown DOM event","        * @type {EventFacade}","        */","        _ev_md: null,","        /**","        * @private","        * @property _startTime","        * @description The getTime of the mousedown event. Not used, just here in case someone wants/needs to use it.","        * @type Date","        */","        _startTime: null,","        /**","        * @private","        * @property _endTime","        * @description The getTime of the mouseup event. Not used, just here in case someone wants/needs to use it.","        * @type Date","        */","        _endTime: null,","        /**","        * @private","        * @property _handles","        * @description A private hash of the valid drag handles","        * @type {Object}","        */","        _handles: null,","        /**","        * @private","        * @property _invalids","        * @description A private hash of the invalid selector strings","        * @type {Object}","        */","        _invalids: null,","        /**","        * A private hash of the default invalid selector strings: {'textarea': true, 'input': true, 'a': true, 'button': true, 'select': true}","        * @private","        * @property _invalidsDefault","        * @type {Object}","        */","        _invalidsDefault: {'textarea': true, 'input': true, 'a': true, 'button': true, 'select': true },","        /**","        * @private","        * @property _dragThreshMet","        * @description Private flag to see if the drag threshhold was met","        * @type {Boolean}","        */","        _dragThreshMet: null,","        /**","        * @private","        * @property _fromTimeout","        * @description Flag to determine if the drag operation came from a timeout","        * @type {Boolean}","        */","        _fromTimeout: null,","        /**","        * @private","        * @property _clickTimeout","        * @description Holder for the setTimeout call","        * @type {Boolean}","        */","        _clickTimeout: null,","        /**","        * @property deltaXY","        * @description The offset of the mouse position to the element's position","        * @type {Array}","        */","        deltaXY: null,","        /**","        * @property startXY","        * @description The initial mouse position","        * @type {Array}","        */","        startXY: null,","        /**","        * @property nodeXY","        * @description The initial element position","        * @type {Array}","        */","        nodeXY: null,","        /**","        * @property lastXY","        * @description The position of the element as it's moving (for offset calculations)","        * @type {Array}","        */","        lastXY: null,","        /**","        * @property actXY","        * @description The xy that the node will be set to. Changing this will alter the position as it's dragged.","        * @type {Array}","        */","        actXY: null,","        /**","        * @property realXY","        * @description The real xy position of the node.","        * @type {Array}","        */","        realXY: null,","        /**","        * @property mouseXY","        * @description The XY coords of the mousemove","        * @type {Array}","        */","        mouseXY: null,","        /**","        * @property region","        * @description A region object associated with this drag, used for checking regions while dragging.","        * @type Object","        */","        region: null,","        /**","        * @private","        * @method _handleMouseUp","        * @description Handler for the mouseup DOM event","        * @param {EventFacade} ev The Event","        */","        _handleMouseUp: function() {","            this.fire('drag:mouseup');","            this._fixIEMouseUp();","            if (DDM.activeDrag) {","                DDM._end();","            }","        },","        /**","        * The function we use as the ondragstart handler when we start a drag","        * in Internet Explorer. This keeps IE from blowing up on images as drag handles.","        * @private","        * @method _fixDragStart","        * @param {Event} e The Event","        */","        _fixDragStart: function(e) {","            if (this.validClick(e)) {","                e.preventDefault();","            }","        },","        /**","        * @private","        * @method _ieSelectFix","        * @description The function we use as the onselectstart handler when we start a drag in Internet Explorer","        */","        _ieSelectFix: function() {","            return false;","        },","        /**","        * @private","        * @property _ieSelectBack","        * @description We will hold a copy of the current \"onselectstart\" method on this property, and reset it after we are done using it.","        */","        _ieSelectBack: null,","        /**","        * @private","        * @method _fixIEMouseDown","        * @description This method copies the onselectstart listner on the document to the _ieSelectFix property","        */","        _fixIEMouseDown: function() {","            if (Y.UA.ie) {","                this._ieSelectBack = Y.config.doc.body.onselectstart;","                Y.config.doc.body.onselectstart = this._ieSelectFix;","            }","        },","        /**","        * @private","        * @method _fixIEMouseUp","        * @description This method copies the _ieSelectFix property back to the onselectstart listner on the document.","        */","        _fixIEMouseUp: function() {","            if (Y.UA.ie) {","                Y.config.doc.body.onselectstart = this._ieSelectBack;","            }","        },","        /**","        * @private","        * @method _handleMouseDownEvent","        * @description Handler for the mousedown DOM event","        * @param {EventFacade} ev  The Event","        */","        _handleMouseDownEvent: function(ev) {","            this.fire(EV_MOUSE_DOWN, { ev: ev });","        },","        /**","        * @private","        * @method _defMouseDownFn","        * @description Handler for the mousedown DOM event","        * @param {EventFacade} e  The Event","        */","        _defMouseDownFn: function(e) {","            var ev = e.ev;","","            this._dragThreshMet = false;","            this._ev_md = ev;","","            if (this.get('primaryButtonOnly') && ev.button > 1) {","                return false;","            }","            if (this.validClick(ev)) {","                this._fixIEMouseDown(ev);","                if (Drag.START_EVENT.indexOf('gesture') !== 0) {","                    //Only do these if it's not a gesture","                    if (this.get('haltDown')) {","                        ev.halt();","                    } else {","                        ev.preventDefault();","                    }","                }","","                this._setStartPosition([ev.pageX, ev.pageY]);","","                DDM.activeDrag = this;","","                this._clickTimeout = Y.later(this.get('clickTimeThresh'), this, this._timeoutCheck);","            }","            this.fire(EV_AFTER_MOUSE_DOWN, { ev: ev });","        },","        /**","        * Method first checks to see if we have handles, if so it validates the click","        * against the handle. Then if it finds a valid handle, it checks it against","        * the invalid handles list. Returns true if a good handle was used, false otherwise.","        * @method validClick","        * @param {EventFacade} ev  The Event","        * @return {Boolean}","        */","        validClick: function(ev) {","            var r = false, n = false,","            tar = ev.target,","            hTest = null,","            els = null,","            nlist = null,","            set = false;","            if (this._handles) {","                Y.each(this._handles, function(i, n) {","                    if (i instanceof Y.Node || i instanceof Y.NodeList) {","                        if (!r) {","                            nlist = i;","                            if (nlist instanceof Y.Node) {","                                nlist = new Y.NodeList(i._node);","                            }","                            nlist.each(function(nl) {","                                if (nl.contains(tar)) {","                                    r = true;","                                }","                            });","                        }","                    } else if (Y.Lang.isString(n)) {","                        //Am I this or am I inside this","                        if (tar.test(n + ', ' + n + ' *') && !hTest) {","                            hTest = n;","                            r = true;","                        }","                    }","                });","            } else {","                n = this.get(NODE);","                if (n.contains(tar) || n.compareTo(tar)) {","                    r = true;","                }","            }","            if (r) {","                if (this._invalids) {","                    Y.each(this._invalids, function(i, n) {","                        if (Y.Lang.isString(n)) {","                            //Am I this or am I inside this","                            if (tar.test(n + ', ' + n + ' *')) {","                                r = false;","                            }","                        }","                    });","                }","            }","            if (r) {","                if (hTest) {","                    els = ev.currentTarget.all(hTest);","                    set = false;","                    els.each(function(n) {","                        if ((n.contains(tar) || n.compareTo(tar)) && !set) {","                            set = true;","                            this.set('activeHandle', n);","                        }","                    }, this);","                } else {","                    this.set('activeHandle', this.get(NODE));","                }","            }","            return r;","        },","        /**","        * @private","        * @method _setStartPosition","        * @description Sets the current position of the Element and calculates the offset","        * @param {Array} xy The XY coords to set the position to.","        */","        _setStartPosition: function(xy) {","            this.startXY = xy;","","            this.nodeXY = this.lastXY = this.realXY = this.get(NODE).getXY();","","            if (this.get('offsetNode')) {","                this.deltaXY = [(this.startXY[0] - this.nodeXY[0]), (this.startXY[1] - this.nodeXY[1])];","            } else {","                this.deltaXY = [0, 0];","            }","        },","        /**","        * @private","        * @method _timeoutCheck","        * @description The method passed to setTimeout to determine if the clickTimeThreshold was met.","        */","        _timeoutCheck: function() {","            if (!this.get('lock') && !this._dragThreshMet && this._ev_md) {","                this._fromTimeout = this._dragThreshMet = true;","                this.start();","                this._alignNode([this._ev_md.pageX, this._ev_md.pageY], true);","            }","        },","        /**","        * @method removeHandle","        * @description Remove a Selector added by addHandle","        * @param {String} str The selector for the handle to be removed.","        * @return {Self}","        * @chainable","        */","        removeHandle: function(str) {","            var key = str;","            if (str instanceof Y.Node || str instanceof Y.NodeList) {","                key = str._yuid;","            }","            if (this._handles[key]) {","                delete this._handles[key];","                this.fire(EV_REMOVE_HANDLE, { handle: str });","            }","            return this;","        },","        /**","        * @method addHandle","        * @description Add a handle to a drag element. Drag only initiates when a mousedown happens on this element.","        * @param {String} str The selector to test for a valid handle. Must be a child of the element.","        * @return {Self}","        * @chainable","        */","        addHandle: function(str) {","            if (!this._handles) {","                this._handles = {};","            }","            var key = str;","            if (str instanceof Y.Node || str instanceof Y.NodeList) {","                key = str._yuid;","            }","            this._handles[key] = str;","            this.fire(EV_ADD_HANDLE, { handle: str });","            return this;","        },","        /**","        * @method removeInvalid","        * @description Remove an invalid handle added by addInvalid","        * @param {String} str The invalid handle to remove from the internal list.","        * @return {Self}","        * @chainable","        */","        removeInvalid: function(str) {","            if (this._invalids[str]) {","                this._invalids[str] = null;","                delete this._invalids[str];","                this.fire(EV_REMOVE_INVALID, { handle: str });","            }","            return this;","        },","        /**","        * @method addInvalid","        * @description Add a selector string to test the handle against. If the test passes the drag operation will not continue.","        * @param {String} str The selector to test against to determine if this is an invalid drag handle.","        * @return {Self}","        * @chainable","        */","        addInvalid: function(str) {","            if (Y.Lang.isString(str)) {","                this._invalids[str] = true;","                this.fire(EV_ADD_INVALID, { handle: str });","            }","            return this;","        },","        /**","        * @private","        * @method initializer","        * @description Internal init handler","        */","        initializer: function() {","","            this.get(NODE).dd = this;","","            if (!this.get(NODE).get('id')) {","                var id = Y.stamp(this.get(NODE));","                this.get(NODE).set('id', id);","            }","","            this.actXY = [];","","            this._invalids = Y.clone(this._invalidsDefault, true);","","            this._createEvents();","","            if (!this.get(DRAG_NODE)) {","                this.set(DRAG_NODE, this.get(NODE));","            }","","            //Fix for #2528096","            //Don't prep the DD instance until all plugins are loaded.","            this.on('initializedChange', Y.bind(this._prep, this));","","            //Shouldn't have to do this..","            this.set('groups', this.get('groups'));","        },","        /**","        * @private","        * @method _prep","        * @description Attach event listners and add classname","        */","        _prep: function() {","            this._dragThreshMet = false;","            var node = this.get(NODE);","            node.addClass(DDM.CSS_PREFIX + '-draggable');","            node.on(Drag.START_EVENT, Y.bind(this._handleMouseDownEvent, this));","            node.on('mouseup', Y.bind(this._handleMouseUp, this));","            node.on('dragstart', Y.bind(this._fixDragStart, this));","        },","        /**","        * @private","        * @method _unprep","        * @description Detach event listeners and remove classname","        */","        _unprep: function() {","            var node = this.get(NODE);","            node.removeClass(DDM.CSS_PREFIX + '-draggable');","            node.detachAll('mouseup');","            node.detachAll('dragstart');","            node.detachAll(Drag.START_EVENT);","            this.mouseXY = [];","            this.deltaXY = [0,0];","            this.startXY = [];","            this.nodeXY = [];","            this.lastXY = [];","            this.actXY = [];","            this.realXY = [];","        },","        /**","        * @method start","        * @description Starts the drag operation","        * @return {Self}","        * @chainable","        */","        start: function() {","            if (!this.get('lock') && !this.get(DRAGGING)) {","                var node = this.get(NODE), ow, oh, xy;","                this._startTime = (new Date()).getTime();","","                DDM._start();","                node.addClass(DDM.CSS_PREFIX + '-dragging');","                this.fire(EV_START, {","                    pageX: this.nodeXY[0],","                    pageY: this.nodeXY[1],","                    startTime: this._startTime","                });","                node = this.get(DRAG_NODE);","                xy = this.nodeXY;","","                ow = node.get(OFFSET_WIDTH);","                oh = node.get(OFFSET_HEIGHT);","","                if (this.get('startCentered')) {","                    this._setStartPosition([xy[0] + (ow / 2), xy[1] + (oh / 2)]);","                }","","","                this.region = {","                    '0': xy[0],","                    '1': xy[1],","                    area: 0,","                    top: xy[1],","                    right: xy[0] + ow,","                    bottom: xy[1] + oh,","                    left: xy[0]","                };","                this.set(DRAGGING, true);","            }","            return this;","        },","        /**","        * @method end","        * @description Ends the drag operation","        * @return {Self}","        * @chainable","        */","        end: function() {","            this._endTime = (new Date()).getTime();","            if (this._clickTimeout) {","                this._clickTimeout.cancel();","            }","            this._dragThreshMet = this._fromTimeout = false;","","            if (!this.get('lock') && this.get(DRAGGING)) {","                this.fire(EV_END, {","                    pageX: this.lastXY[0],","                    pageY: this.lastXY[1],","                    startTime: this._startTime,","                    endTime: this._endTime","                });","            }","            this.get(NODE).removeClass(DDM.CSS_PREFIX + '-dragging');","            this.set(DRAGGING, false);","            this.deltaXY = [0, 0];","","            return this;","        },","        /**","        * @private","        * @method _defEndFn","        * @description Handler for fixing the selection in IE","        */","        _defEndFn: function() {","            this._fixIEMouseUp();","            this._ev_md = null;","        },","        /**","        * @private","        * @method _prevEndFn","        * @description Handler for preventing the drag:end event. It will reset the node back to it's start position","        */","        _prevEndFn: function() {","            this._fixIEMouseUp();","            //Bug #1852577","            this.get(DRAG_NODE).setXY(this.nodeXY);","            this._ev_md = null;","            this.region = null;","        },","        /**","        * @private","        * @method _align","        * @description Calculates the offsets and set's the XY that the element will move to.","        * @param {Array} xy The xy coords to align with.","        */","        _align: function(xy) {","            this.fire(EV_ALIGN, {pageX: xy[0], pageY: xy[1] });","        },","        /**","        * @private","        * @method _defAlignFn","        * @description Calculates the offsets and set's the XY that the element will move to.","        * @param {EventFacade} e The drag:align event.","        */","        _defAlignFn: function(e) {","            this.actXY = [e.pageX - this.deltaXY[0], e.pageY - this.deltaXY[1]];","        },","        /**","        * @private","        * @method _alignNode","        * @description This method performs the alignment before the element move.","        * @param {Array} eXY The XY to move the element to, usually comes from the mousemove DOM event.","        */","        _alignNode: function(eXY, scroll) {","            this._align(eXY);","            if (!scroll) {","                this._moveNode();","            }","        },","        /**","        * @private","        * @method _moveNode","        * @description This method performs the actual element move.","        */","        _moveNode: function(scroll) {","            //if (!this.get(DRAGGING)) {","            //    return;","            //}","            var diffXY = [], diffXY2 = [], startXY = this.nodeXY, xy = this.actXY;","","            diffXY[0] = (xy[0] - this.lastXY[0]);","            diffXY[1] = (xy[1] - this.lastXY[1]);","","            diffXY2[0] = (xy[0] - this.nodeXY[0]);","            diffXY2[1] = (xy[1] - this.nodeXY[1]);","","","            this.region = {","                '0': xy[0],","                '1': xy[1],","                area: 0,","                top: xy[1],","                right: xy[0] + this.get(DRAG_NODE).get(OFFSET_WIDTH),","                bottom: xy[1] + this.get(DRAG_NODE).get(OFFSET_HEIGHT),","                left: xy[0]","            };","","            this.fire(EV_DRAG, {","                pageX: xy[0],","                pageY: xy[1],","                scroll: scroll,","                info: {","                    start: startXY,","                    xy: xy,","                    delta: diffXY,","                    offset: diffXY2","                }","            });","","            this.lastXY = xy;","        },","        /**","        * @private","        * @method _defDragFn","        * @description Default function for drag:drag. Fired from _moveNode.","        * @param {EventFacade} ev The drag:drag event","        */","        _defDragFn: function(e) {","            if (this.get('move')) {","                if (e.scroll && e.scroll.node) {","                    e.scroll.node.set('scrollTop', e.scroll.top);","                    e.scroll.node.set('scrollLeft', e.scroll.left);","                }","                this.get(DRAG_NODE).setXY([e.pageX, e.pageY]);","                this.realXY = [e.pageX, e.pageY];","            }","        },","        /**","        * @private","        * @method _move","        * @description Fired from DragDropMgr (DDM) on mousemove.","        * @param {EventFacade} ev The mousemove DOM event","        */","        _move: function(ev) {","            if (this.get('lock')) {","                return false;","            }","","            this.mouseXY = [ev.pageX, ev.pageY];","            if (!this._dragThreshMet) {","                var diffX = Math.abs(this.startXY[0] - ev.pageX),","                diffY = Math.abs(this.startXY[1] - ev.pageY);","                if (diffX > this.get('clickPixelThresh') || diffY > this.get('clickPixelThresh')) {","                    this._dragThreshMet = true;","                    this.start();","                    //This only happens on gestures to stop the page from scrolling","                    if (ev && ev.preventDefault) {","                        ev.preventDefault();","                    }","                    this._alignNode([ev.pageX, ev.pageY]);","                }","            } else {","                if (this._clickTimeout) {","                    this._clickTimeout.cancel();","                }","                this._alignNode([ev.pageX, ev.pageY]);","            }","        },","        /**","        * @method stopDrag","        * @description Method will forcefully stop a drag operation. For example calling this from inside an ESC keypress handler will stop this drag.","        * @return {Self}","        * @chainable","        */","        stopDrag: function() {","            if (this.get(DRAGGING)) {","                DDM._end();","            }","            return this;","        },","        /**","        * @private","        * @method destructor","        * @description Lifecycle destructor, unreg the drag from the DDM and remove listeners","        */","        destructor: function() {","            this._unprep();","            if (this.target) {","                this.target.destroy();","            }","            DDM._unregDrag(this);","        }","    });","    Y.namespace('DD');","    Y.DD.Drag = Drag;","","","","","}, '3.7.3', {\"requires\": [\"dd-ddm-base\"]});"];
_yuitest_coverage["build/dd-drag/dd-drag.js"].lines = {"1":0,"17":0,"195":0,"196":0,"198":0,"199":0,"200":0,"204":0,"211":0,"213":0,"221":0,"222":0,"224":0,"225":0,"226":0,"228":0,"238":0,"239":0,"241":0,"242":0,"243":0,"245":0,"288":0,"289":0,"291":0,"293":0,"356":0,"357":0,"368":0,"379":0,"380":0,"382":0,"383":0,"384":0,"386":0,"389":0,"390":0,"391":0,"393":0,"404":0,"405":0,"406":0,"407":0,"408":0,"409":0,"411":0,"414":0,"416":0,"427":0,"428":0,"441":0,"452":0,"453":0,"455":0,"471":0,"472":0,"473":0,"483":0,"484":0,"485":0,"500":0,"501":0,"502":0,"503":0,"504":0,"507":0,"508":0,"510":0,"511":0,"512":0,"513":0,"531":0,"539":0,"547":0,"555":0,"564":0,"578":0,"579":0,"707":0,"708":0,"709":0,"710":0,"721":0,"722":0,"731":0,"745":0,"746":0,"747":0,"756":0,"757":0,"767":0,"776":0,"778":0,"779":0,"781":0,"782":0,"784":0,"785":0,"786":0,"788":0,"789":0,"791":0,"795":0,"797":0,"799":0,"801":0,"812":0,"818":0,"819":0,"820":0,"821":0,"822":0,"823":0,"824":0,"826":0,"827":0,"828":0,"832":0,"834":0,"835":0,"836":0,"841":0,"842":0,"843":0,"846":0,"847":0,"848":0,"849":0,"851":0,"852":0,"858":0,"859":0,"860":0,"861":0,"862":0,"863":0,"864":0,"865":0,"869":0,"872":0,"881":0,"883":0,"885":0,"886":0,"888":0,"897":0,"898":0,"899":0,"900":0,"911":0,"912":0,"913":0,"915":0,"916":0,"917":0,"919":0,"929":0,"930":0,"932":0,"933":0,"934":0,"936":0,"937":0,"938":0,"948":0,"949":0,"950":0,"951":0,"953":0,"963":0,"964":0,"965":0,"967":0,"976":0,"978":0,"979":0,"980":0,"983":0,"985":0,"987":0,"989":0,"990":0,"995":0,"998":0,"1006":0,"1007":0,"1008":0,"1009":0,"1010":0,"1011":0,"1019":0,"1020":0,"1021":0,"1022":0,"1023":0,"1024":0,"1025":0,"1026":0,"1027":0,"1028":0,"1029":0,"1030":0,"1039":0,"1040":0,"1041":0,"1043":0,"1044":0,"1045":0,"1050":0,"1051":0,"1053":0,"1054":0,"1056":0,"1057":0,"1061":0,"1070":0,"1072":0,"1081":0,"1082":0,"1083":0,"1085":0,"1087":0,"1088":0,"1095":0,"1096":0,"1097":0,"1099":0,"1107":0,"1108":0,"1116":0,"1118":0,"1119":0,"1120":0,"1129":0,"1138":0,"1147":0,"1148":0,"1149":0,"1161":0,"1163":0,"1164":0,"1166":0,"1167":0,"1170":0,"1180":0,"1192":0,"1201":0,"1202":0,"1203":0,"1204":0,"1206":0,"1207":0,"1217":0,"1218":0,"1221":0,"1222":0,"1223":0,"1225":0,"1226":0,"1227":0,"1229":0,"1230":0,"1232":0,"1235":0,"1236":0,"1238":0,"1248":0,"1249":0,"1251":0,"1259":0,"1260":0,"1261":0,"1263":0,"1266":0,"1267":0};
_yuitest_coverage["build/dd-drag/dd-drag.js"].functions = {"Drag:194":0,"setter:220":0,"setter:237":0,"setter:287":0,"setter:355":0,"setter:367":0,"(anonymous 2):383":0,"getter:378":0,"(anonymous 3):390":0,"setter:388":0,"(anonymous 4):406":0,"setter:403":0,"setter:426":0,"_canDrag:451":0,"addToGroup:470":0,"removeFromGroup:482":0,"_handleTarget:499":0,"(anonymous 5):578":0,"_createEvents:529":0,"_handleMouseUp:706":0,"_fixDragStart:720":0,"_ieSelectFix:730":0,"_fixIEMouseDown:744":0,"_fixIEMouseUp:755":0,"_handleMouseDownEvent:766":0,"_defMouseDownFn:775":0,"(anonymous 7):826":0,"(anonymous 6):819":0,"(anonymous 8):848":0,"(anonymous 9):862":0,"validClick:811":0,"_setStartPosition:880":0,"_timeoutCheck:896":0,"removeHandle:910":0,"addHandle:928":0,"removeInvalid:947":0,"addInvalid:962":0,"initializer:974":0,"_prep:1005":0,"_unprep:1018":0,"start:1038":0,"end:1080":0,"_defEndFn:1106":0,"_prevEndFn:1115":0,"_align:1128":0,"_defAlignFn:1137":0,"_alignNode:1146":0,"_moveNode:1157":0,"_defDragFn:1200":0,"_move:1216":0,"stopDrag:1247":0,"destructor:1258":0,"(anonymous 1):1":0};
_yuitest_coverage["build/dd-drag/dd-drag.js"].coveredLines = 275;
_yuitest_coverage["build/dd-drag/dd-drag.js"].coveredFunctions = 53;
_yuitest_coverline("build/dd-drag/dd-drag.js", 1);
YUI.add('dd-drag', function (Y, NAME) {


    /**
     * Provides the ability to drag a Node.
     * @module dd
     * @submodule dd-drag
     */
    /**
     * Provides the ability to drag a Node.
     * @class Drag
     * @extends Base
     * @constructor
     * @namespace DD
     */

    _yuitest_coverfunc("build/dd-drag/dd-drag.js", "(anonymous 1)", 1);
_yuitest_coverline("build/dd-drag/dd-drag.js", 17);
var DDM = Y.DD.DDM,
        NODE = 'node',
        DRAGGING = 'dragging',
        DRAG_NODE = 'dragNode',
        OFFSET_HEIGHT = 'offsetHeight',
        OFFSET_WIDTH = 'offsetWidth',
        /**
        * @event drag:mouseup
        * @description Handles the mouseup DOM event, does nothing internally just fires.
        * @bubbles DDM
        * @type {CustomEvent}
        */
        /**
        * @event drag:mouseDown
        * @description Handles the mousedown DOM event, checks to see if you have a valid handle then starts the drag timers.
        * @preventable _defMouseDownFn
        * @param {EventFacade} event An Event Facade object with the following specific property added:
        * <dl><dt>ev</dt><dd>The original mousedown event.</dd></dl>
        * @bubbles DDM
        * @type {CustomEvent}
        */
        EV_MOUSE_DOWN = 'drag:mouseDown',
        /**
        * @event drag:afterMouseDown
        * @description Fires after the mousedown event has been cleared.
        * @param {EventFacade} event An Event Facade object with the following specific property added:
        * <dl><dt>ev</dt><dd>The original mousedown event.</dd></dl>
        * @bubbles DDM
        * @type {CustomEvent}
        */
        EV_AFTER_MOUSE_DOWN = 'drag:afterMouseDown',
        /**
        * @event drag:removeHandle
        * @description Fires after a handle is removed.
        * @param {EventFacade} event An Event Facade object with the following specific property added:
        * <dl><dt>handle</dt><dd>The handle that was removed.</dd></dl>
        * @bubbles DDM
        * @type {CustomEvent}
        */
        EV_REMOVE_HANDLE = 'drag:removeHandle',
        /**
        * @event drag:addHandle
        * @description Fires after a handle is added.
        * @param {EventFacade} event An Event Facade object with the following specific property added:
        * <dl><dt>handle</dt><dd>The handle that was added.</dd></dl>
        * @bubbles DDM
        * @type {CustomEvent}
        */
        EV_ADD_HANDLE = 'drag:addHandle',
        /**
        * @event drag:removeInvalid
        * @description Fires after an invalid selector is removed.
        * @param {EventFacade} event An Event Facade object with the following specific property added:
        * <dl><dt>handle</dt><dd>The handle that was removed.</dd></dl>
        * @bubbles DDM
        * @type {CustomEvent}
        */
        EV_REMOVE_INVALID = 'drag:removeInvalid',
        /**
        * @event drag:addInvalid
        * @description Fires after an invalid selector is added.
        * @param {EventFacade} event An Event Facade object with the following specific property added:
        * <dl><dt>handle</dt><dd>The handle that was added.</dd></dl>
        * @bubbles DDM
        * @type {CustomEvent}
        */
        EV_ADD_INVALID = 'drag:addInvalid',
        /**
        * @event drag:start
        * @description Fires at the start of a drag operation.
        * @param {EventFacade} event An Event Facade object with the following specific property added:
        * <dl>
        * <dt>pageX</dt><dd>The original node position X.</dd>
        * <dt>pageY</dt><dd>The original node position Y.</dd>
        * <dt>startTime</dt><dd>The startTime of the event. getTime on the current Date object.</dd>
        * </dl>
        * @bubbles DDM
        * @type {CustomEvent}
        */
        EV_START = 'drag:start',
        /**
        * @event drag:end
        * @description Fires at the end of a drag operation.
        * @param {EventFacade} event An Event Facade object with the following specific property added:
        * <dl>
        * <dt>pageX</dt><dd>The current node position X.</dd>
        * <dt>pageY</dt><dd>The current node position Y.</dd>
        * <dt>startTime</dt><dd>The startTime of the event, from the start event.</dd>
        * <dt>endTime</dt><dd>The endTime of the event. getTime on the current Date object.</dd>
        * </dl>
        * @bubbles DDM
        * @type {CustomEvent}
        */
        EV_END = 'drag:end',
        /**
        * @event drag:drag
        * @description Fires every mousemove during a drag operation.
        * @param {EventFacade} event An Event Facade object with the following specific property added:
        * <dl>
        * <dt>pageX</dt><dd>The current node position X.</dd>
        * <dt>pageY</dt><dd>The current node position Y.</dd>
        * <dt>scroll</dt><dd>Should a scroll action occur.</dd>
        * <dt>info</dt><dd>Object hash containing calculated XY arrays: start, xy, delta, offset</dd>
        * </dl>
        * @bubbles DDM
        * @type {CustomEvent}
        */
        EV_DRAG = 'drag:drag',
        /**
        * @event drag:align
        * @preventable _defAlignFn
        * @description Fires when this node is aligned.
        * @param {EventFacade} event An Event Facade object with the following specific property added:
        * <dl>
        * <dt>pageX</dt><dd>The current node position X.</dd>
        * <dt>pageY</dt><dd>The current node position Y.</dd>
        * </dl>
        * @bubbles DDM
        * @type {CustomEvent}
        */
        EV_ALIGN = 'drag:align',
        /**
        * @event drag:over
        * @description Fires when this node is over a Drop Target. (Fired from dd-drop)
        * @param {EventFacade} event An Event Facade object with the following specific property added:
        * <dl>
        * <dt>drop</dt><dd>The drop object at the time of the event.</dd>
        * <dt>drag</dt><dd>The drag object at the time of the event.</dd>
        * </dl>
        * @bubbles DDM
        * @type {CustomEvent}
        */
        /**
        * @event drag:enter
        * @description Fires when this node enters a Drop Target. (Fired from dd-drop)
        * @param {EventFacade} event An Event Facade object with the following specific property added:
        * <dl>
        * <dt>drop</dt><dd>The drop object at the time of the event.</dd>
        * <dt>drag</dt><dd>The drag object at the time of the event.</dd>
        * </dl>
        * @bubbles DDM
        * @type {CustomEvent}
        */
        /**
        * @event drag:exit
        * @description Fires when this node exits a Drop Target. (Fired from dd-drop)
        * @param {EventFacade} event An Event Facade object with the following specific property added:
        * <dl>
        * <dt>drop</dt><dd>The drop object at the time of the event.</dd>
        * </dl>
        * @bubbles DDM
        * @type {CustomEvent}
        */
        /**
        * @event drag:drophit
        * @description Fires when this node is dropped on a valid Drop Target. (Fired from dd-ddm-drop)
        * @param {EventFacade} event An Event Facade object with the following specific property added:
        * <dl>
        * <dt>drop</dt><dd>The best guess on what was dropped on.</dd>
        * <dt>drag</dt><dd>The drag object at the time of the event.</dd>
        * <dt>others</dt><dd>An array of all the other drop targets that was dropped on.</dd>
        * </dl>
        * @bubbles DDM
        * @type {CustomEvent}
        */
        /**
        * @event drag:dropmiss
        * @description Fires when this node is dropped on an invalid Drop Target. (Fired from dd-ddm-drop)
        * @param {EventFacade} event An Event Facade object with the following specific property added:
        * <dl>
        * <dt>pageX</dt><dd>The current node position X.</dd>
        * <dt>pageY</dt><dd>The current node position Y.</dd>
        * </dl>
        * @bubbles DDM
        * @type {CustomEvent}
        */

    Drag = function(o) {
        _yuitest_coverfunc("build/dd-drag/dd-drag.js", "Drag", 194);
_yuitest_coverline("build/dd-drag/dd-drag.js", 195);
this._lazyAddAttrs = false;
        _yuitest_coverline("build/dd-drag/dd-drag.js", 196);
Drag.superclass.constructor.apply(this, arguments);

        _yuitest_coverline("build/dd-drag/dd-drag.js", 198);
var valid = DDM._regDrag(this);
        _yuitest_coverline("build/dd-drag/dd-drag.js", 199);
if (!valid) {
            _yuitest_coverline("build/dd-drag/dd-drag.js", 200);
Y.error('Failed to register node, already in use: ' + o.node);
        }
    };

    _yuitest_coverline("build/dd-drag/dd-drag.js", 204);
Drag.NAME = 'drag';

    /**
    * This property defaults to "mousedown", but when drag-gestures is loaded, it is changed to "gesturemovestart"
    * @static
    * @property START_EVENT
    */
    _yuitest_coverline("build/dd-drag/dd-drag.js", 211);
Drag.START_EVENT = 'mousedown';

    _yuitest_coverline("build/dd-drag/dd-drag.js", 213);
Drag.ATTRS = {
        /**
        * @attribute node
        * @description Y.Node instance to use as the element to initiate a drag operation
        * @type Node
        */
        node: {
            setter: function(node) {
                _yuitest_coverfunc("build/dd-drag/dd-drag.js", "setter", 220);
_yuitest_coverline("build/dd-drag/dd-drag.js", 221);
if (this._canDrag(node)) {
                    _yuitest_coverline("build/dd-drag/dd-drag.js", 222);
return node;
                }
                _yuitest_coverline("build/dd-drag/dd-drag.js", 224);
var n = Y.one(node);
                _yuitest_coverline("build/dd-drag/dd-drag.js", 225);
if (!n) {
                    _yuitest_coverline("build/dd-drag/dd-drag.js", 226);
Y.error('DD.Drag: Invalid Node Given: ' + node);
                }
                _yuitest_coverline("build/dd-drag/dd-drag.js", 228);
return n;
            }
        },
        /**
        * @attribute dragNode
        * @description Y.Node instance to use as the draggable element, defaults to node
        * @type Node
        */
        dragNode: {
            setter: function(node) {
                _yuitest_coverfunc("build/dd-drag/dd-drag.js", "setter", 237);
_yuitest_coverline("build/dd-drag/dd-drag.js", 238);
if (this._canDrag(node)) {
                    _yuitest_coverline("build/dd-drag/dd-drag.js", 239);
return node;
                }
                _yuitest_coverline("build/dd-drag/dd-drag.js", 241);
var n = Y.one(node);
                _yuitest_coverline("build/dd-drag/dd-drag.js", 242);
if (!n) {
                    _yuitest_coverline("build/dd-drag/dd-drag.js", 243);
Y.error('DD.Drag: Invalid dragNode Given: ' + node);
                }
                _yuitest_coverline("build/dd-drag/dd-drag.js", 245);
return n;
            }
        },
        /**
        * @attribute offsetNode
        * @description Offset the drag element by the difference in cursor position: default true
        * @type Boolean
        */
        offsetNode: {
            value: true
        },
        /**
        * @attribute startCentered
        * @description Center the dragNode to the mouse position on drag:start: default false
        * @type Boolean
        */
        startCentered: {
            value: false
        },
        /**
        * @attribute clickPixelThresh
        * @description The number of pixels to move to start a drag operation, default is 3.
        * @type Number
        */
        clickPixelThresh: {
            value: DDM.get('clickPixelThresh')
        },
        /**
        * @attribute clickTimeThresh
        * @description The number of milliseconds a mousedown has to pass to start a drag operation, default is 1000.
        * @type Number
        */
        clickTimeThresh: {
            value: DDM.get('clickTimeThresh')
        },
        /**
        * @attribute lock
        * @description Set to lock this drag element so that it can't be dragged: default false.
        * @type Boolean
        */
        lock: {
            value: false,
            setter: function(lock) {
                _yuitest_coverfunc("build/dd-drag/dd-drag.js", "setter", 287);
_yuitest_coverline("build/dd-drag/dd-drag.js", 288);
if (lock) {
                    _yuitest_coverline("build/dd-drag/dd-drag.js", 289);
this.get(NODE).addClass(DDM.CSS_PREFIX + '-locked');
                } else {
                    _yuitest_coverline("build/dd-drag/dd-drag.js", 291);
this.get(NODE).removeClass(DDM.CSS_PREFIX + '-locked');
                }
                _yuitest_coverline("build/dd-drag/dd-drag.js", 293);
return lock;
            }
        },
        /**
        * @attribute data
        * @description A payload holder to store arbitrary data about this drag object, can be used to store any value.
        * @type Mixed
        */
        data: {
            value: false
        },
        /**
        * @attribute move
        * @description If this is false, the drag element will not move with the cursor: default true. Can be used to "resize" the element.
        * @type Boolean
        */
        move: {
            value: true
        },
        /**
        * @attribute useShim
        * @description Use the protective shim on all drag operations: default true. Only works with dd-ddm, not dd-ddm-base.
        * @type Boolean
        */
        useShim: {
            value: true
        },
        /**
        * Config option is set by Drag to inform you of which handle fired the drag event (in the case that there are several handles): default false.
        * @attribute activeHandle
        * @type Node
        */
        activeHandle: {
            value: false
        },
        /**
        * By default a drag operation will only begin if the mousedown occurred with the primary mouse button.
        * Setting this to false will allow for all mousedown events to trigger a drag.
        * @attribute primaryButtonOnly
        * @type Boolean
        */
        primaryButtonOnly: {
            value: true
        },
        /**
        * This attribute is not meant to be used by the implementor, it is meant to be used as an Event tracker so you can listen for it to change.
        * @attribute dragging
        * @type Boolean
        */
        dragging: {
            value: false
        },
        parent: {
            value: false
        },
        /**
        * @attribute target
        * @description This attribute only works if the dd-drop module has been loaded. It will make this node a drop target as well as draggable.
        * @type Boolean
        */
        target: {
            value: false,
            setter: function(config) {
                _yuitest_coverfunc("build/dd-drag/dd-drag.js", "setter", 355);
_yuitest_coverline("build/dd-drag/dd-drag.js", 356);
this._handleTarget(config);
                _yuitest_coverline("build/dd-drag/dd-drag.js", 357);
return config;
            }
        },
        /**
        * This attribute only works if the dd-drop module is active. It will set the dragMode (point, intersect, strict) of this Drag instance.
        * @attribute dragMode
        * @type String
        */
        dragMode: {
            value: null,
            setter: function(mode) {
                _yuitest_coverfunc("build/dd-drag/dd-drag.js", "setter", 367);
_yuitest_coverline("build/dd-drag/dd-drag.js", 368);
return DDM._setDragMode(mode);
            }
        },
        /**
        * @attribute groups
        * @description Array of groups to add this drag into.
        * @type Array
        */
        groups: {
            value: ['default'],
            getter: function() {
                _yuitest_coverfunc("build/dd-drag/dd-drag.js", "getter", 378);
_yuitest_coverline("build/dd-drag/dd-drag.js", 379);
if (!this._groups) {
                    _yuitest_coverline("build/dd-drag/dd-drag.js", 380);
this._groups = {};
                }
                _yuitest_coverline("build/dd-drag/dd-drag.js", 382);
var ret = [];
                _yuitest_coverline("build/dd-drag/dd-drag.js", 383);
Y.each(this._groups, function(v, k) {
                    _yuitest_coverfunc("build/dd-drag/dd-drag.js", "(anonymous 2)", 383);
_yuitest_coverline("build/dd-drag/dd-drag.js", 384);
ret[ret.length] = k;
                });
                _yuitest_coverline("build/dd-drag/dd-drag.js", 386);
return ret;
            },
            setter: function(g) {
                _yuitest_coverfunc("build/dd-drag/dd-drag.js", "setter", 388);
_yuitest_coverline("build/dd-drag/dd-drag.js", 389);
this._groups = {};
                _yuitest_coverline("build/dd-drag/dd-drag.js", 390);
Y.each(g, function(v) {
                    _yuitest_coverfunc("build/dd-drag/dd-drag.js", "(anonymous 3)", 390);
_yuitest_coverline("build/dd-drag/dd-drag.js", 391);
this._groups[v] = true;
                }, this);
                _yuitest_coverline("build/dd-drag/dd-drag.js", 393);
return g;
            }
        },
        /**
        * @attribute handles
        * @description Array of valid handles to add. Adding something here will set all handles, even if previously added with addHandle
        * @type Array
        */
        handles: {
            value: null,
            setter: function(g) {
                _yuitest_coverfunc("build/dd-drag/dd-drag.js", "setter", 403);
_yuitest_coverline("build/dd-drag/dd-drag.js", 404);
if (g) {
                    _yuitest_coverline("build/dd-drag/dd-drag.js", 405);
this._handles = {};
                    _yuitest_coverline("build/dd-drag/dd-drag.js", 406);
Y.each(g, function(v) {
                        _yuitest_coverfunc("build/dd-drag/dd-drag.js", "(anonymous 4)", 406);
_yuitest_coverline("build/dd-drag/dd-drag.js", 407);
var key = v;
                        _yuitest_coverline("build/dd-drag/dd-drag.js", 408);
if (v instanceof Y.Node || v instanceof Y.NodeList) {
                            _yuitest_coverline("build/dd-drag/dd-drag.js", 409);
key = v._yuid;
                        }
                        _yuitest_coverline("build/dd-drag/dd-drag.js", 411);
this._handles[key] = v;
                    }, this);
                } else {
                    _yuitest_coverline("build/dd-drag/dd-drag.js", 414);
this._handles = null;
                }
                _yuitest_coverline("build/dd-drag/dd-drag.js", 416);
return g;
            }
        },
        /**
        * Controls the default bubble parent for this Drag instance. Default: Y.DD.DDM. Set to false to disable bubbling. Use bubbleTargets in config
        * @deprecated
        * @attribute bubbles
        * @type Object
        */
        bubbles: {
            setter: function(t) {
                _yuitest_coverfunc("build/dd-drag/dd-drag.js", "setter", 426);
_yuitest_coverline("build/dd-drag/dd-drag.js", 427);
this.addTarget(t);
                _yuitest_coverline("build/dd-drag/dd-drag.js", 428);
return t;
            }
        },
        /**
        * @attribute haltDown
        * @description Should the mousedown event be halted. Default: true
        * @type Boolean
        */
        haltDown: {
            value: true
        }
    };

    _yuitest_coverline("build/dd-drag/dd-drag.js", 441);
Y.extend(Drag, Y.Base, {
        /**
        * Checks the object for the methods needed to drag the object around.
        * Normally this would be a node instance, but in the case of Graphics, it
        * may be an SVG node or something similar.
        * @method _canDrag
        * @private
        * @param {Object} n The object to check
        * @return {Boolean} True or false if the Object contains the methods needed to Drag
        */
        _canDrag: function(n) {
            _yuitest_coverfunc("build/dd-drag/dd-drag.js", "_canDrag", 451);
_yuitest_coverline("build/dd-drag/dd-drag.js", 452);
if (n && n.setXY && n.getXY && n.test && n.contains) {
                _yuitest_coverline("build/dd-drag/dd-drag.js", 453);
return true;
            }
            _yuitest_coverline("build/dd-drag/dd-drag.js", 455);
return false;
        },
        /**
        * @private
        * @property _bubbleTargets
        * @description The default bubbleTarget for this object. Default: Y.DD.DDM
        */
        _bubbleTargets: Y.DD.DDM,
        /**
        * @method addToGroup
        * @description Add this Drag instance to a group, this should be used for on-the-fly group additions.
        * @param {String} g The group to add this Drag Instance to.
        * @return {Self}
        * @chainable
        */
        addToGroup: function(g) {
            _yuitest_coverfunc("build/dd-drag/dd-drag.js", "addToGroup", 470);
_yuitest_coverline("build/dd-drag/dd-drag.js", 471);
this._groups[g] = true;
            _yuitest_coverline("build/dd-drag/dd-drag.js", 472);
DDM._activateTargets();
            _yuitest_coverline("build/dd-drag/dd-drag.js", 473);
return this;
        },
        /**
        * @method removeFromGroup
        * @description Remove this Drag instance from a group, this should be used for on-the-fly group removals.
        * @param {String} g The group to remove this Drag Instance from.
        * @return {Self}
        * @chainable
        */
        removeFromGroup: function(g) {
            _yuitest_coverfunc("build/dd-drag/dd-drag.js", "removeFromGroup", 482);
_yuitest_coverline("build/dd-drag/dd-drag.js", 483);
delete this._groups[g];
            _yuitest_coverline("build/dd-drag/dd-drag.js", 484);
DDM._activateTargets();
            _yuitest_coverline("build/dd-drag/dd-drag.js", 485);
return this;
        },
        /**
        * @property target
        * @description This will be a reference to the Drop instance associated with this drag if the target: true config attribute is set..
        * @type {Object}
        */
        target: null,
        /**
        * @private
        * @method _handleTarget
        * @description Attribute handler for the target config attribute.
        * @param {Boolean/Object} config The Config
        */
        _handleTarget: function(config) {
            _yuitest_coverfunc("build/dd-drag/dd-drag.js", "_handleTarget", 499);
_yuitest_coverline("build/dd-drag/dd-drag.js", 500);
if (Y.DD.Drop) {
                _yuitest_coverline("build/dd-drag/dd-drag.js", 501);
if (config === false) {
                    _yuitest_coverline("build/dd-drag/dd-drag.js", 502);
if (this.target) {
                        _yuitest_coverline("build/dd-drag/dd-drag.js", 503);
DDM._unregTarget(this.target);
                        _yuitest_coverline("build/dd-drag/dd-drag.js", 504);
this.target = null;
                    }
                } else {
                    _yuitest_coverline("build/dd-drag/dd-drag.js", 507);
if (!Y.Lang.isObject(config)) {
                        _yuitest_coverline("build/dd-drag/dd-drag.js", 508);
config = {};
                    }
                    _yuitest_coverline("build/dd-drag/dd-drag.js", 510);
config.bubbleTargets = config.bubbleTargets || Y.Object.values(this._yuievt.targets);
                    _yuitest_coverline("build/dd-drag/dd-drag.js", 511);
config.node = this.get(NODE);
                    _yuitest_coverline("build/dd-drag/dd-drag.js", 512);
config.groups = config.groups || this.get('groups');
                    _yuitest_coverline("build/dd-drag/dd-drag.js", 513);
this.target = new Y.DD.Drop(config);
                }
            }
        },
        /**
        * @private
        * @property _groups
        * @description Storage Array for the groups this drag belongs to.
        * @type {Array}
        */
        _groups: null,
        /**
        * @private
        * @method _createEvents
        * @description This method creates all the events for this Event Target and publishes them so we get Event Bubbling.
        */
        _createEvents: function() {

            _yuitest_coverfunc("build/dd-drag/dd-drag.js", "_createEvents", 529);
_yuitest_coverline("build/dd-drag/dd-drag.js", 531);
this.publish(EV_MOUSE_DOWN, {
                defaultFn: this._defMouseDownFn,
                queuable: false,
                emitFacade: true,
                bubbles: true,
                prefix: 'drag'
            });

            _yuitest_coverline("build/dd-drag/dd-drag.js", 539);
this.publish(EV_ALIGN, {
                defaultFn: this._defAlignFn,
                queuable: false,
                emitFacade: true,
                bubbles: true,
                prefix: 'drag'
            });

            _yuitest_coverline("build/dd-drag/dd-drag.js", 547);
this.publish(EV_DRAG, {
                defaultFn: this._defDragFn,
                queuable: false,
                emitFacade: true,
                bubbles: true,
                prefix: 'drag'
            });

            _yuitest_coverline("build/dd-drag/dd-drag.js", 555);
this.publish(EV_END, {
                defaultFn: this._defEndFn,
                preventedFn: this._prevEndFn,
                queuable: false,
                emitFacade: true,
                bubbles: true,
                prefix: 'drag'
            });

            _yuitest_coverline("build/dd-drag/dd-drag.js", 564);
var ev = [
                EV_AFTER_MOUSE_DOWN,
                EV_REMOVE_HANDLE,
                EV_ADD_HANDLE,
                EV_REMOVE_INVALID,
                EV_ADD_INVALID,
                EV_START,
                'drag:drophit',
                'drag:dropmiss',
                'drag:over',
                'drag:enter',
                'drag:exit'
            ];

            _yuitest_coverline("build/dd-drag/dd-drag.js", 578);
Y.each(ev, function(v) {
                _yuitest_coverfunc("build/dd-drag/dd-drag.js", "(anonymous 5)", 578);
_yuitest_coverline("build/dd-drag/dd-drag.js", 579);
this.publish(v, {
                    type: v,
                    emitFacade: true,
                    bubbles: true,
                    preventable: false,
                    queuable: false,
                    prefix: 'drag'
                });
            }, this);
        },
        /**
        * @private
        * @property _ev_md
        * @description A private reference to the mousedown DOM event
        * @type {EventFacade}
        */
        _ev_md: null,
        /**
        * @private
        * @property _startTime
        * @description The getTime of the mousedown event. Not used, just here in case someone wants/needs to use it.
        * @type Date
        */
        _startTime: null,
        /**
        * @private
        * @property _endTime
        * @description The getTime of the mouseup event. Not used, just here in case someone wants/needs to use it.
        * @type Date
        */
        _endTime: null,
        /**
        * @private
        * @property _handles
        * @description A private hash of the valid drag handles
        * @type {Object}
        */
        _handles: null,
        /**
        * @private
        * @property _invalids
        * @description A private hash of the invalid selector strings
        * @type {Object}
        */
        _invalids: null,
        /**
        * A private hash of the default invalid selector strings: {'textarea': true, 'input': true, 'a': true, 'button': true, 'select': true}
        * @private
        * @property _invalidsDefault
        * @type {Object}
        */
        _invalidsDefault: {'textarea': true, 'input': true, 'a': true, 'button': true, 'select': true },
        /**
        * @private
        * @property _dragThreshMet
        * @description Private flag to see if the drag threshhold was met
        * @type {Boolean}
        */
        _dragThreshMet: null,
        /**
        * @private
        * @property _fromTimeout
        * @description Flag to determine if the drag operation came from a timeout
        * @type {Boolean}
        */
        _fromTimeout: null,
        /**
        * @private
        * @property _clickTimeout
        * @description Holder for the setTimeout call
        * @type {Boolean}
        */
        _clickTimeout: null,
        /**
        * @property deltaXY
        * @description The offset of the mouse position to the element's position
        * @type {Array}
        */
        deltaXY: null,
        /**
        * @property startXY
        * @description The initial mouse position
        * @type {Array}
        */
        startXY: null,
        /**
        * @property nodeXY
        * @description The initial element position
        * @type {Array}
        */
        nodeXY: null,
        /**
        * @property lastXY
        * @description The position of the element as it's moving (for offset calculations)
        * @type {Array}
        */
        lastXY: null,
        /**
        * @property actXY
        * @description The xy that the node will be set to. Changing this will alter the position as it's dragged.
        * @type {Array}
        */
        actXY: null,
        /**
        * @property realXY
        * @description The real xy position of the node.
        * @type {Array}
        */
        realXY: null,
        /**
        * @property mouseXY
        * @description The XY coords of the mousemove
        * @type {Array}
        */
        mouseXY: null,
        /**
        * @property region
        * @description A region object associated with this drag, used for checking regions while dragging.
        * @type Object
        */
        region: null,
        /**
        * @private
        * @method _handleMouseUp
        * @description Handler for the mouseup DOM event
        * @param {EventFacade} ev The Event
        */
        _handleMouseUp: function() {
            _yuitest_coverfunc("build/dd-drag/dd-drag.js", "_handleMouseUp", 706);
_yuitest_coverline("build/dd-drag/dd-drag.js", 707);
this.fire('drag:mouseup');
            _yuitest_coverline("build/dd-drag/dd-drag.js", 708);
this._fixIEMouseUp();
            _yuitest_coverline("build/dd-drag/dd-drag.js", 709);
if (DDM.activeDrag) {
                _yuitest_coverline("build/dd-drag/dd-drag.js", 710);
DDM._end();
            }
        },
        /**
        * The function we use as the ondragstart handler when we start a drag
        * in Internet Explorer. This keeps IE from blowing up on images as drag handles.
        * @private
        * @method _fixDragStart
        * @param {Event} e The Event
        */
        _fixDragStart: function(e) {
            _yuitest_coverfunc("build/dd-drag/dd-drag.js", "_fixDragStart", 720);
_yuitest_coverline("build/dd-drag/dd-drag.js", 721);
if (this.validClick(e)) {
                _yuitest_coverline("build/dd-drag/dd-drag.js", 722);
e.preventDefault();
            }
        },
        /**
        * @private
        * @method _ieSelectFix
        * @description The function we use as the onselectstart handler when we start a drag in Internet Explorer
        */
        _ieSelectFix: function() {
            _yuitest_coverfunc("build/dd-drag/dd-drag.js", "_ieSelectFix", 730);
_yuitest_coverline("build/dd-drag/dd-drag.js", 731);
return false;
        },
        /**
        * @private
        * @property _ieSelectBack
        * @description We will hold a copy of the current "onselectstart" method on this property, and reset it after we are done using it.
        */
        _ieSelectBack: null,
        /**
        * @private
        * @method _fixIEMouseDown
        * @description This method copies the onselectstart listner on the document to the _ieSelectFix property
        */
        _fixIEMouseDown: function() {
            _yuitest_coverfunc("build/dd-drag/dd-drag.js", "_fixIEMouseDown", 744);
_yuitest_coverline("build/dd-drag/dd-drag.js", 745);
if (Y.UA.ie) {
                _yuitest_coverline("build/dd-drag/dd-drag.js", 746);
this._ieSelectBack = Y.config.doc.body.onselectstart;
                _yuitest_coverline("build/dd-drag/dd-drag.js", 747);
Y.config.doc.body.onselectstart = this._ieSelectFix;
            }
        },
        /**
        * @private
        * @method _fixIEMouseUp
        * @description This method copies the _ieSelectFix property back to the onselectstart listner on the document.
        */
        _fixIEMouseUp: function() {
            _yuitest_coverfunc("build/dd-drag/dd-drag.js", "_fixIEMouseUp", 755);
_yuitest_coverline("build/dd-drag/dd-drag.js", 756);
if (Y.UA.ie) {
                _yuitest_coverline("build/dd-drag/dd-drag.js", 757);
Y.config.doc.body.onselectstart = this._ieSelectBack;
            }
        },
        /**
        * @private
        * @method _handleMouseDownEvent
        * @description Handler for the mousedown DOM event
        * @param {EventFacade} ev  The Event
        */
        _handleMouseDownEvent: function(ev) {
            _yuitest_coverfunc("build/dd-drag/dd-drag.js", "_handleMouseDownEvent", 766);
_yuitest_coverline("build/dd-drag/dd-drag.js", 767);
this.fire(EV_MOUSE_DOWN, { ev: ev });
        },
        /**
        * @private
        * @method _defMouseDownFn
        * @description Handler for the mousedown DOM event
        * @param {EventFacade} e  The Event
        */
        _defMouseDownFn: function(e) {
            _yuitest_coverfunc("build/dd-drag/dd-drag.js", "_defMouseDownFn", 775);
_yuitest_coverline("build/dd-drag/dd-drag.js", 776);
var ev = e.ev;

            _yuitest_coverline("build/dd-drag/dd-drag.js", 778);
this._dragThreshMet = false;
            _yuitest_coverline("build/dd-drag/dd-drag.js", 779);
this._ev_md = ev;

            _yuitest_coverline("build/dd-drag/dd-drag.js", 781);
if (this.get('primaryButtonOnly') && ev.button > 1) {
                _yuitest_coverline("build/dd-drag/dd-drag.js", 782);
return false;
            }
            _yuitest_coverline("build/dd-drag/dd-drag.js", 784);
if (this.validClick(ev)) {
                _yuitest_coverline("build/dd-drag/dd-drag.js", 785);
this._fixIEMouseDown(ev);
                _yuitest_coverline("build/dd-drag/dd-drag.js", 786);
if (Drag.START_EVENT.indexOf('gesture') !== 0) {
                    //Only do these if it's not a gesture
                    _yuitest_coverline("build/dd-drag/dd-drag.js", 788);
if (this.get('haltDown')) {
                        _yuitest_coverline("build/dd-drag/dd-drag.js", 789);
ev.halt();
                    } else {
                        _yuitest_coverline("build/dd-drag/dd-drag.js", 791);
ev.preventDefault();
                    }
                }

                _yuitest_coverline("build/dd-drag/dd-drag.js", 795);
this._setStartPosition([ev.pageX, ev.pageY]);

                _yuitest_coverline("build/dd-drag/dd-drag.js", 797);
DDM.activeDrag = this;

                _yuitest_coverline("build/dd-drag/dd-drag.js", 799);
this._clickTimeout = Y.later(this.get('clickTimeThresh'), this, this._timeoutCheck);
            }
            _yuitest_coverline("build/dd-drag/dd-drag.js", 801);
this.fire(EV_AFTER_MOUSE_DOWN, { ev: ev });
        },
        /**
        * Method first checks to see if we have handles, if so it validates the click
        * against the handle. Then if it finds a valid handle, it checks it against
        * the invalid handles list. Returns true if a good handle was used, false otherwise.
        * @method validClick
        * @param {EventFacade} ev  The Event
        * @return {Boolean}
        */
        validClick: function(ev) {
            _yuitest_coverfunc("build/dd-drag/dd-drag.js", "validClick", 811);
_yuitest_coverline("build/dd-drag/dd-drag.js", 812);
var r = false, n = false,
            tar = ev.target,
            hTest = null,
            els = null,
            nlist = null,
            set = false;
            _yuitest_coverline("build/dd-drag/dd-drag.js", 818);
if (this._handles) {
                _yuitest_coverline("build/dd-drag/dd-drag.js", 819);
Y.each(this._handles, function(i, n) {
                    _yuitest_coverfunc("build/dd-drag/dd-drag.js", "(anonymous 6)", 819);
_yuitest_coverline("build/dd-drag/dd-drag.js", 820);
if (i instanceof Y.Node || i instanceof Y.NodeList) {
                        _yuitest_coverline("build/dd-drag/dd-drag.js", 821);
if (!r) {
                            _yuitest_coverline("build/dd-drag/dd-drag.js", 822);
nlist = i;
                            _yuitest_coverline("build/dd-drag/dd-drag.js", 823);
if (nlist instanceof Y.Node) {
                                _yuitest_coverline("build/dd-drag/dd-drag.js", 824);
nlist = new Y.NodeList(i._node);
                            }
                            _yuitest_coverline("build/dd-drag/dd-drag.js", 826);
nlist.each(function(nl) {
                                _yuitest_coverfunc("build/dd-drag/dd-drag.js", "(anonymous 7)", 826);
_yuitest_coverline("build/dd-drag/dd-drag.js", 827);
if (nl.contains(tar)) {
                                    _yuitest_coverline("build/dd-drag/dd-drag.js", 828);
r = true;
                                }
                            });
                        }
                    } else {_yuitest_coverline("build/dd-drag/dd-drag.js", 832);
if (Y.Lang.isString(n)) {
                        //Am I this or am I inside this
                        _yuitest_coverline("build/dd-drag/dd-drag.js", 834);
if (tar.test(n + ', ' + n + ' *') && !hTest) {
                            _yuitest_coverline("build/dd-drag/dd-drag.js", 835);
hTest = n;
                            _yuitest_coverline("build/dd-drag/dd-drag.js", 836);
r = true;
                        }
                    }}
                });
            } else {
                _yuitest_coverline("build/dd-drag/dd-drag.js", 841);
n = this.get(NODE);
                _yuitest_coverline("build/dd-drag/dd-drag.js", 842);
if (n.contains(tar) || n.compareTo(tar)) {
                    _yuitest_coverline("build/dd-drag/dd-drag.js", 843);
r = true;
                }
            }
            _yuitest_coverline("build/dd-drag/dd-drag.js", 846);
if (r) {
                _yuitest_coverline("build/dd-drag/dd-drag.js", 847);
if (this._invalids) {
                    _yuitest_coverline("build/dd-drag/dd-drag.js", 848);
Y.each(this._invalids, function(i, n) {
                        _yuitest_coverfunc("build/dd-drag/dd-drag.js", "(anonymous 8)", 848);
_yuitest_coverline("build/dd-drag/dd-drag.js", 849);
if (Y.Lang.isString(n)) {
                            //Am I this or am I inside this
                            _yuitest_coverline("build/dd-drag/dd-drag.js", 851);
if (tar.test(n + ', ' + n + ' *')) {
                                _yuitest_coverline("build/dd-drag/dd-drag.js", 852);
r = false;
                            }
                        }
                    });
                }
            }
            _yuitest_coverline("build/dd-drag/dd-drag.js", 858);
if (r) {
                _yuitest_coverline("build/dd-drag/dd-drag.js", 859);
if (hTest) {
                    _yuitest_coverline("build/dd-drag/dd-drag.js", 860);
els = ev.currentTarget.all(hTest);
                    _yuitest_coverline("build/dd-drag/dd-drag.js", 861);
set = false;
                    _yuitest_coverline("build/dd-drag/dd-drag.js", 862);
els.each(function(n) {
                        _yuitest_coverfunc("build/dd-drag/dd-drag.js", "(anonymous 9)", 862);
_yuitest_coverline("build/dd-drag/dd-drag.js", 863);
if ((n.contains(tar) || n.compareTo(tar)) && !set) {
                            _yuitest_coverline("build/dd-drag/dd-drag.js", 864);
set = true;
                            _yuitest_coverline("build/dd-drag/dd-drag.js", 865);
this.set('activeHandle', n);
                        }
                    }, this);
                } else {
                    _yuitest_coverline("build/dd-drag/dd-drag.js", 869);
this.set('activeHandle', this.get(NODE));
                }
            }
            _yuitest_coverline("build/dd-drag/dd-drag.js", 872);
return r;
        },
        /**
        * @private
        * @method _setStartPosition
        * @description Sets the current position of the Element and calculates the offset
        * @param {Array} xy The XY coords to set the position to.
        */
        _setStartPosition: function(xy) {
            _yuitest_coverfunc("build/dd-drag/dd-drag.js", "_setStartPosition", 880);
_yuitest_coverline("build/dd-drag/dd-drag.js", 881);
this.startXY = xy;

            _yuitest_coverline("build/dd-drag/dd-drag.js", 883);
this.nodeXY = this.lastXY = this.realXY = this.get(NODE).getXY();

            _yuitest_coverline("build/dd-drag/dd-drag.js", 885);
if (this.get('offsetNode')) {
                _yuitest_coverline("build/dd-drag/dd-drag.js", 886);
this.deltaXY = [(this.startXY[0] - this.nodeXY[0]), (this.startXY[1] - this.nodeXY[1])];
            } else {
                _yuitest_coverline("build/dd-drag/dd-drag.js", 888);
this.deltaXY = [0, 0];
            }
        },
        /**
        * @private
        * @method _timeoutCheck
        * @description The method passed to setTimeout to determine if the clickTimeThreshold was met.
        */
        _timeoutCheck: function() {
            _yuitest_coverfunc("build/dd-drag/dd-drag.js", "_timeoutCheck", 896);
_yuitest_coverline("build/dd-drag/dd-drag.js", 897);
if (!this.get('lock') && !this._dragThreshMet && this._ev_md) {
                _yuitest_coverline("build/dd-drag/dd-drag.js", 898);
this._fromTimeout = this._dragThreshMet = true;
                _yuitest_coverline("build/dd-drag/dd-drag.js", 899);
this.start();
                _yuitest_coverline("build/dd-drag/dd-drag.js", 900);
this._alignNode([this._ev_md.pageX, this._ev_md.pageY], true);
            }
        },
        /**
        * @method removeHandle
        * @description Remove a Selector added by addHandle
        * @param {String} str The selector for the handle to be removed.
        * @return {Self}
        * @chainable
        */
        removeHandle: function(str) {
            _yuitest_coverfunc("build/dd-drag/dd-drag.js", "removeHandle", 910);
_yuitest_coverline("build/dd-drag/dd-drag.js", 911);
var key = str;
            _yuitest_coverline("build/dd-drag/dd-drag.js", 912);
if (str instanceof Y.Node || str instanceof Y.NodeList) {
                _yuitest_coverline("build/dd-drag/dd-drag.js", 913);
key = str._yuid;
            }
            _yuitest_coverline("build/dd-drag/dd-drag.js", 915);
if (this._handles[key]) {
                _yuitest_coverline("build/dd-drag/dd-drag.js", 916);
delete this._handles[key];
                _yuitest_coverline("build/dd-drag/dd-drag.js", 917);
this.fire(EV_REMOVE_HANDLE, { handle: str });
            }
            _yuitest_coverline("build/dd-drag/dd-drag.js", 919);
return this;
        },
        /**
        * @method addHandle
        * @description Add a handle to a drag element. Drag only initiates when a mousedown happens on this element.
        * @param {String} str The selector to test for a valid handle. Must be a child of the element.
        * @return {Self}
        * @chainable
        */
        addHandle: function(str) {
            _yuitest_coverfunc("build/dd-drag/dd-drag.js", "addHandle", 928);
_yuitest_coverline("build/dd-drag/dd-drag.js", 929);
if (!this._handles) {
                _yuitest_coverline("build/dd-drag/dd-drag.js", 930);
this._handles = {};
            }
            _yuitest_coverline("build/dd-drag/dd-drag.js", 932);
var key = str;
            _yuitest_coverline("build/dd-drag/dd-drag.js", 933);
if (str instanceof Y.Node || str instanceof Y.NodeList) {
                _yuitest_coverline("build/dd-drag/dd-drag.js", 934);
key = str._yuid;
            }
            _yuitest_coverline("build/dd-drag/dd-drag.js", 936);
this._handles[key] = str;
            _yuitest_coverline("build/dd-drag/dd-drag.js", 937);
this.fire(EV_ADD_HANDLE, { handle: str });
            _yuitest_coverline("build/dd-drag/dd-drag.js", 938);
return this;
        },
        /**
        * @method removeInvalid
        * @description Remove an invalid handle added by addInvalid
        * @param {String} str The invalid handle to remove from the internal list.
        * @return {Self}
        * @chainable
        */
        removeInvalid: function(str) {
            _yuitest_coverfunc("build/dd-drag/dd-drag.js", "removeInvalid", 947);
_yuitest_coverline("build/dd-drag/dd-drag.js", 948);
if (this._invalids[str]) {
                _yuitest_coverline("build/dd-drag/dd-drag.js", 949);
this._invalids[str] = null;
                _yuitest_coverline("build/dd-drag/dd-drag.js", 950);
delete this._invalids[str];
                _yuitest_coverline("build/dd-drag/dd-drag.js", 951);
this.fire(EV_REMOVE_INVALID, { handle: str });
            }
            _yuitest_coverline("build/dd-drag/dd-drag.js", 953);
return this;
        },
        /**
        * @method addInvalid
        * @description Add a selector string to test the handle against. If the test passes the drag operation will not continue.
        * @param {String} str The selector to test against to determine if this is an invalid drag handle.
        * @return {Self}
        * @chainable
        */
        addInvalid: function(str) {
            _yuitest_coverfunc("build/dd-drag/dd-drag.js", "addInvalid", 962);
_yuitest_coverline("build/dd-drag/dd-drag.js", 963);
if (Y.Lang.isString(str)) {
                _yuitest_coverline("build/dd-drag/dd-drag.js", 964);
this._invalids[str] = true;
                _yuitest_coverline("build/dd-drag/dd-drag.js", 965);
this.fire(EV_ADD_INVALID, { handle: str });
            }
            _yuitest_coverline("build/dd-drag/dd-drag.js", 967);
return this;
        },
        /**
        * @private
        * @method initializer
        * @description Internal init handler
        */
        initializer: function() {

            _yuitest_coverfunc("build/dd-drag/dd-drag.js", "initializer", 974);
_yuitest_coverline("build/dd-drag/dd-drag.js", 976);
this.get(NODE).dd = this;

            _yuitest_coverline("build/dd-drag/dd-drag.js", 978);
if (!this.get(NODE).get('id')) {
                _yuitest_coverline("build/dd-drag/dd-drag.js", 979);
var id = Y.stamp(this.get(NODE));
                _yuitest_coverline("build/dd-drag/dd-drag.js", 980);
this.get(NODE).set('id', id);
            }

            _yuitest_coverline("build/dd-drag/dd-drag.js", 983);
this.actXY = [];

            _yuitest_coverline("build/dd-drag/dd-drag.js", 985);
this._invalids = Y.clone(this._invalidsDefault, true);

            _yuitest_coverline("build/dd-drag/dd-drag.js", 987);
this._createEvents();

            _yuitest_coverline("build/dd-drag/dd-drag.js", 989);
if (!this.get(DRAG_NODE)) {
                _yuitest_coverline("build/dd-drag/dd-drag.js", 990);
this.set(DRAG_NODE, this.get(NODE));
            }

            //Fix for #2528096
            //Don't prep the DD instance until all plugins are loaded.
            _yuitest_coverline("build/dd-drag/dd-drag.js", 995);
this.on('initializedChange', Y.bind(this._prep, this));

            //Shouldn't have to do this..
            _yuitest_coverline("build/dd-drag/dd-drag.js", 998);
this.set('groups', this.get('groups'));
        },
        /**
        * @private
        * @method _prep
        * @description Attach event listners and add classname
        */
        _prep: function() {
            _yuitest_coverfunc("build/dd-drag/dd-drag.js", "_prep", 1005);
_yuitest_coverline("build/dd-drag/dd-drag.js", 1006);
this._dragThreshMet = false;
            _yuitest_coverline("build/dd-drag/dd-drag.js", 1007);
var node = this.get(NODE);
            _yuitest_coverline("build/dd-drag/dd-drag.js", 1008);
node.addClass(DDM.CSS_PREFIX + '-draggable');
            _yuitest_coverline("build/dd-drag/dd-drag.js", 1009);
node.on(Drag.START_EVENT, Y.bind(this._handleMouseDownEvent, this));
            _yuitest_coverline("build/dd-drag/dd-drag.js", 1010);
node.on('mouseup', Y.bind(this._handleMouseUp, this));
            _yuitest_coverline("build/dd-drag/dd-drag.js", 1011);
node.on('dragstart', Y.bind(this._fixDragStart, this));
        },
        /**
        * @private
        * @method _unprep
        * @description Detach event listeners and remove classname
        */
        _unprep: function() {
            _yuitest_coverfunc("build/dd-drag/dd-drag.js", "_unprep", 1018);
_yuitest_coverline("build/dd-drag/dd-drag.js", 1019);
var node = this.get(NODE);
            _yuitest_coverline("build/dd-drag/dd-drag.js", 1020);
node.removeClass(DDM.CSS_PREFIX + '-draggable');
            _yuitest_coverline("build/dd-drag/dd-drag.js", 1021);
node.detachAll('mouseup');
            _yuitest_coverline("build/dd-drag/dd-drag.js", 1022);
node.detachAll('dragstart');
            _yuitest_coverline("build/dd-drag/dd-drag.js", 1023);
node.detachAll(Drag.START_EVENT);
            _yuitest_coverline("build/dd-drag/dd-drag.js", 1024);
this.mouseXY = [];
            _yuitest_coverline("build/dd-drag/dd-drag.js", 1025);
this.deltaXY = [0,0];
            _yuitest_coverline("build/dd-drag/dd-drag.js", 1026);
this.startXY = [];
            _yuitest_coverline("build/dd-drag/dd-drag.js", 1027);
this.nodeXY = [];
            _yuitest_coverline("build/dd-drag/dd-drag.js", 1028);
this.lastXY = [];
            _yuitest_coverline("build/dd-drag/dd-drag.js", 1029);
this.actXY = [];
            _yuitest_coverline("build/dd-drag/dd-drag.js", 1030);
this.realXY = [];
        },
        /**
        * @method start
        * @description Starts the drag operation
        * @return {Self}
        * @chainable
        */
        start: function() {
            _yuitest_coverfunc("build/dd-drag/dd-drag.js", "start", 1038);
_yuitest_coverline("build/dd-drag/dd-drag.js", 1039);
if (!this.get('lock') && !this.get(DRAGGING)) {
                _yuitest_coverline("build/dd-drag/dd-drag.js", 1040);
var node = this.get(NODE), ow, oh, xy;
                _yuitest_coverline("build/dd-drag/dd-drag.js", 1041);
this._startTime = (new Date()).getTime();

                _yuitest_coverline("build/dd-drag/dd-drag.js", 1043);
DDM._start();
                _yuitest_coverline("build/dd-drag/dd-drag.js", 1044);
node.addClass(DDM.CSS_PREFIX + '-dragging');
                _yuitest_coverline("build/dd-drag/dd-drag.js", 1045);
this.fire(EV_START, {
                    pageX: this.nodeXY[0],
                    pageY: this.nodeXY[1],
                    startTime: this._startTime
                });
                _yuitest_coverline("build/dd-drag/dd-drag.js", 1050);
node = this.get(DRAG_NODE);
                _yuitest_coverline("build/dd-drag/dd-drag.js", 1051);
xy = this.nodeXY;

                _yuitest_coverline("build/dd-drag/dd-drag.js", 1053);
ow = node.get(OFFSET_WIDTH);
                _yuitest_coverline("build/dd-drag/dd-drag.js", 1054);
oh = node.get(OFFSET_HEIGHT);

                _yuitest_coverline("build/dd-drag/dd-drag.js", 1056);
if (this.get('startCentered')) {
                    _yuitest_coverline("build/dd-drag/dd-drag.js", 1057);
this._setStartPosition([xy[0] + (ow / 2), xy[1] + (oh / 2)]);
                }


                _yuitest_coverline("build/dd-drag/dd-drag.js", 1061);
this.region = {
                    '0': xy[0],
                    '1': xy[1],
                    area: 0,
                    top: xy[1],
                    right: xy[0] + ow,
                    bottom: xy[1] + oh,
                    left: xy[0]
                };
                _yuitest_coverline("build/dd-drag/dd-drag.js", 1070);
this.set(DRAGGING, true);
            }
            _yuitest_coverline("build/dd-drag/dd-drag.js", 1072);
return this;
        },
        /**
        * @method end
        * @description Ends the drag operation
        * @return {Self}
        * @chainable
        */
        end: function() {
            _yuitest_coverfunc("build/dd-drag/dd-drag.js", "end", 1080);
_yuitest_coverline("build/dd-drag/dd-drag.js", 1081);
this._endTime = (new Date()).getTime();
            _yuitest_coverline("build/dd-drag/dd-drag.js", 1082);
if (this._clickTimeout) {
                _yuitest_coverline("build/dd-drag/dd-drag.js", 1083);
this._clickTimeout.cancel();
            }
            _yuitest_coverline("build/dd-drag/dd-drag.js", 1085);
this._dragThreshMet = this._fromTimeout = false;

            _yuitest_coverline("build/dd-drag/dd-drag.js", 1087);
if (!this.get('lock') && this.get(DRAGGING)) {
                _yuitest_coverline("build/dd-drag/dd-drag.js", 1088);
this.fire(EV_END, {
                    pageX: this.lastXY[0],
                    pageY: this.lastXY[1],
                    startTime: this._startTime,
                    endTime: this._endTime
                });
            }
            _yuitest_coverline("build/dd-drag/dd-drag.js", 1095);
this.get(NODE).removeClass(DDM.CSS_PREFIX + '-dragging');
            _yuitest_coverline("build/dd-drag/dd-drag.js", 1096);
this.set(DRAGGING, false);
            _yuitest_coverline("build/dd-drag/dd-drag.js", 1097);
this.deltaXY = [0, 0];

            _yuitest_coverline("build/dd-drag/dd-drag.js", 1099);
return this;
        },
        /**
        * @private
        * @method _defEndFn
        * @description Handler for fixing the selection in IE
        */
        _defEndFn: function() {
            _yuitest_coverfunc("build/dd-drag/dd-drag.js", "_defEndFn", 1106);
_yuitest_coverline("build/dd-drag/dd-drag.js", 1107);
this._fixIEMouseUp();
            _yuitest_coverline("build/dd-drag/dd-drag.js", 1108);
this._ev_md = null;
        },
        /**
        * @private
        * @method _prevEndFn
        * @description Handler for preventing the drag:end event. It will reset the node back to it's start position
        */
        _prevEndFn: function() {
            _yuitest_coverfunc("build/dd-drag/dd-drag.js", "_prevEndFn", 1115);
_yuitest_coverline("build/dd-drag/dd-drag.js", 1116);
this._fixIEMouseUp();
            //Bug #1852577
            _yuitest_coverline("build/dd-drag/dd-drag.js", 1118);
this.get(DRAG_NODE).setXY(this.nodeXY);
            _yuitest_coverline("build/dd-drag/dd-drag.js", 1119);
this._ev_md = null;
            _yuitest_coverline("build/dd-drag/dd-drag.js", 1120);
this.region = null;
        },
        /**
        * @private
        * @method _align
        * @description Calculates the offsets and set's the XY that the element will move to.
        * @param {Array} xy The xy coords to align with.
        */
        _align: function(xy) {
            _yuitest_coverfunc("build/dd-drag/dd-drag.js", "_align", 1128);
_yuitest_coverline("build/dd-drag/dd-drag.js", 1129);
this.fire(EV_ALIGN, {pageX: xy[0], pageY: xy[1] });
        },
        /**
        * @private
        * @method _defAlignFn
        * @description Calculates the offsets and set's the XY that the element will move to.
        * @param {EventFacade} e The drag:align event.
        */
        _defAlignFn: function(e) {
            _yuitest_coverfunc("build/dd-drag/dd-drag.js", "_defAlignFn", 1137);
_yuitest_coverline("build/dd-drag/dd-drag.js", 1138);
this.actXY = [e.pageX - this.deltaXY[0], e.pageY - this.deltaXY[1]];
        },
        /**
        * @private
        * @method _alignNode
        * @description This method performs the alignment before the element move.
        * @param {Array} eXY The XY to move the element to, usually comes from the mousemove DOM event.
        */
        _alignNode: function(eXY, scroll) {
            _yuitest_coverfunc("build/dd-drag/dd-drag.js", "_alignNode", 1146);
_yuitest_coverline("build/dd-drag/dd-drag.js", 1147);
this._align(eXY);
            _yuitest_coverline("build/dd-drag/dd-drag.js", 1148);
if (!scroll) {
                _yuitest_coverline("build/dd-drag/dd-drag.js", 1149);
this._moveNode();
            }
        },
        /**
        * @private
        * @method _moveNode
        * @description This method performs the actual element move.
        */
        _moveNode: function(scroll) {
            //if (!this.get(DRAGGING)) {
            //    return;
            //}
            _yuitest_coverfunc("build/dd-drag/dd-drag.js", "_moveNode", 1157);
_yuitest_coverline("build/dd-drag/dd-drag.js", 1161);
var diffXY = [], diffXY2 = [], startXY = this.nodeXY, xy = this.actXY;

            _yuitest_coverline("build/dd-drag/dd-drag.js", 1163);
diffXY[0] = (xy[0] - this.lastXY[0]);
            _yuitest_coverline("build/dd-drag/dd-drag.js", 1164);
diffXY[1] = (xy[1] - this.lastXY[1]);

            _yuitest_coverline("build/dd-drag/dd-drag.js", 1166);
diffXY2[0] = (xy[0] - this.nodeXY[0]);
            _yuitest_coverline("build/dd-drag/dd-drag.js", 1167);
diffXY2[1] = (xy[1] - this.nodeXY[1]);


            _yuitest_coverline("build/dd-drag/dd-drag.js", 1170);
this.region = {
                '0': xy[0],
                '1': xy[1],
                area: 0,
                top: xy[1],
                right: xy[0] + this.get(DRAG_NODE).get(OFFSET_WIDTH),
                bottom: xy[1] + this.get(DRAG_NODE).get(OFFSET_HEIGHT),
                left: xy[0]
            };

            _yuitest_coverline("build/dd-drag/dd-drag.js", 1180);
this.fire(EV_DRAG, {
                pageX: xy[0],
                pageY: xy[1],
                scroll: scroll,
                info: {
                    start: startXY,
                    xy: xy,
                    delta: diffXY,
                    offset: diffXY2
                }
            });

            _yuitest_coverline("build/dd-drag/dd-drag.js", 1192);
this.lastXY = xy;
        },
        /**
        * @private
        * @method _defDragFn
        * @description Default function for drag:drag. Fired from _moveNode.
        * @param {EventFacade} ev The drag:drag event
        */
        _defDragFn: function(e) {
            _yuitest_coverfunc("build/dd-drag/dd-drag.js", "_defDragFn", 1200);
_yuitest_coverline("build/dd-drag/dd-drag.js", 1201);
if (this.get('move')) {
                _yuitest_coverline("build/dd-drag/dd-drag.js", 1202);
if (e.scroll && e.scroll.node) {
                    _yuitest_coverline("build/dd-drag/dd-drag.js", 1203);
e.scroll.node.set('scrollTop', e.scroll.top);
                    _yuitest_coverline("build/dd-drag/dd-drag.js", 1204);
e.scroll.node.set('scrollLeft', e.scroll.left);
                }
                _yuitest_coverline("build/dd-drag/dd-drag.js", 1206);
this.get(DRAG_NODE).setXY([e.pageX, e.pageY]);
                _yuitest_coverline("build/dd-drag/dd-drag.js", 1207);
this.realXY = [e.pageX, e.pageY];
            }
        },
        /**
        * @private
        * @method _move
        * @description Fired from DragDropMgr (DDM) on mousemove.
        * @param {EventFacade} ev The mousemove DOM event
        */
        _move: function(ev) {
            _yuitest_coverfunc("build/dd-drag/dd-drag.js", "_move", 1216);
_yuitest_coverline("build/dd-drag/dd-drag.js", 1217);
if (this.get('lock')) {
                _yuitest_coverline("build/dd-drag/dd-drag.js", 1218);
return false;
            }

            _yuitest_coverline("build/dd-drag/dd-drag.js", 1221);
this.mouseXY = [ev.pageX, ev.pageY];
            _yuitest_coverline("build/dd-drag/dd-drag.js", 1222);
if (!this._dragThreshMet) {
                _yuitest_coverline("build/dd-drag/dd-drag.js", 1223);
var diffX = Math.abs(this.startXY[0] - ev.pageX),
                diffY = Math.abs(this.startXY[1] - ev.pageY);
                _yuitest_coverline("build/dd-drag/dd-drag.js", 1225);
if (diffX > this.get('clickPixelThresh') || diffY > this.get('clickPixelThresh')) {
                    _yuitest_coverline("build/dd-drag/dd-drag.js", 1226);
this._dragThreshMet = true;
                    _yuitest_coverline("build/dd-drag/dd-drag.js", 1227);
this.start();
                    //This only happens on gestures to stop the page from scrolling
                    _yuitest_coverline("build/dd-drag/dd-drag.js", 1229);
if (ev && ev.preventDefault) {
                        _yuitest_coverline("build/dd-drag/dd-drag.js", 1230);
ev.preventDefault();
                    }
                    _yuitest_coverline("build/dd-drag/dd-drag.js", 1232);
this._alignNode([ev.pageX, ev.pageY]);
                }
            } else {
                _yuitest_coverline("build/dd-drag/dd-drag.js", 1235);
if (this._clickTimeout) {
                    _yuitest_coverline("build/dd-drag/dd-drag.js", 1236);
this._clickTimeout.cancel();
                }
                _yuitest_coverline("build/dd-drag/dd-drag.js", 1238);
this._alignNode([ev.pageX, ev.pageY]);
            }
        },
        /**
        * @method stopDrag
        * @description Method will forcefully stop a drag operation. For example calling this from inside an ESC keypress handler will stop this drag.
        * @return {Self}
        * @chainable
        */
        stopDrag: function() {
            _yuitest_coverfunc("build/dd-drag/dd-drag.js", "stopDrag", 1247);
_yuitest_coverline("build/dd-drag/dd-drag.js", 1248);
if (this.get(DRAGGING)) {
                _yuitest_coverline("build/dd-drag/dd-drag.js", 1249);
DDM._end();
            }
            _yuitest_coverline("build/dd-drag/dd-drag.js", 1251);
return this;
        },
        /**
        * @private
        * @method destructor
        * @description Lifecycle destructor, unreg the drag from the DDM and remove listeners
        */
        destructor: function() {
            _yuitest_coverfunc("build/dd-drag/dd-drag.js", "destructor", 1258);
_yuitest_coverline("build/dd-drag/dd-drag.js", 1259);
this._unprep();
            _yuitest_coverline("build/dd-drag/dd-drag.js", 1260);
if (this.target) {
                _yuitest_coverline("build/dd-drag/dd-drag.js", 1261);
this.target.destroy();
            }
            _yuitest_coverline("build/dd-drag/dd-drag.js", 1263);
DDM._unregDrag(this);
        }
    });
    _yuitest_coverline("build/dd-drag/dd-drag.js", 1266);
Y.namespace('DD');
    _yuitest_coverline("build/dd-drag/dd-drag.js", 1267);
Y.DD.Drag = Drag;




}, '3.7.3', {"requires": ["dd-ddm-base"]});
