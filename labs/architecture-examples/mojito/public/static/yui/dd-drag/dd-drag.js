/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
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
        this._lazyAddAttrs = false;
        Drag.superclass.constructor.apply(this, arguments);

        var valid = DDM._regDrag(this);
        if (!valid) {
            Y.error('Failed to register node, already in use: ' + o.node);
        }
    };

    Drag.NAME = 'drag';

    /**
    * This property defaults to "mousedown", but when drag-gestures is loaded, it is changed to "gesturemovestart"
    * @static
    * @property START_EVENT
    */
    Drag.START_EVENT = 'mousedown';

    Drag.ATTRS = {
        /**
        * @attribute node
        * @description Y.Node instance to use as the element to initiate a drag operation
        * @type Node
        */
        node: {
            setter: function(node) {
                if (this._canDrag(node)) {
                    return node;
                }
                var n = Y.one(node);
                if (!n) {
                    Y.error('DD.Drag: Invalid Node Given: ' + node);
                }
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
                if (this._canDrag(node)) {
                    return node;
                }
                var n = Y.one(node);
                if (!n) {
                    Y.error('DD.Drag: Invalid dragNode Given: ' + node);
                }
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
                if (lock) {
                    this.get(NODE).addClass(DDM.CSS_PREFIX + '-locked');
                } else {
                    this.get(NODE).removeClass(DDM.CSS_PREFIX + '-locked');
                }
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
                this._handleTarget(config);
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
                if (!this._groups) {
                    this._groups = {};
                }
                var ret = [];
                Y.each(this._groups, function(v, k) {
                    ret[ret.length] = k;
                });
                return ret;
            },
            setter: function(g) {
                this._groups = {};
                Y.each(g, function(v) {
                    this._groups[v] = true;
                }, this);
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
                if (g) {
                    this._handles = {};
                    Y.each(g, function(v) {
                        var key = v;
                        if (v instanceof Y.Node || v instanceof Y.NodeList) {
                            key = v._yuid;
                        }
                        this._handles[key] = v;
                    }, this);
                } else {
                    this._handles = null;
                }
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
                this.addTarget(t);
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
            if (n && n.setXY && n.getXY && n.test && n.contains) {
                return true;
            }
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
            this._groups[g] = true;
            DDM._activateTargets();
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
            delete this._groups[g];
            DDM._activateTargets();
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
            if (Y.DD.Drop) {
                if (config === false) {
                    if (this.target) {
                        DDM._unregTarget(this.target);
                        this.target = null;
                    }
                } else {
                    if (!Y.Lang.isObject(config)) {
                        config = {};
                    }
                    config.bubbleTargets = config.bubbleTargets || Y.Object.values(this._yuievt.targets);
                    config.node = this.get(NODE);
                    config.groups = config.groups || this.get('groups');
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

            this.publish(EV_MOUSE_DOWN, {
                defaultFn: this._defMouseDownFn,
                queuable: false,
                emitFacade: true,
                bubbles: true,
                prefix: 'drag'
            });

            this.publish(EV_ALIGN, {
                defaultFn: this._defAlignFn,
                queuable: false,
                emitFacade: true,
                bubbles: true,
                prefix: 'drag'
            });

            this.publish(EV_DRAG, {
                defaultFn: this._defDragFn,
                queuable: false,
                emitFacade: true,
                bubbles: true,
                prefix: 'drag'
            });

            this.publish(EV_END, {
                defaultFn: this._defEndFn,
                preventedFn: this._prevEndFn,
                queuable: false,
                emitFacade: true,
                bubbles: true,
                prefix: 'drag'
            });

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

            Y.each(ev, function(v) {
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
            this.fire('drag:mouseup');
            this._fixIEMouseUp();
            if (DDM.activeDrag) {
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
            if (this.validClick(e)) {
                e.preventDefault();
            }
        },
        /**
        * @private
        * @method _ieSelectFix
        * @description The function we use as the onselectstart handler when we start a drag in Internet Explorer
        */
        _ieSelectFix: function() {
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
            if (Y.UA.ie) {
                this._ieSelectBack = Y.config.doc.body.onselectstart;
                Y.config.doc.body.onselectstart = this._ieSelectFix;
            }
        },
        /**
        * @private
        * @method _fixIEMouseUp
        * @description This method copies the _ieSelectFix property back to the onselectstart listner on the document.
        */
        _fixIEMouseUp: function() {
            if (Y.UA.ie) {
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
            this.fire(EV_MOUSE_DOWN, { ev: ev });
        },
        /**
        * @private
        * @method _defMouseDownFn
        * @description Handler for the mousedown DOM event
        * @param {EventFacade} e  The Event
        */
        _defMouseDownFn: function(e) {
            var ev = e.ev;

            this._dragThreshMet = false;
            this._ev_md = ev;

            if (this.get('primaryButtonOnly') && ev.button > 1) {
                return false;
            }
            if (this.validClick(ev)) {
                this._fixIEMouseDown(ev);
                if (Drag.START_EVENT.indexOf('gesture') !== 0) {
                    //Only do these if it's not a gesture
                    if (this.get('haltDown')) {
                        ev.halt();
                    } else {
                        ev.preventDefault();
                    }
                }

                this._setStartPosition([ev.pageX, ev.pageY]);

                DDM.activeDrag = this;

                this._clickTimeout = Y.later(this.get('clickTimeThresh'), this, this._timeoutCheck);
            }
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
            var r = false, n = false,
            tar = ev.target,
            hTest = null,
            els = null,
            nlist = null,
            set = false;
            if (this._handles) {
                Y.each(this._handles, function(i, n) {
                    if (i instanceof Y.Node || i instanceof Y.NodeList) {
                        if (!r) {
                            nlist = i;
                            if (nlist instanceof Y.Node) {
                                nlist = new Y.NodeList(i._node);
                            }
                            nlist.each(function(nl) {
                                if (nl.contains(tar)) {
                                    r = true;
                                }
                            });
                        }
                    } else if (Y.Lang.isString(n)) {
                        //Am I this or am I inside this
                        if (tar.test(n + ', ' + n + ' *') && !hTest) {
                            hTest = n;
                            r = true;
                        }
                    }
                });
            } else {
                n = this.get(NODE);
                if (n.contains(tar) || n.compareTo(tar)) {
                    r = true;
                }
            }
            if (r) {
                if (this._invalids) {
                    Y.each(this._invalids, function(i, n) {
                        if (Y.Lang.isString(n)) {
                            //Am I this or am I inside this
                            if (tar.test(n + ', ' + n + ' *')) {
                                r = false;
                            }
                        }
                    });
                }
            }
            if (r) {
                if (hTest) {
                    els = ev.currentTarget.all(hTest);
                    set = false;
                    els.each(function(n) {
                        if ((n.contains(tar) || n.compareTo(tar)) && !set) {
                            set = true;
                            this.set('activeHandle', n);
                        }
                    }, this);
                } else {
                    this.set('activeHandle', this.get(NODE));
                }
            }
            return r;
        },
        /**
        * @private
        * @method _setStartPosition
        * @description Sets the current position of the Element and calculates the offset
        * @param {Array} xy The XY coords to set the position to.
        */
        _setStartPosition: function(xy) {
            this.startXY = xy;

            this.nodeXY = this.lastXY = this.realXY = this.get(NODE).getXY();

            if (this.get('offsetNode')) {
                this.deltaXY = [(this.startXY[0] - this.nodeXY[0]), (this.startXY[1] - this.nodeXY[1])];
            } else {
                this.deltaXY = [0, 0];
            }
        },
        /**
        * @private
        * @method _timeoutCheck
        * @description The method passed to setTimeout to determine if the clickTimeThreshold was met.
        */
        _timeoutCheck: function() {
            if (!this.get('lock') && !this._dragThreshMet && this._ev_md) {
                this._fromTimeout = this._dragThreshMet = true;
                this.start();
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
            var key = str;
            if (str instanceof Y.Node || str instanceof Y.NodeList) {
                key = str._yuid;
            }
            if (this._handles[key]) {
                delete this._handles[key];
                this.fire(EV_REMOVE_HANDLE, { handle: str });
            }
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
            if (!this._handles) {
                this._handles = {};
            }
            var key = str;
            if (str instanceof Y.Node || str instanceof Y.NodeList) {
                key = str._yuid;
            }
            this._handles[key] = str;
            this.fire(EV_ADD_HANDLE, { handle: str });
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
            if (this._invalids[str]) {
                this._invalids[str] = null;
                delete this._invalids[str];
                this.fire(EV_REMOVE_INVALID, { handle: str });
            }
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
            if (Y.Lang.isString(str)) {
                this._invalids[str] = true;
                this.fire(EV_ADD_INVALID, { handle: str });
            }
            return this;
        },
        /**
        * @private
        * @method initializer
        * @description Internal init handler
        */
        initializer: function() {

            this.get(NODE).dd = this;

            if (!this.get(NODE).get('id')) {
                var id = Y.stamp(this.get(NODE));
                this.get(NODE).set('id', id);
            }

            this.actXY = [];

            this._invalids = Y.clone(this._invalidsDefault, true);

            this._createEvents();

            if (!this.get(DRAG_NODE)) {
                this.set(DRAG_NODE, this.get(NODE));
            }

            //Fix for #2528096
            //Don't prep the DD instance until all plugins are loaded.
            this.on('initializedChange', Y.bind(this._prep, this));

            //Shouldn't have to do this..
            this.set('groups', this.get('groups'));
        },
        /**
        * @private
        * @method _prep
        * @description Attach event listners and add classname
        */
        _prep: function() {
            this._dragThreshMet = false;
            var node = this.get(NODE);
            node.addClass(DDM.CSS_PREFIX + '-draggable');
            node.on(Drag.START_EVENT, Y.bind(this._handleMouseDownEvent, this));
            node.on('mouseup', Y.bind(this._handleMouseUp, this));
            node.on('dragstart', Y.bind(this._fixDragStart, this));
        },
        /**
        * @private
        * @method _unprep
        * @description Detach event listeners and remove classname
        */
        _unprep: function() {
            var node = this.get(NODE);
            node.removeClass(DDM.CSS_PREFIX + '-draggable');
            node.detachAll('mouseup');
            node.detachAll('dragstart');
            node.detachAll(Drag.START_EVENT);
            this.mouseXY = [];
            this.deltaXY = [0,0];
            this.startXY = [];
            this.nodeXY = [];
            this.lastXY = [];
            this.actXY = [];
            this.realXY = [];
        },
        /**
        * @method start
        * @description Starts the drag operation
        * @return {Self}
        * @chainable
        */
        start: function() {
            if (!this.get('lock') && !this.get(DRAGGING)) {
                var node = this.get(NODE), ow, oh, xy;
                this._startTime = (new Date()).getTime();

                DDM._start();
                node.addClass(DDM.CSS_PREFIX + '-dragging');
                this.fire(EV_START, {
                    pageX: this.nodeXY[0],
                    pageY: this.nodeXY[1],
                    startTime: this._startTime
                });
                node = this.get(DRAG_NODE);
                xy = this.nodeXY;

                ow = node.get(OFFSET_WIDTH);
                oh = node.get(OFFSET_HEIGHT);

                if (this.get('startCentered')) {
                    this._setStartPosition([xy[0] + (ow / 2), xy[1] + (oh / 2)]);
                }


                this.region = {
                    '0': xy[0],
                    '1': xy[1],
                    area: 0,
                    top: xy[1],
                    right: xy[0] + ow,
                    bottom: xy[1] + oh,
                    left: xy[0]
                };
                this.set(DRAGGING, true);
            }
            return this;
        },
        /**
        * @method end
        * @description Ends the drag operation
        * @return {Self}
        * @chainable
        */
        end: function() {
            this._endTime = (new Date()).getTime();
            if (this._clickTimeout) {
                this._clickTimeout.cancel();
            }
            this._dragThreshMet = this._fromTimeout = false;

            if (!this.get('lock') && this.get(DRAGGING)) {
                this.fire(EV_END, {
                    pageX: this.lastXY[0],
                    pageY: this.lastXY[1],
                    startTime: this._startTime,
                    endTime: this._endTime
                });
            }
            this.get(NODE).removeClass(DDM.CSS_PREFIX + '-dragging');
            this.set(DRAGGING, false);
            this.deltaXY = [0, 0];

            return this;
        },
        /**
        * @private
        * @method _defEndFn
        * @description Handler for fixing the selection in IE
        */
        _defEndFn: function() {
            this._fixIEMouseUp();
            this._ev_md = null;
        },
        /**
        * @private
        * @method _prevEndFn
        * @description Handler for preventing the drag:end event. It will reset the node back to it's start position
        */
        _prevEndFn: function() {
            this._fixIEMouseUp();
            //Bug #1852577
            this.get(DRAG_NODE).setXY(this.nodeXY);
            this._ev_md = null;
            this.region = null;
        },
        /**
        * @private
        * @method _align
        * @description Calculates the offsets and set's the XY that the element will move to.
        * @param {Array} xy The xy coords to align with.
        */
        _align: function(xy) {
            this.fire(EV_ALIGN, {pageX: xy[0], pageY: xy[1] });
        },
        /**
        * @private
        * @method _defAlignFn
        * @description Calculates the offsets and set's the XY that the element will move to.
        * @param {EventFacade} e The drag:align event.
        */
        _defAlignFn: function(e) {
            this.actXY = [e.pageX - this.deltaXY[0], e.pageY - this.deltaXY[1]];
        },
        /**
        * @private
        * @method _alignNode
        * @description This method performs the alignment before the element move.
        * @param {Array} eXY The XY to move the element to, usually comes from the mousemove DOM event.
        */
        _alignNode: function(eXY, scroll) {
            this._align(eXY);
            if (!scroll) {
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
            var diffXY = [], diffXY2 = [], startXY = this.nodeXY, xy = this.actXY;

            diffXY[0] = (xy[0] - this.lastXY[0]);
            diffXY[1] = (xy[1] - this.lastXY[1]);

            diffXY2[0] = (xy[0] - this.nodeXY[0]);
            diffXY2[1] = (xy[1] - this.nodeXY[1]);


            this.region = {
                '0': xy[0],
                '1': xy[1],
                area: 0,
                top: xy[1],
                right: xy[0] + this.get(DRAG_NODE).get(OFFSET_WIDTH),
                bottom: xy[1] + this.get(DRAG_NODE).get(OFFSET_HEIGHT),
                left: xy[0]
            };

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

            this.lastXY = xy;
        },
        /**
        * @private
        * @method _defDragFn
        * @description Default function for drag:drag. Fired from _moveNode.
        * @param {EventFacade} ev The drag:drag event
        */
        _defDragFn: function(e) {
            if (this.get('move')) {
                if (e.scroll && e.scroll.node) {
                    e.scroll.node.set('scrollTop', e.scroll.top);
                    e.scroll.node.set('scrollLeft', e.scroll.left);
                }
                this.get(DRAG_NODE).setXY([e.pageX, e.pageY]);
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
            if (this.get('lock')) {
                return false;
            }

            this.mouseXY = [ev.pageX, ev.pageY];
            if (!this._dragThreshMet) {
                var diffX = Math.abs(this.startXY[0] - ev.pageX),
                diffY = Math.abs(this.startXY[1] - ev.pageY);
                if (diffX > this.get('clickPixelThresh') || diffY > this.get('clickPixelThresh')) {
                    this._dragThreshMet = true;
                    this.start();
                    //This only happens on gestures to stop the page from scrolling
                    if (ev && ev.preventDefault) {
                        ev.preventDefault();
                    }
                    this._alignNode([ev.pageX, ev.pageY]);
                }
            } else {
                if (this._clickTimeout) {
                    this._clickTimeout.cancel();
                }
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
            if (this.get(DRAGGING)) {
                DDM._end();
            }
            return this;
        },
        /**
        * @private
        * @method destructor
        * @description Lifecycle destructor, unreg the drag from the DDM and remove listeners
        */
        destructor: function() {
            this._unprep();
            if (this.target) {
                this.target.destroy();
            }
            DDM._unregDrag(this);
        }
    });
    Y.namespace('DD');
    Y.DD.Drag = Drag;




}, '3.7.3', {"requires": ["dd-ddm-base"]});
