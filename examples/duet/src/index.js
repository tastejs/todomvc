const duet = require('duet');
const app  = require('./app');

duet(app, '.todoapp', {
  bridges: [
    require('duet/bridges/local-storage')
  ],
  // forceSingleThread: true,
  isDebug: true,
  isHashRouter: true
});
