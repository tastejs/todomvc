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
_yuitest_coverage["build/attribute-core/attribute-core.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/attribute-core/attribute-core.js",
    code: []
};
_yuitest_coverage["build/attribute-core/attribute-core.js"].code=["YUI.add('attribute-core', function (Y, NAME) {","","    /**","     * The State class maintains state for a collection of named items, with","     * a varying number of properties defined.","     *","     * It avoids the need to create a separate class for the item, and separate instances","     * of these classes for each item, by storing the state in a 2 level hash table,","     * improving performance when the number of items is likely to be large.","     *","     * @constructor","     * @class State","     */","    Y.State = function() {","        /**","         * Hash of attributes","         * @property data","         */","        this.data = {};","    };","","    Y.State.prototype = {","","        /**","         * Adds a property to an item.","         *","         * @method add","         * @param name {String} The name of the item.","         * @param key {String} The name of the property.","         * @param val {Any} The value of the property.","         */","        add: function(name, key, val) {","            var item = this.data[name];","","            if (!item) {","                item = this.data[name] = {};","            }","","            item[key] = val;","        },","","        /**","         * Adds multiple properties to an item.","         *","         * @method addAll","         * @param name {String} The name of the item.","         * @param obj {Object} A hash of property/value pairs.","         */","        addAll: function(name, obj) {","            var item = this.data[name],","                key;","","            if (!item) {","                item = this.data[name] = {};","            }","","            for (key in obj) {","                if (obj.hasOwnProperty(key)) {","                    item[key] = obj[key];","                }","            }","        },","","        /**","         * Removes a property from an item.","         *","         * @method remove","         * @param name {String} The name of the item.","         * @param key {String} The property to remove.","         */","        remove: function(name, key) {","            var item = this.data[name];","","            if (item) {","                delete item[key];","            }","        },","","        /**","         * Removes multiple properties from an item, or removes the item completely.","         *","         * @method removeAll","         * @param name {String} The name of the item.","         * @param obj {Object|Array} Collection of properties to delete. If not provided, the entire item is removed.","         */","        removeAll: function(name, obj) {","            var data;","","            if (!obj) {","                data = this.data;","","                if (name in data) {","                    delete data[name];","                }","            } else {","                Y.each(obj, function(value, key) {","                    this.remove(name, typeof key === 'string' ? key : value);","                }, this);","            }","        },","","        /**","         * For a given item, returns the value of the property requested, or undefined if not found.","         *","         * @method get","         * @param name {String} The name of the item","         * @param key {String} Optional. The property value to retrieve.","         * @return {Any} The value of the supplied property.","         */","        get: function(name, key) {","            var item = this.data[name];","","            if (item) {","                return item[key];","            }","        },","","        /**","         * For the given item, returns an object with all of the","         * item's property/value pairs. By default the object returned","         * is a shallow copy of the stored data, but passing in true","         * as the second parameter will return a reference to the stored","         * data.","         *","         * @method getAll","         * @param name {String} The name of the item","         * @param reference {boolean} true, if you want a reference to the stored","         * object","         * @return {Object} An object with property/value pairs for the item.","         */","        getAll : function(name, reference) {","            var item = this.data[name],","                key, obj;","","            if (reference) {","                obj = item;","            } else if (item) {","                obj = {};","","                for (key in item) {","                    if (item.hasOwnProperty(key)) {","                        obj[key] = item[key];","                    }","                }","            }","","            return obj;","        }","    };","    /**","     * The attribute module provides an augmentable Attribute implementation, which ","     * adds configurable attributes and attribute change events to the class being ","     * augmented. It also provides a State class, which is used internally by Attribute,","     * but can also be used independently to provide a name/property/value data structure to","     * store state.","     *","     * @module attribute","     */","","    /**","     * The attribute-core submodule provides the lightest level of attribute handling support ","     * without Attribute change events, or lesser used methods such as reset(), modifyAttrs(),","     * and removeAttr().","     *","     * @module attribute","     * @submodule attribute-core","     */","    var O = Y.Object,","        Lang = Y.Lang,","","        DOT = \".\",","","        // Externally configurable props","        GETTER = \"getter\",","        SETTER = \"setter\",","        READ_ONLY = \"readOnly\",","        WRITE_ONCE = \"writeOnce\",","        INIT_ONLY = \"initOnly\",","        VALIDATOR = \"validator\",","        VALUE = \"value\",","        VALUE_FN = \"valueFn\",","        LAZY_ADD = \"lazyAdd\",","","        // Used for internal state management","        ADDED = \"added\",","        BYPASS_PROXY = \"_bypassProxy\",","        INITIALIZING = \"initializing\",","        INIT_VALUE = \"initValue\",","        LAZY = \"lazy\",","        IS_LAZY_ADD = \"isLazyAdd\",","","        INVALID_VALUE;","","    /**","     * <p>","     * AttributeCore provides the lightest level of configurable attribute support. It is designed to be ","     * augmented on to a host class, and provides the host with the ability to configure ","     * attributes to store and retrieve state, <strong>but without support for attribute change events</strong>.","     * </p>","     * <p>For example, attributes added to the host can be configured:</p>","     * <ul>","     *     <li>As read only.</li>","     *     <li>As write once.</li>","     *     <li>With a setter function, which can be used to manipulate","     *     values passed to Attribute's <a href=\"#method_set\">set</a> method, before they are stored.</li>","     *     <li>With a getter function, which can be used to manipulate stored values,","     *     before they are returned by Attribute's <a href=\"#method_get\">get</a> method.</li>","     *     <li>With a validator function, to validate values before they are stored.</li>","     * </ul>","     *","     * <p>See the <a href=\"#method_addAttr\">addAttr</a> method, for the complete set of configuration","     * options available for attributes.</p>","     * ","     * <p>Object/Classes based on AttributeCore can augment <a href=\"AttributeEvents.html\">AttributeEvents</a> ","     * (with true for overwrite) and <a href=\"AttributeExtras.html\">AttributeExtras</a> to add attribute event and ","     * additional, less commonly used attribute methods, such as `modifyAttr`, `removeAttr` and `reset`.</p>   ","     *","     * @class AttributeCore","     * @param attrs {Object} The attributes to add during construction (passed through to <a href=\"#method_addAttrs\">addAttrs</a>). These can also be defined on the constructor being augmented with Attribute by defining the ATTRS property on the constructor.","     * @param values {Object} The initial attribute values to apply (passed through to <a href=\"#method_addAttrs\">addAttrs</a>). These are not merged/cloned. The caller is responsible for isolating user provided values if required.","     * @param lazy {boolean} Whether or not to add attributes lazily (passed through to <a href=\"#method_addAttrs\">addAttrs</a>).","     */","    function AttributeCore(attrs, values, lazy) {","        this._initAttrHost(attrs, values, lazy);            ","    }","","    /**","     * <p>The value to return from an attribute setter in order to prevent the set from going through.</p>","     *","     * <p>You can return this value from your setter if you wish to combine validator and setter ","     * functionality into a single setter function, which either returns the massaged value to be stored or ","     * AttributeCore.INVALID_VALUE to prevent invalid values from being stored.</p>","     *","     * @property INVALID_VALUE","     * @type Object","     * @static","     * @final","     */","    AttributeCore.INVALID_VALUE = {};","    INVALID_VALUE = AttributeCore.INVALID_VALUE;","","    /**","     * The list of properties which can be configured for ","     * each attribute (e.g. setter, getter, writeOnce etc.).","     *","     * This property is used internally as a whitelist for faster","     * Y.mix operations.","     *","     * @property _ATTR_CFG","     * @type Array","     * @static","     * @protected","     */","    AttributeCore._ATTR_CFG = [SETTER, GETTER, VALIDATOR, VALUE, VALUE_FN, WRITE_ONCE, READ_ONLY, LAZY_ADD, BYPASS_PROXY];","","    AttributeCore.prototype = {","","        /**","         * Constructor logic for attributes. Initializes the host state, and sets up the inital attributes passed to the ","         * constructor.","         *","         * @method _initAttrHost","         * @param attrs {Object} The attributes to add during construction (passed through to <a href=\"#method_addAttrs\">addAttrs</a>). These can also be defined on the constructor being augmented with Attribute by defining the ATTRS property on the constructor.","         * @param values {Object} The initial attribute values to apply (passed through to <a href=\"#method_addAttrs\">addAttrs</a>). These are not merged/cloned. The caller is responsible for isolating user provided values if required.","         * @param lazy {boolean} Whether or not to add attributes lazily (passed through to <a href=\"#method_addAttrs\">addAttrs</a>).","         * @private","         */","        _initAttrHost : function(attrs, values, lazy) {","            this._state = new Y.State();","            this._initAttrs(attrs, values, lazy);","        },","","        /**","         * <p>","         * Adds an attribute with the provided configuration to the host object.","         * </p>","         * <p>","         * The config argument object supports the following properties:","         * </p>","         * ","         * <dl>","         *    <dt>value &#60;Any&#62;</dt>","         *    <dd>The initial value to set on the attribute</dd>","         *","         *    <dt>valueFn &#60;Function | String&#62;</dt>","         *    <dd>","         *    <p>A function, which will return the initial value to set on the attribute. This is useful","         *    for cases where the attribute configuration is defined statically, but needs to ","         *    reference the host instance (\"this\") to obtain an initial value. If both the value and valueFn properties are defined, ","         *    the value returned by the valueFn has precedence over the value property, unless it returns undefined, in which ","         *    case the value property is used.</p>","         *","         *    <p>valueFn can also be set to a string, representing the name of the instance method to be used to retrieve the value.</p>","         *    </dd>","         *","         *    <dt>readOnly &#60;boolean&#62;</dt>","         *    <dd>Whether or not the attribute is read only. Attributes having readOnly set to true","         *        cannot be modified by invoking the set method.</dd>","         *","         *    <dt>writeOnce &#60;boolean&#62; or &#60;string&#62;</dt>","         *    <dd>","         *        Whether or not the attribute is \"write once\". Attributes having writeOnce set to true, ","         *        can only have their values set once, be it through the default configuration, ","         *        constructor configuration arguments, or by invoking set.","         *        <p>The writeOnce attribute can also be set to the string \"initOnly\", in which case the attribute can only be set during initialization","         *        (when used with Base, this means it can only be set during construction)</p>","         *    </dd>","         *","         *    <dt>setter &#60;Function | String&#62;</dt>","         *    <dd>","         *    <p>The setter function used to massage or normalize the value passed to the set method for the attribute. ","         *    The value returned by the setter will be the final stored value. Returning","         *    <a href=\"#property_Attribute.INVALID_VALUE\">Attribute.INVALID_VALUE</a>, from the setter will prevent","         *    the value from being stored.","         *    </p>","         *    ","         *    <p>setter can also be set to a string, representing the name of the instance method to be used as the setter function.</p>","         *    </dd>","         *      ","         *    <dt>getter &#60;Function | String&#62;</dt>","         *    <dd>","         *    <p>","         *    The getter function used to massage or normalize the value returned by the get method for the attribute.","         *    The value returned by the getter function is the value which will be returned to the user when they ","         *    invoke get.","         *    </p>","         *","         *    <p>getter can also be set to a string, representing the name of the instance method to be used as the getter function.</p>","         *    </dd>","         *","         *    <dt>validator &#60;Function | String&#62;</dt>","         *    <dd>","         *    <p>","         *    The validator function invoked prior to setting the stored value. Returning","         *    false from the validator function will prevent the value from being stored.","         *    </p>","         *    ","         *    <p>validator can also be set to a string, representing the name of the instance method to be used as the validator function.</p>","         *    </dd>","         *","         *    <dt>lazyAdd &#60;boolean&#62;</dt>","         *    <dd>Whether or not to delay initialization of the attribute until the first call to get/set it. ","         *    This flag can be used to over-ride lazy initialization on a per attribute basis, when adding multiple attributes through ","         *    the <a href=\"#method_addAttrs\">addAttrs</a> method.</dd>","         *","         * </dl>","         *","         * <p>The setter, getter and validator are invoked with the value and name passed in as the first and second arguments, and with","         * the context (\"this\") set to the host object.</p>","         *","         * <p>Configuration properties outside of the list mentioned above are considered private properties used internally by attribute, ","         * and are not intended for public use.</p>","         * ","         * @method addAttr","         *","         * @param {String} name The name of the attribute.","         * @param {Object} config An object with attribute configuration property/value pairs, specifying the configuration for the attribute.","         *","         * <p>","         * <strong>NOTE:</strong> The configuration object is modified when adding an attribute, so if you need ","         * to protect the original values, you will need to merge the object.","         * </p>","         *","         * @param {boolean} lazy (optional) Whether or not to add this attribute lazily (on the first call to get/set). ","         *","         * @return {Object} A reference to the host object.","         *","         * @chainable","         */","        addAttr: function(name, config, lazy) {","","","            var host = this, // help compression","                state = host._state,","                value,","                hasValue;","","            config = config || {};","","            lazy = (LAZY_ADD in config) ? config[LAZY_ADD] : lazy;","","            if (lazy && !host.attrAdded(name)) {","                state.addAll(name, {","                    lazy : config,","                    added : true","                });","            } else {","","","                if (!host.attrAdded(name) || state.get(name, IS_LAZY_ADD)) {","","                    hasValue = (VALUE in config);","","","                    if (hasValue) {","                        // We'll go through set, don't want to set value in config directly","                        value = config.value;","                        delete config.value;","                    }","","                    config.added = true;","                    config.initializing = true;","","                    state.addAll(name, config);","","                    if (hasValue) {","                        // Go through set, so that raw values get normalized/validated","                        host.set(name, value);","                    }","","                    state.remove(name, INITIALIZING);","                }","            }","","            return host;","        },","","        /**","         * Checks if the given attribute has been added to the host","         *","         * @method attrAdded","         * @param {String} name The name of the attribute to check.","         * @return {boolean} true if an attribute with the given name has been added, false if it hasn't. This method will return true for lazily added attributes.","         */","        attrAdded: function(name) {","            return !!this._state.get(name, ADDED);","        },","","        /**","         * Returns the current value of the attribute. If the attribute","         * has been configured with a 'getter' function, this method will delegate","         * to the 'getter' to obtain the value of the attribute.","         *","         * @method get","         *","         * @param {String} name The name of the attribute. If the value of the attribute is an Object, ","         * dot notation can be used to obtain the value of a property of the object (e.g. <code>get(\"x.y.z\")</code>)","         *","         * @return {Any} The value of the attribute","         */","        get : function(name) {","            return this._getAttr(name);","        },","","        /**","         * Checks whether or not the attribute is one which has been","         * added lazily and still requires initialization.","         *","         * @method _isLazyAttr","         * @private","         * @param {String} name The name of the attribute","         * @return {boolean} true if it's a lazily added attribute, false otherwise.","         */","        _isLazyAttr: function(name) {","            return this._state.get(name, LAZY);","        },","","        /**","         * Finishes initializing an attribute which has been lazily added.","         *","         * @method _addLazyAttr","         * @private","         * @param {Object} name The name of the attribute","         */","        _addLazyAttr: function(name, cfg) {","            var state = this._state,","                lazyCfg = state.get(name, LAZY);","","            state.add(name, IS_LAZY_ADD, true);","            state.remove(name, LAZY);","            this.addAttr(name, lazyCfg);","        },","","        /**","         * Sets the value of an attribute.","         *","         * @method set","         * @chainable","         *","         * @param {String} name The name of the attribute. If the ","         * current value of the attribute is an Object, dot notation can be used","         * to set the value of a property within the object (e.g. <code>set(\"x.y.z\", 5)</code>).","         *","         * @param {Any} value The value to set the attribute to.","         *","         * @return {Object} A reference to the host object.","         */","        set : function(name, val) {","            return this._setAttr(name, val);","        },","","        /**","         * Allows setting of readOnly/writeOnce attributes. See <a href=\"#method_set\">set</a> for argument details.","         *","         * @method _set","         * @protected","         * @chainable","         * ","         * @param {String} name The name of the attribute.","         * @param {Any} val The value to set the attribute to.","         * @return {Object} A reference to the host object.","         */","        _set : function(name, val) {","            return this._setAttr(name, val, null, true);","        },","","        /**","         * Provides the common implementation for the public set and protected _set methods.","         *","         * See <a href=\"#method_set\">set</a> for argument details.","         *","         * @method _setAttr","         * @protected","         * @chainable","         *","         * @param {String} name The name of the attribute.","         * @param {Any} value The value to set the attribute to.","         * @param {Object} opts (Optional) Optional event data to be mixed into","         * the event facade passed to subscribers of the attribute's change event.","         * This is currently a hack. There's no real need for the AttributeCore implementation","         * to support this parameter, but breaking it out into AttributeEvents, results in","         * additional function hops for the critical path.","         * @param {boolean} force If true, allows the caller to set values for ","         * readOnly or writeOnce attributes which have already been set.","         *","         * @return {Object} A reference to the host object.","         */","        _setAttr : function(name, val, opts, force)  {","            ","            // HACK - no real reason core needs to know about opts, but ","            // it adds fn hops if we want to break it out. ","            // Not sure it's worth it for this critical path","            ","            var allowSet = true,","                state = this._state,","                stateProxy = this._stateProxy,","                cfg,","                initialSet,","                strPath,","                path,","                currVal,","                writeOnce,","                initializing;","","            if (name.indexOf(DOT) !== -1) {","                strPath = name;","                path = name.split(DOT);","                name = path.shift();","            }","","            if (this._isLazyAttr(name)) {","                this._addLazyAttr(name);","            }","","            cfg = state.getAll(name, true) || {}; ","","            initialSet = (!(VALUE in cfg));","","            if (stateProxy && name in stateProxy && !cfg._bypassProxy) {","                // TODO: Value is always set for proxy. Can we do any better? Maybe take a snapshot as the initial value for the first call to set? ","                initialSet = false;","            }","","            writeOnce = cfg.writeOnce;","            initializing = cfg.initializing;","","            if (!initialSet && !force) {","","                if (writeOnce) {","                    allowSet = false;","                }","","                if (cfg.readOnly) {","                    allowSet = false;","                }","            }","","            if (!initializing && !force && writeOnce === INIT_ONLY) {","                allowSet = false;","            }","","            if (allowSet) {","                // Don't need currVal if initialSet (might fail in custom getter if it always expects a non-undefined/non-null value)","                if (!initialSet) {","                    currVal =  this.get(name);","                }","","                if (path) {","                   val = O.setValue(Y.clone(currVal), path, val);","","                   if (val === undefined) {","                       allowSet = false;","                   }","                }","","                if (allowSet) {","                    if (!this._fireAttrChange || initializing) {","                        this._setAttrVal(name, strPath, currVal, val);","                    } else {","                        // HACK - no real reason core needs to know about _fireAttrChange, but ","                        // it adds fn hops if we want to break it out. Not sure it's worth it for this critical path","                        this._fireAttrChange(name, strPath, currVal, val, opts);","                    }","                }","            }","","            return this;","        },","","        /**","         * Provides the common implementation for the public get method,","         * allowing Attribute hosts to over-ride either method.","         *","         * See <a href=\"#method_get\">get</a> for argument details.","         *","         * @method _getAttr","         * @protected","         * @chainable","         *","         * @param {String} name The name of the attribute.","         * @return {Any} The value of the attribute.","         */","        _getAttr : function(name) {","            var host = this, // help compression","                fullName = name,","                state = host._state,","                path,","                getter,","                val,","                cfg;","","            if (name.indexOf(DOT) !== -1) {","                path = name.split(DOT);","                name = path.shift();","            }","","            // On Demand - Should be rare - handles out of order valueFn references","            if (host._tCfgs && host._tCfgs[name]) {","                cfg = {};","                cfg[name] = host._tCfgs[name];","                delete host._tCfgs[name];","                host._addAttrs(cfg, host._tVals);","            }","            ","            // Lazy Init","            if (host._isLazyAttr(name)) {","                host._addLazyAttr(name);","            }","","            val = host._getStateVal(name);","                        ","            getter = state.get(name, GETTER);","","            if (getter && !getter.call) {","                getter = this[getter];","            }","","            val = (getter) ? getter.call(host, val, fullName) : val;","            val = (path) ? O.getValue(val, path) : val;","","            return val;","        },","","        /**","         * Gets the stored value for the attribute, from either the ","         * internal state object, or the state proxy if it exits","         * ","         * @method _getStateVal","         * @private","         * @param {String} name The name of the attribute","         * @return {Any} The stored value of the attribute","         */","        _getStateVal : function(name) {","            var stateProxy = this._stateProxy;","            return stateProxy && (name in stateProxy) && !this._state.get(name, BYPASS_PROXY) ? stateProxy[name] : this._state.get(name, VALUE);","        },","","        /**","         * Sets the stored value for the attribute, in either the ","         * internal state object, or the state proxy if it exits","         *","         * @method _setStateVal","         * @private","         * @param {String} name The name of the attribute","         * @param {Any} value The value of the attribute","         */","        _setStateVal : function(name, value) {","            var stateProxy = this._stateProxy;","            if (stateProxy && (name in stateProxy) && !this._state.get(name, BYPASS_PROXY)) {","                stateProxy[name] = value;","            } else {","                this._state.add(name, VALUE, value);","            }","        },","","        /**","         * Updates the stored value of the attribute in the privately held State object,","         * if validation and setter passes.","         *","         * @method _setAttrVal","         * @private","         * @param {String} attrName The attribute name.","         * @param {String} subAttrName The sub-attribute name, if setting a sub-attribute property (\"x.y.z\").","         * @param {Any} prevVal The currently stored value of the attribute.","         * @param {Any} newVal The value which is going to be stored.","         * ","         * @return {booolean} true if the new attribute value was stored, false if not.","         */","        _setAttrVal : function(attrName, subAttrName, prevVal, newVal) {","","            var host = this,","                allowSet = true,","                cfg = this._state.getAll(attrName, true) || {},","                validator = cfg.validator,","                setter = cfg.setter,","                initializing = cfg.initializing,","                prevRawVal = this._getStateVal(attrName),","                name = subAttrName || attrName,","                retVal,","                valid;","","            if (validator) {","                if (!validator.call) { ","                    // Assume string - trying to keep critical path tight, so avoiding Lang check","                    validator = this[validator];","                }","                if (validator) {","                    valid = validator.call(host, newVal, name);","","                    if (!valid && initializing) {","                        newVal = cfg.defaultValue;","                        valid = true; // Assume it's valid, for perf.","                    }","                }","            }","","            if (!validator || valid) {","                if (setter) {","                    if (!setter.call) {","                        // Assume string - trying to keep critical path tight, so avoiding Lang check","                        setter = this[setter];","                    }","                    if (setter) {","                        retVal = setter.call(host, newVal, name);","","                        if (retVal === INVALID_VALUE) {","                            allowSet = false;","                        } else if (retVal !== undefined){","                            newVal = retVal;","                        }","                    }","                }","","                if (allowSet) {","                    if(!subAttrName && (newVal === prevRawVal) && !Lang.isObject(newVal)) {","                        allowSet = false;","                    } else {","                        // Store value","                        if (!(INIT_VALUE in cfg)) {","                            cfg.initValue = newVal;","                        }","                        host._setStateVal(attrName, newVal);","                    }","                }","","            } else {","                allowSet = false;","            }","","            return allowSet;","        },","","        /**","         * Sets multiple attribute values.","         *","         * @method setAttrs","         * @param {Object} attrs  An object with attributes name/value pairs.","         * @return {Object} A reference to the host object.","         * @chainable","         */","        setAttrs : function(attrs) {","            return this._setAttrs(attrs);","        },","","        /**","         * Implementation behind the public setAttrs method, to set multiple attribute values.","         *","         * @method _setAttrs","         * @protected","         * @param {Object} attrs  An object with attributes name/value pairs.","         * @return {Object} A reference to the host object.","         * @chainable","         */","        _setAttrs : function(attrs) {","            var attr;","            for (attr in attrs) {","                if ( attrs.hasOwnProperty(attr) ) {","                    this.set(attr, attrs[attr]);","                }","            }","            return this;","        },","","        /**","         * Gets multiple attribute values.","         *","         * @method getAttrs","         * @param {Array | boolean} attrs Optional. An array of attribute names. If omitted, all attribute values are","         * returned. If set to true, all attributes modified from their initial values are returned.","         * @return {Object} An object with attribute name/value pairs.","         */","        getAttrs : function(attrs) {","            return this._getAttrs(attrs);","        },","","        /**","         * Implementation behind the public getAttrs method, to get multiple attribute values.","         *","         * @method _getAttrs","         * @protected","         * @param {Array | boolean} attrs Optional. An array of attribute names. If omitted, all attribute values are","         * returned. If set to true, all attributes modified from their initial values are returned.","         * @return {Object} An object with attribute name/value pairs.","         */","        _getAttrs : function(attrs) {","            var obj = {},","                attr, i, len,","                modifiedOnly = (attrs === true);","","            // TODO - figure out how to get all \"added\"","            if (!attrs || modifiedOnly) {","                attrs = O.keys(this._state.data);","            }","","            for (i = 0, len = attrs.length; i < len; i++) {","                attr = attrs[i];","","                if (!modifiedOnly || this._getStateVal(attr) != this._state.get(attr, INIT_VALUE)) {","                    // Go through get, to honor cloning/normalization","                    obj[attr] = this.get(attr);","                }","            }","","            return obj;","        },","","        /**","         * Configures a group of attributes, and sets initial values.","         *","         * <p>","         * <strong>NOTE:</strong> This method does not isolate the configuration object by merging/cloning. ","         * The caller is responsible for merging/cloning the configuration object if required.","         * </p>","         *","         * @method addAttrs","         * @chainable","         *","         * @param {Object} cfgs An object with attribute name/configuration pairs.","         * @param {Object} values An object with attribute name/value pairs, defining the initial values to apply.","         * Values defined in the cfgs argument will be over-written by values in this argument unless defined as read only.","         * @param {boolean} lazy Whether or not to delay the intialization of these attributes until the first call to get/set.","         * Individual attributes can over-ride this behavior by defining a lazyAdd configuration property in their configuration.","         * See <a href=\"#method_addAttr\">addAttr</a>.","         * ","         * @return {Object} A reference to the host object.","         */","        addAttrs : function(cfgs, values, lazy) {","            var host = this; // help compression","            if (cfgs) {","                host._tCfgs = cfgs;","                host._tVals = host._normAttrVals(values);","                host._addAttrs(cfgs, host._tVals, lazy);","                host._tCfgs = host._tVals = null;","            }","","            return host;","        },","","        /**","         * Implementation behind the public addAttrs method. ","         * ","         * This method is invoked directly by get if it encounters a scenario ","         * in which an attribute's valueFn attempts to obtain the ","         * value an attribute in the same group of attributes, which has not yet ","         * been added (on demand initialization).","         *","         * @method _addAttrs","         * @private","         * @param {Object} cfgs An object with attribute name/configuration pairs.","         * @param {Object} values An object with attribute name/value pairs, defining the initial values to apply.","         * Values defined in the cfgs argument will be over-written by values in this argument unless defined as read only.","         * @param {boolean} lazy Whether or not to delay the intialization of these attributes until the first call to get/set.","         * Individual attributes can over-ride this behavior by defining a lazyAdd configuration property in their configuration.","         * See <a href=\"#method_addAttr\">addAttr</a>.","         */","        _addAttrs : function(cfgs, values, lazy) {","            var host = this, // help compression","                attr,","                attrCfg,","                value;","","            for (attr in cfgs) {","                if (cfgs.hasOwnProperty(attr)) {","","                    // Not Merging. Caller is responsible for isolating configs","                    attrCfg = cfgs[attr];","                    attrCfg.defaultValue = attrCfg.value;","","                    // Handle simple, complex and user values, accounting for read-only","                    value = host._getAttrInitVal(attr, attrCfg, host._tVals);","","                    if (value !== undefined) {","                        attrCfg.value = value;","                    }","","                    if (host._tCfgs[attr]) {","                        delete host._tCfgs[attr];","                    }","","                    host.addAttr(attr, attrCfg, lazy);","                }","            }","        },","","        /**","         * Utility method to protect an attribute configuration","         * hash, by merging the entire object and the individual ","         * attr config objects. ","         *","         * @method _protectAttrs","         * @protected","         * @param {Object} attrs A hash of attribute to configuration object pairs.","         * @return {Object} A protected version of the attrs argument.","         */","        _protectAttrs : function(attrs) {","            if (attrs) {","                attrs = Y.merge(attrs);","                for (var attr in attrs) {","                    if (attrs.hasOwnProperty(attr)) {","                        attrs[attr] = Y.merge(attrs[attr]);","                    }","                }","            }","            return attrs;","        },","","        /**","         * Utility method to normalize attribute values. The base implementation ","         * simply merges the hash to protect the original.","         *","         * @method _normAttrVals","         * @param {Object} valueHash An object with attribute name/value pairs","         *","         * @return {Object}","         *","         * @private","         */","        _normAttrVals : function(valueHash) {","            return (valueHash) ? Y.merge(valueHash) : null;","        },","","        /**","         * Returns the initial value of the given attribute from","         * either the default configuration provided, or the ","         * over-ridden value if it exists in the set of initValues ","         * provided and the attribute is not read-only.","         *","         * @param {String} attr The name of the attribute","         * @param {Object} cfg The attribute configuration object","         * @param {Object} initValues The object with simple and complex attribute name/value pairs returned from _normAttrVals","         *","         * @return {Any} The initial value of the attribute.","         *","         * @method _getAttrInitVal","         * @private","         */","        _getAttrInitVal : function(attr, cfg, initValues) {","            var val, valFn;","            // init value is provided by the user if it exists, else, provided by the config","            if (!cfg.readOnly && initValues && initValues.hasOwnProperty(attr)) {","                val = initValues[attr];","            } else {","                val = cfg.value;","                valFn = cfg.valueFn;"," ","                if (valFn) {","                    if (!valFn.call) {","                        valFn = this[valFn];","                    }","                    if (valFn) {","                        val = valFn.call(this, attr);","                    }","                }","            }","","","            return val;","        },","","        /**","         * Utility method to set up initial attributes defined during construction, either through the constructor.ATTRS property, or explicitly passed in.","         * ","         * @method _initAttrs","         * @protected","         * @param attrs {Object} The attributes to add during construction (passed through to <a href=\"#method_addAttrs\">addAttrs</a>). These can also be defined on the constructor being augmented with Attribute by defining the ATTRS property on the constructor.","         * @param values {Object} The initial attribute values to apply (passed through to <a href=\"#method_addAttrs\">addAttrs</a>). These are not merged/cloned. The caller is responsible for isolating user provided values if required.","         * @param lazy {boolean} Whether or not to add attributes lazily (passed through to <a href=\"#method_addAttrs\">addAttrs</a>).","         */","        _initAttrs : function(attrs, values, lazy) {","            // ATTRS support for Node, which is not Base based","            attrs = attrs || this.constructor.ATTRS;","    ","            var Base = Y.Base,","                BaseCore = Y.BaseCore,","                baseInst = (Base && Y.instanceOf(this, Base)),","                baseCoreInst = (!baseInst && BaseCore && Y.instanceOf(this, BaseCore));","","            if ( attrs && !baseInst && !baseCoreInst) {","                this.addAttrs(this._protectAttrs(attrs), values, lazy);","            }","        }","    };","","    Y.AttributeCore = AttributeCore;","","","}, '3.7.3', {\"requires\": [\"oop\"]});"];
_yuitest_coverage["build/attribute-core/attribute-core.js"].lines = {"1":0,"14":0,"19":0,"22":0,"33":0,"35":0,"36":0,"39":0,"50":0,"53":0,"54":0,"57":0,"58":0,"59":0,"72":0,"74":0,"75":0,"87":0,"89":0,"90":0,"92":0,"93":0,"96":0,"97":0,"111":0,"113":0,"114":0,"132":0,"135":0,"136":0,"137":0,"138":0,"140":0,"141":0,"142":0,"147":0,"168":0,"223":0,"224":0,"239":0,"240":0,"254":0,"256":0,"269":0,"270":0,"373":0,"378":0,"380":0,"382":0,"383":0,"390":0,"392":0,"395":0,"397":0,"398":0,"401":0,"402":0,"404":0,"406":0,"408":0,"411":0,"415":0,"426":0,"442":0,"455":0,"466":0,"469":0,"470":0,"471":0,"489":0,"504":0,"534":0,"545":0,"546":0,"547":0,"548":0,"551":0,"552":0,"555":0,"557":0,"559":0,"561":0,"564":0,"565":0,"567":0,"569":0,"570":0,"573":0,"574":0,"578":0,"579":0,"582":0,"584":0,"585":0,"588":0,"589":0,"591":0,"592":0,"596":0,"597":0,"598":0,"602":0,"607":0,"624":0,"632":0,"633":0,"634":0,"638":0,"639":0,"640":0,"641":0,"642":0,"646":0,"647":0,"650":0,"652":0,"654":0,"655":0,"658":0,"659":0,"661":0,"674":0,"675":0,"688":0,"689":0,"690":0,"692":0,"711":0,"722":0,"723":0,"725":0,"727":0,"728":0,"730":0,"731":0,"732":0,"737":0,"738":0,"739":0,"741":0,"743":0,"744":0,"746":0,"747":0,"748":0,"749":0,"754":0,"755":0,"756":0,"759":0,"760":0,"762":0,"767":0,"770":0,"782":0,"795":0,"796":0,"797":0,"798":0,"801":0,"813":0,"826":0,"831":0,"832":0,"835":0,"836":0,"838":0,"840":0,"844":0,"868":0,"869":0,"870":0,"871":0,"872":0,"873":0,"876":0,"897":0,"902":0,"903":0,"906":0,"907":0,"910":0,"912":0,"913":0,"916":0,"917":0,"920":0,"936":0,"937":0,"938":0,"939":0,"940":0,"944":0,"959":0,"978":0,"980":0,"981":0,"983":0,"984":0,"986":0,"987":0,"988":0,"990":0,"991":0,"997":0,"1011":0,"1013":0,"1018":0,"1019":0,"1024":0};
_yuitest_coverage["build/attribute-core/attribute-core.js"].functions = {"State:14":0,"add:32":0,"addAll:49":0,"remove:71":0,"(anonymous 2):96":0,"removeAll:86":0,"get:110":0,"getAll:131":0,"AttributeCore:223":0,"_initAttrHost:268":0,"addAttr:370":0,"attrAdded:425":0,"get:441":0,"_isLazyAttr:454":0,"_addLazyAttr:465":0,"set:488":0,"_set:503":0,"_setAttr:528":0,"_getAttr:623":0,"_getStateVal:673":0,"_setStateVal:687":0,"_setAttrVal:709":0,"setAttrs:781":0,"_setAttrs:794":0,"getAttrs:812":0,"_getAttrs:825":0,"addAttrs:867":0,"_addAttrs:896":0,"_protectAttrs:935":0,"_normAttrVals:958":0,"_getAttrInitVal:977":0,"_initAttrs:1009":0,"(anonymous 1):1":0};
_yuitest_coverage["build/attribute-core/attribute-core.js"].coveredLines = 210;
_yuitest_coverage["build/attribute-core/attribute-core.js"].coveredFunctions = 33;
_yuitest_coverline("build/attribute-core/attribute-core.js", 1);
YUI.add('attribute-core', function (Y, NAME) {

    /**
     * The State class maintains state for a collection of named items, with
     * a varying number of properties defined.
     *
     * It avoids the need to create a separate class for the item, and separate instances
     * of these classes for each item, by storing the state in a 2 level hash table,
     * improving performance when the number of items is likely to be large.
     *
     * @constructor
     * @class State
     */
    _yuitest_coverfunc("build/attribute-core/attribute-core.js", "(anonymous 1)", 1);
_yuitest_coverline("build/attribute-core/attribute-core.js", 14);
Y.State = function() {
        /**
         * Hash of attributes
         * @property data
         */
        _yuitest_coverfunc("build/attribute-core/attribute-core.js", "State", 14);
_yuitest_coverline("build/attribute-core/attribute-core.js", 19);
this.data = {};
    };

    _yuitest_coverline("build/attribute-core/attribute-core.js", 22);
Y.State.prototype = {

        /**
         * Adds a property to an item.
         *
         * @method add
         * @param name {String} The name of the item.
         * @param key {String} The name of the property.
         * @param val {Any} The value of the property.
         */
        add: function(name, key, val) {
            _yuitest_coverfunc("build/attribute-core/attribute-core.js", "add", 32);
_yuitest_coverline("build/attribute-core/attribute-core.js", 33);
var item = this.data[name];

            _yuitest_coverline("build/attribute-core/attribute-core.js", 35);
if (!item) {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 36);
item = this.data[name] = {};
            }

            _yuitest_coverline("build/attribute-core/attribute-core.js", 39);
item[key] = val;
        },

        /**
         * Adds multiple properties to an item.
         *
         * @method addAll
         * @param name {String} The name of the item.
         * @param obj {Object} A hash of property/value pairs.
         */
        addAll: function(name, obj) {
            _yuitest_coverfunc("build/attribute-core/attribute-core.js", "addAll", 49);
_yuitest_coverline("build/attribute-core/attribute-core.js", 50);
var item = this.data[name],
                key;

            _yuitest_coverline("build/attribute-core/attribute-core.js", 53);
if (!item) {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 54);
item = this.data[name] = {};
            }

            _yuitest_coverline("build/attribute-core/attribute-core.js", 57);
for (key in obj) {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 58);
if (obj.hasOwnProperty(key)) {
                    _yuitest_coverline("build/attribute-core/attribute-core.js", 59);
item[key] = obj[key];
                }
            }
        },

        /**
         * Removes a property from an item.
         *
         * @method remove
         * @param name {String} The name of the item.
         * @param key {String} The property to remove.
         */
        remove: function(name, key) {
            _yuitest_coverfunc("build/attribute-core/attribute-core.js", "remove", 71);
_yuitest_coverline("build/attribute-core/attribute-core.js", 72);
var item = this.data[name];

            _yuitest_coverline("build/attribute-core/attribute-core.js", 74);
if (item) {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 75);
delete item[key];
            }
        },

        /**
         * Removes multiple properties from an item, or removes the item completely.
         *
         * @method removeAll
         * @param name {String} The name of the item.
         * @param obj {Object|Array} Collection of properties to delete. If not provided, the entire item is removed.
         */
        removeAll: function(name, obj) {
            _yuitest_coverfunc("build/attribute-core/attribute-core.js", "removeAll", 86);
_yuitest_coverline("build/attribute-core/attribute-core.js", 87);
var data;

            _yuitest_coverline("build/attribute-core/attribute-core.js", 89);
if (!obj) {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 90);
data = this.data;

                _yuitest_coverline("build/attribute-core/attribute-core.js", 92);
if (name in data) {
                    _yuitest_coverline("build/attribute-core/attribute-core.js", 93);
delete data[name];
                }
            } else {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 96);
