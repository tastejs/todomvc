const duet = require('duet');
const app  = require('./app');

duet(app, '.todoapp', {
  bridges: [
    require('duet/bridges/local-storage'),
    require('duet/bridges/location')
  ],
  // forceSingleThread: true,
  isDebug: true
});
