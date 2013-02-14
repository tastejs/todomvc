/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('attribute-extras', function (Y, NAME) {

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
     * The attribute-extras submodule provides less commonly used attribute methods, and can 
     * be augmented/mixed into an implemention which used attribute-core.
     *
     * @module attribute
     * @submodule attribute-extras
     */
    var BROADCAST = "broadcast",
        PUBLISHED = "published",
        INIT_VALUE = "initValue",

        MODIFIABLE = {
            readOnly:1,
            writeOnce:1,
            getter:1,
            broadcast:1
        };

    /**
     * A augmentable implementation for AttributeCore, providing less frequently used 
     * methods for Attribute management such as modifyAttrs(), removeAttr and reset()   
     *
     * @class AttributeExtras
     */
    function AttributeExtras() {}

    AttributeExtras.prototype = {

        /**
         * Updates the configuration of an attribute which has already been added.
         * <p>
         * The properties which can be modified through this interface are limited
         * to the following subset of attributes, which can be safely modified
         * after a value has already been set on the attribute: readOnly, writeOnce, 
         * broadcast and getter.
         * </p>
         * @method modifyAttr
         * @param {String} name The name of the attribute whose configuration is to be updated.
         * @param {Object} config An object with configuration property/value pairs, specifying the configuration properties to modify.
         */
        modifyAttr: function(name, config) {
            var host = this, // help compression
                prop, state;

            if (host.attrAdded(name)) {

                if (host._isLazyAttr(name)) {
                    host._addLazyAttr(name);
                }

                state = host._state;
                for (prop in config) {
                    if (MODIFIABLE[prop] && config.hasOwnProperty(prop)) {
                        state.add(name, prop, config[prop]);

                        // If we reconfigured broadcast, need to republish
                        if (prop === BROADCAST) {
                            state.remove(name, PUBLISHED);
                        }
                    }
                }
            }

        },

        /**
         * Removes an attribute from the host object
         *
         * @method removeAttr
         * @param {String} name The name of the attribute to be removed.
         */
        removeAttr: function(name) {
            this._state.removeAll(name);
        },

        /**
         * Resets the attribute (or all attributes) to its initial value, as long as
         * the attribute is not readOnly, or writeOnce.
         *
         * @method reset
         * @param {String} name Optional. The name of the attribute to reset.  If omitted, all attributes are reset.
         * @return {Object} A reference to the host object.
         * @chainable
         */
        reset : function(name) {
            var host = this;  // help compression

            if (name) {
                if (host._isLazyAttr(name)) {
                    host._addLazyAttr(name);
                }
                host.set(name, host._state.get(name, INIT_VALUE));
            } else {
                Y.each(host._state.data, function(v, n) {
                    host.reset(n);
                });
            }
            return host;
        },

        /**
         * Returns an object with the configuration properties (and value)
         * for the given attribute. If attrName is not provided, returns the
         * configuration properties for all attributes.
         *
         * @method _getAttrCfg
         * @protected
         * @param {String} name Optional. The attribute name. If not provided, the method will return the configuration for all attributes.
         * @return {Object} The configuration properties for the given attribute, or all attributes.
         */
        _getAttrCfg : function(name) {
            var o,
                state = this._state;

            if (name) {
                o = state.getAll(name) || {};
            } else {
                o = {};
                Y.each(state.data, function(v, n) {
                    o[n] = state.getAll(n);
                }); 
            }

            return o;
        }
    };

    Y.AttributeExtras = AttributeExtras;


}, '3.7.3', {"requires": ["oop"]});
