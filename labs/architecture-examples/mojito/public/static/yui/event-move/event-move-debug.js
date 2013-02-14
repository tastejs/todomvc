/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('event-move', function (Y, NAME) {

/**
 * Adds lower level support for "gesturemovestart", "gesturemove" and "gesturemoveend" events, which can be used to create drag/drop
 * interactions which work across touch and mouse input devices. They correspond to "touchstart", "touchmove" and "touchend" on a touch input
 * device, and "mousedown", "mousemove", "mouseup" on a mouse based input device.
 *
 * <p>Documentation for the gesturemove triplet of events can be found on the <a href="../classes/YUI.html#event_gesturemove">YUI</a> global,
 * along with the other supported events.</p>

 @example

     YUI().use('event-move', function (Y) {
         Y.one('#myNode').on('gesturemovestart', function (e) {
             Y.log('gesturemovestart Fired.');
         });
         Y.one('#myNode').on('gesturemove', function (e) {
             Y.log('gesturemove Fired.');
         });
         Y.one('#myNode').on('gesturemoveend', function (e) {
             Y.log('gesturemoveend Fired.');
         });
     });

 * @module event-gestures
 * @submodule event-move
 */


 var GESTURE_MAP = Y.Event._GESTURE_MAP,
     EVENT = {
         start: GESTURE_MAP.start,
         end: GESTURE_MAP.end,
         move: GESTURE_MAP.move
     },
    START = "start",
    MOVE = "move",
    END = "end",

    GESTURE_MOVE = "gesture" + MOVE,
    GESTURE_MOVE_END = GESTURE_MOVE + END,
    GESTURE_MOVE_START = GESTURE_MOVE + START,

    _MOVE_START_HANDLE = "_msh",
    _MOVE_HANDLE = "_mh",
    _MOVE_END_HANDLE = "_meh",

    _DEL_MOVE_START_HANDLE = "_dmsh",
    _DEL_MOVE_HANDLE = "_dmh",
    _DEL_MOVE_END_HANDLE = "_dmeh",

    _MOVE_START = "_ms",
    _MOVE = "_m",

    MIN_TIME = "minTime",
    MIN_DISTANCE = "minDistance",
    PREVENT_DEFAULT = "preventDefault",
    BUTTON = "button",
    OWNER_DOCUMENT = "ownerDocument",

    CURRENT_TARGET = "currentTarget",
    TARGET = "target",

    NODE_TYPE = "nodeType",
    SUPPORTS_POINTER = Y.config.win && ("msPointerEnabled" in Y.config.win.navigator),
    MS_TOUCH_ACTION_COUNT = 'msTouchActionCount',
    MS_INIT_TOUCH_ACTION = 'msInitTouchAction',

    _defArgsProcessor = function(se, args, delegate) {
        var iConfig = (delegate) ? 4 : 3,
            config = (args.length > iConfig) ? Y.merge(args.splice(iConfig,1)[0]) : {};

        if (!(PREVENT_DEFAULT in config)) {
            config[PREVENT_DEFAULT] = se.PREVENT_DEFAULT;
        }

        return config;
    },

    _getRoot = function(node, subscriber) {
        return subscriber._extra.root || (node.get(NODE_TYPE) === 9) ? node : node.get(OWNER_DOCUMENT);
    },

    //Checks to see if the node is the document, and if it is, returns the documentElement.
    _checkDocumentElem = function(node) {
        var elem = node.getDOMNode();
        if (node.compareTo(Y.config.doc) && elem.documentElement) {
            return elem.documentElement;
        }
        else {
            return false;
        }
    },

    _normTouchFacade = function(touchFacade, touch, params) {
        touchFacade.pageX = touch.pageX;
        touchFacade.pageY = touch.pageY;
        touchFacade.screenX = touch.screenX;
        touchFacade.screenY = touch.screenY;
        touchFacade.clientX = touch.clientX;
        touchFacade.clientY = touch.clientY;
        touchFacade[TARGET] = touchFacade[TARGET] || touch[TARGET];
        touchFacade[CURRENT_TARGET] = touchFacade[CURRENT_TARGET] || touch[CURRENT_TARGET];

        touchFacade[BUTTON] = (params && params[BUTTON]) || 1; // default to left (left as per vendors, not W3C which is 0)
    },

    /*
    In IE10 touch mode, gestures will not work properly unless the -ms-touch-action CSS property is set to something other than 'auto'. Read http://msdn.microsoft.com/en-us/library/windows/apps/hh767313.aspx for more info. To get around this, we set -ms-touch-action: none which is the same as e.preventDefault() on touch environments. This tells the browser to fire DOM events for all touch events, and not perform any default behavior.

    The user can over-ride this by setting a more lenient -ms-touch-action property on a node (such as pan-x, pan-y, etc.) via CSS when subscribing to the 'gesturemovestart' event.
    */
    _setTouchActions = function (node) {
        var elem = _checkDocumentElem(node) || node.getDOMNode(),
            num = node.getData(MS_TOUCH_ACTION_COUNT);

        //Checks to see if msTouchAction is supported.
        if (SUPPORTS_POINTER) {
            if (!num) {
                num = 0;
                node.setData(MS_INIT_TOUCH_ACTION, elem.style.msTouchAction);
            }
            elem.style.msTouchAction = Y.Event._DEFAULT_TOUCH_ACTION;
            num++;
            node.setData(MS_TOUCH_ACTION_COUNT, num);
        }
    },

    /*
    Resets the element's -ms-touch-action property back to the original value, This is called on detach() and detachDelegate().
    */
    _unsetTouchActions = function (node) {
        var elem = _checkDocumentElem(node) || node.getDOMNode(),
            num = node.getData(MS_TOUCH_ACTION_COUNT),
            initTouchAction = node.getData(MS_INIT_TOUCH_ACTION);

        if (SUPPORTS_POINTER) {
            num--;
            node.setData(MS_TOUCH_ACTION_COUNT, num);
            if (num === 0 && elem.style.msTouchAction !== initTouchAction) {
                elem.style.msTouchAction = initTouchAction;
            }
        }
    },

    _prevent = function(e, preventDefault) {
        if (preventDefault) {
            // preventDefault is a boolean or a function
            if (!preventDefault.call || preventDefault(e)) {
                e.preventDefault();
            }
        }
    },

    define = Y.Event.define;
    Y.Event._DEFAULT_TOUCH_ACTION = 'none';

/**
 * Sets up a "gesturemovestart" event, that is fired on touch devices in response to a single finger "touchstart",
 * and on mouse based devices in response to a "mousedown". The subscriber can specify the minimum time
 * and distance thresholds which should be crossed before the "gesturemovestart" is fired and for the mouse,
 * which button should initiate a "gesturemovestart". This event can also be listened for using node.delegate().
 *
 * <p>It is recommended that you use Y.bind to set up context and additional arguments for your event handler,
 * however if you want to pass the context and arguments as additional signature arguments to on/delegate,
 * you need to provide a null value for the configuration object, e.g: <code>node.on("gesturemovestart", fn, null, context, arg1, arg2, arg3)</code></p>
 *
 * @event gesturemovestart
 * @for YUI
 * @param type {string} "gesturemovestart"
 * @param fn {function} The method the event invokes. It receives the event facade of the underlying DOM event (mousedown or touchstart.touches[0]) which contains position co-ordinates.
 * @param cfg {Object} Optional. An object which specifies:
 *
 * <dl>
 * <dt>minDistance (defaults to 0)</dt>
 * <dd>The minimum distance threshold which should be crossed before the gesturemovestart is fired</dd>
 * <dt>minTime (defaults to 0)</dt>
 * <dd>The minimum time threshold for which the finger/mouse should be help down before the gesturemovestart is fired</dd>
 * <dt>button (no default)</dt>
 * <dd>In the case of a mouse input device, if the event should only be fired for a specific mouse button.</dd>
 * <dt>preventDefault (defaults to false)</dt>
 * <dd>Can be set to true/false to prevent default behavior as soon as the touchstart or mousedown is received (that is before minTime or minDistance thresholds are crossed, and so before the gesturemovestart listener is notified) so that things like text selection and context popups (on touch devices) can be
 * prevented. This property can also be set to a function, which returns true or false, based on the event facade passed to it (for example, DragDrop can determine if the target is a valid handle or not before preventing default).</dd>
 * </dl>
 *
 * @return {EventHandle} the detach handle
 */

define(GESTURE_MOVE_START, {

    on: function (node, subscriber, ce) {

        //Set -ms-touch-action on IE10 and set preventDefault to true
        _setTouchActions(node);

        subscriber[_MOVE_START_HANDLE] = node.on(EVENT[START],
            this._onStart,
            this,
            node,
            subscriber,
            ce);
    },

    delegate : function(node, subscriber, ce, filter) {

        var se = this;

        subscriber[_DEL_MOVE_START_HANDLE] = node.delegate(EVENT[START],
            function(e) {
                se._onStart(e, node, subscriber, ce, true);
            },
            filter);
    },

    detachDelegate : function(node, subscriber, ce, filter) {
        var handle = subscriber[_DEL_MOVE_START_HANDLE];

        if (handle) {
            handle.detach();
            subscriber[_DEL_MOVE_START_HANDLE] = null;
        }

        _unsetTouchActions(node);
    },

    detach: function (node, subscriber, ce) {
        var startHandle = subscriber[_MOVE_START_HANDLE];

        if (startHandle) {
            startHandle.detach();
            subscriber[_MOVE_START_HANDLE] = null;
        }

        _unsetTouchActions(node);
    },

    processArgs : function(args, delegate) {
        var params = _defArgsProcessor(this, args, delegate);

        if (!(MIN_TIME in params)) {
            params[MIN_TIME] = this.MIN_TIME;
        }

        if (!(MIN_DISTANCE in params)) {
            params[MIN_DISTANCE] = this.MIN_DISTANCE;
        }

        return params;
    },

    _onStart : function(e, node, subscriber, ce, delegate) {

        if (delegate) {
            node = e[CURRENT_TARGET];
        }

        var params = subscriber._extra,
            fireStart = true,
            minTime = params[MIN_TIME],
            minDistance = params[MIN_DISTANCE],
            button = params.button,
            preventDefault = params[PREVENT_DEFAULT],
            root = _getRoot(node, subscriber),
            startXY;

        if (e.touches) {
            if (e.touches.length === 1) {
                _normTouchFacade(e, e.touches[0], params);
            } else {
                fireStart = false;
            }
        } else {
            fireStart = (button === undefined) || (button === e.button);
        }

        Y.log("gesturemovestart: params = button:" + button + ", minTime = " + minTime + ", minDistance = " + minDistance, "event-gestures");

        if (fireStart) {

            _prevent(e, preventDefault);

            if (minTime === 0 || minDistance === 0) {
                Y.log("gesturemovestart: No minTime or minDistance. Firing immediately", "event-gestures");
                this._start(e, node, ce, params);

            } else {

                startXY = [e.pageX, e.pageY];

                if (minTime > 0) {

                    Y.log("gesturemovestart: minTime specified. Setup timer.", "event-gestures");
                    Y.log("gesturemovestart: initialTime for minTime = " + new Date().getTime(), "event-gestures");

                    params._ht = Y.later(minTime, this, this._start, [e, node, ce, params]);

                    params._hme = root.on(EVENT[END], Y.bind(function() {
                        this._cancel(params);
                    }, this));
                }

                if (minDistance > 0) {

                    Y.log("gesturemovestart: minDistance specified. Setup native mouse/touchmove listener to measure distance.", "event-gestures");
                    Y.log("gesturemovestart: initialXY for minDistance = " + startXY, "event-gestures");

                    params._hm = root.on(EVENT[MOVE], Y.bind(function(em) {
                        if (Math.abs(em.pageX - startXY[0]) > minDistance || Math.abs(em.pageY - startXY[1]) > minDistance) {
                            Y.log("gesturemovestart: minDistance hit.", "event-gestures");
                            this._start(e, node, ce, params);
                        }
                    }, this));
                }
            }
        }
    },

    _cancel : function(params) {
        if (params._ht) {
            params._ht.cancel();
            params._ht = null;
        }
        if (params._hme) {
            params._hme.detach();
            params._hme = null;
        }
        if (params._hm) {
            params._hm.detach();
            params._hm = null;
        }
    },

    _start : function(e, node, ce, params) {

        if (params) {
            this._cancel(params);
        }

        e.type = GESTURE_MOVE_START;

        Y.log("gesturemovestart: Firing start: " + new Date().getTime(), "event-gestures");

        node.setData(_MOVE_START, e);
        ce.fire(e);
    },

    MIN_TIME : 0,
    MIN_DISTANCE : 0,
    PREVENT_DEFAULT : false
});

/**
 * Sets up a "gesturemove" event, that is fired on touch devices in response to a single finger "touchmove",
 * and on mouse based devices in response to a "mousemove".
 *
 * <p>By default this event is only fired when the same node
 * has received a "gesturemovestart" event. The subscriber can set standAlone to true, in the configuration properties,
 * if they want to listen for this event without an initial "gesturemovestart".</p>
 *
 * <p>By default this event sets up it's internal "touchmove" and "mousemove" DOM listeners on the document element. The subscriber
 * can set the root configuration property, to specify which node to attach DOM listeners to, if different from the document.</p>
 *
 * <p>This event can also be listened for using node.delegate().</p>
 *
 * <p>It is recommended that you use Y.bind to set up context and additional arguments for your event handler,
 * however if you want to pass the context and arguments as additional signature arguments to on/delegate,
 * you need to provide a null value for the configuration object, e.g: <code>node.on("gesturemove", fn, null, context, arg1, arg2, arg3)</code></p>
 *
 * @event gesturemove
 * @for YUI
 * @param type {string} "gesturemove"
 * @param fn {function} The method the event invokes. It receives the event facade of the underlying DOM event (mousemove or touchmove.touches[0]) which contains position co-ordinates.
 * @param cfg {Object} Optional. An object which specifies:
 * <dl>
 * <dt>standAlone (defaults to false)</dt>
 * <dd>true, if the subscriber should be notified even if a "gesturemovestart" has not occured on the same node.</dd>
 * <dt>root (defaults to document)</dt>
 * <dd>The node to which the internal DOM listeners should be attached.</dd>
 * <dt>preventDefault (defaults to false)</dt>
 * <dd>Can be set to true/false to prevent default behavior as soon as the touchmove or mousemove is received. As with gesturemovestart, can also be set to function which returns true/false based on the event facade passed to it.</dd>
 * </dl>
 *
 * @return {EventHandle} the detach handle
 */
define(GESTURE_MOVE, {

    on : function (node, subscriber, ce) {

        _setTouchActions(node);
        var root = _getRoot(node, subscriber, EVENT[MOVE]),

            moveHandle = root.on(EVENT[MOVE],
                this._onMove,
                this,
                node,
                subscriber,
                ce);

        subscriber[_MOVE_HANDLE] = moveHandle;

    },

    delegate : function(node, subscriber, ce, filter) {

        var se = this;

        subscriber[_DEL_MOVE_HANDLE] = node.delegate(EVENT[MOVE],
            function(e) {
                se._onMove(e, node, subscriber, ce, true);
            },
            filter);
    },

    detach : function (node, subscriber, ce) {
        var moveHandle = subscriber[_MOVE_HANDLE];

        if (moveHandle) {
            moveHandle.detach();
            subscriber[_MOVE_HANDLE] = null;
        }

        _unsetTouchActions(node);
    },

    detachDelegate : function(node, subscriber, ce, filter) {
        var handle = subscriber[_DEL_MOVE_HANDLE];

        if (handle) {
            handle.detach();
            subscriber[_DEL_MOVE_HANDLE] = null;
        }

        _unsetTouchActions(node);

    },

    processArgs : function(args, delegate) {
        return _defArgsProcessor(this, args, delegate);
    },

    _onMove : function(e, node, subscriber, ce, delegate) {

        if (delegate) {
            node = e[CURRENT_TARGET];
        }

        var fireMove = subscriber._extra.standAlone || node.getData(_MOVE_START),
            preventDefault = subscriber._extra.preventDefault;

        Y.log("onMove initial fireMove check:" + fireMove,"event-gestures");

        if (fireMove) {

            if (e.touches) {
                if (e.touches.length === 1) {
                    _normTouchFacade(e, e.touches[0]);
                } else {
                    fireMove = false;
                }
            }

            if (fireMove) {

                _prevent(e, preventDefault);

                Y.log("onMove second fireMove check:" + fireMove,"event-gestures");

                e.type = GESTURE_MOVE;
                ce.fire(e);
            }
        }
    },

    PREVENT_DEFAULT : false
});

/**
 * Sets up a "gesturemoveend" event, that is fired on touch devices in response to a single finger "touchend",
 * and on mouse based devices in response to a "mouseup".
 *
 * <p>By default this event is only fired when the same node
 * has received a "gesturemove" or "gesturemovestart" event. The subscriber can set standAlone to true, in the configuration properties,
 * if they want to listen for this event without a preceding "gesturemovestart" or "gesturemove".</p>
 *
 * <p>By default this event sets up it's internal "touchend" and "mouseup" DOM listeners on the document element. The subscriber
 * can set the root configuration property, to specify which node to attach DOM listeners to, if different from the document.</p>
 *
 * <p>This event can also be listened for using node.delegate().</p>
 *
 * <p>It is recommended that you use Y.bind to set up context and additional arguments for your event handler,
 * however if you want to pass the context and arguments as additional signature arguments to on/delegate,
 * you need to provide a null value for the configuration object, e.g: <code>node.on("gesturemoveend", fn, null, context, arg1, arg2, arg3)</code></p>
 *
 *
 * @event gesturemoveend
 * @for YUI
 * @param type {string} "gesturemoveend"
 * @param fn {function} The method the event invokes. It receives the event facade of the underlying DOM event (mouseup or touchend.changedTouches[0]).
 * @param cfg {Object} Optional. An object which specifies:
 * <dl>
 * <dt>standAlone (defaults to false)</dt>
 * <dd>true, if the subscriber should be notified even if a "gesturemovestart" or "gesturemove" has not occured on the same node.</dd>
 * <dt>root (defaults to document)</dt>
 * <dd>The node to which the internal DOM listeners should be attached.</dd>
 * <dt>preventDefault (defaults to false)</dt>
 * <dd>Can be set to true/false to prevent default behavior as soon as the touchend or mouseup is received. As with gesturemovestart, can also be set to function which returns true/false based on the event facade passed to it.</dd>
 * </dl>
 *
 * @return {EventHandle} the detach handle
 */
define(GESTURE_MOVE_END, {

    on : function (node, subscriber, ce) {
        _setTouchActions(node);
        var root = _getRoot(node, subscriber),

            endHandle = root.on(EVENT[END],
                this._onEnd,
                this,
                node,
                subscriber,
                ce);

        subscriber[_MOVE_END_HANDLE] = endHandle;
    },

    delegate : function(node, subscriber, ce, filter) {

        var se = this;

        subscriber[_DEL_MOVE_END_HANDLE] = node.delegate(EVENT[END],
            function(e) {
                se._onEnd(e, node, subscriber, ce, true);
            },
            filter);
    },

    detachDelegate : function(node, subscriber, ce, filter) {
        var handle = subscriber[_DEL_MOVE_END_HANDLE];

        if (handle) {
            handle.detach();
            subscriber[_DEL_MOVE_END_HANDLE] = null;
        }

        _unsetTouchActions(node);

    },

    detach : function (node, subscriber, ce) {
        var endHandle = subscriber[_MOVE_END_HANDLE];

        if (endHandle) {
            endHandle.detach();
            subscriber[_MOVE_END_HANDLE] = null;
        }

        _unsetTouchActions(node);
    },

    processArgs : function(args, delegate) {
        return _defArgsProcessor(this, args, delegate);
    },

    _onEnd : function(e, node, subscriber, ce, delegate) {

        if (delegate) {
            node = e[CURRENT_TARGET];
        }

        var fireMoveEnd = subscriber._extra.standAlone || node.getData(_MOVE) || node.getData(_MOVE_START),
            preventDefault = subscriber._extra.preventDefault;

        if (fireMoveEnd) {

            if (e.changedTouches) {
                if (e.changedTouches.length === 1) {
                    _normTouchFacade(e, e.changedTouches[0]);
                } else {
                    fireMoveEnd = false;
                }
            }

            if (fireMoveEnd) {

                _prevent(e, preventDefault);

                e.type = GESTURE_MOVE_END;
                ce.fire(e);

                node.clearData(_MOVE_START);
                node.clearData(_MOVE);
            }
        }
    },

    PREVENT_DEFAULT : false
});


}, '3.7.3', {"requires": ["node-base", "event-touch", "event-synthetic"]});
