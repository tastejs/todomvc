var Gnd;
(function (Gnd) {
    function overload(map) {
        return function () {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                args[_i] = arguments[_i + 0];
            }
            var key = '';
            if (args.length) {
                if (!_.isUndefined(args[0])) {
                    key += type(args[0]);
                }
                for (var i = 1; i < args.length; i++) {
                    if (!_.isUndefined(args[i])) {
                        key += ' ' + type(args[i]);
                    }
                }
            }

            if (map[key]) {
                return map[key].apply(this, args);
            } else {
                throw new Error("Not matched function signature: " + key);
            }
        };
    }
    Gnd.overload = overload;

    function type(obj) {
        var typeStr;
        if (obj && obj.getName) {
            return obj.getName();
        } else {
            typeStr = Object.prototype.toString.call(obj);
            return typeStr.slice(8, typeStr.length - 1);
        }
    }
})(Gnd || (Gnd = {}));
var Gnd;
(function (Gnd) {
    var EventEmitter = (function () {
        function EventEmitter() {
        }
        EventEmitter.prototype.getListeners = function () {
            this._listeners = this._listeners || {};
            return this._listeners;
        };

        EventEmitter.prototype.getNamespaces = function () {
            this._namespaces = this._namespaces || {};
            return this._namespaces;
        };

        EventEmitter.prototype.on = function (eventNames, listener) {
            var events = eventNames.split(' '), listeners = this.getListeners();

            for (var i = 0, len = events.length; i < len; i++) {
                var eventAndNamespace = events[i].split('/'), event, namespace;

                if (eventAndNamespace.length > 1) {
                    namespace = eventAndNamespace[0];
                    event = eventAndNamespace[1];
                } else {
                    namespace = null;
                    event = eventAndNamespace[0];
                }

                if (listeners[event]) {
                    listeners[event].push(listener);
                } else {
                    listeners[event] = [listener];
                }

                if (namespace) {
                    var namespaces = this.getNamespaces();
                    namespaces[namespace] = namespaces[namespace] || {};
                    if (namespaces[namespace][event]) {
                        namespaces[namespace][event].push(listener);
                    } else {
                        namespaces[namespace][event] = [listener];
                    }
                }

                this.emit('newListener', event, listener);
            }
            return this;
        };

        EventEmitter.prototype.emit = function (eventName) {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 1); _i++) {
                args[_i] = arguments[_i + 1];
            }
            var listeners = this.getListeners();
            if (listeners['*']) {
                this.fireEvent(listeners['*'], args);
            }
            if (listeners[eventName]) {
                this.fireEvent(listeners[eventName], args);
            }
            return this;
        };

        EventEmitter.prototype.off = function (eventNames, listener) {
            if (listener) {
                var events = eventNames.split(' ');

                for (var i = 0, len = events.length; i < len; i++) {
                    if (this._removeListener(events[i], listener)) {
                        break;
                    }
                }
            } else {
                this.removeAllListeners(eventNames);
            }
            return this;
        };

        EventEmitter.prototype.listeners = function (eventName) {
            var listeners = this.getListeners();
            return listeners[eventName] = listeners[eventName] || [];
        };

        EventEmitter.prototype.once = function (eventName, listener) {
            var self = this;

            function wrapper() {
                self.off(eventName, wrapper);
                listener.apply(this, arguments);
            }
            return self.on(eventName, wrapper);
        };

        EventEmitter.prototype.removeAllListeners = function (eventNames) {
            var listeners = this._listeners;

            if (listeners) {
                if (eventNames) {
                    var events = eventNames.split(' ');
                    for (var i = 0, len = events.length; i < len; i++) {
                        this._removeNamespacedEvent(events[i], listeners);
                    }
                } else {
                    delete this._listeners;
                }
            }
            return this;
        };

        EventEmitter.prototype.namespace = function (namespace) {
            var self = this;
            var namespaced = {
                self: self,
                namespace: namespace,
                on: function (event, listener) {
                    this.self.on(this.namespace + '/' + event, listener);
                    return namespaced;
                },
                off: function (event) {
                    var eventName = this.namespace + '/';
                    event && (eventName += event);
                    this.self.off(eventName);
                    return namespaced;
                }
            };
            return namespaced;
        };

        EventEmitter.prototype.fireEvent = function (eventListeners, args) {
            var listeners = [], i, len = eventListeners.length;
            for (i = 0; i < len; i++) {
                listeners[i] = eventListeners[i];
            }
            for (i = 0; i < len; i++) {
                listeners[i].apply(this, args);
            }
        };

        EventEmitter.prototype._removeListener = function (event, listener) {
            var listeners = this._listeners, index;

            if (listeners && listeners[event]) {
                index = _.indexOf(listeners[event], listener);
                if (index !== -1) {
                    listeners[event].splice(index, 1);
                    return true;
                }
            }
            return false;
        };

        EventEmitter.prototype._removeNamespacedEvent = function (event, listeners) {
            var self = this, namespaces = self._namespaces, eventAndNamespace = event.split('/');

            if (eventAndNamespace.length === 1) {
                event = eventAndNamespace[0];
                listeners && delete listeners[event];
                namespaces && delete namespaces[event];
            } else if (namespaces) {
                var namespace = eventAndNamespace[0];
                event = eventAndNamespace[1];

                if (namespaces[namespace]) {
                    var _listeners;
                    if (event === '') {
                        var events = namespaces[namespace];

                        _.each(events, function (listeners, event) {
                            for (var i = 0, len = listeners.length; i < len; i++) {
                                self._removeListener(event, listeners[i]);
                            }
                        });
                    } else {
                        _listeners = _.union(_listeners, namespaces[namespace][event]);
                        if (_listeners) {
                            for (var i = 0, len = listeners.length; i < len; i++) {
                                this._removeListener(event, _listeners[i]);
                            }
                        }
                    }
                }
            }
        };
        return EventEmitter;
    })();
    Gnd.EventEmitter = EventEmitter;

    EventEmitter.prototype.addListener = EventEmitter.prototype.on;
    EventEmitter.prototype.addObserver = EventEmitter.prototype.on;
    EventEmitter.prototype.removeListener = EventEmitter.prototype.off;
    EventEmitter.prototype.removeObserver = EventEmitter.prototype.off;
})(Gnd || (Gnd = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Gnd;
(function (Gnd) {
    var UndoManager = (function (_super) {
        __extends(UndoManager, _super);
        function UndoManager() {
            _super.apply(this, arguments);
            this.undones = [];
            this.actions = [];
            this.undoFn = null;
            this.group = null;
        }
        UndoManager.prototype.beginUndo = function (undoFn, name) {
            this.undoFn = undoFn;
            this.name = name;
        };

        UndoManager.prototype.endUndo = function (doFn, fn) {
            this.action(doFn, this.undoFn, fn, this.name);
            this.undoFn = null;
        };

        UndoManager.prototype.action = function (doFn, undoFn, fn, name) {
            this.undones.length = 0;
            name = _.isString(fn) ? fn : name;
            var action = { 'do': doFn, undo: undoFn, fn: fn, name: name };
            if (this.group) {
                this.actions.push(action);
            } else {
                this.group.push(action);
            }
            doFn(fn);
        };

        UndoManager.prototype.beginGroup = function (name) {
            this.group = { name: name, actions: [] };
        };

        UndoManager.prototype.endGroup = function () {
            ;
            ((function (group) {
                this.action(function () {
                    for (var i = 0, len = group.length; i < len; i++) {
                        group[i].action['do'](group[i].action.fn);
                    }
                }, function () {
                    for (var i = 0, len = group.length; i < len; i++) {
                        group[i].action.undo(group[i].action.fn);
                    }
                }, function () {
                }, group.name);
            })(this.group));

            this.group = null;
        };

        UndoManager.prototype.canUndo = function () {
            return this.actions.length > 0;
        };

        UndoManager.prototype.canRedo = function () {
            return this.undones.length > 0;
        };

        UndoManager.prototype.undo = function () {
            var action = this.actions.pop();
            if (action) {
                action.undo(action.fn);
                var name = action.name || '';
                this.emit('undo', name);
                this.undones.push(action);
            }
        };

        UndoManager.prototype.redo = function () {
            var action = this.undones.pop();
            if (action) {
                action['do'](action.fn);
                var name = action.name || '';
                this.emit('redo', name);
                this.actions.push(action);
            }
        };
        return UndoManager;
    })(Gnd.EventEmitter);
    Gnd.UndoManager = UndoManager;
})(Gnd || (Gnd = {}));
var Gnd;
(function (Gnd) {
    "use strict";

    var Base = (function (_super) {
        __extends(Base, _super);
        function Base() {
            _super.call(this);
            this._refCounter = 1;
            this._bindings = {};
            this._undoMgr = new Gnd.UndoManager();
            if (!(this instanceof Base)) {
                return new Base();
            }
        }
        Base.retain = function (objs) {
            var items = _.isArray(objs) ? objs : arguments;
            _.each(items, function (obj) {
                obj && obj.retain();
            });
        };

        Base.release = function (objs) {
            var items = _.isArray(objs) ? objs : arguments;
            _.each(items, function (obj) {
                obj && obj.release();
            });
        };

        Base.prototype.set = function (keyOrObj, val, options) {
            var _this = this;
            var changed = false, obj, eventCage = [];

            if (typeof keyOrObj == 'object') {
                options = val || {};
                obj = keyOrObj;
                _.each(obj, function (val, key) {
                    changed = _this._set(key, val, options, eventCage) ? true : changed;
                });
            } else {
                options = options || {};
                changed = this._set(keyOrObj, val, options, eventCage);
            }

            if (changed) {
                if (!obj) {
                    obj = {};
                    obj[keyOrObj] = val;
                }

                _.each(eventCage, function (emitter) {
                    return emitter();
                });

                this.emit('changed:', obj, options);
            }
            return this;
        };

        Base.prototype.getProperty = function (keypath) {
            var path = keypath.split('.');
            var level = this;
            _.each(path, function (key) {
                if (_.isUndefined(level))
                    return;
                level = level[key];
            });

            return level;
        };

        Base.prototype.setProperty = function (keypath, val) {
            Gnd.Util.expandProperty(this, keypath, val);
        };

        Base.prototype._set = function (keypath, val, options, eventCage) {
            var _this = this;
            var oldProp = this.getProperty(keypath);
            var isVirtual = Gnd.Util.isVirtualProperty(oldProp);
            var oldVal = isVirtual ? oldProp.call(this) : oldProp;

            if (!_.isEqual(oldVal, val) || options.force) {
                var val = this.willChange ? this.willChange(keypath, val) : val;

                if (isVirtual)
                    options.nosync = true;

                this.setProperty(keypath, val);

                eventCage.push(function () {
                    return _this.emit(keypath, val, oldVal, options);
                });
                return true;
            } else {
                return false;
            }
        };

        Base.prototype.willChange = function (keypath, val) {
            return val;
        };

        Base.prototype.get = function (key) {
            var path = key.split('.'), result = this, len = path.length;

            if (!len)
                return;

            for (var i = 0; i < len; i++) {
                result = result[path[i]];
                result = _.isFunction(result) ? result.call(this) : result;
                if (!_.isObject(result))
                    break;
            }

            return result;
        };

        Base.prototype.bind = function (key, object, objectKey) {
            var dstKey = objectKey || key;

            this.unbind(key);

            var dstListener = _.bind(object.set, object, dstKey);
            this.on(key, dstListener);

            var srcListener = _.bind(this.set, this, key);
            object.on(dstKey, srcListener);

            this._bindings[key] = [dstListener, object, dstKey, srcListener];

            this.set(key, object[dstKey]);

            return this;
        };

        Base.prototype.unbind = function (key) {
            var bindings = this._bindings;
            if ((bindings != null) && (bindings[key])) {
                var binding = bindings[key];
                this.removeListener(key, binding[0]);
                binding[1].removeListener(binding[2], binding[3]);
                delete bindings[key];
            }
        };

        Base.prototype.beginUndoSet = function (key) {
            var base = this;
            ((function (value) {
                this.undoMgr.beginUndo(function () {
                    base.set(key, value);
                }, name);
            })(this[key]));
        };

        Base.prototype.endUndoSet = function (key) {
            var base = this;
            ((function (value) {
                this.undoMgr.endUndo(function () {
                    base.set(key, value);
                });
            })(this[key]));
        };

        Base.prototype.undoSet = function (key, value, fn) {
            this.beginUndoSet(key);
            this.set(key, value);
            this.endUndoSet(key);
        };

        Base.prototype.destroy = function () {
            this.emit('destroy:');
            this._destroyed = true;
            this._destroyedTrace = "";
            this.off();
        };

        Base.prototype.retain = function () {
            if (this._destroyed) {
                throw Error("Cannot retain destroyed object");
            }
            this._refCounter++;
            return this;
        };

        Base.prototype.release = function () {
            this._refCounter--;
            if (this._refCounter === 0) {
                this.destroy();
            } else if (this._refCounter < 0) {
                var msg;
                if (this._destroyed) {
                    msg = "Object has already been released";
                    if (this._destroyedTrace) {
                        msg += '\n' + this._destroyedTrace;
                    }
                    throw Error(msg);
                } else {
                    msg = "Invalid reference count!";
                }
                throw Error(msg);
            }
            return this;
        };

        Base.prototype.autorelease = function () {
            var _this = this;
            Gnd.Util.nextTick(function () {
                return _this.release();
            });
            return this;
        };

        Base.prototype.isDestroyed = function () {
            return this._refCounter === 0;
        };
        return Base;
    })(Gnd.EventEmitter);
    Gnd.Base = Base;
})(Gnd || (Gnd = {}));
var Gnd;
(function (Gnd) {
    (function (Util) {
        function noop() {
        }
        Util.noop = noop;
        ;

        function assert(cond, msg) {
            !cond && console.log('Assert failed:%s', msg);
        }
        Util.assert = assert;
        ;

        function uuid(a, b) {
            for (b = a = ''; a++ < 36; b += a * 51 & 52 ? (a ^ 15 ? 8 ^ Math.random() * (a ^ 20 ? 16 : 4) : 4).toString(16) : '-')
                ;
            return 'cid-' + b;
        }
        Util.uuid = uuid;
        ;

        function adler32(s) {
            for (var b = 65521, c = 1, d = 0, e = 0, f; f = s.charCodeAt(e++); d = (d + c) % b) {
                c = (c + f) % b;
            }
            return (d << 16) | c;
        }
        Util.adler32 = adler32;

        function refresh() {
            window.location.replace('');
        }
        Util.refresh = refresh;
        ;

        function retain(objs) {
            var items = _.isArray(objs) ? objs : arguments;
            _.each(items, function (obj) {
                obj && obj.retain();
            });
        }
        Util.retain = retain;
        ;

        function release(objs) {
            var items = _.isArray(objs) ? objs : arguments;
            _.each(items, function (obj) {
                obj && obj.release();
            });
        }
        Util.release = release;
        ;

        Util.nextTick = noop;
        if ((typeof process !== 'undefined') && (process.nextTick)) {
            Util.nextTick = process.nextTick;
        } else {
            Util.nextTick = function (fn) {
                return setTimeout(fn, 0);
            };
        }

        function trim(str, maxLen, suffix) {
            str = str.replace(/^\s+|\s+$/g, '');
            if (str && maxLen && str.length > maxLen) {
                var suffixLen = 0;
                if (suffix)
                    suffixLen = suffix.length;
                str = str.substr(0, maxLen - suffixLen) + suffix;
            }
            return str;
        }
        Util.trim = trim;
        ;

        function asyncDebounce(fn) {
            fn = fn || noop;
            var delayedFunc = null, executing = null;

            return function debounced() {
                var context = this, args = arguments, nargs = args.length, cb = args[nargs - 1], delayed = function () {
                    executing = fn;
                    fn.apply(context, args);
                };

                args[nargs - 1] = function () {
                    cb.apply(context, arguments);
                    executing = null;
                    if (delayedFunc) {
                        var f = delayedFunc;
                        delayedFunc = null;
                        f();
                    }
                };

                if (executing) {
                    delayedFunc = delayed;
                } else {
                    delayed();
                }
            };
        }
        Util.asyncDebounce = asyncDebounce;
        ;

        function searchFilter(obj, search, fields) {
            if (search) {
                var result = false;
                search = search.toLowerCase();
                for (var i = 0, len = fields.length; i < len; i++) {
                    if (String(obj[fields[i]]).toLowerCase().indexOf(search) != -1) {
                        result = true;
                    }
                }
                return result;
            } else {
                return true;
            }
        }
        Util.searchFilter = searchFilter;
        ;

        function asyncForEach(array, fn, cb) {
            var completed = 0;

            function iter(item, len) {
                fn(item, function (err) {
                    if (err) {
                        cb && cb(err);
                        cb = noop;
                    } else {
                        completed++;
                        if (completed === len) {
                            cb && cb(null);
                        }
                    }
                });
            }

            if (_.isArray(array)) {
                if (array.length === 0) {
                    cb && cb(null);
                } else {
                    for (var i = 0, len = array.length; i < len; i++) {
                        iter(array[i], len);
                    }
                }
            } else {
                iter(array, 1);
            }
        }
        Util.asyncForEach = asyncForEach;
        ;

        function asyncForEachSeries(arr, fn, cb) {
            cb = cb || noop;
            if (!arr.length) {
                return cb();
            }
            var completed = 0;
            function iterate() {
                fn(arr[completed], function (err) {
                    if (err) {
                        cb(err);
                        cb = noop;
                    } else {
                        completed++;
                        if (completed < arr.length) {
                            iterate();
                        } else {
                            cb();
                        }
                    }
                });
            }
            ;
            iterate();
        }
        Util.asyncForEachSeries = asyncForEachSeries;

        function inherits(ctor, superCtor) {
            ctor._super = superCtor;
            if (Object.create) {
                ctor.prototype = Object.create(superCtor.prototype);
            } else {
                function F() {
                }
                F.prototype = superCtor;
                ctor.prototype = new F();
            }
        }
        Util.inherits = inherits;
        ;

        function extend(parent, subclass) {
            var methods;
            var d = function Derived() {
                parent.apply(this, arguments);
            };

            if (subclass) {
                methods = subclass(parent.prototype);
                d = methods.constructor;
            }

            inherits(d, parent);

            _.extend(d.prototype, methods);

            return d;
        }
        Util.extend = extend;

        function expand(args) {
            var obj = {};
            var keys = _.keys(args);
            _.each(keys, function (key) {
                expandProperty(obj, key, args[key]);
            });
            return obj;
        }
        Util.expand = expand;

        function expandProperty(obj, keyPath, value) {
            var path = keyPath.split('.');
            var branch = _.reduceRight(path, function (memo, level) {
                var tmp = {};
                tmp[level] = memo;
                return tmp;
            }, value);
            deepExtend(obj, branch);
            return obj;
        }
        Util.expandProperty = expandProperty;

        function deepExtend(doc, args, callFns) {
            var keys = _.keys(args);
            _.each(keys, function (key) {
                if (isVirtualProperty(doc[key])) {
                    doc[key](args[key]);
                } else {
                    if (doc[key] && args[key] && args[key].constructor === Object.prototype['constructor']) {
                        deepExtend(doc[key], args[key]);
                    } else {
                        doc[key] = args[key];
                    }
                }
            });
            return doc;
        }

        function merge(doc, args) {
            return deepExtend(doc, expand(args));
        }
        Util.merge = merge;

        function extendClone(a, b) {
            return _.extend(_.clone(a), b);
        }
        Util.extendClone = extendClone;

        function isVirtualProperty(prop) {
            return !!(prop && _.isFunction(prop) && prop.isVirtual);
        }
        Util.isVirtualProperty = isVirtualProperty;

        var handlerQueue = [];

        function enqueue(task) {
            if (handlerQueue.push(task) === 1) {
                Util.nextTick(drainQueue);
            }
        }
        Util.enqueue = enqueue;

        function drainQueue() {
            var task, i = 0;

            while (task = handlerQueue[i++]) {
                task();
            }

            handlerQueue = [];
        }
        Util.drainQueue = drainQueue;
    })(Gnd.Util || (Gnd.Util = {}));
    var Util = Gnd.Util;
})(Gnd || (Gnd = {}));
var Gnd;
(function (Gnd) {
    var Timer = (function (_super) {
        __extends(Timer, _super);
        function Timer(resolution) {
            _super.call(this);

            this.time = 0;
            this.timer = null;
            this.resolution = resolution;
        }
        Timer.prototype.destroy = function () {
            this.stop();
            _super.prototype.destroy.call(this);
        };

        Timer.prototype.start = function (duration) {
            clearTimeout(this.timer);
            if (duration) {
                this.duration = duration;
                this.baseline = Date.now();
            }
            this.duration && this.iter();
        };

        Timer.prototype.isRunning = function () {
            return (this.timer !== null);
        };

        Timer.prototype.stop = function () {
            clearTimeout(this.timer);
            this.timer = null;
            this.emit('stopped:', this.baseline);
        };

        Timer.prototype.iter = function () {
            var _this = this;
            var error = Date.now() - this.baseline;

            if (this.time >= this.duration) {
                this.stop();
                this.emit('ended:', this.baseline);
            } else {
                var nextTick = this.resolution - error;
                this.timer = setTimeout(function () {
                    _this.set('time', _this.time + _this.resolution);
                    _this.baseline += _this.resolution;
                    _this.iter();
                }, nextTick >= 0 ? nextTick : 0);
            }
        };
        return Timer;
    })(Gnd.Base);
    Gnd.Timer = Timer;
})(Gnd || (Gnd = {}));
var Gnd;
(function (Gnd) {
    "use strict";

    function isPromise(promise) {
        return (promise instanceof Object) && (promise.then instanceof Function);
    }

    var CancelError = Error('Operation Cancelled');

    var Promise = (function (_super) {
        __extends(Promise, _super);
        function Promise(value) {
            _super.call(this);
            this.fulfilledFns = [];
            this.rejectedFns = [];

            if (value instanceof Error) {
                this.reject(value);
            } else if (value) {
                this.resolve(value);
            }
        }
        Promise.map = function (elements, fn) {
            elements = _.isArray(elements) ? elements : [elements];

            var len = elements.length, counter = len, promise = new Promise(), results = [];
            results.length = len;

            if (!len) {
                promise.resolve(results);
            }

            for (var i = 0; i < len; i++) {
                (function (index) {
                    fn(elements[index]).then(function (result) {
                        results[index] = result;
                        counter--;
                        if (counter === 0) {
                            promise.resolve(results);
                        }
                    }, function (err) {
                        return promise.reject(err);
                    });
                })(i);
            }

            return promise;
        };

        Promise.delay = function (ms) {
            var promise = new Promise();
            var timeout = setTimeout(function () {
                return promise.resolve();
            }, ms);
            promise.fail(function () {
                return clearTimeout(timeout);
            });
            return promise;
        };

        Promise.debounce = function (task) {
            var delayed, executing;

            var execute = function () {
                executing = delayed();
                delayed = null;
                executing.ensure(function () {
                    executing = null;
                    delayed && execute();
                });
            };

            return function () {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    args[_i] = arguments[_i + 0];
                }
                var _this = this;
                delayed = function () {
                    return task.apply(_this, args);
                };
                !executing && execute();
            };
        };

        Promise.delayed = function (task, start, end, delay) {
            var waiting;

            var timer = setTimeout(function () {
                waiting = true;
                start();
            }, delay);

            return task.then(function (value) {
                clearTimeout(timer);
                waiting && end();
            });
        };

        Promise.resolved = function (value) {
            return (new Promise()).resolve(value);
        };

        Promise.rejected = function (err) {
            return new Promise(err);
        };

        Promise.prototype.then = function (onFulfilled, onRejected) {
            var promise = new Promise();

            var wrapper = function (fn, reject) {
                if (!(fn instanceof Function)) {
                    fn = function (value) {
                        if (reject)
                            throw (value);
                        return value;
                    };
                }
                return function (value) {
                    try  {
                        var result = fn(value);
                        if (isPromise(result)) {
                            result.then(function (val) {
                                promise.resolve(val);
                            }, function (err) {
                                promise.reject(err);
                            });
                        } else {
                            promise.resolve(result);
                        }
                    } catch (err) {
                        promise.reject(err);
                        if (err !== CancelError) {
                            console.log(err.stack);
                        }
                    }
                };
            };

            if (!_.isUndefined(this._value)) {
                this.fire(wrapper(onFulfilled), this._value);
            } else if (!_.isUndefined(this.reason)) {
                this.fire(wrapper(onRejected, true), this.reason);
            } else {
                this.fulfilledFns.push(wrapper(onFulfilled));
                this.rejectedFns.push(wrapper(onRejected, true));
            }

            return promise;
        };

        Promise.prototype.fail = function (onRejected) {
            return this.then(null, onRejected || function () {
            });
        };

        Promise.prototype.resolveOrReject = function (err, value) {
            if (err)
                this.reject(err); else
                this.resolve(value);
        };

        Promise.prototype.ensure = function (always) {
            var alwaysOnSuccess = function (result) {
                always();
                return result;
            };

            var alwaysOnFailure = function (err) {
                always();
                throw err;
            };

            return this.then(alwaysOnSuccess, alwaysOnFailure);
        };

        Promise.prototype.resolve = function (value) {
            if (this.isFulfilled)
                return;
            this.abort();

            this._value = value || null;
            this.fireCallbacks(this.fulfilledFns, value);
            return this;
        };

        Promise.prototype.reject = function (reason) {
            if (this.isFulfilled)
                return;
            this.abort();

            this.reason = reason || null;
            this.fireCallbacks(this.rejectedFns, reason);
            return this;
        };

        Promise.prototype.cancel = function () {
            return this.reject(CancelError);
        };

        Promise.prototype.abort = function () {
            this.isFulfilled = true;
        };

        Promise.prototype.fireNext = function (cb, value) {
            var _this = this;
            var stack = (new Error())['stack'];

            Gnd.Util.enqueue(function () {
                return cb.call(_this, value);
            });
        };

        Promise.prototype.fire = function (cb, value) {
            return cb.call(this, value);
        };

        Promise.prototype.fireCallbacks = function (callbacks, value) {
            var len = callbacks.length;
            for (var i = 0; i < len; i++) {
                this.fire(callbacks[i], value);
            }
        };
        return Promise;
    })(Gnd.Base);
    Gnd.Promise = Promise;

    Promise.prototype['otherwise'] = Promise.prototype.fail;
})(Gnd || (Gnd = {}));
var Gnd;
(function (Gnd) {
    var TaskQueue = (function () {
        function TaskQueue() {
            this.tasks = [];
            this.endPromise = new Gnd.Promise();
        }
        TaskQueue.prototype.append = function () {
            var tasks = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                tasks[_i] = arguments[_i + 0];
            }
            if (this.isEnded) {
                throw new Error("TaskQueue already ended");
            }
            this.tasks.push.apply(this.tasks, _.compact(tasks));
            this.executeTasks();
            return this;
        };

        TaskQueue.prototype.cancel = function () {
            this.isCancelled = true;
        };

        TaskQueue.prototype.end = function () {
            this.isEnded = true;
            if (!this.isExecuting) {
                this.endPromise.resolve();
            }
            return this;
        };

        TaskQueue.prototype.wait = function (cb) {
            this.endPromise.then(cb);
        };

        TaskQueue.prototype.executeTasks = function () {
            var _this = this;
            if (this.tasks.length > 0 && !this.isCancelled && !this.isExecuting) {
                this.isExecuting = true;

                var fn = this.tasks.splice(0, 1)[0];
                fn(function () {
                    _this.isExecuting = false;
                    _this.executeTasks();
                });
            } else if (this.isEnded || this.isCancelled) {
                this.endPromise.resolve();
            }
        };
        return TaskQueue;
    })();
    Gnd.TaskQueue = TaskQueue;
})(Gnd || (Gnd = {}));
var Index = (function () {
    function Index() {
        this.tail = {
            prev: 0,
            next: 0,
            key: ''
        };
        this.index = [this.tail];
        this.first = this.last = 0;
        this.unusedKeys = [];
    }
    Index.prototype.newIdx = function () {
        if (this.unusedKeys.length > 0) {
            return this.unusedKeys.pop();
        } else {
            return this.index.length;
        }
    };

    Index.prototype.addKey = function (key) {
        var elem = {
            prev: this.last,
            next: this.first,
            key: key
        };

        var idx = this.newIdx();
        this.index[idx] = elem;

        var firstElem = this.index[this.first];
        var lastElem = this.index[this.last];

        firstElem.prev = idx;
        lastElem.next = idx;

        this.first = idx;
        return idx;
    };

    Index.prototype.touch = function (idx) {
        var key = this.remove(idx);
        return this.addKey(key);
    };

    Index.prototype.remove = function (idx) {
        if (idx === 0)
            return null;

        var elem = this.index[idx];
        var nextElem = this.index[elem.next];
        var prevElem = this.index[elem.prev];

        nextElem.prev = elem.prev;
        prevElem.next = elem.next;

        if (idx === this.first) {
            this.first = elem.next;
        } else if (idx === this.last) {
            this.last = elem.prev;
        }

        this.unusedKeys.push(idx);

        return elem.key;
    };

    Index.prototype.getLast = function () {
        if (this.first === this.last) {
            return null;
        } else {
            return this.index[this.tail.prev].key;
        }
    };
    return Index;
})();

