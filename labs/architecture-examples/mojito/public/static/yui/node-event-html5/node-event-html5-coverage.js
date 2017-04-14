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
_yuitest_coverage["build/node-event-html5/node-event-html5.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/node-event-html5/node-event-html5.js",
    code: []
};
_yuitest_coverage["build/node-event-html5/node-event-html5.js"].code=["YUI.add('node-event-html5', function (Y, NAME) {","","/**"," * Adds HTML5 event support to Node."," *"," * @module node"," * @submodule node-event-html5"," **/","","Y.mix(Y.Node.DOM_EVENTS, {","    DOMActivate: 1,","    DOMContentLoaded: 1,","    afterprint: 1,","    beforeprint: 1,","    canplay: 1,","    canplaythrough: 1,","    durationchange: 1,","    emptied: 1,","    ended: 1,","    formchange: 1,","    forminput: 1,","    hashchange: 1,","    input: 1,","    invalid: 1,","    loadedmetadata: 1,","    loadeddata: 1,","    loadstart: 1,","    offline: 1,","    online: 1,","    pagehide: 1,","    pageshow: 1,","    pause: 1,","    play: 1,","    playing: 1,","    popstate: 1,","    progress: 1,","    ratechange: 1,","    readystatechange: 1,","    redo: 1,","    seeking: 1,","    seeked: 1,","    show: 1,","    stalled: 1,","    suspend: 1,","    timeupdate: 1,","    undo: 1,","    volumechange: 1,","    waiting: 1","});","","","}, '3.7.3', {\"requires\": [\"node-base\"]});"];
_yuitest_coverage["build/node-event-html5/node-event-html5.js"].lines = {"1":0,"10":0};
_yuitest_coverage["build/node-event-html5/node-event-html5.js"].functions = {"(anonymous 1):1":0};
_yuitest_coverage["build/node-event-html5/node-event-html5.js"].coveredLines = 2;
_yuitest_coverage["build/node-event-html5/node-event-html5.js"].coveredFunctions = 1;
_yuitest_coverline("build/node-event-html5/node-event-html5.js", 1);
YUI.add('node-event-html5', function (Y, NAME) {

/**
 * Adds HTML5 event support to Node.
 *
 * @module node
 * @submodule node-event-html5
 **/

_yuitest_coverfunc("build/node-event-html5/node-event-html5.js", "(anonymous 1)", 1);
_yuitest_coverline("build/node-event-html5/node-event-html5.js", 10);
Y.mix(Y.Node.DOM_EVENTS, {
    DOMActivate: 1,
    DOMContentLoaded: 1,
    afterprint: 1,
    beforeprint: 1,
    canplay: 1,
    canplaythrough: 1,
    durationchange: 1,
    emptied: 1,
    ended: 1,
    formchange: 1,
    forminput: 1,
    hashchange: 1,
    input: 1,
    invalid: 1,
    loadedmetadata: 1,
    loadeddata: 1,
    loadstart: 1,
    offline: 1,
    online: 1,
    pagehide: 1,
    pageshow: 1,
    pause: 1,
    play: 1,
    playing: 1,
    popstate: 1,
    progress: 1,
    ratechange: 1,
    readystatechange: 1,
    redo: 1,
    seeking: 1,
    seeked: 1,
    show: 1,
    stalled: 1,
    suspend: 1,
    timeupdate: 1,
    undo: 1,
    volumechange: 1,
    waiting: 1
});


}, '3.7.3', {"requires": ["node-base"]});
