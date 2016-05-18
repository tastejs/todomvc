const duet     = require('duet');
const ls       = require('duet/bridges/local-storage');
const location = require('duet/bridges/location');
const vdom     = require('duet/bridges/virtual-dom');
const app      = require('./app');

const options = {
  // forceSingleThread: true,
  isDebug: true
};

duet([ls, location, vdom], app, options);
