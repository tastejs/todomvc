const console  = require('console');
const duet     = require('duet');
const storage  = require('duet-local-storage/channel');
const location = require('duet-location/channel');
const vdom     = require('duet-virtual-dom/channel');
const app      = require('./app');

const options = {
  // forceSingleThread: true,
  logger: console.debug.bind(console)
};

duet([storage, location, vdom], app, options);
