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
_yuitest_coverage["build/arraylist-filter/arraylist-filter.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/arraylist-filter/arraylist-filter.js",
    code: []
};
_yuitest_coverage["build/arraylist-filter/arraylist-filter.js"].code=["YUI.add('arraylist-filter', function (Y, NAME) {","","/**"," * Collection utilities beyond what is provided in the YUI core"," * @module collection"," * @submodule arraylist-filter"," * @deprecated Use ModelList or a custom subclass implementation"," */","","/*"," * Adds filter method to ArrayList prototype"," */","Y.mix(Y.ArrayList.prototype, {","","    /**","     * <p>Create a new ArrayList (or augmenting class instance) from a subset","     * of items as determined by the boolean function passed as the","     * argument.  The original ArrayList is unchanged.</p>","     *","     * <p>The validator signature is <code>validator( item )</code>.</p>","     *","     * @method filter","     * @param { Function } validator Boolean function to determine in or out.","     * @return { ArrayList } New instance based on who passed the validator.","     * @for ArrayList","     * @deprecated Use ModelList or a custom subclass implementation","     */","    filter: function(validator) {","        var items = [];","","        Y.Array.each(this._items, function(item, i) {","            item = this.item(i);","","            if (validator(item)) {","                items.push(item);","            }","        }, this);","","        return new this.constructor(items);","    }","","});","","","}, '3.7.3', {\"requires\": [\"arraylist\"]});"];
_yuitest_coverage["build/arraylist-filter/arraylist-filter.js"].lines = {"1":0,"13":0,"29":0,"31":0,"32":0,"34":0,"35":0,"39":0};
_yuitest_coverage["build/arraylist-filter/arraylist-filter.js"].functions = {"(anonymous 2):31":0,"filter:28":0,"(anonymous 1):1":0};
_yuitest_coverage["build/arraylist-filter/arraylist-filter.js"].coveredLines = 8;
_yuitest_coverage["build/arraylist-filter/arraylist-filter.js"].coveredFunctions = 3;
_yuitest_coverline("build/arraylist-filter/arraylist-filter.js", 1);
YUI.add('arraylist-filter', function (Y, NAME) {

/**
 * Collection utilities beyond what is provided in the YUI core
 * @module collection
 * @submodule arraylist-filter
 * @deprecated Use ModelList or a custom subclass implementation
 */

/*
 * Adds filter method to ArrayList prototype
 */
_yuitest_coverfunc("build/arraylist-filter/arraylist-filter.js", "(anonymous 1)", 1);
_yuitest_coverline("build/arraylist-filter/arraylist-filter.js", 13);
Y.mix(Y.ArrayList.prototype, {

    /**
     * <p>Create a new ArrayList (or augmenting class instance) from a subset
     * of items as determined by the boolean function passed as the
     * argument.  The original ArrayList is unchanged.</p>
     *
     * <p>The validator signature is <code>validator( item )</code>.</p>
     *
     * @method filter
     * @param { Function } validator Boolean function to determine in or out.
     * @return { ArrayList } New instance based on who passed the validator.
     * @for ArrayList
     * @deprecated Use ModelList or a custom subclass implementation
     */
    filter: function(validator) {
        _yuitest_coverfunc("build/arraylist-filter/arraylist-filter.js", "filter", 28);
_yuitest_coverline("build/arraylist-filter/arraylist-filter.js", 29);
var items = [];

        _yuitest_coverline("build/arraylist-filter/arraylist-filter.js", 31);
Y.Array.each(this._items, function(item, i) {
            _yuitest_coverfunc("build/arraylist-filter/arraylist-filter.js", "(anonymous 2)", 31);
_yuitest_coverline("build/arraylist-filter/arraylist-filter.js", 32);
item = this.item(i);

            _yuitest_coverline("build/arraylist-filter/arraylist-filter.js", 34);
if (validator(item)) {
                _yuitest_coverline("build/arraylist-filter/arraylist-filter.js", 35);
items.push(item);
            }
        }, this);

        _yuitest_coverline("build/arraylist-filter/arraylist-filter.js", 39);
return new this.constructor(items);
    }

});


}, '3.7.3', {"requires": ["arraylist"]});
