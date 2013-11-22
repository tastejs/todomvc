/*
Copyright 2013, KISSY v1.40
MIT Licensed
build time: Nov 18 17:45
*/
/**
 * @ignore
 * A seed where KISSY grows up from, KISS Yeah !
 * @author https://github.com/kissyteam/kissy/contributors
 */

/**
 * The KISSY global namespace object. you can use
 *
 *
 *      KISSY.each/mix
 *
 * to do basic operation. or
 *
 *
 *      KISSY.use('overlay,node', function(S, Overlay, Node){
 *          //
 *      });
 *
 * to do complex task with modules.
 * @singleton
 * @class KISSY
 */
var KISSY = (function (undefined) {
    var host = this,
        S,
        guid = 0,
        EMPTY = '';

    var loggerLevel = {
        'debug': 10,
        'info': 20,
        'warn': 30,
        'error': 40
    };

    S = {
        /**
         * The build time of the library.
         * NOTICE: '20131118174450' will replace with current timestamp when compressing.
         * @private
         * @type {String}
         */
        __BUILD_TIME: '20131118174450',

        /**
         * KISSY Environment.
         * @private
         * @type {Object}
         */
        Env: {
            host: host
        },

        /**
         * KISSY Config.
         * If load kissy.js, Config.debug defaults to true.
         * Else If load kissy-min.js, Config.debug defaults to false.
         * @private
         * @property {Object} Config
         * @property {Boolean} Config.debug
         * @member KISSY
         */
        Config: {
            debug: '@DEBUG@',
            fns: {}
        },

        /**
         * The version of the library.
         * NOTICE: '1.40' will replace with current version when compressing.
         * @type {String}
         */
        version: '1.40',

        /**
         * set KISSY configuration
         * @param {Object|String} configName Config object or config key.
         * @param {String} configName.base KISSY 's base path. Default: get from kissy(-min).js or seed(-min).js
         * @param {String} configName.tag KISSY 's timestamp for native module. Default: KISSY 's build time.
         * @param {Boolean} configName.debug whether to enable debug mod.
         * @param {Boolean} configName.combine whether to enable combo.
         * @param {Object} configName.logger logger config
         * @param {Object[]} configName.logger.excludes  exclude configs
         * @param {Object} configName.logger.excludes.0 a single exclude config
         * @param {RegExp} configName.logger.excludes.0.logger  matched logger will be excluded from logging
         * @param {KISSY.Logger.Level} configName.logger.excludes.0.minLevel  minimum logger level
         * @param {KISSY.Logger.Level} configName.logger.excludes.0.maxLevel  maximum logger level
         * @param {Object[]} configName.logger.includes include configs
         * @param {Object} configName.logger.includes.0 a single include config
         * @param {RegExp} configName.logger.includes.0.logger  matched logger will be included from logging
         * @param {KISSY.Logger.Level} configName.logger.excludes.0.minLevel  minimum logger level
         * @param {KISSY.Logger.Level} configName.logger.excludes.0.maxLevel  maximum logger level
         * @param {Object} configName.packages Packages definition with package name as the key.
         * @param {String} configName.packages.base Package base path.
         * @param {String} configName.packages.tag  Timestamp for this package's module file.
         * @param {String} configName.packages.debug Whether force debug mode for current package.
         * @param {String} configName.packages.combine Whether allow combine for current package modules.
         * @param {String} [configName.packages.ignorePackageNameInUri=false] whether remove packageName from module request uri,
         * can only be used in production mode.
         * @param {Array[]} configName.map file map      File url map configs.
         * @param {Array[]} configName.map.0     A single map rule.
         * @param {RegExp} configName.map.0.0    A regular expression to match url.
         * @param {String|Function} configName.map.0.1   Replacement for String.replace.
         * @param [configValue] config value.
         *
         * for example:
         *     @example
         *     KISSY.config({
         *      combine: true,
         *      base: '',
         *      packages: {
         *          'gallery': {
         *              base: 'http://a.tbcdn.cn/s/kissy/gallery/'
         *          }
         *      },
         *      modules: {
         *          'gallery/x/y': {
         *              requires: ['gallery/x/z']
         *          }
         *      }
         *     });
         */
        config: function (configName, configValue) {
            var cfg,
                r,
                self = this,
                fn,
                Config = S.Config,
                configFns = Config.fns;
            if (S.isObject(configName)) {
                S.each(configName, function (configValue, p) {
                    fn = configFns[p];
                    if (fn) {
                        fn.call(self, configValue);
                    } else {
                        Config[p] = configValue;
                    }
                });
            } else {
                cfg = configFns[configName];
                if (configValue === undefined) {
                    if (cfg) {
                        r = cfg.call(self);
                    } else {
                        r = Config[configName];
                    }
                } else {
                    if (cfg) {
                        r = cfg.call(self, configValue);
                    } else {
                        Config[configName] = configValue;
                    }
                }
            }
            return r;
        },

        /**
         * Prints debug info.
         * @param msg {String} the message to log.
         * @param {String} [cat] the log category for the message. Default
         *        categories are 'info', 'warn', 'error', 'time' etc.
         * @param {String} [logger] the logger of the the message (opt)
         */
        log: function (msg, cat, logger) {
            if ('@DEBUG@') {
                var matched = 1;
                if (logger) {
                    var loggerCfg = S.Config.logger || {},
                        list, i, l, level, minLevel, maxLevel, reg;
                    cat = cat || 'debug';
                    level = loggerLevel[cat] || loggerLevel['debug'];
                    if (list = loggerCfg.includes) {
                        matched = 0;
                        for (i = 0; i < list.length; i++) {
                            l = list[i];
                            reg = l.logger;
                            maxLevel = loggerLevel[l.maxLevel] || loggerLevel['error'];
                            minLevel = loggerLevel[l.minLevel] || loggerLevel['debug'];
                            if (minLevel <= level && maxLevel >= level && logger.match(reg)) {
                                matched = 1;
                                break;
                            }
                        }
                    } else if (list = loggerCfg.excludes) {
                        matched = 1;
                        for (i = 0; i < list.length; i++) {
                            l = list[i];
                            reg = l.logger;
                            maxLevel = loggerLevel[l.maxLevel] || loggerLevel['error'];
                            minLevel = loggerLevel[l.minLevel] || loggerLevel['debug'];
                            if (minLevel <= level && maxLevel >= level && logger.match(reg)) {
                                matched = 0;
                                break;
                            }
                        }
                    }
                    if (matched) {
                        msg = logger + ': ' + msg;
                    }
                }
                if (host['console'] !== undefined && console.log && matched) {
                    console[cat && console[cat] ? cat : 'log'](msg);
                    return msg;
                }
            }
            return undefined;
        },

        /**
         * get log instance for specified logger
         * @param {String} logger logger name
         * @returns {KISSY.Logger} log instance
         */
        'getLogger': function (logger) {
            return getLogger(logger);
        },

        /**
         * Throws error message.
         */
        error: function (msg) {
            if ('@DEBUG@') {
                // with stack info!
                throw msg instanceof  Error ? msg : new Error(msg);
            }
        },

        /*
         * Generate a global unique id.
         * @param {String} [pre] guid prefix
         * @return {String} the guid
         */
        guid: function (pre) {
            return (pre || EMPTY) + guid++;
        }
    };

    if ('@DEBUG@') {
        S.Config.logger = {
            excludes: [
                {
                    logger: /^s\/.*/,
                    maxLevel: 'info',
                    minLevel: 'debug'
                }
            ]
        };

        /**
         * Log class for specified logger
         * @class KISSY.Logger
         * @private
         */
        function Logger() {

        }

        /**
         * print debug log
         * @method
         * @param {String} str log str
         */
        Logger.prototype.debug = function (str) {
        };
        /**
         * print info log
         * @method
         * @param {String} str log str
         */
        Logger.prototype.info = function (str) {
        };
        /**
         * print warn log
         * @method
         * @param {String} str log str
         */
        Logger.prototype.warn = function (str) {
        };
        /**
         * print error log
         * @method
         * @param {String} str log str
         */
        Logger.prototype.error = function (str) {
        };
    }

    function getLogger(logger) {
        var obj = {};
        S.each(loggerLevel, function (_, cat) {
            obj[cat] = function (msg) {
                return S.log(msg, cat, logger);
            };
        });
        return obj;
    }


    /**
     * Logger level enum
     * @enum {String} KISSY.Logger.Level
     */
    S.Logger = /**@type Function
     @ignore */{};
    S.Logger.Level = {
        /**
         * debug level
         */
        'DEBUG': 'debug',
        /**
         * info level
         */
        INFO: 'info',
        /**
         * warn level
         */
        WARN: 'warn',
        /**
         * error level
         */
        ERROR: 'error'
    };

    return S;
})();/**
 * @ignore
 * object utilities of lang
 * @author yiminghe@gmail.com
 *
 */
(function (S, undefined) {

    var MIX_CIRCULAR_DETECTION = '__MIX_CIRCULAR',
        STAMP_MARKER = '__~ks_stamped',
        host = this,
        TRUE = true,
        EMPTY = '',
        Obj = Object,
        ObjectCreate = Obj.create,
    // error in native ie678, not in simulated ie9
        hasEnumBug = !({toString: 1}['propertyIsEnumerable']('toString')),
        enumProperties = [
            'constructor',
            'hasOwnProperty',
            'isPrototypeOf',
            'propertyIsEnumerable',
            'toString',
            'toLocaleString',
            'valueOf'
        ];

    mix(S, {
        /**
         * stamp a object by guid
         * @param {Object} o object needed to be stamped
         * @param {Boolean} [readOnly] while set marker on o if marker does not exist
         * @param {String} [marker] the marker will be set on Object
         * @return {String} guid associated with this object
         * @member KISSY
         */
        stamp: function (o, readOnly, marker) {
            marker = marker || STAMP_MARKER;
            var guid = o[marker];
            if (guid) {
                return guid;
            } else if (!readOnly) {
                try {
                    guid = o[marker] = S.guid(marker);
                }
                catch (e) {
                    guid = undefined;
                }
            }
            return guid;
        },


        /**
         * Get all the property names of o as array
         * @param {Object} o
         * @return {Array}
         * @member KISSY
         */
        keys: Obj.keys || function (o) {
            var result = [], p, i;

            for (p in o) {
                // S.keys(new XX())
                if (o.hasOwnProperty(p)) {
                    result.push(p);
                }
            }

            if (hasEnumBug) {
                for (i = enumProperties.length - 1; i >= 0; i--) {
                    p = enumProperties[i];
                    if (o.hasOwnProperty(p)) {
                        result.push(p);
                    }
                }
            }

            return result;
        },


        /**
         * Copies all the properties of s to r.
         * @method
         * @param {Object} r the augmented object
         * @param {Object} s the object need to augment
         * @param {Boolean|Object} [ov=TRUE] whether overwrite existing property or config.
         * @param {Boolean} [ov.overwrite=TRUE] whether overwrite existing property.
         * @param {String[]|Function} [ov.whitelist] array of white-list properties
         * @param {Boolean}[ov.deep=false] whether recursive mix if encounter object.
         * @param {String[]|Function} [wl] array of white-list properties
         * @param [deep=false] {Boolean} whether recursive mix if encounter object.
         * @return {Object} the augmented object
         * @member KISSY
         *
         * for example:
         *     @example
         *     var t = {};
         *     S.mix({x: {y: 2, z: 4}}, {x: {y: 3, a: t}}, {deep: TRUE}) => {x: {y: 3, z: 4, a: {}}}, a !== t
         *     S.mix({x: {y: 2, z: 4}}, {x: {y: 3, a: t}}, {deep: TRUE, overwrite: false}) => {x: {y: 2, z: 4, a: {}}}, a !== t
         *     S.mix({x: {y: 2, z: 4}}, {x: {y: 3, a: t}}, 1) => {x: {y: 3, a: t}}
         */
        mix: function (r, s, ov, wl, deep) {
            if (typeof ov === 'object') {
                wl = /**
                 @ignore
                 @type {String[]|Function}
                 */ov['whitelist'];
                deep = ov['deep'];
                ov = ov['overwrite'];
            }

            if (wl && (typeof wl !== 'function')) {
                var originalWl = wl;
                wl = function (name, val) {
                    return S.inArray(name, originalWl) ? val : undefined;
                };
            }

            if (ov === undefined) {
                ov = TRUE;
            }

            var cache = [],
                c,
                i = 0;
            mixInternal(r, s, ov, wl, deep, cache);
            while (c = cache[i++]) {
                delete c[MIX_CIRCULAR_DETECTION];
            }
            return r;
        },

        /**
         * Returns a new object containing all of the properties of
         * all the supplied objects. The properties from later objects
         * will overwrite those in earlier objects. Passing in a
         * single object will create a shallow copy of it.
         * @param {...Object} var_args objects need to be merged
         * @return {Object} the new merged object
         * @member KISSY
         */
        merge: function (var_args) {
            var_args = S.makeArray(arguments);
            var o = {},
                i,
                l = var_args.length;
            for (i = 0; i < l; i++) {
                S.mix(o, var_args[i]);
            }
            return o;
        },

        /**
         * Applies prototype properties from the supplier to the receiver.
         * @param   {Object} r received object
         * @param   {...Object} var_args object need to  augment
         *          {Boolean} [ov=TRUE] whether overwrite existing property
         *          {String[]} [wl] array of white-list properties
         * @return  {Object} the augmented object
         * @member KISSY
         */
        augment: function (r, var_args) {
            var args = S.makeArray(arguments),
                len = args.length - 2,
                i = 1,
                proto,
                arg,
                ov = args[len],
                wl = args[len + 1];

            if (!S.isArray(wl)) {
                ov = wl;
                wl = undefined;
                len++;
            }
            if (typeof ov !== 'boolean') {
                ov = undefined;
                len++;
            }

            for (; i < len; i++) {
                arg = args[i];
                if (proto = arg.prototype) {
                    arg = S.mix({}, proto, true, removeConstructor);
                }
                S.mix(r.prototype, arg, ov, wl);
            }

            return r;
        },

        /**
         * Utility to set up the prototype, constructor and superclass properties to
         * support an inheritance strategy that can chain constructors and methods.
         * Static members will not be inherited.
         * @param r {Function} the object to modify
         * @param s {Function} the object to inherit
         * @param {Object} [px] prototype properties to add/override
         * @param {Object} [sx] static properties to add/override
         * @return r {Object}
         * @member KISSY
         */
        extend: function (r, s, px, sx) {
            if (!s || !r) {
                return r;
            }

            var sp = s.prototype,
                rp;

            // in case parent does not set constructor
            // eg: parent.prototype={};
            sp.constructor = s;

            // add prototype chain
            rp = createObject(sp, r);
            r.prototype = S.mix(rp, r.prototype);
            r.superclass = sp;

            // add prototype overrides
            if (px) {
                S.mix(rp, px);
            }

            // add object overrides
            if (sx) {
                S.mix(r, sx);
            }

            return r;
        },


        /**
         * Returns the namespace specified and creates it if it doesn't exist. Be careful
         * when naming packages. Reserved words may work in some browsers and not others.
         *
         * for example:
         *      @example
         *      S.namespace('KISSY.app'); // returns KISSY.app
         *      S.namespace('app.Shop'); // returns KISSY.app.Shop
         *      S.namespace('TB.app.Shop', TRUE); // returns TB.app.Shop
         *
         * @return {Object}  A reference to the last namespace object created
         * @member KISSY
         */
        namespace: function () {
            var args = S.makeArray(arguments),
                l = args.length,
                o = null, i, j, p,
                global = (args[l - 1] === TRUE && l--);

            for (i = 0; i < l; i++) {
                p = (EMPTY + args[i]).split('.');
                o = global ? host : this;
                for (j = (host[p[0]] === o) ? 1 : 0; j < p.length; ++j) {
                    o = o[p[j]] = o[p[j]] || { };
                }
            }
            return o;
        }

    });

    function Empty() {
    }

    function createObject(proto, constructor) {
        var newProto;
        if (ObjectCreate) {
            newProto = ObjectCreate(proto);
        } else {
            Empty.prototype = proto;
            newProto = new Empty();
        }
        newProto.constructor = constructor;
        return newProto;
    }

    function mix(r, s) {
        for (var i in s) {
            r[i] = s[i];
        }
    }

    function mixInternal(r, s, ov, wl, deep, cache) {
        if (!s || !r) {
            return r;
        }
        var i, p, keys, len;

        // 记录循环标志
        s[MIX_CIRCULAR_DETECTION] = r;

        // 记录被记录了循环标志的对像
        cache.push(s);

        // mix all properties
        keys = S.keys(s);
        len = keys.length;
        for (i = 0; i < len; i++) {
            p = keys[i];
            if (p != MIX_CIRCULAR_DETECTION) {
                // no hasOwnProperty judge!
                _mix(p, r, s, ov, wl, deep, cache);
            }
        }

        return r;
    }

    function removeConstructor(k, v) {
        return k == 'constructor' ? undefined : v;
    }

    function _mix(p, r, s, ov, wl, deep, cache) {
        // 要求覆盖
        // 或者目的不存在
        // 或者深度mix
        if (ov || !(p in r) || deep) {
            var target = r[p],
                src = s[p];
            // prevent never-end loop
            if (target === src) {
                // S.mix({},{x:undefined})
                if (target === undefined) {
                    r[p] = target;
                }
                return;
            }
            if (wl) {
                src = wl.call(s, p, src);
            }
            // 来源是数组和对象，并且要求深度 mix
            if (deep && src && (S.isArray(src) || S.isPlainObject(src))) {
                if (src[MIX_CIRCULAR_DETECTION]) {
                    r[p] = src[MIX_CIRCULAR_DETECTION];
                } else {
                    // 目标值为对象或数组，直接 mix
                    // 否则 新建一个和源值类型一样的空数组/对象，递归 mix
                    var clone = target && (S.isArray(target) || S.isPlainObject(target)) ?
                        target :
                        (S.isArray(src) ? [] : {});
                    r[p] = clone;
                    mixInternal(clone, src, ov, wl, TRUE, cache);
                }
            } else if (src !== undefined && (ov || !(p in r))) {
                r[p] = src;
            }
        }
    }
})(KISSY);/**
 * @ignore
 * array utilities of lang
 * @author yiminghe@gmail.com
 *
 */
