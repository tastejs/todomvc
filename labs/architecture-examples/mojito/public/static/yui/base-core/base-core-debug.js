/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('base-core', function (Y, NAME) {

    /**
     * The base module provides the Base class, which objects requiring attribute and custom event support can extend. 
     * The module also provides two ways to reuse code - It augments Base with the Plugin.Host interface which provides 
     * plugin support and also provides the BaseCore.build method which provides a way to build custom classes using extensions.
     *
     * @module base
     */

    /**
     * <p>The base-core module provides the BaseCore class, the lightest version of Base, 
     * which provides Base's basic lifecycle management and ATTRS construction support, 
     * but doesn't fire init/destroy or attribute change events.</p> 
     * 
     * <p>It mixes in AttributeCore, which is the lightest version of Attribute</p>
     *
     * @module base
     * @submodule base-core
     */
    var O = Y.Object,
        L = Y.Lang,
        DOT = ".",
        INITIALIZED = "initialized",
        DESTROYED = "destroyed",
        INITIALIZER = "initializer",
        VALUE = "value",
        OBJECT_CONSTRUCTOR = Object.prototype.constructor,
        DEEP = "deep",
        SHALLOW = "shallow",
        DESTRUCTOR = "destructor",

        AttributeCore = Y.AttributeCore,

        _wlmix = function(r, s, wlhash) {
            var p;
            for (p in s) {
                if(wlhash[p]) { 
                    r[p] = s[p];
                }
            }
            return r;
        };

    /**
     * The BaseCore class, is the lightest version of Base, and provides Base's 
     * basic lifecycle management and ATTRS construction support, but doesn't 
     * fire init/destroy or attribute change events.
     *
     * BaseCore also handles the chaining of initializer and destructor methods across 
     * the hierarchy as part of object construction and destruction. Additionally, attributes 
     * configured through the static <a href="#property_BaseCore.ATTRS">ATTRS</a> 
     * property for each class in the hierarchy will be initialized by BaseCore.
     *
     * Classes which require attribute support, but don't intend to use/expose attribute 
     * change events can extend BaseCore instead of Base for optimal kweight and 
     * runtime performance.
     * 
     * @class BaseCore
     * @constructor
     * @uses AttributeCore
     * @param {Object} cfg Object with configuration property name/value pairs. 
     * The object can be used to provide initial values for the objects published 
     * attributes.
     */
    function BaseCore(cfg) {
        if (!this._BaseInvoked) {
            this._BaseInvoked = true;

            Y.log('constructor called', 'life', 'base');
            this._initBase(cfg);
        }
        else { Y.log('Based constructor called more than once. Ignoring duplicate calls', 'life', 'base'); }
    }

    /**
     * The list of properties which can be configured for each attribute 
     * (e.g. setter, getter, writeOnce, readOnly etc.)
     *
     * @property _ATTR_CFG
     * @type Array
     * @static
     * @private
     */
    BaseCore._ATTR_CFG = AttributeCore._ATTR_CFG.concat("cloneDefaultValue");
    BaseCore._ATTR_CFG_HASH = Y.Array.hash(BaseCore._ATTR_CFG);

    /**
     * The array of non-attribute configuration properties supported by this class. 
     * 
     * For example `BaseCore` defines a "plugins" configuration property which 
     * should not be set up as an attribute. This property is primarily required so 
     * that when <a href="#property__allowAdHocAttrs">`_allowAdHocAttrs`</a> is enabled by a class, 
     * non-attribute configuration properties don't get added as ad-hoc attributes.  
     *
     * @property _NON_ATTRS_CFG
     * @type Array
     * @static
     * @private
     */
    BaseCore._NON_ATTRS_CFG = ["plugins"];

    /**
     * This property controls whether or not instances of this class should
     * allow users to add ad-hoc attributes through the constructor configuration 
     * hash.
     *
     * AdHoc attributes are attributes which are not defined by the class, and are 
     * not handled by the MyClass._NON_ATTRS_CFG  
     * 
     * @property _allowAdHocAttrs
     * @type boolean
     * @default undefined (false)
     * @protected
     */

    /**
     * The string to be used to identify instances of this class.
     * 
     * Classes extending BaseCore, should define their own
     * static NAME property, which should be camelCase by
     * convention (e.g. MyClass.NAME = "myClass";).
     *
     * @property NAME
     * @type String
     * @static
     */
    BaseCore.NAME = "baseCore";

    /**
     * The default set of attributes which will be available for instances of this class, and 
     * their configuration. In addition to the configuration properties listed by 
     * AttributeCore's <a href="AttributeCore.html#method_addAttr">addAttr</a> method, 
     * the attribute can also be configured with a "cloneDefaultValue" property, which 
     * defines how the statically defined value field should be protected 
     * ("shallow", "deep" and false are supported values). 
     *
     * By default if the value is an object literal or an array it will be "shallow" 
     * cloned, to protect the default value.
     *
     * @property ATTRS
     * @type Object
     * @static
     */
    BaseCore.ATTRS = {
        /**
         * Flag indicating whether or not this object
         * has been through the init lifecycle phase.
         *
         * @attribute initialized
         * @readonly
         * @default false
         * @type boolean
         */
        initialized: {
            readOnly:true,
            value:false
        },

        /**
         * Flag indicating whether or not this object
         * has been through the destroy lifecycle phase.
         *
         * @attribute destroyed
         * @readonly
         * @default false
         * @type boolean
         */
        destroyed: {
            readOnly:true,
            value:false
        }
    };

    BaseCore.prototype = {

        /**
         * Internal construction logic for BaseCore.
         *
         * @method _initBase
         * @param {Object} config The constructor configuration object
         * @private
         */
        _initBase : function(config) {

            Y.stamp(this);

            this._initAttribute(config);

            // If Plugin.Host has been augmented [ through base-pluginhost ], setup it's
            // initial state, but don't initialize Plugins yet. That's done after initialization.
            var PluginHost = Y.Plugin && Y.Plugin.Host;
            if (this._initPlugins && PluginHost) {
                PluginHost.call(this);
            }

            if (this._lazyAddAttrs !== false) { this._lazyAddAttrs = true; }

            /**
             * The string used to identify the class of this object.
             *
             * @deprecated Use this.constructor.NAME
             * @property name
             * @type String
             */
            this.name = this.constructor.NAME;
    
            this.init.apply(this, arguments);
        },

        /**
         * Initializes AttributeCore 
         * 
         * @method _initAttribute
         * @private
         */
        _initAttribute: function() {
            AttributeCore.apply(this);
        },

        /**
         * Init lifecycle method, invoked during construction. Sets up attributes 
         * and invokes initializers for the class hierarchy.
         *
         * @method init
         * @chainable
         * @param {Object} cfg Object with configuration property name/value pairs
         * @return {BaseCore} A reference to this object
         */
        init: function(cfg) {
            Y.log('init called', 'life', 'base');

            this._baseInit(cfg);

            return this;
        },

        /**
         * Internal initialization implementation for BaseCore
         *
         * @method _baseInit
         * @private
         */
        _baseInit: function(cfg) {
            this._initHierarchy(cfg);

            if (this._initPlugins) {
                // Need to initPlugins manually, to handle constructor parsing, static Plug parsing
                this._initPlugins(cfg);
            }
            this._set(INITIALIZED, true);
        },

        /**
         * Destroy lifecycle method. Invokes destructors for the class hierarchy.
         *
         * @method destroy
         * @return {BaseCore} A reference to this object
         * @chainable
         */
        destroy: function() {
            this._baseDestroy();
            return this;
        },

        /**
         * Internal destroy implementation for BaseCore
         *
         * @method _baseDestroy
         * @private
         */
        _baseDestroy : function() {
            if (this._destroyPlugins) {
                this._destroyPlugins();
            }
            this._destroyHierarchy();
            this._set(DESTROYED, true);
        },

        /**
         * Returns the class hierarchy for this object, with BaseCore being the last class in the array.
         *
         * @method _getClasses
         * @protected
         * @return {Function[]} An array of classes (constructor functions), making up the class hierarchy for this object.
         * This value is cached the first time the method, or _getAttrCfgs, is invoked. Subsequent invocations return the 
         * cached value.
         */
        _getClasses : function() {
            if (!this._classes) {
                this._initHierarchyData();
            }
            return this._classes;
        },

        /**
         * Returns an aggregated set of attribute configurations, by traversing 
         * the class hierarchy.
         *
         * @method _getAttrCfgs
         * @protected
         * @return {Object} The hash of attribute configurations, aggregated across classes in the hierarchy
         * This value is cached the first time the method, or _getClasses, is invoked. Subsequent invocations return
         * the cached value.
         */
        _getAttrCfgs : function() {
            if (!this._attrs) {
                this._initHierarchyData();
            }
            return this._attrs;
        },

        /**
         * A helper method used when processing ATTRS across the class hierarchy during 
         * initialization. Returns a disposable object with the attributes defined for 
         * the provided class, extracted from the set of all attributes passed in.
         *
         * @method _filterAttrCfs
         * @private
         *
         * @param {Function} clazz The class for which the desired attributes are required.
         * @param {Object} allCfgs The set of all attribute configurations for this instance. 
         * Attributes will be removed from this set, if they belong to the filtered class, so
         * that by the time all classes are processed, allCfgs will be empty.
         * 
         * @return {Object} The set of attributes belonging to the class passed in, in the form
         * of an object with attribute name/configuration pairs.
         */
        _filterAttrCfgs : function(clazz, allCfgs) {
            var cfgs = null, attr, attrs = clazz.ATTRS;

            if (attrs) {
                for (attr in attrs) {
                    if (allCfgs[attr]) {
                        cfgs = cfgs || {};
                        cfgs[attr] = allCfgs[attr];
                        allCfgs[attr] = null;
                    }
                }
            }

            return cfgs;
        },

        /**
         * @method _filterAdHocAttrs
         * @private
         *
         * @param {Object} allAttrs The set of all attribute configurations for this instance. 
         * Attributes will be removed from this set, if they belong to the filtered class, so
         * that by the time all classes are processed, allCfgs will be empty.
         * @param {Object} userVals The config object passed in by the user, from which adhoc attrs are to be filtered.
         * @return {Object} The set of adhoc attributes passed in, in the form
         * of an object with attribute name/configuration pairs.
         */
        _filterAdHocAttrs : function(allAttrs, userVals) {
            var adHocs,
                nonAttrs = this._nonAttrs,
                attr;

            if (userVals) {
                adHocs = {};
                for (attr in userVals) {
                    if (!allAttrs[attr] && !nonAttrs[attr] && userVals.hasOwnProperty(attr)) {
                        adHocs[attr] = {
                            value:userVals[attr]
                        };
                    }
                }
            }

            return adHocs;
        },

        /**
         * A helper method used by _getClasses and _getAttrCfgs, which determines both
         * the array of classes and aggregate set of attribute configurations
         * across the class hierarchy for the instance.
         *
         * @method _initHierarchyData
         * @private
         */
        _initHierarchyData : function() {
            var c = this.constructor,
                i,
                l,
                nonAttrsCfg,
                nonAttrs = (this._allowAdHocAttrs) ? {} : null,
                classes = [],
                attrs = [];

            while (c) {
                // Add to classes
                classes[classes.length] = c;

                // Add to attributes
                if (c.ATTRS) {
                    attrs[attrs.length] = c.ATTRS;
                }

                if (this._allowAdHocAttrs) {
                    nonAttrsCfg = c._NON_ATTRS_CFG; 
                    if (nonAttrsCfg) {
                        for (i = 0, l = nonAttrsCfg.length; i < l; i++) {
                            nonAttrs[nonAttrsCfg[i]] = true;
                        }
                    }
                }

                c = c.superclass ? c.superclass.constructor : null;
            }

            this._classes = classes;
            this._nonAttrs = nonAttrs;
            this._attrs = this._aggregateAttrs(attrs);
        },

        /**
         * Utility method to define the attribute hash used to filter/whitelist property mixes for 
         * this class. 
         * 
         * @method _attrCfgHash
         * @private
         */
        _attrCfgHash: function() {
            return BaseCore._ATTR_CFG_HASH;
        },

        /**
         * A helper method, used by _initHierarchyData to aggregate 
         * attribute configuration across the instances class hierarchy.
         *
         * The method will protect the attribute configuration value to protect the statically defined 
         * default value in ATTRS if required (if the value is an object literal, array or the 
         * attribute configuration has cloneDefaultValue set to shallow or deep).
         *
         * @method _aggregateAttrs
         * @private
         * @param {Array} allAttrs An array of ATTRS definitions across classes in the hierarchy 
         * (subclass first, Base last)
         * @return {Object} The aggregate set of ATTRS definitions for the instance
         */
        _aggregateAttrs : function(allAttrs) {
            var attr,
                attrs,
                cfg,
                val,
                path,
                i,
                clone,
                cfgPropsHash = this._attrCfgHash(),
                aggAttr,
                aggAttrs = {};

            if (allAttrs) {
                for (i = allAttrs.length-1; i >= 0; --i) {
                    attrs = allAttrs[i];

                    for (attr in attrs) {
                        if (attrs.hasOwnProperty(attr)) {

                            // Protect config passed in
                            cfg = _wlmix({}, attrs[attr], cfgPropsHash);

                            val = cfg.value;
                            clone = cfg.cloneDefaultValue;

                            if (val) {
                                if ( (clone === undefined && (OBJECT_CONSTRUCTOR === val.constructor || L.isArray(val))) || clone === DEEP || clone === true) {
                                    Y.log('Cloning default value for attribute:' + attr, 'info', 'base');
                                    cfg.value = Y.clone(val);
                                } else if (clone === SHALLOW) {
                                    Y.log('Merging default value for attribute:' + attr, 'info', 'base');
                                    cfg.value = Y.merge(val);
                                }
                                // else if (clone === false), don't clone the static default value. 
                                // It's intended to be used by reference.
                            }

                            path = null;
                            if (attr.indexOf(DOT) !== -1) {
                                path = attr.split(DOT);
                                attr = path.shift();
                            }

                            aggAttr = aggAttrs[attr];
                            if (path && aggAttr && aggAttr.value) {
                                O.setValue(aggAttr.value, path, val);
                            } else if (!path) {
                                if (!aggAttr) {
                                    aggAttrs[attr] = cfg;
                                } else {
                                    if (aggAttr.valueFn && VALUE in cfg) {
                                        aggAttr.valueFn = null;    
                                    }
                                    _wlmix(aggAttr, cfg, cfgPropsHash);
                                }
                            }
                        }
                    }
                }
            }

            return aggAttrs;
        },

        /**
         * Initializes the class hierarchy for the instance, which includes 
         * initializing attributes for each class defined in the class's 
         * static <a href="#property_BaseCore.ATTRS">ATTRS</a> property and 
         * invoking the initializer method on the prototype of each class in the hierarchy.
         *
         * @method _initHierarchy
         * @param {Object} userVals Object with configuration property name/value pairs
         * @private
         */
        _initHierarchy : function(userVals) {
            var lazy = this._lazyAddAttrs,
                constr,
                constrProto,
                ci,
                ei,
                el,
                extProto,
                exts,
                classes = this._getClasses(),
                attrCfgs = this._getAttrCfgs(),
                cl = classes.length - 1;

            for (ci = cl; ci >= 0; ci--) {

                constr = classes[ci];
                constrProto = constr.prototype;
                exts = constr._yuibuild && constr._yuibuild.exts; 

                if (exts) {
                    for (ei = 0, el = exts.length; ei < el; ei++) {
                        exts[ei].apply(this, arguments);
                    }
                }

                this.addAttrs(this._filterAttrCfgs(constr, attrCfgs), userVals, lazy);

                if (this._allowAdHocAttrs && ci === cl) {                
                    this.addAttrs(this._filterAdHocAttrs(attrCfgs, userVals), userVals, lazy);
                }

                // Using INITIALIZER in hasOwnProperty check, for performance reasons (helps IE6 avoid GC thresholds when
                // referencing string literals). Not using it in apply, again, for performance "." is faster. 
                if (constrProto.hasOwnProperty(INITIALIZER)) {
                    constrProto.initializer.apply(this, arguments);
                }

                if (exts) {
                    for (ei = 0; ei < el; ei++) {
                        extProto = exts[ei].prototype;
                        if (extProto.hasOwnProperty(INITIALIZER)) {
                            extProto.initializer.apply(this, arguments);
                        }
                    }
                }
            }
        },

        /**
         * Destroys the class hierarchy for this instance by invoking
         * the destructor method on the prototype of each class in the hierarchy.
         *
         * @method _destroyHierarchy
         * @private
         */
        _destroyHierarchy : function() {
            var constr,
                constrProto,
                ci, cl, ei, el, exts, extProto,
                classes = this._getClasses();

            for (ci = 0, cl = classes.length; ci < cl; ci++) {
                constr = classes[ci];
                constrProto = constr.prototype;
                exts = constr._yuibuild && constr._yuibuild.exts; 

                if (exts) {
                    for (ei = 0, el = exts.length; ei < el; ei++) {
                        extProto = exts[ei].prototype;
                        if (extProto.hasOwnProperty(DESTRUCTOR)) {
                            extProto.destructor.apply(this, arguments);
                        }
                    }
                }

                if (constrProto.hasOwnProperty(DESTRUCTOR)) {
                    constrProto.destructor.apply(this, arguments);
                }
            }
        },

        /**
         * Default toString implementation. Provides the constructor NAME
         * and the instance guid, if set.
         *
         * @method toString
         * @return {String} String representation for this object
         */
        toString: function() {
            return this.name + "[" + Y.stamp(this, true) + "]";
        }
    };

    // Straightup augment, no wrapper functions
    Y.mix(BaseCore, AttributeCore, false, null, 1);

    // Fix constructor
    BaseCore.prototype.constructor = BaseCore;

    Y.BaseCore = BaseCore;


}, '3.7.3', {"requires": ["attribute-core"]});
