require('script!jasmine/jasmine');
require('script!jasmine/jasmine-html');
require('jasmine/jasmine.css');
require('./todoMVC');

/**
 * Specs Runner
 */
// Load testsuite
var jasmineEnv = jasmine.getEnv();
var htmlReporter = new jasmine.HtmlReporter();
jasmineEnv.addReporter( htmlReporter );
jasmineEnv.execute();
