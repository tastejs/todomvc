
module.exports = KnownIssuesReporter;

var Base = require('mocha/lib/reporters/base'),
    cursor = Base.cursor,
    color = Base.color,
    fs = require('fs');


function KnownIssuesReporter(runner) {
    Base.call(this, runner);

    var self = this;
    var passes = 0;
    var failures = 0;
    var fixedIssues = 0;
    var newIssues = 0;
    var currentTestIndex = 1;
    var totalTests = runner.suite.total();
    var knownIssues = require("./knownIssues.js");

    fs.readFile("./knownIssues.json", function(err, data) {
        knownIssues = JSON.parse(data);
    });

    // the test.getTitle function is space separated. This function creates a comma
    // separated name, which is much easier to read!
    function getTestName(test) {
        name = test.title;
        while(test.parent && test.parent.title) {
            name = test.parent.title + ", " + name;
            test = test.parent;
        }
        return name;
    }

    function isKnownIssue(testName) {
        var matches = knownIssues.filter(function(knownIssue) {
            return knownIssue.test ? knownIssue.test === testName : knownIssue === testName;
        });

        return matches.length === 1;
    }

    function getProgress() {
      return "(" + currentTestIndex++ + " of " + totalTests + ") ";
    }

    runner.on('pass', function(test) {
        passes++;
        var testName = getTestName(test);

        if (isKnownIssue(testName)) {
            fixedIssues ++;
            console.log(getProgress() + color('bright pass', 'resolved issue: ') + '%s', testName);
        } else {
            console.log(getProgress() + color('pass', 'pass: ') + '%s', testName);
        }
    });

    runner.on('fail', function(test, err) {
        failures++;
        var testName = getTestName(test);

        if (isKnownIssue(testName)) {
            console.log(getProgress() + color('fail', 'known issue: ') + '%s -- error: %s', testName, err.message);
        } else {
            newIssues ++;
            console.log(getProgress() + color('bright fail', 'new issue: ') + '%s', testName);
        }
        
    });

    runner.on('end', function(){
        var totalTests = passes + failures;
        console.log('passed: %d/%d', passes, totalTests);
        console.log('failed: %d/%d', failures, totalTests);
        console.log('new issues: %d', newIssues);
        console.log('resolved issues: %d', fixedIssues);
        process.exit(failures);
    });

    runner.on('end', function() {
      console.log();
      self.epilogue();
    });
}