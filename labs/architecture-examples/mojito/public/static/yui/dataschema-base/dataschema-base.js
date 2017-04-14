/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('dataschema-base', function (Y, NAME) {

/**
 * The DataSchema utility provides a common configurable interface for widgets to
 * apply a given schema to a variety of data.
 *
 * @module dataschema
 * @main dataschema
 */

/**
 * Provides the base DataSchema implementation, which can be extended to 
 * create DataSchemas for specific data formats, such XML, JSON, text and
 * arrays.
 *
 * @module dataschema
 * @submodule dataschema-base
 */

var LANG = Y.Lang,
/**
 * Base class for the YUI DataSchema Utility.
 * @class DataSchema.Base
 * @static
 */
    SchemaBase = {
    /**
     * Overridable method returns data as-is.
     *
     * @method apply
     * @param schema {Object} Schema to apply.
     * @param data {Object} Data.
     * @return {Object} Schema-parsed data.
     * @static
     */
    apply: function(schema, data) {
        return data;
    },
    
    /**
     * Applies field parser, if defined
     *
     * @method parse
     * @param value {Object} Original value.
     * @param field {Object} Field.
     * @return {Object} Type-converted value.
     */
    parse: function(value, field) {
        if(field.parser) {
            var parser = (LANG.isFunction(field.parser)) ?
            field.parser : Y.Parsers[field.parser+''];
            if(parser) {
                value = parser.call(this, value);
            }
            else {
            }
        }
        return value;
    }
};

Y.namespace("DataSchema").Base = SchemaBase;
Y.namespace("Parsers");


}, '3.7.3', {"requires": ["base"]});
