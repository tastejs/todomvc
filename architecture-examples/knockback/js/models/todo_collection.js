(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  window.TodosCollection = (function() {
    __extends(TodosCollection, Backbone.Collection);
    function TodosCollection() {
      TodosCollection.__super__.constructor.apply(this, arguments);
    }
    TodosCollection.prototype.localStorage = new Store("todos-knockback");
    TodosCollection.prototype.model = Todo;
    TodosCollection.prototype.completedCount = function() {
      return this.models.reduce((function(prev, cur) {
        return prev + (cur.completed() ? 1 : 0);
      }), 0);
    };
    TodosCollection.prototype.remainingCount = function() {
      return this.models.length - this.completedCount();
    };
    TodosCollection.prototype.completeAll = function(completed) {
      return this.each(function(todo) {
        return todo.completed(completed);
      });
    };
    TodosCollection.prototype.destroyCompleted = function() {
      var completed_tasks, model, _i, _len, _results;
      completed_tasks = this.filter(function(todo) {
        return todo.completed();
      });
      _results = [];
      for (_i = 0, _len = completed_tasks.length; _i < _len; _i++) {
        model = completed_tasks[_i];
        _results.push(model.destroy());
      }
      return _results;
    };
    return TodosCollection;
  })();
}).call(this);
