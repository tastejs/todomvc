/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('event-focus', function (Y, NAME) {

/**
 * Adds bubbling and delegation support to DOM events focus and blur.
 * 
 * @module event
 * @submodule event-focus
 */
var Event    = Y.Event,

    YLang    = Y.Lang,

    isString = YLang.isString,

    arrayIndex = Y.Array.indexOf,

    useActivate = (function() {

        // Changing the structure of this test, so that it doesn't use inline JS in HTML,
        // which throws an exception in Win8 packaged apps, due to additional security restrictions:
        // http://msdn.microsoft.com/en-us/library/windows/apps/hh465380.aspx#differences

        var p = Y.config.doc.createElement("p"),
            listener;

        p.setAttribute("onbeforeactivate", ";");
        listener = p.onbeforeactivate;

        // listener is a function in IE8+.
        // listener is a string in IE6,7 (unfortunate, but that's not going to change. Otherwise we could have just checked for function).
        // listener is a function in IE10, in a Win8 App environment (no exception running the test).

        // listener is undefined in Webkit/Gecko.
        // listener is a function in Webkit/Gecko if it's a supported event (e.g. onclick).

        return (listener !== undefined);
    }());

function define(type, proxy, directEvent) {
    var nodeDataKey = '_' + type + 'Notifiers';

    Y.Event.define(type, {

        _useActivate : useActivate,

        _attach: function (el, notifier, delegate) {
            if (Y.DOM.isWindow(el)) {
                return Event._attach([type, function (e) {
                    notifier.fire(e);
                }, el]);
            } else {
                return Event._attach(
                    [proxy, this._proxy, el, this, notifier, delegate],
                    { capture: true });
            }
        },

        _proxy: function (e, notifier, delegate) {
            var target        = e.target,
                currentTarget = e.currentTarget,
                notifiers     = target.getData(nodeDataKey),
                yuid          = Y.stamp(currentTarget._node),
                defer         = (useActivate || target !== currentTarget),
                directSub;
                
            notifier.currentTarget = (delegate) ? target : currentTarget;
            notifier.container     = (delegate) ? currentTarget : null;

            // Maintain a list to handle subscriptions from nested
            // containers div#a>div#b>input #a.on(focus..) #b.on(focus..),
            // use one focus or blur subscription that fires notifiers from
            // #b then #a to emulate bubble sequence.
            if (!notifiers) {
                notifiers = {};
                target.setData(nodeDataKey, notifiers);

                // only subscribe to the element's focus if the target is
                // not the current target (
                if (defer) {
                    directSub = Event._attach(
                        [directEvent, this._notify, target._node]).sub;
                    directSub.once = true;
                }
            } else {
                // In old IE, defer is always true.  In capture-phase browsers,
                // The delegate subscriptions will be encountered first, which
                // will establish the notifiers data and direct subscription
                // on the node.  If there is also a direct subscription to the
                // node's focus/blur, it should not call _notify because the
                // direct subscription from the delegate sub(s) exists, which
                // will call _notify.  So this avoids _notify being called
                // twice, unnecessarily.
                defer = true;
            }

            if (!notifiers[yuid]) {
                notifiers[yuid] = [];
            }

            notifiers[yuid].push(notifier);

            if (!defer) {
                this._notify(e);
            }
        },

        _notify: function (e, container) {
            var currentTarget = e.currentTarget,
                notifierData  = currentTarget.getData(nodeDataKey),
                axisNodes     = currentTarget.ancestors(),
                doc           = currentTarget.get('ownerDocument'),
                delegates     = [],
                                // Used to escape loops when there are no more
                                // notifiers to consider
                count         = notifierData ?
                                    Y.Object.keys(notifierData).length :
                                    0,
                target, notifiers, notifier, yuid, match, tmp, i, len, sub, ret;

            // clear the notifications list (mainly for delegation)
            currentTarget.clearData(nodeDataKey);

            // Order the delegate subs by their placement in the parent axis
            axisNodes.push(currentTarget);
            // document.get('ownerDocument') returns null
            // which we'll use to prevent having duplicate Nodes in the list
            if (doc) {
                axisNodes.unshift(doc);
            }

            // ancestors() returns the Nodes from top to bottom
            axisNodes._nodes.reverse();

            if (count) {
                // Store the count for step 2
                tmp = count;
                axisNodes.some(function (node) {
                    var yuid      = Y.stamp(node),
                        notifiers = notifierData[yuid],
                        i, len;

                    if (notifiers) {
                        count--;
                        for (i = 0, len = notifiers.length; i < len; ++i) {
                            if (notifiers[i].handle.sub.filter) {
                                delegates.push(notifiers[i]);
                            }
                        }
                    }

                    return !count;
                });
                count = tmp;
            }

            // Walk up the parent axis, notifying direct subscriptions and
            // testing delegate filters.
            while (count && (target = axisNodes.shift())) {
                yuid = Y.stamp(target);

                notifiers = notifierData[yuid];

                if (notifiers) {
                    for (i = 0, len = notifiers.length; i < len; ++i) {
                        notifier = notifiers[i];
                        sub      = notifier.handle.sub;
                        match    = true;

                        e.currentTarget = target;

                        if (sub.filter) {
                            match = sub.filter.apply(target,
                                [target, e].concat(sub.args || []));

                            // No longer necessary to test against this
                            // delegate subscription for the nodes along
                            // the parent axis.
                            delegates.splice(
                                arrayIndex(delegates, notifier), 1);
                        }

                        if (match) {
                            // undefined for direct subs
                            e.container = notifier.container;
                            ret = notifier.fire(e);
                        }

                        if (ret === false || e.stopped === 2) {
                            break;
                        }
                    }
                    
                    delete notifiers[yuid];
                    count--;
                }

                if (e.stopped !== 2) {
                    // delegates come after subs targeting this specific node
                    // because they would not normally report until they'd
                    // bubbled to the container node.
                    for (i = 0, len = delegates.length; i < len; ++i) {
                        notifier = delegates[i];
                        sub = notifier.handle.sub;

                        if (sub.filter.apply(target,
                            [target, e].concat(sub.args || []))) {

                            e.container = notifier.container;
                            e.currentTarget = target;
                            ret = notifier.fire(e);
                        }

                        if (ret === false || e.stopped === 2) {
                            break;
                        }
                    }
                }

                if (e.stopped) {
                    break;
                }
            }
        },

        on: function (node, sub, notifier) {
            sub.handle = this._attach(node._node, notifier);
        },

        detach: function (node, sub) {
            sub.handle.detach();
        },

        delegate: function (node, sub, notifier, filter) {
            if (isString(filter)) {
                sub.filter = function (target) {
                    return Y.Selector.test(target._node, filter,
                        node === target ? null : node._node);
                };
            }

            sub.handle = this._attach(node._node, notifier, true);
        },

        detachDelegate: function (node, sub) {
            sub.handle.detach();
        }
    }, true);
}

// For IE, we need to defer to focusin rather than focus because
// `el.focus(); doSomething();` executes el.onbeforeactivate, el.onactivate,
// el.onfocusin, doSomething, then el.onfocus.  All others support capture
// phase focus, which executes before doSomething.  To guarantee consistent
// behavior for this use case, IE's direct subscriptions are made against
// focusin so subscribers will be notified before js following el.focus() is
// executed.
if (useActivate) {
    //     name     capture phase       direct subscription
    define("focus", "beforeactivate",   "focusin");
    define("blur",  "beforedeactivate", "focusout");
} else {
    define("focus", "focus", "focus");
    define("blur",  "blur",  "blur");
}


}, '3.7.3', {"requires": ["event-synthetic"]});
