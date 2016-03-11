const {router}  = require('duet');

module.exports = (model) => {

  const filter = (value) => {
    model.filter.set(value);
  };

  return router()
  .on('/',          filter.bind(null, 'all'))
  .on('/active',    filter.bind(null, 'active'))
  .on('/completed', filter.bind(null, 'completed'));
};
