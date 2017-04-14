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
_yuitest_coverage["build/event-move/event-move.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/event-move/event-move.js",
    code: []
};
_yuitest_coverage["build/event-move/event-move.js"].code=["YUI.add('event-move', function (Y, NAME) {","","/**"," * Adds lower level support for \"gesturemovestart\", \"gesturemove\" and \"gesturemoveend\" events, which can be used to create drag/drop"," * interactions which work across touch and mouse input devices. They correspond to \"touchstart\", \"touchmove\" and \"touchend\" on a touch input"," * device, and \"mousedown\", \"mousemove\", \"mouseup\" on a mouse based input device."," *"," * <p>Documentation for the gesturemove triplet of events can be found on the <a href=\"../classes/YUI.html#event_gesturemove\">YUI</a> global,"," * along with the other supported events.</p>",""," @example","","     YUI().use('event-move', function (Y) {","         Y.one('#myNode').on('gesturemovestart', function (e) {","         });","         Y.one('#myNode').on('gesturemove', function (e) {","         });","         Y.one('#myNode').on('gesturemoveend', function (e) {","         });","     });",""," * @module event-gestures"," * @submodule event-move"," */","",""," var GESTURE_MAP = Y.Event._GESTURE_MAP,","     EVENT = {","         start: GESTURE_MAP.start,","         end: GESTURE_MAP.end,","         move: GESTURE_MAP.move","     },","    START = \"start\",","    MOVE = \"move\",","    END = \"end\",","","    GESTURE_MOVE = \"gesture\" + MOVE,","    GESTURE_MOVE_END = GESTURE_MOVE + END,","    GESTURE_MOVE_START = GESTURE_MOVE + START,","","    _MOVE_START_HANDLE = \"_msh\",","    _MOVE_HANDLE = \"_mh\",","    _MOVE_END_HANDLE = \"_meh\",","","    _DEL_MOVE_START_HANDLE = \"_dmsh\",","    _DEL_MOVE_HANDLE = \"_dmh\",","    _DEL_MOVE_END_HANDLE = \"_dmeh\",","","    _MOVE_START = \"_ms\",","    _MOVE = \"_m\",","","    MIN_TIME = \"minTime\",","    MIN_DISTANCE = \"minDistance\",","    PREVENT_DEFAULT = \"preventDefault\",","    BUTTON = \"button\",","    OWNER_DOCUMENT = \"ownerDocument\",","","    CURRENT_TARGET = \"currentTarget\",","    TARGET = \"target\",","","    NODE_TYPE = \"nodeType\",","    SUPPORTS_POINTER = Y.config.win && (\"msPointerEnabled\" in Y.config.win.navigator),","    MS_TOUCH_ACTION_COUNT = 'msTouchActionCount',","    MS_INIT_TOUCH_ACTION = 'msInitTouchAction',","","    _defArgsProcessor = function(se, args, delegate) {","        var iConfig = (delegate) ? 4 : 3,","            config = (args.length > iConfig) ? Y.merge(args.splice(iConfig,1)[0]) : {};","","        if (!(PREVENT_DEFAULT in config)) {","            config[PREVENT_DEFAULT] = se.PREVENT_DEFAULT;","        }","","        return config;","    },","","    _getRoot = function(node, subscriber) {","        return subscriber._extra.root || (node.get(NODE_TYPE) === 9) ? node : node.get(OWNER_DOCUMENT);","    },","","    //Checks to see if the node is the document, and if it is, returns the documentElement.","    _checkDocumentElem = function(node) {","        var elem = node.getDOMNode();","        if (node.compareTo(Y.config.doc) && elem.documentElement) {","            return elem.documentElement;","        }","        else {","            return false;","        }","    },","","    _normTouchFacade = function(touchFacade, touch, params) {","        touchFacade.pageX = touch.pageX;","        touchFacade.pageY = touch.pageY;","        touchFacade.screenX = touch.screenX;","        touchFacade.screenY = touch.screenY;","        touchFacade.clientX = touch.clientX;","        touchFacade.clientY = touch.clientY;","        touchFacade[TARGET] = touchFacade[TARGET] || touch[TARGET];","        touchFacade[CURRENT_TARGET] = touchFacade[CURRENT_TARGET] || touch[CURRENT_TARGET];","","        touchFacade[BUTTON] = (params && params[BUTTON]) || 1; // default to left (left as per vendors, not W3C which is 0)","    },","","    /*","    In IE10 touch mode, gestures will not work properly unless the -ms-touch-action CSS property is set to something other than 'auto'. Read http://msdn.microsoft.com/en-us/library/windows/apps/hh767313.aspx for more info. To get around this, we set -ms-touch-action: none which is the same as e.preventDefault() on touch environments. This tells the browser to fire DOM events for all touch events, and not perform any default behavior.","","    The user can over-ride this by setting a more lenient -ms-touch-action property on a node (such as pan-x, pan-y, etc.) via CSS when subscribing to the 'gesturemovestart' event.","    */","    _setTouchActions = function (node) {","        var elem = _checkDocumentElem(node) || node.getDOMNode(),","            num = node.getData(MS_TOUCH_ACTION_COUNT);","","        //Checks to see if msTouchAction is supported.","        if (SUPPORTS_POINTER) {","            if (!num) {","                num = 0;","                node.setData(MS_INIT_TOUCH_ACTION, elem.style.msTouchAction);","            }","            elem.style.msTouchAction = Y.Event._DEFAULT_TOUCH_ACTION;","            num++;","            node.setData(MS_TOUCH_ACTION_COUNT, num);","        }","    },","","    /*","    Resets the element's -ms-touch-action property back to the original value, This is called on detach() and detachDelegate().","    */","    _unsetTouchActions = function (node) {","        var elem = _checkDocumentElem(node) || node.getDOMNode(),","            num = node.getData(MS_TOUCH_ACTION_COUNT),","            initTouchAction = node.getData(MS_INIT_TOUCH_ACTION);","","        if (SUPPORTS_POINTER) {","            num--;","            node.setData(MS_TOUCH_ACTION_COUNT, num);","            if (num === 0 && elem.style.msTouchAction !== initTouchAction) {","                elem.style.msTouchAction = initTouchAction;","            }","        }","    },","","    _prevent = function(e, preventDefault) {","        if (preventDefault) {","            // preventDefault is a boolean or a function","            if (!preventDefault.call || preventDefault(e)) {","                e.preventDefault();","            }","        }","    },","","    define = Y.Event.define;","    Y.Event._DEFAULT_TOUCH_ACTION = 'none';","","/**"," * Sets up a \"gesturemovestart\" event, that is fired on touch devices in response to a single finger \"touchstart\","," * and on mouse based devices in response to a \"mousedown\". The subscriber can specify the minimum time"," * and distance thresholds which should be crossed before the \"gesturemovestart\" is fired and for the mouse,"," * which button should initiate a \"gesturemovestart\". This event can also be listened for using node.delegate()."," *"," * <p>It is recommended that you use Y.bind to set up context and additional arguments for your event handler,"," * however if you want to pass the context and arguments as additional signature arguments to on/delegate,"," * you need to provide a null value for the configuration object, e.g: <code>node.on(\"gesturemovestart\", fn, null, context, arg1, arg2, arg3)</code></p>"," *"," * @event gesturemovestart"," * @for YUI"," * @param type {string} \"gesturemovestart\""," * @param fn {function} The method the event invokes. It receives the event facade of the underlying DOM event (mousedown or touchstart.touches[0]) which contains position co-ordinates."," * @param cfg {Object} Optional. An object which specifies:"," *"," * <dl>"," * <dt>minDistance (defaults to 0)</dt>"," * <dd>The minimum distance threshold which should be crossed before the gesturemovestart is fired</dd>"," * <dt>minTime (defaults to 0)</dt>"," * <dd>The minimum time threshold for which the finger/mouse should be help down before the gesturemovestart is fired</dd>"," * <dt>button (no default)</dt>"," * <dd>In the case of a mouse input device, if the event should only be fired for a specific mouse button.</dd>"," * <dt>preventDefault (defaults to false)</dt>"," * <dd>Can be set to true/false to prevent default behavior as soon as the touchstart or mousedown is received (that is before minTime or minDistance thresholds are crossed, and so before the gesturemovestart listener is notified) so that things like text selection and context popups (on touch devices) can be"," * prevented. This property can also be set to a function, which returns true or false, based on the event facade passed to it (for example, DragDrop can determine if the target is a valid handle or not before preventing default).</dd>"," * </dl>"," *"," * @return {EventHandle} the detach handle"," */","","define(GESTURE_MOVE_START, {","","    on: function (node, subscriber, ce) {","","        //Set -ms-touch-action on IE10 and set preventDefault to true","        _setTouchActions(node);","","        subscriber[_MOVE_START_HANDLE] = node.on(EVENT[START],","            this._onStart,","            this,","            node,","            subscriber,","            ce);","    },","","    delegate : function(node, subscriber, ce, filter) {","","        var se = this;","","        subscriber[_DEL_MOVE_START_HANDLE] = node.delegate(EVENT[START],","            function(e) {","                se._onStart(e, node, subscriber, ce, true);","            },","            filter);","    },","","    detachDelegate : function(node, subscriber, ce, filter) {","        var handle = subscriber[_DEL_MOVE_START_HANDLE];","","        if (handle) {","            handle.detach();","            subscriber[_DEL_MOVE_START_HANDLE] = null;","        }","","        _unsetTouchActions(node);","    },","","    detach: function (node, subscriber, ce) {","        var startHandle = subscriber[_MOVE_START_HANDLE];","","        if (startHandle) {","            startHandle.detach();","            subscriber[_MOVE_START_HANDLE] = null;","        }","","        _unsetTouchActions(node);","    },","","    processArgs : function(args, delegate) {","        var params = _defArgsProcessor(this, args, delegate);","","        if (!(MIN_TIME in params)) {","            params[MIN_TIME] = this.MIN_TIME;","        }","","        if (!(MIN_DISTANCE in params)) {","            params[MIN_DISTANCE] = this.MIN_DISTANCE;","        }","","        return params;","    },","","    _onStart : function(e, node, subscriber, ce, delegate) {","","        if (delegate) {","            node = e[CURRENT_TARGET];","        }","","        var params = subscriber._extra,","            fireStart = true,","            minTime = params[MIN_TIME],","            minDistance = params[MIN_DISTANCE],","            button = params.button,","            preventDefault = params[PREVENT_DEFAULT],","            root = _getRoot(node, subscriber),","            startXY;","","        if (e.touches) {","            if (e.touches.length === 1) {","                _normTouchFacade(e, e.touches[0], params);","            } else {","                fireStart = false;","            }","        } else {","            fireStart = (button === undefined) || (button === e.button);","        }","","","        if (fireStart) {","","            _prevent(e, preventDefault);","","            if (minTime === 0 || minDistance === 0) {","                this._start(e, node, ce, params);","","            } else {","","                startXY = [e.pageX, e.pageY];","","                if (minTime > 0) {","","","                    params._ht = Y.later(minTime, this, this._start, [e, node, ce, params]);","","                    params._hme = root.on(EVENT[END], Y.bind(function() {","                        this._cancel(params);","                    }, this));","                }","","                if (minDistance > 0) {","","","                    params._hm = root.on(EVENT[MOVE], Y.bind(function(em) {","                        if (Math.abs(em.pageX - startXY[0]) > minDistance || Math.abs(em.pageY - startXY[1]) > minDistance) {","                            this._start(e, node, ce, params);","                        }","                    }, this));","                }","            }","        }","    },","","    _cancel : function(params) {","        if (params._ht) {","            params._ht.cancel();","            params._ht = null;","        }","        if (params._hme) {","            params._hme.detach();","            params._hme = null;","        }","        if (params._hm) {","            params._hm.detach();","            params._hm = null;","        }","    },","","    _start : function(e, node, ce, params) {","","        if (params) {","            this._cancel(params);","        }","","        e.type = GESTURE_MOVE_START;","","","        node.setData(_MOVE_START, e);","        ce.fire(e);","    },","","    MIN_TIME : 0,","    MIN_DISTANCE : 0,","    PREVENT_DEFAULT : false","});","","/**"," * Sets up a \"gesturemove\" event, that is fired on touch devices in response to a single finger \"touchmove\","," * and on mouse based devices in response to a \"mousemove\"."," *"," * <p>By default this event is only fired when the same node"," * has received a \"gesturemovestart\" event. The subscriber can set standAlone to true, in the configuration properties,"," * if they want to listen for this event without an initial \"gesturemovestart\".</p>"," *"," * <p>By default this event sets up it's internal \"touchmove\" and \"mousemove\" DOM listeners on the document element. The subscriber"," * can set the root configuration property, to specify which node to attach DOM listeners to, if different from the document.</p>"," *"," * <p>This event can also be listened for using node.delegate().</p>"," *"," * <p>It is recommended that you use Y.bind to set up context and additional arguments for your event handler,"," * however if you want to pass the context and arguments as additional signature arguments to on/delegate,"," * you need to provide a null value for the configuration object, e.g: <code>node.on(\"gesturemove\", fn, null, context, arg1, arg2, arg3)</code></p>"," *"," * @event gesturemove"," * @for YUI"," * @param type {string} \"gesturemove\""," * @param fn {function} The method the event invokes. It receives the event facade of the underlying DOM event (mousemove or touchmove.touches[0]) which contains position co-ordinates."," * @param cfg {Object} Optional. An object which specifies:"," * <dl>"," * <dt>standAlone (defaults to false)</dt>"," * <dd>true, if the subscriber should be notified even if a \"gesturemovestart\" has not occured on the same node.</dd>"," * <dt>root (defaults to document)</dt>"," * <dd>The node to which the internal DOM listeners should be attached.</dd>"," * <dt>preventDefault (defaults to false)</dt>"," * <dd>Can be set to true/false to prevent default behavior as soon as the touchmove or mousemove is received. As with gesturemovestart, can also be set to function which returns true/false based on the event facade passed to it.</dd>"," * </dl>"," *"," * @return {EventHandle} the detach handle"," */","define(GESTURE_MOVE, {","","    on : function (node, subscriber, ce) {","","        _setTouchActions(node);","        var root = _getRoot(node, subscriber, EVENT[MOVE]),","","            moveHandle = root.on(EVENT[MOVE],","                this._onMove,","                this,","                node,","                subscriber,","                ce);","","        subscriber[_MOVE_HANDLE] = moveHandle;","","    },","","    delegate : function(node, subscriber, ce, filter) {","","        var se = this;","","        subscriber[_DEL_MOVE_HANDLE] = node.delegate(EVENT[MOVE],","            function(e) {","                se._onMove(e, node, subscriber, ce, true);","            },","            filter);","    },","","    detach : function (node, subscriber, ce) {","        var moveHandle = subscriber[_MOVE_HANDLE];","","        if (moveHandle) {","            moveHandle.detach();","            subscriber[_MOVE_HANDLE] = null;","        }","","        _unsetTouchActions(node);","    },","","    detachDelegate : function(node, subscriber, ce, filter) {","        var handle = subscriber[_DEL_MOVE_HANDLE];","","        if (handle) {","            handle.detach();","            subscriber[_DEL_MOVE_HANDLE] = null;","        }","","        _unsetTouchActions(node);","","    },","","    processArgs : function(args, delegate) {","        return _defArgsProcessor(this, args, delegate);","    },","","    _onMove : function(e, node, subscriber, ce, delegate) {","","        if (delegate) {","            node = e[CURRENT_TARGET];","        }","","        var fireMove = subscriber._extra.standAlone || node.getData(_MOVE_START),","            preventDefault = subscriber._extra.preventDefault;","","","        if (fireMove) {","","            if (e.touches) {","                if (e.touches.length === 1) {","                    _normTouchFacade(e, e.touches[0]);","                } else {","                    fireMove = false;","                }","            }","","            if (fireMove) {","","                _prevent(e, preventDefault);","","","                e.type = GESTURE_MOVE;","                ce.fire(e);","            }","        }","    },","","    PREVENT_DEFAULT : false","});","","/**"," * Sets up a \"gesturemoveend\" event, that is fired on touch devices in response to a single finger \"touchend\","," * and on mouse based devices in response to a \"mouseup\"."," *"," * <p>By default this event is only fired when the same node"," * has received a \"gesturemove\" or \"gesturemovestart\" event. The subscriber can set standAlone to true, in the configuration properties,"," * if they want to listen for this event without a preceding \"gesturemovestart\" or \"gesturemove\".</p>"," *"," * <p>By default this event sets up it's internal \"touchend\" and \"mouseup\" DOM listeners on the document element. The subscriber"," * can set the root configuration property, to specify which node to attach DOM listeners to, if different from the document.</p>"," *"," * <p>This event can also be listened for using node.delegate().</p>"," *"," * <p>It is recommended that you use Y.bind to set up context and additional arguments for your event handler,"," * however if you want to pass the context and arguments as additional signature arguments to on/delegate,"," * you need to provide a null value for the configuration object, e.g: <code>node.on(\"gesturemoveend\", fn, null, context, arg1, arg2, arg3)</code></p>"," *"," *"," * @event gesturemoveend"," * @for YUI"," * @param type {string} \"gesturemoveend\""," * @param fn {function} The method the event invokes. It receives the event facade of the underlying DOM event (mouseup or touchend.changedTouches[0])."," * @param cfg {Object} Optional. An object which specifies:"," * <dl>"," * <dt>standAlone (defaults to false)</dt>"," * <dd>true, if the subscriber should be notified even if a \"gesturemovestart\" or \"gesturemove\" has not occured on the same node.</dd>"," * <dt>root (defaults to document)</dt>"," * <dd>The node to which the internal DOM listeners should be attached.</dd>"," * <dt>preventDefault (defaults to false)</dt>"," * <dd>Can be set to true/false to prevent default behavior as soon as the touchend or mouseup is received. As with gesturemovestart, can also be set to function which returns true/false based on the event facade passed to it.</dd>"," * </dl>"," *"," * @return {EventHandle} the detach handle"," */","define(GESTURE_MOVE_END, {","","    on : function (node, subscriber, ce) {","        _setTouchActions(node);","        var root = _getRoot(node, subscriber),","","            endHandle = root.on(EVENT[END],","                this._onEnd,","                this,","                node,","                subscriber,","                ce);","","        subscriber[_MOVE_END_HANDLE] = endHandle;","    },","","    delegate : function(node, subscriber, ce, filter) {","","        var se = this;","","        subscriber[_DEL_MOVE_END_HANDLE] = node.delegate(EVENT[END],","            function(e) {","                se._onEnd(e, node, subscriber, ce, true);","            },","            filter);","    },","","    detachDelegate : function(node, subscriber, ce, filter) {","        var handle = subscriber[_DEL_MOVE_END_HANDLE];","","        if (handle) {","            handle.detach();","            subscriber[_DEL_MOVE_END_HANDLE] = null;","        }","","        _unsetTouchActions(node);","","    },","","    detach : function (node, subscriber, ce) {","        var endHandle = subscriber[_MOVE_END_HANDLE];","","        if (endHandle) {","            endHandle.detach();","            subscriber[_MOVE_END_HANDLE] = null;","        }","","        _unsetTouchActions(node);","    },","","    processArgs : function(args, delegate) {","        return _defArgsProcessor(this, args, delegate);","    },","","    _onEnd : function(e, node, subscriber, ce, delegate) {","","        if (delegate) {","            node = e[CURRENT_TARGET];","        }","","        var fireMoveEnd = subscriber._extra.standAlone || node.getData(_MOVE) || node.getData(_MOVE_START),","            preventDefault = subscriber._extra.preventDefault;","","        if (fireMoveEnd) {","","            if (e.changedTouches) {","                if (e.changedTouches.length === 1) {","                    _normTouchFacade(e, e.changedTouches[0]);","                } else {","                    fireMoveEnd = false;","                }","            }","","            if (fireMoveEnd) {","","                _prevent(e, preventDefault);","","                e.type = GESTURE_MOVE_END;","                ce.fire(e);","","                node.clearData(_MOVE_START);","                node.clearData(_MOVE);","            }","        }","    },","","    PREVENT_DEFAULT : false","});","","","}, '3.7.3', {\"requires\": [\"node-base\", \"event-touch\", \"event-synthetic\"]});"];
_yuitest_coverage["build/event-move/event-move.js"].lines = {"1":0,"27":0,"67":0,"70":0,"71":0,"74":0,"78":0,"83":0,"84":0,"85":0,"88":0,"93":0,"94":0,"95":0,"96":0,"97":0,"98":0,"99":0,"100":0,"102":0,"111":0,"115":0,"116":0,"117":0,"118":0,"120":0,"121":0,"122":0,"130":0,"134":0,"135":0,"136":0,"137":0,"138":0,"144":0,"146":0,"147":0,"153":0,"186":0,"191":0,"193":0,"203":0,"205":0,"207":0,"213":0,"215":0,"216":0,"217":0,"220":0,"224":0,"226":0,"227":0,"228":0,"231":0,"235":0,"237":0,"238":0,"241":0,"242":0,"245":0,"250":0,"251":0,"254":0,"263":0,"264":0,"265":0,"267":0,"270":0,"274":0,"276":0,"278":0,"279":0,"283":0,"285":0,"288":0,"290":0,"291":0,"295":0,"298":0,"299":0,"300":0,"309":0,"310":0,"311":0,"313":0,"314":0,"315":0,"317":0,"318":0,"319":0,"325":0,"326":0,"329":0,"332":0,"333":0,"374":0,"378":0,"379":0,"388":0,"394":0,"396":0,"398":0,"404":0,"406":0,"407":0,"408":0,"411":0,"415":0,"417":0,"418":0,"419":0,"422":0,"427":0,"432":0,"433":0,"436":0,"440":0,"442":0,"443":0,"444":0,"446":0,"450":0,"452":0,"455":0,"456":0,"498":0,"501":0,"502":0,"511":0,"516":0,"518":0,"520":0,"526":0,"528":0,"529":0,"530":0,"533":0,"538":0,"540":0,"541":0,"542":0,"545":0,"549":0,"554":0,"555":0,"558":0,"561":0,"563":0,"564":0,"565":0,"567":0,"571":0,"573":0,"575":0,"576":0,"578":0,"579":0};
_yuitest_coverage["build/event-move/event-move.js"].functions = {"_defArgsProcessor:66":0,"_getRoot:77":0,"_checkDocumentElem:82":0,"_normTouchFacade:92":0,"_setTouchActions:110":0,"_unsetTouchActions:129":0,"_prevent:143":0,"on:188":0,"(anonymous 2):206":0,"delegate:201":0,"detachDelegate:212":0,"detach:223":0,"processArgs:234":0,"(anonymous 3):290":0,"(anonymous 4):298":0,"_onStart:248":0,"_cancel:308":0,"_start:323":0,"on:376":0,"(anonymous 5):397":0,"delegate:392":0,"detach:403":0,"detachDelegate:414":0,"processArgs:426":0,"_onMove:430":0,"on:500":0,"(anonymous 6):519":0,"delegate:514":0,"detachDelegate:525":0,"detach:537":0,"processArgs:548":0,"_onEnd:552":0,"(anonymous 1):1":0};
_yuitest_coverage["build/event-move/event-move.js"].coveredLines = 157;
_yuitest_coverage["build/event-move/event-move.js"].coveredFunctions = 33;
_yuitest_coverline("build/event-move/event-move.js", 1);
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
         });
         Y.one('#myNode').on('gesturemove', function (e) {
         });
         Y.one('#myNode').on('gesturemoveend', function (e) {
         });
     });

 * @module event-gestures
 * @submodule event-move
 */


 _yuitest_coverfunc("build/event-move/event-move.js", "(anonymous 1)", 1);