Y.each(obj, function(value, key) {
                    _yuitest_coverfunc("build/attribute-core/attribute-core.js", "(anonymous 2)", 96);
_yuitest_coverline("build/attribute-core/attribute-core.js", 97);
this.remove(name, typeof key === 'string' ? key : value);
                }, this);
            }
        },

        /**
         * For a given item, returns the value of the property requested, or undefined if not found.
         *
         * @method get
         * @param name {String} The name of the item
         * @param key {String} Optional. The property value to retrieve.
         * @return {Any} The value of the supplied property.
         */
        get: function(name, key) {
            _yuitest_coverfunc("build/attribute-core/attribute-core.js", "get", 110);
_yuitest_coverline("build/attribute-core/attribute-core.js", 111);
var item = this.data[name];

            _yuitest_coverline("build/attribute-core/attribute-core.js", 113);
if (item) {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 114);
return item[key];
            }
        },

        /**
         * For the given item, returns an object with all of the
         * item's property/value pairs. By default the object returned
         * is a shallow copy of the stored data, but passing in true
         * as the second parameter will return a reference to the stored
         * data.
         *
         * @method getAll
         * @param name {String} The name of the item
         * @param reference {boolean} true, if you want a reference to the stored
         * object
         * @return {Object} An object with property/value pairs for the item.
         */
        getAll : function(name, reference) {
            _yuitest_coverfunc("build/attribute-core/attribute-core.js", "getAll", 131);
_yuitest_coverline("build/attribute-core/attribute-core.js", 132);
var item = this.data[name],
                key, obj;

            _yuitest_coverline("build/attribute-core/attribute-core.js", 135);
if (reference) {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 136);
obj = item;
            } else {_yuitest_coverline("build/attribute-core/attribute-core.js", 137);
if (item) {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 138);
obj = {};

                _yuitest_coverline("build/attribute-core/attribute-core.js", 140);
for (key in item) {
                    _yuitest_coverline("build/attribute-core/attribute-core.js", 141);
if (item.hasOwnProperty(key)) {
                        _yuitest_coverline("build/attribute-core/attribute-core.js", 142);
obj[key] = item[key];
                    }
                }
            }}

            _yuitest_coverline("build/attribute-core/attribute-core.js", 147);