(function (S, undefined) {

    var TRUE = true,
        AP = Array.prototype,
        indexOf = AP.indexOf,
        lastIndexOf = AP.lastIndexOf,
        filter = AP.filter,
        every = AP.every,
        some = AP.some,
        map = AP.map,
        FALSE = false;

    S.mix(S, {
        /**
         * Executes the supplied function on each item in the array.
         * @param object {Object} the object to iterate
         * @param fn {Function} the function to execute on each item. The function
         *        receives three arguments: the value, the index, the full array.
         * @param {Object} [context]
         * @member KISSY
         */
        each: function (object, fn, context) {
            if (object) {
                var key,
                    val,
                    keys,
                    i = 0,
                    length = object && object.length,
                // do not use typeof obj == 'function': bug in phantomjs
                    isObj = length === undefined || S.type(object) == 'function';

                context = context || null;

                if (isObj) {
                    keys = S.keys(object);
                    for (; i < keys.length; i++) {
                        key = keys[i];
                        // can not use hasOwnProperty
                        if (fn.call(context, object[key], key, object) === FALSE) {
                            break;
                        }
                    }
                } else {
                    for (val = object[0];
                         i < length; val = object[++i]) {
                        if (fn.call(context, val, i, object) === FALSE) {
                            break;
                        }
                    }
                }
            }
            return object;
        },

        /**
         * Search for a specified value within an array.
         * @param item individual item to be searched
         * @method
         * @member KISSY
         * @param {Array} arr the array of items where item will be search
         * @return {number} item's index in array
         */
        indexOf: indexOf ?
            function (item, arr) {
                return indexOf.call(arr, item);
            } :
            function (item, arr) {
                for (var i = 0, len = arr.length; i < len; ++i) {
                    if (arr[i] === item) {
                        return i;
                    }
                }
                return -1;
            },

        /**
         * Returns the index of the last item in the array
         * that contains the specified value, -1 if the
         * value isn't found.
         * @method
         * @param item individual item to be searched
         * @param {Array} arr the array of items where item will be search
         * @return {number} item's last index in array
         * @member KISSY
         */
        lastIndexOf: (lastIndexOf) ?
            function (item, arr) {
                return lastIndexOf.call(arr, item);
            } :
            function (item, arr) {
                for (var i = arr.length - 1; i >= 0; i--) {
                    if (arr[i] === item) {
                        break;
                    }
                }
                return i;
            },

        /**
         * Returns a copy of the array with the duplicate entries removed
         * @param a {Array} the array to find the subset of unique for
         * @param [override] {Boolean} if override is TRUE, S.unique([a, b, a]) => [b, a].
         * if override is FALSE, S.unique([a, b, a]) => [a, b]
         * @return {Array} a copy of the array with duplicate entries removed
         * @member KISSY
         */
        unique: function (a, override) {
            var b = a.slice();
            if (override) {
                b.reverse();
            }
            var i = 0,
                n,
                item;

            while (i < b.length) {
                item = b[i];
                while ((n = S.lastIndexOf(item, b)) !== i) {
                    b.splice(n, 1);
                }
                i += 1;
            }

            if (override) {
                b.reverse();
            }
            return b;
        },

        /**
         * Search for a specified value index within an array.
         * @param item individual item to be searched
         * @param {Array} arr the array of items where item will be search
         * @return {Boolean} the item exists in arr
         * @member KISSY
         */
        inArray: function (item, arr) {
            return S.indexOf(item, arr) > -1;
        },

        /**
         * Executes the supplied function on each item in the array.
         * Returns a new array containing the items that the supplied
         * function returned TRUE for.
         * @member KISSY
         * @method
         * @param arr {Array} the array to iterate
         * @param fn {Function} the function to execute on each item
         * @param [context] {Object} optional context object
         * @return {Array} The items on which the supplied function returned TRUE.
         * If no items matched an empty array is returned.
         */
        filter: filter ?
            function (arr, fn, context) {
                return filter.call(arr, fn, context || this);
            } :
            function (arr, fn, context) {
                var ret = [];
                S.each(arr, function (item, i, arr) {
                    if (fn.call(context || this, item, i, arr)) {
                        ret.push(item);
                    }
                });
                return ret;
            },


        /**
         * Executes the supplied function on each item in the array.
         * Returns a new array containing the items that the supplied
         * function returned for.
         * @method
         * @param arr {Array} the array to iterate
         * @param fn {Function} the function to execute on each item
         * @param [context] {Object} optional context object
         * refer: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/map
         * @return {Array} The items on which the supplied function returned
         * @member KISSY
         */
        map: map ?
            function (arr, fn, context) {
                return map.call(arr, fn, context || this);
            } :
            function (arr, fn, context) {
                var len = arr.length,
                    res = new Array(len);
                for (var i = 0; i < len; i++) {
                    var el = typeof arr == 'string' ? arr.charAt(i) : arr[i];
                    if (el
                        ||
                        //ie<9 in invalid when typeof arr == string
                        i in arr) {
                        res[i] = fn.call(context || this, el, i, arr);
                    }
                }
                return res;
            },


        /**
         * Executes the supplied function on each item in the array.
         * Returns a value which is accumulation of the value that the supplied
         * function returned.
         *
         * @param arr {Array} the array to iterate
         * @param callback {Function} the function to execute on each item
         * @param initialValue {number} optional context object
         * refer: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/array/reduce
         * @return {Array} The items on which the supplied function returned
         * @member KISSY
         */
        reduce: /*
         NaN ?
         reduce ? function(arr, callback, initialValue) {
         return arr.reduce(callback, initialValue);
         } : */function (arr, callback, initialValue) {
            var len = arr.length;
            if (typeof callback !== 'function') {
                throw new TypeError('callback is not function!');
            }

            // no value to return if no initial value and an empty array
            if (len === 0 && arguments.length == 2) {
                throw new TypeError('arguments invalid');
            }

            var k = 0;
            var accumulator;
            if (arguments.length >= 3) {
                accumulator = arguments[2];
            }
            else {
                do {
                    if (k in arr) {
                        accumulator = arr[k++];
                        break;
                    }

                    // if array contains no values, no initial value to return
                    k += 1;
                    if (k >= len) {
                        throw new TypeError();
                    }
                }
                while (TRUE);
            }

            while (k < len) {
                if (k in arr) {
                    accumulator = callback.call(undefined, accumulator, arr[k], k, arr);
                }
                k++;
            }

            return accumulator;
        },

        /**
         * Tests whether all elements in the array pass the test implemented by the provided function.
         * @method
         * @param arr {Array} the array to iterate
         * @param callback {Function} the function to execute on each item
         * @param [context] {Object} optional context object
         * @member KISSY
         * @return {Boolean} whether all elements in the array pass the test implemented by the provided function.
         */
        every: every ?
            function (arr, fn, context) {
                return every.call(arr, fn, context || this);
            } :
            function (arr, fn, context) {
                var len = arr && arr.length || 0;
                for (var i = 0; i < len; i++) {
                    if (i in arr && !fn.call(context, arr[i], i, arr)) {
                        return FALSE;
                    }
                }
                return TRUE;
            },

        /**
         * Tests whether some element in the array passes the test implemented by the provided function.
         * @method
         * @param arr {Array} the array to iterate
         * @param callback {Function} the function to execute on each item
         * @param [context] {Object} optional context object
         * @member KISSY
         * @return {Boolean} whether some element in the array passes the test implemented by the provided function.
         */
        some: some ?
            function (arr, fn, context) {
                return some.call(arr, fn, context || this);
            } :
            function (arr, fn, context) {
                var len = arr && arr.length || 0;
                for (var i = 0; i < len; i++) {
                    if (i in arr && fn.call(context, arr[i], i, arr)) {
                        return TRUE;
                    }
                }
                return FALSE;
            },
        /**
         * Converts object to a TRUE array.
         * @param o {object|Array} array like object or array
         * @return {Array} native Array
         * @member KISSY
         */
        makeArray: function (o) {
            if (o == null) {
                return [];
            }
            if (S.isArray(o)) {
                return o;
            }
            var lengthType = typeof o.length,
                oType = typeof o;
            // The strings and functions also have 'length'
            if (lengthType != 'number' ||
                // form.elements in ie78 has nodeName 'form'
                // then caution select
                // o.nodeName
                // window
                o.alert ||
                oType == 'string' ||
                // https://github.com/ariya/phantomjs/issues/11478
                (oType == 'function' && !( 'item' in o && lengthType == 'number'))) {
                return [o];
            }
            var ret = [];
            for (var i = 0, l = o.length; i < l; i++) {
                ret[i] = o[i];
            }
            return ret;
        }
    });

})(KISSY);/**
 * @ignore
 * escape of lang
 * @author yiminghe@gmail.com
 *
 */
