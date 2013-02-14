/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('event-delegate', function (Y, NAME) {

/**
 * Adds event delegation support to the library.
 *
 * @module event
 * @submodule event-delegate
 */

var toArray          = Y.Array,
    YLang            = Y.Lang,
    isString         = YLang.isString,
    isObject         = YLang.isObject,
    isArray          = YLang.isArray,
    selectorTest     = Y.Selector.test,
    detachCategories = Y.Env.evt.handles;

/**
 * <p>Sets up event delegation on a container element.  The delegated event
 * will use a supplied selector or filtering function to test if the event
 * references at least one node that should trigger the subscription
 * callback.</p>
 *
 * <p>Selector string filters will trigger the callback if the event originated
 * from a node that matches it or is contained in a node that matches it.
 * Function filters are called for each Node up the parent axis to the
 * subscribing container node, and receive at each level the Node and the event
 * object.  The function should return true (or a truthy value) if that Node
 * should trigger the subscription callback.  Note, it is possible for filters
 * to match multiple Nodes for a single event.  In this case, the delegate
 * callback will be executed for each matching Node.</p>
 *
 * <p>For each matching Node, the callback will be executed with its 'this'
 * object set to the Node matched by the filter (unless a specific context was
 * provided during subscription), and the provided event's
 * <code>currentTarget</code> will also be set to the matching Node.  The
 * containing Node from which the subscription was originally made can be
 * referenced as <code>e.container</code>.
 *
 * @method delegate
 * @param type {String} the event type to delegate
 * @param fn {Function} the callback function to execute.  This function
 *              will be provided the event object for the delegated event.
 * @param el {String|node} the element that is the delegation container
 * @param filter {string|Function} a selector that must match the target of the
 *              event or a function to test target and its parents for a match
 * @param context optional argument that specifies what 'this' refers to.
 * @param args* 0..n additional arguments to pass on to the callback function.
 *              These arguments will be added after the event object.
 * @return {EventHandle} the detach handle
 * @static
 * @for Event
 */
function delegate(type, fn, el, filter) {
    var args     = toArray(arguments, 0, true),
        query    = isString(el) ? el : null,
        typeBits, synth, container, categories, cat, i, len, handles, handle;

    // Support Y.delegate({ click: fnA, key: fnB }, el, filter, ...);
    // and Y.delegate(['click', 'key'], fn, el, filter, ...);
    if (isObject(type)) {
        handles = [];

        if (isArray(type)) {
            for (i = 0, len = type.length; i < len; ++i) {
                args[0] = type[i];
                handles.push(Y.delegate.apply(Y, args));
            }
        } else {
            // Y.delegate({'click', fn}, el, filter) =>
            // Y.delegate('click', fn, el, filter)
            args.unshift(null); // one arg becomes two; need to make space

            for (i in type) {
                if (type.hasOwnProperty(i)) {
                    args[0] = i;
                    args[1] = type[i];
                    handles.push(Y.delegate.apply(Y, args));
                }
            }
        }

        return new Y.EventHandle(handles);
    }

    typeBits = type.split(/\|/);

    if (typeBits.length > 1) {
        cat  = typeBits.shift();
        args[0] = type = typeBits.shift();
    }

    synth = Y.Node.DOM_EVENTS[type];

    if (isObject(synth) && synth.delegate) {
        handle = synth.delegate.apply(synth, arguments);
    }

    if (!handle) {
        if (!type || !fn || !el || !filter) {
            Y.log("delegate requires type, callback, parent, & filter", "warn");
            return;
        }

        container = (query) ? Y.Selector.query(query, null, true) : el;

        if (!container && isString(el)) {
            handle = Y.on('available', function () {
                Y.mix(handle, Y.delegate.apply(Y, args), true);
            }, el);
        }

        if (!handle && container) {
            args.splice(2, 2, container); // remove the filter

            handle = Y.Event._attach(args, { facade: false });
            handle.sub.filter  = filter;
            handle.sub._notify = delegate.notifySub;
        }
    }

    if (handle && cat) {
        categories = detachCategories[cat]  || (detachCategories[cat] = {});
        categories = categories[type] || (categories[type] = []);
        categories.push(handle);
    }

    return handle;
}

/**
Overrides the <code>_notify</code> method on the normal DOM subscription to
inject the filtering logic and only proceed in the case of a match.

This method is hosted as a private property of the `delegate` method
(e.g. `Y.delegate.notifySub`)

@method notifySub
@param thisObj {Object} default 'this' object for the callback
@param args {Array} arguments passed to the event's <code>fire()</code>
@param ce {CustomEvent} the custom event managing the DOM subscriptions for
             the subscribed event on the subscribing node.
@return {Boolean} false if the event was stopped
@private
@static
@since 3.2.0
**/
delegate.notifySub = function (thisObj, args, ce) {
    // Preserve args for other subscribers
    args = args.slice();
    if (this.args) {
        args.push.apply(args, this.args);
    }

    // Only notify subs if the event occurred on a targeted element
    var currentTarget = delegate._applyFilter(this.filter, args, ce),
        //container     = e.currentTarget,
        e, i, len, ret;

    if (currentTarget) {
        // Support multiple matches up the the container subtree
        currentTarget = toArray(currentTarget);

        // The second arg is the currentTarget, but we'll be reusing this
        // facade, replacing the currentTarget for each use, so it doesn't
        // matter what element we seed it with.
        e = args[0] = new Y.DOMEventFacade(args[0], ce.el, ce);

        e.container = Y.one(ce.el);

        for (i = 0, len = currentTarget.length; i < len && !e.stopped; ++i) {
            e.currentTarget = Y.one(currentTarget[i]);

            ret = this.fn.apply(this.context || e.currentTarget, args);

            if (ret === false) { // stop further notifications
                break;
            }
        }

        return ret;
    }
};

/**
Compiles a selector string into a filter function to identify whether
Nodes along the parent axis of an event's target should trigger event
notification.

This function is memoized, so previously compiled filter functions are
returned if the same selector string is provided.

This function may be useful when defining synthetic events for delegate
handling.

Hosted as a property of the `delegate` method (e.g. `Y.delegate.compileFilter`).

@method compileFilter
@param selector {String} the selector string to base the filtration on
@return {Function}
@since 3.2.0
@static
**/
delegate.compileFilter = Y.cached(function (selector) {
    return function (target, e) {
        return selectorTest(target._node, selector,
            (e.currentTarget === e.target) ? null : e.currentTarget._node);
    };
});

/**
Walks up the parent axis of an event's target, and tests each element
against a supplied filter function.  If any Nodes, including the container,
satisfy the filter, the delegated callback will be triggered for each.

Hosted as a protected property of the `delegate` method (e.g.
`Y.delegate._applyFilter`).

@method _applyFilter
@param filter {Function} boolean function to test for inclusion in event
                 notification
@param args {Array} the arguments that would be passed to subscribers
@param ce   {CustomEvent} the DOM event wrapper
@return {Node|Node[]|undefined} The Node or Nodes that satisfy the filter
@protected
**/
delegate._applyFilter = function (filter, args, ce) {
    var e         = args[0],
        container = ce.el, // facadeless events in IE, have no e.currentTarget
        target    = e.target || e.srcElement,
        match     = [],
        isContainer = false;

    // Resolve text nodes to their containing element
    if (target.nodeType === 3) {
        target = target.parentNode;
    }

    // passing target as the first arg rather than leaving well enough alone
    // making 'this' in the filter function refer to the target.  This is to
    // support bound filter functions.
    args.unshift(target);

    if (isString(filter)) {
        while (target) {
            isContainer = (target === container);
            if (selectorTest(target, filter, (isContainer ? null: container))) {
                match.push(target);
            }

            if (isContainer) {
                break;
            }

            target = target.parentNode;
        }
    } else {
        // filter functions are implementer code and should receive wrappers
        args[0] = Y.one(target);
        args[1] = new Y.DOMEventFacade(e, container, ce);

        while (target) {
            // filter(target, e, extra args...) - this === target
            if (filter.apply(args[0], args)) {
                match.push(target);
            }

            if (target === container) {
                break;
            }

            target = target.parentNode;
            args[0] = Y.one(target);
        }
        args[1] = e; // restore the raw DOM event
    }

    if (match.length <= 1) {
        match = match[0]; // single match or undefined
    }

    // remove the target
    args.shift();

    return match;
};

/**
 * Sets up event delegation on a container element.  The delegated event
 * will use a supplied filter to test if the callback should be executed.
 * This filter can be either a selector string or a function that returns
 * a Node to use as the currentTarget for the event.
 *
 * The event object for the delegated event is supplied to the callback
 * function.  It is modified slightly in order to support all properties
 * that may be needed for event delegation.  'currentTarget' is set to
 * the element that matched the selector string filter or the Node returned
 * from the filter function.  'container' is set to the element that the
 * listener is delegated from (this normally would be the 'currentTarget').
 *
 * Filter functions will be called with the arguments that would be passed to
 * the callback function, including the event object as the first parameter.
 * The function should return false (or a falsey value) if the success criteria
 * aren't met, and the Node to use as the event's currentTarget and 'this'
 * object if they are.
 *
 * @method delegate
 * @param type {string} the event type to delegate
 * @param fn {function} the callback function to execute.  This function
 * will be provided the event object for the delegated event.
 * @param el {string|node} the element that is the delegation container
 * @param filter {string|function} a selector that must match the target of the
 * event or a function that returns a Node or false.
 * @param context optional argument that specifies what 'this' refers to.
 * @param args* 0..n additional arguments to pass on to the callback function.
 * These arguments will be added after the event object.
 * @return {EventHandle} the detach handle
 * @for YUI
 */
Y.delegate = Y.Event.delegate = delegate;


}, '3.7.3', {"requires": ["node-base"]});
