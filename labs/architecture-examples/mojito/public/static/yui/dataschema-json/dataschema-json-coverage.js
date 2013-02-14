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
_yuitest_coverage["build/dataschema-json/dataschema-json.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/dataschema-json/dataschema-json.js",
    code: []
};
_yuitest_coverage["build/dataschema-json/dataschema-json.js"].code=["YUI.add('dataschema-json', function (Y, NAME) {","","/**","Provides a DataSchema implementation which can be used to work with JSON data.","","@module dataschema","@submodule dataschema-json","**/","","/**","Provides a DataSchema implementation which can be used to work with JSON data.","","See the `apply` method for usage.","","@class DataSchema.JSON","@extends DataSchema.Base","@static","**/","var LANG = Y.Lang,","    isFunction = LANG.isFunction,","    isObject   = LANG.isObject,","    isArray    = LANG.isArray,","    // TODO: I don't think the calls to Base.* need to be done via Base since","    // Base is mixed into SchemaJSON.  Investigate for later.","    Base       = Y.DataSchema.Base,","","    SchemaJSON;","    ","SchemaJSON = {","","/////////////////////////////////////////////////////////////////////////////","//","// DataSchema.JSON static methods","//","/////////////////////////////////////////////////////////////////////////////","    /**","     * Utility function converts JSON locator strings into walkable paths","     *","     * @method getPath","     * @param locator {String} JSON value locator.","     * @return {String[]} Walkable path to data value.","     * @static","     */","    getPath: function(locator) {","        var path = null,","            keys = [],","            i = 0;","","        if (locator) {","            // Strip the [\"string keys\"] and [1] array indexes","            // TODO: the first two steps can probably be reduced to one with","            // /\\[\\s*(['\"])?(.*?)\\1\\s*\\]/g, but the array indices would be","            // stored as strings.  This is not likely an issue.","            locator = locator.","                replace(/\\[\\s*(['\"])(.*?)\\1\\s*\\]/g,","                function (x,$1,$2) {keys[i]=$2;return '.@'+(i++);}).","                replace(/\\[(\\d+)\\]/g,","                function (x,$1) {keys[i]=parseInt($1,10)|0;return '.@'+(i++);}).","                replace(/^\\./,''); // remove leading dot","","            // Validate against problematic characters.","            // commented out because the path isn't sent to eval, so it","            // should be safe. I'm not sure what makes a locator invalid.","            //if (!/[^\\w\\.\\$@]/.test(locator)) {","            path = locator.split('.');","            for (i=path.length-1; i >= 0; --i) {","                if (path[i].charAt(0) === '@') {","                    path[i] = keys[parseInt(path[i].substr(1),10)];","                }","            }","            /*}","            else {","            }","            */","        }","        return path;","    },","","    /**","     * Utility function to walk a path and return the value located there.","     *","     * @method getLocationValue","     * @param path {String[]} Locator path.","     * @param data {String} Data to traverse.","     * @return {Object} Data value at location.","     * @static","     */","    getLocationValue: function (path, data) {","        var i = 0,","            len = path.length;","        for (;i<len;i++) {","            if (isObject(data) && (path[i] in data)) {","                data = data[path[i]];","            } else {","                data = undefined;","                break;","            }","        }","        return data;","    },","","    /**","    Applies a schema to an array of data located in a JSON structure, returning","    a normalized object with results in the `results` property. Additional","    information can be parsed out of the JSON for inclusion in the `meta`","    property of the response object.  If an error is encountered during","    processing, an `error` property will be added.","","    The input _data_ is expected to be an object or array.  If it is a string,","    it will be passed through `Y.JSON.parse()`.","","    If _data_ contains an array of data records to normalize, specify the","    _schema.resultListLocator_ as a dot separated path string just as you would","    reference it in JavaScript.  So if your _data_ object has a record array at","    _data.response.results_, use _schema.resultListLocator_ =","    \"response.results\". Bracket notation can also be used for array indices or","    object properties (e.g. \"response['results']\");  This is called a \"path","    locator\"","","    Field data in the result list is extracted with field identifiers in","    _schema.resultFields_.  Field identifiers are objects with the following","    properties:","","      * `key`   : <strong>(required)</strong> The path locator (String)","      * `parser`: A function or the name of a function on `Y.Parsers` used","            to convert the input value into a normalized type.  Parser","            functions are passed the value as input and are expected to","            return a value.","","    If no value parsing is needed, you can use path locators (strings) ","    instead of field identifiers (objects) -- see example below.","","    If no processing of the result list array is needed, _schema.resultFields_","    can be omitted; the `response.results` will point directly to the array.","","    If the result list contains arrays, `response.results` will contain an","    array of objects with key:value pairs assuming the fields in","    _schema.resultFields_ are ordered in accordance with the data array","    values.","","    If the result list contains objects, the identified _schema.resultFields_","    will be used to extract a value from those objects for the output result.","","    To extract additional information from the JSON, include an array of","    path locators in _schema.metaFields_.  The collected values will be","    stored in `response.meta`.","","","    @example","        // Process array of arrays","        var schema = {","                resultListLocator: 'produce.fruit',","                resultFields: [ 'name', 'color' ]","            },","            data = {","                produce: {","                    fruit: [","                        [ 'Banana', 'yellow' ],","                        [ 'Orange', 'orange' ],","                        [ 'Eggplant', 'purple' ]","                    ]","                }","            };","","        var response = Y.DataSchema.JSON.apply(schema, data);","","        // response.results[0] is { name: \"Banana\", color: \"yellow\" }","","        ","        // Process array of objects + some metadata","        schema.metaFields = [ 'lastInventory' ];","","        data = {","            produce: {","                fruit: [","                    { name: 'Banana', color: 'yellow', price: '1.96' },","                    { name: 'Orange', color: 'orange', price: '2.04' },","                    { name: 'Eggplant', color: 'purple', price: '4.31' }","                ]","            },","            lastInventory: '2011-07-19'","        };","","        response = Y.DataSchema.JSON.apply(schema, data);","","        // response.results[0] is { name: \"Banana\", color: \"yellow\" }","        // response.meta.lastInventory is '2001-07-19'","","","        // Use parsers","        schema.resultFields = [","            {","                key: 'name',","                parser: function (val) { return val.toUpperCase(); }","            },","            {","                key: 'price',","                parser: 'number' // Uses Y.Parsers.number","            }","        ];","","        response = Y.DataSchema.JSON.apply(schema, data);","","        // Note price was converted from a numeric string to a number","        // response.results[0] looks like { fruit: \"BANANA\", price: 1.96 }","     ","    @method apply","    @param {Object} [schema] Schema to apply.  Supported configuration","        properties are:","      @param {String} [schema.resultListLocator] Path locator for the","          location of the array of records to flatten into `response.results`","      @param {Array} [schema.resultFields] Field identifiers to","          locate/assign values in the response records. See above for","          details.","      @param {Array} [schema.metaFields] Path locators to extract extra","          non-record related information from the data object.","    @param {Object|Array|String} data JSON data or its string serialization.","    @return {Object} An Object with properties `results` and `meta`","    @static","    **/","    apply: function(schema, data) {","        var data_in = data,","            data_out = { results: [], meta: {} };","","        // Convert incoming JSON strings","        if (!isObject(data)) {","            try {","                data_in = Y.JSON.parse(data);","            }","            catch(e) {","                data_out.error = e;","                return data_out;","            }","        }","","        if (isObject(data_in) && schema) {","            // Parse results data","            data_out = SchemaJSON._parseResults.call(this, schema, data_in, data_out);","","            // Parse meta data","            if (schema.metaFields !== undefined) {","                data_out = SchemaJSON._parseMeta(schema.metaFields, data_in, data_out);","            }","        }","        else {","            data_out.error = new Error(\"JSON schema parse failure\");","        }","","        return data_out;","    },","","    /**","     * Schema-parsed list of results from full data","     *","     * @method _parseResults","     * @param schema {Object} Schema to parse against.","     * @param json_in {Object} JSON to parse.","     * @param data_out {Object} In-progress parsed data to update.","     * @return {Object} Parsed data object.","     * @static","     * @protected","     */","    _parseResults: function(schema, json_in, data_out) {","        var getPath  = SchemaJSON.getPath,","            getValue = SchemaJSON.getLocationValue,","            path     = getPath(schema.resultListLocator),","            results  = path ?","                        (getValue(path, json_in) ||","                         // Fall back to treat resultListLocator as a simple key","                            json_in[schema.resultListLocator]) :","                        // Or if no resultListLocator is supplied, use the input","                        json_in;","","        if (isArray(results)) {","            // if no result fields are passed in, then just take","            // the results array whole-hog Sometimes you're getting","            // an array of strings, or want the whole object, so","            // resultFields don't make sense.","            if (isArray(schema.resultFields)) {","                data_out = SchemaJSON._getFieldValues.call(this, schema.resultFields, results, data_out);","            } else {","                data_out.results = results;","            }","        } else if (schema.resultListLocator) {","            data_out.results = [];","            data_out.error = new Error(\"JSON results retrieval failure\");","        }","","        return data_out;","    },","","    /**","     * Get field data values out of list of full results","     *","     * @method _getFieldValues","     * @param fields {Array} Fields to find.","     * @param array_in {Array} Results to parse.","     * @param data_out {Object} In-progress parsed data to update.","     * @return {Object} Parsed data object.","     * @static","     * @protected","     */","    _getFieldValues: function(fields, array_in, data_out) {","        var results = [],","            len = fields.length,","            i, j,","            field, key, locator, path, parser, val,","            simplePaths = [], complexPaths = [], fieldParsers = [],","            result, record;","","        // First collect hashes of simple paths, complex paths, and parsers","        for (i=0; i<len; i++) {","            field = fields[i]; // A field can be a simple string or a hash","            key = field.key || field; // Find the key","            locator = field.locator || key; // Find the locator","","            // Validate and store locators for later","            path = SchemaJSON.getPath(locator);","            if (path) {","                if (path.length === 1) {","                    simplePaths.push({","                        key : key,","                        path: path[0]","                    });","                } else {","                    complexPaths.push({","                        key    : key,","                        path   : path,","                        locator: locator","                    });","                }","            } else {","            }","","            // Validate and store parsers for later","            //TODO: use Y.DataSchema.parse?","            parser = (isFunction(field.parser)) ?","                        field.parser :","                        Y.Parsers[field.parser + ''];","","            if (parser) {","                fieldParsers.push({","                    key   : key,","                    parser: parser","                });","            }","        }","","        // Traverse list of array_in, creating records of simple fields,","        // complex fields, and applying parsers as necessary","        for (i=array_in.length-1; i>=0; --i) {","            record = {};","            result = array_in[i];","            if(result) {","                // Cycle through complexLocators","                for (j=complexPaths.length - 1; j>=0; --j) {","                    path = complexPaths[j];","                    val = SchemaJSON.getLocationValue(path.path, result);","                    if (val === undefined) {","                        val = SchemaJSON.getLocationValue([path.locator], result);","                        // Fail over keys like \"foo.bar\" from nested parsing","                        // to single token parsing if a value is found in","                        // results[\"foo.bar\"]","                        if (val !== undefined) {","                            simplePaths.push({","                                key:  path.key,","                                path: path.locator","                            });","                            // Don't try to process the path as complex","                            // for further results","                            complexPaths.splice(i,1);","                            continue;","                        }","                    }","","                    record[path.key] = Base.parse.call(this,","                        (SchemaJSON.getLocationValue(path.path, result)), path);","                }","","                // Cycle through simpleLocators","                for (j = simplePaths.length - 1; j >= 0; --j) {","                    path = simplePaths[j];","                    // Bug 1777850: The result might be an array instead of object","                    record[path.key] = Base.parse.call(this,","                            ((result[path.path] === undefined) ?","                            result[j] : result[path.path]), path);","                }","","                // Cycle through fieldParsers","                for (j=fieldParsers.length-1; j>=0; --j) {","                    key = fieldParsers[j].key;","                    record[key] = fieldParsers[j].parser.call(this, record[key]);","                    // Safety net","                    if (record[key] === undefined) {","                        record[key] = null;","                    }","                }","                results[i] = record;","            }","        }","        data_out.results = results;","        return data_out;","    },","","    /**","     * Parses results data according to schema","     *","     * @method _parseMeta","     * @param metaFields {Object} Metafields definitions.","     * @param json_in {Object} JSON to parse.","     * @param data_out {Object} In-progress parsed data to update.","     * @return {Object} Schema-parsed meta data.","     * @static","     * @protected","     */","    _parseMeta: function(metaFields, json_in, data_out) {","        if (isObject(metaFields)) {","            var key, path;","            for(key in metaFields) {","                if (metaFields.hasOwnProperty(key)) {","                    path = SchemaJSON.getPath(metaFields[key]);","                    if (path && json_in) {","                        data_out.meta[key] = SchemaJSON.getLocationValue(path, json_in);","                    }","                }","            }","        }","        else {","            data_out.error = new Error(\"JSON meta data retrieval failure\");","        }","        return data_out;","    }","};","","// TODO: Y.Object + mix() might be better here","Y.DataSchema.JSON = Y.mix(SchemaJSON, Base);","","","}, '3.7.3', {\"requires\": [\"dataschema-base\", \"json\"]});"];
_yuitest_coverage["build/dataschema-json/dataschema-json.js"].lines = {"1":0,"19":0,"29":0,"45":0,"49":0,"54":0,"56":0,"58":0,"65":0,"66":0,"67":0,"68":0,"76":0,"89":0,"91":0,"92":0,"93":0,"95":0,"96":0,"99":0,"222":0,"226":0,"227":0,"228":0,"231":0,"232":0,"236":0,"238":0,"241":0,"242":0,"246":0,"249":0,"264":0,"274":0,"279":0,"280":0,"282":0,"284":0,"285":0,"286":0,"289":0,"304":0,"312":0,"313":0,"314":0,"315":0,"318":0,"319":0,"320":0,"321":0,"326":0,"337":0,"341":0,"342":0,"351":0,"352":0,"353":0,"354":0,"356":0,"357":0,"358":0,"359":0,"360":0,"364":0,"365":0,"371":0,"372":0,"376":0,"381":0,"382":0,"384":0,"390":0,"391":0,"392":0,"394":0,"395":0,"398":0,"401":0,"402":0,"417":0,"418":0,"419":0,"420":0,"421":0,"422":0,"423":0,"429":0,"431":0,"436":0};
_yuitest_coverage["build/dataschema-json/dataschema-json.js"].functions = {"(anonymous 2):56":0,"(anonymous 3):58":0,"getPath:44":0,"getLocationValue:88":0,"apply:221":0,"_parseResults:263":0,"_getFieldValues:303":0,"_parseMeta:416":0,"(anonymous 1):1":0};
_yuitest_coverage["build/dataschema-json/dataschema-json.js"].coveredLines = 89;
_yuitest_coverage["build/dataschema-json/dataschema-json.js"].coveredFunctions = 9;
_yuitest_coverline("build/dataschema-json/dataschema-json.js", 1);
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
_yuitest_coverfunc("build/dataschema-json/dataschema-json.js", "(anonymous 1)", 1);
_yuitest_coverline("build/dataschema-json/dataschema-json.js", 19);
var LANG = Y.Lang,
    isFunction = LANG.isFunction,
    isObject   = LANG.isObject,
    isArray    = LANG.isArray,
    // TODO: I don't think the calls to Base.* need to be done via Base since
    // Base is mixed into SchemaJSON.  Investigate for later.
    Base       = Y.DataSchema.Base,

    SchemaJSON;
    
