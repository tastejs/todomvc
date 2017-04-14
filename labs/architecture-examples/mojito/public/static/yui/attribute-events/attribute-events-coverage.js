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
_yuitest_coverage["build/attribute-events/attribute-events.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/attribute-events/attribute-events.js",
    code: []
};
_yuitest_coverage["build/attribute-events/attribute-events.js"].code=["YUI.add('attribute-events', function (Y, NAME) {","","    /**","     * The attribute module provides an augmentable Attribute implementation, which ","     * adds configurable attributes and attribute change events to the class being ","     * augmented. It also provides a State class, which is used internally by Attribute,","     * but can also be used independently to provide a name/property/value data structure to","     * store state.","     *","     * @module attribute","     */","","    /**","     * The attribute-events submodule provides augmentable attribute change event support ","     * for AttributeCore based implementations.","     *","     * @module attribute","     * @submodule attribute-events","     */","    var EventTarget = Y.EventTarget,","","        CHANGE = \"Change\",","        BROADCAST = \"broadcast\",","        PUBLISHED = \"published\";","","    /**","     * Provides an augmentable implementation of attribute change events for ","     * AttributeCore. ","     *","     * @class AttributeEvents","     * @uses EventTarget","     */","    function AttributeEvents() {","        // Perf tweak - avoid creating event literals if not required.","        this._ATTR_E_FACADE = {};","        EventTarget.call(this, {emitFacade:true});","    }","","    AttributeEvents._ATTR_CFG = [BROADCAST];","","    AttributeEvents.prototype = {","","        /**","         * Sets the value of an attribute.","         *","         * @method set","         * @chainable","         *","         * @param {String} name The name of the attribute. If the ","         * current value of the attribute is an Object, dot notation can be used","         * to set the value of a property within the object (e.g. <code>set(\"x.y.z\", 5)</code>).","         *","         * @param {Any} value The value to set the attribute to.","         *","         * @param {Object} opts (Optional) Optional event data to be mixed into","         * the event facade passed to subscribers of the attribute's change event. This ","         * can be used as a flexible way to identify the source of a call to set, allowing ","         * the developer to distinguish between set called internally by the host, vs. ","         * set called externally by the application developer.","         *","         * @return {Object} A reference to the host object.","         */","        set : function(name, val, opts) {","            return this._setAttr(name, val, opts);","        },","","        /**","         * Allows setting of readOnly/writeOnce attributes. See <a href=\"#method_set\">set</a> for argument details.","         *","         * @method _set","         * @protected","         * @chainable","         * ","         * @param {String} name The name of the attribute.","         * @param {Any} val The value to set the attribute to.","         * @param {Object} opts (Optional) Optional event data to be mixed into","         * the event facade passed to subscribers of the attribute's change event.","         * @return {Object} A reference to the host object.","         */","        _set : function(name, val, opts) {","            return this._setAttr(name, val, opts, true);","        },","","        /**","         * Sets multiple attribute values.","         *","         * @method setAttrs","         * @param {Object} attrs  An object with attributes name/value pairs.","         * @param {Object} opts  Properties to mix into the event payload. These are shared and mixed into each set ","         * @return {Object} A reference to the host object.","         * @chainable","         */","        setAttrs : function(attrs, opts) {","            return this._setAttrs(attrs, opts);","        },","","        /**","         * Implementation behind the public setAttrs method, to set multiple attribute values.","         *","         * @method _setAttrs","         * @protected","         * @param {Object} attrs  An object with attributes name/value pairs.","         * @param {Object} opts  Properties to mix into the event payload. These are shared and mixed into each set ","         * @return {Object} A reference to the host object.","         * @chainable","         */","        _setAttrs : function(attrs, opts) {","            var attr;","            for (attr in attrs) {","                if ( attrs.hasOwnProperty(attr) ) {","                    this.set(attr, attrs[attr], opts);","                }","            }","            return this;","        },","","        /**","         * Utility method to help setup the event payload and fire the attribute change event.","         * ","         * @method _fireAttrChange","         * @private","         * @param {String} attrName The name of the attribute","         * @param {String} subAttrName The full path of the property being changed, ","         * if this is a sub-attribute value being change. Otherwise null.","         * @param {Any} currVal The current value of the attribute","         * @param {Any} newVal The new value of the attribute","         * @param {Object} opts Any additional event data to mix into the attribute change event's event facade.","         */","        _fireAttrChange : function(attrName, subAttrName, currVal, newVal, opts) {","            var host = this,","                eventName = attrName + CHANGE,","                state = host._state,","                facade,","                broadcast,","                evtCfg;","","            if (!state.get(attrName, PUBLISHED)) {","                ","                evtCfg = {","                    queuable:false,","                    defaultTargetOnly: true, ","                    defaultFn:host._defAttrChangeFn, ","                    silent:true","                };","","                broadcast = state.get(attrName, BROADCAST);","                if (broadcast !== undefined) {","                    evtCfg.broadcast = broadcast;","                }","","                host.publish(eventName, evtCfg);","                ","                state.add(attrName, PUBLISHED, true);","            }","","            facade = (opts) ? Y.merge(opts) : host._ATTR_E_FACADE;","","            // Not using the single object signature for fire({type:..., newVal:...}), since ","            // we don't want to override type. Changed to the fire(type, {newVal:...}) signature.","","            // facade.type = eventName;","            facade.attrName = attrName;","            facade.subAttrName = subAttrName;","            facade.prevVal = currVal;","            facade.newVal = newVal;","","            // host.fire(facade);","            host.fire(eventName, facade);","        },","","        /**","         * Default function for attribute change events.","         *","         * @private","         * @method _defAttrChangeFn","         * @param {EventFacade} e The event object for attribute change events.","         */","        _defAttrChangeFn : function(e) {","            if (!this._setAttrVal(e.attrName, e.subAttrName, e.prevVal, e.newVal)) {","                // Prevent \"after\" listeners from being invoked since nothing changed.","                e.stopImmediatePropagation();","            } else {","                e.newVal = this.get(e.attrName);","            }","        }","    };","","    // Basic prototype augment - no lazy constructor invocation.","    Y.mix(AttributeEvents, EventTarget, false, null, 1);","","    Y.AttributeEvents = AttributeEvents;","","","}, '3.7.3', {\"requires\": [\"event-custom\"]});"];
_yuitest_coverage["build/attribute-events/attribute-events.js"].lines = {"1":0,"20":0,"33":0,"35":0,"36":0,"39":0,"41":0,"64":0,"81":0,"94":0,"108":0,"109":0,"110":0,"111":0,"114":0,"130":0,"137":0,"139":0,"146":0,"147":0,"148":0,"151":0,"153":0,"156":0,"162":0,"163":0,"164":0,"165":0,"168":0,"179":0,"181":0,"183":0,"189":0,"191":0};
_yuitest_coverage["build/attribute-events/attribute-events.js"].functions = {"AttributeEvents:33":0,"set:63":0,"_set:80":0,"setAttrs:93":0,"_setAttrs:107":0,"_fireAttrChange:129":0,"_defAttrChangeFn:178":0,"(anonymous 1):1":0};
_yuitest_coverage["build/attribute-events/attribute-events.js"].coveredLines = 34;
_yuitest_coverage["build/attribute-events/attribute-events.js"].coveredFunctions = 8;
_yuitest_coverline("build/attribute-events/attribute-events.js", 1);
YUI.add('attribute-events', function (Y, NAME) {

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
     * The attribute-events submodule provides augmentable attribute change event support 
     * for AttributeCore based implementations.
     *
     * @module attribute
     * @submodule attribute-events
     */
    _yuitest_coverfunc("build/attribute-events/attribute-events.js", "(anonymous 1)", 1);
_yuitest_coverline("build/attribute-events/attribute-events.js", 20);
var EventTarget = Y.EventTarget,

        CHANGE = "Change",
        BROADCAST = "broadcast",
        PUBLISHED = "published";

    /**
     * Provides an augmentable implementation of attribute change events for 
     * AttributeCore. 
     *
     * @class AttributeEvents
     * @uses EventTarget
     */
    _yuitest_coverline("build/attribute-events/attribute-events.js", 33);
function AttributeEvents() {
        // Perf tweak - avoid creating event literals if not required.
        _yuitest_coverfunc("build/attribute-events/attribute-events.js", "AttributeEvents", 33);
_yuitest_coverline("build/attribute-events/attribute-events.js", 35);
this._ATTR_E_FACADE = {};
        _yuitest_coverline("build/attribute-events/attribute-events.js", 36);
EventTarget.call(this, {emitFacade:true});
    }

    _yuitest_coverline("build/attribute-events/attribute-events.js", 39);
AttributeEvents._ATTR_CFG = [BROADCAST];

    _yuitest_coverline("build/attribute-events/attribute-events.js", 41);
AttributeEvents.prototype = {

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
         * @param {Object} opts (Optional) Optional event data to be mixed into
         * the event facade passed to subscribers of the attribute's change event. This 
         * can be used as a flexible way to identify the source of a call to set, allowing 
         * the developer to distinguish between set called internally by the host, vs. 
         * set called externally by the application developer.
         *
         * @return {Object} A reference to the host object.
         */
        set : function(name, val, opts) {
            _yuitest_coverfunc("build/attribute-events/attribute-events.js", "set", 63);
_yuitest_coverline("build/attribute-events/attribute-events.js", 64);
return this._setAttr(name, val, opts);
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
         * @param {Object} opts (Optional) Optional event data to be mixed into
         * the event facade passed to subscribers of the attribute's change event.
         * @return {Object} A reference to the host object.
         */
        _set : function(name, val, opts) {
            _yuitest_coverfunc("build/attribute-events/attribute-events.js", "_set", 80);
_yuitest_coverline("build/attribute-events/attribute-events.js", 81);
return this._setAttr(name, val, opts, true);
        },

        /**
         * Sets multiple attribute values.
         *
         * @method setAttrs
         * @param {Object} attrs  An object with attributes name/value pairs.
         * @param {Object} opts  Properties to mix into the event payload. These are shared and mixed into each set 
         * @return {Object} A reference to the host object.
         * @chainable
         */
        setAttrs : function(attrs, opts) {
            _yuitest_coverfunc("build/attribute-events/attribute-events.js", "setAttrs", 93);
_yuitest_coverline("build/attribute-events/attribute-events.js", 94);
return this._setAttrs(attrs, opts);
        },

        /**
         * Implementation behind the public setAttrs method, to set multiple attribute values.
         *
         * @method _setAttrs
         * @protected
         * @param {Object} attrs  An object with attributes name/value pairs.
         * @param {Object} opts  Properties to mix into the event payload. These are shared and mixed into each set 
         * @return {Object} A reference to the host object.
         * @chainable
         */
        _setAttrs : function(attrs, opts) {
            _yuitest_coverfunc("build/attribute-events/attribute-events.js", "_setAttrs", 107);
_yuitest_coverline("build/attribute-events/attribute-events.js", 108);
var attr;
            _yuitest_coverline("build/attribute-events/attribute-events.js", 109);
for (attr in attrs) {
                _yuitest_coverline("build/attribute-events/attribute-events.js", 110);
if ( attrs.hasOwnProperty(attr) ) {
                    _yuitest_coverline("build/attribute-events/attribute-events.js", 111);
this.set(attr, attrs[attr], opts);
                }
            }
            _yuitest_coverline("build/attribute-events/attribute-events.js", 114);
return this;
        },

        /**
         * Utility method to help setup the event payload and fire the attribute change event.
         * 
         * @method _fireAttrChange
         * @private
         * @param {String} attrName The name of the attribute
         * @param {String} subAttrName The full path of the property being changed, 
         * if this is a sub-attribute value being change. Otherwise null.
         * @param {Any} currVal The current value of the attribute
         * @param {Any} newVal The new value of the attribute
         * @param {Object} opts Any additional event data to mix into the attribute change event's event facade.
         */
        _fireAttrChange : function(attrName, subAttrName, currVal, newVal, opts) {
            _yuitest_coverfunc("build/attribute-events/attribute-events.js", "_fireAttrChange", 129);
_yuitest_coverline("build/attribute-events/attribute-events.js", 130);
var host = this,
                eventName = attrName + CHANGE,
                state = host._state,
                facade,
                broadcast,
                evtCfg;

            _yuitest_coverline("build/attribute-events/attribute-events.js", 137);
if (!state.get(attrName, PUBLISHED)) {
                
                _yuitest_coverline("build/attribute-events/attribute-events.js", 139);
evtCfg = {
                    queuable:false,
                    defaultTargetOnly: true, 
                    defaultFn:host._defAttrChangeFn, 
                    silent:true
                };

                _yuitest_coverline("build/attribute-events/attribute-events.js", 146);
broadcast = state.get(attrName, BROADCAST);
                _yuitest_coverline("build/attribute-events/attribute-events.js", 147);
if (broadcast !== undefined) {
                    _yuitest_coverline("build/attribute-events/attribute-events.js", 148);
evtCfg.broadcast = broadcast;
                }

                _yuitest_coverline("build/attribute-events/attribute-events.js", 151);
host.publish(eventName, evtCfg);
                
                _yuitest_coverline("build/attribute-events/attribute-events.js", 153);
state.add(attrName, PUBLISHED, true);
            }

            _yuitest_coverline("build/attribute-events/attribute-events.js", 156);
facade = (opts) ? Y.merge(opts) : host._ATTR_E_FACADE;

            // Not using the single object signature for fire({type:..., newVal:...}), since 
            // we don't want to override type. Changed to the fire(type, {newVal:...}) signature.

            // facade.type = eventName;
            _yuitest_coverline("build/attribute-events/attribute-events.js", 162);
facade.attrName = attrName;
            _yuitest_coverline("build/attribute-events/attribute-events.js", 163);
facade.subAttrName = subAttrName;
            _yuitest_coverline("build/attribute-events/attribute-events.js", 164);
facade.prevVal = currVal;
            _yuitest_coverline("build/attribute-events/attribute-events.js", 165);
facade.newVal = newVal;

            // host.fire(facade);
            _yuitest_coverline("build/attribute-events/attribute-events.js", 168);
host.fire(eventName, facade);
        },

        /**
         * Default function for attribute change events.
         *
         * @private
         * @method _defAttrChangeFn
         * @param {EventFacade} e The event object for attribute change events.
         */
        _defAttrChangeFn : function(e) {
            _yuitest_coverfunc("build/attribute-events/attribute-events.js", "_defAttrChangeFn", 178);
_yuitest_coverline("build/attribute-events/attribute-events.js", 179);
if (!this._setAttrVal(e.attrName, e.subAttrName, e.prevVal, e.newVal)) {
                // Prevent "after" listeners from being invoked since nothing changed.
                _yuitest_coverline("build/attribute-events/attribute-events.js", 181);
e.stopImmediatePropagation();
            } else {
                _yuitest_coverline("build/attribute-events/attribute-events.js", 183);
e.newVal = this.get(e.attrName);
            }
        }
    };

    // Basic prototype augment - no lazy constructor invocation.
    _yuitest_coverline("build/attribute-events/attribute-events.js", 189);
Y.mix(AttributeEvents, EventTarget, false, null, 1);

    _yuitest_coverline("build/attribute-events/attribute-events.js", 191);
Y.AttributeEvents = AttributeEvents;


}, '3.7.3', {"requires": ["event-custom"]});
