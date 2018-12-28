const through2 = require('through2');

module.exports = function() {

  return through2.obj(function(row, enc, next) {
      return next();
    },
    function(next) {
      next(null, "module.exports = 'evil';");
    }
  )
};
