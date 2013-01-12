(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['backbone', 'bacon', 'underscore'], function(Backbone, Bacon, _) {
    var FooterController;
    return FooterController = (function(_super) {

      __extends(FooterController, _super);

      function FooterController() {
        return FooterController.__super__.constructor.apply(this, arguments);
      }

      FooterController.prototype.initialize = function() {
        var clearCompleted, todoList,
          _this = this;
        todoList = this.collection;
        clearCompleted = this.$('#clear-completed').asEventStream('click');
        clearCompleted.map(todoList.completed).onValue(function(ts) {
          return _.invoke(ts, 'destroy');
        });
        todoList.active.map(function(ts) {
          return ("<strong>" + ts.length + "</strong> ") + (ts.length === 1 ? "item left" : "items left");
        }).onValue(this.$('#todo-count'), 'html');
        todoList.someCompleted.onValue(this.$('#clear-completed'), 'toggle');
        return todoList.completed.onValue(function(completedTodos) {
          return _this.$('#clear-completed').text("Clear completed (" + completedTodos.length + ")");
        });
      };

      return FooterController;

    })(Backbone.View);
  });

}).call(this);