return obj;
        }
    };
    /**
     * The attribute module provides an augmentable Attribute implementation, which 
     * adds configurable attributes and attribute change events to the class being 
     * augmented. It also provides a State class, which is used internally by Attribute,
     * but can also be used independently to provide a name/property/value data structure to
     * store state.
     *
     * @module attribute
     */

    /**
     * The attribute-core submodule provides the lightest level of attribute handling support 
     * without Attribute change events, or lesser used methods such as reset(), modifyAttrs(),
     * and removeAttr().
     *
     * @module attribute
     * @submodule attribute-core
     */
    _yuitest_coverline("build/attribute-core/attribute-core.js", 168);
var O = Y.Object,
        Lang = Y.Lang,

        DOT = ".",

        // Externally configurable props
        GETTER = "getter",
        SETTER = "setter",
        READ_ONLY = "readOnly",
        WRITE_ONCE = "writeOnce",
        INIT_ONLY = "initOnly",
        VALIDATOR = "validator",
        VALUE = "value",
        VALUE_FN = "valueFn",
        LAZY_ADD = "lazyAdd",

        // Used for internal state management
        ADDED = "added",
        BYPASS_PROXY = "_bypassProxy",
        INITIALIZING = "initializing",
        INIT_VALUE = "initValue",
        LAZY = "lazy",
        IS_LAZY_ADD = "isLazyAdd",

        INVALID_VALUE;

    /**
     * <p>
     * AttributeCore provides the lightest level of configurable attribute support. It is designed to be 
     * augmented on to a host class, and provides the host with the ability to configure 
     * attributes to store and retrieve state, <strong>but without support for attribute change events</strong>.
     * </p>
     * <p>For example, attributes added to the host can be configured:</p>
     * <ul>
     *     <li>As read only.</li>
     *     <li>As write once.</li>
     *     <li>With a setter function, which can be used to manipulate
     *     values passed to Attribute's <a href="#method_set">set</a> method, before they are stored.</li>
     *     <li>With a getter function, which can be used to manipulate stored values,
     *     before they are returned by Attribute's <a href="#method_get">get</a> method.</li>
     *     <li>With a validator function, to validate values before they are stored.</li>
     * </ul>
     *
     * <p>See the <a href="#method_addAttr">addAttr</a> method, for the complete set of configuration
     * options available for attributes.</p>
     * 
     * <p>Object/Classes based on AttributeCore can augment <a href="AttributeEvents.html">AttributeEvents</a> 
     * (with true for overwrite) and <a href="AttributeExtras.html">AttributeExtras</a> to add attribute event and 
     * additional, less commonly used attribute methods, such as `modifyAttr`, `removeAttr` and `reset`.</p>   
     *
     * @class AttributeCore
     * @param attrs {Object} The attributes to add during construction (passed through to <a href="#method_addAttrs">addAttrs</a>). These can also be defined on the constructor being augmented with Attribute by defining the ATTRS property on the constructor.
     * @param values {Object} The initial attribute values to apply (passed through to <a href="#method_addAttrs">addAttrs</a>). These are not merged/cloned. The caller is responsible for isolating user provided values if required.
     * @param lazy {boolean} Whether or not to add attributes lazily (passed through to <a href="#method_addAttrs">addAttrs</a>).
     */
    _yuitest_coverline("build/attribute-core/attribute-core.js", 223);
