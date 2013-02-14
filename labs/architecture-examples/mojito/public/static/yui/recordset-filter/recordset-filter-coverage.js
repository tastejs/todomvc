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
_yuitest_coverage["build/recordset-filter/recordset-filter.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/recordset-filter/recordset-filter.js",
    code: []
};
_yuitest_coverage["build/recordset-filter/recordset-filter.js"].code=["YUI.add('recordset-filter', function (Y, NAME) {","","/**"," * Plugin that provides the ability to filter through a recordset."," * Uses the filter methods available on Y.Array (see arrayextras submodule) to filter the recordset."," * @module recordset"," * @submodule recordset-filter"," */","","","var YArray = Y.Array,","Lang = Y.Lang;","","","/**"," * Plugin that provides the ability to filter through a recordset."," * Uses the filter methods available on Y.Array (see arrayextras submodule) to filter the recordset. "," * @class RecordsetFilter"," */","function RecordsetFilter(config) {","    RecordsetFilter.superclass.constructor.apply(this, arguments);","}","","Y.mix(RecordsetFilter, {","    NS: \"filter\",","","    NAME: \"recordsetFilter\",","","    ATTRS: {","    }","","});","","","Y.extend(RecordsetFilter, Y.Plugin.Base, {","","","    /**","    Filter through the recordset with a custom filter function, or a key-value","    pair.","    ","    @method filter","    @param {Function|String} filter A custom filter function or a string","        representing the key to filter by.","    @param {Any} [value] If filtering by key (_filter_ is a string), further","        filter by a specific value.","    @return {Recordset} A new filtered Recordset instance","    **/","    filter: function (filter, value) {","        var recs = this.get('host').get('records'),","            key;","","        //If a key-value pair is passed in, generate a custom function","        if (value && Lang.isString(filter)) {","            key = filter;","            filter = function(item) {","                return (item.getValue(key) === value);","            };","        }","","        //TODO: PARENT CHILD RELATIONSHIP","        return new Y.Recordset({","            records: YArray.filter(recs, filter)","        });","    },","","    /**","    The inverse of filter. Executes the supplied function on each item. Returns","    a new Recordset containing the items that the supplied function returned","    `false` for.","","    @method reject","    @param {Function} filter A boolean function, executed on each item.","    @return {Recordset} A new Recordset instance containing the items on which","        the supplied function returned false.","    **/","    reject: function (filter) {","        return new Y.Recordset({","            records: YArray.reject(this.get('host').get('records'), filter)","        });","    },","","    /**","    Iterates over the Recordset, returning a new Recordset of all the elements","    that match the supplied regular expression","","    @method grep","    @param {RegExp} pattern The regular expression to test against each record.","    @return {Recordset} A Recordset instance containing all the items in the","        collection that produce a match against the supplied regular","        expression. If no items match, an empty Recordset instance is returned.","    **/","    grep: function (pattern) {","        return new Y.Recordset({","            records: YArray.grep(this.get('host').get('records'), pattern)","        });","    }","","    //TODO: Add more pass-through methods to arrayextras","});","","Y.namespace(\"Plugin\").RecordsetFilter = RecordsetFilter;","","","}, '3.7.3', {\"requires\": [\"recordset-base\", \"array-extras\", \"plugin\"]});"];
_yuitest_coverage["build/recordset-filter/recordset-filter.js"].lines = {"1":0,"11":0,"20":0,"21":0,"24":0,"35":0,"50":0,"54":0,"55":0,"56":0,"57":0,"62":0,"78":0,"94":0,"102":0};
_yuitest_coverage["build/recordset-filter/recordset-filter.js"].functions = {"RecordsetFilter:20":0,"filter:56":0,"filter:49":0,"reject:77":0,"grep:93":0,"(anonymous 1):1":0};
_yuitest_coverage["build/recordset-filter/recordset-filter.js"].coveredLines = 15;
_yuitest_coverage["build/recordset-filter/recordset-filter.js"].coveredFunctions = 6;
_yuitest_coverline("build/recordset-filter/recordset-filter.js", 1);
YUI.add('recordset-filter', function (Y, NAME) {

/**
 * Plugin that provides the ability to filter through a recordset.
 * Uses the filter methods available on Y.Array (see arrayextras submodule) to filter the recordset.
 * @module recordset
 * @submodule recordset-filter
 */


_yuitest_coverfunc("build/recordset-filter/recordset-filter.js", "(anonymous 1)", 1);
_yuitest_coverline("build/recordset-filter/recordset-filter.js", 11);
var YArray = Y.Array,
Lang = Y.Lang;


/**
 * Plugin that provides the ability to filter through a recordset.
 * Uses the filter methods available on Y.Array (see arrayextras submodule) to filter the recordset. 
 * @class RecordsetFilter
 */
_yuitest_coverline("build/recordset-filter/recordset-filter.js", 20);
function RecordsetFilter(config) {
    _yuitest_coverfunc("build/recordset-filter/recordset-filter.js", "RecordsetFilter", 20);
_yuitest_coverline("build/recordset-filter/recordset-filter.js", 21);
RecordsetFilter.superclass.constructor.apply(this, arguments);
}

_yuitest_coverline("build/recordset-filter/recordset-filter.js", 24);
Y.mix(RecordsetFilter, {
    NS: "filter",

    NAME: "recordsetFilter",

    ATTRS: {
    }

});


_yuitest_coverline("build/recordset-filter/recordset-filter.js", 35);
Y.extend(RecordsetFilter, Y.Plugin.Base, {


    /**
    Filter through the recordset with a custom filter function, or a key-value
    pair.
    
    @method filter
    @param {Function|String} filter A custom filter function or a string
        representing the key to filter by.
    @param {Any} [value] If filtering by key (_filter_ is a string), further
        filter by a specific value.
    @return {Recordset} A new filtered Recordset instance
    **/
    filter: function (filter, value) {
        _yuitest_coverfunc("build/recordset-filter/recordset-filter.js", "filter", 49);
_yuitest_coverline("build/recordset-filter/recordset-filter.js", 50);
var recs = this.get('host').get('records'),
            key;

        //If a key-value pair is passed in, generate a custom function
        _yuitest_coverline("build/recordset-filter/recordset-filter.js", 54);
if (value && Lang.isString(filter)) {
            _yuitest_coverline("build/recordset-filter/recordset-filter.js", 55);
key = filter;
            _yuitest_coverline("build/recordset-filter/recordset-filter.js", 56);
filter = function(item) {
                _yuitest_coverfunc("build/recordset-filter/recordset-filter.js", "filter", 56);
_yuitest_coverline("build/recordset-filter/recordset-filter.js", 57);
return (item.getValue(key) === value);
            };
        }

        //TODO: PARENT CHILD RELATIONSHIP
        _yuitest_coverline("build/recordset-filter/recordset-filter.js", 62);
return new Y.Recordset({
            records: YArray.filter(recs, filter)
        });
    },

    /**
    The inverse of filter. Executes the supplied function on each item. Returns
    a new Recordset containing the items that the supplied function returned
    `false` for.

    @method reject
    @param {Function} filter A boolean function, executed on each item.
    @return {Recordset} A new Recordset instance containing the items on which
        the supplied function returned false.
    **/
    reject: function (filter) {
        _yuitest_coverfunc("build/recordset-filter/recordset-filter.js", "reject", 77);
_yuitest_coverline("build/recordset-filter/recordset-filter.js", 78);
return new Y.Recordset({
            records: YArray.reject(this.get('host').get('records'), filter)
        });
    },

    /**
    Iterates over the Recordset, returning a new Recordset of all the elements
    that match the supplied regular expression

    @method grep
    @param {RegExp} pattern The regular expression to test against each record.
    @return {Recordset} A Recordset instance containing all the items in the
        collection that produce a match against the supplied regular
        expression. If no items match, an empty Recordset instance is returned.
    **/
    grep: function (pattern) {
        _yuitest_coverfunc("build/recordset-filter/recordset-filter.js", "grep", 93);
_yuitest_coverline("build/recordset-filter/recordset-filter.js", 94);
return new Y.Recordset({
            records: YArray.grep(this.get('host').get('records'), pattern)
        });
    }

    //TODO: Add more pass-through methods to arrayextras
});

_yuitest_coverline("build/recordset-filter/recordset-filter.js", 102);
Y.namespace("Plugin").RecordsetFilter = RecordsetFilter;


}, '3.7.3', {"requires": ["recordset-base", "array-extras", "plugin"]});
