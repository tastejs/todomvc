(function(window) {

"use strict";

// Laces Object constructor.
//
// This is the base class for the other laces object types. You should not
// instantiate this class directly. Instead, use LacesArray, LacesMap or
// LacesModel. The methods defined here are available on all said object types.
function LacesObject() {

    Object.defineProperty(this, "_bindings", { "value": [], "writable": true });
    Object.defineProperty(this, "_eventListeners", { "value": {}, "writable": true });
    Object.defineProperty(this, "_heldEvents", { "value": null, "writable": true });
}

// Bind an event listener to the event with the specified name.
//
// eventName - Name of the event to bind to. Can be "add", "update", "remove",
//             "change" or "change:<propertyName>". Multiple event names may be
//             given separated by spaces.
// listener - Callback function that will be invoked when the event is fired.
//            The callback will receive an event parameter, the contents of
//            which relies on the event parameter given to the fire() method.
// options - Optional options object. If you set the "initialFire" property to
//           true, the listener will be invoked immediately. Beware that unless
//           eventName specifies a specific property, the event object will be
//           completely empty the first time.
LacesObject.prototype.bind = function(eventName, listener, options) {

    options = options || {};

    if (eventName.indexOf(" ") > -1) {
        var eventNames = eventName.split(" ");
        for (var i = 0, length = eventNames.length; i < length; i++) {
            this.bind(eventNames[i], listener);
        }
        if (options.initialFire) {
            this.fire(eventNames[0], {});
        }
    } else {
        if (!this._eventListeners.hasOwnProperty(eventName)) {
            this._eventListeners[eventName] = [];
        }
        this._eventListeners[eventName].push(listener);

        if (options.initialFire) {
            var event = {};
            if (eventName.indexOf(":") > -1) {
                var propertyName = eventName.substr(eventName.indexOf(":") + 1);
                event.key = propertyName;
                event.value = this[propertyName];
            }
            this.fire(eventName, event);
        }
    }
};

// Fire an event and invoke all the listeners bound to it.
//
// eventName - Name of the event to fire. Multiple event names may be given
//             separated by spaces.
// event - Optional event object to pass to the listener callbacks. If omitted,
//         the empty object is assumed. Either way, the "name" property will be
//         set to match the event name.
LacesObject.prototype.fire = function(eventName, event) {

    var i = 0, length;
    if (eventName.indexOf(" ") > -1) {
        var eventNames = eventName.split(" ");
        for (length = eventNames.length; i < length; i++) {
            this.fire(eventNames[i], event);
        }
    } else {
        event = event || {};
        event.name = eventName;

        if (this._heldEvents instanceof Array) {
            for (length = this._heldEvents.length; i < length; i++) {
                if (this._heldEvents[i].name === eventName) {
                    return;
                }
            }
            this._heldEvents.push(event);
        } else {
            var listeners;
            if (this._eventListeners.hasOwnProperty(eventName)) {
                listeners = this._eventListeners[eventName];
                for (length = listeners.length; i < length; i++) {
                    listeners[i].call(this, event);
                }
            }
            if (eventName === "change" && event.key && this instanceof LacesModel) {
                eventName = "change:" + event.key;
                event.name = eventName;
                if (this._eventListeners.hasOwnProperty(eventName)) {
                    listeners = this._eventListeners[eventName];
                    for (i = 0, length = listeners.length; i < length; i++) {
                        listeners[i].call(this, event);
                    }
                }
            }
        }
    }
};

LacesObject.prototype.log = function(message) {

    if (typeof console !== "undefined" && console.log) {
        console.log("laces.js: " + message);
    }
};

// Call this method if you plan to do many changes at once. When this method has
// been called all events which should be fired will be put on hold instead. The
// events will be called when fireHeldEvents() is called, but any duplicate
// events will be removed before doing so (thus avoiding the overhead of running
// event listeners multiple times).
//
// Warning: Make sure you will call fireHeldEvents() when you're done. Computed
//          properties may have inconsistent values until fireHeldEvents() is
//          called.
LacesObject.prototype.holdEvents = function() {

    this._heldEvents = [];
};

// Fire all held events, and resume normal firing of events. Call this method
// after when you're making changes after a call to holdEvents().
LacesObject.prototype.fireHeldEvents = function() {

    if (this._heldEvents === null) {
        this.log("Need a call to holdEvents() before calling fireHeldEvents()");
        return;
    }

    var heldEvents = this._heldEvents;
    this._heldEvents = null;

    for (var i = 0, length = heldEvents.length; i < length; i++) {
        var heldEvent = heldEvents[i];
        this.fire(heldEvent.name, heldEvent);
    }
};

// Discard all held events, and resume normal firing of events.
//
// Warning: Use of this method may leave computed properties in an inconsistent
//          state.
LacesObject.prototype.discardHeldEvents = function() {

    this._heldEvents = null;
};

// Unbind a previously bound listener callback.
//
// eventName - Name of the event to which the listener was bound. If omitted,
//             the listener will be unbound from all event types.
// listener - Callback function to unbind.
LacesObject.prototype.unbind = function(eventName, listener) {

    if (typeof eventName === "function") {
        var removed = false;
        for (eventName in this._eventListeners) {
            if (this._eventListeners.hasOwnProperty(eventName)) {
                if (this.unbind(eventName, listener)) {
                    removed = true;
                }
            }
        }
        return removed;
    }

    if (!this._eventListeners.hasOwnProperty(eventName)) {
        return false;
    }

    var index = this._eventListeners[eventName].indexOf(listener);
    if (index > -1) {
        this._eventListeners[eventName].splice(index, 1);
        return true;
    } else {
        return false;
    }
};

LacesObject.prototype.wrap = function(value) {

    var wrapped;
    if (value && value._gotLaces) {
        wrapped = value;
    } else if (value instanceof Array) {
        wrapped = new LacesArray();
        for (var i = 0, length = value.length; i < length; i++) {
            wrapped.set(i, value[i]);
        }
    } else if (value instanceof Function) {
        wrapped = value;
    } else if (value instanceof Object) {
        wrapped = new LacesMap(value);
    } else {
        wrapped = value;
    }
    return wrapped;
};

LacesObject.prototype._gotLaces = true;

LacesObject.prototype._bindValue = function(key, value) {

    if (value && value._gotLaces) {
        var self = this;
        var binding = function() {
            self.fire("change", { "key": key, "value": value });
        };
        value.bind("change", binding);
        this._bindings.push(binding);
    }
};

LacesObject.prototype._unbindValue = function(value) {

    if (value && value._gotLaces) {
        for (var i = 0, length = this._bindings.length; i < length; i++) {
            if (value.unbind("change", this._bindings[i])) {
                this._bindings.splice(i, 1);
                break;
            }
        }
    }
};


// Laces Map constructor.
//
// Laces maps behave like a map or dictionary with get(), set() and remove()
// methods. Once a property has been set you may also use JavaScript's native
// dot notation for access (both getting and setting).
//
// When a property inside the map is changed, "add", "change" and/or "remove"
// events are fired.
//
// object - Optional object to initialize the map with. Properties will be
//          initialized for all key/value pairs of the object using the set()
//          method.
function LacesMap(object) {

    LacesObject.call(this);

    Object.defineProperty(this, "_values", { "value": {}, "writable": true });

    if (object) {
        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                this.set(key, object[key]);
            }
        }
    }
}

