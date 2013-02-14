/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('event-valuechange', function (Y, NAME) {

/**
Adds a synthetic `valuechange` event that fires when the `value` property of an
`<input>` or `<textarea>` node changes as a result of a keystroke, mouse
operation, or input method editor (IME) input event.

Usage:

    YUI().use('event-valuechange', function (Y) {
        Y.one('#my-input').on('valuechange', function (e) {
            Y.log('previous value: ' + e.prevVal);
            Y.log('new value: ' + e.newVal);
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
            Y.log('previous value: ' + e.prevVal);
            Y.log('new value: ' + e.newVal);
        });
    });

@class ValueChange
@static
*/

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
        var domNode = node._node, // performance cheat; getValue() is a big hit when polling
            event   = options.e,
            newVal  = domNode && domNode.value,
            vcData  = node._data && node._data[DATA_KEY], // another perf cheat
            facade, prevVal;

        if (!domNode || !vcData) {
            Y.log('_poll: node #' + node.get('id') + ' disappeared; stopping polling and removing all notifiers.', 'warn', 'event-valuechange');
            VC._stopPolling(node);
            return;
        }

        prevVal = vcData.prevVal;

        if (newVal !== prevVal) {
            vcData.prevVal = newVal;

            facade = {
                _event       : event,
                currentTarget: (event && event.currentTarget) || node,
                newVal       : newVal,
                prevVal      : prevVal,
                target       : (event && event.target) || node
            };

            Y.Object.each(vcData.notifiers, function (notifier) {
                notifier.fire(facade);
            });

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
        if (!node._node) {
            Y.log('_stopPolling: node disappeared', 'warn', 'event-valuechange');
            return;
        }

        var vcData = node.getData(DATA_KEY);

        VC._stopTimeout(node); // avoid dupes

        // If we don't see any changes within the timeout period (10 seconds by
        // default), stop polling.
        vcData.timeout = setTimeout(function () {
            Y.log('timeout: #' + node.get('id'), 'info', 'event-valuechange');
            VC._stopPolling(node, notifier);
        }, VC.TIMEOUT);

        Y.log('_refreshTimeout: #' + node.get('id'), 'info', 'event-valuechange');
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
        if (!node.test('input,textarea')) {
            Y.log('_startPolling: aborting poll on #' + node.get('id') + ' -- not an input or textarea', 'warn', 'event-valuechange');
            return;
        }

        var vcData = node.getData(DATA_KEY);

        if (!vcData) {
            vcData = {prevVal: node.get(VALUE)};
            node.setData(DATA_KEY, vcData);
        }

        vcData.notifiers || (vcData.notifiers = {});

        // Don't bother continuing if we're already polling this node, unless
        // `options.force` is true.
        if (vcData.interval) {
            if (options.force) {
                VC._stopPolling(node, notifier); // restart polling, but avoid dupe polls
            } else {
                vcData.notifiers[Y.stamp(notifier)] = notifier;
                return;
            }
        }

        // Poll for changes to the node's value. We can't rely on keyboard
        // events for this, since the value may change due to a mouse-initiated
        // paste event, an IME input event, or for some other reason that
        // doesn't trigger a key event.
        vcData.notifiers[Y.stamp(notifier)] = notifier;

        vcData.interval = setInterval(function () {
            VC._poll(node, vcData, options);
        }, VC.POLL_INTERVAL);

        Y.log('_startPolling: #' + node.get('id'), 'info', 'event-valuechange');

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
        if (!node._node) {
            Y.log('_stopPolling: node disappeared', 'info', 'event-valuechange');
            return;
        }

        var vcData = node.getData(DATA_KEY) || {};

        clearInterval(vcData.interval);
        delete vcData.interval;

        VC._stopTimeout(node);

        if (notifier) {
            vcData.notifiers && delete vcData.notifiers[Y.stamp(notifier)];
        } else {
            vcData.notifiers = {};
        }

        Y.log('_stopPolling: #' + node.get('id'), 'info', 'event-valuechange');
    },

    /**
    Clears the inactivity timeout for the specified node, if any.

    @method _stopTimeout
    @param {Node} node
    @protected
    @static
    **/
    _stopTimeout: function (node) {
        var vcData = node.getData(DATA_KEY) || {};

        clearTimeout(vcData.timeout);
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
        var node   = e.currentTarget,
            vcData = node.getData(DATA_KEY);

        if (!vcData) {
            vcData = {};
            node.setData(DATA_KEY, vcData);
        }

        vcData.prevVal = node.get(VALUE);

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
        if (e.charCode === 229 || e.charCode === 197) {
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
        var _valuechange, callbacks, nodes;

        callbacks = {
            blur     : VC._onBlur,
            focus    : VC._onFocus,
            keydown  : VC._onKeyDown,
            keyup    : VC._onKeyUp,
            mousedown: VC._onMouseDown
        };

        // Store a utility object on the notifier to hold stuff that needs to be
        // passed around to trigger event handlers, polling handlers, etc.
        _valuechange = notifier._valuechange = {};

        if (filter) {
            // If a filter is provided, then this is a delegated subscription.
            _valuechange.delegated = true;

            // Add a function to the notifier that we can use to find all
            // nodes that pass the delegate filter.
            _valuechange.getNodes = function () {
                return node.all('input,textarea').filter(filter);
            };

            // Store the initial values for each descendant of the container
            // node that passes the delegate filter.
            _valuechange.getNodes().each(function (child) {
                if (!child.getData(DATA_KEY)) {
                    child.setData(DATA_KEY, {prevVal: child.get(VALUE)});
                }
            });

            notifier._handles = Y.delegate(callbacks, node, filter, null,
                notifier);
        } else {
            // This is a normal (non-delegated) event subscription.

            if (!node.test('input,textarea')) {
                return;
            }

            if (!node.getData(DATA_KEY)) {
                node.setData(DATA_KEY, {prevVal: node.get(VALUE)});
            }

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
        var _valuechange = notifier._valuechange;

        notifier._handles && notifier._handles.detach();

        if (_valuechange.delegated) {
            _valuechange.getNodes().each(function (child) {
                VC._stopPolling(child, notifier);
            });
        } else {
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
            Y.log('previous value: ' + e.prevVal);
            Y.log('new value: ' + e.newVal);
        });
    });

@event valuechange
@param {String} prevVal Previous value prior to the latest change.
@param {String} newVal New value after the latest change.
@for YUI
**/

config = {
    detach: VC._onUnsubscribe,
    on    : VC._onSubscribe,

    delegate      : VC._onSubscribe,
    detachDelegate: VC._onUnsubscribe,

    publishConfig: {
        emitFacade: true
    }
};

Y.Event.define('valuechange', config);
Y.Event.define('valueChange', config); // deprecated, but supported for backcompat

Y.ValueChange = VC;


}, '3.7.3', {"requires": ["event-focus", "event-synthetic"]});
