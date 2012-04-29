/**
 * Very basic CRUD route creation utility for models.
 * For validation, simply override the model's save method.
 */

(function (exports) {

  "use strict";

  //------------------------------
  // List
  //
  function getListController(model) {
    return function (req, res) {
      //console.log('list', req.body);
      model.find({}, function (err, result) {
        if (err) {
          res.send(409, err);
        } else {
          res.send(result);
        }
      });
    };
  }

  //------------------------------
  // Create
  //
  function getCreateController(model) {
    return function (req, res) {
      //console.log('create', req.body);
      var m = new model(req.body);
      m.save(function (err) {
        if (err) {
          res.send(409, err);
        } else {
          res.send(m);
        }
      });
    };
  }

  //------------------------------
  // Read
  //
  function getReadController(model) {
    return function (req, res) {
      //console.log('read', req.body);
      model.findById(req.params.id, function (err, result) {
        if (err) {
          res.send(409, err);
        } else {
          res.send(result);
        }
      });
    };
  }

  //------------------------------
  // Update
  //
  function getUpdateController(model) {
    return function (req, res) {
      //console.log('update', req.body);
      model.findById(req.params.id, function (err, result) {
        var key;
        for (key in req.body) {
          result[key] = req.body[key];
        }
        result.save(function (err) {
          if (err) {
            res.send(409, err);
          } else {
            res.send(result);
          }
        });
      });
    };
  }

  //------------------------------
  // Delete
  //
  function getDeleteController(model) {
    return function (req, res) {
      //console.log('delete', req.body);
      model.findById(req.params.id, function (err, result) {
        if (err) {
          res.send(409, err);
        } else {
          result.remove();
          result.save(function (err) {
            if (err) {
              res.send(409, err);
            } else {
              res.send({});
            }
          });
        }
      });
    };
  }

  exports.initRoutesForModel = function (options) {
    var app = options.app
      , model = options.model
      , path
      , pathWithId;

    if (!app || !model) {
      return;
    }

    path = options.path || '/' + model.modelName.toLowerCase();
    pathWithId = path + '/:id';

    app.get(path, getListController(model));
    app.post(path, getCreateController(model));
    app.get(pathWithId, getReadController(model));
    app.put(pathWithId, getUpdateController(model));
    app.del(pathWithId, getDeleteController(model));
  };

}(exports));
