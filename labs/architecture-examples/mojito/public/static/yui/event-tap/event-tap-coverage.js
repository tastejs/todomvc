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
_yuitest_coverage["build/event-tap/event-tap.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/event-tap/event-tap.js",
    code: []
};
_yuitest_coverage["build/event-tap/event-tap.js"].code=["YUI.add('event-tap', function (Y, NAME) {","","/**","The tap module provides a gesture events, \"tap\", which normalizes user interactions","across touch and mouse or pointer based input devices.  This can be used by application developers","to build input device agnostic components which behave the same in response to either touch or mouse based","interaction.","","'tap' is like a touchscreen 'click', only it requires much less finger-down time since it listens to touch events,","but reverts to mouse events if touch is not supported. ","","@example","","    YUI().use('event-tap', function (Y) {","        Y.one('#my-button').on('tap', function (e) {","        });","    });","","@module event","@submodule event-tap","@author Andres Garza, matuzak and tilo mitra","@since 3.7.0 ","","*/","var doc = Y.config.doc,","    SUPPORTS_TOUCHES = !!(doc && doc.createTouch),","    EVT_START = SUPPORTS_TOUCHES ? 'touchstart' : 'mousedown',","    EVT_MOVE = SUPPORTS_TOUCHES ? 'touchmove' : 'mousemove',","    EVT_END = SUPPORTS_TOUCHES ? 'touchend' : 'mouseup',","    EVT_CANCEL = SUPPORTS_TOUCHES ? 'touchcancel' : 'mousecancel',","    EVT_TAP = 'tap',","","    HANDLES = {","        START: 'Y_TAP_ON_START_HANDLE',","        MOVE: 'Y_TAP_ON_MOVE_HANDLE',","        END: 'Y_TAP_ON_END_HANDLE',","        CANCEL: 'Y_TAP_ON_CANCEL_HANDLE'","    };","","function detachHelper(subscription, handles, subset, context) {","","    handles = subset ? handles : [ handles.START, handles.MOVE, handles.END, handles.CANCEL ];","","    Y.Array.each(handles, function (item, index, array) {","        var handle = subscription[item];","        if (handle) {","            handle.detach();","            subscription[item] = null;","        }","    });","","}","","","/**","Sets up a \"tap\" event, that is fired on touch devices in response to a tap event (finger down, finder up).","This event can be used instead of listening for click events which have a 500ms delay on most touch devices.","This event can also be listened for using node.delegate().","","@event tap","@param type {string} \"tap\"","@param fn {function} The method the event invokes. It receives the event facade of the underlying DOM event.","@for Event","@return {EventHandle} the detach handle","*/","Y.Event.define(EVT_TAP, {","","    /**","    This function should set up the node that will eventually fire the event.","","    Usage: ","","        node.on('tap', function (e) {","        });","","    @method on","    @param {Y.Node} node","    @param {Array} subscription","    @param {Boolean} notifier","    @public","    @static","    **/","    on: function (node, subscription, notifier) {","        subscription[HANDLES.START] = node.on(EVT_START, this.touchStart, this, node, subscription, notifier);","    },","","    /**","    Detaches all event subscriptions set up by the event-tap module","","    @method detach","    @param {Y.Node} node","    @param {Array} subscription","    @param {Boolean} notifier","    @public","    @static","    **/","    detach: function (node, subscription, notifier) {","        detachHelper(subscription, HANDLES);","    },","","    /**","    Event delegation for the 'tap' event. The delegated event will use a ","    supplied selector or filtering function to test if the event references at least one ","    node that should trigger the subscription callback.","","    Usage: ","","        node.delegate('tap', function (e) {","        }, 'li a');","","    @method delegate","    @param {Y.Node} node","    @param {Array} subscription","    @param {Boolean} notifier","    @param {String | Function} filter","    @public","    @static","    **/","    delegate: function (node, subscription, notifier, filter) {","        subscription[HANDLES.START] = node.delegate(EVT_START, function (e) {","            this.touchStart(e, node, subscription, notifier, true);","        }, filter, this);","    },","","    /**","    Detaches the delegated event subscriptions set up by the event-tap module.","    Only used if you use node.delegate(...) instead of node.on(...);","","    @method detachDelegate","    @param {Y.Node} node","    @param {Array} subscription","    @param {Boolean} notifier","    @public","    @static","    **/","    detachDelegate: function (node, subscription, notifier) {","        detachHelper(subscription, HANDLES);","    },","","","    /**","    Called when the monitor(s) are tapped on, either through touchstart or mousedown.","","    @method touchStart","    @param {DOMEventFacade} event","    @param {Y.Node} node","    @param {Array} subscription","    @param {Boolean} notifier","    @param {Boolean} delegate","    @protected","    @static","    **/","    touchStart: function (event, node, subscription, notifier, delegate) {","","        var context = {","                canceled: false","            };","        //move ways to quit early to the top.","","        // no right clicks","        if (event.button && event.button === 3) {","            return;","        }","","        // for now just support a 1 finger count (later enhance via config)","        if (event.touches && event.touches.length !== 1) {","            return;","        }","","        context.node = delegate ? event.currentTarget : node;","","        //There is a double check in here to support event simulation tests, in which","        //event.touches can be undefined when simulating 'touchstart' on touch devices.","        if (SUPPORTS_TOUCHES && event.touches) {","          context.startXY = [ event.touches[0].pageX, event.touches[0].pageY ];","        }","        else {","          context.startXY = [ event.pageX, event.pageY ];","        }","","        //Possibly outdated issue: something is off with the move that it attaches it but never triggers the handler","        subscription[HANDLES.MOVE] = node.once(EVT_MOVE, this.touchMove, this, node, subscription, notifier, delegate, context);","        subscription[HANDLES.END] = node.once(EVT_END, this.touchEnd, this, node, subscription, notifier, delegate, context);","        subscription[HANDLES.CANCEL] = node.once(EVT_CANCEL, this.touchMove, this, node, subscription, notifier, delegate, context);","    },","","    /**","    Called when the monitor(s) fires a touchmove or touchcancel event (or the mouse equivalent).","    This method detaches event handlers so that 'tap' is not fired.","","    @method touchMove","    @param {DOMEventFacade} event","    @param {Y.Node} node","    @param {Array} subscription","    @param {Boolean} notifier","    @param {Boolean} delegate","    @param {Object} context","    @protected","    @static","    **/","    touchMove: function (event, node, subscription, notifier, delegate, context) {","        detachHelper(subscription, [ HANDLES.MOVE, HANDLES.END, HANDLES.CANCEL ], true, context);","        context.cancelled = true;","","    },","","    /**","    Called when the monitor(s) fires a touchend event (or the mouse equivalent).","    This method fires the 'tap' event if certain requirements are met.","","    @method touchEnd","    @param {DOMEventFacade} event","    @param {Y.Node} node","    @param {Array} subscription","    @param {Boolean} notifier","    @param {Boolean} delegate","    @param {Object} context","    @protected","    @static","    **/","    touchEnd: function (event, node, subscription, notifier, delegate, context) {","        var startXY = context.startXY,","            endXY,","            clientXY;","","        //There is a double check in here to support event simulation tests, in which","        //event.touches can be undefined when simulating 'touchstart' on touch devices.","        if (SUPPORTS_TOUCHES && event.changedTouches) {","          endXY = [ event.changedTouches[0].pageX, event.changedTouches[0].pageY ];","          clientXY = [event.changedTouches[0].clientX, event.changedTouches[0].clientY];","        }","        else {","          endXY = [ event.pageX, event.pageY ];","          clientXY = [event.clientX, event.clientY];","        }","","        detachHelper(subscription, [ HANDLES.MOVE, HANDLES.END, HANDLES.CANCEL ], true, context);","","        // make sure mouse didn't move","        if (Math.abs(endXY[0] - startXY[0]) === 0 && Math.abs(endXY[1] - startXY[1]) === 0) {","","            event.type = EVT_TAP;","            event.pageX = endXY[0];","            event.pageY = endXY[1];","            event.clientX = clientXY[0];","            event.clientY = clientXY[1];","            event.currentTarget = context.node;","","            notifier.fire(event);","        }","    }","});","","","}, '3.7.3', {\"requires\": [\"node-base\", \"event-base\", \"event-touch\", \"event-synthetic\"]});"];
_yuitest_coverage["build/event-tap/event-tap.js"].lines = {"1":0,"25":0,"40":0,"42":0,"44":0,"45":0,"46":0,"47":0,"48":0,"66":0,"84":0,"98":0,"120":0,"121":0,"137":0,"155":0,"161":0,"162":0,"166":0,"167":0,"170":0,"174":0,"175":0,"178":0,"182":0,"183":0,"184":0,"202":0,"203":0,"222":0,"228":0,"229":0,"230":0,"233":0,"234":0,"237":0,"240":0,"242":0,"243":0,"244":0,"245":0,"246":0,"247":0,"249":0};
_yuitest_coverage["build/event-tap/event-tap.js"].functions = {"(anonymous 2):44":0,"detachHelper:40":0,"on:83":0,"detach:97":0,"(anonymous 3):120":0,"delegate:119":0,"detachDelegate:136":0,"touchStart:153":0,"touchMove:201":0,"touchEnd:221":0,"(anonymous 1):1":0};
_yuitest_coverage["build/event-tap/event-tap.js"].coveredLines = 44;
_yuitest_coverage["build/event-tap/event-tap.js"].coveredFunctions = 11;
_yuitest_coverline("build/event-tap/event-tap.js", 1);
YUI.add('event-tap', function (Y, NAME) {

/**
The tap module provides a gesture events, "tap", which normalizes user interactions
across touch and mouse or pointer based input devices.  This can be used by application developers
to build input device agnostic components which behave the same in response to either touch or mouse based
interaction.

'tap' is like a touchscreen 'click', only it requires much less finger-down time since it listens to touch events,
but reverts to mouse events if touch is not supported. 

@example

    YUI().use('event-tap', function (Y) {
        Y.one('#my-button').on('tap', function (e) {
        });
    });

@module event
@submodule event-tap
@author Andres Garza, matuzak and tilo mitra
@since 3.7.0 

*/
_yuitest_coverfunc("build/event-tap/event-tap.js", "(anonymous 1)", 1);
_yuitest_coverline("build/event-tap/event-tap.js", 25);
var doc = Y.config.doc,
    SUPPORTS_TOUCHES = !!(doc && doc.createTouch),
    EVT_START = SUPPORTS_TOUCHES ? 'touchstart' : 'mousedown',
    EVT_MOVE = SUPPORTS_TOUCHES ? 'touchmove' : 'mousemove',
    EVT_END = SUPPORTS_TOUCHES ? 'touchend' : 'mouseup',
    EVT_CANCEL = SUPPORTS_TOUCHES ? 'touchcancel' : 'mousecancel',
    EVT_TAP = 'tap',

    HANDLES = {
        START: 'Y_TAP_ON_START_HANDLE',
        MOVE: 'Y_TAP_ON_MOVE_HANDLE',
        END: 'Y_TAP_ON_END_HANDLE',
        CANCEL: 'Y_TAP_ON_CANCEL_HANDLE'
    };

_yuitest_coverline("build/event-tap/event-tap.js", 40);
function detachHelper(subscription, handles, subset, context) {

    _yuitest_coverfunc("build/event-tap/event-tap.js", "detachHelper", 40);
_yuitest_coverline("build/event-tap/event-tap.js", 42);
handles = subset ? handles : [ handles.START, handles.MOVE, handles.END, handles.CANCEL ];

    _yuitest_coverline("build/event-tap/event-tap.js", 44);
Y.Array.each(handles, function (item, index, array) {
        _yuitest_coverfunc("build/event-tap/event-tap.js", "(anonymous 2)", 44);
_yuitest_coverline("build/event-tap/event-tap.js", 45);
var handle = subscription[item];
        _yuitest_coverline("build/event-tap/event-tap.js", 46);
if (handle) {
            _yuitest_coverline("build/event-tap/event-tap.js", 47);
handle.detach();
            _yuitest_coverline("build/event-tap/event-tap.js", 48);
subscription[item] = null;
        }
    });

}


/**
Sets up a "tap" event, that is fired on touch devices in response to a tap event (finger down, finder up).
This event can be used instead of listening for click events which have a 500ms delay on most touch devices.
This event can also be listened for using node.delegate().

@event tap
@param type {string} "tap"
@param fn {function} The method the event invokes. It receives the event facade of the underlying DOM event.
@for Event
@return {EventHandle} the detach handle
*/
_yuitest_coverline("build/event-tap/event-tap.js", 66);
Y.Event.define(EVT_TAP, {

    /**
    This function should set up the node that will eventually fire the event.

    Usage: 

        node.on('tap', function (e) {
        });

    @method on
    @param {Y.Node} node
    @param {Array} subscription
    @param {Boolean} notifier
    @public
    @static
    **/
    on: function (node, subscription, notifier) {
        _yuitest_coverfunc("build/event-tap/event-tap.js", "on", 83);
_yuitest_coverline("build/event-tap/event-tap.js", 84);
subscription[HANDLES.START] = node.on(EVT_START, this.touchStart, this, node, subscription, notifier);
    },

    /**
    Detaches all event subscriptions set up by the event-tap module

    @method detach
    @param {Y.Node} node
    @param {Array} subscription
    @param {Boolean} notifier
    @public
    @static
    **/
    detach: function (node, subscription, notifier) {
        _yuitest_coverfunc("build/event-tap/event-tap.js", "detach", 97);
_yuitest_coverline("build/event-tap/event-tap.js", 98);
detachHelper(subscription, HANDLES);
    },

    /**
    Event delegation for the 'tap' event. The delegated event will use a 
    supplied selector or filtering function to test if the event references at least one 
    node that should trigger the subscription callback.

    Usage: 

        node.delegate('tap', function (e) {
        }, 'li a');

    @method delegate
    @param {Y.Node} node
    @param {Array} subscription
    @param {Boolean} notifier
    @param {String | Function} filter
    @public
    @static
    **/
    delegate: function (node, subscription, notifier, filter) {
        _yuitest_coverfunc("build/event-tap/event-tap.js", "delegate", 119);
_yuitest_coverline("build/event-tap/event-tap.js", 120);
subscription[HANDLES.START] = node.delegate(EVT_START, function (e) {
            _yuitest_coverfunc("build/event-tap/event-tap.js", "(anonymous 3)", 120);
_yuitest_coverline("build/event-tap/event-tap.js", 121);
this.touchStart(e, node, subscription, notifier, true);
        }, filter, this);
    },

    /**
    Detaches the delegated event subscriptions set up by the event-tap module.
    Only used if you use node.delegate(...) instead of node.on(...);

    @method detachDelegate
    @param {Y.Node} node
    @param {Array} subscription
    @param {Boolean} notifier
    @public
    @static
    **/
    detachDelegate: function (node, subscription, notifier) {
        _yuitest_coverfunc("build/event-tap/event-tap.js", "detachDelegate", 136);
_yuitest_coverline("build/event-tap/event-tap.js", 137);
detachHelper(subscription, HANDLES);
    },


    /**
    Called when the monitor(s) are tapped on, either through touchstart or mousedown.

    @method touchStart
    @param {DOMEventFacade} event
    @param {Y.Node} node
    @param {Array} subscription
    @param {Boolean} notifier
    @param {Boolean} delegate
    @protected
    @static
    **/
    touchStart: function (event, node, subscription, notifier, delegate) {

        _yuitest_coverfunc("build/event-tap/event-tap.js", "touchStart", 153);
_yuitest_coverline("build/event-tap/event-tap.js", 155);
var context = {
                canceled: false
            };
        //move ways to quit early to the top.

        // no right clicks
        _yuitest_coverline("build/event-tap/event-tap.js", 161);
if (event.button && event.button === 3) {
            _yuitest_coverline("build/event-tap/event-tap.js", 162);
return;
        }

        // for now just support a 1 finger count (later enhance via config)
        _yuitest_coverline("build/event-tap/event-tap.js", 166);
if (event.touches && event.touches.length !== 1) {
            _yuitest_coverline("build/event-tap/event-tap.js", 167);
return;
        }

        _yuitest_coverline("build/event-tap/event-tap.js", 170);
context.node = delegate ? event.currentTarget : node;

        //There is a double check in here to support event simulation tests, in which
        //event.touches can be undefined when simulating 'touchstart' on touch devices.
        _yuitest_coverline("build/event-tap/event-tap.js", 174);
if (SUPPORTS_TOUCHES && event.touches) {
          _yuitest_coverline("build/event-tap/event-tap.js", 175);
context.startXY = [ event.touches[0].pageX, event.touches[0].pageY ];
        }
        else {
          _yuitest_coverline("build/event-tap/event-tap.js", 178);
context.startXY = [ event.pageX, event.pageY ];
        }

        //Possibly outdated issue: something is off with the move that it attaches it but never triggers the handler
        _yuitest_coverline("build/event-tap/event-tap.js", 182);
subscription[HANDLES.MOVE] = node.once(EVT_MOVE, this.touchMove, this, node, subscription, notifier, delegate, context);
        _yuitest_coverline("build/event-tap/event-tap.js", 183);
subscription[HANDLES.END] = node.once(EVT_END, this.touchEnd, this, node, subscription, notifier, delegate, context);
        _yuitest_coverline("build/event-tap/event-tap.js", 184);
subscription[HANDLES.CANCEL] = node.once(EVT_CANCEL, this.touchMove, this, node, subscription, notifier, delegate, context);
    },

    /**
    Called when the monitor(s) fires a touchmove or touchcancel event (or the mouse equivalent).
    This method detaches event handlers so that 'tap' is not fired.

    @method touchMove
    @param {DOMEventFacade} event
    @param {Y.Node} node
    @param {Array} subscription
    @param {Boolean} notifier
    @param {Boolean} delegate
    @param {Object} context
    @protected
    @static
    **/
    touchMove: function (event, node, subscription, notifier, delegate, context) {
        _yuitest_coverfunc("build/event-tap/event-tap.js", "touchMove", 201);
_yuitest_coverline("build/event-tap/event-tap.js", 202);
detachHelper(subscription, [ HANDLES.MOVE, HANDLES.END, HANDLES.CANCEL ], true, context);
        _yuitest_coverline("build/event-tap/event-tap.js", 203);
context.cancelled = true;

    },

    /**
    Called when the monitor(s) fires a touchend event (or the mouse equivalent).
    This method fires the 'tap' event if certain requirements are met.

    @method touchEnd
    @param {DOMEventFacade} event
    @param {Y.Node} node
    @param {Array} subscription
    @param {Boolean} notifier
    @param {Boolean} delegate
    @param {Object} context
    @protected
    @static
    **/
    touchEnd: function (event, node, subscription, notifier, delegate, context) {
        _yuitest_coverfunc("build/event-tap/event-tap.js", "touchEnd", 221);
_yuitest_coverline("build/event-tap/event-tap.js", 222);
var startXY = context.startXY,
            endXY,
            clientXY;

        //There is a double check in here to support event simulation tests, in which
        //event.touches can be undefined when simulating 'touchstart' on touch devices.
        _yuitest_coverline("build/event-tap/event-tap.js", 228);
if (SUPPORTS_TOUCHES && event.changedTouches) {
          _yuitest_coverline("build/event-tap/event-tap.js", 229);
endXY = [ event.changedTouches[0].pageX, event.changedTouches[0].pageY ];
          _yuitest_coverline("build/event-tap/event-tap.js", 230);
clientXY = [event.changedTouches[0].clientX, event.changedTouches[0].clientY];
        }
        else {
          _yuitest_coverline("build/event-tap/event-tap.js", 233);
endXY = [ event.pageX, event.pageY ];
          _yuitest_coverline("build/event-tap/event-tap.js", 234);
clientXY = [event.clientX, event.clientY];
        }

        _yuitest_coverline("build/event-tap/event-tap.js", 237);
detachHelper(subscription, [ HANDLES.MOVE, HANDLES.END, HANDLES.CANCEL ], true, context);

        // make sure mouse didn't move
        _yuitest_coverline("build/event-tap/event-tap.js", 240);
if (Math.abs(endXY[0] - startXY[0]) === 0 && Math.abs(endXY[1] - startXY[1]) === 0) {

            _yuitest_coverline("build/event-tap/event-tap.js", 242);
event.type = EVT_TAP;
            _yuitest_coverline("build/event-tap/event-tap.js", 243);
event.pageX = endXY[0];
            _yuitest_coverline("build/event-tap/event-tap.js", 244);
event.pageY = endXY[1];
            _yuitest_coverline("build/event-tap/event-tap.js", 245);
event.clientX = clientXY[0];
            _yuitest_coverline("build/event-tap/event-tap.js", 246);
event.clientY = clientXY[1];
            _yuitest_coverline("build/event-tap/event-tap.js", 247);
event.currentTarget = context.node;

            _yuitest_coverline("build/event-tap/event-tap.js", 249);
notifier.fire(event);
        }
    }
});


}, '3.7.3', {"requires": ["node-base", "event-base", "event-touch", "event-synthetic"]});
