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
_yuitest_coverage["build/uploader/uploader.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/uploader/uploader.js",
    code: []
};
_yuitest_coverage["build/uploader/uploader.js"].code=["YUI.add('uploader', function (Y, NAME) {","","/**"," * Provides UI for selecting multiple files and functionality for "," * uploading multiple files to the server with support for either"," * html5 or Flash transport mechanisms, automatic queue management,"," * upload progress monitoring, and error events."," * @module uploader"," * @main uploader"," * @since 3.5.0"," */","","/**"," * `Y.Uploader` serves as an alias for either <a href=\"UploaderFlash.html\">`Y.UploaderFlash`</a>"," * or <a href=\"UploaderHTML5.html\">`Y.UploaderHTML5`</a>, depending on the feature set available"," * in a specific browser. If neither HTML5 nor Flash transport layers are available, `Y.Uploader.TYPE` "," * static property is set to `\"none\"`."," *"," * @class Uploader"," */",""," /**"," * The static property reflecting the type of uploader that `Y.Uploader`"," * aliases. The possible values are:"," * <ul>"," * <li><strong>`\"html5\"`</strong>: Y.Uploader is an alias for <a href=\"UploaderHTML5.html\">Y.UploaderHTML5</a></li>"," * <li><strong>`\"flash\"`</strong>: Y.Uploader is an alias for <a href=\"UploaderFlash.html\">Y.UploaderFlash</a></li>"," * <li><strong>`\"none\"`</strong>: Neither Flash not HTML5 are available, and Y.Uploader does"," * not reference an actual implementation.</li>"," * </ul>"," *"," * @property TYPE"," * @type {String}"," * @static"," */",""," var Win = Y.config.win;",""," if (Win && Win.File && Win.FormData && Win.XMLHttpRequest) {","    Y.Uploader = Y.UploaderHTML5;"," }",""," else if (Y.SWFDetect.isFlashVersionAtLeast(10,0,45)) {","    Y.Uploader = Y.UploaderFlash;"," }",""," else {","    Y.namespace(\"Uploader\");","    Y.Uploader.TYPE = \"none\";"," }","","}, '3.7.3', {\"requires\": [\"uploader-html5\", \"uploader-flash\"]});"];
_yuitest_coverage["build/uploader/uploader.js"].lines = {"1":0,"37":0,"39":0,"40":0,"43":0,"44":0,"48":0,"49":0};
_yuitest_coverage["build/uploader/uploader.js"].functions = {"(anonymous 1):1":0};
_yuitest_coverage["build/uploader/uploader.js"].coveredLines = 8;
_yuitest_coverage["build/uploader/uploader.js"].coveredFunctions = 1;
_yuitest_coverline("build/uploader/uploader.js", 1);
YUI.add('uploader', function (Y, NAME) {

/**
 * Provides UI for selecting multiple files and functionality for 
 * uploading multiple files to the server with support for either
 * html5 or Flash transport mechanisms, automatic queue management,
 * upload progress monitoring, and error events.
 * @module uploader
 * @main uploader
 * @since 3.5.0
 */

/**
 * `Y.Uploader` serves as an alias for either <a href="UploaderFlash.html">`Y.UploaderFlash`</a>
 * or <a href="UploaderHTML5.html">`Y.UploaderHTML5`</a>, depending on the feature set available
 * in a specific browser. If neither HTML5 nor Flash transport layers are available, `Y.Uploader.TYPE` 
 * static property is set to `"none"`.
 *
 * @class Uploader
 */

 /**
 * The static property reflecting the type of uploader that `Y.Uploader`
 * aliases. The possible values are:
 * <ul>
 * <li><strong>`"html5"`</strong>: Y.Uploader is an alias for <a href="UploaderHTML5.html">Y.UploaderHTML5</a></li>
 * <li><strong>`"flash"`</strong>: Y.Uploader is an alias for <a href="UploaderFlash.html">Y.UploaderFlash</a></li>
 * <li><strong>`"none"`</strong>: Neither Flash not HTML5 are available, and Y.Uploader does
 * not reference an actual implementation.</li>
 * </ul>
 *
 * @property TYPE
 * @type {String}
 * @static
 */

 _yuitest_coverfunc("build/uploader/uploader.js", "(anonymous 1)", 1);
_yuitest_coverline("build/uploader/uploader.js", 37);
var Win = Y.config.win;

 _yuitest_coverline("build/uploader/uploader.js", 39);
if (Win && Win.File && Win.FormData && Win.XMLHttpRequest) {
    _yuitest_coverline("build/uploader/uploader.js", 40);
Y.Uploader = Y.UploaderHTML5;
 }

 else {_yuitest_coverline("build/uploader/uploader.js", 43);
if (Y.SWFDetect.isFlashVersionAtLeast(10,0,45)) {
    _yuitest_coverline("build/uploader/uploader.js", 44);
Y.Uploader = Y.UploaderFlash;
 }

 else {
    _yuitest_coverline("build/uploader/uploader.js", 48);
Y.namespace("Uploader");
    _yuitest_coverline("build/uploader/uploader.js", 49);
Y.Uploader.TYPE = "none";
 }}

}, '3.7.3', {"requires": ["uploader-html5", "uploader-flash"]});
