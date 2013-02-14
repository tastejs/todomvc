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
_yuitest_coverage["build/yql-winjs/yql-winjs.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/yql-winjs/yql-winjs.js",
    code: []
};
_yuitest_coverage["build/yql-winjs/yql-winjs.js"].code=["YUI.add('yql-winjs', function (Y, NAME) {","","/**","* WinJS plugin for YQL to use native XHR to make requests instead of JSONP.","* Not required by the user, it's conditionally loaded and should \"just work\".","* @module yql","* @submodule yql-winjs","*/","","//Over writes Y.YQLRequest._send to use IO instead of JSONP","Y.YQLRequest.prototype._send = function (url, o) {","    var req = new XMLHttpRequest(),","        timer;","","    req.open('GET', url, true);","    req.onreadystatechange = function () {","        if (req.readyState === 4) { //Complete","            //No status code check here, since the YQL service will return JSON","            clearTimeout(timer);","            //No need to \"call\" this, YQL handles the context","            o.on.success(JSON.parse(req.responseText));","        }","    };","    req.send();","","    //Simple timer to catch no connections","    timer = setTimeout(function() {","        req.abort();","        o.on.timeout('script timeout');","    }, o.timeout || 30000);","};","","","}, '3.7.3');"];
_yuitest_coverage["build/yql-winjs/yql-winjs.js"].lines = {"1":0,"11":0,"12":0,"15":0,"16":0,"17":0,"19":0,"21":0,"24":0,"27":0,"28":0,"29":0};
_yuitest_coverage["build/yql-winjs/yql-winjs.js"].functions = {"onreadystatechange:16":0,"(anonymous 2):27":0,"_send:11":0,"(anonymous 1):1":0};
_yuitest_coverage["build/yql-winjs/yql-winjs.js"].coveredLines = 12;
_yuitest_coverage["build/yql-winjs/yql-winjs.js"].coveredFunctions = 4;
_yuitest_coverline("build/yql-winjs/yql-winjs.js", 1);
YUI.add('yql-winjs', function (Y, NAME) {

/**
* WinJS plugin for YQL to use native XHR to make requests instead of JSONP.
* Not required by the user, it's conditionally loaded and should "just work".
* @module yql
* @submodule yql-winjs
*/

//Over writes Y.YQLRequest._send to use IO instead of JSONP
_yuitest_coverfunc("build/yql-winjs/yql-winjs.js", "(anonymous 1)", 1);
_yuitest_coverline("build/yql-winjs/yql-winjs.js", 11);
Y.YQLRequest.prototype._send = function (url, o) {
    _yuitest_coverfunc("build/yql-winjs/yql-winjs.js", "_send", 11);
_yuitest_coverline("build/yql-winjs/yql-winjs.js", 12);
var req = new XMLHttpRequest(),
        timer;

    _yuitest_coverline("build/yql-winjs/yql-winjs.js", 15);
req.open('GET', url, true);
    _yuitest_coverline("build/yql-winjs/yql-winjs.js", 16);
req.onreadystatechange = function () {
        _yuitest_coverfunc("build/yql-winjs/yql-winjs.js", "onreadystatechange", 16);
_yuitest_coverline("build/yql-winjs/yql-winjs.js", 17);
if (req.readyState === 4) { //Complete
            //No status code check here, since the YQL service will return JSON
            _yuitest_coverline("build/yql-winjs/yql-winjs.js", 19);
clearTimeout(timer);
            //No need to "call" this, YQL handles the context
            _yuitest_coverline("build/yql-winjs/yql-winjs.js", 21);
o.on.success(JSON.parse(req.responseText));
        }
    };
    _yuitest_coverline("build/yql-winjs/yql-winjs.js", 24);
req.send();

    //Simple timer to catch no connections
    _yuitest_coverline("build/yql-winjs/yql-winjs.js", 27);
timer = setTimeout(function() {
        _yuitest_coverfunc("build/yql-winjs/yql-winjs.js", "(anonymous 2)", 27);
_yuitest_coverline("build/yql-winjs/yql-winjs.js", 28);
req.abort();
        _yuitest_coverline("build/yql-winjs/yql-winjs.js", 29);
o.on.timeout('script timeout');
    }, o.timeout || 30000);
};


}, '3.7.3');