function AttributeCore(attrs, values, lazy) {
        _yuitest_coverfunc("build/attribute-core/attribute-core.js", "AttributeCore", 223);
_yuitest_coverline("build/attribute-core/attribute-core.js", 224);
this._initAttrHost(attrs, values, lazy);            
    }

    /**
     * <p>The value to return from an attribute setter in order to prevent the set from going through.</p>
     *
     * <p>You can return this value from your setter if you wish to combine validator and setter 
     * functionality into a single setter function, which either returns the massaged value to be stored or 
     * AttributeCore.INVALID_VALUE to prevent invalid values from being stored.</p>
     *
     * @property INVALID_VALUE
     * @type Object
     * @static
     * @final
     */
    _yuitest_coverline("build/attribute-core/attribute-core.js", 239);
AttributeCore.INVALID_VALUE = {};
    _yuitest_coverline("build/attribute-core/attribute-core.js", 240);
INVALID_VALUE = AttributeCore.INVALID_VALUE;

    /**
     * The list of properties which can be configured for 
     * each attribute (e.g. setter, getter, writeOnce etc.).
     *
     * This property is used internally as a whitelist for faster
     * Y.mix operations.
     *
     * @property _ATTR_CFG
     * @type Array
     * @static
     * @protected
     */
    _yuitest_coverline("build/attribute-core/attribute-core.js", 254);