LacesMap.prototype = new LacesObject();
LacesMap.prototype.constructor = LacesMap;

// Return the value of a property.
//
// This method is provided for consistency. It is advised however to use
// JavaScript's native dot notation for accessing properties of a map.
//
// key - Key of the property to return.
LacesMap.prototype.get = function(key) {

    return this._values[key];
};

// Remove a property.
//
// key - Key of the property to remove.
LacesMap.prototype.remove = function(key) {

    if (this._values.hasOwnProperty(key)) {
        var value = this._values[key];
        this._unbindValue(value);
        delete this._values[key];
        delete this[key];

        this.fire("remove change", { "key": key, "oldValue": value });

        return true;
    } else {
        return false;
    }
};

// Set a property.
//
// Use this method to initially set a property with its value. Once set, it is
// advised to use JavaScript's native dot notation for accessing properties.
//
// key - Key of the property to set.
// value - Value of the property to set.
// options - Optional options object. This may contain the following properties:
//           type - If set, this determines the type which will be enforced on
//                  the property. The following values are recognized for this
//                  property:
//                  "boolean"        - Values will be either true or false.
//                  "float"/"number" - Values will be a floating point number.
//                  "integer"        - Values will be an integer number.
//                  "string"         - Values will be a string.
//           setFilter - This property may contain a custom function that will
//                       filter any set values. It takes the new value as
//                       argument and returns the filtered value. It should
//                       throw an exception if the new value is not valid.
//                       This property cannot be used in combination with the
//                       type property.
LacesMap.prototype.set = function(key, value, options) {

    options = options || {};

    var self = this;
    var getter = function() { return this._values[key]; };
    var setter = function(newValue) { self._setValue(key, newValue); };

    if (options.type) {
        if (options.type === "boolean") {
            setter = function(newValue) { self._setValue(key, !!newValue); };
        } else if (options.type === "float" || options.type === "number") {
            setter = function(newValue) { self._setValue(key, parseFloat(newValue, 10)); };
        } else if (options.type === "integer") {
            setter = function(newValue) { self._setValue(key, parseInt(newValue, 10)); };
        } else if (options.type === "string") {
            setter = function(newValue) { self._setValue(key, "" + newValue); };
        }
    } else if (options.setFilter) {
        setter = function(newValue) {
            try {
                self._setValue(key, options.setFilter(newValue));
            } catch (exception) {
                self.log("Invalid value for property " + key + ": " + newValue);
            }
        };
    }

    Object.defineProperty(this, key, {
        "get": getter,
        "set": setter,
        "configurable": true,
        "enumerable": true
    });

    setter(value);
};