(function (S, undefined) {
    // IE doesn't include non-breaking-space (0xa0) in their \s character
    // class (as required by section 7.2 of the ECMAScript spec), we explicitly
    // include it in the regexp to enforce consistent cross-browser behavior.
    var SEP = '&',
        EMPTY = '',
        EQ = '=',
        logger= S.getLogger('s/lang'),
        TRUE = true,
    // FALSE = false,
        HEX_BASE = 16,
    // http://www.owasp.org/index.php/XSS_(Cross_Site_Scripting)_Prevention_Cheat_Sheet
    // http://wonko.com/post/html-escaping
        htmlEntities = {
            '&amp;': '&',
            '&gt;': '>',
            '&lt;': '<',
            '&#x60;': '`',
            '&#x2F;': '/',
            '&quot;': '"',
            '&#x27;': "'"
        },
        reverseEntities = {},
        escapeReg,
        unEscapeReg,
    // - # $ ^ * ( ) + [ ] { } | \ , . ?
        escapeRegExp = /[\-#$\^*()+\[\]{}|\\,.?\s]/g;
    (function () {
        for (var k in htmlEntities) {
            reverseEntities[htmlEntities[k]] = k;
        }
    })();

    function isValidParamValue(val) {
        var t = typeof val;
        // If the type of val is null, undefined, number, string, boolean, return TRUE.
        return val == null || (t !== 'object' && t !== 'function');
    }

    function getEscapeReg() {
        if (escapeReg) {
            return escapeReg
        }
        var str = EMPTY;
        S.each(htmlEntities, function (entity) {
            str += entity + '|';
        });
        str = str.slice(0, -1);
        return escapeReg = new RegExp(str, 'g');
    }

    function getUnEscapeReg() {
        if (unEscapeReg) {
            return unEscapeReg
        }
        var str = EMPTY;
        S.each(reverseEntities, function (entity) {
            str += entity + '|';
        });
        str += '&#(\\d{1,5});';
        return unEscapeReg = new RegExp(str, 'g');
    }

    S.mix(S, {

        /**
         * Call encodeURIComponent to encode a url component
         * @param {String} s part of url to be encoded.
         * @return {String} encoded url part string.
         * @member KISSY
         */
        urlEncode: function (s) {
            return encodeURIComponent(String(s));
        },

        /**
         * Call decodeURIComponent to decode a url component
         * and replace '+' with space.
         * @param {String} s part of url to be decoded.
         * @return {String} decoded url part string.
         * @member KISSY
         */
        urlDecode: function (s) {
            return decodeURIComponent(s.replace(/\+/g, ' '));
        },

        /**
         * frequently used in taobao cookie about nick
         * @member KISSY
         * @return {String} un-unicode string.
         */
        fromUnicode: function (str) {
            return str.replace(/\\u([a-f\d]{4})/ig, function (m, u) {
                return  String.fromCharCode(parseInt(u, HEX_BASE));
            });
        },
        /**
         * get escaped string from html.
         * only escape
         *      & > < ` / " '
         * refer:
         *
         * [http://yiminghe.javaeye.com/blog/788929](http://yiminghe.javaeye.com/blog/788929)
         *
         * [http://wonko.com/post/html-escaping](http://wonko.com/post/html-escaping)
         * @param str {string} text2html show
         * @member KISSY
         * @return {String} escaped html
         */
        escapeHtml: function (str) {
            return (str + '').replace(getEscapeReg(), function (m) {
                return reverseEntities[m];
            });
        },

        /**
         * get escaped regexp string for construct regexp.
         * @param str
         * @member KISSY
         * @return {String} escaped regexp
         */
        escapeRegExp: function (str) {
            return str.replace(escapeRegExp, '\\$&');
        },

        /**
         * un-escape html to string.
         * only unescape
         *      &amp; &lt; &gt; &#x60; &#x2F; &quot; &#x27; &#\d{1,5}
         * @param str {string} html2text
         * @member KISSY
         * @return {String} un-escaped html
         */
        unEscapeHtml: function (str) {
            return str.replace(getUnEscapeReg(), function (m, n) {
                return htmlEntities[m] || String.fromCharCode(+n);
            });
        },
        /**
         * Creates a serialized string of an array or object.
         *
         * for example:
         *     @example
         *     {foo: 1, bar: 2}    // -> 'foo=1&bar=2'
         *     {foo: 1, bar: [2, 3]}    // -> 'foo=1&bar=2&bar=3'
         *     {foo: '', bar: 2}    // -> 'foo=&bar=2'
         *     {foo: undefined, bar: 2}    // -> 'foo=undefined&bar=2'
         *     {foo: TRUE, bar: 2}    // -> 'foo=TRUE&bar=2'
         *
         * @param {Object} o json data
         * @param {String} [sep='&'] separator between each pair of data
         * @param {String} [eq='='] separator between key and value of data
         * @param {Boolean} [serializeArray=true] whether add '[]' to array key of data
         * @return {String}
         * @member KISSY
         */
        param: function (o, sep, eq, serializeArray) {
            sep = sep || SEP;
            eq = eq || EQ;
            if (serializeArray === undefined) {
                serializeArray = TRUE;
            }
            var buf = [], key, i, v, len, val,
                encode = S.urlEncode;
            for (key in o) {

                val = o[key];
                key = encode(key);

                // val is valid non-array value
                if (isValidParamValue(val)) {
                    buf.push(key);
                    if (val !== undefined) {
                        buf.push(eq, encode(val + EMPTY));
                    }
                    buf.push(sep);
                }
                // val is not empty array
                else if (S.isArray(val) && val.length) {
                    for (i = 0, len = val.length; i < len; ++i) {
                        v = val[i];
                        if (isValidParamValue(v)) {
                            buf.push(key, (serializeArray ? encode('[]') : EMPTY));
                            if (v !== undefined) {
                                buf.push(eq, encode(v + EMPTY));
                            }
                            buf.push(sep);
                        }
                    }
                }
                // ignore other cases, including empty array, Function, RegExp, Date etc.

            }
            buf.pop();
            return buf.join(EMPTY);
        },

        /**
         * Parses a URI-like query string and returns an object composed of parameter/value pairs.
         *
         * for example:
         *      @example
         *      'section=blog&id=45'        // -> {section: 'blog', id: '45'}
         *      'section=blog&tag=js&tag=doc' // -> {section: 'blog', tag: ['js', 'doc']}
         *      'tag=ruby%20on%20rails'        // -> {tag: 'ruby on rails'}
         *      'id=45&raw'        // -> {id: '45', raw: ''}
         * @param {String} str param string
         * @param {String} [sep='&'] separator between each pair of data
         * @param {String} [eq='='] separator between key and value of data
         * @return {Object} json data
         * @member KISSY
         */
        unparam: function (str, sep, eq) {
            if (typeof str != 'string' || !(str = S.trim(str))) {
                return {};
            }
            sep = sep || SEP;
            eq = eq || EQ;
            var ret = {},
                eqIndex,
                decode = S.urlDecode,
                pairs = str.split(sep),
                key, val,
                i = 0, len = pairs.length;

            for (; i < len; ++i) {
                eqIndex = pairs[i].indexOf(eq);
                if (eqIndex == -1) {
                    key = decode(pairs[i]);
                    val = undefined;
                } else {
                    // remember to decode key!
                    key = decode(pairs[i].substring(0, eqIndex));
                    val = pairs[i].substring(eqIndex + 1);
                    try {
                        val = decode(val);
                    } catch (e) {
                        logger.error('decodeURIComponent error : ' + val);
                        logger.error(e);
                    }
                    if (S.endsWith(key, '[]')) {
                        key = key.substring(0, key.length - 2);
                    }
                }
                if (key in ret) {
                    if (S.isArray(ret[key])) {
                        ret[key].push(val);
                    } else {
                        ret[key] = [ret[key], val];
                    }
                } else {
                    ret[key] = val;
                }
            }
            return ret;
        }
    });

    S.escapeHTML = S.escapeHtml;
    S.unEscapeHTML = S.unEscapeHtml;
})(KISSY);/**
 * @ignore
 * function utilities of lang
 * @author yiminghe@gmail.com
 *
 */
(function (S, undefined) {
    // ios Function.prototype.bind === undefined
    function bindFn(r, fn, obj) {
        var slice = [].slice,
            args = slice.call(arguments, 3),
            fNOP = function () {
            },
            bound = function () {
                var inArgs = slice.call(arguments);
                return fn.apply(
                    this instanceof fNOP ? this : obj,
                    (r ? inArgs.concat(args) : args.concat(inArgs))
                );
            };
        fNOP.prototype = fn.prototype;
        bound.prototype = new fNOP();
        return bound;
    }

    S.mix(S, {
        /**
         * empty function
         * @member KISSY
         */
        noop: function () {
        },
        /**
         * Creates a new function that, when called, itself calls this function in the context of the provided this value,
         * with a given sequence of arguments preceding any provided when the new function was called.
         * refer: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind
         * @param {Function} fn internal called function
         * @param {Object} obj context in which fn runs
         * @param {*...} var_args extra arguments
         * @member KISSY
         * @return {Function} new function with context and arguments
         */
        bind: bindFn(0, bindFn, null, 0),

        /**
         * Creates a new function that, when called, itself calls this function in the context of the provided this value,
         * with a given sequence of arguments preceding any provided when the new function was called.
         * refer: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind
         * @param {Function} fn internal called function
         * @param {Object} obj context in which fn runs
         * @param {*...} var_args extra arguments
         * @member KISSY
         * @return {Function} new function with context and arguments
         */
        rbind: bindFn(0, bindFn, null, 1),

        /**
         * Executes the supplied function in the context of the supplied
         * object 'when' milliseconds later. Executes the function a
         * single time unless periodic is set to true.
         *
         * @param fn {Function|String} the function to execute or the name of the method in
         * the 'o' object to execute.
         *
         * @param [when=0] {Number} the number of milliseconds to wait until the fn is executed.
         *
         * @param {Boolean} [periodic] if true, executes continuously at supplied interval
         * until canceled.
         *
         * @param {Object} [context] the context object.
         *
         * @param [data] that is provided to the function. This accepts either a single
         * item or an array. If an array is provided, the function is executed with
         * one parameter for each array item. If you need to pass a single array
         * parameter, it needs to be wrapped in an array.
         *
         * @return {Object} a timer object. Call the cancel() method on this object to stop
         * the timer.
         *
         * @member KISSY
         */
        later: function (fn, when, periodic, context, data) {
            when = when || 0;
            var m = fn,
                d = S.makeArray(data),
                f,
                r;

            if (typeof fn == 'string') {
                m = context[fn];
            }

            if (!m) {
                S.error('method undefined');
            }

            f = function () {
                m.apply(context, d);
            };

            r = (periodic) ? setInterval(f, when) : setTimeout(f, when);

            return {
                id: r,
                interval: periodic,
                cancel: function () {
                    if (this.interval) {
                        clearInterval(r);
                    } else {
                        clearTimeout(r);
                    }
                }
            };
        },


        /**
         * Throttles a call to a method based on the time between calls.
         * @param {Function} fn The function call to throttle.
         * @param {Object} [context] context fn to run
         * @param {Number} [ms] The number of milliseconds to throttle the method call.
         * Passing a -1 will disable the throttle. Defaults to 150.
         * @return {Function} Returns a wrapped function that calls fn throttled.
         * @member KISSY
         */
        throttle: function (fn, ms, context) {
            ms = ms || 150;

            if (ms === -1) {
                return (function () {
                    fn.apply(context || this, arguments);
                });
            }

            var last = S.now();

            return (function () {
                var now = S.now();
                if (now - last > ms) {
                    last = now;
                    fn.apply(context || this, arguments);
                }
            });
        },

        /**
         * buffers a call between a fixed time
         * @param {Function} fn
         * @param {Number} ms
         * @param {Object} [context]
         * @return {Function} Returns a wrapped function that calls fn buffered.
         * @member KISSY
         */
        buffer: function (fn, ms, context) {
            ms = ms || 150;

            if (ms === -1) {
                return function () {
                    fn.apply(context || this, arguments);
                };
            }
            var bufferTimer = null;

            function f() {
                f.stop();
                bufferTimer = S.later(fn, ms, 0, context || this, arguments);
            }

            f.stop = function () {
                if (bufferTimer) {
                    bufferTimer.cancel();
                    bufferTimer = 0;
                }
            };

            return f;
        }
    });
})(KISSY);/**
 * @ignore
 *   lang
 * @author  yiminghe@gmail.com, lifesinger@gmail.com
 *
 */
(function (S, undefined) {

    var TRUE = true,
        FALSE = false,
        CLONE_MARKER = '__~ks_cloned',
        COMPARE_MARKER = '__~ks_compared';

    S.mix(S, {
            /**
             * Checks to see whether two object are equals.
             * @param a 比较目标1
             * @param b 比较目标2
             * @param [mismatchKeys] internal usage
             * @param [mismatchValues] internal usage
             * @return {Boolean} a.equals(b)
             * @member KISSY
             */
            equals: function (a, b, /*internal use*/mismatchKeys, /*internal use*/mismatchValues) {
                // inspired by jasmine
                mismatchKeys = mismatchKeys || [];
                mismatchValues = mismatchValues || [];

                if (a === b) {
                    return TRUE;
                }
                if (a === undefined || a === null || b === undefined || b === null) {
                    // need type coercion
                    return a == null && b == null;
                }
                if (a instanceof Date && b instanceof Date) {
                    return a.getTime() == b.getTime();
                }
                if (typeof a == 'string' && typeof b == 'string') {
                    return (a == b);
                }
                if (typeof a==='number' && typeof b==='number') {
                    return (a == b);
                }
                if (typeof a === 'object' && typeof b === 'object') {
                    return compareObjects(a, b, mismatchKeys, mismatchValues);
                }
                // Straight check
                return (a === b);
            },

            /**
             * Creates a deep copy of a plain object or array. Others are returned untouched.
             * @param input
             * @member KISSY
             * @param {Function} [filter] filter function
             * @return {Object} the new cloned object
             * refer: http://www.w3.org/TR/html5/common-dom-interfaces.html#safe-passing-of-structured-data
             */
            clone: function (input, filter) {
                // 稍微改改就和规范一样了 :)
                // Let memory be an association list of pairs of objects,
                // initially empty. This is used to handle duplicate references.
                // In each pair of objects, one is called the source object
                // and the other the destination object.
                var memory = {},
                    ret = cloneInternal(input, filter, memory);
                S.each(memory, function (v) {
                    // 清理在源对象上做的标记
                    v = v.input;
                    if (v[CLONE_MARKER]) {
                        try {
                            delete v[CLONE_MARKER];
                        } catch (e) {
                            v[CLONE_MARKER] = undefined;
                        }
                    }
                });
                memory = null;
                return ret;
            },

            /**
             * Gets current date in milliseconds.
             * @method
             * refer:  https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/now
             * http://j-query.blogspot.com/2011/02/timing-ecmascript-5-datenow-function.html
             * http://kangax.github.com/es5-compat-table/
             * @member KISSY
             * @return {Number} current time
             */
            now: Date.now || function () {
                return +new Date();
            }
        });

    function cloneInternal(input, f, memory) {
        var destination = input,
            isArray,
            isPlainObject,
            k,
            stamp;
        if (!input) {
            return destination;
        }

        // If input is the source object of a pair of objects in memory,
        // then return the destination object in that pair of objects .
        // and abort these steps.
        if (input[CLONE_MARKER]) {
            // 对应的克隆后对象
            return memory[input[CLONE_MARKER]].destination;
        } else if (typeof input === 'object') {
            // 引用类型要先记录
            var constructor = input.constructor;
            if (S.inArray(constructor, [Boolean, String, Number, Date, RegExp])) {
                destination = new constructor(input.valueOf());
            }
            // ImageData , File, Blob , FileList .. etc
            else if (isArray = S.isArray(input)) {
                destination = f ? S.filter(input, f) : input.concat();
            } else if (isPlainObject = S.isPlainObject(input)) {
                destination = {};
            }
            // Add a mapping from input (the source object)
            // to output (the destination object) to memory.
            // 做标记
            input[CLONE_MARKER] = (stamp = S.guid());
            // 存储源对象以及克隆后的对象
            memory[stamp] = {destination: destination, input: input};
        }
        // If input is an Array object or an Object object,
        // then, for each enumerable property in input,
        // add a new property to output having the same name,
        // and having a value created from invoking the internal structured cloning algorithm recursively
        // with the value of the property as the 'input' argument and memory as the 'memory' argument.
        // The order of the properties in the input and output objects must be the same.

        // clone it
        if (isArray) {
            for (var i = 0; i < destination.length; i++) {
                destination[i] = cloneInternal(destination[i], f, memory);
            }
        } else if (isPlainObject) {
            for (k in input) {

                if (k !== CLONE_MARKER &&
                    (!f || (f.call(input, input[k], k, input) !== FALSE))) {
                    destination[k] = cloneInternal(input[k], f, memory);
                }

            }
        }

        return destination;
    }

    function compareObjects(a, b, mismatchKeys, mismatchValues) {
        // 两个比较过了，无需再比较，防止循环比较
        if (a[COMPARE_MARKER] === b && b[COMPARE_MARKER] === a) {
            return TRUE;
        }
        a[COMPARE_MARKER] = b;
        b[COMPARE_MARKER] = a;
        var hasKey = function (obj, keyName) {
            return (obj !== null && obj !== undefined) && obj[keyName] !== undefined;
        };
        for (var property in b) {

            if (!hasKey(a, property) && hasKey(b, property)) {
                mismatchKeys.push("expected has key '" + property + "', but missing from actual.");
            }

        }
        for (property in a) {

            if (!hasKey(b, property) && hasKey(a, property)) {
                mismatchKeys.push("expected missing key '" + property + "', but present in actual.");
            }

        }
        for (property in b) {

            if (property == COMPARE_MARKER) {
                continue;
            }
            if (!S.equals(a[property], b[property], mismatchKeys, mismatchValues)) {
                mismatchValues.push("'" + property + "' was '" + (b[property] ? (b[property].toString()) : b[property])
                    + "' in expected, but was '" +
                    (a[property] ? (a[property].toString()) : a[property]) + "' in actual.");
            }

        }
        if (S.isArray(a) && S.isArray(b) && a.length != b.length) {
            mismatchValues.push('arrays were not the same length');
        }
        delete a[COMPARE_MARKER];
        delete b[COMPARE_MARKER];
        return (mismatchKeys.length === 0 && mismatchValues.length === 0);
    }

})(KISSY);
/**
 * @ignore
 * string utilities of lang
 * @author yiminghe@gmail.com
 *
 */
(function (S, undefined) {

    // IE doesn't include non-breaking-space (0xa0) in their \s character
    // class (as required by section 7.2 of the ECMAScript spec), we explicitly
    // include it in the regexp to enforce consistent cross-browser behavior.
    var RE_TRIM = /^[\s\xa0]+|[\s\xa0]+$/g,
        trim = String.prototype.trim,
        SUBSTITUTE_REG = /\\?\{([^{}]+)\}/g,
        EMPTY = '';

    S.mix(S, {
        /**
         * Removes the whitespace from the beginning and end of a string.
         * @method
         * @member KISSY
         */
        trim: trim ?
            function (str) {
                return str == null ? EMPTY : trim.call(str);
            } :
            function (str) {
                return str == null ? EMPTY : (str + '').replace(RE_TRIM, EMPTY);
            },

        /**
         * Substitutes keywords in a string using an object/array.
         * Removes undefined keywords and ignores escaped keywords.
         * @param {String} str template string
         * @param {Object} o json data
         * @member KISSY
         * @param {RegExp} [regexp] to match a piece of template string
         */
        substitute: function (str, o, regexp) {
            if (typeof str != 'string' || !o) {
                return str;
            }

            return str.replace(regexp || SUBSTITUTE_REG, function (match, name) {
                if (match.charAt(0) === '\\') {
                    return match.slice(1);
                }
                return (o[name] === undefined) ? EMPTY : o[name];
            });
        },

        /** uppercase first character.
         * @member KISSY
         * @param s
         * @return {String}
         */
        ucfirst: function (s) {
            s += '';
            return s.charAt(0).toUpperCase() + s.substring(1);
        },
        /**
         * test whether a string start with a specified substring
         * @param {String} str the whole string
         * @param {String} prefix a specified substring
         * @return {Boolean} whether str start with prefix
         * @member KISSY
         */
        startsWith: function (str, prefix) {
            return str.lastIndexOf(prefix, 0) === 0;
        },

        /**
         * test whether a string end with a specified substring
         * @param {String} str the whole string
         * @param {String} suffix a specified substring
         * @return {Boolean} whether str end with suffix
         * @member KISSY
         */
        endsWith: function (str, suffix) {
            var ind = str.length - suffix.length;
            return ind >= 0 && str.indexOf(suffix, ind) == ind;
        }

    });
})(KISSY);/**
 * @ignore
 * type judgement
 * @author yiminghe@gmail.com, lifesinger@gmail.com
 *
 */
(function (S, undefined) {
    // [[Class]] -> type pairs
    var class2type = {},
        FALSE = false,
        noop = S.noop,
        OP = Object.prototype,
        toString = OP.toString;

    function hasOwnProperty(o, p) {
        return OP.hasOwnProperty.call(o, p);
    }

    S.mix(S, {
        /**
         * Determine the internal JavaScript [[Class]] of an object.
         * @member KISSY
         */
        type: function (o) {
            return o == null ?
                String(o) :
                class2type[toString.call(o)] || 'object';
        },

        /**
         * whether o === null
         * @param o
         * @member KISSY
         */
        isNull: function (o) {
            return o === null;
        },

        /**
         * whether o === undefined
         * @param o
         * @member KISSY
         */
        isUndefined: function (o) {
            return o === undefined;
        },

        /**
         * Checks to see if an object is empty.
         * @member KISSY
         */
        isEmptyObject: function (o) {
            for (var p in o) {
                if (p !== undefined) {
                    return FALSE;
                }
            }
            return true;
        },

        /**
         * Checks to see if an object is a plain object (created using '{}'
         * or 'new Object()' but not 'new FunctionClass()').
         * @member KISSY
         */
        isPlainObject: function (obj) {
            // Must be an Object.
            // Because of IE, we also have to check the presence of the constructor property.
            // Make sure that Dom nodes and window objects don't pass through, as well
            if (!obj || S.type(obj) !== "object" || obj.nodeType || obj.window == obj) {
                return FALSE;
            }

            var key, objConstructor;

            try {
                // Not own constructor property must be Object
                if ((objConstructor = obj.constructor) && !hasOwnProperty(obj, "constructor") && !hasOwnProperty(objConstructor.prototype, "isPrototypeOf")) {
                    return FALSE;
                }
            } catch (e) {
                // IE8,9 Will throw exceptions on certain host objects
                return FALSE;
            }

            // Own properties are enumerated firstly, so to speed up,
            // if last one is own, then all properties are own.


            for (key in obj) {
            }

            return key === undefined || hasOwnProperty(obj, key);
        }
    });

    if ('@DEBUG@') {
        S.mix(S, {
            /**
             * test whether o is boolean
             * @method
             * @param  o
             * @return {Boolean}
             * @member KISSY
             */
            isBoolean: noop,
            /**
             * test whether o is number
             * @method
             * @param  o
             * @return {Boolean}
             * @member KISSY
             */
            isNumber: noop,
            /**
             * test whether o is String
             * @method
             * @param  o
             * @return {Boolean}
             * @member KISSY
             */
            isString: noop,
            /**
             * test whether o is function
             * @method
             * @param  o
             * @return {Boolean}
             * @member KISSY
             */
            isFunction: noop,
            /**
             * test whether o is Array
             * @method
             * @param  o
             * @return {Boolean}
             * @member KISSY
             */
            isArray: noop,
            /**
             * test whether o is Date
             * @method
             * @param  o
             * @return {Boolean}
             * @member KISSY
             */
            isDate: noop,
            /**
             * test whether o is RegExp
             * @method
             * @param  o
             * @return {Boolean}
             * @member KISSY
             */
            isRegExp: noop,
            /**
             * test whether o is Object
             * @method
             * @param  o
             * @return {Boolean}
             * @member KISSY
             */
            isObject: noop
        });
    }

    S.each('Boolean Number String Function Date RegExp Object Array'.split(' '), function (name, lc) {
        // populate the class2type map
        class2type['[object ' + name + ']'] = (lc = name.toLowerCase());

        // add isBoolean/isNumber/...
        S['is' + name] = function (o) {
            return S.type(o) == lc;
        }
    });
    S.isArray = Array.isArray || S.isArray;
})(KISSY);/*
 setImmediate polyfill inspired by Q
 @author yiminghe@gmail.com
 */
(function (S) {
    var queue = [];

    var flushing = 0;

    function flush() {
        var i = 0, item;
        while (item = queue[i++]) {
            try {
                item();
            } catch (e) {
                setTimeout(function () {
                    throw e;
                }, 0);
            }
        }
        if (i > 1) {
            queue = [];
        }
        flushing = 0;
    }

    /*
      setImmediate for loader and promise
      @param {Function} fn async function to call
      @private
     */
    S.setImmediate = function (fn) {
        queue.push(fn);
        if (!flushing) {
            flushing = 1;
            requestFlush();
        }
    };

    var requestFlush;
    if (typeof setImmediate === "function") {
        requestFlush = function () {
            setImmediate(flush);
        };
    } else if (typeof process !== 'undefined' && typeof  process.nextTick == 'function') {
        requestFlush = function () {
            process.nextTick(flush);
        };
    } else if (typeof MessageChannel !== "undefined") {
        // modern browsers
        // http://msdn.microsoft.com/en-us/library/windows/apps/hh441303.aspx
        var channel = new MessageChannel();
        // At least Safari Version 6.0.5 (8536.30.1) intermittently cannot create
        // working message ports the first time a page loads.
        channel.port1.onmessage = function () {
            requestFlush = realRequestFlush;
            channel.port1.onmessage = flush;
            flush();
        };
        var realRequestFlush = function () {
            // Opera requires us to provide a message payload, regardless of
            // whether we use it.
            channel.port2.postMessage(0);
        };
        requestFlush = function () {
            setTimeout(flush, 0);
            realRequestFlush();
        };

    } else {
        // old browsers
        requestFlush = function () {
            setTimeout(flush, 0);
        };
    }
})(KISSY);/**
 * @ignore
 * Port Node Utils For KISSY.
 * Note: Only posix mode.
 * @author yiminghe@gmail.com
 */
(function (S) {
    // [root, dir, basename, ext]
    var splitPathRe = /^(\/?)([\s\S]+\/(?!$)|\/)?((?:\.{1,2}$|[\s\S]+?)?(\.[^.\/]*)?)$/;


    // Remove .. and . in path array
    function normalizeArray(parts, allowAboveRoot) {
        // level above root
        var up = 0,
            i = parts.length - 1,
        // splice costs a lot in ie
        // use new array instead
            newParts = [],
            last;

        for (; i >= 0; i--) {
            last = parts[i];
            if (last == '.') {
            } else if (last === '..') {
                up++;
            } else if (up) {
                up--;
            } else {
                newParts[newParts.length] = last;
            }
        }

        // if allow above root, has to add ..
        if (allowAboveRoot) {
            for (; up--; up) {
                newParts[newParts.length] = '..';
            }
        }

        newParts = newParts.reverse();

        return newParts;
    }

    /**
     * Path Utils For KISSY.
     * @class KISSY.Path
     * @singleton
     */
    var Path = S.Path = {

        /**
         * resolve([from ...], to)
         * @return {String} Resolved path.
         */
        resolve: function () {
            var resolvedPath = '',
                resolvedPathStr,
                i,
                args = (arguments),
                path,
                absolute = 0;

            for (i = args.length - 1; i >= 0 && !absolute; i--) {
                path = args[i];
                if (typeof path != 'string' || !path) {
                    continue;
                }
                resolvedPath = path + '/' + resolvedPath;
                absolute = path.charAt(0) == '/';
            }

            resolvedPathStr = normalizeArray(S.filter(resolvedPath.split('/'), function (p) {
                return !!p;
            }), !absolute).join('/');

            return ((absolute ? '/' : '') + resolvedPathStr) || '.';
        },

        /**
         * normalize .. and . in path
         * @param {String} path Path tobe normalized
         *
         *
         *      'x/y/../z' => 'x/z'
         *      'x/y/z/../' => 'x/y/'
         *
         * @return {String}
         */
        normalize: function (path) {
            var absolute = path.charAt(0) == '/',
                trailingSlash = path.slice(-1) == '/';

            path = normalizeArray(S.filter(path.split('/'), function (p) {
                return !!p;
            }), !absolute).join('/');

            if (!path && !absolute) {
                path = '.';
            }

            if (path && trailingSlash) {
                path += '/';
            }


            return (absolute ? '/' : '') + path;
        },

        /**
         * join([path ...]) and normalize
         * @return {String}
         */
        join: function () {
            var args = S.makeArray(arguments);
            return Path.normalize(S.filter(args,function (p) {
                return p && (typeof p == 'string');
            }).join('/'));
        },

        /**
         * Get string which is to relative to from
         * @param {String} from
         * @param {String} to
         *
         *
         *      relative('x/','x/y/z') => 'y/z'
         *      relative('x/t/z','x/') => '../../'
         *
         * @return {String}
         */
        relative: function (from, to) {
            from = Path.normalize(from);
            to = Path.normalize(to);

            var fromParts = S.filter(from.split('/'), function (p) {
                    return !!p;
                }),
                path = [],
                sameIndex,
                sameIndex2,
                toParts = S.filter(to.split('/'), function (p) {
                    return !!p;
                }), commonLength = Math.min(fromParts.length, toParts.length);

            for (sameIndex = 0; sameIndex < commonLength; sameIndex++) {
                if (fromParts[sameIndex] != toParts[sameIndex]) {
                    break;
                }
            }

            sameIndex2 = sameIndex;

            while (sameIndex < fromParts.length) {
                path.push('..');
                sameIndex++;
            }

            path = path.concat(toParts.slice(sameIndex2));

            path = path.join('/');

            return /**@type String  @ignore*/path;
        },

        /**
         * Get base name of path
         * @param {String} path
         * @param {String} [ext] ext to be stripped from result returned.
         * @return {String}
         */
        basename: function (path, ext) {
            var result = path.match(splitPathRe) || [],
                basename;
            basename = result[3] || '';
            if (ext && basename && basename.slice(-1 * ext.length) == ext) {
                basename = basename.slice(0, -1 * ext.length);
            }
            return basename;
        },

        /**
         * Get dirname of path
         * @param {String} path
         * @return {String}
         */
        dirname: function (path) {
            var result = path.match(splitPathRe) || [],
                root = result[1] || '',
                dir = result[2] || '';

            if (!root && !dir) {
                // No dirname
                return '.';
            }

            if (dir) {
                // It has a dirname, strip trailing slash
                dir = dir.substring(0, dir.length - 1);
            }

            return root + dir;
        },

        /**
         * Get extension name of file in path
         * @param {String} path
         * @return {String}
         */
        extname: function (path) {
            return (path.match(splitPathRe) || [])[4] || '';
        }
    };
})(KISSY);
/*
 Refer
 - https://github.com/joyent/node/blob/master/lib/path.js
 *//**
 * @ignore
 * Uri class for KISSY.
 * @author yiminghe@gmail.com
 */
(function (S, undefined) {
    var reDisallowedInSchemeOrUserInfo = /[#\/\?@]/g,
        reDisallowedInPathName = /[#\?]/g,
        logger= S.getLogger('s/uri'),
    // ?? combo of taobao
        reDisallowedInQuery = /[#@]/g,
        reDisallowedInFragment = /#/g,

        URI_SPLIT_REG = new RegExp(
            '^' +
                /*
                 Scheme names consist of a sequence of characters beginning with a
                 letter and followed by any combination of letters, digits, plus
                 ('+'), period ('.'), or hyphen ('-').
                 */
                '(?:([\\w\\d+.-]+):)?' + // scheme

                '(?://' +
                /*
                 The authority component is preceded by a double slash ('//') and is
                 terminated by the next slash ('/'), question mark ('?'), or number
                 sign ('#') character, or by the end of the URI.
                 */
                '(?:([^/?#@]*)@)?' + // userInfo

                '(' +
                '[\\w\\d\\-\\u0100-\\uffff.+%]*' +
                '|' +
                // ipv6
                '\\[[^\\]]+\\]' +
                ')' + // hostname - restrict to letters,
                // digits, dashes, dots, percent
                // escapes, and unicode characters.
                '(?::([0-9]+))?' + // port
                ')?' +
                /*
                 The path is terminated
                 by the first question mark ('?') or number sign ('#') character, or
                 by the end of the URI.
                 */
                '([^?#]+)?' + // path. hierarchical part
                /*
                 The query component is indicated by the first question
                 mark ('?') character and terminated by a number sign ('#') character
                 or by the end of the URI.
                 */
                '(?:\\?([^#]*))?' + // query. non-hierarchical data
                /*
                 The fragment identifier component of a URI allows indirect
                 identification of a secondary resource by reference to a primary
                 resource and additional identifying information.

                 A
                 fragment identifier component is indicated by the presence of a
                 number sign ('#') character and terminated by the end of the URI.
                 */
                '(?:#(.*))?' + // fragment
                '$'),

        Path = S.Path,

        REG_INFO = {
            scheme: 1,
            userInfo: 2,
            hostname: 3,
            port: 4,
            path: 5,
            query: 6,
            fragment: 7
        };

    function parseQuery(self) {
        if (!self._queryMap) {
            self._queryMap = S.unparam(self._query);
        }
    }

    /**
     * @class KISSY.Uri.Query
     * Query data structure.
     * @param {String} [query] encoded query string(without question mask).
     */
    function Query(query) {
        this._query = query || '';
    }

    Query.prototype = {
        constructor: Query,

        /**
         * Cloned new instance.
         * @return {KISSY.Uri.Query}
         */
        clone: function () {
            return new Query(this.toString());
        },


        /**
         * reset to a new query string
         * @param {String} query
         * @chainable
         */
        reset: function (query) {
            var self = this;
            self._query = query || '';
            self._queryMap = null;
            return self;
        },

        /**
         * Parameter count.
         * @return {Number}
         */
        count: function () {
            var self = this,
                count = 0,
                _queryMap,
                k;
            parseQuery(self);
            _queryMap = self._queryMap;
            for (k in _queryMap) {

                if (S.isArray(_queryMap[k])) {
                    count += _queryMap[k].length;
                } else {
                    count++;
                }

            }
            return count;
        },

        /**
         * judge whether has query parameter
         * @param {String} [key]
         */
        has: function (key) {
            var self = this, _queryMap;
            parseQuery(self);
            _queryMap = self._queryMap;
            if (key) {
                return key in _queryMap;
            } else {
                return !S.isEmptyObject(_queryMap);
            }
        },

        /**
         * Return parameter value corresponding to current key
         * @param {String} [key]
         */
        get: function (key) {
            var self = this, _queryMap;
            parseQuery(self);
            _queryMap = self._queryMap;
            if (key) {
                return _queryMap[key];
            } else {
                return _queryMap;
            }
        },

        /**
         * Parameter names.
         * @return {String[]}
         */
        keys: function () {
            var self = this;
            parseQuery(self);
            return S.keys(self._queryMap);
        },

        /**
         * Set parameter value corresponding to current key
         * @param {String} key
         * @param value
         * @chainable
         */
        set: function (key, value) {
            var self = this, _queryMap;
            parseQuery(self);
            _queryMap = self._queryMap;
            if (typeof key == 'string') {
                self._queryMap[key] = value;
            } else {
                if (key instanceof Query) {
                    key = key.get();
                }
                S.each(key, function (v, k) {
                    _queryMap[k] = v;
                });
            }
            return self;
        },

        /**
         * Remove parameter with specified name.
         * @param {String} key
         * @chainable
         */
        remove: function (key) {
            var self = this;
            parseQuery(self);
            if (key) {
                delete self._queryMap[key];
            } else {
                self._queryMap = {};
            }
            return self;

        },

        /**
         * Add parameter value corresponding to current key
         * @param {String} key
         * @param value
         * @chainable
         */
        add: function (key, value) {
            var self = this,
                _queryMap,
                currentValue;
            if (typeof key == 'string') {
                parseQuery(self);
                _queryMap = self._queryMap;
                currentValue = _queryMap[key];
                if (currentValue === undefined) {
                    currentValue = value;
                } else {
                    currentValue = [].concat(currentValue).concat(value);
                }
                _queryMap[key] = currentValue;
            } else {
                if (key instanceof Query) {
                    key = key.get();
                }
                for (var k in key) {
                    self.add(k, key[k]);
                }
            }
            return self;
        },

        /**
         * Serialize query to string.
         * @param {Boolean} [serializeArray=true]
         * whether append [] to key name when value 's type is array
         */
        toString: function (serializeArray) {
            var self = this;
            parseQuery(self);
            return S.param(self._queryMap, undefined, undefined, serializeArray);
        }
    };

    function padding2(str) {
        return str.length == 1 ? '0' + str : str;
    }

    function equalsIgnoreCase(str1, str2) {
        return str1.toLowerCase() == str2.toLowerCase();
    }

    // www.ta#bao.com // => www.ta.com/#bao.com
    // www.ta%23bao.com
    // Percent-Encoding
    function encodeSpecialChars(str, specialCharsReg) {
        // encodeURI( ) is intended to encode complete URIs,
        // the following ASCII punctuation characters,
        // which have special meaning in URIs, are not escaped either:
        // ; / ? : @ & = + $ , #
        return encodeURI(str).replace(specialCharsReg, function (m) {
            return '%' + padding2(m.charCodeAt(0).toString(16));
        });
    }

    /**
     * @class KISSY.Uri
     * Uri class for KISSY.
     * Most of its interfaces are same with window.location.
     * @param {String|KISSY.Uri} [uriStr] Encoded uri string.
     */
    function Uri(uriStr) {

        if (uriStr instanceof  Uri) {
            return uriStr['clone']();
        }

        var components, self = this;

        S.mix(self,
            {
                /**
                 * scheme such as 'http:'. aka protocol without colon
                 * @type {String}
                 */
                scheme: '',
                /**
                 * User credentials such as 'yiminghe:gmail'
                 * @type {String}
                 */
                userInfo: '',
                /**
                 * hostname such as 'docs.kissyui.com'. aka domain
                 * @type {String}
                 */
                hostname: '',
                /**
                 * Port such as '8080'
                 * @type {String}
                 */
                port: '',
                /**
                 * path such as '/index.htm'. aka pathname
                 * @type {String}
                 */
                path: '',
                /**
                 * Query object for search string. aka search
                 * @type {KISSY.Uri.Query}
                 */
                query: '',
                /**
                 * fragment such as '#!/test/2'. aka hash
                 */
                fragment: ''
            });

        components = Uri.getComponents(uriStr);

        S.each(components, function (v, key) {
            v = v || '';
            if (key == 'query') {
                // need encoded content
                self.query = new Query(v);
            } else {
                // https://github.com/kissyteam/kissy/issues/298
                try {
                    v = S.urlDecode(v);
                } catch (e) {
                    logger.error(e + 'urlDecode error : ' + v);
                }
                // need to decode to get data structure in memory
                self[key] = v;
            }
        });

        return self;
    }

    Uri.prototype = {
        constructor: Uri,

        /**
         * Return a cloned new instance.
         * @return {KISSY.Uri}
         */
        clone: function () {
            var uri = new Uri(), self = this;
            S.each(REG_INFO, function (index, key) {
                uri[key] = self[key];
            });
            uri.query = uri.query.clone();
            return uri;
        },


        /**
         * The reference resolution algorithm.rfc 5.2
         * return a resolved uri corresponding to current uri
         * @param {KISSY.Uri|String} relativeUri
         *
         * for example:
         *      @example
         *      this: 'http://y/yy/z.com?t=1#v=2'
         *      'https:/y/' => 'https:/y/'
         *      '//foo' => 'http://foo'
         *      'foo' => 'http://y/yy/foo'
         *      '/foo' => 'http://y/foo'
         *      '?foo' => 'http://y/yy/z.com?foo'
         *      '#foo' => http://y/yy/z.com?t=1#foo'
         *
         * @return {KISSY.Uri}
         */
        resolve: function (relativeUri) {

            if (typeof relativeUri == 'string') {
                relativeUri = new Uri(relativeUri);
            }

            var self = this,
                override = 0,
                lastSlashIndex,
                order = ['scheme', 'userInfo', 'hostname', 'port', 'path', 'query', 'fragment'],
                target = self.clone();

            S.each(order, function (o) {
                if (o == 'path') {
                    // relativeUri does not set for scheme/userInfo/hostname/port
                    if (override) {
                        target[o] = relativeUri[o];
                    } else {
                        var path = relativeUri['path'];
                        if (path) {
                            // force to override target 's query with relative
                            override = 1;
                            if (!S.startsWith(path, '/')) {
                                if (target.hostname && !target.path) {
                                    // RFC 3986, section 5.2.3, case 1
                                    path = '/' + path;
                                } else if (target.path) {
                                    // RFC 3986, section 5.2.3, case 2
                                    lastSlashIndex = target.path.lastIndexOf('/');
                                    if (lastSlashIndex != -1) {
                                        path = target.path.slice(0, lastSlashIndex + 1) + path;
                                    }
                                }
                            }
                            // remove .. / .  as part of the resolution process
                            target.path = Path.normalize(path);
                        }
                    }
                } else if (o == 'query') {
                    if (override || relativeUri['query'].toString()) {
                        target.query = relativeUri['query'].clone();
                        override = 1;
                    }
                } else if (override || relativeUri[o]) {
                    target[o] = relativeUri[o];
                    override = 1;
                }
            });

            return target;

        },

        /**
         * Get scheme part
         */
        getScheme: function () {
            return this.scheme;
        },

        /**
         * Set scheme part
         * @param {String} scheme
         * @chainable
         */
        setScheme: function (scheme) {
            this.scheme = scheme;
            return this;
        },

        /**
         * Return hostname
         * @return {String}
         */
        getHostname: function () {
            return this.hostname;
        },

        /**
         * Set hostname
         * @param {String} hostname
         * @chainable
         */
        setHostname: function (hostname) {
            this.hostname = hostname;
            return this;
        },

        /**
         * Set user info
         * @param {String} userInfo
         * @chainable
         */
        'setUserInfo': function (userInfo) {
            this.userInfo = userInfo;
            return this;
        },

        /**
         * Get user info
         * @return {String}
         */
        getUserInfo: function () {
            return this.userInfo;
        },

        /**
         * Set port
         * @param {String} port
         * @chainable
         */
        'setPort': function (port) {
            this.port = port;
            return this;
        },

        /**
         * Get port
         * @return {String}
         */
        'getPort': function () {
            return this.port;
        },

        /**
         * Set path
         * @param {string} path
         * @chainable
         */
        setPath: function (path) {
            this.path = path;
            return this;
        },

        /**
         * Get path
         * @return {String}
         */
        getPath: function () {
            return this.path;
        },

        /**
         * Set query
         * @param {String|KISSY.Uri.Query} query
         * @chainable
         */
        'setQuery': function (query) {
            if (typeof query == 'string') {
                if (S.startsWith(query, '?')) {
                    query = query.slice(1);
                }
                query = new Query(encodeSpecialChars(query, reDisallowedInQuery));
            }
            this.query = query;
            return this;
        },

        /**
         * Get query
         * @return {KISSY.Uri.Query}
         */
        getQuery: function () {
            return this.query;
        },

        /**
         * Get fragment
         * @return {String}
         */
        getFragment: function () {
            return this.fragment;
        },

        /**
         * Set fragment
         * @param {String} fragment
         * @chainable
         */
        'setFragment': function (fragment) {
            var self = this;
            if (S.startsWith(fragment, '#')) {
                fragment = fragment.slice(1);
            }
            self.fragment = fragment;
            return self;
        },

        /**
         * Judge whether two uri has same domain.
         * @param {KISSY.Uri} other
         * @return {Boolean}
         */
        isSameOriginAs: function (other) {
            var self = this;
            // port and hostname has to be same
            return equalsIgnoreCase(self.hostname, other['hostname']) &&
                equalsIgnoreCase(self.scheme, other['scheme']) &&
                equalsIgnoreCase(self.port, other['port']);
        },

        /**
         * Serialize to string.
         * See rfc 5.3 Component Recomposition.
         * But kissy does not differentiate between undefined and empty.
         * @param {Boolean} [serializeArray=true]
         * whether append [] to key name when value 's type is array
         * @return {String}
         */
        toString: function (serializeArray) {

            var out = [],
                self = this,
                scheme,
                hostname,
                path,
                port,
                fragment,
                query,
                userInfo;

            if (scheme = self.scheme) {
                out.push(encodeSpecialChars(scheme, reDisallowedInSchemeOrUserInfo));
                out.push(':');
            }

            if (hostname = self.hostname) {
                out.push('//');
                if (userInfo = self.userInfo) {
                    out.push(encodeSpecialChars(userInfo, reDisallowedInSchemeOrUserInfo));
                    out.push('@');
                }

                out.push(encodeURIComponent(hostname));

                if (port = self.port) {
                    out.push(':');
                    out.push(port);
                }
            }

            if (path = self.path) {
                if (hostname && !S.startsWith(path, '/')) {
                    path = '/' + path;
                }
                path = Path.normalize(path);
                out.push(encodeSpecialChars(path, reDisallowedInPathName));
            }

            if (query = ( self.query.toString.call(self.query, serializeArray))) {
                out.push('?');
                out.push(query);
            }

            if (fragment = self.fragment) {
                out.push('#');
                out.push(encodeSpecialChars(fragment, reDisallowedInFragment))
            }

            return out.join('');
        }
    };

    Uri.Query = Query;

    Uri.getComponents = function (url) {
        url = url || "";
        var m = url.match(URI_SPLIT_REG) || [],
            ret = {};
        S.each(REG_INFO, function (index, key) {
            ret[key] = m[index];
        });
        return ret;
    };

    S.Uri = Uri;
})(KISSY);
/*
 Refer
 - application/x-www-form-urlencoded
 - http://www.ietf.org/rfc/rfc3986.txt
 - http://en.wikipedia.org/wiki/URI_scheme
 - http://unixpapa.com/js/querystring.html
 - http://code.stephenmorley.org/javascript/parsing-query-strings-for-get-data/
 - same origin: http://tools.ietf.org/html/rfc6454
 *//**
 * @ignore
 * ua
 */
(function (S, undefined) {
    var win = S.Env.host,
        doc = win.document,
        navigator = win.navigator,
        ua = navigator && navigator.userAgent || "";

    function numberify(s) {
        var c = 0;
        // convert '1.2.3.4' to 1.234
        return parseFloat(s.replace(/\./g, function () {
            return (c++ === 0) ? '.' : '';
        }));
    }

    function setTridentVersion(ua, UA) {
        var core, m;
        UA[core = 'trident'] = 0.1; // Trident detected, look for revision

        // Get the Trident's accurate version
        if ((m = ua.match(/Trident\/([\d.]*)/)) && m[1]) {
            UA[core] = numberify(m[1]);
        }

        UA.core = core;
    }

    function getIEVersion(ua) {
        var m, v;
        if ((m = ua.match(/MSIE ([^;]*)|Trident.*; rv(?:\s|:)?([0-9.]+)/)) &&
            (v = (m[1] || m[2]))) {
            return numberify(v);
        }
        return 0;
    }

    function getDescriptorFromUserAgent(ua) {
        var EMPTY = '',
            os,
            core = EMPTY,
            shell = EMPTY, m,
            IE_DETECT_RANGE = [6, 9],
            ieVersion,
            v,
            end,
            VERSION_PLACEHOLDER = '{{version}}',
            IE_DETECT_TPL = '<!--[if IE ' + VERSION_PLACEHOLDER + ']><' + 's></s><![endif]-->',
            div = doc && doc.createElement('div'),
            s = [];
        /**
         * KISSY UA
         * @class KISSY.UA
         * @singleton
         */
        var UA = {
            /**
             * webkit version
             * @type undefined|Number
             * @member KISSY.UA
             */
            webkit: undefined,
            /**
             * trident version
             * @type undefined|Number
             * @member KISSY.UA
             */
            trident: undefined,
            /**
             * gecko version
             * @type undefined|Number
             * @member KISSY.UA
             */
            gecko: undefined,
            /**
             * presto version
             * @type undefined|Number
             * @member KISSY.UA
             */
            presto: undefined,
            /**
             * chrome version
             * @type undefined|Number
             * @member KISSY.UA
             */
            chrome: undefined,
            /**
             * safari version
             * @type undefined|Number
             * @member KISSY.UA
             */
            safari: undefined,
            /**
             * firefox version
             * @type undefined|Number
             * @member KISSY.UA
             */
            firefox: undefined,
            /**
             * ie version
             * @type undefined|Number
             * @member KISSY.UA
             */
            ie: undefined,
            /**
             * opera version
             * @type undefined|Number
             * @member KISSY.UA
             */
            opera: undefined,
            /**
             * mobile browser. apple, android.
             * @type String
             * @member KISSY.UA
             */
            mobile: undefined,
            /**
             * browser render engine name. webkit, trident
             * @type String
             * @member KISSY.UA
             */
            core: undefined,
            /**
             * browser shell name. ie, chrome, firefox
             * @type String
             * @member KISSY.UA
             */
            shell: undefined,

            /**
             * PhantomJS version number
             * @type undefined|Number
             * @member KISSY.UA
             */
            phantomjs: undefined,

            /**
             * operating system. android, ios, linux, windows
             * @type string
             * @member KISSY.UA
             */
            os: undefined,

            /**
             * ipad ios version
             * @type Number
             * @member KISSY.UA
             */
            ipad: undefined,
            /**
             * iphone ios version
             * @type Number
             * @member KISSY.UA
             */
            iphone: undefined,
            /**
             * ipod ios
             * @type Number
             * @member KISSY.UA
             */
            ipod: undefined,
            /**
             * ios version
             * @type Number
             * @member KISSY.UA
             */
            ios: undefined,

            /**
             * android version
             * @type Number
             * @member KISSY.UA
             */
            android: undefined,

            /**
             * nodejs version
             * @type Number
             * @member KISSY.UA
             */
            nodejs: undefined
        };

        // ejecta
        if (div && div.getElementsByTagName) {
            // try to use IE-Conditional-Comment detect IE more accurately
            // IE10 doesn't support this method, @ref: http://blogs.msdn.com/b/ie/archive/2011/07/06/html5-parsing-in-ie10.aspx
            div.innerHTML = IE_DETECT_TPL.replace(VERSION_PLACEHOLDER, '');
            s = div.getElementsByTagName('s');
        }

        if (s.length > 0) {

            setTridentVersion(ua, UA);

            // Detect the accurate version
            // 注意：
            //  UA.shell = ie, 表示外壳是 ie
            //  但 UA.ie = 7, 并不代表外壳是 ie7, 还有可能是 ie8 的兼容模式
            //  对于 ie8 的兼容模式，还要通过 documentMode 去判断。但此处不能让 UA.ie = 8, 否则
            //  很多脚本判断会失误。因为 ie8 的兼容模式表现行为和 ie7 相同，而不是和 ie8 相同
            for (v = IE_DETECT_RANGE[0], end = IE_DETECT_RANGE[1]; v <= end; v++) {
                div.innerHTML = IE_DETECT_TPL.replace(VERSION_PLACEHOLDER, v);
                if (s.length > 0) {
                    UA[shell = 'ie'] = v;
                    break;
                }
            }

            // https://github.com/kissyteam/kissy/issues/321
            // win8 embed app
            if (!UA.ie && (ieVersion = getIEVersion(ua))) {
                UA[shell = 'ie'] = ieVersion;
            }

        } else {
            // WebKit
            if ((m = ua.match(/AppleWebKit\/([\d.]*)/)) && m[1]) {
                UA[core = 'webkit'] = numberify(m[1]);

                if ((m = ua.match(/OPR\/(\d+\.\d+)/)) && m[1]) {
                    UA[shell = 'opera'] = numberify(m[1]);
                }
                // Chrome
                else if ((m = ua.match(/Chrome\/([\d.]*)/)) && m[1]) {
                    UA[shell = 'chrome'] = numberify(m[1]);
                }
                // Safari
                else if ((m = ua.match(/\/([\d.]*) Safari/)) && m[1]) {
                    UA[shell = 'safari'] = numberify(m[1]);
                }

                // Apple Mobile
                if (/ Mobile\//.test(ua) && ua.match(/iPad|iPod|iPhone/)) {
                    UA.mobile = 'apple'; // iPad, iPhone or iPod Touch

                    m = ua.match(/OS ([^\s]*)/);
                    if (m && m[1]) {
                        UA.ios = numberify(m[1].replace('_', '.'));
                    }
                    os = 'ios';
                    m = ua.match(/iPad|iPod|iPhone/);
                    if (m && m[0]) {
                        UA[m[0].toLowerCase()] = UA.ios;
                    }
                } else if (/ Android/i.test(ua)) {
                    if (/Mobile/.test(ua)) {
                        os = UA.mobile = 'android';
                    }
                    m = ua.match(/Android ([^\s]*);/);
                    if (m && m[1]) {
                        UA.android = numberify(m[1]);
                    }
                }
                // Other WebKit Mobile Browsers
                else if ((m = ua.match(/NokiaN[^\/]*|Android \d\.\d|webOS\/\d\.\d/))) {
                    UA.mobile = m[0].toLowerCase(); // Nokia N-series, Android, webOS, ex: NokiaN95
                }

                if ((m = ua.match(/PhantomJS\/([^\s]*)/)) && m[1]) {
                    UA.phantomjs = numberify(m[1]);
                }
            }
            // NOT WebKit
            else {
                // Presto
                // ref: http://www.useragentstring.com/pages/useragentstring.php
                if ((m = ua.match(/Presto\/([\d.]*)/)) && m[1]) {
                    UA[core = 'presto'] = numberify(m[1]);

                    // Opera
                    if ((m = ua.match(/Opera\/([\d.]*)/)) && m[1]) {
                        UA[shell = 'opera'] = numberify(m[1]); // Opera detected, look for revision

                        if ((m = ua.match(/Opera\/.* Version\/([\d.]*)/)) && m[1]) {
                            UA[shell] = numberify(m[1]);
                        }

                        // Opera Mini
                        if ((m = ua.match(/Opera Mini[^;]*/)) && m) {
                            UA.mobile = m[0].toLowerCase(); // ex: Opera Mini/2.0.4509/1316
                        }
                        // Opera Mobile
                        // ex: Opera/9.80 (Windows NT 6.1; Opera Mobi/49; U; en) Presto/2.4.18 Version/10.00
                        // issue: 由于 Opera Mobile 有 Version/ 字段，可能会与 Opera 混淆，同时对于 Opera Mobile 的版本号也比较混乱
                        else if ((m = ua.match(/Opera Mobi[^;]*/)) && m) {
                            UA.mobile = m[0];
                        }
                    }

                    // NOT WebKit or Presto
                } else {
                    // MSIE
                    // 由于最开始已经使用了 IE 条件注释判断，因此落到这里的唯一可能性只有 IE10+
                    // and analysis tools in nodejs
                    if (ieVersion = getIEVersion(ua)) {
                        UA[shell = 'ie'] = ieVersion;
                        setTridentVersion(ua, UA);
                        // NOT WebKit, Presto or IE
                    } else {
                        // Gecko
                        if ((m = ua.match(/Gecko/))) {
                            UA[core = 'gecko'] = 0.1; // Gecko detected, look for revision
                            if ((m = ua.match(/rv:([\d.]*)/)) && m[1]) {
                                UA[core] = numberify(m[1]);
                                if (/Mobile|Tablet/.test(ua)) {
                                    o.mobile = "firefox";
                                }
                            }
                            // Firefox
                            if ((m = ua.match(/Firefox\/([\d.]*)/)) && m[1]) {
                                UA[shell = 'firefox'] = numberify(m[1]);
                            }
                        }
                    }
                }
            }
        }

        if (!os) {
            if ((/windows|win32/i).test(ua)) {
                os = 'windows';
            } else if ((/macintosh|mac_powerpc/i).test(ua)) {
                os = 'macintosh';
            } else if ((/linux/i).test(ua)) {
                os = 'linux';
            } else if ((/rhino/i).test(ua)) {
                os = 'rhino';
            }
        }

        UA.os = os;
        UA.core = UA.core || core;
        UA.shell = shell;

        return UA;
    }

    var UA = KISSY.UA = getDescriptorFromUserAgent(ua);

    // nodejs
    if (typeof process === 'object') {
        var versions, nodeVersion;
        if ((versions = process.versions) && (nodeVersion = versions.node)) {
            UA.os = process.platform;
            UA.nodejs = numberify(nodeVersion);
        }
    }

    // use by analysis tools in nodejs
    UA.getDescriptorFromUserAgent = getDescriptorFromUserAgent;

    var o = [
            // browser core type
            'webkit',
            'trident',
            'gecko',
            'presto',
            // browser type
            'chrome',
            'safari',
            'firefox',
            'ie',
            'opera'
        ],
        documentElement = doc && doc.documentElement,
        className = '';
    if (documentElement) {
        S.each(o, function (key) {
            var v = UA[key];
            if (v) {
                className += ' ks-' + key + (parseInt(v) + '');
                className += ' ks-' + key;
            }
        });
        if (S.trim(className)) {
            documentElement.className = S.trim(documentElement.className + className);
        }
    }
})(KISSY);

/*
 NOTES:
 2013.07.08 yiminghe@gmail.com
 - support ie11 and opera(using blink)

 2013.01.17 yiminghe@gmail.com
 - expose getDescriptorFromUserAgent for analysis tool in nodejs

 2012.11.27 yiminghe@gmail.com
 - moved to seed for conditional loading and better code share

 2012.11.21 yiminghe@gmail.com
 - touch and os support

 2011.11.08 gonghaocn@gmail.com
 - ie < 10 使用条件注释判断内核，更精确

 2010.03
 - jQuery, YUI 等类库都推荐用特性探测替代浏览器嗅探。特性探测的好处是能自动适应未来设备和未知设备，比如
 if(document.addEventListener) 假设 IE9 支持标准事件，则代码不用修改，就自适应了“未来浏览器”。
 对于未知浏览器也是如此。但是，这并不意味着浏览器嗅探就得彻底抛弃。当代码很明确就是针对已知特定浏览器的，
 同时并非是某个特性探测可以解决时，用浏览器嗅探反而能带来代码的简洁，同时也也不会有什么后患。总之，一切
 皆权衡。
 - UA.ie && UA.ie < 8 并不意味着浏览器就不是 IE8, 有可能是 IE8 的兼容模式。进一步的判断需要使用 documentMode.
 */
/**
 * @ignore
 * detect if current browser supports various features.
 * @author yiminghe@gmail.com
 */
(function (S, undefined) {
    var Env = S.Env,
        win = Env.host,
        UA = S.UA,
        VENDORS = [
            '',
            'Webkit',
            'Moz',
            'O',
            // ms is special .... !
            'ms'
        ],
    // nodejs
        doc = win.document || {},
        documentMode = doc.documentMode,
        isMsPointerSupported,
        transitionProperty,
        transformProperty,
        transitionPrefix,
        transformPrefix,
        documentElement = doc.documentElement,
        documentElementStyle,
        isClassListSupportedState = true,
        isQuerySelectorSupportedState = false,
    // phantomjs issue: http://code.google.com/p/phantomjs/issues/detail?id=375
        isTouchEventSupportedState = ('ontouchstart' in doc) && !(UA.phantomjs),
        ie = documentMode || UA.ie;

    if (documentElement) {
        if (documentElement.querySelector &&
            // broken ie8
            ie != 8) {
            isQuerySelectorSupportedState = true;
        }
        documentElementStyle = documentElement.style;

        S.each(VENDORS, function (val) {
            var transition = val ? val + 'Transition' : 'transition',
                transform = val ? val + 'Transform' : 'transform';
            if (transitionPrefix === undefined &&
                transition in documentElementStyle) {
                transitionPrefix = val;
                transitionProperty = transition;
            }
            if (transformPrefix === undefined &&
                transform in documentElementStyle) {
                transformPrefix = val;
                transformProperty = transform;
            }
        });

        isClassListSupportedState = 'classList' in documentElement;
        isMsPointerSupported = "msPointerEnabled" in (win.navigator || {});
    }

    /**
     * browser features detection
     * @class KISSY.Features
     * @private
     * @singleton
     */
    S.Features = {
        // http://blogs.msdn.com/b/ie/archive/2011/09/20/touch-input-for-ie10-and-metro-style-apps.aspx
        /**
         * whether support microsoft pointer event.
         * @type {Boolean}
         */
        isMsPointerSupported: function () {
            return isMsPointerSupported;
        },

        /**
         * whether support touch event.
         * @return {Boolean}
         */
        isTouchEventSupported: function () {
            return isTouchEventSupportedState;
        },

        /**
         * whether support device motion event
         * @returns {boolean}
         */
        isDeviceMotionSupported: function () {
            return !!win['DeviceMotionEvent'];
        },

        /**
         * whether support hashchange event
         * @returns {boolean}
         */
        'isHashChangeSupported': function () {
            // ie8 支持 hashchange
            // 但 ie8 以上切换浏览器模式到 ie7（兼容模式），
            // 会导致 'onhashchange' in window === true，但是不触发事件
            return ( 'onhashchange' in win) && (!ie || ie > 7);
        },

        /**
         * whether support css transition
         * @returns {boolean}
         */
        'isTransitionSupported': function () {
            return transitionPrefix !== undefined;
        },

        /**
         * whether support css transform
         * @returns {boolean}
         */
        'isTransformSupported': function () {
            return transformPrefix !== undefined;
        },

        /**
         * whether support class list api
         * @returns {boolean}
         */
        'isClassListSupported': function () {
            return isClassListSupportedState
        },

        /**
         * whether support querySelectorAll
         * @returns {boolean}
         */
        'isQuerySelectorSupported': function () {
            // force to use js selector engine
            return !S.config('dom/selector') &&
                isQuerySelectorSupportedState;
        },

        /**
         * whether is ie and ie version is less than specified version
         * @param {Number} v specified ie version to be compared
         * @returns {boolean}
         */
        'isIELessThan': function (v) {
            return !!(ie && ie < v);
        },

        /**
         * get css transition browser prefix if support css transition
         * @returns {String}
         */
        'getTransitionPrefix': function () {
            return transitionPrefix;
        },

        /**
         * get css transform browser prefix if support css transform
         * @returns {String}
         */
        'getTransformPrefix': function () {
            return transformPrefix;
        },

        /**
         * get css transition property if support css transition
         * @returns {String}
         */
        'getTransitionProperty': function () {
            return transitionProperty;
        },

        /**
         * get css transform property if support css transform
         * @returns {String}
         */
        'getTransformProperty': function () {
            return transformProperty;
        }
    };
})(KISSY);/**
 * @ignore
 * setup data structure for kissy loader
 * @author yiminghe@gmail.com
 */
(function (S) {
    var Loader = S.Loader = {};

    /**
     * Loader Status Enum
     * @enum {Number} KISSY.Loader.Status
     */
    Loader.Status = {
        /** init */
        'INIT': 0,
        /** loading */
        'LOADING': 1,
        /** loaded */
        'LOADED': 2,
        /** error */
        'ERROR': 3,
        /** attached */
        'ATTACHED': 4
    };
})(KISSY);/**
 * @ignore
 * Utils for kissy loader
 * @author yiminghe@gmail.com
 */
(function (S) {
    var Loader = S.Loader,
        Path = S.Path,
        logger = S.getLogger('s/loader'),
        host = S.Env.host,
        startsWith = S.startsWith,
        data = Loader.Status,
        ATTACHED = data.ATTACHED,
        LOADED = data.LOADED,
        ERROR = data.ERROR,
        /**
         * @class KISSY.Loader.Utils
         * Utils for KISSY Loader
         * @singleton
         * @private
         */
            Utils = Loader.Utils = {},
        doc = host.document;

    // http://wiki.commonjs.org/wiki/Packages/Mappings/A
    // 如果模块名以 / 结尾，自动加 index
    function indexMap(s) {
        if (typeof s == 'string') {
            return indexMapStr(s);
        } else {
            var ret = [],
                i = 0,
                l = s.length;
            for (; i < l; i++) {
                ret[i] = indexMapStr(s[i]);
            }
            return ret;
        }
    }

    function indexMapStr(s) {
        // 'x/' 'x/y/z/'
        if (s.charAt(s.length - 1) == '/') {
            s += 'index';
        }
        return s;
    }

    function pluginAlias(runtime, name) {
        var index = name.indexOf('!');
        if (index != -1) {
            var pluginName = name.substring(0, index);
            name = name.substring(index + 1);
            S.use(pluginName, {
                sync: true,
                success: function (S, Plugin) {
                    if (Plugin.alias) {
                        //noinspection JSReferencingMutableVariableFromClosure
                        name = Plugin.alias(runtime, name, pluginName);
                    }
                }
            });
        }
        return name;
    }

    S.mix(Utils, {
        /**
         * get document head
         * @return {HTMLElement}
         */
        docHead: function () {
            return doc.getElementsByTagName('head')[0] || doc.documentElement;
        },

        /**
         * Get absolute path of dep module.similar to {@link KISSY.Path#resolve}
         * @param {String} moduleName current module 's name
         * @param {String|String[]} depName dependency module 's name
         * @return {String|String[]} normalized dependency module 's name
         */
        normalDepModuleName: function (moduleName, depName) {
            var i = 0, l;

            if (!depName) {
                return depName;
            }

            if (typeof depName == 'string') {
                if (startsWith(depName, '../') || startsWith(depName, './')) {
                    // x/y/z -> x/y/
                    return Path.resolve(Path.dirname(moduleName), depName);
                }

                return Path.normalize(depName);
            }

            for (l = depName.length; i < l; i++) {
                depName[i] = Utils.normalDepModuleName(moduleName, depName[i]);
            }
            return depName;
        },

        /**
         * create modules info
         * @param runtime Module container, such as KISSY
         * @param {String[]} modNames to be created module names
         */
        createModulesInfo: function (runtime, modNames) {
            S.each(modNames, function (m) {
                Utils.createModuleInfo(runtime, m);
            });
        },

        /**
         * create single module info
         * @param runtime Module container, such as KISSY
         * @param {String} modName to be created module name
         * @param {Object} [cfg] module config
         * @return {KISSY.Loader.Module}
         */
        createModuleInfo: function (runtime, modName, cfg) {
            modName = indexMapStr(modName);

            var mods = runtime.Env.mods,
                mod = mods[modName];

            if (mod) {
                return mod;
            }

            // 防止 cfg 里有 tag，构建 fullpath 需要
            mods[modName] = mod = new Loader.Module(S.mix({
                name: modName,
                runtime: runtime
            }, cfg));

            return mod;
        },

        /**
         * Whether modNames is attached.
         * @param runtime Module container, such as KISSY
         * @param modNames
         * @return {Boolean}
         */
        'isAttached': function (runtime, modNames) {
            return isStatus(runtime, modNames, ATTACHED);
        },

        /**
         * Get module values
         * @param runtime Module container, such as KISSY
         * @param {String[]} modNames module names
         * @return {Array} module values
         */
        getModules: function (runtime, modNames) {
            var mods = [runtime], mod,
                unalias,
                allOk,
                m,
                runtimeMods = runtime.Env.mods;

            S.each(modNames, function (modName) {
                mod = runtimeMods[modName];
                if (!mod || mod.getType() != 'css') {
                    unalias = Utils.unalias(runtime, modName);
                    allOk = S.reduce(unalias, function (a, n) {
                        m = runtimeMods[n];
                        return a && m && m.status == ATTACHED;
                    }, true);
                    if (allOk) {
                        mods.push(runtimeMods[unalias[0]].value);
                    } else {
                        mods.push(null);
                    }
                }
            });

            return mods;
        },

        /**
         * attach modules and their dependency modules recursively
         * @param {String[]} modNames module names
         * @param runtime Module container, such as KISSY
         * @param {String[]} [stack] stack for detecting circular dependency
         * @param {Array} [errorList] errors when attach mods
         * @param {Object} [cache] cached modules to avoid duplicate check
         * @returns whether success attach all modules
         */
        attachModsRecursively: function (modNames, runtime, stack, errorList, cache) {
            // for debug. prevent circular dependency
            stack = stack || [];
            // for efficiency. avoid duplicate non-attach check
            cache = cache || {};
            var i,
                s = 1,
                l = modNames.length,
                stackDepth = stack.length;
            for (i = 0; i < l; i++) {
                s = s && Utils.attachModRecursively(modNames[i], runtime, stack, errorList, cache);
                stack.length = stackDepth;
            }
            return s;
        },

        /**
         * attach module and its dependency modules recursively
         * @param {String} modName module name
         * @param runtime Module container, such as KISSY
         * @param {String[]} [stack] stack for detecting circular dependency
         * @param {Array} [errorList] errors when attach mods
         * @param {Object} [cache] cached modules to avoid duplicate check
         * @returns whether success attach all modules
         */
        attachModRecursively: function (modName, runtime, stack, errorList, cache) {
            var mods = runtime.Env.mods,
                status,
                m = mods[modName];
            if (modName in cache) {
                return cache[modName];
            }
            if (!m) {
                return cache[modName] = 0;
            }
            status = m.status;
            if (status == ATTACHED) {
                return cache[modName] = 1;
            }
            if (status == ERROR) {
                errorList.push(m);
            }
            if (status != LOADED) {
                return cache[modName] = 0;
            }
            if ('@DEBUG@') {
                if (S.inArray(modName, stack)) {
                    stack.push(modName);
                    S.error('find cyclic dependency between mods: ' + stack);
                    return cache[modName] = 0;
                }
                stack.push(modName);
            }
            if (Utils.attachModsRecursively(m.getNormalizedRequires(),
                runtime, stack, errorList, cache)) {
                Utils.attachMod(runtime, m);
                return cache[modName] = 1;
            }
            return cache[modName] = 0;
        },

        /**
         * Attach specified mod.
         * @param runtime Module container, such as KISSY
         * @param {KISSY.Loader.Module} mod module instance
         */
        attachMod: function (runtime, mod) {
            if (mod.status != LOADED) {
                return;
            }

            var fn = mod.fn;

            if (typeof fn === 'function') {
                // 需要解开 index，相对路径
                // 但是需要保留 alias，防止值不对应
                mod.value = fn.apply(mod, Utils.getModules(runtime, mod.getRequiresWithAlias()));
            } else {
                mod.value = fn;
            }

            mod.status = ATTACHED;
        },

        /**
         * Get mod names as array.
         * @param {String|String[]} modNames module names array or  module names string separated by ','
         * @return {String[]}
         */
        getModNamesAsArray: function (modNames) {
            if (typeof modNames == 'string') {
                modNames = modNames.replace(/\s+/g, '').split(',');
            }
            return modNames;
        },

        /**
         * normalize module names
         * 1. add index : / => /index
         * 2. unalias : core => dom,event,ua
         * 3. relative to absolute : ./x => y/x
         * @param {KISSY} runtime Global KISSY instance
         * @param {String|String[]} modNames Array of module names
         *  or module names string separated by comma
         * @param {String} [refModName]
         * @return {String[]} normalized module names
         */
        normalizeModNames: function (runtime, modNames, refModName) {
            return Utils.unalias(runtime,
                Utils.normalizeModNamesWithAlias(runtime, modNames, refModName));
        },

        /**
         * unalias module name.
         * @param runtime Module container, such as KISSY
         * @param {String} names moduleNames
         * @return {String[]} unaliased module names
         */
        unalias: function (runtime, names) {
            var ret = [].concat(names),
                i,
                m,
                alias,
                ok = 0,
                j,
                mods = runtime['Env'].mods;
            while (!ok) {
                ok = 1;
                for (i = ret.length - 1; i >= 0; i--) {
                    if ((m = mods[ret[i]]) && (alias = m.alias)) {
                        ok = 0;
                        for (j = alias.length - 1; j >= 0; j--) {
                            if (!alias[j]) {
                                alias.splice(j, 1);
                            }
                        }
                        ret.splice.apply(ret, [i, 1].concat(indexMap(alias)));
                    }
                }
            }
            return ret;
        },

        /**
         * normalize module names with alias
         * @param runtime Module container, such as KISSY
         * @param {String[]} modNames module names
         * @param [refModName] module to be referred if module name path is relative
         * @return {String[]} normalize module names with alias
         */
        normalizeModNamesWithAlias: function (runtime, modNames, refModName) {
            var ret = [], i, l;
            if (modNames) {
                // 1. index map
                for (i = 0, l = modNames.length; i < l; i++) {
                    // conditional loader
                    // requires:[window.localStorage?"local-storage":""]
                    if (modNames[i]) {
                        ret.push(pluginAlias(runtime, indexMap(modNames[i])));
                    }
                }
            }
            // 2. relative to absolute (optional)
            if (refModName) {
                ret = Utils.normalDepModuleName(refModName, ret);
            }
            return ret;
        },

        /**
         * register module with factory
         * @param runtime Module container, such as KISSY
         * @param {String} name module name
         * @param {Function|*} fn module's factory or value
         * @param [config] module config, such as dependency
         */
        registerModule: function (runtime, name, fn, config) {
            name = indexMapStr(name);

            var mods = runtime.Env.mods,
                mod = mods[name];

            if (mod && mod.fn) {
                S.log(name + ' is defined more than once', 'warn');
                return;
            }

            // 没有 use，静态载入的 add 可能执行
            Utils.createModuleInfo(runtime, name);

            mod = mods[name];

            // 注意：通过 S.add(name[, fn[, config]]) 注册的代码，无论是页面中的代码，
            // 还是 js 文件里的代码，add 执行时，都意味着该模块已经 LOADED
            S.mix(mod, {
                name: name,
                status: LOADED,
                fn: fn
            });

            S.mix(mod, config);
        },

        /**
         * Get mapped path.
         * @param runtime Module container, such as KISSY
         * @param {String} path module path
         * @param [rules] map rules
         * @return {String} mapped path
         */
        getMappedPath: function (runtime, path, rules) {
            var mappedRules = rules ||
                    runtime.Config.mappedRules ||
                    [],
                i,
                m,
                rule;
            for (i = 0; i < mappedRules.length; i++) {
                rule = mappedRules[i];
                if (m = path.match(rule[0])) {
                    return path.replace(rule[0], rule[1]);
                }
            }
            return path;
        },

        /**
         * Returns hash code of a string djb2 algorithm
         * @param {String} str
         * @returns {String} hash code
         */
        getHash:function (str) {
            var hash = 5381,
                i;
            for (i = str.length; --i > -1;) {
                hash = ((hash << 5) + hash) + str.charCodeAt(i);
                /* hash * 33 + char */
            }
            return hash + '';
        }
    });

    function isStatus(runtime, modNames, status) {
        var mods = runtime.Env.mods,
            mod,
            i;
        modNames = S.makeArray(modNames);
        for (i = 0; i < modNames.length; i++) {
            mod = mods[modNames[i]];
            if (!mod || mod.status !== status) {
                return 0;
            }
        }
        return 1;
    }
})(KISSY);/**
 * @ignore
 * setup data structure for kissy loader
 * @author yiminghe@gmail.com
 */
(function (S) {
    var Loader = S.Loader,
        Path = S.Path,
        IGNORE_PACKAGE_NAME_IN_URI = 'ignorePackageNameInUri',
        Utils = Loader.Utils;

    function forwardSystemPackage(self, property) {
        return property in self ?
            self[property] :
            self.runtime.Config[property];
    }

    /**
     * @class KISSY.Loader.Package
     * @private
     * This class should not be instantiated manually.
     */
    function Package(cfg) {
        S.mix(this, cfg);
    }

    S.augment(Package, {
        reset: function (cfg) {
            S.mix(this, cfg);
        },

        /**
         * Tag for package.
         * tag can not contain ".", eg: Math.random() !
         * @return {String}
         */
        getTag: function () {
            return forwardSystemPackage(this, 'tag');
        },

        /**
         * Get package name.
         * @return {String}
         */
        getName: function () {
            return this.name;
        },

        /**
         * Get package base.
         * @return {String}
         */
        'getBase': function () {
            return forwardSystemPackage(this, 'base');
        },

        getPrefixUriForCombo: function () {
            var self = this,
                packageName = self.getName();
            return self.getBase() + (
                packageName && !self.isIgnorePackageNameInUri() ?
                    (packageName + '/') :
                    ''
                );
        },

        /**
         * get package uri
         */
        getPackageUri: function () {
            var self = this;
            if (self.packageUri) {
                return self.packageUri;
            }
            return self.packageUri = new S.Uri(this.getPrefixUriForCombo());
        },

        /**
         * Get package baseUri
         * @return {KISSY.Uri}
         */
        getBaseUri: function () {
            return forwardSystemPackage(this, 'baseUri');
        },

        /**
         * Whether is debug for this package.
         * @return {Boolean}
         */
        isDebug: function () {
            return forwardSystemPackage(this, 'debug');
        },

        /**
         *  whether request mod file without insert package name into package base
         *  @return {Boolean}
         */
        isIgnorePackageNameInUri: function () {
            return forwardSystemPackage(this, IGNORE_PACKAGE_NAME_IN_URI);
        },

        /**
         * Get charset for package.
         * @return {String}
         */
        getCharset: function () {
            return forwardSystemPackage(this, 'charset');
        },

        /**
         * Whether modules are combined for this package.
         * @return {Boolean}
         */
        isCombine: function () {
            return forwardSystemPackage(this, 'combine');
        },

        /**
         * Get package group (for combo).
         * @returns {String}
         */
        getGroup: function () {
            return forwardSystemPackage(this, 'group');
        }
    });

    Loader.Package = Package;

    /**
     * @class KISSY.Loader.Module
     * @private
     * This class should not be instantiated manually.
     */
    function Module(cfg) {
        this.status = Loader.Status.INIT;
        S.mix(this, cfg);
        this.waitedCallbacks = [];
    }

    S.augment(Module, {
        wait: function (callback) {
            this.waitedCallbacks.push(callback);
        },

        notifyAll: function () {
            var callback;
            var len = this.waitedCallbacks.length,
                i = 0;
            for (; i < len; i++) {
                callback = this.waitedCallbacks[i];
                try {
                    callback(this);
                } catch (e) {
                    S.log(e.stack || e, 'error');
                    setTimeout(function () {
                        throw e;
                    }, 0);
                }
            }
            this.waitedCallbacks = [];
        },

        /**
         * Set the value of current module
         * @param v value to be set
         */
        'setValue': function (v) {
            this.value = v;
        },

        /**
         * Get the type if current Module
         * @return {String} css or js
         */
        getType: function () {
            var self = this,
                v = self.type;
            if (!v) {
                if (Path.extname(self.name).toLowerCase() == '.css') {
                    v = 'css';
                } else {
                    v = 'js';
                }
                self.type = v;
            }
            return v;
        },

        /**
         * Get the fullpath uri of current module if load dynamically
         * @return {KISSY.Uri}
         */
        getFullPathUri: function () {
            var self = this,
                t,
                fullPathUri,
                packageBaseUri,
                packageInfo,
                packageName,
                path;
            if (!self.fullPathUri) {
                if (self.fullpath) {
                    fullPathUri = new S.Uri(self.fullpath);
                } else {
                    packageInfo = self.getPackage();
                    packageBaseUri = packageInfo.getBaseUri();
                    path = self.getPath();
                    // #262
                    if (packageInfo.isIgnorePackageNameInUri() &&
                        // native mod does not allow ignore package name
                        (packageName = packageInfo.getName())) {
                        path = Path.relative(packageName, path);
                    }
                    fullPathUri = packageBaseUri.resolve(path);
                    if (t = self.getTag()) {
                        t += '.' + self.getType();
                        fullPathUri.query.set('t', t);
                    }
                }
                self.fullPathUri = fullPathUri;
            }
            return self.fullPathUri;
        },

        /**
         * Get the fullpath of current module if load dynamically
         * @return {String}
         */
        getFullPath: function () {
            var self = this,
                fullPathUri;
            if (!self.fullpath) {
                fullPathUri = self.getFullPathUri();
                self.fullpath = Utils.getMappedPath(self.runtime, fullPathUri.toString());
            }
            return self.fullpath;
        },

        /**
         * Get the path (without package base)
         * @return {String}
         */
        getPath: function () {
            var self = this;
            return self.path ||
                (self.path = defaultComponentJsName(self))
        },

        /**
         * Get the value of current module
         * @return {*}
         */
        getValue: function () {
            return this.value;
        },

        /**
         * Get the name of current module
         * @return {String}
         */
        getName: function () {
            return this.name;
        },

        /**
         * Get the package which current module belongs to.
         * @return {KISSY.Loader.Package}
         */
        getPackage: function () {
            var self = this;
            return self.packageInfo ||
                (self.packageInfo = getPackage(self.runtime, self.name));
        },

        /**
         * Get the tag of current module.
         * tag can not contain ".", eg: Math.random() !
         * @return {String}
         */
        getTag: function () {
            var self = this;
            return self.tag || self.getPackage().getTag();
        },

        /**
         * Get the charset of current module
         * @return {String}
         */
        getCharset: function () {
            var self = this;
            return self.charset || self.getPackage().getCharset();
        },

        /**
         * Get module objects required by this module
         * @return {KISSY.Loader.Module[]}
         */
        'getRequiredMods': function () {
            var self = this,
                runtime = self.runtime;
            return S.map(self.getNormalizedRequires(), function (r) {
                return Utils.createModuleInfo(runtime, r);
            });
        },

        getRequiresWithAlias: function () {
            var self = this,
                requiresWithAlias = self.requiresWithAlias,
                requires = self.requires;
            if (!requires || requires.length == 0) {
                return requires || [];
            } else if (!requiresWithAlias) {
                self.requiresWithAlias = requiresWithAlias =
                    Utils.normalizeModNamesWithAlias(self.runtime, requires, self.name);
            }
            return requiresWithAlias;
        },

        /**
         * Get module names required by this module
         * @return {KISSY.Loader.Module[]}
         */
        getNormalizedRequires: function () {
            var self = this,
                normalizedRequires,
                normalizedRequiresStatus = self.normalizedRequiresStatus,
                status = self.status,
                requires = self.requires;
            if (!requires || requires.length == 0) {
                return requires || [];
            } else if ((normalizedRequires = self.normalizedRequires) &&
                // 事先声明的依赖不能当做 loaded 状态下真正的依赖
                (normalizedRequiresStatus == status)) {
                return normalizedRequires;
            } else {
                self.normalizedRequiresStatus = status;
                return self.normalizedRequires =
                    Utils.normalizeModNames(self.runtime, requires, self.name);
            }
        }
    });

    Loader.Module = Module;

    function defaultComponentJsName(m) {
        var name = m.name,
            extname = '.' + m.getType(),
            min = '-min';

        name = Path.join(Path.dirname(name), Path.basename(name, extname));

        if (m.getPackage().isDebug()) {
            min = '';
        }

        return name + min + extname;
    }

    var systemPackage = new Package({
        name: '',
        runtime: S
    });

    function getPackage(self, modName) {
        var packages = self.config('packages'),
            modNameSlash = modName + '/',
            pName = '',
            p;
        for (p in packages) {
            if (S.startsWith(modNameSlash, p + '/') && p.length > pName.length) {
                pName = p;
            }
        }
        return packages[pName] || systemPackage;
    }
})(KISSY);/**
 * @ignore
 * script/css load across browser
 * @author yiminghe@gmail.com
 */
(function (S) {
    var CSS_POLL_INTERVAL = 30,
        UA = S.UA,
        logger = S.getLogger('s/loader/getScript'),
        Utils = S.Loader.Utils,
    // central poll for link node
        timer = 0,
        monitors = {
            // node.id:{callback:callback,node:node}
        };

    function startCssTimer() {
        if (!timer) {
            logger.debug('start css poll timer');
            cssPoll();
        }
    }

    function isCssLoaded(node, url) {
        var loaded = 0;
        if (UA.webkit) {
            // http://www.w3.org/TR/Dom-Level-2-Style/stylesheets.html
            if (node['sheet']) {
                logger.debug('webkit css poll loaded: ' + url);
                loaded = 1;
            }
        } else if (node['sheet']) {
            try {
                var cssRules = node['sheet'].cssRules;
                if (cssRules) {
                    logger.debug('same domain css poll loaded: ' + url);
                    loaded = 1;
                }
            } catch (ex) {
                var exName = ex.name;
                logger.debug('css poll exception: ' + exName + ' ' + ex.code + ' ' + url);
                // http://www.w3.org/TR/dom/#dom-domexception-code
                if (// exName == 'SecurityError' ||
                // for old firefox
                    exName == 'NS_ERROR_DOM_SECURITY_ERR') {
                    logger.debug('css poll exception: ' + exName + 'loaded : ' + url);
                    loaded = 1;
                }
            }
        }
        return loaded;
    }

    // single thread is ok
    function cssPoll() {
        for (var url in monitors) {
            var callbackObj = monitors[url],
                node = callbackObj.node;
            if (isCssLoaded(node, url)) {
                if (callbackObj.callback) {
                    callbackObj.callback.call(node);
                }
                delete monitors[url];
            }
        }

        if (S.isEmptyObject(monitors)) {
            logger.debug('clear css poll timer');
            timer = 0;
        } else {
            timer = setTimeout(cssPoll, CSS_POLL_INTERVAL);
        }
    }

    // refer : http://lifesinger.org/lab/2011/load-js-css/css-preload.html
    // 暂时不考虑如何判断失败，如 404 等
    Utils.pollCss = function (node, callback) {
        var href = node.href,
            arr;
        arr = monitors[href] = {};
        arr.node = node;
        arr.callback = callback;
        startCssTimer();
    };

    Utils.isCssLoaded = isCssLoaded;
})(KISSY);
/*
 References:
 - http://unixpapa.com/js/dyna.html
 - http://www.blaze.io/technical/ies-premature-execution-problem/

 `onload` event is supported in WebKit since 535.23
 - https://bugs.webkit.org/show_activity.cgi?id=38995
 `onload/onerror` event is supported since Firefox 9.0
 - https://bugzilla.mozilla.org/show_bug.cgi?id=185236
 - https://developer.mozilla.org/en/HTML/Element/link#Stylesheet_load_events

 monitor css onload across browsers.issue about 404 failure.
 - firefox not ok（4 is wrong）：
 - http://yearofmoo.com/2011/03/cross-browser-stylesheet-preloading/
 - all is ok
 - http://lifesinger.org/lab/2011/load-js-css/css-preload.html
 - others
 - http://www.zachleat.com/web/load-css-dynamically/
 *//**
 * @ignore
 * getScript support for css and js callback after load
 * @author yiminghe@gmail.com
 */
(function (S) {
    var MILLISECONDS_OF_SECOND = 1000,
        doc = S.Env.host.document,
        Utils = S.Loader.Utils,
        Path = S.Path,
        jsCssCallbacks = {},
        headNode,
        UA = S.UA;

    /**
     * Load a javascript/css file from the server using a GET HTTP request,
     * then execute it.
     *
     * for example:
     *      @example
     *      getScript(url, success, charset);
     *      // or
     *      getScript(url, {
     *          charset: string
     *          success: fn,
     *          error: fn,
     *          timeout: number
     *      });
     *
     * Note 404/500 status in ie<9 will trigger success callback.
     * If you want a jsonp operation, please use {@link KISSY.IO} instead.
     *
     * @param {String} url resource's url
     * @param {Function|Object} [success] success callback or config
     * @param {Function} [success.success] success callback
     * @param {Function} [success.error] error callback
     * @param {Number} [success.timeout] timeout (s)
     * @param {String} [success.charset] charset of current resource
     * @param {String} [charset] charset of current resource
     * @return {HTMLElement} script/style node
     * @member KISSY
     */
    S.getScript = function (url, success, charset) {
        // can not use KISSY.Uri, url can not be encoded for some url
        // eg: /??dom.js,event.js , ? , should not be encoded
        var config = success,
            css = 0,
            error,
            timeout,
            attrs,
            callbacks,
            timer;

        if (S.startsWith(Path.extname(url).toLowerCase(), '.css')) {
            css = 1;
        }

        if (S.isPlainObject(config)) {
            success = config['success'];
            error = config['error'];
            timeout = config['timeout'];
            charset = config['charset'];
            attrs = config['attrs'];
        }

        callbacks = jsCssCallbacks[url] = jsCssCallbacks[url] || [];

        callbacks.push([success, error]);

        if (callbacks.length > 1) {
            return callbacks.node;
        }

        var node = doc.createElement(css ? 'link' : 'script'),
            clearTimer = function () {
                if (timer) {
                    timer.cancel();
                    timer = undefined;
                }
            };

        if (attrs) {
            S.each(attrs, function (v, n) {
                node.setAttribute(n, v);
            });
        }

        if (charset) {
            node.charset = charset;
        }

        if (css) {
            node.href = url;
            node.rel = 'stylesheet';
        } else {
            node.src = url;
            node.async = true;
        }

        callbacks.node = node;

        var end = function (error) {
            var index = error,
                fn;
            clearTimer();
            S.each(jsCssCallbacks[url], function (callback) {
                if (fn = callback[index]) {
                    fn.call(node);
                }
            });
            delete jsCssCallbacks[url];
        };

        var useNative = 'onload' in node;
        // onload for webkit 535.23  Firefox 9.0
        // https://bugs.webkit.org/show_activity.cgi?id=38995
        // https://bugzilla.mozilla.org/show_bug.cgi?id=185236
        // https://developer.mozilla.org/en/HTML/Element/link#Stylesheet_load_events
        // phantomjs 1.7 == webkit 534.34
        var forceCssPoll = S.Config['forceCssPoll'] || (UA.webkit && UA.webkit < 536);

        if (css && forceCssPoll && useNative) {
            useNative = false;
        }

        function onload() {
            var readyState = node.readyState;
            if (!readyState ||
                readyState == "loaded" ||
                readyState == "complete") {
                node.onreadystatechange = node.onload = null;
                end(0);
            }
        }

        //标准浏览器 css and all script
        if (useNative) {
            node.onload = onload;
            node.onerror = function () {
                node.onerror = null;
                end(1);
            };
        }
        // old chrome/firefox for css
        else if (css) {
            Utils.pollCss(node, function () {
                end(0);
            });
        } else {
            node.onreadystatechange = onload;
        }

        if (timeout) {
            timer = S.later(function () {
                end(1);
            }, timeout * MILLISECONDS_OF_SECOND);
        }
        if (!headNode) {
            headNode = Utils.docHead();
        }
        if (css) {
            // css order matters
            // so can not use css in head
            headNode.appendChild(node);
        } else {
            // can use js in head
            headNode.insertBefore(node, headNode.firstChild);
        }
        return node;
    };
})(KISSY);
/*
 yiminghe@gmail.com refactor@2012-03-29
 - 考虑连续重复请求单个 script 的情况，内部排队

 yiminghe@gmail.com 2012-03-13
 - getScript
 - 404 in ie<9 trigger success , others trigger error
 - syntax error in all trigger success
 *//**
 * @ignore
 * Declare config info for KISSY.
 * @author yiminghe@gmail.com
 */
(function (S, undefined) {
    var Loader = S.Loader,
        Utils = Loader.Utils,
        host = S.Env.host,
        location = host.location,
        simulatedLocation,
        locationHref,
        configFns = S.Config.fns;

    if (!S.UA.nodejs && location && (locationHref = location.href)) {
        simulatedLocation = new S.Uri(locationHref)
    }

    S.Config.loadModsFn = function (rs, config) {
        S.getScript(rs.fullpath, config);
    };

    configFns.map = function (rules) {
        var Config = this.Config;
        if (rules === false) {
            return Config.mappedRules = [];
        }
        return Config.mappedRules = (Config.mappedRules || []).concat(rules || []);
    };

    configFns.mapCombo = function (rules) {
        var Config = this.Config;
        if (rules === false) {
            return Config.mappedComboRules = [];
        }
        return Config.mappedComboRules = (Config.mappedComboRules || []).concat(rules || []);
    };

    configFns.packages = function (config) {
        var name,
            Config = this.Config,
            ps = Config.packages = Config.packages || {};
        if (config) {
            S.each(config, function (cfg, key) {
                // 兼容数组方式
                name = cfg.name || key;

                // 兼容 path
                var baseUri = normalizeBase(cfg.base || cfg.path);

                cfg.name = name;
                cfg.base = baseUri.toString();
                cfg.baseUri = baseUri;
                cfg.runtime = S;
                delete cfg.path;
                if (ps[name]) {
                    ps[name].reset(cfg);
                } else {
                    ps[name] = new Loader.Package(cfg);
                }
            });
            return undefined;
        } else if (config === false) {
            Config.packages = {
            };
            return undefined;
        } else {
            return ps;
        }
    };

    configFns.modules = function (modules) {
        var self = this;
        if (modules) {
            S.each(modules, function (modCfg, modName) {
                var mod = Utils.createModuleInfo(self, modName, modCfg);
                // #485, invalid after add
                if (mod.status == Loader.Status.INIT) {
                    S.mix(mod, modCfg);
                }
            });
        }
    };

    configFns.base = function (base) {
        var self = this,
            Config = self.Config,
            baseUri;
        if (!base) {
            return Config.base;
        }
        baseUri = normalizeBase(base);
        Config.base = baseUri.toString();
        Config.baseUri = baseUri;
        return undefined;
    };

    function normalizeBase(base) {
        var baseUri;
        base = base.replace(/\\/g, '/');
        if (base.charAt(base.length - 1) != '/') {
            base += '/';
        }
        if (simulatedLocation) {
            baseUri = simulatedLocation.resolve(base);
        } else {
            // add scheme for S.Uri
            // currently only for nodejs
            if (!S.startsWith(base, 'file:')) {
                base = 'file:' + base;
            }
            baseUri = new S.Uri(base);
        }
        return baseUri;
    }
})(KISSY);
/**
 * combo loader for KISSY. using combo to load module files.
 * @ignore
 * @author yiminghe@gmail.com
 */
(function (S, undefined) {
    // ie11 is a new one!
    var oldIE = S.UA.ie && S.UA.ie < 10;

    function loadScripts(runtime, rss, callback, charset, timeout) {
        var count = rss && rss.length,
            errorList = [],
            successList = [];

        function complete() {
            if (!(--count)) {
                callback(successList, errorList);
            }
        }

        S.each(rss, function (rs) {
            var mod;
            var config = {
                timeout: timeout,
                success: function () {
                    successList.push(rs);
                    if (mod && currentMod) {
                        // standard browser(except ie9) fire load after KISSY.add immediately
                        logger.debug('standard browser get mod name after load : ' + mod.name);
                        Utils.registerModule(runtime, mod.name, currentMod.fn, currentMod.config);
                        currentMod = undefined;
                    }
                    complete();
                },
                error: function () {
                    errorList.push(rs);
                    complete();
                },
                charset: charset
            };
            if (!rs.combine) {
                mod = rs.mods[0];
                if (mod.getType() == 'css') {
                    mod = undefined;
                }
                else if (oldIE) {
                    startLoadModName = mod.name;
                    startLoadModTime = S.now();
                    config.attrs = {
                        'data-mod-name': mod.name
                    };
                }
            }
            S.Config.loadModsFn(rs, config);
        });
    }

    var Loader = S.Loader,
        logger = S.getLogger('s/loader'),
        Status = Loader.Status,
        Utils = Loader.Utils,
        getHash=Utils.getHash,
        LOADING = Status.LOADING,
        LOADED = Status.LOADED,
        ERROR = Status.ERROR,
        groupTag = S.now(),
        ATTACHED = Status.ATTACHED;

    ComboLoader.groupTag = groupTag;

    /**
     * @class KISSY.Loader.ComboLoader
     * using combo to load module files
     * @param runtime KISSY
     * @param waitingModules
     * @private
     */
    function ComboLoader(runtime, waitingModules) {
        S.mix(this, {
            runtime: runtime,
            waitingModules: waitingModules
        });
    }

    var currentMod;
    var startLoadModName;
    var startLoadModTime;

    ComboLoader.add = function (name, fn, config, runtime) {
        if (typeof name === 'function') {
            config = fn;
            fn = name;
            if (oldIE) {
                // http://groups.google.com/group/commonjs/browse_thread/thread/5a3358ece35e688e/43145ceccfb1dc02#43145ceccfb1dc02
                name = findModuleNameByInteractive();
                // S.log('oldIE get modName by interactive: ' + name);
                Utils.registerModule(runtime, name, fn, config);
                startLoadModName = null;
                startLoadModTime = 0;
            } else {
                // 其他浏览器 onload 时，关联模块名与模块定义
                currentMod = {
                    fn: fn,
                    config: config
                };
            }
        } else {
            if (oldIE) {
                startLoadModName = null;
                startLoadModTime = 0;
            } else {
                currentMod = undefined;
            }
            Utils.registerModule(runtime, name, fn, config);
        }
    };

    // oldIE 特有，找到当前正在交互的脚本，根据脚本名确定模块名
    // 如果找不到，返回发送前那个脚本
    function findModuleNameByInteractive() {
        var scripts = S.Env.host.document.getElementsByTagName('script'),
            re,
            i,
            name,
            script;

        for (i = scripts.length - 1; i >= 0; i--) {
            script = scripts[i];
            if (script.readyState == 'interactive') {
                re = script;
                break;
            }
        }
        if (re) {
            name = re.getAttribute('data-mod-name');
        } else {
            // sometimes when read module file from cache,
            // interactive status is not triggered
            // module code is executed right after inserting into dom
            // i has to preserve module name before insert module script into dom,
            // then get it back here
            logger.debug('can not find interactive script,time diff : ' + (S.now() - startLoadModTime));
            logger.debug('old_ie get mod name from cache : ' + startLoadModName);
            name = startLoadModName;
        }
        return name;
    }

    function debugRemoteModules(rss) {
        S.each(rss, function (rs) {
            var ms = [];
            S.each(rs.mods, function (m) {
                if (m.status == LOADED) {
                    ms.push(m.name);
                }
            });
            if (ms.length) {
                logger.info('load remote modules: "' + ms.join(', ') + '" from: "' + rs.fullpath + '"');
            }
        });
    }

    function getCommonPrefix(str1, str2) {
        str1 = str1.split(/\//);
        str2 = str2.split(/\//);
        var l = Math.min(str1.length, str2.length);
        for (var i = 0; i < l; i++) {
            if (str1[i] !== str2[i]) {
                break;
            }
        }
        return str1.slice(0, i).join('/') + '/';
    }

    S.augment(ComboLoader, {
        /**
         * load modules asynchronously
         */
        use: function (normalizedModNames) {
            var self = this,
                allModNames,
                comboUrls,
                timeout = S.Config.timeout,
                runtime = self.runtime;

            allModNames = S.keys(self.calculate(normalizedModNames));

            Utils.createModulesInfo(runtime, allModNames);

            comboUrls = self.getComboUrls(allModNames);

            // load css first to avoid page blink
            S.each(comboUrls.css, function (cssOne) {
                loadScripts(runtime, cssOne, function (success, error) {
                    if ('@DEBUG@') {
                        debugRemoteModules(success);
                    }

                    S.each(success, function (one) {
                        S.each(one.mods, function (mod) {
                            Utils.registerModule(runtime, mod.getName(), S.noop);
                            // notify all loader instance
                            mod.notifyAll();
                        });
                    });

                    S.each(error, function (one) {
                        S.each(one.mods, function (mod) {
                            var msg = mod.name +
                                ' is not loaded! can not find module in path : ' +
                                one.fullpath;
                            S.log(msg, 'error');
                            mod.status = ERROR;
                            // notify all loader instance
                            mod.notifyAll();
                        });
                    });
                }, cssOne.charset, timeout);
            });

            // jss css download in parallel
            S.each(comboUrls['js'], function (jsOne) {
                loadScripts(runtime, jsOne, function (success) {
                    if ('@DEBUG@') {
                        debugRemoteModules(success);
                    }

                    S.each(jsOne, function (one) {
                        S.each(one.mods, function (mod) {
                            // fix #111
                            // https://github.com/kissyteam/kissy/issues/111
                            if (!mod.fn) {
                                var msg = mod.name +
                                    ' is not loaded! can not find module in path : ' +
                                    one.fullpath;
                                S.log(msg, 'error');
                                mod.status = ERROR;
                            }
                            // notify all loader instance
                            mod.notifyAll();
                        });
                    });
                }, jsOne.charset, timeout);
            });
        },

        /**
         * calculate dependency
         */
        calculate: function (modNames, cache, ret) {
            var i,
                m,
                mod,
                modStatus,
                self = this,
                waitingModules = self.waitingModules,
                runtime = self.runtime;

            ret = ret || {};
            // 提高性能，不用每个模块都再次全部依赖计算
            // 做个缓存，每个模块对应的待动态加载模块
            cache = cache || {};

            for (i = 0; i < modNames.length; i++) {
                m = modNames[i];
                if (cache[m]) {
                    continue;
                }
                cache[m] = 1;
                mod = Utils.createModuleInfo(runtime, m);
                modStatus = mod.status;
                if (modStatus === ERROR || modStatus === ATTACHED) {
                    continue;
                }
                if (modStatus != LOADED) {
                    if (!waitingModules.contains(m)) {
                        if (modStatus != LOADING) {
                            mod.status = LOADING;
                            ret[m] = 1;
                        }
                        mod.wait(function (mod) {
                            waitingModules.remove(mod.getName());
                            // notify current loader instance
                            waitingModules.notifyAll();
                        });
                        waitingModules.add(m);
                    }
                }
                self.calculate(mod.getNormalizedRequires(), cache, ret);
            }

            return ret;
        },

        /**
         * get combo mods for modNames
         */
        getComboMods: function (modNames, comboPrefixes) {
            var comboMods = {},
                packageUri,
                runtime = this.runtime,
                i = 0,
                l = modNames.length,
                modName, mod, packageInfo, type, typedCombos, mods,
                tag, charset, packagePath,
                packageName, group, fullpath;

            for (; i < l; ++i) {
                modName = modNames[i];
                mod = Utils.createModuleInfo(runtime, modName);
                type = mod.getType();
                fullpath = mod.getFullPath();
                packageInfo = mod.getPackage();
                packageName = packageInfo.getName();
                charset = packageInfo.getCharset();
                tag = packageInfo.getTag();
                group = packageInfo.getGroup();
                packagePath = packageInfo.getPrefixUriForCombo();
                packageUri = packageInfo.getPackageUri();

                var comboName = packageName;
                // whether group packages can be combined (except default package and non-combo modules)
                if ((mod.canBeCombined = packageInfo.isCombine() &&
                    S.startsWith(fullpath, packagePath)) && group) {
                    // combined package name
                    comboName = group + '_' + charset + '_' + groupTag;

                    var groupPrefixUri;
                    if (groupPrefixUri = comboPrefixes[comboName]) {
                        if (groupPrefixUri.isSameOriginAs(packageUri)) {
                            groupPrefixUri.setPath(getCommonPrefix(groupPrefixUri.getPath(),
                                packageUri.getPath()));
                        } else {
                            comboName = packageName;
                            comboPrefixes[packageName] = packageUri;
                        }
                    } else {
                        comboPrefixes[comboName] = packageUri.clone();
                    }
                } else {
                    comboPrefixes[packageName] = packageUri;
                }

                typedCombos = comboMods[type] = comboMods[type] || {};
                if (!(mods = typedCombos[comboName])) {
                    mods = typedCombos[comboName] = [];
                    mods.charset = charset;
                    mods.tags = [tag]; // [package tag]
                } else {
                    if (mods.tags.length == 1 && mods.tags[0] == tag) {

                    } else {
                        mods.tags.push(tag);
                    }
                }
                mods.push(mod);
            }

            return comboMods;
        },

        /**
         * Get combo urls
         */
        getComboUrls: function (modNames) {
            var runtime = this.runtime,
                Config = runtime.Config,
                comboPrefix = Config.comboPrefix,
                comboSep = Config.comboSep,
                maxFileNum = Config.comboMaxFileNum,
                maxUrlLength = Config.comboMaxUrlLength;

            var comboPrefixes = {};
            // {type, {comboName, [modInfo]}}}
            var comboMods = this.getComboMods(modNames, comboPrefixes);
            // {type, {comboName, [url]}}}
            var comboRes = {};

            // generate combo urls
            for (var type in comboMods) {
                comboRes[type] = {};
                for (var comboName in comboMods[type]) {
                    var currentComboUrls = [];
                    var currentComboMods = [];
                    var mods = comboMods[type][comboName];
                    var tags = mods.tags;
                    var tag = tags.length > 1 ? getHash(tags.join('')) : tags[0];

                    var suffix = (tag ? '?t=' + encodeURIComponent(tag) + '.' + type : ''),
                        suffixLength = suffix.length,
                        basePrefix = comboPrefixes[comboName].toString(),
                        baseLen = basePrefix.length,
                        prefix = basePrefix + comboPrefix,
                        res = comboRes[type][comboName] = [];

                    var l = prefix.length;
                    res.charset = mods.charset;
                    res.mods = [];

                    function pushComboUrl() {
                        // map the whole combo path
                        //noinspection JSReferencingMutableVariableFromClosure
                        res.push({
                            combine: 1,
                            fullpath: Utils.getMappedPath(runtime, prefix +
                                currentComboUrls.join(comboSep) + suffix,
                                Config.mappedComboRules),
                            mods: currentComboMods
                        });
                    }

                    for (var i = 0; i < mods.length; i++) {
                        var currentMod = mods[i];
                        res.mods.push(currentMod);
                        // map individual module
                        var fullpath = currentMod.getFullPath();
                        if (!currentMod.canBeCombined) {
                            res.push({
                                combine: 0,
                                fullpath: fullpath,
                                mods: [currentMod]
                            });
                            continue;
                        }
                        // ignore query parameter
                        var path = fullpath.slice(baseLen).replace(/\?.*$/, '');
                        currentComboUrls.push(path);
                        currentComboMods.push(currentMod);

                        if (currentComboUrls.length > maxFileNum ||
                            (l + currentComboUrls.join(comboSep).length + suffixLength > maxUrlLength)) {
                            currentComboUrls.pop();
                            currentComboMods.pop();
                            pushComboUrl();
                            currentComboUrls = [];
                            currentComboMods = [];
                            i--;
                        }
                    }
                    if (currentComboUrls.length) {
                        pushComboUrl();
                    }
                }
            }
            return comboRes;
        }
    });

    Loader.ComboLoader = ComboLoader;
})(KISSY);
/*
 2013-09-11
 - union simple loader and combo loader

 2013-07-25 阿古, yiminghe
 - support group combo for packages

 2013-06-04 yiminghe@gmail.com
 - refactor merge combo loader and simple loader
 - support error callback

 2012-02-20 yiminghe note:
 - three status
 0: initialized
 LOADED: load into page
 ATTACHED: fn executed
 *//**
 * @ignore
 * mix loader into KISSY and infer KISSY baseUrl if not set
 * @author yiminghe@gmail.com
 */
(function (S, undefined) {
    var Loader = S.Loader,
        Env = S.Env,
        logger = S.getLogger('s/loader'),
        Utils = Loader.Utils,
        processImmediate = S.setImmediate,
        ComboLoader = Loader.ComboLoader;

    function WaitingModules(fn) {
        S.mix(this, {
            fn: fn,
            waitMods: {}
        });
    }

    WaitingModules.prototype = {
        constructor: WaitingModules,

        notifyAll: function () {
            var self = this,
                fn = self.fn;
            if (fn && S.isEmptyObject(self.waitMods)) {
                self.fn = null;
                fn();
            }
        },

        add: function (modName) {
            this.waitMods[modName] = 1;
        },

        remove: function (modName) {
            delete this.waitMods[modName];
        },

        contains: function (modName) {
            return this.waitMods[modName];
        }
    };

    Loader.WaitingModules = WaitingModules;

    S.mix(S, {
        /**
         * Registers a module with the KISSY global.
         * @param {String} name module name.
         * it must be set if combine is true in {@link KISSY#config}
         * @param {Function} fn module definition function that is used to return
         * this module value
         * @param {KISSY} fn.S KISSY global instance
         * @param {Object} [cfg] module optional config data
         * @param {String[]} cfg.requires this module's required module name list
         * @member KISSY
         *
         *
         *      // dom module's definition
         *      KISSY.add('dom', function(S, xx){
         *          return {css: function(el, name, val){}};
         *      },{
         *          requires:['xx']
         *      });
         */
        add: function (name, fn, cfg) {
            ComboLoader.add(name, fn, cfg, S);
        },
        /**
         * Attached one or more modules to global KISSY instance.
         * @param {String|String[]} modNames moduleNames. 1-n modules to bind(use comma to separate)
         * @param {Function} success callback function executed
         * when KISSY has the required functionality.
         * @param {KISSY} success.S KISSY instance
         * @param success.x... used module values
         * @member KISSY
         *
         *
         *      // loads and attached overlay,dd and its dependencies
         *      KISSY.use('overlay,dd', function(S, Overlay){});
         */
        use: function (modNames, success) {
            var normalizedModNames,
                loader,
                error,
                sync,
                tryCount = 0,
                waitingModules = new WaitingModules(loadReady);

            if (S.isPlainObject(success)) {
                //noinspection JSUnresolvedVariable
                sync = success.sync;
                //noinspection JSUnresolvedVariable
                error = success.error;
                //noinspection JSUnresolvedVariable
                success = success.success;
            }

            modNames = Utils.getModNamesAsArray(modNames);
            modNames = Utils.normalizeModNamesWithAlias(S, modNames);

            normalizedModNames = Utils.unalias(S, modNames);

            function loadReady() {
                ++tryCount;
                var errorList = [],
                    start = S.now(),
                    ret;
                ret = Utils.attachModsRecursively(normalizedModNames, S, undefined, errorList);
                logger.debug(tryCount + ' check duration ' + (S.now() - start));
                if (ret) {
                    if (success) {
                        if (sync) {
                            success.apply(S, Utils.getModules(S, modNames));
                        } else {
                            // standalone error trace
                            processImmediate(function () {
                                success.apply(S, Utils.getModules(S, modNames));
                            });
                        }
                    }
                } else if (errorList.length) {
                    if (error) {
                        if (sync) {
                            error.apply(S, errorList);
                        } else {
                            processImmediate(function () {
                                error.apply(S, errorList);
                            });
                        }
                    }
                } else {
                    logger.debug(tryCount + ' reload ' + modNames);
                    waitingModules.fn = loadReady;
                    loader.use(normalizedModNames);
                }
            }

            loader = new ComboLoader(S, waitingModules);

            // in case modules is loaded statically
            // synchronous check
            // but always async for loader
            if (sync) {
                waitingModules.notifyAll();
            } else {
                processImmediate(function () {
                    waitingModules.notifyAll();
                });
            }
            return S;
        },

        /**
         * get module value from KISSY module cache
         * @param {String} moduleName module name
         * @member KISSY
         * @return {*} value of module which name is moduleName
         */
        require: function (moduleName) {
            var moduleNames = Utils.unalias(S, Utils.normalizeModNamesWithAlias(S, [moduleName]));
            if (Utils.attachModsRecursively(moduleNames, S)) {
                return Utils.getModules(S, moduleNames)[1];
            }
            return undefined;
        }
    });

    Env.mods = {}; // all added mods
})(KISSY);

/*
 2013-06-04 yiminghe@gmail.com
 - refactor merge combo loader and simple loader
 - support error callback
 *//**
 * @ignore
 * init loader, set config
 */
(function (S) {
    var doc = S.Env.host && S.Env.host.document;
    // var logger = S.getLogger('s/loader');
    var Utils = S.Loader.Utils;
    var TIMESTAMP = '20131118174450';

    function returnJson(s) {
        return (new Function('return ' + s))();
    }

    var baseReg = /^(.*)(seed|kissy)(?:-min)?\.js[^/]*/i,
        baseTestReg = /(seed|kissy)(?:-min)?\.js/i;

    function getBaseInfoFromOneScript(script) {
        // can not use KISSY.Uri
        // /??x.js,dom.js for tbcdn
        var src = script.src || '';
        if (!src.match(baseTestReg)) {
            return 0;
        }

        var baseInfo = script.getAttribute('data-config');

        if (baseInfo) {
            baseInfo = returnJson(baseInfo);
        } else {
            baseInfo = {};
        }

        var comboPrefix = baseInfo.comboPrefix = baseInfo.comboPrefix || '??';
        var comboSep = baseInfo.comboSep = baseInfo.comboSep || ',';

        var parts ,
            base,
            index = src.indexOf(comboPrefix);

        // no combo
        if (index == -1) {
            base = src.replace(baseReg, '$1');
        } else {
            base = src.substring(0, index);
            // a.tbcdn.cn??y.js, ie does not insert / after host
            // a.tbcdn.cn/combo? comboPrefix=/combo?
            if (base.charAt(base.length - 1) != '/') {
                base += '/';
            }
            parts = src.substring(index + comboPrefix.length).split(comboSep);
            S.each(parts, function (part) {
                if (part.match(baseTestReg)) {
                    base += part.replace(baseReg, '$1');
                    return false;
                }
                return undefined;
            });
        }

        return S.mix({
            base: base,
            // kissy 's tag will be determined by build time and user specified url
            tag: Utils.getHash(TIMESTAMP + src)
        }, baseInfo);
    }

    /**
     * get base from seed.js
     * @return {Object} base for kissy
     * @ignore
     *
     * for example:
     *      @example
     *      http://a.tbcdn.cn/??s/kissy/x.y.z/seed-min.js,p/global/global.js
     *      note about custom combo rules, such as yui3:
     *      combo-prefix='combo?' combo-sep='&'
     */
    function getBaseInfo() {
        // get base from current script file path
        // notice: timestamp
        var scripts = doc.getElementsByTagName('script'),
            i,
            info;

        for (i = scripts.length - 1; i >= 0; i--) {
            if (info = getBaseInfoFromOneScript(scripts[i])) {
                return info;
            }
        }

        S.log('must load kissy by file name in browser environment: seed.js or seed-min.js', 'error');
        return null;
    }

    S.config({
        charset: 'utf-8',
        lang: 'zh-cn',
        tag: TIMESTAMP
    });

    if (S.UA.nodejs) {
        // nodejs: no tag
        // noinspection JSUnresolvedVariable
        S.config({
            charset: 'utf-8',
            base: __dirname.replace(/\\/g, '/').replace(/\/$/, '') + '/'
        });
        // ejecta
    } else if (doc && doc.getElementsByTagName) {
        // will transform base to absolute path
        S.config(S.mix({
            // 2k(2048) url length
            comboMaxUrlLength: 2000,
            // file limit number for a single combo url
            comboMaxFileNum: 40
        }, getBaseInfo()));
    }
})(KISSY);/**
 * @ignore
 * i18n plugin for kissy loader
 * @author yiminghe@gmail.com
 */
KISSY.add('i18n', {
    alias: function (S, name) {
        return name + '/i18n/' + S.Config.lang;
    }
});/**
 * this code can only run at browser environment
 * @ignore
 * @author lifesinger@gmail.com, yiminghe@gmail.com
 */
(function (S, undefined) {
    var win = S.Env.host,
        logger = S.getLogger('s/web'),
        UA = S.UA,
        doc = win['document'],
        docElem = doc && doc.documentElement,
        location = win.location,
        EMPTY = '',
        domReady = 0,
        callbacks = [],
    // The number of poll times.
        POLL_RETIRES = 500,
    // The poll interval in milliseconds.
        POLL_INTERVAL = 40,
    // #id or id
        RE_ID_STR = /^#?([\w-]+)$/,
        RE_NOT_WHITESPACE = /\S/,
        standardEventModel = !!(doc && doc.addEventListener),
        DOM_READY_EVENT = 'DOMContentLoaded',
        READY_STATE_CHANGE_EVENT = 'readystatechange',
        LOAD_EVENT = 'load',
        COMPLETE = 'complete',
        addEventListener = standardEventModel ? function (el, type, fn) {
            el.addEventListener(type, fn, false);
        } : function (el, type, fn) {
            el.attachEvent('on' + type, fn);
        },
        removeEventListener = standardEventModel ? function (el, type, fn) {
            el.removeEventListener(type, fn, false);
        } : function (el, type, fn) {
            el.detachEvent('on' + type, fn);
        };

    S.mix(S, {
        /**
         * A crude way of determining if an object is a window
         * @member KISSY
         */
        isWindow: function (obj) {
            return obj != null && obj == obj.window;
        },

        /**
         * get xml representation of data
         * @param {String} data
         * @member KISSY
         */
        parseXML: function (data) {
            // already a xml
            if (data.documentElement) {
                return data;
            }
            var xml;
            try {
                // Standard
                if (win['DOMParser']) {
                    xml = new DOMParser().parseFromString(data, 'text/xml');
                } else { // IE
                    xml = new ActiveXObject('Microsoft.XMLDOM');
                    xml.async = false;
                    xml.loadXML(data);
                }
            } catch (e) {
                logger.error('parseXML error :');
                logger.error(e);
                xml = undefined;
            }
            if (!xml || !xml.documentElement || xml.getElementsByTagName('parsererror').length) {
                S.error('Invalid XML: ' + data);
            }
            return xml;
        },

        /**
         * Evaluates a script in a global context.
         * @member KISSY
         */
        globalEval: function (data) {
            if (data && RE_NOT_WHITESPACE.test(data)) {
                // http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
                // http://msdn.microsoft.com/en-us/library/ie/ms536420(v=vs.85).aspx always return null
                ( win.execScript || function (data) {
                    win[ 'eval' ].call(win, data);
                } )(data);
            }
        },

        /**
         * Specify a function to execute when the Dom is fully loaded.
         * @param fn {Function} A function to execute after the Dom is ready
         * @chainable
         * @member KISSY
         */
        ready: function (fn) {
            if (domReady) {
                try {
                    fn(S);
                } catch (e) {
                    S.log(e.stack || e, 'error');
                    setTimeout(function () {
                        throw e;
                    }, 0);
                }
            } else {
                callbacks.push(fn);
            }
            return this;
        },

        /**
         * Executes the supplied callback when the item with the supplied id is found.
         * @param id {String} The id of the element, or an array of ids to look for.
         * @param fn {Function} What to execute when the element is found.
         * @member KISSY
         */
        available: function (id, fn) {
            id = (id + EMPTY).match(RE_ID_STR)[1];
            var retryCount = 1;
            var timer = S.later(function () {
                if (++retryCount > POLL_RETIRES) {
                    timer.cancel();
                    return;
                }
                var node = doc.getElementById(id);
                if (node) {
                    fn(node);
                    timer.cancel();
                }
            }, POLL_INTERVAL, true);
        }
    });

    function fireReady() {
        if (domReady) {
            return;
        }
        // nodejs
        if (doc && !UA.nodejs) {
            removeEventListener(win, LOAD_EVENT, fireReady);
        }
        domReady = 1;
        for (var i = 0; i < callbacks.length; i++) {
            try {
                callbacks[i](S);
            } catch (e) {
                S.log(e.stack || e, 'error');
                setTimeout(function () {
                    throw e;
                }, 0);
            }
        }
    }

    //  Binds ready events.
    function bindReady() {
        // Catch cases where ready() is called after the
        // browser event has already occurred.
        if (!doc || doc.readyState === COMPLETE) {
            fireReady();
            return;
        }

        // A fallback to window.onload, that will always work
        addEventListener(win, LOAD_EVENT, fireReady);

        // w3c mode
        if (standardEventModel) {
            var domReady = function () {
                removeEventListener(doc, DOM_READY_EVENT, domReady);
                fireReady();
            };

            addEventListener(doc, DOM_READY_EVENT, domReady);
        }
        // IE event model is used
        else {
            var stateChange = function () {
                if (doc.readyState === COMPLETE) {
                    removeEventListener(doc, READY_STATE_CHANGE_EVENT, stateChange);
                    fireReady();
                }
            };

            // ensure firing before onload (but completed after all inner iframes is loaded)
            // maybe late but safe also for iframes
            addEventListener(doc, READY_STATE_CHANGE_EVENT, stateChange);

            // If IE and not a frame
            // continually check to see if the document is ready
            var notframe,
                doScroll = docElem && docElem.doScroll;

            try {
                notframe = (win['frameElement'] === null);
            } catch (e) {
                notframe = false;
            }

            // can not use in iframe,parent window is dom ready so doScroll is ready too
            if (doScroll && notframe) {
                var readyScroll = function () {
                    try {
                        // Ref: http://javascript.nwbox.com/IEContentLoaded/
                        doScroll('left');
                        fireReady();
                    } catch (ex) {
                        setTimeout(readyScroll, POLL_INTERVAL);
                    }
                };
                readyScroll();
            }
        }
    }

    // If url contains '?ks-debug', debug mode will turn on automatically.
    if (location && (location.search || EMPTY).indexOf('ks-debug') !== -1) {
        S.Config.debug = true;
    }

    // bind on start
    // in case when you bind but the DOMContentLoaded has triggered
    // then you has to wait onload
    // worst case no callback at all
    bindReady();

    if (UA.ie) {
        try {
            doc.execCommand('BackgroundImageCache', false, true);
        } catch (e) {
        }
    }
})(KISSY, undefined);
/**
 * @ignore
 * Default KISSY Gallery and core alias.
 * @author yiminghe@gmail.com
 */
(function (S) {
    // compatibility
    S.config({
        modules: {
            core: {
                alias: ['dom', 'event', 'io', 'anim', 'base', 'node', 'json', 'ua', 'cookie']
            },
            ajax: {
                alias: ['io']
            },
            'rich-base': {
                alias: ['base']
            }
        }
    });
    if (typeof location != 'undefined') {
        var https = S.startsWith(location.href, 'https');
        var prefix = https ? 'https://s.tbcdn.cn/s/kissy/' : 'http://a.tbcdn.cn/s/kissy/';
        S.config({
            packages: {
                gallery: {
                    base: prefix
                },
                mobile: {
                    base: prefix
                }
            }
        });
    }
})(KISSY);

(function(config,Features,UA){
/*Generated By KISSY Module Compiler*/
config({
'anim': {requires: ['dom','anim/base','anim/timer',KISSY.Features.isTransitionSupported() ? "anim/transition" : ""]}
});
/*Generated By KISSY Module Compiler*/
config({
'anim/base': {requires: ['dom','promise']}
});
/*Generated By KISSY Module Compiler*/
config({
'anim/timer': {requires: ['dom','anim/base']}
});
/*Generated By KISSY Module Compiler*/
config({
'anim/transition': {requires: ['dom','event/dom','anim/base']}
});
/*Generated By KISSY Module Compiler*/
config({
'base': {requires: ['event/custom']}
});
/*Generated By KISSY Module Compiler*/
config({
'button': {requires: ['node','component/control']}
});
/*Generated By KISSY Module Compiler*/
config({
'color': {requires: ['base']}
});
/*Generated By KISSY Module Compiler*/
config({
'combobox': {requires: ['node','component/control','menu','base','io']}
});
/*Generated By KISSY Module Compiler*/
config({
'component/container': {requires: ['component/control','component/manager']}
});
/*Generated By KISSY Module Compiler*/
config({
'component/control': {requires: ['node','base','promise','component/manager','xtemplate/runtime']}
});
/*Generated By KISSY Module Compiler*/
config({
'component/extension/align': {requires: ['node']}
});
/*Generated By KISSY Module Compiler*/
config({
'component/extension/delegate-children': {requires: ['node','component/manager']}
});
/*Generated By KISSY Module Compiler*/
config({
'component/plugin/drag': {requires: ['base','dd']}
});
/*Generated By KISSY Module Compiler*/
config({
'component/plugin/resize': {requires: ['resizable']}
});
/*Generated By KISSY Module Compiler*/
config({
'date/format': {requires: ['date/gregorian','i18n!date']}
});
/*Generated By KISSY Module Compiler*/
config({
'date/gregorian': {requires: ['i18n!date']}
});
/*Generated By KISSY Module Compiler*/
config({
'date/picker': {requires: ['node','date/gregorian','i18n!date/picker','component/control','date/format']}
});
/*Generated By KISSY Module Compiler*/
config({
'date/popup-picker': {requires: ['date/picker','component/extension/align','component/extension/shim']}
});
/*Generated By KISSY Module Compiler*/
config({
'dd': {requires: ['node','base']}
});
/*Generated By KISSY Module Compiler*/
config({
'dd/plugin/constrain': {requires: ['base','node']}
});
/*Generated By KISSY Module Compiler*/
config({
'dd/plugin/proxy': {requires: ['node','base','dd']}
});
/*Generated By KISSY Module Compiler*/
config({
'dd/plugin/scroll': {requires: ['dd','base','node']}
});
config({
    "dom/basic": {
        "alias": [
            'dom/base',
            Features.isIELessThan(9) ? 'dom/ie' : '',
            Features.isClassListSupported() ? '' : 'dom/class-list'
        ]
    },
    "dom": {
        "alias": [
            'dom/basic',
            !Features.isQuerySelectorSupported() ? 'dom/selector' : ''
        ]
    }
});/*Generated By KISSY Module Compiler*/
config({
'dom/class-list': {requires: ['dom/base']}
});
/*Generated By KISSY Module Compiler*/
config({
'dom/ie': {requires: ['dom/base']}
});
/*Generated By KISSY Module Compiler*/
config({
'dom/selector': {requires: ['dom/basic']}
});
/*Generated By KISSY Module Compiler*/
config({
'editor': {requires: ['node','html-parser','component/control','event']}
});
/*Generated By KISSY Module Compiler*/
config({
'event': {requires: ['event/dom','event/custom']}
});
/*Generated By KISSY Module Compiler*/
config({
'event/custom': {requires: ['event/base']}
});
config({
    "event/dom": {
        "alias": [
            "event/dom/base",
            Features.isTouchEventSupported() || Features.isMsPointerSupported() ?
                'event/dom/touch' : '',
            Features.isDeviceMotionSupported() ?
                'event/dom/shake' : '',
            Features.isHashChangeSupported() ?
                '' : 'event/dom/hashchange',
            Features.isIELessThan(9) ?
                'event/dom/ie' : '',
            UA.ie ? '' : 'event/dom/focusin'
        ]
    }
});/*Generated By KISSY Module Compiler*/
config({
'event/dom/base': {requires: ['event/base','dom']}
});
/*Generated By KISSY Module Compiler*/
config({
'event/dom/focusin': {requires: ['event/dom/base']}
});
/*Generated By KISSY Module Compiler*/
config({
'event/dom/hashchange': {requires: ['event/dom/base','dom']}
});
/*Generated By KISSY Module Compiler*/
config({
'event/dom/ie': {requires: ['event/dom/base','dom']}
});
/*Generated By KISSY Module Compiler*/
config({
'event/dom/shake': {requires: ['event/dom/base']}
});
/*Generated By KISSY Module Compiler*/
config({
'event/dom/touch': {requires: ['event/dom/base','dom']}
});
/*Generated By KISSY Module Compiler*/
config({
'filter-menu': {requires: ['menu','node','component/extension/content-render']}
});
/*Generated By KISSY Module Compiler*/
config({
'io': {requires: ['dom','event/custom','promise','event']}
});
/*Generated By KISSY Module Compiler*/
config({
'kison': {requires: ['base']}
});
/*Generated By KISSY Module Compiler*/
config({
'menu': {requires: ['node','component/container','component/extension/delegate-children','component/control','component/extension/content-render','component/extension/align','component/extension/shim']}
});
/*Generated By KISSY Module Compiler*/
config({
'menubutton': {requires: ['node','button','component/extension/content-render','menu']}
});
/*Generated By KISSY Module Compiler*/
config({
'mvc': {requires: ['base','node','io','json']}
});
/*Generated By KISSY Module Compiler*/
config({
'node': {requires: ['dom','event/dom','anim']}
});
/*Generated By KISSY Module Compiler*/
config({
'overlay': {requires: ['component/container','component/extension/shim','component/extension/align','node','component/extension/content-render']}
});
/*Generated By KISSY Module Compiler*/
config({
'resizable': {requires: ['node','base','dd']}
});
/*Generated By KISSY Module Compiler*/
config({
'resizable/plugin/proxy': {requires: ['base','node']}
});
config({
    "scroll-view": {
        "alias": [
            Features.isTouchEventSupported()||Features.isMsPointerSupported()
            ? 'scroll-view/drag' : 'scroll-view/base'
        ]
    }
});/*Generated By KISSY Module Compiler*/
config({
'scroll-view/base': {requires: ['node','anim','component/container','component/extension/content-render']}
});
/*Generated By KISSY Module Compiler*/
config({
'scroll-view/drag': {requires: ['scroll-view/base','node','anim']}
});
/*Generated By KISSY Module Compiler*/
config({
'scroll-view/plugin/pull-to-refresh': {requires: ['base']}
});
/*Generated By KISSY Module Compiler*/
config({
'scroll-view/plugin/scrollbar': {requires: ['base','node','component/control']}
});
/*Generated By KISSY Module Compiler*/
config({
'separator': {requires: ['component/control']}
});
/*Generated By KISSY Module Compiler*/
config({
'split-button': {requires: ['component/container','button','menubutton']}
});
/*Generated By KISSY Module Compiler*/
config({
'stylesheet': {requires: ['dom']}
});
/*Generated By KISSY Module Compiler*/
config({
'swf': {requires: ['dom','json','base']}
});
/*Generated By KISSY Module Compiler*/
config({
'tabs': {requires: ['component/container','toolbar','button']}
});
/*Generated By KISSY Module Compiler*/
config({
'toolbar': {requires: ['component/container','component/extension/delegate-children','node']}
});
/*Generated By KISSY Module Compiler*/
config({
'tree': {requires: ['node','component/container','component/extension/content-render','component/extension/delegate-children']}
});
/*Generated By KISSY Module Compiler*/
config({
'xtemplate': {requires: ['xtemplate/runtime','xtemplate/compiler']}
});
/*Generated By KISSY Module Compiler*/
config({
'xtemplate/compiler': {requires: ['xtemplate/runtime']}
});
/*Generated By KISSY Module Compiler*/
config({
'xtemplate/nodejs': {requires: ['xtemplate']}
});

                })(function(c){
                KISSY.config('modules', c);
                },KISSY.Features,KISSY.UA);
            /**
 * @ignore
 * 1. export KISSY 's functionality to module system
 * 2. export light-weighted json parse
 */
(function (S) {
    // empty mod for conditional loading
    S.add('empty', S.noop);

    S.add('ua', function () {
        return S.UA;
    });

    S.add('uri', function () {
        return S.Uri;
    });

    S.add('path', function () {
        return S.Path
    });

    var UA = S.UA,
        Env = S.Env,
        win = Env.host,
        doc = win.document || {},
        documentMode = doc.documentMode,
        nativeJson = ((UA.nodejs && typeof global === 'object') ? global : win).JSON;

    // ie 8.0.7600.16315@win7 json bug!
    if (documentMode && documentMode < 9) {
        nativeJson = null;
    }

    if (nativeJson) {
        S.add('json', function () {
            return S.JSON = nativeJson;
        });
        // light weight json parse
        S.parseJson = function (data) {
            return nativeJson.parse(data);
        };
    } else {
        // Json RegExp
        var INVALID_CHARS_REG = /^[\],:{}\s]*$/,
            INVALID_BRACES_REG = /(?:^|:|,)(?:\s*\[)+/g,
            INVALID_ESCAPES_REG = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
            INVALID_TOKENS_REG = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g;
        S.parseJson = function (data) {
            if (data === null) {
                return data;
            }
            if (typeof data === "string") {
                // for ie
                data = S.trim(data);
                if (data) {
                    // from json2
                    if (INVALID_CHARS_REG.test(data.replace(INVALID_ESCAPES_REG, "@")
                        .replace(INVALID_TOKENS_REG, "]")
                        .replace(INVALID_BRACES_REG, ""))) {

                        return ( new Function("return " + data) )();
                    }
                }
            }
            return S.error("Invalid Json: " + data);
        };
    }

    // exports for nodejs
    if (S.UA.nodejs) {
        S.KISSY = S;
        module.exports = S;
    }
})(KISSY);