AttributeCore._ATTR_CFG = [SETTER, GETTER, VALIDATOR, VALUE, VALUE_FN, WRITE_ONCE, READ_ONLY, LAZY_ADD, BYPASS_PROXY];

    _yuitest_coverline("build/attribute-core/attribute-core.js", 256);
AttributeCore.prototype = {

        /**
         * Constructor logic for attributes. Initializes the host state, and sets up the inital attributes passed to the 
         * constructor.
         *
         * @method _initAttrHost
         * @param attrs {Object} The attributes to add during construction (passed through to <a href="#method_addAttrs">addAttrs</a>). These can also be defined on the constructor being augmented with Attribute by defining the ATTRS property on the constructor.
         * @param values {Object} The initial attribute values to apply (passed through to <a href="#method_addAttrs">addAttrs</a>). These are not merged/cloned. The caller is responsible for isolating user provided values if required.
         * @param lazy {boolean} Whether or not to add attributes lazily (passed through to <a href="#method_addAttrs">addAttrs</a>).
         * @private
         */
        _initAttrHost : function(attrs, values, lazy) {
            _yuitest_coverfunc("build/attribute-core/attribute-core.js", "_initAttrHost", 268);
_yuitest_coverline("build/attribute-core/attribute-core.js", 269);
this._state = new Y.State();
            _yuitest_coverline("build/attribute-core/attribute-core.js", 270);
this._initAttrs(attrs, values, lazy);
        },

        /**
         * <p>
         * Adds an attribute with the provided configuration to the host object.
         * </p>
         * <p>
         * The config argument object supports the following properties:
         * </p>
         * 
         * <dl>
         *    <dt>value &#60;Any&#62;</dt>
         *    <dd>The initial value to set on the attribute</dd>
         *
         *    <dt>valueFn &#60;Function | String&#62;</dt>
         *    <dd>
         *    <p>A function, which will return the initial value to set on the attribute. This is useful
         *    for cases where the attribute configuration is defined statically, but needs to 
         *    reference the host instance ("this") to obtain an initial value. If both the value and valueFn properties are defined, 
         *    the value returned by the valueFn has precedence over the value property, unless it returns undefined, in which 
         *    case the value property is used.</p>
         *
         *    <p>valueFn can also be set to a string, representing the name of the instance method to be used to retrieve the value.</p>
         *    </dd>
         *
         *    <dt>readOnly &#60;boolean&#62;</dt>
         *    <dd>Whether or not the attribute is read only. Attributes having readOnly set to true
         *        cannot be modified by invoking the set method.</dd>
         *
         *    <dt>writeOnce &#60;boolean&#62; or &#60;string&#62;</dt>
         *    <dd>
         *        Whether or not the attribute is "write once". Attributes having writeOnce set to true, 
         *        can only have their values set once, be it through the default configuration, 
         *        constructor configuration arguments, or by invoking set.
         *        <p>The writeOnce attribute can also be set to the string "initOnly", in which case the attribute can only be set during initialization
         *        (when used with Base, this means it can only be set during construction)</p>
         *    </dd>
         *
         *    <dt>setter &#60;Function | String&#62;</dt>
         *    <dd>
         *    <p>The setter function used to massage or normalize the value passed to the set method for the attribute. 
         *    The value returned by the setter will be the final stored value. Returning
         *    <a href="#property_Attribute.INVALID_VALUE">Attribute.INVALID_VALUE</a>, from the setter will prevent
         *    the value from being stored.
         *    </p>
         *    
         *    <p>setter can also be set to a string, representing the name of the instance method to be used as the setter function.</p>
         *    </dd>
         *      
         *    <dt>getter &#60;Function | String&#62;</dt>
         *    <dd>
         *    <p>
         *    The getter function used to massage or normalize the value returned by the get method for the attribute.
         *    The value returned by the getter function is the value which will be returned to the user when they 
         *    invoke get.
         *    </p>
         *
         *    <p>getter can also be set to a string, representing the name of the instance method to be used as the getter function.</p>
         *    </dd>
         *
         *    <dt>validator &#60;Function | String&#62;</dt>
         *    <dd>
         *    <p>
         *    The validator function invoked prior to setting the stored value. Returning
         *    false from the validator function will prevent the value from being stored.
         *    </p>
         *    
         *    <p>validator can also be set to a string, representing the name of the instance method to be used as the validator function.</p>
         *    </dd>
         *
         *    <dt>lazyAdd &#60;boolean&#62;</dt>
         *    <dd>Whether or not to delay initialization of the attribute until the first call to get/set it. 
         *    This flag can be used to over-ride lazy initialization on a per attribute basis, when adding multiple attributes through 
         *    the <a href="#method_addAttrs">addAttrs</a> method.</dd>
         *
         * </dl>
         *
         * <p>The setter, getter and validator are invoked with the value and name passed in as the first and second arguments, and with
         * the context ("this") set to the host object.</p>
         *
         * <p>Configuration properties outside of the list mentioned above are considered private properties used internally by attribute, 
         * and are not intended for public use.</p>
         * 
         * @method addAttr
         *
         * @param {String} name The name of the attribute.
         * @param {Object} config An object with attribute configuration property/value pairs, specifying the configuration for the attribute.
         *
         * <p>
         * <strong>NOTE:</strong> The configuration object is modified when adding an attribute, so if you need 
         * to protect the original values, you will need to merge the object.
         * </p>
         *
         * @param {boolean} lazy (optional) Whether or not to add this attribute lazily (on the first call to get/set). 
         *
         * @return {Object} A reference to the host object.
         *
         * @chainable
         */
        addAttr: function(name, config, lazy) {


            _yuitest_coverfunc("build/attribute-core/attribute-core.js", "addAttr", 370);
_yuitest_coverline("build/attribute-core/attribute-core.js", 373);
var host = this, // help compression
                state = host._state,
                value,
                hasValue;

            _yuitest_coverline("build/attribute-core/attribute-core.js", 378);
config = config || {};

            _yuitest_coverline("build/attribute-core/attribute-core.js", 380);
lazy = (LAZY_ADD in config) ? config[LAZY_ADD] : lazy;

            _yuitest_coverline("build/attribute-core/attribute-core.js", 382);
if (lazy && !host.attrAdded(name)) {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 383);
state.addAll(name, {
                    lazy : config,
                    added : true
                });
            } else {


                _yuitest_coverline("build/attribute-core/attribute-core.js", 390);
if (!host.attrAdded(name) || state.get(name, IS_LAZY_ADD)) {

                    _yuitest_coverline("build/attribute-core/attribute-core.js", 392);
hasValue = (VALUE in config);


                    _yuitest_coverline("build/attribute-core/attribute-core.js", 395);
if (hasValue) {
                        // We'll go through set, don't want to set value in config directly
                        _yuitest_coverline("build/attribute-core/attribute-core.js", 397);
value = config.value;
                        _yuitest_coverline("build/attribute-core/attribute-core.js", 398);
delete config.value;
                    }

                    _yuitest_coverline("build/attribute-core/attribute-core.js", 401);
config.added = true;
                    _yuitest_coverline("build/attribute-core/attribute-core.js", 402);
config.initializing = true;

                    _yuitest_coverline("build/attribute-core/attribute-core.js", 404);
state.addAll(name, config);

                    _yuitest_coverline("build/attribute-core/attribute-core.js", 406);
if (hasValue) {
                        // Go through set, so that raw values get normalized/validated
                        _yuitest_coverline("build/attribute-core/attribute-core.js", 408);
host.set(name, value);
                    }

                    _yuitest_coverline("build/attribute-core/attribute-core.js", 411);
state.remove(name, INITIALIZING);
                }
            }

            _yuitest_coverline("build/attribute-core/attribute-core.js", 415);
return host;
        },

        /**
         * Checks if the given attribute has been added to the host
         *
         * @method attrAdded
         * @param {String} name The name of the attribute to check.
         * @return {boolean} true if an attribute with the given name has been added, false if it hasn't. This method will return true for lazily added attributes.
         */
        attrAdded: function(name) {
            _yuitest_coverfunc("build/attribute-core/attribute-core.js", "attrAdded", 425);
_yuitest_coverline("build/attribute-core/attribute-core.js", 426);
return !!this._state.get(name, ADDED);
        },

        /**
         * Returns the current value of the attribute. If the attribute
         * has been configured with a 'getter' function, this method will delegate
         * to the 'getter' to obtain the value of the attribute.
         *
         * @method get
         *
         * @param {String} name The name of the attribute. If the value of the attribute is an Object, 
         * dot notation can be used to obtain the value of a property of the object (e.g. <code>get("x.y.z")</code>)
         *
         * @return {Any} The value of the attribute
         */
        get : function(name) {
            _yuitest_coverfunc("build/attribute-core/attribute-core.js", "get", 441);
_yuitest_coverline("build/attribute-core/attribute-core.js", 442);
return this._getAttr(name);
        },

        /**
         * Checks whether or not the attribute is one which has been
         * added lazily and still requires initialization.
         *
         * @method _isLazyAttr
         * @private
         * @param {String} name The name of the attribute
         * @return {boolean} true if it's a lazily added attribute, false otherwise.
         */
        _isLazyAttr: function(name) {
            _yuitest_coverfunc("build/attribute-core/attribute-core.js", "_isLazyAttr", 454);
_yuitest_coverline("build/attribute-core/attribute-core.js", 455);
return this._state.get(name, LAZY);
        },

        /**
         * Finishes initializing an attribute which has been lazily added.
         *
         * @method _addLazyAttr
         * @private
         * @param {Object} name The name of the attribute
         */
        _addLazyAttr: function(name, cfg) {
            _yuitest_coverfunc("build/attribute-core/attribute-core.js", "_addLazyAttr", 465);
_yuitest_coverline("build/attribute-core/attribute-core.js", 466);
var state = this._state,
                lazyCfg = state.get(name, LAZY);

            _yuitest_coverline("build/attribute-core/attribute-core.js", 469);
state.add(name, IS_LAZY_ADD, true);
            _yuitest_coverline("build/attribute-core/attribute-core.js", 470);
state.remove(name, LAZY);
            _yuitest_coverline("build/attribute-core/attribute-core.js", 471);
this.addAttr(name, lazyCfg);
        },

        /**
         * Sets the value of an attribute.
         *
         * @method set
         * @chainable
         *
         * @param {String} name The name of the attribute. If the 
         * current value of the attribute is an Object, dot notation can be used
         * to set the value of a property within the object (e.g. <code>set("x.y.z", 5)</code>).
         *
         * @param {Any} value The value to set the attribute to.
         *
         * @return {Object} A reference to the host object.
         */
        set : function(name, val) {
            _yuitest_coverfunc("build/attribute-core/attribute-core.js", "set", 488);
_yuitest_coverline("build/attribute-core/attribute-core.js", 489);
return this._setAttr(name, val);
        },

        /**
         * Allows setting of readOnly/writeOnce attributes. See <a href="#method_set">set</a> for argument details.
         *
         * @method _set
         * @protected
         * @chainable
         * 
         * @param {String} name The name of the attribute.
         * @param {Any} val The value to set the attribute to.
         * @return {Object} A reference to the host object.
         */
        _set : function(name, val) {
            _yuitest_coverfunc("build/attribute-core/attribute-core.js", "_set", 503);
_yuitest_coverline("build/attribute-core/attribute-core.js", 504);
return this._setAttr(name, val, null, true);
        },

        /**
         * Provides the common implementation for the public set and protected _set methods.
         *
         * See <a href="#method_set">set</a> for argument details.
         *
         * @method _setAttr
         * @protected
         * @chainable
         *
         * @param {String} name The name of the attribute.
         * @param {Any} value The value to set the attribute to.
         * @param {Object} opts (Optional) Optional event data to be mixed into
         * the event facade passed to subscribers of the attribute's change event.
         * This is currently a hack. There's no real need for the AttributeCore implementation
         * to support this parameter, but breaking it out into AttributeEvents, results in
         * additional function hops for the critical path.
         * @param {boolean} force If true, allows the caller to set values for 
         * readOnly or writeOnce attributes which have already been set.
         *
         * @return {Object} A reference to the host object.
         */
        _setAttr : function(name, val, opts, force)  {
            
            // HACK - no real reason core needs to know about opts, but 
            // it adds fn hops if we want to break it out. 
            // Not sure it's worth it for this critical path
            
            _yuitest_coverfunc("build/attribute-core/attribute-core.js", "_setAttr", 528);
_yuitest_coverline("build/attribute-core/attribute-core.js", 534);
var allowSet = true,
                state = this._state,
                stateProxy = this._stateProxy,
                cfg,
                initialSet,
                strPath,
                path,
                currVal,
                writeOnce,
                initializing;

            _yuitest_coverline("build/attribute-core/attribute-core.js", 545);
if (name.indexOf(DOT) !== -1) {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 546);
strPath = name;
                _yuitest_coverline("build/attribute-core/attribute-core.js", 547);
path = name.split(DOT);
                _yuitest_coverline("build/attribute-core/attribute-core.js", 548);
name = path.shift();
            }

            _yuitest_coverline("build/attribute-core/attribute-core.js", 551);