_yuitest_coverline("build/dataschema-json/dataschema-json.js", 29);
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
        _yuitest_coverfunc("build/dataschema-json/dataschema-json.js", "getPath", 44);
_yuitest_coverline("build/dataschema-json/dataschema-json.js", 45);
var path = null,
            keys = [],
            i = 0;

        _yuitest_coverline("build/dataschema-json/dataschema-json.js", 49);
if (locator) {
            // Strip the ["string keys"] and [1] array indexes
            // TODO: the first two steps can probably be reduced to one with
            // /\[\s*(['"])?(.*?)\1\s*\]/g, but the array indices would be
            // stored as strings.  This is not likely an issue.
            _yuitest_coverline("build/dataschema-json/dataschema-json.js", 54);
locator = locator.
                replace(/\[\s*(['"])(.*?)\1\s*\]/g,
                function (x,$1,$2) {_yuitest_coverfunc("build/dataschema-json/dataschema-json.js", "(anonymous 2)", 56);
_yuitest_coverline("build/dataschema-json/dataschema-json.js", 56);
keys[i]=$2;return '.@'+(i++);}).
                replace(/\[(\d+)\]/g,
                function (x,$1) {_yuitest_coverfunc("build/dataschema-json/dataschema-json.js", "(anonymous 3)", 58);
_yuitest_coverline("build/dataschema-json/dataschema-json.js", 58);
keys[i]=parseInt($1,10)|0;return '.@'+(i++);}).
                replace(/^\./,''); // remove leading dot

            // Validate against problematic characters.
            // commented out because the path isn't sent to eval, so it
            // should be safe. I'm not sure what makes a locator invalid.
            //if (!/[^\w\.\$@]/.test(locator)) {
            _yuitest_coverline("build/dataschema-json/dataschema-json.js", 65);
path = locator.split('.');
            _yuitest_coverline("build/dataschema-json/dataschema-json.js", 66);
for (i=path.length-1; i >= 0; --i) {
                _yuitest_coverline("build/dataschema-json/dataschema-json.js", 67);
if (path[i].charAt(0) === '@') {
                    _yuitest_coverline("build/dataschema-json/dataschema-json.js", 68);
path[i] = keys[parseInt(path[i].substr(1),10)];
                }
            }
            /*}
            else {
            }
            */
        }
        _yuitest_coverline("build/dataschema-json/dataschema-json.js", 76);
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
        _yuitest_coverfunc("build/dataschema-json/dataschema-json.js", "getLocationValue", 88);
_yuitest_coverline("build/dataschema-json/dataschema-json.js", 89);
var i = 0,
            len = path.length;
        _yuitest_coverline("build/dataschema-json/dataschema-json.js", 91);
for (;i<len;i++) {
            _yuitest_coverline("build/dataschema-json/dataschema-json.js", 92);
if (isObject(data) && (path[i] in data)) {
                _yuitest_coverline("build/dataschema-json/dataschema-json.js", 93);
data = data[path[i]];
            } else {
                _yuitest_coverline("build/dataschema-json/dataschema-json.js", 95);
data = undefined;
                _yuitest_coverline("build/dataschema-json/dataschema-json.js", 96);
break;
            }
        }
        _yuitest_coverline("build/dataschema-json/dataschema-json.js", 99);
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
        _yuitest_coverfunc("build/dataschema-json/dataschema-json.js", "apply", 221);
_yuitest_coverline("build/dataschema-json/dataschema-json.js", 222);
var data_in = data,
            data_out = { results: [], meta: {} };

        // Convert incoming JSON strings
        _yuitest_coverline("build/dataschema-json/dataschema-json.js", 226);
if (!isObject(data)) {
            _yuitest_coverline("build/dataschema-json/dataschema-json.js", 227);
try {
                _yuitest_coverline("build/dataschema-json/dataschema-json.js", 228);
data_in = Y.JSON.parse(data);
            }
            catch(e) {
                _yuitest_coverline("build/dataschema-json/dataschema-json.js", 231);
data_out.error = e;
                _yuitest_coverline("build/dataschema-json/dataschema-json.js", 232);
return data_out;
            }
        }

        _yuitest_coverline("build/dataschema-json/dataschema-json.js", 236);
if (isObject(data_in) && schema) {
            // Parse results data
            _yuitest_coverline("build/dataschema-json/dataschema-json.js", 238);
data_out = SchemaJSON._parseResults.call(this, schema, data_in, data_out);

            // Parse meta data
            _yuitest_coverline("build/dataschema-json/dataschema-json.js", 241);
if (schema.metaFields !== undefined) {
                _yuitest_coverline("build/dataschema-json/dataschema-json.js", 242);
data_out = SchemaJSON._parseMeta(schema.metaFields, data_in, data_out);
            }
        }
        else {
            _yuitest_coverline("build/dataschema-json/dataschema-json.js", 246);
data_out.error = new Error("JSON schema parse failure");
        }

        _yuitest_coverline("build/dataschema-json/dataschema-json.js", 249);
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
        _yuitest_coverfunc("build/dataschema-json/dataschema-json.js", "_parseResults", 263);
_yuitest_coverline("build/dataschema-json/dataschema-json.js", 264);
var getPath  = SchemaJSON.getPath,
            getValue = SchemaJSON.getLocationValue,
            path     = getPath(schema.resultListLocator),
            results  = path ?
                        (getValue(path, json_in) ||
                         // Fall back to treat resultListLocator as a simple key
                            json_in[schema.resultListLocator]) :
                        // Or if no resultListLocator is supplied, use the input
                        json_in;

        _yuitest_coverline("build/dataschema-json/dataschema-json.js", 274);
if (isArray(results)) {
            // if no result fields are passed in, then just take
            // the results array whole-hog Sometimes you're getting
            // an array of strings, or want the whole object, so
            // resultFields don't make sense.
            _yuitest_coverline("build/dataschema-json/dataschema-json.js", 279);
if (isArray(schema.resultFields)) {
                _yuitest_coverline("build/dataschema-json/dataschema-json.js", 280);
data_out = SchemaJSON._getFieldValues.call(this, schema.resultFields, results, data_out);
            } else {
                _yuitest_coverline("build/dataschema-json/dataschema-json.js", 282);
data_out.results = results;
            }
        } else {_yuitest_coverline("build/dataschema-json/dataschema-json.js", 284);
if (schema.resultListLocator) {
            _yuitest_coverline("build/dataschema-json/dataschema-json.js", 285);
data_out.results = [];
            _yuitest_coverline("build/dataschema-json/dataschema-json.js", 286);
data_out.error = new Error("JSON results retrieval failure");
        }}

        _yuitest_coverline("build/dataschema-json/dataschema-json.js", 289);
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
        _yuitest_coverfunc("build/dataschema-json/dataschema-json.js", "_getFieldValues", 303);
_yuitest_coverline("build/dataschema-json/dataschema-json.js", 304);
var results = [],
            len = fields.length,
            i, j,
            field, key, locator, path, parser, val,
            simplePaths = [], complexPaths = [], fieldParsers = [],
            result, record;

        // First collect hashes of simple paths, complex paths, and parsers
        _yuitest_coverline("build/dataschema-json/dataschema-json.js", 312);
for (i=0; i<len; i++) {
            _yuitest_coverline("build/dataschema-json/dataschema-json.js", 313);
field = fields[i]; // A field can be a simple string or a hash
            _yuitest_coverline("build/dataschema-json/dataschema-json.js", 314);
key = field.key || field; // Find the key
            _yuitest_coverline("build/dataschema-json/dataschema-json.js", 315);
locator = field.locator || key; // Find the locator

            // Validate and store locators for later
            _yuitest_coverline("build/dataschema-json/dataschema-json.js", 318);
path = SchemaJSON.getPath(locator);
            _yuitest_coverline("build/dataschema-json/dataschema-json.js", 319);
if (path) {
                _yuitest_coverline("build/dataschema-json/dataschema-json.js", 320);
if (path.length === 1) {
                    _yuitest_coverline("build/dataschema-json/dataschema-json.js", 321);
simplePaths.push({
                        key : key,
                        path: path[0]
                    });
                } else {
                    _yuitest_coverline("build/dataschema-json/dataschema-json.js", 326);
complexPaths.push({
                        key    : key,
                        path   : path,
                        locator: locator
                    });
                }
            } else {
            }

            // Validate and store parsers for later
            //TODO: use Y.DataSchema.parse?
            _yuitest_coverline("build/dataschema-json/dataschema-json.js", 337);
parser = (isFunction(field.parser)) ?
                        field.parser :
                        Y.Parsers[field.parser + ''];

            _yuitest_coverline("build/dataschema-json/dataschema-json.js", 341);
if (parser) {
                _yuitest_coverline("build/dataschema-json/dataschema-json.js", 342);
fieldParsers.push({
                    key   : key,
                    parser: parser
                });
            }
        }

        // Traverse list of array_in, creating records of simple fields,
        // complex fields, and applying parsers as necessary
        _yuitest_coverline("build/dataschema-json/dataschema-json.js", 351);
for (i=array_in.length-1; i>=0; --i) {
            _yuitest_coverline("build/dataschema-json/dataschema-json.js", 352);
record = {};
            _yuitest_coverline("build/dataschema-json/dataschema-json.js", 353);
result = array_in[i];
            _yuitest_coverline("build/dataschema-json/dataschema-json.js", 354);
if(result) {
                // Cycle through complexLocators
                _yuitest_coverline("build/dataschema-json/dataschema-json.js", 356);
for (j=complexPaths.length - 1; j>=0; --j) {
                    _yuitest_coverline("build/dataschema-json/dataschema-json.js", 357);
path = complexPaths[j];
                    _yuitest_coverline("build/dataschema-json/dataschema-json.js", 358);
val = SchemaJSON.getLocationValue(path.path, result);
                    _yuitest_coverline("build/dataschema-json/dataschema-json.js", 359);
if (val === undefined) {
                        _yuitest_coverline("build/dataschema-json/dataschema-json.js", 360);
val = SchemaJSON.getLocationValue([path.locator], result);
                        // Fail over keys like "foo.bar" from nested parsing
                        // to single token parsing if a value is found in
                        // results["foo.bar"]
                        _yuitest_coverline("build/dataschema-json/dataschema-json.js", 364);
if (val !== undefined) {
                            _yuitest_coverline("build/dataschema-json/dataschema-json.js", 365);
simplePaths.push({
                                key:  path.key,
                                path: path.locator
                            });
                            // Don't try to process the path as complex
                            // for further results
                            _yuitest_coverline("build/dataschema-json/dataschema-json.js", 371);
complexPaths.splice(i,1);
                            _yuitest_coverline("build/dataschema-json/dataschema-json.js", 372);
continue;
                        }
                    }

                    _yuitest_coverline("build/dataschema-json/dataschema-json.js", 376);
record[path.key] = Base.parse.call(this,
                        (SchemaJSON.getLocationValue(path.path, result)), path);
                }

                // Cycle through simpleLocators
                _yuitest_coverline("build/dataschema-json/dataschema-json.js", 381);
for (j = simplePaths.length - 1; j >= 0; --j) {
                    _yuitest_coverline("build/dataschema-json/dataschema-json.js", 382);
path = simplePaths[j];
                    // Bug 1777850: The result might be an array instead of object
                    _yuitest_coverline("build/dataschema-json/dataschema-json.js", 384);
record[path.key] = Base.parse.call(this,
                            ((result[path.path] === undefined) ?
                            result[j] : result[path.path]), path);
                }

                // Cycle through fieldParsers
                _yuitest_coverline("build/dataschema-json/dataschema-json.js", 390);
for (j=fieldParsers.length-1; j>=0; --j) {
                    _yuitest_coverline("build/dataschema-json/dataschema-json.js", 391);
key = fieldParsers[j].key;
                    _yuitest_coverline("build/dataschema-json/dataschema-json.js", 392);
record[key] = fieldParsers[j].parser.call(this, record[key]);
                    // Safety net
                    _yuitest_coverline("build/dataschema-json/dataschema-json.js", 394);
if (record[key] === undefined) {
                        _yuitest_coverline("build/dataschema-json/dataschema-json.js", 395);
record[key] = null;
                    }
                }
                _yuitest_coverline("build/dataschema-json/dataschema-json.js", 398);
results[i] = record;
            }
        }
        _yuitest_coverline("build/dataschema-json/dataschema-json.js", 401);
data_out.results = results;
        _yuitest_coverline("build/dataschema-json/dataschema-json.js", 402);
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
        _yuitest_coverfunc("build/dataschema-json/dataschema-json.js", "_parseMeta", 416);
_yuitest_coverline("build/dataschema-json/dataschema-json.js", 417);
if (isObject(metaFields)) {
            _yuitest_coverline("build/dataschema-json/dataschema-json.js", 418);
var key, path;
            _yuitest_coverline("build/dataschema-json/dataschema-json.js", 419);
for(key in metaFields) {
                _yuitest_coverline("build/dataschema-json/dataschema-json.js", 420);
if (metaFields.hasOwnProperty(key)) {
                    _yuitest_coverline("build/dataschema-json/dataschema-json.js", 421);
path = SchemaJSON.getPath(metaFields[key]);
                    _yuitest_coverline("build/dataschema-json/dataschema-json.js", 422);
if (path && json_in) {
                        _yuitest_coverline("build/dataschema-json/dataschema-json.js", 423);
data_out.meta[key] = SchemaJSON.getLocationValue(path, json_in);
                    }
                }
            }
        }
        else {
            _yuitest_coverline("build/dataschema-json/dataschema-json.js", 429);
data_out.error = new Error("JSON meta data retrieval failure");
        }
        _yuitest_coverline("build/dataschema-json/dataschema-json.js", 431);
return data_out;
    }
};

// TODO: Y.Object + mix() might be better here
_yuitest_coverline("build/dataschema-json/dataschema-json.js", 436);
Y.DataSchema.JSON = Y.mix(SchemaJSON, Base);


}, '3.7.3', {"requires": ["dataschema-base", "json"]});
