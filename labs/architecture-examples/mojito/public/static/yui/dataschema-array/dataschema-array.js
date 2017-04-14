/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('dataschema-array', function (Y, NAME) {

/**
 * Provides a DataSchema implementation which can be used to work with data
 * stored in arrays.
 *
 * @module dataschema
 * @submodule dataschema-array
 */

/**
Provides a DataSchema implementation which can be used to work with data
stored in arrays.

See the `apply` method below for usage.

@class DataSchema.Array
@extends DataSchema.Base
@static
**/
var LANG = Y.Lang,

    SchemaArray = {

        ////////////////////////////////////////////////////////////////////////
        //
        // DataSchema.Array static methods
        //
        ////////////////////////////////////////////////////////////////////////

        /**
        Applies a schema to an array of data, returning a normalized object
        with results in the `results` property. The `meta` property of the
        response object is present for consistency, but is assigned an empty
        object.  If the input data is absent or not an array, an `error`
        property will be added.

        The input array is expected to contain objects, arrays, or strings.

        If _schema_ is not specified or _schema.resultFields_ is not an array,
        `response.results` will be assigned the input array unchanged.

        When a _schema_ is specified, the following will occur:

        If the input array contains strings, they will be copied as-is into the
        `response.results` array.

        If the input array contains arrays, `response.results` will contain an
        array of objects with key:value pairs assuming the fields in
        _schema.resultFields_ are ordered in accordance with the data array
        values.

        If the input array contains objects, the identified
        _schema.resultFields_ will be used to extract a value from those
        objects for the output result.

        _schema.resultFields_ field identifiers are objects with the following properties:

          * `key`   : <strong>(required)</strong> The locator name (String)
          * `parser`: A function or the name of a function on `Y.Parsers` used
                to convert the input value into a normalized type.  Parser
                functions are passed the value as input and are expected to
                return a value.

        If no value parsing is needed, you can use strings as identifiers
        instead of objects (see example below).

        @example
            // Process array of arrays
            var schema = { resultFields: [ 'fruit', 'color' ] },
                data = [
                    [ 'Banana', 'yellow' ],
                    [ 'Orange', 'orange' ],
                    [ 'Eggplant', 'purple' ]
                ];

            var response = Y.DataSchema.Array.apply(schema, data);

            // response.results[0] is { fruit: "Banana", color: "yellow" }

            
            // Process array of objects
            data = [
                { fruit: 'Banana', color: 'yellow', price: '1.96' },
                { fruit: 'Orange', color: 'orange', price: '2.04' },
                { fruit: 'Eggplant', color: 'purple', price: '4.31' }
            ];

            response = Y.DataSchema.Array.apply(schema, data);

            // response.results[0] is { fruit: "Banana", color: "yellow" }


            // Use parsers
            schema.resultFields = [
                {
                    key: 'fruit',
                    parser: function (val) { return val.toUpperCase(); }
                },
                {
                    key: 'price',
                    parser: 'number' // Uses Y.Parsers.number
                }
            ];

            response = Y.DataSchema.Array.apply(schema, data);

            // Note price was converted from a numeric string to a number
            // response.results[0] looks like { fruit: "BANANA", price: 1.96 }
         
        @method apply
        @param {Object} [schema] Schema to apply.  Supported configuration
            properties are:
          @param {Array} [schema.resultFields] Field identifiers to
              locate/assign values in the response records. See above for
              details.
        @param {Array} data Array data.
        @return {Object} An Object with properties `results` and `meta`
        @static
        **/
        apply: function(schema, data) {
            var data_in = data,
                data_out = {results:[],meta:{}};

            if(LANG.isArray(data_in)) {
                if(schema && LANG.isArray(schema.resultFields)) {
                    // Parse results data
                    data_out = SchemaArray._parseResults.call(this, schema.resultFields, data_in, data_out);
                }
                else {
                    data_out.results = data_in;
                }
            }
            else {
                data_out.error = new Error("Array schema parse failure");
            }

            return data_out;
        },

        /**
         * Schema-parsed list of results from full data
         *
         * @method _parseResults
         * @param fields {Array} Schema to parse against.
         * @param array_in {Array} Array to parse.
         * @param data_out {Object} In-progress parsed data to update.
         * @return {Object} Parsed data object.
         * @static
         * @protected
         */
        _parseResults: function(fields, array_in, data_out) {
            var results = [],
                result, item, type, field, key, value, i, j;

            for(i=array_in.length-1; i>-1; i--) {
                result = {};
                item = array_in[i];
                type = (LANG.isObject(item) && !LANG.isFunction(item)) ? 2 : (LANG.isArray(item)) ? 1 : (LANG.isString(item)) ? 0 : -1;
                if(type > 0) {
                    for(j=fields.length-1; j>-1; j--) {
                        field = fields[j];
                        key = (!LANG.isUndefined(field.key)) ? field.key : field;
                        value = (!LANG.isUndefined(item[key])) ? item[key] : item[j];
                        result[key] = Y.DataSchema.Base.parse.call(this, value, field);
                    }
                }
                else if(type === 0) {
                    result = item;
                }
                else {
                    //TODO: null or {}?
                    result = null;
                }
                results[i] = result;
            }
            data_out.results = results;

            return data_out;
        }
    };

Y.DataSchema.Array = Y.mix(SchemaArray, Y.DataSchema.Base);


}, '3.7.3', {"requires": ["dataschema-base"]});
