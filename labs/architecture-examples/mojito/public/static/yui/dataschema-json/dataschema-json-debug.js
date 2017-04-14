/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('dataschema-json', function (Y, NAME) {

/**
Provides a DataSchema implementation which can be used to work with JSON data.

@module dataschema
@submodule dataschema-json
**/

/**
Provides a DataSchema implementation which can be used to work with JSON data.

See the `apply` method for usage.

@class DataSchema.JSON
@extends DataSchema.Base
@static
**/
var LANG = Y.Lang,
    isFunction = LANG.isFunction,
    isObject   = LANG.isObject,
    isArray    = LANG.isArray,
    // TODO: I don't think the calls to Base.* need to be done via Base since
    // Base is mixed into SchemaJSON.  Investigate for later.
    Base       = Y.DataSchema.Base,

    SchemaJSON;
    
SchemaJSON = {

/////////////////////////////////////////////////////////////////////////////
//
// DataSchema.JSON static methods
//
/////////////////////////////////////////////////////////////////////////////
    /**
     * Utility function converts JSON locator strings into walkable paths
     *
     * @method getPath
     * @param locator {String} JSON value locator.
     * @return {String[]} Walkable path to data value.
     * @static
     */
    getPath: function(locator) {
        var path = null,
            keys = [],
            i = 0;

        if (locator) {
            // Strip the ["string keys"] and [1] array indexes
            // TODO: the first two steps can probably be reduced to one with
            // /\[\s*(['"])?(.*?)\1\s*\]/g, but the array indices would be
            // stored as strings.  This is not likely an issue.
            locator = locator.
                replace(/\[\s*(['"])(.*?)\1\s*\]/g,
                function (x,$1,$2) {keys[i]=$2;return '.@'+(i++);}).
                replace(/\[(\d+)\]/g,
                function (x,$1) {keys[i]=parseInt($1,10)|0;return '.@'+(i++);}).
                replace(/^\./,''); // remove leading dot

            // Validate against problematic characters.
            // commented out because the path isn't sent to eval, so it
            // should be safe. I'm not sure what makes a locator invalid.
            //if (!/[^\w\.\$@]/.test(locator)) {
            path = locator.split('.');
            for (i=path.length-1; i >= 0; --i) {
                if (path[i].charAt(0) === '@') {
                    path[i] = keys[parseInt(path[i].substr(1),10)];
                }
            }
            /*}
            else {
                Y.log("Invalid locator: " + locator, "error", "dataschema-json");
            }
            */
        }
        return path;
    },

    /**
     * Utility function to walk a path and return the value located there.
     *
     * @method getLocationValue
     * @param path {String[]} Locator path.
     * @param data {String} Data to traverse.
     * @return {Object} Data value at location.
     * @static
     */
    getLocationValue: function (path, data) {
        var i = 0,
            len = path.length;
        for (;i<len;i++) {
            if (isObject(data) && (path[i] in data)) {
                data = data[path[i]];
            } else {
                data = undefined;
                break;
            }
        }
        return data;
    },

    /**
    Applies a schema to an array of data located in a JSON structure, returning
    a normalized object with results in the `results` property. Additional
    information can be parsed out of the JSON for inclusion in the `meta`
    property of the response object.  If an error is encountered during
    processing, an `error` property will be added.

    The input _data_ is expected to be an object or array.  If it is a string,
    it will be passed through `Y.JSON.parse()`.

    If _data_ contains an array of data records to normalize, specify the
    _schema.resultListLocator_ as a dot separated path string just as you would
    reference it in JavaScript.  So if your _data_ object has a record array at
    _data.response.results_, use _schema.resultListLocator_ =
    "response.results". Bracket notation can also be used for array indices or
    object properties (e.g. "response['results']");  This is called a "path
    locator"

    Field data in the result list is extracted with field identifiers in
    _schema.resultFields_.  Field identifiers are objects with the following
    properties:

      * `key`   : <strong>(required)</strong> The path locator (String)
      * `parser`: A function or the name of a function on `Y.Parsers` used
            to convert the input value into a normalized type.  Parser
            functions are passed the value as input and are expected to
            return a value.

    If no value parsing is needed, you can use path locators (strings) 
    instead of field identifiers (objects) -- see example below.

    If no processing of the result list array is needed, _schema.resultFields_
    can be omitted; the `response.results` will point directly to the array.

    If the result list contains arrays, `response.results` will contain an
    array of objects with key:value pairs assuming the fields in
    _schema.resultFields_ are ordered in accordance with the data array
    values.

    If the result list contains objects, the identified _schema.resultFields_
    will be used to extract a value from those objects for the output result.

    To extract additional information from the JSON, include an array of
    path locators in _schema.metaFields_.  The collected values will be
    stored in `response.meta`.


    @example
        // Process array of arrays
        var schema = {
                resultListLocator: 'produce.fruit',
                resultFields: [ 'name', 'color' ]
            },
            data = {
                produce: {
                    fruit: [
                        [ 'Banana', 'yellow' ],
                        [ 'Orange', 'orange' ],
                        [ 'Eggplant', 'purple' ]
                    ]
                }
            };

        var response = Y.DataSchema.JSON.apply(schema, data);

        // response.results[0] is { name: "Banana", color: "yellow" }

        
        // Process array of objects + some metadata
        schema.metaFields = [ 'lastInventory' ];

        data = {
            produce: {
                fruit: [
                    { name: 'Banana', color: 'yellow', price: '1.96' },
                    { name: 'Orange', color: 'orange', price: '2.04' },
                    { name: 'Eggplant', color: 'purple', price: '4.31' }
                ]
            },
            lastInventory: '2011-07-19'
        };

        response = Y.DataSchema.JSON.apply(schema, data);

        // response.results[0] is { name: "Banana", color: "yellow" }
        // response.meta.lastInventory is '2001-07-19'


        // Use parsers
        schema.resultFields = [
            {
                key: 'name',
                parser: function (val) { return val.toUpperCase(); }
            },
            {
                key: 'price',
                parser: 'number' // Uses Y.Parsers.number
            }
        ];

        response = Y.DataSchema.JSON.apply(schema, data);

        // Note price was converted from a numeric string to a number
        // response.results[0] looks like { fruit: "BANANA", price: 1.96 }
     
    @method apply
    @param {Object} [schema] Schema to apply.  Supported configuration
        properties are:
      @param {String} [schema.resultListLocator] Path locator for the
          location of the array of records to flatten into `response.results`
      @param {Array} [schema.resultFields] Field identifiers to
          locate/assign values in the response records. See above for
          details.
      @param {Array} [schema.metaFields] Path locators to extract extra
          non-record related information from the data object.
    @param {Object|Array|String} data JSON data or its string serialization.
    @return {Object} An Object with properties `results` and `meta`
    @static
    **/
    apply: function(schema, data) {
        var data_in = data,
            data_out = { results: [], meta: {} };

        // Convert incoming JSON strings
        if (!isObject(data)) {
            try {
                data_in = Y.JSON.parse(data);
            }
            catch(e) {
                data_out.error = e;
                return data_out;
            }
        }

        if (isObject(data_in) && schema) {
            // Parse results data
            data_out = SchemaJSON._parseResults.call(this, schema, data_in, data_out);

            // Parse meta data
            if (schema.metaFields !== undefined) {
                data_out = SchemaJSON._parseMeta(schema.metaFields, data_in, data_out);
            }
        }
        else {
            Y.log("JSON data could not be schema-parsed: " + Y.dump(data) + " " + Y.dump(data), "error", "dataschema-json");
            data_out.error = new Error("JSON schema parse failure");
        }

        return data_out;
    },

    /**
     * Schema-parsed list of results from full data
     *
     * @method _parseResults
     * @param schema {Object} Schema to parse against.
     * @param json_in {Object} JSON to parse.
     * @param data_out {Object} In-progress parsed data to update.
     * @return {Object} Parsed data object.
     * @static
     * @protected
     */
    _parseResults: function(schema, json_in, data_out) {
        var getPath  = SchemaJSON.getPath,
            getValue = SchemaJSON.getLocationValue,
            path     = getPath(schema.resultListLocator),
            results  = path ?
                        (getValue(path, json_in) ||
                         // Fall back to treat resultListLocator as a simple key
                            json_in[schema.resultListLocator]) :
                        // Or if no resultListLocator is supplied, use the input
                        json_in;

        if (isArray(results)) {
            // if no result fields are passed in, then just take
            // the results array whole-hog Sometimes you're getting
            // an array of strings, or want the whole object, so
            // resultFields don't make sense.
            if (isArray(schema.resultFields)) {
                data_out = SchemaJSON._getFieldValues.call(this, schema.resultFields, results, data_out);
            } else {
                data_out.results = results;
            }
        } else if (schema.resultListLocator) {
            data_out.results = [];
            data_out.error = new Error("JSON results retrieval failure");
            Y.log("JSON data could not be parsed: " + Y.dump(json_in), "error", "dataschema-json");
        }

        return data_out;
    },

    /**
     * Get field data values out of list of full results
     *
     * @method _getFieldValues
     * @param fields {Array} Fields to find.
     * @param array_in {Array} Results to parse.
     * @param data_out {Object} In-progress parsed data to update.
     * @return {Object} Parsed data object.
     * @static
     * @protected
     */
    _getFieldValues: function(fields, array_in, data_out) {
        var results = [],
            len = fields.length,
            i, j,
            field, key, locator, path, parser, val,
            simplePaths = [], complexPaths = [], fieldParsers = [],
            result, record;

        // First collect hashes of simple paths, complex paths, and parsers
        for (i=0; i<len; i++) {
            field = fields[i]; // A field can be a simple string or a hash
            key = field.key || field; // Find the key
            locator = field.locator || key; // Find the locator

            // Validate and store locators for later
            path = SchemaJSON.getPath(locator);
            if (path) {
                if (path.length === 1) {
                    simplePaths.push({
                        key : key,
                        path: path[0]
                    });
                } else {
                    complexPaths.push({
                        key    : key,
                        path   : path,
                        locator: locator
                    });
                }
            } else {
                Y.log("Invalid key syntax: " + key, "warn", "dataschema-json");
            }

            // Validate and store parsers for later
            //TODO: use Y.DataSchema.parse?
            parser = (isFunction(field.parser)) ?
                        field.parser :
                        Y.Parsers[field.parser + ''];

            if (parser) {
                fieldParsers.push({
                    key   : key,
                    parser: parser
                });
            }
        }

        // Traverse list of array_in, creating records of simple fields,
        // complex fields, and applying parsers as necessary
        for (i=array_in.length-1; i>=0; --i) {
            record = {};
            result = array_in[i];
            if(result) {
                // Cycle through complexLocators
                for (j=complexPaths.length - 1; j>=0; --j) {
                    path = complexPaths[j];
                    val = SchemaJSON.getLocationValue(path.path, result);
                    if (val === undefined) {
                        val = SchemaJSON.getLocationValue([path.locator], result);
                        // Fail over keys like "foo.bar" from nested parsing
                        // to single token parsing if a value is found in
                        // results["foo.bar"]
                        if (val !== undefined) {
                            simplePaths.push({
                                key:  path.key,
                                path: path.locator
                            });
                            // Don't try to process the path as complex
                            // for further results
                            complexPaths.splice(i,1);
                            continue;
                        }
                    }

                    record[path.key] = Base.parse.call(this,
                        (SchemaJSON.getLocationValue(path.path, result)), path);
                }

                // Cycle through simpleLocators
                for (j = simplePaths.length - 1; j >= 0; --j) {
                    path = simplePaths[j];
                    // Bug 1777850: The result might be an array instead of object
                    record[path.key] = Base.parse.call(this,
                            ((result[path.path] === undefined) ?
                            result[j] : result[path.path]), path);
                }

                // Cycle through fieldParsers
                for (j=fieldParsers.length-1; j>=0; --j) {
                    key = fieldParsers[j].key;
                    record[key] = fieldParsers[j].parser.call(this, record[key]);
                    // Safety net
                    if (record[key] === undefined) {
                        record[key] = null;
                    }
                }
                results[i] = record;
            }
        }
        data_out.results = results;
        return data_out;
    },

    /**
     * Parses results data according to schema
     *
     * @method _parseMeta
     * @param metaFields {Object} Metafields definitions.
     * @param json_in {Object} JSON to parse.
     * @param data_out {Object} In-progress parsed data to update.
     * @return {Object} Schema-parsed meta data.
     * @static
     * @protected
     */
    _parseMeta: function(metaFields, json_in, data_out) {
        if (isObject(metaFields)) {
            var key, path;
            for(key in metaFields) {
                if (metaFields.hasOwnProperty(key)) {
                    path = SchemaJSON.getPath(metaFields[key]);
                    if (path && json_in) {
                        data_out.meta[key] = SchemaJSON.getLocationValue(path, json_in);
                    }
                }
            }
        }
        else {
            data_out.error = new Error("JSON meta data retrieval failure");
        }
        return data_out;
    }
};

// TODO: Y.Object + mix() might be better here
Y.DataSchema.JSON = Y.mix(SchemaJSON, Base);


}, '3.7.3', {"requires": ["dataschema-base", "json"]});
