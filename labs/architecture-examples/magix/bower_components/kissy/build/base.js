/*
Copyright 2013, KISSY v1.40
MIT Licensed
build time: Oct 29 14:13
*/
/*
 Combined processedModules by KISSY Module Compiler: 

 base/attribute
 base
*/

/**
 * @ignore
 * attribute management
 * @author yiminghe@gmail.com, lifesinger@gmail.com
 */
KISSY.add('base/attribute', function (S, undefined) {
    // atomic flag
    var INVALID = {};

    var FALSE = false;

    function normalFn(host, method) {
        if (typeof method == 'string') {
            return host[method];
        }
        return method;
    }

    function whenAttrChangeEventName(when, name) {
        return when + S.ucfirst(name) + 'Change';
    }

    // fire attribute value change
    function __fireAttrChange(self, when, name, prevVal, newVal, subAttrName, attrName, data) {
        attrName = attrName || name;
        return self.fire(whenAttrChangeEventName(when, name), S.mix({
            attrName: attrName,
            subAttrName: subAttrName,
            prevVal: prevVal,
            newVal: newVal
        }, data));
    }

    function ensureNonEmpty(obj, name, doNotCreate) {
        var ret = obj[name];
        if (!doNotCreate && !ret) {
            obj[name] = ret = {};
        }
        return ret || {};
    }

    /*
     o, [x,y,z] => o[x][y][z]
     */
    function getValueByPath(o, path) {
        for (var i = 0, len = path.length;
             o != undefined && i < len;
             i++) {
            o = o[path[i]];
        }
        return o;
    }

    /*
     o, [x,y,z], val => o[x][y][z]=val
     */
    function setValueByPath(o, path, val) {
        var len = path.length - 1,
            s = o;
        if (len >= 0) {
            for (var i = 0; i < len; i++) {
                o = o[path[i]];
            }
            if (o != undefined) {
                o[path[i]] = val;
            } else {
                s = undefined;
            }
        }
        return s;
    }

    function getPathNamePair(name) {
        var path;

        if (name.indexOf('.') !== -1) {
            path = name.split('.');
            name = path.shift();
        }

        return {
            path: path,
            name: name
        };
    }

    function getValueBySubValue(prevVal, path, value) {
        var tmp = value;
        if (path) {
            if (prevVal === undefined) {
                tmp = {};
            } else {
                tmp = S.clone(prevVal);
            }
            setValueByPath(tmp, path, value);
        }
        return tmp;
    }

    function prepareDefaultSetFn(self, name) {
        var defaultBeforeFns = ensureNonEmpty(self, '__defaultBeforeFns');
        if (defaultBeforeFns[name]) {
            return;
        }
        defaultBeforeFns[name] = 1;
        var beforeChangeEventName = whenAttrChangeEventName('before', name);
        self.publish(beforeChangeEventName, {
            defaultFn: defaultSetFn
        });
    }

    function setInternal(self, name, value, opts, attrs) {
        var path,
            subVal,
            prevVal,
            pathNamePair = getPathNamePair(name),
            fullName = name;

        name = pathNamePair.name;
        path = pathNamePair.path;
        prevVal = self.get(name);

        prepareDefaultSetFn(self, name);

        if (path) {
            subVal = getValueByPath(prevVal, path);
        }

        // if no change, just return
        // pass equal check to fire change event
        if (!opts.force) {
            if (!path && prevVal === value) {
                return undefined;
            } else if (path && subVal === value) {
                return undefined;
            }
        }

        value = getValueBySubValue(prevVal, path, value);

        var beforeEventObject = S.mix({
            attrName: name,
            subAttrName: fullName,
            prevVal: prevVal,
            newVal: value,
            _opts: opts,
            _attrs: attrs,
            target: self
        }, opts.data);

        // check before event
        if (opts['silent']) {
            if (FALSE === defaultSetFn.call(self, beforeEventObject)) {
                return FALSE;
            }
        } else {
            if (FALSE === self.fire(whenAttrChangeEventName('before', name), beforeEventObject)) {
                return FALSE;
            }
        }

        return self;
    }

    function defaultSetFn(e) {
        // only consider itself, not bubbling!
        if (e.target !== this) {
            return undefined;
        }
        var self = this,
            value = e.newVal,
            prevVal = e.prevVal,
            name = e.attrName,
            fullName = e.subAttrName,
            attrs = e._attrs,
            opts = e._opts;

        // set it
        var ret = self.setInternal(name, value);

        if (ret === FALSE) {
            return ret;
        }

        // fire after event
        if (!opts['silent']) {
            value = self.__attrVals[name];
            __fireAttrChange(self, 'after', name, prevVal, value, fullName, null, opts.data);
            if (attrs) {
                attrs.push({
                    prevVal: prevVal,
                    newVal: value,
                    attrName: name,
                    subAttrName: fullName
                });
            } else {
                __fireAttrChange(self,
                    '', '*',
                    [prevVal], [value],
                    [fullName], [name],
                    opts.data);
            }
        }

        return undefined;
    }

    /**
     * @class KISSY.Base.Attribute
     * @override KISSY.Base
     */
    return {
        INVALID: INVALID,

        /**
         * get un-cloned attr config collections
         * @return {Object}
         * @private
         */
        getAttrs: function () {
            return this.__attrs;
        },

        /**
         * get un-cloned attr value collections
         * @return {Object}
         */
        getAttrVals: function () {
            var self = this,
                o = {},
                a,
                attrs = self.__attrs;
            for (a in attrs) {
                o[a] = self.get(a);
            }
            return o;
        },

        /**
         * Adds an attribute with the provided configuration to the host object.
         * @param {String} name attrName
         * @param {Object} attrConfig The config supports the following properties
         * @param [attrConfig.value] simple object or system native object
         * @param [attrConfig.valueFn] a function which can return current attribute 's default value
         * @param {Function} [attrConfig.setter] call when set attribute 's value
         * pass current attribute 's value as parameter
         * if return value is not undefined,set returned value as real value
         * @param {Function} [attrConfig.getter] call when get attribute 's value
         * pass current attribute 's value as parameter
         * return getter's returned value to invoker
         * @param {Function} [attrConfig.validator]  call before set attribute 's value
         * if return false,cancel this set action
         * @param {Boolean} [override] whether override existing attribute config ,default true
         * @chainable
         */
        addAttr: function (name, attrConfig, override) {
            var self = this,
                attrs = self.__attrs,
                attr,
                cfg = S.clone(attrConfig);
            if (attr = attrs[name]) {
                S.mix(attr, cfg, override);
            } else {
                attrs[name] = cfg;
            }
            return self;
        },

        /**
         * Configures a group of attributes, and sets initial values.
         * @param {Object} attrConfigs  An object with attribute name/configuration pairs.
         * @param {Object} initialValues user defined initial values
         * @chainable
         */
        addAttrs: function (attrConfigs, initialValues) {
            var self = this;
            S.each(attrConfigs, function (attrConfig, name) {
                self.addAttr(name, attrConfig);
            });
            if (initialValues) {
                self.set(initialValues);
            }
            return self;
        },

        /**
         * Checks if the given attribute has been added to the host.
         * @param {String} name attribute name
         * @return {Boolean}
         */
        hasAttr: function (name) {
            return this.__attrs.hasOwnProperty(name);
        },

        /**
         * Removes an attribute from the host object.
         * @chainable
         */
        removeAttr: function (name) {
            var self = this;
            var __attrVals = self.__attrVals;
            var __attrs = self.__attrs;

            if (self.hasAttr(name)) {
                delete __attrs[name];
                delete __attrVals[name];
            }

            return self;
        },


        /**
         * Sets the value of an attribute.
         * @param {String|Object} name attribute 's name or attribute name and value map
         * @param [value] attribute 's value
         * @param {Object} [opts] some options
         * @param {Boolean} [opts.silent] whether fire change event
         * @param {Function} [opts.error] error handler
         * @return {Boolean} whether pass validator
         */
        set: function (name, value, opts) {
            var self = this;
            if (S.isPlainObject(name)) {
                opts = value;
                opts = opts || {};
                var all = Object(name),
                    attrs = [],
                    e,
                    errors = [];
                for (name in all) {
                    // bulk validation
                    // if any one failed,all values are not set
                    if ((e = validate(self, name, all[name], all)) !== undefined) {
                        errors.push(e);
                    }
                }
                if (errors.length) {
                    if (opts['error']) {
                        opts['error'](errors);
                    }
                    return FALSE;
                }
                for (name in all) {
                    setInternal(self, name, all[name], opts, attrs);
                }
                var attrNames = [],
                    prevVals = [],
                    newVals = [],
                    subAttrNames = [];
                S.each(attrs, function (attr) {
                    prevVals.push(attr.prevVal);
                    newVals.push(attr.newVal);
                    attrNames.push(attr.attrName);
                    subAttrNames.push(attr.subAttrName);
                });
                if (attrNames.length) {
                    __fireAttrChange(self,
                        '',
                        '*',
                        prevVals,
                        newVals,
                        subAttrNames,
                        attrNames,
                        opts.data);
                }
                return self;
            }
            opts = opts || {};
            // validator check
            e = validate(self, name, value);

            if (e !== undefined) {
                if (opts['error']) {
                    opts['error'](e);
                }
                return FALSE;
            }
            return setInternal(self, name, value, opts);
        },

        /**
         * internal use, no event involved, just set.
         * override by model
         * @protected
         */
        setInternal: function (name, value) {
            var self = this,
                setValue = undefined,
            // if host does not have meta info corresponding to (name,value)
            // then register on demand in order to collect all data meta info
            // 一定要注册属性元数据，否则其他模块通过 _attrs 不能枚举到所有有效属性
            // 因为属性在声明注册前可以直接设置值
                attrConfig = ensureNonEmpty(self.__attrs, name),
                setter = attrConfig['setter'];

            // if setter has effect
            if (setter && (setter = normalFn(self, setter))) {
                setValue = setter.call(self, value, name);
            }

            if (setValue === INVALID) {
                return FALSE;
            }

            if (setValue !== undefined) {
                value = setValue;
            }

            // finally set
            self.__attrVals[name] = value;

            return undefined;
        },

        /**
         * Gets the current value of the attribute.
         * @param {String} name attribute 's name
         * @return {*}
         */
        get: function (name) {
            var self = this,
                dot = '.',
                path,
                attrVals = self.__attrVals,
                attrConfig,
                getter, ret;

            if (name.indexOf(dot) !== -1) {
                path = name.split(dot);
                name = path.shift();
            }

            attrConfig = ensureNonEmpty(self.__attrs, name, 1);
            getter = attrConfig['getter'];

            // get user-set value or default value
            //user-set value takes privilege
            ret = name in attrVals ?
                attrVals[name] :
                getDefAttrVal(self, name);

            // invoke getter for this attribute
            if (getter && (getter = normalFn(self, getter))) {
                ret = getter.call(self, ret, name);
            }

            if (!(name in attrVals) && ret !== undefined) {
                attrVals[name] = ret;
            }

            if (path) {
                ret = getValueByPath(ret, path);
            }

            return ret;
        },

        /**
         * Resets the value of an attribute.just reset what addAttr set
         * (not what invoker set when call new Xx(cfg))
         * @param {String} name name of attribute
         * @param {Object} [opts] some options
         * @param {Boolean} [opts.silent] whether fire change event
         * @chainable
         */
        reset: function (name, opts) {
            var self = this;

            if (typeof name == 'string') {
                if (self.hasAttr(name)) {
                    // if attribute does not have default value, then set to undefined
                    return self.set(name, getDefAttrVal(self, name), opts);
                }
                else {
                    return self;
                }
            }

            opts = /**@type Object
             @ignore*/(name);

            var attrs = self.__attrs,
                values = {};

            // reset all
            for (name in attrs) {
                values[name] = getDefAttrVal(self, name);
            }

            self.set(values, opts);
            return self;
        }
    };

    // get default attribute value from valueFn/value
    function getDefAttrVal(self, name) {
        var attrs = self.__attrs,
            attrConfig = ensureNonEmpty(attrs, name, 1),
            valFn = attrConfig.valueFn,
            val;

        if (valFn && (valFn = normalFn(self, valFn))) {
            val = valFn.call(self);
            if (val !== /**
             @ignore
             @type Function
             */undefined) {
                attrConfig.value = val;
            }
            delete attrConfig.valueFn;
            attrs[name] = attrConfig;
        }

        return attrConfig.value;
    }

    function validate(self, name, value, all) {
        var path, prevVal, pathNamePair;

        pathNamePair = getPathNamePair(name);

        name = pathNamePair.name;
        path = pathNamePair.path;

        if (path) {
            prevVal = self.get(name);
            value = getValueBySubValue(prevVal, path, value);
        }
        var attrConfig = ensureNonEmpty(self.__attrs, name),
            e,
            validator = attrConfig['validator'];
        if (validator && (validator = normalFn(self, validator))) {
            e = validator.call(self, value, name, all);
            // undefined and true validate successfully
            if (e !== undefined && e !== true) {
                return e;
            }
        }
        return undefined;
    }
});

