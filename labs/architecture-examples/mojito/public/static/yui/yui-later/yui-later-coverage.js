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
_yuitest_coverage["build/yui-later/yui-later.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/yui-later/yui-later.js",
    code: []
};
_yuitest_coverage["build/yui-later/yui-later.js"].code=["YUI.add('yui-later', function (Y, NAME) {","","/**"," * Provides a setTimeout/setInterval wrapper. This module is a `core` YUI module, <a href=\"../classes/YUI.html#method_later\">it's documentation is located under the YUI class</a>."," *"," * @module yui"," * @submodule yui-later"," */","","var NO_ARGS = [];","","/**"," * Executes the supplied function in the context of the supplied"," * object 'when' milliseconds later.  Executes the function a"," * single time unless periodic is set to true."," * @for YUI"," * @method later"," * @param when {int} the number of milliseconds to wait until the fn"," * is executed."," * @param o the context object."," * @param fn {Function|String} the function to execute or the name of"," * the method in the 'o' object to execute."," * @param data [Array] data that is provided to the function.  This"," * accepts either a single item or an array.  If an array is provided,"," * the function is executed with one parameter for each array item."," * If you need to pass a single array parameter, it needs to be wrapped"," * in an array [myarray]."," *"," * Note: native methods in IE may not have the call and apply methods."," * In this case, it will work, but you are limited to four arguments."," *"," * @param periodic {boolean} if true, executes continuously at supplied"," * interval until canceled."," * @return {object} a timer object. Call the cancel() method on this"," * object to stop the timer."," */","Y.later = function(when, o, fn, data, periodic) {","    when = when || 0;","    data = (!Y.Lang.isUndefined(data)) ? Y.Array(data) : NO_ARGS;","    o = o || Y.config.win || Y;","","    var cancelled = false,","        method = (o && Y.Lang.isString(fn)) ? o[fn] : fn,","        wrapper = function() {","            // IE 8- may execute a setInterval callback one last time","            // after clearInterval was called, so in order to preserve","            // the cancel() === no more runny-run, we have to jump through","            // an extra hoop.","            if (!cancelled) {","                if (!method.apply) {","                    method(data[0], data[1], data[2], data[3]);","                } else {","                    method.apply(o, data || NO_ARGS);","                }","            }","        },","        id = (periodic) ? setInterval(wrapper, when) : setTimeout(wrapper, when);","","    return {","        id: id,","        interval: periodic,","        cancel: function() {","            cancelled = true;","            if (this.interval) {","                clearInterval(id);","            } else {","                clearTimeout(id);","            }","        }","    };","};","","Y.Lang.later = Y.later;","","","","}, '3.7.3', {\"requires\": [\"yui-base\"]});"];
_yuitest_coverage["build/yui-later/yui-later.js"].lines = {"1":0,"10":0,"37":0,"38":0,"39":0,"40":0,"42":0,"49":0,"50":0,"51":0,"53":0,"59":0,"63":0,"64":0,"65":0,"67":0,"73":0};
_yuitest_coverage["build/yui-later/yui-later.js"].functions = {"wrapper:44":0,"cancel:62":0,"later:37":0,"(anonymous 1):1":0};
_yuitest_coverage["build/yui-later/yui-later.js"].coveredLines = 17;
_yuitest_coverage["build/yui-later/yui-later.js"].coveredFunctions = 4;
_yuitest_coverline("build/yui-later/yui-later.js", 1);
YUI.add('yui-later', function (Y, NAME) {

/**
 * Provides a setTimeout/setInterval wrapper. This module is a `core` YUI module, <a href="../classes/YUI.html#method_later">it's documentation is located under the YUI class</a>.
 *
 * @module yui
 * @submodule yui-later
 */

_yuitest_coverfunc("build/yui-later/yui-later.js", "(anonymous 1)", 1);
_yuitest_coverline("build/yui-later/yui-later.js", 10);
var NO_ARGS = [];

/**
 * Executes the supplied function in the context of the supplied
 * object 'when' milliseconds later.  Executes the function a
 * single time unless periodic is set to true.
 * @for YUI
 * @method later
 * @param when {int} the number of milliseconds to wait until the fn
 * is executed.
 * @param o the context object.
 * @param fn {Function|String} the function to execute or the name of
 * the method in the 'o' object to execute.
 * @param data [Array] data that is provided to the function.  This
 * accepts either a single item or an array.  If an array is provided,
 * the function is executed with one parameter for each array item.
 * If you need to pass a single array parameter, it needs to be wrapped
 * in an array [myarray].
 *
 * Note: native methods in IE may not have the call and apply methods.
 * In this case, it will work, but you are limited to four arguments.
 *
 * @param periodic {boolean} if true, executes continuously at supplied
 * interval until canceled.
 * @return {object} a timer object. Call the cancel() method on this
 * object to stop the timer.
 */
_yuitest_coverline("build/yui-later/yui-later.js", 37);
Y.later = function(when, o, fn, data, periodic) {
    _yuitest_coverfunc("build/yui-later/yui-later.js", "later", 37);
_yuitest_coverline("build/yui-later/yui-later.js", 38);
when = when || 0;
    _yuitest_coverline("build/yui-later/yui-later.js", 39);
data = (!Y.Lang.isUndefined(data)) ? Y.Array(data) : NO_ARGS;
    _yuitest_coverline("build/yui-later/yui-later.js", 40);
o = o || Y.config.win || Y;

    _yuitest_coverline("build/yui-later/yui-later.js", 42);
var cancelled = false,
        method = (o && Y.Lang.isString(fn)) ? o[fn] : fn,
        wrapper = function() {
            // IE 8- may execute a setInterval callback one last time
            // after clearInterval was called, so in order to preserve
            // the cancel() === no more runny-run, we have to jump through
            // an extra hoop.
            _yuitest_coverfunc("build/yui-later/yui-later.js", "wrapper", 44);
_yuitest_coverline("build/yui-later/yui-later.js", 49);
if (!cancelled) {
                _yuitest_coverline("build/yui-later/yui-later.js", 50);
if (!method.apply) {
                    _yuitest_coverline("build/yui-later/yui-later.js", 51);
method(data[0], data[1], data[2], data[3]);
                } else {
                    _yuitest_coverline("build/yui-later/yui-later.js", 53);
method.apply(o, data || NO_ARGS);
                }
            }
        },
        id = (periodic) ? setInterval(wrapper, when) : setTimeout(wrapper, when);

    _yuitest_coverline("build/yui-later/yui-later.js", 59);
return {
        id: id,
        interval: periodic,
        cancel: function() {
            _yuitest_coverfunc("build/yui-later/yui-later.js", "cancel", 62);
_yuitest_coverline("build/yui-later/yui-later.js", 63);
cancelled = true;
            _yuitest_coverline("build/yui-later/yui-later.js", 64);
if (this.interval) {
                _yuitest_coverline("build/yui-later/yui-later.js", 65);
clearInterval(id);
            } else {
                _yuitest_coverline("build/yui-later/yui-later.js", 67);
clearTimeout(id);
            }
        }
    };
};

_yuitest_coverline("build/yui-later/yui-later.js", 73);
Y.Lang.later = Y.later;



}, '3.7.3', {"requires": ["yui-base"]});
