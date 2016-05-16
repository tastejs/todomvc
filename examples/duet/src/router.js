const {subscribe} = require('duet/bridges/location');
const wayfarer    = require('wayfarer');

module.exports = (model) => {
  const filter = (value) => {
    model.filter.set(value);
  };

  let router = wayfarer()
  .on('/',          filter.bind(null, 'all'))
  .on('/active',    filter.bind(null, 'active'))
  .on('/completed', filter.bind(null, 'completed'));

  subscribe(router, true);
};
