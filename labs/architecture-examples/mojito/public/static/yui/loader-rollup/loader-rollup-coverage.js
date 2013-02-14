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
_yuitest_coverage["build/loader-rollup/loader-rollup.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/loader-rollup/loader-rollup.js",
    code: []
};
_yuitest_coverage["build/loader-rollup/loader-rollup.js"].code=["YUI.add('loader-rollup', function (Y, NAME) {","","/**"," * Optional automatic rollup logic for reducing http connections"," * when not using a combo service."," * @module loader"," * @submodule rollup"," */","","/**"," * Look for rollup packages to determine if all of the modules a"," * rollup supersedes are required.  If so, include the rollup to"," * help reduce the total number of connections required.  Called"," * by calculate().  This is an optional feature, and requires the"," * appropriate submodule to function."," * @method _rollup"," * @for Loader"," * @private"," */","Y.Loader.prototype._rollup = function() {","    var i, j, m, s, r = this.required, roll,","        info = this.moduleInfo, rolled, c, smod;","","    // find and cache rollup modules","    if (this.dirty || !this.rollups) {","        this.rollups = {};","        for (i in info) {","            if (info.hasOwnProperty(i)) {","                m = this.getModule(i);","                // if (m && m.rollup && m.supersedes) {","                if (m && m.rollup) {","                    this.rollups[i] = m;","                }","            }","        }","    }","","    // make as many passes as needed to pick up rollup rollups","    for (;;) {","        rolled = false;","","        // go through the rollup candidates","        for (i in this.rollups) {","            if (this.rollups.hasOwnProperty(i)) {","                // there can be only one, unless forced","                if (!r[i] && ((!this.loaded[i]) || this.forceMap[i])) {","                    m = this.getModule(i);","                    s = m.supersedes || [];","                    roll = false;","","                    // @TODO remove continue","                    if (!m.rollup) {","                        continue;","                    }","","                    c = 0;","","                    // check the threshold","                    for (j = 0; j < s.length; j++) {","                        smod = info[s[j]];","","                        // if the superseded module is loaded, we can't","                        // load the rollup unless it has been forced.","                        if (this.loaded[s[j]] && !this.forceMap[s[j]]) {","                            roll = false;","                            break;","                        // increment the counter if this module is required.","                        // if we are beyond the rollup threshold, we will","                        // use the rollup module","                        } else if (r[s[j]] && m.type === smod.type) {","                            c++;","                            roll = (c >= m.rollup);","                            if (roll) {","                                break;","                            }","                        }","                    }","","                    if (roll) {","                        // add the rollup","                        r[i] = true;","                        rolled = true;","","                        // expand the rollup's dependencies","                        this.getRequires(m);","                    }","                }","            }","        }","","        // if we made it here w/o rolling up something, we are done","        if (!rolled) {","            break;","        }","    }","};","","","}, '3.7.3', {\"requires\": [\"loader-base\"]});"];
_yuitest_coverage["build/loader-rollup/loader-rollup.js"].lines = {"1":0,"20":0,"21":0,"25":0,"26":0,"27":0,"28":0,"29":0,"31":0,"32":0,"39":0,"40":0,"43":0,"44":0,"46":0,"47":0,"48":0,"49":0,"52":0,"53":0,"56":0,"59":0,"60":0,"64":0,"65":0,"66":0,"70":0,"71":0,"72":0,"73":0,"74":0,"79":0,"81":0,"82":0,"85":0,"92":0,"93":0};
_yuitest_coverage["build/loader-rollup/loader-rollup.js"].functions = {"_rollup:20":0,"(anonymous 1):1":0};
_yuitest_coverage["build/loader-rollup/loader-rollup.js"].coveredLines = 37;
_yuitest_coverage["build/loader-rollup/loader-rollup.js"].coveredFunctions = 2;
_yuitest_coverline("build/loader-rollup/loader-rollup.js", 1);
YUI.add('loader-rollup', function (Y, NAME) {

/**
 * Optional automatic rollup logic for reducing http connections
 * when not using a combo service.
 * @module loader
 * @submodule rollup
 */

/**
 * Look for rollup packages to determine if all of the modules a
 * rollup supersedes are required.  If so, include the rollup to
 * help reduce the total number of connections required.  Called
 * by calculate().  This is an optional feature, and requires the
 * appropriate submodule to function.
 * @method _rollup
 * @for Loader
 * @private
 */
_yuitest_coverfunc("build/loader-rollup/loader-rollup.js", "(anonymous 1)", 1);
_yuitest_coverline("build/loader-rollup/loader-rollup.js", 20);
Y.Loader.prototype._rollup = function() {
    _yuitest_coverfunc("build/loader-rollup/loader-rollup.js", "_rollup", 20);
_yuitest_coverline("build/loader-rollup/loader-rollup.js", 21);
var i, j, m, s, r = this.required, roll,
        info = this.moduleInfo, rolled, c, smod;

    // find and cache rollup modules
    _yuitest_coverline("build/loader-rollup/loader-rollup.js", 25);
if (this.dirty || !this.rollups) {
        _yuitest_coverline("build/loader-rollup/loader-rollup.js", 26);
this.rollups = {};
        _yuitest_coverline("build/loader-rollup/loader-rollup.js", 27);
for (i in info) {
            _yuitest_coverline("build/loader-rollup/loader-rollup.js", 28);
if (info.hasOwnProperty(i)) {
                _yuitest_coverline("build/loader-rollup/loader-rollup.js", 29);
m = this.getModule(i);
                // if (m && m.rollup && m.supersedes) {
                _yuitest_coverline("build/loader-rollup/loader-rollup.js", 31);
if (m && m.rollup) {
                    _yuitest_coverline("build/loader-rollup/loader-rollup.js", 32);
this.rollups[i] = m;
                }
            }
        }
    }

    // make as many passes as needed to pick up rollup rollups
    _yuitest_coverline("build/loader-rollup/loader-rollup.js", 39);
for (;;) {
        _yuitest_coverline("build/loader-rollup/loader-rollup.js", 40);
rolled = false;

        // go through the rollup candidates
        _yuitest_coverline("build/loader-rollup/loader-rollup.js", 43);
for (i in this.rollups) {
            _yuitest_coverline("build/loader-rollup/loader-rollup.js", 44);
if (this.rollups.hasOwnProperty(i)) {
                // there can be only one, unless forced
                _yuitest_coverline("build/loader-rollup/loader-rollup.js", 46);
if (!r[i] && ((!this.loaded[i]) || this.forceMap[i])) {
                    _yuitest_coverline("build/loader-rollup/loader-rollup.js", 47);
m = this.getModule(i);
                    _yuitest_coverline("build/loader-rollup/loader-rollup.js", 48);
s = m.supersedes || [];
                    _yuitest_coverline("build/loader-rollup/loader-rollup.js", 49);
roll = false;

                    // @TODO remove continue
                    _yuitest_coverline("build/loader-rollup/loader-rollup.js", 52);
if (!m.rollup) {
                        _yuitest_coverline("build/loader-rollup/loader-rollup.js", 53);
continue;
                    }

                    _yuitest_coverline("build/loader-rollup/loader-rollup.js", 56);
c = 0;

                    // check the threshold
                    _yuitest_coverline("build/loader-rollup/loader-rollup.js", 59);
for (j = 0; j < s.length; j++) {
                        _yuitest_coverline("build/loader-rollup/loader-rollup.js", 60);
smod = info[s[j]];

                        // if the superseded module is loaded, we can't
                        // load the rollup unless it has been forced.
                        _yuitest_coverline("build/loader-rollup/loader-rollup.js", 64);
if (this.loaded[s[j]] && !this.forceMap[s[j]]) {
                            _yuitest_coverline("build/loader-rollup/loader-rollup.js", 65);
roll = false;
                            _yuitest_coverline("build/loader-rollup/loader-rollup.js", 66);
break;
                        // increment the counter if this module is required.
                        // if we are beyond the rollup threshold, we will
                        // use the rollup module
                        } else {_yuitest_coverline("build/loader-rollup/loader-rollup.js", 70);
if (r[s[j]] && m.type === smod.type) {
                            _yuitest_coverline("build/loader-rollup/loader-rollup.js", 71);
c++;
                            _yuitest_coverline("build/loader-rollup/loader-rollup.js", 72);
roll = (c >= m.rollup);
                            _yuitest_coverline("build/loader-rollup/loader-rollup.js", 73);
if (roll) {
                                _yuitest_coverline("build/loader-rollup/loader-rollup.js", 74);
break;
                            }
                        }}
                    }

                    _yuitest_coverline("build/loader-rollup/loader-rollup.js", 79);
if (roll) {
                        // add the rollup
                        _yuitest_coverline("build/loader-rollup/loader-rollup.js", 81);
r[i] = true;
                        _yuitest_coverline("build/loader-rollup/loader-rollup.js", 82);
rolled = true;

                        // expand the rollup's dependencies
                        _yuitest_coverline("build/loader-rollup/loader-rollup.js", 85);
this.getRequires(m);
                    }
                }
            }
        }

        // if we made it here w/o rolling up something, we are done
        _yuitest_coverline("build/loader-rollup/loader-rollup.js", 92);
if (!rolled) {
            _yuitest_coverline("build/loader-rollup/loader-rollup.js", 93);
break;
        }
    }
};


}, '3.7.3', {"requires": ["loader-base"]});
