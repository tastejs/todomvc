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
_yuitest_coverage["build/dump/dump.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/dump/dump.js",
    code: []
};
_yuitest_coverage["build/dump/dump.js"].code=["YUI.add('dump', function (Y, NAME) {","","/**"," * Returns a simple string representation of the object or array."," * Other types of objects will be returned unprocessed.  Arrays"," * are expected to be indexed.  Use object notation for"," * associative arrays."," *"," * If included, the dump method is added to the YUI instance."," *"," * @module dump"," */","","    var L = Y.Lang,","        OBJ = '{...}',","        FUN = 'f(){...}',","        COMMA = ', ',","        ARROW = ' => ',","","    /**","     * Returns a simple string representation of the object or array.","     * Other types of objects will be returned unprocessed.  Arrays","     * are expected to be indexed.","     *","     * @method dump","     * @param {Object} o The object to dump.","     * @param {Number} d How deep to recurse child objects, default 3.","     * @return {String} the dump result.","     * @for YUI","     */","    dump = function(o, d) {","        var i, len, s = [], type = L.type(o);","","        // Cast non-objects to string","        // Skip dates because the std toString is what we want","        // Skip HTMLElement-like objects because trying to dump","        // an element will cause an unhandled exception in FF 2.x","        if (!L.isObject(o)) {","            return o + '';","        } else if (type == 'date') {","            return o;","        } else if (o.nodeType && o.tagName) {","            return o.tagName + '#' + o.id;","        } else if (o.document && o.navigator) {","            return 'window';","        } else if (o.location && o.body) {","            return 'document';","        } else if (type == 'function') {","            return FUN;","        }","","        // dig into child objects the depth specifed. Default 3","        d = (L.isNumber(d)) ? d : 3;","","        // arrays [1, 2, 3]","        if (type == 'array') {","            s.push('[');","            for (i = 0, len = o.length; i < len; i = i + 1) {","                if (L.isObject(o[i])) {","                    s.push((d > 0) ? L.dump(o[i], d - 1) : OBJ);","                } else {","                    s.push(o[i]);","                }","                s.push(COMMA);","            }","            if (s.length > 1) {","                s.pop();","            }","            s.push(']');","        // regexp /foo/","        } else if (type == 'regexp') {","            s.push(o.toString());","        // objects {k1 => v1, k2 => v2}","        } else {","            s.push('{');","            for (i in o) {","                if (o.hasOwnProperty(i)) {","                    try {","                        s.push(i + ARROW);","                        if (L.isObject(o[i])) {","                            s.push((d > 0) ? L.dump(o[i], d - 1) : OBJ);","                        } else {","                            s.push(o[i]);","                        }","                        s.push(COMMA);","                    } catch (e) {","                        s.push('Error: ' + e.message);","                    }","                }","            }","            if (s.length > 1) {","                s.pop();","            }","            s.push('}');","        }","","        return s.join('');","    };","","    Y.dump = dump;","    L.dump = dump;","","","","}, '3.7.3', {\"requires\": [\"yui-base\"]});"];
_yuitest_coverage["build/dump/dump.js"].lines = {"1":0,"14":0,"32":0,"38":0,"39":0,"40":0,"41":0,"42":0,"43":0,"44":0,"45":0,"46":0,"47":0,"48":0,"49":0,"53":0,"56":0,"57":0,"58":0,"59":0,"60":0,"62":0,"64":0,"66":0,"67":0,"69":0,"71":0,"72":0,"75":0,"76":0,"77":0,"78":0,"79":0,"80":0,"81":0,"83":0,"85":0,"87":0,"91":0,"92":0,"94":0,"97":0,"100":0,"101":0};
_yuitest_coverage["build/dump/dump.js"].functions = {"dump:31":0,"(anonymous 1):1":0};
_yuitest_coverage["build/dump/dump.js"].coveredLines = 44;
_yuitest_coverage["build/dump/dump.js"].coveredFunctions = 2;
_yuitest_coverline("build/dump/dump.js", 1);
YUI.add('dump', function (Y, NAME) {

/**
 * Returns a simple string representation of the object or array.
 * Other types of objects will be returned unprocessed.  Arrays
 * are expected to be indexed.  Use object notation for
 * associative arrays.
 *
 * If included, the dump method is added to the YUI instance.
 *
 * @module dump
 */

    _yuitest_coverfunc("build/dump/dump.js", "(anonymous 1)", 1);
_yuitest_coverline("build/dump/dump.js", 14);
var L = Y.Lang,
        OBJ = '{...}',
        FUN = 'f(){...}',
        COMMA = ', ',
        ARROW = ' => ',

    /**
     * Returns a simple string representation of the object or array.
     * Other types of objects will be returned unprocessed.  Arrays
     * are expected to be indexed.
     *
     * @method dump
     * @param {Object} o The object to dump.
     * @param {Number} d How deep to recurse child objects, default 3.
     * @return {String} the dump result.
     * @for YUI
     */
    dump = function(o, d) {
        _yuitest_coverfunc("build/dump/dump.js", "dump", 31);
_yuitest_coverline("build/dump/dump.js", 32);
var i, len, s = [], type = L.type(o);

        // Cast non-objects to string
        // Skip dates because the std toString is what we want
        // Skip HTMLElement-like objects because trying to dump
        // an element will cause an unhandled exception in FF 2.x
        _yuitest_coverline("build/dump/dump.js", 38);
if (!L.isObject(o)) {
            _yuitest_coverline("build/dump/dump.js", 39);
return o + '';
        } else {_yuitest_coverline("build/dump/dump.js", 40);
if (type == 'date') {
            _yuitest_coverline("build/dump/dump.js", 41);
return o;
        } else {_yuitest_coverline("build/dump/dump.js", 42);
if (o.nodeType && o.tagName) {
            _yuitest_coverline("build/dump/dump.js", 43);
return o.tagName + '#' + o.id;
        } else {_yuitest_coverline("build/dump/dump.js", 44);
if (o.document && o.navigator) {
            _yuitest_coverline("build/dump/dump.js", 45);
return 'window';
        } else {_yuitest_coverline("build/dump/dump.js", 46);
if (o.location && o.body) {
            _yuitest_coverline("build/dump/dump.js", 47);
return 'document';
        } else {_yuitest_coverline("build/dump/dump.js", 48);
if (type == 'function') {
            _yuitest_coverline("build/dump/dump.js", 49);
return FUN;
        }}}}}}

        // dig into child objects the depth specifed. Default 3
        _yuitest_coverline("build/dump/dump.js", 53);
d = (L.isNumber(d)) ? d : 3;

        // arrays [1, 2, 3]
        _yuitest_coverline("build/dump/dump.js", 56);
if (type == 'array') {
            _yuitest_coverline("build/dump/dump.js", 57);
s.push('[');
            _yuitest_coverline("build/dump/dump.js", 58);
for (i = 0, len = o.length; i < len; i = i + 1) {
                _yuitest_coverline("build/dump/dump.js", 59);
if (L.isObject(o[i])) {
                    _yuitest_coverline("build/dump/dump.js", 60);
s.push((d > 0) ? L.dump(o[i], d - 1) : OBJ);
                } else {
                    _yuitest_coverline("build/dump/dump.js", 62);
s.push(o[i]);
                }
                _yuitest_coverline("build/dump/dump.js", 64);
s.push(COMMA);
            }
            _yuitest_coverline("build/dump/dump.js", 66);
if (s.length > 1) {
                _yuitest_coverline("build/dump/dump.js", 67);
s.pop();
            }
            _yuitest_coverline("build/dump/dump.js", 69);
s.push(']');
        // regexp /foo/
        } else {_yuitest_coverline("build/dump/dump.js", 71);
if (type == 'regexp') {
            _yuitest_coverline("build/dump/dump.js", 72);
s.push(o.toString());
        // objects {k1 => v1, k2 => v2}
        } else {
            _yuitest_coverline("build/dump/dump.js", 75);
s.push('{');
            _yuitest_coverline("build/dump/dump.js", 76);
for (i in o) {
                _yuitest_coverline("build/dump/dump.js", 77);
if (o.hasOwnProperty(i)) {
                    _yuitest_coverline("build/dump/dump.js", 78);
try {
                        _yuitest_coverline("build/dump/dump.js", 79);
s.push(i + ARROW);
                        _yuitest_coverline("build/dump/dump.js", 80);
if (L.isObject(o[i])) {
                            _yuitest_coverline("build/dump/dump.js", 81);
s.push((d > 0) ? L.dump(o[i], d - 1) : OBJ);
                        } else {
                            _yuitest_coverline("build/dump/dump.js", 83);
s.push(o[i]);
                        }
                        _yuitest_coverline("build/dump/dump.js", 85);
s.push(COMMA);
                    } catch (e) {
                        _yuitest_coverline("build/dump/dump.js", 87);
s.push('Error: ' + e.message);
                    }
                }
            }
            _yuitest_coverline("build/dump/dump.js", 91);
if (s.length > 1) {
                _yuitest_coverline("build/dump/dump.js", 92);
s.pop();
            }
            _yuitest_coverline("build/dump/dump.js", 94);
s.push('}');
        }}

        _yuitest_coverline("build/dump/dump.js", 97);
return s.join('');
    };

    _yuitest_coverline("build/dump/dump.js", 100);
Y.dump = dump;
    _yuitest_coverline("build/dump/dump.js", 101);
L.dump = dump;



}, '3.7.3', {"requires": ["yui-base"]});
