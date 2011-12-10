(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  window.Task = (function() {

    __extends(Task, Spine.Model);

    function Task() {
      Task.__super__.constructor.apply(this, arguments);
    }

    Task.configure('Task', 'name', 'done');

    Task.extend(Spine.Model.Local);

    Task.active = function() {
      return this.select(function(task) {
        return !task.done;
      });
    };

    Task.done = function() {
      return this.select(function(task) {
        return !!task.done;
      });
    };

    Task.destroyDone = function() {
      var task, _i, _len, _ref, _results;
      _ref = this.done();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        task = _ref[_i];
        _results.push(task.destroy());
      }
      return _results;
    };

    return Task;

  })();

}).call(this);