var Gnd;
(function (Gnd) {
    var Cache = (function (_super) {
        __extends(Cache, _super);
        function Cache(maxSize) {
            _super.call(this);
            this.size = 0;
            this.length = 0;
            this.maxSize = maxSize || 5 * 1024 * 1024;
            this.populate();
        }
        Cache.prototype.each = function (cb) {
            var result;
            for (var key in this.map) {
                result = cb(key);
                if (result)
                    return result;
            }
        };

        Cache.prototype.getKeys = function () {
            return _.keys(this.map);
        };

        Cache.prototype.serialize = function (time, value) {
            return time + '|' + value;
        };

        Cache.prototype.deserialize = function (str) {
            var i;
            if (_.isString(str)) {
                i = str.indexOf('|');
                if (i > -1) {
                    return {
                        time: +str.slice(0, i),
                        value: str.slice(i + 1)
                    };
                }
            }
            return {
                time: -1,
                value: undefined
            };
        };

        Cache.prototype.getItem = function (key) {
            var old = this.map[key], tVal, value;
            if (old) {
                tVal = this.deserialize(localStorage[key]);
                value = tVal.value;
                value && this.setItem(key, value);
            }
            return value;
        };

        Cache.prototype.setItem = function (key, value) {
            var time = Date.now();
            var old = this.map[key];
            value = String(value);
            var requested = value.length;
            var idx;

            if (old) {
                requested -= old.size;
            }
            if (this.makeRoom(requested)) {
                this.size += requested;

                localStorage[key] = this.serialize(time, value);

                if (old) {
                    idx = old.idx;
                    this.index.touch(idx);
                } else {
                    this.length++;
                    idx = this.index.addKey(key);
                }
                this.map[key] = {
                    size: value.length,
                    idx: idx
                };
            }
        };

        Cache.prototype.removeItem = function (key) {
            var item = this.map[key];
            if (item) {
                this.remove(key);
                this.size -= item.size;
                delete this.map[key];
                this.length--;

                this.index.remove(item.idx);
            }
        };

        Cache.prototype.clear = function () {
            for (var key in this.map) {
                this.removeItem(key);
            }
            this.length = 0;
            this.size = 0;
        };

        Cache.prototype.setMaxSize = function (size) {
            this.maxSize = size;
        };

        Cache.prototype.remove = function (key) {
            delete localStorage[key];
        };

        Cache.prototype.populate = function () {
            var ls = localStorage;
            var that = this;
            var i, len, key, tVal, size, list = [];
            this.size = 0;
            this.map = {};
            this.index = new Index();
            for (i = 0, len = ls.length; i < len; i++) {
                key = ls.key(i);
                tVal = this.deserialize(ls[key]);
                if (tVal.value) {
                    size = tVal.value.length;
                    list.push({
                        time: tVal.time,
                        key: key
                    });

                    this.map[key] = {
                        size: size
                    };
                    this.size += size;
                }
            }

            var sorted = _.sortBy(list, function (item) {
                return item.time;
            });

            _.each(sorted, function (elem) {
                var idx = that.index.addKey(elem.key);
                that.map[elem.key].idx = idx;
            });

            this.length = _.size(this.map);
        };

        Cache.prototype.makeRoom = function (size) {
            var target = this.maxSize - size;
            var last;
            if (this.size > target) {
                if (target < 0) {
                    return false;
                } else {
                    last = this.index.getLast();
                    while (this.size > target) {
                        if (last === null)
                            return false;
                        this.removeItem(last);
                        last = this.index.getLast();
                    }
                }
            }
            return true;
        };
        return Cache;
    })(Gnd.Base);
    Gnd.Cache = Cache;
})(Gnd || (Gnd = {}));
var Gnd;
(function (Gnd) {
    (function (ServerError) {
        ServerError[ServerError["INVALID_SESSION"] = 1] = "INVALID_SESSION";
        ServerError[ServerError["INVALID_ID"] = 2] = "INVALID_ID";
        ServerError[ServerError["MODEL_NOT_FOUND"] = 3] = "MODEL_NOT_FOUND";
        ServerError[ServerError["DOCUMENT_NOT_FOUND"] = 4] = "DOCUMENT_NOT_FOUND";
        ServerError[ServerError["STORAGE_ERROR"] = 5] = "STORAGE_ERROR";
        ServerError[ServerError["MISSING_RIGHTS"] = 6] = "MISSING_RIGHTS";
        ServerError[ServerError["NO_CONNECTION"] = 7] = "NO_CONNECTION";

        ServerError[ServerError["INTERNAL_ERROR"] = 8] = "INTERNAL_ERROR";
    })(Gnd.ServerError || (Gnd.ServerError = {}));
    var ServerError = Gnd.ServerError;
    ;
})(Gnd || (Gnd = {}));
var Gnd;
(function (Gnd) {
    var prependTimestamp = function (args) {
        return args.splice(0, 0, '[' + +new Date() + ']');
    };

    function log() {
        var args = [];
        for (var _i = 0; _i < (arguments.length - 0); _i++) {
            args[_i] = arguments[_i + 0];
        }
        prependTimestamp(args);
        Gnd['debug'] && console.log.apply(console, args);
    }
    Gnd.log = log;
})(Gnd || (Gnd = {}));
var Gnd;
(function (Gnd) {
    (function (Storage) {
        (function (Store) {
            var LocalStore = (function () {
                function LocalStore() {
                    this.localCache = new Gnd.Cache(1024 * 1024);
                }
                LocalStore.prototype.get = function (key) {
                    var doc = this.localCache.getItem(key);
                    if (doc) {
                        return JSON.parse(doc);
                    }
                    return null;
                };
                LocalStore.prototype.put = function (key, doc) {
                    this.localCache.setItem(key, JSON.stringify(doc));
                };
                LocalStore.prototype.del = function (key) {
                    this.localCache.removeItem(key);
                };
                LocalStore.prototype.allKeys = function () {
                    return this.localCache.getKeys();
                };
                return LocalStore;
            })();
            Store.LocalStore = LocalStore;
        })(Storage.Store || (Storage.Store = {}));
        var Store = Storage.Store;
    })(Gnd.Storage || (Gnd.Storage = {}));
    var Storage = Gnd.Storage;
})(Gnd || (Gnd = {}));
var Gnd;
(function (Gnd) {
    (function (Storage) {
        var InvalidKeyError = function () {
            return Error('Invalid Key');
        };

        var Local = (function () {
            function Local(store) {
                this.store = store || new Gnd.Storage.Store.LocalStore();
            }
            Local.prototype.contextualizeIds = function (keyPath, itemIds) {
                var _this = this;
                var baseItemPath = this.makeKey(keyPath);
                return _.map(itemIds, function (id) {
                    return _this.makeKey([baseItemPath, id]);
                });
            };

            Local.prototype.makeKey = function (keyPath) {
                return keyPath.join('@');
            };

            Local.prototype.parseKey = function (key) {
                return key.split('@');
            };

            Local.prototype.isLink = function (doc) {
                return _.isString(doc);
            };

            Local.prototype.isCollectionLink = function (doc) {
                return doc[0] === '/' && doc[doc.length - 1] === '/';
            };
            Local.prototype.createCollectionLink = function (collection) {
                var link = '/^' + collection + '@[^@]+$/';
                this.store.put(collection, link);
            };

            Local.prototype.traverseLinks = function (key, fn) {
                var _this = this;
                var value = this.store.get(key);
                if (value) {
                    fn && fn(key);
                    if (this.isLink(value)) {
                        if (this.isCollectionLink(value)) {
                            var regex = new RegExp(value.slice(1, value.length - 1));
                            var allKeys = this.store.allKeys();

                            var keys = _.filter(allKeys, function (key) {
                                if (key.match(regex)) {
                                    var value = _this.store.get(key);
                                    return !_this.isLink(value);
                                }
                                return false;
                            });
                            return {
                                key: key,
                                value: _.reduce(keys, function (memo, key) {
                                    memo[key] = 'insync';
                                    return memo;
                                }, {})
                            };
                        } else {
                            return this.traverseLinks(value);
                        }
                    } else {
                        return { key: key, value: value };
                    }
                }
            };

            Local.prototype.create = function (keyPath, doc) {
                var promise = new Gnd.Promise();
                if (!doc._cid) {
                    doc._cid = Gnd.Util.uuid();
                }
                this.createCollectionLink(keyPath[0]);
                this.store.put(this.makeKey(keyPath.concat(doc._cid)), doc);

                return promise.resolve(doc._cid);
            };

            Local.prototype.fetch = function (keyPath) {
                var promise = new Gnd.Promise();
                var keyValue = this.traverseLinks(this.makeKey(keyPath));
                if (keyValue) {
                    promise.resolve(keyValue.value);
                } else {
                    promise.reject(InvalidKeyError());
                }
                return promise;
            };

            Local.prototype.put = function (keyPath, doc, opts) {
                var key = this.makeKey(keyPath), keyValue = this.traverseLinks(this.makeKey(keyPath));

                if (keyValue) {
                    this.store.put(keyValue.key, Gnd.Util.merge(keyValue.value, doc));
                } else {
                    this.store.put(key, doc);
                }
                return Gnd.Promise.resolved();
            };

            Local.prototype.del = function (keyPath) {
                var _this = this;
                this.traverseLinks(this.makeKey(keyPath), function (key) {
                    _this.store.del(_this.makeKey(keyPath));
                });
                return new Gnd.Promise(true);
            };

            Local.prototype.link = function (newKeyPath, oldKeyPath) {
                var oldKey = this.makeKey(oldKeyPath);
                var newKey = this.makeKey(newKeyPath);

                var keys = this.store.allKeys();
                for (var i = 0; i < keys.length; i++) {
                    if (keys[i].substring(0, oldKey.length) === oldKey) {
                        var link = keys[i].replace(oldKey, newKey);
                        this.store.put(link, keys[i]);
                    }
                }
                return new Gnd.Promise(true);
            };

            Local.prototype.add = function (keyPath, itemsKeyPath, itemIds, opts) {
                var key = this.makeKey(keyPath), itemIdsKeys = this.contextualizeIds(itemsKeyPath, itemIds), keyValue = this.traverseLinks(key), oldItemIdsKeys = keyValue ? keyValue.value || {} : {}, newIdKeys = {};

                if (keyPath.length === 1 && itemsKeyPath.length === 1) {
                    return Gnd.Promise.resolved();
                }

                key = keyValue ? keyValue.key : key;
                _.each(itemIdsKeys, function (id) {
                    newIdKeys[id] = opts.insync ? 'insync' : 'add';
                });
                this.store.put(key, _.extend(oldItemIdsKeys, newIdKeys));

                return Gnd.Promise.resolved();
            };

            Local.prototype.remove = function (keyPath, itemsKeyPath, itemIds, opts) {
                var _this = this;
                var key = this.makeKey(keyPath), itemIdsKeys = this.contextualizeIds(itemsKeyPath, itemIds), keyValue = this.traverseLinks(key);

                if (itemIds.length === 0)
                    return Gnd.Promise.resolved();

                if (keyValue) {
                    var keysToDelete = keyValue.value;
                    _.each(itemIdsKeys, function (id) {
                        _this.traverseLinks(id, function (itemKey) {
                            if (opts.insync) {
                                delete keysToDelete[id];
                            } else {
                                keysToDelete[id] = 'rm';
                            }
                        });
                    });
                    this.store.put(keyValue.key, keysToDelete);
                    return Gnd.Promise.resolved();
                } else {
                    return Gnd.Promise.rejected(InvalidKeyError());
                }
            };

            Local.prototype.find = function (keyPath, query, opts) {
                var _this = this;
                var result = {};

                var getItems = function (collection) {
                    _.each(_.keys(collection), function (key) {
                        var op = collection[key];
                        if (op !== 'rm' || !opts.snapshot) {
                            var keyValue = _this.traverseLinks(key);
                            if (keyValue) {
                                var item = keyValue.value, id = item._cid;
                                if (!(result[id]) || op === 'insync') {
                                    if (!opts.snapshot)
                                        item.__op = op;
                                    result[id] = item;
                                }
                            }
                        }
                    });
                    return _.values(result);
                };

                if (keyPath.length === 1) {
                    var keyValue = this.traverseLinks(keyPath[0]);
                    return keyValue ? new Gnd.Promise(getItems(keyValue.value)) : new Gnd.Promise([]);
                } else {
                    return this.fetch(keyPath).then(function (collection) {
                        return getItems(collection);
                    }, function (err) {
                        return [];
                    });
                }
            };

            Local.prototype.all = function (keyPath, query, opts) {
                var _this = this;
                var promise = new Gnd.Promise();

                var key = this.makeKey(keyPath);
                var keyValue = this.traverseLinks(key);
                var itemKeys = keyValue ? keyValue.value || [] : [];
                key = keyValue ? keyValue.key : key;

                var all = [];
                var visited = {};

                if (itemKeys.length === 0)
                    return promise.resolve(all);

                var traverse = function (i) {
                    var item = itemKeys[i];
                    if (!item || item.next < 0)
                        return;
                    var itemId = item._id || item._cid;
                    var itemKeyPath = _this.parseKey(item.key);
                    var op = item.sync;
                    if (op !== 'rm') {
                        var itemKeyValue = _this.traverseLinks(item.key);
                        if (itemKeyValue) {
                            var doc = itemKeyValue.value;
                            if (!opts.snapshot)
                                doc.__op = op;
                            var iDoc = {
                                id: itemId,
                                doc: doc
                            };
                            all.push(iDoc);
                        }
                    }
                    if (visited[itemId])
                        return;
                    visited[itemId] = true;
                    traverse(item.next);
                };

                var first = itemKeys[0].next;
                traverse(first);
                return promise.resolve(all);
            };

            Local.prototype.initSequence = function (seq) {
                if (seq.length < 2) {
                    seq[0] = {
                        _id: '##@_begin',
                        prev: -1,
                        next: 1
                    };
                    seq[1] = {
                        _id: '##@_end',
                        prev: 0,
                        next: -1
                    };
                }
            };

            Local.prototype.deleteItem = function (keyPath, id, opts) {
                var promise = new Gnd.Promise();
                var key = this.makeKey(keyPath);
                var keyValue = this.traverseLinks(key);
                var itemKeys = keyValue ? keyValue.value || [] : [];
                key = keyValue ? keyValue.key : key;

                var item = _.find(itemKeys, function (item) {
                    return item._id === id || item._cid === id;
                });
                if (!item) {
                    return promise.resolve();
                }

                if (opts.insync || opts.noremote) {
                    itemKeys[itemKeys[item.prev].next] = 'deleted';
                    itemKeys[item.prev].next = item.next;
                    itemKeys[item.next].prev = item.prev;
                } else {
                    item.sync = 'rm';
                }

                this.store.put(key, itemKeys);
                return promise.resolve();
            };

            Local.prototype.insertBefore = function (keyPath, id, itemKeyPath, opts) {
                id = id || '##@_end';
                var promise = new Gnd.Promise();
                var key = this.makeKey(keyPath);
                var itemKey = this.makeKey(itemKeyPath);
                var keyValue = this.traverseLinks(key);
                var itemKeys = keyValue ? keyValue.value || [] : [];
                key = keyValue ? keyValue.key : key;
                this.initSequence(itemKeys);

                if (opts.id) {
                    var found = _.find(itemKeys, function (item) {
                        return item._id === opts.id || item._cid === opts.id;
                    });
                    if (found) {
                        var next = itemKeys[found.next];
                        if (next._id === id || next._cid === id) {
                            return promise.resolve({ id: opts.id, refId: id });
                        } else {
                            return Gnd.Promise.rejected(Error('Tried to insert duplicate container'));
                        }
                    }
                }

                var refItem = _.find(itemKeys, function (item) {
                    return item._id === id || item._cid === id;
                });

                if (!refItem)
                    return promise.reject(Error('reference item not found'));
                var prevItem = itemKeys[refItem.prev];

                var newItem = {
                    key: itemKey,
                    sync: opts.insync || opts.noremote ? 'insync' : 'ib',
                    prev: refItem.prev,
                    next: prevItem.next
                };
                if (opts.id) {
                    newItem._id = opts.id;
                } else {
                    newItem._cid = Gnd.Util.uuid();
                }

                itemKeys.push(newItem);
                prevItem.next = refItem.prev = itemKeys.length - 1;

                this.store.put(key, itemKeys);
                var refId = newItem.next !== '##@_end' ? newItem.next : null;
                return promise.resolve({ id: newItem._id || newItem._cid, refId: refId });
            };

            Local.prototype.ack = function (keyPath, id, sid, opts) {
                var key = this.makeKey(keyPath);
                var keyValue = this.traverseLinks(key);
                var itemKeys = keyValue ? keyValue.value || [] : [];
                key = keyValue ? keyValue.key : key;

                var item = _.find(itemKeys, function (item) {
                    return opts.op === 'ib' && item._cid === id || opts.op === 'rm' && item._id === sid;
                });

                if (!item)
                    return Gnd.Promise.resolved();

                if (sid)
                    item._id = sid;
                switch (item.sync) {
                    case 'rm':
                        Gnd.log('Removing ', item);
                        itemKeys[itemKeys[item.prev].next] = 'deleted';
                        itemKeys[item.prev].next = item.next;
                        itemKeys[item.next].prev = item.prev;

                        break;
                    case 'ib':
                        item.sync = 'insync';
                        break;
                }
                this.store.put(key, itemKeys);
                return Gnd.Promise.resolved();
            };
            return Local;
        })();
        Storage.Local = Local;
    })(Gnd.Storage || (Gnd.Storage = {}));
    var Storage = Gnd.Storage;
})(Gnd || (Gnd = {}));
var Gnd;
(function (Gnd) {
    (function (Storage) {
        (function (Store) {
            var MemoryStore = (function () {
                function MemoryStore() {
                    this.store = {};
                }
                MemoryStore.prototype.get = function (key) {
                    return this.store[key];
                };
                MemoryStore.prototype.put = function (key, doc) {
                    this.store[key] = doc;
                };
                MemoryStore.prototype.del = function (key) {
                    delete this.store[key];
                };
                MemoryStore.prototype.allKeys = function () {
                    return _.keys(this.store);
                };
                return MemoryStore;
            })();
            Store.MemoryStore = MemoryStore;
        })(Storage.Store || (Storage.Store = {}));
        var Store = Storage.Store;
    })(Gnd.Storage || (Gnd.Storage = {}));
    var Storage = Gnd.Storage;
})(Gnd || (Gnd = {}));
var Gnd;
(function (Gnd) {
    (function (Storage) {
        (function (Query) {
            Query.match = function (cond, doc) {
                return _.all(cond, function (value, key) {
                    return doc[key] === cond[key];
                });
            };
        })(Storage.Query || (Storage.Query = {}));
        var Query = Storage.Query;
    })(Gnd.Storage || (Gnd.Storage = {}));
    var Storage = Gnd.Storage;
})(Gnd || (Gnd = {}));
var Gnd;
(function (Gnd) {
    var Container = (function (_super) {
        __extends(Container, _super);
        function Container(model, opts, parent, items) {
            var _this = this;
            _super.call(this);
            this.filterFn = null;
            this._keepSynced = false;
            this.count = 0;

            this.opts = opts = opts || {};

            opts.key = opts.key || (model && model.__bucket);

            this.storageQueue = new Gnd.Storage.Queue(Gnd.using.memStorage, Gnd.using.storageQueue, false);

            this.items = items ? _.clone(items) : [];

            this.model = model;
            this.parent = parent;

            this.resyncFn = function (items) {
                return _this.resync(items);
            };

            parent && parent.isAutosync() && this.autosync(true);
        }
        Container.prototype.resync = function (items) {
            return new Gnd.Promise(true);
        };

        Container.getItemIds = function (items) {
            return _.map(items, function (item) {
                return item.id();
            });
        };

        Container.create = function (ContainerClass, model, opts, parent, items) {
            return new ContainerClass(model, opts, parent, items);
        };

        Container.prototype.destroy = function () {
            var _this = this;
            Gnd.Util.nextTick(function () {
                return _this.items = null;
            });

            var keyPath = this.getKeyPath();
            if (keyPath) {
                var key = Gnd.Storage.Queue.makeKey(keyPath);
                this.storageQueue.off('resync:' + key, this.resyncFn);
            }

            this._keepSynced && this.endSync();
            this.deinitItems(this.getItems());
            _super.prototype.destroy.call(this);
        };

        Container.prototype.init = function (docs) {
            var _this = this;
            return this.resync(docs).then(function () {
                return _this;
            });
        };

        Container.prototype.save = function () {
            return this.storageQueue.exec();
        };

        Container.prototype.getKeyPath = function () {
            if (this.opts.key) {
                if (this.parent)
                    return [this.parent.bucket(), this.parent.id(), this.opts.key];
                return [this.opts.key];
            }
        };

        Container.prototype.keepSynced = function () {
            this.startSync();

            this['map'](function (item) {
                item.keepSynced();
            });
            return this;
        };

        Container.prototype.isKeptSynced = function () {
            return this._keepSynced;
        };

        Container.prototype.autosync = function (enable) {
            if (!_.isUndefined(enable)) {
                enable && this.keepSynced();
            } else {
                return this._keepSynced;
            }
        };

        Container.prototype.filtered = function (result) {
            if (this.filterFn) {
                result(null, this.filter(this.filterFn));
            } else {
                result(null, this.getItems());
            }
        };

        Container.prototype.isFiltered = function (item) {
            return this.filterFn ? this.filterFn(item) : true;
        };

        Container.prototype.startSync = function () {
            var _this = this;
            this._keepSynced = true;

            if (this.parent && Gnd.using.syncManager) {
                if (this.parent.isPersisted()) {
                    Gnd.using.syncManager.observe(this);
                } else {
                    this.parent.on('id', function () {
                        Gnd.using.syncManager.observe(_this);
                    });
                }
            }

            this.storageQueue.exec().then(function () {
                _this.storageQueue = Gnd.using.storageQueue;
            });
        };

        Container.prototype.endSync = function () {
            Gnd.using.syncManager && Gnd.using.syncManager.unobserve(this);
            this._keepSynced = false;
        };

        Container.prototype.getItems = function () {
            return this.items;
        };

        Container.prototype.initItems = function (items) {
            items = _.isArray(items) ? items : [items];
            for (var i = 0, len = items.length; i < len; i++) {
                var item = items[i];
                item.retain();
                item.on('changed:', this.updateFn);
                item.on('deleted:', this.deleteFn);
            }
        };

        Container.prototype.deinitItems = function (items) {
            for (var i = 0, len = items.length; i < len; i++) {
                var item = items[i];
                item.off('changed:', this.updateFn);
                item.off('deleted:', this.deleteFn);
                item.release();
            }
        };
        return Container;
    })(Gnd.Promise);
    Gnd.Container = Container;
})(Gnd || (Gnd = {}));
var Gnd;
(function (Gnd) {
    function Mutex() {
        var queue = [];

        return function (handler) {
            handler.promise = new Gnd.Promise();
            handler.wait = handler.promise.then(handler);

            queue.push(handler);
            if (queue.length === 1) {
                exec(handler);
            }
            return handler.wait;
        };

        function exec(handler) {
            handler.promise.resolve();
            handler.wait.ensure(function () {
                queue.shift();
                var next = queue[0];
                if (next)
                    exec(next);
            });
        }
    }
    Gnd.Mutex = Mutex;
})(Gnd || (Gnd = {}));
var Gnd;
(function (Gnd) {
    var SchemaType = (function () {
        function SchemaType(definition) {
            this.definition = definition;
        }
        SchemaType.prototype.validate = function (val) {
            return new Gnd.Promise(true);
        };

        SchemaType.prototype.toObject = function (obj) {
            return obj;
        };

        SchemaType.prototype.fromObject = function (args) {
            return args;
        };

        SchemaType.prototype.default = function () {
            return this.definition.default;
        };
        SchemaType.type = Object;
        return SchemaType;
    })();
    Gnd.SchemaType = SchemaType;

    var StringType = (function (_super) {
        __extends(StringType, _super);
        function StringType() {
            _super.apply(this, arguments);
        }
        StringType.type = String;
        return StringType;
    })(SchemaType);
    Gnd.StringType = StringType;

    var NumberType = (function (_super) {
        __extends(NumberType, _super);
        function NumberType() {
            _super.apply(this, arguments);
        }
        NumberType.type = Number;
        return NumberType;
    })(SchemaType);
    Gnd.NumberType = NumberType;

    var BooleanType = (function (_super) {
        __extends(BooleanType, _super);
        function BooleanType() {
            _super.apply(this, arguments);
        }
        BooleanType.type = Boolean;
        return BooleanType;
    })(SchemaType);
    Gnd.BooleanType = BooleanType;

    var DateType = (function (_super) {
        __extends(DateType, _super);
        function DateType() {
            _super.apply(this, arguments);
        }
        DateType.type = Date;
        return DateType;
    })(SchemaType);
    Gnd.DateType = DateType;

    var ObjectIdType = (function (_super) {
        __extends(ObjectIdType, _super);
        function ObjectIdType() {
            _super.apply(this, arguments);
        }
        ObjectIdType.type = 'ObjectId';
        return ObjectIdType;
    })(SchemaType);
    Gnd.ObjectIdType = ObjectIdType;

    var ArrayType = (function (_super) {
        __extends(ArrayType, _super);
        function ArrayType(def) {
            _super.call(this, def);
            var type = (def.type || def)[0];
            this.schema = Gnd.Schema.compileType(type, def);
        }
        ArrayType.prototype.toObject = function (arr) {
            var _this = this;
            return _.map(arr, function (item) {
                return _this.schema.toObject(item);
            });
        };
        ArrayType.type = Array;
        return ArrayType;
    })(SchemaType);
    Gnd.ArrayType = ArrayType;

    var AbstractType = (function (_super) {
        __extends(AbstractType, _super);
        function AbstractType() {
            _super.apply(this, arguments);
        }
        AbstractType.prototype.toObject = function (obj) {
            var schema = obj.__schema || obj.constructor.__schema;
            return schema ? schema.toObject(obj) : undefined;
        };
        AbstractType.type = 'Abstract';
        return AbstractType;
    })(SchemaType);
    Gnd.AbstractType = AbstractType;
})(Gnd || (Gnd = {}));
var Gnd;
(function (Gnd) {
    var Schema = (function (_super) {
        __extends(Schema, _super);
        function Schema(schema) {
            _super.call(this, this);
            this.schema = schema;
            this.compiledSchema = this.compile(schema || {});
        }
        Schema.prototype.validate = function (obj, property, value) {
            if (property) {
                return this.compiledSchema[property].validate(value);
            } else {
                return new Gnd.Promise(true);
            }
        };

        Schema.prototype.toObject = function (obj, extra) {
            var result = {};

            _.each(this.compiledSchema, function (type, property) {
                var src = obj[property];
                var value;

                if (!_.isUndefined(src)) {
                    value = (extra && extra[property] && extra[property].toObject(src)) || type.toObject(src);
                } else {
                    value = type.default();
                }
                if (!_.isUndefined(value)) {
                    result[property] = value;
                }
            });
            return result;
        };

        Schema.prototype.fromObject = function (args) {
            var obj = {};
            _.each(this.compiledSchema, function (type, property) {
                var src = args[property];
                var value = !_.isUndefined(src) ? type.fromObject(src) : type.default();

                if (!_.isUndefined(value)) {
                    obj[property] = value;
                }
            });
            return obj;
        };

        Schema.prototype.get = function (obj, key, args, opts) {
            if (_.isString(key)) {
                var schema = this.schema[key];
                return schema && schema.get && schema.get(obj, args, opts);
            }
        };

        Schema.prototype.default = function () {
            var result = {}, empty = true;
            _.each(this.compiledSchema, function (type, property) {
                var value = type.default();
                if (!_.isUndefined(value)) {
                    result[property] = value;
                    empty = false;
                }
            });

            return empty ? undefined : result;
        };

        Schema.prototype.defaults = function (obj) {
            _.each(this.compiledSchema, function (type, property) {
                var value = type.default();
                if (_.isUndefined(obj[property]) && !_.isUndefined(value)) {
                    obj[property] = value;
                }
            });
        };

        Schema.prototype.compile = function (schema) {
            var compiledSchema = {};
            var types = Schema.types;

            _.each(schema, function (definition, property) {
                if (definition) {
                    var type = definition.type ? definition.type : definition;

                    var compiledType = Schema.compileType(type, definition);
                    if (compiledType) {
                        compiledSchema[property] = compiledType;
                    } else {
                        console.log(definition);
                        throw Error("Invalid type definition:" + definition);
                    }
                }
            });
            return compiledSchema;
        };

        Schema.extend = function (parent, child) {
            return new Schema(_.extend({}, parent.schema, child ? child.schema : {}));
        };

        Schema.prototype.isInstanceOf = function (parent) {
        };

        Schema.compileType = function (type, definition) {
            var types = Schema.types;

            if (type instanceof Schema || type instanceof Gnd.SchemaType) {
                return type;
            }

            if (type instanceof Array) {
                return new Gnd.ArrayType(definition);
            }

            for (var i = 0; i < types.length; i++) {
                if (type == types[i].type) {
                    return new types[i](definition);
                }
            }
        };

        Schema.prototype.map = function (iter) {
            var result = {};
            _.each(this.compiledSchema, function (value, key) {
                var def = iter(key, value);
                if (def)
                    result[key] = def;
            });
            return result;
        };

        Schema.ObjectId = 'ObjectId';

        Schema.Abstract = 'Abstract';

        Schema.types = [
            Gnd.StringType,
            Gnd.NumberType,
            Gnd.BooleanType,
            Gnd.DateType,
            Gnd.SchemaType,
            Gnd.ObjectIdType,
            Gnd.AbstractType
        ];
        return Schema;
    })(Gnd.SchemaType);
    Gnd.Schema = Schema;
})(Gnd || (Gnd = {}));
var Gnd;
(function (Gnd) {
    ;

    var SequenceSchemaType = (function (_super) {
        __extends(SequenceSchemaType, _super);
        function SequenceSchemaType(model, bucket) {
            _super.call(this, { type: Sequence, ref: { model: model, bucket: bucket || model.__bucket } });
        }
        SequenceSchemaType.prototype.toObject = function (obj) {
        };

        SequenceSchemaType.prototype.fromObject = function (arg) {
        };

        SequenceSchemaType.prototype.get = function (model, args, opts) {
            var def = this.definition;
            return model.seq(def.ref.model, args || {}, def.ref.bucket);
        };
        SequenceSchemaType.type = Sequence;
        return SequenceSchemaType;
    })(Gnd.SchemaType);
    Gnd.SequenceSchemaType = SequenceSchemaType;

    var Sequence = (function (_super) {
        __extends(Sequence, _super);
        function Sequence(model, opts, parent, items) {
            var _this = this;
            _super.call(this, model, opts, parent, items);
            this.resyncMutex = Gnd.Mutex();

            this.initItems(this.getItems());

            this.updateFn = function (args) {
                _this.emit('updated:', _this, args);
            };

            this.deleteFn = function (model) {
                for (var i = _this.items.length - 1; i >= 0; i--) {
                    if (_this.items[i].model.id() === model.id()) {
                        _this.remove(i);
                    }
                }
            };

            if (parent && parent.isKeptSynced()) {
                this.keepSynced();
            }

            var keyPath = this.getKeyPath();
            if (keyPath && !this.opts.nosync) {
                this.retain();
                Gnd.using.storageQueue.all(keyPath, {}, {}).then(function (result) {
                    _this.resync(result[0]);
                    result[1].then(function (items) {
                        return _this.resync(items);
                    }).ensure(function () {
                        _this.resolve(_this);
                        _this.release();
                    });
                });
            } else {
                this.resolve(this);
            }
        }
        Sequence.prototype.deleteItem = function (id, opts) {
            var idx = _.findIndex(this.items, { 'id': id });

            if (idx === -1)
                return new Gnd.Promise(this);
            return this.remove(idx, opts);
        };

        Sequence.prototype.insertBefore = function (refId, item, opts) {
            return this.insertItemBefore(refId, item, null, opts);
        };

        Sequence.prototype.insertItemBefore = function (refId, item, id, opts) {
            var _this = this;
            var promise;
            var seqItem = {
                model: item,
                id: id,
                insync: !(_.isNull(id) || _.isUndefined(id))
            };

            opts = Gnd.Util.extendClone(this.opts, opts);
            if (id)
                opts.id = id;

            var done = function (id) {
                seqItem.id = id.id || seqItem.id;
                _this.storageQueue.once('inserted:' + seqItem.id, function (sid) {
                    seqItem.id = sid;
                    seqItem.insync = true;
                });
            };

            var index = _.findIndex(this.items, { 'id': id });
            if (index !== -1) {
                var next = this.items[index + 1];
                if ((!refId && !next) || refId === next.id) {
                    return Gnd.Promise.resolved();
                } else {
                    return Gnd.Promise.rejected(Error('Tried to insert duplicate container'));
                }
            }

            if (refId) {
                index = _.findIndex(this.items, { 'id': refId });
                if (index === -1) {
                    Gnd.log('REFID not found. Resyncing');
                    return this.triggerResync();
                }
            } else {
                index = this.items.length;
            }

            while (opts.noremote && index > 0 && !this.items[index - 1].insync) {
                index--;
                refId = this.items[index].id;
            }

            this.items.splice(index, 0, seqItem);
            this.initItems(seqItem.model);
            this.set('count', this.items.length);

            if (!opts || !opts.nosync) {
                if (item.isPersisted() || item._persisting) {
                    this._keepSynced && item.keepSynced();
                    promise = this.insertPersistedItemBefore(refId, item, opts).then(done);
                } else {
                    promise = item.save().then(function () {
                        _this._keepSynced && item.keepSynced();
                        return _this.insertPersistedItemBefore(refId, item, opts).then(done);
                    });
                }
            } else {
                this._keepSynced && item.keepSynced();
                promise = Gnd.Promise.resolved();
            }

            this.emit('inserted:', item, index);
            return promise;
        };

        Sequence.prototype.insertPersistedItemBefore = function (id, item, opts) {
            var keyPath = this.getKeyPath();
            var itemKeyPath = item.getKeyPath();
            return this.storageQueue.insertBefore(keyPath, id, itemKeyPath, opts);
        };

        Sequence.prototype.push = function (item, opts) {
            return this.insertBefore(null, item, opts);
        };

        Sequence.prototype.unshift = function (item, opts) {
            var firstId = this.items.length > 0 ? _.first(this.items).id : null;
            return this.insertBefore(firstId, item, opts);
        };

        Sequence.prototype.insert = function (idx, item, opts) {
            var seqItem = this.items[idx];
            var id = seqItem ? seqItem.id : null;
            return this.insertBefore(id, item, opts);
        };

        Sequence.prototype.remove = function (idx, opts) {
            var promise;

            var item = this.items[idx];

            if (!item) {
                return Gnd.Promise.rejected(Error('index out of bounds'));
            }
            this.items.splice(idx, 1);

            item.model.off('changed:', this.updateFn);
            item.model.off('deleted:', this.deleteFn);

            this.set('count', this.items.length);
            item.model.release();

            opts = Gnd.Util.extendClone(this.opts, opts);

            if (!opts || !opts.nosync) {
                promise = this.storageQueue.deleteItem(this.getKeyPath(), item.id, opts);
            } else {
                promise = Gnd.Promise.resolved();
            }

            this.emit('removed:', item.model, idx);
            return promise;
        };

        Sequence.prototype.move = function (startIdx, endIdx, opts) {
            var _this = this;
            var srcItem = this.items[startIdx];

            if (srcItem) {
                endIdx = startIdx <= endIdx ? endIdx + 1 : endIdx;

                if (0 <= endIdx && endIdx <= this.items.length) {
                    var targetId = endIdx < this.items.length ? this.items[endIdx].id : null;

                    srcItem.model.retain();
                    return this.remove(startIdx).then(function () {
                        return _this.insertBefore(targetId, srcItem.model, opts);
                    });
                }
            }
            return new Gnd.Promise(new Error("Invalid indexes:" + startIdx + ", " + endIdx));
        };

        Sequence.prototype.getItems = function () {
            return _.pluck(this.items, 'model');
        };

        Sequence.prototype.startSync = function () {
            var _this = this;
            _super.prototype.startSync.call(this);

            this.on('insertBefore:', function (id, itemKeyPath, refId) {
                _this.model.findById(itemKeyPath, true, {}).then(function (item) {
                    _this.insertItemBefore(refId, item, id, { noremote: true });
                    item.release();
                });
            });

            this.on('deleteItem:', function (id) {
                _this.deleteItem(id, { noremote: true });
            });
        };

        Sequence.prototype.execCmds = function (commands) {
            var _this = this;
            var opts = { nosync: true };
            var item;
            return Gnd.Promise.map(commands, function (cmd) {
                switch (cmd.cmd) {
                    case 'insertBefore':
                        item = _this.model.create(cmd.doc, _this.autosync());
                        item.autorelease();
                        return _this.insertItemBefore(cmd.refId, item, cmd.newId, opts);
                    case 'removeItem':
                        return _this.deleteItem(cmd.id, opts);
                    case 'update':
                        item = _this['find'](function (item) {
                            return cmd.doc._id == item.id();
                        });
                        item && item.resync(cmd.doc);
                        return Gnd.Promise.resolved();
                    default:
                        throw Error('Invalid command:' + cmd);
                }
            });
        };

        Sequence.prototype.triggerResync = function () {
            var _this = this;
            var keyPath = this.getKeyPath();
            return this.storageQueue.all(keyPath, {}, {}).then(function (result) {
                return result[1].then(function (items) {
                    return _this.resync(items);
                });
            });
        };

        Sequence.prototype.resync = function (remoteItems) {
            var _this = this;
            return this.resyncMutex(function () {
                var commands = Sequence.merge(remoteItems, _this.items, Sequence.mergeFns);
                return _this.execCmds(commands).then(function () {
                    _this.emit('resynced:');
                });
            });
        };

        Sequence.merge = function (source, target, fns) {
            var insertCommands = [];
            var removeCommands = [];
            var updateCommands = [];
            var remainingItems = [];

            var sourceIds = _.map(source, function (item) {
                return fns.id(item);
            }).sort();

            _.each(target, function (targetItem) {
                if (fns.inSync(targetItem) && -1 === _.indexOf(sourceIds, fns.id(targetItem), true)) {
                    removeCommands.push({
                        cmd: 'removeItem',
                        id: fns.id(targetItem)
                    });
                } else {
                    remainingItems.push(targetItem);
                }
            });

            var i = 0;
            var j = 0;
            var targetItem, sourceItem;

            while (i < remainingItems.length && j < source.length) {
                targetItem = remainingItems[i];
                if (fns.inSync(targetItem)) {
                    sourceItem = source[j];
                    if (fns.id(targetItem) === fns.id(sourceItem)) {
                        updateCommands.push({
                            cmd: 'update',
                            keyPath: fns.keyPath(sourceItem),
                            doc: fns.doc(sourceItem)
                        });
                        i++;
                    } else {
                        insertCommands.push({
                            cmd: 'insertBefore',
                            refId: fns.id(targetItem),
                            newId: fns.id(sourceItem),
                            keyPath: fns.keyPath(sourceItem),
                            doc: fns.doc(sourceItem)
                        });
                    }
                    j++;
                } else {
                    i++;
                }
            }

            while (j < source.length) {
                sourceItem = source[j];
                insertCommands.push({
                    cmd: 'insertBefore',
                    refId: null,
                    newId: fns.id(sourceItem),
                    keyPath: fns.keyPath(sourceItem),
                    doc: fns.doc(sourceItem)
                });
                j++;
            }

            while (i < remainingItems.length) {
                targetItem = remainingItems[i];
                if (fns.inSync(targetItem)) {
                    removeCommands.push({
                        cmd: 'removeItem',
                        id: fns.id(targetItem)
                    });
                }
                i++;
            }

            _.each(insertCommands, function (insertCmd) {
                var found = _.find(removeCommands, function (removeCmd) {
                    return removeCmd.id === insertCmd.refId;
                });
                if (found) {
                    insertCmd.refId = null;
                }
            });

            return removeCommands.concat(insertCommands).concat(updateCommands);
        };
        Sequence.mergeFns = {
            id: function (item) {
                return item.id;
            },
            keyPath: function (item) {
                return item.keyPath;
            },
            doc: function (item) {
                return item.doc;
            },
            inSync: function (item) {
                return item.insync;
            }
        };
        return Sequence;
    })(Gnd.Container);
    Gnd.Sequence = Sequence;

    var methods = [
        'each',
        'map',
        'reduce',
        'reduceRight',
        'find',
        'detect',
        'pluck',
        'filter',
        'select',
        'reject',
        'every',
        'all',
        'some',
        'any',
        'include',
        'contains',
        'invoke',
        'max',
        'min',
        'toArray',
        'size',
        'first',
        'rest',
        'last',
        'without',
        'indexOf',
        'lastIndexOf',
        'isEmpty'
    ];

    _.each(methods, function (method) {
        Sequence.prototype[method] = function () {
            return _[method].apply(_, [_.pluck(this.items, 'model')].concat(_.toArray(arguments)));
        };
    });
})(Gnd || (Gnd = {}));
var Gnd;
(function (Gnd) {
    (function (Storage) {
        "use strict";

        var QUEUE_STORAGE_KEY = 'meta@taskQueue';

        var Queue = (function (_super) {
            __extends(Queue, _super);
            function Queue(local, remote, autosync) {
                _super.call(this);
                this.createList = {};
                this.currentTransfer = null;
                this.remoteStorage = null;

                this.localStorage = local;
                this.remoteStorage = remote;
                this.queue = [];

                this.useRemote = !!this.remoteStorage;
                this.syncFn = _.bind(this.synchronize, this);
                this.autosync = typeof autosync === 'undefined' ? true : autosync;
            }
            Queue.makeKey = function (keyPath) {
                return keyPath.join(':');
            };

            Queue.itemEquals = function (item1, item2) {
                return (!item1 && !item2) || (item1 && item2 && (item1.doc._id === item2.doc._id || item1.doc._cid === item2.doc._cid));
            };

            Queue.prototype.init = function (cb) {
                this.loadQueue();
                cb();
            };

            Queue.prototype.exec = function () {
                var promise = new Gnd.Promise();
                if (!this.currentTransfer && this.queue.length === 0) {
                    return promise.resolve();
                }
                this.once('synced:', function () {
                    promise.resolve();
                });
                this.syncFn();
                return promise;
            };

            Queue.prototype.fetch = function (keyPath) {
                var _this = this;
                var promise = new Gnd.Promise();

                var fetchRemote = function () {
                    return _this.remoteStorage.fetch(keyPath).then(function (docRemote) {
                        return _this.localStorage.put(keyPath, docRemote, {}).then(function () {
                            return docRemote;
                        });
                    });
                };

                this.localStorage.fetch(keyPath).then(function (doc) {
                    var remotePromise = _this.useRemote ? fetchRemote() : new Gnd.Promise(doc);

                    doc['_id'] = _.last(keyPath);
                    promise.resolve([doc, remotePromise]);
                }, function (err) {
                    if (!_this.useRemote)
                        return promise.reject(err);

                    fetchRemote().then(function (docRemote) {
                        promise.resolve([docRemote, new Gnd.Promise(docRemote)]);
                    }).fail(function (err) {
                        promise.reject(err);
                    });
                });
                return promise;
            };

            Queue.prototype.execCmds = function (keyPath, commands) {
                var _this = this;
                var opts = { insync: true };
                return Gnd.Promise.map(commands, function (cmd) {
                    switch (cmd.cmd) {
                        case 'insertBefore':
                            return _this.localStorage.put(cmd.keyPath, cmd.doc, opts).then(function () {
                                _this.localStorage.insertBefore(keyPath, cmd.refId, cmd.keyPath, Gnd.Util.extendClone({ id: cmd.newId }, opts));
                            });
                        case 'removeItem':
                            return _this.localStorage.deleteItem(keyPath, cmd.id, opts);

                        case 'update':
                            return _this.localStorage.put(cmd.keyPath, cmd.doc, opts);
                        default:
                            return new Gnd.Promise(Error('Invalid command: ' + cmd));
                    }
                });
            };

            Queue.prototype.updateLocalSequence = function (keyPath, opts, remoteSeq) {
                var _this = this;
                opts = _.extend({ snapshot: false }, opts);

                return this.localStorage.all(keyPath, {}, opts).then(function (localSeq) {
                    var commands = Gnd.Sequence.merge(remoteSeq, localSeq, Queue.mergeFns);
                    return _this.execCmds(keyPath, commands);
                });
            };

            Queue.prototype.updateLocalCollection = function (keyPath, query, options, newItems) {
                var storage = this.localStorage, itemKeyPath = [_.last(keyPath)], result = [];

                query = query || {};

                newItems = newItems || [];
                options = _.extend({ snapshot: false }, options);

                return storage.find(keyPath, query, options).then(function (oldItems) {
                    var itemsToRemove = [], itemsToAdd = [];

                    function findItem(items, itemToFind) {
                        return _.find(items, function (item) {
                            return (item._cid === itemToFind._cid || item._id === itemToFind._id);
                        });
                    }

                    _.each(oldItems, function (oldItem) {
                        if (Storage.Query.match(query.cond || {}, oldItem)) {
                            if (oldItem.__op === 'insync' && !findItem(newItems, oldItem)) {
                                itemsToRemove.push(oldItem._cid, oldItem._id);
                            } else if (oldItem.__op !== 'rm') {
                                result.push(oldItem);
                            }
                        }
                    });

                    _.each(newItems, function (newItem) {
                        if (!findItem(oldItems, newItem)) {
                            itemsToAdd.push(newItem._id);
                            result.push(newItem);
                        }
                    });

                    return storage.remove(keyPath, itemKeyPath, itemsToRemove, { insync: true }).then(function () {
                        return Gnd.Promise.map(newItems, function (doc) {
                            var elemKeyPath = itemKeyPath.concat(doc._id);
                            doc._cid = doc._id;
                            return storage.put(elemKeyPath, doc, {});
                        }).then(function () {
                            return storage.add(keyPath, itemKeyPath, itemsToAdd, { insync: true });
                        }).then(function () {
                            return result;
                        });
                    }).fail();
                }).fail(function () {
                    return storage.add(keyPath, itemKeyPath, _.pluck(newItems, '_id'), { insync: true }).then(function () {
                        return newItems;
                    });
                });
            };

            Queue.prototype.create = function (keyPath, args, opts) {
                var _this = this;
                return this.localStorage.create(keyPath, args, opts).then(function (cid) {
                    args['_cid'] = args['_cid'] || cid;
                    _this.addCmd({ cmd: 'create', keyPath: keyPath, args: args }, opts);
                    return cid;
                });
            };

            Queue.prototype.put = function (keyPath, args, opts) {
                var _this = this;
                return this.localStorage.put(keyPath, args, opts).then(function () {
                    _this.addCmd({ cmd: 'update', keyPath: keyPath, args: args }, opts);
                });
            };

            Queue.prototype.del = function (keyPath, opts) {
                var _this = this;
                return this.localStorage.del(keyPath, opts).then(function () {
                    _this.addCmd({ cmd: 'delete', keyPath: keyPath }, opts);
                });
            };

            Queue.prototype.add = function (keyPath, itemsKeyPath, itemIds, opts) {
                var _this = this;
                return this.localStorage.add(keyPath, itemsKeyPath, itemIds, {}).then(function () {
                    _this.addCmd({ cmd: 'add', keyPath: keyPath, itemsKeyPath: itemsKeyPath, itemIds: itemIds }, opts);
                });
            };

            Queue.prototype.remove = function (keyPath, itemsKeyPath, itemIds, opts) {
                var _this = this;
                var localItemsIds = [];
                var remoteItemIds = [];

                for (var id in itemIds) {
                    if (itemIds[id]) {
                        remoteItemIds.push(id);
                    }
                    localItemsIds.push(id);
                }

                return this.localStorage.remove(keyPath, itemsKeyPath, localItemsIds, {}).then(function () {
                    _this.addCmd({
                        cmd: 'remove',
                        keyPath: keyPath,
                        itemsKeyPath: itemsKeyPath,
                        itemIds: remoteItemIds
                    }, opts);
                });
            };

            Queue.prototype.find = function (keyPath, query, opts) {
                var _this = this;
                var promise = new Gnd.Promise();
                var remotePromise = new Gnd.Promise();
                var useRemote = this.useRemote && !opts.noremote;

                var localOpts = _.extend({ snapshot: true }, opts);

                var findRemote = function () {
                    return _this.remoteStorage.find(keyPath, query, opts).then(function (remote) {
                        return _this.updateLocalCollection(keyPath, query, opts, remote);
                    });
                };

                this.localStorage.find(keyPath, query, localOpts).then(function (items) {
                    promise.resolve([items, remotePromise]);

                    if (useRemote) {
                        findRemote().then(function (itemsRemote) {
                            return remotePromise.resolve(itemsRemote);
                        }).fail(function (err) {
                            return remotePromise.reject(err);
                        });
                    } else {
                        remotePromise.resolve(items);
                    }
                }, function (err) {
                    if (!useRemote)
                        return promise.reject(err);

                    findRemote().then(function (itemsRemote) {
                        remotePromise.resolve(itemsRemote);
                        promise.resolve([itemsRemote, remotePromise]);
                    }).fail(function (err) {
                        promise.reject(err);
                    });
                });
                return promise;
            };

            Queue.prototype.all = function (keyPath, query, opts) {
                var _this = this;
                var promise = new Gnd.Promise();
                var remotePromise = new Gnd.Promise();

                var localOpts = _.extend({ snapshot: true }, opts);

                var allRemote = function () {
                    return _this.remoteStorage.all(keyPath, query, opts).then(function (remote) {
                        return _this.updateLocalSequence(keyPath, opts, remote);
                    }).then(function () {
                        return _this.localStorage.all(keyPath, {}, localOpts);
                    });
                };

                this.localStorage.all(keyPath, query, localOpts).then(function (result) {
                    promise.resolve([result, remotePromise]);

                    if (_this.useRemote) {
                        allRemote().then(function (itemsRemote) {
                            return remotePromise.resolve(itemsRemote);
                        }).fail(function (err) {
                            return remotePromise.reject(err);
                        });
                    }
                }, function (err) {
                    if (!_this.useRemote)
                        return promise.reject(err);

                    allRemote().then(function (itemsRemote) {
                        remotePromise.resolve(itemsRemote);
                        promise.resolve([itemsRemote, remotePromise]);
                    }).fail(function (err) {
                        return promise.reject(err);
                    });
                });
                return promise;
            };

            Queue.prototype.deleteItem = function (keyPath, id, opts) {
                var _this = this;
                return this.localStorage.deleteItem(keyPath, id, opts).then(function () {
                    return _this.addCmd({ cmd: 'deleteItem', keyPath: keyPath, id: id }, opts);
                });
            };

            Queue.prototype.insertBefore = function (keyPath, id, itemKeyPath, opts) {
                var _this = this;
                return this.localStorage.insertBefore(keyPath, id, itemKeyPath, opts).then(function (res) {
                    _this.addCmd({
                        cmd: 'insertBefore',
                        keyPath: keyPath,
                        id: id,
                        itemKeyPath: itemKeyPath,
                        cid: res.id
                    }, opts);

                    return res;
                });
            };

            Queue.prototype.synchronize = function () {
                var _this = this;
                var done = _.bind(this.completed, this);

                if (!this.currentTransfer) {
                    if (this.queue.length) {
                        var obj = this.currentTransfer = this.queue[0], localStorage = this.localStorage, remoteStorage = this.remoteStorage, keyPath = obj.keyPath, itemsKeyPath = obj.itemsKeyPath, itemIds = obj.itemIds, args = obj.args;

                        switch (obj.cmd) {
                            case 'create':
                                (function (cid) {
                                    remoteStorage.create(keyPath, args, {}).then(function (sid) {
                                        var localKeyPath = keyPath.concat(cid);

                                        return localStorage.put(localKeyPath, { _id: sid }, {}).then(function () {
                                            var newKeyPath = _.initial(localKeyPath);
                                            newKeyPath.push(sid);

                                            return localStorage.link(newKeyPath, localKeyPath).then(function () {
                                                var subQ = (_this.remoteStorage);
                                                if (_this.autosync || !subQ.once) {
                                                    _this.emit('created:' + cid, sid);
                                                } else {
                                                    subQ.once('created:' + sid, function (sid) {
                                                        _this.emit('created:' + cid, sid);
                                                    });
                                                }
                                                _this.updateQueueIds(cid, sid);
                                            });
                                        });
                                    }).then(done, done);
                                })(args['_cid']);

                                break;
                            case 'update':
                                remoteStorage.put(keyPath, args, {}).then(done, done);
                                break;
                            case 'delete':
                                remoteStorage.del(keyPath, {}).then(done, done);
                                break;
                            case 'add':
                                remoteStorage.add(keyPath, itemsKeyPath, itemIds, {}).then(done, done);
                                break;
                            case 'remove':
                                remoteStorage.remove(keyPath, itemsKeyPath, _.unique(itemIds), {}).then(done, done);
                                break;
                            case 'insertBefore':
                                var id = obj.id;
                                var itemKeyPath = obj.itemKeyPath;
                                var cid = obj.cid;
                                remoteStorage.insertBefore(keyPath, id, itemKeyPath, {}).then(function (res) {
                                    var sid = res.id, refId = res.refId;
                                    return localStorage.ack(keyPath, cid, sid, { op: 'ib' }).then(function () {
                                        var subQ = (_this.remoteStorage);
                                        if (_this.autosync || !subQ.once) {
                                            _this.emit('inserted:' + cid, sid, refId);
                                        } else {
                                            subQ.once('inserted:' + sid, function (newSid, refId) {
                                                localStorage.ack(keyPath, sid, newSid, { op: 'ib' }).then(function () {
                                                    _this.emit('inserted:' + cid, newSid, refId);
                                                });
                                            });
                                        }
                                        _this.updateQueueIds(cid, sid);
                                    });
                                }).then(done, done);
                                break;
                            case 'deleteItem':
                                remoteStorage.deleteItem(keyPath, obj.id, {}).then(done, done);
                                break;
                            case 'syncTask':
                                obj.fn(done);
                                break;
                        }
                    } else {
                        var subQ = (this.remoteStorage);
                        if (this.autosync || !subQ.once) {
                            this.emit('synced:', this);
                        } else {
                            subQ.once('synced:', function () {
                                _this.emit('synced:', _this);
                            });
                        }
                    }
                } else {
                    console.log('busy with ', this.currentTransfer);
                }
            };

            Queue.prototype.waitUntilSynced = function (cb) {
                if (this.queue.length > 0) {
                    this.once('synced:', cb);
                } else {
                    cb();
                }
            };

            Queue.prototype.isEmpty = function () {
                return !this.queue.length;
            };

            Queue.prototype.loadQueue = function () {
                this.queue = JSON.parse(localStorage[QUEUE_STORAGE_KEY] || '[]');
            };

            Queue.prototype.saveQueue = function () {
                localStorage[QUEUE_STORAGE_KEY] = JSON.stringify(this.queue);
            };

            Queue.prototype.enqueueCmd = function (cmd) {
                this.queue.push(cmd);
                this.autosync && this.saveQueue();
            };
            Queue.prototype.dequeueCmd = function () {
                var cmd = this.queue.shift();
                this.autosync && this.saveQueue();
                return cmd;
            };
            Queue.prototype.fireOnEmptyQueue = function (fn) {
                if (this.queue.length > 0) {
                    this.once('synced:', fn);
                    this.addCmd({ cmd: 'syncTask', fn: fn }, {});
                } else {
                    fn(Gnd.Util.noop);
                }
            };

            Queue.prototype.addCmd = function (cmd, opts) {
                if (this.useRemote && !opts.noremote) {
                    this.enqueueCmd(cmd);
                    this.autosync && this.synchronize();
                }
            };

            Queue.prototype.completed = function (err) {
                var _this = this;
                var storage = this.localStorage;
                var syncFn = function () {
                    return Gnd.Util.nextTick(function () {
                        return _this.synchronize();
                    });
                };

                if (!err) {
                    var cmd = this.dequeueCmd();
                    if (!cmd)
                        return;

                    console.log("Completed queue command", cmd);

                    var opts = { insync: true };

                    (function () {
                        switch (cmd.cmd) {
                            case 'add':
                                return storage.remove(cmd.keyPath, cmd.itemsKeyPath, cmd.oldItemIds || [], opts).then(function () {
                                    return storage.add(cmd.keyPath, cmd.itemsKeyPath, cmd.itemIds, opts);
                                });
                            case 'remove':
                                var itemsToRemove = (cmd.oldItemIds || []).concat(cmd.itemIds || []);
                                return storage.remove(cmd.keyPath, cmd.itemsKeyPath, itemsToRemove, opts);
                            case 'deleteItem':
                                return storage.ack(cmd.keyPath, null, cmd.id, { op: 'rm' });
                        }
                        return Gnd.Promise.resolved();
                    })().ensure(function () {
                        return syncFn();
                    });
                } else {
                    console.log("Queue error:" + err, this.queue[0]);

                    if (err.message == 'Invalid ObjectId') {
                        err.message = '' + Gnd.ServerError.INVALID_ID;
                    }

                    var errCode;
                    if (err.message == 'Invalid ObjectId') {
                        errCode = Gnd.ServerError.INVALID_ID;
                    } else {
                        errCode = parseInt(err.message);
                    }

                    switch (errCode) {
                        case Gnd.ServerError.INVALID_ID:
                        case Gnd.ServerError.INVALID_SESSION:
                        case Gnd.ServerError.DOCUMENT_NOT_FOUND:
                        case Gnd.ServerError.MODEL_NOT_FOUND:
                            this.dequeueCmd();
                            this.emit('error:', err);
                            syncFn();
                            break;
                        default:
                    }
                }

                this.currentTransfer = null;
            };

            Queue.prototype.updateQueueIds = function (oldId, newId) {
                _.each(this.queue, function (cmd) {
                    cmd.keyPath && updateIds(cmd.keyPath, oldId, newId);
                    cmd.itemsKeyPath && updateIds(cmd.itemsKeyPath, oldId, newId);
                    cmd.itemKeyPath && updateIds(cmd.itemKeyPath, oldId, newId);
                    if (cmd.id && cmd.id === oldId)
                        cmd.id = newId;
                    if (cmd.itemIds) {
                        cmd.oldItemIds = updateIds(cmd.itemIds, oldId, newId);
                    }
                });

                this.saveQueue();
            };
            Queue.mergeFns = {
                id: function (item) {
                    return item.id;
                },
                keyPath: function (item) {
                    return item.keyPath;
                },
                doc: function (item) {
                    return item.doc;
                },
                inSync: function (item) {
                    return item.doc.__op === 'insync' || item.doc.__op === 'rm';
                }
            };
            return Queue;
        })(Gnd.Base);
        Storage.Queue = Queue;

        function updateIds(keyPath, oldId, newId) {
            var updatedKeys = [];
            for (var i = 0; i < keyPath.length; i++) {
                if (keyPath[i] == oldId) {
                    keyPath[i] = newId;
                    updatedKeys.push(oldId);
                }
            }
            return updatedKeys;
        }
    })(Gnd.Storage || (Gnd.Storage = {}));
    var Storage = Gnd.Storage;
})(Gnd || (Gnd = {}));
var Gnd;
(function (Gnd) {
    (function (Sync) {
        ;

        var Proxy = (function (_super) {
            __extends(Proxy, _super);
            function Proxy() {
                _super.apply(this, arguments);
                this.docs = {};
            }
            Proxy.prototype.observe = function (doc) {
                var key = docKey(doc);

                if (!this.docs[key]) {
                    this.docs[key] = [doc];
                    return true;
                } else {
                    this.docs[key].push(doc);
                }
            };

            Proxy.prototype.unobserve = function (doc) {
                if (!doc.isKeptSynced())
                    return;

                var key = docKey(doc), docs = this.docs[key];

                if (docs) {
                    docs = _.reject(docs, function (item) {
                        return item === doc;
                    });

                    if (docs.length === 0) {
                        delete this.docs[key];
                        return true;
                    } else {
                        this.docs[key] = docs;
                    }
                }
            };

            Proxy.prototype.notify = function (keyPath) {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 1); _i++) {
                    args[_i] = arguments[_i + 1];
                }
                var key = keyPathToKey(keyPath);
                var observers = this.docs[key];
                if (observers) {
                    for (var i = 0; i < observers.length; i++) {
                        observers[i].emit.apply(observers[i], args);
                    }
                }
            };
            return Proxy;
        })(Gnd.Base);

        function docKey(doc) {
            return keyPathToKey(doc.getKeyPath());
        }

        function keyPathToKey(keyPath) {
            return keyPath.join(':');
        }
        Sync.keyPathToKey = keyPathToKey;

        var _proxy;
        function getProxy() {
            return _proxy ? _proxy : _proxy = new Proxy();
        }
        Sync.getProxy = getProxy;
    })(Gnd.Sync || (Gnd.Sync = {}));
    var Sync = Gnd.Sync;
})(Gnd || (Gnd = {}));
var Gnd;
(function (Gnd) {
    (function (Storage) {
        var Socket = (function () {
            function Socket(socket) {
                this.socket = socket;
            }
            Socket.safeEmit = function (socket) {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 1); _i++) {
                    args[_i] = arguments[_i + 1];
                }
                var promise = new Gnd.Promise();

                function errorFn() {
                    promise.reject(Error('Socket disconnected'));
                }
                ;

                function proxyCb(err, res) {
                    socket.removeListener('disconnect', errorFn);
                    if (err) {
                        promise.reject(Error(err));
                    } else {
                        promise.resolve(res);
                    }
                }
                ;

                args.push(proxyCb);

                function emit() {
                    socket.once('disconnect', errorFn);
                    socket.emit.apply(socket, args);
                }

                function delayedEmit(connectedEvent, failedEvent) {
                    function errorFn() {
                        socket.removeListener(succeedFn, errorFn);
                        promise.reject(Error('Socket connection failed'));
                    }
                    function succeedFn() {
                        socket.removeListener(failedEvent, errorFn);
                        emit();
                    }

                    socket.once(failedEvent, errorFn);
                    socket.once(connectedEvent, succeedFn);
                }

                if (socket.socket.connected) {
                    emit();
                } else if (socket.socket.connecting) {
                    delayedEmit('connect', 'connect_failed');
                } else if (socket.socket.reconnecting) {
                    delayedEmit('reconnect', 'reconnect_failed');
                } else {
                    errorFn();
                }

                return promise;
            };

            Socket.prototype.create = function (keyPath, doc) {
                return Socket.safeEmit(this.socket, 'create', keyPath, doc);
            };

            Socket.prototype.put = function (keyPath, doc) {
                delete doc['_id'];
                return Socket.safeEmit(this.socket, 'put', keyPath, doc);
            };

            Socket.prototype.fetch = function (keyPath) {
                return Socket.safeEmit(this.socket, 'get', keyPath);
            };

            Socket.prototype.del = function (keyPath) {
                return Socket.safeEmit(this.socket, 'del', keyPath);
            };

            Socket.prototype.add = function (keyPath, itemsKeyPath, itemIds, opts) {
                return Socket.safeEmit(this.socket, 'add', keyPath, itemsKeyPath, itemIds);
            };

            Socket.prototype.remove = function (keyPath, itemsKeyPath, itemIds, opts) {
                return Socket.safeEmit(this.socket, 'remove', keyPath, itemsKeyPath, itemIds);
            };

            Socket.prototype.find = function (keyPath, query, options) {
                return Socket.safeEmit(this.socket, 'find', keyPath, query, options);
            };

            Socket.prototype.all = function (keyPath, query, opts) {
                return Socket.safeEmit(this.socket, 'all', keyPath, query, opts);
            };

            Socket.prototype.deleteItem = function (keyPath, id, opts) {
                return Socket.safeEmit(this.socket, 'deleteItem', keyPath, id, opts);
            };

            Socket.prototype.insertBefore = function (keyPath, id, itemKeyPath, opts) {
                return Socket.safeEmit(this.socket, 'insertBefore', keyPath, id, itemKeyPath, opts);
            };
            return Socket;
        })();
        Storage.Socket = Socket;
    })(Gnd.Storage || (Gnd.Storage = {}));
    var Storage = Gnd.Storage;
})(Gnd || (Gnd = {}));
var Gnd;
(function (Gnd) {
    (function (Sync) {
        var Manager = (function (_super) {
            __extends(Manager, _super);
            function Manager(socket) {
                var _this = this;
                _super.call(this);

                this.socket = socket;

                var proxy = Sync.getProxy();

                var connectFn = function () {
                    Gnd.log("Connected to socket");
                    var socket = _this.socket;

                    Gnd.log(proxy.docs);

                    _.each(proxy.docs, function (docs, id) {
                        var doc = docs[0];

                        Gnd.Storage.Socket.safeEmit(socket, 'observe', doc.getKeyPath()).then(function () {
                            Gnd.log('Observe', doc.getKeyPath().join('/'));
                        });
                    });
                };

                var updateFn = function (keyPath, args) {
                    Gnd.log("Received update", keyPath, args);
                    var key = Sync.keyPathToKey(keyPath);

                    _.each(proxy.docs[key], function (doc) {
                        doc.set(args, { nosync: true });
                    });
                };
                socket.on('update:', updateFn);

                var deleteFn = function (keyPath) {
                    Gnd.log("Received delete", keyPath);
                    var key = Sync.keyPathToKey(keyPath);
                    _.each(proxy.docs[key], function (doc) {
                        doc.emit('deleted:', doc);
                    });
                };

                socket.on('delete:', deleteFn);
                var addFn = function (keyPath, itemsKeyPath, itemIds) {
                    Gnd.log("Received add", arguments);
                    proxy.notify(keyPath, 'add:', itemsKeyPath, itemIds);
                };
                socket.on('add:', addFn);

                var removeFn = function (keyPath, itemsKeyPath, itemIds) {
                    Gnd.log("Received remove", arguments);
                    proxy.notify(keyPath, 'remove:', itemsKeyPath, itemIds);
                };
                socket.on('remove:', removeFn);

                var insertBeforeFn = function (keyPath, id, itemKeyPath, refId) {
                    Gnd.log("Received insert", arguments);
                    proxy.notify(keyPath, 'insertBefore:', id, itemKeyPath, refId);
                };
                socket.on('insertBefore:', insertBeforeFn);

                var deleteItemFn = function (keyPath, id) {
                    Gnd.log("Received deleteItem", arguments);
                    proxy.notify(keyPath, 'deleteItem:', id);
                };
                socket.on('deleteItem:', deleteItemFn);

                socket.on('ready', connectFn);

                this.cleanUpFn = function () {
                    socket.removeListener('ready', connectFn);

                    socket.removeListener('update:', updateFn);
                    socket.removeListener('delete:', deleteFn);
                    socket.removeListener('add:', addFn);
                    socket.removeListener('remove:', removeFn);
                    socket.removeListener('insertBefore', insertBeforeFn);
                    socket.removeListener('deleteItem', deleteItemFn);
                };
            }
            Manager.prototype.destroy = function () {
                this.cleanUpFn();
                _super.prototype.destroy.call(this);
            };

            Manager.prototype.observe = function (doc) {
                if (Sync.getProxy().observe(doc)) {
                    this.start(doc.getKeyPath());
                }
            };

            Manager.prototype.unobserve = function (doc) {
                if (Sync.getProxy().unobserve(doc)) {
                    this.stop(doc.getKeyPath());
                }
            };

            Manager.prototype.start = function (keyPath) {
                Gnd.Storage.Socket.safeEmit(this.socket, 'observe', keyPath).then(function () {
                    Gnd.log('Started observing', keyPath);
                });
            };

            Manager.prototype.stop = function (keyPath) {
                Gnd.Storage.Socket.safeEmit(this.socket, 'unobserve', keyPath).then(function () {
                    Gnd.log('Stopped observing', keyPath);
                });
            };
            return Manager;
        })(Gnd.Base);
        Sync.Manager = Manager;
    })(Gnd.Sync || (Gnd.Sync = {}));
    var Sync = Gnd.Sync;
})(Gnd || (Gnd = {}));
var Gnd;
(function (Gnd) {
    var window = typeof window === 'undefined' ? {} : window;

    var defaults = {
        template: function (str) {
            return _.template(str);
        },
        localStorage: null,
        remoteStorage: null,
        storageQueue: null,
        memStorage: (new Gnd.Storage.Local(new Gnd.Storage.Store.MemoryStore())),
        historyApi: !!(window.history && window.history.pushState)
    };

    var Using = (function (_super) {
        __extends(Using, _super);
        function Using() {
            var _this = this;
            _super.call(this);

            _.each(defaults, function (value, key) {
                _this[key] = value;
            });
        }
        Using.prototype.destroy = function () {
            Gnd.Base.release(this.storageQueue, this.syncManager);
            _super.prototype.destroy.call(this);
        };
        return Using;
    })(Gnd.Base);
    Gnd.Using = Using;
    ;

    Gnd.using = new Using();

    Gnd.use = {
        template: function (templFn) {
            Gnd.using.template = templFn;
        },
        storage: {
            local: function (storage) {
                Gnd.using.localStorage = storage;
                Gnd.using.storageQueue = new Gnd.Storage.Queue(storage, Gnd.using.remoteStorage);
            },
            remote: function (storage) {
                Gnd.using.remoteStorage = storage;
                if (Gnd.using.localStorage) {
                    Gnd.using.storageQueue = new Gnd.Storage.Queue(Gnd.using.localQueue, storage);
                }
            },
            mem: function (storage) {
                Gnd.using.memStorage = storage;
            }
        },
        storageQueue: function (localStorage, remoteStorage) {
            Gnd.using.storageQueue = new Gnd.Storage.Queue(localStorage, remoteStorage);
        },
        historyApi: function (use) {
            Gnd.using.historyApi = use;
        },
        syncManager: function (socket) {
            Gnd.Base.release(Gnd.using.syncManager);
            Gnd.using.syncManager = new Gnd.Sync.Manager(socket);
        }
    };
})(Gnd || (Gnd = {}));
var Gnd;
(function (Gnd) {
    var CollectionSchemaType = (function (_super) {
        __extends(CollectionSchemaType, _super);
        function CollectionSchemaType(model, bucket) {
            _super.call(this, { type: Collection, ref: { model: model, bucket: bucket || model.__bucket } });
        }
        CollectionSchemaType.prototype.toObject = function (obj) {
        };

        CollectionSchemaType.prototype.fromObject = function (arg) {
        };

        CollectionSchemaType.prototype.get = function (model, args, opts) {
            var def = this.definition;
            return model.all(def.ref.model, args || {}, def.ref.bucket);
        };
        CollectionSchemaType.type = Collection;
        return CollectionSchemaType;
    })(Gnd.SchemaType);
    Gnd.CollectionSchemaType = CollectionSchemaType;

    var Collection = (function (_super) {
        __extends(Collection, _super);
        function Collection(model, opts, parent, items) {
            var _this = this;
            _super.call(this, model, opts, parent, items);
            this.resyncMutex = Gnd.Mutex();
            this.sortOrder = 'asc';

            var _this = this;
            this.updateFn = function (args) {
                if (_this.sortByFn) {
                    var index = _this['indexOf'](this);
                    _this.items.splice(index, 1);
                    _this.sortedAdd(this);
                }
                _this.emit('updated:', this, args);
            };

            this.deleteFn = function (model) {
                _this.remove(model.id(), false);
            };

            this.on('sortByFn sortOrder', function (fn) {
                var oldItems = _this.items;
                if (_this.sortByFn) {
                    _this.items = _this['sortBy'](_this.sortByFn);
                }
                (_this.sortOrder == 'desc') && _this.items.reverse();
                _this.emit('sorted:', _this.items, oldItems);
            });

            this.initItems(this.items);

            if (parent && parent.isKeptSynced()) {
                this.keepSynced();
            }

            var keyPath = this.getKeyPath();
            if (keyPath && !this.opts.nosync) {
                var useRemote = !parent || parent.isPersisted();
                this.retain();
                Gnd.using.storageQueue.find(keyPath, opts.query, { noremote: !useRemote }).then(function (result) {
                    _this.resync(result[0]);
                    result[1].then(function (items) {
                        return _this.resync(items);
                    }).ensure(function () {
                        _this.resolve(_this);
                        _this.release();
                    });
                });
            } else {
                this.resolve(this);
            }
        }
        Collection.prototype.destroy = function () {
            this.unlink();
            _super.prototype.destroy.call(this);
        };

        Collection.prototype.findById = function (id) {
            return this['find'](function (item) {
                return item.id() == id;
            });
        };

        Collection.prototype.add = function (items, opts) {
            var _this = this;
            return Gnd.Promise.map(items, function (item) {
                return _this.addItem(item, opts).then(function () {
                    return _this._keepSynced && !item._keepSynced && item.keepSynced();
                });
            });
        };

        Collection.prototype.remove = function (itemIds, opts) {
            var _this = this;
            var items = this.items, keyPath = this.getKeyPath();

            return Gnd.Promise.map(itemIds, function (itemId) {
                var item = _this.findById(itemId);

                if (item) {
                    items.splice(_.indexOf(items, item), 1);

                    item.off('changed:', _this.updateFn);
                    item.off('deleted:', _this.deleteFn);

                    _this.set('count', items.length);
                    _this.emit('removed:', item);

                    opts = Gnd.Util.extendClone(_this.opts, opts);

                    item.autorelease();

                    if ((!opts || !opts.nosync) && keyPath) {
                        var itemKeyPath = _.initial(item.getKeyPath());
                        var ids = {};
                        ids[item.cid()] = false;
                        ids[item.id()] = true;
                        return _this.storageQueue.remove(keyPath, itemKeyPath, ids, opts);
                    }
                }
                return new Gnd.Promise(true);
            });
        };

        Collection.prototype.toggleSortOrder = function () {
            this['set']('sortOrder', this.sortOrder == 'asc' ? 'desc' : 'asc');
        };

        Collection.prototype.link = function (target, fn) {
            if (this.linkTarget) {
                this.unlink();
            }

            this.linkAddFn = function (item) {
                fn('added:', item);
            };
            this.linkRemoveFn = function (item) {
                fn('removed:', item);
            };
            this.linkUpdateFn = function (item, fields) {
                fn('updated:', item, fields);
            };

            this.linkTarget = target;

            target.on('added:', this.linkAddFn).on('removed:', this.linkRemoveFn).on('updated:', this.linkUpdateFn);

            target['each'](this.linkAddFn);
        };

        Collection.prototype.unlink = function () {
            if (this.linkTarget) {
                this.linkTarget.off('added:', this.linkAddFn);
                this.linkTarget.off('removed:', this.linkRemoveFn);
                this.linkTarget.off('updated:', this.linkUpdateFn);
            }

            this.linkAddFn = this.linkRemoveFn = this.linkUpdateFn = null;
        };

        Collection.prototype.addPersistedItem = function (item) {
            var keyPath = this.getKeyPath();
            if (keyPath) {
                var itemKeyPath = _.initial(item.getKeyPath());

                return this.storageQueue.add(keyPath, itemKeyPath, [item.id()], {});
            } else {
                return Gnd.Promise.resolved();
            }
        };

        Collection.prototype.addItem = function (item, opts) {
            var _this = this;
            if (this.findById(item.id()))
                return new Gnd.Promise().resolve();

            if (this.sortByFn) {
                this.sortedAdd(item);
            } else {
                this.items.push(item);
            }

            this.initItems(item);

            this.set('count', this.items.length);
            this.emit('added:', item);

            opts = Gnd.Util.extendClone(this.opts, opts);

            if (!opts || (opts.nosync !== true)) {
                if (item.isPersisted() || item._persisting) {
                    return this.addPersistedItem(item);
                } else {
                    return item.save().then(function () {
                        return _this.addPersistedItem(item);
                    });
                }
            }
            return Gnd.Promise.resolved();
        };

        Collection.prototype.sortedAdd = function (item) {
            (this.sortOrder == 'desc') && this.items.reverse();
            var i = this['sortedIndex'](item, this.sortByFn);
            this.items.splice(i, 0, item);
            (this.sortOrder == 'desc') && this.items.reverse();
            return i;
        };

        Collection.prototype.startSync = function () {
            var _this = this;
            _super.prototype.startSync.call(this);

            this.on('add:', function (itemsKeyPath, itemIds) {
                Gnd.Promise.map(itemIds, function (itemId) {
                    if (!_this.findById(itemId)) {
                        return _this.model.findById(itemsKeyPath.concat(itemId), true, {}).then(function (item) {
                            item.release();
                            return _this.addItem(item, { nosync: true });
                        });
                    }
                    return new Gnd.Promise(true);
                });
            });

            this.on('remove:', function (itemsKeyPath, itemId) {
                _this.remove(itemId, { nosync: true });
            });
        };

        Collection.prototype.resync = function (items) {
            var _this = this;
            return this.resyncMutex(function () {
                var itemsToRemove = [], itemsToAdd = [];

                _this['each'](function (item) {
                    var id = item.id(), shouldRemove = true;
                    for (var i = 0; i < items.length; i++) {
                        if (id == items[i]._id) {
                            item.resync(items[i]);
                            shouldRemove = false;
                            break;
                        }
                    }
                    shouldRemove && itemsToRemove.push(id);
                });

                _.each(items, function (item) {
                    if (!_this.findById(item._id))
                        itemsToAdd.push(item);
                });

                return _this.remove(itemsToRemove, { nosync: true }).then(function () {
                    return _.map(_.unique(itemsToAdd), function (args) {
                        return (_this.model).create(args, _this.autosync()).autorelease();
                    });
                }).then(function (models) {
                    return _this.add(models, { nosync: true });
                }).then(function () {
                    _this.emit('resynced:');
                });
            });
        };
        return Collection;
    })(Gnd.Container);
    Gnd.Collection = Collection;

    var methods = [
        'forEach',
        'each',
        'map',
        'reduce',
        'reduceRight',
        'find',
        'findWhere',
        'detect',
        'pluck',
        'filter',
        'select',
        'reject',
        'every',
        'all',
        'some',
        'any',
        'include',
        'contains',
        'invoke',
        'max',
        'min',
        'sortBy',
        'sortedIndex',
        'toArray',
        'size',
        'first',
        'rest',
        'last',
        'without',
        'indexOf',
        'lastIndexOf',
        'isEmpty',
        'groupBy'
    ];

    _.each(methods, function (method) {
        Collection.prototype[method] = function () {
            return _[method].apply(_, [this.items].concat(_.toArray(arguments)));
        };
    });
})(Gnd || (Gnd = {}));
var Gnd;
(function (Gnd) {
    var ModelDepot = (function () {
        function ModelDepot() {
            this.models = {};
        }
        ModelDepot.prototype.getModel = function (ModelClass, args, autosync, keyPath) {
            var model;
            var fetch = true;

            if (!keyPath) {
                fetch = false;

                if (args['_cid'] || args['_id']) {
                    keyPath = [ModelClass.__bucket, args['_cid'] || args['_id']];
                }
            }

            model = Model.__useDepot && keyPath ? this.models[this.key(keyPath)] : null;

            if (!model) {
                model = new ModelClass(_.extend({}, keyPath && { _cid: keyPath[1] }, args), { fetch: fetch, autosync: autosync });
                this.setModel(model);
                model.autorelease();
            } else {
                autosync && model.keepSynced();
            }

            return model.retain();
        };

        ModelDepot.prototype.key = function (keyPath) {
            return keyPath.join('/');
        };

        ModelDepot.prototype.setModel = function (model) {
            var _this = this;
            var models = this.models;

            var remoteKeyPath;
            var localKeyPath = this.key([model.bucket(), model.cid()]);

            models[localKeyPath] = model;

            model.whenPersisted().then(function () {
                remoteKeyPath = _this.key(model.getKeyPath());
                models[remoteKeyPath] = model;
            });

            model.once('destroy: deleted:', function () {
                delete models[localKeyPath];
                remoteKeyPath && delete models[remoteKeyPath];
            });
        };
        return ModelDepot;
    })();

    var modelDepot = new ModelDepot();

    var ModelSchemaType = (function (_super) {
        __extends(ModelSchemaType, _super);
        function ModelSchemaType(model) {
            _super.call(this, { type: model });
        }
        ModelSchemaType.prototype.fromObject = function (args, opts) {
            if (args instanceof this.definition.type) {
                return args;
            } else if (_.isString(args)) {
                return this.definition.type.findById(args, opts && opts.autosync);
            } else if (args.module) {
                return new ModelProxy(args, args.module);
            }
            return this.definition.type.create(args, opts && opts.autosync);
        };

        ModelSchemaType.prototype.toObject = function (obj) {
            if (obj instanceof ModelProxy) {
                return obj.model.toArgs();
            } else {
                return obj.toArgs();
            }
        };
        ModelSchemaType.type = Model;
        return ModelSchemaType;
    })(Gnd.SchemaType);
    Gnd.ModelSchemaType = ModelSchemaType;

    var ModelProxy = (function (_super) {
        __extends(ModelProxy, _super);
        function ModelProxy(modelOrArgs, classUrl) {
            var _this = this;
            _super.call(this);

            if (modelOrArgs instanceof Gnd.Base) {
                this.model = modelOrArgs;
                this.resolve(modelOrArgs);
            } else {
                var args = modelOrArgs;
                _.extend(this, args);
                curl([classUrl]).then(function (modelClass) {
                    var fn = _.bind(_.omit, _, _this);
                    var args = fn.apply(_this, _.functions(_this));
                    _this.model = modelClass.create ? modelClass.create(args) : new modelClass(args);
                    _this.model.on('*', function () {
                        _this.emit.apply(_this, arguments);
                    });
                    _this.resolve(_this.model);
                }, function (err) {
                    return _this.reject(err);
                });
            }
        }
        ModelProxy.prototype.get = function (keypath) {
            return this.model ? this.model.get(keypath) : _super.prototype.get.call(this, keypath);
        };

        ModelProxy.prototype.set = function (keyOrObj, val, opts) {
            this.model ? this.model.set(keyOrObj, val, opts) : _super.prototype.set.call(this, keyOrObj, val, opts);
            return this;
        };
        return ModelProxy;
    })(Gnd.Promise);
    Gnd.ModelProxy = ModelProxy;

    var Model = (function (_super) {
        __extends(Model, _super);
        function Model(args, bucket, opts) {
            var _this = this;
            _super.call(this);
            this.__rev = 0;
            this._dirty = true;
            this._keepSynced = false;

            args = args || {};
            if (!this.__strict) {
                _.extend(this, args);
            }
            _.extend(this, this.__schema.fromObject(args));

            this._cid = this._id || this._cid || Gnd.Util.uuid();

            this.opts = (_.isString(bucket) ? opts : bucket) || {};
            this.__bucket = _.isString(bucket) ? bucket : null;

            this.on('changed:', function () {
                return _this._dirty = true;
            });

            this._storageQueue = Gnd.using.storageQueue || new Gnd.Storage.Queue(Gnd.using.memStorage);

            if (!this.isPersisted()) {
                this._storageQueue.once('created:' + this.id(), function (id) {
                    return _this.id(id);
                });
            }

            var keyPath = this.getKeyPath();
            if (this.opts.fetch) {
                this._persisting = true;
                this.retain();
                Gnd.using.storageQueue.fetch(keyPath).then(function (result) {
                    _this.resync(result[0]);
                    result[1].then(function (doc) {
                        return _this.resync(doc);
                    }).ensure(function () {
                        _this.resolve(_this);
                        _this.release();
                    });
                }, function (err) {
                    _this.reject(err).ensure(function () {
                        return _this.release();
                    });
                });
            } else {
                this.resolve(this);
            }

            this.opts.autosync && this.keepSynced();
        }
        Model.schema = function () {
            return this.__schema;
        };

        Model.prototype.resync = function (args) {
            var strictArgs = this.__strict ? this.__schema.fromObject(args) : args;
            this.set(strictArgs, { nosync: true });
        };

        Model.extend = function (bucket, schema) {
            var _this = this;
            var _super = this;

            function __(args, _bucket, opts) {
                var constructor = this.constructor;
                this.__schema = this.__schema || __['__schema'];
                this.__strict = this.__strict || __['__strict'];
                _super.call(this, args, bucket || _bucket, opts || _bucket);

                if (constructor && (_super != constructor)) {
                    constructor.call(this, args);
                }
            }
            ;

            Gnd.Util.inherits(__, this);

            var statics = [
                'schema',
                'extend',
                'create',
                'findById',
                'find',
                'all',
                'seq',
                'fromJSON',
                'fromArgs'
            ];

            _.each(statics, function (method) {
                return __[method] = _this[method];
            });

            _.extend(__, {
                __schema: Gnd.Schema.extend(this.__schema, schema),
                __bucket: bucket,
                __strict: !!schema
            });

            return __;
        };

        Model.create = function (args, autosync) {
            return Gnd.overload({
                'Object Boolean': function (args, autosync) {
                    return modelDepot.getModel(this, args, autosync);
                },
                'Object': function (args) {
                    return this.create(args, false);
                },
                'Boolean': function (autosync) {
                    return this.create({}, autosync);
                },
                '': function () {
                    return this.create({});
                }
            }).apply(this, arguments);
        };

        Model.findById = function (keyPathOrId, autosync, args) {
            return Gnd.overload({
                'Array Boolean Object': function (keyPath, autosync, args) {
                    return modelDepot.getModel(this, args, autosync, keyPath);
                },
                'String Boolean Object': function (id, autosync, args) {
                    return this.findById([this.__bucket, id], autosync, args);
                },
                'String Boolean': function (id, autosync) {
                    return this.findById(id, autosync, {});
                },
                'String Object': function (id, args) {
                    return this.findById(id, false, args);
                },
                'String': function (id) {
                    return this.findById(id, false, {});
                }
            }).apply(this, arguments);
        };

        Model.removeById = function (keypathOrId) {
            var keyPath = _.isArray(keypathOrId) ? keypathOrId : [this.__bucket, keypathOrId];
            return Gnd.using.storageQueue.del(keyPath, {});
        };

        Model.fromJSON = function (args, opts) {
            return new this(args, opts);
        };

        Model.fromArgs = function (args, opts) {
            return this.fromJSON(args, opts);
        };

        Model.prototype.destroy = function () {
            Gnd.using.syncManager && Gnd.using.syncManager.unobserve(this);
            _super.prototype.destroy.call(this);
        };

        Model.prototype.init = function () {
            return new Gnd.Promise(this);
        };

        Model.prototype.id = function (id) {
            if (id) {
                this._id = id;

                this.isPersisted() && this.emit('persisted:');

                this.emit('id', id);
            }
            return this._id || this._cid;
        };

        Model.prototype.cid = function () {
            return this._cid;
        };

        Model.prototype.get = function (key, args, opts) {
            var value = _super.prototype.get.call(this, key);
            if (_.isUndefined(value)) {
                value = this.__schema.get(this, key, args, opts);
                if (!_.isUndefined(value))
                    this[key] = value;
            }
            return value;
        };

        Model.prototype.getName = function () {
            return "Model";
        };

        Model.prototype.getKeyPath = function () {
            return [this.__bucket, this.id()];
        };

        Model.prototype.getLocalKeyPath = function () {
            return [this.__bucket, this.cid()];
        };

        Model.prototype.isKeptSynced = function () {
            return this._keepSynced;
        };

        Model.prototype.isAutosync = function () {
            return this._keepSynced;
        };

        Model.prototype.isPersisted = function () {
            return this.id().toString().indexOf('cid') !== 0;
        };

        Model.prototype.whenPersisted = function () {
            var promise = new Gnd.Promise();
            if (this.isPersisted()) {
                promise.resolve();
            } else {
                this.once('persisted:', function () {
                    return promise.resolve();
                });
            }
            return promise;
        };

        Model.prototype.bucket = function () {
            return this.__bucket;
        };

        Model.prototype.save = function () {
            return this.update(this.toArgs());
        };

        Model.prototype.update = function (args) {
            var _this = this;
            var bucket = this.__bucket, id = this.id();

            if (!this._dirty)
                return Gnd.Promise.resolved();

            if (this.isPersisted() || this._persisting) {
                return this._storageQueue.put([bucket, id], args, {}).then(function () {
                    _this.emit('updated:', _this, args);
                });
            } else {
                args['_persisting'] = this._persisting = true;
                this._storageQueue.once('created:' + id, function (id) {
                    _this.id(id);
                });
                Gnd.Util.merge(this, args);
                return this._storageQueue.create([bucket], args, {});
            }
        };

        Model.prototype.remove = function () {
            var _this = this;
            return Model.removeById(this.getKeyPath()).then(function () {
                Gnd.using.syncManager && Gnd.using.syncManager.unobserve(_this);
                _this.emit('deleted:', _this);
            });
        };

        Model.prototype.autosync = function (enable) {
            if (enable)
                this.keepSynced(); else {
            }
            return this.isAutosync();
        };

        Model.prototype.keepSynced = function () {
            var _this = this;
            if (this._keepSynced)
                return this;

            this._keepSynced = true;

            this.whenPersisted().then(function () {
                Gnd.using.syncManager && Gnd.using.syncManager.observe(_this);
            });

            this.on('changed:', function (doc, options) {
                if (!options || ((!options.nosync) && !_.isEqual(doc, options.doc))) {
                    _this.update(doc);
                }
            });
            return this;
        };

        Model.prototype.toArgs = function () {
            return _.extend(this.__strict ? {} : this._toArgs(this), this.__schema.toObject(this));
        };

        Model.prototype._toArgs = function (obj) {
            var args = {};
            _.forIn(obj, function (value, key) {
                if (!_.isObject(value) && !_.isFunction(value) && key[0] != '_') {
                    args[key] = value;
                }
                ;
            });
            return args;
        };

        Model.find = function (query) {
            var opts = {
                key: this.__bucket,
                query: query || {}
            };
            return Gnd.Container.create(Gnd.Collection, this, opts);
        };

        Model.all = function (parent, argsOrKeypath, bucket) {
            var _this = this;
            var allInstances = function (parent, keyPath, args) {
                return Gnd.Container.create(Gnd.Collection, _this, { key: _.last(keyPath) }, parent);
            };

            return Gnd.overload({
                'Model Array Object': function (parent, keyPath, args) {
                    return allInstances(parent, keyPath, args);
                },
                'Model Object String': function (parent, args, bucket) {
                    var keyPath = parent.getKeyPath();
                    keyPath.push(bucket);
                    return allInstances(parent, keyPath, args);
                },
                'Model': function (parent) {
                    return this.all(parent, {}, this.__bucket);
                },
                'Model String': function (parent, bucket) {
                    return this.all(parent, {}, bucket);
                },
                '': function (parent) {
                    return allInstances(null, [this.__bucket], {});
                }
            }).apply(this, arguments);
        };

        Model.prototype.all = function (model, args, bucket) {
            return model.all(this, args, bucket);
        };

        Model.seq = function (parent, args, bucket) {
            var _this = this;
            var allInstances = function (parent, keyPath, args) {
                return Gnd.Container.create(Gnd.Sequence, _this, { key: _.last(keyPath) }, parent);
            };

            return Gnd.overload({
                'Model Array Object': function (parent, keyPath, args) {
                    return allInstances(parent, keyPath, args);
                },
                'Model Object String': function (parent, args, bucket) {
                    var keyPath = parent.getKeyPath();
                    keyPath.push(bucket);
                    return allInstances(parent, keyPath, args);
                },
                'Model String': function (parent, bucket) {
                    return this.seq(parent, {}, bucket);
                },
                'Model': function (parent) {
                    return this.seq(parent, {}, this.__bucket);
                }
            }).apply(this, arguments);
        };

        Model.prototype.seq = function (model, args, bucket) {
            return model.seq(this, args, bucket);
        };
        Model.__useDepot = true;

        Model.__schema = new Gnd.Schema({
            _cid: String,
            _id: Gnd.Schema.ObjectId,
            _persisting: Boolean
        });
        return Model;
    })(Gnd.Promise);
    Gnd.Model = Model;

    Model.prototype.id['isVirtual'] = true;
})(Gnd || (Gnd = {}));
var Gnd;
(function (Gnd) {
    function $(selectorOrElement, context) {
        var ctx = context ? $(context)[0] : document;

        var query = new Query(), el, push = function (elements) {
            for (var i = 0; i < elements.length; i++) {
                query[i] = elements[i];
            }
            query.length = elements.length;
        };

        if (_.isString(selectorOrElement)) {
            var selector = selectorOrElement;

            switch (selector[0]) {
                case '#':
                    var id = selector.slice(1);
                    el = document.getElementById(id);
                    if (el && el.parentNode) {
                        if (el.id === id) {
                            push([el]);
                        }
                    }
                    break;
                case '.':
                    var className = selector.slice(1);
                    push(ctx.getElementsByClassName(className));
                    break;
                case '<':
                    push([makeElement(selector)]);
                    break;
                default:
                    push((selector != 'document' ? ctx.getElementsByTagName(selector) : [document]));
            }
        } else if (_.isArray(selectorOrElement)) {
            push(selectorOrElement);
        } else {
            push([selectorOrElement]);
        }
        return query;
    }
    Gnd.$ = $;

    var Query = (function () {
        function Query() {
        }
        Query.prototype.append = function (content) {
            _.each(this, function (parent) {
                _.each($(content), function (child) {
                    parent.appendChild(child);
                });
            });
            return this;
        };

        Query.prototype.appendTo = function (target) {
            return $(target).append(this);
        };

        Query.prototype.on = function (eventNames, handler) {
            var _this = this;
            _.each(eventNames.split(' '), function (eventName) {
                _.each(_this, function (el) {
                    if (el.addEventListener) {
                        el.addEventListener(eventName, handler);
                    } else if (el['attachEvent']) {
                        el['attachEvent']("on" + eventName, handler);
                    }
                });
            });
            return this;
        };

        Query.prototype.one = function (eventNames, handler) {
            var _this = this;
            var wrapper = function (evt) {
                handler(evt);
                _this.off(eventNames, wrapper);
            };
            return this.on(eventNames, wrapper);
        };

        Query.prototype.off = function (eventNames, handler) {
            var _this = this;
            _.each(eventNames.split(' '), function (eventName) {
                _.each(_this, function (el) {
                    if (el.removeEventListener) {
                        el.removeEventListener(eventName, handler);
                    } else if (el['detachEvent']) {
                        el['detachEvent']("on" + eventName, handler);
                    }
                });
            });
            return this;
        };

        Query.prototype.trigger = function (eventNames) {
            var _this = this;
            _.each(eventNames.split(' '), function (eventName) {
                _.each(_this, function (element) {
                    if (document.createEventObject) {
                        var evt = document.createEventObject();
                        element.fireEvent('on' + eventName, evt);
                    } else {
                        var msEvent = document.createEvent("HTMLEvents");
                        msEvent.initEvent(eventName, true, true);
                        !element.dispatchEvent(msEvent);
                    }
                });
            });
            return this;
        };

        Query.prototype.attr = function (attr, value) {
            if (!_.isUndefined(value)) {
                _.each(this, function (el) {
                    setAttr(el, attr, value);
                });
                return this;
            } else {
                return getAttr(this[0], attr);
            }
        };

        Query.prototype.css = function (styles) {
            _.each(this, function (el) {
                return el.style && _.extend(el.style, styles);
            });
            return this;
        };

        Query.prototype.show = function () {
            _.each(this, function (el) {
                return show(el);
            });
            return this;
        };

        Query.prototype.hide = function () {
            _.each(this, function (el) {
                return hide(el);
            });
            return this;
        };

        Query.prototype.text = function (text) {
            var el = this[0];
            if (el.textContent) {
                if (_.isUndefined(text))
                    return el.textContent;
                _.each(this, function (el) {
                    return el.textContent = text;
                });
            } else {
                if (_.isUndefined(text))
                    return el.innerText;
                _.each(this, function (el) {
                    return el.innerText = text;
                });
            }
            return this;
        };

        Query.prototype.html = function (html) {
            if (_.isUndefined(html))
                return this[0].innerHTML;
            _.each(this, function (el) {
                return el.innerHTML = html;
            });
            return this;
        };

        Query.prototype.remove = function () {
            var _this = this;
            _.each(this, function (el) {
                return _this.removeNode(el);
            });
            return this;
        };

        Query.prototype.empty = function () {
            _.each(this, function (el) {
                while (el.hasChildNodes()) {
                    el.removeChild(el.lastChild);
                }
            });
            return this;
        };

        Query.prototype.addClass = function (classNames) {
            _.each(this, function (el) {
                var oldClassNames = _.compact(el.className.split(' '));
                el.className = _.union(oldClassNames, classNames.split(' ')).join(' ');
            });
            return this;
        };

        Query.prototype.removeClass = function (classNames) {
            _.each(this, function (el) {
                var oldClassNames = _.compact(el.className.split(' '));
                el.className = _.difference(oldClassNames, classNames.split(' ')).join(' ');
            });
            return this;
        };

        Query.prototype.rect = function () {
            if (this[0])
                return this[0].getBoundingClientRect();
        };

        Query.prototype.parent = function () {
            return $(_.map(this, function (el) {
                return el.parentNode;
            }));
        };

        Query.prototype.removeNode = function (el) {
            el.parentNode.removeChild(el);
        };
        return Query;
    })();
    Gnd.Query = Query;

    function isElement(object) {
        return object && object.nodeType === Node.ELEMENT_NODE;
    }
    Gnd.isElement = isElement;

    function makeElement(html) {
        var child, container = document.createElement("div"), fragment = document.createDocumentFragment();

        container.innerHTML = html;

        while (child = container.firstChild) {
            fragment.appendChild(child);
        }

        return fragment;
    }
    Gnd.makeElement = makeElement;

    function setAttr(el, attr, value) {
        if (!_.isUndefined(el[attr])) {
            el[attr] = value;
        }
        if (value) {
            el.setAttribute(attr, value);
        } else {
            el.removeAttribute(attr);
        }
    }
    Gnd.setAttr = setAttr;

    function getAttr(el, attr) {
        if (!_.isUndefined(el[attr])) {
            return el[attr];
        } else {
            var val = el.getAttribute(attr);
            switch (val) {
                case 'true':
                    return true;
                case null:
                case 'false':
                    return false;
                default:
                    return val;
            }
        }
    }
    Gnd.getAttr = getAttr;

    function show(el) {
        el['style'].display = getAttr(el, 'data-display') || 'block';
    }
    Gnd.show = show;

    function hide(el) {
        var oldDisplay = el['style'].display;
        (oldDisplay != 'none') && setAttr(el, 'data-display', oldDisplay);
        el['style'].display = 'none';
    }
    Gnd.hide = hide;

    function serialize(obj) {
        var str = [];
        for (var p in obj)
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        return str.join("&");
    }
    Gnd.serialize = serialize;
})(Gnd || (Gnd = {}));

