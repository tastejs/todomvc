(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['bacon', 'backbone', 'underscore', 'models/todo', 'localstorage'], function(Bacon, Backbone, _, Todo) {
    var TodoList;
    return TodoList = (function(_super) {

      __extends(TodoList, _super);

      function TodoList() {
        return TodoList.__super__.constructor.apply(this, arguments);
      }

      TodoList.prototype.model = Todo;

      TodoList.prototype.localStorage = new Backbone.LocalStorage('todos-baconjs-backbone');

      TodoList.prototype.toggleAll = function(completed) {
        return this.each(function(todo) {
          return todo.save({
            completed: completed
          });
        });
      };

      TodoList.prototype.initialize = function() {
        var _this = this;
        this.changed = this.asEventStream("add remove reset change").map(this).toProperty();
        this.someCompleted = this.changed.map(function() {
          return _this.some(function(t) {
            return t.get('completed');
          });
        });
        this.allCompleted = this.changed.map(function() {
          return _this.every(function(t) {
            return t.get('completed');
          });
        });
        this.notEmpty = this.changed.map(function() {
          return _this.length > 0;
        });
        this.all = this.changed.map(function() {
          return _this.models;
        });
        this.active = this.changed.map(function() {
          return _this.reject(function(t) {
            return t.get('completed');
          });
        });
        return this.completed = this.changed.map(function() {
          return _this.filter(function(t) {
            return t.get('completed');
          });
        });
      };

      return TodoList;

    })(Backbone.Collection);
  });

}).call(this);
