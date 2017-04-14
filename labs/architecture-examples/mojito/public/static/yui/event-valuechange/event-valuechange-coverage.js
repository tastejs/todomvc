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
_yuitest_coverage["build/event-valuechange/event-valuechange.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/event-valuechange/event-valuechange.js",
    code: []
};
_yuitest_coverage["build/event-valuechange/event-valuechange.js"].code=["YUI.add('event-valuechange', function (Y, NAME) {","","/**","Adds a synthetic `valuechange` event that fires when the `value` property of an","`<input>` or `<textarea>` node changes as a result of a keystroke, mouse","operation, or input method editor (IME) input event.","","Usage:","","    YUI().use('event-valuechange', function (Y) {","        Y.one('#my-input').on('valuechange', function (e) {","        });","    });","","@module event-valuechange","**/","","/**","Provides the implementation for the synthetic `valuechange` event. This class","isn't meant to be used directly, but is public to make monkeypatching possible.","","Usage:","","    YUI().use('event-valuechange', function (Y) {","        Y.one('#my-input').on('valuechange', function (e) {","        });","    });","","@class ValueChange","@static","*/","","var DATA_KEY = '_valuechange',","    VALUE    = 'value',","","    config, // defined at the end of this file","","// Just a simple namespace to make methods overridable.","VC = {","    // -- Static Constants -----------------------------------------------------","","    /**","    Interval (in milliseconds) at which to poll for changes to the value of an","    element with one or more `valuechange` subscribers when the user is likely","    to be interacting with it.","","    @property POLL_INTERVAL","    @type Number","    @default 50","    @static","    **/","    POLL_INTERVAL: 50,","","    /**","    Timeout (in milliseconds) after which to stop polling when there hasn't been","    any new activity (keypresses, mouse clicks, etc.) on an element.","","    @property TIMEOUT","    @type Number","    @default 10000","    @static","    **/","    TIMEOUT: 10000,","","    // -- Protected Static Methods ---------------------------------------------","","    /**","    Called at an interval to poll for changes to the value of the specified","    node.","","    @method _poll","    @param {Node} node Node to poll.","","    @param {Object} options Options object.","        @param {EventFacade} [options.e] Event facade of the event that","            initiated the polling.","","    @protected","    @static","    **/","    _poll: function (node, options) {","        var domNode = node._node, // performance cheat; getValue() is a big hit when polling","            event   = options.e,","            newVal  = domNode && domNode.value,","            vcData  = node._data && node._data[DATA_KEY], // another perf cheat","            facade, prevVal;","","        if (!domNode || !vcData) {","            VC._stopPolling(node);","            return;","        }","","        prevVal = vcData.prevVal;","","        if (newVal !== prevVal) {","            vcData.prevVal = newVal;","","            facade = {","                _event       : event,","                currentTarget: (event && event.currentTarget) || node,","                newVal       : newVal,","                prevVal      : prevVal,","                target       : (event && event.target) || node","            };","","            Y.Object.each(vcData.notifiers, function (notifier) {","                notifier.fire(facade);","            });","","            VC._refreshTimeout(node);","        }","    },","","    /**","    Restarts the inactivity timeout for the specified node.","","    @method _refreshTimeout","    @param {Node} node Node to refresh.","    @param {SyntheticEvent.Notifier} notifier","    @protected","    @static","    **/","    _refreshTimeout: function (node, notifier) {","        // The node may have been destroyed, so check that it still exists","        // before trying to get its data. Otherwise an error will occur.","        if (!node._node) {","            return;","        }","","        var vcData = node.getData(DATA_KEY);","","        VC._stopTimeout(node); // avoid dupes","","        // If we don't see any changes within the timeout period (10 seconds by","        // default), stop polling.","        vcData.timeout = setTimeout(function () {","            VC._stopPolling(node, notifier);","        }, VC.TIMEOUT);","","    },","","    /**","    Begins polling for changes to the `value` property of the specified node. If","    polling is already underway for the specified node, it will not be restarted","    unless the `force` option is `true`","","    @method _startPolling","    @param {Node} node Node to watch.","    @param {SyntheticEvent.Notifier} notifier","","    @param {Object} options Options object.","        @param {EventFacade} [options.e] Event facade of the event that","            initiated the polling.","        @param {Boolean} [options.force=false] If `true`, polling will be","            restarted even if we're already polling this node.","","    @protected","    @static","    **/","    _startPolling: function (node, notifier, options) {","        if (!node.test('input,textarea')) {","            return;","        }","","        var vcData = node.getData(DATA_KEY);","","        if (!vcData) {","            vcData = {prevVal: node.get(VALUE)};","            node.setData(DATA_KEY, vcData);","        }","","        vcData.notifiers || (vcData.notifiers = {});","","        // Don't bother continuing if we're already polling this node, unless","        // `options.force` is true.","        if (vcData.interval) {","            if (options.force) {","                VC._stopPolling(node, notifier); // restart polling, but avoid dupe polls","            } else {","                vcData.notifiers[Y.stamp(notifier)] = notifier;","                return;","            }","        }","","        // Poll for changes to the node's value. We can't rely on keyboard","        // events for this, since the value may change due to a mouse-initiated","        // paste event, an IME input event, or for some other reason that","        // doesn't trigger a key event.","        vcData.notifiers[Y.stamp(notifier)] = notifier;","","        vcData.interval = setInterval(function () {","            VC._poll(node, vcData, options);","        }, VC.POLL_INTERVAL);","","","        VC._refreshTimeout(node, notifier);","    },","","    /**","    Stops polling for changes to the specified node's `value` attribute.","","    @method _stopPolling","    @param {Node} node Node to stop polling on.","    @param {SyntheticEvent.Notifier} [notifier] Notifier to remove from the","        node. If not specified, all notifiers will be removed.","    @protected","    @static","    **/","    _stopPolling: function (node, notifier) {","        // The node may have been destroyed, so check that it still exists","        // before trying to get its data. Otherwise an error will occur.","        if (!node._node) {","            return;","        }","","        var vcData = node.getData(DATA_KEY) || {};","","        clearInterval(vcData.interval);","        delete vcData.interval;","","        VC._stopTimeout(node);","","        if (notifier) {","            vcData.notifiers && delete vcData.notifiers[Y.stamp(notifier)];","        } else {","            vcData.notifiers = {};","        }","","    },","","    /**","    Clears the inactivity timeout for the specified node, if any.","","    @method _stopTimeout","    @param {Node} node","    @protected","    @static","    **/","    _stopTimeout: function (node) {","        var vcData = node.getData(DATA_KEY) || {};","","        clearTimeout(vcData.timeout);","        delete vcData.timeout;","    },","","    // -- Protected Static Event Handlers --------------------------------------","","    /**","    Stops polling when a node's blur event fires.","","    @method _onBlur","    @param {EventFacade} e","    @param {SyntheticEvent.Notifier} notifier","    @protected","    @static","    **/","    _onBlur: function (e, notifier) {","        VC._stopPolling(e.currentTarget, notifier);","    },","","    /**","    Resets a node's history and starts polling when a focus event occurs.","","    @method _onFocus","    @param {EventFacade} e","    @param {SyntheticEvent.Notifier} notifier","    @protected","    @static","    **/","    _onFocus: function (e, notifier) {","        var node   = e.currentTarget,","            vcData = node.getData(DATA_KEY);","","        if (!vcData) {","            vcData = {};","            node.setData(DATA_KEY, vcData);","        }","","        vcData.prevVal = node.get(VALUE);","","        VC._startPolling(node, notifier, {e: e});","    },","","    /**","    Starts polling when a node receives a keyDown event.","","    @method _onKeyDown","    @param {EventFacade} e","    @param {SyntheticEvent.Notifier} notifier","    @protected","    @static","    **/","    _onKeyDown: function (e, notifier) {","        VC._startPolling(e.currentTarget, notifier, {e: e});","    },","","    /**","    Starts polling when an IME-related keyUp event occurs on a node.","","    @method _onKeyUp","    @param {EventFacade} e","    @param {SyntheticEvent.Notifier} notifier","    @protected","    @static","    **/","    _onKeyUp: function (e, notifier) {","        // These charCodes indicate that an IME has started. We'll restart","        // polling and give the IME up to 10 seconds (by default) to finish.","        if (e.charCode === 229 || e.charCode === 197) {","            VC._startPolling(e.currentTarget, notifier, {","                e    : e,","                force: true","            });","        }","    },","","    /**","    Starts polling when a node receives a mouseDown event.","","    @method _onMouseDown","    @param {EventFacade} e","    @param {SyntheticEvent.Notifier} notifier","    @protected","    @static","    **/","    _onMouseDown: function (e, notifier) {","        VC._startPolling(e.currentTarget, notifier, {e: e});","    },","","    /**","    Called when the `valuechange` event receives a new subscriber.","","    @method _onSubscribe","    @param {Node} node","    @param {Subscription} sub","    @param {SyntheticEvent.Notifier} notifier","    @param {Function|String} [filter] Filter function or selector string. Only","        provided for delegate subscriptions.","    @protected","    @static","    **/","    _onSubscribe: function (node, sub, notifier, filter) {","        var _valuechange, callbacks, nodes;","","        callbacks = {","            blur     : VC._onBlur,","            focus    : VC._onFocus,","            keydown  : VC._onKeyDown,","            keyup    : VC._onKeyUp,","            mousedown: VC._onMouseDown","        };","","        // Store a utility object on the notifier to hold stuff that needs to be","        // passed around to trigger event handlers, polling handlers, etc.","        _valuechange = notifier._valuechange = {};","","        if (filter) {","            // If a filter is provided, then this is a delegated subscription.","            _valuechange.delegated = true;","","            // Add a function to the notifier that we can use to find all","            // nodes that pass the delegate filter.","            _valuechange.getNodes = function () {","                return node.all('input,textarea').filter(filter);","            };","","            // Store the initial values for each descendant of the container","            // node that passes the delegate filter.","            _valuechange.getNodes().each(function (child) {","                if (!child.getData(DATA_KEY)) {","                    child.setData(DATA_KEY, {prevVal: child.get(VALUE)});","                }","            });","","            notifier._handles = Y.delegate(callbacks, node, filter, null,","                notifier);","        } else {","            // This is a normal (non-delegated) event subscription.","","            if (!node.test('input,textarea')) {","                return;","            }","","            if (!node.getData(DATA_KEY)) {","                node.setData(DATA_KEY, {prevVal: node.get(VALUE)});","            }","","            notifier._handles = node.on(callbacks, null, null, notifier);","        }","    },","","    /**","    Called when the `valuechange` event loses a subscriber.","","    @method _onUnsubscribe","    @param {Node} node","    @param {Subscription} subscription","    @param {SyntheticEvent.Notifier} notifier","    @protected","    @static","    **/","    _onUnsubscribe: function (node, subscription, notifier) {","        var _valuechange = notifier._valuechange;","","        notifier._handles && notifier._handles.detach();","","        if (_valuechange.delegated) {","            _valuechange.getNodes().each(function (child) {","                VC._stopPolling(child, notifier);","            });","        } else {","            VC._stopPolling(node, notifier);","        }","    }","};","","/**","Synthetic event that fires when the `value` property of an `<input>` or","`<textarea>` node changes as a result of a user-initiated keystroke, mouse","operation, or input method editor (IME) input event.","","Unlike the `onchange` event, this event fires when the value actually changes","and not when the element loses focus. This event also reports IME and","multi-stroke input more reliably than `oninput` or the various key events across","browsers.","","For performance reasons, only focused nodes are monitored for changes, so","programmatic value changes on nodes that don't have focus won't be detected.","","@example","","    YUI().use('event-valuechange', function (Y) {","        Y.one('#my-input').on('valuechange', function (e) {","        });","    });","","@event valuechange","@param {String} prevVal Previous value prior to the latest change.","@param {String} newVal New value after the latest change.","@for YUI","**/","","config = {","    detach: VC._onUnsubscribe,","    on    : VC._onSubscribe,","","    delegate      : VC._onSubscribe,","    detachDelegate: VC._onUnsubscribe,","","    publishConfig: {","        emitFacade: true","    }","};","","Y.Event.define('valuechange', config);","Y.Event.define('valueChange', config); // deprecated, but supported for backcompat","","Y.ValueChange = VC;","","","}, '3.7.3', {\"requires\": [\"event-focus\", \"event-synthetic\"]});"];
_yuitest_coverage["build/event-valuechange/event-valuechange.js"].lines = {"1":0,"33":0,"82":0,"88":0,"89":0,"90":0,"93":0,"95":0,"96":0,"98":0,"106":0,"107":0,"110":0,"126":0,"127":0,"130":0,"132":0,"136":0,"137":0,"161":0,"162":0,"165":0,"167":0,"168":0,"169":0,"172":0,"176":0,"177":0,"178":0,"180":0,"181":0,"189":0,"191":0,"192":0,"196":0,"212":0,"213":0,"216":0,"218":0,"219":0,"221":0,"223":0,"224":0,"226":0,"240":0,"242":0,"243":0,"258":0,"271":0,"274":0,"275":0,"276":0,"279":0,"281":0,"294":0,"309":0,"310":0,"327":0,"343":0,"345":0,"355":0,"357":0,"359":0,"363":0,"364":0,"369":0,"370":0,"371":0,"375":0,"380":0,"381":0,"384":0,"385":0,"388":0,"403":0,"405":0,"407":0,"408":0,"409":0,"412":0,"443":0,"455":0,"456":0,"458":0};
_yuitest_coverage["build/event-valuechange/event-valuechange.js"].functions = {"(anonymous 2):106":0,"_poll:81":0,"(anonymous 3):136":0,"_refreshTimeout:123":0,"(anonymous 4):191":0,"_startPolling:160":0,"_stopPolling:209":0,"_stopTimeout:239":0,"_onBlur:257":0,"_onFocus:270":0,"_onKeyDown:293":0,"_onKeyUp:306":0,"_onMouseDown:326":0,"getNodes:363":0,"(anonymous 5):369":0,"_onSubscribe:342":0,"(anonymous 6):408":0,"_onUnsubscribe:402":0,"(anonymous 1):1":0};
_yuitest_coverage["build/event-valuechange/event-valuechange.js"].coveredLines = 84;
_yuitest_coverage["build/event-valuechange/event-valuechange.js"].coveredFunctions = 19;
_yuitest_coverline("build/event-valuechange/event-valuechange.js", 1);
YUI.add('event-valuechange', function (Y, NAME) {

/**
Adds a synthetic `valuechange` event that fires when the `value` property of an
`<input>` or `<textarea>` node changes as a result of a keystroke, mouse
operation, or input method editor (IME) input event.

Usage:

    YUI().use('event-valuechange', function (Y) {
        Y.one('#my-input').on('valuechange', function (e) {
        });
    });

@module event-valuechange
**/

/**
Provides the implementation for the synthetic `valuechange` event. This class
isn't meant to be used directly, but is public to make monkeypatching possible.

Usage:

    YUI().use('event-valuechange', function (Y) {
        Y.one('#my-input').on('valuechange', function (e) {
        });
    });

@class ValueChange
@static
*/

_yuitest_coverfunc("build/event-valuechange/event-valuechange.js", "(anonymous 1)", 1);
_yuitest_coverline("build/event-valuechange/event-valuechange.js", 33);
var DATA_KEY = '_valuechange',
    VALUE    = 'value',

    config, // defined at the end of this file

// Just a simple namespace to make methods overridable.
VC = {
    // -- Static Constants -----------------------------------------------------

    /**
    Interval (in milliseconds) at which to poll for changes to the value of an
    element with one or more `valuechange` subscribers when the user is likely
    to be interacting with it.

    @property POLL_INTERVAL
    @type Number
    @default 50
    @static
    **/
    POLL_INTERVAL: 50,

    /**
    Timeout (in milliseconds) after which to stop polling when there hasn't been
    any new activity (keypresses, mouse clicks, etc.) on an element.

    @property TIMEOUT
    @type Number
    @default 10000
    @static
    **/
    TIMEOUT: 10000,

    // -- Protected Static Methods ---------------------------------------------

    /**
    Called at an interval to poll for changes to the value of the specified
    node.

    @method _poll
    @param {Node} node Node to poll.

    @param {Object} options Options object.
        @param {EventFacade} [options.e] Event facade of the event that
            initiated the polling.

    @protected
    @static
    **/
    _poll: function (node, options) {
        _yuitest_coverfunc("build/event-valuechange/event-valuechange.js", "_poll", 81);
_yuitest_coverline("build/event-valuechange/event-valuechange.js", 82);
var domNode = node._node, // performance cheat; getValue() is a big hit when polling
            event   = options.e,
            newVal  = domNode && domNode.value,
            vcData  = node._data && node._data[DATA_KEY], // another perf cheat
            facade, prevVal;

        _yuitest_coverline("build/event-valuechange/event-valuechange.js", 88);
if (!domNode || !vcData) {
            _yuitest_coverline("build/event-valuechange/event-valuechange.js", 89);
VC._stopPolling(node);
            _yuitest_coverline("build/event-valuechange/event-valuechange.js", 90);
return;
        }

        _yuitest_coverline("build/event-valuechange/event-valuechange.js", 93);
prevVal = vcData.prevVal;

        _yuitest_coverline("build/event-valuechange/event-valuechange.js", 95);
if (newVal !== prevVal) {
            _yuitest_coverline("build/event-valuechange/event-valuechange.js", 96);
vcData.prevVal = newVal;

            _yuitest_coverline("build/event-valuechange/event-valuechange.js", 98);
facade = {
                _event       : event,
                currentTarget: (event && event.currentTarget) || node,
                newVal       : newVal,
                prevVal      : prevVal,
                target       : (event && event.target) || node
            };

            _yuitest_coverline("build/event-valuechange/event-valuechange.js", 106);
Y.Object.each(vcData.notifiers, function (notifier) {
                _yuitest_coverfunc("build/event-valuechange/event-valuechange.js", "(anonymous 2)", 106);
_yuitest_coverline("build/event-valuechange/event-valuechange.js", 107);
notifier.fire(facade);
            });

            _yuitest_coverline("build/event-valuechange/event-valuechange.js", 110);
VC._refreshTimeout(node);
        }
    },

    /**
    Restarts the inactivity timeout for the specified node.

    @method _refreshTimeout
    @param {Node} node Node to refresh.
    @param {SyntheticEvent.Notifier} notifier
    @protected
    @static
    **/
    _refreshTimeout: function (node, notifier) {
        // The node may have been destroyed, so check that it still exists
        // before trying to get its data. Otherwise an error will occur.
        _yuitest_coverfunc("build/event-valuechange/event-valuechange.js", "_refreshTimeout", 123);
_yuitest_coverline("build/event-valuechange/event-valuechange.js", 126);
if (!node._node) {
            _yuitest_coverline("build/event-valuechange/event-valuechange.js", 127);
return;
        }

        _yuitest_coverline("build/event-valuechange/event-valuechange.js", 130);
var vcData = node.getData(DATA_KEY);

        _yuitest_coverline("build/event-valuechange/event-valuechange.js", 132);
VC._stopTimeout(node); // avoid dupes

        // If we don't see any changes within the timeout period (10 seconds by
        // default), stop polling.
        _yuitest_coverline("build/event-valuechange/event-valuechange.js", 136);
vcData.timeout = setTimeout(function () {
            _yuitest_coverfunc("build/event-valuechange/event-valuechange.js", "(anonymous 3)", 136);
_yuitest_coverline("build/event-valuechange/event-valuechange.js", 137);
VC._stopPolling(node, notifier);
        }, VC.TIMEOUT);

    },

    /**
    Begins polling for changes to the `value` property of the specified node. If
    polling is already underway for the specified node, it will not be restarted
    unless the `force` option is `true`

    @method _startPolling
    @param {Node} node Node to watch.
    @param {SyntheticEvent.Notifier} notifier

    @param {Object} options Options object.
        @param {EventFacade} [options.e] Event facade of the event that
            initiated the polling.
        @param {Boolean} [options.force=false] If `true`, polling will be
            restarted even if we're already polling this node.

    @protected
    @static
    **/
    _startPolling: function (node, notifier, options) {
        _yuitest_coverfunc("build/event-valuechange/event-valuechange.js", "_startPolling", 160);
_yuitest_coverline("build/event-valuechange/event-valuechange.js", 161);
if (!node.test('input,textarea')) {
            _yuitest_coverline("build/event-valuechange/event-valuechange.js", 162);
return;
        }

        _yuitest_coverline("build/event-valuechange/event-valuechange.js", 165);
var vcData = node.getData(DATA_KEY);

        _yuitest_coverline("build/event-valuechange/event-valuechange.js", 167);
if (!vcData) {
            _yuitest_coverline("build/event-valuechange/event-valuechange.js", 168);
vcData = {prevVal: node.get(VALUE)};
            _yuitest_coverline("build/event-valuechange/event-valuechange.js", 169);
node.setData(DATA_KEY, vcData);
        }

        _yuitest_coverline("build/event-valuechange/event-valuechange.js", 172);
vcData.notifiers || (vcData.notifiers = {});

        // Don't bother continuing if we're already polling this node, unless
        // `options.force` is true.
        _yuitest_coverline("build/event-valuechange/event-valuechange.js", 176);
if (vcData.interval) {
            _yuitest_coverline("build/event-valuechange/event-valuechange.js", 177);
if (options.force) {
                _yuitest_coverline("build/event-valuechange/event-valuechange.js", 178);
VC._stopPolling(node, notifier); // restart polling, but avoid dupe polls
            } else {
                _yuitest_coverline("build/event-valuechange/event-valuechange.js", 180);
vcData.notifiers[Y.stamp(notifier)] = notifier;
                _yuitest_coverline("build/event-valuechange/event-valuechange.js", 181);
return;
            }
        }

        // Poll for changes to the node's value. We can't rely on keyboard
        // events for this, since the value may change due to a mouse-initiated
        // paste event, an IME input event, or for some other reason that
        // doesn't trigger a key event.
        _yuitest_coverline("build/event-valuechange/event-valuechange.js", 189);
vcData.notifiers[Y.stamp(notifier)] = notifier;

        _yuitest_coverline("build/event-valuechange/event-valuechange.js", 191);
vcData.interval = setInterval(function () {
            _yuitest_coverfunc("build/event-valuechange/event-valuechange.js", "(anonymous 4)", 191);
_yuitest_coverline("build/event-valuechange/event-valuechange.js", 192);
VC._poll(node, vcData, options);
        }, VC.POLL_INTERVAL);


        _yuitest_coverline("build/event-valuechange/event-valuechange.js", 196);
VC._refreshTimeout(node, notifier);
    },

    /**
    Stops polling for changes to the specified node's `value` attribute.

    @method _stopPolling
    @param {Node} node Node to stop polling on.
    @param {SyntheticEvent.Notifier} [notifier] Notifier to remove from the
        node. If not specified, all notifiers will be removed.
    @protected
    @static
    **/
    _stopPolling: function (node, notifier) {
        // The node may have been destroyed, so check that it still exists
        // before trying to get its data. Otherwise an error will occur.
        _yuitest_coverfunc("build/event-valuechange/event-valuechange.js", "_stopPolling", 209);
_yuitest_coverline("build/event-valuechange/event-valuechange.js", 212);
if (!node._node) {
            _yuitest_coverline("build/event-valuechange/event-valuechange.js", 213);
return;
        }

        _yuitest_coverline("build/event-valuechange/event-valuechange.js", 216);
var vcData = node.getData(DATA_KEY) || {};

        _yuitest_coverline("build/event-valuechange/event-valuechange.js", 218);
clearInterval(vcData.interval);
        _yuitest_coverline("build/event-valuechange/event-valuechange.js", 219);
delete vcData.interval;

        _yuitest_coverline("build/event-valuechange/event-valuechange.js", 221);
VC._stopTimeout(node);

        _yuitest_coverline("build/event-valuechange/event-valuechange.js", 223);
if (notifier) {
            _yuitest_coverline("build/event-valuechange/event-valuechange.js", 224);
vcData.notifiers && delete vcData.notifiers[Y.stamp(notifier)];
        } else {
            _yuitest_coverline("build/event-valuechange/event-valuechange.js", 226);
vcData.notifiers = {};
        }

    },

    /**
    Clears the inactivity timeout for the specified node, if any.

    @method _stopTimeout
    @param {Node} node
    @protected
    @static
    **/
    _stopTimeout: function (node) {
        _yuitest_coverfunc("build/event-valuechange/event-valuechange.js", "_stopTimeout", 239);
_yuitest_coverline("build/event-valuechange/event-valuechange.js", 240);
var vcData = node.getData(DATA_KEY) || {};

        _yuitest_coverline("build/event-valuechange/event-valuechange.js", 242);
clearTimeout(vcData.timeout);
        _yuitest_coverline("build/event-valuechange/event-valuechange.js", 243);
delete vcData.timeout;
    },

    // -- Protected Static Event Handlers --------------------------------------

    /**
    Stops polling when a node's blur event fires.

    @method _onBlur
    @param {EventFacade} e
    @param {SyntheticEvent.Notifier} notifier
    @protected
    @static
    **/
    _onBlur: function (e, notifier) {
        _yuitest_coverfunc("build/event-valuechange/event-valuechange.js", "_onBlur", 257);
_yuitest_coverline("build/event-valuechange/event-valuechange.js", 258);
VC._stopPolling(e.currentTarget, notifier);
    },

    /**
    Resets a node's history and starts polling when a focus event occurs.

    @method _onFocus
    @param {EventFacade} e
    @param {SyntheticEvent.Notifier} notifier
    @protected
    @static
    **/
    _onFocus: function (e, notifier) {
        _yuitest_coverfunc("build/event-valuechange/event-valuechange.js", "_onFocus", 270);
_yuitest_coverline("build/event-valuechange/event-valuechange.js", 271);
var node   = e.currentTarget,
            vcData = node.getData(DATA_KEY);

        _yuitest_coverline("build/event-valuechange/event-valuechange.js", 274);
if (!vcData) {
            _yuitest_coverline("build/event-valuechange/event-valuechange.js", 275);
vcData = {};
            _yuitest_coverline("build/event-valuechange/event-valuechange.js", 276);
node.setData(DATA_KEY, vcData);
        }

        _yuitest_coverline("build/event-valuechange/event-valuechange.js", 279);
vcData.prevVal = node.get(VALUE);

        _yuitest_coverline("build/event-valuechange/event-valuechange.js", 281);
VC._startPolling(node, notifier, {e: e});
    },

    /**
    Starts polling when a node receives a keyDown event.

    @method _onKeyDown
    @param {EventFacade} e
    @param {SyntheticEvent.Notifier} notifier
    @protected
    @static
    **/
    _onKeyDown: function (e, notifier) {
        _yuitest_coverfunc("build/event-valuechange/event-valuechange.js", "_onKeyDown", 293);
_yuitest_coverline("build/event-valuechange/event-valuechange.js", 294);
VC._startPolling(e.currentTarget, notifier, {e: e});
    },

    /**
    Starts polling when an IME-related keyUp event occurs on a node.

    @method _onKeyUp
    @param {EventFacade} e
    @param {SyntheticEvent.Notifier} notifier
    @protected
    @static
    **/
    _onKeyUp: function (e, notifier) {
        // These charCodes indicate that an IME has started. We'll restart
        // polling and give the IME up to 10 seconds (by default) to finish.
        _yuitest_coverfunc("build/event-valuechange/event-valuechange.js", "_onKeyUp", 306);
_yuitest_coverline("build/event-valuechange/event-valuechange.js", 309);
if (e.charCode === 229 || e.charCode === 197) {
            _yuitest_coverline("build/event-valuechange/event-valuechange.js", 310);
VC._startPolling(e.currentTarget, notifier, {
                e    : e,
                force: true
            });
        }
    },

    /**
    Starts polling when a node receives a mouseDown event.

    @method _onMouseDown
    @param {EventFacade} e
    @param {SyntheticEvent.Notifier} notifier
    @protected
    @static
    **/
    _onMouseDown: function (e, notifier) {
        _yuitest_coverfunc("build/event-valuechange/event-valuechange.js", "_onMouseDown", 326);
_yuitest_coverline("build/event-valuechange/event-valuechange.js", 327);
VC._startPolling(e.currentTarget, notifier, {e: e});
    },

    /**
    Called when the `valuechange` event receives a new subscriber.

    @method _onSubscribe
    @param {Node} node
    @param {Subscription} sub
    @param {SyntheticEvent.Notifier} notifier
    @param {Function|String} [filter] Filter function or selector string. Only
        provided for delegate subscriptions.
    @protected
    @static
    **/
    _onSubscribe: function (node, sub, notifier, filter) {
        _yuitest_coverfunc("build/event-valuechange/event-valuechange.js", "_onSubscribe", 342);
_yuitest_coverline("build/event-valuechange/event-valuechange.js", 343);
var _valuechange, callbacks, nodes;

        _yuitest_coverline("build/event-valuechange/event-valuechange.js", 345);
callbacks = {
            blur     : VC._onBlur,
            focus    : VC._onFocus,
            keydown  : VC._onKeyDown,
            keyup    : VC._onKeyUp,
            mousedown: VC._onMouseDown
        };

        // Store a utility object on the notifier to hold stuff that needs to be
        // passed around to trigger event handlers, polling handlers, etc.
        _yuitest_coverline("build/event-valuechange/event-valuechange.js", 355);
_valuechange = notifier._valuechange = {};

        _yuitest_coverline("build/event-valuechange/event-valuechange.js", 357);
if (filter) {
            // If a filter is provided, then this is a delegated subscription.
            _yuitest_coverline("build/event-valuechange/event-valuechange.js", 359);
_valuechange.delegated = true;

            // Add a function to the notifier that we can use to find all
            // nodes that pass the delegate filter.
            _yuitest_coverline("build/event-valuechange/event-valuechange.js", 363);
_valuechange.getNodes = function () {
                _yuitest_coverfunc("build/event-valuechange/event-valuechange.js", "getNodes", 363);
_yuitest_coverline("build/event-valuechange/event-valuechange.js", 364);
return node.all('input,textarea').filter(filter);
            };

            // Store the initial values for each descendant of the container
            // node that passes the delegate filter.
            _yuitest_coverline("build/event-valuechange/event-valuechange.js", 369);
_valuechange.getNodes().each(function (child) {
                _yuitest_coverfunc("build/event-valuechange/event-valuechange.js", "(anonymous 5)", 369);
_yuitest_coverline("build/event-valuechange/event-valuechange.js", 370);
if (!child.getData(DATA_KEY)) {
                    _yuitest_coverline("build/event-valuechange/event-valuechange.js", 371);
child.setData(DATA_KEY, {prevVal: child.get(VALUE)});
                }
            });

            _yuitest_coverline("build/event-valuechange/event-valuechange.js", 375);
notifier._handles = Y.delegate(callbacks, node, filter, null,
                notifier);
        } else {
            // This is a normal (non-delegated) event subscription.

            _yuitest_coverline("build/event-valuechange/event-valuechange.js", 380);
if (!node.test('input,textarea')) {
                _yuitest_coverline("build/event-valuechange/event-valuechange.js", 381);
return;
            }

            _yuitest_coverline("build/event-valuechange/event-valuechange.js", 384);
if (!node.getData(DATA_KEY)) {
                _yuitest_coverline("build/event-valuechange/event-valuechange.js", 385);
node.setData(DATA_KEY, {prevVal: node.get(VALUE)});
            }

            _yuitest_coverline("build/event-valuechange/event-valuechange.js", 388);
notifier._handles = node.on(callbacks, null, null, notifier);
        }
    },

    /**
    Called when the `valuechange` event loses a subscriber.

    @method _onUnsubscribe
    @param {Node} node
    @param {Subscription} subscription
    @param {SyntheticEvent.Notifier} notifier
    @protected
    @static
    **/
    _onUnsubscribe: function (node, subscription, notifier) {
        _yuitest_coverfunc("build/event-valuechange/event-valuechange.js", "_onUnsubscribe", 402);
_yuitest_coverline("build/event-valuechange/event-valuechange.js", 403);
var _valuechange = notifier._valuechange;

        _yuitest_coverline("build/event-valuechange/event-valuechange.js", 405);
notifier._handles && notifier._handles.detach();

        _yuitest_coverline("build/event-valuechange/event-valuechange.js", 407);
if (_valuechange.delegated) {
            _yuitest_coverline("build/event-valuechange/event-valuechange.js", 408);
_valuechange.getNodes().each(function (child) {
                _yuitest_coverfunc("build/event-valuechange/event-valuechange.js", "(anonymous 6)", 408);
_yuitest_coverline("build/event-valuechange/event-valuechange.js", 409);
VC._stopPolling(child, notifier);
            });
        } else {
            _yuitest_coverline("build/event-valuechange/event-valuechange.js", 412);
VC._stopPolling(node, notifier);
        }
    }
};

/**
Synthetic event that fires when the `value` property of an `<input>` or
`<textarea>` node changes as a result of a user-initiated keystroke, mouse
operation, or input method editor (IME) input event.

Unlike the `onchange` event, this event fires when the value actually changes
and not when the element loses focus. This event also reports IME and
multi-stroke input more reliably than `oninput` or the various key events across
browsers.

For performance reasons, only focused nodes are monitored for changes, so
programmatic value changes on nodes that don't have focus won't be detected.

@example

    YUI().use('event-valuechange', function (Y) {
        Y.one('#my-input').on('valuechange', function (e) {
        });
    });

@event valuechange
@param {String} prevVal Previous value prior to the latest change.
@param {String} newVal New value after the latest change.
@for YUI
**/

_yuitest_coverline("build/event-valuechange/event-valuechange.js", 443);
config = {
    detach: VC._onUnsubscribe,
    on    : VC._onSubscribe,

    delegate      : VC._onSubscribe,
    detachDelegate: VC._onUnsubscribe,

    publishConfig: {
        emitFacade: true
    }
};

_yuitest_coverline("build/event-valuechange/event-valuechange.js", 455);
Y.Event.define('valuechange', config);
_yuitest_coverline("build/event-valuechange/event-valuechange.js", 456);
Y.Event.define('valueChange', config); // deprecated, but supported for backcompat

_yuitest_coverline("build/event-valuechange/event-valuechange.js", 458);
Y.ValueChange = VC;


}, '3.7.3', {"requires": ["event-focus", "event-synthetic"]});
