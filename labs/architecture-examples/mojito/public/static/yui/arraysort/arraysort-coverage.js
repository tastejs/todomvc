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
_yuitest_coverage["build/arraysort/arraysort.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/arraysort/arraysort.js",
    code: []
};
_yuitest_coverage["build/arraysort/arraysort.js"].code=["YUI.add('arraysort', function (Y, NAME) {","","/**","Provides a case-insenstive comparator which can be used for array sorting.","","@module arraysort","*/","","var LANG = Y.Lang,","    ISVALUE = LANG.isValue,","    ISSTRING = LANG.isString;","","/**","Provides a case-insenstive comparator which can be used for array sorting.","","@class ArraySort","*/","","Y.ArraySort = {","","    /**","    Comparator function for simple case-insensitive sorting of an array of","    strings.","","    @method compare","    @param a {Object} First sort argument.","    @param b {Object} Second sort argument.","    @param desc {Boolean} `true` if sort direction is descending, `false` if","        sort direction is ascending.","    @return {Boolean} -1 when a < b. 0 when a == b. 1 when a > b.","    */","    compare: function(a, b, desc) {","        if(!ISVALUE(a)) {","            if(!ISVALUE(b)) {","                return 0;","            }","            else {","                return 1;","            }","        }","        else if(!ISVALUE(b)) {","            return -1;","        }","","        if(ISSTRING(a)) {","            a = a.toLowerCase();","        }","        if(ISSTRING(b)) {","            b = b.toLowerCase();","        }","        if(a < b) {","            return (desc) ? 1 : -1;","        }","        else if (a > b) {","            return (desc) ? -1 : 1;","        }","        else {","            return 0;","        }","    }","","};","","","}, '3.7.3', {\"requires\": [\"yui-base\"]});"];
_yuitest_coverage["build/arraysort/arraysort.js"].lines = {"1":0,"9":0,"19":0,"33":0,"34":0,"35":0,"38":0,"41":0,"42":0,"45":0,"46":0,"48":0,"49":0,"51":0,"52":0,"54":0,"55":0,"58":0};
_yuitest_coverage["build/arraysort/arraysort.js"].functions = {"compare:32":0,"(anonymous 1):1":0};
_yuitest_coverage["build/arraysort/arraysort.js"].coveredLines = 18;
_yuitest_coverage["build/arraysort/arraysort.js"].coveredFunctions = 2;
_yuitest_coverline("build/arraysort/arraysort.js", 1);
YUI.add('arraysort', function (Y, NAME) {

/**
Provides a case-insenstive comparator which can be used for array sorting.

@module arraysort
*/

_yuitest_coverfunc("build/arraysort/arraysort.js", "(anonymous 1)", 1);
_yuitest_coverline("build/arraysort/arraysort.js", 9);
var LANG = Y.Lang,
    ISVALUE = LANG.isValue,
    ISSTRING = LANG.isString;

/**
Provides a case-insenstive comparator which can be used for array sorting.

@class ArraySort
*/

_yuitest_coverline("build/arraysort/arraysort.js", 19);
Y.ArraySort = {

    /**
    Comparator function for simple case-insensitive sorting of an array of
    strings.

    @method compare
    @param a {Object} First sort argument.
    @param b {Object} Second sort argument.
    @param desc {Boolean} `true` if sort direction is descending, `false` if
        sort direction is ascending.
    @return {Boolean} -1 when a < b. 0 when a == b. 1 when a > b.
    */
    compare: function(a, b, desc) {
        _yuitest_coverfunc("build/arraysort/arraysort.js", "compare", 32);
_yuitest_coverline("build/arraysort/arraysort.js", 33);
if(!ISVALUE(a)) {
            _yuitest_coverline("build/arraysort/arraysort.js", 34);
if(!ISVALUE(b)) {
                _yuitest_coverline("build/arraysort/arraysort.js", 35);
return 0;
            }
            else {
                _yuitest_coverline("build/arraysort/arraysort.js", 38);
return 1;
            }
        }
        else {_yuitest_coverline("build/arraysort/arraysort.js", 41);
if(!ISVALUE(b)) {
            _yuitest_coverline("build/arraysort/arraysort.js", 42);
return -1;
        }}

        _yuitest_coverline("build/arraysort/arraysort.js", 45);
if(ISSTRING(a)) {
            _yuitest_coverline("build/arraysort/arraysort.js", 46);
a = a.toLowerCase();
        }
        _yuitest_coverline("build/arraysort/arraysort.js", 48);
if(ISSTRING(b)) {
            _yuitest_coverline("build/arraysort/arraysort.js", 49);
b = b.toLowerCase();
        }
        _yuitest_coverline("build/arraysort/arraysort.js", 51);
if(a < b) {
            _yuitest_coverline("build/arraysort/arraysort.js", 52);
return (desc) ? 1 : -1;
        }
        else {_yuitest_coverline("build/arraysort/arraysort.js", 54);
if (a > b) {
            _yuitest_coverline("build/arraysort/arraysort.js", 55);
return (desc) ? -1 : 1;
        }
        else {
            _yuitest_coverline("build/arraysort/arraysort.js", 58);
return 0;
        }}
    }

};


}, '3.7.3', {"requires": ["yui-base"]});
