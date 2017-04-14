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
_yuitest_coverage["build/yui-log-nodejs/yui-log-nodejs.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/yui-log-nodejs/yui-log-nodejs.js",
    code: []
};
_yuitest_coverage["build/yui-log-nodejs/yui-log-nodejs.js"].code=["YUI.add('yui-log-nodejs', function (Y, NAME) {","","var sys = require(process.binding('natives').util ? 'util' : 'sys'),","    hasColor = false;","","try {","    var stdio = require(\"stdio\");","    hasColor = stdio.isStderrATTY();","} catch (ex) {","    hasColor = true;","}","","Y.config.useColor = hasColor;","","Y.consoleColor = function(str, num) {","    if (!this.config.useColor) {","        return str;","    }","    if (!num) {","        num = '32';","    }","    return \"\\u001b[\" + num +\"m\" + str + \"\\u001b[0m\";","};","","","var logFn = function(str, t, m) {","    var id = '';","    if (this.id) {","        id = '[' + this.id + ']:';","    }","    t = t || 'info';","    m = (m) ? this.consoleColor(' (' +  m.toLowerCase() + '):', 35) : '';","    ","    if (str === null) {","        str = 'null';","    }","","    if ((typeof str === 'object') || str instanceof Array) {","        try {","            //Should we use this?","            if (str.tagName || str._yuid || str._query) {","                str = str.toString();","            } else {","                str = sys.inspect(str);","            }","        } catch (e) {","            //Fail catcher","        }","    }","","    var lvl = '37;40', mLvl = ((str) ? '' : 31);","    t = t+''; //Force to a string..","    switch (t.toLowerCase()) {","        case 'error':","            lvl = mLvl = 31;","            break;","        case 'warn':","            lvl = 33;","            break;","        case 'debug':","            lvl = 34;","            break;","    }","    if (typeof str === 'string') {","        if (str && str.indexOf(\"\\n\") !== -1) {","            str = \"\\n\" + str;","        }","    }","","    // output log messages to stderr","    sys.error(this.consoleColor(t.toLowerCase() + ':', lvl) + m + ' ' + this.consoleColor(str, mLvl));","};","","if (!Y.config.logFn) {","    Y.config.logFn = logFn;","}","","","","}, '3.7.3');"];
_yuitest_coverage["build/yui-log-nodejs/yui-log-nodejs.js"].lines = {"1":0,"3":0,"6":0,"7":0,"8":0,"10":0,"13":0,"15":0,"16":0,"17":0,"19":0,"20":0,"22":0,"26":0,"27":0,"28":0,"29":0,"31":0,"32":0,"34":0,"35":0,"38":0,"39":0,"41":0,"42":0,"44":0,"51":0,"52":0,"53":0,"55":0,"56":0,"58":0,"59":0,"61":0,"62":0,"64":0,"65":0,"66":0,"71":0,"74":0,"75":0};
_yuitest_coverage["build/yui-log-nodejs/yui-log-nodejs.js"].functions = {"consoleColor:15":0,"logFn:26":0,"(anonymous 1):1":0};
_yuitest_coverage["build/yui-log-nodejs/yui-log-nodejs.js"].coveredLines = 41;
_yuitest_coverage["build/yui-log-nodejs/yui-log-nodejs.js"].coveredFunctions = 3;
_yuitest_coverline("build/yui-log-nodejs/yui-log-nodejs.js", 1);
YUI.add('yui-log-nodejs', function (Y, NAME) {

_yuitest_coverfunc("build/yui-log-nodejs/yui-log-nodejs.js", "(anonymous 1)", 1);
_yuitest_coverline("build/yui-log-nodejs/yui-log-nodejs.js", 3);
var sys = require(process.binding('natives').util ? 'util' : 'sys'),
    hasColor = false;

_yuitest_coverline("build/yui-log-nodejs/yui-log-nodejs.js", 6);
try {
    _yuitest_coverline("build/yui-log-nodejs/yui-log-nodejs.js", 7);
var stdio = require("stdio");
    _yuitest_coverline("build/yui-log-nodejs/yui-log-nodejs.js", 8);
hasColor = stdio.isStderrATTY();
} catch (ex) {
    _yuitest_coverline("build/yui-log-nodejs/yui-log-nodejs.js", 10);
hasColor = true;
}

_yuitest_coverline("build/yui-log-nodejs/yui-log-nodejs.js", 13);
Y.config.useColor = hasColor;

_yuitest_coverline("build/yui-log-nodejs/yui-log-nodejs.js", 15);
Y.consoleColor = function(str, num) {
    _yuitest_coverfunc("build/yui-log-nodejs/yui-log-nodejs.js", "consoleColor", 15);
_yuitest_coverline("build/yui-log-nodejs/yui-log-nodejs.js", 16);
if (!this.config.useColor) {
        _yuitest_coverline("build/yui-log-nodejs/yui-log-nodejs.js", 17);
return str;
    }
    _yuitest_coverline("build/yui-log-nodejs/yui-log-nodejs.js", 19);
if (!num) {
        _yuitest_coverline("build/yui-log-nodejs/yui-log-nodejs.js", 20);
num = '32';
    }
    _yuitest_coverline("build/yui-log-nodejs/yui-log-nodejs.js", 22);
return "\u001b[" + num +"m" + str + "\u001b[0m";
};


_yuitest_coverline("build/yui-log-nodejs/yui-log-nodejs.js", 26);
var logFn = function(str, t, m) {
    _yuitest_coverfunc("build/yui-log-nodejs/yui-log-nodejs.js", "logFn", 26);
_yuitest_coverline("build/yui-log-nodejs/yui-log-nodejs.js", 27);
var id = '';
    _yuitest_coverline("build/yui-log-nodejs/yui-log-nodejs.js", 28);
if (this.id) {
        _yuitest_coverline("build/yui-log-nodejs/yui-log-nodejs.js", 29);
id = '[' + this.id + ']:';
    }
    _yuitest_coverline("build/yui-log-nodejs/yui-log-nodejs.js", 31);
t = t || 'info';
    _yuitest_coverline("build/yui-log-nodejs/yui-log-nodejs.js", 32);
m = (m) ? this.consoleColor(' (' +  m.toLowerCase() + '):', 35) : '';
    
    _yuitest_coverline("build/yui-log-nodejs/yui-log-nodejs.js", 34);
if (str === null) {
        _yuitest_coverline("build/yui-log-nodejs/yui-log-nodejs.js", 35);
str = 'null';
    }

    _yuitest_coverline("build/yui-log-nodejs/yui-log-nodejs.js", 38);
if ((typeof str === 'object') || str instanceof Array) {
        _yuitest_coverline("build/yui-log-nodejs/yui-log-nodejs.js", 39);
try {
            //Should we use this?
            _yuitest_coverline("build/yui-log-nodejs/yui-log-nodejs.js", 41);
if (str.tagName || str._yuid || str._query) {
                _yuitest_coverline("build/yui-log-nodejs/yui-log-nodejs.js", 42);
str = str.toString();
            } else {
                _yuitest_coverline("build/yui-log-nodejs/yui-log-nodejs.js", 44);
str = sys.inspect(str);
            }
        } catch (e) {
            //Fail catcher
        }
    }

    _yuitest_coverline("build/yui-log-nodejs/yui-log-nodejs.js", 51);
var lvl = '37;40', mLvl = ((str) ? '' : 31);
    _yuitest_coverline("build/yui-log-nodejs/yui-log-nodejs.js", 52);
t = t+''; //Force to a string..
    _yuitest_coverline("build/yui-log-nodejs/yui-log-nodejs.js", 53);
switch (t.toLowerCase()) {
        case 'error':
            _yuitest_coverline("build/yui-log-nodejs/yui-log-nodejs.js", 55);
lvl = mLvl = 31;
            _yuitest_coverline("build/yui-log-nodejs/yui-log-nodejs.js", 56);
break;
        case 'warn':
            _yuitest_coverline("build/yui-log-nodejs/yui-log-nodejs.js", 58);
lvl = 33;
            _yuitest_coverline("build/yui-log-nodejs/yui-log-nodejs.js", 59);
break;
        case 'debug':
            _yuitest_coverline("build/yui-log-nodejs/yui-log-nodejs.js", 61);
lvl = 34;
            _yuitest_coverline("build/yui-log-nodejs/yui-log-nodejs.js", 62);
break;
    }
    _yuitest_coverline("build/yui-log-nodejs/yui-log-nodejs.js", 64);
if (typeof str === 'string') {
        _yuitest_coverline("build/yui-log-nodejs/yui-log-nodejs.js", 65);
if (str && str.indexOf("\n") !== -1) {
            _yuitest_coverline("build/yui-log-nodejs/yui-log-nodejs.js", 66);
str = "\n" + str;
        }
    }

    // output log messages to stderr
    _yuitest_coverline("build/yui-log-nodejs/yui-log-nodejs.js", 71);
sys.error(this.consoleColor(t.toLowerCase() + ':', lvl) + m + ' ' + this.consoleColor(str, mLvl));
};

_yuitest_coverline("build/yui-log-nodejs/yui-log-nodejs.js", 74);
if (!Y.config.logFn) {
    _yuitest_coverline("build/yui-log-nodejs/yui-log-nodejs.js", 75);
Y.config.logFn = logFn;
}



}, '3.7.3');
