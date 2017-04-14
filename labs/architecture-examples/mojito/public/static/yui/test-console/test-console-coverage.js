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
_yuitest_coverage["build/test-console/test-console.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/test-console/test-console.js",
    code: []
};
_yuitest_coverage["build/test-console/test-console.js"].code=["YUI.add('test-console', function (Y, NAME) {","","/**","Provides a specialized log console widget that's pre-configured to display YUI","Test output with no extra configuration.","","@example","","    <div id=\"log\" class=\"yui3-skin-sam\"></div>","","    <script>","    YUI().use('test-console', function (Y) {","        // ... set up your test cases here ...","","        // Render the console inside the #log div, then run the tests.","        new Y.Test.Console().render('#log');","        Y.Test.Runner.run();","    });","    </script>","","@module test-console","@namespace Test","@class Console","@extends Console","@constructor","","@param {Object} [config] Config attributes.","    @param {Object} [config.filters] Category filter configuration.","","@since 3.5.0","**/","","function TestConsole() {","    TestConsole.superclass.constructor.apply(this, arguments);","}","","Y.namespace('Test').Console = Y.extend(TestConsole, Y.Console, {","    initializer: function (config) {","        this.on('entry', this._onEntry);","","        this.plug(Y.Plugin.ConsoleFilters, {","            category: Y.merge({","                info  : true,","                pass  : false,","                fail  : true,","                status: false","            }, (config && config.filters) || {}),","","            defaultVisibility: false,","","            source: {","                TestRunner: true","            }","        });","","        Y.Test.Runner.on('complete', Y.bind(this._parseCoverage, this));","    },","","    // -- Protected Coverage Parser ---------------------------------------------","    /**","    * Scans the coverage data to determine if it's an Istanbul coverage object.","    * @method _isIstanbul","    * @param {Object} json The coverage data to scan","    * @return {Boolean} True if this is Istanbul Coverage","    */","    _isIstanbul: function(json) {","        var first = Object.keys(json)[0],","            ret = false;","","        if (json[first].s !== undefined && json[first].fnMap !== undefined) {","            ret = true;","        }   ","","        if (json.s !== undefined && json.fnMap !== undefined) {","            ret = true;","        }   ","        return ret;","    },","    /**","    * Parses and logs a summary of YUITest coverage data.","    * @method parseYUITest","    * @param {Object} coverage The YUITest Coverage JSON data","    */","    parseYUITestCoverage: function (coverage) {","        var cov = {","            lines: {","                hit: 0,","                miss: 0,","                total: 0,","                percent: 0","            },","            functions: {","                hit: 0,","                miss: 0,","                total: 0,","                percent: 0","            }","        }, coverageLog;","","        Y.Object.each(coverage, function(info) {","            cov.lines.total += info.coveredLines;","            cov.lines.hit += info.calledLines;","            cov.lines.miss += (info.coveredLines - info.calledLines);","            cov.lines.percent = Math.floor((cov.lines.hit / cov.lines.total) * 100);","            ","            cov.functions.total += info.coveredFunctions;","            cov.functions.hit += info.calledFunctions;","            cov.functions.miss += (info.coveredFunctions - info.calledFunctions);","            cov.functions.percent = Math.floor((cov.functions.hit / cov.functions.total) * 100);","        });","","        ","        coverageLog = 'Lines: Hit:' + cov.lines.hit + ' Missed:' + cov.lines.miss + ' Total:' + cov.lines.total + ' Percent:' + cov.lines.percent + '%\\n';","        coverageLog += 'Functions: Hit:' + cov.functions.hit + ' Missed:' + cov.functions.miss + ' Total:' + cov.functions.total + ' Percent:' + cov.functions.percent + '%';","","        this.log('Coverage: ' + coverageLog, 'info', 'TestRunner');","    },","    /**","    * Generates a generic summary object used for Istanbul conversions.","    * @method _blankSummary","    * @return {Object} Generic summary object","    */","    _blankSummary: function () {","        return {","            lines: {","                total: 0,","                covered: 0,","                pct: 'Unknown'","            },","            statements: {","                total: 0,","                covered: 0,","                pct: 'Unknown'","            },","            functions: {","                total: 0,","                covered: 0,","                pct: 'Unknown'","            },","            branches: {","                total: 0,","                covered: 0,","                pct: 'Unknown'","            }","        };","    },","    /**","    * Calculates line numbers from statement coverage","    * @method _addDerivedInfoForFile","    * @private","    * @param {Object} fileCoverage JSON coverage data","    */","    _addDerivedInfoForFile: function (fileCoverage) {","        var statementMap = fileCoverage.statementMap,","            statements = fileCoverage.s,","            lineMap;","","        if (!fileCoverage.l) {","            fileCoverage.l = lineMap = {};","            Y.Object.each(statements, function (value, st) {","                var line = statementMap[st].start.line,","                    count = statements[st],","                    prevVal = lineMap[line];","                if (typeof prevVal === 'undefined' || prevVal < count) {","                    lineMap[line] = count;","                }","            });","        }","    },","    /**","    * Generic percent calculator","    * @method _percent","    * @param {Number} covered The covered amount","    * @param {Number} total The total","    * @private","    */","    _percent: function (covered, total) {","        var tmp, pct = 100.00;","        if (total > 0) {","            tmp = 1000 * 100 * covered / total + 5;","            pct = Math.floor(tmp / 10) / 100;","        }","        return pct;","    },","    /**","    * Summarize simple properties in the coverage data","    * @method _computSimpleTotals","    * @private","    * @param {Object} fileCoverage JSON coverage data","    * @param {String} property The property to summarize","    */","    _computeSimpleTotals: function (fileCoverage, property) {","        var stats = fileCoverage[property],","            ret = { total: 0, covered: 0 };","","        Y.Object.each(stats, function(val) {","            ret.total += 1;","            if (val) {","                ret.covered += 1;","            }   ","        }); ","        ret.pct = this._percent(ret.covered, ret.total);","        return ret;","    },","    /**","    * Noramlizes branch data from Istanbul","    * @method _computeBranchTotals","    * @private","    * @param {Object} fileCoverage JSON coverage data","    */","    _computeBranchTotals: function (fileCoverage) {","        var stats = fileCoverage.b,","            ret = { total: 0, covered: 0 };","","        Y.Object.each(stats, function (branches) {","            var covered = Y.Array.filter(branches, function (num) { return num > 0; }); ","            ret.total += branches.length;","            ret.covered += covered.length;","        }); ","        ret.pct = this._percent(ret.covered, ret.total);","        return ret;","    },","    /**","    * Takes an Istanbul coverage object, normalizes it and prints a log with a summary","    * @method parseInstanbul","    * @param {Object} coverage The coverage object to normalize and log","    */","    parseIstanbul: function (coverage) {","        var self = this,","            str = 'Coverage Report:\\n';","","        Y.Object.each(coverage, function(fileCoverage, file) {","            var ret = self._blankSummary();","","            self._addDerivedInfoForFile(fileCoverage);","            ret.lines = self._computeSimpleTotals(fileCoverage, 'l');","            ret.functions = self._computeSimpleTotals(fileCoverage, 'f');","            ret.statements = self._computeSimpleTotals(fileCoverage, 's');","            ret.branches = self._computeBranchTotals(fileCoverage);","            str += file + ':\\n';","            Y.Array.each(['lines','functions','statements','branches'], function(key) {","                str += '    ' + key +': ' + ret[key].covered + '/' + ret[key].total + ' : ' + ret[key].pct + '%\\n';","            });","","        });","        this.log(str, 'info', 'TestRunner');","","    },","    /**","    * Parses YUITest or Istanbul coverage results if they are available and logs them.","    * @method _parseCoverage","    * @private","    */","    _parseCoverage: function() {","        var coverage = Y.Test.Runner.getCoverage();","        if (!coverage) {","            return;","        }","        if (this._isIstanbul(coverage)) {","            this.parseIstanbul(coverage);","        } else {","            this.parseYUITestCoverage(coverage);","        }","    },","","    // -- Protected Event Handlers ---------------------------------------------","    _onEntry: function (e) {","        var msg = e.message;","","        if (msg.category === 'info'","                && /\\s(?:case|suite)\\s|yuitests\\d+|began/.test(msg.message)) {","            msg.category = 'status';","        } else if (msg.category === 'fail') {","            this.printBuffer();","        }","    }","}, {","    NAME: 'testConsole',","","    ATTRS: {","        entryTemplate: {","            value:","                '<div class=\"{entry_class} {cat_class} {src_class}\">' +","                    '<div class=\"{entry_content_class}\">{message}</div>' +","                '</div>'","        },","","        height: {","            value: '350px'","        },","","        newestOnTop: {","            value: false","        },","","        style: {","            value: 'block'","        },","","        width: {","            value: Y.UA.ie && Y.UA.ie < 9 ? '100%' : 'inherit'","        }","    }","});","","","}, '3.7.3', {\"requires\": [\"console-filters\", \"test\", \"array-extras\"], \"skinnable\": true});"];
_yuitest_coverage["build/test-console/test-console.js"].lines = {"1":0,"33":0,"34":0,"37":0,"39":0,"41":0,"56":0,"67":0,"70":0,"71":0,"74":0,"75":0,"77":0,"85":0,"100":0,"101":0,"102":0,"103":0,"104":0,"106":0,"107":0,"108":0,"109":0,"113":0,"114":0,"116":0,"124":0,"154":0,"158":0,"159":0,"160":0,"161":0,"164":0,"165":0,"178":0,"179":0,"180":0,"181":0,"183":0,"193":0,"196":0,"197":0,"198":0,"199":0,"202":0,"203":0,"212":0,"215":0,"216":0,"217":0,"218":0,"220":0,"221":0,"229":0,"232":0,"233":0,"235":0,"236":0,"237":0,"238":0,"239":0,"240":0,"241":0,"242":0,"246":0,"255":0,"256":0,"257":0,"259":0,"260":0,"262":0,"268":0,"270":0,"272":0,"273":0,"274":0};
_yuitest_coverage["build/test-console/test-console.js"].functions = {"TestConsole:33":0,"initializer:38":0,"_isIstanbul:66":0,"(anonymous 2):100":0,"parseYUITestCoverage:84":0,"_blankSummary:123":0,"(anonymous 3):160":0,"_addDerivedInfoForFile:153":0,"_percent:177":0,"(anonymous 4):196":0,"_computeSimpleTotals:192":0,"(anonymous 6):216":0,"(anonymous 5):215":0,"_computeBranchTotals:211":0,"(anonymous 8):241":0,"(anonymous 7):232":0,"parseIstanbul:228":0,"_parseCoverage:254":0,"_onEntry:267":0,"(anonymous 1):1":0};
_yuitest_coverage["build/test-console/test-console.js"].coveredLines = 76;
_yuitest_coverage["build/test-console/test-console.js"].coveredFunctions = 20;
_yuitest_coverline("build/test-console/test-console.js", 1);
YUI.add('test-console', function (Y, NAME) {

/**
Provides a specialized log console widget that's pre-configured to display YUI
Test output with no extra configuration.

@example

    <div id="log" class="yui3-skin-sam"></div>

    <script>
    YUI().use('test-console', function (Y) {
        // ... set up your test cases here ...

        // Render the console inside the #log div, then run the tests.
        new Y.Test.Console().render('#log');
        Y.Test.Runner.run();
    });
    </script>

@module test-console
@namespace Test
@class Console
@extends Console
@constructor

@param {Object} [config] Config attributes.
    @param {Object} [config.filters] Category filter configuration.

@since 3.5.0
**/

_yuitest_coverfunc("build/test-console/test-console.js", "(anonymous 1)", 1);
_yuitest_coverline("build/test-console/test-console.js", 33);
function TestConsole() {
    _yuitest_coverfunc("build/test-console/test-console.js", "TestConsole", 33);
_yuitest_coverline("build/test-console/test-console.js", 34);
TestConsole.superclass.constructor.apply(this, arguments);
}

_yuitest_coverline("build/test-console/test-console.js", 37);
Y.namespace('Test').Console = Y.extend(TestConsole, Y.Console, {
    initializer: function (config) {
        _yuitest_coverfunc("build/test-console/test-console.js", "initializer", 38);
_yuitest_coverline("build/test-console/test-console.js", 39);
this.on('entry', this._onEntry);

        _yuitest_coverline("build/test-console/test-console.js", 41);
this.plug(Y.Plugin.ConsoleFilters, {
            category: Y.merge({
                info  : true,
                pass  : false,
                fail  : true,
                status: false
            }, (config && config.filters) || {}),

            defaultVisibility: false,

            source: {
                TestRunner: true
            }
        });

        _yuitest_coverline("build/test-console/test-console.js", 56);
Y.Test.Runner.on('complete', Y.bind(this._parseCoverage, this));
    },

    // -- Protected Coverage Parser ---------------------------------------------
    /**
    * Scans the coverage data to determine if it's an Istanbul coverage object.
    * @method _isIstanbul
    * @param {Object} json The coverage data to scan
    * @return {Boolean} True if this is Istanbul Coverage
    */
    _isIstanbul: function(json) {
        _yuitest_coverfunc("build/test-console/test-console.js", "_isIstanbul", 66);
_yuitest_coverline("build/test-console/test-console.js", 67);
var first = Object.keys(json)[0],
            ret = false;

        _yuitest_coverline("build/test-console/test-console.js", 70);
if (json[first].s !== undefined && json[first].fnMap !== undefined) {
            _yuitest_coverline("build/test-console/test-console.js", 71);
ret = true;
        }   

        _yuitest_coverline("build/test-console/test-console.js", 74);
if (json.s !== undefined && json.fnMap !== undefined) {
            _yuitest_coverline("build/test-console/test-console.js", 75);
ret = true;
        }   
        _yuitest_coverline("build/test-console/test-console.js", 77);
return ret;
    },
    /**
    * Parses and logs a summary of YUITest coverage data.
    * @method parseYUITest
    * @param {Object} coverage The YUITest Coverage JSON data
    */
    parseYUITestCoverage: function (coverage) {
        _yuitest_coverfunc("build/test-console/test-console.js", "parseYUITestCoverage", 84);
_yuitest_coverline("build/test-console/test-console.js", 85);
var cov = {
            lines: {
                hit: 0,
                miss: 0,
                total: 0,
                percent: 0
            },
            functions: {
                hit: 0,
                miss: 0,
                total: 0,
                percent: 0
            }
        }, coverageLog;

        _yuitest_coverline("build/test-console/test-console.js", 100);
Y.Object.each(coverage, function(info) {
            _yuitest_coverfunc("build/test-console/test-console.js", "(anonymous 2)", 100);
_yuitest_coverline("build/test-console/test-console.js", 101);
cov.lines.total += info.coveredLines;
            _yuitest_coverline("build/test-console/test-console.js", 102);
cov.lines.hit += info.calledLines;
            _yuitest_coverline("build/test-console/test-console.js", 103);
cov.lines.miss += (info.coveredLines - info.calledLines);
            _yuitest_coverline("build/test-console/test-console.js", 104);
cov.lines.percent = Math.floor((cov.lines.hit / cov.lines.total) * 100);
            
            _yuitest_coverline("build/test-console/test-console.js", 106);
cov.functions.total += info.coveredFunctions;
            _yuitest_coverline("build/test-console/test-console.js", 107);
cov.functions.hit += info.calledFunctions;
            _yuitest_coverline("build/test-console/test-console.js", 108);
cov.functions.miss += (info.coveredFunctions - info.calledFunctions);
            _yuitest_coverline("build/test-console/test-console.js", 109);
cov.functions.percent = Math.floor((cov.functions.hit / cov.functions.total) * 100);
        });

        
        _yuitest_coverline("build/test-console/test-console.js", 113);
coverageLog = 'Lines: Hit:' + cov.lines.hit + ' Missed:' + cov.lines.miss + ' Total:' + cov.lines.total + ' Percent:' + cov.lines.percent + '%\n';
        _yuitest_coverline("build/test-console/test-console.js", 114);
coverageLog += 'Functions: Hit:' + cov.functions.hit + ' Missed:' + cov.functions.miss + ' Total:' + cov.functions.total + ' Percent:' + cov.functions.percent + '%';

        _yuitest_coverline("build/test-console/test-console.js", 116);
this.log('Coverage: ' + coverageLog, 'info', 'TestRunner');
    },
    /**
    * Generates a generic summary object used for Istanbul conversions.
    * @method _blankSummary
    * @return {Object} Generic summary object
    */
    _blankSummary: function () {
        _yuitest_coverfunc("build/test-console/test-console.js", "_blankSummary", 123);
_yuitest_coverline("build/test-console/test-console.js", 124);
return {
            lines: {
                total: 0,
                covered: 0,
                pct: 'Unknown'
            },
            statements: {
                total: 0,
                covered: 0,
                pct: 'Unknown'
            },
            functions: {
                total: 0,
                covered: 0,
                pct: 'Unknown'
            },
            branches: {
                total: 0,
                covered: 0,
                pct: 'Unknown'
            }
        };
    },
    /**
    * Calculates line numbers from statement coverage
    * @method _addDerivedInfoForFile
    * @private
    * @param {Object} fileCoverage JSON coverage data
    */
    _addDerivedInfoForFile: function (fileCoverage) {
        _yuitest_coverfunc("build/test-console/test-console.js", "_addDerivedInfoForFile", 153);
_yuitest_coverline("build/test-console/test-console.js", 154);
var statementMap = fileCoverage.statementMap,
            statements = fileCoverage.s,
            lineMap;

        _yuitest_coverline("build/test-console/test-console.js", 158);
if (!fileCoverage.l) {
            _yuitest_coverline("build/test-console/test-console.js", 159);
fileCoverage.l = lineMap = {};
            _yuitest_coverline("build/test-console/test-console.js", 160);
Y.Object.each(statements, function (value, st) {
                _yuitest_coverfunc("build/test-console/test-console.js", "(anonymous 3)", 160);
_yuitest_coverline("build/test-console/test-console.js", 161);
var line = statementMap[st].start.line,
                    count = statements[st],
                    prevVal = lineMap[line];
                _yuitest_coverline("build/test-console/test-console.js", 164);
if (typeof prevVal === 'undefined' || prevVal < count) {
                    _yuitest_coverline("build/test-console/test-console.js", 165);
lineMap[line] = count;
                }
            });
        }
    },
    /**
    * Generic percent calculator
    * @method _percent
    * @param {Number} covered The covered amount
    * @param {Number} total The total
    * @private
    */
    _percent: function (covered, total) {
        _yuitest_coverfunc("build/test-console/test-console.js", "_percent", 177);
_yuitest_coverline("build/test-console/test-console.js", 178);
var tmp, pct = 100.00;
        _yuitest_coverline("build/test-console/test-console.js", 179);
if (total > 0) {
            _yuitest_coverline("build/test-console/test-console.js", 180);
tmp = 1000 * 100 * covered / total + 5;
            _yuitest_coverline("build/test-console/test-console.js", 181);
pct = Math.floor(tmp / 10) / 100;
        }
        _yuitest_coverline("build/test-console/test-console.js", 183);
return pct;
    },
    /**
    * Summarize simple properties in the coverage data
    * @method _computSimpleTotals
    * @private
    * @param {Object} fileCoverage JSON coverage data
    * @param {String} property The property to summarize
    */
    _computeSimpleTotals: function (fileCoverage, property) {
        _yuitest_coverfunc("build/test-console/test-console.js", "_computeSimpleTotals", 192);
_yuitest_coverline("build/test-console/test-console.js", 193);
var stats = fileCoverage[property],
            ret = { total: 0, covered: 0 };

        _yuitest_coverline("build/test-console/test-console.js", 196);
Y.Object.each(stats, function(val) {
            _yuitest_coverfunc("build/test-console/test-console.js", "(anonymous 4)", 196);
_yuitest_coverline("build/test-console/test-console.js", 197);
ret.total += 1;
            _yuitest_coverline("build/test-console/test-console.js", 198);
if (val) {
                _yuitest_coverline("build/test-console/test-console.js", 199);
ret.covered += 1;
            }   
        }); 
        _yuitest_coverline("build/test-console/test-console.js", 202);
ret.pct = this._percent(ret.covered, ret.total);
        _yuitest_coverline("build/test-console/test-console.js", 203);
return ret;
    },
    /**
    * Noramlizes branch data from Istanbul
    * @method _computeBranchTotals
    * @private
    * @param {Object} fileCoverage JSON coverage data
    */
    _computeBranchTotals: function (fileCoverage) {
        _yuitest_coverfunc("build/test-console/test-console.js", "_computeBranchTotals", 211);
_yuitest_coverline("build/test-console/test-console.js", 212);
var stats = fileCoverage.b,
            ret = { total: 0, covered: 0 };

        _yuitest_coverline("build/test-console/test-console.js", 215);
Y.Object.each(stats, function (branches) {
            _yuitest_coverfunc("build/test-console/test-console.js", "(anonymous 5)", 215);
_yuitest_coverline("build/test-console/test-console.js", 216);
var covered = Y.Array.filter(branches, function (num) { _yuitest_coverfunc("build/test-console/test-console.js", "(anonymous 6)", 216);
return num > 0; }); 
            _yuitest_coverline("build/test-console/test-console.js", 217);
ret.total += branches.length;
            _yuitest_coverline("build/test-console/test-console.js", 218);
ret.covered += covered.length;
        }); 
        _yuitest_coverline("build/test-console/test-console.js", 220);
ret.pct = this._percent(ret.covered, ret.total);
        _yuitest_coverline("build/test-console/test-console.js", 221);
return ret;
    },
    /**
    * Takes an Istanbul coverage object, normalizes it and prints a log with a summary
    * @method parseInstanbul
    * @param {Object} coverage The coverage object to normalize and log
    */
    parseIstanbul: function (coverage) {
        _yuitest_coverfunc("build/test-console/test-console.js", "parseIstanbul", 228);
_yuitest_coverline("build/test-console/test-console.js", 229);
var self = this,
            str = 'Coverage Report:\n';

        _yuitest_coverline("build/test-console/test-console.js", 232);
Y.Object.each(coverage, function(fileCoverage, file) {
            _yuitest_coverfunc("build/test-console/test-console.js", "(anonymous 7)", 232);
_yuitest_coverline("build/test-console/test-console.js", 233);
var ret = self._blankSummary();

            _yuitest_coverline("build/test-console/test-console.js", 235);
self._addDerivedInfoForFile(fileCoverage);
            _yuitest_coverline("build/test-console/test-console.js", 236);
ret.lines = self._computeSimpleTotals(fileCoverage, 'l');
            _yuitest_coverline("build/test-console/test-console.js", 237);
ret.functions = self._computeSimpleTotals(fileCoverage, 'f');
            _yuitest_coverline("build/test-console/test-console.js", 238);
ret.statements = self._computeSimpleTotals(fileCoverage, 's');
            _yuitest_coverline("build/test-console/test-console.js", 239);
ret.branches = self._computeBranchTotals(fileCoverage);
            _yuitest_coverline("build/test-console/test-console.js", 240);
str += file + ':\n';
            _yuitest_coverline("build/test-console/test-console.js", 241);
Y.Array.each(['lines','functions','statements','branches'], function(key) {
                _yuitest_coverfunc("build/test-console/test-console.js", "(anonymous 8)", 241);
_yuitest_coverline("build/test-console/test-console.js", 242);
str += '    ' + key +': ' + ret[key].covered + '/' + ret[key].total + ' : ' + ret[key].pct + '%\n';
            });

        });
        _yuitest_coverline("build/test-console/test-console.js", 246);
this.log(str, 'info', 'TestRunner');

    },
    /**
    * Parses YUITest or Istanbul coverage results if they are available and logs them.
    * @method _parseCoverage
    * @private
    */
    _parseCoverage: function() {
        _yuitest_coverfunc("build/test-console/test-console.js", "_parseCoverage", 254);
_yuitest_coverline("build/test-console/test-console.js", 255);
var coverage = Y.Test.Runner.getCoverage();
        _yuitest_coverline("build/test-console/test-console.js", 256);
if (!coverage) {
            _yuitest_coverline("build/test-console/test-console.js", 257);
return;
        }
        _yuitest_coverline("build/test-console/test-console.js", 259);
if (this._isIstanbul(coverage)) {
            _yuitest_coverline("build/test-console/test-console.js", 260);
this.parseIstanbul(coverage);
        } else {
            _yuitest_coverline("build/test-console/test-console.js", 262);
this.parseYUITestCoverage(coverage);
        }
    },

    // -- Protected Event Handlers ---------------------------------------------
    _onEntry: function (e) {
        _yuitest_coverfunc("build/test-console/test-console.js", "_onEntry", 267);
_yuitest_coverline("build/test-console/test-console.js", 268);
var msg = e.message;

        _yuitest_coverline("build/test-console/test-console.js", 270);
if (msg.category === 'info'
                && /\s(?:case|suite)\s|yuitests\d+|began/.test(msg.message)) {
            _yuitest_coverline("build/test-console/test-console.js", 272);
msg.category = 'status';
        } else {_yuitest_coverline("build/test-console/test-console.js", 273);
if (msg.category === 'fail') {
            _yuitest_coverline("build/test-console/test-console.js", 274);
this.printBuffer();
        }}
    }
}, {
    NAME: 'testConsole',

    ATTRS: {
        entryTemplate: {
            value:
                '<div class="{entry_class} {cat_class} {src_class}">' +
                    '<div class="{entry_content_class}">{message}</div>' +
                '</div>'
        },

        height: {
            value: '350px'
        },

        newestOnTop: {
            value: false
        },

        style: {
            value: 'block'
        },

        width: {
            value: Y.UA.ie && Y.UA.ie < 9 ? '100%' : 'inherit'
        }
    }
});


}, '3.7.3', {"requires": ["console-filters", "test", "array-extras"], "skinnable": true});
