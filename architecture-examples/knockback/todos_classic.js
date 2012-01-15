/*
  knockback-todos.js
  (c) 2011 Kevin Malakoff.
  Knockback-Todos is freely distributable under the MIT license.
  See the following for full license details:
    https:#github.com/kmalakoff/knockback-todos/blob/master/LICENSE
*/
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
}, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
$(document).ready(function() {
  var CreateTodoViewModel, StatsViewModel, TodoList, TodoListViewModel, TodoViewModel, app_view_model, todos;
  ko.bindingHandlers.dblclick = {
    init: function(element, value_accessor, all_bindings_accessor, view_model) {
      return $(element).dblclick(ko.utils.unwrapObservable(value_accessor()));
    }
  };
  TodoList = (function() {
    __extends(TodoList, Backbone.Collection);
    function TodoList() {
      TodoList.__super__.constructor.apply(this, arguments);
    }
    TodoList.prototype.localStorage = new Store("kb_todos");
    TodoList.prototype.doneCount = function() {
      return this.models.reduce((function(prev, cur) {
        return prev + (!!cur.get('done') ? 1 : 0);
      }), 0);
    };
    TodoList.prototype.remainingCount = function() {
      return this.models.length - this.doneCount();
    };
    TodoList.prototype.allDone = function() {
      return this.filter(function(todo) {
        return !!todo.get('done');
      });
    };
    return TodoList;
  })();
  todos = new TodoList();
  todos.fetch();
  CreateTodoViewModel = function() {
    this.input_text = ko.observable('');
    this.addTodo = function(view_model, event) {
      var text;
      text = this.create.input_text();
      if (!text || event.keyCode !== 13) {
        return true;
      }
      todos.create({
        text: text
      });
      return this.create.input_text('');
    };
    return this;
  };
  TodoViewModel = function(model) {
    this.text = kb.observable(model, {
      key: 'text',
      write: (function(text) {
        return model.save({
          text: text
        });
      })
    }, this);
    this.edit_mode = ko.observable(false);
    this.toggleEditMode = __bind(function(event) {
      if (!this.done()) {
        return this.edit_mode(!this.edit_mode());
      }
    }, this);
    this.onEnterEndEdit = __bind(function(event) {
      if (event.keyCode === 13) {
        return this.edit_mode(false);
      }
    }, this);
    this.done = kb.observable(model, {
      key: 'done',
      write: (function(done) {
        return model.save({
          done: done
        });
      })
    }, this);
    this.destroyTodo = __bind(function() {
      return model.destroy();
    }, this);
    return this;
  };
  TodoListViewModel = function(todos) {
    this.todos = ko.observableArray([]);
    this.collection_observable = kb.collectionObservable(todos, this.todos, {
      view_model: TodoViewModel
    });
    return this;
  };
  StatsViewModel = function(todos) {
    this.collection_observable = kb.collectionObservable(todos);
    this.remaining_text = ko.dependentObservable(__bind(function() {
      var count;
      count = this.collection_observable.collection().remainingCount();
      if (!count) {
        return '';
      }
      return "" + count + " " + (count === 1 ? 'item' : 'items') + " remaining.";
    }, this));
    this.clear_text = ko.dependentObservable(__bind(function() {
      var count;
      count = this.collection_observable.collection().doneCount();
      if (!count) {
        return '';
      }
      return "Clear " + count + " completed " + (count === 1 ? 'item' : 'items') + ".";
    }, this));
    this.onDestroyDone = __bind(function() {
      var model, _i, _len, _ref, _results;
      _ref = todos.allDone();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        model = _ref[_i];
        _results.push(model.destroy());
      }
      return _results;
    }, this);
    return this;
  };
  app_view_model = {
    create: new CreateTodoViewModel(),
    todo_list: new TodoListViewModel(todos),
    stats: new StatsViewModel(todos)
  };
  return ko.applyBindings(app_view_model, $('#todoapp')[0]);
});