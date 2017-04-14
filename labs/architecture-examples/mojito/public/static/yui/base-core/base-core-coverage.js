/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/base-core/base-core.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/base-core/base-core.js",
    code: []
};
_yuitest_coverage["build/base-core/base-core.js"].code=["YUI.add('base-core', function (Y, NAME) {","","    /**","     * The base module provides the Base class, which objects requiring attribute and custom event support can extend. ","     * The module also provides two ways to reuse code - It augments Base with the Plugin.Host interface which provides ","     * plugin support and also provides the BaseCore.build method which provides a way to build custom classes using extensions.","     *","     * @module base","     */","","    /**","     * <p>The base-core module provides the BaseCore class, the lightest version of Base, ","     * which provides Base's basic lifecycle management and ATTRS construction support, ","     * but doesn't fire init/destroy or attribute change events.</p> ","     * ","     * <p>It mixes in AttributeCore, which is the lightest version of Attribute</p>","     *","     * @module base","     * @submodule base-core","     */","    var O = Y.Object,","        L = Y.Lang,","        DOT = \".\",","        INITIALIZED = \"initialized\",","        DESTROYED = \"destroyed\",","        INITIALIZER = \"initializer\",","        VALUE = \"value\",","        OBJECT_CONSTRUCTOR = Object.prototype.constructor,","        DEEP = \"deep\",","        SHALLOW = \"shallow\",","        DESTRUCTOR = \"destructor\",","","        AttributeCore = Y.AttributeCore,","","        _wlmix = function(r, s, wlhash) {","            var p;","            for (p in s) {","                if(wlhash[p]) { ","                    r[p] = s[p];","                }","            }","            return r;","        };","","    /**","     * The BaseCore class, is the lightest version of Base, and provides Base's ","     * basic lifecycle management and ATTRS construction support, but doesn't ","     * fire init/destroy or attribute change events.","     *","     * BaseCore also handles the chaining of initializer and destructor methods across ","     * the hierarchy as part of object construction and destruction. Additionally, attributes ","     * configured through the static <a href=\"#property_BaseCore.ATTRS\">ATTRS</a> ","     * property for each class in the hierarchy will be initialized by BaseCore.","     *","     * Classes which require attribute support, but don't intend to use/expose attribute ","     * change events can extend BaseCore instead of Base for optimal kweight and ","     * runtime performance.","     * ","     * @class BaseCore","     * @constructor","     * @uses AttributeCore","     * @param {Object} cfg Object with configuration property name/value pairs. ","     * The object can be used to provide initial values for the objects published ","     * attributes.","     */","    function BaseCore(cfg) {","        if (!this._BaseInvoked) {","            this._BaseInvoked = true;","","            this._initBase(cfg);","        }","    }","","    /**","     * The list of properties which can be configured for each attribute ","     * (e.g. setter, getter, writeOnce, readOnly etc.)","     *","     * @property _ATTR_CFG","     * @type Array","     * @static","     * @private","     */","    BaseCore._ATTR_CFG = AttributeCore._ATTR_CFG.concat(\"cloneDefaultValue\");","    BaseCore._ATTR_CFG_HASH = Y.Array.hash(BaseCore._ATTR_CFG);","","    /**","     * The array of non-attribute configuration properties supported by this class. ","     * ","     * For example `BaseCore` defines a \"plugins\" configuration property which ","     * should not be set up as an attribute. This property is primarily required so ","     * that when <a href=\"#property__allowAdHocAttrs\">`_allowAdHocAttrs`</a> is enabled by a class, ","     * non-attribute configuration properties don't get added as ad-hoc attributes.  ","     *","     * @property _NON_ATTRS_CFG","     * @type Array","     * @static","     * @private","     */","    BaseCore._NON_ATTRS_CFG = [\"plugins\"];","","    /**","     * This property controls whether or not instances of this class should","     * allow users to add ad-hoc attributes through the constructor configuration ","     * hash.","     *","     * AdHoc attributes are attributes which are not defined by the class, and are ","     * not handled by the MyClass._NON_ATTRS_CFG  ","     * ","     * @property _allowAdHocAttrs","     * @type boolean","     * @default undefined (false)","     * @protected","     */","","    /**","     * The string to be used to identify instances of this class.","     * ","     * Classes extending BaseCore, should define their own","     * static NAME property, which should be camelCase by","     * convention (e.g. MyClass.NAME = \"myClass\";).","     *","     * @property NAME","     * @type String","     * @static","     */","    BaseCore.NAME = \"baseCore\";","","    /**","     * The default set of attributes which will be available for instances of this class, and ","     * their configuration. In addition to the configuration properties listed by ","     * AttributeCore's <a href=\"AttributeCore.html#method_addAttr\">addAttr</a> method, ","     * the attribute can also be configured with a \"cloneDefaultValue\" property, which ","     * defines how the statically defined value field should be protected ","     * (\"shallow\", \"deep\" and false are supported values). ","     *","     * By default if the value is an object literal or an array it will be \"shallow\" ","     * cloned, to protect the default value.","     *","     * @property ATTRS","     * @type Object","     * @static","     */","    BaseCore.ATTRS = {","        /**","         * Flag indicating whether or not this object","         * has been through the init lifecycle phase.","         *","         * @attribute initialized","         * @readonly","         * @default false","         * @type boolean","         */","        initialized: {","            readOnly:true,","            value:false","        },","","        /**","         * Flag indicating whether or not this object","         * has been through the destroy lifecycle phase.","         *","         * @attribute destroyed","         * @readonly","         * @default false","         * @type boolean","         */","        destroyed: {","            readOnly:true,","            value:false","        }","    };","","    BaseCore.prototype = {","","        /**","         * Internal construction logic for BaseCore.","         *","         * @method _initBase","         * @param {Object} config The constructor configuration object","         * @private","         */","        _initBase : function(config) {","","            Y.stamp(this);","","            this._initAttribute(config);","","            // If Plugin.Host has been augmented [ through base-pluginhost ], setup it's","            // initial state, but don't initialize Plugins yet. That's done after initialization.","            var PluginHost = Y.Plugin && Y.Plugin.Host;","            if (this._initPlugins && PluginHost) {","                PluginHost.call(this);","            }","","            if (this._lazyAddAttrs !== false) { this._lazyAddAttrs = true; }","","            /**","             * The string used to identify the class of this object.","             *","             * @deprecated Use this.constructor.NAME","             * @property name","             * @type String","             */","            this.name = this.constructor.NAME;","    ","            this.init.apply(this, arguments);","        },","","        /**","         * Initializes AttributeCore ","         * ","         * @method _initAttribute","         * @private","         */","        _initAttribute: function() {","            AttributeCore.apply(this);","        },","","        /**","         * Init lifecycle method, invoked during construction. Sets up attributes ","         * and invokes initializers for the class hierarchy.","         *","         * @method init","         * @chainable","         * @param {Object} cfg Object with configuration property name/value pairs","         * @return {BaseCore} A reference to this object","         */","        init: function(cfg) {","","            this._baseInit(cfg);","","            return this;","        },","","        /**","         * Internal initialization implementation for BaseCore","         *","         * @method _baseInit","         * @private","         */","        _baseInit: function(cfg) {","            this._initHierarchy(cfg);","","            if (this._initPlugins) {","                // Need to initPlugins manually, to handle constructor parsing, static Plug parsing","                this._initPlugins(cfg);","            }","            this._set(INITIALIZED, true);","        },","","        /**","         * Destroy lifecycle method. Invokes destructors for the class hierarchy.","         *","         * @method destroy","         * @return {BaseCore} A reference to this object","         * @chainable","         */","        destroy: function() {","            this._baseDestroy();","            return this;","        },","","        /**","         * Internal destroy implementation for BaseCore","         *","         * @method _baseDestroy","         * @private","         */","        _baseDestroy : function() {","            if (this._destroyPlugins) {","                this._destroyPlugins();","            }","            this._destroyHierarchy();","            this._set(DESTROYED, true);","        },","","        /**","         * Returns the class hierarchy for this object, with BaseCore being the last class in the array.","         *","         * @method _getClasses","         * @protected","         * @return {Function[]} An array of classes (constructor functions), making up the class hierarchy for this object.","         * This value is cached the first time the method, or _getAttrCfgs, is invoked. Subsequent invocations return the ","         * cached value.","         */","        _getClasses : function() {","            if (!this._classes) {","                this._initHierarchyData();","            }","            return this._classes;","        },","","        /**","         * Returns an aggregated set of attribute configurations, by traversing ","         * the class hierarchy.","         *","         * @method _getAttrCfgs","         * @protected","         * @return {Object} The hash of attribute configurations, aggregated across classes in the hierarchy","         * This value is cached the first time the method, or _getClasses, is invoked. Subsequent invocations return","         * the cached value.","         */","        _getAttrCfgs : function() {","            if (!this._attrs) {","                this._initHierarchyData();","            }","            return this._attrs;","        },","","        /**","         * A helper method used when processing ATTRS across the class hierarchy during ","         * initialization. Returns a disposable object with the attributes defined for ","         * the provided class, extracted from the set of all attributes passed in.","         *","         * @method _filterAttrCfs","         * @private","         *","         * @param {Function} clazz The class for which the desired attributes are required.","         * @param {Object} allCfgs The set of all attribute configurations for this instance. ","         * Attributes will be removed from this set, if they belong to the filtered class, so","         * that by the time all classes are processed, allCfgs will be empty.","         * ","         * @return {Object} The set of attributes belonging to the class passed in, in the form","         * of an object with attribute name/configuration pairs.","         */","        _filterAttrCfgs : function(clazz, allCfgs) {","            var cfgs = null, attr, attrs = clazz.ATTRS;","","            if (attrs) {","                for (attr in attrs) {","                    if (allCfgs[attr]) {","                        cfgs = cfgs || {};","                        cfgs[attr] = allCfgs[attr];","                        allCfgs[attr] = null;","                    }","                }","            }","","            return cfgs;","        },","","        /**","         * @method _filterAdHocAttrs","         * @private","         *","         * @param {Object} allAttrs The set of all attribute configurations for this instance. ","         * Attributes will be removed from this set, if they belong to the filtered class, so","         * that by the time all classes are processed, allCfgs will be empty.","         * @param {Object} userVals The config object passed in by the user, from which adhoc attrs are to be filtered.","         * @return {Object} The set of adhoc attributes passed in, in the form","         * of an object with attribute name/configuration pairs.","         */","        _filterAdHocAttrs : function(allAttrs, userVals) {","            var adHocs,","                nonAttrs = this._nonAttrs,","                attr;","","            if (userVals) {","                adHocs = {};","                for (attr in userVals) {","                    if (!allAttrs[attr] && !nonAttrs[attr] && userVals.hasOwnProperty(attr)) {","                        adHocs[attr] = {","                            value:userVals[attr]","                        };","                    }","                }","            }","","            return adHocs;","        },","","        /**","         * A helper method used by _getClasses and _getAttrCfgs, which determines both","         * the array of classes and aggregate set of attribute configurations","         * across the class hierarchy for the instance.","         *","         * @method _initHierarchyData","         * @private","         */","        _initHierarchyData : function() {","            var c = this.constructor,","                i,","                l,","                nonAttrsCfg,","                nonAttrs = (this._allowAdHocAttrs) ? {} : null,","                classes = [],","                attrs = [];","","            while (c) {","                // Add to classes","                classes[classes.length] = c;","","                // Add to attributes","                if (c.ATTRS) {","                    attrs[attrs.length] = c.ATTRS;","                }","","                if (this._allowAdHocAttrs) {","                    nonAttrsCfg = c._NON_ATTRS_CFG; ","                    if (nonAttrsCfg) {","                        for (i = 0, l = nonAttrsCfg.length; i < l; i++) {","                            nonAttrs[nonAttrsCfg[i]] = true;","                        }","                    }","                }","","                c = c.superclass ? c.superclass.constructor : null;","            }","","            this._classes = classes;","            this._nonAttrs = nonAttrs;","            this._attrs = this._aggregateAttrs(attrs);","        },","","        /**","         * Utility method to define the attribute hash used to filter/whitelist property mixes for ","         * this class. ","         * ","         * @method _attrCfgHash","         * @private","         */","        _attrCfgHash: function() {","            return BaseCore._ATTR_CFG_HASH;","        },","","        /**","         * A helper method, used by _initHierarchyData to aggregate ","         * attribute configuration across the instances class hierarchy.","         *","         * The method will protect the attribute configuration value to protect the statically defined ","         * default value in ATTRS if required (if the value is an object literal, array or the ","         * attribute configuration has cloneDefaultValue set to shallow or deep).","         *","         * @method _aggregateAttrs","         * @private","         * @param {Array} allAttrs An array of ATTRS definitions across classes in the hierarchy ","         * (subclass first, Base last)","         * @return {Object} The aggregate set of ATTRS definitions for the instance","         */","        _aggregateAttrs : function(allAttrs) {","            var attr,","                attrs,","                cfg,","                val,","                path,","                i,","                clone,","                cfgPropsHash = this._attrCfgHash(),","                aggAttr,","                aggAttrs = {};","","            if (allAttrs) {","                for (i = allAttrs.length-1; i >= 0; --i) {","                    attrs = allAttrs[i];","","                    for (attr in attrs) {","                        if (attrs.hasOwnProperty(attr)) {","","                            // Protect config passed in","                            cfg = _wlmix({}, attrs[attr], cfgPropsHash);","","                            val = cfg.value;","                            clone = cfg.cloneDefaultValue;","","                            if (val) {","                                if ( (clone === undefined && (OBJECT_CONSTRUCTOR === val.constructor || L.isArray(val))) || clone === DEEP || clone === true) {","                                    cfg.value = Y.clone(val);","                                } else if (clone === SHALLOW) {","                                    cfg.value = Y.merge(val);","                                }","                                // else if (clone === false), don't clone the static default value. ","                                // It's intended to be used by reference.","                            }","","                            path = null;","                            if (attr.indexOf(DOT) !== -1) {","                                path = attr.split(DOT);","                                attr = path.shift();","                            }","","                            aggAttr = aggAttrs[attr];","                            if (path && aggAttr && aggAttr.value) {","                                O.setValue(aggAttr.value, path, val);","                            } else if (!path) {","                                if (!aggAttr) {","                                    aggAttrs[attr] = cfg;","                                } else {","                                    if (aggAttr.valueFn && VALUE in cfg) {","                                        aggAttr.valueFn = null;    ","                                    }","                                    _wlmix(aggAttr, cfg, cfgPropsHash);","                                }","                            }","                        }","                    }","                }","            }","","            return aggAttrs;","        },","","        /**","         * Initializes the class hierarchy for the instance, which includes ","         * initializing attributes for each class defined in the class's ","         * static <a href=\"#property_BaseCore.ATTRS\">ATTRS</a> property and ","         * invoking the initializer method on the prototype of each class in the hierarchy.","         *","         * @method _initHierarchy","         * @param {Object} userVals Object with configuration property name/value pairs","         * @private","         */","        _initHierarchy : function(userVals) {","            var lazy = this._lazyAddAttrs,","                constr,","                constrProto,","                ci,","                ei,","                el,","                extProto,","                exts,","                classes = this._getClasses(),","                attrCfgs = this._getAttrCfgs(),","                cl = classes.length - 1;","","            for (ci = cl; ci >= 0; ci--) {","","                constr = classes[ci];","                constrProto = constr.prototype;","                exts = constr._yuibuild && constr._yuibuild.exts; ","","                if (exts) {","                    for (ei = 0, el = exts.length; ei < el; ei++) {","                        exts[ei].apply(this, arguments);","                    }","                }","","                this.addAttrs(this._filterAttrCfgs(constr, attrCfgs), userVals, lazy);","","                if (this._allowAdHocAttrs && ci === cl) {                ","                    this.addAttrs(this._filterAdHocAttrs(attrCfgs, userVals), userVals, lazy);","                }","","                // Using INITIALIZER in hasOwnProperty check, for performance reasons (helps IE6 avoid GC thresholds when","                // referencing string literals). Not using it in apply, again, for performance \".\" is faster. ","                if (constrProto.hasOwnProperty(INITIALIZER)) {","                    constrProto.initializer.apply(this, arguments);","                }","","                if (exts) {","                    for (ei = 0; ei < el; ei++) {","                        extProto = exts[ei].prototype;","                        if (extProto.hasOwnProperty(INITIALIZER)) {","                            extProto.initializer.apply(this, arguments);","                        }","                    }","                }","            }","        },","","        /**","         * Destroys the class hierarchy for this instance by invoking","         * the destructor method on the prototype of each class in the hierarchy.","         *","         * @method _destroyHierarchy","         * @private","         */","        _destroyHierarchy : function() {","            var constr,","                constrProto,","                ci, cl, ei, el, exts, extProto,","                classes = this._getClasses();","","            for (ci = 0, cl = classes.length; ci < cl; ci++) {","                constr = classes[ci];","                constrProto = constr.prototype;","                exts = constr._yuibuild && constr._yuibuild.exts; ","","                if (exts) {","                    for (ei = 0, el = exts.length; ei < el; ei++) {","                        extProto = exts[ei].prototype;","                        if (extProto.hasOwnProperty(DESTRUCTOR)) {","                            extProto.destructor.apply(this, arguments);","                        }","                    }","                }","","                if (constrProto.hasOwnProperty(DESTRUCTOR)) {","                    constrProto.destructor.apply(this, arguments);","                }","            }","        },","","        /**","         * Default toString implementation. Provides the constructor NAME","         * and the instance guid, if set.","         *","         * @method toString","         * @return {String} String representation for this object","         */","        toString: function() {","            return this.name + \"[\" + Y.stamp(this, true) + \"]\";","        }","    };","","    // Straightup augment, no wrapper functions","    Y.mix(BaseCore, AttributeCore, false, null, 1);","","    // Fix constructor","    BaseCore.prototype.constructor = BaseCore;","","    Y.BaseCore = BaseCore;","","","}, '3.7.3', {\"requires\": [\"attribute-core\"]});"];
_yuitest_coverage["build/base-core/base-core.js"].lines = {"1":0,"21":0,"36":0,"37":0,"38":0,"39":0,"42":0,"66":0,"67":0,"68":0,"70":0,"83":0,"84":0,"99":0,"126":0,"143":0,"173":0,"184":0,"186":0,"190":0,"191":0,"192":0,"195":0,"204":0,"206":0,"216":0,"230":0,"232":0,"242":0,"244":0,"246":0,"248":0,"259":0,"260":0,"270":0,"271":0,"273":0,"274":0,"287":0,"288":0,"290":0,"304":0,"305":0,"307":0,"327":0,"329":0,"330":0,"331":0,"332":0,"333":0,"334":0,"339":0,"354":0,"358":0,"359":0,"360":0,"361":0,"362":0,"369":0,"381":0,"389":0,"391":0,"394":0,"395":0,"398":0,"399":0,"400":0,"401":0,"402":0,"407":0,"410":0,"411":0,"412":0,"423":0,"441":0,"452":0,"453":0,"454":0,"456":0,"457":0,"460":0,"462":0,"463":0,"465":0,"466":0,"467":0,"468":0,"469":0,"475":0,"476":0,"477":0,"478":0,"481":0,"482":0,"483":0,"484":0,"485":0,"486":0,"488":0,"489":0,"491":0,"499":0,"513":0,"525":0,"527":0,"528":0,"529":0,"531":0,"532":0,"533":0,"537":0,"539":0,"540":0,"545":0,"546":0,"549":0,"550":0,"551":0,"552":0,"553":0,"568":0,"573":0,"574":0,"575":0,"576":0,"578":0,"579":0,"580":0,"581":0,"582":0,"587":0,"588":0,"601":0,"606":0,"609":0,"611":0};
_yuitest_coverage["build/base-core/base-core.js"].functions = {"_wlmix:35":0,"BaseCore:66":0,"_initBase:182":0,"_initAttribute:215":0,"init:228":0,"_baseInit:241":0,"destroy:258":0,"_baseDestroy:269":0,"_getClasses:286":0,"_getAttrCfgs:303":0,"_filterAttrCfgs:326":0,"_filterAdHocAttrs:353":0,"_initHierarchyData:380":0,"_attrCfgHash:422":0,"_aggregateAttrs:440":0,"_initHierarchy:512":0,"_destroyHierarchy:567":0,"toString:600":0,"(anonymous 1):1":0};
_yuitest_coverage["build/base-core/base-core.js"].coveredLines = 136;
_yuitest_coverage["build/base-core/base-core.js"].coveredFunctions = 19;
_yuitest_coverline("build/base-core/base-core.js", 1);
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
    _yuitest_coverfunc("build/base-core/base-core.js", "(anonymous 1)", 1);
