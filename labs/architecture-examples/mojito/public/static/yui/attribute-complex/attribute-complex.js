/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('attribute-complex', function (Y, NAME) {

    /**
     * Adds support for attribute providers to handle complex attributes in the constructor
     *
     * @module attribute
     * @submodule attribute-complex
     * @for Attribute
     */

    var O = Y.Object,
        DOT = ".";

    Y.Attribute.Complex = function() {};
    Y.Attribute.Complex.prototype = {

        /**
         * Utility method to split out simple attribute name/value pairs ("x") 
         * from complex attribute name/value pairs ("x.y.z"), so that complex
         * attributes can be keyed by the top level attribute name.
         *
         * @method _normAttrVals
         * @param {Object} valueHash An object with attribute name/value pairs
         *
         * @return {Object} An object literal with 2 properties - "simple" and "complex",
         * containing simple and complex attribute values respectively keyed 
         * by the top level attribute name, or null, if valueHash is falsey.
         *
         * @private
         */
        _normAttrVals : function(valueHash) {
            var vals = {},
                subvals = {},
                path,
                attr,
                v, k;

            if (valueHash) {
                for (k in valueHash) {
                    if (valueHash.hasOwnProperty(k)) {
                        if (k.indexOf(DOT) !== -1) {
                            path = k.split(DOT);
                            attr = path.shift();
                            v = subvals[attr] = subvals[attr] || [];
                            v[v.length] = {
                                path : path,
                                value: valueHash[k]
                            };
                        } else {
                            vals[k] = valueHash[k];
                        }
                    }
                }
                return { simple:vals, complex:subvals };
            } else {
                return null;
            }
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

            var val = cfg.value,
                valFn = cfg.valueFn,
                tmpVal,
                initValSet = false,
                simple,
                complex,
                i,
                l,
                path,
                subval,
                subvals;

            if (!cfg.readOnly && initValues) {
                // Simple Attributes
                simple = initValues.simple;
                if (simple && simple.hasOwnProperty(attr)) {
                    val = simple[attr];
                    initValSet = true;
                }
            }

            if (valFn && !initValSet) {
                if (!valFn.call) {
                    valFn = this[valFn];
                }
                if (valFn) {
                    tmpVal = valFn.call(this, attr);
                    val = tmpVal;
                }
            }

            if (!cfg.readOnly && initValues) {

                // Complex Attributes (complex values applied, after simple, in case both are set)
                complex = initValues.complex;

                if (complex && complex.hasOwnProperty(attr) && (val !== undefined) && (val !== null)) {
                    subvals = complex[attr];
                    for (i = 0, l = subvals.length; i < l; ++i) {
                        path = subvals[i].path;
                        subval = subvals[i].value;
                        O.setValue(val, path, subval);
                    }
                }
            }

            return val;
        }
    };

    Y.mix(Y.Attribute, Y.Attribute.Complex, true, null, 1);

    // Consistency with the rest of the Attribute addons for now. 
    Y.AttributeComplex = Y.Attribute.Complex;


}, '3.7.3', {"requires": ["attribute-base"]});
