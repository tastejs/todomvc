/*!
* CanJS - 1.1.5 (2013-03-27)
* http://canjs.us/
* Copyright (c) 2013 Bitovi
* Licensed MIT
*/
define(['can/util/can', 'mootools', 'can/util/event', 'can/util/fragment', 'can/util/deferred', 'can/util/array/each', 'can/util/object/isplain', '../hashchange'], function (can) {
    // mootools.js
    // ---------
    // _MooTools node list._
    // Map string helpers.
    can.trim = function (s) {
        return s && s.trim()
    }

    // This extend() function is ruthlessly and shamelessly stolen from
    // jQuery 1.8.2:, lines 291-353.
    var extend = function () {
        var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        // Handle a deep copy situation
        if (typeof target === "boolean") {
            deep = target;
            target = arguments[1] || {};
            // skip the boolean and the target
            i = 2;
        }

        // Handle case when target is a string or something (possible in deep copy)
        if (typeof target !== "object" && !can.isFunction(target)) {
            target = {};
        }

        // extend jQuery itself if only one argument is passed
        if (length === i) {
            target = this;
            --i;
        }

        for (; i < length; i++) {
            // Only deal with non-null/undefined values
            if ((options = arguments[i]) != null) {
                // Extend the base object
                for (name in options) {
                    src = target[name];
                    copy = options[name];

                    // Prevent never-ending loop
                    if (target === copy) {
                        continue;
                    }

                    // Recurse if we're merging plain objects or arrays
                    if (deep && copy && (can.isPlainObject(copy) || (copyIsArray = can.isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && can.isArray(src) ? src : [];

                        } else {
                            clone = src && can.isPlainObject(src) ? src : {};
                        }

                        // Never move original objects, clone them
                        target[name] = can.extend(deep, clone, copy);

                        // Don't bring in undefined values
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }

        // Return the modified object
        return target;
    };

    can.extend = extend;

    // Map array helpers.
    can.makeArray = function (item) {
        // All other libraries return a copy if item is an array.
        // The original Mootools Array.from returned the same item so we need to slightly modify it
        if (item == null) return [];
        try {
            return (Type.isEnumerable(item) && typeof item != 'string') ? Array.prototype.slice.call(item) : [item];
        } catch (ex) {
            // some things like DOMNodeChildCollections don't slice so good.
            // This pains me, but it has to be done.
            var arr = [],
                i;
            for (i = 0; i < item.length; ++i) {
                arr.push(item[i]);
            }
            return arr;
        }
    }

    can.isArray = function (arr) {
        return typeOf(arr) === 'array'
    };
    can.inArray = function (item, arr) {
        if (!arr) {
            return -1;
        }
        return Array.prototype.indexOf.call(arr, item);
    }
    can.map = function (arr, fn) {
        return Array.from(arr || []).map(fn);
    }

    // Map object helpers.
    can.param = function (object) {
        return Object.toQueryString(object)
    }
    can.isEmptyObject = function (object) {
        return Object.keys(object).length === 0;
    }
    // Map function helpers.
    can.proxy = function (func) {
        var args = can.makeArray(arguments),
            func = args.shift();

        return func.bind.apply(func, args)
    }
    can.isFunction = function (f) {
        return typeOf(f) == 'function'
    }

    // Make this object so you can bind on it.
    can.bind = function (ev, cb) {

        // If we can bind to it...
        if (this.bind && this.bind !== can.bind) {
            this.bind(ev, cb)
        } else if (this.addEvent) {
            this.addEvent(ev, cb);
        } else if (this.nodeName && this.nodeType == 1) {
            $(this).addEvent(ev, cb)
        } else {
            // Make it bind-able...
            can.addEvent.call(this, ev, cb)
        }
        return this;
    }
    can.unbind = function (ev, cb) {
        // If we can bind to it...
        if (this.unbind && this.unbind !== can.unbind) {
            this.unbind(ev, cb)
        } else if (this.removeEvent) {
            this.removeEvent(ev, cb)
        }
        if (this.nodeName && this.nodeType == 1) {
            $(this).removeEvent(ev, cb)
        } else {
            // Make it bind-able...
            can.removeEvent.call(this, ev, cb)
        }
        return this;
    }
    can.trigger = function (item, event, args, bubble) {
        // Defaults to `true`.
        bubble = (bubble === undefined ? true : bubble);
        args = args || []
        if (item.fireEvent) {
            item = item[0] || item;
            // walk up parents to simulate bubbling .
            while (item) {
                // Handle walking yourself.
                if (!event.type) {
                    event = {
                        type: event,
                        target: item
                    }
                }
                var events = (item !== window ? can.$(item).retrieve('events')[0] : item.retrieve('events'));
                if (events && events[event.type]) {
                    events[event.type].keys.each(function (fn) {
                        fn.apply(this, [event].concat(args));
                    }, this);
                }
                // If we are bubbling, get parent node.
                if (bubble && item.parentNode) {
                    item = item.parentNode
                } else {
                    item = null;
                }

            }

        } else {
            if (typeof event === 'string') {
                event = {
                    type: event
                }
            }
            event.target = event.target || item;
            event.data = args
            can.dispatch.call(item, event)
        }
    }
    can.delegate = function (selector, ev, cb) {
        if (this.delegate) {
            this.delegate(selector, ev, cb)
        }
        else if (this.addEvent) {
            this.addEvent(ev + ":relay(" + selector + ")", cb)
        } else {
            // make it bind-able ...
        }
        return this;
    }
    can.undelegate = function (selector, ev, cb) {
        if (this.undelegate) {
            this.undelegate(selector, ev, cb)
        }
        else if (this.removeEvent) {
            this.removeEvent(ev + ":relay(" + selector + ")", cb)
        } else {
            // make it bind-able ...
        }
        return this;
    }
    var optionsMap = {
        type: "method",
        success: undefined,
        error: undefined
    }
    var updateDeferred = function (xhr, d) {
        for (var prop in xhr) {
            if (typeof d[prop] == 'function') {
                d[prop] = function () {
                    xhr[prop].apply(xhr, arguments)
                }
            } else {
                d[prop] = prop[xhr]
            }
        }
    }
    can.ajax = function (options) {
        var d = can.Deferred(),
            requestOptions = can.extend({}, options),
            request;
        // Map jQuery options to MooTools options.
        for (var option in optionsMap) {
            if (requestOptions[option] !== undefined) {
                requestOptions[optionsMap[option]] = requestOptions[option];
                delete requestOptions[option]
            }
        }
        // Mootools defaults to 'post', but Can expects a default of 'get'
        requestOptions.method = requestOptions.method || 'get';
        requestOptions.url = requestOptions.url.toString();

        var success = options.onSuccess || options.success,
            error = options.onFailure || options.error;

        requestOptions.onSuccess = function (response, xml) {
            var data = response;
            updateDeferred(request.xhr, d);
            d.resolve(data, "success", request.xhr);
            success && success(data, "success", request.xhr);
        }
        requestOptions.onFailure = function () {
            updateDeferred(request.xhr, d);
            d.reject(request.xhr, "error");
            error(request.xhr, "error");
        }

        if (options.dataType === 'json') {
            request = new Request.JSON(requestOptions);
        } else {
            request = new Request(requestOptions);
        }
        request.send();
        updateDeferred(request.xhr, d);
        return d;

    }
    // Element -- get the wrapped helper.
    can.$ = function (selector) {
        if (selector === window) {
            return window;
        }
        return $$(selector)
    }

    // Add `document` fragment support.
    var old = document.id;
    document.id = function (el) {
        if (el && el.nodeType === 11) {
            return el
        } else {
            return old.apply(document, arguments);
        }
    };
    can.append = function (wrapped, html) {
        if (typeof html === 'string') {
            html = can.buildFragment(html)
        }
        return wrapped.grab(html)
    }
    can.filter = function (wrapped, filter) {
        return wrapped.filter(filter);
    }
    can.data = function (wrapped, key, value) {
        if (value === undefined) {
            return wrapped[0].retrieve(key)
        } else {
            return wrapped.store(key, value)
        }
    }
    can.addClass = function (wrapped, className) {
        return wrapped.addClass(className);
    }
    can.remove = function (wrapped) {
        // We need to remove text nodes ourselves.
        var filtered = wrapped.filter(function (node) {
            if (node.nodeType !== 1) {
                node.parentNode.removeChild(node);
            } else {
                return true;
            }
        })
        filtered.destroy();
        return filtered;
    }

    // Destroyed method.
    var destroy = Element.prototype.destroy;
    Element.implement({
        destroy: function () {
            can.trigger(this, "destroyed", [], false)
            var elems = this.getElementsByTagName("*");
            for (var i = 0, elem;
            (elem = elems[i]) !== undefined; i++) {
                can.trigger(elem, "destroyed", [], false);
            }
            destroy.apply(this, arguments)
        }
    });
    can.get = function (wrapped, index) {
        return wrapped[index];
    }

    // Overwrite to handle IE not having an id.
    // IE barfs if text node.
    var idOf = Slick.uidOf;
    Slick.uidOf = function (node) {
        // for some reason, in IE8, node will be the window but not equal it.
        if (node.nodeType === 1 || node === window || node.document === document) {
            return idOf(node);
        } else {
            return Math.random();
        }
    }

    return can;
});