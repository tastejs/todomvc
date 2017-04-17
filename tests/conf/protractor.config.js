'use strict';
exports.config = {
        seleniumAddress: 'http://localhost:4444/wd/hub',

        //specification
        specs: [ '../specs/todomvc_test.js'],

        //Browser and Capabilities.
        capabilities: {
                browserName: 'chrome',
                version: '',
                platform: 'ANY'
        },

        //Assertion framework
        framework: 'jasmine',
        jasmineNodeOpts: {
                isVerbose: true,
                showColors: true,
                defaultTimeoutInterval: 50000
        }
};