/*
 2011-10-18
 get/set sub attribute value ,set('x.y',val) x 最好为 {} ，不要是 new Clz() 出来的
 add validator
 */
/**
 * @ignore
 * KISSY Class System
 * @author yiminghe@gmail.com
 */
KISSY.add('base', function (S, Attribute, CustomEvent) {
    var ATTRS = 'ATTRS',
        ucfirst = S.ucfirst,
        ON_SET = '_onSet',
        noop = S.noop,
        RE_DASH = /(?:^|-)([a-z])/ig;

    function replaceToUpper() {
        return arguments[1].toUpperCase();
    }

    function CamelCase(name) {
        return name.replace(RE_DASH, replaceToUpper);
    }

    function __getHook(method, reverse) {
        return function (origFn) {
            return function wrap() {
                var self = this;
                if (reverse) {
                    origFn.apply(self, arguments);
                } else {
                    self.callSuper.apply(self, arguments);
                }
                // can not use wrap in old ie
                var extensions = arguments.callee.__owner__.__extensions__ || [];
                if (reverse) {
                    extensions.reverse();
                }
                callExtensionsMethod(self, extensions, method, arguments);
                if (reverse) {
                    self.callSuper.apply(self, arguments);
                } else {
                    origFn.apply(self, arguments);
                }
            };
        }
    }

    /**
     * @class KISSY.Base
     * @extend KISSY.Event.CustomEvent.Target
     *
     * A base class which objects requiring attributes, extension, plugin, custom event support can
     * extend.
     * attributes configured
     * through the static {@link KISSY.Base#static-ATTRS} property for each class
     * in the hierarchy will be initialized by Base.
     */
    function Base(config) {
        var self = this,
            c = self.constructor;
        Base.superclass.constructor.apply(this, arguments);
        self.__attrs = {};
        self.__attrVals = {};
        // save user config
        self.userConfig = config;
        // define
        while (c) {
            addAttrs(self, c[ATTRS]);
            c = c.superclass ? c.superclass.constructor : null;
        }
        // initial attr
        initAttrs(self, config);
        // setup listeners
        var listeners = self.get("listeners");
        for (var n in listeners) {
            self.on(n, listeners[n]);
        }
        // initializer
        self.initializer();
        // call plugins
        constructPlugins(self);
        callPluginsMethod.call(self, 'pluginInitializer');
        // bind attr change
        self.bindInternal();
        // sync attr
        self.syncInternal();
    }

    S.augment(Base, Attribute);

    S.extend(Base, CustomEvent.Target, {
        initializer: noop,

        '__getHook': __getHook,

        __callPluginsMethod: callPluginsMethod,

        'callSuper': function () {
            var method, obj,
                self = this,
                args = arguments;

            if (typeof self == 'function' && self.__name__) {
                method = self;
                obj = args[0];
                args = Array.prototype.slice.call(args, 1);
            } else {
                method = arguments.callee.caller;
                if (method.__wrapped__) {
                    method = method.caller;
                }
                obj = self;
            }

            var name = method.__name__;
            if (!name) {
                //S.log('can not find method name for callSuper [' + self.constructor.name + ']: ' + method.toString());
                return undefined;
            }
            var member = method.__owner__.superclass[name];
            if (!member) {
                //S.log('can not find method [' + name + '] for callSuper: ' + method.__owner__.name);
                return undefined;
            }

            return member.apply(obj, args || []);
        },

        /**
         * bind attribute change event
         * @protected
         */
        bindInternal: function () {
            var self = this,
                attrs = self['getAttrs'](),
                attr, m;

            for (attr in attrs) {
                m = ON_SET + ucfirst(attr);
                if (self[m]) {
                    // 自动绑定事件到对应函数
                    self.on('after' + ucfirst(attr) + 'Change', onSetAttrChange);
                }
            }
        },

        /**
         * sync attribute change event
         * @protected
         */
        syncInternal: function () {
            var self = this,
                cs = [],
                i,
                c = self.constructor,
                attrs = self.getAttrs();

            while (c) {
                cs.push(c);
                c = c.superclass && c.superclass.constructor;
            }

            cs.reverse();

            // from super class to sub class
            for (i = 0; i < cs.length; i++) {
                var ATTRS = cs[i].ATTRS || {};
                for (var attributeName in ATTRS) {
                    if (attributeName in attrs) {
                        var attributeValue,
                            onSetMethod;
                        var onSetMethodName = ON_SET + ucfirst(attributeName);
                        // 存在方法，并且用户设置了初始值或者存在默认值，就同步状态
                        if ((onSetMethod = self[onSetMethodName]) &&
                            // 用户如果设置了显式不同步，就不同步，
                            // 比如一些值从 html 中读取，不需要同步再次设置
                            attrs[attributeName].sync !== 0 &&
                            (attributeValue = self.get(attributeName)) !== undefined) {
                            onSetMethod.call(self, attributeValue);
                        }
                    }
                }
            }
        },

        /**
         * plugin a new plugins to current instance
         * @param {Function|Object} plugin
         * @chainable
         */
        'plug': function (plugin) {
            var self = this;
            if (typeof plugin === 'function') {
                plugin = new plugin();
            }
            // initialize plugin
            if (plugin['pluginInitializer']) {
                plugin['pluginInitializer'](self);
            }
            self.get('plugins').push(plugin);
            return self;
        },

        /**
         * unplug by pluginId or plugin instance.
         * if called with no parameter, then destroy all plugins.
         * @param {Object|String} [plugin]
         * @chainable
         */
        'unplug': function (plugin) {
            var plugins = [],
                self = this,
                isString = typeof plugin == 'string';

            S.each(self.get('plugins'), function (p) {
                var keep = 0, pluginId;
                if (plugin) {
                    if (isString) {
                        // user defined takes priority
                        pluginId = p.get && p.get('pluginId') || p.pluginId;
                        if (pluginId != plugin) {
                            plugins.push(p);
                            keep = 1;
                        }
                    } else {
                        if (p != plugin) {
                            plugins.push(p);
                            keep = 1;
                        }
                    }
                }

                if (!keep) {
                    p.pluginDestructor(self);
                }
            });

            self.setInternal('plugins', plugins);
            return self;
        },

        /**
         * get specified plugin instance by id
         * @param {String} id pluginId of plugin instance
         * @return {Object}
         */
        'getPlugin': function (id) {
            var plugin = null;
            S.each(this.get('plugins'), function (p) {
                // user defined takes priority
                var pluginId = p.get && p.get('pluginId') || p.pluginId;
                if (pluginId == id) {
                    plugin = p;
                    return false;
                }
                return undefined;
            });
            return plugin;
        },

        destructor: S.noop,

        destroy: function () {
            var self = this;
            if (!self.get('destroyed')) {
                callPluginsMethod.call(self, 'pluginDestructor');
                self.destructor();
                self.set('destroyed', true);
                self.fire('destroy');
                self.detach();
            }
        }
    });

    S.mix(Base, {
        __hooks__: {
            initializer: __getHook(),
            destructor: __getHook('__destructor', true)
        },

        ATTRS: {
            /**
             * Plugins for current component.
             * @cfg {Function[]/Object[]} plugins
             */
            /**
             * @ignore
             */
            plugins: {
                value: []
            },

            destroyed: {
                value: false
            },

            /**
             * Config listener on created.
             *
             * for example:
             *
             *      {
             *          click:{
             *              context:{x:1},
             *              fn:function(){
             *                  alert(this.x);
             *              }
             *          }
             *      }
             *      // or
             *      {
             *          click:function(){
             *              alert(this.x);
             *          }
             *      }
             *
             * @cfg {Object} listeners
             */
            /**
             * @ignore
             */
            listeners: {
                value: []
            }
        },

        /**
         * create a new class from extensions and static/prototype properties/methods.
         * @param {Function[]} [extensions] extension classes
         * @param {Object} [px] key-value map for prototype properties/methods.
         * @param {Object} [sx] key-value map for static properties/methods.
         * @param {String} [sx.name] new Class's name.
         * @return {Function} new class which extend called, it also has a static extend method
         * @static
         *
         * for example:
         *
         *      var Parent = Base.extend({
         *          isParent: 1
         *      });
         *      var Child = Parent.extend({
         *          isChild: 1,
         *          isParent: 0
         *      })
         */
        extend: function extend(extensions, px, sx) {
            var SuperClass = this,
                name,
                SubClass;
            if (!S.isArray(extensions)) {
                sx = px;
                px = /**@type {Object}
                 @ignore*/extensions;
                extensions = [];
            }
            sx = sx || {};
            name = sx.name || 'BaseDerived';
            px = S.merge(px);
            if (px.hasOwnProperty('constructor')) {
                SubClass = px.constructor;
            } else {
                // debug mode, give the right name for constructor
                // refer : http://limu.iteye.com/blog/1136712
                if ('@DEBUG@') {
                    eval("SubClass = function " + CamelCase(name) + "(){ " +
                        "this.callSuper.apply(this, arguments);}");
                } else {
                    SubClass = function () {
                        this.callSuper.apply(this, arguments);
                    };
                }
            }
            px.constructor = SubClass;
            // wrap method to get owner and name
            var hooks = SuperClass.__hooks__;
            if (hooks) {
                sx.__hooks__ = S.merge(hooks, sx.__hooks__);
            }
            SubClass.__extensions__ = extensions;
            wrapProtoForSuper(px, SubClass, sx.__hooks__ || {});
            var sp = SuperClass.prototype;
            // process inheritedStatics
            var inheritedStatics = sp['__inheritedStatics__'] = sp['__inheritedStatics__'] || sx['inheritedStatics'];
            if (sx['inheritedStatics'] && inheritedStatics !== sx['inheritedStatics']) {
                S.mix(inheritedStatics, sx['inheritedStatics']);
            }
            if (inheritedStatics) {
                S.mix(SubClass, inheritedStatics);
            }
            delete sx['inheritedStatics'];
            // extend
            S.extend(SubClass, SuperClass, px, sx);
            // merge extensions
            if (extensions.length) {
                var attrs = {},
                    prototype = {};
                // [ex1,ex2]，扩展类后面的优先，ex2 定义的覆盖 ex1 定义的
                // 主类最优先
                S.each(extensions['concat'](SubClass), function (ext) {
                    if (ext) {
                        // 合并 ATTRS 到主类
                        // 不覆盖主类上的定义(主类位于 constructors 最后)
                        // 因为继承层次上扩展类比主类层次高
                        // 注意：最好 value 必须是简单对象，自定义 new 出来的对象就会有问题
                        // (用 function return 出来)!
                        // a {y:{value:2}} b {y:{value:3,getter:fn}}
                        // b is a extension of a
                        // =>
                        // a {y:{value:2,getter:fn}}
                        S.each(ext[ATTRS], function (v, name) {
                            var av = attrs[name] = attrs[name] || {};
                            S.mix(av, v);
                        });
                        // 方法合并
                        var exp = ext.prototype,
                            p;
                        for (p in exp) {
                            // do not mess with parent class
                            if (exp.hasOwnProperty(p)) {
                                prototype[p] = exp[p];
                            }
                        }
                    }
                });
                SubClass[ATTRS] = attrs;
                prototype.constructor = SubClass;
                S.augment(SubClass, prototype);
            }
            SubClass.extend = SubClass.extend || extend;
            SubClass.addMembers = addMembers;
            return SubClass;
        }
    });

    function addMembers(px) {
        var SubClass = this;
        wrapProtoForSuper(px, SubClass, SubClass.__hooks__ || {});
        S.mix(SubClass.prototype, px);
    }

    /**
     * The default set of attributes which will be available for instances of this class, and
     * their configuration
     *
     * By default if the value is an object literal or an array it will be 'shallow' cloned, to
     * protect the default value.
     *
     *      for example:
     *      @example
     *      {
     *          x:{
     *              value: // default value
     *              valueFn: // default function to get value
     *              getter: // getter function
     *              setter: // setter function
     *          }
     *      }
     *
     * @property ATTRS
     * @member KISSY.Base
     * @static
     * @type {Object}
     */

    function onSetAttrChange(e) {
        var self = this,
            method;
        // ignore bubbling
        if (e.target == self) {
            method = self[ON_SET + e.type.slice(5).slice(0, -6)];
            method.call(self, e.newVal, e);
        }
    }

    function addAttrs(host, attrs) {
        if (attrs) {
            for (var attr in attrs) {
                // 子类上的 ATTRS 配置优先
                // 父类后加，父类不覆盖子类的相同设置
                // 属性对象会 merge
                // a: {y: {getter: fn}}, b: {y: {value: 3}}
                // b extends a
                // =>
                // b {y: {value: 3, getter: fn}}
                host.addAttr(attr, attrs[attr], false);
            }
        }
    }

    function initAttrs(host, config) {
        if (config) {
            for (var attr in config) {
                // 用户设置会调用 setter/validator 的，但不会触发属性变化事件
                host.setInternal(attr, config[attr]);
            }
        }
    }

    function constructPlugins(self) {
        var plugins = self.get('plugins');
        S.each(plugins, function (plugin, i) {
            if (typeof plugin === 'function') {
                plugins[i] = new plugin();
            }
        });
    }

    function wrapper(fn) {
        return function () {
            return fn.apply(this, arguments);
        }
    }

    function wrapProtoForSuper(px, SubClass, hooks) {
        var extensions = SubClass.__extensions__;
        if (extensions.length) {
            for (p in hooks) {
                px[p] = px[p] || noop;
            }
        }
        // in case px contains toString
        for (var p in hooks) {
            if (p in px) {
                px[p] = hooks[p](px[p]);
            }
        }
        S.each(px, function (v, p) {
            if (typeof v == 'function') {
                var wrapped = 0;
                if (v.__owner__) {
                    var originalOwner = v.__owner__;
                    delete v.__owner__;
                    delete v.__name__;
                    wrapped = v.__wrapped__ = 1;
                    var newV = wrapper(v);
                    newV.__owner__ = originalOwner;
                    newV.__name__ = p;
                    originalOwner.prototype[p] = newV;
                } else if (v.__wrapped__) {
                    wrapped = 1;
                }
                if (wrapped) {
                    px[p] = v = wrapper(v);
                }
                v.__owner__ = SubClass;
                v.__name__ = p;
            }
        });
    }

    function callPluginsMethod(method) {
        var len,
            self = this,
            plugins = self.get('plugins');
        if (len = plugins.length) {
            for (var i = 0; i < len; i++) {
                plugins[i][method] && plugins[i][method](self);
            }
        }
    }

    function callExtensionsMethod(self, extensions, method, args) {
        var len;
        if (len = extensions && extensions.length) {
            for (var i = 0; i < len; i++) {
                var fn = extensions[i] && (
                    !method ?
                        extensions[i] :
                        extensions[i].prototype[method]
                    );
                if (fn) {
                    fn.apply(self, args || []);
                }
            }
        }
    }

    S.Base = Base;

    return Base;
}, {
    requires: ['base/attribute', 'event/custom']
});
/**
 * @ignore
 * 2013-08-12 yiminghe@gmail.com
 * - merge rich-base and base
 * - callSuper inspired by goto100
 */