if (this._isLazyAttr(name)) {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 552);
this._addLazyAttr(name);
            }

            _yuitest_coverline("build/attribute-core/attribute-core.js", 555);
cfg = state.getAll(name, true) || {}; 

            _yuitest_coverline("build/attribute-core/attribute-core.js", 557);
initialSet = (!(VALUE in cfg));

            _yuitest_coverline("build/attribute-core/attribute-core.js", 559);
if (stateProxy && name in stateProxy && !cfg._bypassProxy) {
                // TODO: Value is always set for proxy. Can we do any better? Maybe take a snapshot as the initial value for the first call to set? 
                _yuitest_coverline("build/attribute-core/attribute-core.js", 561);
initialSet = false;
            }

            _yuitest_coverline("build/attribute-core/attribute-core.js", 564);
writeOnce = cfg.writeOnce;
            _yuitest_coverline("build/attribute-core/attribute-core.js", 565);
initializing = cfg.initializing;

            _yuitest_coverline("build/attribute-core/attribute-core.js", 567);
if (!initialSet && !force) {

                _yuitest_coverline("build/attribute-core/attribute-core.js", 569);
if (writeOnce) {
                    _yuitest_coverline("build/attribute-core/attribute-core.js", 570);
allowSet = false;
                }

                _yuitest_coverline("build/attribute-core/attribute-core.js", 573);
if (cfg.readOnly) {
                    _yuitest_coverline("build/attribute-core/attribute-core.js", 574);
allowSet = false;
                }
            }

            _yuitest_coverline("build/attribute-core/attribute-core.js", 578);
if (!initializing && !force && writeOnce === INIT_ONLY) {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 579);
allowSet = false;
            }

            _yuitest_coverline("build/attribute-core/attribute-core.js", 582);
if (allowSet) {
                // Don't need currVal if initialSet (might fail in custom getter if it always expects a non-undefined/non-null value)
                _yuitest_coverline("build/attribute-core/attribute-core.js", 584);
if (!initialSet) {
                    _yuitest_coverline("build/attribute-core/attribute-core.js", 585);
currVal =  this.get(name);
                }

                _yuitest_coverline("build/attribute-core/attribute-core.js", 588);
if (path) {
                   _yuitest_coverline("build/attribute-core/attribute-core.js", 589);
val = O.setValue(Y.clone(currVal), path, val);

                   _yuitest_coverline("build/attribute-core/attribute-core.js", 591);
if (val === undefined) {
                       _yuitest_coverline("build/attribute-core/attribute-core.js", 592);
allowSet = false;
                   }
                }

                _yuitest_coverline("build/attribute-core/attribute-core.js", 596);
if (allowSet) {
                    _yuitest_coverline("build/attribute-core/attribute-core.js", 597);
if (!this._fireAttrChange || initializing) {
                        _yuitest_coverline("build/attribute-core/attribute-core.js", 598);
this._setAttrVal(name, strPath, currVal, val);
                    } else {
                        // HACK - no real reason core needs to know about _fireAttrChange, but 
                        // it adds fn hops if we want to break it out. Not sure it's worth it for this critical path
                        _yuitest_coverline("build/attribute-core/attribute-core.js", 602);
this._fireAttrChange(name, strPath, currVal, val, opts);
                    }
                }
            }

            _yuitest_coverline("build/attribute-core/attribute-core.js", 607);