LacesMap.prototype._setValue = function(key, value) {

    value = this.wrap(value);

    var event = {
        "key": key,
        "value": value
    };

    var newProperty = false;
    if (this._values.hasOwnProperty(key)) {
        var oldValue = this._values[key];
        if (oldValue === value) {
            return;
        }

        this._unbindValue(oldValue);

        event.oldValue = oldValue;
    } else {
        newProperty = true;
    }

    this._values[key] = value;

    this._bindValue(key, value);

    if (newProperty) {
        this.fire("add change", event);
    } else {
        this.fire("update change", event);
    }
};


// Laces Model constructor.
//
// Laces models behave the same as Laces maps, with two exception: When a
// property is assigned a function as its value, the return value of the
// function is used as value for the property. We call this a computed property.
// If the computed property references other properties of the model, the value
// will automatically get updated when one of those other properties is updated.
// The properties which the computed property references are automatically
// detected if they have the form of "this.propertyName". References to
// properties of properties and array elements of properties are detected as
// well. If the property depends on other (non-detected) properties, you can
// specify those by giving an array of dependencies as part of the options
// argument to the set() method.
//
// Examples:
//
//   // references to the "firstName" and "lastName" properties get detected
//   // automatically:
//   model.set("fullName", function() {
//       return this.firstName + " " + this.lastName
//   });
//
//   // dependencies on properties that are referenced in a "hidden" way need to
//   // be specified explicitly:
//   model.set("displayName", function() {
//       return (this.preferredName === "lastName" ? this.title + " " : "") +
//              this[this.preferredName]
//   }, {
//       "dependencies": ["firstName", "lastName", "fullName"]
//   });
//
// Finally, models support "change:<propertyName>" events, which maps don't.
//
// object - Optional object to initialize the model with. Properties will be
//          initialized for all key/value pairs of the object using the set()
//          method.
function LacesModel(object) {

    Object.defineProperty(this, "_functions", { "value": {}, "writable": true });

    LacesMap.call(this, object);
}

LacesModel.prototype = new LacesMap();
LacesModel.prototype.constructor = LacesModel;

LacesModel.prototype.set = function(key, value, options) {

    options = options || {};

    if (typeof value === "function") {
        var dependencies = options.dependencies || [];

        this._functions[key] = value;

        var source = value.toString();

        var match;
        var regExp = /this.(\w+)/g;
        while ((match = regExp.exec(source)) !== null) {
            var dependencyName = match[1];
            if (dependencies.indexOf(dependencyName) === -1) {
                dependencies.push(dependencyName);
            }
        }

        var self = this;
        for (var i = 0, length = dependencies.length; i < length; i++) {
            var dependency = dependencies[i];
            this.bind("change:" + dependency, function() {
                self._reevaluate(key);
            });
        }

        value = value.call(this);
    }

    LacesMap.prototype.set.call(this, key, value, options);
};

LacesModel.prototype._reevaluate = function(key) {

    var newValue = this._functions[key].call(this);
    this._setValue(key, newValue);
};