_yuitest_coverline("build/base-core/base-core.js", 21);
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
            _yuitest_coverfunc("build/base-core/base-core.js", "_wlmix", 35);
_yuitest_coverline("build/base-core/base-core.js", 36);
var p;
            _yuitest_coverline("build/base-core/base-core.js", 37);
for (p in s) {
                _yuitest_coverline("build/base-core/base-core.js", 38);
if(wlhash[p]) { 
                    _yuitest_coverline("build/base-core/base-core.js", 39);
r[p] = s[p];
                }
            }
            _yuitest_coverline("build/base-core/base-core.js", 42);
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
    _yuitest_coverline("build/base-core/base-core.js", 66);
function BaseCore(cfg) {
        _yuitest_coverfunc("build/base-core/base-core.js", "BaseCore", 66);
_yuitest_coverline("build/base-core/base-core.js", 67);
if (!this._BaseInvoked) {
            _yuitest_coverline("build/base-core/base-core.js", 68);
this._BaseInvoked = true;

            _yuitest_coverline("build/base-core/base-core.js", 70);
this._initBase(cfg);
        }
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
    _yuitest_coverline("build/base-core/base-core.js", 83);
BaseCore._ATTR_CFG = AttributeCore._ATTR_CFG.concat("cloneDefaultValue");
    _yuitest_coverline("build/base-core/base-core.js", 84);
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
    _yuitest_coverline("build/base-core/base-core.js", 99);
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
    _yuitest_coverline("build/base-core/base-core.js", 126);
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
    _yuitest_coverline("build/base-core/base-core.js", 143);
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

    _yuitest_coverline("build/base-core/base-core.js", 173);
BaseCore.prototype = {

        /**
         * Internal construction logic for BaseCore.
         *
         * @method _initBase
         * @param {Object} config The constructor configuration object
         * @private
         */
        _initBase : function(config) {

            _yuitest_coverfunc("build/base-core/base-core.js", "_initBase", 182);
_yuitest_coverline("build/base-core/base-core.js", 184);
Y.stamp(this);

            _yuitest_coverline("build/base-core/base-core.js", 186);
this._initAttribute(config);

            // If Plugin.Host has been augmented [ through base-pluginhost ], setup it's
            // initial state, but don't initialize Plugins yet. That's done after initialization.
            _yuitest_coverline("build/base-core/base-core.js", 190);
var PluginHost = Y.Plugin && Y.Plugin.Host;
            _yuitest_coverline("build/base-core/base-core.js", 191);
if (this._initPlugins && PluginHost) {
                _yuitest_coverline("build/base-core/base-core.js", 192);
PluginHost.call(this);
            }

            _yuitest_coverline("build/base-core/base-core.js", 195);
if (this._lazyAddAttrs !== false) { this._lazyAddAttrs = true; }

            /**
             * The string used to identify the class of this object.
             *
             * @deprecated Use this.constructor.NAME
             * @property name
             * @type String
             */
            _yuitest_coverline("build/base-core/base-core.js", 204);
this.name = this.constructor.NAME;
    
            _yuitest_coverline("build/base-core/base-core.js", 206);
this.init.apply(this, arguments);
        },

        /**
         * Initializes AttributeCore 
         * 
         * @method _initAttribute
         * @private
         */
        _initAttribute: function() {
            _yuitest_coverfunc("build/base-core/base-core.js", "_initAttribute", 215);
_yuitest_coverline("build/base-core/base-core.js", 216);
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

            _yuitest_coverfunc("build/base-core/base-core.js", "init", 228);
_yuitest_coverline("build/base-core/base-core.js", 230);
this._baseInit(cfg);

            _yuitest_coverline("build/base-core/base-core.js", 232);
return this;
        },

        /**
         * Internal initialization implementation for BaseCore
         *
         * @method _baseInit
         * @private
         */
        _baseInit: function(cfg) {
            _yuitest_coverfunc("build/base-core/base-core.js", "_baseInit", 241);
_yuitest_coverline("build/base-core/base-core.js", 242);
this._initHierarchy(cfg);

            _yuitest_coverline("build/base-core/base-core.js", 244);
if (this._initPlugins) {
                // Need to initPlugins manually, to handle constructor parsing, static Plug parsing
                _yuitest_coverline("build/base-core/base-core.js", 246);
this._initPlugins(cfg);
            }
            _yuitest_coverline("build/base-core/base-core.js", 248);
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
            _yuitest_coverfunc("build/base-core/base-core.js", "destroy", 258);
_yuitest_coverline("build/base-core/base-core.js", 259);
this._baseDestroy();
            _yuitest_coverline("build/base-core/base-core.js", 260);
return this;
        },

        /**
         * Internal destroy implementation for BaseCore
         *
         * @method _baseDestroy
         * @private
         */
        _baseDestroy : function() {
            _yuitest_coverfunc("build/base-core/base-core.js", "_baseDestroy", 269);
_yuitest_coverline("build/base-core/base-core.js", 270);
if (this._destroyPlugins) {
                _yuitest_coverline("build/base-core/base-core.js", 271);
this._destroyPlugins();
            }
            _yuitest_coverline("build/base-core/base-core.js", 273);
this._destroyHierarchy();
            _yuitest_coverline("build/base-core/base-core.js", 274);
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
            _yuitest_coverfunc("build/base-core/base-core.js", "_getClasses", 286);
_yuitest_coverline("build/base-core/base-core.js", 287);
if (!this._classes) {
                _yuitest_coverline("build/base-core/base-core.js", 288);
this._initHierarchyData();
            }
            _yuitest_coverline("build/base-core/base-core.js", 290);
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
            _yuitest_coverfunc("build/base-core/base-core.js", "_getAttrCfgs", 303);
_yuitest_coverline("build/base-core/base-core.js", 304);
if (!this._attrs) {
                _yuitest_coverline("build/base-core/base-core.js", 305);
this._initHierarchyData();
            }
            _yuitest_coverline("build/base-core/base-core.js", 307);
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
            _yuitest_coverfunc("build/base-core/base-core.js", "_filterAttrCfgs", 326);
_yuitest_coverline("build/base-core/base-core.js", 327);
var cfgs = null, attr, attrs = clazz.ATTRS;

            _yuitest_coverline("build/base-core/base-core.js", 329);
if (attrs) {
                _yuitest_coverline("build/base-core/base-core.js", 330);
for (attr in attrs) {
                    _yuitest_coverline("build/base-core/base-core.js", 331);
if (allCfgs[attr]) {
                        _yuitest_coverline("build/base-core/base-core.js", 332);
cfgs = cfgs || {};
                        _yuitest_coverline("build/base-core/base-core.js", 333);
cfgs[attr] = allCfgs[attr];
                        _yuitest_coverline("build/base-core/base-core.js", 334);
allCfgs[attr] = null;
                    }
                }
            }

            _yuitest_coverline("build/base-core/base-core.js", 339);
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
            _yuitest_coverfunc("build/base-core/base-core.js", "_filterAdHocAttrs", 353);
_yuitest_coverline("build/base-core/base-core.js", 354);
var adHocs,
                nonAttrs = this._nonAttrs,
                attr;

            _yuitest_coverline("build/base-core/base-core.js", 358);
if (userVals) {
                _yuitest_coverline("build/base-core/base-core.js", 359);
adHocs = {};
                _yuitest_coverline("build/base-core/base-core.js", 360);
for (attr in userVals) {
                    _yuitest_coverline("build/base-core/base-core.js", 361);
if (!allAttrs[attr] && !nonAttrs[attr] && userVals.hasOwnProperty(attr)) {
                        _yuitest_coverline("build/base-core/base-core.js", 362);
adHocs[attr] = {
                            value:userVals[attr]
                        };
                    }
                }
            }

            _yuitest_coverline("build/base-core/base-core.js", 369);
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
            _yuitest_coverfunc("build/base-core/base-core.js", "_initHierarchyData", 380);
_yuitest_coverline("build/base-core/base-core.js", 381);
var c = this.constructor,
                i,
                l,
                nonAttrsCfg,
                nonAttrs = (this._allowAdHocAttrs) ? {} : null,
                classes = [],
                attrs = [];

            _yuitest_coverline("build/base-core/base-core.js", 389);
while (c) {
                // Add to classes
                _yuitest_coverline("build/base-core/base-core.js", 391);
classes[classes.length] = c;

                // Add to attributes
                _yuitest_coverline("build/base-core/base-core.js", 394);
if (c.ATTRS) {
                    _yuitest_coverline("build/base-core/base-core.js", 395);
attrs[attrs.length] = c.ATTRS;
                }

                _yuitest_coverline("build/base-core/base-core.js", 398);
if (this._allowAdHocAttrs) {
                    _yuitest_coverline("build/base-core/base-core.js", 399);
nonAttrsCfg = c._NON_ATTRS_CFG; 
                    _yuitest_coverline("build/base-core/base-core.js", 400);
if (nonAttrsCfg) {
                        _yuitest_coverline("build/base-core/base-core.js", 401);
for (i = 0, l = nonAttrsCfg.length; i < l; i++) {
                            _yuitest_coverline("build/base-core/base-core.js", 402);
nonAttrs[nonAttrsCfg[i]] = true;
                        }
                    }
                }

                _yuitest_coverline("build/base-core/base-core.js", 407);
c = c.superclass ? c.superclass.constructor : null;
            }

            _yuitest_coverline("build/base-core/base-core.js", 410);
this._classes = classes;
            _yuitest_coverline("build/base-core/base-core.js", 411);
this._nonAttrs = nonAttrs;
            _yuitest_coverline("build/base-core/base-core.js", 412);
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
            _yuitest_coverfunc("build/base-core/base-core.js", "_attrCfgHash", 422);
_yuitest_coverline("build/base-core/base-core.js", 423);
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
            _yuitest_coverfunc("build/base-core/base-core.js", "_aggregateAttrs", 440);
_yuitest_coverline("build/base-core/base-core.js", 441);
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

            _yuitest_coverline("build/base-core/base-core.js", 452);
if (allAttrs) {
                _yuitest_coverline("build/base-core/base-core.js", 453);
for (i = allAttrs.length-1; i >= 0; --i) {
                    _yuitest_coverline("build/base-core/base-core.js", 454);
attrs = allAttrs[i];

                    _yuitest_coverline("build/base-core/base-core.js", 456);
for (attr in attrs) {
                        _yuitest_coverline("build/base-core/base-core.js", 457);
if (attrs.hasOwnProperty(attr)) {

                            // Protect config passed in
                            _yuitest_coverline("build/base-core/base-core.js", 460);
cfg = _wlmix({}, attrs[attr], cfgPropsHash);

                            _yuitest_coverline("build/base-core/base-core.js", 462);
val = cfg.value;
                            _yuitest_coverline("build/base-core/base-core.js", 463);
clone = cfg.cloneDefaultValue;

                            _yuitest_coverline("build/base-core/base-core.js", 465);
if (val) {
                                _yuitest_coverline("build/base-core/base-core.js", 466);
if ( (clone === undefined && (OBJECT_CONSTRUCTOR === val.constructor || L.isArray(val))) || clone === DEEP || clone === true) {
                                    _yuitest_coverline("build/base-core/base-core.js", 467);
cfg.value = Y.clone(val);
                                } else {_yuitest_coverline("build/base-core/base-core.js", 468);
if (clone === SHALLOW) {
                                    _yuitest_coverline("build/base-core/base-core.js", 469);
cfg.value = Y.merge(val);
                                }}
                                // else if (clone === false), don't clone the static default value. 
                                // It's intended to be used by reference.
                            }

                            _yuitest_coverline("build/base-core/base-core.js", 475);
path = null;
                            _yuitest_coverline("build/base-core/base-core.js", 476);
if (attr.indexOf(DOT) !== -1) {
                                _yuitest_coverline("build/base-core/base-core.js", 477);
path = attr.split(DOT);
                                _yuitest_coverline("build/base-core/base-core.js", 478);
attr = path.shift();
                            }

                            _yuitest_coverline("build/base-core/base-core.js", 481);
aggAttr = aggAttrs[attr];
                            _yuitest_coverline("build/base-core/base-core.js", 482);
if (path && aggAttr && aggAttr.value) {
                                _yuitest_coverline("build/base-core/base-core.js", 483);
O.setValue(aggAttr.value, path, val);
                            } else {_yuitest_coverline("build/base-core/base-core.js", 484);
if (!path) {
                                _yuitest_coverline("build/base-core/base-core.js", 485);
if (!aggAttr) {
                                    _yuitest_coverline("build/base-core/base-core.js", 486);
aggAttrs[attr] = cfg;
                                } else {
                                    _yuitest_coverline("build/base-core/base-core.js", 488);
if (aggAttr.valueFn && VALUE in cfg) {
                                        _yuitest_coverline("build/base-core/base-core.js", 489);
aggAttr.valueFn = null;    
                                    }
                                    _yuitest_coverline("build/base-core/base-core.js", 491);
_wlmix(aggAttr, cfg, cfgPropsHash);
                                }
                            }}
                        }
                    }
                }
            }

            _yuitest_coverline("build/base-core/base-core.js", 499);
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
            _yuitest_coverfunc("build/base-core/base-core.js", "_initHierarchy", 512);
_yuitest_coverline("build/base-core/base-core.js", 513);
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

            _yuitest_coverline("build/base-core/base-core.js", 525);
for (ci = cl; ci >= 0; ci--) {

                _yuitest_coverline("build/base-core/base-core.js", 527);
constr = classes[ci];
                _yuitest_coverline("build/base-core/base-core.js", 528);
constrProto = constr.prototype;
                _yuitest_coverline("build/base-core/base-core.js", 529);
exts = constr._yuibuild && constr._yuibuild.exts; 

                _yuitest_coverline("build/base-core/base-core.js", 531);
if (exts) {
                    _yuitest_coverline("build/base-core/base-core.js", 532);
for (ei = 0, el = exts.length; ei < el; ei++) {
                        _yuitest_coverline("build/base-core/base-core.js", 533);
exts[ei].apply(this, arguments);
                    }
                }

                _yuitest_coverline("build/base-core/base-core.js", 537);
this.addAttrs(this._filterAttrCfgs(constr, attrCfgs), userVals, lazy);

                _yuitest_coverline("build/base-core/base-core.js", 539);
if (this._allowAdHocAttrs && ci === cl) {                
                    _yuitest_coverline("build/base-core/base-core.js", 540);
this.addAttrs(this._filterAdHocAttrs(attrCfgs, userVals), userVals, lazy);
                }

                // Using INITIALIZER in hasOwnProperty check, for performance reasons (helps IE6 avoid GC thresholds when
                // referencing string literals). Not using it in apply, again, for performance "." is faster. 
                _yuitest_coverline("build/base-core/base-core.js", 545);
if (constrProto.hasOwnProperty(INITIALIZER)) {
                    _yuitest_coverline("build/base-core/base-core.js", 546);
constrProto.initializer.apply(this, arguments);
                }

                _yuitest_coverline("build/base-core/base-core.js", 549);
if (exts) {
                    _yuitest_coverline("build/base-core/base-core.js", 550);
for (ei = 0; ei < el; ei++) {
                        _yuitest_coverline("build/base-core/base-core.js", 551);
extProto = exts[ei].prototype;
                        _yuitest_coverline("build/base-core/base-core.js", 552);
if (extProto.hasOwnProperty(INITIALIZER)) {
                            _yuitest_coverline("build/base-core/base-core.js", 553);
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
            _yuitest_coverfunc("build/base-core/base-core.js", "_destroyHierarchy", 567);
_yuitest_coverline("build/base-core/base-core.js", 568);
var constr,
                constrProto,
                ci, cl, ei, el, exts, extProto,
                classes = this._getClasses();

            _yuitest_coverline("build/base-core/base-core.js", 573);
for (ci = 0, cl = classes.length; ci < cl; ci++) {
                _yuitest_coverline("build/base-core/base-core.js", 574);
constr = classes[ci];
                _yuitest_coverline("build/base-core/base-core.js", 575);
constrProto = constr.prototype;
                _yuitest_coverline("build/base-core/base-core.js", 576);
exts = constr._yuibuild && constr._yuibuild.exts; 

                _yuitest_coverline("build/base-core/base-core.js", 578);
if (exts) {
                    _yuitest_coverline("build/base-core/base-core.js", 579);
for (ei = 0, el = exts.length; ei < el; ei++) {
                        _yuitest_coverline("build/base-core/base-core.js", 580);
extProto = exts[ei].prototype;
                        _yuitest_coverline("build/base-core/base-core.js", 581);
if (extProto.hasOwnProperty(DESTRUCTOR)) {
                            _yuitest_coverline("build/base-core/base-core.js", 582);
extProto.destructor.apply(this, arguments);
                        }
                    }
                }

                _yuitest_coverline("build/base-core/base-core.js", 587);
if (constrProto.hasOwnProperty(DESTRUCTOR)) {
                    _yuitest_coverline("build/base-core/base-core.js", 588);
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
            _yuitest_coverfunc("build/base-core/base-core.js", "toString", 600);
_yuitest_coverline("build/base-core/base-core.js", 601);
return this.name + "[" + Y.stamp(this, true) + "]";
        }
    };

    // Straightup augment, no wrapper functions
    _yuitest_coverline("build/base-core/base-core.js", 606);
Y.mix(BaseCore, AttributeCore, false, null, 1);

    // Fix constructor
    _yuitest_coverline("build/base-core/base-core.js", 609);
BaseCore.prototype.constructor = BaseCore;

    _yuitest_coverline("build/base-core/base-core.js", 611);
Y.BaseCore = BaseCore;


}, '3.7.3', {"requires": ["attribute-core"]});
