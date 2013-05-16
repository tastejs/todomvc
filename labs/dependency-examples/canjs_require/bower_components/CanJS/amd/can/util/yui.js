/*!
* CanJS - 1.1.5 (2013-03-27)
* http://canjs.us/
* Copyright (c) 2013 Bitovi
* Licensed MIT
*/
define(['can/util/can', 'yui', 'can/util/event', 'can/util/fragment', 'can/util/array/each', 'can/util/object/isplain', 'can/util/deferred', '../hashchange'], function (can) {

    // ---------
    // _YUI node list._
    // `can.Y` is set as part of the build process.
    // `YUI().use('*')` is called for when `YUI` is statically loaded (like when running tests).
    var Y = can.Y = can.Y || YUI().use('*');

    // Map string helpers.
    can.trim = function (s) {
        return Y.Lang.trim(s);
    }

    // Map array helpers.
    can.makeArray = function (arr) {
        if (!arr) {
            return [];
        }
        return Y.Array(arr);
    };
    can.isArray = Y.Lang.isArray;
    can.inArray = function (item, arr) {
        if (!arr) {
            return -1;
        }
        return Y.Array.indexOf(arr, item);
    };

    can.map = function (arr, fn) {
        return Y.Array.map(can.makeArray(arr || []), fn);
    };

    // Map object helpers.
    can.extend = function (first) {
        var deep = first === true ? 1 : 0,
            target = arguments[deep],
            i = deep + 1,
            arg;
        for (; arg = arguments[i]; i++) {
            Y.mix(target, arg, true, null, null, !! deep);
        }
        return target;
    }
    can.param = function (object) {
        return Y.QueryString.stringify(object, {
            arrayKey: true
        })
    }
    can.isEmptyObject = function (object) {
        return Y.Object.isEmpty(object);
    }

    // Map function helpers.
    can.proxy = function (func, context) {
        return Y.bind.apply(Y, arguments);
    }
    can.isFunction = function (f) {
        return Y.Lang.isFunction(f);
    }

    // Element -- get the wrapped helper.
    var prepareNodeList = function (nodelist) {
        nodelist.each(function (node, i) {
            nodelist[i] = node.getDOMNode();
        });
        nodelist.length = nodelist.size();
        return nodelist;
    }
    can.$ = function (selector) {
        if (selector === window) {
            return window;
        } else if (selector instanceof Y.NodeList) {
            return prepareNodeList(selector);
        } else if (typeof selector === "object" && !can.isArray(selector) && typeof selector.nodeType === "undefined" && !selector.getDOMNode) {
            return selector;
        } else {
            return prepareNodeList(Y.all(selector));
        }
    }
    can.get = function (wrapped, index) {
        return wrapped._nodes[index];
    }
    can.append = function (wrapped, html) {
        wrapped.each(function (node) {
            if (typeof html === 'string') {
                html = can.buildFragment(html, node)
            }
            node.append(html)
        });
    }
    can.addClass = function (wrapped, className) {
        return wrapped.addClass(className);
    }
    can.data = function (wrapped, key, value) {
        if (value === undefined) {

            return wrapped.item(0).getData(key)
        } else {
            return wrapped.item(0).setData(key, value)
        }
    }
    can.remove = function (wrapped) {
        return wrapped.remove() && wrapped.destroy();
    }
    // Destroyed method.
    can._yNodeDestroy = can._yNodeDestroy || Y.Node.prototype.destroy;
    Y.Node.prototype.destroy = function () {
        can.trigger(this, "destroyed", [], false)
        can._yNodeDestroy.apply(this, arguments)
    }
    // Let `nodelist` know about the new destroy...
    Y.NodeList.addMethod("destroy", Y.Node.prototype.destroy);

    // Ajax
    var optionsMap = {
        type: "method",
        success: undefined,
        error: undefined
    }
    var updateDeferred = function (request, d) {
        // `YUI` only returns a request if it is asynchronous.
        if (request && request.io) {
            var xhr = request.io;
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
    }
    can.ajax = function (options) {
        var d = can.Deferred(),
            requestOptions = can.extend({}, options);

        for (var option in optionsMap) {
            if (requestOptions[option] !== undefined) {
                requestOptions[optionsMap[option]] = requestOptions[option];
                delete requestOptions[option]
            }
        }
        requestOptions.sync = !options.async;

        var success = options.success,
            error = options.error;

        requestOptions.on = {
            success: function (transactionid, response) {
                var data = response.responseText;
                if (options.dataType === 'json') {
                    data = eval("(" + data + ")")
                }
                updateDeferred(request, d);
                d.resolve(data);
                success && success(data, "success", request);
            },
            failure: function (transactionid, response) {
                updateDeferred(request, d);
                d.reject(request, "error");
                error && error(request, "error");
            }
        };

        var request = Y.io(requestOptions.url, requestOptions);
        updateDeferred(request, d);
        return d;

    }

    // Events - The `id` of the `function` to be bound, used as an expando on the `function`
    // so we can lookup it's `remove` object.
    var yuiEventId = 0,
        // Takes a node list, goes through each node
        // and adds events data that has a map of events to
        // `callbackId` to `remove` object.  It looks like
        // `{click: {5: {remove: fn}}}`.
        addBinding = function (nodelist, selector, ev, cb) {
            if (nodelist instanceof Y.NodeList || !nodelist.on || nodelist.getDOMNode) {
                nodelist.each(function (node) {
                    var node = can.$(node);
                    var events = can.data(node, "events"),
                        eventName = ev + ":" + selector;
                    if (!events) {
                        can.data(node, "events", events = {});
                    }
                    if (!events[eventName]) {
                        events[eventName] = {};
                    }
                    if (cb.__bindingsIds === undefined) {
                        cb.__bindingsIds = yuiEventId++;
                    }
                    events[eventName][cb.__bindingsIds] = selector ? node.item(0).delegate(ev, cb, selector) : node.item(0).on(ev, cb);
                });
            } else {
                var obj = nodelist,
                    events = obj.__canEvents = obj.__canEvents || {};
                if (!events[ev]) {
                    events[ev] = {};
                }
                if (cb.__bindingsIds === undefined) {
                    cb.__bindingsIds = yuiEventId++;
                }
                events[ev][cb.__bindingsIds] = obj.on(ev, cb);
            }
        },
        // Removes a binding on a `nodelist` by finding
        // the remove object within the object's data.
        removeBinding = function (nodelist, selector, ev, cb) {
            if (nodelist instanceof Y.NodeList || !nodelist.on || nodelist.getDOMNode) {
                nodelist.each(function (node) {
                    var node = can.$(node),
                        events = can.data(node, "events");
                    if (events) {
                        var eventName = ev + ":" + selector,
                            handlers = events[eventName],
                            handler = handlers[cb.__bindingsIds];
                        handler.detach();
                        delete handlers[cb.__bindingsIds];
                        if (can.isEmptyObject(handlers)) {
                            delete events[ev];
                        }
                        if (can.isEmptyObject(events)) {}
                    }
                });
            } else {
                var obj = nodelist,
                    events = obj.__canEvents || {},
                    handlers = events[ev],
                    handler = handlers[cb.__bindingsIds];
                handler.detach();
                delete handlers[cb.__bindingsIds];
                if (can.isEmptyObject(handlers)) {
                    delete events[ev];
                }
                if (can.isEmptyObject(events)) {}
            }
        }
        can.bind = function (ev, cb) {
            // If we can bind to it...
            if (this.bind && this.bind !== can.bind) {
                this.bind(ev, cb)
            } else if (this.on || this.nodeType) {
                addBinding(can.$(this), undefined, ev, cb)
            } else if (this.addEvent) {
                this.addEvent(ev, cb)
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
            }

            else if (this.on || this.nodeType) {
                removeBinding(can.$(this), undefined, ev, cb);
            } else {
                // Make it bind-able...
                can.removeEvent.call(this, ev, cb)
            }
            return this;
        }
        can.trigger = function (item, event, args, bubble) {
            if (item instanceof Y.NodeList) {
                item = item.item(0);
            }
            if (item.getDOMNode) {
                item = item.getDOMNode();
            }

            if (item.nodeName) {
                item = Y.Node(item);
                if (bubble === false) {
                    // Force stop propagation by listening to `on` and then
                    // immediately disconnecting
                    item.once(event, function (ev) {
                        ev.stopPropagation && ev.stopPropagation();
                        ev.cancelBubble = true;
                        ev._stopper && ev._stopper();
                    })
                }
                realTrigger(item.getDOMNode(), event, {})
            } else {
                if (typeof event === 'string') {
                    event = {
                        type: event
                    }
                }
                event.target = event.target || item
                event.data = args
                can.dispatch.call(item, event)
            }
        };
    // Allow `dom` `destroyed` events.
    Y.mix(Y.Node.DOM_EVENTS, {
        destroyed: true,
        foo: true
    });

    can.delegate = function (selector, ev, cb) {
        if (this.on || this.nodeType) {
            addBinding(can.$(this), selector, ev, cb)
        } else if (this.delegate) {
            this.delegate(selector, ev, cb)
        }
        return this;
    }
    can.undelegate = function (selector, ev, cb) {
        if (this.on || this.nodeType) {
            removeBinding(can.$(this), selector, ev, cb);
        } else if (this.undelegate) {
            this.undelegate(selector, ev, cb)
        }
        return this;
    }

    // `realTrigger` taken from `dojo`.
    var leaveRe = /mouse(enter|leave)/,
        _fix = function (_, p) {
            return "mouse" + (p == "enter" ? "over" : "out");
        },
        realTrigger = document.createEvent ?
        function (n, e, a) {
            // the same branch
            var ev = document.createEvent("HTMLEvents");
            e = e.replace(leaveRe, _fix);
            ev.initEvent(e, true, true);
            a && can.extend(ev, a);
            n.dispatchEvent(ev);
        } : function (n, e, a) {
            // the janktastic branch
            var ev = "on" + e,
                stop = false,
                lc = e.toLowerCase(),
                node = n;
            try {
                // FIXME: is this worth it? for mixed-case native event support:? Opera ends up in the
                // createEvent path above, and also fails on _some_ native-named events.
                // if(lc !== e && d.indexOf(d.NodeList.events, lc) >= 0){
                // // if the event is one of those listed in our NodeList list
                // // in lowercase form but is mixed case, throw to avoid
                // // fireEvent. /me sighs. http://gist.github.com/315318
                // throw("janktastic");
                // }
                n.fireEvent(ev);
            } catch (er) {
                // a lame duck to work with. we're probably a 'custom event'
                var evdata = can.extend({
                    type: e,
                    target: n,
                    faux: true,
                    // HACK: [needs] added support for customStopper to _base/event.js
                    // some tests will fail until del._stopPropagation has support.
                    _stopper: function () {
                        stop = this.cancelBubble;
                    }
                }, a);
                realTriggerHandler(n, e, evdata);

                // handle bubbling of custom events, unless the event was stopped.
                while (!stop && n !== document && n.parentNode) {
                    n = n.parentNode;
                    realTriggerHandler(n, e, evdata);
                    //can.isFunction(n[ev]) && n[ev](evdata);
                }
            }
        },
        realTriggerHandler = function (n, e, evdata) {
            var node = Y.Node(n),
                handlers = can.Y.Event.getListeners(node._yuid, e);
            if (handlers) {
                for (var i = 0; i < handlers.length; i++) {
                    handlers[i].fire(evdata)
                }
            }
        };

    return can;
});