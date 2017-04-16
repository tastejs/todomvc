(function (exports) {

  "use strict";

  var mongoose = require('mongoose')
    , crudUtils = require('../utils/crudUtils')
    , Todo = mongoose.model('Todo');

  function index(req, res) {
    res.render('index', { 'title': 'Backbone.js, Node.js, MongoDB Todos' });
  }

  exports.init = function (app) {
    app.get('/', index);
    crudUtils.initRoutesForModel({ 'app': app, 'model': Todo });
  };

}(exports));


