var maria = (function() { // IIFE
/*
Evento version 1
Copyright (c) 2013, Peter Michaux
All rights reserved.
Licensed under the Simplified BSD License.
https://github.com/petermichaux/evento/blob/master/LICENSE
*/
/**

The root namespace for the Evento library.

@namespace

*/
var evento = {};
/**

A constructor function for creating event target objects.

    var et = new evento.EventTarget();

The methods of an event target object are inspired by the DOM2 standard.

@constructor

*/
evento.EventTarget = function() {};

(function() {

    function hasOwnProperty(o, p) {
        return Object.prototype.hasOwnProperty.call(o, p);
    }

    var create = (function() {
        function F() {}
        return function(o) {
            F.prototype = o;
            return new F();
        };
    }());

/**

If the listener is an object then when a matching event type is dispatched on
the event target, the listener object's `handleEvent` method will be called.

If the listener is a function then when a matching event type is dispatched on
the event target, the listener function is called with event target object set as
the `this` object.

One listener (or type/listener pair to be more precise) can be added only once.

    et.addEventListener('change', {handleEvent:function(){}});
    et.addEventListener('change', function(){});

@param {string} type The name of the event.

@param {(Object|function)} listener The listener object or callback function.

*/
    evento.EventTarget.prototype.addEventListener = function(type, listener) {
        hasOwnProperty(this, '_evento_listeners') || (this._evento_listeners = {});
        hasOwnProperty(this._evento_listeners, type) || (this._evento_listeners[type] = []);
        var listeners = this._evento_listeners[type];
        for (var i = 0, ilen = listeners.length; i < ilen; i++) {
            if (listeners[i] === listener) {
                // can only add a listener once
                return;
            }
        }
        listeners.push(listener);
    };

/**

Removes added listener matching the type/listener combination exactly.
If this combination is not found there are no errors.

    var o = {handleEvent:function(){}};
    et.removeEventListener('change', o);
    et.removeEventListener('change', fn);

@param {string} type The name of the event.

@param {(Object|function)} listener The listener object or callback function.

*/
    evento.EventTarget.prototype.removeEventListener = function(type, listener) {
        if (hasOwnProperty(this, '_evento_listeners') &&
            hasOwnProperty(this._evento_listeners, type)) {
            var listeners = this._evento_listeners[type];
            for (var i = 0, ilen = listeners.length; i < ilen; i++) {
                if (listeners[i] === listener) {
                    listeners.splice(i, 1);
                    // no need to continue since a particular listener
                    // can only be added once
                    return;
                }
            }
        }
    };

/**

When an event is dispatched on an event target, if that event target has parents
then the event is also dispatched on the parents as long as bubbling has not
been canceled on the event.

One parent can be added only once.

    var o = new evento.EventTarget();
    et.addParentEventTarget(o);

@param {EventTarget} parent A parent to call when bubbling an event.

*/
    evento.EventTarget.prototype.addParentEventTarget = function(parent) {
        if (typeof parent.dispatchEvent !== 'function') {
            throw new TypeError('evento.EventTarget.prototype.addParentEventTarget: Parents must have dispatchEvent method.');
        }
        hasOwnProperty(this, '_evento_parents') || (this._evento_parents = []);
        var parents = this._evento_parents;
        for (var i = 0, ilen = parents.length; i < ilen; i++) {
            if (parents[i] === parent) {
                // can only add a particular parent once
                return;
            }
        }
        parents.push(parent);
    };

/**

Removes parent added with addParentEventTarget. If the parent is
not found, there are no errors.

    var o = {handleEvent:function(){}};
    et.removeParentEventTarget(o);

@param {EventTarget} parent The parent to remove.

*/
    evento.EventTarget.prototype.removeParentEventTarget = function(parent) {
        if (hasOwnProperty(this, '_evento_parents')) {
            var parents = this._evento_parents;
            for (var i = 0, ilen = parents.length; i < ilen; i++) {
                if (parents[i] === parent) {
                    parents.splice(i, 1);
                    // no need to continue as parent can be added only once
                    return;
                }
            }
        }
    };

/**

The `event.type` property is required. All listeners registered for this
event type are called with `event` passed as an argument to the listeners.

If not set, the `event.target` property will be set to be this event target.

The `evt.currentTarget` will be set to be this event target.

Call `evt.stopPropagation()` to stop bubbling to parents.

    et.dispatchEvent({type:'change'});
    et.dispatchEvent({type:'change', extraData:'abc'});

@param {Object} event The event object to dispatch to all listeners.

*/
    evento.EventTarget.prototype.dispatchEvent = function(evt) {
        // Want to ensure we don't alter the evt object passed in as it 
        // may be a bubbling event. So clone it and then setting currentTarget
        // won't break some event that is already being dispatched.
        evt = create(evt);
        ('target' in evt) || (evt.target = this); // don't change target on bubbling event
        evt.currentTarget = this;
        evt._propagationStopped = ('bubbles' in evt) ? !evt.bubbles : false;
        evt.stopPropagation = function() {
            evt._propagationStopped = true;
        };
        if (hasOwnProperty(this, '_evento_listeners') &&
            hasOwnProperty(this._evento_listeners, evt.type)) {
            // Copy the list of listeners in case one of the
            // listeners modifies the list while we are
            // iterating over the list.
            //
            // Without making a copy, one listener removing
            // an already-called listener would result in skipping
            // a not-yet-called listener. One listener removing 
            // a not-yet-called listener would result in skipping that
            // not-yet-called listner. The worst case scenario 
            // is a listener removing and adding itself again which would
            // create an infinite loop.
            //
            var listeners = this._evento_listeners[evt.type].slice(0);
            for (var i = 0, ilen = listeners.length; i < ilen; i++) {
                var listener = listeners[i];
                if (typeof listener === 'function') {
                    listener.call(this, evt);
                }
                else {
                    listener.handleEvent(evt);
                }
            }
        }
        if (hasOwnProperty(this, '_evento_parents') &&
            !evt._propagationStopped) {
            var parents = this._evento_parents.slice(0);
            for (var i = 0, ilen = parents.length; i < ilen; i++) {
                parents[i].dispatchEvent(evt);
            }
        }
    };

    // Insure the prototype object is initialized properly
    evento.EventTarget.call(evento.EventTarget.prototype);

/**

Mixes in the event target methods into any object.

Example 1

    app.Person = function(name) {
        evento.EventTarget.call(this);
        this.setName(name);
    };
    evento.EventTarget.mixin(app.Person.prototype);
    app.Person.prototype.setName = function(newName) {
        var oldName = this.name;
        this.name = newName;
        this.dispatchEvent({
            type: "change",
            oldName: oldName,
            newName: newName
        });
    };

    var person = new app.Person('David');
    person.addEventListener('change', function(evt) {
        alert('"' + evt.oldName + '" is now called "' + evt.newName + '".');
    });
    person.setName('Dave');

Example 2

    var o = {};
    evento.EventTarget.mixin(o);
    o.addEventListener('change', function(){alert('change');});
    o.dispatchEvent({type:'change'});

@param {Object} obj The object to be made into an event target.

*/
    evento.EventTarget.mixin = function(obj) {
        var pt = evento.EventTarget.prototype;
        for (var p in pt) {
            if (hasOwnProperty(pt, p) &&
                // Don't want to copy evento.EventTarget.prototype._evento_listeners object
                // or the evento.EventTarget.prototype._evento_parents object. Want the obj object
                // to have its own listeners and parents and not share listeners and parents
                // with evento.EventTarget.prototype.
                (typeof pt[p] === 'function')) {
                obj[p] = pt[p];
            }
        } 
        evento.EventTarget.call(obj);
    };

}());
/**

If the listener is an object then when a matching event type is dispatched on
the event target, the listener object's `handleEvent` method will be called.
By supplying a string value for `auxArg`, you can specify the name of
the method to be called. You can also supply a function object for `auxArg` for
early binding.

If the listener is a function then when a matching event type is dispatched on
the event target, the listener function is called with event target object set as
the `this` object. Using the `auxArg`, you can specifiy a different object to be
the `this` object.

One listener (or type/listener/auxArg pair to be more precise) can be added
only once.

    var o = {
        handleEvent: function(){},
        handleClick: function(){}
    };

    // late binding. handleEvent is found when each event is dispatched
    evento.on(document.body, 'click', o);

    // late binding. handleClick is found when each event is dispatched
    evento.on(document.body, 'click', o, 'handleClick');

    // early binding. The supplied function is bound now
    evento.on(document.body, 'click', o, o.handleClick);
    evento.on(document.body, 'click', o, function(){});

    // supplied function will be called with document.body as this object
    evento.on(document.body, 'click', function(){});

    // The following form is supported but is not neccessary given the options
    // above and it is recommended you avoid it.
    evento.on(document.body, 'click', this.handleClick, this);

@method evento.on

@param {EventTarget} element The object you'd like to observe.

@param {string} type The name of the event.

@param {(Object|function)} listener The listener object or callback function.

@param {(string|Object)} [auxArg] See description.

*/

/**

Removes added listener matching the element/type/listener/auxArg combination exactly.
If this combination is not found there are no errors.

    var o = {handleEvent:function(){}, handleClick:function(){}};
    evento.off(document.body, 'click', o);
    evento.off(document.body, 'click', o, 'handleClick');
    evento.off(document.body, 'click', o, fn);
    evento.off(document.body, 'click', fn);
    evento.off(document.body, 'click', this.handleClick, this);

@method evento.off

@param {EventTarget} element The object you'd like to stop observing.

@param {string} type The name of the event.

@param {(Object|function)} listener The listener object or callback function.

@param {(string|Object)} [auxArg] See description.

*/

/**

Removes all registrations of the listener added through `evento.on`.
This purging should be done before your application code looses its last reference
to listener. (This can also be done with more work using `evento.off` for
each registeration.) If the listeners are not removed or purged, the listener
will continue to observe the `EventTarget` and cannot be garbage collected. In an
MVC application this can lead to "zombie views" if the model data cannot be
garbage collected. Event listeners need to be removed from event targets in browsers
with circular reference memory leak problems (i.e. old versions of Internet Explorer.)

The primary motivation for this `purge` function is to ease cleanup in MVC View destroy 
methods. For example,

    var APP_BoxView = function(model, controller) {
        this.model = model || new APP_BoxModel();
        this.controller = controller || new APP_BoxController();
        this.rootEl = document.createElement('div');

        // subscribe to DOM node(s) and model object(s) or anything else
        // implementing the EventTarget interface using listener objects
        // and specifying method name using the same subscription interface.
        //
        evento.on(this.rootEl, 'click', this, 'handleClick');
        evento.on(this.model, 'change', this, 'handleModelChange');
    };

    APP_BoxView.prototype.handleClick = function() {
        // might subscribe/unsubscribe to more DOM nodes or models here
    };

    APP_BoxView.prototype.handleModelChange = function() {
        // might subscribe/unsubscribe to more DOM nodes or models here
    };

    APP_BoxView.prototype.destroy = function() {

        // Programmer doesn't need to remember anything. Purge all subscriptions
        // to DOM nodes, model objects, or anything else implementing
        // the EventTarget interface in one fell swoop.
        //
        evento.purge(this);
    };

@method evento.purge

@param {EventListener} listener The listener object that should stop listening.

*/

(function() {

    function createBundle(element, type, listener, /*optional*/ auxArg) {
        var bundle = {
            element: element,
            type: type,
            listener: listener
        };
        if (arguments.length > 3) {
            bundle.auxArg = auxArg;
        }
        if (typeof listener === 'function') {
            var thisObj = arguments.length > 3 ? auxArg : element;
            bundle.wrappedHandler = function(evt) {
                listener.call(thisObj, evt);
            };
        }
        else if (typeof auxArg === 'function') {
            bundle.wrappedHandler = function(evt) {
                auxArg.call(listener, evt);
            };
        }
        else {
            var methodName = arguments.length > 3 ? auxArg : 'handleEvent';
            bundle.wrappedHandler = function(evt) {
                listener[methodName](evt);
            };
        }
        return bundle;
    }

    function bundlesAreEqual(a, b) {
        return (a.element === b.element) &&
               (a.type === b.type) &&
               (a.listener === b.listener) &&
               ((!a.hasOwnProperty('auxArg') &&
                 !b.hasOwnProperty('auxArg')) ||
                (a.hasOwnProperty('auxArg') &&
                 b.hasOwnProperty('auxArg') &&
                 (a.auxArg === b.auxArg)));
    }

    function indexOfBundle(bundles, bundle) {
        for (var i = 0, ilen = bundles.length; i < ilen; i++) {
            if (bundlesAreEqual(bundles[i], bundle)) {
                return i;
            }
        }
        return -1;
    }

    evento.on = function(element, type, listener, /*optional*/ auxArg) {
        // Want to call createBundle with the same number of arguments
        // that were passed to this function. Using apply preserves
        // the number of arguments.
        var bundle = createBundle.apply(null, arguments);
        if (listener._evento_bundles) {
            if (indexOfBundle(listener._evento_bundles, bundle) >= 0) {
                // do not add the same listener twice
                return;
            }            
        }
        else {
            listener._evento_bundles = [];
        }
        if (typeof bundle.element.addEventListener === 'function') {
            bundle.element.addEventListener(bundle.type, bundle.wrappedHandler, false); 
        }
        else if ((typeof bundle.element.attachEvent === 'object') &&
                 (bundle.element.attachEvent !== null)) {
            bundle.element.attachEvent('on'+bundle.type, bundle.wrappedHandler);
        }
        else {
            throw new Error('evento.on: Supported EventTarget interface not found.');
        }
        listener._evento_bundles.push(bundle);
    };

    var remove = evento.off = function(element, type, listener, /*optional*/ auxArg) {
        if (listener._evento_bundles) {
            var i = indexOfBundle(listener._evento_bundles, createBundle.apply(null, arguments));
            if (i >= 0) {
                var bundle = listener._evento_bundles[i];
                if (typeof bundle.element.removeEventListener === 'function') {
                    bundle.element.removeEventListener(bundle.type, bundle.wrappedHandler, false);
                } 
                else if ((typeof bundle.element.detachEvent === 'object') &&
                         (bundle.element.detachEvent !== null)) {
                    bundle.element.detachEvent('on'+bundle.type, bundle.wrappedHandler);
                } 
                else {
                    throw new Error('evento.off: Supported EventTarget interface not found.');
                } 
                listener._evento_bundles.splice(i, 1);
            }
        }
    };

    evento.purge = function(listener) {
        if (listener._evento_bundles) {
            var bundles = listener._evento_bundles.slice(0);
            for (var i = 0, ilen = bundles.length; i < ilen; i++) {
                var bundle = bundles[i];
                if (bundle.hasOwnProperty('auxArg')) {
                    remove(bundle.element, bundle.type, bundle.listener, bundle.auxArg);
                }
                else {
                    remove(bundle.element, bundle.type, bundle.listener);
                }
            }
        }
    };

}());
/*
Hijos version 1.0.3
Copyright (c) 2013, Peter Michaux
All rights reserved.
Licensed under the Simplified BSD License.
https://github.com/petermichaux/hijos/blob/master/LICENSE
*/
/**

The root namespace for the Hijos library.

@namespace

*/
var hijos = {};
/**

A constructor function for creating `Leaf` objects to be used as part
of the composite design pattern.

    var leaf = new hijos.Leaf();

To attach a `Leaf` to a `Node`, use the `Node`'s child
manipulation methods: `appendChild`, `insertBefore`, `replaceChild`.
To remove a `Leaf` from a `Node` use the `Node`'s `removeChild` method.

@constructor

*/
hijos.Leaf = function() {
    this.parentNode = null;
    this.previousSibling = null;
    this.nextSibling = null;
};

/**

The parent `Node` of this object. Null if this object is not the child of
any `Node`.

@member hijos.Leaf.prototype.parentNode

@type {hijos.Leaf}

@readonly

*/

/**

The previous sibling `Leaf` of this object. Null if this object is not the child of
any `Node` or this object is the first child of a `Node`.

@member hijos.Leaf.prototype.previousSibling

@type {hijos.Leaf}

@readonly

*/

/**

The next sibling `Leaf` of this object. Null if this object is not the child of
any `Node` or this object is the last child of a `Node`.

@member hijos.Leaf.prototype.nextSibling

@type {hijos.Leaf}

@readonly

*/

/**

Call before your application code looses its last reference to the object.
Generally this will be called for you by the destroy method of the containing
`Node` object unless this `Leaf` object is not contained by a `Node`.

*/
hijos.Leaf.prototype.destroy = function() {
    // Loosing references to relations may help garbage collection.
    this.parentNode = null;
    this.previousSibling = null;
    this.nextSibling = null;
};

// insure prototype object is initialized properly
hijos.Leaf.call(hijos.Leaf.prototype);

/**

Mixes in the `Leaf` methods into any object. Be sure to call the `hijos.Leaf`
constructor to initialize the `Leaf`'s properties.

    app.MyView = function() {
        hijos.Leaf.call(this);
    };
    hijos.Leaf.mixin(app.MyView.prototype);

@param {Object} obj The object to become a `Leaf`.

*/
hijos.Leaf.mixin = function(obj) {
    obj.destroy = hijos.Leaf.prototype.destroy;
    hijos.Leaf.call(obj);
};
/**

A constructor function for creating `Node` objects with ordered children
to be used as part of the composite design pattern.

Do not mutate the elements of the `childNodes` array directly.
Instead use the `appendChild`, `insertBefore`, `replaceChild`, and `removeChild`
methods to manage the children.

    var node = new hijos.Node();

@constructor

@extends hijos.Leaf

*/
hijos.Node = function() {
    hijos.Leaf.call(this);
    this.childNodes = [];
    this.firstChild = null;
    this.lastChild = null;
};

// Inherit from hijos.Leaf. Not all browsers have Object.create
// so write out the equivalent inline.
hijos.Node.prototype = (function() {
    function F() {}
    F.prototype = hijos.Leaf.prototype;
    return new F();
}());
hijos.Node.prototype.constructor = hijos.Node;

/**

The array of child objects.

@member hijos.Node.prototype.childNodes

@type {Array}

@readonly

*/

/**

The first child of this object. Null if this object has no children.

@member hijos.Node.prototype.firstChild

@type {hijos.Leaf}

@readonly

*/

/**

The last child of this object. Null if this object has no children.

@member hijos.Node.prototype.lastChild

@type {hijos.Leaf}

@readonly

*/


/**

Call before your application code looses its last reference to the object.
Generally this will be called for you by the destroy method of the containing
`Node` object unless this object is not contained by another `Node`.

@override

*/
hijos.Node.prototype.destroy = function() {
    // copy in case one of the destroy methods modifies this.childNodes
    var children = this.childNodes.slice(0);
    for (var i = 0, ilen = children.length; i < ilen; i++) {
        children[i].destroy();
    }
    hijos.Leaf.prototype.destroy.call(this);
    // Loosing references to relations may help garbage collection.
    this.childNodes = null;
    this.firstChild = null;
    this.lastChild = null;
};

/**

Does this `Node` have any children?

@return {boolean} `true` if this `Node` has children. Otherwise `false`.

*/
hijos.Node.prototype.hasChildNodes = function() {
    return this.childNodes.length > 0;
};

/**

Inserts `newChild` before `oldChild`. If `oldChild` is `null` then this is equivalent
to appending `newChild`. If `newChild` is a child of another `Node` then `newChild` is
removed from that other `Node` before appending to this `Node`.

    var parent = new hijos.Node();
    var child0 = new hijos.Leaf();
    parent.insertBefore(child0, null);
    var child1 = new hijos.Node();
    parent.insertBefore(child1, child0);

@param {Object} newChild The Leaf or Node object to insert.

@param {(Object|null)} [oldChild] The child object to insert before.

*/
hijos.Node.prototype.insertBefore = function(newChild, oldChild) {
    if (arguments.length < 2) {
        throw new Error('hijos.Node.prototype.insertBefore: not enough arguments.');
    }
    // Allow caller to be sloppy and send undefined instead of null.
    if (oldChild === undefined) {
        oldChild = null;
    }
    // Is newChild is already in correct position?
    if ((newChild === oldChild) || // inserting a node before itself
        (oldChild && (oldChild.previousSibling === newChild)) || // inserting newChild where it already is
        ((oldChild === null) && this.lastChild === newChild)) { // inserting child at end when it is already at the end
        return;
    }
    // do not allow the creation of a circular tree structure
    var node = this;
    while (node) {
        if (node === newChild) {
            throw new Error('hijos.Node.prototype.insertBefore: Node cannot be inserted at the specified point in the hierarchy.');
        }
        node = node.parentNode;
    }
    // remove from previous composite
    var parent = newChild.parentNode;
    if (parent) {
        parent.removeChild(newChild);
    }
    // continue with insertion
    var children = this.childNodes;
    // find index for newChild
    var indexForNewChild;
    if (oldChild === null) {
        // want to append to end of children
        indexForNewChild = children.length;
    }
    else {
        for (var i = 0, ilen = children.length; i < ilen; i++) {
            if (children[i] === oldChild) {
                indexForNewChild = i;
                break;
            }
        }
        if (typeof indexForNewChild !== 'number') {
            throw new Error('hijos.Node.prototype.insertBefore: Node was not found.');
        }
    }
    // add to this composite
    children.splice(indexForNewChild, 0, newChild);
    this.firstChild = children[0];
    this.lastChild = children[children.length - 1];
    newChild.parentNode = this;
    var previousSibling = newChild.previousSibling = (children[indexForNewChild - 1] || null);
    if (previousSibling) {
        previousSibling.nextSibling = newChild;
    }
    var nextSibling = newChild.nextSibling = (children[indexForNewChild + 1] || null);
    if (nextSibling) {
        nextSibling.previousSibling = newChild;
    }
};

/**

Adds `newChild` as the last child of this `Node`. If `newChild` is a child of
another `Node` then `newChild` is removed from that other `Node` before appending
to this `Node`.

    var parent = new hijos.Node();
    var child = new hijos.Leaf();
    parent.appendChild(child);
    var child = new hijos.Node();
    parent.appendChild(child);

@param {Object} newChild The Leaf or Node object to append.

*/
hijos.Node.prototype.appendChild = function(newChild) {
    if (arguments.length < 1) {
        throw new Error('hijos.Node.prototype.appendChild: not enough arguments.');
    }
    this.insertBefore(newChild, null);
};

/**

Replaces `oldChild` with `newChild`. If `newChild` is a child of another `Node`
then `newChild` is removed from that other `Node` before appending to this `Node`.

    var parent = new hijos.Node();
    var child0 = new hijos.Leaf();
    parent.appendChild(child0);
    var child1 = new hijos.Node();
    parent.replaceChild(child1, child0);

@param {Object} newChild The Leaf or Node object to insert.

@param {Object} oldChild The child object to remove/replace.

*/
hijos.Node.prototype.replaceChild = function(newChild, oldChild) {
    if (arguments.length < 2) {
        throw new Error('hijos.Node.prototype.replaceChild: not enough arguments.');
    }
    if (!oldChild) {
        throw new Error('hijos.Node.prototype.replaceChild: oldChild must not be falsy.');
    }
    // child is already in correct position and
    // do not want removeChild to be called below
    if (newChild === oldChild) {
        return;
    }
    this.insertBefore(newChild, oldChild);
    this.removeChild(oldChild);
};

/**

Removes `oldChild`.

    var parent = new hijos.Node();
    var child = new hijos.Leaf();
    parent.appendChild(child);
    parent.removeChild(child);

@param {Object} oldChild The child object to remove.

*/
hijos.Node.prototype.removeChild = function(oldChild) {
    if (arguments.length < 1) {
        throw new Error('hijos.Node.prototype.removeChild: not enough arguments.');
    }
    var children = this.childNodes;
    for (var i = 0, ilen = children.length; i < ilen; i++) {
        if (children[i] === oldChild) {
            var previousSibling = children[i - 1];
            if (previousSibling) {
                previousSibling.nextSibling = oldChild.nextSibling;
            }
            var nextSibling = children[i + 1];
            if (nextSibling) {
                nextSibling.previousSibling = oldChild.previousSibling;
            }
            oldChild.parentNode = null;
            oldChild.previousSibling = null;
            oldChild.nextSibling = null;
            children.splice(i, 1);
            this.firstChild = children[0] || null;
            this.lastChild = children[children.length - 1] || null;
            return; // stop looking
        }
    }
    throw new Error('hijos.Node.prototype.removeChild: node not found.');
};

// insure prototype object is initialized correctly
hijos.Node.call(hijos.Node.prototype);

/**

Mixes in the Node methods into any object.

Example 1

    app.MyView = function() {
        hijos.Node.call(this);
    };
    hijos.Node.mixin(app.MyView.prototype);

Example 2

    var obj = {};
    hijos.Node.mixin(obj);

@param {Object} obj The object to become a `Node`.

*/
hijos.Node.mixin = function(obj) {
    for (var p in hijos.Node.prototype) {
        if (Object.prototype.hasOwnProperty.call(hijos.Node.prototype, p) &&
            (typeof hijos.Node.prototype[p] === 'function')) {
            obj[p] = hijos.Node.prototype[p];
        }
    }
    hijos.Node.call(obj);
};
/*
Arbutus version 4
Copyright (c) 2013, Peter Michaux
All rights reserved.
Licensed under the Simplified BSD License.
https://github.com/petermichaux/arbutus/blob/master/LICENSE
*/
/**

The root namespace for the Arbutus library.

@namespace

*/
var arbutus = {};
(function() {

    var trimLeft = /^\s+/,
        trimRight = /\s+$/;
    function trim(str) {
        return str.replace(trimLeft, '').replace(trimRight, '');
    }

    function getFirstChild(element) {
        return element.firstChild;
    }
    function getFirstGrandChild(element) {
        return element.firstChild.firstChild;
    }
    function getSecondGrandChild(element) {
        return element.firstChild.firstChild.nextSibling;
    }
    function getFirstGreatGrandChild(element) {
        return element.firstChild.firstChild.firstChild;
    }
    function getFirstGreatGreatGrandChild(element) {
        return element.firstChild.firstChild.firstChild.firstChild;
    }

    function makeParser(before, after, getFirstResult) {
        return function(html, doc) {
            var parser = doc.createElement('div');
            var fragment = doc.createDocumentFragment();
            parser.innerHTML = before + html + after;
            var node = getFirstResult(parser);
            var nextNode;
            while (node) {
                nextNode = node.nextSibling;
                fragment.appendChild(node);
                node = nextNode;
            }
            return fragment;
        };
    }

    var defaultParser = makeParser('', '', getFirstChild);

    var parsers = {
        'td': makeParser('<table><tbody><tr>', '</tr></tbody></table>', getFirstGreatGreatGrandChild),
        'tr': makeParser('<table><tbody>', '</tbody></table>', getFirstGreatGrandChild),
        'tbody': makeParser('<table>', '</table>', getFirstGrandChild),
        'col': makeParser('<table><colgroup>', '</colgroup></table>', getFirstGreatGrandChild),
        // Without the option in the next line, the parsed option will always be selected.
        'option': makeParser('<select><option>a</option>', '</select>', getSecondGrandChild)
    };
    parsers.th = parsers.td;
    parsers.thead = parsers.tbody;
    parsers.tfoot = parsers.tbody;
    parsers.caption = parsers.tbody;
    parsers.colgroup = parsers.tbody;

    var tagRegExp = /^<([a-z]+)/i; // first group must be tag name

/**

The html string will be trimmed.

Returns a document fragment that has the children defined by the html string.

    var fragment = arbutus.parseHTML('<p>alpha beta</p>');
    document.body.appendChild(fragment);

Note that a call to this function is relatively expensive and you probably
don't want to have a loop of thousands with calls to this function.

@param {string} html The string of HTML to be parsed.

@param {Document} [doc] The document object to create the new DOM nodes.

@return {DocumentFragment}

*/
    arbutus.parseHTML = function(html, doc) {
        // IE will trim when setting innerHTML so unify for all browsers
        html = trim(html);
        var parser = defaultParser;
        var matches = html.match(tagRegExp);        
        if (matches) {
            var name = matches[1].toLowerCase();
            if (Object.prototype.hasOwnProperty.call(parsers, name)) {
                parser = parsers[name];
            }
        }
        return parser(html, doc || document);
    };

}());
/*
Grail version 4
Copyright (c) 2012, Peter Michaux
All rights reserved.
Licensed under the Simplified BSD License.
https://github.com/petermichaux/grail/blob/master/LICENSE
*/
/**

The root namespace for the Grail library.

@namespace

*/
var grail = {};
(function() {

    var trimLeft = /^\s+/;
    var trimRight = /\s+$/;

    // group 1 must be the id
    var idRegExp = /^#(\S+)$/;

    // group 1 must be the tagName and group 2 must be the className
    var tagClassRegExp = /^([\w-]+)?(?:\.([\w-]+))?$/;

    function trim(str) {
        return str.replace(trimLeft, '').replace(trimRight, '');
    }

    function isHostMethod(obj, prop) {
        return (typeof obj[prop] === 'function') ||
                ((typeof obj[prop] === 'object') && (obj[prop] !== null)); // Internet Explorer
    }

    function findById(id, root) {
        return (root.id === id) ?
                   root :
                   (isHostMethod(root, 'getElementById')) ?
                       root.getElementById(id) :
                       (isHostMethod(root, 'querySelector')) ?
                           root.querySelector('#' + id) :
                           firstInDOM(root, function(node) {return node.id === id;});
    }

    function getTagNameClassNameMatcher(tagName, className) {
        tagName = tagName ? tagName.toUpperCase() : '*';
        if (className) {
            var regExp = new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)');
        }
        return function(element) {
            return (((tagName === '*') ||
                     (element.tagName && (element.tagName.toUpperCase() === tagName))) &&
                    ((!className) ||
                     regExp.test(element.className)));
        }
    }

    function filterDOM(node, func) {
       var results = [];
       function walk(node) {
           if (func(node)) {
               results.push(node);
           }
           node = node.firstChild;
           while (node) {
               walk(node);
               node = node.nextSibling;
           }
       }
       walk(node);
       return results;
    }

    function firstInDOM(node, func) {
        function walk(node) {
            if (func(node)) {
                return node;
            }
            node = node.firstChild;
            while (node) {
                var result = walk(node);
                if (result) {
                    return result;
                }
                node = node.nextSibling;
            }
        }
        return walk(node);
    }

/**

Search for all elements matching the CSS selector. Returns an array of the elements.

Acceptable simple selectors are of the following forms only.

    div
    #alpha
    .beta
    div.gamma

In the case of a #myId selector, the returned array will always have
zero or one elements. It is more likely that you want to call grail.find when
using an id selector.

If the root element is supplied then it is used as the starting point for the search.
The root element will be in the results if it matches the selector.
If the root element is not supplied then the current document is used
as the search starting point.

    grail.findAll('#alpha');
    grail.findAll('div.gamma', document.body);

@param {string} selector The CSS selector for the search.

@param {Document|Element} [root] The element to use as the search start point.

@return {Array} An array of matching `Element` objects.

*/
    grail.findAll = function(selector, root) {
        selector = trim(selector);
        root = root || document;
        var matches;
        if (matches = selector.match(idRegExp)) {
            var el = findById(matches[1], root);
            return el ? [el] : [];
        }
        else if (matches = selector.match(tagClassRegExp)) {
            var tagNameClassNameMatcher = getTagNameClassNameMatcher(matches[1], matches[2]);
            if (isHostMethod(root, 'querySelectorAll')) {
                var elements;
                var results = [];
                if (tagNameClassNameMatcher(root)) {
                    results.push(root);
                }
                elements = root.querySelectorAll(selector);
                for (var i = 0, ilen = elements.length; i < ilen; i++) {
                    results.push(elements[i]);
                }
                return results;
            }
            else {
                return filterDOM(root, tagNameClassNameMatcher);
            }
        }
        else {
            throw new Error('grail.findAll: Unsupported selector "'+selector+'".');
        }
    };

/**

Search for the first element matching the CSS selector. If the element is
found then it is returned. If no matching element is found then
null or undefined is returned.

The rest of the details are the same as for grail.findAll.

@param {string} [selector] The CSS selector for the search.

@param {Document|Element} [root] The element to use as the search start point.

@return {Element} The found `Element`.

*/
    grail.find = function(selector, root) {
        selector = trim(selector);
        root = root || document;
        var matches;
        if (matches = selector.match(idRegExp)) {
            return findById(matches[1], root);
        }
        else if (matches = selector.match(tagClassRegExp)) {
            var tagNameClassNameMatcher = getTagNameClassNameMatcher(matches[1], matches[2]);
            if (isHostMethod(root, 'querySelector')) {
                return tagNameClassNameMatcher(root) ? root : root.querySelector(selector);
            }
            else {
                return firstInDOM(root, tagNameClassNameMatcher);
            }
        }
        else {
            throw new Error('grail.find: Unsupported selector "'+selector+'".');
        }
    };

}());
/*
Hormigas version 5
Copyright (c) 2013, Peter Michaux
All rights reserved.
Licensed under the Simplified BSD License.
https://github.com/petermichaux/hormigas/blob/master/LICENSE
*/
/**

The root namespace for the Hormigas library.

@namespace

*/
var hormigas = {};
(function() {

    var nextId = 0;

    function getId() {
        return nextId++;
    }

    function initSet(set) {
        set._hormigas_ObjectSet_elements = {};
        set.size = 0;
    }

/**

A constructor function for creating set objects. A set can only contain
a particular object once. That means all objects in a set are unique. This
is different from an array where one object can be in the array in
multiple positions.

`ObjectSet` objects are designed
to hold JavaScript objects. They cache a marker on the objects.
Do not attempt to add primitives or host objects in a `ObjectSet`. This
is a compromise to make `ObjectSet` objects efficient for use in the model
layer of your MVC-style application.

When using the set iterators (e.g. `forEach`) do not depend
on the order of iteration of the set's elements. `ObjectSet` objects are unordered.

    var set = new hormigas.ObjectSet();                     // an empty set

`ObjectSet` objects have a `size` property that is the number of elements in the set.

    var alpha = {};
    var beta = {};
    var set = new hormigas.ObjectSet(alpha, beta, alpha);
    set.size; // 2

The methods of an `ObjectSet` object are inspired by the incomplete
Harmony Set proposal and the `Array.prototype` iterators.

@constructor

@param {...Object} [item] An object to add to the set.

*/
    hormigas.ObjectSet = function() {
        initSet(this);
        for (var i = 0, ilen = arguments.length; i < ilen; i++) {
            this.add(arguments[i]);
        }
    };

/**

The number of elements in the set.

@member hormigas.ObjectSet.prototype.size

@readonly

*/

/**

Is a particular object in the set or not?

    var alpha = {};
    var beta = {};
    var set = new hormigas.ObjectSet(alpha);
    set.has(alpha); // true
    set.has(beta); // false

@param {Object} element The item in question.

@return `true` if `element` is in the set. Otherwise `false`.

*/
    hormigas.ObjectSet.prototype.has = function(element) {
        return Object.prototype.hasOwnProperty.call(element, '_hormigas_ObjectSet_id') &&
               Object.prototype.hasOwnProperty.call(this._hormigas_ObjectSet_elements, element._hormigas_ObjectSet_id);
    };

/**

If `element` is not already in the set then adds element to the set.

    var alpha = {};
    var set = new hormigas.ObjectSet();
    set.add(alpha); // true
    set.has(alpha); // false

@param {Object} element The item to add to the set.

@return {boolean} `true` if `element` is added to the set as a result of this call. Otherwise `false` because `element` was already in the set.

*/
    hormigas.ObjectSet.prototype.add = function(element) {
        if (this.has(element)) {
            return false;
        }
        else {
            var id;
            if (!Object.prototype.hasOwnProperty.call(element, '_hormigas_ObjectSet_id')) {
                element._hormigas_ObjectSet_id = getId();
            }
            this._hormigas_ObjectSet_elements[element._hormigas_ObjectSet_id] = element;
            this.size++;
            return true;
        }
    };

/**

If `element` is in the set then removes `element` from the set.

`delete` is a reserved word and older implementations
did not allow bare reserved words in property name
position so quote `delete`.

    var alpha = {};
    var set = new hormigas.ObjectSet(alpha);
    set['delete'](alpha); // true
    set['delete'](alpha); // false

@param {Object} element The item to delete from the set.

@return {boolean} `true` if `element` is deleted from the set as a result of this call. Otherwise `false` because `element` was not in the set.

*/
    hormigas.ObjectSet.prototype['delete'] = function(element) {
        if (this.has(element)) {
            delete this._hormigas_ObjectSet_elements[element._hormigas_ObjectSet_id];
            this.size--;
            return true;
        }
        else {
            return false;
        }
    };

/**

If the set has elements then removes all the elements.

    var alpha = {};
    var set = new hormigas.ObjectSet(alpha);
    set.clear(); // true
    set.clear(); // false

@return {boolean} `true` if elements were deleted from the set as the result of this call. Otherwise `false` because no elements were in the set.

*/
    hormigas.ObjectSet.prototype.clear = function() {
        if (this.size > 0) {
            initSet(this);
            return true;
        }
        else {
            return false;
        }
    };

/**

Convert the set to an array.

@return {Array} The elements of the set in a new array.

*/
    hormigas.ObjectSet.prototype.toArray = function() {
        var elements = [];
        for (var p in this._hormigas_ObjectSet_elements) {
            if (Object.prototype.hasOwnProperty.call(this._hormigas_ObjectSet_elements, p)) {
                elements.push(this._hormigas_ObjectSet_elements[p]);
            }
        }
        return elements;
    };

/**

Calls `callbackfn` for each element of the set.

    var alpha = {value: 0};
    var beta = {value: 1};
    var gamma = {value: 2};
    var set = new hormigas.ObjectSet(alpha, beta, gamma);
    set.forEach(function(element) {
        console.log(element.value);
    });

@param {function} callbackfn The function to call for each element in the set.

@parameter {Object} [thisArg] The object to use as the `this` object in calls to `callbackfn`.

*/
    hormigas.ObjectSet.prototype.forEach = function(callbackfn /*, thisArg */) {
        var thisArg = arguments[1];
        for (var p in this._hormigas_ObjectSet_elements) {
            if (Object.prototype.hasOwnProperty.call(this._hormigas_ObjectSet_elements, p)) {
                callbackfn.call(thisArg, this._hormigas_ObjectSet_elements[p]);
            }
        }
    };

/**

Calls `callbackfn` for each element of the set.

    var one = {value: 1};
    var two = {value: 2};
    var three = {value: 3};
    var set = new hormigas.ObjectSet(one, two, three);
    set.every(function(element) {
        return element.value < 2;
    }); // false

@param {function} callbackfn The function to call for each element in the set.

@param {Object} [thisArg] The object to use as the this object in calls to callbackfn.

@return {boolean} `true` if `callbackfn` returns a truthy value for all elements in the set. Otherwise `false`.

*/
    hormigas.ObjectSet.prototype.every = function(callbackfn /*, thisArg */) {
        var thisArg = arguments[1];
        for (var p in this._hormigas_ObjectSet_elements) {
            if (Object.prototype.hasOwnProperty.call(this._hormigas_ObjectSet_elements, p) &&
                !callbackfn.call(thisArg, this._hormigas_ObjectSet_elements[p])) {
                return false;
            }
        }
        return true;
    };

/**

Calls `callbackfn` for each element of the set.

    var one = {value: 1};
    var two = {value: 2};
    var three = {value: 3};
    var set = new hormigas.ObjectSet(one, two, three);
    set.some(function(element) {
        return element.value < 2;
    }); // true

@param {function} callbackfn The function to call for each element in the set.

@param {Object} [thisArg] The object to use as the this object in calls to callbackfn.

@return {boolean} `true` if `callbackfn` returns a truthy value for at least one element in the set. Otherwise `false`.

*/
    hormigas.ObjectSet.prototype.some = function(callbackfn /*, thisArg */) {
        var thisArg = arguments[1];
        for (var p in this._hormigas_ObjectSet_elements) {
            if (Object.prototype.hasOwnProperty.call(this._hormigas_ObjectSet_elements, p) &&
                callbackfn.call(thisArg, this._hormigas_ObjectSet_elements[p])) {
                return true;
            }
        }
        return false;
    };

/**

Calls `callbackfn` for each element of the set.

For the first call to `callbackfn`, if `initialValue` is supplied then `initalValue` is
the first argument passed to `callbackfn` and the second argument is the first
element in the set to be iterated. Otherwise the first argument is
the first element to be iterated in the set and the second argument is
the next element to be iterated in the set.

For subsequent calls to `callbackfn`, the first argument is the value returned
by the last call to `callbackfn`. The second argument is the next value to be
iterated in the set.

    var one = {value: 1};
    var two = {value: 2};
    var three = {value: 3};
    var set = new hormigas.ObjectSet(one, two, three);
    set.reduce(function(accumulator, element) {
        return {value: accumulator.value + element.value};
    }); // {value:6}
    set.reduce(function(accumulator, element) {
        return accumulator + element.value;
    }, 4); // 10

@param {function} callbackfn The function to call for each element in the set.

@param {*} initialValue The optional starting value for accumulation.

@return {*} The value returned by the final call to `callbackfn`.

*/
    hormigas.ObjectSet.prototype.reduce = function(callbackfn /*, initialValue */) {
        var elements = this.toArray();
        var i = 0;
        var ilen = elements.length;
        var accumulator;
        if (arguments.length > 1) {
            accumulator = arguments[1];
        }
        else if (ilen < 1) {
            throw new TypeError('reduce of empty set with no initial value');
        }
        else {
            i = 1;
            accumulator = elements[0];
        }
        while (i < ilen) {
            accumulator = callbackfn.call(undefined, accumulator, elements[i]);
            i++;
        }
        return accumulator;
    };

}());

// insure prototype object is initialized properly
hormigas.ObjectSet.call(hormigas.ObjectSet.prototype);

/**

Mixes in the `ObjectSet` methods into any object.

Example 1

    app.MyModel = function() {
        hormigas.ObjectSet.call(this);
    };
    hormigas.ObjectSet.mixin(app.MyModel.prototype);

Example 2

    var obj = {};
    hormigas.ObjectSet.mixin(obj);

@param {Object} obj The object to become an `ObjectSet`.

*/
hormigas.ObjectSet.mixin = function(obj) {
    for (var p in hormigas.ObjectSet.prototype) {
        if (Object.prototype.hasOwnProperty.call(hormigas.ObjectSet.prototype, p) &&
            (typeof hormigas.ObjectSet.prototype[p] === 'function')) {
            obj[p] = hormigas.ObjectSet.prototype[p];
        }
    }
    hormigas.ObjectSet.call(obj);
};
/**
@license
Maria 1.0.0
Copyright (c) 2013, Peter Michaux
All rights reserved.
Licensed under the Simplified BSD License.
http://peter.michaux.ca/downloads/maria/1.0.0/LICENSE
*/
/**

Root namespace

@namespace

*/
var maria = {};
/**

Not all browsers supported by Maria have the native `Object.create` from ECMAScript 5.

@method

@param {Object} obj The object to be the prototype of the new object

*/
maria.create = (function() {
    function F() {}
    return function(obj) {
        F.prototype = obj;
        obj = new F();
        F.prototype = null;
        return obj;
    };
}());
/**

Copy properties from the source to the sink.

@param {Object} sink The destination object.

@param {Object} source The source object.

*/
maria.borrow = function(sink, source) {
    for (var p in source) {
        if (Object.prototype.hasOwnProperty.call(source, p)) {
            sink[p] = source[p];
        }
    }
};
/**

When executing, `this` must be a constructor function.

Mix the "subclass" function into your constructor function.

@param {Object} namespace

@param {string} name

@param {Object} [options]

*/
maria.subclass = function(namespace, name, options) {
    options = options || {};
    var properties = options.properties;
    var SuperConstructor = this;
    var Constructor = namespace[name] =
        Object.prototype.hasOwnProperty.call(options, 'constructor') ?
            options.constructor :
            function() {
                SuperConstructor.apply(this, arguments);
            };
    var prototype = Constructor.prototype = maria.create(SuperConstructor.prototype);
    prototype.constructor = Constructor;
    if (properties) {
        maria.borrow(prototype, properties);
    }
    Constructor.subclass = function() {
        SuperConstructor.subclass.apply(this, arguments);
    };
};
/**

Add an event listener.

See evento.on for description.

*/
maria.on = evento.on;

/**

Remove an event listener.

See evento.off for description.

*/
maria.off = evento.off;

/**

Purge an event listener of all its subscriptions.

See evento.purge for description.

*/
maria.purge = evento.purge;
/**

See hijos.Leaf for description.

*/
maria.Leaf = hijos.Leaf;

/**

See hijos.Node for description.

*/
maria.Node = hijos.Node;
/**

A constructor function to create new model objects.

    var model = new maria.Model();

The most interesting feature of model objects is that they are event
targets and so can be observed by any event listeners. Other model
objects, view objects, or any other interested objects can observe by
being added as event listeners.

For example, the following view object's "update" method will be called
when a "change" event is dispatched on the model objects.

    var view = {
        update: function(evt) {
            alert('The model changed!');
        }
    };
    maria.on(model, 'change', view, 'update');

The model can dispatch a "change" event on itself when the model
changes.

    model.setContent = function(content) {
        this._content = content;
        model.dispatchEvent({type: 'change'});
    };

If desired, a model can push additional data to its observers by
including that data on the event object.

    model.setContent = function(content) {
        var previousContent = this._content;
        this._content = content;
        model.dispatchEvent({
            type: 'change',
            previousContent: previousContent,
            content: content
        });
    };

An event listener can be removed from a model object.

    maria.off(model, 'change', view, 'update');

A particularly useful pattern is using maria.Model as the "superclass"
of your application's model. The following example shows how this
can be done at a low level for a to-do application.
See maria.Model.subclass for a more compact way to accomplish the same.

    checkit.TodoModel = function() {
        maria.Model.apply(this, arguments);
    };
    checkit.TodoModel.prototype = maria.create(maria.Model.prototype);
    checkit.TodoModel.prototype.constructor = checkit.TodoModel;
    checkit.TodoModel.prototype._content = '';
    checkit.TodoModel.prototype._isDone = false;
    checkit.TodoModel.prototype.getContent = function() {
        return this._content;
    };
    checkit.TodoModel.prototype.setContent = function(content) {
        content = checkit.trim('' + content);
        if (this._content !== content) {
            this._content = content;
            this.dispatchEvent({type: 'change'});
        }
    };
    checkit.TodoModel.prototype.isDone = function() {
        return this._isDone;
    };
    checkit.TodoModel.prototype.setDone = function(isDone) {
        isDone = !!isDone;
        if (this._isDone !== isDone) {
            this._isDone = isDone;
            this.dispatchEvent({type: 'change'});
        }
    };
    checkit.TodoModel.prototype.toggleDone = function() {
        this.setDone(!this.isDone());
    };

When a model's "destroy" method is called, a "destroy" event is
dispatched and all event listeners who've been added for this event
type will be notified.

(See evento.EventTarget for advanced information about event bubbling
using "addParentEventTarget" and "removeParentEventTarget".)

@constructor

@extends evento.EventTarget

*/
maria.Model = function() {
    evento.EventTarget.call(this);
};

maria.Model.prototype = maria.create(evento.EventTarget.prototype);
maria.Model.prototype.constructor = maria.Model;

/**

When a model is destroyed, it dispatches a `destroy` event to let
listeners (especially containing `maria.SetModel` objects) that
this particular model is no longer useful/reliable.

*/
maria.Model.prototype.destroy = function() {
    this.dispatchEvent({type: 'destroy'});
};
/**

A constructor function to create new set model objects. A set model
object is a collection of elements. An element can only be included
once in a set model object.

The constructor takes multiple arguments and populates the set model
with those elements.

    var alpha = new maria.Model();
    alpha.name = 'Alpha';
    var beta = new maria.Model();
    beta.name = 'Beta';

    var setModel = new maria.SetModel(alpha, beta);

You can create an empty set model object.

    var setModel = new maria.SetModel(); 

What makes a set model object interesting in comparison to a set is
that a set model object is a model object that dispatches "change"
events when elements are added or deleted from the the set.

    var view = {
        update: function(evt) {
            alert(setModel.size + ' element(s) in the set.');
        }
    };
    maria.on(setModel, 'change', view, 'update');

You can add elements to the set. Adding an element
that is already in the set has no effect. The add method returns
true if the element is added to the set.

    setModel.add(alpha); // returns true, alpha was added
    setModel.add(alpha); // returns false, alpha not added again

The add method accepts multiple objects and only dispatches
a single "change" event if any of the arguments are added to
the set model object.

    setModel.add(alpha, beta); // returns true, beta was added

When elements are added to the set model object, all "change" event
listeners are passed an event object with an addedTargets property
which has an array containing all elements added to the set model
object.

You can check if an element is in the set.

    setModel.has(alpha); // returns true, alpha was added above

You can get the number of elements in the set.

    setModel.size; // returns 2

An element can be deleted from the set. Removing it multiple times
has no effect. The delete method returns true if the element is
deleted from the set.

    setModel['delete'](alpha); // returns true, alpha was deleted
    setModel['delete'](alpha); // returns false, alpha wasn't in set

The delete method accepts multiple objects.

    setModel['delete'](alpha, beta); // returns true, beta was removed

When elements are deleted from the set model object, all "change" event
listeners are passed an event object with a deletedTargets property
which is an array containing all elements deleted from the set model
object.

Note that delete is a keyword in JavaScript and to keep old browsers
happy you need to write setModel['delete']. You can write
setModel.delete if old browsers are not supported by your application.

You can empty a set in one call. The method returns true if any
elements are removed from the set model object.

    setModel.clear(); // returns false, alpha and beta removed above.

If the call to `clear` does delete elements from the set, all "change"
event listeners are passed an event object with deletedTargets just
as for the delete method.

Another interesting feature of a set model object is that it observes
its elements (for all elements that implement the event target
interface) and when an element dispatches a "destroy" event then
the element is automatically removed from the set model object. The
set model object then dispatches a "change" event with a deletedTargets
property just as for the delete method.

A set model object has some other handy methods.

    setModel.add(alpha, beta);

    setModel.toArray(); // returns [alpha, beta] or [beta, alpha]

    setModel.forEach(function(element) {
        alert(element.name);
    });

    setModel.every(function(element) {
        return element.name.length > 4;
    }); // returns false

    setModel.some(function(element) {
        return element.name.length > 4;
    }); // returns true

    setModel.reduce(function(accumulator, element) {
        return accumulator + element.name.length;
    }, 0); // returns 9

The order of the elements returned by toArray and the order of
iteration of the other methods is undefined as a set is an unordered
collection. Do not depend on any ordering that the current
implementation uses.

A particularly useful pattern is using maria.SetModel as the
"superclass" of your application's collection model. The following
example shows how this can be done at a low level for a to-do
application. See maria.SetModel.subclass for a more compact way
to accomplish the same.

    checkit.TodosModel = function() {
        maria.SetModel.apply(this, arguments);
    };
    checkit.TodosModel.prototype = maria.create(maria.SetModel.prototype);
    checkit.TodosModel.prototype.constructor = checkit.TodosModel;
    checkit.TodosModel.prototype.isAllDone = function() {
        return (this.size > 0) &&
               this.every(function(todo) {
                   return todo.isDone();
               });
    };
    checkit.TodosModel.prototype.isAllUndone = function() {
        return this.every(function(todo) {
                   return !todo.isDone();
               });
    };
    checkit.TodosModel.prototype.markAllDone = function() {
        this.forEach(function(todo) {
            todo.setDone(true);
        });
    };
    checkit.TodosModel.prototype.markAllUndone = function() {
        this.forEach(function(todo) {
            todo.setDone(false);
        });
    };
    checkit.TodosModel.prototype.deleteDone = function() {
        var doneTodos = [];
        this.forEach(function(todo) {
            if (todo.isDone()) {
                doneTodos.push(todo);
            }
        });
        this['delete'].apply(this, doneTodos);
    };

Another feature of set model objects is that events dispatched on
elements of the set model object bubble up and are dispatched on the
set model object. This makes it possible to observe only the set model
object and still know when elements in the set are changing, for
example. This can complement well the flyweight pattern used in a view.

@constructor

@extends maria.Model
@extends hormigas.ObjectSet

*/
maria.SetModel = function() {
    hormigas.ObjectSet.apply(this, arguments);
    maria.Model.call(this);
};

maria.SetModel.prototype = maria.create(maria.Model.prototype);
maria.SetModel.prototype.constructor = maria.SetModel;

hormigas.ObjectSet.mixin(maria.SetModel.prototype);

// Wrap the set mutator methods to dispatch events.

/**

Takes multiple arguments each to be added to the set.

  setModel.add(item1)
  setModel.add(item1, item2)
  ...

If the set is modified as a result of the add request then a `change`
event is dispatched on the set model object. If all of the arguments
are already in the set then this event will not be dispatched.

@param {Object} item The item to be added to the set.

@return {boolean} True if the set was modified. Otherwise false.

@override

*/
maria.SetModel.prototype.add = function() {
    var added = [];
    for (var i = 0, ilen = arguments.length; i < ilen; i++) {
        var argument = arguments[i];
        if (hormigas.ObjectSet.prototype.add.call(this, argument)) {
            added.push(argument);
            if ((typeof argument.addEventListener === 'function') &&
                (typeof argument.removeEventListener === 'function')) {
                argument.addEventListener('destroy', this);    
            }
            if ((typeof argument.addParentEventTarget === 'function') &&
                // want to know can remove later
                (typeof argument.removeParentEventTarget === 'function')) {
                argument.addParentEventTarget(this);
            }
        }
    }
    var modified = added.length > 0;
    if (modified) {
        this.dispatchEvent({type: 'change', addedTargets: added, deletedTargets: []});
    }
    return modified;
};

/**

Takes multiple arguments each to be deleted from the set.

  setModel['delete'](item1)
  setModel['delete'](item1, item2)
  ...

If the set is modified as a result of the delete request then a `change`
event is dispatched on the set model object. If all of the arguments
were already not in the set then this event will not be dispatched.

@param {Object} item The item to be removed from the set.

@return {boolean} True if the set was modified. Otherwise false.

@override

*/
maria.SetModel.prototype['delete'] = function() {
    var deleted = [];
    for (var i = 0, ilen = arguments.length; i < ilen; i++) {
        var argument = arguments[i];
        if (hormigas.ObjectSet.prototype['delete'].call(this, argument)) {
            deleted.push(argument);
            if (typeof argument.removeEventListener === 'function') {
                argument.removeEventListener('destroy', this);
            }
            if (typeof argument.removeParentEventTarget === 'function') {
                argument.removeParentEventTarget(this);
            }
        }
    }
    var modified = deleted.length > 0;
    if (modified) {
        this.dispatchEvent({type: 'change', addedTargets: [], deletedTargets: deleted});
    }
    return modified;
};

/**

Deletes all elements of the set.

If the set is modified as a result of this `clear` request then a `change`
event is dispatched on the set model object.

@override

@return {boolean} True if the set was modified. Otherwise false.

*/
maria.SetModel.prototype.clear = function() {
    var deleted = this.toArray();
    var result = hormigas.ObjectSet.prototype.clear.call(this);
    if (result) {
        for (var i = 0, ilen = deleted.length; i < ilen; i++) {
            var element = deleted[i];
            if (typeof element.removeEventListener === 'function') {
                element.removeEventListener('destroy', this);
            }
            if (typeof element.removeParentEventTarget === 'function') {
                element.removeParentEventTarget(this);
            }
        }
        this.dispatchEvent({type: 'change', addedTargets: [], deletedTargets: deleted});
    }
    return result;
};

/**

If a member of the set fires a `destroy` event then that member
must be deleted from this set. This handler will do the delete.

@param {Object} event The event object.

*/
maria.SetModel.prototype.handleEvent = function(evt) {

    // If it is a destroy event being dispatched on the
    // destroyed element then we want to remove it from
    // this set.
    if ((evt.type === 'destroy') &&
        (evt.currentTarget === evt.target)) {
        this['delete'](evt.target);
    }

};
/**

A constructor function to create new view objects.

    var view = new maria.View();

This constructor function takes two optional arguments.

    var model = new maria.Model();
    var controller = new maria.Controller();
    var view = new maria.View(model, controller);

The null or undefined value can be passed for either of these two
parameters to skip setting it.

A view is has a model. You can get the current model which might
be undefined.

    view.getModel();

You can set the model.

    view.setModel(model);

When a view object's model object is set, the view will, by convention,
observe the model's "change" event. When a "change" event is dispatched
on the model, the view's "update" method will be called.

Your application will redefine or more likely override the update method.

    maria.View.prototype.update = function(evt) {
        alert('the model changed');
    };

If necessary, you can change the events and methods that the view will
observe when the model is set by redefining or overriding the
getModelActions method.

    maria.View.prototype.getModelActions = function() {
        return {
            'squashed': 'onSquashed',
            'squished': 'onSquished'
        };
    };

By overriding the `getModelActions` method, the view will only observe
the model's `change` event if you explicitely list it which is not done
above. If you want to observe the `squashed`, `squished`, *and* `change`
events then you need to write the following.

    maria.View.prototype.getModelActions = function() {
        return {
            'change'  : 'update'    ,
            'squashed': 'onSquashed',
            'squished': 'onSquished'
        };
    };

When the model is set, if the view had a previous model then the view
will unsubscribe from the events it subscribed to on the prevous model
when the previous model was set.

A view has a controller. You can get the current controller.

    view.getController();

The view's controller is created lazily the first time the
getController method is called. The view's 
getDefaultControllerConstructor method returns the constructor function
to create the controller object and the getDefaultController actually
calls that constructor. Your application may redefine or override
either of these methods.

A view has a destroy method which should be called before your
application looses its last reference to the view.

An view object is a composite view. This means the view can have child
views added and removed. This functionality is provided by the Hijos
library. Briefly,

    var childView1 = new maria.View();
    var childView2 = new maria.View();
    view.appendChild(childView1);
    view.replaceChild(childView2, childView1);
    view.insertBefore(childView1, childView2);
    view.removeChild(childView2);
    view.childNodes;
    view.firstChild;
    view.lastChild;
    childView1.nextSibling;
    childView1.previousSibling;
    childView1.parentNode;

When a view's destroy method executes, it calls each child's destroy
method.

The maria.View constructor is relatively abstract. It is most likely
that your application can use maria.ElementView; however, if you are
creating a new type of view where maria.ElementView is not a good fit,
for example a view that represents part of a bitmap drawing on a canvas
element, then you may want to use maria.View as the "superclass" of
your new view constructor. The following example shows how this can be
done at a low level. See maria.View.subclass for a more compact way to
accomplish the same.

    myapp.MyView = function() {
        maria.View.apply(this, arguments);
    };
    myapp.MyView.prototype = maria.create(maria.View.prototype);
    myapp.MyView.prototype.constructor = myapp.MyView;
    myapp.MyView.prototype.getModelActions = function() {
        return {
            'squashed': 'onSquashed',
            'squished': 'onSquished'
        };
    };
    maria.MyView.prototype.onSquished = function(evt) {
        this.getController().onSquished(evt);
    };
    maria.MyView.prototype.onSquashed = function() {
    this.getController().onSquashed(evt);
    };
    myapp.MyView.prototype.getDefaultControllerConstructor = function() {
        return myapp.MyController;
    };
    myapp.MyView.prototype.anotherMethod = function() {
        alert('another method');
    };

@constructor

@extends maria.Node

@param {maria.Model} [model]

@param {maria.Controller} [controller]

*/
maria.View = function(model, controller) {
    maria.Node.call(this);
    this.setModel(model);
    this.setController(controller);
};

maria.View.prototype = maria.create(maria.Node.prototype);
maria.View.prototype.constructor = maria.View;

/*

Call before your application looses its last reference to this view.

This will unsubcribe this view from its model so that this view
does not become a zombie view.

*/
maria.View.prototype.destroy = function() {
    maria.purge(this);
    this._model = null;
    if (this._controller) {
        this._controller.destroy();
        this._controller = null;
    }
    maria.Node.prototype.destroy.call(this);
};

/**

By default, a view will observe its model for `change` events. When
a `change` event is dispatched on the model then this `update` method
is the handler. (The "change" and "update" names are inherited directly
from Smalltalk implementations.)

To be overridden by subclasses.

@param {object} event The event object.

*/
maria.View.prototype.update = function() {
    // to be overridden by concrete view subclasses
};

/**

Returns the current model object of this view.

@return {maria.Model} The model object.

*/
maria.View.prototype.getModel = function() {
    return this._model;
};

/**

Set the current model object of this view.

@param {maria.Model} model The model object.

*/
maria.View.prototype.setModel = function(model) {
    this._setModelAndController(model, this._controller);
};

/**

Returns a controller constructor function to be used to create
a controller for this view.

@return {function} The controller constructor function. 

*/
maria.View.prototype.getDefaultControllerConstructor = function() {
    return maria.Controller;
};

/**

Creates a new default controller for this view.

@return {maria.Controller} The controller object.

*/
maria.View.prototype.getDefaultController = function() {
    var constructor = this.getDefaultControllerConstructor();
    return new constructor();
};


/**

If this view has not yet had its controller set then this method
creates a controller and sets it as this view's controller.

@return {maria.Controller} The controller object.

*/
maria.View.prototype.getController = function() {
    if (!this._controller) {
        this.setController(this.getDefaultController());
    }
    return this._controller;
};

/**

Set the current controller for this view.

@param {maria.Controller} The controller object.

*/
maria.View.prototype.setController = function(controller) {
    this._setModelAndController(this._model, controller);
};


/**

When the model is set for this view, the view will automatically
observe the events which are keys of the returned object. The values
for each key is the view's handler method to be called when the corresponding
event is dispatched on the model.

By default, a view will observe the model for `change` events and handle
those events with the view's `update` method.

You can override this method but, beware, doing so can lead to the dark side.

@return {Object} The map of model events and view handers.

*/
maria.View.prototype.getModelActions = function() {
    return {'change': 'update'};
};

maria.View.prototype._setModelAndController = function(model, controller) {
    var type, eventMap;
    if (this._model !== model) {
        if (this._model) {
            eventMap = this._lastModelActions;
            for (type in eventMap) {
                if (Object.prototype.hasOwnProperty.call(eventMap, type)) {
                    maria.off(this._model, type, this, eventMap[type]);
                }
            }
            delete this._lastModelActions;
        }
        if (model) {
            eventMap = this._lastModelActions = this.getModelActions() || {};
            for (type in eventMap) {
                if (Object.prototype.hasOwnProperty.call(eventMap, type)) {
                    maria.on(model, type, this, eventMap[type]);
                }
            }
        }
        this._model = model;
    }
    if ((this._controller !== controller) && this._controller) {
        this._controller.setView(null);
        this._controller.setModel(null);
    }
    if (controller) {
        controller.setView(this);
        controller.setModel(model);
    }
    this._controller = controller;
};
/**

A constructor function to create new element view objects.

    var elementView = new maria.ElementView();

This constructor function takes three optional arguments.

    var model = new maria.Model();
    var controller = new maria.Controller();
    var myFrameDoc = window.frames['myFrame'].document;
    var elementView =
        new maria.ElementView(model, controller, myFrameDoc);

The null or undefined value can be passed for any of these three
parameters to skip setting it.

The purpose of the third document parameter is to allow the creation
of element views in one window that will be shown in another window.
At least some older browsers do not allow a DOM element created with
one document object to be appended to another document object.

An element view is a view (inheriting from maria.View) and so has
a model and controller. See maria.View for more documentation about
setting and getting the model and controller objects.

What makes maria.ElementView different from the more abstract
maria.View is that an element view has the concept of a "root element"
which is the main DOM element that acts as a container for all the
other DOM elements that are part of the element view.

The DOM is built using the getTemplate method which should return a
fragment of HTML for a single DOM element and its children. By default
the template is just an empty div element. You can redefine or override
this to suit your needs.

    maria.ElementView.prototype.getTemplate = function() {
        return '<div>' +
                   '<span class="greeting">hello</span>, ' +
                   '<span class="name">world</span>' +
               '</div>';
    };

When an element view is created and its HTML template is rendered as
a DOM element, the view will automatically start listening to the DOM
element or its children for the events specified in the map returned
by the getUIActions method. This map is empty by default but you can
redefine or override as necessary and supply the necessary handler
functions which usually delegate to the controller.

    maria.ElementView.prototype.getUIActions = function() {
        return {
            'mouseover .greeting': 'onMouseoverGreeting',
            'click .name'        : 'onClickName'
        };
    };

    maria.ElementView.prototype.onMouseoverGreeting = function(evt) {
        this.getController().onMouseoverGreeting(evt);
    };

    maria.ElementView.prototype.onClickName = function(evt) {
        this.getController().onClickName(evt);
    };

Only a few simple CSS selectors are allowed in the keys of the UI
action map. An id can be used like "#alpha" but this is not
recommended. A class name like ".greeting", a tag name like "div", or
a combination of tag name and class name like "div.greeting" are
acceptable. In almost all cases, a single class name is sufficient and
recommended as the best practice. (If you need more complex selectors
you can use a different query library to replace the Grail library
used by default in Maria.)

You can find an element or multiple elements in a view using the
element view's find and findAll methods.

    elementView.find('.name');   // returns a DOM element
    elementView.findAll('span'); // returns an array

Because maria.View objects are composite views, so are
maria.ElementView objects. This means that sub-element-view objects can
be added to an element view. By default the sub-element-view object's
root DOM element will be added to the parent element view's root
DOM element. You can change the element to which they are added by
redefining or overridding the getContainerEl function.

    maria.ElementView.prototype.getContainerEl = function() {
        return this.find('.name');
    };

A particularly useful pattern is using maria.ElementView as the
"superclass" of your application's element views. The following example
shows how this can be done at a low level for a to-do application. See
maria.ElementView.subclass for a much more compact way to accomplish
the same.

    checkit.TodoView = function() {
        maria.ElementView.apply(this, arguments);
    };
    checkit.TodoView.prototype = maria.create(maria.ElementView.prototype);
    checkit.TodoView.prototype.constructor = checkit.TodoView;
    checkit.TodoView.prototype.getDefaultControllerConstructor = function() {
        return checkit.TodoController;
    };
    checkit.TodoView.prototype.getTemplate = function() {
        return checkit.TodoTemplate;
    };
    checkit.TodoView.prototype.getUIActions = function() {
        return {
            'click     .check'       : 'onClickCheck'     ,
            'dblclick  .todo-content': 'onDblclickDisplay',
            'keyup     .todo-input'  : 'onKeyupInput'     ,
            'keypress  .todo-input'  : 'onKeypressInput'  ,
            'blur      .todo-input'  : 'onBlurInput'
        };
    };
    checkit.TodoView.prototype.onClickCheck = function(evt) {
        this.getController().onClickCheck(evt);
    };
    checkit.TodoView.prototype.onDblclickDisplay = function(evt) {
        this.getController().onDblclickDisplay(evt);
    };
    checkit.TodoView.prototype.onKeyupInput = function(evt) {
        this.getController().onKeyupInput(evt);
    };
    checkit.TodoView.prototype.onKeypressInput = function(evt) {
        this.getController().onKeypressInput(evt);
    };
    checkit.TodoView.prototype.onBlurInput = function(evt) {
        this.getController().onBlurInput(evt);
    };
    checkit.TodoView.prototype.buildData = function() {
        var model = this.getModel();
        var content = model.getContent();
        this.find('.todo-content').innerHTML = checkit.escapeHTML(content);
        this.find('.check').checked = model.isDone();
        aristocrat[model.isDone() ? 'addClass' : 'removeClass'](this.find('.todo'), 'done');
    };
    checkit.TodoView.prototype.update = function() {
        this.buildData();
    };
    checkit.TodoView.prototype.showEdit = function() {
        var input = this.find('.todo-input');
        input.value = this.getModel().getContent();
        aristocrat.addClass(this.find('.todo'), 'editing');
        input.select();
    };
    checkit.TodoView.prototype.showDisplay = function() {
        aristocrat.removeClass(this.find('.todo'), 'editing');
    };
    checkit.TodoView.prototype.getInputValue = function() {
        return this.find('.todo-input').value;
    };
    checkit.TodoView.prototype.showToolTip = function() {
        this.find('.ui-tooltip-top').style.display = 'block';
    };
    checkit.TodoView.prototype.hideToolTip = function() {
        this.find('.ui-tooltip-top').style.display = 'none';
    };

@constructor

@param {maria.Model} [model]

@param {maria.Controller} [controller]

@param {Document} [document]

@extends maria.View

*/
maria.ElementView = function(model, controller, doc) {
    maria.View.call(this, model, controller);
    this.setDocument(doc);
};

maria.ElementView.prototype = maria.create(maria.View.prototype);
maria.ElementView.prototype.constructor = maria.ElementView;

/**

Returns the web page document for the view. This document
is the one used to create elements to be added to the page,
for example.

@return {Document} The document object.

*/
maria.ElementView.prototype.getDocument = function() {
    return this._doc || document;
};

/**

Set the web page document for the view. This document
is the one used to create elements to be added to the page,
for example.

*/
maria.ElementView.prototype.setDocument = function(doc) {
    this._doc = doc;
    var childViews = this.childNodes;
    for (var i = 0, ilen = childViews.length; i < ilen; i++) {
        childViews[i].setDocument(doc);
    }
};

/**

Returns the template for this view used during the build process.

@return {string} The template HTML string.

*/
maria.ElementView.prototype.getTemplate = function() {
    return '<div></div>';
};

/**

The UI actions object maps a UI action like a click
on a button with a handler method name. By default,
the handler will be called on the controller of the view.

@return {Object} The UI actions map.

*/
maria.ElementView.prototype.getUIActions = function() {
    return {};
};

/**

Builds the root DOM element for the view from the view's template
returned by `getTemplate`, attaches event handlers to the root
and its descendents as specified by the UI actions map returned
by `getUIActions`, calls the `buildData` method to allow model
values to be inserted into the root DOM element and its descendents,
and calls `buildChildViews`. This construction of the root DOM element
is lazy and only done when this method is called.

@return {Element} The root DOM Element of the view.

*/
maria.ElementView.prototype.build = function() {
    if (!this._rootEl) {
        this.buildTemplate();
        this.buildUIActions();
        this.buildData();
        this.buildChildViews();
    }
    return this._rootEl;
};

/**

Parses the HTML template string returned by `getTemplate` to create a
`DocumentFragment`. The first child of that `DocumentFragment` is set
as the root element of this view. All other sibling elements of the
`DocumentFragment` are discarded.

*/
maria.ElementView.prototype.buildTemplate = function() {
    // parseHTML returns a DocumentFragment so take firstChild as the rootEl
    this._rootEl = arbutus.parseHTML(this.getTemplate(), this.getDocument()).firstChild;
};

(function() {
    var actionRegExp = /^(\S+)\s*(.*)$/;

/**

Attaches event handlers to the root and its descendents as specified
by the UI actions map returned by `getUIActions`.

*/
    maria.ElementView.prototype.buildUIActions = function() {
        var uiActions = this.getUIActions();
        for (var key in uiActions) {
            if (Object.prototype.hasOwnProperty.call(uiActions, key)) {
                var matches = key.match(actionRegExp),
                    eventType = matches[1],
                    selector = matches[2],
                    methodName = uiActions[key],
                    elements = this.findAll(selector, this._rootEl);
                for (var i = 0, ilen = elements.length; i < ilen; i++) {
                    maria.on(elements[i], eventType, this, methodName);
                }
            }
        }
    };

}());

/**

Does nothing by default. To be overridden by subclasses.

The intended use of this method is to populate the built root DOM element
and its descendents with model data.

*/
maria.ElementView.prototype.buildData = function() {
    // to be overridden by concrete ElementView subclasses
};

/*

Used as part of the initial building of the view. If child views have
been added to the view, then these children also built and appened
to the element returned by `getContainerEl`.

*/
maria.ElementView.prototype.buildChildViews = function() {
    var childViews = this.childNodes;
    for (var i = 0, ilen = childViews.length; i < ilen; i++) {
        this.getContainerEl().appendChild(childViews[i].build());
    }
};

/**

See `buildChildViews` for more details.

@return {Element} The DOM Element to which child view's should be attached.

*/
maria.ElementView.prototype.getContainerEl = function() {
    return this.build();
};

/**

Add a new child view before an existing child view. If the `oldChild`
parameter is not supplied then the `newChild` is appened as the last child.

@param {maria.ElementView} newChild The child to be inserted.

@param {maria.ElementView} oldChild The child to insert before.

*/
maria.ElementView.prototype.insertBefore = function(newChild, oldChild) {
    maria.View.prototype.insertBefore.call(this, newChild, oldChild);
    if (this._rootEl) {
        this.getContainerEl().insertBefore(newChild.build(), oldChild ? oldChild.build() : null);
    }
};

/**

Remove an existing child view.

@param {maria.ElementView} oldChild The child to be removed.

*/
maria.ElementView.prototype.removeChild = function(oldChild) {
    maria.View.prototype.removeChild.call(this, oldChild);
    if (this._rootEl) {
        this.getContainerEl().removeChild(oldChild.build());
    }
};

/**

Find the first element in this view that matches the CSS `selector`. The
view's root element can be the result.

By default Maria uses the Grail library as its DOM query engine. This is
to support older browsers that do not have `querySelector`. The Grail
engine only a limited set of simple selectors.

    .class
    tag
    tag.class
    #id

If your application only needs to work in newer browsers then you can create
a Maria plugin to use `querySelector`. Consider if you want the root element
to be returned if it matches `selector`.

If your application needs to work in older browsers but you need more
complex CSS `selector` strings then you can create a Maria plugin
to use some libray other than Grail.

@param {string} selector A CSS selector.

@return {Element} The first DOM element matching `selector`.

*/
maria.ElementView.prototype.find = function(selector) {
    return grail.find(selector, this.build());
};

/**

Find all the elements in this view that matches the CSS `selector`. The
view's root element can be in the result set.

See `find` for more details.

@param {string} selector A CSS selector.

@return {Array} An array of the DOM elements matching `selector`.

*/
maria.ElementView.prototype.findAll = function(selector) {
    return grail.findAll(selector, this.build());
};
/**

A constructor function to create new set view objects.

    var setView = new maria.SetView();

maria.SetView inherits from maria.ElementView and the documentation of
maria.ElementView will tell you most of what you need to know when
working with a maria.SetView.

A maria.SetView is intended to be a view for a maria.SetModel. The set
view will take care child views when elements are added or deleted from
the set model.

When an element is added to the set, the set view need to know what
kind of view to make. Your application will redefine or likely override
the set view's createChildView method.

    maria.SetView.prototype.createChildView = function(model) {
        return new maria.ElementView(model);
    };

A particularly useful pattern is using maria.SetView as the
"superclass" of your application's set views. The following example
shows how this can be done at a low level for a to-do application. See
maria.SetView.subclass for a more compact way to accomplish the same.

    checkit.TodosListView = function() {
        maria.SetView.apply(this, arguments);
    };
    checkit.TodosListView.prototype = maria.create(maria.SetView.prototype);
    checkit.TodosListView.prototype.constructor = checkit.TodosListView;
    checkit.TodosListView.prototype.getTemplate = function() {
        return checkit.TodosListTemplate;
    };
    checkit.TodosListView.prototype.createChildView = function(todoModel) {
        return new checkit.TodoView(todoModel);
    };

@constructor

@param {maria.Model} [model]

@param {maria.Controller} [controller]

@param {Document} [document]

@extends maria.ElementView

*/
maria.SetView = function() {
    maria.ElementView.apply(this, arguments);
};

maria.SetView.prototype = maria.create(maria.ElementView.prototype);
maria.SetView.prototype.constructor = maria.SetView;

/**

The model of the view is a `maria.SetModel`. A new view will be created
for each model in that set model and the view will be appended as a child
view of this set view.

@override

*/
maria.SetView.prototype.buildChildViews = function() {
    var childModels = this.getModel().toArray();
    for (var i = 0, ilen = childModels.length; i < ilen; i++) {
        this.appendChild(this.createChildView(childModels[i]));
    }
};

/**

Creates a child view for a model. To be overridden by subclasses.

@param {maria.Model} model The model for the child view.

*/
maria.SetView.prototype.createChildView = function(model) {
    return new maria.ElementView(model);
};

/**

The handler for `change` events on this view's set model object.

@param {Object} event The event object.

@override

*/
maria.SetView.prototype.update = function(evt) {
    // Don't update for bubbling events.
    if (evt.target === this.getModel()) {
        if (evt.addedTargets && evt.addedTargets.length) {
            this.handleAdd(evt);
        }
        if (evt.deletedTargets && evt.deletedTargets.length) {
            this.handleDelete(evt);
        }
    }
};


/**

When a `change` event is fired on this view's set model because
some models were added to the set model, this method
will create child views and append them as children of this set view.

@param {Object} event The event object.

*/
maria.SetView.prototype.handleAdd = function(evt) {
    var childModels = evt.addedTargets;
    for (var i = 0, ilen = childModels.length; i < ilen; i++) {
        this.appendChild(this.createChildView(childModels[i]));
    }
};

/**

When a `change` event is fired on this view's set model because
some models were deleted from the set model, this method
will find, remove, and destroy the corresponding child views
of this set view.

@param {Object} event The event object.

*/
maria.SetView.prototype.handleDelete = function(evt) {
    var childModels = evt.deletedTargets;
    for (var i = 0, ilen = childModels.length; i < ilen; i++) {
        var childModel = childModels[i];
        var childViews = this.childNodes;
        for (var j = 0, jlen = childViews.length; j < jlen; j++) {
            var childView = childViews[j];
            if (childView.getModel() === childModel) {
                this.removeChild(childView);
                childView.destroy();
                break;
            }
        }
    }
};
/**

A constructor function to create new controller objects.

Controller objects are usually created lazily on demand by a view
object but you can create one explicitly. You might want to do this if
you want to exercise the strategy pattern and dynamically change a
view's controller.

    var controller = new maria.Controller();

A controller object has a view object. The view will automatically
sets itself as the controller's view when the view creates
the controller or when view.setController is called with the
controller. You can set the view object explicitely but you may
never have a need to do this.

    var view = new maria.View();
    controller.setView(view);

You can get the controller's view object when needed and you will do
this frequently in the methods of the controller.

    controller.getView();

A controller object also has a model object. A controller-view pair
will usually have the same model object and the view object will keep
the controller object's model in sync with the view object's model
object. The model is usually set automatically by the view when the
view creates the controller or when view.setController is called with
the controller. You can set the model object explicitely but you
many never have a need to do this.

    var model = new maria.Model();
    controller.setModel(model);

You can get the controller's model object when needed and you will do
this frequently in the methods of the controller.

    controller.getModel();

A particularly useful pattern is using maria.Controller as the
"superclass" of your application's controller. The following
example shows how this can be done at a low level for a to-do
application. See maria.Controller.subclass for a more compact way
to accomplish the same.

    checkit.TodoController = function() {
        maria.Controller.apply(this, arguments);
    };
    checkit.TodoController.prototype = maria.create(maria.Controller.prototype);
    checkit.TodoController.prototype.constructor = checkit.TodoController;
    checkit.TodoController.prototype.onClickCheck = function() {
        this.getModel().toggleDone();
    };
    checkit.TodoController.prototype.onDblclickDisplay = function() {
        this.getView().showEdit();
    };
    checkit.TodoController.prototype.onKeyupInput = function() {
        var view = this.getView();
        if (checkit.isBlank(view.getInputValue())) {
            view.hideToolTip();
        } else {
            view.showToolTip();
        }
    };
    checkit.TodoController.prototype.onKeypressInput = function(evt) {
        if (evt.keyCode === 13) {
            this.onBlurInput();
        }
    };
    checkit.TodoController.prototype.onBlurInput = function() {
        var view = this.getView();
        var value = view.getInputValue();
        view.hideToolTip();
        view.showDisplay();
        if (!checkit.isBlank(value)) {
            this.getModel().setContent(value);
        }
    };

@constructor

*/
maria.Controller = function() {};

/**

The destroy method.

*/
maria.Controller.prototype.destroy = function() {
    this._model = null;
    if (this._view) {
        this._view.setController(null);
        this._view = null;
    }
};

/**

Returns the current model object of the controller.

@return {maria.Model} The model object.

*/
maria.Controller.prototype.getModel = function() {
    return this._model;
};

/**

**Pretend you do not know that this method even exists.**
`setModel` is intended to be called **only** by 
the view `_setModelAndController` method. **Do otherwise
at your own risk!**

@param {maria.Model} model The model object.

*/
maria.Controller.prototype.setModel = function(model) {
    this._model = model;
};

/**

Returns the current view object of the controller.

@return {maria.View} The view object.

*/
maria.Controller.prototype.getView = function() {
    return this._view;
};

/**

**Pretend you do not know that this method even exists.**
`setView` is intended to be called **only** by 
the view `_setModelAndController` method. **Do otherwise
at your own risk!**

@param {maria.View} view The view object.

*/
maria.Controller.prototype.setView = function(view) {
    this._view = view;
};
/**

A function that makes subclassing maria.Model more compact.

The following example creates a checkit.TodoModel constructor function
equivalent to the more verbose example shown in the documentation
for maria.Model.

    maria.Model.subclass(checkit, 'TodoModel', {
        properties: {
            _content: '',
            _isDone: false,
            getContent: function() {
                return this._content;
            },
            setContent: function(content) {
                content = checkit.trim('' + content);
                if (this._content !== content) {
                    this._content = content;
                    this.dispatchEvent({type: 'change'});
                }
            },
            isDone: function() {
                return this._isDone;
            },
            setDone: function(isDone) {
                isDone = !!isDone;
                if (this._isDone !== isDone) {
                    this._isDone = isDone;
                    this.dispatchEvent({type: 'change'});
                }
            },
            toggleDone: function() {
                this.setDone(!this.isDone());
            }
        }
    });

*/
maria.Model.subclass = function() {
    maria.subclass.apply(this, arguments);
};
/**

A function that makes subclassing maria.SetModel more compact.

The following example creates a checkit.TodosModel constructor function
equivalent to the more verbose example shown in the documentation
for maria.SetModel.

    maria.SetModel.subclass(checkit, 'TodosModel', {
        properties: {
            isAllDone: function() {
                return (this.size > 0) &&
                       this.every(function(todo) {
                           return todo.isDone();
                       });
            },
            isAllUndone: function() {
                return this.every(function(todo) {
                           return !todo.isDone();
                       });
            },
            markAllDone: function() {
                this.forEach(function(todo) {
                    todo.setDone(true);
                });
            },
            markAllUndone: function() {
                this.forEach(function(todo) {
                    todo.setDone(false);
                });
            },
            deleteDone: function() {
                var doneTodos = [];
                this.forEach(function(todo) {
                    if (todo.isDone()) {
                        doneTodos.push(todo);
                    }
                });
                this['delete'].apply(this, doneTodos);
            }
        }
    });

*/
maria.SetModel.subclass = function() {
    maria.Model.subclass.apply(this, arguments);
};
/**

A function that makes subclassing maria.View more compact.

The following example creates a myapp.MyView constructor function
equivalent to the more verbose example shown in the documentation
for maria.View.

    maria.View.subclass(myapp, 'MyView', {
        modelActions: {
            'squashed': 'onSquashed',
            'squished': 'onSquished'
        },
        properties: {
            anotherMethod: function() {
                alert('another method');
            }
        }
    });

This subclassing function implements options following the
"convention over configuration" philosophy. The myapp.MyView will,
by convention, use the myapp.MyController constructor.
This can be configured.

    maria.View.subclass(myapp, 'MyView', {
        controllerConstructor: myapp.MyController,
        modelActions: {
        ...

Alternately you can use late binding by supplying a string name of
an object in the application's namespace object (i.e. the myapp object
in this example).

    maria.View.subclass(myapp, 'MyView', {
        controllerConstructorName: 'MyController',
        modelActions: {
        ...

*/
maria.View.subclass = function(namespace, name, options) {
    options = options || {};
    var controllerConstructor = options.controllerConstructor;
    var controllerConstructorName = options.controllerConstructorName || name.replace(/(View|)$/, 'Controller');
    var modelActions = options.modelActions;
    var properties = options.properties || (options.properties = {});
    if (!Object.prototype.hasOwnProperty.call(properties, 'getDefaultControllerConstructor')) {
        properties.getDefaultControllerConstructor = function() {
            return controllerConstructor || namespace[controllerConstructorName];
        };
    }
    if (modelActions && !Object.prototype.hasOwnProperty.call(properties, 'getModelActions')) {
        properties.getModelActions = function() {
            return modelActions;
        };
    }
    maria.subclass.call(this, namespace, name, options);
};
/**

A function that makes subclassing maria.ElementView more compact.

The following example creates a checkit.TodoView constructor function
equivalent to the more verbose example shown in the documentation
for maria.ElementView.

    maria.ElementView.subclass(checkit, 'TodoView', {
        uiActions: {
            'click     .check'       : 'onClickCheck'     ,
            'dblclick  .todo-content': 'onDblclickDisplay',
            'keyup     .todo-input'  : 'onKeyupInput'     ,
            'keypress  .todo-input'  : 'onKeypressInput'  ,
            'blur      .todo-input'  : 'onBlurInput'
        },
        properties: {
            buildData: function() {
                var model = this.getModel();
                var content = model.getContent();
                this.find('.todo-content').innerHTML = checkit.escapeHTML(content);
                this.find('.check').checked = model.isDone();
                aristocrat[model.isDone() ? 'addClass' : 'removeClass'](this.find('.todo'), 'done');
            },
            update: function() {
                this.buildData();
            },
            showEdit: function() {
                var input = this.find('.todo-input');
                input.value = this.getModel().getContent();
                aristocrat.addClass(this.find('.todo'), 'editing');
                input.select();
            },
            showDisplay: function() {
                aristocrat.removeClass(this.find('.todo'), 'editing');
            },
            getInputValue: function() {
                return this.find('.todo-input').value;
            },
            showToolTip: function() {
                this.find('.ui-tooltip-top').style.display = 'block';
            },
            hideToolTip: function() {
                this.find('.ui-tooltip-top').style.display = 'none';
            }
        }
    });

This subclassing function implements options following the
"convention over configuration" philosophy. The checkit.TodoView will,
by convention, use the checkit.TodoController
and checkit.TodoTemplate objects. All of these can be configured
explicitly if these conventions do not match your view's needs.

    maria.ElementView.subclass(checkit, 'TodoView', {
        controllerConstructor: checkit.TodoController,
        template             : checkit.TodoTemplate  ,
        uiActions: {
        ...

Alternately you can use late binding by supplying string names of
objects in the application's namespace object (i.e. the checkit object
in this example).

maria.ElementView.subclass(checkit, 'TodoView', {
    controllerConstructorName: 'TodoController',
    templateName             : 'TodoTemplate'  ,
    uiActions: {
    ...

*/
maria.ElementView.subclass = function(namespace, name, options) {
    options = options || {};
    var template = options.template;
    var templateName = options.templateName || name.replace(/(View|)$/, 'Template');
    var uiActions = options.uiActions;
    var properties = options.properties || (options.properties = {});
    if (!Object.prototype.hasOwnProperty.call(properties, 'getTemplate')) {
        if (template) {
            properties.getTemplate = function() {
                return template;
            };
        }
        else if (templateName) {
            properties.getTemplate = function() {
                return namespace[templateName];
            };
        }
    }
    if (uiActions) {
        if (!Object.prototype.hasOwnProperty.call(properties, 'getUIActions')) {
            properties.getUIActions = function() {
                return uiActions;
            };
        }
        for (var key in uiActions) {
            if (Object.prototype.hasOwnProperty.call(uiActions, key)) {
                var methodName = uiActions[key];
                if ((!Object.prototype.hasOwnProperty.call(properties, methodName)) &&
                    (!(methodName in this.prototype))) {
                    (function(methodName) {
                        properties[methodName] = function(evt) {
                            this.getController()[methodName](evt);
                        };
                    }(methodName));
                }
            }
        }
    }
    maria.View.subclass.call(this, namespace, name, options);
};
/**

The same as maria.ElementView.

You will likely want to specify a createChildView method.

The following example creates a checkit.TodosListView constructor
function equivalent to the more verbose example shown in the
documentation for maria.SetView.

    maria.SetView.subclass(checkit, 'TodosListView', {
        properties: {
            createChildView: function(todoModel) {
                return new checkit.TodoView(todoModel);
            }
        }
    });

*/
maria.SetView.subclass = function() {
    maria.ElementView.subclass.apply(this, arguments);
};
/**

A function that makes subclassing maria.Controller more compact.

The following example creates a checkit.TodoController constructor
function equivalent to the more verbose example shown in
the documentation for maria.Controller.

    maria.Controller.subclass(checkit, 'TodoController', {
        properties: {
            onClickCheck: function() {
                this.getModel().toggleDone();
            },
            onDblclickDisplay: function() {
                this.getView().showEdit();
            },
            onKeyupInput: function() {
                var view = this.getView();
                if (checkit.isBlank(view.getInputValue())) {
                    view.hideToolTip();
                } else {
                    view.showToolTip();
                }
            },
            onKeypressInput: function(evt) {
                if (evt.keyCode === 13) {
                    this.onBlurInput();
                }
            },
            onBlurInput: function() {
                var view = this.getView();
                var value = view.getInputValue();
                view.hideToolTip();
                view.showDisplay();
                if (!checkit.isBlank(value)) {
                    this.getModel().setContent(value);
                }
            }
        }
    });

*/
maria.Controller.subclass = function() {
    maria.subclass.apply(this, arguments);
};

return maria;}()); // IIFE