var Gnd;
(function (Gnd) {
    (function (Ajax) {
        function get(url, obj) {
            return base('GET', url, obj);
        }
        Ajax.get = get;

        function put(url, obj) {
            return base('PUT', url, obj);
        }
        Ajax.put = put;

        function post(url, obj) {
            return base('POST', url, obj);
        }
        Ajax.post = post;

        function del(url, obj) {
            return base('DELETE', url, obj);
        }
        Ajax.del = del;

        function getXhr() {
            for (var i = 0; i < 4; i++) {
                try  {
                    return i ? new ActiveXObject([, "Msxml2", "Msxml3", "Microsoft"][i] + ".XMLHTTP") : new XMLHttpRequest();
                } catch (e) {
                }
            }
        }

        function base(method, url, obj) {
            var promise = new Gnd.Promise();

            var xhr = getXhr();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    xhr.onreadystatechange = null;
                    if (xhr.status >= 200 && xhr.status < 300) {
                        var res;
                        try  {
                            res = JSON.parse(xhr.responseText || {});
                        } catch (e) {
                        }
                        ;
                        promise.resolve(res);
                    } else {
                        var err = new Error("Ajax Error: " + xhr.responseText);
                        err['status'] = xhr.status;
                        promise.reject(err);
                    }
                } else {
                }
            };
            xhr.open(method, url);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(obj || {}));

            return promise;
        }
    })(Gnd.Ajax || (Gnd.Ajax = {}));
    var Ajax = Gnd.Ajax;
})(Gnd || (Gnd = {}));

