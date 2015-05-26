exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['../../stories/todo.js'],
  capabilities: {
     browserName: 'firefox'
  },
  onPrepare: function () {
        Page = require('astrolabe').Page;        
        expect = require('chai').use(require('chai-as-promised')).expect;
    },
    framework: 'mocha',
    baseUrl: 'http://localhost:8080',
    
 };