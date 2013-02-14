/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
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

function TestConsole() {
    TestConsole.superclass.constructor.apply(this, arguments);
}

Y.namespace('Test').Console = Y.extend(TestConsole, Y.Console, {
    initializer: function (config) {
        this.on('entry', this._onEntry);

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
        var first = Object.keys(json)[0],
            ret = false;

        if (json[first].s !== undefined && json[first].fnMap !== undefined) {
            ret = true;
        }   

        if (json.s !== undefined && json.fnMap !== undefined) {
            ret = true;
        }   
        return ret;
    },
    /**
    * Parses and logs a summary of YUITest coverage data.
    * @method parseYUITest
    * @param {Object} coverage The YUITest Coverage JSON data
    */
    parseYUITestCoverage: function (coverage) {
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

        Y.Object.each(coverage, function(info) {
            cov.lines.total += info.coveredLines;
            cov.lines.hit += info.calledLines;
            cov.lines.miss += (info.coveredLines - info.calledLines);
            cov.lines.percent = Math.floor((cov.lines.hit / cov.lines.total) * 100);
            
            cov.functions.total += info.coveredFunctions;
            cov.functions.hit += info.calledFunctions;
            cov.functions.miss += (info.coveredFunctions - info.calledFunctions);
            cov.functions.percent = Math.floor((cov.functions.hit / cov.functions.total) * 100);
        });

        
        coverageLog = 'Lines: Hit:' + cov.lines.hit + ' Missed:' + cov.lines.miss + ' Total:' + cov.lines.total + ' Percent:' + cov.lines.percent + '%\n';
        coverageLog += 'Functions: Hit:' + cov.functions.hit + ' Missed:' + cov.functions.miss + ' Total:' + cov.functions.total + ' Percent:' + cov.functions.percent + '%';

        this.log('Coverage: ' + coverageLog, 'info', 'TestRunner');
    },
    /**
    * Generates a generic summary object used for Istanbul conversions.
    * @method _blankSummary
    * @return {Object} Generic summary object
    */
    _blankSummary: function () {
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
        var statementMap = fileCoverage.statementMap,
            statements = fileCoverage.s,
            lineMap;

        if (!fileCoverage.l) {
            fileCoverage.l = lineMap = {};
            Y.Object.each(statements, function (value, st) {
                var line = statementMap[st].start.line,
                    count = statements[st],
                    prevVal = lineMap[line];
                if (typeof prevVal === 'undefined' || prevVal < count) {
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
        var tmp, pct = 100.00;
        if (total > 0) {
            tmp = 1000 * 100 * covered / total + 5;
            pct = Math.floor(tmp / 10) / 100;
        }
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
        var stats = fileCoverage[property],
            ret = { total: 0, covered: 0 };

        Y.Object.each(stats, function(val) {
            ret.total += 1;
            if (val) {
                ret.covered += 1;
            }   
        }); 
        ret.pct = this._percent(ret.covered, ret.total);
        return ret;
    },
    /**
    * Noramlizes branch data from Istanbul
    * @method _computeBranchTotals
    * @private
    * @param {Object} fileCoverage JSON coverage data
    */
    _computeBranchTotals: function (fileCoverage) {
        var stats = fileCoverage.b,
            ret = { total: 0, covered: 0 };

        Y.Object.each(stats, function (branches) {
            var covered = Y.Array.filter(branches, function (num) { return num > 0; }); 
            ret.total += branches.length;
            ret.covered += covered.length;
        }); 
        ret.pct = this._percent(ret.covered, ret.total);
        return ret;
    },
    /**
    * Takes an Istanbul coverage object, normalizes it and prints a log with a summary
    * @method parseInstanbul
    * @param {Object} coverage The coverage object to normalize and log
    */
    parseIstanbul: function (coverage) {
        var self = this,
            str = 'Coverage Report:\n';

        Y.Object.each(coverage, function(fileCoverage, file) {
            var ret = self._blankSummary();

            self._addDerivedInfoForFile(fileCoverage);
            ret.lines = self._computeSimpleTotals(fileCoverage, 'l');
            ret.functions = self._computeSimpleTotals(fileCoverage, 'f');
            ret.statements = self._computeSimpleTotals(fileCoverage, 's');
            ret.branches = self._computeBranchTotals(fileCoverage);
            str += file + ':\n';
            Y.Array.each(['lines','functions','statements','branches'], function(key) {
                str += '    ' + key +': ' + ret[key].covered + '/' + ret[key].total + ' : ' + ret[key].pct + '%\n';
            });

        });
        this.log(str, 'info', 'TestRunner');

    },
    /**
    * Parses YUITest or Istanbul coverage results if they are available and logs them.
    * @method _parseCoverage
    * @private
    */
    _parseCoverage: function() {
        var coverage = Y.Test.Runner.getCoverage();
        if (!coverage) {
            return;
        }
        if (this._isIstanbul(coverage)) {
            this.parseIstanbul(coverage);
        } else {
            this.parseYUITestCoverage(coverage);
        }
    },

    // -- Protected Event Handlers ---------------------------------------------
    _onEntry: function (e) {
        var msg = e.message;

        if (msg.category === 'info'
                && /\s(?:case|suite)\s|yuitests\d+|began/.test(msg.message)) {
            msg.category = 'status';
        } else if (msg.category === 'fail') {
            this.printBuffer();
        }
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
