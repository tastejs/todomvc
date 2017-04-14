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
_yuitest_coverage["build/array-invoke/array-invoke.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/array-invoke/array-invoke.js",
    code: []
};
_yuitest_coverage["build/array-invoke/array-invoke.js"].code=["YUI.add('array-invoke', function (Y, NAME) {","","/**","@module collection","@submodule array-invoke","*/","","/**","Executes a named method on each item in an array of objects. Items in the array","that do not have a function by that name will be skipped.","","@example","","    Y.Array.invoke(arrayOfDrags, 'plug', Y.Plugin.DDProxy);","","@method invoke","@param {Array} items Array of objects supporting the named method.","@param {String} name the name of the method to execute on each item.","@param {Any} [args*] Any number of additional args are passed as parameters to","  the execution of the named method.","@return {Array} All return values, indexed according to the item index.","@static","@for Array","**/","Y.Array.invoke = function(items, name) {","    var args = Y.Array(arguments, 2, true),","        isFunction = Y.Lang.isFunction,","        ret = [];","","    Y.Array.each(Y.Array(items), function(item, i) {","        if (item && isFunction(item[name])) {","            ret[i] = item[name].apply(item, args);","        }","    });","","    return ret;","};","","","}, '3.7.3', {\"requires\": [\"yui-base\"]});"];
_yuitest_coverage["build/array-invoke/array-invoke.js"].lines = {"1":0,"25":0,"26":0,"30":0,"31":0,"32":0,"36":0};
_yuitest_coverage["build/array-invoke/array-invoke.js"].functions = {"(anonymous 2):30":0,"invoke:25":0,"(anonymous 1):1":0};
_yuitest_coverage["build/array-invoke/array-invoke.js"].coveredLines = 7;
_yuitest_coverage["build/array-invoke/array-invoke.js"].coveredFunctions = 3;
_yuitest_coverline("build/array-invoke/array-invoke.js", 1);
YUI.add('array-invoke', function (Y, NAME) {

/**
@module collection
@submodule array-invoke
*/

/**
Executes a named method on each item in an array of objects. Items in the array
that do not have a function by that name will be skipped.

@example

    Y.Array.invoke(arrayOfDrags, 'plug', Y.Plugin.DDProxy);

@method invoke
@param {Array} items Array of objects supporting the named method.
@param {String} name the name of the method to execute on each item.
@param {Any} [args*] Any number of additional args are passed as parameters to
  the execution of the named method.
@return {Array} All return values, indexed according to the item index.
@static
@for Array
**/
_yuitest_coverfunc("build/array-invoke/array-invoke.js", "(anonymous 1)", 1);
_yuitest_coverline("build/array-invoke/array-invoke.js", 25);
Y.Array.invoke = function(items, name) {
    _yuitest_coverfunc("build/array-invoke/array-invoke.js", "invoke", 25);
_yuitest_coverline("build/array-invoke/array-invoke.js", 26);
var args = Y.Array(arguments, 2, true),
        isFunction = Y.Lang.isFunction,
        ret = [];

    _yuitest_coverline("build/array-invoke/array-invoke.js", 30);
Y.Array.each(Y.Array(items), function(item, i) {
        _yuitest_coverfunc("build/array-invoke/array-invoke.js", "(anonymous 2)", 30);
_yuitest_coverline("build/array-invoke/array-invoke.js", 31);
if (item && isFunction(item[name])) {
            _yuitest_coverline("build/array-invoke/array-invoke.js", 32);
ret[i] = item[name].apply(item, args);
        }
    });

    _yuitest_coverline("build/array-invoke/array-invoke.js", 36);
return ret;
};


}, '3.7.3', {"requires": ["yui-base"]});