// Laces Array constructor.
//
// Laces arrays behave almost exactly as regular JavaScript arrays. There are
// two important differences:
// - When an element inside the array is changed, "add", "change" and/or
//   "remove" events are fired.
// - When setting an element, you should use the set() method rather than the
//   default bracket notation. This assures the proper change events get
//   generated.
function LacesArray() {

    var array = [];
    for (var method in LacesArray.prototype) {
        Object.defineProperty(array, method, {
            "value": LacesArray.prototype[method],
            "writable": false
        });
    }
    LacesObject.call(array);
    return array;
}

LacesArray.prototype = new LacesObject();
LacesArray.prototype.constructor = LacesArray;

// Return the element at the specified index.
//
// This method is provided for consistency. It is advised however to use
// JavaScript's native bracket notation for getting elements from an array.
//
// index - Index of the element to return.
LacesArray.prototype.get = function(index) {

    return this[index];
};

// Remove the last element from the array and return that element.
LacesArray.prototype.pop = function() {

    var value = Array.prototype.pop.call(this);
    this._unbindValue(value);
    this.fire("remove change", { "elements": [value] });
    return value;
};

// Mutate the array by appending the given elements and returning the new length
// of the array.
LacesArray.prototype.push = function() {

    for (var i = 0, length = arguments.length; i < length; i++) {
        var value = this.wrap(arguments[i]);
        this._bindValue(this.length, value);
        arguments[i] = value;
    }

    Array.prototype.push.apply(this, arguments);

    this.fire("add change", { "elements": arguments });
};

// Remove the element at the specified index.
//
// This method is provided for consistency. It behaves the same as
// Array.splice(index, 1), but does not return anything.
//
// index - Index of the element to remove.
LacesArray.prototype.remove = function(index) {

    if (index < this.length) {
        var removedElement = this[index];
        this._unbindValue(removedElement);
        Array.prototype.splice.call(this, index, 1);
        this.fire("remove change", { "elements": [removedElement] });
    }
};

// Reverse the array in place. The first array element becomes the last and the
// last becomes the first.
LacesArray.prototype.reverse = function() {

    Array.prototype.reverse.call(this);
    this.fire("change", { "elements": [] });
};

// Set the element at the specified index to the given value. Use this method
// instead of the default bracket notation to assure the proper change events
// get generated.
LacesArray.prototype.set = function(index, value) {

    var newProperty = true;
    if (index < this.length) {
        this._unbindValue(this[index]);
        newProperty = false;
    }

    value = this.wrap(value);
    this[index] = value;
    this._bindValue(index, value);

    if (newProperty) {
        this.fire("add change", { "elements": [value] });
    } else {
        this.fire("update change", { "elements": [value] });
    }
};

// Remove the first element from the array and return that element. This method
// changes the length of the array.
LacesArray.prototype.shift = function() {

    var value = Array.prototype.shift.call(this);
    this._unbindValue(value);
    this.fire("remove change", { "elements": [value] });
    return value;
};

// Sort the elements of the array in place and return the array.
LacesArray.prototype.sort = function() {

    Array.prototype.sort.call(this);
    this.fire("change", { "elements": [] });

    return this;
};

// Change the content of the array, adding new elements while removing old
// elements.
LacesArray.prototype.splice = function(index, howMany) {

    var removedElements = Array.prototype.splice.apply(this, arguments);
    var addedElements = [];
    for (var i = 2, length = arguments.length; i < length; i++) {
        addedElements.push(arguments[i]);
    }

    if (removedElements.length > 0) {
        for (i = 0, length = removedElements.length; i < length; i++) {
            this._unbindValue(removedElements[i]);
        }
        this.fire("remove change", { "elements": removedElements });
    }
    if (addedElements.length > 0) {
        for (i = 0, length = addedElements.length; i < length; i++) {
            this._bindValue(index + i, addedElements[j]);
        }
        this.fire("add change", { "elements": addedElements });
    }

    return removedElements;
};

// Add one or more elements to the beginning of the array and return the new
// length of the array.
LacesArray.prototype.unshift = function() {

    for (var i = 0, length = arguments.length; i < length; i++) {
        var value = this.wrap(arguments[i]);
        this._bindValue(i, value);
        arguments[i] = value;
    }

    Array.prototype.unshift.apply(this, arguments);

    this.fire("add change", { "elements": arguments });

    return this.length;
};


if (typeof define === 'function' && define.amd) {
    define({
        "Model": LacesModel,
        "Map": LacesMap,
        "Array": LacesArray
    });
} else {
    window.LacesModel = LacesModel;
    window.LacesMap = LacesMap;
    window.LacesArray = LacesArray;
}

})(this);