_yuitest_coverline("build/event-move/event-move.js", 27);
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
        _yuitest_coverfunc("build/event-move/event-move.js", "_defArgsProcessor", 66);
_yuitest_coverline("build/event-move/event-move.js", 67);
var iConfig = (delegate) ? 4 : 3,
            config = (args.length > iConfig) ? Y.merge(args.splice(iConfig,1)[0]) : {};

        _yuitest_coverline("build/event-move/event-move.js", 70);
if (!(PREVENT_DEFAULT in config)) {
            _yuitest_coverline("build/event-move/event-move.js", 71);
config[PREVENT_DEFAULT] = se.PREVENT_DEFAULT;
        }

        _yuitest_coverline("build/event-move/event-move.js", 74);
return config;
    },

    _getRoot = function(node, subscriber) {
        _yuitest_coverfunc("build/event-move/event-move.js", "_getRoot", 77);
_yuitest_coverline("build/event-move/event-move.js", 78);
return subscriber._extra.root || (node.get(NODE_TYPE) === 9) ? node : node.get(OWNER_DOCUMENT);
    },

    //Checks to see if the node is the document, and if it is, returns the documentElement.
    _checkDocumentElem = function(node) {
        _yuitest_coverfunc("build/event-move/event-move.js", "_checkDocumentElem", 82);
_yuitest_coverline("build/event-move/event-move.js", 83);
var elem = node.getDOMNode();
        _yuitest_coverline("build/event-move/event-move.js", 84);
if (node.compareTo(Y.config.doc) && elem.documentElement) {
            _yuitest_coverline("build/event-move/event-move.js", 85);
return elem.documentElement;
        }
        else {
            _yuitest_coverline("build/event-move/event-move.js", 88);
return false;
        }
    },

    _normTouchFacade = function(touchFacade, touch, params) {
        _yuitest_coverfunc("build/event-move/event-move.js", "_normTouchFacade", 92);
_yuitest_coverline("build/event-move/event-move.js", 93);
touchFacade.pageX = touch.pageX;
        _yuitest_coverline("build/event-move/event-move.js", 94);
touchFacade.pageY = touch.pageY;
        _yuitest_coverline("build/event-move/event-move.js", 95);
touchFacade.screenX = touch.screenX;
        _yuitest_coverline("build/event-move/event-move.js", 96);
touchFacade.screenY = touch.screenY;
        _yuitest_coverline("build/event-move/event-move.js", 97);
touchFacade.clientX = touch.clientX;
        _yuitest_coverline("build/event-move/event-move.js", 98);
touchFacade.clientY = touch.clientY;
        _yuitest_coverline("build/event-move/event-move.js", 99);
touchFacade[TARGET] = touchFacade[TARGET] || touch[TARGET];
        _yuitest_coverline("build/event-move/event-move.js", 100);
touchFacade[CURRENT_TARGET] = touchFacade[CURRENT_TARGET] || touch[CURRENT_TARGET];

        _yuitest_coverline("build/event-move/event-move.js", 102);
touchFacade[BUTTON] = (params && params[BUTTON]) || 1; // default to left (left as per vendors, not W3C which is 0)
    },

    /*
    In IE10 touch mode, gestures will not work properly unless the -ms-touch-action CSS property is set to something other than 'auto'. Read http://msdn.microsoft.com/en-us/library/windows/apps/hh767313.aspx for more info. To get around this, we set -ms-touch-action: none which is the same as e.preventDefault() on touch environments. This tells the browser to fire DOM events for all touch events, and not perform any default behavior.

    The user can over-ride this by setting a more lenient -ms-touch-action property on a node (such as pan-x, pan-y, etc.) via CSS when subscribing to the 'gesturemovestart' event.
    */
    _setTouchActions = function (node) {
        _yuitest_coverfunc("build/event-move/event-move.js", "_setTouchActions", 110);
_yuitest_coverline("build/event-move/event-move.js", 111);
var elem = _checkDocumentElem(node) || node.getDOMNode(),
            num = node.getData(MS_TOUCH_ACTION_COUNT);

        //Checks to see if msTouchAction is supported.
        _yuitest_coverline("build/event-move/event-move.js", 115);
if (SUPPORTS_POINTER) {
            _yuitest_coverline("build/event-move/event-move.js", 116);
if (!num) {
                _yuitest_coverline("build/event-move/event-move.js", 117);
num = 0;
                _yuitest_coverline("build/event-move/event-move.js", 118);
node.setData(MS_INIT_TOUCH_ACTION, elem.style.msTouchAction);
            }
            _yuitest_coverline("build/event-move/event-move.js", 120);
elem.style.msTouchAction = Y.Event._DEFAULT_TOUCH_ACTION;
            _yuitest_coverline("build/event-move/event-move.js", 121);
num++;
            _yuitest_coverline("build/event-move/event-move.js", 122);
node.setData(MS_TOUCH_ACTION_COUNT, num);
        }
    },

    /*
    Resets the element's -ms-touch-action property back to the original value, This is called on detach() and detachDelegate().
    */
    _unsetTouchActions = function (node) {
        _yuitest_coverfunc("build/event-move/event-move.js", "_unsetTouchActions", 129);
_yuitest_coverline("build/event-move/event-move.js", 130);
var elem = _checkDocumentElem(node) || node.getDOMNode(),
            num = node.getData(MS_TOUCH_ACTION_COUNT),
            initTouchAction = node.getData(MS_INIT_TOUCH_ACTION);

        _yuitest_coverline("build/event-move/event-move.js", 134);
if (SUPPORTS_POINTER) {
            _yuitest_coverline("build/event-move/event-move.js", 135);
num--;
            _yuitest_coverline("build/event-move/event-move.js", 136);
node.setData(MS_TOUCH_ACTION_COUNT, num);
            _yuitest_coverline("build/event-move/event-move.js", 137);
if (num === 0 && elem.style.msTouchAction !== initTouchAction) {
                _yuitest_coverline("build/event-move/event-move.js", 138);
elem.style.msTouchAction = initTouchAction;
            }
        }
    },

    _prevent = function(e, preventDefault) {
        _yuitest_coverfunc("build/event-move/event-move.js", "_prevent", 143);
_yuitest_coverline("build/event-move/event-move.js", 144);
if (preventDefault) {
            // preventDefault is a boolean or a function
            _yuitest_coverline("build/event-move/event-move.js", 146);
if (!preventDefault.call || preventDefault(e)) {
                _yuitest_coverline("build/event-move/event-move.js", 147);
e.preventDefault();
            }
        }
    },

    define = Y.Event.define;
    _yuitest_coverline("build/event-move/event-move.js", 153);
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

