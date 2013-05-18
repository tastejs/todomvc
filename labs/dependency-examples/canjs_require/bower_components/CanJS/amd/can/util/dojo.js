/*!
* CanJS - 1.1.5 (2013-03-27)
* http://canjs.us/
* Copyright (c) 2013 Bitovi
* Licensed MIT
*/
define(['can/util/can', 'dojo', 'can/util/event', 'can/util/fragment', 'can/util/array/each', 'can/util/object/isplain', 'can/util/deferred', '../hashchange'], function (can) {
    define("plugd/trigger", ["dojo"], function (dojo) {

        var d = dojo,
            isfn = d.isFunction,
            leaveRe = /mouse(enter|leave)/,
            _fix = function (_, p) {
                return "mouse" + (p == "enter" ? "over" : "out");
            },
            mix = d._mixin,

            // the guts of the node triggering logic:
            // the function accepts node (not string|node), "on"-less event name,
            // and an object of args to mix into the event. 
            realTrigger = d.doc.createEvent ?
            function (n, e, a) {
                // the sane branch
                var ev = d.doc.createEvent("HTMLEvents");
                e = e.replace(leaveRe, _fix);
                // destroyed events should not bubble
                ev.initEvent(e, e === "destroyed" ? false : true, true);
                a && mix(ev, a);
                n.dispatchEvent(ev);
            } : function (n, e, a) {
                // the janktastic branch
                var ev = "on" + e,
                    stop = false,
                    lc = e.toLowerCase(),
                    node = n;
                try {
                    // FIXME: is this worth it? for mixed-case native event support:? Opera ends up in the
                    //	createEvent path above, and also fails on _some_ native-named events. 
                    //					if(lc !== e && d.indexOf(d.NodeList.events, lc) >= 0){
                    //						// if the event is one of those listed in our NodeList list
                    //						// in lowercase form but is mixed case, throw to avoid
                    //						// fireEvent. /me sighs. http://gist.github.com/315318
                    //						throw("janktastic");
                    //					}
                    n.fireEvent(ev);
                } catch (er) {
                    // a lame duck to work with. we're probably a 'custom event'
                    var evdata = mix({
                        type: e,
                        target: n,
                        faux: true,
                        // HACK: [needs] added support for customStopper to _base/event.js
                        // some tests will fail until del._stopPropagation has support.
                        _stopper: function () {
                            stop = this.cancelBubble;
                        }
                    }, a);

                    isfn(n[ev]) && n[ev](evdata);

                    // handle bubbling of custom events, unless the event was stopped.
                    while (!stop && n !== d.doc && n.parentNode) {
                        n = n.parentNode;
                        isfn(n[ev]) && n[ev](evdata);
                    }
                }
            };

        d._trigger = function (node, event, extraArgs) {
            // summary:
            //		Helper for `dojo.trigger`, which handles the DOM cases. We should never
            //		be here without a domNode reference and a string eventname.
            var n = d.byId(node),
                ev = event && event.slice(0, 2) == "on" ? event.slice(2) : event;
            realTrigger(n, ev, extraArgs);
        };

        d.trigger = function (obj, event, extraArgs) {
            // summary: 
            //		Trigger some event. It can be either a Dom Event, Custom Event, 
            //		or direct function call. 
            // description:
            //		Trigger some event. It can be either a Dom Event, Custom Event, 
            //		or direct function call. NOTE: This function does not trigger
            //		default behavior, only triggers bound event listeneres. eg:
            //		one cannot trigger("anchorNode", "onclick") and expect the browser
            //		to follow the href="" attribute naturally.
            // obj: String|DomNode|Object|Function
            //		An ID, or DomNode reference, from which to trigger the event.
            //		If an Object, fire the `event` in the scope of this object,
            //		similar to calling dojo.hitch(obj, event)(). The return value
            //		in this case is returned from `dojo.trigger`
            // event: String|Function
            //		The name of the event to trigger. can be any DOM level 2 event
            //		and can be in either form: "onclick" or "click" for instance.
            //		In the object-firing case, this method can be a function or
            //		a string version of a member function, just like `dojo.hitch`.
            // extraArgs: Object?
            //		An object to mix into the `event` object passed to any bound 
            //		listeners. Be careful not to override important members, like
            //		`type`, or `preventDefault`. It will likely error.
            //		Additionally, extraArgs is moot in the object-triggering case,
            //		as all arguments beyond the `event` are curried onto the triggered
            //		function.
            // example: 
            //	|	dojo.connect(node, "onclick", function(e){  });
            //	|	// later:
            //	|	dojo.trigger(node, "onclick");
            // example:
            //	|	// or from within dojo.query: (requires dojo.NodeList)
            //	|	dojo.query("a").onclick(function(){}).trigger("onclick");
            // example:
            //	|	// fire obj.method() in scope of obj
            //	|	dojo.trigger(obj, "method");
            // example:
            //	|	// fire an anonymous function:
            //	|	dojo.trigger(d.global, function(){  });
            // example: 
            //	|	// fire and anonymous function in the scope of obj
            //	|	dojo.trigger(obj, function(){ this == obj; });
            // example:
            //	|	// with a connected function like:
            //	|	dojo.connect(dojo.doc, "onclick", function(e){
            //	|		if(e && e.manuallydone){
            //	|			console.log("this was a triggered onclick, not natural");
            //	|		}
            //	|	});
            //	|	// fire onclick, passing in a custom bit of info
            //	|	dojo.trigger("someId", "onclick", { manuallydone:true });
            // returns: Anything
            //		Will not return anything in the Dom event case, but will return whatever
            //		return value is received from the triggered event. 
            return (isfn(obj) || isfn(event) || isfn(obj[event])) ? d.hitch.apply(d, arguments)() : d._trigger.apply(d, arguments);
        };
        d.NodeList.prototype.trigger = d.NodeList._adaptAsForEach(d._trigger);

        // if the node.js module is available, extend trigger into that.
        if (d._Node && !d._Node.prototype.trigger) {
            d.extend(d._Node, {
                trigger: function (ev, data) {
                    // summary:
                    //		Fire some some event originating from this node.
                    //		Only available if both the `dojo.trigger` and `dojo.node` plugin 
                    //		are enabled. Allows chaining as all `dojo._Node` methods do.
                    // ev: String
                    //		Some string event name to fire. eg: "onclick", "submit"
                    // data: Object
                    //		Just like `extraArgs` for `dojo.trigger`, additional data
                    //		to mix into the event object.
                    // example:
                    //	|	// fire onlick orginiating from a node with id="someAnchorId"
                    //	|	dojo.node("someAnchorId").trigger("click");
                    d._trigger(this, ev, data);
                    return this; // dojo._Node
                }
            });
        }

        return d.trigger;

    });

    // dojo.js
    // ---------
    // _dojo node list._
    // These are pre-loaded by `steal` -> no callback.
    require(["dojo", "dojo/query", "plugd/trigger", "dojo/NodeList-dom"]);

    // Map string helpers.
    can.trim = function (s) {
        return s && dojo.trim(s);
    }

    // Map array helpers.
    can.makeArray = function (arr) {
        var array = [];
        dojo.forEach(arr, function (item) {
            array.push(item)
        });
        return array;
    };
    can.isArray = dojo.isArray;
    can.inArray = function (item, arr) {
        return dojo.indexOf(arr, item);
    };
    can.map = function (arr, fn) {
        return dojo.map(can.makeArray(arr || []), fn);
    };
    // Map object helpers.
    can.extend = function (first) {
        if (first === true) {
            var args = can.makeArray(arguments);
            args.shift();
            return dojo.mixin.apply(dojo, args)
        }
        return dojo.mixin.apply(dojo, arguments)
    }
    can.isEmptyObject = function (object) {
        var prop;
        for (prop in object) {
            break;
        }
        return prop === undefined;
    }

    // Use a version of param similar to jQuery's param that
    // handles nested data instead of dojo.objectToQuery which doesn't
    can.param = function (object) {
        var pairs = [],
            add = function (key, value) {
                pairs.push(encodeURIComponent(key) + "=" + encodeURIComponent(value))
            };

        for (var name in object) {
            can.buildParam(name, object[name], add);
        }
        return pairs.join("&").replace(/%20/g, "+");
    }
    can.buildParam = function (prefix, obj, add) {
        if (can.isArray(obj)) {
            for (var i = 0, l = obj.length; i < l; ++i) {
                add(prefix + "[]", obj[i])
            }
        } else if (dojo.isObject(obj)) {
            for (var name in obj) {
                can.buildParam(prefix + "[" + name + "]", obj[name], add);
            }
        } else {
            add(prefix, obj);
        }
    }

    // Map function helpers.
    can.proxy = function (func, context) {
        return dojo.hitch(context, func)
    }
    can.isFunction = function (f) {
        return dojo.isFunction(f);
    }


    // The id of the `function` to be bound, used as an expando on the `function`
    // so we can lookup it's `remove` object.
    var dojoId = 0,
        // Takes a node list, goes through each node
        // and adds events data that has a map of events to 
        // callbackId to `remove` object.  It looks like
        // `{click: {5: {remove: fn}}}`. 
        dojoAddBinding = function (nodelist, ev, cb) {
            nodelist.forEach(function (node) {
                // Converting a raw select node to a node list
                // returns a node list of its options due to a
                // bug in Dojo 1.7.1, this is sovled by wrapping
                // it in an array.
                node = new dojo.NodeList(node.nodeName === "SELECT" ? [node] : node)
                var events = can.data(node, "events");
                if (!events) {
                    can.data(node, "events", events = {})
                }
                if (!events[ev]) {
                    events[ev] = {};
                }
                if (cb.__bindingsIds === undefined) {
                    cb.__bindingsIds = dojoId++;
                }
                events[ev][cb.__bindingsIds] = node.on(ev, cb)[0]
            });
        },
        // Removes a binding on a `nodelist` by finding
        // the remove object within the object's data.
        dojoRemoveBinding = function (nodelist, ev, cb) {
            nodelist.forEach(function (node) {
                var node = new dojo.NodeList(node),
                    events = can.data(node, "events"),
                    handlers = events[ev],
                    handler = handlers[cb.__bindingsIds];

                dojo.disconnect(handler);
                delete handlers[cb.__bindingsIds];

                if (can.isEmptyObject(handlers)) {
                    delete events[ev]
                }
            });
        }

        can.bind = function (ev, cb) {
            // If we can bind to it...
            if (this.bind && this.bind !== can.bind) {
                this.bind(ev, cb)

                // Otherwise it's an element or `nodeList`.
            } else if (this.on || this.nodeType) {
                // Converting a raw select node to a node list
                // returns a node list of its options due to a
                // bug in Dojo 1.7.1, this is sovled by wrapping
                // it in an array.
                dojoAddBinding(new dojo.NodeList(this.nodeName === "SELECT" ? [this] : this), ev, cb)
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
                dojoRemoveBinding(new dojo.NodeList(this), ev, cb);
            } else {
                // Make it bind-able...
                can.removeEvent.call(this, ev, cb)
            }
            return this;
        }

        can.trigger = function (item, event, args, bubble) {
            if ((!(item instanceof dojo.NodeList)) && (item.nodeName || item === window)) {
                item = can.$(item);
            }

            if (item.trigger) {
                if (bubble === false) {
                    if (!item[0] || item[0].nodeType === 3) {
                        return;
                    }
                    // Force stop propagation by
                    // listening to `on` and then immediately disconnecting.
                    var connect = item.on(event, function (ev) {

                        ev.stopPropagation && ev.stopPropagation();
                        ev.cancelBubble = true;
                        ev._stopper && ev._stopper();

                        dojo.disconnect(connect);
                    })
                    item.trigger(event, args)
                } else {
                    item.trigger(event, args)
                }

            } else {
                if (typeof event === 'string') {
                    event = {
                        type: event
                    }
                }
                event.data = args
                event.target = event.target || item;
                can.dispatch.call(item, event)
            }
        }

        can.delegate = function (selector, ev, cb) {
            if (this.on || this.nodeType) {
                dojoAddBinding(new dojo.NodeList(this), selector + ":" + ev, cb)
            } else if (this.delegate) {
                this.delegate(selector, ev, cb)
            }
            return this;
        }
        can.undelegate = function (selector, ev, cb) {
            if (this.on || this.nodeType) {
                dojoRemoveBinding(new dojo.NodeList(this), selector + ":" + ev, cb);
            } else if (this.undelegate) {
                this.undelegate(selector, ev, cb)
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
        var type = can.capitalize((options.type || "get").toLowerCase()),
            method = dojo["xhr" + type];
        var success = options.success,
            error = options.error,
            d = new can.Deferred();

        var def = method({
            url: options.url,
            handleAs: options.dataType,
            sync: !options.async,
            headers: options.headers,
            content: options.data
        })
        def.then(function (data, ioargs) {
            updateDeferred(xhr, d);
            d.resolve(data, "success", xhr);
            success && success(data, "success", xhr);
        }, function (data, ioargs) {
            updateDeferred(xhr, d);
            d.reject(xhr, "error");
            error(xhr, "error");
        })

        var xhr = def.ioArgs.xhr;

        updateDeferred(xhr, d);
        return d;

    }
    // Element - get the wrapped helper.
    can.$ = function (selector) {
        if (selector === window) {
            return window;
        }
        if (typeof selector === "string") {
            return dojo.query(selector)
        } else {
            return new dojo.NodeList(selector);
        }
    }

    can.append = function (wrapped, html) {
        return wrapped.forEach(function (node) {
            dojo.place(html, node)
        });
    }


    var data = {},
        uuid = can.uuid = +new Date(),
        exp = can.expando = 'can' + uuid;

    function getData(node, name) {
        var id = node[exp],
            store = id && data[id];
        return name === undefined ? store || setData(node) : (store && store[name]);
    }

    function setData(node, name, value) {
        var id = node[exp] || (node[exp] = ++uuid),
            store = data[id] || (data[id] = {});
        if (name !== undefined) store[name] = value;
        return store;
    };

    var cleanData = function (elems) {
        can.trigger(new dojo.NodeList(elems), "destroyed", [], false)
        for (var i = 0, elem;
        (elem = elems[i]) !== undefined; i++) {
            var id = elem[exp]
            delete data[id];
        }
    };

    can.data = function (wrapped, name, value) {
        return value === undefined ? wrapped.length == 0 ? undefined : getData(wrapped[0], name) : wrapped.forEach(function (node) {
            setData(node, name, value);
        });
    };

    // Overwrite `dojo.destroy`, `dojo.empty` and `dojo.place`.
    var empty = dojo.empty;
    dojo.empty = function () {
        for (var c; c = node.lastChild;) { // Intentional assignment.
            dojo.destroy(c);
        }
    }

    var destroy = dojo.destroy;
    dojo.destroy = function (node) {
        node = dojo.byId(node);
        cleanData([node]);
        node.getElementsByTagName && cleanData(node.getElementsByTagName('*'))

        return destroy.apply(dojo, arguments);
    };

    can.addClass = function (wrapped, className) {
        return wrapped.addClass(className);
    }

    can.remove = function (wrapped) {
        // We need to remove text nodes ourselves.
        wrapped.forEach(dojo.destroy);
    }

    can.get = function (wrapped, index) {
        return wrapped[index];
    }

    // Add pipe to `dojo.Deferred`.
    can.extend(dojo.Deferred.prototype, {
        pipe: function (done, fail) {
            var d = new dojo.Deferred();
            this.addCallback(function () {
                d.resolve(done.apply(this, arguments));
            });

            this.addErrback(function () {
                if (fail) {
                    d.reject(fail.apply(this, arguments));
                } else {
                    d.reject.apply(d, arguments);
                }
            });
            return d;
        }
    });

    return can;
});