return this;
        },

        /**
         * Provides the common implementation for the public get method,
         * allowing Attribute hosts to over-ride either method.
         *
         * See <a href="#method_get">get</a> for argument details.
         *
         * @method _getAttr
         * @protected
         * @chainable
         *
         * @param {String} name The name of the attribute.
         * @return {Any} The value of the attribute.
         */
        _getAttr : function(name) {
            _yuitest_coverfunc("build/attribute-core/attribute-core.js", "_getAttr", 623);
_yuitest_coverline("build/attribute-core/attribute-core.js", 624);
var host = this, // help compression
                fullName = name,
                state = host._state,
                path,
                getter,
                val,
                cfg;

            _yuitest_coverline("build/attribute-core/attribute-core.js", 632);
if (name.indexOf(DOT) !== -1) {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 633);
path = name.split(DOT);
                _yuitest_coverline("build/attribute-core/attribute-core.js", 634);
name = path.shift();
            }

            // On Demand - Should be rare - handles out of order valueFn references
            _yuitest_coverline("build/attribute-core/attribute-core.js", 638);
if (host._tCfgs && host._tCfgs[name]) {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 639);
cfg = {};
                _yuitest_coverline("build/attribute-core/attribute-core.js", 640);
cfg[name] = host._tCfgs[name];
                _yuitest_coverline("build/attribute-core/attribute-core.js", 641);
delete host._tCfgs[name];
                _yuitest_coverline("build/attribute-core/attribute-core.js", 642);
host._addAttrs(cfg, host._tVals);
            }
            
            // Lazy Init
            _yuitest_coverline("build/attribute-core/attribute-core.js", 646);
if (host._isLazyAttr(name)) {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 647);
host._addLazyAttr(name);
            }

            _yuitest_coverline("build/attribute-core/attribute-core.js", 650);
val = host._getStateVal(name);
                        
            _yuitest_coverline("build/attribute-core/attribute-core.js", 652);
getter = state.get(name, GETTER);

            _yuitest_coverline("build/attribute-core/attribute-core.js", 654);
if (getter && !getter.call) {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 655);
getter = this[getter];
            }

            _yuitest_coverline("build/attribute-core/attribute-core.js", 658);
val = (getter) ? getter.call(host, val, fullName) : val;
            _yuitest_coverline("build/attribute-core/attribute-core.js", 659);
val = (path) ? O.getValue(val, path) : val;

            _yuitest_coverline("build/attribute-core/attribute-core.js", 661);
return val;
        },

        /**
         * Gets the stored value for the attribute, from either the 
         * internal state object, or the state proxy if it exits
         * 
         * @method _getStateVal
         * @private
         * @param {String} name The name of the attribute
         * @return {Any} The stored value of the attribute
         */
        _getStateVal : function(name) {
            _yuitest_coverfunc("build/attribute-core/attribute-core.js", "_getStateVal", 673);
_yuitest_coverline("build/attribute-core/attribute-core.js", 674);
var stateProxy = this._stateProxy;
            _yuitest_coverline("build/attribute-core/attribute-core.js", 675);
return stateProxy && (name in stateProxy) && !this._state.get(name, BYPASS_PROXY) ? stateProxy[name] : this._state.get(name, VALUE);
        },

        /**
         * Sets the stored value for the attribute, in either the 
         * internal state object, or the state proxy if it exits
         *
         * @method _setStateVal
         * @private
         * @param {String} name The name of the attribute
         * @param {Any} value The value of the attribute
         */
        _setStateVal : function(name, value) {
            _yuitest_coverfunc("build/attribute-core/attribute-core.js", "_setStateVal", 687);
_yuitest_coverline("build/attribute-core/attribute-core.js", 688);
var stateProxy = this._stateProxy;
            _yuitest_coverline("build/attribute-core/attribute-core.js", 689);
if (stateProxy && (name in stateProxy) && !this._state.get(name, BYPASS_PROXY)) {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 690);
stateProxy[name] = value;
            } else {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 692);
this._state.add(name, VALUE, value);
            }
        },

        /**
         * Updates the stored value of the attribute in the privately held State object,
         * if validation and setter passes.
         *
         * @method _setAttrVal
         * @private
         * @param {String} attrName The attribute name.
         * @param {String} subAttrName The sub-attribute name, if setting a sub-attribute property ("x.y.z").
         * @param {Any} prevVal The currently stored value of the attribute.
         * @param {Any} newVal The value which is going to be stored.
         * 
         * @return {booolean} true if the new attribute value was stored, false if not.
         */
        _setAttrVal : function(attrName, subAttrName, prevVal, newVal) {

            _yuitest_coverfunc("build/attribute-core/attribute-core.js", "_setAttrVal", 709);
_yuitest_coverline("build/attribute-core/attribute-core.js", 711);
var host = this,
                allowSet = true,
                cfg = this._state.getAll(attrName, true) || {},
                validator = cfg.validator,
                setter = cfg.setter,
                initializing = cfg.initializing,
                prevRawVal = this._getStateVal(attrName),
                name = subAttrName || attrName,
                retVal,
                valid;

            _yuitest_coverline("build/attribute-core/attribute-core.js", 722);
if (validator) {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 723);
if (!validator.call) { 
                    // Assume string - trying to keep critical path tight, so avoiding Lang check
                    _yuitest_coverline("build/attribute-core/attribute-core.js", 725);
validator = this[validator];
                }
                _yuitest_coverline("build/attribute-core/attribute-core.js", 727);
if (validator) {
                    _yuitest_coverline("build/attribute-core/attribute-core.js", 728);
valid = validator.call(host, newVal, name);

                    _yuitest_coverline("build/attribute-core/attribute-core.js", 730);
if (!valid && initializing) {
                        _yuitest_coverline("build/attribute-core/attribute-core.js", 731);
newVal = cfg.defaultValue;
                        _yuitest_coverline("build/attribute-core/attribute-core.js", 732);
valid = true; // Assume it's valid, for perf.
                    }
                }
            }

            _yuitest_coverline("build/attribute-core/attribute-core.js", 737);
if (!validator || valid) {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 738);
if (setter) {
                    _yuitest_coverline("build/attribute-core/attribute-core.js", 739);
if (!setter.call) {
                        // Assume string - trying to keep critical path tight, so avoiding Lang check
                        _yuitest_coverline("build/attribute-core/attribute-core.js", 741);
setter = this[setter];
                    }
                    _yuitest_coverline("build/attribute-core/attribute-core.js", 743);
if (setter) {
                        _yuitest_coverline("build/attribute-core/attribute-core.js", 744);
retVal = setter.call(host, newVal, name);

                        _yuitest_coverline("build/attribute-core/attribute-core.js", 746);
if (retVal === INVALID_VALUE) {
                            _yuitest_coverline("build/attribute-core/attribute-core.js", 747);
allowSet = false;
                        } else {_yuitest_coverline("build/attribute-core/attribute-core.js", 748);
if (retVal !== undefined){
                            _yuitest_coverline("build/attribute-core/attribute-core.js", 749);
newVal = retVal;
                        }}
                    }
                }

                _yuitest_coverline("build/attribute-core/attribute-core.js", 754);
if (allowSet) {
                    _yuitest_coverline("build/attribute-core/attribute-core.js", 755);
if(!subAttrName && (newVal === prevRawVal) && !Lang.isObject(newVal)) {
                        _yuitest_coverline("build/attribute-core/attribute-core.js", 756);
allowSet = false;
                    } else {
                        // Store value
                        _yuitest_coverline("build/attribute-core/attribute-core.js", 759);
if (!(INIT_VALUE in cfg)) {
                            _yuitest_coverline("build/attribute-core/attribute-core.js", 760);
cfg.initValue = newVal;
                        }
                        _yuitest_coverline("build/attribute-core/attribute-core.js", 762);
host._setStateVal(attrName, newVal);
                    }
                }

            } else {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 767);
allowSet = false;
            }

            _yuitest_coverline("build/attribute-core/attribute-core.js", 770);
return allowSet;
        },

        /**
         * Sets multiple attribute values.
         *
         * @method setAttrs
         * @param {Object} attrs  An object with attributes name/value pairs.
         * @return {Object} A reference to the host object.
         * @chainable
         */
        setAttrs : function(attrs) {
            _yuitest_coverfunc("build/attribute-core/attribute-core.js", "setAttrs", 781);
_yuitest_coverline("build/attribute-core/attribute-core.js", 782);
return this._setAttrs(attrs);
        },

        /**
         * Implementation behind the public setAttrs method, to set multiple attribute values.
         *
         * @method _setAttrs
         * @protected
         * @param {Object} attrs  An object with attributes name/value pairs.
         * @return {Object} A reference to the host object.
         * @chainable
         */
        _setAttrs : function(attrs) {
            _yuitest_coverfunc("build/attribute-core/attribute-core.js", "_setAttrs", 794);
_yuitest_coverline("build/attribute-core/attribute-core.js", 795);
var attr;
            _yuitest_coverline("build/attribute-core/attribute-core.js", 796);
for (attr in attrs) {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 797);
if ( attrs.hasOwnProperty(attr) ) {
                    _yuitest_coverline("build/attribute-core/attribute-core.js", 798);
this.set(attr, attrs[attr]);
                }
            }
            _yuitest_coverline("build/attribute-core/attribute-core.js", 801);
return this;
        },

        /**
         * Gets multiple attribute values.
         *
         * @method getAttrs
         * @param {Array | boolean} attrs Optional. An array of attribute names. If omitted, all attribute values are
         * returned. If set to true, all attributes modified from their initial values are returned.
         * @return {Object} An object with attribute name/value pairs.
         */
        getAttrs : function(attrs) {
            _yuitest_coverfunc("build/attribute-core/attribute-core.js", "getAttrs", 812);
_yuitest_coverline("build/attribute-core/attribute-core.js", 813);
return this._getAttrs(attrs);
        },

        /**
         * Implementation behind the public getAttrs method, to get multiple attribute values.
         *
         * @method _getAttrs
         * @protected
         * @param {Array | boolean} attrs Optional. An array of attribute names. If omitted, all attribute values are
         * returned. If set to true, all attributes modified from their initial values are returned.
         * @return {Object} An object with attribute name/value pairs.
         */
        _getAttrs : function(attrs) {
            _yuitest_coverfunc("build/attribute-core/attribute-core.js", "_getAttrs", 825);
_yuitest_coverline("build/attribute-core/attribute-core.js", 826);
var obj = {},
                attr, i, len,
                modifiedOnly = (attrs === true);

            // TODO - figure out how to get all "added"
            _yuitest_coverline("build/attribute-core/attribute-core.js", 831);
if (!attrs || modifiedOnly) {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 832);
attrs = O.keys(this._state.data);
            }

            _yuitest_coverline("build/attribute-core/attribute-core.js", 835);