_yuitest_coverline("build/event-move/event-move.js", 186);
define(GESTURE_MOVE_START, {

    on: function (node, subscriber, ce) {

        //Set -ms-touch-action on IE10 and set preventDefault to true
        _yuitest_coverfunc("build/event-move/event-move.js", "on", 188);
_yuitest_coverline("build/event-move/event-move.js", 191);
_setTouchActions(node);

        _yuitest_coverline("build/event-move/event-move.js", 193);
subscriber[_MOVE_START_HANDLE] = node.on(EVENT[START],
            this._onStart,
            this,
            node,
            subscriber,
            ce);
    },

    delegate : function(node, subscriber, ce, filter) {

        _yuitest_coverfunc("build/event-move/event-move.js", "delegate", 201);
_yuitest_coverline("build/event-move/event-move.js", 203);
var se = this;

        _yuitest_coverline("build/event-move/event-move.js", 205);
subscriber[_DEL_MOVE_START_HANDLE] = node.delegate(EVENT[START],
            function(e) {
                _yuitest_coverfunc("build/event-move/event-move.js", "(anonymous 2)", 206);
_yuitest_coverline("build/event-move/event-move.js", 207);
se._onStart(e, node, subscriber, ce, true);
            },
            filter);
    },

    detachDelegate : function(node, subscriber, ce, filter) {
        _yuitest_coverfunc("build/event-move/event-move.js", "detachDelegate", 212);
_yuitest_coverline("build/event-move/event-move.js", 213);
var handle = subscriber[_DEL_MOVE_START_HANDLE];

        _yuitest_coverline("build/event-move/event-move.js", 215);
if (handle) {
            _yuitest_coverline("build/event-move/event-move.js", 216);
handle.detach();
            _yuitest_coverline("build/event-move/event-move.js", 217);
subscriber[_DEL_MOVE_START_HANDLE] = null;
        }

        _yuitest_coverline("build/event-move/event-move.js", 220);
_unsetTouchActions(node);
    },

    detach: function (node, subscriber, ce) {
        _yuitest_coverfunc("build/event-move/event-move.js", "detach", 223);
_yuitest_coverline("build/event-move/event-move.js", 224);
var startHandle = subscriber[_MOVE_START_HANDLE];

        _yuitest_coverline("build/event-move/event-move.js", 226);
if (startHandle) {
            _yuitest_coverline("build/event-move/event-move.js", 227);
startHandle.detach();
            _yuitest_coverline("build/event-move/event-move.js", 228);
subscriber[_MOVE_START_HANDLE] = null;
        }

        _yuitest_coverline("build/event-move/event-move.js", 231);
_unsetTouchActions(node);
    },

    processArgs : function(args, delegate) {
        _yuitest_coverfunc("build/event-move/event-move.js", "processArgs", 234);
_yuitest_coverline("build/event-move/event-move.js", 235);
var params = _defArgsProcessor(this, args, delegate);

        _yuitest_coverline("build/event-move/event-move.js", 237);
if (!(MIN_TIME in params)) {
            _yuitest_coverline("build/event-move/event-move.js", 238);
params[MIN_TIME] = this.MIN_TIME;
        }

        _yuitest_coverline("build/event-move/event-move.js", 241);
if (!(MIN_DISTANCE in params)) {
            _yuitest_coverline("build/event-move/event-move.js", 242);
params[MIN_DISTANCE] = this.MIN_DISTANCE;
        }

        _yuitest_coverline("build/event-move/event-move.js", 245);
return params;
    },

    _onStart : function(e, node, subscriber, ce, delegate) {

        _yuitest_coverfunc("build/event-move/event-move.js", "_onStart", 248);
_yuitest_coverline("build/event-move/event-move.js", 250);
if (delegate) {
            _yuitest_coverline("build/event-move/event-move.js", 251);
node = e[CURRENT_TARGET];
        }

        _yuitest_coverline("build/event-move/event-move.js", 254);
var params = subscriber._extra,
            fireStart = true,
            minTime = params[MIN_TIME],
            minDistance = params[MIN_DISTANCE],
            button = params.button,
            preventDefault = params[PREVENT_DEFAULT],
            root = _getRoot(node, subscriber),
            startXY;

        _yuitest_coverline("build/event-move/event-move.js", 263);
if (e.touches) {
            _yuitest_coverline("build/event-move/event-move.js", 264);
if (e.touches.length === 1) {
                _yuitest_coverline("build/event-move/event-move.js", 265);
_normTouchFacade(e, e.touches[0], params);
            } else {
                _yuitest_coverline("build/event-move/event-move.js", 267);
fireStart = false;
            }
        } else {
            _yuitest_coverline("build/event-move/event-move.js", 270);
fireStart = (button === undefined) || (button === e.button);
        }


        _yuitest_coverline("build/event-move/event-move.js", 274);
if (fireStart) {

            _yuitest_coverline("build/event-move/event-move.js", 276);
_prevent(e, preventDefault);

            _yuitest_coverline("build/event-move/event-move.js", 278);
if (minTime === 0 || minDistance === 0) {
                _yuitest_coverline("build/event-move/event-move.js", 279);
this._start(e, node, ce, params);

            } else {

                _yuitest_coverline("build/event-move/event-move.js", 283);
startXY = [e.pageX, e.pageY];

                _yuitest_coverline("build/event-move/event-move.js", 285);
if (minTime > 0) {


                    _yuitest_coverline("build/event-move/event-move.js", 288);
params._ht = Y.later(minTime, this, this._start, [e, node, ce, params]);

                    _yuitest_coverline("build/event-move/event-move.js", 290);
params._hme = root.on(EVENT[END], Y.bind(function() {
                        _yuitest_coverfunc("build/event-move/event-move.js", "(anonymous 3)", 290);
_yuitest_coverline("build/event-move/event-move.js", 291);
this._cancel(params);
                    }, this));
                }

                _yuitest_coverline("build/event-move/event-move.js", 295);
if (minDistance > 0) {


                    _yuitest_coverline("build/event-move/event-move.js", 298);
params._hm = root.on(EVENT[MOVE], Y.bind(function(em) {
                        _yuitest_coverfunc("build/event-move/event-move.js", "(anonymous 4)", 298);
_yuitest_coverline("build/event-move/event-move.js", 299);
if (Math.abs(em.pageX - startXY[0]) > minDistance || Math.abs(em.pageY - startXY[1]) > minDistance) {
                            _yuitest_coverline("build/event-move/event-move.js", 300);
this._start(e, node, ce, params);
                        }
                    }, this));
                }
            }
        }
    },

    _cancel : function(params) {
        _yuitest_coverfunc("build/event-move/event-move.js", "_cancel", 308);
_yuitest_coverline("build/event-move/event-move.js", 309);
if (params._ht) {
            _yuitest_coverline("build/event-move/event-move.js", 310);
params._ht.cancel();
            _yuitest_coverline("build/event-move/event-move.js", 311);
params._ht = null;
        }
        _yuitest_coverline("build/event-move/event-move.js", 313);
if (params._hme) {
            _yuitest_coverline("build/event-move/event-move.js", 314);
params._hme.detach();
            _yuitest_coverline("build/event-move/event-move.js", 315);
params._hme = null;
        }
        _yuitest_coverline("build/event-move/event-move.js", 317);
if (params._hm) {
            _yuitest_coverline("build/event-move/event-move.js", 318);
params._hm.detach();
            _yuitest_coverline("build/event-move/event-move.js", 319);
params._hm = null;
        }
    },

    _start : function(e, node, ce, params) {

        _yuitest_coverfunc("build/event-move/event-move.js", "_start", 323);
_yuitest_coverline("build/event-move/event-move.js", 325);
if (params) {
            _yuitest_coverline("build/event-move/event-move.js", 326);
this._cancel(params);
        }

        _yuitest_coverline("build/event-move/event-move.js", 329);
e.type = GESTURE_MOVE_START;


        _yuitest_coverline("build/event-move/event-move.js", 332);
node.setData(_MOVE_START, e);
        _yuitest_coverline("build/event-move/event-move.js", 333);
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
_yuitest_coverline("build/event-move/event-move.js", 374);
define(GESTURE_MOVE, {

    on : function (node, subscriber, ce) {

        _yuitest_coverfunc("build/event-move/event-move.js", "on", 376);
_yuitest_coverline("build/event-move/event-move.js", 378);
_setTouchActions(node);
        _yuitest_coverline("build/event-move/event-move.js", 379);
var root = _getRoot(node, subscriber, EVENT[MOVE]),

            moveHandle = root.on(EVENT[MOVE],
                this._onMove,
                this,
                node,
                subscriber,
                ce);

        _yuitest_coverline("build/event-move/event-move.js", 388);
subscriber[_MOVE_HANDLE] = moveHandle;

    },

    delegate : function(node, subscriber, ce, filter) {

        _yuitest_coverfunc("build/event-move/event-move.js", "delegate", 392);
_yuitest_coverline("build/event-move/event-move.js", 394);
var se = this;

        _yuitest_coverline("build/event-move/event-move.js", 396);
subscriber[_DEL_MOVE_HANDLE] = node.delegate(EVENT[MOVE],
            function(e) {
                _yuitest_coverfunc("build/event-move/event-move.js", "(anonymous 5)", 397);
_yuitest_coverline("build/event-move/event-move.js", 398);
se._onMove(e, node, subscriber, ce, true);
            },
            filter);
    },

    detach : function (node, subscriber, ce) {
        _yuitest_coverfunc("build/event-move/event-move.js", "detach", 403);
_yuitest_coverline("build/event-move/event-move.js", 404);
var moveHandle = subscriber[_MOVE_HANDLE];

        _yuitest_coverline("build/event-move/event-move.js", 406);
if (moveHandle) {
            _yuitest_coverline("build/event-move/event-move.js", 407);
moveHandle.detach();
            _yuitest_coverline("build/event-move/event-move.js", 408);
subscriber[_MOVE_HANDLE] = null;
        }

        _yuitest_coverline("build/event-move/event-move.js", 411);
_unsetTouchActions(node);
    },

    detachDelegate : function(node, subscriber, ce, filter) {
        _yuitest_coverfunc("build/event-move/event-move.js", "detachDelegate", 414);
_yuitest_coverline("build/event-move/event-move.js", 415);
var handle = subscriber[_DEL_MOVE_HANDLE];

        _yuitest_coverline("build/event-move/event-move.js", 417);
if (handle) {
            _yuitest_coverline("build/event-move/event-move.js", 418);
handle.detach();
            _yuitest_coverline("build/event-move/event-move.js", 419);
subscriber[_DEL_MOVE_HANDLE] = null;
        }

        _yuitest_coverline("build/event-move/event-move.js", 422);
_unsetTouchActions(node);

    },

    processArgs : function(args, delegate) {
        _yuitest_coverfunc("build/event-move/event-move.js", "processArgs", 426);
_yuitest_coverline("build/event-move/event-move.js", 427);
return _defArgsProcessor(this, args, delegate);
    },

    _onMove : function(e, node, subscriber, ce, delegate) {

        _yuitest_coverfunc("build/event-move/event-move.js", "_onMove", 430);
_yuitest_coverline("build/event-move/event-move.js", 432);
if (delegate) {
            _yuitest_coverline("build/event-move/event-move.js", 433);
node = e[CURRENT_TARGET];
        }

        _yuitest_coverline("build/event-move/event-move.js", 436);
var fireMove = subscriber._extra.standAlone || node.getData(_MOVE_START),
            preventDefault = subscriber._extra.preventDefault;


        _yuitest_coverline("build/event-move/event-move.js", 440);
if (fireMove) {

            _yuitest_coverline("build/event-move/event-move.js", 442);
if (e.touches) {
                _yuitest_coverline("build/event-move/event-move.js", 443);
if (e.touches.length === 1) {
                    _yuitest_coverline("build/event-move/event-move.js", 444);
_normTouchFacade(e, e.touches[0]);
                } else {
                    _yuitest_coverline("build/event-move/event-move.js", 446);
fireMove = false;
                }
            }

            _yuitest_coverline("build/event-move/event-move.js", 450);
if (fireMove) {

                _yuitest_coverline("build/event-move/event-move.js", 452);
_prevent(e, preventDefault);


                _yuitest_coverline("build/event-move/event-move.js", 455);
e.type = GESTURE_MOVE;
                _yuitest_coverline("build/event-move/event-move.js", 456);
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
_yuitest_coverline("build/event-move/event-move.js", 498);
define(GESTURE_MOVE_END, {

    on : function (node, subscriber, ce) {
        _yuitest_coverfunc("build/event-move/event-move.js", "on", 500);
_yuitest_coverline("build/event-move/event-move.js", 501);
_setTouchActions(node);
        _yuitest_coverline("build/event-move/event-move.js", 502);
var root = _getRoot(node, subscriber),

            endHandle = root.on(EVENT[END],
                this._onEnd,
                this,
                node,
                subscriber,
                ce);

        _yuitest_coverline("build/event-move/event-move.js", 511);
subscriber[_MOVE_END_HANDLE] = endHandle;
    },

    delegate : function(node, subscriber, ce, filter) {

        _yuitest_coverfunc("build/event-move/event-move.js", "delegate", 514);
_yuitest_coverline("build/event-move/event-move.js", 516);
var se = this;

        _yuitest_coverline("build/event-move/event-move.js", 518);
subscriber[_DEL_MOVE_END_HANDLE] = node.delegate(EVENT[END],
            function(e) {
                _yuitest_coverfunc("build/event-move/event-move.js", "(anonymous 6)", 519);
_yuitest_coverline("build/event-move/event-move.js", 520);
se._onEnd(e, node, subscriber, ce, true);
            },
            filter);
    },

    detachDelegate : function(node, subscriber, ce, filter) {
        _yuitest_coverfunc("build/event-move/event-move.js", "detachDelegate", 525);
_yuitest_coverline("build/event-move/event-move.js", 526);
var handle = subscriber[_DEL_MOVE_END_HANDLE];

        _yuitest_coverline("build/event-move/event-move.js", 528);
if (handle) {
            _yuitest_coverline("build/event-move/event-move.js", 529);
handle.detach();
            _yuitest_coverline("build/event-move/event-move.js", 530);
subscriber[_DEL_MOVE_END_HANDLE] = null;
        }

        _yuitest_coverline("build/event-move/event-move.js", 533);
_unsetTouchActions(node);

    },

    detach : function (node, subscriber, ce) {
        _yuitest_coverfunc("build/event-move/event-move.js", "detach", 537);
_yuitest_coverline("build/event-move/event-move.js", 538);
var endHandle = subscriber[_MOVE_END_HANDLE];

        _yuitest_coverline("build/event-move/event-move.js", 540);
if (endHandle) {
            _yuitest_coverline("build/event-move/event-move.js", 541);
endHandle.detach();
            _yuitest_coverline("build/event-move/event-move.js", 542);
subscriber[_MOVE_END_HANDLE] = null;
        }

        _yuitest_coverline("build/event-move/event-move.js", 545);
_unsetTouchActions(node);
    },

    processArgs : function(args, delegate) {
        _yuitest_coverfunc("build/event-move/event-move.js", "processArgs", 548);
_yuitest_coverline("build/event-move/event-move.js", 549);
return _defArgsProcessor(this, args, delegate);
    },

    _onEnd : function(e, node, subscriber, ce, delegate) {

        _yuitest_coverfunc("build/event-move/event-move.js", "_onEnd", 552);
_yuitest_coverline("build/event-move/event-move.js", 554);
if (delegate) {
            _yuitest_coverline("build/event-move/event-move.js", 555);
node = e[CURRENT_TARGET];
        }

        _yuitest_coverline("build/event-move/event-move.js", 558);
var fireMoveEnd = subscriber._extra.standAlone || node.getData(_MOVE) || node.getData(_MOVE_START),
            preventDefault = subscriber._extra.preventDefault;

        _yuitest_coverline("build/event-move/event-move.js", 561);
if (fireMoveEnd) {

            _yuitest_coverline("build/event-move/event-move.js", 563);
if (e.changedTouches) {
                _yuitest_coverline("build/event-move/event-move.js", 564);
if (e.changedTouches.length === 1) {
                    _yuitest_coverline("build/event-move/event-move.js", 565);
_normTouchFacade(e, e.changedTouches[0]);
                } else {
                    _yuitest_coverline("build/event-move/event-move.js", 567);
fireMoveEnd = false;
                }
            }

            _yuitest_coverline("build/event-move/event-move.js", 571);
if (fireMoveEnd) {

                _yuitest_coverline("build/event-move/event-move.js", 573);
_prevent(e, preventDefault);

                _yuitest_coverline("build/event-move/event-move.js", 575);
e.type = GESTURE_MOVE_END;
                _yuitest_coverline("build/event-move/event-move.js", 576);
ce.fire(e);

                _yuitest_coverline("build/event-move/event-move.js", 578);
node.clearData(_MOVE_START);
                _yuitest_coverline("build/event-move/event-move.js", 579);
node.clearData(_MOVE);
            }
        }
    },

    PREVENT_DEFAULT : false
});


}, '3.7.3', {"requires": ["node-base", "event-touch", "event-synthetic"]});
