/*
Evento version 0 - JavaScript libraries for working with the observer pattern
Copyright (c) 2012, Peter Michaux
All rights reserved.
Licensed under the Simplified BSD License.
https://github.com/petermichaux/evento/blob/master/LICENSE
*/var evento = evento || {};
/**

@property evento.EventTarget

@description

A constructor function for creating event target objects.

var et = new evento.EventTarget();

The methods of an event target object are inspired by the DOM2 standard.

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

@property evento.EventTarget.prototype.addEventListener

@parameter type {string} The name of the event.

@parameter listener {object|function} The listener object or callback function.

@description

If the listener is an object then when a matching event type is dispatched on
the event target, the listener object's handleEvent method will be called.

If the listener is a function then when a matching event type is dispatched on
the event target, the listener function is called with event target object set as
the "this" object.

One listener (or type/listener pair to be more precise) can be added only once.

et.addEventListener('change', {handleEvent:function(){}});
et.addEventListener('change', function(){});

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

@property evento.EventTarget.prototype.removeEventListener

@parameter type {string} The name of the event.

@parameter listener {object|function} The listener object or callback function.

@description

Removes added listener matching the type/listener combination exactly.
If this combination is not found there are no errors.

var o = {handleEvent:function(){}};
et.removeEventListener('change', o);
et.removeEventListener('change', fn);

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

@property evento.EventTarget.prototype.addParentEventTarget

@parameter parent {EventTarget} A parent to call when bubbling an event.

@description

When an event is dispatched on an event target, if that event target has parents
then the event is also dispatched on the parents as long as bubbling has not
been canceled on the event.

One parent can be added only once.

var o = new evento.EventTarget();
et.addParentEventTarget(o);

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

@property evento.EventTarget.prototype.removeParentEventTarget

@parameter parent {EventTarget} The parent to remove.

@description

Removes parent added with addParentEventTarget. If the listener is
not found there are no errors.

var o = {handleEvent:function(){}};
et.removeParentEventTarget(o);

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

@property evento.EventTarget.prototype.dispatchEvent

@parameter evt {object} The event object to dispatch to all listeners.

@description

The evt.type property is required. All listeners registered for this
event type are called with evt passed as an argument to the listeners.

If not set, the evt.target property will be set to be the event target.

The evt.currentTarget will be set to be the event target.

Call evt.stopPropagation() to stop bubbling to parents.

et.dispatchEvent({type:'change'});
et.dispatchEvent({type:'change', extraData:'abc'});

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
            // is a listener adding itself again which would
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
            for (var i=0, ilen=this._evento_parents.length; i<ilen; i++) {
                this._evento_parents[i].dispatchEvent(evt);
            }
        }
    };

    // Insure the prototype object is initialized properly
    evento.EventTarget.call(evento.EventTarget.prototype);

/**

@property evento.EventTarget.mixin

@parameter obj {object} The object to be made into an event target.

@description

Mixes in the event target methods into any object.

// Example 1

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

// Example 2

var o = {};
evento.EventTarget.mixin(o);
o.addEventListener('change', function(){alert('change');});
o.dispatchEvent({type:'change'});

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

@property evento.addEventListener

@parameter element {EventTarget} The object you'd like to observe.

@parameter type {string} The name of the event.

@parameter listener {object|function} The listener object or callback function.

@parameter auxArg {string|object} Optional. See description.

@description

If the listener is an object then when a matching event type is dispatched on
the event target, the listener object's handleEvent method will be called.
By supplying a string value for auxArg you can specify the name of
the method to be called. You can also supply a function object for auxArg for
early binding.

If the listener is a function then when a matching event type is dispatched on
the event target, the listener function is called with event target object set as
the "this" object. Using the auxArg you can specifiy a different object to be
the "this" object.

One listener (or type/listener/auxArg pair to be more precise) can be added
only once.

var o = {
    handleEvent: function(){},
    handleClick: function(){}
};

// late binding. handleEvent is found when each event is dispatched
evento.addEventListener(document.body, 'click', o);

// late binding. handleClick is found when each event is dispatched
evento.addEventListener(document.body, 'click', o, 'handleClick');

// early binding. The supplied function is bound now
evento.addEventListener(document.body, 'click', o, o.handleClick);
evento.addEventListener(document.body, 'click', o, function(){});

// supplied function will be called with document.body as this object
evento.addEventListener(document.body, 'click', function(){});

// The following form is supported but is not neccessary given the options
// above and it is recommended you avoid it.
evento.addEventListener(document.body, 'click', this.handleClick, this);

*/

/**

@property evento.removeEventListener

@parameter element {EventTarget} The object you'd like to stop observing.

@parameter type {string} The name of the event.

@parameter listener {object|function} The listener object or callback function.

@parameter auxArg {string|object} Optional.

@description

Removes added listener matching the element/type/listener/auxArg combination exactly.
If this combination is not found there are no errors.

var o = {handleEvent:function(){}, handleClick:function(){}};
evento.removeEventListener(document.body, 'click', o);
evento.removeEventListener(document.body, 'click', o, 'handleClick');
evento.removeEventListener(document.body, 'click', o, fn);
evento.removeEventListener(document.body, 'click', fn);
evento.removeEventListener(document.body, 'click', this.handleClick, this);

*/

/**

@property evento.purgeEventListener

@parameter listener {EventListener} The listener object that should stop listening.

@description

Removes all registrations of the listener added through evento.addEventListener.
This purging should be done before your application code looses its last reference
to listener. (This can also be done with more work using evento.removeEventListener for
each registeration.) If the listeners are not removed or purged, the listener
will continue to observe the EventTarget and cannot be garbage collected. In an
MVC application this can lead to "zombie views" if the model data cannot be
garbage collected. Event listeners need to be removed from event targets in browsers
with circular reference memory leak problems (i.e. old versions of Internet Explorer.)

The primary motivation for this purge function is to easy cleanup in MVC View destroy 
methods. For example,

var APP_BoxView = function(model, controller) {
    this.model = model || new APP_BoxModel();
    this.controller = controller || new APP_BoxController();
    this.rootEl = document.createElement('div');

    // subscribe to DOM node(s) and model object(s) or anything else
    // implementing the EventTarget interface using listener objects
    // and specifying method name using the same subscription interface.
    //
    evento.addEventListener(this.rootEl, 'click', this, 'handleClick');
    evento.addEventListener(this.model, 'change', this, 'handleModelChange');
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
    evento.purgeEventListener(this);
};

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

    evento.addEventListener = function(element, type, listener, /*optional*/ auxArg) {
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
            throw new Error('evento.addEventListener: Supported EventTarget interface not found.');
        }
        listener._evento_bundles.push(bundle);
    };

    var remove = evento.removeEventListener = function(element, type, listener, /*optional*/ auxArg) {
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
                    throw new Error('evento.removeEventListener: Supported EventTarget interface not found.');
                } 
                listener._evento_bundles.splice(i, 1);
            }
        }
    };

    evento.purgeEventListener = function(listener) {
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
