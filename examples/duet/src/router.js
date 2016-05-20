const {subscribe} = require('duet/bridges/location');
const wayfarer    = require('wayfarer');

module.exports = (send) => {
  const router = wayfarer()
  .on('/',          send.event('filter', {filter: 'all'}))
  .on('/active',    send.event('filter', {filter: 'active'}))
  .on('/completed', send.event('filter', {filter: 'completed'}));

  subscribe(router, true);
};
