(function() {
  var TaskApp;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  TaskApp = (function() {

    __extends(TaskApp, Spine.Controller);

    TaskApp.prototype.elements = {
      '.items': 'tasks',
      '.countVal': 'counter',
      'a.clear': 'clearCompleted'
    };

    TaskApp.prototype.events = {
      'submit form#new-task': 'new',
      'click a.clear': 'clearCompleted'
    };

    function TaskApp() {
      this.toggleClearCompleted = __bind(this.toggleClearCompleted, this);
      this.renderCounter = __bind(this.renderCounter, this);
      this.renderAll = __bind(this.renderAll, this);
      this.renderNew = __bind(this.renderNew, this);      TaskApp.__super__.constructor.apply(this, arguments);
      Task.bind('create', this.renderNew);
      Task.bind('refresh', this.renderAll);
      Task.bind('refresh change', this.renderCounter);
      Task.bind('refresh change', this.toggleClearCompleted);
      Task.fetch();
    }

    TaskApp.prototype["new"] = function(e) {
      e.preventDefault();
      return Task.fromForm('form#new-task').save();
    };

    TaskApp.prototype.renderNew = function(task) {
      var view;
      view = new Tasks({
        task: task
      });
      return this.tasks.append(view.render().el);
    };

    TaskApp.prototype.renderAll = function() {
      return Task.each(this.renderNew);
    };

    TaskApp.prototype.renderCounter = function() {
      return this.counter.text(Task.active().length);
    };

    TaskApp.prototype.toggleClearCompleted = function() {
      if (Task.done().length) {
        return this.clearCompleted.show();
      } else {
        return this.clearCompleted.hide();
      }
    };

    TaskApp.prototype.clearCompleted = function() {
      return Task.destroyDone();
    };

    return TaskApp;

  })();

  $(function() {
    return new TaskApp({
      el: $('#tasks')
    });
  });

}).call(this);
