(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['backbone'], function(Backbone) {
    var Todo;
    return Todo = (function(_super) {

      __extends(Todo, _super);

      function Todo() {
        return Todo.__super__.constructor.apply(this, arguments);
      }

      Todo.prototype.defaults = {
        completed: false
      };

      return Todo;

    })(Backbone.Model);
  });

}).call(this);