var Gnd;
(function (Gnd) {
    var keyMapping = {
        'backspace': 8,
        'enter': 13,
        'caps': 20,
        'esc': 27,
        'space': 32,
        'left': 37,
        'right': 38,
        'up': 39,
        'down': 40,
        'ctrl': 17,
        'alt': 18,
        'window': 91,
        'cmd': 91,
        'shift': 16,
        'tab': 9
    };

    var modifiers = {
        'shiftKey': 16,
        'ctrlKey': 17,
        'altKey': 18,
        'metaKey': 91
    };

    function keypressed(str, cb) {
        var callbacks = [];
        var keys = [];

        if (_.isString(str)) {
            _.each(str.split(''), function (c) {
                keys.push(c.toUpperCase().charCodeAt(0));
            });
        } else {
            cb = str;
        }

        cb && callbacks.push(cb);

        var handleEvent = function (evtOrEl, evt) {
            var pressed = [];

            evt = !_.isUndefined(evtOrEl.which) ? evtOrEl : evt;

            for (var modifier in modifiers) {
                evt[modifier] && pressed.push(modifiers[modifier]);
            }

            pressed.push(evt.which);
            pressed = _.unique(pressed);

            if (pressed.length === keys.length && !_.difference(keys, pressed).length) {
                _.each(callbacks, function (cb) {
                    return cb(evt);
                });
            }
        };

        _.each(keyMapping, function (keyCode, key) {
            return handleEvent[key] = function (cb) {
                cb && callbacks.push(cb);
                keys.push(keyCode);
                return handleEvent;
            };
        });

        return handleEvent;
    }
    Gnd.keypressed = keypressed;
})(Gnd || (Gnd = {}));
var Gnd;
(function (Gnd) {
    var Session = (function (_super) {
        __extends(Session, _super);
        function Session() {
            _super.apply(this, arguments);
        }
        Session.login = function (loginId, passwd) {
            this.loginId = loginId;
            return Gnd.Ajax.post(Session.url, { username: loginId, password: passwd });
        };

        Session.logout = function () {
            return Gnd.Ajax.del(Session.url);
        };

        Session.authenticated = function () {
            return Gnd.Ajax.get(Session.url);
        };
        Session.url = '/sessions/';
        return Session;
    })(Gnd.Base);
    Gnd.Session = Session;
})(Gnd || (Gnd = {}));
var Gnd;
(function (Gnd) {
    var View = (function (_super) {
        __extends(View, _super);
        function View(args) {
            _super.call(this);
            this.refreshMutex = Gnd.Mutex();
            this.children = [];

            args = args || {};
            args.templateEngine = args.templateEngine || Gnd.using.template || Gnd.Util.noop;

            if ((args.templateUrl || args.templateStr) && !args.templateEngine) {
                throw Error('Template engine required');
            }

            _.extend(this, args);

            this.onShowing = this.onHidding = function (el, args, done) {
                return done();
            };
        }
        View.fetchTemplate = function (templateUrl, cssUrl) {
            var items = [], promise = new Gnd.Promise();

            templateUrl && items.push('text!' + templateUrl);
            cssUrl && items.push('css!' + cssUrl);

            try  {
                curl(items, function (templ) {
                    promise.resolve(templ);
                });
            } catch (err) {
                promise.reject(err);
            }

            return promise;
        };

        View.prototype.destroy = function () {
            this.clean();
            _super.prototype.destroy.call(this);
        };

        View.prototype.parent = function (selector, parent) {
            this.selector = selector;

            if (parent) {
                var oldParent = this._parent;
                oldParent && oldParent.removeChild(this);
                this._parent = parent;
                parent.children.push(this);
            }
            return this;
        };

        View.prototype.removeChild = function (child) {
            this.children = _.without(this.children, child);
        };

        View.prototype.render = function (context) {
            var _this = this;
            context = context || {};

            return this.init().then(function () {
                var html;

                if (_this.template) {
                    html = _this.template(context);
                } else {
                    html = _this.html || '<div>';
                }

                _this.fragment = Gnd.$(html)[0];

                if (!_this.fragment)
                    throw (Error('Invalid html:\n' + html));

                var parent = _this._parent;
                var parentRoot = parent ? parent.root : null;

                var target = _this.root = (_this.selector && Gnd.$(_this.selector, parentRoot)[0]) || document.body;

                _this.nodes = _.toArray(_this.fragment.childNodes);

                var styles = _.extend({ visibility: 'hidden' }, _this.styles);
                _this.applyStyles(styles);

                if (_this.attr) {
                    _.each(_this.nodes, function (node) {
                        return _.each(_this.attr, function (value, attr) {
                            return Gnd.$(node).attr(attr, value);
                        });
                    });
                }

                target.appendChild(_this.fragment);

                return Gnd.Promise.map(_this.children, function (child) {
                    return child.render(context);
                }).then(function () {
                    return _this.applyStyles({ visibility: '' });
                }).then(function () {
                    return _this.nodes[0];
                });
            });
        };

        View.prototype.applyStyles = function (styles) {
            _.each(this.nodes, function (node) {
                return Gnd.$(node).css(styles);
            });
        };

        View.prototype.clean = function () {
            if (this.root) {
                var nodes = this.nodes;
                for (var i = 0, len = nodes.length; i < len; i++) {
                    try  {
                        this.root.removeChild(nodes[i]);
                    } catch (err) {
                    }
                }
            }
        };

        View.prototype.refresh = function () {
            var _this = this;
            return this.refreshMutex(function () {
                _this.clean();
                return _this.render();
            });
        };

        View.prototype.disable = function (disable) {
            console.log(this + " does not implement disable");
        };

        View.prototype.hide = function (args, done) {
            var _this = this;
            this.root && this.onHidding(this.root, args, function () {
                Gnd.$(_this.root).hide();
                done();
            });
        };

        View.prototype.show = function (args, done) {
            var _this = this;
            this.root && this.onShowing(this.root, args, function () {
                Gnd.$(_this.root).show();
                done();
            });
        };

        View.prototype.init = function () {
            var _this = this;
            if (!this.isInitialized) {
                this.isInitialized = true;

                if (_.isUndefined(this.html)) {
                    return View.fetchTemplate(this.templateUrl, this.cssUrl).then(function (templ) {
                        templ = _this.templateStr || templ;
                        if (templ)
                            _this.template = _this.templateEngine(Gnd.Util.trim(templ));
                    }).then(function () {
                        return _this.initChildren();
                    });
                }
            }
            return this.initChildren();
        };

        View.prototype.initChildren = function () {
            return Gnd.Promise.map(this.children, function (subview) {
                return subview.init();
            });
        };
        return View;
    })(Gnd.Base);
    Gnd.View = View;
})(Gnd || (Gnd = {}));
var Gnd;
(function (Gnd) {
    var Router = (function () {
        function Router() {
            var _this = this;
            this.route = new Route();
            this.handlePopStateFn = function (evt) {
                _this.routeHandler && _this.executeRoute(location.pathname, _this.routeHandler);
            };

            this.handleClickUrlFn = function (evt) {
                var link = findLink(evt.target || evt.srcElement);
                if (link) {
                    var url = link.href;

                    if (url = getRelativeUrl(url, _this.basepath)) {
                        evt.preventDefault();
                        _this.redirect(url);
                    }
                }
            };
        }
        Router.prototype.listen = function (root, cb) {
            var _this = this;
            if (_.isFunction(root)) {
                cb = root;
                root = '';
            }

            this.routeHandler = cb;
            this.basepath = location['origin'] + '/' + Gnd.Util.trim(root);

            var url;
            if (Gnd.using.historyApi) {
                Gnd.$("document").on('click', this.handleClickUrlFn);

                window.addEventListener("popstate", this.handlePopStateFn);
                url = getRelativeUrl(location.href, this.basepath);
            } else {
                url = location.hash.replace(/^#!?/, '');
                var fn = function () {
                    return _this.executeRoute(location.hash.replace(/^#!?/, ''), cb);
                };
                if ('onhashchange' in window) {
                    window.onhashchange = fn;
                } else {
                    this.interval = setInterval(fn, 50);
                }
            }

            this.executeRoute(url, cb);
        };

        Router.prototype.stop = function () {
            this.req = this.routeHandler = null;
            Gnd.$("body").off('click', this.handleClickUrlFn);
            window.removeEventListener("popstate", this.handlePopStateFn);
            delete window.onhashchange;
            clearInterval(this.interval);
        };

        Router.prototype.redirect = function (url) {
            if (Gnd.using.historyApi) {
                history.pushState(null, null, url);
            } else {
                location.hash = '#!' + url;
            }
            this.routeHandler && this.executeRoute(url, this.routeHandler);
        };

        Router.prototype.executeRoute = function (url, routeHandler) {
            if (!this.req || (this.req.url !== url)) {
                this.req && this.req.queue.cancel();

                var req = new Request(url, this.req && this.req.nodes || []);

                this.route.notifyRouteChange(this.req, req);

                this.req = req;

                var index = req.index;

                this.routeHandler(req);

                if (req.index == index) {
                    req.isNotFound = true;
                    req.queue.end();
                }

                req.queue.wait(function () {
                    if (req.isNotFound) {
                        if (req.notFoundFn) {
                            req.index = 1;
                            req.initNode('body');
                            req.notFoundFn.call(req, req);
                            var queue = new Gnd.TaskQueue();
                            enqueueNode(queue, req.node());
                        } else {
                            Gnd.log('Undefined route:', url);
                            return;
                        }
                    }
                });
            }
        };
        return Router;
    })();
    Gnd.Router = Router;

    var Route = (function (_super) {
        __extends(Route, _super);
        function Route() {
            _super.apply(this, arguments);
        }
        Route.prototype.notifyRouteChange = function (prevReq, req) {
            var index = 0;
            var components = req.components;

            if (prevReq) {
                var prevComponents = prevReq.components;
                var maxLen = Math.min(prevComponents.length, components.length);

                for (; index < maxLen; index++) {
                    if (prevComponents[index] != components[index]) {
                        break;
                    }
                }

                if (index < prevComponents.length) {
                    var start = prevComponents[0] != '' ? 0 : 1;
                    for (var i = prevComponents.length; i >= index + start; i--) {
                        this.set(prevComponents.slice(start, i).join('.'), false);
                    }
                }
            }

            if (index < components.length) {
                if (components[index] == '')
                    index++;
                for (var i = index; i < components.length; i++) {
                    this.set(components.slice(index, i + 1).join('.'), true);
                }
            }
        };
        return Route;
    })(Gnd.Base);
    Gnd.Route = Route;

    function findLink(el) {
        while (el && el !== document.body) {
            if (el.tagName.toLowerCase() === "a") {
                return el;
            }
            el = el.parentElement;
        }
    }

    function getRelativeUrl(url, basepath) {
        if (url.indexOf(basepath) === 0) {
            url = url.substring(basepath.length).replace(/^#!?/, '');
            return url;
        }
    }

    Gnd.router = new Router();

    var parseQuery = function (queryString) {
        if (queryString) {
            var keyValues = queryString.split('&'), i, len = keyValues.length;

            var obj = {};

            for (i = 0; i < len; i++) {
                var keyValue = keyValues[i].split('=');
                obj[decodeURIComponent(keyValue[0])] = keyValue[1] ? decodeURIComponent(keyValue[1]) : '';
            }
            return obj;
        } else {
            return {};
        }
    };

    function parseParams(expr, component, params) {
        if (expr.charAt(0) === ':') {
            params[expr.replace(':', '')] = component;
            return true;
        }
        return false;
    }

    var AutoreleasePool = (function () {
        function AutoreleasePool() {
            this.drained = false;
            this.pool = [];
        }
        AutoreleasePool.prototype.autorelease = function () {
            var pool = this.pool;
            _.each(arguments, function (obj) {
                if (_.isArray(obj)) {
                    pool.push.apply(pool, obj);
                } else {
                    pool.push(obj);
                }
            });
            this.drained && this.drain();
        };

        AutoreleasePool.prototype.drain = function () {
            for (var i = 0, len = this.pool.length; i < len; i++) {
                this.pool[i].release();
            }
            this.pool = [];
            this.drained = true;
        };
        return AutoreleasePool;
    })();
    Gnd.AutoreleasePool = AutoreleasePool;

    var wrap = Gnd.overload({
        'Function Array Function': function (fn, args, cb) {
            return function (done) {
                var _args = _.clone(args);
                _args.push(function () {
                    cb(done);
                    if (cb.length === 0) {
                        done();
                    }
                });
                fn.apply(null, _args);
            };
        },
        'Function Function': function (fn, cb) {
            return wrap(fn, [], cb);
        },
        'Function Array': function (fn, args) {
            return wrap(fn, args, Gnd.Util.noop);
        },
        'Function': function (fn) {
            return wrap(fn, []);
        }
    });

    var decomposeUrl = function (url) {
        var s = url.split('?'), components, len;

        components = s[0].split('/');
        len = components.length;
        if (_.last(components) === '' && len > 1) {
            components.splice(len - 1, 1);
        }
        return { components: components, query: parseQuery(s[1]) };
    };

    function processMiddlewares(req, middlewares, cb) {
        Gnd.Util.asyncForEach(middlewares, function (fn, cb) {
            fn(req, cb);
        }, cb);
    }

    function exitNodes(queue, nodes, start) {
        for (var i = nodes.length - 1; i >= start; i--) {
            var node = nodes[i];
            node.el || queue.append(node.select);
            queue.append(node.exit || node.hide, node.drain, node.leave);
        }
    }

    function enqueueNode(queue, node) {
        queue.append(node.select, node.hide, node.before, node.load, node.render, node.enter || node.show, node.after);
    }

    var Request = (function () {
        function Request(url, prevNodes) {
            this.nodes = [];
            this.index = 0;
            this.level = 0;
            this.params = {};
            this.queue = new Gnd.TaskQueue();
            var components, i, len, prevLen;

            _.extend(this, decomposeUrl(url));

            components = this.components;
            len = components.length;
            prevLen = prevNodes.length;

            this.url = url;
            this.prevNodes = prevNodes;

            for (i = 0; i < len; i++) {
                var prev = prevNodes[i], prevNext = prevNodes[i + 1];

                if (prev && (prev.component === components[i]) && (prevLen < len || (prevNext && prev.selector != prevNext.selector) || i < len - 1)) {
                    this.nodes.push({
                        component: components[i],
                        autoreleasePool: prev.autoreleasePool
                    });
                } else {
                    break;
                }
            }

            this.startIndex = i;
            for (i = this.startIndex; i < len; i++) {
                this.nodes.push({ component: components[i], autoreleasePool: new AutoreleasePool() });
            }
        }
        Request.prototype.get = function () {
            return Gnd.overload({
                'String String String': function (component, selector, handler) {
                    return this._get(component, selector, {}, [], handler);
                },
                'String String Array String': function (component, selector, middelwares, handler) {
                    return this._get(component, selector, {}, middelwares, handler);
                },
                'String String Array Function': function (component, selector, middelwares, cb) {
                    return this._get(component, selector, {}, middelwares, cb);
                },
                'String String Function': function (component, selector, cb) {
                    return this._get(component, selector, {}, [], undefined, cb);
                },
                'String String Object String': function (component, selector, args, handler) {
                    return this._get(component, selector, args, [], handler);
                },
                'String Function': function (component, cb) {
                    return this._get(component, 'body', {}, [], undefined, cb);
                },
                'Function': function (cb) {
                    return this._get('', 'body', {}, [], undefined, cb);
                }
            }).apply(this, arguments);
        };

        Request.prototype._get = function (component, selector, args, middelwares, handler, cb) {
            if (this.wantsRedirect || !this.consume(component, this.level)) {
                return this;
            }

            this.queue.append(this.createRouteTask(this.level, selector, args, middelwares, handler, cb));

            return this;
        };

        Request.prototype.createRouteTask = function (level, selector, args, middlewares, handler, cb) {
            var _this = this;
            return function (done) {
                processMiddlewares(_this, middlewares, function (err) {
                    var node = _this.node(), pool = node.autoreleasePool, index = _this.index, isLastRoute = index === _this.components.length;

                    if (index == _this.startIndex) {
                        exitNodes(_this.queue, _this.prevNodes, _this.startIndex);
                    }
                    _this.initNode(selector, node);

                    if (cb) {
                        _this.enterNode(cb, node, index, level, {}, pool, isLastRoute);
                        done();
                    } else {
                        curl([handler], function (cb) {
                            _this.enterNode(cb, node, index, level, args, pool, isLastRoute);
                            done();
                        });
                    }
                });
            };
        };

        Request.prototype.initNode = function (selector, node) {
            var _this = this;
            (function (node) {
                node.select = wrap(function (done) {
                    node.el = _this.el = Gnd.$(selector)[0];
                    done();
                });
                node.selector = selector;

                node.hide = wrap(function (done) {
                    node.el && Gnd.hide(node.el);
                    done();
                });

                node.show = wrap(function (done) {
                    node.el && Gnd.show(node.el);
                    done();
                });

                node.drain = wrap(function (done) {
                    node.autoreleasePool.drain();
                    done();
                });
            })(node || this.node());
        };

        Request.prototype.enterNode = function (fn, node, index, level, args, pool, isLastRoute) {
            this.level = level + 1;
            if (arguments.length == 7) {
                fn && fn.call(this, pool, args);
            } else {
                fn && fn.call(this, args);
                isLastRoute = pool;
            }

            this.isNotFound = (index >= this.index) && !isLastRoute;
            if (!this.isNotFound && index > this.startIndex) {
                enqueueNode(this.queue, node);
            }

            if (this.isNotFound || isLastRoute) {
                this.queue.end();
            }
        };

        Request.prototype.currentSubPath = function () {
            var subPath = '';
            for (var i = 0, len = this.index; i < len; i++) {
                subPath += this.components[i] + '/';
            }
            if (subPath.length > 0) {
                subPath = subPath.substr(0, subPath.length - 1);
            }
            return subPath;
        };

        Request.prototype.consume = function (expr, level) {
            var index = this.index;

            if (expr) {
                if ((level != index) || (index >= this.components.length)) {
                    return false;
                }
                var comp = this.components[index];
                if (!parseParams(expr, comp, this.params) && expr !== comp) {
                    return false;
                }
            }
            this.index++;
            return true;
        };

        Request.prototype.notFound = function (fn) {
            this.notFoundFn = fn;
        };

        Request.prototype.node = function () {
            return this.nodes[this.index <= 0 ? 0 : (this.index - 1)];
        };

        Request.prototype.isLast = function () {
            return this.index >= this.components.length;
        };

        Request.prototype.nextComponent = function () {
            return this.components[this.index];
        };

        Request.prototype.redirect = function (url, params) {
            url = params ? url + '?' + Gnd.serialize(params) : url;
            this.queue.wait(function () {
                Gnd.router.redirect(url);
            });
            this.wantsRedirect = true;
        };

        Request.prototype.before = function (cb) {
            this.node().before = wrap(function (cb) {
                cb();
            }, cb);
            return this;
        };

        Request.prototype.after = function (cb) {
            this.node().after = wrap(function (cb) {
                cb();
            }, cb);
            return this;
        };

        Request.prototype.enter = function (fn) {
            var node = this.node();
            node.enter = wrap(function (done) {
                node.el && fn(node.el, done);
                (fn.length == 1) && done();
            });
            return this;
        };

        Request.prototype.exit = function (fn) {
            var node = this.node();
            node.exit = wrap(function (done) {
                node.el && fn(node.el, done);
                (fn.length == 1) && done();
            });
            return this;
        };

        Request.prototype.leave = function (cb) {
            this.node().leave = wrap(function (cb) {
                cb();
            }, cb);
            return this;
        };

        Request.prototype.render = function (templateUrl, css, locals, cb) {
            return Gnd.overload({
                "String String Object Function": function (url, css, locals, cb) {
                    var fn = _.bind(this._render, this);
                    this.node().render = wrap(fn, [{ templateUrl: url, cssUrl: css }, locals], cb);
                    return this;
                },
                "Object": function (view) {
                    return this.render(view, Gnd.Util.noop);
                },
                "Object Function": function (view, cb) {
                    return this.render(view, {}, cb);
                },
                "Object Object": function (view, locals) {
                    return this.render(view, locals, Gnd.Util.noop);
                },
                "Object Object Function": function (view, locals, cb) {
                    var fn = _.bind(this._render, this);
                    this.node().render = wrap(fn, [view, locals], cb);
                    return this;
                },
                "String String Function": function (templateUrl, css, cb) {
                    return this.render(templateUrl, css, {}, cb);
                },
                "String String": function (templateUrl, css) {
                    return this.render(templateUrl, css, {}, Gnd.Util.noop);
                },
                "String String Object": function (templateUrl, css, locals) {
                    return this.render(templateUrl, css, locals, Gnd.Util.noop);
                },
                "String Object": function (templateUrl, locals) {
                    return this.render(templateUrl, "", locals, Gnd.Util.noop);
                },
                "String Object Function": function (templateUrl, locals, cb) {
                    return this.render(templateUrl, "", locals, cb);
                },
                "String Function": function (templateUrl, cb) {
                    return this.render(templateUrl, "", {}, cb);
                },
                "String": function (templateUrl) {
                    return this.render(templateUrl, Gnd.Util.noop);
                }
            }).apply(this, arguments);
        };

        Request.prototype.load = function (urls, cb) {
            if (_.isFunction(urls)) {
                cb = urls;
                urls = null;
            }
            var fn = _.bind(this._load, this);
            this.node().load = wrap(fn, [urls], cb);
            return this;
        };

        Request.prototype._render = function (args, locals, cb) {
            if (args.templateUrl && args.templateUrl[0] == '#') {
                args.templateStr = Gnd.$(args.templateUrl).text();
                args.templateUrl = null;
            }

            var ctx = _.extend({}, locals, this.data);

            var view = args instanceof Gnd.View ? args.retain() : new Gnd.View(args);

            Gnd.$(this.el).empty();
            return view.parent(this.el).render(ctx).then(function () {
                cb && cb(null);
            });
        };

        Request.prototype._load = function (urls, cb) {
            var _this = this;
            var base = this.currentSubPath(), i, len;

            if (urls === null) {
                urls = this.data;
            }

            if (!_.isArray(urls)) {
                urls = [urls];
            }

            var _urls = [];
            for (i = 0, len = urls.length; i < len; i++) {
                _urls.push('text!' + urls[i]);
            }

            curl(_urls, function () {
                var args = arguments;
                var objs = [];
                for (i = 0, len = args.length; i < len; i++) {
                    try  {
                        objs.push(JSON.parse(arguments[i]));
                    } catch (e) {
                        console.log("Error parsing data: " + e.name + "::" + e.message);
                    }
                }
                objs = objs.length === 1 ? objs[0] : objs;
                _this.data = objs;
                cb && cb();
            });
        };
        return Request;
    })();
    Gnd.Request = Request;
})(Gnd || (Gnd = {}));
var Gnd;
(function (Gnd) {
    (function (Binders) {
        var TwoWayBinder = (function () {
            function TwoWayBinder() {
                this.bindings = [];
                this.attrBindings = {};
                this.attrFormatters = {};
            }
            TwoWayBinder.prototype.parse = function (value, formatters) {
                var match, formatter;
                while (match = TwoWayBinder.re.exec(value)) {
                    var attr = match[3];
                    this.attrBindings[attr] = Gnd.makeKeypathArray(match[4]);
                    formatter = formatters[match[7]];
                    if (formatter) {
                        this.attrFormatters[attr] = formatter;
                    }
                }
            };

            TwoWayBinder.prototype.createBinding = function (attr, el, viewModel) {
                var attrBinding = this.attrBindings[attr], attrFormatter = this.attrFormatters[attr], obj = viewModel.resolveContext(([attrBinding[0]]));

                if (obj instanceof Gnd.Base) {
                    var keypath = _.rest(attrBinding).join('.'), modelListener, elemListener = null;

                    var format = function () {
                        return attrFormatter ? attrFormatter.call(obj, obj.get(keypath)) : obj.get(keypath);
                    };

                    if (attr === 'text') {
                        setText(el, format());
                        modelListener = function () {
                            return setText(el, format());
                        };
                    } else {
                        Gnd.setAttr(el, attr, format());
                        modelListener = function () {
                            return Gnd.setAttr(el, attr, format());
                        };
                        elemListener = function (value) {
                            return obj.set(keypath, Gnd.getAttr(el, attr));
                        };
                    }
                    obj.retain();
                    obj.on(keypath, modelListener);
                    Gnd.$(el).on('change', elemListener);

                    this.bindings.push([obj, keypath, modelListener, elemListener]);
                } else {
                    Gnd.log("Warning: not found a valid model: ", attrBinding[0]);
                }
            };

            TwoWayBinder.prototype.bind = function (el, value, viewModel) {
                this.parse(value, viewModel.formatters);

                this.el = el;

                for (var attr in this.attrBindings) {
                    this.createBinding(attr, el, viewModel);
                }
            };

            TwoWayBinder.prototype.unbind = function () {
                var _this = this;
                _.each(this.bindings, function (item) {
                    item[0].off(item[1], item[2]);
                    item[0].release();
                    item[3] && Gnd.$(_this.el).off('change', item[3]);
                });
            };
            TwoWayBinder.re = /((\s*(\w+)\s*\:\s*((\w+\.*)+)\s*(\|\s*(\w+)\s*)?);?)/gi;
            return TwoWayBinder;
        })();
        Binders.TwoWayBinder = TwoWayBinder;

        function setText(el, value) {
            if (Gnd.isElement(value)) {
                el.parentNode.replaceChild(value, el);
            } else {
                Gnd.$(el).html(value);
            }
        }
    })(Gnd.Binders || (Gnd.Binders = {}));
    var Binders = Gnd.Binders;
})(Gnd || (Gnd = {}));
var Gnd;
(function (Gnd) {
    (function (Binders) {
        var EachBinder = (function () {
            function EachBinder() {
                this.items = [];
                this.mappings = {};
            }
            EachBinder.prototype.bind = function (el, value, viewModel) {
                var _this = this;
                var match = value.match(/((?:\w+\.?\w+)+)\s*:\s*(\w+)/);

                if (!match) {
                    throw new Error("Syntax error in data-each:" + value);
                }

                var callbacksRegExp = /\|\s*(added|removed)\s*:\s*(\w+)/g;
                var callbacks = this.callbacks = {};
                var matchArr;
                while (matchArr = callbacksRegExp.exec(value)) {
                    callbacks[matchArr[1]] = viewModel.resolveContext([matchArr[2]]) || Gnd.Util.noop;
                }

                var mappings = this.mappings, nextSibling = el.nextSibling, keyPath = Gnd.makeKeypathArray(match[1]), collection = viewModel.resolveContext(keyPath), itemContextName = match[2];

                var parent = this.parent = el.parentNode;

                this.viewModel = viewModel;

                if (collection instanceof Gnd.Container) {
                    this.collection = collection;

                    parent.removeChild(el);

                    this.el = el.cloneNode(true);

                    el.removeAttribute('data-each');
                    el.removeAttribute('id');

                    var attachNode = function (node, nextSibling, item) {
                        if (nextSibling) {
                            parent.insertBefore(node, nextSibling);
                        } else {
                            parent.appendChild(node);
                        }
                        callbacks.added && callbacks.added(node, item);
                    };

                    var addNode = function (item, nextSibling) {
                        var id = item.id(), existingNode = mappings[id];

                        if (existingNode) {
                            var oldChild = parent.removeChild(existingNode);
                            attachNode(oldChild, nextSibling, item);
                        } else {
                            var itemNode = el.cloneNode(true), modelListener = function (newId) {
                                if (!(newId in mappings)) {
                                    delete mappings[id];
                                    mappings[newId] = itemNode;
                                    Gnd.setAttr(itemNode, 'data-item', newId);
                                }
                            };

                            item.retain();

                            Gnd.setAttr(itemNode, 'data-item', id);
                            mappings[id] = itemNode;

                            attachNode(itemNode, nextSibling, item);

                            var context = {};
                            context[itemContextName] = item;

                            viewModel.pushContext(context);
                            itemNode['gnd-bindings'] = viewModel.bindNode(itemNode);
                            viewModel.popContext();

                            item.on('id', modelListener);

                            itemNode['gnd-obj'] = item;
                            itemNode['gnd-listener'] = modelListener;
                        }
                    };

                    var refresh = function () {
                        collection.filtered(function (err, models) {
                            if (!err) {
                                var newMappings = {};
                                _.each(models, function (item) {
                                    var id = item.id();
                                    if (mappings[id]) {
                                        newMappings[id] = mappings[id];
                                    }
                                });

                                _.each(mappings, function (node, id) {
                                    !newMappings[id] && _this.removeNode(id);
                                });

                                _this.mappings = mappings = newMappings;

                                _.each(models, function (item) {
                                    addNode(item, nextSibling);
                                });
                            }
                        });
                    };

                    refresh();

                    this.addedListener = function (item) {
                        if (collection.isFiltered(item)) {
                            addNode(item, nextSibling);
                        }
                    };

                    this.removedListener = function (item) {
                        if (mappings[item.id()]) {
                            _this.removeNode(item.id());
                        }
                    };

                    this.updatedListener = refresh;

                    collection.on('added:', this.addedListener).on('removed:', this.removedListener).on('filterFn sorted: updated: inserted:', this.updatedListener);
                } else {
                    Gnd.log("Warning: not found a valid collection: ", match[1]);
                }
            };

            EachBinder.prototype.unbind = function () {
                this.collection.off('added: inserted:', this.addedListener);
                this.collection.off('removed:', this.removedListener);
                this.collection.off('filterFn sorted: updated:', this.updatedListener);

                this.removeNodes();

                this.parent.appendChild(this.el);
            };

            EachBinder.prototype.removeNode = function (id) {
                var node = this.mappings[id], item = node['gnd-obj'];

                this.viewModel.unbind(node['gnd-bindings']);
                item.off('id', node['gnd-listener']);
                item.release();

                this.callbacks.removed && this.callbacks.removed(node);

                this.parent.removeChild(node);
                delete this.mappings[id];
            };

            EachBinder.prototype.removeNodes = function () {
                for (var id in this.mappings) {
                    this.removeNode(id);
                }
            };
            return EachBinder;
        })();
        Binders.EachBinder = EachBinder;
    })(Gnd.Binders || (Gnd.Binders = {}));
    var Binders = Gnd.Binders;
})(Gnd || (Gnd = {}));
var Gnd;
(function (Gnd) {
    (function (Binders) {
        var ShowBinder = (function () {
            function ShowBinder() {
                this.bindings = [];
            }
            ShowBinder.prototype.bind = function (el, value, viewModel) {
                var _value = value.replace('!', ''), negate = _value === value ? false : true, keypath = Gnd.makeKeypathArray(_value), model = viewModel.resolveContext(_.initial(keypath));

                if (model instanceof Gnd.Base) {
                    model.retain();

                    function setVisibility(visible) {
                        if (negate ? !visible : visible) {
                            Gnd.show(el);
                        } else {
                            Gnd.hide(el);
                        }
                    }

                    var key = _.last(keypath), modelListener = function (visible) {
                        return setVisibility(visible);
                    };

                    setVisibility(model.get(key));

                    model.on(key, modelListener);
                    this.bindings.push([model, key, modelListener]);
                } else {
                    console.log("Warning: not found a valid model: " + value);
                }
            };

            ShowBinder.prototype.unbind = function () {
                _.each(this.bindings, function (item) {
                    item[0].off(item[1], item[2]);
                    item[0].release();
                });
            };
            return ShowBinder;
        })();
        Binders.ShowBinder = ShowBinder;
    })(Gnd.Binders || (Gnd.Binders = {}));
    var Binders = Gnd.Binders;
})(Gnd || (Gnd = {}));
var Gnd;
(function (Gnd) {
    (function (Binders) {
        var ClassBinder = (function () {
            function ClassBinder() {
                this.bindings = [];
            }
            ClassBinder.prototype.bind = function (el, value, viewModel) {
                var _this = this;
                var classMappings = {}, classSets = value.split(';'), classNames = el['className'] === '' ? [] : el['className'].split(' '), usedClassNameSets = {};

                var processMapping = function (keypath) {
                    var _keypath = keypath.replace('!', ''), negate = _keypath === keypath ? false : true, keypathArray = Gnd.makeKeypathArray(_keypath), model = viewModel.resolveContext(_.initial(keypathArray));

                    if (model instanceof Gnd.Base) {
                        model.retain();

                        var key = _.last(keypathArray), addClasses = negate ? !model.get(key) : model.get(key), modelListener;

                        if (addClasses) {
                            usedClassNameSets[keypath] = keypath;
                        }

                        modelListener = function (value) {
                            if (negate ? !value : value) {
                                usedClassNameSets[keypath] = keypath;
                            } else {
                                delete usedClassNameSets[keypath];
                            }
                            updateClassNames();
                        };

                        model.on(key, modelListener);

                        _this.bindings.push([model, key, modelListener]);
                    } else {
                        console.log("Warning: not found a valid model: " + value);
                    }
                };

                function updateClassNames() {
                    var newClassNames = classNames;
                    for (var key in usedClassNameSets) {
                        newClassNames = _.union(newClassNames, classMappings[key]);
                    }
                    el['className'] = newClassNames.join(' ');
                }

                for (var i = 0; i < classSets.length; i++) {
                    var keyVal = classSets[i].split(':');
                    if (keyVal.length === 2) {
                        var classes = keyVal[0].trim().split(' '), keypath = keyVal[1].trim();

                        classMappings[keypath] = [];
                        for (var j = 0; j < classes.length; j++) {
                            classMappings[keypath].push(classes[j].trim());
                        }

                        for (var kp in classMappings) {
                            processMapping(kp);
                        }

                        updateClassNames();
                    } else {
                        console.log("Warning: Syntax error in " + classSets[i]);
                    }
                }
            };

            ClassBinder.prototype.unbind = function () {
                _.each(this.bindings, function (item) {
                    item[0].off(item[1], item[2]);
                    item[0].release();
                });
            };
            return ClassBinder;
        })();
        Binders.ClassBinder = ClassBinder;
    })(Gnd.Binders || (Gnd.Binders = {}));
    var Binders = Gnd.Binders;
})(Gnd || (Gnd = {}));
var Gnd;
(function (Gnd) {
    (function (Binders) {
        var EventBinder = (function () {
            function EventBinder() {
                this.bindings = [];
            }
            EventBinder.prototype.parse = function (value) {
                var eventBindings = {}, match;
                while (match = EventBinder.re.exec(value)) {
                    eventBindings[match[3]] = Gnd.makeKeypathArray(match[4]);
                }
                return eventBindings;
            };

            EventBinder.prototype.bind = function (el, value, viewModel) {
                var _this = this;
                var eventBindings = this.parse(value), handler;

                this.el = el;

                var addEvent = function (eventName) {
                    var keypath = eventBindings[eventName], obj = viewModel.resolveContext(_.initial(keypath));

                    var elementListener;
                    if (obj instanceof Gnd.Base) {
                        var key = _.last(keypath);
                        handler = obj[key];

                        obj.retain();

                        if (_.isFunction(handler)) {
                            elementListener = function (evt) {
                                return handler.call(obj, el, evt);
                            };

                            Gnd.$(el).on(eventName, elementListener);

                            _this.bindings.push([obj, eventName, elementListener]);
                        } else {
                            console.log("Warning: the given handler is not a function: " + keypath);
                        }
                        return;
                    } else {
                        handler = viewModel.resolveContext(keypath);
                        if (_.isFunction(handler)) {
                            var ctx = obj || _.reduce(viewModel.contexts, function (memo, ctx) {
                                return _.extend(memo, ctx);
                            }, {});

                            elementListener = function (evt) {
                                return handler.call(ctx, el, evt);
                            };

                            Gnd.$(el).on(eventName, elementListener);
                            _this.bindings.push([obj, eventName, elementListener]);
                            return;
                        }
                    }

                    console.log("Warning: not found an object instance of Gnd.Base: " + keypath[0]);
                };

                for (var eventName in eventBindings) {
                    addEvent(eventName);
                }
            };

            EventBinder.prototype.unbind = function () {
                var _this = this;
                _.each(this.bindings, function (item) {
                    item[0].release();
                    Gnd.$(_this.el).off(item[1], item[2]);
                });
            };
            EventBinder.re = /((\s*(\w+)\s*\:\s*((\w+\.*)+)\s*);?)/gi;
            return EventBinder;
        })();
        Binders.EventBinder = EventBinder;
    })(Gnd.Binders || (Gnd.Binders = {}));
    var Binders = Gnd.Binders;
})(Gnd || (Gnd = {}));
var Gnd;
(function (Gnd) {
    var dataBindingReqExp = /^data-/;

    var ViewModel = (function (_super) {
        __extends(ViewModel, _super);
        function ViewModel(el, context, formatters, binders) {
            _super.call(this);
            this.boundBinders = [];
            this.contexts = [];
            this.formatters = {};

            this.formatters = formatters || this.formatters;

            this.binders = {
                bind: Gnd.Binders.TwoWayBinder,
                each: Gnd.Binders.EachBinder,
                show: Gnd.Binders.ShowBinder,
                'class': Gnd.Binders.ClassBinder,
                event: Gnd.Binders.EventBinder
            };

            _.extend(this.binders, binders);

            this.pushContext(context);
            this.boundBinders = this.bindNode(_.isString(el) ? Gnd.$(el)[0] : el);
        }
        ViewModel.prototype.destroy = function () {
            this.cleanup();
            _super.prototype.destroy.call(this);
        };

        ViewModel.prototype.cleanup = function (bindings) {
            _.each(bindings || this.boundBinders, function (binder) {
                binder.unbind();
            });
            !bindings && (this.boundBinders = []);
        };

        ViewModel.prototype.resolveContext = function (keyPath) {
            var root = keyPath[0], context = this.findContext(root);

            if (context) {
                return this.resolveKeypath(getValue(context, root), _.rest(keyPath));
            }
        };

        ViewModel.prototype.findContext = function (prop) {
            for (var i = this.contexts.length - 1; i >= 0; i--) {
                if (getValue(this.contexts[i], prop)) {
                    return this.contexts[i];
                }
            }
        };

        ViewModel.prototype.pushContext = function (context) {
            this.contexts.push(context);
        };

        ViewModel.prototype.popContext = function () {
            this.contexts.pop();
        };

        ViewModel.prototype.bindNode = function (node) {
            var binders = [];

            if (node.attributes) {
                var attributes = node.attributes;
                for (var j = 0; j < attributes.length; j++) {
                    if (dataBindingReqExp.test(attributes[j].name)) {
                        var type = attributes[j].name.replace(dataBindingReqExp, '');
                        var value = attributes[j].value;
                        if (this.binders[type]) {
                            var binder = new this.binders[type]();
                            binder.bind(node, value, this);
                            binders.push(binder);
                        }
                    }
                }
            }

            if (node.hasChildNodes()) {
                var children = _.toArray(node.childNodes);

                for (var i = 0; i < children.length; i++) {
                    if (Gnd.isElement(children[i])) {
                        binders.push.apply(binders, this.bindNode(children[i]));
                    }
                }
            }

            return binders;
        };

        ViewModel.prototype.resolveKeypath = function (obj, keyPath) {
            for (var i = 0; i < keyPath.length; i++) {
                obj = getValue(obj, keyPath[i]);
                if (!obj)
                    return null;
            }
            return obj;
        };
        return ViewModel;
    })(Gnd.Base);
    Gnd.ViewModel = ViewModel;

    function getValue(obj, prop) {
        return obj.get ? obj.get(prop) : obj[prop];
    }

    function makeKeypathArray(keypath) {
        var arr = Gnd.Util.trim(keypath).split('.');
        for (var i = 0; i < arr.length; i++) {
            arr[i] = Gnd.Util.trim(arr[i]);
        }
        return arr;
    }
    Gnd.makeKeypathArray = makeKeypathArray;
})(Gnd || (Gnd = {}));
((function (root, factory) {
    if (typeof exports === 'object') {
        root['module'].exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.returnExports = factory();
    }
})(this, function () {
    return Gnd;
}));
//@ sourceMappingURL=file:////Users/manuel/dev/gnd/dist/gnd.js.map