for (i = 0, len = attrs.length; i < len; i++) {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 836);
attr = attrs[i];

                _yuitest_coverline("build/attribute-core/attribute-core.js", 838);
if (!modifiedOnly || this._getStateVal(attr) != this._state.get(attr, INIT_VALUE)) {
                    // Go through get, to honor cloning/normalization
                    _yuitest_coverline("build/attribute-core/attribute-core.js", 840);
obj[attr] = this.get(attr);
                }
            }

            _yuitest_coverline("build/attribute-core/attribute-core.js", 844);
return obj;
        },

        /**
         * Configures a group of attributes, and sets initial values.
         *
         * <p>
         * <strong>NOTE:</strong> This method does not isolate the configuration object by merging/cloning. 
         * The caller is responsible for merging/cloning the configuration object if required.
         * </p>
         *
         * @method addAttrs
         * @chainable
         *
         * @param {Object} cfgs An object with attribute name/configuration pairs.
         * @param {Object} values An object with attribute name/value pairs, defining the initial values to apply.
         * Values defined in the cfgs argument will be over-written by values in this argument unless defined as read only.
         * @param {boolean} lazy Whether or not to delay the intialization of these attributes until the first call to get/set.
         * Individual attributes can over-ride this behavior by defining a lazyAdd configuration property in their configuration.
         * See <a href="#method_addAttr">addAttr</a>.
         * 
         * @return {Object} A reference to the host object.
         */
        addAttrs : function(cfgs, values, lazy) {
            _yuitest_coverfunc("build/attribute-core/attribute-core.js", "addAttrs", 867);
_yuitest_coverline("build/attribute-core/attribute-core.js", 868);
var host = this; // help compression
            _yuitest_coverline("build/attribute-core/attribute-core.js", 869);
if (cfgs) {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 870);
host._tCfgs = cfgs;
                _yuitest_coverline("build/attribute-core/attribute-core.js", 871);
host._tVals = host._normAttrVals(values);
                _yuitest_coverline("build/attribute-core/attribute-core.js", 872);
host._addAttrs(cfgs, host._tVals, lazy);
                _yuitest_coverline("build/attribute-core/attribute-core.js", 873);
host._tCfgs = host._tVals = null;
            }

            _yuitest_coverline("build/attribute-core/attribute-core.js", 876);
return host;
        },

        /**
         * Implementation behind the public addAttrs method. 
         * 
         * This method is invoked directly by get if it encounters a scenario 
         * in which an attribute's valueFn attempts to obtain the 
         * value an attribute in the same group of attributes, which has not yet 
         * been added (on demand initialization).
         *
         * @method _addAttrs
         * @private
         * @param {Object} cfgs An object with attribute name/configuration pairs.
         * @param {Object} values An object with attribute name/value pairs, defining the initial values to apply.
         * Values defined in the cfgs argument will be over-written by values in this argument unless defined as read only.
         * @param {boolean} lazy Whether or not to delay the intialization of these attributes until the first call to get/set.
         * Individual attributes can over-ride this behavior by defining a lazyAdd configuration property in their configuration.
         * See <a href="#method_addAttr">addAttr</a>.
         */
        _addAttrs : function(cfgs, values, lazy) {
            _yuitest_coverfunc("build/attribute-core/attribute-core.js", "_addAttrs", 896);
_yuitest_coverline("build/attribute-core/attribute-core.js", 897);
var host = this, // help compression
                attr,
                attrCfg,
                value;

            _yuitest_coverline("build/attribute-core/attribute-core.js", 902);
for (attr in cfgs) {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 903);
if (cfgs.hasOwnProperty(attr)) {

                    // Not Merging. Caller is responsible for isolating configs
                    _yuitest_coverline("build/attribute-core/attribute-core.js", 906);
attrCfg = cfgs[attr];
                    _yuitest_coverline("build/attribute-core/attribute-core.js", 907);
attrCfg.defaultValue = attrCfg.value;

                    // Handle simple, complex and user values, accounting for read-only
                    _yuitest_coverline("build/attribute-core/attribute-core.js", 910);
value = host._getAttrInitVal(attr, attrCfg, host._tVals);

                    _yuitest_coverline("build/attribute-core/attribute-core.js", 912);
if (value !== undefined) {
                        _yuitest_coverline("build/attribute-core/attribute-core.js", 913);
attrCfg.value = value;
                    }

                    _yuitest_coverline("build/attribute-core/attribute-core.js", 916);
if (host._tCfgs[attr]) {
                        _yuitest_coverline("build/attribute-core/attribute-core.js", 917);
delete host._tCfgs[attr];
                    }

                    _yuitest_coverline("build/attribute-core/attribute-core.js", 920);
host.addAttr(attr, attrCfg, lazy);
                }
            }
        },

        /**
         * Utility method to protect an attribute configuration
         * hash, by merging the entire object and the individual 
         * attr config objects. 
         *
         * @method _protectAttrs
         * @protected
         * @param {Object} attrs A hash of attribute to configuration object pairs.
         * @return {Object} A protected version of the attrs argument.
         */
        _protectAttrs : function(attrs) {
            _yuitest_coverfunc("build/attribute-core/attribute-core.js", "_protectAttrs", 935);
_yuitest_coverline("build/attribute-core/attribute-core.js", 936);
if (attrs) {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 937);
attrs = Y.merge(attrs);
                _yuitest_coverline("build/attribute-core/attribute-core.js", 938);
for (var attr in attrs) {
                    _yuitest_coverline("build/attribute-core/attribute-core.js", 939);
if (attrs.hasOwnProperty(attr)) {
                        _yuitest_coverline("build/attribute-core/attribute-core.js", 940);
attrs[attr] = Y.merge(attrs[attr]);
                    }
                }
            }
            _yuitest_coverline("build/attribute-core/attribute-core.js", 944);
return attrs;
        },

        /**
         * Utility method to normalize attribute values. The base implementation 
         * simply merges the hash to protect the original.
         *
         * @method _normAttrVals
         * @param {Object} valueHash An object with attribute name/value pairs
         *
         * @return {Object}
         *
         * @private
         */
        _normAttrVals : function(valueHash) {
            _yuitest_coverfunc("build/attribute-core/attribute-core.js", "_normAttrVals", 958);
_yuitest_coverline("build/attribute-core/attribute-core.js", 959);
return (valueHash) ? Y.merge(valueHash) : null;
        },

        /**
         * Returns the initial value of the given attribute from
         * either the default configuration provided, or the 
         * over-ridden value if it exists in the set of initValues 
         * provided and the attribute is not read-only.
         *
         * @param {String} attr The name of the attribute
         * @param {Object} cfg The attribute configuration object
         * @param {Object} initValues The object with simple and complex attribute name/value pairs returned from _normAttrVals
         *
         * @return {Any} The initial value of the attribute.
         *
         * @method _getAttrInitVal
         * @private
         */
        _getAttrInitVal : function(attr, cfg, initValues) {
            _yuitest_coverfunc("build/attribute-core/attribute-core.js", "_getAttrInitVal", 977);
_yuitest_coverline("build/attribute-core/attribute-core.js", 978);
var val, valFn;
            // init value is provided by the user if it exists, else, provided by the config
            _yuitest_coverline("build/attribute-core/attribute-core.js", 980);
if (!cfg.readOnly && initValues && initValues.hasOwnProperty(attr)) {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 981);
val = initValues[attr];
            } else {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 983);
val = cfg.value;
                _yuitest_coverline("build/attribute-core/attribute-core.js", 984);
valFn = cfg.valueFn;
 
                _yuitest_coverline("build/attribute-core/attribute-core.js", 986);
if (valFn) {
                    _yuitest_coverline("build/attribute-core/attribute-core.js", 987);
if (!valFn.call) {
                        _yuitest_coverline("build/attribute-core/attribute-core.js", 988);
valFn = this[valFn];
                    }
                    _yuitest_coverline("build/attribute-core/attribute-core.js", 990);
if (valFn) {
                        _yuitest_coverline("build/attribute-core/attribute-core.js", 991);
val = valFn.call(this, attr);
                    }
                }
            }


            _yuitest_coverline("build/attribute-core/attribute-core.js", 997);
return val;
        },

        /**
         * Utility method to set up initial attributes defined during construction, either through the constructor.ATTRS property, or explicitly passed in.
         * 
         * @method _initAttrs
         * @protected
         * @param attrs {Object} The attributes to add during construction (passed through to <a href="#method_addAttrs">addAttrs</a>). These can also be defined on the constructor being augmented with Attribute by defining the ATTRS property on the constructor.
         * @param values {Object} The initial attribute values to apply (passed through to <a href="#method_addAttrs">addAttrs</a>). These are not merged/cloned. The caller is responsible for isolating user provided values if required.
         * @param lazy {boolean} Whether or not to add attributes lazily (passed through to <a href="#method_addAttrs">addAttrs</a>).
         */
        _initAttrs : function(attrs, values, lazy) {
            // ATTRS support for Node, which is not Base based
            _yuitest_coverfunc("build/attribute-core/attribute-core.js", "_initAttrs", 1009);
_yuitest_coverline("build/attribute-core/attribute-core.js", 1011);
attrs = attrs || this.constructor.ATTRS;
    
            _yuitest_coverline("build/attribute-core/attribute-core.js", 1013);
var Base = Y.Base,
                BaseCore = Y.BaseCore,
                baseInst = (Base && Y.instanceOf(this, Base)),
                baseCoreInst = (!baseInst && BaseCore && Y.instanceOf(this, BaseCore));

            _yuitest_coverline("build/attribute-core/attribute-core.js", 1018);
if ( attrs && !baseInst && !baseCoreInst) {
                _yuitest_coverline("build/attribute-core/attribute-core.js", 1019);
this.addAttrs(this._protectAttrs(attrs), values, lazy);
            }
        }
    };

    _yuitest_coverline("build/attribute-core/attribute-core.js", 1024);
Y.AttributeCore = AttributeCore;


}, '3.7.3', {"requires": ["oop"]});
