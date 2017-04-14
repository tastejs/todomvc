/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('dataschema-text', function (Y, NAME) {

/**
 * Provides a DataSchema implementation which can be used to work with
 * delimited text data.
 *
 * @module dataschema
 * @submodule dataschema-text
 */

/**
Provides a DataSchema implementation which can be used to work with
delimited text data.

See the `apply` method for usage.

@class DataSchema.Text
@extends DataSchema.Base
@static
**/

var Lang = Y.Lang,
    isString = Lang.isString,
    isUndef  = Lang.isUndefined,

    SchemaText = {

        ////////////////////////////////////////////////////////////////////////
        //
        // DataSchema.Text static methods
        //
        ////////////////////////////////////////////////////////////////////////
        /**
        Applies a schema to a string of delimited data, returning a normalized
        object with results in the `results` property. The `meta` property of
        the response object is present for consistency, but is assigned an
        empty object.  If the input data is absent or not a string, an `error`
        property will be added.

        Use _schema.resultDelimiter_ and _schema.fieldDelimiter_ to instruct
        `apply` how to split up the string into an array of data arrays for
        processing.

        Use _schema.resultFields_ to specify the keys in the generated result
        objects in `response.results`. The key:value pairs will be assigned
        in the order of the _schema.resultFields_ array, assuming the values
        in the data records are defined in the same order.

        _schema.resultFields_ field identifiers are objects with the following
        properties:

          * `key`   : <strong>(required)</strong> The property name you want
                the data value assigned to in the result object (String)
          * `parser`: A function or the name of a function on `Y.Parsers` used
                to convert the input value into a normalized type.  Parser
                functions are passed the value as input and are expected to
                return a value.

        If no value parsing is needed, you can use just the desired property
        name string as the field identifier instead of an object (see example
        below).

        @example
            // Process simple csv
            var schema = {
                    resultDelimiter: "\n",
                    fieldDelimiter: ",",
                    resultFields: [ 'fruit', 'color' ]
                },
                data = "Banana,yellow\nOrange,orange\nEggplant,purple";

            var response = Y.DataSchema.Text.apply(schema, data);

            // response.results[0] is { fruit: "Banana", color: "yellow" }


            // Use parsers
            schema.resultFields = [
                {
                    key: 'fruit',
                    parser: function (val) { return val.toUpperCase(); }
                },
                'color' // mix and match objects and strings
            ];

            response = Y.DataSchema.Text.apply(schema, data);

            // response.results[0] is { fruit: "BANANA", color: "yellow" }
         
        @method apply
        @param {Object} schema Schema to apply.  Supported configuration
            properties are:
          @param {String} schema.resultDelimiter Character or character
              sequence that marks the end of one record and the start of
              another.
          @param {String} [schema.fieldDelimiter] Character or character
              sequence that marks the end of a field and the start of
              another within the same record.
          @param {Array} [schema.resultFields] Field identifiers to
              assign values in the response records. See above for details.
        @param {String} data Text data.
        @return {Object} An Object with properties `results` and `meta`
        @static
        **/
        apply: function(schema, data) {
            var data_in = data,
                data_out = { results: [], meta: {} };

            if (isString(data) && schema && isString(schema.resultDelimiter)) {
                // Parse results data
                data_out = SchemaText._parseResults.call(this, schema, data_in, data_out);
            } else {
                Y.log("Text data could not be schema-parsed: " + Y.dump(data) + " " + Y.dump(data), "error", "dataschema-text");
                data_out.error = new Error("Text schema parse failure");
            }

            return data_out;
        },

        /**
         * Schema-parsed list of results from full data
         *
         * @method _parseResults
         * @param schema {Array} Schema to parse against.
         * @param text_in {String} Text to parse.
         * @param data_out {Object} In-progress parsed data to update.
         * @return {Object} Parsed data object.
         * @static
         * @protected
         */
        _parseResults: function(schema, text_in, data_out) {
            var resultDelim = schema.resultDelimiter,
                fieldDelim  = isString(schema.fieldDelimiter) &&
                                schema.fieldDelimiter,
                fields      = schema.resultFields || [],
                results     = [],
                parse       = Y.DataSchema.Base.parse,
                results_in, fields_in, result, item,
                field, key, value, i, j;

            // Delete final delimiter at end of string if there
            if (text_in.slice(-resultDelim.length) === resultDelim) {
                text_in = text_in.slice(0, -resultDelim.length);
            }

            // Split into results
            results_in = text_in.split(schema.resultDelimiter);

            if (fieldDelim) {
                for (i = results_in.length - 1; i >= 0; --i) {
                    result = {};
                    item = results_in[i];

                    fields_in = item.split(schema.fieldDelimiter);

                    for (j = fields.length - 1; j >= 0; --j) {
                        field = fields[j];
                        key = (!isUndef(field.key)) ? field.key : field;
                        // FIXME: unless the key is an array index, this test
                        // for fields_in[key] is useless.
                        value = (!isUndef(fields_in[key])) ?
                                    fields_in[key] :
                                    fields_in[j];

                        result[key] = parse.call(this, value, field);
                    }

                    results[i] = result;
                }
            } else {
                results = results_in;
            }

            data_out.results = results;

            return data_out;
        }
    };

Y.DataSchema.Text = Y.mix(SchemaText, Y.DataSchema.Base);


}, '3.7.3', {"requires": ["dataschema-base"]});
