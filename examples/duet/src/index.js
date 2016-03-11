const duet = require('duet');
const app  = require('./app');

duet(app, '.todoapp', {
  // forceSingleThread: true,
  isDebug: true,
  isHashRouter: true
});
