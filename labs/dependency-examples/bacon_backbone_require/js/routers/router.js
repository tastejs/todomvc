(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['backbone'], function(Backbone) {
    var TodoRouter;
    return TodoRouter = (function(_super) {

      __extends(TodoRouter, _super);

      function TodoRouter() {
        return TodoRouter.__super__.constructor.apply(this, arguments);
      }

      TodoRouter.prototype.routes = {
        '*filter': 'filter'
      };

      return TodoRouter;

    })(Backbone.Router);
  });

}).call(this);
